'use server'

import { cookies } from 'next/headers'

export async function deleteToken() {
    const cookieStore = await cookies()
    cookieStore.delete('token')
}