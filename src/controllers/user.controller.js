import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import bcrypt from "bcrypt";
import Workspace from "../models/workspace.model.js";
import WorkspaceMember from "../models/workspaceMember.model.js";

class UserController {
    async getMe(req, res, next) {
        try {
            const user_id = req.user.id;
            let user = await userRepository.getById(user_id);

            if (!user) {
                throw new ServerError("Usuario no encontrado", 404);
            }

            // Fallback for existing users without public_id
            if (!user.public_id) {
                user.public_id = Math.random().toString(36).substring(2, 10).toUpperCase();
                await user.save();
            }

            user = await user.populate('friends', 'name email profile_picture public_id bio social_links');
            user = await user.populate('muted_friends', 'name email profile_picture public_id bio social_links');
            user = await user.populate('muted_workspaces', 'workspace_title');
            user = await user.populate('pending_requests', 'name email profile_picture public_id');

            return res.status(200).json({
                ok: true,
                status: 200,
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        profile_picture: user.profile_picture,
                        bio: user.bio,
                        social_links: user.social_links,
                        public_id: user.public_id,
                        friends: user.friends,
                        muted_friends: user.muted_friends,
                        muted_workspaces: user.muted_workspaces,
                        pending_requests: user.pending_requests,
                        created_at: user.created_at
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMe(req, res, next) {
        try {
            const user_id = req.user.id;
            const { name, bio, profile_picture, social_links } = req.body;

            // Basic validation
            if (bio && bio.length > 300) {
                throw new ServerError("La descripción no puede superar los 300 caracteres", 400);
            }

            const updatedFields = {};
            if (name) updatedFields.name = name;
            if (bio !== undefined) updatedFields.bio = bio;
            if (profile_picture !== undefined) updatedFields.profile_picture = profile_picture;
            if (social_links) updatedFields.social_links = social_links;

            const updatedUser = await userRepository.updateById(user_id, updatedFields);

            if (!updatedUser) {
                throw new ServerError("No se pudo actualizar el usuario", 400);
            }

            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Perfil actualizado correctamente",
                data: {
                    user: {
                        id: updatedUser._id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        profile_picture: updatedUser.profile_picture,
                        bio: updatedUser.bio,
                        social_links: updatedUser.social_links,
                        created_at: updatedUser.created_at
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async addFriend(req, res, next) {
        try {
            const user_id = req.user.id;
            const { friend_public_id } = req.body;

            if (!friend_public_id) {
                throw new ServerError("Se requiere el ID del amigo", 400);
            }

            const friend = await userRepository.getByPublicId(friend_public_id.toUpperCase());
            if (!friend) {
                throw new ServerError("Amigo no encontrado", 404);
            }

            if (friend._id.toString() === user_id) {
                throw new ServerError("No puedes agregarte a ti mismo", 400);
            }

            const user = await userRepository.getById(user_id);
            if (user.friends.includes(friend._id)) {
                throw new ServerError("Ya eres amigo de este usuario", 400);
            }
            if (friend.pending_requests.includes(user._id)) {
                throw new ServerError("Ya enviaste una solicitud a este usuario", 400);
            }
            if (friend.blocked_users.includes(user._id)) {
                throw new ServerError("No puedes enviar una solicitud a este usuario", 400);
            }

            friend.pending_requests.push(user._id);
            await friend.save();

            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Solicitud de amistad enviada correctamente",
                data: {
                    friend: {
                        id: friend._id,
                        name: friend.name,
                        public_id: friend.public_id
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async removeFriend(req, res, next) {
        try {
            const user_id = req.user.id;
            const { friend_id } = req.params;

            const user = await userRepository.getById(user_id);
            user.friends = user.friends.filter(id => id.toString() !== friend_id);
            user.muted_friends = user.muted_friends.filter(id => id.toString() !== friend_id);
            await user.save();

            return res.status(200).json({ ok: true, status: 200, message: "Amigo eliminado" });
        } catch (error) {
            return res.status(500).json({ ok: false, status: 500, message: "Internal server error" });
        }
    }

    async toggleMuteFriend(req, res, next) {
        try {
            const user_id = req.user.id;
            const { friend_id } = req.params;

            const user = await userRepository.getById(user_id);
            const isMuted = user.muted_friends.some(id => id.toString() === friend_id);

            if (isMuted) {
                user.muted_friends = user.muted_friends.filter(id => id.toString() !== friend_id);
            } else {
                user.muted_friends.push(friend_id);
            }
            await user.save();

            return res.status(200).json({ ok: true, status: 200, message: isMuted ? "Amigo no muteado" : "Amigo muteado" });
        } catch (error) {
            next(error);
        }
    }

    async toggleMuteWorkspace(req, res, next) {
        try {
            const user_id = req.user.id;
            const { workspace_id } = req.params;

            const user = await userRepository.getById(user_id);
            const isMuted = user.muted_workspaces.some(id => id.toString() === workspace_id);

            if (isMuted) {
                user.muted_workspaces = user.muted_workspaces.filter(id => id.toString() !== workspace_id);
            } else {
                user.muted_workspaces.push(workspace_id);
            }
            await user.save();

            return res.status(200).json({ ok: true, status: 200, message: isMuted ? "Workspace no muteado" : "Workspace muteado" });
        } catch (error) {
            next(error);
        }
    }
    async acceptFriendRequest(req, res, next) {
        try {
            const user_id = req.user.id;
            const { request_id } = req.params;

            const user = await userRepository.getById(user_id);
            const requester = await userRepository.getById(request_id);

            if (!requester) {
                throw new ServerError("Usuario no encontrado", 404);
            }

            user.pending_requests = user.pending_requests.filter(id => id.toString() !== request_id);
            if (!user.friends.includes(request_id)) {
                user.friends.push(request_id);
            }

            if (!requester.friends.includes(user_id)) {
                requester.friends.push(user_id);
                await requester.save();
            }

            await user.save();

            return res.status(200).json({ ok: true, status: 200, message: "Solicitud aceptada" });
        } catch (error) {
            next(error);
        }
    }

    async declineFriendRequest(req, res, next) {
        try {
            const user_id = req.user.id;
            const { request_id } = req.params;

            const user = await userRepository.getById(user_id);
            user.pending_requests = user.pending_requests.filter(id => id.toString() !== request_id);
            await user.save();

            return res.status(200).json({ ok: true, status: 200, message: "Solicitud rechazada" });
        } catch (error) {
            next(error);
        }
    }

    async blockUser(req, res, next) {
        try {
            const user_id = req.user.id;
            const { request_id } = req.params;

            const user = await userRepository.getById(user_id);
            user.pending_requests = user.pending_requests.filter(id => id.toString() !== request_id);

            if (!user.blocked_users.includes(request_id)) {
                user.blocked_users.push(request_id);
            }

            // Remove from friends if they were friends
            user.friends = user.friends.filter(id => id.toString() !== request_id);

            await user.save();

            // Also make sure to remove current user from the blocked user's friends if applicable
            const requester = await userRepository.getById(request_id);
            if (requester) {
                requester.friends = requester.friends.filter(id => id.toString() !== user_id);
                await requester.save();
            }

            return res.status(200).json({ ok: true, status: 200, message: "Usuario bloqueado" });
        } catch (error) {
            next(error);
        }
    }
    async updatePassword(req, res, next) {
        try {
            const user_id = req.user.id;
            const { current_password, new_password } = req.body;

            if (!current_password || !new_password) {
                throw new ServerError("Se requiere la contraseña actual y la nueva", 400);
            }

            if (new_password.length < 6) {
                throw new ServerError("La nueva contraseña debe tener al menos 6 caracteres", 400);
            }

            const user = await userRepository.getById(user_id);
            if (!user) {
                throw new ServerError("Usuario no encontrado", 404);
            }

            const isValid = await bcrypt.compare(current_password, user.password);
            if (!isValid) {
                throw new ServerError("La contraseña actual es incorrecta", 400);
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);
            user.password = hashedPassword;
            await user.save();

            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Contraseña actualizada correctamente"
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteMe(req, res, next) {
        try {
            const user_id = req.user.id;
            const { current_password } = req.body;

            if (!current_password) {
                throw new ServerError("Se requiere la contraseña actual para eliminar la cuenta", 400);
            }

            const user = await userRepository.getById(user_id);
            if (!user) {
                throw new ServerError("Usuario no encontrado", 404);
            }

            const isValid = await bcrypt.compare(current_password, user.password);
            if (!isValid) {
                throw new ServerError("La contraseña es incorrecta", 400);
            }

            // Find workspaces owned by user
            const ownedMemberships = await WorkspaceMember.find({ fk_id_user: user_id, role: 'owner' });
            for (const membership of ownedMemberships) {
                const workspaceId = membership.fk_id_workspace;
                // Delete the workspace
                await Workspace.findByIdAndDelete(workspaceId);
                // Delete all memberships for this workspace
                await WorkspaceMember.deleteMany({ fk_id_workspace: workspaceId });
            }

            // Delete all memberships of the user
            await WorkspaceMember.deleteMany({ fk_id_user: user_id });

            // Finally, delete the user
            await userRepository.daleteById(user_id);

            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Cuenta eliminada correctamente"
            });
        } catch (error) {
            next(error);
        }
    }
}

const userController = new UserController();
export default userController;
