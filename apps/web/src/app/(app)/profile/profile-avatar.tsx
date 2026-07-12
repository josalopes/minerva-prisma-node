'use client'

import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader, Upload } from 'lucide-react'
import { toast } from 'sonner'

import semFoto from '../../../../public/DSC_5886.png'
import { updateProfile } from '@/http/profile/update-profile'
import { env } from '@saas/env'

interface AvatarProfileProps {
  avatarUrl: string | null
  userId: string
  slug: string | undefined
}

export function AvatarProfile({ avatarUrl, userId, slug }: AvatarProfileProps) {
  const [previewImage, setPreviewImage] = useState(avatarUrl)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setLoading(true)
      const image = e.target.files[0]

      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        toast.error('Formato de imagem inválido')
        return
      }

      const newFilename = `${userId}-user`
      const newFile = new File([image], newFilename, { type: image.type })

      const urlImage = await uploadImage(newFile)

      if (!urlImage || urlImage === '') {
        toast.error('Falha ao alterar a imagem')
        return
      }

      setPreviewImage(urlImage)

      await updateProfile({ avatarUrl: urlImage })

      setLoading(false)

      if (slug) {
        router.push(`/org/${slug}`)
      }
    }
  }

  async function uploadImage(image: File): Promise<string | null> {
    try {
      toast('Estamos enviando sua imagem...')

      const formData = new FormData()

      formData.append('file', image)
      formData.append('userId', userId)

      const response = await fetch(`${env.NEXT_PUBLIC_URL}/api/image/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return null
      }

      toast('Imagem alterada com sucesso!')
      return data.secure_url as string
    } catch (err) {
      console.log(err)
      return null
    }
  }

  return (
    <div className="relative h-40 w-40 md:h-48 md:w-48">
      <div className="relative flex h-full w-full items-center justify-center">
        <span className="absolute z-[2] cursor-pointer rounded-full bg-slate-50/80 p-2 shadow-xl">
          {loading ? (
            <Loader size={16} color="#131313" className="animate-spin" />
          ) : (
            <Upload size={16} color="#131313" />
          )}
        </span>

        <input
          type="file"
          className="relative z-50 h-48 w-48 cursor-pointer opacity-0"
          onChange={handleChange}
        />
      </div>

      {previewImage ? (
        <Image
          src={previewImage}
          alt="Foto de perfil do usuário"
          fill
          className="h-48 w-full rounded-full bg-slate-200 object-cover"
          quality={100}
          priority
          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw"
        />
      ) : (
        <Image
          src={semFoto}
          alt="Foto de perfil do usuário"
          fill
          className="h-48 w-full rounded-full bg-slate-200 object-cover"
          quality={100}
          priority
          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw"
        />
      )}
    </div>
  )
}
