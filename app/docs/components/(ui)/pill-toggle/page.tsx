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
import { PillToggle, type PillToggleProps } from "@/components/ui/pill-toggle"
import { Button } from "@/components/ui/button"

const sizeOptions = ["sm", "default", "lg"] as const
const variantOptions = ["default", "outline", "soft", "contrast"] as const
const pillToggleImportCode = `import { PillToggle } from "@/components/ui/pill-toggle"`

const pillToggleControls = {
  value: {
    type: "boolean",
    defaultValue: false as boolean,
    falseText: "Off",
    trueText: "On",
    description: "Controlled boolean value.",
  },
  falseText: {
    type: "text",
    defaultValue: "No",
    placeholder: "false",
    description: "Text shown on the false side.",
  },
  trueText: {
    type: "text",
    defaultValue: "Yes",
    placeholder: "true",
    description: "Text shown on the true side.",
  },
  size: {
    type: "select",
    defaultValue: "default",
    options: sizeOptions,
    description: "Adjust the toggle height, minimum width, and text size.",
  },
  variant: {
    type: "select",
    defaultValue: "default",
    options: variantOptions,
    description: "Choose the track and thumb treatment.",
  },
  fullWidth: {
    type: "boolean",
    defaultValue: false as boolean,
    description: "Stretch the toggle to fill its parent width.",
  },
  disabled: {
    type: "boolean",
    defaultValue: false as boolean,
    description: "Disable pointer and keyboard interaction.",
  },
  readOnly: {
    type: "boolean",
    defaultValue: false as boolean,
    description: "Keep the toggle focusable but prevent value changes.",
  },
} satisfies DemoControlSchema

type PillToggleControlValues = {
  [K in keyof typeof pillToggleControls]: (typeof pillToggleControls)[K]["defaultValue"]
}

function buildPillToggleCode(values: PillToggleControlValues) {
  const propLines = [
    "  value={enabled}",
    "  onValueChange={setEnabled}",
    `  falseText={${JSON.stringify(values.falseText)}}`,
    `  trueText={${JSON.stringify(values.trueText)}}`,
    `  size="${values.size}"`,
    `  variant="${values.variant}"`,
    values.fullWidth ? "  fullWidth" : null,
    values.disabled ? "  disabled" : null,
    values.readOnly ? "  readOnly" : null,
  ].filter(Boolean)

  return `const [enabled, setEnabled] = React.useState(${values.value})

<PillToggle
${propLines.join("\n")}
/>`
}

function PillTogglePreview({
  controls,
  onValueChange,
}: {
  controls: PillToggleControlValues
  onValueChange: (value: boolean) => void
}) {
  return (
    <PreviewSurface>
      <div className="flex w-full max-w-md flex-col items-center gap-5">
        <div className="flex w-full items-center justify-between gap-5 rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-sm font-medium">Feature flag</span>
            <span className="text-xs text-muted-foreground">
              {controls.value ? "Enabled" : "Disabled"}
            </span>
          </div>
          <PillToggle
            value={controls.value}
            onValueChange={onValueChange}
            falseText={controls.falseText}
            trueText={controls.trueText}
            size={controls.size as PillToggleProps["size"]}
            variant={controls.variant as PillToggleProps["variant"]}
            disabled={controls.disabled}
            readOnly={controls.readOnly}
          />
        </div>

        <PillToggle
          value={controls.value}
          onValueChange={onValueChange}
          falseText={controls.falseText}
          trueText={controls.trueText}
          size={controls.size as PillToggleProps["size"]}
          variant={controls.variant as PillToggleProps["variant"]}
          fullWidth={controls.fullWidth}
          disabled={controls.disabled}
          readOnly={controls.readOnly}
        />
      </div>
    </PreviewSurface>
  )
}

export default function PillTogglePage() {
  const { values, setValue, reset } = useDemoControls(pillToggleControls)

  const pillToggleCode = React.useMemo(
    () => buildPillToggleCode(values),
    [values]
  )

  return (
    <DocsPage
      title="Pill Toggle"
      description="Segmented boolean control with controlled and uncontrolled state, text labels, sizing, variants, and form-friendly input props."
    >
      <DocsStack>
        <DocsPanel
          title="Preview"
          description="Tune the labels and interaction state for a true/false choice."
        >
          <PillTogglePreview
            controls={values}
            onValueChange={(nextValue) => setValue("value", nextValue)}
          />
        </DocsPanel>

        <DocsPanel
          title="Controls"
          description="Adjust the reusable pill toggle props."
        >
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={reset}>
              Reset controls
            </Button>
          </div>
          <DemoControlsTable
            schema={pillToggleControls}
            values={values}
            setValue={setValue}
          />
        </DocsPanel>

        <DocsPanel
          title="Usage"
          description="Add the pill toggle component to your project."
        >
          <CodeBlock
            label="Install"
            code="npx shadcn add @nos/pill-toggle"
            language="bash"
          />
          <CodeBlock label="Imports" code={pillToggleImportCode} />
          <CodeBlock label="Usage" code={pillToggleCode} />
        </DocsPanel>
      </DocsStack>
    </DocsPage>
  )
}
