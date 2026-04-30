import DarkModeToggle from "@/components/ui/dark-mode-toggle";
import { LucideMoonStar, LucideSun } from "lucide-react";


export default function ComponentsPage() {
    return (
        <div className="bg-red-100">
            <DarkModeToggle darkIcon={<LucideMoonStar />} lightIcon={<LucideSun />} size="icon-sm" className="size-20"/>
        </div>
    )
}