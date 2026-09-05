"use client";

import AppShell from "./AppShell";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "vendor" | "team" | "admin" | "trader";
}

export default function DashboardLayout({
  children,
  role = "trader",
}: DashboardLayoutProps) {
  return <AppShell role={role}>{children}</AppShell>;
}
