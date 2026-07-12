'use client'

import { Plus } from 'lucide-react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'

import { DialogProduct } from './dialog-product'
import { DataTable } from '@/components/data-table'
import { useProductColumns } from './columns'

// type Product = {
//   id: string
//   name: string
//   code: string
//   price: number
//   measureUnit: string
//   status: boolean
// }

type ListProps = {
  productList: {
    id: string
    code: string
    name: string
    price: number
    measureUnit: string
    status: boolean
  }[]
  canCreate?: boolean
}

export default function ProductList({ productList }: ListProps) {
  const {
    columns,
    isDialogOpened,
    setIsDialogOpened,
    editingProduct,
    setEditingProduct,
  } = useProductColumns()

  return (
    <Dialog
      open={isDialogOpened}
      onOpenChange={(open) => {
        setIsDialogOpened(open)

        if (!open) {
          setEditingProduct(null)
        }
      }}
    >
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold md:text-2xl">
              Produtos
            </CardTitle>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 rounded-full" />
              </Button>
            </DialogTrigger>
          </CardHeader>

          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault()
              setIsDialogOpened(false)
              setEditingProduct(null)
            }}
          >
            <DialogProduct
              closeModal={() => {
                setIsDialogOpened(false)
                setEditingProduct(null)
              }}
              isUpdating={editingProduct ? true : false}
              productId={editingProduct ? editingProduct.id : undefined}
              initialValues={
                editingProduct
                  ? {
                      name: editingProduct.name,
                      code: editingProduct.code,
                      price: editingProduct.price.toFixed(2).replace('.', ','),
                      // price: (editingProduct.price / 100).toFixed(2).replace('.', ','),
                      measureUnit: editingProduct.measureUnit,
                    }
                  : undefined
              }
            />
          </DialogContent>

          <CardContent>
            <div className="space-y-2">
              <div className="border-0">
                <DataTable columns={columns} data={productList} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Dialog>
  )
}
