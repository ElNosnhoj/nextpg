"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

type ControlBase = {
    label?: string;
    description?: string;
};

type BooleanControl = ControlBase & {
    type: "boolean";
    defaultValue: boolean;
};

type NumberControl = ControlBase & {
    type: "number";
    defaultValue: number;
    min?: number;
    max?: number;
    step?: number;
};

type TextControl = ControlBase & {
    type: "text";
    defaultValue: string;
    placeholder?: string;
};

type SelectControl = ControlBase & {
    type: "select";
    defaultValue: string;
    options: readonly string[];
};

export type DemoControlDefinition =
    | BooleanControl
    | NumberControl
    | TextControl
    | SelectControl;

export type DemoControlSchema = Record<string, DemoControlDefinition>;

export type DemoControlValues<TSchema extends DemoControlSchema> = {
    [K in keyof TSchema]: TSchema[K]["defaultValue"];
};

function getDefaultValues<TSchema extends DemoControlSchema>(
    schema: TSchema
): DemoControlValues<TSchema> {
    return Object.fromEntries(
        Object.entries(schema).map(([key, definition]) => [key, definition.defaultValue])
    ) as DemoControlValues<TSchema>;
}

export function useDemoControls<TSchema extends DemoControlSchema>(
    schema: TSchema
) {
    const [values, setValues] = React.useState<DemoControlValues<TSchema>>(() =>
        getDefaultValues(schema)
    );

    const setValue = React.useCallback(
        <TKey extends keyof TSchema>(
            key: TKey,
            value: DemoControlValues<TSchema>[TKey]
        ) => {
            setValues((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        []
    );

    const reset = React.useCallback(() => {
        setValues(getDefaultValues(schema));
    }, [schema]);

    return {
        values,
        setValue,
        reset,
    };
}

function ControlDescription({ description }: { description?: string }) {
    if (!description) return null;

    return <p className="mt-1 text-xs text-muted-foreground">{description}</p>;
}

function BooleanControlField({
    id,
    value,
    onChange,
}: {
    id: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <RadioGroup
            value={String(value)}
            onValueChange={(nextValue) => onChange(nextValue === "true")}
            className="flex flex-row items-center gap-6"
        >
            <div className="flex items-center gap-2">
                <RadioGroupItem value="true" id={`${id}-true`} />
                <Label htmlFor={`${id}-true`}>true</Label>
            </div>
            <div className="flex items-center gap-2">
                <RadioGroupItem value="false" id={`${id}-false`} />
                <Label htmlFor={`${id}-false`}>false</Label>
            </div>
        </RadioGroup>
    );
}

function NumberControlField({
    value,
    onChange,
    min,
    max,
    step,
}: {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
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
    );
}

function TextControlField({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <Input
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
        />
    );
}

function SelectControlField({
    value,
    options,
    onChange,
}: {
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
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
    );
}

function DemoControlField({
    controlKey,
    definition,
    value,
    onChange,
}: {
    controlKey: string;
    definition: DemoControlDefinition;
    value: string | number | boolean;
    onChange: (value: string | number | boolean) => void;
}) {
    switch (definition.type) {
        case "boolean":
            return (
                <BooleanControlField
                    id={controlKey}
                    value={value as boolean}
                    onChange={onChange}
                />
            );
        case "number":
            return (
                <NumberControlField
                    value={value as number}
                    min={definition.min}
                    max={definition.max}
                    step={definition.step}
                    onChange={onChange}
                />
            );
        case "text":
            return (
                <TextControlField
                    value={value as string}
                    placeholder={definition.placeholder}
                    onChange={onChange}
                />
            );
        case "select":
            return (
                <SelectControlField
                    value={value as string}
                    options={definition.options}
                    onChange={onChange}
                />
            );
    }
}

export function DemoControlsTable<TSchema extends DemoControlSchema>({
    schema,
    values,
    setValue,
}: {
    schema: TSchema;
    values: DemoControlValues<TSchema>;
    setValue: <TKey extends keyof TSchema>(
        key: TKey,
        value: DemoControlValues<TSchema>[TKey]
    ) => void;
}) {
    const entries = Object.entries(schema) as Array<
        [keyof TSchema, TSchema[keyof TSchema]]
    >;

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
    );
}
