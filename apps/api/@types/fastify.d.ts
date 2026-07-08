import 'fastify'

export interface MembershipContext {
  organization: Organization
  membership: Member
}

import { Member, Organization, Role } from '@prisma/client'
declare module 'fastify' {
  export interface FastifyRequest {
    organizationId: string;
    organizationRole: Role;
    currentUserId: string | null;
    getCurrentUserId(): Promise<string>
    getMembership(
      slug: string)
      : Promise<MembershipContext>
  }
}