import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { canManageTeam } from "@/lib/user-roles";
import {
  getPlatformSettings,
  updatePlatformSettings,
  getDatabaseLabel,
  isCinetPayConfigured,
  maskSecret,
} from "@/lib/platform-settings";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await getPlatformSettings();

  return NextResponse.json({
    appUrl: settings.appUrl,
    whatsappNumber: settings.whatsappNumber,
    cinetpaySiteId: settings.cinetpaySiteId,
    cinetpayNotifyUrl: settings.cinetpayNotifyUrl,
    contactEmail: settings.contactEmail,
    cinetpayApiKey: settings.cinetpayApiKey ? maskSecret(settings.cinetpayApiKey) : "",
    cinetpayConfigured: isCinetPayConfigured(settings),
    database: getDatabaseLabel(),
  });
}

export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  if (!canManageTeam(session!.user!.role)) {
    return jsonError("Droits insuffisants pour modifier la plateforme", 403);
  }

  try {
    const body = await req.json();
    const {
      appUrl,
      whatsappNumber,
      cinetpayApiKey,
      cinetpaySiteId,
      cinetpayNotifyUrl,
      contactEmail,
    } = body;

    if (appUrl !== undefined && !String(appUrl).trim()) {
      return jsonError("L'URL publique est requise");
    }
    if (whatsappNumber !== undefined && !String(whatsappNumber).trim()) {
      return jsonError("Le numéro WhatsApp est requis");
    }

    const apiKey =
      cinetpayApiKey !== undefined &&
      String(cinetpayApiKey).trim() &&
      !String(cinetpayApiKey).includes("•")
        ? String(cinetpayApiKey).trim()
        : undefined;

    const updated = await updatePlatformSettings({
      appUrl: appUrl !== undefined ? String(appUrl) : undefined,
      whatsappNumber: whatsappNumber !== undefined ? String(whatsappNumber) : undefined,
      cinetpayApiKey: apiKey,
      cinetpaySiteId: cinetpaySiteId !== undefined ? String(cinetpaySiteId) : undefined,
      cinetpayNotifyUrl: cinetpayNotifyUrl !== undefined ? String(cinetpayNotifyUrl) : undefined,
      contactEmail: contactEmail !== undefined ? String(contactEmail) : undefined,
    });

    return NextResponse.json({
      appUrl: updated.appUrl,
      whatsappNumber: updated.whatsappNumber,
      cinetpaySiteId: updated.cinetpaySiteId,
      cinetpayNotifyUrl: updated.cinetpayNotifyUrl,
      contactEmail: updated.contactEmail,
      cinetpayApiKey: updated.cinetpayApiKey ? maskSecret(updated.cinetpayApiKey) : "",
      cinetpayConfigured: isCinetPayConfigured(updated),
      database: getDatabaseLabel(),
    });
  } catch (err) {
    console.error("[PATCH /api/admin/platform-settings]", err);
    return jsonError("Erreur lors de la mise à jour", 500);
  }
}
