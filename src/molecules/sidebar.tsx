import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import React from "react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {Role, UserProps} from "@/utils/enums";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useMutation} from "@apollo/client";
import {LOGOUT_MUTATION} from "@/utils/graphql/mutations/auth";
import {Icons} from "@/components/ui/icons";

interface SidebarItemProps {
    title: string;
    url: string;
    icon: React.FC;
    role: Role;
}

interface SidebarProps {
    items: SidebarItemProps[];
    withFooter?: boolean;
}

export function AppSidebar( { props, user }: {props: SidebarProps, user: UserProps} ) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [logout] = useMutation(LOGOUT_MUTATION);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            localStorage.removeItem("token");
            router.reload(); // Rediriger vers la page de connexion après la déconnexion
        } catch (e) {
            console.error("Error while logout:", e);
        }
    };

    const filteredItems = props.items.filter(item => (item.role !== Role.ADMIN || user.role === Role.ADMIN));

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item: SidebarItemProps) => (
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
                    {
                    <div className={"flex flex-row gap-4 items-center justify-center mb-2"}>
                        <Avatar>
                            <AvatarImage src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="@user" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p className={""}>{user?.name}</p>
                    </div>
                    }
                    <Button onClick={handleLogout} disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Desconectar
                    </Button>
                </SidebarFooter>
            }
        </Sidebar>
    )
}
