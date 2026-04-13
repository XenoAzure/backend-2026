import Channel from "../models/channel.model.js"

class ChannelRepository {
    async create(fk_id_workspace, title, description) {
        return await Channel.create({ fk_id_workspace, title, description })
    }
    
    async getChannelsByWorkspaceId(fk_id_workspace) {
        return await Channel.find({ fk_id_workspace })
    }
    
    async getChannelByIdAndWorkspaceId(channel_id, fk_id_workspace) {
        return await Channel.findOne({ _id: channel_id, fk_id_workspace })
    }

    async getChannelById(channel_id) {
        return await Channel.findById(channel_id)
    }

    async deleteById(channel_id) {
        return await Channel.findByIdAndDelete(channel_id)
    }
}

const channelRepository = new ChannelRepository()
export default channelRepository
