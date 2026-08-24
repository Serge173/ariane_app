import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { slug, answers, guestEmail } = body;

  const questionnaire = await prisma.questionnaire.findUnique({ where: { slug } });
  if (!questionnaire) {
    return NextResponse.json({ error: "Questionnaire introuvable" }, { status: 404 });
  }

  const response = await prisma.questionnaireResponse.create({
    data: {
      questionnaireId: questionnaire.id,
      userId: session?.user?.id || null,
      guestEmail: guestEmail || null,
      answers,
    },
  });

  if (session?.user?.id && slug === "pre-coaching") {
    await prisma.order.updateMany({
      where: {
        userId: session.user.id,
        status: { in: ["PAID", "QUESTIONNAIRE_PENDING"] },
      },
      data: { status: "COACHING_SCHEDULED" },
    });
  }

  return NextResponse.json(response);
}
