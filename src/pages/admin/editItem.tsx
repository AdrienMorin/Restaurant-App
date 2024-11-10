"use client"

import AdminLayout from "@/layouts/_layout";
import { ItemEditForm } from "@/molecules/itemEditForm";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import {GET_ITEM_BY_ID} from "@/utils/graphql/queries/items";
import useMiddleware from "@/hooks/useMiddleware";
import IsLoading from "@/molecules/isLoading";
import {Role} from "@/utils/enums";

const EditItemPage: React.FC = () => {
    const user = useMiddleware(Role.USER);

    const router = useRouter();
    const { id } = router.query;

    const { data, loading, error } = useQuery(GET_ITEM_BY_ID, {
        variables: { id },
        skip: !id, // Skip the query if id is not available
    });

    const handleBack = (event: any) => {
        event.preventDefault();
        router.back();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const item = data?.getItemById;

    if (!user) {
        return <IsLoading/>;
    }

    return (
        <AdminLayout user={user}>
            <div className={"w-4/5 mx-auto"}>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Editar item del menu
                </h1>
                <Button variant="secondary" className="mt-4 mb-2" onClick={handleBack}>
                    <Undo2 /> Regresar
                </Button>
                {item && <ItemEditForm item={item} />}
            </div>
        </AdminLayout>
    );
};

export default EditItemPage;
