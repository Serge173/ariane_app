import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const context = req.nextUrl.searchParams.get("context") as
    | "boutique"
    | "accompagnement"
    | null;

  try {
    const methods = await prisma.paymentMethodConfig.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    const filtered = methods.filter((m) => {
      if (!context) return true;
      if (context === "boutique") {
        return m.context === "BOUTIQUE" || m.context === "BOTH";
      }
      return m.context === "ACCOMPAGNEMENT" || m.context === "BOTH";
    });

    return NextResponse.json(filtered);
  } catch (err) {
    console.error("[GET /api/payment-methods]", err);
    return NextResponse.json({ error: "Impossible de charger les modes de paiement" }, { status: 500 });
  }
}
