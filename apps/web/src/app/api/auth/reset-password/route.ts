import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {

    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/reset-password'

    const cookieStore = await cookies()
    cookieStore.delete('token')
    
    return NextResponse.redirect(redirectUrl)
}