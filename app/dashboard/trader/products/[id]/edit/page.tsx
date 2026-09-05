"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import {
  getTraderProduct,
  updateTraderProduct,
  type Product,
} from "@/services/productService";

interface FormData {
  name: string;
  category: string;
  basePrice: string;
  description: string;
  image: string;
}

export default function EditTraderProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params.id as string;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [form, setForm] =
    useState<FormData>({
      name: "",
      category: "",
      basePrice: "",
      description: "",
      image: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * Load product information.
   */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTraderProduct(productId);

        /*
         * Debug information.
         * This appears only in the browser console.
         */
        console.log(
          "PRODUCT FOR EDIT:",
          data
        );

        setProduct(data);

        /*
         * Populate the edit form.
         */
        setForm({
          name: data.name || "",

          category:
            data.category ||
            data.categoryName ||
            "",

          basePrice:
            typeof data.basePrice === "number"
              ? String(data.basePrice)
              : "",

          description:
            data.description || "",

          image:
            data.image || "",
        });
      } catch (err: any) {
        console.error(
          "GET PRODUCT FOR EDIT ERROR:",
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
   * Handle form field changes.
   */
  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /*
   * Submit the updated product.
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName =
      form.name.trim();

    const trimmedCategory =
      form.category.trim();

    const trimmedDescription =
      form.description.trim();

    const trimmedImage =
      form.image.trim();

    /*
     * Validate product name.
     */
    if (!trimmedName) {
      setError(
        "Product name is required."
      );
      return;
    }

    /*
     * Validate category.
     */
    if (!trimmedCategory) {
      setError(
        "Category is required."
      );
      return;
    }

    /*
     * Validate base price.
     */
    if (!form.basePrice.trim()) {
      setError(
        "Base price is required."
      );
      return;
    }

    const numericBasePrice =
      Number(form.basePrice);

    if (
      !Number.isFinite(
        numericBasePrice
      )
    ) {
      setError(
        "Please enter a valid base price."
      );
      return;
    }

    if (numericBasePrice < 0) {
      setError(
        "Base price cannot be negative."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * Payload sent to:
       *
       * PUT /products/trader/:id
       */
      const payload = {
        name: trimmedName,

        category: trimmedCategory,

        description:
          trimmedDescription,

        basePrice:
          numericBasePrice,

        ...(trimmedImage
          ? {
              image: trimmedImage,
            }
          : {}),
      };

      /*
       * Useful for checking exactly what
       * is being sent to the backend.
       */
      console.log(
        "UPDATE PRODUCT PAYLOAD:",
        payload
      );

      /*
       * Update product.
       */
      await updateTraderProduct(
        productId,
        payload
      );

      /*
       * Show success message.
       */
      setSuccess(
        "Product updated successfully."
      );

      /*
       * Redirect to the product details
       * page after the update.
       *
       * The details page performs a fresh
       * GET request, so it displays the
       * latest saved information.
       */
      setTimeout(() => {
        router.replace(
          `/dashboard/trader/products/${productId}`
        );
      }, 800);
    } catch (err: any) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update product. Please try again."
      );
    } finally {
      setSaving(false);
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
   * Product loading error.
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

  return (
    <DashboardLayout>

      <div className="mx-auto max-w-4xl space-y-6">

        {/* Page Header */}
        <div>

          <Link
            href={`/dashboard/trader/products/${productId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Product
          </Link>

          <p className="mt-5 text-sm font-medium text-primary">
            Product Catalog
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Edit Product
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the product information and save your changes.
          </p>

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

        {/* Form */}
        <Card>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Product Fields */}
            <div className="grid gap-6 sm:grid-cols-2">

              {/* Name */}
              <Input
                id="product-name"
                label="Product Name"
                value={form.name}
                onChange={(event) =>
                  handleChange(
                    "name",
                    event.target.value
                  )
                }
                placeholder="Enter product name"
                disabled={saving}
              />

              {/* Category */}
              <Input
                id="product-category"
                label="Category"
                value={form.category}
                onChange={(event) =>
                  handleChange(
                    "category",
                    event.target.value
                  )
                }
                placeholder="Enter product category"
                disabled={saving}
              />

              {/* Base Price */}
              <Input
                id="product-price"
                label="Base Price"
                type="number"
                min="0"
                step="0.01"
                value={form.basePrice}
                onChange={(event) =>
                  handleChange(
                    "basePrice",
                    event.target.value
                  )
                }
                placeholder="Enter base price"
                disabled={saving}
              />

              {/* Image */}
              <Input
                id="product-image"
                label="Image URL"
                type="url"
                value={form.image}
                onChange={(event) =>
                  handleChange(
                    "image",
                    event.target.value
                  )
                }
                placeholder="https://example.com/product.jpg"
                disabled={saving}
              />

            </div>

            {/* Description */}
            <div>

              <label
                htmlFor="product-description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="product-description"
                value={form.description}
                onChange={(event) =>
                  handleChange(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe the product..."
                rows={6}
                disabled={saving}
                className="w-full resize-none rounded-lg border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">

              {/* Cancel */}
              <Link
                href={`/dashboard/trader/products/${productId}`}
                className="w-full sm:w-auto"
              >
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>

              {/* Save */}
              <Button
                type="submit"
                disabled={saving}
                className="w-full gap-2 sm:w-auto"
              >

                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}

              </Button>

            </div>

          </form>

        </Card>

      </div>

    </DashboardLayout>
  );
}