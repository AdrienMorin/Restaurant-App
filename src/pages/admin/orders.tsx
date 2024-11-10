import {useMutation, useQuery} from "@apollo/client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast";
import dayjs from "dayjs"; // Add dayjs for date formatting
import AdminLayout from "@/layouts/_layout";
import {GET_ORDERS_QUERY} from "@/utils/graphql/queries/orders";
import {SET_ORDER_STATUS_MUTATION} from "@/utils/graphql/mutations/orders";
import {OrderProps} from "@/utils/interfaces";
import useMiddleware from "@/hooks/useMiddleware";
import IsLoading from "@/molecules/isLoading";
import {Role, states} from "@/utils/enums";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500 text-white";
    case "PREPARING":
      return "bg-blue-500 text-white";
    case "READY":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const OrdersPage: React.FC = () => {
  const user = useMiddleware(Role.USER);

  const { data, loading, error } = useQuery(GET_ORDERS_QUERY);
  const [setOrderStatus] = useMutation(SET_ORDER_STATUS_MUTATION);

  if (loading) return <IsLoading/>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  // Filter orders by status and group by table
  const filteredOrders = data.orders.filter((order: OrderProps) =>
    ["PENDING", "PREPARING", "READY"].includes(order.status)
  );

  const ordersByTable = filteredOrders.reduce((acc: { [tableNumber: string]: typeof filteredOrders }, order: OrderProps) => {
    const tableNumber = order.table?.number ?? "N/A";
    if (!acc[tableNumber]) acc[tableNumber] = [];
    acc[tableNumber].push(order);
    return acc;
  }, {} as { [tableNumber: string]: typeof filteredOrders });

  // Handler to change order status
  const handleChangeStatus = async (orderId: string, newStatus: string) => {
    try {
      await setOrderStatus({
        variables: { id: orderId, status: newStatus },
        refetchQueries: [{ query: GET_ORDERS_QUERY }],
      });
      toast({
        title: "Estado actualizado",
        description: `La orden ha sido cambiada a ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la orden.",
      });
    }
  };

  if (!user) {
    return <IsLoading/>;
  }

  return (
    <AdminLayout user={user}>
      <div className="p-6 md:p-10 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Órdenes</h1>
        {Object.keys(ordersByTable).map((tableNumber) => (
          <div key={tableNumber} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Mesa {tableNumber}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ordersByTable[tableNumber].map((order: OrderProps) => (
                <Card key={order.id} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Orden #{order.id}</span>
                      <Badge className={`${getStatusColor(order.status)} capitalize`}>
                        {states[order.status.toLowerCase()]}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      <strong>Item:</strong> {order.item?.title ?? "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Precio:</strong> ${order.item?.price.toFixed(2) ?? "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Tipo de pago:</strong> {order.payment?.type ?? "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Fecha de creación:</strong> {dayjs(Number(order.createdAt)).format("DD/MM/YYYY HH:mm")}
                    </p>
                    <div className="mt-4 flex space-x-2">
                      {order.status === "PENDING" && (
                        <Button onClick={() => handleChangeStatus(order.id, "PREPARING")}>
                          Cambiar a Preparando
                        </Button>
                      )}
                      {order.status === "PREPARING" && (
                        <Button onClick={() => handleChangeStatus(order.id, "READY")}>
                          Cambiar a Listo
                        </Button>
                      )}
                      {order.status === "READY" && (
                        <Button onClick={() => handleChangeStatus(order.id, "DELIVERED")}>
                          Cambiar a Entregado
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
