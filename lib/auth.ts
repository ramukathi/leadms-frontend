import type { UserRole } from "@/store/authStore";

export const roleDashboardPaths: Record<UserRole, string> = {
  trader: "/dashboard/trader",
  vendor: "/dashboard/vendor",
  team_member: "/dashboard/team-member",
  admin: "/dashboard/admin",
};

export function getDashboardPath(role: UserRole): string {
  return roleDashboardPaths[role];
}

export function isValidUserRole(role: unknown): role is UserRole {
  return (
    role === "trader" ||
    role === "vendor" ||
    role === "team_member" ||
    role === "admin"
  );
}