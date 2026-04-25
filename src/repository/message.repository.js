import ChannelMessage from "../models/channelMessages.model.js";

class MessageRepository {
    async create(fk_id_channel, fk_id_member, content, attachment = null) {
        return await ChannelMessage.create({
            fk_id_channel,
            fk_id_member,
            content,
            attachment
        });
    }

    async getMessagesByChannelId(fk_id_channel) {
        return await ChannelMessage.find({ fk_id_channel })
            .populate({
                path: 'fk_id_member',
                populate: {
                    path: 'fk_id_user',
                    select: 'name email profile_picture'
                }
            })
            .sort({ created_at: 1 });
    }
}

const messageRepository = new MessageRepository();
export default messageRepository;
