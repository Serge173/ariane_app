export function isAdmin(role?: string): boolean {
  return ["ADMIN", "SUPER_ADMIN", "MANAGER_SHOP", "MANAGER_ORDERS", "ACCOUNTING"].includes(
    role ?? ""
  );
}

export function isClient(role?: string): boolean {
  return role === "CLIENT";
}

export function isSuperAdmin(role?: string): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}
