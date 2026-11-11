"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicConfirmationLayout } from "@/components/layout/PublicConfirmationLayout";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const isDiscoveryRdv = searchParams.get("type") === "rdv";

  return (
    <PublicConfirmationLayout
      title={isDiscoveryRdv ? "Demande de RDV envoyée" : "Réservation confirmée"}
      description={
        isDiscoveryRdv
          ? "Merci pour votre confiance. Ariane DAGO reviendra vers vous pour confirmer votre créneau."
          : "Merci pour votre confiance. Votre accompagnement est en cours de confirmation."
      }
      reference={orderNumber}
      steps={
        <>
          <h3 className="font-medium text-brand-950 mb-4">Prochaines étapes</h3>
          <ol className="space-y-3 text-sm text-brand-600 list-decimal list-inside">
            {isDiscoveryRdv ? (
              <>
                <li>Confirmation de votre créneau par email ou WhatsApp</li>
                <li>Échange personnalisé avec Ariane DAGO</li>
                <li>Orientation vers l&apos;accompagnement adapté à vos objectifs</li>
              </>
            ) : (
              <>
                <li>Vous recevrez un email de confirmation</li>
                <li>Complétez le questionnaire pré-coaching</li>
                <li>Retrouvez votre accompagnement dans votre espace client</li>
              </>
            )}
          </ol>
        </>
      }
      actions={
        <>
          {!isDiscoveryRdv && (
            <Link href="/mon-espace" className="btn-primary rounded-full inline-flex items-center justify-center gap-2">
              Accéder à mon espace
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            href="/"
            className={
              isDiscoveryRdv
                ? "btn-primary rounded-full inline-flex items-center justify-center gap-2"
                : "btn-secondary rounded-full inline-flex items-center justify-center"
            }
          >
            Retour à l&apos;accueil
            {isDiscoveryRdv && <ArrowRight className="w-4 h-4" />}
          </Link>
        </>
      }
    />
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <PublicPageShell width="narrow">
          <p className="text-brand-500 text-sm text-center">Chargement…</p>
        </PublicPageShell>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
