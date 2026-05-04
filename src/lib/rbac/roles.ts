export const roles = [
  "owner",
  "admin",
  "dispatcher",
  "technician",
  "finance",
  "customer",
] as const;

export type Role = (typeof roles)[number];

export const permissions = [
  "dashboard:read",
  "customers:manage",
  "jobs:manage",
  "dispatch:manage",
  "technician:work",
  "water_tests:manage",
  "quotes:manage",
  "invoices:manage",
  "reports:manage",
  "stock:manage",
  "settings:manage",
  "portal:read",
] as const;

export type Permission = (typeof permissions)[number];

export const rolePermissions: Record<Role, Permission[]> = {
  owner: [...permissions],
  admin: [...permissions],
  dispatcher: [
    "dashboard:read",
    "customers:manage",
    "jobs:manage",
    "dispatch:manage",
    "water_tests:manage",
    "quotes:manage",
    "reports:manage",
    "stock:manage",
  ],
  technician: [
    "dashboard:read",
    "technician:work",
    "jobs:manage",
    "water_tests:manage",
    "reports:manage",
    "stock:manage",
  ],
  finance: [
    "dashboard:read",
    "customers:manage",
    "quotes:manage",
    "invoices:manage",
    "reports:manage",
  ],
  customer: ["portal:read"],
};

export function hasPermission(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function hasAnyPermission(role: Role, requested: Permission[]) {
  return requested.some((permission) => hasPermission(role, permission));
}

export function isRole(value: string): value is Role {
  return roles.includes(value as Role);
}
