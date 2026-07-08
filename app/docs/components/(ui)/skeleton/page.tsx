"use client";

import * as React from "react";
import { type VariantProps } from "class-variance-authority";

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
import { Skeleton, skeletonVariants } from "@/components/ui/skeleton";

const animationOptions = ["pulse", "none"] as const;
const speedOptions = ["slow", "normal", "fast"] as const;
const toneOptions = ["default", "subtle", "strong"] as const;
const skeletonImportCode = `import { Skeleton } from "@/components/ui/skeleton"`;

const skeletonControls = {
    animation: {
        type: "select",
        defaultValue: "pulse",
        options: animationOptions,
        description: "Choose between pulsing motion or a static placeholder.",
    },
    speed: {
        type: "select",
        defaultValue: "normal",
        options: speedOptions,
        description: "Controls the pulse animation duration.",
    },
    tone: {
        type: "select",
        defaultValue: "default",
        options: toneOptions,
        description: "Adjust the contrast of the placeholder fill.",
    },
    fill: {
        type: "boolean",
        defaultValue: false,
        description: "Make the skeleton absolutely fill a positioned parent.",
    },
} satisfies DemoControlSchema;

type SkeletonControlValues = {
    [K in keyof typeof skeletonControls]: (typeof skeletonControls)[K]["defaultValue"];
};

type SkeletonVariantValues = Required<
    Pick<VariantProps<typeof skeletonVariants>, "animation" | "speed" | "tone">
>;

function buildSkeletonCode(values: SkeletonControlValues) {
    const propLines = [
        `  animation="${values.animation}"`,
        `  speed="${values.speed}"`,
        `  tone="${values.tone}"`,
        values.fill ? "  fill" : null,
        '  className="h-5 w-72 rounded-full"',
    ].filter(Boolean);

    return `<Skeleton
${propLines.join("\n")}
/>`;
}

function SkeletonCardPreview({ controls }: { controls: SkeletonControlValues }) {
    const variants: SkeletonVariantValues = {
        animation: controls.animation as SkeletonVariantValues["animation"],
        speed: controls.speed as SkeletonVariantValues["speed"],
        tone: controls.tone as SkeletonVariantValues["tone"],
    };

    return (
        <PreviewSurface>
            <div className="w-full max-w-md rounded-3xl border bg-background p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="relative size-14 overflow-hidden rounded-full">
                        <Skeleton {...variants} fill />
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton {...variants} className="h-5 w-72 rounded-full" />
                        <Skeleton {...variants} className="h-4 w-40 rounded-full" />
                    </div>
                </div>
                <div className="mt-5 flex flex-col gap-3">
                    <Skeleton {...variants} className="h-4 w-full rounded-full" />
                    <Skeleton {...variants} className="h-4 w-[92%] rounded-full" />
                    <Skeleton {...variants} className="h-4 w-[68%] rounded-full" />
                </div>
                {controls.fill ? (
                    <p className="mt-4 text-xs text-muted-foreground">
                        Preview note: the avatar uses <code>fill</code> inside a relative parent.
                    </p>
                ) : null}
            </div>
        </PreviewSurface>
    );
}

export default function SkeletonPage() {
    const { values, setValue, reset } = useDemoControls(skeletonControls);

    const skeletonCode = React.useMemo(() => buildSkeletonCode(values), [values]);

    return (
        <DocsPage
            title="Skeleton"
            description="Flexible loading placeholder with variant-driven animation, tone, speed, and optional fill behavior."
        >
            <DocsStack>
                <DocsPanel
                    title="Install"
                    description="Add the skeleton component to your project."
                >
                    <CodeBlock label="Install" code="npx shadcn add @nos/skeleton" language="bash" />
                </DocsPanel>

                <DocsPanel
                    title="Preview"
                    description="Try different placeholder treatments for lines, avatars, and card content."
                >
                    <SkeletonCardPreview controls={values} />
                </DocsPanel>

                <DocsPanel
                    title="Controls"
                    description="Adjust the shared variant props and sizing classes."
                >
                    <div className="flex flex-wrap gap-3">
                        <Button type="button" variant="outline" onClick={reset}>
                            Reset controls
                        </Button>
                    </div>
                    <DemoControlsTable
                        schema={skeletonControls}
                        values={values}
                        setValue={setValue}
                    />
                </DocsPanel>

                <DocsPanel
                    title="Generated usage"
                    description="Use the current control state as a copy-ready starting point."
                >
                    <CodeBlock label="Imports" code={skeletonImportCode} />
                    <CodeBlock label="Usage" code={skeletonCode} />
                </DocsPanel>
            </DocsStack>
        </DocsPage>
    );
}
