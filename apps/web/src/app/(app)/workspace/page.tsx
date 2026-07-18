import { redirect } from 'next/navigation'

import { getCurrentOrg, isAuthenticated } from '@/auth/auth'
import WorkspaceShell from '@/components/layout/workspace-shell'

export default async function WorkspacePage() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/auth/sign-in')
  }

  const currentOrg = await getCurrentOrg()

  if (currentOrg) {
    redirect(`/org/${currentOrg}/products`)
  }

  return (
    <WorkspaceShell>
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Bem-vindo ao Minerva</h1>

          <p className="text-muted-foreground mt-3">
            Selecione uma organização no canto superior esquerdo para continuar
            ou crie uma nova organização.
          </p>
        </div>
      </div>
    </WorkspaceShell>
  )
}
