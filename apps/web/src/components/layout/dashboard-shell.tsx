import { ReactNode } from 'react'

import { SidebarDashboardClient } from '../sidebar'
import Header from '../header'

interface DashboardShellProps {
  children: ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <SidebarDashboardClient>
      <Header />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
          {children}
        </div>
      </main>
    </SidebarDashboardClient>
  )
}
