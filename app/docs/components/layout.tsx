import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip"

export default function ComponentsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen max-w-screen">
            <TooltipProvider>{children}</TooltipProvider>
        </div>
    );
}
