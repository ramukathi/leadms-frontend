"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Package,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import api from "@/services/api";

interface Quote {
  selectedProducts?: {
    productId: string;
    quantity: number;
    priceAtQuote: number;
  }[];
  baseTotal?: number;
  marginApplied?: number;
  installationPrice?: number;
  miscCharges?: number;
  finalTotal?: number;
}

interface Lead {
  _id: string;
  customerName: string;
  customerEmail?: string;
  status?: string;
  quote?: Quote;
  createdAt?: string;
}

interface Product {
  _id?: string;
  id?: string;
  name: string;
  basePrice: number;
  description?: string;
  isActive?: boolean;
}

const fallbackQuotes = [
  {
    id: "QT-2048",
    customer: "Acme Industries",
    amount: 24800,
    status: "Pending",
    date: "Sep 05, 2026",
  },
  {
    id: "QT-2047",
    customer: "Global Engineering",
    amount: 18450,
    status: "Accepted",
    date: "Sep 04, 2026",
  },
  {
    id: "QT-2046",
    customer: "Metro Manufacturing",
    amount: 32100,
    status: "Draft",
    date: "Sep 03, 2026",
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function VendorQuotesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [selectedLead, setSelectedLead] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [leadResponse, productResponse] = await Promise.all([
        api.get<Lead[]>("/leads"),
        api.get<Product[]>("/products/locked"),
      ]);

      setLeads(
        Array.isArray(leadResponse.data) ? leadResponse.data : []
      );

      setProducts(
        Array.isArray(productResponse.data) ? productResponse.data : []
      );

      setApiAvailable(true);
    } catch {
      setLeads([]);
      setProducts([]);
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const quotedLeads = useMemo(
    () => leads.filter((lead) => lead.quote?.finalTotal),
    [leads]
  );

  const quoteTotal = useMemo(
    () =>
      quotedLeads.reduce(
        (sum, lead) => sum + (lead.quote?.finalTotal || 0),
        0
      ),
    [quotedLeads]
  );

  const acceptedCount = useMemo(
    () =>
      quotedLeads.filter(
        (lead) => lead.status === "accepted"
      ).length,
    [quotedLeads]
  );

  const pendingCount = useMemo(
    () =>
      quotedLeads.filter(
        (lead) =>
          lead.status === "quoted" ||
          lead.status === "contacted"
      ).length,
    [quotedLeads]
  );

  const selectedProductData = products.find(
    (product) =>
      (product._id || product.id) === selectedProduct
  );

  const estimatedBaseTotal =
    (selectedProductData?.basePrice || 0) * quantity;

  const handleCreateQuote = async () => {
    setError("");
    setMessage("");

    if (!selectedLead) {
      setError("Please select a lead.");
      return;
    }

    if (!selectedProduct) {
      setError("Please select a product.");
      return;
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post<Lead>(
        `/leads/${selectedLead}/quote`,
        {
          products: [
            {
              productId: selectedProduct,
              quantity,
            },
          ],
        }
      );

      setLeads((current) =>
        current.map((lead) =>
          lead._id === selectedLead
            ? response.data
            : lead
        )
      );

      setMessage("Quote generated successfully.");

      setTimeout(() => {
        setShowCreate(false);
        setSelectedLead("");
        setSelectedProduct("");
        setQuantity(1);
        setMessage("");
      }, 1200);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to generate quote. Please check the vendor profile and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    if (saving) return;

    setShowCreate(false);
    setSelectedLead("");
    setSelectedProduct("");
    setQuantity(1);
    setError("");
    setMessage("");
  };

  return (
    <AppShell role="vendor">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-primary">
              Commercials
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Quotes
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, review and track customer quotations.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

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
              Create Quote
            </button>
          </div>
        </div>

        {!apiAvailable && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            The quote API is currently unavailable. Configure the backend
            before generating live quotations.
          </div>
        )}

        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Total Quote Value", money(quoteTotal), DollarSign],
            ["Accepted", acceptedCount, CheckCircle2],
            ["Pending", pendingCount, Clock3],
          ].map(([label, value, Icon]: any) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Icon className="h-5 w-5 text-primary" />

              <p className="mt-4 text-sm text-slate-500">
                {label}
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Quote list */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent quotes
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Quotations generated from your sales leads.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center px-6 py-16">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
                Loading quotes...
              </div>
            </div>
          ) : quotedLeads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-3 font-semibold text-slate-800">
                No generated quotes yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a quote from one of your leads.
              </p>

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                <Plus className="h-4 w-4" />
                Create Quote
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {quotedLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="flex flex-wrap items-center gap-4 p-5 transition hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-[200px] flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      QT-{lead._id.slice(-6).toUpperCase()}
                    </p>

                    <p className="text-xs text-slate-400">
                      {lead.customerName}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {money(lead.quote?.finalTotal || 0)}
                    </p>

                    <p className="text-xs text-slate-400">
                      {lead.quote?.selectedProducts?.length || 0} product
                      {lead.quote?.selectedProducts?.length === 1
                        ? ""
                        : "s"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      lead.status === "accepted"
                        ? "bg-emerald-50 text-emerald-700"
                        : lead.status === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {(lead.status || "quoted")
                      .charAt(0)
                      .toUpperCase() +
                      (lead.status || "quoted").slice(1)}
                  </span>

                  <span className="text-xs text-slate-400">
                    {lead.createdAt
                      ? new Date(
                          lead.createdAt
                        ).toLocaleDateString()
                      : "Recent"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calculation explanation */}
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
              <DollarSign className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Quote calculation
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Customer pricing is calculated from the selected product
                total, vendor margin, installation charges and miscellaneous
                charges configured in the vendor profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Quote Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Create quotation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a lead and product to generate a quotation.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">

              {/* Lead */}
              <div>
                <label
                  htmlFor="quote-lead"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Customer lead
                </label>

                <select
                  id="quote-lead"
                  value={selectedLead}
                  onChange={(event) =>
                    setSelectedLead(event.target.value)
                  }
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Select a lead</option>

                  {leads
                    .filter(
                      (lead) =>
                        lead.status !== "rejected"
                    )
                    .map((lead) => (
                      <option key={lead._id} value={lead._id}>
                        {lead.customerName}
                      </option>
                    ))}
                </select>
              </div>

              {/* Product */}
              <div>
                <label
                  htmlFor="quote-product"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Product
                </label>

                <select
                  id="quote-product"
                  value={selectedProduct}
                  onChange={(event) =>
                    setSelectedProduct(event.target.value)
                  }
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Select a product</option>

                  {products.map((product) => (
                    <option
                      key={product._id || product.id}
                      value={product._id || product.id}
                    >
                      {product.name} — {money(product.basePrice)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label
                  htmlFor="quote-quantity"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Quantity
                </label>

                <input
                  id="quote-quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      Math.max(
                        1,
                        Number(event.target.value) || 1
                      )
                    )
                  }
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
              </div>

              {/* Preview */}
              {selectedProductData && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary">
                      <Package className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedProductData.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {quantity} × {money(selectedProductData.basePrice)}
                      </p>
                    </div>

                    <p className="font-bold text-slate-900">
                      {money(estimatedBaseTotal)}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500">
                    Final price will include the vendor margin,
                    installation and miscellaneous charges configured in
                    the vendor profile.
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCreateQuote}
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Generate Quote
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
