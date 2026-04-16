import mongoose from "mongoose";

const directMessageSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        created_at: {
            type: Date,
            required: true,
            default: Date.now,
        },
        attachment: {
            filename: String,
            fileType: String,
            data: String, // base64 string
        }
    }
);

const DirectMessage = mongoose.model("DirectMessage", directMessageSchema);
export default DirectMessage;
