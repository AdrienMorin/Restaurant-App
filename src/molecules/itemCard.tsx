import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { Item } from "@prisma/client";
import { gql, useMutation } from "@apollo/client";
import { toast } from "@/hooks/use-toast";

interface ItemCardProps {
  item: Item;
  tableId?: string | string[];
}

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($tableId: ID!, $itemId: ID!, $paymentId: ID) {
    createOrder(tableId: $tableId, itemId: $itemId, paymentId: $paymentId) {
      id
      status
      createdAt
    }
  }
`;


export default function ItemCard({ item, tableId }: ItemCardProps) {
  const [createOrder, { loading }] = useMutation(CREATE_ORDER_MUTATION);

  const handleOrderNow = async () => {
    if (!tableId) {
      alert("Table ID is missing!");
      return;
    }

    try {
      const { data } = await createOrder({
        variables: {
          tableId: tableId,
          itemId: item.id,
          paymentId: null,
        },
      });
      toast({
        title: "Orden creada",
        description: "Tu orden ha sido creada exitosamente con el id " + data.createOrder.id,
      });
      console.log("Order created:", data.createOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al crear tu orden.",
      });
    }
  };
  

  return (
    <Card className="overflow-hidden shadow-lg rounded-lg hover:scale-105 transition transform">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">{item.title}</CardTitle>
        <CardDescription className="text-gray-600">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-4">
        <p className="text-xl font-bold text-orange-700">${item.price}</p>
        {tableId && (
          <button
            onClick={handleOrderNow}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center justify-center"
          >
            {loading 
            ?  "Cargando ... "
            :  "Ordenar Ahora"}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
