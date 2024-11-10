import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import ItemCard from "@/molecules/itemCard";
import {ChevronUp, Undo2} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { AllItemsQuery } from "@/utils/graphql/queries/items";
import { ItemProps } from "@/utils/interfaces";
import OrdersSideBar from "@/molecules/ordersSideBar";

const Menu = () => {
    const { data, loading, error } = useQuery(AllItemsQuery);
    const router = useRouter();
    const { tableId } = router.query;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (loading) return <p className="text-center text-gray-600">Cargando...</p>;
    if (error) return <p className="text-center text-red-600">Oh no... {error.message}</p>;

    return (
        <main>
            <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-200 p-6 md:p-10">
                <Button
                    variant="secondary"
                    onClick={() => router.back()}
                    className="flex mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                    <Undo2/>Regresar
                </Button>
                <h1 className="text-5xl font-bold text-center text-orange-800 mb-10">Nuestro Menú</h1>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {data.items.map((item: ItemProps) => (
                        <ItemCard key={item.id} item={item} tableId={tableId}/>
                    ))}
                </div>
            </div>
            <div className={"w-full fixed bottom-0 flex justify-center"}>
                {tableId && (
                    <Button onClick={toggleSidebar} className={"flex flex-col p-4 h-14 w-80 gap-0 justify-center items-center"}>
                        <ChevronUp className={""}/>
                        <p className={"text-lg"}>Ver las ordenes</p>
                    </Button>
                )}
                {isSidebarOpen && tableId && <OrdersSideBar tableId={tableId} onClose={toggleSidebar}/>}
            </div>
            <Toaster/>
        </main>

    );
};

export default Menu;
