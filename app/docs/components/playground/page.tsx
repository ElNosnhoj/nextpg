"use client"

import { Reveal } from "@/components/ui/reveal"
import { Button } from "@/components/ui/button"
import React from "react"


export default function Playground() {
    const [hidden, setHidden] = React.useState(true)
    return (
        <div className="flex-1 flex items-center flex-col">
            <Button onClick={() => setHidden(prev => !prev)}>
                click me
            </Button>
            {
                !hidden &&
                <div className="flex-1 flex flex-col justify-center">
                    <Reveal delay={0.2} duration={2} direction="up" blur={2} rotate={180} scale={0.1}>
                        <div className="bg-blue-500 w-100 h-100 rounded-4xl"></div>
                    </Reveal>
                </div>
            }
        </div>
    )
}