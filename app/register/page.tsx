"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  LockKeyhole,
  User,
} from "lucide-react";
import api from "@/services/api";

export default function RegisterPage() {
      const [role, setRole] = useState<"trader" | "vendor">("trader");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

    const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      setSuccess(
        "Account created successfully. Please check your email for verification."
      );

      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to create your account. Please try again.";

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

            <div className="mt-28 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                Get Started
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Build a smarter sales workflow with LeadMS.
              </h1>

              <p className="mt-6 text-lg leading-8 text-blue-100">
                Manage products, leads, customers, teams, and quotations from
                a single platform.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-white" />
                  <span className="text-blue-100">
                    Centralized product management
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-white" />
                  <span className="text-blue-100">
                    Complete lead management
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-white" />
                  <span className="text-blue-100">
                    Powerful quotation workflows
                  </span>
                </div>
              </div>
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
              className="mb-8 block text-2xl font-bold tracking-tight text-primary lg:hidden"
            >
              LeadMS
            </Link>

            {/* Heading */}
            <div>
              <p className="text-sm font-semibold text-primary">
                Create your account
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Join LeadMS
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Choose your role and create your LeadMS account.
              </p>
            </div>

            <form
  onSubmit={handleRegister}
  className="mt-8 space-y-5"
>
              {/* Role Selection */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Select your role
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input
  type="radio"
  name="role"
  value="trader"
  checked={role === "trader"}
  onChange={() => setRole("trader")}
  className="peer sr-only"
/>

                    <div className="rounded-xl border border-border bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary-light hover:border-slate-300">
                      <Building2 className="h-6 w-6 text-primary" />

                      <p className="mt-3 text-sm font-semibold text-slate-900">
                        Trader
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Manage products and inventory.
                      </p>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
  type="radio"
  name="role"
  value="vendor"
  checked={role === "vendor"}
  onChange={() => setRole("vendor")}
  className="peer sr-only"
/>

                    <div className="rounded-xl border border-border bg-white p-4 transition peer-checked:border-primary peer-checked:bg-primary-light hover:border-slate-300">
                      <User className="h-6 w-6 text-primary" />

                      <p className="mt-3 text-sm font-semibold text-slate-900">
                        Vendor
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Manage leads and sales teams.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
  id="name"
  name="name"
  type="text"
  placeholder="Enter your full name"
  value={name}
  onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                      value={password}
  onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                      value={confirmPassword}
  onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Submit */}
              {error && (
  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {error}
  </div>
)}

{success && (
  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
    {success}
  </div>
)}
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
              >
                Create Account
              </button>
            </form>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-slate-600">
              Already have an account?{" "}
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