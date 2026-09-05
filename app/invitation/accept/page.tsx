"use client";

import Link from "next/link";
import { CheckCircle2, Mail, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";

export default function AcceptInvitation() {
  const [accepted, setAccepted] = useState(false);

  if (accepted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Invitation accepted!
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your Team Member account is ready. Sign in to access your workspace.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
          L
        </div>

        <p className="mt-7 text-sm font-medium text-blue-600">Team Invitation</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Join Acme Corporation
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          You&apos;ve been invited to join the LeadMS sales workspace as a Team Member.
        </p>

        <div className="mt-7 space-y-3">
          {[
            [Mail, "priya@example.com"],
            [UserRound, "Team Member"],
            [LockKeyhole, "Secure workspace access"],
          ].map(([Icon, text]: any) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600"
            >
              <Icon size={17} className="text-blue-600" />
              {text}
            </div>
          ))}
        </div>

        <button
          onClick={() => setAccepted(true)}
          className="mt-7 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Accept Invitation
        </button>

        <p className="mt-5 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
