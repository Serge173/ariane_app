import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { FulfillmentStatus, PaymentMethod } from "@prisma/client";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { initPayment } from "@/lib/payments/cinetpay";
import { isCinetPayConfigured, getPlatformSettings } from "@/lib/platform-settings";
import { getCinetPayChannel } from "@/lib/payment-providers";
import {
  isOnlinePaymentProvider,
  isValidPaymentMethodCode,
  paymentMethodMatchesContext,
} from "@/lib/payment-methods";
import { resolveOrderLines, OrderPricingError } from "@/lib/shop/pricing";
import { decrementStockForOrder } from "@/lib/shop/inventory";
import { notifyOrderCreated } from "@/lib/shop/notifications";

type OrderKind = "LUXE" | "SERVICE";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      items,
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      mode,
      notes,
      paymentMethod,
      orderKind: requestedKind,
      address,
      city,
      deliveryNotes,
    } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Coordonnées obligatoires manquantes" }, { status: 400 });
    }

    if (!items?.length) {
      return NextResponse.json({ error: "Aucun article dans la commande" }, { status: 400 });
    }

    let resolvedLines;
    let subtotal: number;

    try {
      const resolved = await resolveOrderLines(prisma, items);
      resolvedLines = resolved.lines;
      subtotal = resolved.subtotal;
    } catch (err) {
      if (err instanceof OrderPricingError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      throw err;
    }

    const productTypes = new Set(resolvedLines.map((i) => i.productType));
    if (productTypes.size > 1) {
      return NextResponse.json(
        { error: "Impossible de mélanger articles boutique et accompagnements dans une même commande" },
        { status: 400 }
      );
    }

    const orderKind: OrderKind =
      requestedKind === "LUXE" || requestedKind === "SERVICE"
        ? requestedKind
        : (resolvedLines[0].productType as OrderKind);

    if (orderKind !== resolvedLines[0].productType) {
      return NextResponse.json({ error: "Type de commande incohérent" }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "Mode de paiement requis" }, { status: 400 });
    }

    if (!isValidPaymentMethodCode(paymentMethod)) {
      return NextResponse.json({ error: "Mode de paiement invalide" }, { status: 400 });
    }

    const paymentConfig = await prisma.paymentMethodConfig.findFirst({
      where: { code: paymentMethod, isActive: true },
    });

    if (!paymentConfig) {
      return NextResponse.json({ error: "Mode de paiement invalide ou inactif" }, { status: 400 });
    }

    if (!paymentMethodMatchesContext(paymentConfig.context, orderKind)) {
      return NextResponse.json(
        { error: "Ce mode de paiement n'est pas disponible pour ce type de commande" },
        { status: 400 }
      );
    }

    if (paymentConfig.minAmount != null && subtotal < paymentConfig.minAmount) {
      return NextResponse.json(
        { error: `Montant minimum : ${paymentConfig.minAmount} FCFA` },
        { status: 400 }
      );
    }

    if (paymentConfig.maxAmount != null && subtotal > paymentConfig.maxAmount) {
      return NextResponse.json(
        { error: `Montant maximum : ${paymentConfig.maxAmount} FCFA` },
        { status: 400 }
      );
    }

    if (orderKind === "LUXE") {
      if (!address?.trim() || !city?.trim()) {
        return NextResponse.json({ error: "Adresse de livraison requise" }, { status: 400 });
      }
    } else {
      if (!date || !time) {
        return NextResponse.json({ error: "Date et créneau requis pour la réservation" }, { status: 400 });
      }
    }

    const orderNumber = generateOrderNumber();
    const billingInfo = {
      firstName,
      lastName,
      email,
      phone,
      orderKind,
      ...(orderKind === "LUXE" && {
        shipping: {
          address: address.trim(),
          city: city.trim(),
          notes: deliveryNotes?.trim() || null,
        },
      }),
    };

    const order = await prisma.$transaction(async (tx) => {
      await decrementStockForOrder(tx, resolvedLines);

      return tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id || null,
          guestEmail: session ? undefined : email,
          guestPhone: session ? undefined : phone,
          guestFirstName: session ? undefined : firstName,
          guestLastName: session ? undefined : lastName,
          status: "PENDING_PAYMENT",
          fulfillmentStatus: orderKind === "LUXE" ? FulfillmentStatus.PENDING : null,
          subtotal,
          total: subtotal,
          notes: orderKind === "SERVICE" ? notes : deliveryNotes,
          billingInfo,
          items: {
            create: resolvedLines.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
              variantId: item.variantId,
              variantLabel: item.variantLabel,
              mode:
                orderKind === "SERVICE"
                  ? (item.mode as "IN_PERSON" | "DIGITAL" | "HYBRID" | undefined)
                  : undefined,
            })),
          },
          ...(orderKind === "SERVICE" && {
            appointment: {
              create: {
                userId: session?.user?.id || null,
                date: new Date(date),
                startTime: time,
                endTime: getEndTime(time),
                mode: (mode || "IN_PERSON") as "IN_PERSON" | "DIGITAL" | "HYBRID",
                status: "SCHEDULED",
              },
            },
          }),
        },
        include: { items: true, appointment: true },
      });
    });

    const useOnlinePayment = isOnlinePaymentProvider(paymentConfig.provider);

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: subtotal,
        method: paymentMethod as PaymentMethod,
        status: "PENDING",
      },
    });

    let paymentUrl: string | null = null;

    const platformSettings = await getPlatformSettings();
    if (useOnlinePayment && isCinetPayConfigured(platformSettings)) {
      const returnPath =
        orderKind === "LUXE"
          ? `/checkout/confirmation?order=${orderNumber}`
          : `/reservation/confirmation?order=${orderNumber}`;

      const paymentResult = await initPayment({
        orderId: order.id,
        orderNumber,
        amount: subtotal,
        email,
        phone,
        firstName,
        lastName,
        returnPath,
        channels: getCinetPayChannel(paymentConfig.apiChannel),
      });
      paymentUrl = paymentResult.paymentUrl;
    }

    await notifyOrderCreated({
      orderId: order.id,
      orderNumber,
      userId: session?.user?.id,
      guestPhone: phone,
      guestEmail: email,
      total: subtotal,
      orderKind,
    });

    await prisma.analyticsEvent
      .create({
        data: {
          event: "order_created",
          userId: session?.user?.id,
          metadata: { orderNumber, total: subtotal, orderKind },
        },
      })
      .catch(() => {});

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      orderKind,
      paymentUrl,
      success: true,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    const message =
      error instanceof Error && error.message.includes("Stock insuffisant")
        ? error.message
        : "Erreur lors de la création de la commande";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function getEndTime(startTime: string): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endHours = hours + 2;
  return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: true, variant: true } },
      appointment: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
