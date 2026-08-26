import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PaymentMethod } from "@prisma/client";
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

    const resolvedItems: {
      productId: string;
      quantity: number;
      unitPrice: number;
      total: number;
      mode?: string;
      productType: string;
    }[] = [];

    let subtotal = 0;

    for (const item of items) {
      let product;
      if (item.productId) {
        product = await prisma.product.findUnique({ where: { id: item.productId } });
      } else if (item.productSlug) {
        product = await prisma.product.findUnique({ where: { slug: item.productSlug } });
      }

      if (!product || !product.isActive) continue;

      const unitPrice = item.price || product.price;
      const quantity = item.quantity || 1;
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      resolvedItems.push({
        productId: product.id,
        quantity,
        unitPrice,
        total: lineTotal,
        mode: mode || product.mode,
        productType: product.productType,
      });
    }

    if (resolvedItems.length === 0) {
      return NextResponse.json({ error: "Aucun produit valide" }, { status: 400 });
    }

    const productTypes = new Set(resolvedItems.map((i) => i.productType));
    if (productTypes.size > 1) {
      return NextResponse.json(
        { error: "Impossible de mélanger articles boutique et accompagnements dans une même commande" },
        { status: 400 }
      );
    }

    const orderKind: OrderKind =
      requestedKind === "LUXE" || requestedKind === "SERVICE"
        ? requestedKind
        : (resolvedItems[0].productType as OrderKind);

    if (orderKind !== resolvedItems[0].productType) {
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

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        guestEmail: session ? undefined : email,
        guestPhone: session ? undefined : phone,
        guestFirstName: session ? undefined : firstName,
        guestLastName: session ? undefined : lastName,
        status: "PENDING_PAYMENT",
        subtotal,
        total: subtotal,
        notes: orderKind === "SERVICE" ? notes : deliveryNotes,
        billingInfo,
        items: {
          create: resolvedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
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
    return NextResponse.json({ error: "Erreur lors de la création de la commande" }, { status: 500 });
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
      items: { include: { product: true } },
      appointment: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
