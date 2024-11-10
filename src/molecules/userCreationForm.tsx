"use client"

import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { CREATE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { useRouter } from "next/router";
import {Icons} from "@/components/ui/icons";

const FormSchema = z.object({
    name: z.string().nonempty({
        message: "El nombre no puede estar vacío",
    }),
    email: z.string().email({
        message: "El email no es válido",
    }),
    password: z.string().nonempty({
        message: "La contraseña no puede estar vacía",
    }),
    role: z.enum(["USER", "ADMIN"], {
        required_error: "El rol es requerido",
    }),
});

export const UserCreationForm: React.FC = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "USER",
        },
    });

    const router = useRouter();
    const [createUser] = useMutation(CREATE_USER_MUTATION);
    const [loading, setLoading] = React.useState<boolean>(false);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            setLoading(true);
            await createUser({
                variables: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                },
            });
            toast({
                title: "Usuario añadido",
                description: "El usuario se ha añadido correctamente",
            });
            router.push({
                pathname: '/admin/users',
                query: { reload: true },
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Hubo un problema al añadir el usuario",
            });
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <select {...field} className="w-full p-2 border rounded">
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={loading}
                    className={"mt-4"}
                >
                    {loading ? (
                        <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" />Agregando ...</>
                    ) : <><Plus />Agregar</>}
                </Button>
            </form>
        </Form>
    );
};
