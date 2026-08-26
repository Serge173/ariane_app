"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, Truck, Banknote } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const isCod = searchParams.get("payment") === "cod";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-2xl text-center">
        <div className="w-20 h-20 bg-brand-950 text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-10 h-10" />
        </div>

        <h1 className="heading-section mb-4">Commande confirmée</h1>
        <p className="text-brand-600 mb-2">
          {isCod
            ? "Votre commande est enregistrée. Vous réglerez à la livraison."
            : "Merci pour votre achat. Votre commande boutique est en cours de traitement."}
        </p>
        {orderNumber && (
          <p className="text-sm text-brand-500 mb-8">
            Référence : <strong>{orderNumber}</strong>
          </p>
        )}

        <div className="p-6 bg-brand-50 border border-brand-100 text-left mb-10 max-w-md mx-auto">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            {isCod ? (
              <>
                <Banknote className="w-4 h-4" /> Paiement à la livraison
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" /> Prochaines étapes
              </>
            )}
          </h3>
          {isCod ? (
            <ol className="space-y-3 text-sm text-brand-600">
              <li>1. Préparation soignée de votre commande</li>
              <li>2. Livraison à Abidjan sous 2 à 5 jours ouvrés</li>
              <li>3. Règlement en espèces ou Mobile Money à la réception</li>
              <li>4. Suivez l&apos;avancement dans votre espace client</li>
            </ol>
          ) : (
            <ol className="space-y-3 text-sm text-brand-600">
              <li>1. Vous recevrez un email de confirmation</li>
              <li>2. Préparation soignée de votre commande</li>
              <li>3. Livraison à Abidjan sous 2 à 5 jours ouvrés</li>
              <li>4. Consultez le statut et le paiement dans votre espace client</li>
            </ol>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/mon-espace/commandes" className="btn-primary inline-flex items-center gap-2">
            Suivre ma commande
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/boutique" className="btn-secondary">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center">Chargement...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
