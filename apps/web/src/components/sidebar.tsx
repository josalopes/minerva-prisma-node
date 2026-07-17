'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

import {
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Warehouse,
  ChevronDown,
} from 'lucide-react'

import { Boxes, Users, Settings } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { Button } from '@/components/ui/button'

import logoImg from '../../public/logo-ambiental-reciclagem.png'
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

  useEffect(() => {
    if (isCollapsed) {
      setOpenOperation(false)
      setOpenPerson(false)
      setOpenAdministration(false)
    }
  }, [isCollapsed])

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
          'bg-background fixed top-0 left-0 z-30 flex h-screen flex-col border-r p-4 transition-all duration-300',
          {
            'w-20': isCollapsed,
            'w-64': !isCollapsed,
          },
        )}
      >
        <div
          className={clsx(
            'mt-4 mb-6 flex items-center',
            isCollapsed ? 'justify-center' : 'justify-start',
          )}
        >
          <Image
            src={logoUrl || logoImg}
            alt="Logo da organização"
            width={0}
            height={0}
            sizes="100vw"
            priority
            quality={100}
            className={clsx(
              'h-auto transition-all duration-300',
              isCollapsed ? 'w-10' : 'w-40',
            )}
          />
        </div>

        <Button
          className={clsx(
            'mb-4 bg-gray-100 text-zinc-900 hover:bg-gray-50',
            isCollapsed ? 'self-center' : 'self-end',
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? (
            <ChevronLeft className="h-12 w-12" />
          ) : (
            <ChevronRight className="h-12 w-12" />
          )}
        </Button>

        <Collapsible open={openOperation} onOpenChange={setOpenOperation}>
          <CollapsibleTrigger
            className={clsx(
              'hover:bg-accent flex w-full items-center rounded-md px-2 py-2 transition-colors',
              isCollapsed ? 'justify-center' : 'justify-between',
            )}
          >
            {isCollapsed ? (
              <Boxes className="h-5 w-5" />
            ) : (
              <>
                <span>Operação</span>

                {openOperation ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </>
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
          <CollapsibleTrigger
            className={clsx(
              'hover:bg-accent flex w-full items-center rounded-md px-2 py-2 transition-colors',
              isCollapsed ? 'justify-center' : 'justify-between',
            )}
          >
            {isCollapsed ? (
              <Users className="h-5 w-5" />
            ) : (
              <>
                <span>Pessoas</span>

                {openPerson ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </>
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
          <CollapsibleTrigger
            className={clsx(
              'hover:bg-accent flex w-full items-center rounded-md px-2 py-2 transition-colors',
              isCollapsed ? 'justify-center' : 'justify-between',
            )}
          >
            {isCollapsed ? (
              <Settings className="h-5 w-5" />
            ) : (
              <>
                <span>Administração</span>

                {openAdministration ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </>
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
        {children}
      </div>
    </div>
  )
}
