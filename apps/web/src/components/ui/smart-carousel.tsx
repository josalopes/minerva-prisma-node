"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { motion } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"
import type { CarouselApi } from "@/components/ui/carousel"

interface SmartCarouselProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode

  /**
   * Classes responsivas do Tailwind
   * Exemplo:
   * "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
   */
  itemClassName?: string

  /**
   * Quantidade mínima para virar carousel
   */
  minItemsToCarousel?: number
}

export function SmartCarousel<T>({
  items,
  renderItem,
  itemClassName = "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4",
  minItemsToCarousel = 3,
}: SmartCarouselProps<T>) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const shouldUseGrid = items.length < minItemsToCarousel

  // ================= GRID =================

  if (shouldUseGrid) {
    return (
      <div className="grid gap-4 justify-center auto-cols-fr grid-flow-col">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderItem(item)}
          </motion.div>
        ))}
      </div>
    )
  }

  // ================= CAROUSEL =================

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className={`pl-4 ${itemClassName}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderItem(item)}
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-primary w-4"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  )
}


// "use client"

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel"

// import { motion } from "framer-motion"
// import { ReactNode, useEffect, useState } from "react"
// import type { CarouselApi } from "@/components/ui/carousel"

// interface SmartCarouselProps<T> {
//   items: T[]
//   renderItem: (item: T) => ReactNode
//   itemsPerView?: number
//   breakpoints?: {
//     sm?: number
//     md?: number
//     lg?: number
//     xl?: number
//   }
// }

// export function SmartCarousel<T>({
//   items,
//   renderItem,
//   itemsPerView = 3,
//   breakpoints,
// }: SmartCarouselProps<T>) {
//   const [api, setApi] = useState<CarouselApi>()
//   const [current, setCurrent] = useState(0)
//   const [count, setCount] = useState(0)
//   const [perView, setPerView] = useState(itemsPerView)

//   // 🎯 RESPONSIVIDADE AUTOMÁTICA
//   useEffect(() => {
//   function updatePerView() {
//     const width = window.innerWidth

//     let calculated = itemsPerView

//     if (breakpoints) {
//       if (width >= 1280 && breakpoints.xl !== undefined)
//         calculated = breakpoints.xl
//       else if (width >= 1024 && breakpoints.lg !== undefined)
//         calculated = breakpoints.lg
//       else if (width >= 768 && breakpoints.md !== undefined)
//         calculated = breakpoints.md
//       else if (width >= 640 && breakpoints.sm !== undefined)
//         calculated = breakpoints.sm
//     }

//     setPerView(calculated)
//   }

//   updatePerView()
//   window.addEventListener("resize", updatePerView)
//   return () => window.removeEventListener("resize", updatePerView)
// }, [breakpoints, itemsPerView])

//   // 🎯 Sincronização real com Embla
//   useEffect(() => {
//     if (!api) return

//     setCount(api.scrollSnapList().length)
//     setCurrent(api.selectedScrollSnap())

//     api.on("select", () => {
//       setCurrent(api.selectedScrollSnap())
//     })
//   }, [api])

//   const shouldUseGrid = items.length <= perView

//   // ================= GRID =================

//   if (shouldUseGrid) {
//     return (
//       <div
//         className="grid gap-4 justify-center"
//         style={{
//           gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
//         }}
//       >
//         {items.map((item, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             {renderItem(item)}
//           </motion.div>
//         ))}
//       </div>
//     )
//   }

//   // ================= CAROUSEL =================

//   return (
//     <div className="relative w-full">
//       <Carousel
//         setApi={setApi}
//         opts={{
//           align: "start",
//           loop: false,
//         }}
//         className="w-full"
//       >
//         <CarouselContent className="-ml-4">
//           {items.map((item, index) => (
//             <CarouselItem
//               key={index}
//               className="pl-4"
//               style={{
//                 flex: `0 0 ${100 / perView}%`,
//               }}
//             >
//               <motion.div
//                 initial={{ opacity: 0, y: 15 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {renderItem(item)}
//               </motion.div>
//             </CarouselItem>
//           ))}
//         </CarouselContent>

//         <CarouselPrevious />
//         <CarouselNext />
//       </Carousel>

//       {/* 🔵 DOTS sincronizados */}
//       <div className="flex justify-center gap-2 mt-4">
//         {Array.from({ length: count }).map((_, index) => (
//           <button
//             key={index}
//             onClick={() => api?.scrollTo(index)}
//             className={`h-2 w-2 rounded-full transition-all duration-300 ${
//               current === index
//                 ? "bg-primary w-4"
//                 : "bg-muted"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }
