"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type OffsetValue = number | string

const CONST_DURATION = 0.3
const CONST_DELAY = 0.2
const CONST_REVEAL = 24
const CONST_TRIGGER_ONCE = false
const CONST_TRIGGER_ON_VIEW = true
const CONST_VIEW_AMOUNT = 0.2

export interface RevealProps {
    delay?: number
    duration?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    triggerOnView?: boolean
    triggerOnce?: boolean
    viewAmount?: number
    x?: OffsetValue
    y?: OffsetValue
    blur?: number
    scale?: number
    rotate?: number
}

const directionVariants: Record<
    NonNullable<RevealProps["direction"]>,
    { x: OffsetValue; y: OffsetValue }
> = {
    none: { x: 0, y: 0 },
    up: { x: 0, y: CONST_REVEAL },
    down: { x: 0, y: -CONST_REVEAL },
    left: { x: CONST_REVEAL, y: 0 },
    right: { x: -CONST_REVEAL, y: 0 },
}

export function Reveal({
    children,
    className,
    delay = CONST_DELAY,
    duration = CONST_DURATION,
    direction = "none",
    triggerOnView = CONST_TRIGGER_ON_VIEW,
    triggerOnce = CONST_TRIGGER_ONCE,
    viewAmount = CONST_VIEW_AMOUNT,
    x,
    y,
    blur = 0,
    scale = 1,
    rotate = 0,
    style,
    ...props
}: React.ComponentProps<typeof motion.div> & RevealProps) {
    const ref = React.useRef<HTMLDivElement>(null)

    const isInView = useInView(ref, {
        once: triggerOnce,
        amount: viewAmount,
    })

    const shouldReduceMotion = useReducedMotion()

    const directionOffset = directionVariants[direction]
    const hasCustomOffset = x !== undefined || y !== undefined

    const initialX = hasCustomOffset ? (x ?? 0) : directionOffset.x
    const initialY = hasCustomOffset ? (y ?? 0) : directionOffset.y

    const initialState = {
        opacity: 0,
        x: initialX,
        y: initialY,
        scale,
        rotate,
        filter: blur > 0 ? `blur(${blur}px)` : "blur(0px)",
    }

    const revealedState = {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
    }

    if (shouldReduceMotion) {
        return (
            <motion.div
                ref={ref}
                className={className}
                style={style}
                initial={false}
                animate={{ opacity: 1 }}
                {...props}
            >
                {children}
            </motion.div>
        )
    }

    const shouldAnimate = triggerOnView ? isInView : true

    return (
        <motion.div
            ref={ref}
            className={cn("overflow-hidden", className)}
            style={style}
            initial={initialState}
            animate={shouldAnimate ? revealedState : initialState}
            transition={{
                duration,
                delay,
                ease: "easeOut",
            }}
            {...props}
        >
            {children}
        </motion.div>
    )
}