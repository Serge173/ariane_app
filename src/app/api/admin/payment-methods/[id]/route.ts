import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { normalizePaymentCode, isValidPaymentMethodCode } from "@/lib/payment-methods";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const method = await prisma.paymentMethodConfig.findUnique({ where: { id } });
  if (!method) return jsonError("Mode de paiement introuvable", 404);
  return NextResponse.json(method);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const existing = await prisma.paymentMethodConfig.findUnique({ where: { id } });
  if (!existing) return jsonError("Mode de paiement introuvable", 404);

  const body = await req.json();

  if (body.code !== undefined) {
    const code = normalizePaymentCode(body.code);
    if (!isValidPaymentMethodCode(code)) {
      return jsonError("Code non reconnu");
    }
  }

  if (body.code && normalizePaymentCode(body.code) !== existing.code) {
    const conflict = await prisma.paymentMethodConfig.findUnique({
      where: { code: normalizePaymentCode(body.code) },
    });
    if (conflict) return jsonError("Ce code existe déjà", 409);
  }

  const provider = body.provider ?? existing.provider;
  const context = body.context ?? existing.context;
  if (provider === "CASH_ON_DELIVERY" && context === "ACCOMPAGNEMENT") {
    return jsonError("Le paiement à la livraison n'est disponible que pour la boutique");
  }

  const method = await prisma.paymentMethodConfig.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.code !== undefined && { code: normalizePaymentCode(body.code) }),
      ...(body.description !== undefined && { description: body.description?.trim() || null }),
      ...(body.instructions !== undefined && { instructions: body.instructions?.trim() || null }),
      ...(body.icon !== undefined && { icon: body.icon }),
      ...(body.context !== undefined && { context: body.context }),
      ...(body.provider !== undefined && { provider: body.provider }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) || 0 }),
      ...(body.minAmount !== undefined && {
        minAmount: body.minAmount != null && body.minAmount !== "" ? Number(body.minAmount) : null,
      }),
      ...(body.maxAmount !== undefined && {
        maxAmount: body.maxAmount != null && body.maxAmount !== "" ? Number(body.maxAmount) : null,
      }),
    },
  });

  return NextResponse.json(method);
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.paymentMethodConfig.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
