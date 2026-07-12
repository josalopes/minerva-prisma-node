// file-input.tsx
// Put this file in your /components/ui/file-input.tsx

'use client'

import React, { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircleIcon, UploadIcon, XIcon, FileIcon } from 'lucide-react'
import Image from 'next/image'

export interface FileInputProps {
  id?: string
  className?: string
  name?: string
  disabled?: boolean
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  value?: File[]
  onChange?: (files: File[]) => void
  onError?: (error: string) => void
  showPreview?: boolean
  previewSize?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'minimal'
  dragActiveClassName?: string
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const validateFileType = (file: File, accept?: string): boolean => {
  if (!accept) return true

  const accepted = accept.split(',').map((t) => t.trim())

  return accepted.some((type) => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', ''))
    }
    return file.type === type || file.name.endsWith(type)
  })
}

const validateFiles = ({
  files,
  newFiles,
  accept,
  maxFiles,
  maxSize,
}: {
  files: File[]
  newFiles: File[]
  accept?: string
  maxFiles?: number
  maxSize?: number
}) => {
  const valid: File[] = []
  const errors: string[] = []

  for (const file of newFiles) {
    if (maxSize && file.size > maxSize) {
      errors.push(
        `${file.name} exceeds ${formatFileSize(maxSize)} maximum size`,
      )
      continue
    }

    if (!validateFileType(file, accept)) {
      errors.push(`${file.name} is not an accepted file type (${accept})`)
      continue
    }

    valid.push(file)
  }

  if (maxFiles && files.length + valid.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed`)
    return { valid: [], errors }
  }

  return { valid, errors }
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      id,
      className,
      name,
      disabled = false,
      accept,
      multiple = true,
      maxSize,
      maxFiles,
      value = [],
      onChange,
      onError,
      showPreview = true,
      previewSize = 'md',
      variant = 'default',
      dragActiveClassName,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [files, setFiles] = useState<File[]>(value)
    const [isDragActive, setDragActive] = useState(false)
    const [errors, setErrors] = useState<string[]>([])

    const triggerInput = () => !disabled && inputRef.current?.click()

    const handleFiles = useCallback(
      (incoming: File[]) => {
        const { valid, errors } = validateFiles({
          files,
          newFiles: incoming,
          accept,
          maxSize,
          maxFiles,
        })

        setErrors(errors)
        if (errors.length) onError?.(errors.join('; '))

        if (valid.length) {
          const updated = multiple ? [...files, ...valid] : valid
          setFiles(updated)
          onChange?.(updated)
        }
      },
      [files, accept, maxFiles, maxSize, multiple, onChange, onError],
    )

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      if (!disabled) handleFiles(Array.from(e.dataTransfer.files))
    }

    const removeFile = (index: number) => {
      const updated = files.filter((_, i) => i !== index)
      setFiles(updated)
      onChange?.(updated)
    }

    const previewSizeClass = {
      sm: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-20 h-20',
    }[previewSize]

    const containerStyles = {
      default: 'border-2 border-dashed border-border p-8',
      compact: 'border border-border rounded-lg p-4',
      minimal: 'border-0 bg-secondary/50 p-4',
    }[variant]

    return (
      <div className={cn('w-full', className)}>
        <div
          ref={ref}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={triggerInput}
          className={cn(
            'relative cursor-pointer rounded-lg transition-all',
            containerStyles,
            disabled && 'cursor-not-allowed opacity-50',
            isDragActive &&
              (dragActiveClassName ||
                'border-primary bg-primary/5 scale-[1.02]'),
            !disabled &&
              !isDragActive &&
              'hover:border-primary/50 hover:bg-secondary/30',
          )}
        >
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="file"
            multiple={multiple}
            accept={accept}
            disabled={disabled}
            onChange={(e) => {
              handleFiles(Array.from(e.target.files || []))
              e.target.value = ''
            }}
            className="hidden"
            {...props}
          />
          <div className="pointer-events-none flex flex-col items-center gap-2">
            <UploadIcon
              className={cn(
                'text-muted-foreground h-6 w-6 transition',
                isDragActive && 'text-primary h-8 w-8',
              )}
            />
            <p
              className={cn(
                'text-sm font-semibold',
                isDragActive && 'text-primary',
              )}
            >
              Drag and drop your files here
            </p>
            <p className="text-muted-foreground text-xs">or click to browse</p>

            <div className="flex items-center space-x-2">
              {maxSize && (
                <p className="text-muted-foreground text-xs">
                  Max size: {formatFileSize(maxSize)}
                </p>
              )}
              {maxFiles && (
                <p className="text-muted-foreground text-xs">
                  Max files: {maxFiles}
                </p>
              )}
            </div>
          </div>
        </div>
        {errors.length > 0 && (
          <div className="mt-4 space-y-2">
            {errors.map((err, i) => (
              <div
                key={i}
                className="bg-destructive/10 border-destructive/20 flex items-start gap-2 rounded-lg border p-3"
              >
                <AlertCircleIcon className="text-destructive mt-0.5 h-4 w-4" />
                <p className="text-destructive text-sm">{err}</p>
              </div>
            ))}
          </div>
        )}
        {showPreview && files.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </h3>

            <div
              className={cn(
                'space-y-2',
                previewSize === 'lg' &&
                  'grid grid-cols-2 gap-4 space-y-0 sm:grid-cols-3 lg:grid-cols-4',
              )}
            >
              {files.map((file, index) => {
                const isImage = file.type.startsWith('image/')

                return (
                  <div
                    key={index}
                    className={cn(
                      'bg-secondary/50 border-border flex items-center justify-between space-x-4 rounded-lg border p-3',
                      previewSize === 'lg' && 'flex-col items-start gap-2',
                    )}
                  >
                    {isImage ? (
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className={cn('rounded object-cover', previewSizeClass)}
                      />
                    ) : (
                      <div
                        className={cn(
                          'bg-primary/10 flex items-center justify-center rounded',
                          previewSizeClass,
                        )}
                      >
                        <FileIcon className="text-primary h-6 w-6" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                      disabled={disabled}
                      className="hover:bg-destructive/10 ml-2 rounded p-1 transition disabled:opacity-50"
                    >
                      <XIcon className="text-destructive h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  },
)

FileInput.displayName = 'FileInput'
