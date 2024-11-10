import React from 'react';
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CREATE_PAYMENT_FOR_ORDER_MUTATION } from "@/utils/graphql/mutations/payments";
import { useMutation } from "@apollo/client";
import { toast } from "@/hooks/use-toast";
import {OrderProps} from "@/utils/interfaces";
import {PaymentType} from "@/utils/enums";

interface OrdersTableProps {
    orders: OrderProps[];
    refetch: () => void;
}

const FormSchema = z.object({
    paymentType: z.enum(["CASH", "CARD", "OTHER"], {
        message: "El tipo de pago no puede estar vacío",
    }),
});

interface OrderPaymentFormProps {
    orderId: string;
    refetch: () => void;
}

const OrderPaymentForm = ({ orderId, refetch}: OrderPaymentFormProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const [orderPayment, { loading }] = useMutation(CREATE_PAYMENT_FOR_ORDER_MUTATION);

    const handleOrderPayment = async (data: z.infer<typeof FormSchema>) => {
        console.log("test:", data.paymentType);
        try {
            await orderPayment({
                variables: {
                    type: data.paymentType as PaymentType,
                    orderId: orderId,
                },
            });
            toast({
                title: "Pago realizado",
                description: "El pago para la mesa ha sido realizado con éxito",
            });
            refetch();
        } catch (e) {
            toast({
                title: "Error",
                description: "Ha ocurrido un error al realizar el pago",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOrderPayment)}>
                <div className={"flex"}>
                    <FormField
                        control={form.control}
                        name="paymentType"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Metodo de pago" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="CASH">Efectivo</SelectItem>
                                                <SelectItem value="CARD">Tarjeta</SelectItem>
                                                <SelectItem value="OTHER">Otro</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <CardFooter>
                        <Button type="submit">{loading ? "Cargando…" : "Guardar pago"}</Button>
                    </CardFooter>
                </div>
            </form>
        </Form>
    );
};

export function OrdersSeparatedPayment({ orders, refetch }: OrdersTableProps) {
    return (
        <div className={"grid-auto"}>
            {orders &&
                orders.map((order) => (
                    <Card key={order.id} className="cursor-pointer hover:bg-gray-100">
                        <CardHeader>
                            <p className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                {order.item.title} : ${order.item.price} COP
                            </p>
                        </CardHeader>
                        <CardFooter>
                            <OrderPaymentForm orderId={order.id} refetch={refetch} />
                        </CardFooter>
                    </Card>
                ))}
        </div>
    );
}
