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
import {
  ColorControl,
  useColor,
  type ColorControlTriggerProps,
  type ColorState,
} from "@/components/ui/color-control"

const defaultColor = "#3b82f688"
const colorControlImportCode = `import { ColorControl, useColor } from "@/components/ui/color-control"`

const colorControlControls = {
  alpha: {
    type: "boolean",
    defaultValue: true,
    description: "Use the alpha-aware hex picker and eight-digit hex input.",
  },
  popup: {
    type: "boolean",
    defaultValue: false,
    description: "Render the picker inside a popover trigger.",
  },
  customTrigger: {
    type: "boolean",
    defaultValue: false,
    description: "Use a custom popover trigger when popup mode is enabled.",
  },
} satisfies DemoControlSchema

type ColorControlValues = {
  [K in keyof typeof colorControlControls]: (typeof colorControlControls)[K]["defaultValue"]
}

function getUsageColor(color: string, alpha: boolean) {
  return alpha ? color : color.slice(0, 7)
}

function buildColorControlCode(values: ColorControlValues, color: string) {
  const usageColor = getUsageColor(color, values.alpha)

  if (values.popup && values.customTrigger) {
    return `const accent = useColor("${usageColor}")

<ColorControl
  colorState={accent}
  alpha={${values.alpha}}
  popup={${values.popup}}
  trigger={({ color, value }) => (
    <button className="flex items-center gap-3 rounded-full border px-4 py-2 text-sm">
      <span
        className="h-6 w-6 rounded-full border"
        style={{ backgroundColor: color }}
      />
      <span>{value}</span>
    </button>
  )}
/>`
  }

  return `const accent = useColor("${usageColor}")

<ColorControl
  colorState={accent}
  alpha={${values.alpha}}
  popup={${values.popup}}
/>`
}

function CustomTrigger({ color, value }: ColorControlTriggerProps) {
  return (
    <button className="flex items-center gap-3 rounded-full border bg-background px-4 py-2 text-sm shadow-sm">
      <span
        className="h-6 w-6 rounded-full border"
        style={{ backgroundColor: color }}
      />
      <span>{value}</span>
    </button>
  )
}

function ColorControlPreview({
  colorState,
  controls,
}: {
  colorState: ColorState
  controls: ColorControlValues
}) {
  const trigger =
    controls.popup && controls.customTrigger ? CustomTrigger : undefined

  return (
    <PreviewSurface>
      <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row">
        <div className="flex min-h-56 min-w-64 items-center justify-center">
          <ColorControl
            colorState={colorState}
            alpha={controls.alpha}
            popup={controls.popup}
            trigger={trigger}
          />
        </div>

        <div className="w-full max-w-xs overflow-hidden rounded-xl border bg-background shadow-sm">
          <div
            className="h-24 border-b"
            style={{ backgroundColor: colorState.color }}
          />
          <div
            className="flex flex-col gap-3 p-4"
            style={{
              backgroundColor: colorState.color,
              color: colorState.textColor,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Accent</span>
              <span className="font-mono text-xs">
                {getUsageColor(colorState.color, controls.alpha)}
              </span>
            </div>
            <p className="text-sm">
              The preview uses the hook color for fill and the derived
              contrasting text color for readable foreground content.
            </p>
          </div>
        </div>
      </div>
    </PreviewSurface>
  )
}

export default function ColorControlPage() {
  const { values, setValue, reset } = useDemoControls(colorControlControls)
  const accent = useColor(defaultColor)
  const { color, setColor, setIsEditing } = accent

  const handleReset = React.useCallback(() => {
    reset()
    setColor(defaultColor)
    setIsEditing(false)
  }, [reset, setColor, setIsEditing])

  const colorControlCode = React.useMemo(
    () => buildColorControlCode(values, color),
    [values, color]
  )

  return (
    <DocsPage
      title="Color Control"
      description="Hook-driven color picker with inline and popover modes, optional alpha, and custom triggers."
    >
      <DocsStack>
        <DocsPanel
          title="Preview"
          description="Edit the color and switch between inline, popover, and custom trigger modes."
        >
          <ColorControlPreview colorState={accent} controls={values} />
        </DocsPanel>

        <DocsPanel
          title="Controls"
          description="Toggle the picker mode and generated usage."
        >
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset controls
            </Button>
          </div>
          <DemoControlsTable
            schema={colorControlControls}
            values={values}
            setValue={setValue}
          />
        </DocsPanel>

        <DocsPanel
          title="Usage"
          description="Add the color control component to your project."
        >
          <CodeBlock
            label="Install"
            code="npx shadcn add @nos/color-control"
            language="bash"
          />
          <CodeBlock label="Imports" code={colorControlImportCode} />
          <CodeBlock label="Usage" code={colorControlCode} />
        </DocsPanel>
      </DocsStack>
    </DocsPage>
  )
}
