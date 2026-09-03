import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { canManageTeam } from "@/lib/user-roles";
import { getPublicPagesSettings, updatePublicPagesSettings } from "@/lib/public-pages-settings";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return NextResponse.json(await getPublicPagesSettings());
}

export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;
  if (!canManageTeam(session!.user!.role)) {
    return jsonError("Droits insuffisants pour modifier le contenu", 403);
  }
  try {
    const body = await req.json();
    const updated = await updatePublicPagesSettings(body);
    return NextResponse.json(updated);
  } catch {
    return jsonError("Impossible d'enregistrer le contenu", 500);
  }
}
