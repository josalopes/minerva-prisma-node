import { useEffect } from "react"

export function useStepEffect(
  flow: any,
  stepIndex: number,
  effect: () => void | (() => void),
  deps: any[]
) {
  useEffect(() => {
    if (flow.step !== stepIndex) return

    return effect()
  }, [flow.step, ...deps])
}