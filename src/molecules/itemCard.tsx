import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { Item } from "@prisma/client";

interface ItemCardProps {
  item: Item;
  tableID?: string | string[];
}

const ItemCard: React.FC<ItemCardProps> = ({ item, tableID }) => {
  return (
    <Link href={`/products/${item.id}`} className="hover:scale-105 transition transform">
      <Card className="overflow-hidden shadow-lg rounded-lg">
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
          {tableID && (
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              Ordenar Ahora
            </button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ItemCard;
