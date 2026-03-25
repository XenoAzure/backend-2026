/* 
ChannelMessages
-fk_id_channel
-content
-fk_id_member
-created_at

*/

import mongoose from "mongoose";

const channelMessagesSchema = new mongoose.Schema({
    fk_id_channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    },
    fk_id_member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkspaceMember",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const ChannelMessages = mongoose.model("ChannelMessage", channelMessagesSchema)

export default ChannelMessages