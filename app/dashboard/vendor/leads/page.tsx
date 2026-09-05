"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Mail,
  Phone,
  Plus,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import api from "@/services/api";

interface Lead {
  _id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  status?: "new" | "contacted" | "quoted" | "accepted" | "rejected";
  assignedTo?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  createdAt?: string;
}

interface TeamMember {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  designation?: string;
}

const statusStyles: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  quoted: "bg-violet-50 text-violet-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

const fallbackLeads: Lead[] = [
  {
    _id: "demo-1",
    customerName: "Rahul Mehta",
    customerEmail: "rahul@example.com",
    customerPhone: "+91 98765 43210",
    status: "new",
    assignedTo: null,
  },
  {
    _id: "demo-2",
    customerName: "Ananya Kapoor",
    customerEmail: "ananya@example.com",
    customerPhone: "+91 91234 56789",
    status: "contacted",
    assignedTo: null,
  },
  {
    _id: "demo-3",
    customerName: "Vivek Sharma",
    customerEmail: "vivek@example.com",
    customerPhone: "+91 99887 66554",
    status: "quoted",
    assignedTo: null,
  },
];

export default function VendorLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);

  const [showCreate, setShowCreate] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadLeads = async () => {
    try {
      setLoading(true);

      const response = await api.get<Lead[]>("/leads");

      const data = Array.isArray(response.data) ? response.data : [];

      setLeads(data);
      setApiAvailable(true);
    } catch {
      // Keep the polished UI usable if the API is unavailable.
      setLeads(fallbackLeads);
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();

    api
      .get("/users")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTeamMembers(response.data);
        }
      })
      .catch(() => {
        // Team endpoint is not available in the supplied API.
        setTeamMembers([]);
      });
  }, []);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return leads;

    return leads.filter((lead) =>
      [
        lead.customerName,
        lead.customerEmail,
        lead.customerPhone,
        lead.status,
        lead.assignedTo?.firstName,
        lead.assignedTo?.lastName,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [leads, search]);

  const stats = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      quoted: leads.filter((lead) => lead.status === "quoted").length,
      accepted: leads.filter((lead) => lead.status === "accepted").length,
    }),
    [leads]
  );

  const handleCreateLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!customerName.trim()) {
      setError("Please enter the customer name.");
      return;
    }

    if (!customerEmail.trim()) {
      setError("Please enter the customer email.");
      return;
    }

    if (!customerPhone.trim()) {
      setError("Please enter the customer phone.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post<Lead>("/leads", {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        ...(assignedTo ? { assignedTo } : {}),
      });

      setLeads((current) => [response.data, ...current]);

      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setAssignedTo("");

      setMessage("Lead created successfully.");

      setTimeout(() => {
        setShowCreate(false);
        setMessage("");
      }, 1200);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to create lead. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAssign = async (leadId: string, memberId: string) => {
    if (leadId.startsWith("demo-")) {
      setMessage("Demo lead updated locally.");
      return;
    }

    try {
      setAssigning(leadId);
      setError("");

      const response = await api.put(`/leads/${leadId}/assign`, {
        assignedTo: memberId,
      });

      setLeads((current) =>
        current.map((lead) =>
          lead._id === leadId ? response.data : lead
        )
      );

      setMessage("Lead assigned successfully.");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to assign this lead."
      );
    } finally {
      setAssigning(null);
    }
  };

  const closeCreate = () => {
    if (saving) return;

    setShowCreate(false);
    setError("");
    setMessage("");
  };

  return (
    <AppShell role="vendor">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold text-primary">Sales</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Leads
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track customers, assignments and sales opportunities.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowCreate(true);
              setError("");
              setMessage("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Create Lead
          </button>
        </div>

        {/* API notice */}
        {!apiAvailable && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Showing demo lead data because the backend is currently unavailable.
          </div>
        )}

        {/* Messages */}
        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            {message}
          </div>
        )}

        {error && !showCreate && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total Leads", stats.total, Users],
            ["New", stats.new, Plus],
            ["Quoted", stats.quoted, Clock3],
            ["Accepted", stats.accepted, CheckCircle2],
          ].map(([label, value, Icon]: any) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads by customer, email or status..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Lead table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-semibold text-slate-900">
              Lead pipeline
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Manage customer opportunities through the sales lifecycle.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center px-6 py-16">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
                Loading leads...
              </div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 font-semibold text-slate-800">
                No leads found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Create your first lead to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Assigned To</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {lead.customerName}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {lead.createdAt
                            ? new Date(lead.createdAt).toLocaleDateString()
                            : "Recent"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1 text-xs text-slate-500">
                          {lead.customerEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5" />
                              {lead.customerEmail}
                            </div>
                          )}
                          {lead.customerPhone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5" />
                              {lead.customerPhone}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[lead.status || "new"] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {(lead.status || "new").replace(
                            /^./,
                            (char) => char.toUpperCase()
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {lead.assignedTo ? (
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {[
                                lead.assignedTo.firstName,
                                lead.assignedTo.lastName,
                              ]
                                .filter(Boolean)
                                .join(" ") ||
                                lead.assignedTo.email ||
                                "Team member"}
                            </p>
                            <p className="text-xs text-slate-400">
                              Assigned
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {teamMembers.length > 0 && !lead._id.startsWith("demo-") ? (
                          <div className="relative inline-flex">
                            <select
                              defaultValue=""
                              disabled={assigning === lead._id}
                              onChange={(event) => {
                                if (event.target.value) {
                                  handleAssign(
                                    lead._id,
                                    event.target.value
                                  );
                                }
                              }}
                              className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-600 outline-none focus:border-primary"
                            >
                              <option value="">Assign</option>
                              {teamMembers.map((member) => (
                                <option
                                  key={member._id}
                                  value={member._id}
                                >
                                  {[
                                    member.firstName,
                                    member.lastName,
                                  ]
                                    .filter(Boolean)
                                    .join(" ") ||
                                    member.email}
                                </option>
                              ))}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {lead._id.startsWith("demo-")
                              ? "Demo"
                              : "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Lead Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserPlus className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Create new lead
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a customer opportunity to your pipeline.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreate}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-5 p-6">

              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Customer name
                </label>

                <input
                  id="customerName"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Rahul Mehta"
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div>
                <label
                  htmlFor="customerEmail"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder="rahul@example.com"
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone number
                </label>

                <input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="+91 98765 43210"
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
              </div>

              {teamMembers.length > 0 && (
                <div>
                  <label
                    htmlFor="assignedTo"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Assign to team member
                    <span className="ml-2 font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <select
                    id="assignedTo"
                    value={assignedTo}
                    onChange={(event) => setAssignedTo(event.target.value)}
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="">Leave unassigned</option>
                    {teamMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {[
                          member.firstName,
                          member.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ") || member.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeCreate}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Lead
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
