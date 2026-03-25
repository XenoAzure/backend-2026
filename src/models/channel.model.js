/* 
Channel
-fk_id_workspace
-name
-descripcion
-created_at

*/

import mongoose from "mongoose";
const channelSchema = new mongoose.Schema(
    {
        fk_id_workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        created_at: {
            type: Date,
            required: true,
            default: Date.now,
        },
    }
)
const Channel = mongoose.model("Channel", channelSchema)
export default Channel