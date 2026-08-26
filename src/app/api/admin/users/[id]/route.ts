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

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const isSelf = session!.user!.id === id;

  if (!isSelf && !canManageTeam(session!.user!.role)) {
    return jsonError("Droits insuffisants", 403);
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: teamSelect,
  });

  if (!user || (!isSelf && !TEAM_ROLES.includes(user.role))) {
    return jsonError("Compte introuvable", 404);
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  const actorRole = session!.user!.role;
  const isSelf = session!.user!.id === id;
  const canManage = canManageTeam(actorRole);

  if (!isSelf && !canManage) {
    return jsonError("Droits insuffisants", 403);
  }

  try {
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || (!isSelf && !TEAM_ROLES.includes(target.role))) {
      return jsonError("Compte introuvable", 404);
    }

    const body = await req.json();
    const { firstName, lastName, phone, email, role, password } = body;

    const data: {
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      email?: string;
      role?: UserRole;
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
    if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;

    if (email !== undefined && (isSelf || canManage)) {
      const normalized = String(email).trim().toLowerCase();
      if (!normalized) return jsonError("L'email est requis");
      const existing = await prisma.user.findFirst({
        where: { email: normalized, NOT: { id } },
      });
      if (existing) return jsonError("Cet email est déjà utilisé", 409);
      data.email = normalized;
    }

    if (role !== undefined && canManage && !isSelf) {
      const allowed = rolesAssignableBy(actorRole);
      if (!allowed.includes(role as UserRole)) {
        return jsonError("Rôle non autorisé", 403);
      }
      data.role = role as UserRole;
    }

    if (password && canManage && !isSelf) {
      if (String(password).length < 8) {
        return jsonError("Le mot de passe doit contenir au moins 8 caractères");
      }
      data.passwordHash = await bcrypt.hash(String(password), 12);
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: teamSelect,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/admin/users/[id]]", err);
    return jsonError("Erreur lors de la mise à jour", 500);
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  if (!canManageTeam(session!.user!.role)) {
    return jsonError("Droits insuffisants", 403);
  }

  const { id } = await context.params;

  if (session!.user!.id === id) {
    return jsonError("Vous ne pouvez pas supprimer votre propre compte", 400);
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target || !TEAM_ROLES.includes(target.role)) {
    return jsonError("Compte introuvable", 404);
  }

  if (target.role === "SUPER_ADMIN") {
    const superAdmins = await prisma.user.count({ where: { role: "SUPER_ADMIN" } });
    if (superAdmins <= 1) {
      return jsonError("Impossible de supprimer le dernier super administrateur", 400);
    }
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
