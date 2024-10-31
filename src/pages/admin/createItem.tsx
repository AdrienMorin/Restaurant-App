"use client"

import AdminLayout from "@/pages/_layout";
import useMiddleware from "@/lib/middleware";
import {ItemCreationForm} from "@/molecules/itemCreationForm";
import {Button} from "@/components/ui/button";
import {Undo2} from "lucide-react";
import {useRouter} from "next/router";


const CreateItemPage: React.FC = () => {

    useMiddleware();

    const router = useRouter();

    const handleBack = (event: any) => {
        event.preventDefault();
        router.back();
    };

    return (
        <AdminLayout>
            <div className={"w-4/5 mx-auto"}>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Agregar un item al menu</h1>
                <Button variant="secondary" className="mt-4 mb-2" onClick={handleBack}>
                    <Undo2 /> Regresar
                </Button>
                <ItemCreationForm />
            </div>
        </AdminLayout>
    );
};

export default CreateItemPage;
