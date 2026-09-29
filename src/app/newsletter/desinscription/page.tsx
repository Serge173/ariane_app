import Link from "next/link";
import { unsubscribeNewsletterByToken } from "@/lib/newsletter";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function NewsletterUnsubscribePage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  let ok = false;

  if (token?.trim()) {
    const updated = await unsubscribeNewsletterByToken(token.trim());
    ok = Boolean(updated);
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      <div className="container-premium max-w-lg text-center">
        <h1 className="heading-section mb-4">
          {ok ? "Désinscription enregistrée" : "Lien invalide"}
        </h1>
        <p className="text-brand-600 leading-relaxed mb-8">
          {ok
            ? "Vous ne recevrez plus nos emails newsletter. Vous pouvez vous réinscrire à tout moment."
            : "Ce lien de désinscription n'est pas valide."}
        </p>
        <Link href="/" className="btn-primary inline-flex">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
