import AdminLayout from "@/layouts/_layout";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@apollo/client";
import { GET_ALL_TABLES } from "@/utils/graphql/queries/tables";
import {useState} from "react";
import PaymentForm from "@/molecules/paymentForm";
import useMiddleware from "@/hooks/useMiddleware";
import IsLoading from "@/molecules/isLoading";
import {Role} from "@/utils/enums";

export default function PaymentsPage() {
    const user = useMiddleware(Role.ADMIN);

    const { data } = useQuery(GET_ALL_TABLES);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);

    if (!user) {
        return <IsLoading/>;
    }

    return (
        <AdminLayout user={user}>
            <div className={"flex flex-col items-center justify-center gap-4"}>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Gestion de pagos
                </h1>
                <div>
                    <Select onValueChange={(value) => setSelectedTable(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleccionar la mesa"/>
                        </SelectTrigger>
                        <SelectContent>
                            {data && data.tables ? (
                                data.tables.map((table: { id: string; number: number }) => (
                                    <SelectItem key={table.id} value={table.id}>
                                        Mesa {table.number}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value={"1"}>…</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                {selectedTable && (
                    <div className={"w-3/5"}>
                        <PaymentForm tableId={selectedTable} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};