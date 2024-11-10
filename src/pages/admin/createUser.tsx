"use client"

import AdminLayout from "@/layouts/_layout";
import { UserCreationForm } from "@/molecules/userCreationForm";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/router";
import IsLoading from "@/molecules/isLoading";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/utils/enums";

const CreateUserPage: React.FC = () => {
    const user = useMiddleware(Role.ADMIN);

    const router = useRouter();

    const handleBack = (event: any) => {
        event.preventDefault();
        router.back();
    };

    if (!user) {
        return <IsLoading />;
    }

    return (
        <AdminLayout user={user}>
            <div className={"w-4/5 mx-auto"}>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Agregar un usuario
                </h1>
                <Button variant="secondary" className="mt-4 mb-2" onClick={handleBack}>
                    <Undo2 /> Regresar
                </Button>
                <UserCreationForm />
            </div>
        </AdminLayout>
    );
};

export default CreateUserPage;
