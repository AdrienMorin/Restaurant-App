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
import React from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from "next/router";

interface SidebarItemProps {
    title: string;
    url: string;
    icon: React.FC;
}

interface SidebarProps {
    items: SidebarItemProps[];
    withFooter?: boolean;
}

export function AppSidebar( { props }: {props: SidebarProps} ) {
    const router = useRouter();
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {props.items.map((item: SidebarItemProps) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton isActive={router.pathname === item.url} asChild>
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
            { props.withFooter &&
                <SidebarFooter className={"mb-4"}>
                    {/*
                    <div className={"flex flex-row gap-6 items-center justify-center"}>
                        {user?.picture && <img alt="profile" className="rounded-full w-12 h-12 mr-4" height={48} width={48}
                             src={user.picture}/>}
                        <p className={"mx-auto"}>{user?.name}</p>
                    </div>
                    */}
                    <Button onClick={() => {localStorage.removeItem("token"); router.reload();}}>Logout</Button>
                </SidebarFooter>
            }
        </Sidebar>
    )
}
