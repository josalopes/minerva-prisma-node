"use client"

import { createContext, useContext } from "react"

export type FlowData = {
  addressFromCnpj?: {
    street?: string
    complement?: string
    district?: string
    city?: string
    state?: string
    zipCode?: string
  }

  addressMode?: "new" | "edit"
}

export type FormFlowContextType = {
  data: FlowData
  set: (key: keyof FlowData, value: any) => void
  get: (key: keyof FlowData) => any
}

export const FormFlowContext = createContext<FormFlowContextType | null>(null)

export function useFormFlowContext() {
  const context = useContext(FormFlowContext)

  if (!context) {
    throw new Error("useFormFlowContext must be used within FormFlowProvider")
  }

  return context
}