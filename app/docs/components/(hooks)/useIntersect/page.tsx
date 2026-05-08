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
import { useIntersect, useIntersectOnce } from "@/hooks/useIntersect";

const useIntersectControls = {
    threshold: {
        type: "number",
        defaultValue: 0.25,
        min: 0,
        max: 1,
        step: 0.05,
        description: "How much of the target must be visible before it counts as intersecting.",
    },
    rootMargin: {
        type: "text",
        defaultValue: "0px",
        placeholder: "0px 0px -20% 0px",
        description: "IntersectionObserver rootMargin string.",
    },
    triggerOnce: {
        type: "boolean",
        defaultValue: false,
        description: "Stop observing after the first successful intersection.",
    },
    disabled: {
        type: "boolean",
        defaultValue: false,
        description: "Temporarily disable the observer.",
    },
    useOnceHelper: {
        type: "boolean",
        defaultValue: false,
        description: "Use useIntersectOnce instead of useIntersect in the demo.",
    },
} satisfies DemoControlSchema;

type UseIntersectControlValues = {
    [K in keyof typeof useIntersectControls]: (typeof useIntersectControls)[K]["defaultValue"];
};

function formatPropValue(value: string | number | boolean) {
    if (typeof value === "string") return JSON.stringify(value);
    return String(value);
}

function buildHookCode(values: UseIntersectControlValues) {
    const baseOptions = [
        `threshold: ${formatPropValue(values.threshold)}`,
        `rootMargin: ${formatPropValue(values.rootMargin)}`,
        `disabled: ${formatPropValue(values.disabled)}`,
    ];

    if (!values.useOnceHelper) {
        baseOptions.push(`triggerOnce: ${formatPropValue(values.triggerOnce)}`);
    }

    const hookName = values.useOnceHelper ? "useIntersectOnce" : "useIntersect";

    return `const scrollRootRef = React.useRef<HTMLDivElement | null>(null)

const { ref, entry, isIntersecting, hasIntersected } = ${hookName}({
  root: scrollRootRef.current,
  ${baseOptions.join(",\n  ")},
})

return (
  <div ref={scrollRootRef} className="h-72 overflow-y-auto">
    <div className="h-64" />
    <div ref={ref}>Observed target</div>
    <div className="h-64" />
  </div>
)`;
}

function StatusPill({
    label,
    active,
}: {
    label: string;
    active: boolean;
}) {
    return (
        <div
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                active
                    ? "border-green-500/40 bg-green-500/10 text-green-700"
                    : "border-border bg-muted/60 text-muted-foreground"
            }`}
        >
            {label}: {String(active)}
        </div>
    );
}

function UseIntersectPreviewBody({
    controls,
}: {
    controls: UseIntersectControlValues;
}) {
    const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
    const targetRef = React.useRef<HTMLDivElement | null>(null);

    const intersectState = useIntersect({
        root,
        rootMargin: controls.rootMargin,
        threshold: controls.threshold,
        disabled: controls.disabled,
        triggerOnce: controls.triggerOnce,
    });

    const intersectOnceState = useIntersectOnce({
        root,
        rootMargin: controls.rootMargin,
        threshold: controls.threshold,
        disabled: controls.disabled,
    });

    const activeState = controls.useOnceHelper ? intersectOnceState : intersectState;

    const scrollToTarget = React.useCallback(() => {
        targetRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, []);

    const scrollToTop = React.useCallback(() => {
        root?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [root]);

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex flex-wrap gap-3">
                <Button onClick={scrollToTarget}>Scroll to target</Button>
                <Button variant="outline" onClick={scrollToTop}>
                    Back to top
                </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
                <StatusPill label="isIntersecting" active={activeState.isIntersecting} />
                <StatusPill label="hasIntersected" active={activeState.hasIntersected} />
                <StatusPill label="triggerOnce" active={controls.triggerOnce} />
                <StatusPill label="disabled" active={controls.disabled} />
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div
                    ref={setRoot}
                    className="h-80 overflow-y-auto rounded-2xl border bg-background"
                >
                    <div className="flex min-h-[44rem] flex-col items-center px-6 py-6">
                        <div className="mb-64 flex w-full max-w-md justify-center rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                            Scroll down inside this container
                        </div>

                        <div
                            ref={(node) => {
                                targetRef.current = node;
                                activeState.ref(node);
                            }}
                            className={`w-full max-w-md rounded-2xl border p-6 transition-colors ${
                                activeState.isIntersecting
                                    ? "border-green-500/50 bg-green-500/10"
                                    : "border-border bg-muted/40"
                            }`}
                        >
                            <div className="mb-2 text-sm font-medium">Observed target</div>
                            <div className="text-sm text-muted-foreground">
                                This block is wired to{" "}
                                {controls.useOnceHelper ? "useIntersectOnce" : "useIntersect"}.
                            </div>
                        </div>

                        <div className="mt-64 flex w-full max-w-md justify-center rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                            Keep scrolling to move the target back out of view
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
                    <div className="mb-3 font-medium">Latest entry</div>
                    <dl className="space-y-2 text-muted-foreground">
                        <div className="flex justify-between gap-3">
                            <dt>ratio</dt>
                            <dd>{activeState.entry?.intersectionRatio?.toFixed(2) ?? "0.00"}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt>time</dt>
                            <dd>{Math.round(activeState.entry?.time ?? 0)}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt>hook</dt>
                            <dd>{controls.useOnceHelper ? "useIntersectOnce" : "useIntersect"}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt>margin</dt>
                            <dd>{controls.rootMargin}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt>threshold</dt>
                            <dd>{controls.threshold}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

function UseIntersectPreview({
    controls,
    previewKey,
}: {
    controls: UseIntersectControlValues;
    previewKey: number;
}) {
    return (
        <PreviewSurface>
            <UseIntersectPreviewBody key={previewKey} controls={controls} />
        </PreviewSurface>
    );
}

export default function UseIntersectPage() {
    const { values, setValue, reset } = useDemoControls(useIntersectControls);
    const [previewKey, setPreviewKey] = React.useState(0);

    const resetPreview = React.useCallback(() => {
        setPreviewKey((prev) => prev + 1);
    }, []);

    const resetAll = React.useCallback(() => {
        reset();
        setPreviewKey((prev) => prev + 1);
    }, [reset]);

    const hookCode = React.useMemo(() => buildHookCode(values), [values]);

    return (
        <DocsPage
            title="useIntersect"
            description="IntersectionObserver hook with shared observer buckets, trigger-once behavior, and a convenience useIntersectOnce wrapper."
        >
            <DocsStack>
                <DocsPanel
                    title="Preview"
                    description="Scroll inside the preview container to watch the hook state update."
                >
                    <UseIntersectPreview controls={values} previewKey={previewKey} />
                </DocsPanel>

                <DocsPanel
                    title="Controls"
                    description="Tweak the observer options and reset the demo when you want a fresh pass."
                >
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={resetPreview}>Reset preview</Button>
                        <Button variant="outline" onClick={resetAll}>
                            Reset controls
                        </Button>
                    </div>
                    <DemoControlsTable
                        schema={useIntersectControls}
                        values={values}
                        setValue={setValue}
                    />
                </DocsPanel>

                <DocsPanel
                    title="Generated usage"
                    description="Copy a starting point using the current hook settings."
                >
                    <CodeBlock code={hookCode} />
                </DocsPanel>
            </DocsStack>
        </DocsPage>
    );
}
