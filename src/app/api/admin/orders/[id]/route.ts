import { NextRequest, NextResponse } from "next/server";
import { FulfillmentStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { restoreStockForOrder } from "@/lib/shop/inventory";
import { isShopOrder } from "@/lib/shop/notifications";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await ctx.params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return jsonError("Commande introuvable", 404);

  const body = await req.json();
  const data: {
    fulfillmentStatus?: FulfillmentStatus;
    trackingNumber?: string | null;
    shippingCarrier?: string | null;
    status?: typeof order.status;
  } = {};

  if (body.fulfillmentStatus) {
    if (!Object.values(FulfillmentStatus).includes(body.fulfillmentStatus)) {
      return jsonError("Statut fulfillment invalide");
    }
    data.fulfillmentStatus = body.fulfillmentStatus as FulfillmentStatus;

    if (body.fulfillmentStatus === "CANCELLED" && isShopOrder(order.billingInfo)) {
      await prisma.$transaction(async (tx) => {
        await restoreStockForOrder(tx, order.id);
        await tx.order.update({
          where: { id },
          data: {
            fulfillmentStatus: FulfillmentStatus.CANCELLED,
            status: order.status === "PENDING_PAYMENT" ? "CANCELLED" : order.status,
            trackingNumber: body.trackingNumber?.trim() || null,
            shippingCarrier: body.shippingCarrier?.trim() || null,
          },
        });
      });
      const updated = await prisma.order.findUnique({ where: { id } });
      return NextResponse.json(updated);
    }
  }

  if (body.trackingNumber !== undefined) {
    data.trackingNumber = body.trackingNumber?.trim() || null;
  }
  if (body.shippingCarrier !== undefined) {
    data.shippingCarrier = body.shippingCarrier?.trim() || null;
  }

  const updated = await prisma.order.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}
