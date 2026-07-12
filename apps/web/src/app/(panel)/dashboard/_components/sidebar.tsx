'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

import {
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Warehouse,
  ChevronDown,
} from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { Button } from '@/components/ui/button'

import logoImg from '../../../../../public/logo-ambiental-reciclagem.png'
import { useOrganization } from '@/hooks/use-organization'
import { SidebarActionButton } from './sidebar-action-button'

export function SidebarDashboardClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { currentOrg } = useOrganization()
  const logoUrl = currentOrg.logoUrl

  const [isCollapsed, setIsCollapsed] = useState(false)

  const [openOperation, setOpenOperation] = useState(false)
  const [openPerson, setOpenPerson] = useState(false)
  const [openAdministration, setOpenAdministration] = useState(false)

  function handleMember() {
    if (!currentOrg) {
      return
    }
  }

  function handleProduct() {
    if (!currentOrg) {
      return
    }
    router.push(`/org/${currentOrg.slug}/products`)
  }

  function handleStorage() {
    if (!currentOrg) {
      return
    }
  }

  function handleTransaction() {
    if (!currentOrg) {
      return
    }

    router.push(`/org/${currentOrg.slug}/transactions`)
  }

  function handleCustomer() {
    if (!currentOrg) {
      return
    }
  }

  function handleSchedule() {
    if (!currentOrg) {
      return
    }
  }

  function handleOrganization() {
    if (!currentOrg) {
      return
    }
  }

  function handleSupplier() {
    if (!currentOrg) {
      return
    }
  }

  return (
    <div className="flex h-screen w-full">
      <aside
        className={clsx(
          'bg-background flex h-full flex-col border-r p-4 transition-all duration-300',
          {
            'w-20': isCollapsed,
            'w-64': !isCollapsed,
            'hidden md:fixed md:flex': true,
          },
        )}
      >
        <div className="mt-4 mb-6">
          {!isCollapsed && (
            <Image
              src={logoUrl || logoImg}
              alt="Logo da organização"
              width={0}
              height={0}
              sizes="100vw"
              priority
              quality={100}
              className="h-auto w-40"
            />
          )}
        </div>

        <Button
          className="mb-2 self-end bg-gray-100 text-zinc-900 hover:bg-gray-50"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? (
            <ChevronLeft className="h-12 w-12" />
          ) : (
            <ChevronRight className="h-12 w-12" />
          )}
        </Button>

        <Collapsible open={openOperation} onOpenChange={setOpenOperation}>
          <CollapsibleTrigger className="hover:bg-accent flex w-full items-center justify-between rounded-md px-2 py-2">
            <span>Operação</span>

            {openOperation ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarActionButton
              icon={<Warehouse className="h-6 w-6" />}
              label="Transações"
              isCollapsed={isCollapsed}
              onClick={handleTransaction}
            />

            <SidebarActionButton
              icon={<Warehouse className="h-6 w-6" />}
              label="Produtos"
              isCollapsed={isCollapsed}
              onClick={handleProduct}
            />

            <SidebarActionButton
              icon={<CalendarCheck2 className="h-6 w-6" />}
              label="Estoque"
              isCollapsed={isCollapsed}
              onClick={handleStorage}
            />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openPerson} onOpenChange={setOpenPerson}>
          <CollapsibleTrigger className="hover:bg-accent flex w-full items-center justify-between rounded-md px-2 py-2">
            <span>Pessoas</span>

            {openPerson ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarActionButton
              icon={<Warehouse className="h-6 w-6" />}
              label="Clientes"
              isCollapsed={isCollapsed}
              onClick={handleCustomer}
            />

            <SidebarActionButton
              icon={<Warehouse className="h-6 w-6" />}
              label="Fornecedores"
              isCollapsed={isCollapsed}
              onClick={handleSupplier}
            />

            <SidebarActionButton
              icon={<CalendarCheck2 className="h-6 w-6" />}
              label="Membros"
              isCollapsed={isCollapsed}
              onClick={handleMember}
            />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={openAdministration}
          onOpenChange={setOpenAdministration}
        >
          <CollapsibleTrigger className="hover:bg-accent flex w-full items-center justify-between rounded-md px-2 py-2">
            <span>Administração</span>

            {openAdministration ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarActionButton
              icon={<Warehouse className="h-6 w-6" />}
              label="Organização"
              isCollapsed={isCollapsed}
              onClick={handleOrganization}
            />

            <SidebarActionButton
              icon={<Warehouse className="h-6 w-6" />}
              label="Planos"
              isCollapsed={isCollapsed}
              onClick={handleSchedule}
            />
          </CollapsibleContent>
        </Collapsible>
      </aside>

      <div
        className={clsx(
          'flex min-h-0 flex-1 flex-col transition-all duration-300',
          {
            'md:ml-20': isCollapsed,
            'md:ml-64': !isCollapsed,
          },
        )}
      >
        <main className="min-h-0 flex-1 overflow-y-auto px-2 py-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
