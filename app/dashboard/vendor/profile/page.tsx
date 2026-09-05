"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  DollarSign,
  Percent,
  Save,
  Settings2,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import api from "@/services/api";

interface VendorProfile {
  marginPercentage?: number;
  installationPrice?: number;
  miscCharges?: number;
}

export default function VendorProfilePage() {
  const [marginPercentage, setMarginPercentage] = useState("10");
  const [installationPrice, setInstallationPrice] = useState("0");
  const [miscCharges, setMiscCharges] = useState("0");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await api.get<VendorProfile>(
          "/vendor/profile"
        );

        const profile = response.data || {};

        if (profile.marginPercentage !== undefined) {
          setMarginPercentage(String(profile.marginPercentage));
        }

        if (profile.installationPrice !== undefined) {
          setInstallationPrice(String(profile.installationPrice));
        }

        if (profile.miscCharges !== undefined) {
          setMiscCharges(String(profile.miscCharges));
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Unable to load your vendor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const margin = Number(marginPercentage);
    const installation = Number(installationPrice);
    const misc = Number(miscCharges);

    if (
      Number.isNaN(margin) ||
      Number.isNaN(installation) ||
      Number.isNaN(misc)
    ) {
      setError("Please enter valid numeric values.");
      return;
    }

    if (margin < 0 || margin > 100) {
      setError("Margin percentage must be between 0 and 100.");
      return;
    }

    if (installation < 0 || misc < 0) {
      setError("Charges cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      await api.put("/vendor/profile", {
        marginPercentage: margin,
        installationPrice: installation,
        miscCharges: misc,
      });

      setMessage("Vendor pricing profile saved successfully.");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell role="vendor">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-primary">
            Workspace Settings
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Vendor Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Configure pricing parameters used when generating customer
            quotations.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-20 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
              Loading vendor profile...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">

            {/* Pricing card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Settings2 className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Quotation pricing
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      These values are automatically applied when a quote
                      is generated.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-3">

                {/* Margin */}
                <div>
                  <label
                    htmlFor="marginPercentage"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Margin percentage
                  </label>

                  <div className="relative">
                    <Percent className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="marginPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={marginPercentage}
                      onChange={(event) =>
                        setMarginPercentage(event.target.value)
                      }
                      disabled={saving}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Applied as a percentage of the base product total.
                  </p>
                </div>

                {/* Installation */}
                <div>
                  <label
                    htmlFor="installationPrice"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Installation price
                  </label>

                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="installationPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={installationPrice}
                      onChange={(event) =>
                        setInstallationPrice(event.target.value)
                      }
                      disabled={saving}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Fixed installation amount added to every quote.
                  </p>
                </div>

                {/* Misc */}
                <div>
                  <label
                    htmlFor="miscCharges"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Miscellaneous charges
                  </label>

                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="miscCharges"
                      type="number"
                      min="0"
                      step="0.01"
                      value={miscCharges}
                      onChange={(event) =>
                        setMiscCharges(event.target.value)
                      }
                      disabled={saving}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Additional fixed charges included in quotations.
                  </p>
                </div>
              </div>

              {/* Formula */}
              <div className="border-t border-slate-100 bg-slate-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quote formula
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="rounded-lg bg-white px-3 py-2 shadow-sm">
                    Base Total
                  </span>
                  <span className="text-slate-400">+</span>
                  <span className="rounded-lg bg-white px-3 py-2 shadow-sm">
                    Margin
                  </span>
                  <span className="text-slate-400">+</span>
                  <span className="rounded-lg bg-white px-3 py-2 shadow-sm">
                    Installation
                  </span>
                  <span className="text-slate-400">+</span>
                  <span className="rounded-lg bg-white px-3 py-2 shadow-sm">
                    Misc.
                  </span>
                  <span className="text-slate-400">=</span>
                  <span className="rounded-lg bg-primary px-3 py-2 text-white shadow-sm">
                    Customer Price
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                {message}
              </div>
            )}

            {/* Save */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}
