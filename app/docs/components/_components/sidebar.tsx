"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ChevronDown,
    Wrench,
    Puzzle,
    FishingHook,
    Sun,
    MoonStar,
} from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import React from "react"
import DarkModeToggle from "@/components/ui/dark-mode-toggle"
import { LinkProps, links } from "./shared"

function ComponentSidebarHeader() {
    return (
        <SidebarHeader className="border-b p-3 flex flex-row items-center">
            <DarkModeToggle light={Sun} dark={MoonStar} />
            <Link href="/docs/components" className="flex flex-col flex-1 py-1 px-1 rounded-md border border-transparent hover:border-border hover:bg-muted cursor-pointer">
                <h2 className="font-bold text-sm leading-none">Nos Playground</h2>
                <p className="text-muted-foreground text-xs leading-none">Storybook style testing</p>
            </Link>
        </SidebarHeader>
    )
}

type ComponentMenuGroupProps = {
    icon: React.ComponentType<{ className?: string }>
    label: string
    links: LinkProps[]
    pathname: string
}

function ComponentMenuGroup({
    icon: Icon,
    label,
    links,
    pathname,
}: ComponentMenuGroupProps) {
    const hasActiveLink = links.some((link) => link.href === pathname)

    return (
        <Collapsible
            key={`${label}-${hasActiveLink ? "active" : "inactive"}`}
            defaultOpen={hasActiveLink}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="font-medium" isActive={hasActiveLink}>
                        <Icon className="size-4" />
                        <span>{label}</span>
                        <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {
                            links.map((l, i) => (
                                <SidebarMenuSubItem key={i}>
                                    <SidebarMenuSubButton asChild isActive={pathname === l.href}>
                                        <Link href={l.href}>{l.label}</Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))
                        }
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

export function ComponentSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <ComponentSidebarHeader />
            <SidebarContent className="p-2">
                <SidebarGroup className="pt-0">
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        <ComponentMenuGroup
                            icon={Puzzle}
                            label="Ui Components"
                            links={links.ui}
                            pathname={pathname}
                        />
                        <ComponentMenuGroup
                            icon={Wrench}
                            label="Utilities"
                            links={links.utility}
                            pathname={pathname}
                        />
                        <ComponentMenuGroup
                            icon={FishingHook}
                            label="Hooks"
                            links={links.hook}
                            pathname={pathname}
                        />
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
