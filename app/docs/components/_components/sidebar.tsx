"use client"
import Link from "next/link"
import {
    ChevronDown,
    Folder,
    Bot,
    ChevronsUpDown,
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
    return (
        <SidebarHeader className="border-b px-3 py-3" hidden>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        className="h-auto min-h-12 px-2 py-2"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
                            <Folder className="size-4" />
                        </div>

                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">Acme Inc</span>
                            <span className="truncate text-xs text-muted-foreground">
                                Enterprise
                            </span>
                        </div>

                        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
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
    links
}: ComponentMenuGroupProps) {
    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="font-medium">
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
                                    <SidebarMenuSubButton asChild>
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
                        />
                        <ComponentMenuGroup 
                            icon={Wrench}
                            label="Utilities"
                            links={UtilityLinks}
                        />
                        <ComponentMenuGroup 
                            icon={FishingHook}
                            label="Hooks"
                            links={HookLinks}
                        />
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}