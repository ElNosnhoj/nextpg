import { useEffect, useState } from "react"

export function useAtTop(threshold: number = 4) {
    const [isAtTop, setIsAtTop] = useState(true)

    useEffect(() => {
        if (typeof window === "undefined") {
            return
        }

        function updateIsAtTop() {
            setIsAtTop(window.scrollY <= threshold)
        }

        updateIsAtTop()

        window.addEventListener("scroll", updateIsAtTop, { passive: true })
        window.addEventListener("resize", updateIsAtTop)

        return () => {
            window.removeEventListener("scroll", updateIsAtTop)
            window.removeEventListener("resize", updateIsAtTop)
        }
    }, [threshold])

    return isAtTop
}
