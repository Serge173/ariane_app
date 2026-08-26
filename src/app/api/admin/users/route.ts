import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import { canManageTeam, rolesAssignableBy, TEAM_ROLES } from "@/lib/user-roles";

const teamSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  avatar: true,
  createdAt: true,
} as const;

export async function GET() {
  const { error, session } = await requireAdmin();
  if (error) return error;

  if (!canManageTeam(session!.user!.role)) {
    return jsonError("Droits insuffisants", 403);
  }

  const users = await prisma.user.findMany({
    where: { role: { in: TEAM_ROLES } },
    select: teamSelect,
    orderBy: [{ role: "asc" }, { lastName: "asc" }],
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const actorRole = session!.user!.role;
  if (!canManageTeam(actorRole)) {
    return jsonError("Droits insuffisants", 403);
  }

  try {
    const { email, password, firstName, lastName, phone, role } = await req.json();

    if (!email || !password || !firstName || !lastName || !role) {
      return jsonError("Email, mot de passe, prénom, nom et rôle sont requis");
    }

    const allowed = rolesAssignableBy(actorRole);
    if (!allowed.includes(role as UserRole)) {
      return jsonError("Rôle non autorisé", 403);
    }

    if (String(password).length < 8) {
      return jsonError("Le mot de passe doit contenir au moins 8 caractères");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) return jsonError("Cet email est déjà utilisé", 409);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(String(password), 12),
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        phone: phone ? String(phone).trim() : null,
        role: role as UserRole,
      },
      select: teamSelect,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/users]", err);
    return jsonError("Erreur lors de la création", 500);
  }
}
