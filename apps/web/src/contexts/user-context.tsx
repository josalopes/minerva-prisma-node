// contexts/user-context.tsx
'use client'

import { createContext, useMemo, useState, ReactNode } from 'react'

export interface LoggedUser {
  id: string
  name: string
  avatarUrl?: string | null
}

interface UserContextData {
  loggedUser: LoggedUser | null
  setLoggedUser: (user: LoggedUser | null) => void
}

export const UserContext = createContext({} as UserContextData)

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: LoggedUser | null
}) {
  const [loggedUser, setLoggedUser] = useState(initialUser)

  const value = useMemo(
    () => ({ loggedUser, setLoggedUser }),
    [loggedUser]
  )

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}