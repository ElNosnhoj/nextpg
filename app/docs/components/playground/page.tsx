"use client"

import { Reveal } from "@/components/ui/reveal"
import { Button } from "@/components/ui/button"
import { Marquee, MarqueeContent, MarqueeItem, MarqueeOverlay } from "@/components/ui/marquee"
import React from "react"


const items = [
    { text: "one" },
    { text: "two" },
    { text: "three" },
    { text: "four" },
    { text: "five" },
    { text: "six" },
    { text: "seven" },
    { text: "eight" },
    { text: "nine" },
]

export default function Playground() {
    return (
        <div className="flex-1 flex items-center justify-center w-full h-full">
            <div className="w-100 h-50 bg-blue-100 overflow-hidden items-center justify-center flex">
                <Marquee autoFill from="right" gap={4} speed={100} className="">
                    <MarqueeContent>
                        {items.map((item) => (
                            <MarqueeItem key={item.text}>
                                <div className="rounded-full border border-border px-4">
                                    {item.text}
                                </div>
                            </MarqueeItem>
                        ))}
                    </MarqueeContent>
                </Marquee>
            </div>
        </div>
    )
}
