"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { notify, type NotifyType, type NotifyOptions } from "@/lib/notify";

import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ToasterProps = React.ComponentProps<typeof Toaster>;

const toasterPositions: NonNullable<ToasterProps["position"]>[] = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
];

const notifyTypes: NotifyType[] = [
    "message",
    "info",
    "warn",
    "error",
    "success",
];

function BooleanField({
    name,
    value,
    onChange,
}: {
    name: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <RadioGroup
            value={String(value)}
            onValueChange={(v) => onChange(v === "true")}
            className="flex flex-row items-center gap-6"
        >
            <div className="flex items-center gap-2">
                <RadioGroupItem value="true" id={`${name}-true`} />
                <Label htmlFor={`${name}-true`}>true</Label>
            </div>
            <div className="flex items-center gap-2">
                <RadioGroupItem value="false" id={`${name}-false`} />
                <Label htmlFor={`${name}-false`}>false</Label>
            </div>
        </RadioGroup>
    );
}

function formatObject(obj: Record<string, unknown>) {
    const entries = Object.entries(obj).filter(([, value]) => value !== undefined);

    if (!entries.length) return "{}";

    return `{
${entries
            .map(([key, value]) => {
                if (typeof value === "string") return `  ${key}: ${JSON.stringify(value)},`;
                if (typeof value === "number" || typeof value === "boolean")
                    return `  ${key}: ${value},`;
                if (typeof value === "object" && value !== null) {
                    return `  ${key}: ${formatNestedObject(value as Record<string, unknown>)},`;
                }
                return `  ${key}: ${String(value)},`;
            })
            .join("\n")}
}`;
}

function formatNestedObject(obj: Record<string, unknown>) {
    const entries = Object.entries(obj).filter(([, value]) => value !== undefined);

    if (!entries.length) return "{}";

    return `{
${entries
            .map(([key, value]) => {
                if (typeof value === "string") return `    ${key}: ${JSON.stringify(value)},`;
                if (typeof value === "number" || typeof value === "boolean")
                    return `    ${key}: ${value},`;
                return `    ${key}: ${String(value)},`;
            })
            .join("\n")}
  }`;
}

function CodeCopyCard({
    title,
    code,
}: {
    title: string;
    code: string;
}) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Card className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold">{title}</h3>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? "Copied" : "Copy"}
                </Button>
            </div>
            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code>{code}</code>
            </pre>
        </Card>
    );
}

