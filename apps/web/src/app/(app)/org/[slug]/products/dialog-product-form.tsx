'use client';

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod';

export interface UseDialogProductFormProps {
    isUpdating?: boolean;
    initialValues?: {
        name: string;
        code: string;
        price: string;
        measureUnit: string;
    }
}

const formSchema = z.object({
    id: z.int().optional(),
    name: z.string().min(1, { message: 'O nome do produto é obrigatório'}),
    code: z.string().min(1, { message: 'O código do produto é obrigatório'}),
    price: z.string().min(1, { message: 'O valor do produto é obrigatório'}),
    measureUnit: z.string().min(1, { message: 'A unidade do produto é obrigatória'}),
});

export type DialogProductFormData = z.infer<typeof formSchema>;

export function UseDialogProductForm({ isUpdating, initialValues }: UseDialogProductFormProps) {
    return useForm<DialogProductFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: initialValues || {
        name: '',
        code: '',
        price: '',
        measureUnit: 'kilo'
      }
    })
}