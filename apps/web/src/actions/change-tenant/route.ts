'use server'

import { cookies } from 'next/headers'

export async function setOrganizationCookie(slug: string) {
  const cookieStore = await cookies()

  cookieStore.set('current-org', slug, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    httpOnly: true,
  })
}
