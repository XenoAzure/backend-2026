/* 
GET /api/workspace 
Trae todos los espacios de trabajo asociado al usuario
Para saber que espacios de trabajo traer NECESITAMOS EL ID DEL USUARIO
*/

import {Router} from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import verifyMemberWorkspaceMiddleware, { verifyMemberWorkspaceRoleMiddleware } from '../middlewares/workspaceMiddleware.js'

import channelRouter from './channel.router.js';
import memberRouter from './member.router.js';
import taskRouter from './task.router.js';

const workspaceRouter = Router()

workspaceRouter.use('/:workspace_id/channel', channelRouter);
workspaceRouter.use('/:workspace_id/member', memberRouter);
workspaceRouter.use('/:workspace_id/task', taskRouter);

workspaceRouter.get(
    '/',
    authMiddleware,
    workspaceController.getWorkspaces
)

workspaceRouter.post(
    '/',
    authMiddleware,
    workspaceController.createWorkspace
)

workspaceRouter.get(
    '/:workspace_id',
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    workspaceController.getWorkspaceById
)

workspaceRouter.delete(
    '/:workspace_id',
    authMiddleware,
    verifyMemberWorkspaceRoleMiddleware(["owner", "admin"]),
    workspaceController.deleteWorkspace
)

workspaceRouter.put(
    '/:workspace_id',
    authMiddleware,
    verifyMemberWorkspaceRoleMiddleware(["owner", "admin"]),
    workspaceController.updateWorkspace
)

export default workspaceRouter