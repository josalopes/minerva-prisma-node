import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/auth/auth'
import { OrganizationProvider } from '@/contexts/organization-context';
import { getOrganizationBySlug } from '@/http/get-organization-by-slug';

interface AppLayoutProps {
  children: React.ReactNode
  sheet: React.ReactNode
}

export default async function AppLayout({
  children,
  sheet
}: AppLayoutProps) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in');
  }

  return (
    <>
          {children}
          {sheet}
    </>
  )
}
