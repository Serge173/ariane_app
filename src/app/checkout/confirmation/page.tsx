"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Truck, Banknote } from "lucide-react";
import { PublicConfirmationLayout } from "@/components/layout/PublicConfirmationLayout";
import { PublicPageShell } from "@/components/layout/PublicPageShell";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const isCod = searchParams.get("payment") === "cod";

  return (
    <PublicConfirmationLayout
      title="Commande confirmée"
      description={
        isCod
          ? "Votre commande est enregistrée. Vous réglerez à la livraison."
          : "Merci pour votre achat. Votre commande boutique est en cours de traitement."
      }
      reference={orderNumber}
      steps={
        <>
          <h3 className="font-medium text-brand-950 mb-4 flex items-center gap-2">
            {isCod ? (
              <>
                <Banknote className="w-4 h-4 text-accent" strokeWidth={1.5} /> Paiement à la livraison
              </>
            ) : (
              <>
                <Truck className="w-4 h-4 text-accent" strokeWidth={1.5} /> Prochaines étapes
              </>
            )}
          </h3>
          {isCod ? (
            <ol className="space-y-3 text-sm text-brand-600 list-decimal list-inside">
              <li>Préparation soignée de votre commande</li>
              <li>Livraison à Abidjan sous 2 à 5 jours ouvrés</li>
              <li>Règlement en espèces ou Mobile Money à la réception</li>
              <li>Suivez l&apos;avancement dans votre espace client</li>
            </ol>
          ) : (
            <ol className="space-y-3 text-sm text-brand-600 list-decimal list-inside">
              <li>Vous recevrez un email de confirmation</li>
              <li>Préparation soignée de votre commande</li>
              <li>Livraison à Abidjan sous 2 à 5 jours ouvrés</li>
              <li>Consultez le statut et le paiement dans votre espace client</li>
            </ol>
          )}
        </>
      }
      actions={
        <>
          <Link
            href="/mon-espace/commandes"
            className="btn-primary rounded-full inline-flex items-center justify-center gap-2"
          >
            Suivre ma commande
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/boutique" className="btn-secondary rounded-full inline-flex items-center justify-center">
            Continuer mes achats
          </Link>
        </>
      }
    />
  );
}

export default function CheckoutConfirmationPage() {
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
