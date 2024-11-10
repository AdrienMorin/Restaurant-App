import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/molecules/sidebar";
import {Toaster} from "@/components/ui/toaster";
import {ChartCandlestick, CircleDollarSign, HandPlatter, MapPinned, User, Utensils} from "lucide-react";
import {Role, UserProps} from "@/utils/enums";

interface AdminLayoutProps {
    children: React.ReactNode;
    user: UserProps
}

// Menu items.
const items = [
    {
        title: "Gestión del menú",
        url: "/admin",
        icon: Utensils,
        role: Role.USER
    },
    {
        title: "Gestión de pagos",
        url: "/admin/payments",
        icon: CircleDollarSign,
        role: Role.ADMIN
    },
    {
        title: "Órdenes",
        url: "/admin/orders",
        icon: HandPlatter,
        role: Role.USER
    },
    {
        title: "Gestión de mesas",
        url: "/admin/tables",
        icon: MapPinned,
        role: Role.ADMIN
    },
    {
        title: "Análisis de datos",
        url: "/admin/data",
        icon: ChartCandlestick,
        role: Role.ADMIN
    },
    {
        title: "Gestion de los usuarios",
        url: "/admin/users",
        icon: User,
        role: Role.ADMIN
    }
]

const props = {
    items: items,
    withFooter: true,
}

export default function AdminLayout({ children, user } : AdminLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar props={props} user={user}/>
            <main className={"w-full"}>
                <SidebarTrigger />
                {children}
            </main>
            <Toaster />
        </SidebarProvider>
    );
};