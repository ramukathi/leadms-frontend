"use client";

import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const stats = [
  ["Total Users", "1,248", "+12.5%", Users],
  ["Total Leads", "2,846", "+18.2%", FileText],
  ["Conversion Rate", "24.8%", "+3.4%", TrendingUp],
  ["Quotes Accepted", "486", "+16.8%", CheckCircle2],
];

const revenue = [
  ["Jan", 42],
  ["Feb", 51],
  ["Mar", 48],
  ["Apr", 64],
  ["May", 71],
  ["Jun", 78],
  ["Jul", 86],
  ["Aug", 94],
];

const roles = [
  ["Vendors", 486, 39],
  ["Team Members", 512, 41],
  ["Traders", 250, 20],
];

export default function AnalyticsPage() {
  return (
    <AppShell role="admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Platform Intelligence
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Understand platform growth, users and sales performance.
            </p>
          </div>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Analytics
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, change, Icon]) => {
            const IconComponent = Icon as typeof Users;

            return (
              <Card key={label as string} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {label as string}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {value as string}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {change as string}
                      <span className="font-normal text-slate-400">
                        vs previous period
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Revenue Growth
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Monthly revenue performance
                </p>
              </div>

              <select className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-600 outline-none">
                <option>Last 8 months</option>
                <option>Last 12 months</option>
                <option>This year</option>
              </select>
            </div>

            <div className="mt-8 flex h-72 items-end gap-3">
              {revenue.map(([month, value]) => (
                <div
                  key={month as string}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-[11px] font-medium text-slate-400">
                    ₹{value}L
                  </span>

                  <div className="flex h-56 w-full items-end">
                    <div
                      className="w-full rounded-t-lg bg-primary"
                      style={{ height: `${value}%` }}
                    />
                  </div>

                  <span className="text-xs text-slate-400">
                    {month as string}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-slate-900">
              Users by Role
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Platform user distribution
            </p>

            <div className="mt-7 space-y-6">
              {roles.map(([label, count, percentage]) => (
                <div key={label as string}>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {label as string}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {count as number}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    {percentage}% of all users
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border p-5">
            <h2 className="font-semibold text-slate-900">
              Conversion Performance
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Key platform funnel metrics
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Leads Created", "2,846", "+18.2%"],
              ["Leads Contacted", "2,102", "+14.6%"],
              ["Quotes Generated", "1,426", "+21.3%"],
              ["Quotes Accepted", "486", "+16.8%"],
            ].map(([label, value, change]) => (
              <div
                key={label}
                className="border-b border-border p-5 last:border-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-bold text-slate-900">
                  {value}
                </p>
                <p className="mt-2 text-xs font-semibold text-emerald-600">
                  {change}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
