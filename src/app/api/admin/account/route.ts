import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";

export async function GET() {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!user) return jsonError("Compte introuvable", 404);
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: session!.user!.id },
    });
    if (!user) return jsonError("Compte introuvable", 404);

    const data: {
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      email?: string;
      passwordHash?: string;
    } = {};

    if (firstName !== undefined) {
      if (!String(firstName).trim()) return jsonError("Le prénom est requis");
      data.firstName = String(firstName).trim();
    }
    if (lastName !== undefined) {
      if (!String(lastName).trim()) return jsonError("Le nom est requis");
      data.lastName = String(lastName).trim();
    }
    if (phone !== undefined) {
      data.phone = phone ? String(phone).trim() : null;
    }
    if (email !== undefined) {
      const normalized = String(email).trim().toLowerCase();
      if (!normalized) return jsonError("L'email est requis");
      const existing = await prisma.user.findFirst({
        where: { email: normalized, NOT: { id: user.id } },
      });
      if (existing) return jsonError("Cet email est déjà utilisé", 409);
      data.email = normalized;
    }

    if (newPassword) {
      if (!currentPassword) return jsonError("Mot de passe actuel requis");
      if (!user.passwordHash) return jsonError("Compte sans mot de passe local");
      const valid = await bcrypt.compare(String(currentPassword), user.passwordHash);
      if (!valid) return jsonError("Mot de passe actuel incorrect", 403);
      if (String(newPassword).length < 8) {
        return jsonError("Le nouveau mot de passe doit contenir au moins 8 caractères");
      }
      data.passwordHash = await bcrypt.hash(String(newPassword), 12);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/admin/account]", err);
    return jsonError("Erreur lors de la mise à jour", 500);
  }
}
