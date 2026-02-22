'use client'

import Link from "next/link";
// import Image from "next/image";
import { useTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import { Loader2, AlertTriangle, EyeOffIcon, EyeIcon } from "lucide-react";

// import githubIcon from "@/assets/github-icon.svg"
import { signInWithEmailAndPassword } from './actions'
import { useFormState } from '@/hooks/use-form-state'
import { signInWithCode, signInWithGithub } from "../actions";

export function ResetPasswordForm() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
        signInWithEmailAndPassword,
        () => {
            router.push('/')
        }
    )

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {success === false && message && (
                    <Alert variant="destructive">
                        <AlertTriangle className="size-4"/>
                        <AlertTitle>Falha ao realizar login!</AlertTitle>
                        <AlertDescription>
                            <p>{message}</p>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-1">
                    <Label htmlFor="email">E-mail</Label>
                    <Input type="email" name="email"  id="email" />
                    {/* <Input type="email" name="email"  id="email" defaultValue={searchParams.get('email') ?? ''} /> */}

                    {errors?.email && (
                        <span className="text-xs font-medium text-red-500">{errors.email[0]}</span>
                    )}
                </div>

                <div className='w-full space-y-1'>
                    <Label className='leading-5' htmlFor='password'>
                    Nova senha*
                    </Label>
                    <div className='relative'>
                        <Input
                            id='password'
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder='••••••••••••••••'
                            className='pr-9'
                        />

                        {errors?.password && (
                            <span className="text-xs font-medium text-red-500">{errors.password[0]}</span>
                        )}

                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setIsPasswordVisible(prevState => !prevState)}
                            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
                        >
                            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                            <span className='sr-only'>{isPasswordVisible ? 'Hide password' : 'Show password'}</span>
                        </Button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className='w-full space-y-1'>
                    <Label className='leading-5' htmlFor='confirmPassword'>
                        Confirmar senha*
                    </Label>
                    <div className='relative'>
                    <Input
                        id='confirmPassword'
                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                        placeholder='••••••••••••••••'
                        className='pr-9'
                    />
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setIsConfirmPasswordVisible(prevState => !prevState)}
                        className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
                    >
                        {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                        <span className='sr-only'>{isConfirmPasswordVisible ? 'Hide password' : 'Show password'}</span>
                    </Button>
                    </div>
                </div>

                {/* <div className="space-y-1">
                    <Label htmlFor="password">Senha</Label>
                    <Input type="password" name="password"  id="password"/>

                    {errors?.password && (
                        <span className="text-xs font-medium text-red-500">{errors.password[0]}</span>
                    )}
                </div> */}


                <Button variant="link" className="w-full size=sm" asChild>
                    <Link href="/auth/sign-up">
                        Criar nova conta
                    </Link>
                </Button>

            </form>    

        </div>
    )
}

