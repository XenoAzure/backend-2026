import ChannelMessage from "../models/channelMessages.model.js";

class MessageRepository {
    async create(fk_id_channel, fk_id_member, content) {
        return await ChannelMessage.create({
            fk_id_channel,
            fk_id_member,
            content
        });
    }

    async getMessagesByChannelId(fk_id_channel) {
        return await ChannelMessage.find({ fk_id_channel })
            .populate({
                path: 'fk_id_member',
                populate: {
                    path: 'fk_id_user',
                    select: 'name email'
                }
            })
            .sort({ created_at: 1 }); // Sort by creation date ascending
    }
}

const messageRepository = new MessageRepository();
export default messageRepository;
