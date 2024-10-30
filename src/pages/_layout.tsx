import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/molecules/sidebar";
import {Toaster} from "@/components/ui/toaster";
import {CircleDollarSign, HandPlatter, MapPinned, Utensils} from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

// Menu items.
const items = [
    {
        title: "Gestión del menú",
        url: "/admin",
        icon: Utensils,
    },
    {
        title: "Gestión de pagos",
        url: "/admin/payments",
        icon: CircleDollarSign,
    },
    {
        title: "Órdenes",
        url: "/admin/orders",
        icon: HandPlatter,
    },
    {
        title: "Gestión de mesas",
        url: "/admin/tables",
        icon: MapPinned,
    },
]

const props = {
    items: items,
    withFooter: true,
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar props={props}/>
            <main className={"w-full"}>
                <SidebarTrigger />
                {children}
            </main>
            <Toaster />
        </SidebarProvider>
    );
};

export default AdminLayout;
