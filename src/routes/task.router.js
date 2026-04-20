import { Router } from "express";
import taskController from "../controllers/task.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import verifyMemberWorkspaceMiddleware, { verifyMemberWorkspaceRoleMiddleware } from "../middlewares/workspaceMiddleware.js";

const taskRouter = Router({ mergeParams: true });

taskRouter.post(
    '/',
    authMiddleware,
    verifyMemberWorkspaceRoleMiddleware(['owner', 'admin']),
    taskController.createTask
);

taskRouter.get(
    '/',
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    taskController.getTasks
);

taskRouter.put(
    '/:task_id',
    authMiddleware,
    verifyMemberWorkspaceRoleMiddleware(['owner', 'admin']),
    taskController.updateTask
);

taskRouter.delete(
    '/:task_id',
    authMiddleware,
    verifyMemberWorkspaceRoleMiddleware(['owner', 'admin']),
    taskController.deleteTask
);

export default taskRouter;
