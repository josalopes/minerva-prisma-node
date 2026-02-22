"use client"

import Image from 'next/image';
import { ChangeEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation';
import { Loader, Upload } from 'lucide-react';
import { toast } from 'sonner';

import semFoto from '../../../../../../public/logo-ambiental-reciclagem.png'
import { env } from '@saas/env';
import { updateOrganizationLogo } from '@/http/update-organization-logo';


interface LogoOrganizationProps {
  organizationId: string;
  logoUrl: string | null;
  userId: string;
  slug: string
  
}

export function LogoOrganization({ organizationId, logoUrl, userId, slug }: LogoOrganizationProps) {
  const [previewImage, setPreviewImage] = useState(logoUrl)
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const image = e.target.files[0];

      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        toast.error("Formato de imagem inválido");
        return;
      }

      const newFilename = `${organizationId}-logo`;
      const newFile = new File([image], newFilename, { type: image.type })

      const urlImage = await uploadImage(newFile)

      if (!urlImage || urlImage === "") {
        toast.error("Falha ao alterar a imagem");
        return;
      }

      setPreviewImage(urlImage);

      await updateOrganizationLogo({ logoUrl: urlImage, slug });

      setLoading(false);

      if (slug) {
        startTransition(() => {
              router.push(`/org/${slug}`)
          })
      }
    }
  }

  async function uploadImage(image: File): Promise<string | null> {
    try {
      toast("Estamos enviando sua imagem...")

      const formData = new FormData();

      formData.append("file", image)
      formData.append("slug", slug)
      formData.append("userId", userId)

      const response = await fetch(`${env.NEXT_PUBLIC_URL}/api/image/upload`, {
        method: "POST",
        body: formData
      })

      const data = await response.json();

      if (!response.ok) {
        return null;
      }

      toast("Imagem alterada com sucesso!")
      return data.secure_url as string


    } catch (err) {
      console.log(err);
      return null;
    }

  }


  return (
    <div className="relative w-40 h-40 md:w-48 md:h-48">

      <div className='relative flex items-center justify-center w-full h-full '>
        <span className='absolute cursor-pointer z-[2] bg-slate-50/80 p-2 w-200 h-100 shadow-xl'>
          {
          loading ? 
            <Loader size={16} color="#131313" className='animate-spin' /> 
            : 
            <Upload size={16} color="#131313" />
          }
        </span>

        <input
          type="file"
          // className='opacity-0 cursor-pointer relative fill'
          className='opacity-0 cursor-pointer relative z-50 w-48 h-48'
          onChange={handleChange}
        />
      </div>

      {previewImage ? (
        <Image
          src={previewImage}
          alt="Foto do logo da Organização"
          fill
          className='w-full h-48 object-cover bg-slate-200'
          quality={100}
          priority
          sizes='(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw'
        />
      ) : (
        <Image
          src={semFoto}
          alt="Foto do logo da Organização"
          fill
          className='w-full h-48 object-cover bg-slate-200'
          quality={100}
          priority
          sizes='(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw'
        />
      )}
    </div>
  )

}