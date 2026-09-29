"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewsletterSubscribeSuccess } from "@/components/newsletter/NewsletterSubscribeSuccess";

const DISMISS_KEY = "newsletter_popup_dismissed_until";
const SUBSCRIBED_KEY = "newsletter_popup_subscribed";
const DISMISS_DAYS = 7;
const OPEN_DELAY_MS = 1800;

const emailInputClass =
  "font-sans w-full px-4 py-3 border-2 border-black bg-white text-black placeholder:text-brand-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20";

type Step = "invite" | "email" | "done";

function shouldShowPopup(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(SUBSCRIBED_KEY) === "1") return false;
  const until = localStorage.getItem(DISMISS_KEY);
  if (until && Date.now() < Number(until)) return false;
  return true;
}

function dismissPopup() {
  const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(DISMISS_KEY, String(until));
}

function markSubscribed() {
  localStorage.setItem(SUBSCRIBED_KEY, "1");
  localStorage.removeItem(DISMISS_KEY);
}

function ModalShell({
  open,
  onClose,
  children,
  ariaLabel,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-950/50 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="relative w-full max-w-md bg-white border border-brand-300 shadow-xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-brand-500 hover:text-brand-950 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function NewsletterPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("invite");
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (pathname.startsWith("/newsletter")) return;
    if (!shouldShowPopup()) return;
    const timer = window.setTimeout(() => setVisible(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const close = () => {
    dismissPopup();
    setVisible(false);
  };

  const finishSuccess = () => {
    markSubscribed();
    setStep("done");
  };

  const handleSubscribe = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent: true,
          source: "popup",
          website: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      finishSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      open={visible}
      onClose={close}
      ariaLabel={
        step === "invite"
          ? "Invitation newsletter"
          : step === "email"
            ? "Inscription newsletter"
            : "Confirmation newsletter"
      }
    >
      {step === "invite" && (
        <>
          <p className="text-overline mb-2 pr-8">Newsletter</p>
          <h2 className="font-display text-2xl font-light text-brand-950 mb-3 pr-6">
            Restez inspiré(e) avec Ariane
          </h2>
          <p className="text-sm text-brand-600 leading-relaxed mb-6">
            Abonnez-vous pour ne rien rater.
          </p>
          <label className="flex items-start gap-3 text-sm text-brand-700 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 shrink-0"
            />
            <span>
              J&apos;accepte de recevoir la newsletter et j&apos;ai lu la{" "}
              <Link href="/confidentialite" className="underline hover:text-brand-950" onClick={close}>
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          <button
            type="button"
            disabled={!consent}
            onClick={() => setStep("email")}
            className={cn("btn-primary w-full", !consent && "opacity-50 cursor-not-allowed")}
          >
            Continuer
          </button>
        </>
      )}

      {step === "email" && (
        <>
          <p className="text-overline mb-2 pr-8">Votre email</p>
          <h2 className="font-display text-2xl font-light text-brand-950 mb-3 pr-6">
            S&apos;abonner à la newsletter
          </h2>
          <div className="mb-6">
            <label className="label-field text-black">Email *</label>
            <input
              type="email"
              className={emailInputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="votre@email.com"
            />
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={loading || !email.trim()}
            className="btn-primary w-full"
          >
            {loading ? "Inscription..." : "S'abonner"}
          </button>
        </>
      )}

      {step === "done" && (
        <>
          <NewsletterSubscribeSuccess tone="light" className="mb-8 pr-6" />
          <button type="button" onClick={close} className="btn-primary w-full">
            Continuer la visite
          </button>
        </>
      )}
    </ModalShell>
  );
}
