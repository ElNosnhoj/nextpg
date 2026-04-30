"use client"
import DarkModeToggle from "@/components/ui/dark-mode-toggle";
import { LucideMoonStar, LucideSun } from "lucide-react";


export default function ComponentsPage() {
    return (
        <div className="bg-red-100 block m-5">
            <DarkModeToggle dark={LucideMoonStar} light={LucideSun} className=""/>
        </div>
    )
}