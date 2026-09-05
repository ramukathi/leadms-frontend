"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Users,
  UserPlus,
  Mail,
  Phone,
  CalendarDays,
  MoreHorizontal,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import api from "@/services/api";

interface Lead {
  _id?: string;
  id?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  status?: string;
  assignedTo?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | string;
  createdAt?: string;
  updatedAt?: string;
}

const statusStyles: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-amber-50 text-amber-700 border-amber-100",
  quoted: "bg-violet-50 text-violet-700 border-violet-100",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
};

function formatStatus(status?: string) {
  if (!status) return "New";

  return status
    .replace("-", " ")
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TeamLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadLeads = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/leads");

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setLeads(data);
    } catch (error: any) {
      console.error("TEAM LEADS ERROR:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to load your leads right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return leads;

    return leads.filter((lead) =>
      [
        lead.customerName,
        lead.customerEmail,
        lead.customerPhone,
        lead.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [leads, search]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      contacted: leads.filter(
        (lead) => lead.status === "contacted"
      ).length,
      quoted: leads.filter(
        (lead) => lead.status === "quoted"
      ).length,
    };
  }, [leads]);

  const resetForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setErrorMessage("");
  };

  const handleCreateLead = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!customerName.trim()) {
      setErrorMessage("Customer name is required.");
      return;
    }

    try {
      setCreating(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await api.post("/leads", {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
      });

      const createdLead = response.data;

      if (createdLead) {
        setLeads((current) => [createdLead, ...current]);
      } else {
        await loadLeads();
      }

      setSuccessMessage("Lead created successfully.");
      setShowModal(false);
      resetForm();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3500);
    } catch (error: any) {
      console.error("CREATE TEAM LEAD ERROR:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to create the lead. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppShell role="team">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Lead Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              My Leads
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, track and manage the leads assigned to you.
            </p>
          </div>

          <Button
            onClick={() => {
              setErrorMessage("");
              setShowModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Lead
          </Button>
        </div>

        {/* Success */}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Leads</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>

              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">New</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.new}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <UserPlus className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Contacted</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.contacted}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Phone className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Quoted</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.quoted}
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main table */}
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Lead Pipeline
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest customer opportunities.
                </p>
              </div>

              <div className="relative w-full lg:w-80">
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
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : errorMessage && leads.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="rounded-full bg-red-50 p-3 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                Unable to load leads
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                {errorMessage}
              </p>

              <Button
                className="mt-4"
                variant="outline"
                onClick={loadLeads}
              >
                Try Again
              </Button>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="rounded-full bg-slate-100 p-4 text-slate-500">
                <Users className="h-7 w-7" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                {search ? "No leads found" : "No leads yet"}
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                {search
                  ? "Try a different search term."
                  : "Create your first lead to start building your pipeline."}
              </p>

              {!search && (
                <Button
                  className="mt-4"
                  onClick={() => setShowModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Lead
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border bg-slate-50/70 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead) => {
                    const leadId = lead._id ?? lead.id ?? "";

                    const status =
                      lead.status?.toLowerCase() || "new";

                    return (
                      <tr
                        key={leadId || lead.customerName}
                        className="border-b border-border last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                              {lead.customerName
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {lead.customerName}
                              </p>

                              <p className="text-xs text-slate-500">
                                Lead #{leadId.slice(-6) || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            {lead.customerEmail && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                {lead.customerEmail}
                              </div>
                            )}

                            {lead.customerPhone && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                {lead.customerPhone}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                              statusStyles[status] ||
                              "border-slate-200 bg-slate-50 text-slate-600"
                            }`}
                          >
                            {formatStatus(status)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            {formatDate(lead.createdAt)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            title="More actions"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Create Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Create New Lead
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a customer opportunity to your pipeline.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateLead}
              className="space-y-5 p-6"
            >
              {errorMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Customer Name
                </label>

                <Input
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <Input
                  type="email"
                  value={customerEmail}
                  onChange={(event) =>
                    setCustomerEmail(event.target.value)
                  }
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <Input
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(event.target.value)
                  }
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Lead
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
