"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Package,
  RefreshCw,
  ShieldCheck,
  Lock,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

import {
  getAvailableProducts,
  lockProduct,
  type Product,
} from "@/services/productService";

export default function VendorProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const productId = String(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const products = await getAvailableProducts();

      const found = products.find(
        (item) =>
          item._id === productId ||
          item.id === productId
      );

      if (!found) {
        setError("Product not found or no longer available.");
        setProduct(null);
        return;
      }

      setProduct(found);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const handleLock = async () => {
    if (!product) return;

    const id = product._id ?? product.id;

    if (!id) {
      setError("Product ID is missing.");
      return;
    }

    try {
      setLocking(true);
      setError("");
      setSuccess("");

      await lockProduct(id);

      setSuccess("Product locked successfully.");

      setTimeout(() => {
        router.push("/dashboard/vendor/locked-products");
      }, 900);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to lock product."
      );
    } finally {
      setLocking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <Card>
            <div className="flex items-center justify-center py-20">
              <RefreshCw
                size={24}
                className="animate-spin text-blue-600"
              />
              <span className="ml-3 text-sm text-slate-500">
                Loading product...
              </span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/dashboard/vendor/products"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>

          <Card>
            <div className="py-16 text-center">
              <Package
                size={42}
                className="mx-auto text-slate-300"
              />
              <h1 className="mt-4 text-xl font-bold text-slate-900">
                Product unavailable
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {error}
              </p>

              <div className="mt-6">
                <Button onClick={() => router.push("/dashboard/vendor/products")}>
                  Browse Products
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/vendor/products"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                  <Package size={30} />
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="success">Available</Badge>
                    {product?.category && (
                      <Badge variant="default">
                        {product.category}
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {product?.name}
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Product details and vendor locking
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Base Price
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  ?{Number(product?.basePrice || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Description
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {product?.description ||
                    "No description has been provided for this product."}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Product Information
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Product Name</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {product?.name}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Base Price</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      ?{Number(product?.basePrice || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Category</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {product?.category || "General"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Status</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-600">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <ShieldCheck size={20} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Lock this product
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Locking reserves this product for your vendor workspace
                  so your team can use it while preparing customer quotes.
                </p>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={17} />
                    {success}
                  </div>
                )}

                <button
                  onClick={handleLock}
                  disabled={locking}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locking ? (
                    <>
                      <RefreshCw size={17} className="animate-spin" />
                      Locking...
                    </>
                  ) : (
                    <>
                      <Lock size={17} />
                      Lock Product
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
