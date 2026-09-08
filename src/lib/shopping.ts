import type { SiteNavLink } from "@/lib/site-settings";

export type ShoppingLine = "luxe" | "premium";

export const SHOPPING_LINE_OPTIONS: { name: string; line: ShoppingLine }[] = [
  { name: "Luxe", line: "luxe" },
  { name: "Premium", line: "premium" },
];

export function shoppingHref(line: ShoppingLine): string {
  return `/boutique?line=${line}`;
}

export const SHOPPING_NAV_LABEL = "Shopping";
export const SHOPPING_NAV_LABEL_COMPACT = "Personal Shopping";

export const SHOPPING_NAV_LINK: SiteNavLink = {
  name: SHOPPING_NAV_LABEL,
  href: shoppingHref("luxe"),
  highlight: true,
  children: SHOPPING_LINE_OPTIONS.map(({ name, line }) => ({
    name,
    href: shoppingHref(line),
  })),
};

export function isShoppingLine(value: string | null | undefined): value is ShoppingLine {
  return value === "luxe" || value === "premium";
}
