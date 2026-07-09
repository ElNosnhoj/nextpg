"use client"

import * as React from "react"

import { PillToggle, type PillToggleProps } from "@/components/ui/pill-toggle"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import {
  ColorControl,
  getContrastingTextColor,
  type ColorState,
} from "@/components/ui/color-control"

type ControlBase = {
  label?: string
  description?: string
}

type BooleanControl = ControlBase & {
  type: "boolean"
  defaultValue: boolean
  falseText?: React.ReactNode
  trueText?: React.ReactNode
  size?: PillToggleProps["size"]
  variant?: PillToggleProps["variant"]
  fullWidth?: boolean
  disabled?: boolean
  readOnly?: boolean
}

type NumberControl = ControlBase & {
  type: "number"
  defaultValue: number
  min?: number
  max?: number
  step?: number
}

type TextControl = ControlBase & {
  type: "text"
  defaultValue: string
  placeholder?: string
}

type ColorControlDefinition = ControlBase & {
  type: "color"
  defaultValue: string
  alpha?: boolean
  popup?: boolean
}

type SelectControl = ControlBase & {
  type: "select"
  defaultValue: string
  options: readonly string[]
}

export type DemoControlDefinition =
  | BooleanControl
  | NumberControl
  | TextControl
  | ColorControlDefinition
  | SelectControl

export type DemoControlSchema = Record<string, DemoControlDefinition>

export type DemoControlValues<TSchema extends DemoControlSchema> = {
  [K in keyof TSchema]: TSchema[K]["defaultValue"]
}

function getDefaultValues<TSchema extends DemoControlSchema>(
  schema: TSchema
): DemoControlValues<TSchema> {
  return Object.fromEntries(
    Object.entries(schema).map(([key, definition]) => [
      key,
      definition.defaultValue,
    ])
  ) as DemoControlValues<TSchema>
}

export function useDemoControls<TSchema extends DemoControlSchema>(
  schema: TSchema
) {
  const [values, setValues] = React.useState<DemoControlValues<TSchema>>(() =>
    getDefaultValues(schema)
  )

  const setValue = React.useCallback(
    <TKey extends keyof TSchema>(
      key: TKey,
      value: DemoControlValues<TSchema>[TKey]
    ) => {
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    []
  )

  const reset = React.useCallback(() => {
    setValues(getDefaultValues(schema))
  }, [schema])

  return {
    values,
    setValue,
    reset,
  }
}

function ControlDescription({ description }: { description?: string }) {
  if (!description) return null

  return <p className="mt-1 text-xs text-muted-foreground">{description}</p>
}

function BooleanControlField({
  id,
  value,
  onChange,
  falseText,
  trueText,
  size,
  variant,
  fullWidth,
  disabled,
  readOnly,
}: {
  id: string
  value: boolean
  onChange: (value: boolean) => void
  falseText?: React.ReactNode
  trueText?: React.ReactNode
  size?: PillToggleProps["size"]
  variant?: PillToggleProps["variant"]
  fullWidth?: boolean
  disabled?: boolean
  readOnly?: boolean
}) {
  return (
    <PillToggle
      id={id}
      name={id}
      value={value}
      onValueChange={onChange}
      falseText={falseText}
      trueText={trueText}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled}
      readOnly={readOnly}
    />
  )
}

function NumberControlField({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <Input
      type="number"
      value={String(value)}
      min={min}
      max={max}
      step={step}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  )
}

function TextControlField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function ColorControlField({
  value,
  onChange,
  alpha = true,
  popup = true,
}: {
  value: string
  onChange: (value: string) => void
  alpha?: boolean
  popup?: boolean
}) {
  const [isEditing, setIsEditing] = React.useState(false)

  const setColor = React.useCallback<
    React.Dispatch<React.SetStateAction<string>>
  >(
    (nextColor) => {
      onChange(typeof nextColor === "function" ? nextColor(value) : nextColor)
    },
    [onChange, value]
  )

  const colorState = React.useMemo<ColorState>(
    () => ({
      color: value,
      setColor,
      textColor: getContrastingTextColor(value),
      isEditing,
      setIsEditing,
    }),
    [isEditing, setColor, value]
  )

  return (
    <ColorControl
      colorState={colorState}
      alpha={alpha}
      popup={popup}
      className="shadow-sm"
    />
  )
}

function SelectControlField({
  value,
  options,
  onChange,
}: {
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function DemoControlField({
  controlKey,
  definition,
  value,
  onChange,
}: {
  controlKey: string
  definition: DemoControlDefinition
  value: string | number | boolean
  onChange: (value: string | number | boolean) => void
}) {
  switch (definition.type) {
    case "boolean":
      return (
        <BooleanControlField
          id={controlKey}
          value={value as boolean}
          onChange={onChange}
          falseText={definition.falseText}
          trueText={definition.trueText}
          size={definition.size}
          variant={definition.variant}
          fullWidth={definition.fullWidth}
          disabled={definition.disabled}
          readOnly={definition.readOnly}
        />
      )
    case "number":
      return (
        <NumberControlField
          value={value as number}
          min={definition.min}
          max={definition.max}
          step={definition.step}
          onChange={onChange}
        />
      )
    case "text":
      return (
        <TextControlField
          value={value as string}
          placeholder={definition.placeholder}
          onChange={onChange}
        />
      )
    case "color":
      return (
        <ColorControlField
          value={value as string}
          alpha={definition.alpha}
          popup={definition.popup}
          onChange={(nextColor) => onChange(nextColor)}
        />
      )
    case "select":
      return (
        <SelectControlField
          value={value as string}
          options={definition.options}
          onChange={onChange}
        />
      )
  }
}

export function DemoControlsTable<TSchema extends DemoControlSchema>({
  schema,
  values,
  setValue,
}: {
  schema: TSchema
  values: DemoControlValues<TSchema>
  setValue: <TKey extends keyof TSchema>(
    key: TKey,
    value: DemoControlValues<TSchema>[TKey]
  ) => void
}) {
  const entries = Object.entries(schema) as Array<
    [keyof TSchema, TSchema[keyof TSchema]]
  >

  return (
    <Table>
      <TableBody>
        {entries.map(([key, definition]) => (
          <TableRow key={String(key)}>
            <TableCell className="w-44 align-top">
              <div className="font-medium">
                {definition.label ?? String(key)}
              </div>
              <ControlDescription description={definition.description} />
            </TableCell>
            <TableCell>
              <DemoControlField
                controlKey={String(key)}
                definition={definition}
                value={values[key]}
                onChange={(nextValue) =>
                  setValue(
                    key,
                    nextValue as DemoControlValues<TSchema>[typeof key]
                  )
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
