import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { canManageTeam } from "@/lib/user-roles";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json(await getSiteSettings());
}

export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;
  if (!canManageTeam(session!.user!.role)) {
    return jsonError("Droits insuffisants pour modifier le contenu du site", 403);
  }
  try {
    const body = await req.json();
    const updated = await updateSiteSettings(body);
    return NextResponse.json(updated);
  } catch {
    return jsonError("Impossible d'enregistrer le contenu du site", 500);
  }
}
