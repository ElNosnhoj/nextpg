"use client"

import * as React from "react"
import {
  CloudMoon,
  CloudSun,
  Eclipse,
  Lightbulb,
  Moon,
  MoonStar,
  Sparkles,
  Stars,
  Sun,
  Sunrise,
  type LucideIcon,
} from "lucide-react"

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
import DarkModeToggle from "@/components/ui/dark-mode-toggle"

const lightIconOptions = [
  "Sun",
  "Sunrise",
  "CloudSun",
  "Lightbulb",
  "Sparkles",
] as const

const darkIconOptions = [
  "MoonStar",
  "Moon",
  "CloudMoon",
  "Eclipse",
  "Stars",
] as const

const sizeOptions = ["xs", "sm", "default", "lg", "xl"] as const
const variantOptions = ["default", "outline", "ghost"] as const
const darkModeToggleImportCode = `import { MoonStar, Sun } from "lucide-react"
import DarkModeToggle from "@/components/ui/dark-mode-toggle"`

const iconComponents = {
  CloudMoon,
  CloudSun,
  Eclipse,
  Lightbulb,
  Moon,
  MoonStar,
  Sparkles,
  Stars,
  Sun,
  Sunrise,
} satisfies Record<string, LucideIcon>

type IconName = keyof typeof iconComponents
type DarkModeToggleSize = (typeof sizeOptions)[number]
type DarkModeToggleVariant = (typeof variantOptions)[number]

const darkModeToggleControls = {
  lightIcon: {
    type: "select",
    defaultValue: "Sun",
    options: lightIconOptions,
    description: "Lucide icon rendered for light mode.",
  },
  darkIcon: {
    type: "select",
    defaultValue: "MoonStar",
    options: darkIconOptions,
    description: "Lucide icon rendered for dark mode.",
  },
  size: {
    type: "select",
    defaultValue: "default",
    options: sizeOptions,
    description: "Set the button and icon dimensions.",
  },
  variant: {
    type: "select",
    defaultValue: "default",
    options: variantOptions,
    description: "Choose the button style variant.",
  },
} satisfies DemoControlSchema

type DarkModeToggleControlValues = {
  [K in keyof typeof darkModeToggleControls]: (typeof darkModeToggleControls)[K]["defaultValue"]
}

function getIcon(name: string, fallback: IconName) {
  return iconComponents[name as IconName] ?? iconComponents[fallback]
}

function buildDarkModeToggleCode(values: DarkModeToggleControlValues) {
  const iconImports = Array.from(
    new Set([values.lightIcon, values.darkIcon])
  ).sort()

  return `import { ${iconImports.join(", ")} } from "lucide-react"
import DarkModeToggle from "@/components/ui/dark-mode-toggle"

<DarkModeToggle
  light={${values.lightIcon}}
  dark={${values.darkIcon}}
  size="${values.size}"
  variant="${values.variant}"
  aria-label="Toggle dark mode"
/>`
}

function DarkModeTogglePreview({
  controls,
}: {
  controls: DarkModeToggleControlValues
}) {
  const LightIcon = getIcon(controls.lightIcon, "Sun")
  const DarkIcon = getIcon(controls.darkIcon, "MoonStar")

  return (
    <PreviewSurface>
      <div className="flex w-full max-w-md items-center justify-between gap-5 rounded-xl border bg-background p-5 shadow-sm">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-sm font-medium">Theme</span>
          <span className="text-xs text-muted-foreground">
            Light and dark icons crossfade with the active theme.
          </span>
        </div>

        <DarkModeToggle
          light={LightIcon}
          dark={DarkIcon}
          size={controls.size as DarkModeToggleSize}
          variant={controls.variant as DarkModeToggleVariant}
          aria-label="Toggle dark mode"
        />
      </div>
    </PreviewSurface>
  )
}

export default function DarkModeTogglePage() {
  const { values, setValue, reset } = useDemoControls(darkModeToggleControls)

  const darkModeToggleCode = React.useMemo(
    () => buildDarkModeToggleCode(values),
    [values]
  )

  return (
    <DocsPage
      title="Dark Mode Toggle"
      description="Animated theme toggle button powered by next-themes and configurable lucide light/dark icons."
    >
      <DocsStack>
        <DocsPanel
          title="Preview"
          description="Switch the active theme and try different icon pairings."
        >
          <DarkModeTogglePreview controls={values} />
        </DocsPanel>

        <DocsPanel
          title="Controls"
          description="Choose lucide icons, size, and variant props."
        >
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={reset}>
              Reset controls
            </Button>
          </div>
          <DemoControlsTable
            schema={darkModeToggleControls}
            values={values}
            setValue={setValue}
          />
        </DocsPanel>

        <DocsPanel
          title="Usage"
          description="Add the dark mode toggle component to your project."
        >
          <CodeBlock
            label="Install"
            code="npx shadcn add @nos/dark-mode-toggle"
            language="bash"
          />
          <CodeBlock label="Imports" code={darkModeToggleImportCode} />
          <CodeBlock label="Usage" code={darkModeToggleCode} />
        </DocsPanel>
      </DocsStack>
    </DocsPage>
  )
}
