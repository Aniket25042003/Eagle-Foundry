import { z } from 'zod';
import { customQuestionSchema } from '../startups/startups.validators.js';

export const createProjectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(5000).optional().nullable(),
    requirements: z.string().max(2000).optional().nullable(),
    budgetType: z.enum(['paid', 'unpaid', 'equity']).optional().nullable(),
    budgetRange: z.string().max(100).optional().nullable(),
    estimatedDuration: z.string().max(120).optional().nullable(),
    deadline: z.string().datetime().optional().nullable(),
    tags: z.array(z.string().max(50)).max(10).optional(),
    customQuestions: z.array(customQuestionSchema).max(20).optional().nullable(),
});

export const updateProjectSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional().nullable(),
    requirements: z.string().max(2000).optional().nullable(),
    budgetType: z.enum(['paid', 'unpaid', 'equity']).optional().nullable(),
    budgetRange: z.string().max(100).optional().nullable(),
    estimatedDuration: z.string().max(120).optional().nullable(),
    deadline: z.string().datetime().optional().nullable(),
    tags: z.array(z.string().max(50)).max(10).optional(),
    customQuestions: z.array(customQuestionSchema).max(20).optional().nullable(),
});

export const listProjectsQuerySchema = z.object({
    cursor: z.string().optional(),
    limit: z.string().optional().transform((val) => {
        if (!val) return 20;
        const num = parseInt(val, 10);
        return isNaN(num) ? 20 : Math.min(Math.max(1, num), 100);
    }),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional(),
    budgetType: z.enum(['paid', 'unpaid', 'equity']).optional(),
    tags: z.string().optional().transform((val) => val?.split(',').filter(Boolean)),
    search: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
