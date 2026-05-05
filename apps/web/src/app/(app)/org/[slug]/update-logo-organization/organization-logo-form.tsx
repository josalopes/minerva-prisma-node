"use client"

import { AvatarCropModal } from "@/components/avatar-crop-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UploadField } from "@/components/upload-field"
import { useUploadFile } from "@/hooks/use-upload-file"
import { updateOrganizationAvatar } from "@/http/organizations/update-organization-avatar"
import { updateOrganizationLogo } from "@/http/organizations/update-organization-logo"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface OrganizationLogoContentProps {
    organization: {
        id: string;
        // name: string;
        slug: string;
        // avatarUrl: string | null;
        // avatarPublicId: string | null;
        logoUrl: string | null;
        logoPublicId: string | null;
    },
}

export default function OrganizationLogoForm({ organization }: OrganizationLogoContentProps) {
  const router = useRouter()
  const upload = useUploadFile({}, organization.logoUrl)
  

  const [cropOpen, setCropOpen] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const orgId = organization.id
  const slug = organization.slug

  async function handleUpdateLogo() {    
    const file = upload?.file

    if (!file || !orgId) {
      return
    }

    const newFilename = `${orgId}-logo`;
    const newFile = new File([file], newFilename, { type: file.type })

    const type = "logo"

    const cloudinary = await uploadToCloudinary(newFile, orgId, type)
    const urlImage = cloudinary.secure_url
    const publicId = cloudinary.public_id

    if (!urlImage || urlImage === "") {
      toast.error("Falha no upload da imagem");
      return;
    }

    await updateOrganizationLogo({ logoUrl: urlImage, logoPublicId: publicId, slug })

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
        <CardContent>
        <UploadField
            preview={upload.preview}

            onSelect={upload.selectFile}
            onRemove={upload.removeFile}

            title="Logo da organização"
            description="Envie uma imagem para representar sua empresa"

            rounded={false}
            size={160}
        />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <div className="flex gap-4 mt-4">
          <Button
            variant="outline"
            type="button"
            onClick={async () => {                          
              await handleUpdateLogo()
              
              router.push(`/org/${slug}`)
            }}
          >
            Salvar
          </Button>

          <Button
            className="transition-all active:scale-95" 
            variant="outline" 
            type="button"
            onClick={async () => { 
              if (organization.logoPublicId)                          {
                await deleteFromCloudinary(organization.logoPublicId)
                await updateOrganizationLogo({ logoUrl: null, logoPublicId: null, slug })
              }
              router.push(`/org/${slug}`)
            }}
          >
            Excluir
          </Button>
        </div>

        <div className="flex gap-2 mt-4">                  
          <Button
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



// "use client"

// import { LogoOrganizationFormData, useLogoOrganizationForm } from "./logo-form";
// import { updateOrganizationLogo } from "@/http/organizations/update-organization-logo";
// import { LogoOrganization } from "./organization-logo";

// import { 
//     Card, 
//     CardContent, 
//     CardHeader, 
//     CardTitle 
// } from "@/components/ui/card";

// import { Form } from "@/components/ui/form";

// interface OrganizationLogoContentProps {
//     organization: {
//         id: string;
//         name: string;
//         slug: string;
//         avatarUrl: string | null;
//         logoUrl: string | null;
//     },
// }

// export default function OrganizationLogoForm({ organization }: OrganizationLogoContentProps) {
//     const form = useLogoOrganizationForm({
//         logoUrl: organization.logoUrl
//     });

//     async function onSubmit(values: LogoOrganizationFormData) {
//         const response = await updateOrganizationLogo({
//             logoUrl: values.logoUrl,
//             slug: organization.slug
//         });
//     }

//     return (
//         <div className="mx-auto">
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)}>
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Logo</CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-6">
//                             <div className="flex justify-center">
//                                 {/* <div className="bg-gray-200 relative w-48"> */}
//                                 <div className="bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden">
//                                     <LogoOrganization 
//                                         organizationId={organization.id} 
//                                         logoUrl={organization.logoUrl} 
//                                         slug={organization.slug} 
//                                     />
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </form>
//             </Form>
//         </div>
//     )
// }

