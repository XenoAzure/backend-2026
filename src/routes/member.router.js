import { Router } from 'express';
import memberController from '../controllers/member.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import verifyMemberWorkspaceMiddleware, { verifyMemberWorkspaceRoleMiddleware } from '../middlewares/workspaceMiddleware.js';

const memberRouter = Router({ mergeParams: true });

// Invitar miembro (solo admins o owners)
memberRouter.post(
    '/invite',
    authMiddleware,
    verifyMemberWorkspaceRoleMiddleware(['owner', 'admin']),
    memberController.inviteMember
);

// Aceptar invitación vía email (GET request sin auth header necesario)
memberRouter.get(
    '/handle-invitation',
    memberController.handleInvitation
);

// Obtener lista de miembros
memberRouter.get(
    '/',
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    memberController.getMembersList
);

// Eliminar miembro (requiere verificación extra en controller para ver si es uno mismo o admin/owner)
memberRouter.delete(
    '/:member_id',
    authMiddleware,
    verifyMemberWorkspaceMiddleware,
    memberController.deleteMember
);

// Actualizar rol de miembro (solo admin o owner)
memberRouter.put(
    '/:member_id',
    authMiddleware,
    verifyMemberWorkspaceRoleMiddleware(['admin', 'owner']),
    memberController.updateMemberRole
);

export default memberRouter;
