import { cn } from "@/lib/utils";
import { SHOPPING_NAV_LABEL, SHOPPING_NAV_LABEL_COMPACT } from "@/lib/shopping";

/** « Personal Shopping » on phone/tablet; « Shopping » from xl desktop. */
export function ShoppingNavLabel({ className }: { className?: string }) {
  return (
    <>
      <span className={cn("xl:hidden", className)}>{SHOPPING_NAV_LABEL_COMPACT}</span>
      <span className={cn("hidden xl:inline", className)}>{SHOPPING_NAV_LABEL}</span>
    </>
  );
}

export function shoppingNavDisplayName(compact: boolean): string {
  return compact ? SHOPPING_NAV_LABEL_COMPACT : SHOPPING_NAV_LABEL;
}
