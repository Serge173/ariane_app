import { resolveAppUrl } from "@/lib/app-url";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const PLATFORM_SETTINGS_KEY = "platform_settings";

export interface PlatformSettings {
  appUrl: string;
  whatsappNumber: string;
  cinetpayApiKey: string;
  cinetpaySiteId: string;
  cinetpayNotifyUrl: string;
  contactEmail: string;
}

export interface PlatformSettingsPublic {
  appUrl: string;
  whatsappNumber: string;
}

function defaultsFromEnv(): PlatformSettings {
  const appUrl = resolveAppUrl();

  return {
    appUrl,
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+2250749526194",
    cinetpayApiKey: process.env.CINETPAY_API_KEY || "",
    cinetpaySiteId: process.env.CINETPAY_SITE_ID || "",
    cinetpayNotifyUrl:
      process.env.CINETPAY_NOTIFY_URL || `${appUrl}/api/payments/webhook`,
    contactEmail: process.env.EMAIL_FROM || "contact@conseil-image-ariane.com",
  };
}

export function getDatabaseLabel(): string {
  const url = process.env.DATABASE_URL ?? "";
  if (url.includes("neon")) return "PostgreSQL (Neon)";
  if (url.includes("supabase")) return "PostgreSQL (Supabase)";
  return "PostgreSQL";
}

export async function getPlatformSettings(): Promise<PlatformSettings> {
  const defaults = defaultsFromEnv();
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: PLATFORM_SETTINGS_KEY },
    });
    if (!row?.value || typeof row.value !== "object") return defaults;
    return { ...defaults, ...(row.value as Partial<PlatformSettings>) };
  } catch {
    return defaults;
  }
}

export async function updatePlatformSettings(
  patch: Partial<PlatformSettings>
): Promise<PlatformSettings> {
  const current = await getPlatformSettings();
  const merged: PlatformSettings = { ...current };

  if (patch.appUrl !== undefined) {
    merged.appUrl = patch.appUrl.trim().replace(/\/$/, "");
  }
  if (patch.whatsappNumber !== undefined) {
    merged.whatsappNumber = patch.whatsappNumber.trim();
  }
  if (patch.cinetpaySiteId !== undefined) {
    merged.cinetpaySiteId = patch.cinetpaySiteId.trim();
  }
  if (patch.cinetpayNotifyUrl !== undefined) {
    merged.cinetpayNotifyUrl = patch.cinetpayNotifyUrl.trim();
  }
  if (patch.contactEmail !== undefined) {
    merged.contactEmail = patch.contactEmail.trim();
  }
  if (patch.cinetpayApiKey !== undefined && patch.cinetpayApiKey.trim()) {
    merged.cinetpayApiKey = patch.cinetpayApiKey.trim();
  }

  const jsonValue = merged as unknown as Prisma.InputJsonValue;

  await prisma.siteContent.upsert({
    where: { key: PLATFORM_SETTINGS_KEY },
    create: { key: PLATFORM_SETTINGS_KEY, value: jsonValue },
    update: { value: jsonValue },
  });

  return merged;
}

export function toPublicSettings(settings: PlatformSettings): PlatformSettingsPublic {
  return {
    appUrl: settings.appUrl,
    whatsappNumber: settings.whatsappNumber,
  };
}

export function maskSecret(value: string): string {
  if (!value) return "";
  return "••••••••••••";
}

export function isCinetPayConfigured(settings: PlatformSettings): boolean {
  return Boolean(settings.cinetpayApiKey && settings.cinetpaySiteId);
}
