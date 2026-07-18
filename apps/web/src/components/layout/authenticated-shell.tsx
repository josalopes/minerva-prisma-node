import { ReactNode } from 'react'
import Header from '../header'

interface AuthenticatedShellProps {
  children: ReactNode
}

export default function AuthenticatedShell({
  children,
}: AuthenticatedShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  )
}
