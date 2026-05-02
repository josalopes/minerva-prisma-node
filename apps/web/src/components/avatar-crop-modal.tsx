"use client"

import { useCallback, useState } from "react"
import Cropper from "react-easy-crop"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

type Props = {
  open: boolean
  image: string

  onClose: () => void
  onConfirm: (file: File) => void
}

export function AvatarCropModal({
  open,
  image,
  onClose,
  onConfirm
}: Props) {

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<any>(null)

  // =========================
  // 🔥 CROP COMPLETE
  // =========================
  const onCropComplete = useCallback(
    (_: any, croppedPixels: any) => {
      setCroppedAreaPixels(croppedPixels)
    },
    []
  )

  // =========================
  // 🔥 GENERATE IMAGE
  // =========================
  async function createCroppedImage() {

    const imageElement = await createImage(image)

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    ctx.drawImage(
      imageElement,

      croppedAreaPixels.x,
      croppedAreaPixels.y,

      croppedAreaPixels.width,
      croppedAreaPixels.height,

      0,
      0,

      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return

        const file = new File(
          [blob],
          "avatar.jpg",
          { type: "image/jpeg" }
        )

        resolve(file)
      }, "image/jpeg")
    })
  }

  // =========================
  // 🔥 CONFIRM
  // =========================
  async function handleConfirm() {
    const cropped = await createCroppedImage()

    if (!cropped) return

    onConfirm(cropped)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className="max-w-lg">

        <DialogHeader>
          <DialogTitle>
            Ajustar avatar
          </DialogTitle>
        </DialogHeader>

        {/* ========================= */}
        {/* 🔥 CROP AREA */}
        {/* ========================= */}
        <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">

          <Cropper
            image={image}

            crop={crop}
            zoom={zoom}

            aspect={1}
            cropShape="round"
            showGrid={false}

            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />

        </div>

        {/* ========================= */}
        {/* 🔥 ZOOM */}
        {/* ========================= */}
        <div className="space-y-2">

          <span className="text-sm">
            Zoom
          </span>

          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}

            onValueChange={(value) => {
              setZoom(value[0])
            }}
          />

        </div>

        {/* ========================= */}
        {/* 🔥 ACTIONS */}
        {/* ========================= */}
        <div className="flex justify-end gap-2">

          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleConfirm}
          >
            Aplicar
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  )
}

// =========================
// 🔥 CREATE IMAGE
// =========================
function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {

    const image = new Image()

    image.addEventListener("load", () => {
      resolve(image)
    })

    image.addEventListener("error", reject)

    image.src = src
  })
}