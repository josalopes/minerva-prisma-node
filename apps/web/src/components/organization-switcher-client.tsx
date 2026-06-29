'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

import { useOrganization } from '@/hooks/use-organization'
import type { Organization } from '@/contexts/organization-context'
import { setOrganizationCookie } from '@/app/api/auth/change-tenant/route'
import { permissions } from '@saas/auth/src/permissions'
import { ability, getCurrentOrg } from "@/auth/auth"

interface Props {
  organizations: Organization[]
  currentOrganization: Organization | null
  canUpdateOrganization: boolean | undefined
}

export function OrganizationSwitcherClient({
  organizations,
  currentOrganization,
  canUpdateOrganization
}: Props) {
  const router = useRouter()
  const currentOrg = currentOrganization
  const hasOrganization = !!currentOrg

  async function handleChangeOrganization(org: Organization) {
    setOrganizationCookie(org.slug)
  }

  function getInitials(name: string) {
    const initials = name
        .split(' ')
        .map((word) => word.charAt(0).toLocaleUpperCase())
        .slice(0,2)
        .join('')

    return initials    
}
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[220px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {currentOrg ? (
          <>
            <Avatar className="size-8">
              {currentOrg.avatarUrl && (
                <AvatarImage 
                  src={currentOrg.avatarUrl} 
                />
              )}
              <AvatarFallback>
                  {getInitials(currentOrg.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-left">
              {currentOrg.name}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">
            Selecione a organização
          </span>
        )}

        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
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
              onClick={() => handleChangeOrganization(org)}
            >
              <Avatar className="mr-2 size-4">
                {org.avatarUrl && (
                  <AvatarImage src={org.avatarUrl} />
                )}
                <AvatarFallback>
                  {getInitials(org.name)}
                </AvatarFallback>
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
