import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import type { Item } from "@prisma/client";
import ItemCard from "@/molecules/itemCard";
import { Undo2 } from "lucide-react";

const AllItemsQuery = gql`
  query {
    items {
      id
      title
      description
      price
      imageUrl
    }
  }
`;

const Menu = () => {
  const { data, loading, error } = useQuery(AllItemsQuery);
  const router = useRouter();
  const { tableID } = router.query;

  if (loading) return <p className="text-center text-gray-600">Cargando...</p>;
  if (error) return <p className="text-center text-red-600">Oh no... {error.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-200 p-6 md:p-10">
      <button
        onClick={() => router.back()}
        className="flex mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
      >
        <Undo2 />Regresar
      </button>
      <h1 className="text-5xl font-bold text-center text-orange-800 mb-10">Nuestro Menú</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item: Item) => (
          <ItemCard key={item.id} item={item} tableID={tableID} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
