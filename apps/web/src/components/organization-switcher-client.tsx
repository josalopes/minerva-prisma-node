'use client'

import Link from 'next/link'
import { ChevronsUpDown, PlusCircle, Settings } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'

import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

import type { Organization } from '@/contexts/organization-context'
import { setOrganizationCookie } from '@/actions/change-tenant/route'
import { useRouter } from 'next/navigation'

interface Props {
  organizations: Organization[]
  currentOrganization: Organization | null
  canUpdateOrganization: boolean | undefined
}

export function OrganizationSwitcherClient({
  organizations,
  currentOrganization,
  canUpdateOrganization,
}: Props) {
  const currentOrg = currentOrganization
  const hasOrganization = !!currentOrg

  const router = useRouter()

  async function handleChangeOrganization(org: Organization) {
    await setOrganizationCookie(org.slug)

    router.push(`/org/${org.slug}/products`)

    router.refresh()
  }

  function getInitials(name: string) {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toLocaleUpperCase())
      .slice(0, 2)
      .join('')

    return initials
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[220px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
        {currentOrg ? (
          <>
            <Avatar className="size-8">
              {currentOrg.avatarUrl && (
                <AvatarImage src={currentOrg.avatarUrl} />
              )}
              <AvatarFallback>{getInitials(currentOrg.name)}</AvatarFallback>
            </Avatar>
            <span className="truncate text-left">{currentOrg.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Selecione a organização</span>
        )}

        <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={-12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizações</DropdownMenuLabel>

          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onSelect={() => handleChangeOrganization(org)}
            >
              <Avatar className="mr-2 size-4">
                {org.avatarUrl && <AvatarImage src={org.avatarUrl} />}
                <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
              </Avatar>

              <span className="line-clamp-1">{org.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {!hasOrganization && (
          <DropdownMenuItem asChild>
            <Link href="/onboarding">
              <PlusCircle className="mr-2 size-4" />
              Nova Organização
            </Link>
          </DropdownMenuItem>
        )}

        {hasOrganization && canUpdateOrganization && (
          <DropdownMenuItem asChild>
            <Link href={`/org/${currentOrg.slug}/org-settings`}>
              <Settings className="mr-2 size-4" />
              Configurações da Organização
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
