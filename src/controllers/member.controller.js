import workspaceMemberRepository from "../repository/member.repository.js";
import userRepository from "../repository/user.repository.js";
import mailerTransporter from "../config/mailer.config.js";
import ENVIRONMENT from "../config/environment.config.js";
import jwt from "jsonwebtoken";

class MemberController {
    async inviteMember(request, response) {
        try {
            const { workspace_id } = request.params;
            const { email_or_id, role = 'user' } = request.body;

            if (!email_or_id) {
                return response.status(400).json({ ok: false, status: 400, message: "Se requiere email o ID público del usuario" });
            }

            // Only allow valid roles (not owner)
            const allowedRoles = ['user', 'admin'];
            if (!allowedRoles.includes(role.toLowerCase())) {
                return response.status(400).json({ ok: false, status: 400, message: "Rol inválido. Solo se permiten: user, admin" });
            }

            // Look up user by email first, then by public_id
            let invitedUser = await userRepository.getByEmail(email_or_id.trim());
            if (!invitedUser) {
                invitedUser = await userRepository.getByPublicId(email_or_id.trim().toUpperCase());
            }

            if (!invitedUser) {
                return response.status(404).json({ ok: false, status: 404, message: "Usuario no encontrado. Verifica el email o el ID público." });
            }

            // Check if already a member
            const existingMember = await workspaceMemberRepository.getMemberByWorkspaceAndUserId(workspace_id, invitedUser._id);
            if (existingMember) {
                return response.status(400).json({ ok: false, status: 400, message: "El usuario ya es miembro o tiene una invitación pendiente en este espacio de trabajo" });
            }

            // Add directly as an active member
            await workspaceMemberRepository.create(workspace_id, invitedUser._id, role.toLowerCase(), 'accepted');

            return response.status(200).json({
                ok: true,
                status: 200,
                message: `${invitedUser.name} ha sido añadido al espacio de trabajo como ${role.toLowerCase()}.`
            });
        } catch (error) {
            console.error("Error en inviteMember", error);
            return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
        }
    }


    async handleInvitation(request, response) {
        try {
            const { token } = request.query;

            if (!token) {
                return response.status(400).json({ ok: false, status: 400, message: "Falta el token de invitación" });
            }

            const payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);
            const { member_id, action } = payload;

            const member = await workspaceMemberRepository.getById(member_id);
            if (!member) {
                return response.status(404).json({ ok: false, status: 404, message: "Miembro no encontrado" });
            }

            // Revisar si el miembro esta en pendiente, si esta en algo DISTINTO A PENDIENTE NO DEJAR QUE LA ACCION CAMBIE AL MIEMBRO
            if (member.status !== 'pending') {
                return response.status(400).json({ ok: false, status: 400, message: "El usuario ya ha tomado una decisión previamente" });
            }

            if (action !== 'accepted' && action !== 'rejected') {
                return response.status(400).json({ ok: false, status: 400, message: "Acción no válida" });
            }

            await workspaceMemberRepository.updateStatusById(member_id, action);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: action === 'accepted' ? "Has aceptado la invitación con éxito" : "Has rechazado la invitación"
            });
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return response.status(401).json({ ok: false, status: 401, message: 'Token invalido o expirado' });
            }
            console.error("Error en handleInvitation", error);
            return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
        }
    }

    async getMembersList(request, response) {
        try {
            const { workspace_id } = request.params;
            const members = await workspaceMemberRepository.getMemberList(workspace_id);
            
            return response.status(200).json({
                ok: true,
                status: 200,
                message: "Miembros obtenidos",
                data: { members }
            });
        } catch (error) {
            console.error("Error en getMembersList", error);
            return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
        }
    }

    async deleteMember(request, response) {
        try {
            const { member_id } = request.params;
            const authenticatedUserMember = request.workspaceMembership;
            
            const memberToDelete = await workspaceMemberRepository.getById(member_id);
            if (!memberToDelete) {
                return response.status(404).json({ ok: false, status: 404, message: "Miembro no encontrado para eliminar" });
            }

            const isSameUser = memberToDelete.fk_id_user.toString() === authenticatedUserMember.fk_id_user.toString();
            const authenticatedRole = authenticatedUserMember.role.toLowerCase();
            const targetRole = memberToDelete.role.toLowerCase();

            // Solo dueños, administradores o el mismo usuario pueden eliminar
            if (authenticatedRole !== 'owner' && authenticatedRole !== 'admin' && !isSameUser) {
                return response.status(403).json({ ok: false, status: 403, message: "No tienes permisos para eliminar a este miembro" });
            }

            // Un administrador NO puede eliminar a un dueño
            if (authenticatedRole === 'admin' && targetRole === 'owner' && !isSameUser) {
                return response.status(403).json({ ok: false, status: 403, message: "Un administrador no puede eliminar a un dueño" });
            }

            await workspaceMemberRepository.deleteById(member_id);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: "Miembro eliminado exitosamente"
            });
        } catch (error) {
            console.error("Error en deleteMember", error);
            return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
        }
    }

    async updateMemberRole(request, response) {
        try {
            const { member_id } = request.params;
            const { role } = request.body;
            const authenticatedUserMember = request.workspaceMembership;

            // NO se puede actualizar a 'owner'
            if (role === 'owner') {
                return response.status(400).json({ ok: false, status: 400, message: "No puedes asignar el rol owner" });
            }

            const memberToUpdate = await workspaceMemberRepository.getById(member_id);
            if (!memberToUpdate) {
                return response.status(404).json({ ok: false, status: 404, message: "Miembro no encontrado" });
            }

            // Solo admins y dueños pueden actualizar el role de otros miembros, excepto el suyo
            if (memberToUpdate.fk_id_user.toString() === authenticatedUserMember.fk_id_user.toString()) {
                return response.status(403).json({ ok: false, status: 403, message: "No puedes cambiar tu propio rol por este medio" });
            }

            const authenticatedRole = authenticatedUserMember.role.toLowerCase();
            const targetRole = memberToUpdate.role.toLowerCase();

            // Admin no puede actualizar a dueño
            if (authenticatedRole === 'admin' && targetRole === 'owner') {
                return response.status(403).json({ ok: false, status: 403, message: "Un administrador no puede actualizar el rol de un dueño" });
            }

            const updatedMember = await workspaceMemberRepository.updateRoleById(member_id, role);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: "Rol de miembro actualizado",
                data: {
                    user_role: updatedMember.role
                }
            });
        } catch (error) {
            console.error("Error en updateMemberRole", error);
            return response.status(500).json({ ok: false, status: 500, message: "Error interno del servidor" });
        }
    }
}

const memberController = new MemberController();
export default memberController;
