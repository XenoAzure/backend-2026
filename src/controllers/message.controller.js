import messageRepository from "../repository/message.repository.js";

class MessageController {
    async createMessage(request, response) {
        try {
            const { channel_id } = request.params;
            const { content, attachment } = request.body;
            const member = request.workspaceMembership;

            if (!content && !attachment) {
                return response.status(400).json({
                    ok: false,
                    status: 400,
                    message: "El mensaje debe tener contenido o un archivo adjunto"
                });
            }

            const message = await messageRepository.create(channel_id, member._id, content || "", attachment || null);

            return response.status(201).json({
                ok: true,
                status: 201,
                message: "Mensaje enviado exitosamente",
                data: { message }
            });
        } catch (error) {
            console.error("Error en createMessage", error);
            return response.status(500).json({
                ok: false,
                status: 500,
                message: "Error interno del servidor"
            });
        }
    }

    async getMessages(request, response) {
        try {
            const { channel_id } = request.params;

            const messages = await messageRepository.getMessagesByChannelId(channel_id);

            const mappedMessages = messages.map(msg => ({
                message_id: msg._id,
                content: msg.content,
                attachment: msg.attachment || null,
                created_at: msg.created_at,
                member: {
                    member_id: msg.fk_id_member._id,
                    user_id: msg.fk_id_member.fk_id_user._id,
                    role: msg.fk_id_member.role,
                    user_name: msg.fk_id_member.fk_id_user.name,
                    user_email: msg.fk_id_member.fk_id_user.email,
                    user_profile_picture: msg.fk_id_member.fk_id_user.profile_picture || null
                }
            }));

            return response.status(200).json({
                ok: true,
                status: 200,
                message: "Mensajes obtenidos exitosamente",
                data: { messages: mappedMessages }
            });
        } catch (error) {
            console.error("Error en getMessages", error);
            return response.status(500).json({
                ok: false,
                status: 500,
                message: "Error interno del servidor"
            });
        }
    }
}

const messageController = new MessageController();
export default messageController;
