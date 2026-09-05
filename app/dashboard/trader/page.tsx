"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  FileText,
  Package,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { getTraderProducts } from "@/services/productService";
import { useAuthStore } from "@/store/authStore";

const stats = [
  {
    title: "Total Products",
    value: "24",
    description: "Products in your catalog",
    icon: Package,
    trend: "+8.2%",
  },
  {
    title: "Active Leads",
    value: "18",
    description: "Leads currently in progress",
    icon: Users,
    trend: "+12.5%",
  },
  {
    title: "Quotes Created",
    value: "32",
    description: "Quotes generated this month",
    icon: FileText,
    trend: "+5.4%",
  },
  {
    title: "Conversion Rate",
    value: "68.4%",
    description: "Lead to accepted quote",
    icon: TrendingUp,
    trend: "+4.7%",
  },
];

const recentActivities = [
  {
    title: "New product added",
    description: "Industrial Water Pump",
    time: "10 minutes ago",
  },
  {
    title: "Lead status updated",
    description: "Acme Industries moved to Contacted",
    time: "45 minutes ago",
  },
  {
    title: "Quote created",
    description: "Quote #Q-1024 created successfully",
    time: "2 hours ago",
  },
  {
    title: "Product updated",
    description: "Solar Inverter pricing updated",
    time: "4 hours ago",
  },
];

export default function TraderDashboardPage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const user = useAuthStore((state) => state.user);

  const [isHydrated, setIsHydrated] = useState(false);

  /*
   * Authentication hydration
   */
  useEffect(() => {
    const unsubscribe =
      useAuthStore.persist.onFinishHydration(() => {
        setIsHydrated(true);
      });

    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsubscribe;
  }, []);

  /*
   * Authentication guard
   */
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "trader") {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  /*
   * Temporary Trader Products API test
   *
   * This is intentionally kept separate from the UI.
   * Once we confirm the real backend response structure,
   * we will build the complete Products module.
   */
  useEffect(() => {
    const testProductsApi = async () => {
      try {
        const products = await getTraderProducts();

        console.log(
          "TRADER PRODUCTS API RESPONSE:",
          products
        );
      } catch (error: any) {
        console.error(
          "TRADER PRODUCTS API ERROR:",
          error?.response?.data || error
        );
      }
    };

    if (
      isHydrated &&
      isAuthenticated &&
      user?.role === "trader"
    ) {
      testProductsApi();
    }
  }, [isHydrated, isAuthenticated, user]);

  /*
   * Authentication loading state
   */
  if (
    !isHydrated ||
    !isAuthenticated ||
    !user ||
    user.role !== "trader"
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm font-medium text-slate-600">
          Checking your account...
        </div>
      </main>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Overview
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, Trader
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Here's what's happening with your sales
              workspace today.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.title} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-light">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.trend}
                  </span>
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {stat.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Activity */}
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Latest updates across your workspace.
                </p>
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-primary hover:text-primary-dark"
              >
                View all
              </button>
            </div>

            <div className="mt-6 divide-y divide-border">
              {recentActivities.map((activity) => (
                <div
                  key={`${activity.title}-${activity.time}`}
                  className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {activity.title}
                      </p>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs text-slate-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Quick Actions
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Common tasks for your workspace.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {/* Manage Products */}
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-border bg-white p-3 text-left transition hover:border-primary hover:bg-primary-light"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                  <Package className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Manage Products
                  </p>

                  <p className="text-xs text-slate-500">
                    View and manage your catalog
                  </p>
                </div>
              </button>

              {/* View Leads */}
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-border bg-white p-3 text-left transition hover:border-primary hover:bg-primary-light"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                  <Users className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    View Leads
                  </p>

                  <p className="text-xs text-slate-500">
                    Track your active leads
                  </p>
                </div>
              </button>

              {/* Create Quote */}
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-border bg-white p-3 text-left transition hover:border-primary hover:bg-primary-light"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Create Quote
                  </p>

                  <p className="text-xs text-slate-500">
                    Generate a customer quotation
                  </p>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}