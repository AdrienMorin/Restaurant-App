import AdminLayout from "@/layouts/_layout";
import {useMutation, useQuery} from '@apollo/client';
import {Button} from "@/components/ui/button";
import {Minus, Plus} from "lucide-react";
import {GET_ALL_TABLES} from "@/utils/graphql/queries/tables";
import TableCard from "@/molecules/tableCard";
import {ADD_TABLE_MUTATION, REMOVE_TABLE_MUTATION} from "@/utils/graphql/mutations/tables";
import {toast} from "@/hooks/use-toast";
import {TableProps} from "@/utils/interfaces";
import useMiddleware from "@/hooks/useMiddleware";
import IsLoading from "@/molecules/isLoading";
import {Role} from "@/utils/enums";

const AdminPage: React.FC = () => {
    const user = useMiddleware(Role.ADMIN);

    const { data, refetch } = useQuery(GET_ALL_TABLES);
    const [addTable] = useMutation(ADD_TABLE_MUTATION);
    const [removeTable] = useMutation(REMOVE_TABLE_MUTATION);

    const handleAddTable = async () => {
        try {
            await addTable();
            refetch();
            toast({
                title: "Éxito",
                description: "Mesa agregada exitosamente.",
            });
        } catch (e) {
            toast({
                title: "Error",
                description: "No se pudo agregar la mesa.",
            });
        }
    };

    const handleRemoveTable = async () => {
        try {
            await removeTable();
            refetch();
        } catch (e) {
            toast({
                title: "Error",
                description: "No puedes quitar mas mesas porque tienen reservas",
            });
        }
    };

    if (!user) {
        return <IsLoading/>;
    }

    return (
        <AdminLayout user={user}>
            <div className={"w-4/5 mx-auto"}>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Gestion de las mesas
                </h1>
                <div className={"flex items-center justify-center"}>
                    <h2 className="text-2xl text-center mr-4">Total : {data?.tables?.length} Mesas</h2>
                    <Button className={"m-4"} onClick={handleAddTable}><Plus />Agregar una mesa</Button>
                    <Button className={"m-4"} variant={"destructive"} onClick={handleRemoveTable}><Minus />Quitar una mesa</Button>
                </div>
                {data && data.tables.map((table: TableProps) => (
                    <TableCard table={table} key={table.id}></TableCard>
                ))}
            </div>
        </AdminLayout>
    );
};

export default AdminPage;
