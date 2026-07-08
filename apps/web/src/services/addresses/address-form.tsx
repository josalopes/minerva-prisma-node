'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSchema, AddressFormData } from '@/schemas/address-schema'
import { formatZipCode } from '@/utils/format-zip'
import { fetchCep } from '@/utils/fetch-cep'
import { createAddress } from '@/http/address/create-address'

interface AddressFormProps {
  ownerType: string
  ownerId: string
  onSuccess?: () => void
}

export function AddressForm({
  ownerType,
  ownerId,
  onSuccess,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  })

  const zip = watch('zipCode')

  async function handleZipBlur() {
    const data = await fetchCep(zip)
    if (!data) return

    setValue('street', data.street)
    setValue('district', data.district)
    setValue('city', data.city)
    setValue('state', data.state)
  }

  async function onSubmit(data: AddressFormData) {
    await createAddress({
      ownerType,
      ownerId,
      ...data,
      country: data.country || 'BR',
      type: data.type || 'GENERAL',
    })

    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input
          {...register('zipCode')}
          placeholder="CEP"
          onChange={(e) =>
            setValue('zipCode', formatZipCode(e.target.value))
          }
          onBlur={handleZipBlur}
        />
        {errors.zipCode && <span>{errors.zipCode.message}</span>}
      </div>

      <div>
        <input {...register('street')} placeholder="Rua" />
        {errors.street && <span>{errors.street.message}</span>}
      </div>

      <div>
        <input {...register('number')} placeholder="Número" />
        {errors.number && <span>{errors.number.message}</span>}
      </div>

      <div>
        <input {...register('complement')} placeholder="Complemento" />
      </div>

      <div>
        <input {...register('district')} placeholder="Bairro" />
      </div>

      <div>
        <input {...register('city')} placeholder="Cidade" />
      </div>

      <div>
        <input {...register('state')} placeholder="UF" maxLength={2} />
      </div>

      <div>
        <select {...register('type')}>
          <option value="GENERAL">Geral</option>
          <option value="BILLING">Cobrança</option>
          <option value="SHIPPING">Entrega</option>
        </select>
      </div>

      <label>
        <input type="checkbox" {...register('isPrimary')} />
        Endereço principal
      </label>

      <button type="submit">
        Salvar endereço
      </button>
    </form>
  )
}