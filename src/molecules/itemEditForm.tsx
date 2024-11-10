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
import { Textarea } from "@/components/ui/textarea";
import {Check} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { EDIT_ITEM_MUTATION } from "@/utils/graphql/mutations/items";
import { useRouter } from "next/router";
import {ItemProps} from "@/utils/interfaces";

const FormSchema = z.object({
    price: z.string().nonempty({
        message: "El precio debe ser un número entero positivo",
    }),
    title: z.string().nonempty({
        message: "El título no puede estar vacío",
    }),
    description: z.string().nonempty({
        message: "La descripción no puede estar vacía",
    }),
    imageUrl: z.string().url({
        message: "La URL de la imagen no es válida",
    }),
});

export function ItemEditForm({ item }: { item: ItemProps }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            price: item.price.toString(),
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
        },
    });

    const router = useRouter();
    const [editItem] = useMutation(EDIT_ITEM_MUTATION);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            await editItem({
                variables: {
                    id: item.id,
                    title: data.title,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    price: parseFloat(data.price),
                },
            });
            toast({
                title: "Elemento editado",
                description: "El elemento se ha editado correctamente",
            });
            router.push({
                pathname: '/admin',
                query: { reload: true },
            });
        } catch (err) {
            toast({
                title: "Error",
                description: "Hubo un problema al editar el elemento",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input placeholder="Burger" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Háblenos un poco del producto"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Precio</FormLabel>
                            <FormControl>
                                <Input placeholder="14300" type={"number"} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL de la imagen</FormLabel>
                            <FormControl>
                                <Input placeholder="https://image.com/file.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className={"mt-4"}><Check />Validar</Button>
            </form>
        </Form>
    );
}
