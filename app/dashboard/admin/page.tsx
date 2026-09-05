"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  DollarSign,
  Download,
  FileText,
  MoreHorizontal,
  TrendingUp,
  Users,
  UserPlus,
  XCircle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const stats = [
  {
    label: "Total Users",
    value: "1,248",
    change: "+12.5%",
    positive: true,
    icon: Users,
  },
  {
    label: "Active Leads",
    value: "384",
    change: "+8.2%",
    positive: true,
    icon: FileText,
  },
  {
    label: "Quotes Generated",
    value: "726",
    change: "+18.7%",
    positive: true,
    icon: BarChart3,
  },
  {
    label: "Revenue",
    value: "₹48.6L",
    change: "+14.3%",
    positive: true,
    icon: DollarSign,
  },
];

const leadStatuses = [
  {
    label: "New",
    count: 128,
    percentage: 33,
    icon: UserPlus,
  },
  {
    label: "Contacted",
    count: 96,
    percentage: 25,
    icon: Clock3,
  },
  {
    label: "Quoted",
    count: 82,
    percentage: 21,
    icon: FileText,
  },
  {
    label: "Accepted",
    count: 54,
    percentage: 14,
    icon: CheckCircle2,
  },
  {
    label: "Rejected",
    count: 24,
    percentage: 7,
    icon: XCircle,
  },
];

const activities = [
  {
    title: "New vendor registered",
    description: "GreenTech Solutions joined the platform",
    time: "12 minutes ago",
    icon: UserPlus,
  },
  {
    title: "Quote accepted",
    description: "Rajesh Enterprises accepted quote #QT-1048",
    time: "34 minutes ago",
    icon: CheckCircle2,
  },
  {
    title: "New lead created",
    description: "Srinivas Industries added a new opportunity",
    time: "1 hour ago",
    icon: FileText,
  },
  {
    title: "Vendor profile updated",
    description: "SolarPro India updated pricing configuration",
    time: "2 hours ago",
    icon: Activity,
  },
  {
    title: "New team member invited",
    description: "An invitation was sent to sales@example.com",
    time: "3 hours ago",
    icon: UserPlus,
  },
];

const monthlyData = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 55 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 67 },
  { month: "May", value: 72 },
  { month: "Jun", value: 84 },
  { month: "Jul", value: 78 },
  { month: "Aug", value: 94 },
];

export default function AdminDashboardPage() {
  return (
    <AppShell role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Platform Overview
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor users, leads, quotes and platform performance.
            </p>
          </div>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.label} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {stat.change}
                      <span className="font-normal text-slate-400">
                        vs last month
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Platform Growth
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monthly platform activity
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                +14.3%
              </div>
            </div>

            <div className="mt-8 flex h-64 items-end gap-3">
              {monthlyData.map((item) => (
                <div
                  key={item.month}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-52 w-full items-end">
                    <div
                      className="w-full rounded-t-lg bg-primary transition-all hover:opacity-80"
                      style={{
                        height: `${item.value}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs text-slate-400">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div>
              <h2 className="font-semibold text-slate-900">
                Lead Pipeline
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current lead distribution
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {leadStatuses.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-slate-900">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Bottom section */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest platform events
                </p>
              </div>

              <button className="text-sm font-medium text-primary hover:underline">
                View all
              </button>
            </div>

            <div>
              {activities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={activity.title}
                    className={`flex items-center gap-4 px-5 py-4 ${
                      index !== activities.length - 1
                        ? "border-b border-border"
                        : ""
                    }`}
                  >
                    <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {activity.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {activity.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-slate-400">
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Platform Health
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  System status
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Healthy
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ["API Services", "99.98%"],
                ["Database", "99.99%"],
                ["Authentication", "100%"],
                ["Quote Engine", "99.97%"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                >
                  <span className="text-sm text-slate-600">
                    {label}
                  </span>

                  <span className="text-sm font-semibold text-emerald-600">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-border p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Platform is performing well
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    All core services are operational.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
