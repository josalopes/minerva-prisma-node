"use client"

import { useState } from "react"

import { ArrowUpDown, Pencil, X } from "lucide-react"
import { toast } from "sonner"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { deleteProductAction } from "./actions"
import { formatCurrency } from "@/utils/formatCurrency"

export type Product = {
  id: string
  name: string
  code: string
  price: number
  measureUnit: string
  status: boolean
}

export function useProductColumns() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [editingProduct, setEditingProduct] = useState<null | Product>(null);
  
  async function handleEditProduct(product: Product) {
      setEditingProduct(product);
      setIsDialogOpened(true);
  }

  async function handleDeleteProduct(productCode: string) {
        const response = await deleteProductAction(productCode);

        if (!response.success) {
            toast(response.message);
            return;
        }

        toast.success(response.message);
    }

  const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown />
        </Button>
      )
    },
    
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Código
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("code")}</div>,
  },
  {
    header: () => <div className="text-right">Preço</div>,
    accessorKey: "price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
 
      return <div className="font-medium text-right">{formatCurrency(amount)}</div>
      // return <div className="font-medium text-right">{formatCurrency(amount / 100)}</div>
    },
  },
  {
    accessorKey: "measureUnit",
    header: "Unidade",
    cell: ({ row }) => <div className="font-medium">{row.getValue("measureUnit")}</div>,
  },
  {
    id: "edit",
    cell: ({ row }) => {
      const product = row.original
 
      return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditProduct(product)}
                    >
                    <Pencil className="w-4 h-4"/>  
                </Button>
            </TooltipTrigger>
            <TooltipContent>Editar produto</TooltipContent>
        </Tooltip>
      )
    },
  },
  {
    id: "delete",
    cell: ({ row }) => {
      const product = row.original
 
      return (
            <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                          variant="ghost"
                          size="icon"
                          >
                          <X className="w-4 h-4"/>  
                      </Button>
                      </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Excluir produto</TooltipContent>
                </Tooltip>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Exclusão de produto</AlertDialogTitle>
                  <AlertDialogDescription>Confirma a exclusão deste produto?: {product.name}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:justify-between">
                <div className="flex gap-2">
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleDeleteProduct(product.code)} 
                  >
                    Excluir
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
      )
    },
  },
]
  return {
      columns,
      isDialogOpened,
      setIsDialogOpened,
      editingProduct,
      setEditingProduct
    }

}



