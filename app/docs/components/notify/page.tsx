"use client"
import { Toaster } from "@/components/ui/sonner";
import { notify } from "@/lib/notify";

export default function NotifyPage(){
    return (
        <div>
            <button onClick={()=>notify.info("hello")}>
                click me
            </button>
            <Toaster position="bottom-center" className="" expand={true} richColors />
        </div>
    )
}