'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormState } from '@/hooks/use-form-state'

import { AlertTriangle, Loader2 } from "lucide-react";

import { OrganizationSchema } from "./actions";
import { createOrganizationAction } from "./actions";
import { updateOrganizationAction } from "./actions";
import { useState } from "react";

interface OrganizationFormProps {
    isUpdating?: boolean,
    initialData?: OrganizationSchema
}

export function OrganizationForm({ isUpdating, initialData }: OrganizationFormProps) {
    const [selectedValue, setSelectedValue] = useState("");
    const formAction = isUpdating ? updateOrganizationAction : createOrganizationAction
   
    const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
        formAction,
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {success === false && message && (
                <Alert variant="destructive">
                    <AlertTriangle className="size-4"/>
                    <AlertTitle>Falha ao salvar a Organização</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}
            
            {success === true && message && (
                <Alert variant="success">
                    <AlertTriangle className="size-4"/>
                    <AlertTitle>Sucesso!</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-1">
                <Label htmlFor="name">Nome da Organização</Label>
                <Input 
                    type="text" 
                    name="name"  
                    id="name" 
                    defaultValue={initialData?.name}
                />

                {errors?.name && (
                    <span className="text-xs font-medium text-red-500">{errors.name[0]}</span>
                )}
            </div>
            
            

            <div className="space-y-1">
                <RadioGroup 
                    defaultValue="JURIDICA"  
                    onValueChange={setSelectedValue}
                    className="flex flex-row gap-4" 
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="JURIDICA" id="juridica" />
                        <Label htmlFor="juridica">Pessoa Jurídica</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="FISICA" id="fisica" />
                        <Label htmlFor="fisica">Pessoa Física</Label>
                    </div>
                </RadioGroup>
            </div>

            
            <div className="space-y-1">
                <Label htmlFor="cpfCnpj">CNPJ/CPF</Label>
                <Input 
                    type="text" 
                    name="cpfCnpj"  
                    id="cpfCnpj" 
                    inputMode="numeric" 
                    placeholder="04674405300"
                    defaultValue={initialData?.cpfCnpj ?? undefined}
                />

                {errors?.cpfCnpj && (
                    <span className="text-xs font-medium text-red-500">{errors.cpfCnpj[0]}</span>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="domain">Domínio do e-mail</Label>
                <Input 
                    type="text" 
                    name="domain"  
                    id="domain" 
                    inputMode="url" 
                    placeholder="exemplo.com"
                    defaultValue={initialData?.domain ?? undefined}
                />

                {errors?.domain && (
                    <span className="text-xs font-medium text-red-500">{errors.domain[0]}</span>
                )}
            </div>

            <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                    <Checkbox
                        name="shouldAttachUsersByDomain"
                        id="shouldAttachUsersByDomain"
                        className=" translate-y-0.5"
                         defaultChecked={initialData?.shouldAttachUsersByDomain}
                    />
                    <label 
                        htmlFor="shouldAttachUsersByDomain" 
                        className="space-y-1"
                    >
                        <span className="text-sm font-medium leading-none">
                            Automaticamente vincular novos membros
                        </span>
                        <p className="text-sm text-muted-foreground">
                            Isto automaticamente convidará todos os membros com o mesmo domínio de e-mail para esta organização
                        </p>
                    </label>
                </div>
                
                {errors?.shouldAttachUsersByDomain && (
                    <span className="text-xs font-medium text-red-500">{errors.shouldAttachUsersByDomain[0]}</span>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin"/>
                    )  : (
                        'Salvar Organização'
                    )}
                </Button>
        </form>
    )
}