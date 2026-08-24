import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
