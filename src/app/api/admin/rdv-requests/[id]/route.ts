import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { normalizeDiscoveryAnswers } from "@/lib/discovery-parcours-questions";
import { getDiscoveryParcoursSettings } from "@/lib/discovery-parcours-settings";
import { buildRdvRequestMessage, modeToLabel } from "@/lib/rdv-request-message";

interface Ctx {
  params: Promise<{ id: string }>;
}

async function loadRdv(id: string) {
  const existing = await prisma.contactRequest.findUnique({ where: { id } });
  if (!existing || existing.type !== "rdv") return null;
  return existing;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const row = await loadRdv(id);
  if (!row) return jsonError("Demande introuvable", 404);
  return Response.json(row);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const existing = await loadRdv(id);
  if (!existing) return jsonError("Demande introuvable", 404);

  const body = await req.json();
  const formSettings = await getDiscoveryParcoursSettings();

  const prevMeta =
    existing.metadata && typeof existing.metadata === "object"
      ? (existing.metadata as Record<string, unknown>)
      : {};

  const firstName =
    typeof body.firstName === "string" ? body.firstName.trim() : existing.firstName;
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : existing.lastName;
  const email = typeof body.email === "string" ? body.email.trim() : existing.email;
  const phone =
    typeof body.phone === "string" ? body.phone.trim() : existing.phone ?? "";

  if (!firstName || !lastName || !email) {
    return jsonError("Nom, prénom et email requis", 400);
  }

  const date =
    typeof body.date === "string" && body.date.trim()
      ? body.date.trim()
      : typeof prevMeta.date === "string"
        ? prevMeta.date
        : "";
  const time =
    typeof body.time === "string" && body.time.trim()
      ? body.time.trim()
      : typeof prevMeta.time === "string"
        ? prevMeta.time
        : "";
  const modeRaw =
    typeof body.mode === "string" && body.mode.trim()
      ? body.mode.trim()
      : typeof prevMeta.mode === "string"
        ? prevMeta.mode
        : "Présentiel (Abidjan)";
  const modeLabel = modeToLabel(
    modeRaw === "100% Digital"
      ? "DIGITAL"
      : modeRaw === "Hybride"
        ? "HYBRID"
        : modeRaw === "Présentiel (Abidjan)"
          ? "IN_PERSON"
          : modeRaw
  );

  const objective =
    typeof body.objective === "string"
      ? body.objective.trim()
      : typeof prevMeta.objective === "string"
        ? prevMeta.objective
        : "";

  const discoveryAnswers = normalizeDiscoveryAnswers(
    body.discoveryAnswers ?? prevMeta.discoveryAnswers,
    formSettings
  );

  const metadata = {
    objective: objective || null,
    date,
    time,
    mode: modeLabel,
    discoveryAnswers,
  };

  const message = buildRdvRequestMessage({
    date: date || "—",
    time: time || "—",
    modeLabel,
    objective,
    discoveryAnswers,
    formSettings,
  });

  const data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    message: string;
    metadata: typeof metadata;
    isRead?: boolean;
  } = {
    firstName,
    lastName,
    email,
    phone: phone || null,
    message,
    metadata,
  };

  if (typeof body.isRead === "boolean") data.isRead = body.isRead;

  const updated = await prisma.contactRequest.update({
    where: { id },
    data,
  });

  return Response.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const existing = await loadRdv(id);
  if (!existing) return jsonError("Demande introuvable", 404);

  await prisma.contactRequest.delete({ where: { id } });
  return Response.json({ deleted: true });
}
