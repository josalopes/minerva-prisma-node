'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface Organization {
  id: string
  name: string
  slug: string
  avatarUrl?: string | null
  logoUrl?: string | null
}

interface OrganizationContextType {
  currentOrg: Organization
}

export const OrganizationContext =
  createContext<OrganizationContextType | null>(null)

interface OrganizationProviderProps {
  children: ReactNode
  organization: Organization
}

export function OrganizationProvider({
  children,
  organization,
}: OrganizationProviderProps) {
  const value: OrganizationContextType = {
    currentOrg: organization,
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)

  if (!context) {
    throw new Error(
      'useOrganization deve ser usado dentro de um OrganizationProvider',
    )
  }

  return context
}

export function useCurrentOrganization() {
  return useOrganization().currentOrg
}

export function useOrganizationSlug() {
  return useCurrentOrganization().slug
}

export function useOrganizationId() {
  return useCurrentOrganization().id
}
