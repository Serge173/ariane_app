import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notifyAdminContactMessage, sendContactAutoReply } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.consent) {
      return NextResponse.json(
        { error: "Consentement au traitement des données requis" },
        { status: 400 }
      );
    }

    const contact = await prisma.contactRequest.create({
      data: {
        type: body.type || "general",
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        company: body.company,
        message: body.message,
      },
    });

    void notifyAdminContactMessage({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      company: body.company,
      type: body.type || "general",
      message: body.message,
    });
    void sendContactAutoReply({ email: body.email, firstName: body.firstName });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
