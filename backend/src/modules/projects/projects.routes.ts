import { Router } from 'express';
import * as projectsController from './projects.controller.js';
import { validateBody, validateParams, uuidParamSchema } from '../../middlewares/validate.js';
import { authMiddleware, requireActiveUser } from '../../middlewares/auth.js';
import { requireCompanyAdmin, requireCompanyMember } from '../../middlewares/rbac.js';
import { createProjectSchema, updateProjectSchema } from './projects.validators.js';

const router = Router();

router.get('/', projectsController.listProjects);

router.get('/:id', validateParams(uuidParamSchema), projectsController.getProject);

router.use(authMiddleware);
router.use(requireActiveUser);

router.post('/', requireCompanyAdmin, validateBody(createProjectSchema), projectsController.createProject);

router.patch(
    '/:id',
    requireCompanyAdmin,
    validateParams(uuidParamSchema),
    validateBody(updateProjectSchema),
    projectsController.updateProject
);

router.post('/:id/publish', requireCompanyAdmin, validateParams(uuidParamSchema), projectsController.publishProject);

router.post('/:id/close', requireCompanyAdmin, validateParams(uuidParamSchema), projectsController.closeProject);

router.get('/org/me', requireCompanyMember, projectsController.listOrgProjects);

export default router;
