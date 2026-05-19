import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skeletonVariants = cva("bg-muted [animation-timing-function:ease-in]", {
    variants: {
        animation: {
            pulse: "animate-pulse",
            none: "",
        },

        speed: {
            slow: "[animation-duration:3s]",
            normal: "[animation-duration:2s]",
            fast: "[animation-duration:1s]",
        },

        tone: {
            default: "bg-muted",
            subtle: "bg-muted/60",
            strong: "bg-muted-foreground/20",
        },

        fill: {
            true: "absolute inset-0 z-10 size-full",
            false: "",
        },
    },

    defaultVariants: {
        animation: "pulse",
        speed: "normal",
        tone: "default",
        fill: false,
    },
})

type SkeletonProps = React.ComponentProps<"div"> &
    VariantProps<typeof skeletonVariants>

function Skeleton({
    className,
    animation,
    speed,
    tone,
    fill,
    ...props
}: SkeletonProps) {
    return (
        <div
            data-slot="skeleton"
            className={cn(
                skeletonVariants({
                    animation,
                    speed,
                    tone,
                    fill,
                }),
                className
            )}
            {...props}
        />
    )
}

export { Skeleton, skeletonVariants }