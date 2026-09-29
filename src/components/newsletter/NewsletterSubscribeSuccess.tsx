"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "light";

const toneClass: Record<Tone, { icon: string; text: string }> = {
  dark: { icon: "text-green-400", text: "text-green-300" },
  light: { icon: "text-green-600", text: "text-brand-800" },
};

export function NewsletterSubscribeSuccess({
  tone = "dark",
  className,
}: {
  tone?: Tone;
  className?: string;
}) {
  const t = toneClass[tone];
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center justify-center text-center gap-2 py-3", className)}
    >
      <CheckCircle2 className={cn("w-9 h-9 shrink-0", t.icon)} strokeWidth={1.5} aria-hidden />
      <p className={cn("text-sm font-medium tracking-wide", t.text)}>Abonnement confirmé</p>
    </div>
  );
}
