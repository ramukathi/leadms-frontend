"use client";

import {
  MoreHorizontal,
  Search,
  UserPlus,
  Users,
} from "lucide-react";

import { useMemo, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

const users = [
  ["Rajesh Kumar", "rajesh@greentech.com", "Vendor", "Active", "28 Aug 2026"],
  ["Priya Sharma", "priya@solarpro.com", "Vendor", "Active", "26 Aug 2026"],
  ["Arjun Reddy", "arjun@energyhub.com", "Team Member", "Active", "24 Aug 2026"],
  ["Suresh Patel", "suresh@powertech.com", "Trader", "Active", "22 Aug 2026"],
  ["Ananya Rao", "ananya@renewcorp.com", "Team Member", "Pending", "20 Aug 2026"],
  ["Vikram Singh", "vikram@sunpower.com", "Vendor", "Active", "18 Aug 2026"],
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All Roles");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user[0].toLowerCase().includes(search.toLowerCase()) ||
        user[1].toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        role === "All Roles" || user[2] === role;

      return matchesSearch && matchesRole;
    });
  }, [search, role]);

  return (
    <AppShell role="admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Platform Administration
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Users
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage vendors, traders and team members.
            </p>
          </div>

          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              1,248
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Active Users</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              1,186
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">
              62
            </p>
          </Card>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                User Directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search and filter platform users.
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
                  placeholder="Search users..."
                  className="pl-9"
                />
              </div>

              <select
                value={role}
                onChange={(event) =>
                  setRole(event.target.value)
                }
                className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary"
              >
                <option>All Roles</option>
                <option>Vendor</option>
                <option>Trader</option>
                <option>Team Member</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-border bg-slate-50/70 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    User
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Joined
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user[1]}
                    className="border-b border-border last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {user[0].charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {user[0]}
                          </p>
                          <p className="text-xs text-slate-500">
                            {user[1]}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {user[2]}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user[3] === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {user[3]}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {user[4]}
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

          {filteredUsers.length === 0 && (
            <div className="py-16 text-center">
              <Users className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 font-medium text-slate-700">
                No users found
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
