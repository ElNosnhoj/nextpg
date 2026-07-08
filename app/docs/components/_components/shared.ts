const base_url = "/docs/components"

type RawLink = {
    href: string
    label: React.ReactNode
    desc?: string
}

export type LinkProps = RawLink

const withBase = (links: RawLink[]): LinkProps[] =>
    links.map(link => ({
        ...link,
        href: `${base_url}${link.href}`
    }))

export const uiLinks = withBase([
    { href: "/dark-mode-toggle", label: "dark-mode-toggle" },
    { href: "/reveal", label: "reveal" },
    { href: "/marquee", label: "marquee" },
    { href: "/skeleton", label: "skeleton" },
    { href: "/tooth-frame", label: "tooth-frame" },
    { href: "/color-control", label: "color-control" },
])

export const utilityLinks = withBase([
    { href: "/notify", label: "notify" }
])

export const hookLinks = withBase([
    { href: "/use-keyboard", label: "useKeyboard" },
    { href: "/useIntersect", label: "useIntersect" },
    { href: "/useAsyncAction", label: "useAsyncAction" },
])

export const links = {
    ui: uiLinks,
    utility: utilityLinks,
    hook: hookLinks
}
