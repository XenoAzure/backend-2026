import { Router } from 'express';
import channelController from '../controllers/channel.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import verifyMemberWorkspaceMiddleware, { verifyChannelMiddleware } from '../middlewares/workspaceMiddleware.js';
import messageRouter from './message.router.js';

const channelRouter = Router({ mergeParams: true });

channelRouter.use('/:channel_id/message', messageRouter);

channelRouter.post(
    '/',
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    channelController.createChannel
);

channelRouter.get(
    '/',
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    channelController.getChannels
);

channelRouter.delete(
    '/:channel_id',
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    verifyChannelMiddleware,
    channelController.deleteChannel
);

export default channelRouter;
