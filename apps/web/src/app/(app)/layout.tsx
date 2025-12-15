

import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/auth/auth'
import { SidebarDashboard } from '../(panel)/dashboard/_components/sidebar';

export default async function AppLayout({
  children,
  sheet
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in');
  }

  return (
    <>
      <SidebarDashboard>
        {children}
        {sheet}
      </SidebarDashboard>
    </>
      // <>{children}{sheet}</>
    )
}
