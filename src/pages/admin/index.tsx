import AdminLayout from "@/pages/_layout";
import useMiddleware from "@/lib/middleware";
import {ItemsTable} from "@/molecules/itemsTable";
import { useQuery } from '@apollo/client'
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {AllItemsQuery} from "@/utils/graphql/queries/items";

const AdminPage: React.FC = () => {

    useMiddleware();

    const { data, refetch } = useQuery(AllItemsQuery)

    const router = useRouter();

    const { reload } = router.query;

    useEffect(() => {
        if (reload) {
            refetch();
            router.replace(router.pathname, undefined, { shallow: true });
        }
    }, [reload, router, refetch]);

    return (
        <AdminLayout>
            <div className={"w-4/5 mx-auto"}>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-4">
                    Gestion del menu</h1>
                <Button className={"m-4"} asChild><Link href={"/admin/createItem"}><Plus />Agregar un item al menu</Link></Button>
                <ItemsTable items={data ? data.items : []} refetch={refetch}/>
            </div>
        </AdminLayout>
    );
};

export default AdminPage;
