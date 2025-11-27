'use client'

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { signInWithLoginCodeAndPassword } from './actions'
import { useFormState } from '@/hooks/use-form-state'

export function SignInLoginCodeForm() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
        signInWithLoginCodeAndPassword,
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
                    <Label htmlFor="login">Código de login</Label>
                    <Input type="login" name="login"  id="login" defaultValue={searchParams.get('login') ?? ''} />

                    {errors?.login && (
                        <span className="text-xs font-medium text-red-500">{errors.login[0]}</span>
                    )}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="password">Senha</Label>
                    <Input type="password" name="password"  id="password"/>

                    {errors?.password && (
                        <span className="text-xs font-medium text-red-500">{errors.password[0]}</span>
                    )}

                </div>
                    <Link href="/auth/forgot-password" className="text-xs text-foreground hover:underline">
                        Esqueceu sua senha?
                    </Link>
                <div>

                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin"/>
                    )  : (
                        'Entrar'
                    )}
                </Button>

                <Button variant="link" className="w-full size=sm" asChild>
                    <Link href="/auth/sign-up">
                        Criar nova conta
                    </Link>
                </Button>

            </form>    
        </div>
    )
}

