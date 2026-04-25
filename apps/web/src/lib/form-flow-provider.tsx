"use client"

import { useState } from "react"
import { FormFlowContext, FlowData, FormFlowContextType } from "./form-flow-context"

export function FormFlowProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [data, setData] = useState<FlowData>({})

  const value: FormFlowContextType = {
    data,
    set,
    get
  }

  function set(key: keyof FlowData, value: any) {
    setData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  function get(key: keyof FlowData) {
    return data[key]
  }

  return (
    <FormFlowContext.Provider value={value}>
      {children}
    </FormFlowContext.Provider>
  )
}
