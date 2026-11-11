import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate, APPOINTMENT_STATUS_LABELS } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { ClientPageIntro } from "@/components/layout/ClientPageIntro";

export default async function ClientRendezVousPage() {
  const session = await getServerSession(authOptions);
  const appointments = await prisma.appointment.findMany({
    where: { userId: session!.user!.id },
    include: { order: { include: { items: { include: { product: true } } } } },
    orderBy: { date: "desc" },
  });

  const upcoming = appointments.filter((a) => ["SCHEDULED", "CONFIRMED"].includes(a.status));
  const past = appointments.filter((a) => !["SCHEDULED", "CONFIRMED"].includes(a.status));

  return (
    <div>
      <ClientPageIntro
        align="left"
        title="Mes rendez-vous"
        description="Vos séances de coaching planifiées et passées"
      />

      {appointments.length === 0 ? (
        <div className="public-card text-center py-16 px-6">
          <Calendar className="w-10 h-10 text-brand-300 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-brand-500 mb-6">Aucun rendez-vous planifié</p>
          <Link href="/reservation" className="btn-primary text-xs">Réserver une séance</Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-lg mb-4">À venir</h2>
              <div className="space-y-4">
                {upcoming.map((apt) => (
                  <AppointmentCard key={apt.id} apt={apt} highlight />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="font-display text-lg mb-4">Historique</h2>
              <div className="space-y-4">
                {past.map((apt) => (
                  <AppointmentCard key={apt.id} apt={apt} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function AppointmentCard({
  apt,
  highlight = false,
}: {
  apt: {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    mode: string;
    location: string | null;
    status: string;
    order: { items: { product: { name: string } }[] } | null;
  };
  highlight?: boolean;
}) {
  return (
    <div className={highlight ? "client-apt-card--highlight" : "public-card p-6"}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className={`font-medium ${highlight ? "text-white" : "text-brand-950"}`}>
            {apt.order?.items[0]?.product?.name || "Séance de coaching"}
          </p>
          <p className={`text-sm mt-1 ${highlight ? "text-white/80" : "text-brand-600"}`}>
            {formatDate(apt.date)} — {apt.startTime.replace(":", "h")} à {apt.endTime.replace(":", "h")}
          </p>
          <p className={`text-xs mt-1 ${highlight ? "text-white/70" : "text-brand-400"}`}>
            {apt.mode === "IN_PERSON" ? "Présentiel · Abidjan" : apt.mode === "DIGITAL" ? "100% Digital" : "Hybride"}
            {apt.location && ` · ${apt.location}`}
          </p>
        </div>
        <span className={`self-start text-[10px] uppercase tracking-widest px-3 py-1 ${highlight ? "bg-white/10 text-white" : "bg-brand-100 text-brand-600"}`}>
          {APPOINTMENT_STATUS_LABELS[apt.status] || apt.status}
        </span>
      </div>
    </div>
  );
}
