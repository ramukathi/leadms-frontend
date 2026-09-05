"use client";

import {
  CheckCircle2,
  Clock3,
  FileText,
  MoreHorizontal,
  Search,
  UserPlus,
  Users,
} from "lucide-react";

import { useMemo, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

const leads = [
  ["LD-1048", "Rajesh Enterprises", "GreenTech Solutions", "Arjun Reddy", "New", "₹2,48,000", "05 Sep 2026"],
  ["LD-1047", "Srinivas Industries", "SolarPro India", "Priya Sharma", "Contacted", "₹4,82,500", "05 Sep 2026"],
  ["LD-1046", "Metro Engineering", "PowerTech", "Rahul Kumar", "Quoted", "₹6,25,000", "04 Sep 2026"],
  ["LD-1045", "Green Valley Farms", "EnergyHub", "Vikram Singh", "Accepted", "₹3,18,500", "04 Sep 2026"],
  ["LD-1044", "ABC Manufacturing", "GreenTech Solutions", "Ananya Rao", "Rejected", "₹1,84,000", "03 Sep 2026"],
];

const statusStyles: Record<string, string> = {
  New: "bg-blue-50 text-blue-700",
  Contacted: "bg-amber-50 text-amber-700",
  Quoted: "bg-violet-50 text-violet-700",
  Accepted: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};

export default function AdminLeadsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead[1].toLowerCase().includes(search.toLowerCase()) ||
        lead[2].toLowerCase().includes(search.toLowerCase()) ||
        lead[0].toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All Statuses" || lead[4] === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <AppShell role="admin">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-primary">
            Lead Operations
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Lead Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor and manage leads across the entire platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Total", "2,846", Users],
            ["New", "728", UserPlus],
            ["Contacted", "612", Clock3],
            ["Quoted", "486", FileText],
            ["Accepted", "312", CheckCircle2],
          ].map(([label, value, Icon]) => {
            const IconComponent = Icon as typeof Users;

            return (
              <Card key={label as string} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      {label as string}
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {value as string}
                    </p>
                  </div>

                  <IconComponent className="h-5 w-5 text-primary" />
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="overflow-hidden p-0">
          <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                All Leads
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Platform-wide lead pipeline.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search leads..."
                  className="pl-9"
                />
              </div>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary"
              >
                <option>All Statuses</option>
                <option>New</option>
                <option>Contacted</option>
                <option>Quoted</option>
                <option>Accepted</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-border bg-slate-50/70 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Lead
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vendor
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Assigned To
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Value
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead[0]}
                    className="border-b border-border last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {lead[1]}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {lead[0]}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {lead[2]}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {lead[3]}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[lead[4]]}`}
                      >
                        {lead[4]}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                      {lead[5]}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {lead[6]}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="py-16 text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 font-medium text-slate-700">
                No leads found
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
