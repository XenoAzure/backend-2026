import channelRepository from "../repository/channel.repository.js";
import ServerError from "../helpers/error.helper.js";

class ChannelController {
    async createChannel(request, response, next) {
        try {
            const { workspace_id } = request.params;
            const { title, description } = request.body;

            if (!title) {
                return response.status(400).json({
                    ok: false,
                    status: 400,
                    message: "El título del canal es obligatorio"
                });
            }

            const channel = await channelRepository.create(workspace_id, title, description);

            return response.status(201).json({
                ok: true,
                status: 201,
                message: "Canal creado exitosamente",
                data: {
                    channel
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getChannels(request, response, next) {
        try {
            const { workspace_id } = request.params;
            
            const channels = await channelRepository.getChannelsByWorkspaceId(workspace_id);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: "Canales obtenidos exitosamente",
                data: {
                    channels
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteChannel(request, response, next) {
        try {
            const { channel_id } = request.params;

            await channelRepository.deleteById(channel_id);

            return response.status(200).json({
                ok: true,
                status: 200,
                message: "Canal eliminado exitosamente"
            });
        } catch (error) {
            next(error);
        }
    }
}

const channelController = new ChannelController();
export default channelController;
