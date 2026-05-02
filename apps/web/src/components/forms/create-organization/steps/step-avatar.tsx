import { AvatarCropModal } from "@/components/avatar-crop-modal"
import { UploadField } from "@/components/upload-field"
import { useUploadStep } from "@/hooks/use-upload-step"
import { CreateOrgContext } from "@/types/create-org-flow"
import { useState } from "react"

export function Step3Avatar({ flow }: any) {
  const upload = useUploadStep<CreateOrgContext, "step4">({
    flow,
    stepKey: "step4"
  })

  const [cropOpen, setCropOpen] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)

  return (
    <>
      <UploadField
        preview={upload.preview}
        
        onSelect={(file) => {
          const preview = URL.createObjectURL(file)
          
          setTempImage(preview)
          setCropOpen(true)
        }}
        onRemove={upload.removeFile}
        
        title="Avatar"
        description="Escolha uma foto para o perfil"

        rounded
        size={140}
      />

      <AvatarCropModal
        open={cropOpen}
        image={tempImage ?? ""}

        onClose={() => {
          setCropOpen(false)
        }}

        onConfirm={(file) => {
          upload.selectFile(file)
        }}
      />
    </>
    
  )
}
