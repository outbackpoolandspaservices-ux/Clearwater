import { redirect } from "next/navigation";

import { getCurrentUser, isAuthEnforced } from "@/lib/auth/current-user";
import { hasAnyPermission, type Permission, type Role } from "@/lib/rbac/roles";

export async function requireRole(allowedRoles: Role[]) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(user.role)) {
    if (isAuthEnforced()) {
      redirect("/login?reason=forbidden");
    }

    console.warn("ClearWater demo auth bypass allowed role mismatch", {
      allowedRoles,
      currentRole: user.role,
    });
  }

  return user;
}

export async function requirePermission(requiredPermissions: Permission[]) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasAnyPermission(user.role, requiredPermissions)) {
    if (isAuthEnforced()) {
      redirect("/login?reason=forbidden");
    }

    console.warn("ClearWater demo auth bypass allowed permission mismatch", {
      currentRole: user.role,
      requiredPermissions,
    });
  }

  return user;
}
