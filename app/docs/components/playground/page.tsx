"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ColorControl, useColor } from "@/components/ui/color-control"

export default function Playground() {
    const primary = useColor("#ff000088")
    const background = useColor("#ffffff")
    const accent = useColor("#3b82f688")
    const text = useColor("#111827")

    return (
        <div className="flex h-full w-full items-center justify-center gap-8 p-8">
            <div className="flex flex-col gap-6">
                {/* 1. Inline alpha picker */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Inline alpha picker</p>
                    <ColorControl colorState={primary} alpha />
                </div>

                {/* 2. Popup without alpha */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Popup solid color</p>
                    <ColorControl colorState={background} alpha={false} popup />
                </div>

                {/* 3. Popup with custom trigger */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Custom trigger</p>
                    <ColorControl
                        colorState={accent}
                        alpha
                        popup
                        trigger={({ color, value }) => (
                            <button className="flex items-center gap-3 rounded-full border px-4 py-2 text-sm">
                                <span
                                    className="h-6 w-6 rounded-full border"
                                    style={{ backgroundColor: color }}
                                />
                                <span>{value}</span>
                            </button>
                        )}
                    />
                </div>

                {/* 4. Text color picker */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Text color picker</p>
                    <ColorControl colorState={text} alpha={false} popup />
                </div>
            </div>

            {/* Live preview using the colors */}
            <div
                className="w-80 rounded-xl border p-6"
                style={{
                    backgroundColor: background.color,
                    color: text.color,
                }}
            >
                <h2 className="text-2xl font-bold" style={{ color: primary.color }}>
                    Preview Card
                </h2>

                <p className="mt-2 text-sm">
                    This card uses the selected background, text, primary, and accent
                    colors.
                </p>

                <button
                    className="mt-4 rounded-md px-4 py-2 text-sm font-medium"
                    style={{
                        backgroundColor: accent.color,
                        color: accent.textColor,
                    }}
                >
                    Accent Button
                </button>
            </div>
        </div>
    )
}