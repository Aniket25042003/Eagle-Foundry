import { NextFunction, Request, Response } from 'express';
import * as projectSubmissionsService from './projectSubmissions.service.js';
import { AppError } from '../../middlewares/errorHandler.js';
import { ErrorCode, created, paginated, success } from '../../utils/response.js';
import { parseLimit } from '../../utils/pagination.js';
import {
    CreateProjectSubmissionInput,
    UpdateProjectSubmissionStatusInput,
} from './projectSubmissions.validators.js';

export async function createProjectSubmission(
    req: Request<{ id: string }, unknown, CreateProjectSubmissionInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const submission = await projectSubmissionsService.createProjectSubmission(
            req.user!.userId,
            req.params.id,
            req.body
        );
        created(res, submission);
    } catch (error) {
        next(error);
    }
}

export async function getMyProjectSubmissions(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const query = {
            cursor: req.query.cursor as string | undefined,
            limit: parseLimit(req.query.limit),
            status: req.query.status as
                | 'SUBMITTED'
                | 'SHORTLISTED'
                | 'INTERVIEW'
                | 'SELECTED'
                | 'REJECTED'
                | 'WITHDRAWN'
                | undefined,
        };

        const result = await projectSubmissionsService.getMyProjectSubmissions(req.user!.userId, query);
        paginated(res, result.items, {
            nextCursor: result.nextCursor,
            hasMore: result.hasMore,
        });
    } catch (error) {
        next(error);
    }
}

export async function withdrawProjectSubmission(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await projectSubmissionsService.withdrawProjectSubmission(req.user!.userId, req.params.id);
        success(res, { message: 'Project submission withdrawn' });
    } catch (error) {
        next(error);
    }
}

export async function getProjectSubmissions(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user?.orgId) {
            throw new AppError(ErrorCode.FORBIDDEN, 'Not part of an organization', 403);
        }

        const query = {
            cursor: req.query.cursor as string | undefined,
            limit: parseLimit(req.query.limit),
            status: req.query.status as
                | 'SUBMITTED'
                | 'SHORTLISTED'
                | 'INTERVIEW'
                | 'SELECTED'
                | 'REJECTED'
                | 'WITHDRAWN'
                | undefined,
        };

        const result = await projectSubmissionsService.getProjectSubmissions(req.user.orgId, req.params.id, query);
        paginated(res, result.items, {
            nextCursor: result.nextCursor,
            hasMore: result.hasMore,
        });
    } catch (error) {
        next(error);
    }
}

export async function getProjectSubmission(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user?.orgId) {
            throw new AppError(ErrorCode.FORBIDDEN, 'Not part of an organization', 403);
        }

        const submission = await projectSubmissionsService.getProjectSubmissionById(req.user.orgId, req.params.id);
        success(res, submission);
    } catch (error) {
        next(error);
    }
}

export async function updateProjectSubmissionStatus(
    req: Request<{ id: string }, unknown, UpdateProjectSubmissionStatusInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user?.orgId) {
            throw new AppError(ErrorCode.FORBIDDEN, 'Not part of an organization', 403);
        }

        const submission = await projectSubmissionsService.updateProjectSubmissionStatus(
            req.user.userId,
            req.user.orgId,
            req.params.id,
            req.body
        );
        success(res, submission);
    } catch (error) {
        next(error);
    }
}
