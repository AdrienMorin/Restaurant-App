import AdminLayout from "@/pages/_layout";
import useMiddleware from "@/lib/middleware";

const TablesPage: React.FC = () => {

    useMiddleware();

    return (
        <AdminLayout>
            <h1>Gestion de las mesas</h1>
        </AdminLayout>
    );
};

export default TablesPage;
