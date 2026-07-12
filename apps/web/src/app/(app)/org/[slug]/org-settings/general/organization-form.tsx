'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useFormState } from '@/hooks/use-form-state'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { createOrganizationAction } from './actions'
import { updateOrganizationAction } from './actions'
import { useOrganizationForm } from './use-organization-form'
import { formatCpfCnpj } from '@/utils/formata-cpf-cnpj'
import { Checkbox } from '@/components/ui/checkbox'

interface OrganizationFormProps {
  isUpdating?: boolean
  initialData: Organization
}

type Organization = {
  id: string
  name: string
  domain: string
  slug: string
  cpfCnpj: string
  personType: string
  shouldAttachUsersByDomain: boolean
}

export function OrganizationForm({
  isUpdating,
  initialData,
}: OrganizationFormProps) {
  const form = useOrganizationForm({
    initialValues: initialData,
  })

  const formatedCpfCnpj = formatCpfCnpj(initialData.cpfCnpj)

  const formAction = isUpdating
    ? updateOrganizationAction
    : createOrganizationAction

  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(formAction)

  const { watch } = form
  const selectedPersonType = watch('personType')
  const inputSize = selectedPersonType === 'FISICA' ? 14 : 18

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Falha ao salvar a Organização</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        {success === true && message && (
          <Alert variant="success">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel className="font-semibold">Organização</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="name"
                    // defaultValue={initialData?.name}
                    placeholder="Digite o nome da Organização"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors?.name && (
            <span className="text-xs font-medium text-red-500">
              {errors.name[0]}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <FormField
            control={form.control}
            name="personType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Indique se a Organização é uma Pessoa Física ou Jurídica.
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex flex-row gap-4"
                    // defaultValue={field.value}
                    onValueChange={field.onChange}
                    {...field}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="juridica" value="JURIDICA" />
                      <Label htmlFor="juridica">Pessoa Jurídica</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="fisica" value="FISICA" />
                      <Label htmlFor="fisica">Pessoa Física</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-1">
          <FormField
            control={form.control}
            name="cpfCnpj"
            render={({ field: { onChange, ...props } }) => (
              <FormItem>
                <FormLabel className="font-semibold">CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="cpfCnpj"
                    onChange={(e) => {
                      const { value } = e.target
                      e.target.value = formatCpfCnpj(value)
                      onChange(e)
                    }}
                    placeholder="Digite um CPF ou CNPJ"
                    maxLength={inputSize}
                    defaultValue={formatedCpfCnpj ?? undefined}
                    {...props}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors?.cpfCnpj && (
            <span className="text-xs font-medium text-red-500">
              {errors.cpfCnpj[0]}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Dominio do e-mail
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="domain"
                    inputMode="url"
                    placeholder="minhaempresa.com.br"
                    defaultValue={initialData?.domain ?? undefined}
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <Checkbox
              name="shouldAttachUsersByDomain"
              id="shouldAttachUsersByDomain"
              className="translate-y-0.5"
              defaultChecked={initialData?.shouldAttachUsersByDomain}
            />
            <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
              <span className="text-sm leading-none font-medium">
                Automaticamente vincular novos membros
              </span>
              <p className="text-muted-foreground text-sm">
                Isto automaticamente convidará todos os membros com o mesmo
                domínio de e-mail para esta organização
              </p>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Salvar Organização'
          )}
        </Button>
      </form>
    </Form>
  )
}
