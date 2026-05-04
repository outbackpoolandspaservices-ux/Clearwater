import type { Permission, Role } from "@/lib/rbac/roles";
import { hasAnyPermission } from "@/lib/rbac/roles";

export const routeGroups = {
  app: {
    prefix: "/",
    description: "Staff/admin application routes.",
    allowedRoles: ["owner", "admin", "dispatcher", "technician", "finance"] as Role[],
    permissions: ["dashboard:read"] as Permission[],
  },
  technician: {
    prefix: "/technician",
    description: "Mobile technician run sheet and job workflow routes.",
    allowedRoles: ["owner", "admin", "dispatcher", "technician"] as Role[],
    permissions: ["technician:work"] as Permission[],
  },
  portal: {
    prefix: "/portal",
    description: "Customer portal routes.",
    allowedRoles: ["owner", "admin", "customer"] as Role[],
    permissions: ["portal:read"] as Permission[],
  },
};

export type RouteGroupKey = keyof typeof routeGroups;

export function canAccessRouteGroup(role: Role, routeGroup: RouteGroupKey) {
  const group = routeGroups[routeGroup];

  return group.allowedRoles.includes(role) && hasAnyPermission(role, group.permissions);
}

export function getRouteGroupForPath(pathname: string): RouteGroupKey {
  if (pathname.startsWith(routeGroups.portal.prefix)) return "portal";
  if (pathname.startsWith(routeGroups.technician.prefix)) return "technician";

  return "app";
}
