import 'fastify'

import { Member, Organization } from '@prisma/client'
declare module 'fastify' {
    export interface FastifyRequest {
        organizationId: string;
        organizationRole: string;
        getCurrentUserid(): Promise<string>
        getUserMembership(slug: string): Promise<{ organization: Organization; membership: Member}>
    }
}