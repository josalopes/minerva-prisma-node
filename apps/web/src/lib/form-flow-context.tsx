"use client"

import { createContext, useContext } from "react"

export const FormFlowContext = createContext<any>(null)

export function useFormFlowContext() {
  const context = useContext(FormFlowContext)

  if (!context) {
    throw new Error("useFormFlowContext must be used within FormFlowProvider")
  }

  return context
}