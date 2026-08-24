import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container-premium text-center max-w-3xl mx-auto">
        <p className="text-overline mb-4">Prête à commencer ?</p>
        <h2 className="heading-section mb-6">
          Votre transformation commence ici
        </h2>
        <p className="text-brand-600 leading-relaxed mb-10 max-w-xl mx-auto">
          Répondez à notre questionnaire d&apos;orientation en 2 minutes
          et découvrez l&apos;accompagnement qui vous correspond.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orientation" className="btn-primary inline-flex items-center gap-2">
            Commencer le questionnaire
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="btn-secondary">
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
