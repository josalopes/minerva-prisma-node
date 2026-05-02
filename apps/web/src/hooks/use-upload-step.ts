"use client"

import { useEffect, useState } from "react"
import { mergeContextStep } from "@/lib/flow-helpers"
import { FlowController } from "@/types/form-flow-types"

type Options<TContext, K extends keyof TContext> = {
  flow: FlowController<TContext>
  stepKey: K

  maxSizeMB?: number
  acceptedTypes?: string[] // ["image/png", "image/jpeg"]

  onUpload?: (file: File) => Promise<string> // retorna URL
}

type UploadStepData = {
  file?: File | null
  preview?: string | null
  url?: string | null
}

export function useUploadStep<
  TContext,
  K extends keyof TContext
>({
  flow,
  stepKey,
  maxSizeMB = 2,
  acceptedTypes = ["image/"],
  onUpload
}: Options<TContext, K>) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // =========================
  // 🔥 REHIDRATAR
  // =========================
  useEffect(() => {
    const saved = flow.context.get(stepKey) as UploadStepData | undefined

    if (saved) {
      setFile(saved.file ?? null)
      setPreview(saved.preview ?? null)
    }
  }, [])

  // =========================
  // 🔥 VALIDATION
  // =========================
  function isValidFile(file: File) {
    const isValidType = acceptedTypes.some(type =>
      file.type.startsWith(type)
    )

    if (!isValidType) {
      alert("Tipo de arquivo inválido")
      return false
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Máximo ${maxSizeMB}MB`)
      return false
    }

    return true
  }

  // =========================
  // 🔥 SELECT FILE
  // =========================
  function selectFile(file: File) {
    if (!isValidFile(file)) return

    if (preview) {
      URL.revokeObjectURL(preview)
    }

    const previewUrl = URL.createObjectURL(file)

    setFile(file)
    setPreview(previewUrl)

    mergeContextStep(flow.context, stepKey, {
      file,
      preview: previewUrl
    } as any)
  }

  // =========================
  // 🔥 REMOVE
  // =========================
  function removeFile() {
    if (preview) {
      URL.revokeObjectURL(preview)
    }

    setFile(null)
    setPreview(null)

    mergeContextStep(flow.context, stepKey, {
      file: null,
      preview: null,
      url: null
    } as any)
  }

  // =========================
  // 🔥 UPLOAD
  // =========================
  async function upload() {
    if (!file || !onUpload) return null

    setIsUploading(true)

    try {
      const url = await onUpload(file)

      mergeContextStep(flow.context, stepKey, {
        url
      } as any)

      return url
    } finally {
      setIsUploading(false)
    }
  }

  return {
    file,
    preview,
    isUploading,

    selectFile,
    removeFile,
    upload
  }
}