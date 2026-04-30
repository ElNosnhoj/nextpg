import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ComponentSidebar } from "./_components/sidebar";

export default function ComponentsLayout({ children }: { children: ReactNode }) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <ComponentSidebar />
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
