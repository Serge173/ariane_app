import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { canManageTeam } from "@/lib/user-roles";
import { getHomepageSettings, updateHomepageSettings } from "@/lib/homepage-settings";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json(await getHomepageSettings());
}

export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;
  if (!canManageTeam(session!.user!.role)) {
    return jsonError("Droits insuffisants pour modifier la page d'accueil", 403);
  }
  try {
    const body = await req.json();
    const updated = await updateHomepageSettings(body);
    return NextResponse.json(updated);
  } catch {
    return jsonError("Impossible d'enregistrer la page d'accueil", 500);
  }
}
