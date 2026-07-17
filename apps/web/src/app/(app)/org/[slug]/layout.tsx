import { ReactNode } from 'react'

import { getOrganizationBySlug } from '@/http/organizations/get-organization-by-slug'

import {
  Organization,
  OrganizationProvider,
} from '@/contexts/organization-context'

import DashboardShell from '@/components/dashboard-shell'

interface OrgLayoutProps {
  children: ReactNode
  params: Promise<{
    slug: string
  }>
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  const { slug } = await params

  const response = await getOrganizationBySlug(slug)

  const organization: Organization = {
    id: response.id,
    name: response.name,
    slug: response.slug,
    avatarUrl: response.avatarUrl,
    logoUrl: response.logoUrl,
  }

  return (
    <OrganizationProvider organization={organization}>
      <DashboardShell>{children}</DashboardShell>
    </OrganizationProvider>
  )
}
