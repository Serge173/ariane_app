import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminParametresPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Paramètres</h1>
        <p className="text-brand-600">Configuration de la plateforme et du compte administrateur</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white border border-brand-100 p-6">
          <h2 className="font-display text-lg mb-6">Compte administrateur</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-brand-400 mb-1">Nom</dt>
              <dd className="text-sm">{session?.user?.name}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-brand-400 mb-1">Email</dt>
              <dd className="text-sm">{session?.user?.email}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-brand-400 mb-1">Rôle</dt>
              <dd className="text-sm capitalize">{session?.user?.role?.replace(/_/g, " ").toLowerCase()}</dd>
            </div>
          </dl>
        </section>

        <section className="bg-white border border-brand-100 p-6">
          <h2 className="font-display text-lg mb-6">Plateforme</h2>
          <dl className="space-y-4">
            {[
              { label: "URL publique", value: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001" },
              { label: "Base de données", value: "PostgreSQL (local)" },
              { label: "Paiement", value: process.env.CINETPAY_API_KEY ? "CinetPay configuré" : "CinetPay — à configurer" },
              { label: "WhatsApp", value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+2250749526194" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] uppercase tracking-widest text-brand-400 mb-1">{item.label}</dt>
                <dd className="text-sm text-brand-700">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
