'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { toast, Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: any) => {
        toast.error(error.message || 'Erro inesperado')
      },
      onSuccess: () => {
        toast.success('Operação realizada com sucesso')
      },
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        {children}
        {/* <Toaster richColors /> */}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
