"use client";

import * as React from "react";

import {
    DemoControlsTable,
    useDemoControls,
    type DemoControlSchema,
} from "@/app/docs/components/_components/demo-controls";
import {
    CodeBlock,
    DocsPage,
    DocsPanel,
    DocsStack,
    PreviewSurface,
} from "@/app/docs/components/_components/demo-layout";
import { Button } from "@/components/ui/button";
import { Reveal, type RevealProps } from "@/components/ui/reveal";

const revealDirectionOptions = ["none", "up", "down", "left", "right"] as const;

const revealControls = {
    delay: {
        type: "number",
        defaultValue: 0.2,
        min: 0,
        max: 2,
        step: 0.1,
        description: "Wait time before the animation starts.",
    },
    duration: {
        type: "number",
        defaultValue: 0.3,
        min: 0.1,
        max: 5,
        step: 0.1,
        description: "How long the reveal animation takes.",
    },
    direction: {
        type: "select",
        defaultValue: "up",
        options: revealDirectionOptions,
        description: "Preset direction offset when x/y are not set.",
    },
    triggerOnView: {
        type: "boolean",
        defaultValue: true,
        description: "Animate when the element enters the viewport.",
    },
    triggerOnce: {
        type: "boolean",
        defaultValue: false,
        description: "Only animate the first time it becomes visible.",
    },
    viewAmount: {
        type: "number",
        defaultValue: 0.2,
        min: 0,
        max: 1,
        step: 0.05,
        description: "How much of the element must be visible to trigger.",
    },
    x: {
        type: "text",
        defaultValue: "",
        placeholder: "24 or 50%",
        description: "Optional horizontal offset. Overrides direction when set.",
    },
    y: {
        type: "text",
        defaultValue: "",
        placeholder: "24 or 50%",
        description: "Optional vertical offset. Overrides direction when set.",
    },
    blur: {
        type: "number",
        defaultValue: 2,
        min: 0,
        max: 20,
        step: 1,
        description: "Starting blur amount in pixels.",
    },
    scale: {
        type: "number",
        defaultValue: 0.9,
        min: 0,
        max: 2,
        step: 0.05,
        description: "Starting scale before the reveal completes.",
    },
    rotate: {
        type: "number",
        defaultValue: 0,
        min: -180,
        max: 180,
        step: 5,
        description: "Starting rotation in degrees.",
    },
} satisfies DemoControlSchema;

type RevealControlValues = {
    [K in keyof typeof revealControls]: (typeof revealControls)[K]["defaultValue"];
};

function formatPropValue(value: string | number | boolean) {
    if (typeof value === "string") return JSON.stringify(value);
    return String(value);
}

function parseOffsetValue(value: string) {
    const trimmed = value.trim();

    if (!trimmed) return undefined;

    const parsedNumber = Number(trimmed);

    return Number.isFinite(parsedNumber) ? parsedNumber : trimmed;
}

function buildRevealCode(values: RevealControlValues) {
    const propLines = Object.entries(values).flatMap(([key, value]) => {
        if ((key === "x" || key === "y") && typeof value === "string" && !value.trim()) {
            return [];
        }

        return [`  ${key}={${formatPropValue(value)}}`];
    });

    return `<Reveal
${propLines.join("\n")}
>
  <div className="size-32 rounded-3xl bg-blue-500" />
</Reveal>`;
}

function RevealPreview({
    controls,
    replayKey,
}: {
    controls: RevealControlValues;
    replayKey: number;
}) {
    const revealProps: RevealProps = {
        delay: controls.delay,
        duration: controls.duration,
        direction: controls.direction as RevealProps["direction"],
        triggerOnView: controls.triggerOnView,
        triggerOnce: controls.triggerOnce,
        viewAmount: controls.viewAmount,
        x: parseOffsetValue(controls.x),
        y: parseOffsetValue(controls.y),
        blur: controls.blur,
        scale: controls.scale,
        rotate: controls.rotate,
    };

    return (
        <PreviewSurface>
            <Reveal key={replayKey} {...revealProps}>
                <div className="size-32 rounded-3xl bg-blue-500" />
            </Reveal>
        </PreviewSurface>
    );
}

function RevealActions({
    onReplay,
    onReset,
}: {
    onReplay: () => void;
    onReset: () => void;
}) {
    return (
        <div className="flex flex-wrap gap-3">
            <Button onClick={onReplay}>Replay animation</Button>
            <Button variant="outline" onClick={onReset}>
                Reset controls
            </Button>
        </div>
    );
}

export default function RevealPage() {
    const { values, setValue, reset } = useDemoControls(revealControls);
    const [replayKey, setReplayKey] = React.useState(0);

    const handleReplay = React.useCallback(() => {
        setReplayKey((prev) => prev + 1);
    }, []);

    const handleReset = React.useCallback(() => {
        reset();
        setReplayKey((prev) => prev + 1);
    }, [reset]);

    const revealCode = React.useMemo(() => buildRevealCode(values), [values]);

    return (
        <DocsPage
            title="Reveal"
            description="Schema-driven playground for tuning reveal motion without hand-writing state for every control."
        >
            <DocsStack>
                <DocsPanel
                    title="Install"
                    description="Add the reveal component to your project."
                >
                    <CodeBlock code="npx shadcn add @nos/reveal" language="bash" />
                </DocsPanel>

                <DocsPanel
                    title="Preview"
                    description="Use replay to restart the animation after changing options."
                >
                    <RevealPreview controls={values} replayKey={replayKey} />
                </DocsPanel>

                <DocsPanel
                    title="Controls"
                    description="These inputs are generated from a shared control schema."
                >
                    <RevealActions onReplay={handleReplay} onReset={handleReset} />
                    <DemoControlsTable
                        schema={revealControls}
                        values={values}
                        setValue={setValue}
                    />
                </DocsPanel>

                <DocsPanel
                    title="Generated usage"
                    description="The same control state can drive copy-ready example code."
                >
                    <CodeBlock code={revealCode} />
                </DocsPanel>
            </DocsStack>
        </DocsPage>
    );
}
