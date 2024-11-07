import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useMutation } from "@apollo/client";
import { toast } from "@/hooks/use-toast";
import {CREATE_ORDER_MUTATION} from "@/utils/graphql/mutations/orders";
import {ItemCardProps} from "@/utils/interfaces";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/ui/icons";
import * as React from "react";

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
        description: "Tu orden ha sido creada exitosamente",
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
          <Button
            onClick={handleOrderNow}
            disabled={loading}
          >
            {loading ? (
              <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" />Cargando ...</>
          ) : "Ordenar Ahora"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
