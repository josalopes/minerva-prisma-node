// 'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from '@/hooks/use-form-state'

import { createProductAction } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { queryClient } from "@/lib/react-query";

export function ProductForm() {
    const { slug: org } = useParams<{ slug: string }>()

    const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
        createProductAction,
        () => {
            queryClient.invalidateQueries({
                queryKey: [org, 'products']
            })
        },
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {success === false && message && (
                <Alert variant="destructive">
                    <AlertTriangle className="size-4"/>
                    <AlertTitle>Falha ao salvar o produto</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}
            
            {success === true && message && (
                <Alert>
                    <AlertTriangle className="size-4"/>
                    <AlertTitle>Sucesso!</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-1">
                <Label htmlFor="name">Nome</Label>
                <Input type="text" name="name"  id="name"/>

                {errors?.name && (
                    <span className="text-xs font-medium text-red-500">{errors.name[0]}</span>
                )}
            </div>
            
            <div className="space-y-1">
                <Label htmlFor="name">Código</Label>
                <Input type="text" name="code"  id="code"/>

                {errors?.code && (
                    <span className="text-xs font-medium text-red-500">{errors.code[0]}</span>
                )}
            </div>
            
            <div className="space-y-1">
                <Label htmlFor="name">Valor unitário</Label>
                <Input type="text" name="price"  id="price"
                />

                {errors?.price && (
                    <span className="text-xs font-medium text-red-500">{errors.price[0]}</span>
                )}
            </div>
            
            <div className="space-y-1">
                <Label htmlFor="name">Unidade</Label>
                <Input type="text" name="measureUnit"  id="measureUnit"
                />

                {errors?.measureUnit && (
                    <span className="text-xs font-medium text-red-500">{errors.measureUnit[0]}</span>
                )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin"/>
                    )  : (
                        'Salvar produto'
                    )}
                </Button>
        </form>
    )
}