import { NextFunction, Request, Response } from 'express';
import * as projectsService from './projects.service.js';
import { AppError } from '../../middlewares/errorHandler.js';
import { ErrorCode, created, paginated, success } from '../../utils/response.js';
import { parseLimit } from '../../utils/pagination.js';
import { CreateProjectInput, UpdateProjectInput } from './projects.validators.js';

export async function createProject(
    req: Request<unknown, unknown, CreateProjectInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user?.orgId) {
            throw new AppError(ErrorCode.FORBIDDEN, 'Not part of an organization', 403);
        }

        const project = await projectsService.createProject(req.user.orgId, req.body);
        created(res, project);
    } catch (error) {
        next(error);
    }
}

export async function listProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const query = {
            cursor: req.query.cursor as string | undefined,
            limit: parseLimit(req.query.limit),
            budgetType: req.query.budgetType as 'paid' | 'unpaid' | 'equity' | undefined,
            tags: req.query.tags
                ? (Array.isArray(req.query.tags) ? (req.query.tags as string[]) : [req.query.tags as string])
                : undefined,
            search: req.query.search as string | undefined,
        };

        const result = await projectsService.listProjects(query);
        paginated(res, result.items, {
            nextCursor: result.nextCursor,
            hasMore: result.hasMore,
        });
    } catch (error) {
        next(error);
    }
}

export async function getProject(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
        const project = await projectsService.getProjectById(req.params.id, req.user?.orgId || undefined);
        success(res, project);
    } catch (error) {
        next(error);
    }
}

export async function updateProject(
    req: Request<{ id: string }, unknown, UpdateProjectInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user?.orgId) {
            throw new AppError(ErrorCode.FORBIDDEN, 'Not part of an organization', 403);
        }

        const project = await projectsService.updateProject(req.params.id, req.user.orgId, req.body);
        success(res, project);
    } catch (error) {
        next(error);
    }
}

export async function publishProject(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user?.orgId) {
            throw new AppError(ErrorCode.FORBIDDEN, 'Not part of an organization', 403);
        }

        const project = await projectsService.publishProject(req.params.id, req.user.orgId);
        success(res, { message: 'Project published', project });
    } catch (error) {
        next(error);
    }
}

export async function closeProject(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user?.orgId) {
            throw new AppError(ErrorCode.FORBIDDEN, 'Not part of an organization', 403);
        }

        const project = await projectsService.closeProject(req.params.id, req.user.orgId);
        success(res, { message: 'Project closed', project });
    } catch (error) {
        next(error);
    }
}

export async function listOrgProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user?.orgId) {
            throw new AppError(ErrorCode.FORBIDDEN, 'Not part of an organization', 403);
        }

        const query = {
            cursor: req.query.cursor as string | undefined,
            limit: parseLimit(req.query.limit),
            status: req.query.status as 'DRAFT' | 'PUBLISHED' | 'CLOSED' | undefined,
        };

        const result = await projectsService.listOrgProjects(req.user.orgId, query);
        paginated(res, result.items, {
            nextCursor: result.nextCursor,
            hasMore: result.hasMore,
        });
    } catch (error) {
        next(error);
    }
}
