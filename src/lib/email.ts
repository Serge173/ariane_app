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

export async function sendNewsletterConfirmEmail(data: {
  email: string;
  firstName?: string | null;
  confirmUrl: string;
}): Promise<void> {
  const greeting = data.firstName?.trim() ? `Bonjour ${data.firstName.trim()},` : "Bonjour,";
  await sendEmail({
    to: data.email,
    subject: "Confirmez votre inscription à la newsletter — Ariane DAGO",
    html: `
      <p>${greeting}</p>
      <p>Merci pour votre intérêt pour Conseil en image avec Ariane.</p>
      <p>Cliquez sur le lien ci-dessous pour confirmer votre inscription et recevoir nos actus, conseils image et liens vers YouTube, Facebook et TikTok :</p>
      <p><a href="${data.confirmUrl}">Confirmer mon inscription</a></p>
      <p style="font-size:12px;color:#666">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    `,
  });
}

export async function sendNewsletterWelcomeEmail(data: {
  email: string;
  firstName?: string | null;
  unsubscribeUrl: string;
}): Promise<void> {
  const greeting = data.firstName?.trim() ? `Bonjour ${data.firstName.trim()},` : "Bonjour,";
  await sendEmail({
    to: data.email,
    subject: "Félicitations — vous êtes inscrit(e) à notre newsletter",
    html: `
      <p>${greeting}</p>
      <p><strong>Félicitations et bienvenue !</strong> Votre inscription à la newsletter Ariane DAGO Conseil en image est bien enregistrée.</p>
      <p>Vous ne manquerez plus rien de nos nouveautés, actus et liens vers nos réseaux.</p>
      <p>Merci pour votre confiance — j&apos;ai hâte de partager cette aventure avec vous.</p>
      <p>À très bientôt,<br/><strong>Ariane DAGO</strong></p>
      <p style="margin-top:28px;font-size:12px;color:#666">
        <a href="${data.unsubscribeUrl}">Se désabonner</a>
      </p>
    `,
  });
}

export async function sendNewsletterSocialBroadcast(data: {
  email: string;
  firstName?: string | null;
  title: string;
  intro?: string | null;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  instagramUrl?: string | null;
  unsubscribeUrl: string;
}): Promise<boolean> {
  const greeting = data.firstName?.trim() ? `Bonjour ${data.firstName.trim()},` : "Bonjour,";
  const links: string[] = [];
  if (data.youtubeUrl) links.push(`<li><a href="${data.youtubeUrl}">YouTube</a></li>`);
  if (data.facebookUrl) links.push(`<li><a href="${data.facebookUrl}">Facebook</a></li>`);
  if (data.tiktokUrl) links.push(`<li><a href="${data.tiktokUrl}">TikTok</a></li>`);
  if (data.instagramUrl) links.push(`<li><a href="${data.instagramUrl}">Instagram</a></li>`);

  return sendEmail({
    to: data.email,
    subject: data.title,
    html: `
      <p>${greeting}</p>
      ${data.intro ? `<p>${data.intro.replace(/\n/g, "<br/>")}</p>` : ""}
      ${links.length ? `<ul>${links.join("")}</ul>` : ""}
      <p style="margin-top:24px;font-size:12px;color:#666">
        <a href="${data.unsubscribeUrl}">Se désabonner</a>
      </p>
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
