import express from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/me', authMiddleware, userController.getMe);
userRouter.patch('/me', authMiddleware, userController.updateMe);
userRouter.post('/friends', authMiddleware, userController.addFriend);
userRouter.delete('/friends/:friend_id', authMiddleware, userController.removeFriend);
userRouter.patch('/friends/:friend_id/mute', authMiddleware, userController.toggleMuteFriend);
userRouter.patch('/workspaces/:workspace_id/mute', authMiddleware, userController.toggleMuteWorkspace);
userRouter.post('/friends/requests/:request_id/accept', authMiddleware, userController.acceptFriendRequest);
userRouter.post('/friends/requests/:request_id/decline', authMiddleware, userController.declineFriendRequest);
userRouter.post('/friends/requests/:request_id/block', authMiddleware, userController.blockUser);

export default userRouter;
