"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import type { ContactPageSettings } from "@/lib/public-pages-settings";
import type { SiteSettings } from "@/lib/site-settings";

function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

function whatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

function ContactFormInner({
  contact,
  site,
}: {
  contact: ContactPageSettings;
  site: SiteSettings;
}) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "general";

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    type,
  });

  const titles = contact.types;
  const current = titles[type as keyof typeof titles] || titles.general;
  const { contact: coords } = site.footer;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showSuccess(contact.successMessage, contact.successTitle, () => setSent(true));
    } catch {
      showError("Votre message n'a pas pu être envoyé. Réessayez ou contactez-nous par téléphone.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-12">
        <h2 className="font-display text-2xl mb-4">{contact.successTitle}</h2>
        <p className="text-brand-600 mb-8">{contact.successMessage}</p>
        <Link href="/" className="btn-primary">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  return (
    <>
      {FeedbackModal}
      <div className="mb-12">
        <Link href="/" className="btn-ghost inline-flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Accueil
        </Link>
        <h1 className="heading-section mb-2">{current.title}</h1>
        <p className="text-brand-600">{current.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="label-field">Prénom *</label>
            <input className="input-field" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Nom *</label>
            <input className="input-field" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label-field">Email *</label>
          <input type="email" className="input-field" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label-field">Téléphone / WhatsApp</label>
          <input type="tel" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        {(type === "entreprise" || type === "diagnostic") && (
          <div>
            <label className="label-field">Entreprise / Organisation</label>
            <input className="input-field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
        )}
        <div>
          <label className="label-field">Message *</label>
          <textarea className="input-field min-h-[150px]" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary inline-flex items-center gap-2" disabled={loading}>
          <Send className="w-4 h-4" />
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      <div className="mt-16 pt-16 border-t border-brand-200">
        <h2 className="font-display text-xl mb-6">{contact.coordinatesTitle}</h2>
        <div className="space-y-3 text-sm text-brand-600">
          <p>{coords.line1} — {coords.line2}</p>
          <a href={phoneHref(coords.phone)} className="block hover:text-brand-950">{coords.phone}</a>
          <a href={whatsappHref(coords.phone)} className="block hover:text-brand-950">WhatsApp</a>
          <a href={`mailto:${coords.email}`} className="block hover:text-brand-950">{coords.email}</a>
        </div>
      </div>
    </>
  );
}

export function ContactPageClient({
  contact,
  site,
}: {
  contact: ContactPageSettings;
  site: SiteSettings;
}) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-2xl">
        <Suspense fallback={<div>Chargement...</div>}>
          <ContactFormInner contact={contact} site={site} />
        </Suspense>
      </div>
    </div>
  );
}
