import { StartupStatus, OpportunityStatus, OrgStatus, UserStatus, UserRole, ProjectStatus } from '@prisma/client';
import { db } from '../../connectors/db.js';
import { SearchQuery } from './search.validators.js';

interface SearchResult {
    startups: Array<{
        id: string;
        title: string;
        subtitle: string | null;
        type: 'startup';
    }>;
    opportunities: Array<{
        id: string;
        title: string;
        subtitle: string | null;
        type: 'opportunity';
    }>;
    projects: Array<{
        id: string;
        title: string;
        subtitle: string | null;
        type: 'project';
    }>;
    students: Array<{
        id: string;
        title: string;
        subtitle: string | null;
        type: 'student';
    }>;
    orgs: Array<{
        id: string;
        title: string;
        subtitle: string | null;
        type: 'organization';
    }>;
}

/**
 * Unified search across multiple entities
 */
export async function search(userId: string, query: SearchQuery): Promise<SearchResult> {
    const { q, type, limit } = query;
    const searchTerm = q.toLowerCase();

    const result: SearchResult = {
        startups: [],
        opportunities: [],
        projects: [],
        students: [],
        orgs: [],
    };

    const user = await db.user.findUnique({
        where: { id: userId },
        select: { role: true, orgId: true },
    });

    if (!user) {
        return result;
    }

    if (type === 'all' || type === 'startups') {
        const startups = await db.startup.findMany({
            where: {
                status: StartupStatus.APPROVED,
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { tagline: { contains: searchTerm, mode: 'insensitive' } },
                    { tags: { hasSome: [searchTerm] } },
                ],
            },
            take: limit,
            select: {
                id: true,
                name: true,
                tagline: true,
            },
        });

        result.startups = startups.map((s) => ({
            id: s.id,
            title: s.name,
            subtitle: s.tagline,
            type: 'startup' as const,
        }));
    }

    if (type === 'all' || type === 'opportunities') {
        const opportunities = await db.opportunity.findMany({
            where: {
                status: OpportunityStatus.PUBLISHED,
                org: { status: OrgStatus.ACTIVE, verificationStatus: 'APPROVED' },
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    { tags: { hasSome: [searchTerm] } },
                ],
            },
            take: limit,
            select: {
                id: true,
                title: true,
                org: { select: { name: true } },
            },
        });

        result.opportunities = opportunities.map((o) => ({
            id: o.id,
            title: o.title,
            subtitle: o.org.name,
            type: 'opportunity' as const,
        }));
    }

    if (type === 'all' || type === 'projects') {
        const projects = await db.project.findMany({
            where: {
                status: ProjectStatus.PUBLISHED,
                org: { status: OrgStatus.ACTIVE, verificationStatus: 'APPROVED' },
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    { tags: { hasSome: [searchTerm] } },
                ],
            },
            take: limit,
            select: {
                id: true,
                title: true,
                org: { select: { name: true } },
            },
        });

        result.projects = projects.map((p) => ({
            id: p.id,
            title: p.title,
            subtitle: p.org.name,
            type: 'project' as const,
        }));
    }

    if (
        (type === 'all' || type === 'students') &&
        (user.role === UserRole.COMPANY_ADMIN ||
            user.role === UserRole.COMPANY_MEMBER ||
            user.role === UserRole.UNIVERSITY_ADMIN)
    ) {
        const students = await db.studentProfile.findMany({
            where: {
                user: { status: UserStatus.ACTIVE },
                OR: [
                    { firstName: { contains: searchTerm, mode: 'insensitive' } },
                    { lastName: { contains: searchTerm, mode: 'insensitive' } },
                    { major: { contains: searchTerm, mode: 'insensitive' } },
                    { skills: { hasSome: [searchTerm] } },
                ],
            },
            take: limit,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                major: true,
            },
        });

        result.students = students.map((s) => ({
            id: s.id,
            title: `${s.firstName} ${s.lastName}`.trim(),
            subtitle: s.major,
            type: 'student' as const,
        }));
    }

    if (type === 'all' || type === 'orgs') {
        const orgs = await db.org.findMany({
            where: {
                status: OrgStatus.ACTIVE,
                verificationStatus: 'APPROVED',
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            take: limit,
            select: {
                id: true,
                name: true,
                description: true,
            },
        });

        result.orgs = orgs.map((o) => ({
            id: o.id,
            title: o.name,
            subtitle: o.description,
            type: 'organization' as const,
        }));
    }

    return result;
}
