import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { canManageTeam } from "@/lib/user-roles";
import {
  getBoutiquePageSettings,
  updateBoutiquePageSettings,
} from "@/lib/boutique-settings";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await getBoutiquePageSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  if (!canManageTeam(session!.user!.role)) {
    return jsonError("Droits insuffisants pour modifier la page boutique", 403);
  }

  try {
    const body = await req.json();
    if (
      body.spotlightProductIds !== undefined &&
      (!Array.isArray(body.spotlightProductIds) ||
        body.spotlightProductIds.some((id: unknown) => typeof id !== "string"))
    ) {
      return jsonError("Sélection de produits invalide");
    }
    if (Array.isArray(body.spotlightProductIds) && body.spotlightProductIds.length > 2) {
      return jsonError("Maximum 2 produits pour la section");
    }

    const updated = await updateBoutiquePageSettings(body);
    return NextResponse.json(updated);
  } catch {
    return jsonError("Impossible d'enregistrer les paramètres boutique", 500);
  }
}
