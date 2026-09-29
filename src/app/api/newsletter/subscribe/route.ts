import { NextRequest, NextResponse } from "next/server";
import { sendNewsletterWelcomeEmail } from "@/lib/email";
import {
  newsletterUnsubscribeUrl,
  normalizeNewsletterEmail,
  upsertNewsletterSubscriber,
} from "@/lib/newsletter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email : "";
    const firstName = typeof body.firstName === "string" ? body.firstName : undefined;
    const source = typeof body.source === "string" ? body.source : "website";
    const consent = Boolean(body.consent);
    const website = typeof body.website === "string" ? body.website : "";

    if (website.trim()) {
      return NextResponse.json({ ok: true });
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Consentement requis pour la newsletter" },
        { status: 400 }
      );
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
    }

    const normalized = normalizeNewsletterEmail(email);
    const result = await upsertNewsletterSubscriber({
      email: normalized,
      firstName,
      source,
    });

    if (result.alreadyActive) {
      return NextResponse.json({ ok: true, status: "already_active" });
    }

    void sendNewsletterWelcomeEmail({
      email: normalized,
      firstName: result.subscriber.firstName,
      unsubscribeUrl: newsletterUnsubscribeUrl(result.subscriber.unsubscribeToken),
    });

    return NextResponse.json({ ok: true, status: "subscribed" });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json({ error: "Inscription impossible" }, { status: 500 });
  }
}
