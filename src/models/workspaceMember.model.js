/* 
fk_id_workspace
fk_id_user
role
*/

import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema({
    fk_id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fk_id_workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    role: {
        type: String,
        enum: [
            'owner',
            'admin',
            'user'
        ],
        default: "user"
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const WorkspaceMember = mongoose.model('WorkspaceMember', workspaceMemberSchema)

export default WorkspaceMember