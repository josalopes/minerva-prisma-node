"use client"

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core"

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { useState } from "react"
import { AddressCard, Address } from "./address-card"

interface Props {
  addresses: Address[]
}

export function AddressSortableList({ addresses }: Props) {
  const [items, setItems] = useState(addresses)

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over?.id)

      setItems(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {items.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}