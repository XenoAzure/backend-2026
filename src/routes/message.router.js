import { Router } from 'express';
import messageController from '../controllers/message.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import verifyMemberWorkspaceMiddleware, { verifyChannelMiddleware } from '../middlewares/workspaceMiddleware.js';

const messageRouter = Router({ mergeParams: true });

messageRouter.post(
    '/',
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    verifyChannelMiddleware,
    messageController.createMessage
);

messageRouter.get(
    '/',
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    verifyChannelMiddleware,
    messageController.getMessages
);

export default messageRouter;
