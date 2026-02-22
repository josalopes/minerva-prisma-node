'use client'

import { createContext, useMemo, useState, ReactNode } from 'react'

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

export const OrganizationContext = createContext<OrganizationContextType | null>(null)

interface OrganizationProviderProps {
  children: React.ReactNode;
  organization: Organization;
}

export function OrganizationProvider({
  children,
  organization,
}: OrganizationProviderProps) {

  return (
    <OrganizationContext.Provider value={{ currentOrg: organization}}>
      {children}
    </OrganizationContext.Provider>
  )
}