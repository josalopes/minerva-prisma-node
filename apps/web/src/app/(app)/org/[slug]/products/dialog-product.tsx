import { useState } from 'react';
import { useParams } from 'next/navigation';

import { AlertTriangle } from 'lucide-react';

import { 
    Alert, 
    AlertDescription, 
    AlertTitle
 } from '@/components/ui/alert';

import { 
    Dialog, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle
 } from '@/components/ui/dialog';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

import { queryClient } from '@/lib/react-query';
import { useFormState } from '@/hooks/use-form-state'
import { UseDialogProductForm } from './dialog-product-form';
import { ProductSchema } from './schemas';
import { createProductAction, updateProductAction } from './actions';

interface DialogProductProps {
    closeModal: () => void;
    isUpdating?: boolean;
    productId?: string;
    initialValues?: ProductSchema
}

export function DialogProduct({ closeModal, isUpdating, productId, initialValues }: DialogProductProps) {
    
    const { slug: org } = useParams<{ slug: string }>()
    
    const formAction = isUpdating 
        ? (data: FormData) => updateProductAction({
            productId: productId!,
            name: data.get('name') as string,
            code: data.get('code') as string,
            price: data.get('price') as string,
            measureUnit: data.get('measureUnit') as string,
          })
        : createProductAction

    
    const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
        formAction,
        () => {
            queryClient.invalidateQueries({
                queryKey: [org, 'products']
            })
        },
    )

    const [isLoading, setIsLoading] = useState(false);
    const form = UseDialogProductForm({ isUpdating, initialValues });

    function handleCloseModal() {
        form.reset();
        closeModal();
    }

    function formatCurrency(event: React.ChangeEvent<HTMLInputElement>) {
        let { value } = event.target;
        value = value.replace(/\D/g, '');

        if (value) {
            value = (parseInt(value, 10) / 100).toFixed(2);
            value = value.replace('.', ',');
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        event.target.value = value;
        form.setValue('price', value);
    }

    return (
        <Dialog>
            <DialogHeader>
                <DialogTitle>Produto</DialogTitle>
                <DialogDescription>
                    Adicionar novo
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form className='space-y-2' onSubmit={handleSubmit}>

                    {success === false && message && (
                        <Alert variant='destructive'>
                            <AlertTriangle className='size-4'/>
                            <AlertTitle>Falha ao salvar o produto</AlertTitle>
                            <AlertDescription>
                                <p>{message}</p>
                            </AlertDescription>
                        </Alert>
                    )}
            
                    {success === true && message && (
                        <Alert>
                            <AlertTriangle className='size-4'/>
                            <AlertTitle>Sucesso ao salvar o produto!</AlertTitle>
                            <AlertDescription>
                                <p>{message}</p>
                            </AlertDescription>
                        </Alert>
                    )}                    
                    <div>
                        <FormField 
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='my-2'>
                                    <FormLabel className='font-semibold'>Nome do Produto</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder='Informe o nome do produto'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField 
                            control={form.control}
                            name='code'
                            render={({ field }) => (
                                <FormItem className='my-2'>
                                    <FormLabel className='font-semibold'>Código do Produto</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder='Informe o código do produto'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem className='my-2'>
                                    <FormLabel className='font-semibold'>Valor do Produto</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            placeholder='Ex. 120,00'
                                            onChange={formatCurrency}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField 
                            control={form.control}
                            name='measureUnit'
                            render={({ field }) => (
                                <FormItem className='my-2'>
                                    <FormLabel className='font-semibold'>Unidade</FormLabel>
                                    <FormControl>
                                        <RadioGroup 
                                            {...field} 
                                            className="flex flex-row space-x-4" 
                                            defaultValue={field.value} 
                                            onValueChange={field.onChange}
                                        >
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem 
                                                    id='kilo' 
                                                    value='kilo' 
                                                />
                                                <Label htmlFor='kilo'>Kilo</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem 
                                                    id='litro' 
                                                    value='litro' 
                                                />
                                                <Label htmlFor='v2'>Litro</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button 
                            type='submit' 
                            className='w-full font-semibold text-white bg-emerald-500 mt-2'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Carregando...' : `${isUpdating ? 'Atualizar' : 'Cadastrar'}` }
                        </Button>
                    </div>
                </form>
            </Form>
        </Dialog>
    )
}

