"use client";

import { useState } from "react";
import Link from "next/link";
import { NewsletterSubscribeSuccess } from "@/components/newsletter/NewsletterSubscribeSuccess";

export function NewsletterFooterSignup() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!consent) {
      setError("Veuillez accepter de recevoir la newsletter.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, source: "footer", website: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setEmail("");
      setConsent(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("newsletter_popup_subscribed", "1");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <NewsletterSubscribeSuccess tone="dark" />;
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="text-sm text-brand-300 leading-relaxed">
        Abonnez-vous pour ne rien rater.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        className="w-full px-3 py-2.5 bg-brand-900 border border-brand-700 text-white text-sm placeholder:text-brand-500 focus:outline-none focus:border-brand-400"
        required
      />
      <label className="flex items-start gap-2 text-xs text-brand-400 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>
          J&apos;accepte la newsletter —{" "}
          <Link href="/confidentialite" className="underline hover:text-white">
            confidentialité
          </Link>
        </span>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 border border-brand-400 text-brand-100 text-xs uppercase tracking-widest hover:bg-white hover:text-brand-950 transition-colors disabled:opacity-50"
      >
        {loading ? "Envoi..." : "S'abonner"}
      </button>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </form>
  );
}
