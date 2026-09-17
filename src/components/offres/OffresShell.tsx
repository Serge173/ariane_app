"use client";

import { useLayoutEffect } from "react";

/**
 * Calque blanc fixe + styles inline sur html/body/main.
 * Garantit #ffffff même si d'autres styles entrent en conflit.
 */
export function OffresShell({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const main = document.querySelector("main");

    html.setAttribute("data-offres", "");
    html.style.setProperty("background-color", "#ffffff", "important");
    body.style.setProperty("background-color", "#ffffff", "important");

    if (main instanceof HTMLElement) {
      main.style.setProperty("background-color", "#ffffff", "important");
    }

    return () => {
      html.removeAttribute("data-offres");
      html.style.removeProperty("background-color");
      body.style.removeProperty("background-color");
      if (main instanceof HTMLElement) {
        main.style.removeProperty("background-color");
      }
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="offres-white-backdrop"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundColor: "#ffffff",
          pointerEvents: "none",
        }}
      />
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </>
  );
}
