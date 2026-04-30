"use client"

import * as React from "react"

type KeyHandler = (event: KeyboardEvent) => void

type UseKeyEventsOptions = {
    enabled?: boolean
    onKeyDown?: KeyHandler
    onKeyUp?: KeyHandler
}

type UseHotkeyOptions = {
    enabled?: boolean
    event?: "keydown" | "keyup"
    allowRepeat?: boolean
    requireMeta?: boolean
    requireCtrl?: boolean
    requireAlt?: boolean
    requireShift?: boolean
    preventDefault?: boolean
    ignoreTyping?: boolean
}

const keyDownListeners = new Set<KeyHandler>()
const keyUpListeners = new Set<KeyHandler>()

let isBound = false

function dispatchEvent(listeners: Set<KeyHandler>, event: KeyboardEvent) {
    for (const listener of listeners) {
        listener(event)
    }
}

function handleKeyDown(event: KeyboardEvent) {
    dispatchEvent(keyDownListeners, event)
}

function handleKeyUp(event: KeyboardEvent) {
    dispatchEvent(keyUpListeners, event)
}

function bindGlobalListeners() {
    if (isBound || typeof window === "undefined") {
        return
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    isBound = true
}

function unbindGlobalListeners() {
    if (!isBound || typeof window === "undefined") {
        return
    }

    if (keyDownListeners.size > 0 || keyUpListeners.size > 0) {
        return
    }

    window.removeEventListener("keydown", handleKeyDown)
    window.removeEventListener("keyup", handleKeyUp)
    isBound = false
}

function isTypingTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) {
        return false
    }

    return (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
    )
}

export function useKeyEvents({
    enabled = true,
    onKeyDown,
    onKeyUp,
}: UseKeyEventsOptions) {
    const onKeyDownRef = React.useRef(onKeyDown)
    const onKeyUpRef = React.useRef(onKeyUp)

    React.useEffect(() => {
        onKeyDownRef.current = onKeyDown
    }, [onKeyDown])

    React.useEffect(() => {
        onKeyUpRef.current = onKeyUp
    }, [onKeyUp])

    const keyDownListener = React.useRef<KeyHandler>((event) => {
        onKeyDownRef.current?.(event)
    })

    const keyUpListener = React.useRef<KeyHandler>((event) => {
        onKeyUpRef.current?.(event)
    })

    React.useEffect(() => {
        if (!enabled) {
            return
        }

        bindGlobalListeners()

        if (onKeyDown) {
            keyDownListeners.add(keyDownListener.current)
        }

        if (onKeyUp) {
            keyUpListeners.add(keyUpListener.current)
        }

        return () => {
            keyDownListeners.delete(keyDownListener.current)
            keyUpListeners.delete(keyUpListener.current)
            unbindGlobalListeners()
        }
    }, [enabled, onKeyDown, onKeyUp])
}

export function useHotkey(
    key: string,
    handler: KeyHandler,
    {
        enabled = true,
        event = "keydown",
        allowRepeat = false,
        requireMeta = false,
        requireCtrl = false,
        requireAlt = false,
        requireShift = false,
        preventDefault = false,
        ignoreTyping = true,
    }: UseHotkeyOptions = {},
) {
    const onHotkey = React.useEffectEvent((keyboardEvent: KeyboardEvent) => {
        if (keyboardEvent.defaultPrevented) {
            return
        }

        if (!allowRepeat && keyboardEvent.repeat) {
            return
        }

        if (keyboardEvent.key.toLowerCase() !== key.toLowerCase()) {
            return
        }

        if (ignoreTyping && isTypingTarget(keyboardEvent.target)) {
            return
        }

        if (keyboardEvent.metaKey !== requireMeta) {
            return
        }

        if (keyboardEvent.ctrlKey !== requireCtrl) {
            return
        }

        if (keyboardEvent.altKey !== requireAlt) {
            return
        }

        if (keyboardEvent.shiftKey !== requireShift) {
            return
        }

        if (preventDefault) {
            keyboardEvent.preventDefault()
        }

        handler(keyboardEvent)
    })

    useKeyEvents({
        enabled,
        onKeyDown: event === "keydown" ? onHotkey : undefined,
        onKeyUp: event === "keyup" ? onHotkey : undefined,
    })
}
