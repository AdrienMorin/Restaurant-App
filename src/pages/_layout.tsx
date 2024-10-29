import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/molecules/sidebar";
import {Toaster} from "@/components/ui/toaster";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className={"w-full"}>
                <SidebarTrigger />
                {children}
            </main>
            <Toaster />
        </SidebarProvider>
    );
};

export default AdminLayout;
