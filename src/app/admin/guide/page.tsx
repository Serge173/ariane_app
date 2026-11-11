import { AdminGuideClient } from "@/components/admin/guide/AdminGuideClient";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export default function AdminGuidePage() {
  return (
    <div>
      <AdminPageHeader
        section="Système"
        title="Guide d'utilisation"
        description="Manuel du back-office : tutoriels pas à pas et procédures pour chaque fonctionnalité."
      />

      <AdminGuideClient />
    </div>
  );
}
