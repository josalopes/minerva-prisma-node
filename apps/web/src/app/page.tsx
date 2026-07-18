import Link from 'next/link'

interface FeatureProps {
  title: string
  description: string
}

function Feature({ title, description }: FeatureProps) {
  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">{title}</h2>

      <p className="text-muted-foreground mt-3">{description}</p>
    </div>
  )
}

import { isAuthenticated } from '@/auth/auth'

export default async function Home() {
  const authenticated = await isAuthenticated()

  const dashboardUrl = authenticated ? '/workspace' : '/auth/sign-in'

  return (
    <main className="bg-background min-h-screen">
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="text-muted-foreground rounded-full border px-4 py-1 text-sm">
          Plataforma de Gestão Ambiental
        </span>

        <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight">
          Gerencie resíduos, produtos, clientes e operações em um único lugar.
        </h1>

        <p className="text-muted-foreground mt-6 max-w-2xl text-lg">
          O Minerva simplifica a gestão ambiental da sua empresa com uma
          plataforma moderna, rápida e preparada para crescer junto com o seu
          negócio.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {authenticated ? (
            <Link
              href={dashboardUrl}
              className="bg-primary text-primary-foreground inline-flex h-11 items-center rounded-lg px-6 font-medium transition-colors hover:opacity-90"
            >
              Ir para o painel
            </Link>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="border-border bg-background hover:bg-muted inline-flex h-11 items-center rounded-lg border px-6 font-medium transition-colors"
              >
                Entrar
              </Link>

              <Link
                href="/auth/sign-up"
                className="bg-primary text-primary-foreground inline-flex h-11 items-center rounded-lg px-6 font-medium transition-colors hover:opacity-90"
              >
                Criar conta gratuitamente
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-3">
          <Feature
            title="Gestão Completa"
            description="Produtos, clientes, fornecedores, transações e organizações em um único sistema."
          />

          <Feature
            title="Fluxos Inteligentes"
            description="Processos simplificados para aumentar a produtividade da equipe."
          />

          <Feature
            title="Escalável"
            description="Arquitetura preparada para múltiplas organizações e crescimento contínuo."
          />
        </div>
      </section>
    </main>
  )
}
