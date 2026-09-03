import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { normalizePaymentCode, isValidPaymentMethodCode } from "@/lib/payment-methods";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const methods = await prisma.paymentMethodConfig.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(methods);
  } catch (err) {
    console.error("[GET /api/admin/payment-methods]", err);
    return jsonError("Impossible de charger les modes de paiement", 500);
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
  const body = await req.json();
  const {
    name,
    code: rawCode,
    description,
    instructions,
    icon = "CreditCard",
    logoUrl,
    apiChannel,
    context = "BOTH",
    provider = "CINETPAY",
    isActive = true,
    sortOrder = 0,
    minAmount,
    maxAmount,
  } = body;

  if (!name?.trim()) return jsonError("Le nom est requis");

  const code = normalizePaymentCode(rawCode || name);
  if (!code) return jsonError("Code invalide");
  if (!isValidPaymentMethodCode(code)) {
    return jsonError("Code non reconnu. Utilisez un code standard (ex. MOBILE_MONEY_ORANGE, CARD…)");
  }

  const exists = await prisma.paymentMethodConfig.findUnique({ where: { code } });
  if (exists) return jsonError("Ce code existe déjà", 409);

  if (provider === "CASH_ON_DELIVERY" && context === "ACCOMPAGNEMENT") {
    return jsonError("Le paiement à la livraison n'est disponible que pour la boutique");
  }

  const channel = apiChannel?.trim() || null;
  if (provider === "CINETPAY" && !channel) {
    return jsonError("Le canal CinetPay est requis pour l'API CinetPay");
  }
  if (provider !== "CINETPAY" && channel) {
    return jsonError("Le canal CinetPay ne s'applique qu'au fournisseur CinetPay");
  }

  const method = await prisma.paymentMethodConfig.create({
    data: {
      code,
      name: name.trim(),
      description: description?.trim() || null,
      instructions: instructions?.trim() || null,
      icon,
      logoUrl: logoUrl?.trim() || null,
      apiChannel: channel,
      context,
      provider,
      isActive: Boolean(isActive),
      sortOrder: Number(sortOrder) || 0,
      minAmount: minAmount != null && minAmount !== "" ? Number(minAmount) : null,
      maxAmount: maxAmount != null && maxAmount !== "" ? Number(maxAmount) : null,
    },
  });

  return NextResponse.json(method, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/payment-methods]", err);
    return jsonError("Impossible d'enregistrer le mode de paiement", 500);
  }
}
