'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import clsx from 'clsx'
import Image from 'next/image'

type Props = {
  preview: string | null

  onSelect: (file: File) => void
  onRemove: () => void

  title?: string
  description?: string

  rounded?: boolean
  size?: number

  accept?: string
}

export function UploadField({
  preview,
  onSelect,
  onRemove,

  title,
  description,

  rounded = false,
  size = 160,

  accept = 'image/*',
}: Props) {
  const [isDragging, setIsDragging] = useState(false)

  const dimension = `${size}px`

  return (
    <div className="space-y-6">
      {/* ========================= */}
      {/* 🔥 HEADER */}
      {/* ========================= */}
      {(title || description) && (
        <div>
          {title && <h2 className="text-lg font-semibold">{title}</h2>}

          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      )}

      {/* ========================= */}
      {/* 🔥 EMPTY STATE*/}
      {/* ========================= */}
      {!preview && (
        <label
          className={clsx(
            'flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all',
            'hover:bg-muted/50',
            isDragging && 'border-primary bg-primary/5 scale-[1.01]',
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => {
            setIsDragging(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)

            const file = e.dataTransfer.files?.[0]

            if (file) {
              onSelect(file)
            }
          }}
        >
          <Upload className="mb-2 h-6 w-6" />

          <span className="text-sm font-medium">
            {isDragging
              ? 'Solte a imagem aqui'
              : 'Clique ou arraste uma imagem'}
          </span>

          <span className="text-muted-foreground mt-1 text-xs">
            PNG, JPG ou WEBP
          </span>

          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0]

              if (file) {
                onSelect(file)
              }
            }}
          />
        </label>
      )}

      {/* ========================= */}
      {/* 🔥 PREVIEW */}
      {/* ========================= */}
      {preview && (
        <div className="flex justify-center">
          <div
            className="relative"
            style={{
              width: dimension,
              height: dimension,
            }}
          >
            <Image
              src={preview}
              alt="preview"
              className={clsx(
                'h-full w-full border object-cover shadow-sm',
                rounded ? 'rounded-full' : 'rounded-lg',
              )}
            />

            <button
              type="button"
              onClick={onRemove}
              className={clsx(
                'absolute -top-2 -right-2 rounded-full p-1.5',
                'bg-destructive text-white shadow-md',
                'cursor-pointer transition hover:scale-105',
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* 🔥 UX */}
      {/* ========================= */}
      {preview && (
        <p className="text-muted-foreground text-center text-xs">
          Você pode trocar a imagem antes de continuar
        </p>
      )}
    </div>
  )
}
