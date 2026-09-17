import { OffresShell } from "@/components/offres/OffresShell";
import "./offres.css";

export default function OffresLayout({ children }: { children: React.ReactNode }) {
  return (
    <OffresShell>
      <div className="offres-page">{children}</div>
    </OffresShell>
  );
}
