"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-2xl text-center">
        <div className="w-20 h-20 bg-brand-950 text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-10 h-10" />
        </div>

        <h1 className="heading-section mb-4">Réservation confirmée</h1>
        <p className="text-brand-600 mb-2">
          Merci pour votre confiance. Votre accompagnement est en cours de confirmation.
        </p>
        {orderNumber && (
          <p className="text-sm text-brand-500 mb-8">
            Référence : <strong>{orderNumber}</strong>
          </p>
        )}

        <div className="p-6 bg-brand-50 border border-brand-100 text-left mb-10 max-w-md mx-auto">
          <h3 className="font-medium mb-4">Prochaines étapes</h3>
          <ol className="space-y-3 text-sm text-brand-600">
            <li>1. Vous recevrez un email de confirmation</li>
            <li>2. Complétez le questionnaire pré-coaching</li>
            <li>3. Retrouvez votre accompagnement et vos commandes dans votre espace client</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/mon-espace" className="btn-primary inline-flex items-center gap-2">
            Accéder à mon espace
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="btn-secondary">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center">Chargement...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
