"use client"

import { useEffect, useState } from "react"

type Options = {
  maxSizeMB?: number
  acceptedTypes?: string[] // ["image/png", "image/jpeg"]

  onUpload?: (file: File) => Promise<string> // retorna URL
}

export function useUploadFile({
  maxSizeMB = 2,
  acceptedTypes = ["image/"],
  onUpload
}: Options, previewUrl: string | null) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // =========================
  // 🔥 REHIDRATAR
  // =========================
  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl)
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

  }

  // =========================
  // 🔥 UPLOAD
  // =========================
  async function upload() {
    if (!file || !onUpload) return null

    setIsUploading(true)

    try {
      const url = await onUpload(file)

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