"use client"

import * as React from "react"

import {
    DemoControlsTable,
    useDemoControls,
    type DemoControlSchema,
} from "@/app/docs/components/_components/demo-controls"
import {
    CodeBlock,
    DocsPage,
    DocsPanel,
    DocsStack,
    PreviewSurface,
} from "@/app/docs/components/_components/demo-layout"
import { Button } from "@/components/ui/button"
import ToothedFrame, {
    type ToothedFrameDirection,
} from "@/components/ui/tooth-frame"

type ToothFrameOrientation = "auto" | "horizontal" | "vertical"

const orientationOptions = ["auto", "horizontal", "vertical"] as const
const directionOptions = ["off", "cw", "ccw"] as const

const toothFrameControls = {
    orientation: {
        type: "select",
        defaultValue: "auto",
        options: orientationOptions,
        description: "Resolve the belt layout automatically or force an axis.",
    },
    direction: {
        type: "select",
        defaultValue: "cw",
        options: directionOptions,
        description: "Set the tooth animation direction.",
    },
    innerWidth: {
        type: "number",
        defaultValue: 260,
        min: 80,
        max: 520,
        step: 10,
        description: "Explicit width for the inner pill.",
    },
    innerHeight: {
        type: "number",
        defaultValue: 104,
        min: 40,
        max: 320,
        step: 4,
        description: "Explicit height for the inner pill.",
    },
    outerThickness: {
        type: "number",
        defaultValue: 34,
        min: 8,
        max: 80,
        step: 2,
        description: "Distance from the inner pill edge to the outer body edge.",
    },
    toothSpacingFromInner: {
        type: "number",
        defaultValue: 8,
        min: 0,
        max: 40,
        step: 1,
        description: "Gap between the inner pill and tooth stroke.",
    },
    teethThickness: {
        type: "number",
        defaultValue: 18,
        min: 4,
        max: 48,
        step: 1,
        description: "Stroke thickness for each moving tooth.",
    },
    toothWidth: {
        type: "number",
        defaultValue: 14,
        min: 2,
        max: 40,
        step: 1,
        description: "Visible segment length for each tooth.",
    },
    toothGap: {
        type: "number",
        defaultValue: 7,
        min: 1,
        max: 32,
        step: 1,
        description: "Spacing between tooth segments.",
    },
    toothSpeed: {
        type: "number",
        defaultValue: 0.35,
        min: 0,
        max: 2,
        step: 0.05,
        description: "Seconds for one tooth-pitch movement.",
    },
    outerFill: {
        type: "color",
        defaultValue: "#111827",
        alpha: true,
        description: "Outer frame fill color.",
    },
    outerStroke: {
        type: "color",
        defaultValue: "#475569",
        alpha: true,
        description: "Outer frame stroke color.",
    },
    teethFill: {
        type: "color",
        defaultValue: "#22c55e",
        alpha: true,
        description: "Animated tooth stroke color.",
    },
    innerFill: {
        type: "color",
        defaultValue: "#f8fafc",
        alpha: true,
        description: "Inner pill fill color.",
    },
} satisfies DemoControlSchema

type ToothFrameControlValues = {
    [K in keyof typeof toothFrameControls]: (typeof toothFrameControls)[K]["defaultValue"]
}

function buildToothFrameCode(values: ToothFrameControlValues) {
    const propLines = [
        `  orientation="${values.orientation}"`,
        `  direction="${values.direction}"`,
        `  innerWidth={${values.innerWidth}}`,
        `  innerHeight={${values.innerHeight}}`,
        `  outerThickness={${values.outerThickness}}`,
        `  toothSpacingFromInner={${values.toothSpacingFromInner}}`,
        `  teethThickness={${values.teethThickness}}`,
        `  toothWidth={${values.toothWidth}}`,
        `  toothGap={${values.toothGap}}`,
        `  toothSpeed={${values.toothSpeed}}`,
        `  outerFill="${values.outerFill}"`,
        `  outerStroke="${values.outerStroke}"`,
        `  teethFill="${values.teethFill}"`,
        `  innerFill="${values.innerFill}"`,
        '  contentClassName="text-zinc-950"',
    ]

    return `<ToothedFrame
${propLines.join("\n")}
>
  <div className="flex flex-col items-center leading-none">
    <span className="text-sm font-medium">Drive</span>
    <span className="mt-2 text-3xl font-semibold">Ready</span>
  </div>
</ToothedFrame>`
}

function ToothFramePreview({
    controls,
}: {
    controls: ToothFrameControlValues
}) {
    return (
        <PreviewSurface>
            <div className="flex w-full items-center justify-center p-6">
                <ToothedFrame
                    orientation={controls.orientation as ToothFrameOrientation}
                    direction={controls.direction as ToothedFrameDirection}
                    innerWidth={controls.innerWidth}
                    innerHeight={controls.innerHeight}
                    outerThickness={controls.outerThickness}
                    toothSpacingFromInner={controls.toothSpacingFromInner}
                    teethThickness={controls.teethThickness}
                    toothWidth={controls.toothWidth}
                    toothGap={controls.toothGap}
                    toothSpeed={controls.toothSpeed}
                    outerFill={controls.outerFill}
                    outerStroke={controls.outerStroke}
                    teethFill={controls.teethFill}
                    innerFill={controls.innerFill}
                    contentClassName="text-zinc-950"
                >
                    <div className="flex flex-col items-center leading-none">
                        <span className="text-sm font-medium">Drive</span>
                        <span className="mt-2 text-3xl font-semibold">Ready</span>
                    </div>
                </ToothedFrame>
            </div>
        </PreviewSurface>
    )
}

export default function ToothFramePage() {
    const { values, setValue, reset } = useDemoControls(toothFrameControls)

    const toothFrameCode = React.useMemo(
        () => buildToothFrameCode(values),
        [values]
    )

    return (
        <DocsPage
            title="Tooth Frame"
            description="Animated pill frame with configurable tooth geometry, direction, sizing, and colors."
        >
            <DocsStack>
                <DocsPanel
                    title="Install"
                    description="Add the tooth frame component to your project."
                >
                    <CodeBlock code="npx shadcn add @nos/tooth-frame" language="bash" />
                </DocsPanel>

                <DocsPanel
                    title="Preview"
                    description="Tune the belt dimensions and animation around live content."
                >
                    <ToothFramePreview controls={values} />
                </DocsPanel>

                <DocsPanel
                    title="Controls"
                    description="Adjust the SVG geometry, movement, and paint values."
                >
                    <div className="flex flex-wrap gap-3">
                        <Button type="button" variant="outline" onClick={reset}>
                            Reset controls
                        </Button>
                    </div>
                    <DemoControlsTable
                        schema={toothFrameControls}
                        values={values}
                        setValue={setValue}
                    />
                </DocsPanel>

                <DocsPanel
                    title="Generated usage"
                    description="Use the current control state as a copy-ready starting point."
                >
                    <CodeBlock code={toothFrameCode} />
                </DocsPanel>
            </DocsStack>
        </DocsPage>
    )
}
