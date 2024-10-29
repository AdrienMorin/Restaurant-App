import {CircleDollarSign, HandPlatter, MapPinned, Utensils} from "lucide-react"

import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useUser} from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import React from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

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

export function AppSidebar() {
    const { user } = useUser();
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className={"mb-4"}>
                <div className={"flex flex-row gap-6 items-center justify-center"}>
                    {user?.picture && <img alt="profile" className="rounded-full w-12 h-12 mr-4" height={48} width={48}
                         src={user.picture}/>}
                    <p className={"mx-auto"}>{user?.name}</p>
                </div>
                <Button asChild><Link href={`/api/auth/logout?returnTo=http://localhost:3000/api/auth/login`}>Logout</Link></Button>
            </SidebarFooter>
        </Sidebar>
    )
}
