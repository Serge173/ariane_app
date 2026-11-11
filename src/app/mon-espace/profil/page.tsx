import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import { ClientPageIntro } from "@/components/layout/ClientPageIntro";

export default async function ClientProfilPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id },
    select: { firstName: true, lastName: true, email: true, phone: true, avatar: true, createdAt: true },
  });

  if (!user) return null;

  return (
    <div>
      <ClientPageIntro
        align="left"
        title="Mon profil"
        description="Gérez vos informations personnelles et votre photo de profil"
      />

      <div className="public-form-card mb-8">
        <ProfilePhotoUpload avatar={user.avatar} firstName={user.firstName} lastName={user.lastName} />
      </div>

      <div className="public-form-card">
        <h2 className="font-display text-lg mb-6">Informations personnelles</h2>
        <dl className="grid sm:grid-cols-2 gap-6">
          {[
            { label: "Prénom", value: user.firstName },
            { label: "Nom", value: user.lastName },
            { label: "Email", value: user.email },
            { label: "Téléphone", value: user.phone || "Non renseigné" },
            { label: "Membre depuis", value: new Date(user.createdAt).toLocaleDateString("fr-FR") },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-[10px] uppercase tracking-widest text-brand-400 mb-1">{item.label}</dt>
              <dd className="text-sm text-brand-950">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
