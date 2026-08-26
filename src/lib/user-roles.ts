import type { UserRole } from "@prisma/client";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  CLIENT: "Client",
  ADMIN: "Administrateur",
  SUPER_ADMIN: "Super administrateur",
  MANAGER_SHOP: "Gestionnaire boutique",
  MANAGER_ORDERS: "Gestionnaire commandes",
  ACCOUNTING: "Comptabilité",
};

export const USER_ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  CLIENT: "Accès à l'espace client et au parcours de coaching.",
  SUPER_ADMIN: "Accès total, gestion de l'équipe et des paramètres.",
  ADMIN: "Accès complet au back-office et gestion de l'équipe.",
  MANAGER_SHOP: "Gestion du catalogue boutique et des produits.",
  MANAGER_ORDERS: "Gestion des commandes, clients et rendez-vous.",
  ACCOUNTING: "Consultation des paiements et transactions.",
};

/** Rôles assignables à un membre de l'équipe (hors clients). */
export const TEAM_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER_SHOP",
  "MANAGER_ORDERS",
  "ACCOUNTING",
];

export function formatRole(role: UserRole | string): string {
  return USER_ROLE_LABELS[role as UserRole] ?? role.replace(/_/g, " ").toLowerCase();
}

export function rolesAssignableBy(actorRole?: string): UserRole[] {
  if (actorRole === "SUPER_ADMIN") return [...TEAM_ROLES];
  if (actorRole === "ADMIN") return TEAM_ROLES.filter((r) => r !== "SUPER_ADMIN");
  return [];
}

export function canManageTeam(role?: string): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}
