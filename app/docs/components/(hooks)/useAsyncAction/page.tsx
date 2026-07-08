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
import { useAsyncAction } from "@/hooks/useAsyncAction";

const useAsyncActionControls = {
    delayMs: {
        type: "number",
        defaultValue: 1500,
        min: 250,
        max: 5000,
        step: 250,
        description: "How long the fake async operation should run.",
    },
    shouldFail: {
        type: "boolean",
        defaultValue: false,
        description: "Throw an error after the async operation completes.",
    },
} satisfies DemoControlSchema;
const useAsyncActionImportCode = `import { useAsyncAction } from "@/hooks/useAsyncAction"`;

type UseAsyncActionControlValues = {
    [K in keyof typeof useAsyncActionControls]: (typeof useAsyncActionControls)[K]["defaultValue"];
};

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildHookCode(values: UseAsyncActionControlValues) {
    return `const { running, error, run } = useAsyncAction()

const onClick = () => {
  run(async () => {
    await sleep(${values.delayMs})
${values.shouldFail ? `    throw new Error("Something went wrong")` : `    // async work completed`}
  })
}`;
}

function UseAsyncActionPreview({
    controls,
}: {
    controls: UseAsyncActionControlValues;
}) {
    const { running, error, run } = useAsyncAction();
    const [completedCount, setCompletedCount] = React.useState(0);

    const runDemo = React.useCallback(() => {
        run(async () => {
            await sleep(controls.delayMs);

            if (controls.shouldFail) {
                throw new Error("Something went wrong");
            }

            setCompletedCount((prev) => prev + 1);
        }).catch(() => {
            // Error is stored in hook state.
        });
    }, [controls.delayMs, controls.shouldFail, run]);

    return (
        <PreviewSurface>
            <div className="flex w-full flex-col gap-4">
                <div className="flex flex-wrap gap-3">
                    <Button onClick={runDemo} disabled={running}>
                        {running ? "Running..." : "Run async action"}
                    </Button>
                </div>

                <div className="rounded-2xl border bg-muted/30 p-4 text-sm">
                    <dl className="space-y-2 text-muted-foreground">
                        <div className="flex justify-between gap-3">
                            <dt>running</dt>
                            <dd>{String(running)}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt>error</dt>
                            <dd>{error instanceof Error ? error.message : "none"}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt>completed</dt>
                            <dd>{completedCount}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </PreviewSurface>
    );
}

export default function UseAsyncActionPage() {
    const { values, setValue, reset } = useDemoControls(useAsyncActionControls);
    const hookCode = React.useMemo(() => buildHookCode(values), [values]);

    return (
        <DocsPage
            title="useAsyncAction"
            description="Run async actions with shared running and error state."
        >
            <DocsStack>
                <DocsPanel
                    title="Install"
                    description="Add the async action hook to your project."
                >
                    <CodeBlock label="Install" code="npx shadcn add @nos/use-async-action" language="bash" />
                </DocsPanel>

                <DocsPanel
                    title="Preview"
                    description="Run a fake async operation and watch the hook state update."
                >
                    <UseAsyncActionPreview controls={values} />
                </DocsPanel>

                <DocsPanel
                    title="Controls"
                    description="Tweak the fake async action behavior."
                >
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={reset}>
                            Reset controls
                        </Button>
                    </div>

                    <DemoControlsTable
                        schema={useAsyncActionControls}
                        values={values}
                        setValue={setValue}
                    />
                </DocsPanel>

                <DocsPanel
                    title="Generated usage"
                    description="Copy a starting point using the current hook settings."
                >
                    <CodeBlock label="Imports" code={useAsyncActionImportCode} />
                    <CodeBlock label="Usage" code={hookCode} />
                </DocsPanel>
            </DocsStack>
        </DocsPage>
    );
}
