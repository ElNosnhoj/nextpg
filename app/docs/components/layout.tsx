import type { ReactNode } from "react";

export default function ComponentsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}
