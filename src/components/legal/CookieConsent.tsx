"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  COOKIE_CONSENT_KEY,
  setCookieConsent,
  type CookieConsentValue,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(COOKIE_CONSENT_KEY));
  }, []);

  const choose = (value: CookieConsentValue) => {
    setCookieConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[60] p-4 sm:p-5"
      role="dialog"
      aria-label="Consentement cookies"
    >
      <div className="container-premium max-w-3xl mx-auto bg-white border border-brand-100 shadow-lg p-4 sm:p-5">
        <p className="text-sm text-brand-700 leading-relaxed mb-4">
          Nous utilisons des cookies essentiels au fonctionnement du site et, avec votre accord,
          des outils de mesure d&apos;audience pour améliorer votre expérience.{" "}
          <Link href="/confidentialite" className="underline text-brand-950">
            En savoir plus
          </Link>
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="btn-secondary text-xs py-2 px-4"
          >
            Refuser les cookies analytics
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="btn-primary text-xs py-2 px-4"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
