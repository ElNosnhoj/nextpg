"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DocsPage({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full justify-center">
            <div className="flex w-full max-w-6xl flex-col gap-6 p-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl">{title}</h1>
                    {description ? (
                        <p className="text-muted-foreground">{description}</p>
                    ) : null}
                </div>
                {children}
            </div>
        </div>
    );
}

export function DocsGrid({ children }: { children: React.ReactNode }) {
    return <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">{children}</div>;
}

export function DocsStack({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col gap-6">{children}</div>;
}

export function DocsPanel({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <Card className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{title}</h2>
                {description ? (
                    <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            {children}
        </Card>
    );
}

export function PreviewSurface({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-105 items-center justify-center overflow-hidden rounded-2xl border bg-muted/30 p-8">
            {children}
        </div>
    );
}

export function CodeBlock({
    code,
    language = "tsx",
}: {
    code: string;
    language?: string;
}) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = React.useCallback(async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
    }, [code]);

    return (
        <div className="overflow-hidden rounded-xl border bg-muted/40">
            <div className="flex items-center justify-end border-b px-3 py-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={handleCopy}
                    aria-label="Copy code to clipboard"
                >
                    {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                </Button>
            </div>
            <pre className="overflow-x-auto p-4 text-sm">
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    );
}
