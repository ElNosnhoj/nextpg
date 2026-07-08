"use client"

import { cn } from "@/lib/utils"
import React from "react"
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function getContrastingTextColor(hex: string, backdrop = "#ffffff") {
    const cleanHex = hex.replace("#", "")

    if (!/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(cleanHex)) {
        return "#000000"
    }

    const r = parseInt(cleanHex.slice(0, 2), 16)
    const g = parseInt(cleanHex.slice(2, 4), 16)
    const b = parseInt(cleanHex.slice(4, 6), 16)

    const alpha =
        cleanHex.length === 8 ? parseInt(cleanHex.slice(6, 8), 16) / 255 : 1

    const bgHex = backdrop.replace("#", "")
    const bgR = parseInt(bgHex.slice(0, 2), 16)
    const bgG = parseInt(bgHex.slice(2, 4), 16)
    const bgB = parseInt(bgHex.slice(4, 6), 16)

    const blendedR = r * alpha + bgR * (1 - alpha)
    const blendedG = g * alpha + bgG * (1 - alpha)
    const blendedB = b * alpha + bgB * (1 - alpha)

    const brightness =
        (blendedR * 299 + blendedG * 587 + blendedB * 114) / 1000

    return brightness > 128 ? "#000000" : "#ffffff"
}

export function useColor(initialColor = "#ff000088") {
    const [color, setColor] = React.useState(initialColor)
    const [isEditing, setIsEditing] = React.useState(false)

    const textColor = getContrastingTextColor(color)

    return {
        color,
        setColor,
        textColor,
        isEditing,
        setIsEditing,
    }
}

export type ColorState = ReturnType<typeof useColor>

export type ColorControlTriggerProps = {
    color: string
    textColor: string
    value: string
    alpha: boolean
}

type ColorControlProps = {
    colorState: ColorState
    alpha?: boolean
    popup?: boolean
    trigger?:
    | React.ReactElement
    | ((props: ColorControlTriggerProps) => React.ReactElement)
    className?: string
}

export function ColorControl({
    colorState,
    alpha = true,
    popup = false,
    trigger,
    className,
}: ColorControlProps) {
    const { color, setColor, textColor, setIsEditing } = colorState

    const maxLength = alpha ? 8 : 6
    const Picker = alpha ? HexAlphaColorPicker : HexColorPicker
    const pickerColor = alpha ? color : color.slice(0, 7)
    const value = `#${color.slice(1, 1 + maxLength)}`

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value
            .replace(/#/g, "")
            .replace(/[^0-9A-Fa-f]/g, "")
            .slice(0, maxLength)

        setColor(`#${nextValue}`)
    }

    const picker = (
        <div className={cn("rounded-lg bg-white", className)}>
            <div
                className="flex w-fit flex-col gap-0 rounded-lg border-2 border-ring"
                style={{ backgroundColor: color, color: textColor }}
            >
                <Picker
                    color={pickerColor}
                    onChange={setColor}
                    className={cn(
                        "rounded-none!",
                        "[&_.react-colorful__saturation]:rounded-t-md!",
                        "[&_.react-colorful__hue]:rounded-none!",
                        "[&_.react-colorful__alpha]:rounded-none!"
                    )}
                />

                <div className="flex w-full min-w-0 items-center gap-2 px-2 text-foreground">
                    <span className="select-none text-gray-300">#</span>

                    <span aria-hidden="true" className="h-4 w-px bg-gray-300" />

                    <input
                        type="text"
                        value={color.slice(1, 1 + maxLength)}
                        onChange={handleInputChange}
                        onFocus={() => setIsEditing(true)}
                        onBlur={() => setIsEditing(false)}
                        className="w-0 min-w-0 flex-1 rounded outline-none"
                        style={{ color: textColor }}
                        placeholder={alpha ? "rrggbbaa" : "rrggbb"}
                    />
                </div>
            </div>
        </div>
    )

    if (!popup) {
        return picker
    }

    const defaultTrigger = (
        <button
            type="button"
            className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm"
        >
            <span
                className="h-4 w-4 rounded border"
                style={{ backgroundColor: color }}
            />

            <span>{value}</span>
        </button>
    )

    const triggerElement =
        typeof trigger === "function"
            ? trigger({ color, textColor, value, alpha })
            : trigger ?? defaultTrigger

    return (
        <Popover>
            <PopoverTrigger asChild>{triggerElement}</PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-fit border-none bg-transparent p-0 shadow-none"
            >
                {picker}
            </PopoverContent>
        </Popover>
    )
}
