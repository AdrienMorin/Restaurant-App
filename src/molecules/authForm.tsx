"use client";

import * as React from "react";
import { useMutation } from "@apollo/client";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {LOGIN_MUTATION} from "@/utils/graphql/mutations/auth";
import {useRouter} from "next/router";
import {toast} from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [login, { data, error }] = useMutation(LOGIN_MUTATION);
    const [wrongPassword, setWrongPassword] = React.useState<boolean>(false);
    const router = useRouter();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await login({
                variables: { email, password },
            });

            if (result.data.login) {
                localStorage.setItem("token", result.data.login.token);
                await router.push('/admin');
            }
        } catch (err) {
            toast({
                title: "Erreur",
                description: "Utilisateur ou mot de passe incorrect",
            });
            setWrongPassword(true);

        }

        setIsLoading(false);
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">
                            Contraseña
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            placeholder="contraseña"
                            type="password"
                            disabled={isLoading}
                        />
                    </div>
                    {
                        wrongPassword && (
                            <p className={"text-red-500 text-center"}>Usuario o contraseña incorrectos</p>
                        )
                    }
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Conectar
                    </Button>
                </div>
            </form>
        </div>
    );
}
