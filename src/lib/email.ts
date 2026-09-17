import { Resend } from "resend";
import { getPlatformSettings } from "@/lib/platform-settings";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

function fromAddress(): string {
  const from = process.env.EMAIL_FROM?.trim();
  if (!from) return "Ariane DAGO <contact@conseil-image-ariane.com>";
  return from.includes("<") ? from : `Ariane DAGO <${from}>`;
}

async function adminEmail(): Promise<string> {
  const settings = await getPlatformSettings();
  return settings.contactEmail;
}

export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    if (error) {
      console.error("Email send error:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export async function notifyAdminContactMessage(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  type: string;
  message: string;
}): Promise<void> {
  const to = await adminEmail();
  await sendEmail({
    to,
    subject: `[Contact] ${data.firstName} ${data.lastName}`,
    replyTo: data.email,
    html: `
      <p><strong>Nouveau message</strong> (${data.type})</p>
      <p>${data.firstName} ${data.lastName}<br/>
      ${data.email}${data.phone ? `<br/>${data.phone}` : ""}${data.company ? `<br/>${data.company}` : ""}</p>
      <p>${data.message.replace(/\n/g, "<br/>")}</p>
    `,
  });
}

export async function sendContactAutoReply(data: {
  email: string;
  firstName: string;
}): Promise<void> {
  await sendEmail({
    to: data.email,
    subject: "Nous avons bien reçu votre message — Ariane DAGO",
    html: `
      <p>Bonjour ${data.firstName},</p>
      <p>Merci pour votre message. L'équipe Ariane DAGO Conseil en image vous répondra sous 24 à 48 h ouvrées.</p>
      <p>À très bientôt,<br/>Ariane DAGO</p>
    `,
  });
}

export async function notifyAdminAppointment(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}): Promise<void> {
  const to = await adminEmail();
  await sendEmail({
    to,
    subject: `[RDV] ${data.firstName} ${data.lastName}`,
    replyTo: data.email,
    html: `
      <p><strong>Nouvelle demande de rendez-vous</strong></p>
      <p>${data.firstName} ${data.lastName}<br/>${data.email}<br/>${data.phone}</p>
      <pre style="white-space:pre-wrap;font-family:sans-serif">${data.message}</pre>
    `,
  });
}

export async function notifyAdminOrder(data: {
  orderNumber: string;
  total: number;
  orderKind: "LUXE" | "SERVICE";
  guestEmail?: string | null;
  guestPhone?: string | null;
}): Promise<void> {
  const to = await adminEmail();
  const label = data.orderKind === "LUXE" ? "Commande boutique" : "Réservation";
  await sendEmail({
    to,
    subject: `[${label}] ${data.orderNumber}`,
    html: `
      <p><strong>${label}</strong> ${data.orderNumber}</p>
      <p>Montant : ${data.total.toLocaleString("fr-FR")} FCFA</p>
      ${data.guestEmail ? `<p>Email : ${data.guestEmail}</p>` : ""}
      ${data.guestPhone ? `<p>Téléphone : ${data.guestPhone}</p>` : ""}
    `,
  });
}
