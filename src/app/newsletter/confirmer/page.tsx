import { confirmNewsletterByToken } from "@/lib/newsletter";
import { NewsletterResultLayout } from "@/components/newsletter/NewsletterResultLayout";

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
    <NewsletterResultLayout
      success={ok}
      title={ok ? "Inscription confirmée" : "Lien invalide ou expiré"}
      description={
        ok
          ? "Vous recevrez désormais nos actus, conseils image et liens vers nos réseaux sociaux."
          : "Ce lien de confirmation n'est plus valide. Vous pouvez vous réinscrire depuis le site."
      }
    />
  );
}
