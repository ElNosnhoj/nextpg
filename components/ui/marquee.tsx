"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const CONST_SPEED = 100
const CONST_FROM = "right"
const CONST_GAP = 4

type MarqueeFrom = "left" | "right" | "top" | "bottom"
type MarqueeGap = number | string

function resolveGapClass(gap: MarqueeGap) {
    if (typeof gap === "number") return `gap-${gap}`
    return gap
}

/**============================================
 * MarqueeItem
 =============================================*/
export type MarqueeItemProps = React.ComponentProps<"div">
export function MarqueeItem({
    children,
    className,
    ...props
}: MarqueeItemProps) {
    return (
        <div
            className={cn("shrink-0", className)}
            {...props}
        >
            {children}
        </div>
    )
}

/**============================================
 * Marquee Slots
 =============================================*/
export type MarqueeContentProps = {
    children?: React.ReactNode
}
export function MarqueeContent({ children }: MarqueeContentProps) {
    return <>{children}</>
}

export type MarqueeOverlayProps = React.ComponentProps<"div">
export function MarqueeOverlay({
    children,
    className,
    ...props
}: MarqueeOverlayProps) {
    return (
        <div
            data-slot="marquee-overlay"
            className="pointer-events-none absolute inset-0 z-10"
        >
            <div
                data-slot="marquee-overlay-content"
                className={cn("absolute", className)}
                {...props}
            >
                {children}
            </div>
        </div>
    )
}


/**============================================
* Marquee
=============================================*/
export interface MarqueeProps extends React.ComponentProps<"div"> {
    speed?: number
    from?: MarqueeFrom
    gap?: MarqueeGap
    autoFill?: boolean
    pauseOnHover?: boolean
}
export function Marquee({
    children,
    className,
    speed = CONST_SPEED,
    from = CONST_FROM,
    gap = CONST_GAP,
    autoFill = false,
    pauseOnHover = false,
    style,
    ...props
}: MarqueeProps) {
    let contentChildren: React.ReactNode = children
    let hasExplicitContent = false
    const overlayChildren: React.ReactElement[] = []
    const fallbackContentChildren: React.ReactNode[] = []

    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
            fallbackContentChildren.push(child)
            return
        }

        if (child.type === MarqueeContent) {
            const contentChild = child as React.ReactElement<MarqueeContentProps>
            hasExplicitContent = true
            contentChildren = contentChild.props.children
            return
        }

        if (child.type === MarqueeOverlay) {
            overlayChildren.push(child)
            return
        }

        fallbackContentChildren.push(child)
    })

    if (!hasExplicitContent) {
        contentChildren = fallbackContentChildren
    }

    const items = React.Children.toArray(contentChildren)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const measureRef = React.useRef<HTMLDivElement>(null)
    const firstSegmentRef = React.useRef<HTMLDivElement>(null)
    const secondSegmentRef = React.useRef<HTMLDivElement>(null)
    const [duration, setDuration] = React.useState(0)
    const [distance, setDistance] = React.useState(0)
    const [fillCount, setFillCount] = React.useState(1)
    const isVertical = from === "top" || from === "bottom"
    const isReverse = from === "right" || from === "bottom"
    const gapClass = resolveGapClass(gap)
    const axisClass = isVertical
        ? "flex min-h-max flex-col"
        : "flex min-w-max items-center"
    const segmentClass = cn("shrink-0", axisClass, gapClass)

    // normalize duration by "speed"
    React.useEffect(() => {
        const containerElement = containerRef.current
        const measureElement = measureRef.current
        const firstSegmentElement = firstSegmentRef.current
        const secondSegmentElement = secondSegmentRef.current

        if (!containerElement || !measureElement || !firstSegmentElement || !secondSegmentElement) return

        const updateMeasurements = () => {
            const containerRect = containerElement.getBoundingClientRect()
            const measureRect = measureElement.getBoundingClientRect()
            const containerSize = isVertical ? containerRect.height : containerRect.width
            const baseSize = isVertical ? measureRect.height : measureRect.width

            if (!baseSize) return

            const nextFillCount = autoFill
                ? Math.max(1, Math.ceil(containerSize / baseSize) + 1)
                : 1

            setFillCount(nextFillCount)
        }

        updateMeasurements()

        const updateDistance = () => {
            const firstRect = firstSegmentElement.getBoundingClientRect()
            const secondRect = secondSegmentElement.getBoundingClientRect()
            const nextDistance = isVertical
                ? Math.abs(secondRect.top - firstRect.top)
                : Math.abs(secondRect.left - firstRect.left)

            if (!nextDistance) return

            setDistance(nextDistance)

            if (speed > 0) {
                setDuration(nextDistance / speed)
            }
        }

        updateDistance()

        const resizeObserver = new ResizeObserver(() => {
            updateMeasurements()
            updateDistance()
        })
        resizeObserver.observe(containerElement)
        resizeObserver.observe(measureElement)
        resizeObserver.observe(firstSegmentElement)
        resizeObserver.observe(secondSegmentElement)

        return () => resizeObserver.disconnect()
    }, [autoFill, fillCount, isVertical, items.length, speed])

    const filledItems = React.useMemo(
        () =>
            Array.from({ length: fillCount }, (_, index) => (
                <React.Fragment key={index}>{items}</React.Fragment>
            )),
        [fillCount, items]
    )

    return (
        <>
            <style>{`
                @keyframes marquee-scroll {
                    from {
                        transform: translate(var(--marquee-from-x), var(--marquee-from-y));
                    }
                    to {
                        transform: translate(var(--marquee-to-x), var(--marquee-to-y));
                    }
                }
            `}</style>
            <div
                data-slot="marquee"
                className={cn(
                    "relative overflow-hidden",
                    isVertical ? "flex h-full flex-col" : "flex w-full",
                    className
                )}
                ref={containerRef}
                style={
                    {
                        "--marquee-duration": `${duration}s`,
                        "--marquee-from-x":
                            !isVertical && !isReverse ? `-${distance}px` : "0px",
                        "--marquee-to-x":
                            !isVertical && isReverse ? `-${distance}px` : "0px",
                        "--marquee-from-y":
                            isVertical && !isReverse ? `-${distance}px` : "0px",
                        "--marquee-to-y":
                            isVertical && isReverse ? `-${distance}px` : "0px",
                        ...style,
                    } as React.CSSProperties
                }
                {...props}
            >
                <div
                    ref={measureRef}
                    aria-hidden
                    className={cn("absolute invisible", segmentClass)}
                >
                    {items}
                </div>
                <div
                    className={cn(
                        segmentClass,
                        "animate-[marquee-scroll_var(--marquee-duration)_linear_infinite]",
                        duration === 0 && "opacity-0",
                        pauseOnHover && "hover:paused"
                    )}
                >
                    <div ref={firstSegmentRef} className={segmentClass}>
                        {filledItems}
                    </div>
                    <div ref={secondSegmentRef} aria-hidden className={segmentClass}>
                        {filledItems}
                    </div>
                </div>
                {overlayChildren}
            </div>
        </>
    )
}
