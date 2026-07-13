"use server"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function setOrganizationCookie(slug: string) {
  (await cookies()).set('current-org', slug)

  redirect(`/org/${slug}`)
}
