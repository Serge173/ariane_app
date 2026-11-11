import { unsubscribeNewsletterByToken } from "@/lib/newsletter";
import { NewsletterResultLayout } from "@/components/newsletter/NewsletterResultLayout";

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
    <NewsletterResultLayout
      success={ok}
      title={ok ? "Désinscription enregistrée" : "Lien invalide"}
      description={
        ok
          ? "Vous ne recevrez plus nos emails newsletter. Vous pouvez vous réinscrire à tout moment."
          : "Ce lien de désinscription n'est pas valide."
      }
    />
  );
}
