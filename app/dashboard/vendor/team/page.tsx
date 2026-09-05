"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  Mail,
  MoreHorizontal,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import api from "@/services/api";

const initialMembers = [
  ["Priya Sharma", "Sales Manager", "Active", "PS"],
  ["Arjun Reddy", "Sales Executive", "Active", "AR"],
  ["Sneha Rao", "Sales Executive", "Pending", "SR"],
  ["Vikram Kumar", "Account Manager", "Active", "VK"],
];

export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter the team member's email.");
      return;
    }

    if (!designation.trim()) {
      setError("Please enter a designation.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/invite", {
        email: email.trim(),
        designation: designation.trim(),
      });

      const initials = email
        .trim()
        .split("@")[0]
        .split(/[.\s_-]+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      setMembers((current) => [
        [
          email.trim().split("@")[0],
          designation.trim(),
          "Pending",
          initials || "TM",
        ],
        ...current,
      ]);

      setMessage("Invitation sent successfully.");
      setEmail("");
      setDesignation("");

      setTimeout(() => {
        setShowInvite(false);
        setMessage("");
      }, 1200);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to send invitation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (loading) return;

    setShowInvite(false);
    setEmail("");
    setDesignation("");
    setError("");
    setMessage("");
  };

  return (
    <AppShell role="vendor">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-primary">Workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Team Members
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your sales team and permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowInvite(true);
              setError("");
              setMessage("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md"
          >
            <UserPlus size={17} />
            Invite Member
          </button>
        </div>

        {/* Success message */}
        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Total Members", "24", Users],
            ["Active", "21", ShieldCheck],
            ["Pending Invites", "3", UserPlus],
          ].map(([label, value, Icon]: any) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Icon size={19} className="text-primary" />
              <p className="mt-4 text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Directory */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-semibold text-slate-900">Team directory</h2>
            <p className="mt-1 text-xs text-slate-400">
              Your sales team and invitation status
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {members.map(([name, role, status, initials]) => (
              <div
                key={`${name}-${role}`}
                className="flex items-center gap-4 p-5 transition hover:bg-slate-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {role}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {status}
                </span>

                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={`More options for ${name}`}
                >
                  <MoreHorizontal size={19} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserPlus className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Invite team member
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Send an invitation to join your sales team.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6">
              <div className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="invite-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="invite-email"
                      type="email"
                      placeholder="member@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Designation */}
                <div>
                  <label
                    htmlFor="designation"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Designation
                  </label>

                  <input
                    id="designation"
                    type="text"
                    placeholder="Sales Executive"
                    value={designation}
                    onChange={(event) => setDesignation(event.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    {message}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={loading}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Send invitation
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
