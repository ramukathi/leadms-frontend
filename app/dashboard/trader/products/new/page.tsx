"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Package,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import api from "@/services/api";

interface ProductForm {
  name: string;
  description: string;
  category: string;
  basePrice: string;
  image: string;
}

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Product category is required.");
      return;
    }

    if (!form.basePrice.trim()) {
      setError("Product base price is required.");
      return;
    }

    const numericBasePrice = Number(form.basePrice);

    if (!Number.isFinite(numericBasePrice)) {
      setError("Please enter a valid product base price.");
      return;
    }

    if (numericBasePrice <= 0) {
      setError(
        "Product base price must be greater than zero."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        basePrice: numericBasePrice,
        ...(form.image.trim()
          ? { image: form.image.trim() }
          : {}),
      };

      const response = await api.post(
        "/products/trader",
        payload
      );

      console.log("PRODUCT CREATED:", response.data);

      setSuccess("Product created successfully.");

      setTimeout(() => {
        router.push("/dashboard/trader/products");
      }, 800);
    } catch (err: any) {
      console.error(
        "CREATE PRODUCT ERROR:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to create product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/dashboard/trader/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="mt-5">
            <p className="text-sm font-medium text-primary">
              Product Catalog
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Add Product
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Add a new product to your Trader catalog.
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Product Information Header */}
            <div className="flex items-center gap-4 rounded-xl bg-primary-light p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                <Package className="h-6 w-6 text-white" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Product Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Enter the basic details for your product.
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {success}
              </div>
            )}

            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Product Name
                <span className="ml-1 text-danger">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Industrial Water Pump"
                disabled={loading}
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            {/* Category + Base Price */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                  <span className="ml-1 text-danger">*</span>
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Industrial Equipment"
                  disabled={loading}
                  className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              {/* Base Price */}
              <div>
                <label
                  htmlFor="basePrice"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Base Price
                  <span className="ml-1 text-danger">*</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ₹
                  </span>

                  <input
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.basePrice}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    disabled={loading}
                    className="w-full rounded-lg border border-border bg-white py-3 pl-8 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Base price set by the Trader.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
                <span className="ml-1 text-danger">*</span>
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the product, its features, specifications, or other useful information..."
                disabled={loading}
                className="w-full resize-none rounded-lg border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              />

              <p className="mt-2 text-xs text-slate-400">
                Provide enough information for vendors and
                team members to understand the product.
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Product Image URL
                <span className="ml-2 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="image"
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  disabled={loading}
                  className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Enter a publicly accessible image URL.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/dashboard/trader/products"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <Button
                type="submit"
                disabled={loading}
                className="gap-2"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {loading
                  ? "Creating Product..."
                  : "Create Product"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}