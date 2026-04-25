import DirectMessage from "../models/directMessage.model.js";
import ServerError from "../helpers/error.helper.js";

class DMController {
    async getMessages(req, res, next) {
        try {
            const user_id = req.user.id;
            const { friend_id } = req.params;

            const messages = await DirectMessage.find({
                $or: [
                    { from: user_id, to: friend_id },
                    { from: friend_id, to: user_id }
                ]
            })
            .sort({ created_at: 1 })
            .limit(100);

            return res.status(200).json({ ok: true, status: 200, data: { messages } });
        } catch (error) {
            next(error);
        }
    }

    async sendMessage(req, res, next) {
        try {
            const user_id = req.user.id;
            const { friend_id } = req.params;
            const { content, attachment } = req.body;

            if ((!content || !content.trim()) && !attachment) {
                throw new ServerError("Message content or attachment is required", 400);
            }

            const newMessage = new DirectMessage({
                from: user_id,
                to: friend_id,
                content: content ? content.trim() : "",
                attachment: attachment || null
            });

            await newMessage.save();

            return res.status(201).json({
                ok: true,
                status: 201,
                data: { message: newMessage }
            });
        } catch (error) {
            next(error);
        }
    }
}

const dmController = new DMController();
export default dmController;