export default function NotifyPage() {
    const [position, setPosition] =
        React.useState<NonNullable<ToasterProps["position"]>>("bottom-center");
    const [expand, setExpand] = React.useState(true);
    const [richColors, setRichColors] = React.useState(true);

    const [type, setType] = React.useState<NotifyType>("message");
    const [message, setMessage] = React.useState("Hello");
    const [description, setDescription] = React.useState(
        "This is an example notification."
    );
    const [duration, setDuration] = React.useState("4000");
    const [withDescription, setWithDescription] = React.useState(true);
    const [withAction, setWithAction] = React.useState(false);

    const notifyOptions = React.useMemo<NotifyOptions>(() => {
        const parsedDuration = Number(duration);

        return {
            description: withDescription ? description : undefined,
            duration: Number.isFinite(parsedDuration) ? parsedDuration : undefined,
            action: withAction
                ? {
                    label: "Undo",
                    onClick: () => {
                        notify.info("Action clicked");
                    },
                }
                : undefined,
        };
    }, [description, duration, withAction, withDescription]);

    const fireToast = React.useCallback(() => {
        switch (type) {
            case "message":
                notify.message(message, notifyOptions);
                break;
            case "info":
                notify.info(message, notifyOptions);
                break;
            case "warn":
                notify.warn(message, notifyOptions);
                break;
            case "error":
                notify.error(message, notifyOptions);
                break;
            case "success":
                notify.success(message, notifyOptions);
                break;
        }
    }, [message, notifyOptions, type]);

    const firePromiseToast = React.useCallback(() => {
        notify.promise(
            new Promise<string>((resolve) => {
                setTimeout(() => resolve("done"), 1500);
            }),
            {
                loading: "Saving changes...",
                success: "Saved successfully",
                error: "Failed to save",
                loadingOptions: {
                    description: "Please wait while we process your request.",
                },
                successOptions: (result) => ({
                    description: `Result: ${result}`,
                    action: {
                        label: "Nice",
                        onClick: () => notify.message("Confirmed"),
                    },
                }),
                errorOptions: () => ({
                    description: "Something unexpected happened.",
                }),
            }
        );
    }, []);

    const toasterCode = React.useMemo(() => {
        return `<Toaster position="${position}" expand={${expand}} richColors={${richColors}} />`;
    }, [position, expand, richColors]);

    const triggerCode = React.useMemo(() => {
        const options: Record<string, unknown> = {
            description: withDescription ? description : undefined,
            duration: duration ? Number(duration) : undefined,
            action: withAction
                ? {
                    label: "Undo",
                    onClick: "() => {}",
                }
                : undefined,
        };

        const hasOptions = Object.values(options).some((value) => value !== undefined);

        if (!hasOptions) {
            return `notify.${type}(${JSON.stringify(message)})`;
        }

        return `notify.${type}(${JSON.stringify(message)}, ${formatObject(options)})`;
    }, [type, message, withDescription, description, duration, withAction]);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="max-w-5xl w-full p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-5xl">Notify</h1>
                    <p className="text-muted-foreground">
                        Storybook-style playground for toaster and notify options
                    </p>
                </div>

                <Card className="w-full p-6 flex flex-col gap-6">
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={fireToast}>Trigger notification</Button>
                        <Button variant="outline" onClick={firePromiseToast}>
                            Trigger promise notification
                        </Button>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="p-4">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">Toaster Options</h2>
                                <p className="text-sm text-muted-foreground">
                                    Controls the mounted toaster instance
                                </p>
                            </div>

                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="w-40 font-medium align-top">
                                            position
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={position}
                                                onValueChange={(value) =>
                                                    setPosition(
                                                        value as NonNullable<ToasterProps["position"]>
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select position" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {toasterPositions.map((item) => (
                                                        <SelectItem key={item} value={item}>
                                                            {item}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-medium align-top">
                                            expand
                                        </TableCell>
                                        <TableCell>
                                            <BooleanField
                                                name="expand"
                                                value={expand}
                                                onChange={setExpand}
                                            />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-medium align-top">
                                            richColors
                                        </TableCell>
                                        <TableCell>
                                            <BooleanField
                                                name="richColors"
                                                value={richColors}
                                                onChange={setRichColors}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>

                        <Card className="p-4">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">Notify Options</h2>
                                <p className="text-sm text-muted-foreground">
                                    Controls the toast payload sent through your notify utility
                                </p>
                            </div>

                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="w-40 font-medium align-top">
                                            type
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={type}
                                                onValueChange={(value) => setType(value as NotifyType)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {notifyTypes.map((item) => (
                                                        <SelectItem key={item} value={item}>
                                                            {item}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-medium align-top">
                                            message
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Toast title"
                                            />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-medium align-top">
                                            withDescription
                                        </TableCell>
                                        <TableCell>
                                            <BooleanField
                                                name="withDescription"
                                                value={withDescription}
                                                onChange={setWithDescription}
                                            />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-medium align-top">
                                            description
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Optional description"
                                                disabled={!withDescription}
                                            />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-medium align-top">
                                            duration
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min={0}
                                                step={100}
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                placeholder="4000"
                                            />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-medium align-top">
                                            withAction
                                        </TableCell>
                                        <TableCell>
                                            <BooleanField
                                                name="withAction"
                                                value={withAction}
                                                onChange={setWithAction}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <CodeCopyCard title="Toaster" code={toasterCode} />
                        <CodeCopyCard title="Trigger Function" code={triggerCode} />
                    </div>
                </Card>
            </div>

            <Toaster
                position={position}
                expand={expand}
                richColors={richColors}
            />
        </div>
    );
}