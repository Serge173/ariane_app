import Link from "next/link";
import { confirmNewsletterByToken } from "@/lib/newsletter";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function NewsletterConfirmPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  let ok = false;

  if (token?.trim()) {
    const updated = await confirmNewsletterByToken(token.trim());
    ok = Boolean(updated);
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      <div className="container-premium max-w-lg text-center">
        <h1 className="heading-section mb-4">
          {ok ? "Inscription confirmée" : "Lien invalide ou expiré"}
        </h1>
        <p className="text-brand-600 leading-relaxed mb-8">
          {ok
            ? "Vous recevrez désormais nos actus, conseils image et liens vers nos réseaux sociaux."
            : "Ce lien de confirmation n'est plus valide. Vous pouvez vous réinscrire depuis le site."}
        </p>
        <Link href="/" className="btn-primary inline-flex">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
