"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import api from "@/services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSuccess(
        "If an account exists with this email, password reset instructions have been sent."
      );

      setEmail("");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to process your request. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <section className="hidden bg-primary p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight"
            >
              LeadMS
            </Link>

            <div className="mt-32 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                Account Recovery
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Get back into your LeadMS account.
              </h1>

              <p className="mt-6 text-lg leading-8 text-blue-100">
                Enter your registered email address and we'll help you reset
                your password securely.
              </p>
            </div>
          </div>

          <p className="text-sm text-blue-100">
            © 2026 LeadMS. All rights reserved.
          </p>
        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-10 block text-2xl font-bold tracking-tight text-primary lg:hidden"
            >
              LeadMS
            </Link>

            {/* Heading */}
            <div>
              <p className="text-sm font-semibold text-primary">
                Password recovery
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Forgot your password?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Enter the email address associated with your account. We'll
                send you instructions to reset your password.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleForgotPassword}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Sending Instructions..."
                  : "Send Reset Instructions"}
              </button>
            </form>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-slate-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary-dark"
              >
                Sign in
              </Link>
            </p>

            {/* Back */}
            <Link
              href="/"
              className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}