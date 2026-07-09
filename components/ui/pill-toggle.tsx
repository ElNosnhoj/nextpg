"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pillToggleVariants = cva(
    "inline-flex shrink-0 align-middle leading-none font-medium select-none",
    {
        variants: {
            size: {
                sm: "text-xs",
                default: "text-sm",
                lg: "text-base",
            },
            fullWidth: {
                true: "w-full",
                false: "w-fit",
            },
        },
        defaultVariants: {
            size: "default",
            fullWidth: false,
        },
    }
)

const pillToggleTrackVariants = cva(
    cn(
        "relative grid grid-cols-2 items-center overflow-hidden rounded-full border outline-none",
        "transition-colors peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
        "peer-disabled:pointer-events-none peer-disabled:opacity-50"
    ),
    {
        variants: {
            variant: {
                default: "border-transparent bg-muted",
                outline: "border-border bg-background",
                soft: "border-transparent bg-muted/70",
                contrast: "border-transparent bg-muted-foreground/25",
            },
            size: {
                sm: "h-7 min-w-32",
                default: "h-9 min-w-42",
                lg: "h-10 min-w-52",
            },
            fullWidth: {
                true: "w-full",
                false: "w-fit",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            fullWidth: false,
        },
    }
)

const pillToggleThumbVariants = cva(
    cn(
        "pointer-events-none absolute inset-y-0.5 left-0.5 z-0 w-[calc(50%-2px)] rounded-full",
        "shadow-2xs transition-transform duration-200 ease-in-out motion-reduce:transition-none"
    ),
    {
        variants: {
            variant: {
                default: "bg-background",
                outline: "bg-muted",
                soft: "bg-background",
                contrast: "bg-accent",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

type PillToggleProps = Omit<
    React.ComponentPropsWithoutRef<"input">,
    "checked" | "defaultChecked" | "defaultValue" | "size" | "type" | "value"
> &
    VariantProps<typeof pillToggleTrackVariants> & {
        value?: boolean
        defaultValue?: boolean
        checked?: boolean
        defaultChecked?: boolean
        onValueChange?: (value: boolean) => void
        onCheckedChange?: (checked: boolean) => void
        falseText?: React.ReactNode
        trueText?: React.ReactNode
        fullWidth?: boolean
        inputValue?: string
        trackClassName?: string
        thumbClassName?: string
        textClassName?: string
        falseTextClassName?: string
        trueTextClassName?: string
        inputClassName?: string
    }

function PillToggle({
    className,
    trackClassName,
    thumbClassName,
    textClassName,
    falseTextClassName,
    trueTextClassName,
    inputClassName,
    value,
    defaultValue,
    checked,
    defaultChecked,
    onValueChange,
    onCheckedChange,
    onChange,
    falseText = "false",
    trueText = "true",
    inputValue = "on",
    variant,
    size,
    fullWidth,
    disabled,
    readOnly,
    ...props
}: PillToggleProps) {
    const controlledValue = value ?? checked
    const isControlled = controlledValue !== undefined
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
        defaultValue ?? defaultChecked ?? false
    )
    const isChecked = isControlled ? controlledValue : uncontrolledValue
    const state = isChecked ? "checked" : "unchecked"

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (readOnly) {
                event.preventDefault()
                return
            }

            onChange?.(event)

            if (event.defaultPrevented) {
                return
            }

            const nextValue = event.currentTarget.checked

            if (!isControlled) {
                setUncontrolledValue(nextValue)
            }

            onValueChange?.(nextValue)
            onCheckedChange?.(nextValue)
        },
        [isControlled, onChange, onCheckedChange, onValueChange, readOnly]
    )

    const labelClassName = cn(
        "relative z-10 min-w-0 truncate px-3 text-center transition-colors duration-200 ease-in-out",
        "motion-reduce:transition-none"
    )

    return (
        <label
            data-slot="pill-toggle"
            data-state={state}
            data-disabled={disabled ? "true" : undefined}
            data-readonly={readOnly ? "true" : undefined}
            className={cn(
                pillToggleVariants({ size, fullWidth }),
                disabled
                    ? "cursor-not-allowed"
                    : readOnly
                        ? "cursor-default"
                        : "cursor-pointer",
                className
            )}
        >
            <input
                {...props}
                type="checkbox"
                value={inputValue}
                checked={isChecked}
                disabled={disabled}
                readOnly={readOnly}
                onChange={handleChange}
                data-slot="pill-toggle-input"
                data-state={state}
                className={cn("peer sr-only", inputClassName)}
            />
            <span
                data-slot="pill-toggle-track"
                className={cn(
                    pillToggleTrackVariants({ variant, size, fullWidth }),
                    trackClassName
                )}
            >
                <span
                    aria-hidden="true"
                    data-slot="pill-toggle-thumb"
                    className={cn(
                        pillToggleThumbVariants({ variant }),
                        isChecked && "translate-x-full",
                        thumbClassName
                    )}
                />
                <span
                    data-slot="pill-toggle-false-text"
                    className={cn(
                        labelClassName,
                        isChecked ? "text-muted-foreground" : "text-foreground",
                        textClassName,
                        falseTextClassName
                    )}
                >
                    {falseText}
                </span>
                <span
                    data-slot="pill-toggle-true-text"
                    className={cn(
                        labelClassName,
                        isChecked ? "text-foreground" : "text-muted-foreground",
                        textClassName,
                        trueTextClassName
                    )}
                >
                    {trueText}
                </span>
            </span>
        </label>
    )
}

export {
    PillToggle,
    pillToggleVariants,
    pillToggleTrackVariants,
    pillToggleThumbVariants,
    type PillToggleProps,
}
