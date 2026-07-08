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
import {
    Marquee,
    MarqueeItem,
    type MarqueeProps,
} from "@/components/ui/marquee";

const marqueeFromOptions = ["right", "left", "top", "bottom"] as const;
const marqueeImportCode = `import { Marquee, MarqueeItem } from "@/components/ui/marquee"`;

const marqueeControls = {
    speed: {
        type: "number",
        defaultValue: 100,
        min: 20,
        max: 300,
        step: 5,
        description: "Pixels per second for the scrolling track.",
    },
    from: {
        type: "select",
        defaultValue: "right",
        options: marqueeFromOptions,
        description: "Direction the marquee content enters from.",
    },
    gap: {
        type: "text",
        defaultValue: "4",
        placeholder: "4 or gap-8",
        description: "Tailwind gap class or gap scale number.",
    },
    autoFill: {
        type: "boolean",
        defaultValue: true,
        description: "Repeat content enough times to fill the container.",
    },
    pauseOnHover: {
        type: "boolean",
        defaultValue: false,
        description: "Pause the track when the viewport is hovered.",
    },
} satisfies DemoControlSchema;

type MarqueeControlValues = {
    [K in keyof typeof marqueeControls]: (typeof marqueeControls)[K]["defaultValue"];
};

const demoItems = [
    "Launch week",
    "Design systems",
    "Motion",
    "Registry blocks",
    "Open source",
    "Next.js",
];

function parseGapValue(value: string): MarqueeProps["gap"] {
    const trimmed = value.trim();

    if (!trimmed) return 4;

    const parsedNumber = Number(trimmed);

    return Number.isFinite(parsedNumber) ? parsedNumber : trimmed;
}

function buildMarqueeCode(values: MarqueeControlValues) {
    const propLines = [
        `  speed={${values.speed}}`,
        `  from="${values.from}"`,
        `  gap={${JSON.stringify(parseGapValue(values.gap))}}`,
        `  autoFill={${values.autoFill}}`,
        `  pauseOnHover={${values.pauseOnHover}}`,
    ];

    return `\
<div className="h-64 overflow-hidden rounded-2xl border bg-blue-100 flex items-center justify-center">
  <Marquee
${propLines.join("\n")}
  >
    {items.map((item) => (
      <MarqueeItem key={item}>
        <div className="rounded-full border border-border px-4 py-1">
          {item}
        </div>
      </MarqueeItem>
    ))}
  </Marquee>
</div>`;
}

function MarqueePreview({ controls }: { controls: MarqueeControlValues }) {
    return (
        <PreviewSurface>
            <div className="h-64 w-full overflow-hidden rounded-2xl border bg-blue-100 flex items-center justify-center">
                <Marquee
                    speed={controls.speed}
                    from={controls.from as MarqueeProps["from"]}
                    gap={parseGapValue(controls.gap)}
                    autoFill={controls.autoFill}
                    pauseOnHover={controls.pauseOnHover}
                >
                    {demoItems.map((item) => (
                        <MarqueeItem key={item}>
                            <div className="rounded-full border border-border bg-background/70 px-4 py-1 backdrop-blur-sm">
                                {item}
                            </div>
                        </MarqueeItem>
                    ))}
                </Marquee>
            </div>
        </PreviewSurface>
    );
}

export default function MarqueePage() {
    const { values, setValue, reset } = useDemoControls(marqueeControls);

    const marqueeCode = React.useMemo(() => buildMarqueeCode(values), [values]);

    return (
        <DocsPage
            title="Marquee"
            description="Continuous marquee wrapper with directional flow, normalized speed, and autofill support."
        >
            <DocsStack>
                <DocsPanel
                    title="Install"
                    description="Add the marquee component to your project."
                >
                    <CodeBlock label="Install" code="npx shadcn add @nos/marquee" language="bash" />
                </DocsPanel>

                <DocsPanel
                    title="Preview"
                    description="Tune marquee speed, direction, spacing, and fill behavior."
                >
                    <MarqueePreview controls={values} />
                </DocsPanel>

                <DocsPanel
                    title="Controls"
                    description="These inputs are generated from a shared control schema."
                >
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex h-8 items-center justify-center rounded-lg border px-3 text-sm"
                        >
                            Reset controls
                        </button>
                    </div>
                    <DemoControlsTable
                        schema={marqueeControls}
                        values={values}
                        setValue={setValue}
                    />
                </DocsPanel>

                <DocsPanel
                    title="Generated usage"
                    description="Copy the current marquee setup as a starting point."
                >
                    <CodeBlock label="Imports" code={marqueeImportCode} />
                    <CodeBlock label="Usage" code={marqueeCode} />
                </DocsPanel>
            </DocsStack>
        </DocsPage>
    );
}
