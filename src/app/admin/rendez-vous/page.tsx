import prisma from "@/lib/prisma";
import { formatDate, APPOINTMENT_STATUS_LABELS } from "@/lib/utils";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

export default async function AdminRendezVousPage() {
  let appointments: Awaited<ReturnType<typeof getAppointments>> = [];
  try { appointments = await getAppointments(); } catch {}

  const upcoming = appointments.filter((a) => ["SCHEDULED", "CONFIRMED"].includes(a.status));
  const others = appointments.filter((a) => !["SCHEDULED", "CONFIRMED"].includes(a.status));

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Rendez-vous</h1>
        <p className="text-brand-600">{upcoming.length} rendez-vous à venir</p>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-lg mb-4">À venir</h2>
          <div className="space-y-3">
            {upcoming.map((apt) => <AppointmentRow key={apt.id} apt={apt} />)}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className="font-display text-lg mb-4">Historique</h2>
          <div className="space-y-3">
            {others.map((apt) => <AppointmentRow key={apt.id} apt={apt} />)}
          </div>
        </section>
      )}

      {appointments.length === 0 && (
        <div className="bg-white border border-brand-100 text-center py-16">
          <p className="text-brand-400">Aucun rendez-vous</p>
        </div>
      )}
    </div>
  );
}

function AppointmentRow({ apt }: { apt: Awaited<ReturnType<typeof getAppointments>>[0] }) {
  const client = apt.user;
  const guestName = apt.order?.guestFirstName
    ? `${apt.order.guestFirstName} ${apt.order.guestLastName}`
    : apt.order?.guestEmail;

  return (
    <div className="bg-white border border-brand-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {client ? (
          <ProfileAvatar src={client.avatar} firstName={client.firstName} lastName={client.lastName} size="md" />
        ) : (
          <ProfileAvatar name={guestName || "?"} size="md" />
        )}
        <div>
          <p className="font-medium">{client ? `${client.firstName} ${client.lastName}` : guestName}</p>
          <p className="text-sm text-brand-600">{formatDate(apt.date)} — {apt.startTime.replace(":", "h")} à {apt.endTime.replace(":", "h")}</p>
          <p className="text-xs text-brand-400">{apt.order?.items[0]?.product?.name} · {apt.mode}</p>
        </div>
      </div>
      <span className="self-start text-[10px] uppercase tracking-wider px-3 py-1 bg-brand-100">
        {APPOINTMENT_STATUS_LABELS[apt.status]}
      </span>
    </div>
  );
}

async function getAppointments() {
  return prisma.appointment.findMany({
    orderBy: { date: "desc" },
    include: { user: true, order: { include: { items: { include: { product: true } } } } },
  });
}
