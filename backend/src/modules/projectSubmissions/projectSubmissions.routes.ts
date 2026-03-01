import { Router } from 'express';
import * as projectSubmissionsController from './projectSubmissions.controller.js';
import { authMiddleware, requireActiveUser } from '../../middlewares/auth.js';
import { requireCompanyAdmin, requireCompanyMember, requireStudent } from '../../middlewares/rbac.js';
import { validateBody, validateParams, uuidParamSchema } from '../../middlewares/validate.js';
import { updateProjectSubmissionStatusSchema } from './projectSubmissions.validators.js';

const router = Router();

router.use(authMiddleware);
router.use(requireActiveUser);

router.get('/me', requireStudent, projectSubmissionsController.getMyProjectSubmissions);

router.post(
    '/:id/withdraw',
    requireStudent,
    validateParams(uuidParamSchema),
    projectSubmissionsController.withdrawProjectSubmission
);

router.get(
    '/:id',
    requireCompanyMember,
    validateParams(uuidParamSchema),
    projectSubmissionsController.getProjectSubmission
);

router.patch(
    '/:id/status',
    requireCompanyAdmin,
    validateParams(uuidParamSchema),
    validateBody(updateProjectSubmissionStatusSchema),
    projectSubmissionsController.updateProjectSubmissionStatus
);

export default router;
