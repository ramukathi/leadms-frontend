"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Edit,
  Loader2,
  Package,
  Trash2,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import {
  deleteTraderProduct,
  getTraderProduct,
  type Product,
} from "@/services/productService";

export default function TraderProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params.id as string;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTraderProduct(productId);

        console.log(
          "PRODUCT DETAILS RESPONSE:",
          data
        );

        setProduct(data);
      } catch (err: any) {
        console.error(
          "GET PRODUCT ERROR:",
          err?.response?.data || err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load product. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  /*
   * Delete product.
   */
  const handleDelete = async () => {
    if (!product) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteTraderProduct(product._id ?? product.id ?? "");

      router.replace(
        "/dashboard/trader/products"
      );
    } catch (err: any) {
      console.error(
        "DELETE PRODUCT ERROR:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete product. Please try again."
      );

      setDeleting(false);
    }
  };

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <DashboardLayout>

        <div className="flex min-h-[500px] items-center justify-center">

          <div className="flex items-center gap-3 text-sm text-slate-500">

            <Loader2 className="h-5 w-5 animate-spin text-primary" />

            Loading product...

          </div>

        </div>

      </DashboardLayout>
    );
  }

  /*
   * Error state.
   */
  if (error && !product) {
    return (
      <DashboardLayout>

        <div className="mx-auto max-w-4xl space-y-6">

          <Link
            href="/dashboard/trader/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Products
          </Link>

          <Card>

            <div className="rounded-lg border border-red-200 bg-red-50 p-5">

              <p className="text-sm font-semibold text-red-800">
                Unable to load product
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

            </div>

          </Card>

        </div>

      </DashboardLayout>
    );
  }

  /*
   * No product.
   */
  if (!product) {
    return (
      <DashboardLayout>

        <div className="mx-auto max-w-4xl space-y-6">

          <Link
            href="/dashboard/trader/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Products
          </Link>

          <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <Package className="h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Product not found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              The requested product could not be found.
            </p>

          </Card>

        </div>

      </DashboardLayout>
    );
  }

  /*
   * Price formatting.
   */
  const formattedPrice =
    typeof product.basePrice === "number"
      ? `\u20B9${product.basePrice.toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}`
      : "\u20B90.00";

  /*
   * Category formatting.
   *
   * productService already normalizes this,
   * but we keep the fallback here as an
   * additional safety layer.
   */
  const displayCategory =
    typeof product.category === "string" &&
    product.category.trim()
      ? product.category.trim()
      : typeof product.categoryName ===
          "string" &&
        product.categoryName.trim()
      ? product.categoryName.trim()
      : "Not specified";

  return (
    <DashboardLayout>

      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <Link
              href="/dashboard/trader/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to Products
            </Link>

            <p className="mt-5 text-sm font-medium text-primary">
              Product Catalog
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Product Details
            </h2>

          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">

            <Link
              href={`/dashboard/trader/products/${product._id}/edit`}
            >
              <Button
                variant="outline"
                className="w-full gap-2 sm:w-auto"
              >
                <Edit className="h-4 w-4" />

                Edit Product
              </Button>
            </Link>

            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-2"
            >

              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}

              {deleting
                ? "Deleting..."
                : "Delete Product"}

            </Button>

          </div>

        </div>

        {/* Error */}
        {error && product && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Product Card */}
        <Card className="overflow-hidden p-0">

          <div className="grid lg:grid-cols-2">

            {/* Image */}
            <div className="flex min-h-80 items-center justify-center bg-slate-100 lg:min-h-[500px]">

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full max-h-[500px] w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">

                  <Package className="h-20 w-20 text-slate-300" />

                  <p className="mt-4 text-sm font-medium text-slate-400">
                    No product image
                  </p>

                </div>
              )}

            </div>

            {/* Information */}
            <div className="p-6 sm:p-8">

              {/* Product Name */}
              <div>

                <p className="text-sm font-medium text-primary">
                  Product
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {product.name}
                </h1>

              </div>

              {/* Category */}
              <div className="mt-6">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Category
                </p>

                <p className="mt-2 text-sm font-medium text-slate-700">
                  {displayCategory}
                </p>

              </div>

              {/* Base Price */}
              <div className="mt-6 rounded-xl bg-primary-light p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Base Price
                </p>

                <p className="mt-2 text-3xl font-bold text-primary">
                  {formattedPrice}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Price set by the Trader
                </p>

              </div>

              {/* Description */}
              <div className="mt-6">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {product.description ||
                    "No description available for this product."}
                </p>

              </div>

              {/* Metadata */}
              <div className="mt-8 border-t border-border pt-6">

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Product ID
                    </p>

                    <p className="mt-1 break-all text-xs text-slate-500">
                      {product._id}
                    </p>

                  </div>

                  {product.createdAt && (
                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Created
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(
                          product.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </Card>

      </div>

    </DashboardLayout>
  );
}

