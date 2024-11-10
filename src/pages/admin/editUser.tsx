"use client"

import AdminLayout from "@/layouts/_layout";
import { UserEditForm } from "@/molecules/userEditForm";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_USER_QUERY } from "@/utils/graphql/queries/users";
import useMiddleware from "@/hooks/useMiddleware";
import IsLoading from "@/molecules/isLoading";
import { Role } from "@/utils/enums";

const EditUserPage: React.FC = () => {
    const user = useMiddleware(Role.ADMIN);

    const router = useRouter();
    const { id } = router.query;

    const { data, loading, error } = useQuery(GET_USER_QUERY, {
        variables: { id },
        skip: !id,
    });

    const handleBack = (event: any) => {
        event.preventDefault();
        router.back();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const userData = data?.user;

    if (!user) {
        return <IsLoading />;
    }

    return (
        <AdminLayout user={user}>
            <div className={"w-4/5 mx-auto"}>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Editar un usuario
                </h1>
                <Button variant="secondary" className="mt-4 mb-2" onClick={handleBack}>
                    <Undo2 /> Regresar
                </Button>
                {userData && <UserEditForm user={userData} />}
            </div>
        </AdminLayout>
    );
};

export default EditUserPage;
