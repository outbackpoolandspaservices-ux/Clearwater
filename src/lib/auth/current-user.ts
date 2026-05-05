import { auth } from "@/auth";
import { isRole, type Role } from "@/lib/rbac/roles";

export type ClearWaterUser = {
  email: string;
  id: string;
  name: string;
  role: Role;
  source: "auth" | "demo";
};

function getDemoRole(): Role {
  const configuredRole = process.env.CLEARWATER_DEMO_ROLE ?? "owner";

  return isRole(configuredRole) ? configuredRole : "owner";
}

export function isAuthEnforced() {
  return process.env.CLEARWATER_ENFORCE_AUTH === "true";
}

export async function getCurrentUser(): Promise<ClearWaterUser | null> {
  try {
    const session = await auth();

    if (session?.user?.id) {
      return {
        email: session.user.email ?? "user@clearwater.local",
        id: session.user.id,
        name: session.user.name ?? "ClearWater user",
        role: getDemoRole(),
        source: "auth",
      };
    }
  } catch (error) {
    console.error("ClearWater auth session lookup failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage:
        error instanceof Error ? error.message : "Unknown auth lookup error.",
    });
  }

  if (isAuthEnforced()) {
    return null;
  }

  return {
    email: "demo@clearwater.local",
    id: "demo-user",
    name: "ClearWater Demo User",
    role: getDemoRole(),
    source: "demo",
  };
}
