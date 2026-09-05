"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  getTraderProducts,
  type Product,
} from "@/services/productService";

export default function TraderProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTraderProducts();

      setProducts(data);
    } catch (err: any) {
      console.error(
        "TRADER PRODUCTS ERROR:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = products
      .map((product) => product.category)
      .filter(
        (value): value is string =>
          Boolean(value && value.trim())
      );

    return ["all", ...Array.from(new Set(uniqueCategories))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        category === "all" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Catalog
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage the products available in your
              catalog.
            </p>
          </div>

          <Link href="/dashboard/trader/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "all"
                    ? "All categories"
                    : item}
                </option>
              ))}
            </select>

            {/* Refresh */}
            <button
              type="button"
              onClick={loadProducts}
              disabled={loading}
              aria-label="Refresh products"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-3 py-2.5 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-5 w-5 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />

            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">
                Unable to load products
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={loadProducts}
              className="text-sm font-semibold text-red-700 hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="animate-pulse"
              >
                <div className="h-40 rounded-lg bg-slate-100" />

                <div className="mt-5 h-5 w-2/3 rounded bg-slate-100" />

                <div className="mt-3 h-4 w-full rounded bg-slate-100" />

                <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light">
                <Package className="h-8 w-8 text-primary" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {products.length === 0
                  ? "No products yet"
                  : "No products found"}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {products.length === 0
                  ? "Your product catalog is empty. Add your first product to start building your catalog."
                  : "Try changing your search or category filter."}
              </p>

              {products.length === 0 && (
                <Link
                  href="/dashboard/trader/products/new"
                  className="mt-6"
                >
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Product
                  </Button>
                </Link>
              )}
            </Card>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  className="overflow-hidden p-0"
                >
                  {/* Image */}
                  <div className="flex h-48 items-center justify-center bg-slate-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-12 w-12 text-slate-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {product.name}
                        </h3>

                        {product.category && (
                          <p className="mt-1 text-xs font-medium text-primary">
                            {product.category}
                          </p>
                        )}
                      </div>

                      {typeof product.basePrice === "number" && (
  <p className="shrink-0 text-sm font-bold text-slate-900">
    ₹
    {product.basePrice.toLocaleString("en-IN")}
  </p>
)}
                    </div>

                    {product.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {product.description}
                      </p>
                    )}

                    <Link
                      href={`/dashboard/trader/products/${product._id}`}
                      className="mt-5 block"
                    >
                      <Button
                        variant="outline"
                        fullWidth
                      >
                        View Product
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}