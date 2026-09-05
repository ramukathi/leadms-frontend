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
  Unlock,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

import {
  getLockedProducts,
  unlockProduct,
  type Product,
} from "@/services/productService";

export default function VendorLockedProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [unlockingProductId, setUnlockingProductId] = useState<
    string | null
  >(null);

  const [successMessage, setSuccessMessage] = useState("");

  const loadLockedProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLockedProducts();

      console.log("VENDOR LOCKED PRODUCTS:", data);

      setProducts(data);
      setFilteredProducts(data);
    } catch (err: any) {
      console.error("LOCKED PRODUCTS ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load locked products.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLockedProducts();
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

  const handleUnlockProduct = async (product: Product) => {
    const productId = product._id || product.id;

    if (!productId) {
      setError("Unable to identify this product.");
      return;
    }

    try {
      setUnlockingProductId(productId);
      setError("");
      setSuccessMessage("");

      await unlockProduct(productId);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) =>
            (item._id || item.id) !== productId
        )
      );

      setSuccessMessage(
        `"${product.name}" has been removed from your locked products.`
      );
    } catch (err: any) {
      console.error("UNLOCK PRODUCT ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to unlock this product.";

      setError(message);
    } finally {
      setUnlockingProductId(null);
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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <Lock className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Locked Products
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Products currently selected for your vendor catalog.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadLockedProducts}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Link href="/dashboard/vendor/products">
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Success message */}
      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">
              Product unlocked successfully
            </p>

            <p className="mt-1 text-sm text-green-700">
              {successMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="text-lg leading-none text-green-600 hover:text-green-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <div>
            <p className="text-sm font-semibold text-red-800">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-lg leading-none text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search locked products..."
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}{" "}
            locked
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
              <div className="h-11 w-11 rounded-xl bg-slate-200" />

              <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />

              <div className="mt-3 h-4 w-full rounded bg-slate-200" />

              <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />

              <div className="mt-6 h-14 rounded-lg bg-slate-200" />

              <div className="mt-5 h-10 rounded-lg bg-slate-200" />
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
              <Lock className="h-6 w-6 text-slate-400" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No locked products
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search
                ? "No locked products match your search."
                : "You haven't locked any products yet. Browse the available products to build your catalog."}
            </p>

            {!search && (
              <div className="mt-6">
                <Link href="/dashboard/vendor/products">
                  <Button>
                    Browse Available Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        )}

      {/* Product grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const productId = product._id || product.id;

            const isUnlocking =
              unlockingProductId === productId;

            const formattedPrice = Number(
              product.basePrice || 0
            ).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            return (
              <Card
                key={productId || product.name}
                className="flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                    <Lock className="h-5 w-5 text-emerald-600" />
                  </div>

                  <Badge variant="success">
                    Locked
                  </Badge>
                </div>

                {/* Product */}
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
                    ₹{formattedPrice}
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
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    className="flex-1"
                    disabled={
                      !productId || isUnlocking
                    }
                    onClick={() =>
                      handleUnlockProduct(product)
                    }
                  >
                    <Unlock className="mr-1.5 h-4 w-4" />

                    {isUnlocking
                      ? "Unlocking..."
                      : "Unlock"}
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