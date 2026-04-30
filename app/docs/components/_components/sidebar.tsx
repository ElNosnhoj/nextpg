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

function ComponentSidebarHeader() {
    return (
        <SidebarHeader className="border-b p-3">
            <DarkModeToggle light={Sun} dark={MoonStar}/>
        </SidebarHeader>
    )
}

type LinkProps = {
    href: string
    text: React.ReactNode
}
type ComponentMenuGroupProps = {
    icon: React.ComponentType<{ className?: string }>
    label: string
    links: LinkProps[]
    pathname: string
}
const ComponentLinks: LinkProps[] = [
    { href: "/docs/components/dark-mode-toggle", text: "dark-mode-toggle" }
    
]
const UtilityLinks: LinkProps[] = [
    { href: "/docs/components/notify", text: "notify" }
]

const HookLinks: LinkProps[] = [
    { href: "/docs/components/use-keyboard", text: "useKeyboard" }
]

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
                                        <Link href={l.href}>{l.text}</Link>
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
                            label="Components"
                            links={ComponentLinks}
                            pathname={pathname}
                        />
                        <ComponentMenuGroup 
                            icon={Wrench}
                            label="Utilities"
                            links={UtilityLinks}
                            pathname={pathname}
                        />
                        <ComponentMenuGroup 
                            icon={FishingHook}
                            label="Hooks"
                            links={HookLinks}
                            pathname={pathname}
                        />
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
