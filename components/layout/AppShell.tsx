"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  UserRound,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useState } from "react";

import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

type Role = "vendor" | "team" | "admin" | "trader";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const configs: Record<Role, { title: string; subtitle: string; items: NavItem[] }> = {
  vendor: {
    title: "Vendor Workspace",
    subtitle: "Sales & Lead Management",
    items: [
      { label: "Dashboard", href: "/dashboard/vendor", icon: LayoutDashboard },
      { label: "Products", href: "/dashboard/vendor/products", icon: Package },
      { label: "Locked Products", href: "/dashboard/vendor/locked-products", icon: Package },
      { label: "Leads", href: "/dashboard/vendor/leads", icon: Users },
      { label: "Quotes", href: "/dashboard/vendor/quotes", icon: FileText },
      { label: "Team", href: "/dashboard/vendor/team", icon: UserRound },
      { label: "Profile", href: "/dashboard/vendor/profile", icon: Settings },
    ],
  },

  team: {
    title: "Team Workspace",
    subtitle: "Lead & Quote Management",
    items: [
      { label: "Dashboard", href: "/dashboard/team", icon: LayoutDashboard },
      { label: "Products", href: "/dashboard/vendor/locked-products", icon: Package },
      { label: "Leads", href: "/dashboard/team/leads", icon: Users },
      { label: "Quotes", href: "/dashboard/team/quotes", icon: FileText },
    ],
  },

  admin: {
    title: "Admin Console",
    subtitle: "Platform Administration",
    items: [
      { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
      { label: "Users", href: "/dashboard/admin/users", icon: Users },
      { label: "Leads", href: "/dashboard/admin/leads", icon: FileText },
    ],
  },

  trader: {
    title: "Trader Workspace",
    subtitle: "Product Management",
    items: [
      { label: "Dashboard", href: "/dashboard/trader", icon: LayoutDashboard },
      { label: "Products", href: "/dashboard/trader/products", icon: Package },
    ],
  },
};

function getRoleConfig(role: string) {
  if (role === "team-member") return configs.team;
  return configs[role as Role] ?? configs.vendor;
}

function getInitials(email: string) {
  const value = email.split("@")[0] || "U";
  return value.slice(0, 2).toUpperCase();
}

export default function AppShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const logout = useAuthStore((state) => state.logout);

  const config = getRoleConfig(role);
  const email = user?.email ?? "user@leadms.com";
  const initials = getInitials(email);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch {
      // Local logout still happens if API logout fails.
    } finally {
      logout();
      setOpen(false);
      router.replace("/login");
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-slate-200 bg-white shadow-xl shadow-slate-200/20 transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white shadow-sm shadow-blue-600/20">
              L
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                LeadMS
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                CRM Platform
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace */}
        <div className="border-b border-slate-100 px-4 py-5">
          <p className="px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>

          <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
                {config.title.charAt(0)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {config.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {config.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Main Menu
          </p>

          <div className="space-y-1">
            {config.items.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== `/dashboard/${role}` &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 ${
                      active
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />

                  <span>{item.label}</span>

                  {active && (
                    <ChevronRight className="ml-auto h-4 w-4 text-blue-500" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User + logout */}
        <div className="border-t border-slate-100 p-4">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800">
                {email}
              </p>
              <p className="mt-0.5 text-[11px] capitalize text-slate-400">
                {role.replace("-", " ")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-[270px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 shadow-sm shadow-slate-200/20 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="hidden text-xs font-medium text-slate-400 sm:block">
                {config.title}
              </p>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {config.items.find(
                  (item) =>
                    pathname === item.href ||
                    (item.href !== config.items[0]?.href &&
                      pathname.startsWith(item.href))
                )?.label ?? "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Bell className="h-[19px] w-[19px]" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            {/* User */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {initials}
              </div>

              <div className="hidden max-w-[180px] md:block">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {email}
                </p>
                <p className="text-xs capitalize text-slate-400">
                  {role.replace("-", " ")}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
