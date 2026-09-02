import { AdminGuideClient } from "@/components/admin/guide/AdminGuideClient";

export default function AdminGuidePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Guide d&apos;utilisation</h1>
        <p className="text-brand-600 max-w-2xl">
          Manuel complet du back-office avec tutoriels pas à pas, explications claires et procédures
          « comment faire » pour chaque fonctionnalité.
        </p>
      </div>

      <AdminGuideClient />
    </div>
  );
}
