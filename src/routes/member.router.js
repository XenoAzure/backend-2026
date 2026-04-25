import { Router } from 'express';
import memberController from '../controllers/member.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import verifyMemberWorkspaceMiddleware, { verifyMemberWorkspaceRoleMiddleware } from '../middlewares/workspaceMiddleware.js';

const memberRouter = Router({ mergeParams: true });

// Invitar miembro (POST / y /invite aceptados)
memberRouter.post(
    '/',
    authMiddleware,
    verifyMemberWorkspaceRoleMiddleware(['owner', 'admin']),
    memberController.inviteMember
);

memberRouter.post(
    '/invite',
    authMiddleware,
    verifyMemberWorkspaceRoleMiddleware(['owner', 'admin']),
    memberController.inviteMember
);

// Obtener lista de miembros O Aceptar invitación vía email (?token=ey)
memberRouter.get(
    '/',
    (request, response, next) => {
        if (request.query.token) {
            return memberController.handleInvitation(request, response);
        }
        next();
    },
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    memberController.getMembersList
);

// Eliminar miembro
memberRouter.delete(
    '/:member_id',
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    memberController.deleteMember
);

memberRouter.put(
    '/:member_id',
    authMiddleware,
    verifyMemberWorkspaceRoleMiddleware(['owner']),
    memberController.updateMemberRole
);

export default memberRouter;
