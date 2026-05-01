const base_url = "/docs/components"

type RawLink = {
    href: string
    label: React.ReactNode
    desc?: string
}

export type LinkProps = RawLink

const useBase = (links: RawLink[]): LinkProps[] =>
    links.map(link => ({
        ...link,
        href: `${base_url}${link.href}`
    }))

export const uiLinks = useBase([
    { href: "/dark-mode-toggle", label: "dark-mode-toggle" },
    { href: "/reveal", label: "reveal" }
])

export const utilityLinks = useBase([
    { href: "/notify", label: "notify" }
])

export const hookLinks = useBase([
    { href: "/use-keyboard", label: "useKeyboard" }
])

export const links = {
    ui: uiLinks,
    utility: utilityLinks,
    hook: hookLinks
}