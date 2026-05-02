"use client"

import { CreateOrgContext } from "@/types/create-org-flow"
import { useUploadStep } from "@/hooks/use-upload-step"
import { UploadField } from "@/components/upload-field"

export function Step2Logo({ flow }: any) {
  const upload = useUploadStep<CreateOrgContext, "step3">({
    flow,
    stepKey: "step3"
  })
  
  return (
    <UploadField
      preview={upload.preview}

      onSelect={upload.selectFile}
      onRemove={upload.removeFile}

      title="Logo da organização"
      description="Envie uma imagem para representar sua empresa"

      rounded={false}
      size={160}
    />
  )
}
