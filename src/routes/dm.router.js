import express from 'express';
import dmController from '../controllers/dm.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const dmRouter = express.Router();

dmRouter.get('/:friend_id', authMiddleware, dmController.getMessages);
dmRouter.post('/:friend_id', authMiddleware, dmController.sendMessage);

export default dmRouter;
