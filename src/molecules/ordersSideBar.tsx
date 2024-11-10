import { useQuery, useMutation } from "@apollo/client";
import { OrderProps } from "@/utils/interfaces";
import { Button } from "@/components/ui/button";
import {GET_ORDERS_BY_TABLE_ID} from "@/utils/graphql/queries/orders";
import {CANCEL_ORDER_MUTATION} from "@/utils/graphql/mutations/orders";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {Badge} from "@/components/ui/badge";
import {getStatusColor} from "@/pages/admin/orders";
import {states} from "@/utils/enums";
import * as React from "react";
import {Card} from "@/components/ui/card";
import {ChevronDown, ChevronUp, RotateCcw, Trash2} from "lucide-react";
import {Icons} from "@/components/ui/icons";
import {toast} from "@/hooks/use-toast";
import {useState} from "react";
import {useRouter} from "next/router";


const OrdersSideBar = () => {
    const router = useRouter();
    const { tableId } = router.query;
    const { data, loading, error, refetch } = useQuery(GET_ORDERS_BY_TABLE_ID, {
        variables: { tableId },
    });
    const [isRefetching, setIsRefetching] = React.useState(false);
    const [cancellingOrderId, setCancellingOrderId] = React.useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const tableIdString = Array.isArray(tableId) ? tableId[0] : tableId;

    const toggleSidebar = async () => {
        setIsSidebarOpen(!isSidebarOpen);
        await refetch();
    };

    const [cancelOrder] = useMutation(CANCEL_ORDER_MUTATION, {
        onCompleted: () => refetch(),
    });

    if (error) return <p className="text-center text-red-600">Oh no... {error.message}</p>;

    const handleCancelOrder = async (orderId: string) => {
        setCancellingOrderId(orderId);
        try {
            await cancelOrder({ variables: { id: orderId } });
        } catch (error) {
            toast({
                title: "Tu orden está en preparación",
                description: "No puedes cancelar una orden que ya está en preparación.",
            });
        }
        setCancellingOrderId(null);
    };

    const handleRefetch = async () => {
        setIsRefetching(true);
        await refetch();
        setIsRefetching(false);
    }

    return (
        <main>
            {isSidebarOpen ? (
                <div className="fixed inset-0.5 flex flex-col items-center bg-black bg-opacity-50">
                    <div className={"h-full w-full"} onClick={toggleSidebar}></div>
                    <div
                        className="fixed bg-white p-6 rounded-t-lg shadow-lg bottom-0 w-full flex flex-col items-center justify-center">
                        <div>
                            <Button onClick={toggleSidebar}
                                    className={"flex flex-col p-4 h-14 w-80 gap-0 justify-center items-center"}>
                                <ChevronDown/>
                            </Button>
                        </div>
                        <div className={"flex flex-col w-full mt-4 justify-center items-center"}>
                            <h2 className="text-2xl font-bold mb-4">Ordenes de la mesa</h2>
                            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                                <div className="flex w-max space-x-4 p-4">
                                    {data.getOrdersByTableId.map((order: OrderProps) => (
                                        <figure key={order.id} className="shrink-0">
                                            <Card className={"p-2 flex flex-col items-center"}>
                                                <Badge className={`${getStatusColor(order.status)} capitalize`}>
                                                    {states[order.status.toLowerCase()]}
                                                </Badge>
                                                <p className={"text-xl font-semibold text-gray-800"}>{order.item.title}</p>
                                                <img
                                                    src={order.item.imageUrl}
                                                    alt={order.item.title}
                                                    className="w-32 h-32 object-cover"
                                                />
                                                {order.status === "PENDING" && (
                                                    <Button
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        disabled={cancellingOrderId === order.id}
                                                        variant={"outline"}
                                                        className="mt-2 bg-gray-200"
                                                    >
                                                        {cancellingOrderId === order.id ? (
                                                            <><Icons.spinner className="mr-2 h-4 w-4 animate-spin"/></>
                                                        ) : <><Trash2/>Cancelar</>}
                                                    </Button>
                                                )}
                                            </Card>
                                        </figure>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal"/>
                            </ScrollArea>
                            <div className={"flex gap-4 mt-4"}>
                                <Button
                                    onClick={handleRefetch}
                                    disabled={isRefetching}
                                >
                                    {isRefetching ? (
                                        <><Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>Cargando ...</>
                                    ) : <><RotateCcw/>Refrescar</>}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={"w-full fixed bottom-0 flex justify-center"}>
                    {tableIdString && (
                        <Button onClick={toggleSidebar}
                                className={"flex flex-col p-4 h-14 w-80 gap-0 justify-center items-center"}>
                            <ChevronUp className={""}/>
                            <p className={"text-lg"}>Ver las ordenes</p>
                        </Button>
                    )}
                </div>
            )}
        </main>
    );
};

export default OrdersSideBar;
