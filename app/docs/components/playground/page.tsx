"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function Playground() {
    return (
        <div className="flex-1 flex items-center justify-center w-full h-full">
            <div className="size-50 rounded-full overflow-hidden">
                <Skeleton className="bg-muted-foreground/20" speed={"normal"} fill/>
            </div>
        </div>
    )
}
