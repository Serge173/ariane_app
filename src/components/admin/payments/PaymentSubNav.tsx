import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "hub", label: "Tableau", href: "/admin/paiements" },
  { id: "modes", label: "Modes de paiement", href: "/admin/paiements/modes" },
  { id: "transactions", label: "Transactions", href: "/admin/paiements/transactions" },
] as const;

export function PaymentSubNav({ active }: { active: (typeof tabs)[number]["id"] }) {
  return (
    <nav className="admin-subnav admin-subnav--wrap flex flex-wrap gap-2 pb-1 mb-8">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={cn(
            "admin-subnav-link",
            active === tab.id && "admin-subnav-link--active"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
