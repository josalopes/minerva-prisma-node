"use client"

import {
  forwardRef,
  useMemo,
  useState
} from "react"

import { Product } from "@/hooks/use-products-cache"

type Props = {
  products: Product[]
  onSelect: (product: Product) => void
}

export const ProductSearch = forwardRef<
  HTMLInputElement,
  Props
>(function ProductSearch(
  {
    products,
    onSelect
  },
  ref
) {

  const [search, setSearch] = useState("")
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return products
    }

    return products.filter(product =>
      product.code.startsWith(search) ||
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  }, [search, products])

  function handleSelect(product: Product) {

    onSelect(product)

    setSearch("")
    setFocusedIndex(0)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <input
        ref={ref}
        value={search}
        autoComplete="off"
        onClick={() => setIsOpen(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsOpen(false)
          }, 150)
        }}
        placeholder="Nome ou código do produto..."
        className="
          w-full
          border
          rounded-lg
          h-14
          px-4
          text-lg
        "

        onChange={(e) => {
          setSearch(e.target.value)
          setFocusedIndex(0)
          setIsOpen(true)
        }}

        onKeyDown={(e) => {

          // ENTER
          if (e.key === "Enter") {
            e.preventDefault()

            const product =
              filtered[focusedIndex]

            if (product) {
              handleSelect(product)
            }
          }

          // ↓
          if (e.key === "ArrowDown") {
            e.preventDefault()

            setFocusedIndex(prev =>
              Math.min(
                prev + 1,
                filtered.length - 1
              )
            )
          }

          // ↑
          if (e.key === "ArrowUp") {
            e.preventDefault()

            setFocusedIndex(prev =>
              Math.max(prev - 1, 0)
            )
          }

          // ESC
          if (e.key === "Escape") {
            setSearch("")
            setFocusedIndex(0)
            setIsOpen(false)
          }
        }}
      />

      {isOpen && filtered.length > 0 && (
        <div
          className="
            absolute
            z-50
            bg-white
            border
            rounded-lg
            mt-1
            w-full
            shadow-lg
            max-h-72
            overflow-auto
          "
        >

          {filtered.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(product)
              }}
              // onClick={() => handleSelect(product)}
              className={`
                w-full
                text-left
                px-4
                py-3
                transition
                hover:bg-muted

                ${
                  focusedIndex === index
                    ? "bg-muted"
                    : ""
                }
              `}
            >
              <div className="flex justify-between">
                <span>
                  {product.code} — {product.name}
                </span>
                <span>
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
})
