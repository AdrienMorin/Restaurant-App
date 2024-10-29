import AdminLayout from "@/pages/_layout";
import useMiddleware from "@/lib/middleware";

const PaymentsPage: React.FC = () => {

    useMiddleware();

    return (
        <AdminLayout>
            <h1>Gestion de pagos</h1>
        </AdminLayout>
    );
};

export default PaymentsPage;
