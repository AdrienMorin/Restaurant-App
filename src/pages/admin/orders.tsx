import AdminLayout from "@/pages/_layout";
import useMiddleware from "@/lib/middleware";

const OrdersPage: React.FC = () => {

    useMiddleware();

    return (
        <AdminLayout>
            <h1>Ordenes</h1>
        </AdminLayout>
    );
};

export default OrdersPage;
