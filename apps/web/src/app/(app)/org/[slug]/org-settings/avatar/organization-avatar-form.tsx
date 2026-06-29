"use client"

import { AvatarCropModal } from "@/components/avatar-crop-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UploadField } from "@/components/upload-field"
import { useUploadFile } from "@/hooks/use-upload-file"
import { updateOrganizationAvatar } from "@/http/organizations/update-organization-avatar"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface OrganizationAvatarContentProps {
    organization: {
        id: string;
        name: string;
        slug: string;
        avatarUrl: string | null;
        avatarPublicId: string | null;
        logoUrl: string | null;
        logoPublicId: string | null;
    },
}

export default function OrganizationAvatarForm({ organization }: OrganizationAvatarContentProps) {
  const router = useRouter()
  const upload = useUploadFile({}, organization.avatarUrl)
  

  const [cropOpen, setCropOpen] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const orgId = organization.id
  const slug = organization.slug

  async function handleUpdateAvatar() {    
    const file = upload?.file

    if (!file || !orgId) {
      return
    }

    const newFilename = `${orgId}-avatar`;
    const newFile = new File([file], newFilename, { type: file.type })

    const type = "avatar"

    const cloudinary = await uploadToCloudinary(newFile, orgId, type)
    const urlImage = cloudinary.secure_url
    const publicId = cloudinary.public_id

    if (!urlImage || urlImage === "") {
      toast.error("Falha no upload da imagem");
      return;
    }

    await updateOrganizationAvatar({ avatarUrl: urlImage, avatarPublicId: publicId, slug })

    toast.success("Atualização concluída")
  }

  async function uploadToCloudinary(file: File, orgId: string, type: string): Promise<any | undefined> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("organizationId", orgId)
      formData.append("type", type)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/image/upload`,
        {
          method: "POST",
          body: formData
        }
      )

      const data = await res.json();

      if (!res.ok) {
        toast("Falha no upload da imagem!")
        return undefined;
      }

      // toast("Imagem alterada com sucesso!")
      
      return data  
    } catch (error) {
      return undefined
    }    
  }

  async function deleteFromCloudinary(publicId: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/image/upload`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          public_id: publicId
        })
      }
    )
  }

  return (
    <div>
      <Card>
        <CardHeader>
          {/* Editar Avatar */}
        </CardHeader>
          <CardContent>
            <UploadField
              preview={upload.preview}
              
              onSelect={(file) => {
                const preview = URL.createObjectURL(file)
                
                setTempImage(preview)
                setCropOpen(true)
              }}
              onRemove={upload.removeFile}
              
              title="Avatar da Organização"
              description="Escolha uma foto para o perfil"

              rounded
              size={140}
            />          
          </CardContent>
      </Card>

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

      <div className="flex justify-between">
        <div className="flex gap-4 mt-4">
          <Button
            className="cursor-pointer"
            variant="outline"
            type="button"
            onClick={async () => {                          
              await handleUpdateAvatar()
              
              router.push(`/org/${slug}`)
            }}
          >
            Salvar
          </Button>

          <Button
            className="transition-all active:scale-95 cursor-pointer" 
            variant="outline" 
            type="button"
            onClick={async () => { 
              if (organization.avatarPublicId)                          {
                await deleteFromCloudinary(organization.avatarPublicId)
                await updateOrganizationAvatar({ avatarUrl: null, avatarPublicId: null, slug })
              }
              router.push(`/org/${slug}`)
            }}
          >
            Excluir
          </Button>
        </div>

        <div className="flex gap-2 mt-4">                  
          <Button
            className="cursor-pointer"
            onClick={async () => {                          
                router.push(`/org/${slug}`)
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
    
  )
}
