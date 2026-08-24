import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "hub", label: "Vue d'ensemble", href: "/admin/paiements" },
  { id: "modes", label: "Modes de paiement", href: "/admin/paiements/modes" },
  { id: "transactions", label: "Transactions", href: "/admin/paiements/transactions" },
] as const;

export function PaymentSubNav({ active }: { active: (typeof tabs)[number]["id"] }) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-brand-100 pb-1 mb-8">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={cn(
            "px-4 py-2.5 text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px",
            active === tab.id
              ? "border-brand-950 text-brand-950 font-medium"
              : "border-transparent text-brand-400 hover:text-brand-700"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
