import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

interface AppLayoutProps {
  children: ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
  if (!(await isAuthenticated())) {
    redirect('/auth/sign-in')
  }

  return children
}
