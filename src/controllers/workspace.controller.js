import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import workspaceRepository from "../repository/workspace.repository.js"
import channelRepository from "../repository/channel.repository.js"

class WorkspaceController {
    async getWorkspaces(request, response, next) {
        try {
            //Cliente consultante
            const user = request.user

            //Traer la lista de espacios de trabajo asociados al usuario
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user.id)
            response.json(
                {
                    ok: true, 
                    status: 200,
                    message: 'Espacios de trabajo obtenidos',
                    data: {
                        workspaces
                    }
                }
            )
        } catch (error) {
            next(error);
        }
    }

    async createWorkspace(request, response, next) {
        try {
            const user = request.user;
            const { title, description } = request.body;

            if (!title) {
                return response.status(400).json({
                    ok: false,
                    status: 400,
                    message: "El título es obligatorio"
                });
            }

            const workspace = await workspaceRepository.create(title, description, null, true);
            await workspaceMemberRepository.create(workspace._id, user.id, 'owner');
            // Auto-create the default group chat channel
            await channelRepository.create(workspace._id, 'general', 'Workspace group chat');

            return response.status(200).json({
                ok: true,
                message: "Espacio de trabajo creado exitosamente",
                status: 200
            });
        } catch (error) {
            next(error);
        }
    }

    async getWorkspaceById(request, response, next) {
        try {
            const { workspace_id } = request.params;

            const workspace = await workspaceRepository.getById(workspace_id);
            if (!workspace) {
                return response.status(404).json({
                    ok: false,
                    status: 404,
                    message: "Espacio de trabajo no encontrado"
                });
            }

            const members = await workspaceMemberRepository.getMemberList(workspace_id);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: "Datos del espacio de trabajo obtenidos",
                data: {
                    workspace: {
                        _id: workspace._id,
                        title: workspace.title,
                        description: workspace.description,
                        url_image: workspace.url_image
                    },
                    members
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteWorkspace(request, response, next) {
        try {
            const { workspace_id } = request.params;
            
            await workspaceRepository.deleteById(workspace_id);
            
            return response.status(200).json({
                ok: true,
                status: 200,
                message: "Espacio de trabajo eliminado exitosamente"
            });
        } catch (error) {
            next(error);
        }
    }
    async updateWorkspace(request, response, next) {
        try {
            const { workspace_id } = request.params;
            const { title, description } = request.body;

            if (!title) {
                return response.status(400).json({
                    ok: false,
                    status: 400,
                    message: "El título es obligatorio"
                });
            }

            const updatedWorkspace = await workspaceRepository.updateById(workspace_id, { title, description });

            return response.status(200).json({
                ok: true,
                status: 200,
                message: "Espacio de trabajo actualizado exitosamente",
                data: {
                    workspace: updatedWorkspace
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

const workspaceController = new WorkspaceController()

export default workspaceController