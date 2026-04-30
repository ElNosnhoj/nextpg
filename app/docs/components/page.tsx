"use client"
import DarkModeToggle from "@/components/ui/dark-mode-toggle";
import { LucideMoonStar, LucideSun } from "lucide-react";
import Link from "next/link";


export default function ComponentsPage() {
    return (
        <div className="">
            <DarkModeToggle dark={LucideMoonStar} light={LucideSun} className=""/>

            <Link href={"/docs/components/notify"}>
                notify
            </Link>
        </div>
    )
}