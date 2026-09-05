"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Package,
  RefreshCw,
  Search,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

import {
  getAvailableProducts,
  lockProduct,
  type Product,
} from "@/services/productService";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [lockingProductId, setLockingProductId] = useState<string | null>(
    null
  );

  const [successMessage, setSuccessMessage] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAvailableProducts();

      console.log("VENDOR AVAILABLE PRODUCTS:", data);

      setProducts(data);
      setFilteredProducts(data);
    } catch (err: any) {
      console.error("VENDOR PRODUCTS ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load available products.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const description =
        product.description?.toLowerCase() || "";

      return (
        name.includes(query) ||
        description.includes(query)
      );
    });

    setFilteredProducts(filtered);
  }, [search, products]);

  const handleLockProduct = async (product: Product) => {
    const productId = product._id || product.id;

    if (!productId) {
      setError("Unable to identify this product.");
      return;
    }

    try {
      setLockingProductId(productId);
      setError("");
      setSuccessMessage("");

      await lockProduct(productId);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) =>
            (item._id || item.id) !== productId
        )
      );

      setSuccessMessage(
        `"${product.name}" has been added to your locked products.`
      );
    } catch (err: any) {
      console.error("LOCK PRODUCT ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to lock this product.";

      setError(message);
    } finally {
      setLockingProductId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/vendor"
            className="mb-3 inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-primary"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light">
              <Package className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Available Products
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Browse products supplied by traders and lock the ones you
                want to sell.
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={loadProducts}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </section>

      {/* Success message */}
      {successMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

          <div className="flex-1">
            <p className="font-semibold">Product locked successfully</p>
            <p className="mt-0.5">{successMessage}</p>
          </div>

          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-600 hover:text-green-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div>
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-0.5">{error}</p>
          </div>

          <button
            onClick={() => setError("")}
            className="text-lg leading-none text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Search and count */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-900">
              {filteredProducts.length}
            </span>

            <span>
              {filteredProducts.length === 1
                ? "product"
                : "products"}{" "}
              available
            </span>
          </div>
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card
              key={item}
              className="animate-pulse p-5"
            >
              <div className="h-11 w-11 rounded-lg bg-slate-200" />

              <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />

              <div className="mt-3 h-4 w-full rounded bg-slate-200" />

              <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />

              <div className="mt-6 h-10 w-full rounded bg-slate-200" />
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredProducts.length === 0 && (
          <Card className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Package className="h-6 w-6 text-slate-400" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No products found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {search
                ? "Try changing your search term."
                : "There are currently no products available to lock."}
            </p>
          </Card>
        )}

      {/* Product Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const productId = product._id || product.id;

            const isLocking =
              lockingProductId === productId;

            return (
              <Card
                key={productId || product.name}
                className="flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Product icon */}
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light">
                    <Package className="h-5 w-5 text-primary" />
                  </div>

                  <Badge
                    variant={
                      product.isActive === false
                        ? "danger"
                        : "success"
                    }
                  >
                    {product.isActive === false
                      ? "Inactive"
                      : "Available"}
                  </Badge>
                </div>

                {/* Product info */}
                <div className="mt-5 flex-1">
                  <h2 className="text-lg font-bold text-slate-900">
                    {product.name}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {product.description ||
                      "No product description available."}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-5 rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Base Price
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    ₹
                    {Number(
                      product.basePrice || 0
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/dashboard/vendor/products/${productId}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      fullWidth
                      disabled={!productId}
                    >
                      View
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>

                  <Button
                    className="flex-1"
                    disabled={
                      !productId ||
                      isLocking ||
                      product.isActive === false
                    }
                    onClick={() =>
                      handleLockProduct(product)
                    }
                  >
                    <Lock className="mr-1.5 h-4 w-4" />

                    {isLocking
                      ? "Locking..."
                      : "Lock Product"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}