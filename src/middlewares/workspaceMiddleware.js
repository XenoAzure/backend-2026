import workspaceMemberRepository from "../repository/member.repository.js";

const verifyMemberWorkspaceMiddleware = async (request, response, next) => {
    try {
        const { workspace_id } = request.params;
        const user_id = request.user.id;

        const member = await workspaceMemberRepository.getMemberByWorkspaceAndUserId(workspace_id, user_id);

        if (!member) {
            return response.status(403).json({
                ok: false,
                status: 403,
                message: "Acceso denegado. No eres miembro de este espacio de trabajo."
            });
        }

        request.workspaceMembership = member;
        next();
    } catch (error) {
        next(error);
    }
};

export const verifyMemberWorkspaceRoleMiddleware = (roles_allowed) => {
    return async (request, response, next) => {
        try {
            const { workspace_id } = request.params;
            const user_id = request.user.id;

            let member = request.workspaceMembership;

            if (!member) {
                member = await workspaceMemberRepository.getMemberByWorkspaceAndUserId(workspace_id, user_id);
                if (!member) {
                    return response.status(403).json({
                        ok: false,
                        status: 403,
                        message: "Acceso denegado. No eres miembro de este espacio de trabajo."
                    });
                }
                request.workspaceMembership = member;
            }

            const rolesAllowedLower = roles_allowed.map(role => role.toLowerCase());
            
            if (!rolesAllowedLower.includes(member.role.toLowerCase())) {
                return response.status(403).json({
                    ok: false,
                    status: 403,
                    message: "Acceso denegado. No tienes los permisos necesarios."
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

import channelRepository from "../repository/channel.repository.js";

export const verifyChannelMiddleware = async (request, response, next) => {
    try {
        const { workspace_id, channel_id } = request.params;
        
        const channel = await channelRepository.getChannelByIdAndWorkspaceId(channel_id, workspace_id);
        
        if (!channel) {
            return response.status(404).json({
                ok: false,
                status: 404,
                message: "Canal no encontrado en este espacio de trabajo"
            });
        }
        
        request.channel = channel;
        next();
    } catch (error) {
        next(error);
    }
};

export default verifyMemberWorkspaceMiddleware;
