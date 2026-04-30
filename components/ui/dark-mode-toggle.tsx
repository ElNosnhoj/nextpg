"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type IconType = React.ComponentType<{ className?: string }>

const buttonVariants = cva(cn(
    "inline-flex align-middle leading-none transition-all rounded",
    "border border-accent-foreground hover:border-muted-foreground",
    "bg-accent text-accent-foreground hover:bg-muted hover:text-muted-foreground",
), {
    variants: {
        variant: {
            default: "",
            outline: "",
            ghost: "",
        },
        size: {
            xs: "size-2 p-px",
            sm: "size-4 p-0.5",
            default: "size-8 p-1",
            lg: "size-12 p-1.5",
            xl: "size-16 p-2",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
})

type DarkModeToggleProps =
    React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
        light: IconType
        dark: IconType
    }

export default function DarkModeToggle({
    light: LightIcon,
    dark: DarkIcon,
    className,
    variant,
    size,
    onClick,
    type = "button",
    ...props
}: DarkModeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    return (
        <button
            type={type}
            className={cn(buttonVariants({ variant, size }), className)}
            onClick={(e) => {
                onClick?.(e)
                if (!e.defaultPrevented) {
                    toggleTheme()
                }
            }}
            {...props}
        >
            <span className="relative flex items-stretch size-full">
                <span className="transition-all dark:scale-0 dark:-rotate-90 size-full">
                    <LightIcon className="size-full" />
                </span>

                <span className="absolute inset-0 transition-all scale-0 -rotate-90 dark:scale-100 dark:rotate-0">
                    <DarkIcon className="size-full" />
                </span>
            </span>
        </button>
    )
}