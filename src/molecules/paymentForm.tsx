import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@apollo/client";
import { GET_TABLE_BY_ID } from "@/utils/graphql/queries/tables";
import { OrdersTable } from "@/molecules/ordersTable";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { CREATE_PAYMENT_FOR_TABLE_MUTATION } from "@/utils/graphql/mutations/payments";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {OrdersSeparatedPayment} from "@/molecules/ordersSeparatedPayment";
import {PaymentType} from "@/utils/enums";

const FormSchema = z.object({
    paymentType: z.enum(["CASH", "CARD", "OTHER"], {
        message: "El tipo de pago no puede estar vacío",
    }),
});

export default function PaymentForm({ tableId }: { tableId: string }) {
    const { data, refetch } = useQuery(GET_TABLE_BY_ID, {
        variables: { id: tableId },
        skip: !tableId,
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const [tablePayment, { loading }] = useMutation(CREATE_PAYMENT_FOR_TABLE_MUTATION);

    const handleTablePayment = async (data: z.infer<typeof FormSchema>) => {
        console.log("test:", data.paymentType);
        try {
            await tablePayment({
                variables: {
                    type: data.paymentType as PaymentType,
                    tableId: tableId,
                }
            });
            toast({
                title: "Pago realizado",
                description: "El pago para la mesa ha sido realizado con éxito",
            });
            refetch();
        } catch (e) {
            console.error(e);
            toast({
                title: "Error de pago",
                description: "El pago para la mesa no ha podido ser realizado",
            });
        }
    };

    return (
        <Tabs defaultValue="mesa" className="w-[400px]">
            <TabsList className="flex w-full ">
                <TabsTrigger value="mesa" className={"w-full"}>Pagar toda la mesa</TabsTrigger>
                <TabsTrigger value="items" className={"w-full"}>Pagar separados</TabsTrigger>
            </TabsList>
            <TabsContent value="mesa">
                <Card>
                    <CardHeader>
                        <CardTitle>Ordenes de la mesa</CardTitle>
                        <CardDescription>
                            Aquí puedes ver todas las ordenes de la mesa.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <OrdersTable orders={data?.getTableById.orders} />
                    </CardContent>
                    <CardFooter>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleTablePayment)}>
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
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="items">
                <Card>
                    <CardHeader>
                        <CardTitle>Pagar separados</CardTitle>
                        <CardDescription>
                            Aquí puedes pagar las ordenes de la mesa de forma separada.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <OrdersSeparatedPayment orders={data?.getTableById.orders} refetch={refetch} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
