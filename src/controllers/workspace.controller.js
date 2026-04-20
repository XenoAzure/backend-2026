import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import workspaceRepository from "../repository/workspace.repository.js"

class WorkspaceController {
    async getWorkspaces(request, response) {
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
        }
        catch (error) {
            //Errores esperables en el sistema
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.error('Error inesperado en el registro', error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal server error"
                    }
                )
            }
        }
    }

    async createWorkspace(request, response) {
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
            await workspaceMemberRepository.create(workspace._id, user.id, 'admin');

            return response.status(200).json({
                ok: true,
                message: "Espacio de trabajo creado exitosamente",
                status: 200
            });
        } catch (error) {
            console.error('Error in createWorkspace', error);
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message
                });
            } else {
                return response.status(500).json({
                    ok: false,
                    status: 500,
                    message: "Internal server error"
                });
            }
        }
    }

    async getWorkspaceById(request, response) {
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
            console.error('Error in getWorkspaceById', error);
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message
                });
            } else {
                return response.status(500).json({
                    ok: false,
                    status: 500,
                    message: "Internal server error"
                });
            }
        }
    }

    async deleteWorkspace(request, response) {
        try {
            const { workspace_id } = request.params;
            
            await workspaceRepository.deleteById(workspace_id);
            
            return response.status(200).json({
                ok: true,
                status: 200,
                message: "Espacio de trabajo eliminado exitosamente"
            });
        } catch (error) {
            console.error('Error in deleteWorkspace', error);
            return response.status(500).json({
                ok: false,
                status: 500,
                message: "Internal server error"
            });
        }
    }
    async updateWorkspace(request, response) {
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
            console.error('Error in updateWorkspace', error);
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message
                });
            } else {
                return response.status(500).json({
                    ok: false,
                    status: 500,
                    message: "Internal server error"
                });
            }
        }
    }
}

const workspaceController = new WorkspaceController()

export default workspaceController