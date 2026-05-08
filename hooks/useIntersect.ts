"use client"

import { useCallback, useEffect, useState } from "react"

type IntersectCallback = (entry: IntersectionObserverEntry) => void

export type IntersectObserveOptions = {
    root?: Element | Document | null
    rootMargin?: string
    threshold?: number | number[]
}

type ObserverBucket = {
    observer: IntersectionObserver
    callbacks: Map<Element, IntersectCallback>
}

function serializeThreshold(threshold: number | number[]) {
    return Array.isArray(threshold) ? threshold.join(",") : String(threshold)
}

class IntersectionStore {
    private buckets = new Map<string, ObserverBucket>()
    private rootIds = new WeakMap<object, number>()
    private rootIdCounter = 0

    private getRootKey(root: Element | Document | null | undefined) {
        if (!root) {
            return "viewport"
        }

        const existingId = this.rootIds.get(root)
        if (existingId !== undefined) {
            return `root:${existingId}`
        }

        const nextId = ++this.rootIdCounter
        this.rootIds.set(root, nextId)
        return `root:${nextId}`
    }

    private getBucketKey({
        root = null,
        rootMargin = "0px",
        threshold = 0,
    }: IntersectObserveOptions) {
        return [
            this.getRootKey(root),
            rootMargin,
            serializeThreshold(threshold),
        ].join("|")
    }

    private createBucket(options: Required<IntersectObserveOptions>) {
        const callbacks = new Map<Element, IntersectCallback>()
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                callbacks.get(entry.target)?.(entry)
            }
        }, options)

        return {
            observer,
            callbacks,
        }
    }

    register(
        element: Element,
        callback: IntersectCallback,
        options: IntersectObserveOptions = {},
    ) {
        const normalizedOptions: Required<IntersectObserveOptions> = {
            root: options.root ?? null,
            rootMargin: options.rootMargin ?? "0px",
            threshold: options.threshold ?? 0,
        }

        const key = this.getBucketKey(normalizedOptions)
        let bucket = this.buckets.get(key)

        if (!bucket) {
            bucket = this.createBucket(normalizedOptions)
            this.buckets.set(key, bucket)
        }

        bucket.callbacks.set(element, callback)
        bucket.observer.observe(element)

        return () => {
            this.unregister(element, normalizedOptions)
        }
    }

    unregister(
        element: Element,
        options: IntersectObserveOptions = {},
    ) {
        const normalizedOptions: Required<IntersectObserveOptions> = {
            root: options.root ?? null,
            rootMargin: options.rootMargin ?? "0px",
            threshold: options.threshold ?? 0,
        }

        const key = this.getBucketKey(normalizedOptions)
        const bucket = this.buckets.get(key)

        if (!bucket) {
            return
        }

        bucket.observer.unobserve(element)
        bucket.callbacks.delete(element)

        if (bucket.callbacks.size > 0) {
            return
        }

        bucket.observer.disconnect()
        this.buckets.delete(key)
    }
}

const intersectionStore = new IntersectionStore()

export type UseIntersectOptions = IntersectObserveOptions & {
    disabled?: boolean
    triggerOnce?: boolean
}

export function useIntersect({
    root = null,
    rootMargin = "0px",
    threshold = 0,
    disabled = false,
    triggerOnce = false,
}: UseIntersectOptions = {}) {
    const [node, setNode] = useState<Element | null>(null)
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
    const [hasIntersected, setHasIntersected] = useState(false)

    useEffect(() => {
        if (disabled || !node || typeof IntersectionObserver === "undefined") {
            return
        }

        if (triggerOnce && hasIntersected) {
            return
        }

        let unregister = () => { }

        unregister = intersectionStore.register(
            node,
            (nextEntry) => {
                setEntry(nextEntry)

                if (nextEntry.isIntersecting) {
                    setHasIntersected(true)

                    if (triggerOnce) {
                        unregister()
                    }
                }
            },
            {
                root,
                rootMargin,
                threshold,
            },
        )

        return unregister
    }, [disabled, hasIntersected, node, root, rootMargin, threshold, triggerOnce])

    const ref = useCallback((nextNode: Element | null) => {
        setNode(nextNode)
    }, [])

    return {
        ref,
        entry,
        hasIntersected,
        isIntersecting: entry?.isIntersecting ?? false,
    }
}

type UseIntersectOnceOptions = Omit<UseIntersectOptions, "triggerOnce">

export function useIntersectOnce(options: UseIntersectOnceOptions = {}) {
    const { ref, hasIntersected, entry, isIntersecting } = useIntersect({
        rootMargin: "100px 0px",
        threshold: 0.01,
        ...options,
        triggerOnce: true,
    })

    return {
        ref,
        entry,
        hasIntersected,
        isIntersecting,
    }
}
