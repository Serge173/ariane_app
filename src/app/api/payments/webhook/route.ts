import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPayment } from "@/lib/payments/cinetpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cpm_trans_id, cpm_result } = body;

    if (!cpm_trans_id) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    const isValid = await verifyPayment(cpm_trans_id);
    const isSuccess = isValid || cpm_result === "00";

    const order = await prisma.order.findUnique({
      where: { orderNumber: cpm_trans_id },
      include: { payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (isSuccess) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
      });

      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: { status: "SUCCESS", providerRef: cpm_trans_id },
      });

      await prisma.appointment.updateMany({
        where: { orderId: order.id },
        data: { status: "CONFIRMED" },
      });
    } else {
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: { status: "FAILED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
