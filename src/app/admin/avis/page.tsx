import prisma from "@/lib/prisma";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
};

export default async function AdminAvisPage() {
  let reviews: Awaited<ReturnType<typeof getReviews>> = [];
  try { reviews = await getReviews(); } catch {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Avis clients</h1>
        <p className="text-brand-600">Modérez les témoignages affichés sur le site</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-brand-100 p-6">
            <div className="flex items-start gap-4">
              <ProfileAvatar
                src={review.user.avatar}
                firstName={review.user.firstName}
                lastName={review.user.lastName}
                size="md"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{review.user.firstName} {review.user.lastName}</p>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${
                    review.status === "APPROVED" ? "bg-green-100 text-green-800" :
                    review.status === "REJECTED" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                  }`}>{statusLabels[review.status]}</span>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-accent text-sm">★</span>
                  ))}
                </div>
                {review.title && <p className="font-display text-base mb-2">{review.title}</p>}
                <p className="text-sm text-brand-600 leading-relaxed">{review.content}</p>
                <p className="text-xs text-brand-400 mt-3">{new Date(review.createdAt).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="bg-white border border-brand-100 text-center py-16">
            <p className="text-brand-400">Aucun avis pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}

async function getReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
}
