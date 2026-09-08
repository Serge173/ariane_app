import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, date, time, mode, objective } = body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Coordonnées obligatoires manquantes" }, { status: 400 });
    }

    if (!date || !time) {
      return NextResponse.json({ error: "Date et créneau requis" }, { status: 400 });
    }

    const modeLabel =
      mode === "DIGITAL" ? "100% Digital" : mode === "HYBRID" ? "Hybride" : "Présentiel (Abidjan)";

    const message = [
      "Demande de rendez-vous — Ariane DAGO Conseil en image",
      "",
      `Date souhaitée : ${date}`,
      `Créneau : ${time.replace(":", "h")}`,
      `Mode : ${modeLabel}`,
      objective?.trim() ? `Objectif : ${objective.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const request = await prisma.contactRequest.create({
      data: {
        type: "rdv",
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message,
      },
    });

    return NextResponse.json({ id: request.id, success: true });
  } catch (error) {
    console.error("Appointment request error:", error);
    return NextResponse.json({ error: "Impossible d'enregistrer la demande" }, { status: 500 });
  }
}
