import ky from 'ky'
import { getCookie } from 'cookies-next'
import type { CookiesFn } from 'cookies-next'
import { env } from '@saas/env/web'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  retry: {
    limit: 1,
    methods: ['get'],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookieStore: CookiesFn | undefined

        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')
          cookieStore = serverCookies
        }

        const token = await getCookie('token', { cookies: cookieStore })

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})

// import ky from 'ky'
// import { getCookie } from 'cookies-next'
// import type { CookiesFn } from 'cookies-next'
// import { env } from '@saas/env/web'

// export const api = ky.create({
//   prefixUrl: env.NEXT_PUBLIC_API_URL,

//   retry: {
//     limit: 10,
//     methods: ['get', 'post', 'put', 'patch', 'delete'],
//     statusCodes: [408, 413, 429, 500, 502, 503, 504],
//     backoffLimit: 2000,
//   },

//   hooks: {
//     beforeRequest: [
//       async (request) => {
//         let cookieStore: CookiesFn | undefined

//         if (typeof window === 'undefined') {
//           const { cookies: serverCookies } = await import('next/headers')
//           cookieStore = serverCookies
//         }

//         const token = await getCookie('token', {
//           cookies: cookieStore,
//         })

//         if (token) {
//           request.headers.set('Authorization', `Bearer ${token}`)
//         }
//       },
//     ],

//     beforeRetry: [
//       async ({ request, error, retryCount }) => {
//         console.log(
//           `[KY Retry] ${request.method} ${request.url} - tentativa ${retryCount}`,
//         )

//         // Espera fixa de 2 segundos entre as tentativas
//         await new Promise((resolve) => setTimeout(resolve, 2000))
//       },
//     ],
//   },
// })
