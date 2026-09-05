import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  ArrowUpRight,
  Users,
  Package,
  FileText,
  TrendingUp,
  Plus,
  Clock3,
  CheckCircle2,
} from "lucide-react";

const stats = [
  ["Active Leads", "128", "+18.4%", Users],
  ["Locked Products", "24", "+6.2%", Package],
  ["Quotes Sent", "67", "+12.8%", FileText],
  ["Conversion Rate", "68.4%", "+4.6%", TrendingUp],
];

const activities = [
  ["New lead created", "Acme Industries", "2 min ago"],
  ["Product locked", "Industrial Pump X200", "18 min ago"],
  ["Quote accepted", "Global Engineering", "42 min ago"],
  ["Team member joined", "Priya Sharma", "1 hr ago"],
];

export default function VendorDashboard() {
  return (
    <AppShell role="vendor">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">Monday, September 5</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Good afternoon, Ramu ??
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Here&apos;s what&apos;s happening with your business today.
            </p>
          </div>
          <Link
            href="/dashboard/vendor/leads"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={17} /> Create Lead
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, change, Icon]: any) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={19} />
                </div>
                <span className="text-xs font-semibold text-emerald-600">{change}</span>
              </div>
              <p className="mt-5 text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Lead performance</h2>
                <p className="mt-1 text-xs text-slate-400">Last 30 days</p>
              </div>
              <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                Monthly
              </span>
            </div>
            <div className="mt-8 flex h-52 items-end gap-2 sm:gap-4">
              {[42, 55, 48, 68, 61, 76, 70, 86, 73, 92, 84, 98].map((height, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-blue-500/80 transition hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-slate-400">W{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-4 space-y-2">
              {[
                ["Create new lead", "/dashboard/vendor/leads", Plus],
                ["Browse products", "/dashboard/vendor/products", Package],
                ["View quotes", "/dashboard/vendor/quotes", FileText],
                ["Manage team", "/dashboard/vendor/team", Users],
              ].map(([label, href, Icon]: any) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm font-medium text-slate-700 hover:border-blue-100 hover:bg-blue-50"
                >
                  <Icon size={17} className="text-blue-600" />
                  {label}
                  <ArrowUpRight size={15} className="ml-auto text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-semibold text-slate-900">Recent activity</h2>
              <p className="mt-1 text-xs text-slate-400">Latest updates across your workspace</p>
            </div>
            <Link href="/dashboard/vendor/leads" className="text-sm font-semibold text-blue-600">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {activities.map(([title, name, time]) => (
              <div key={title} className="flex items-center gap-4 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{title}</p>
                  <p className="truncate text-xs text-slate-400">{name}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock3 size={13} /> {time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
