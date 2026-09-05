"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  ChevronRight,
  FileText,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface QuoteItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const products: Product[] = [
  {
    id: "p1",
    name: "Industrial Solar Panel 550W",
    category: "Solar",
    price: 18500,
  },
  {
    id: "p2",
    name: "Smart Energy Controller",
    category: "Energy Management",
    price: 12400,
  },
  {
    id: "p3",
    name: "Commercial Battery Pack",
    category: "Energy Storage",
    price: 48500,
  },
  {
    id: "p4",
    name: "Three Phase Inverter",
    category: "Power Systems",
    price: 32900,
  },
];

const customers = [
  {
    id: "c1",
    name: "Rajesh Enterprises",
    email: "rajesh@example.com",
  },
  {
    id: "c2",
    name: "GreenTech Solutions",
    email: "greentech@example.com",
  },
  {
    id: "c3",
    name: "Srinivas Industries",
    email: "srinivas@example.com",
  },
];

export default function TeamQuoteBuilderPage() {
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [marginPercentage, setMarginPercentage] = useState(10);
  const [installationPrice, setInstallationPrice] = useState(0);
  const [miscCharges, setMiscCharges] = useState(0);
  const [showProductModal, setShowProductModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const customer = customers.find(
    (item) => item.id === customerId
  );

  const filteredProducts = useMemo(() => {
    const query = productSearch.toLowerCase().trim();

    return products.filter((product) => {
      const alreadyAdded = items.some(
        (item) => item.productId === product.id
      );

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return !alreadyAdded && matchesSearch;
    });
  }, [items, productSearch]);

  const baseTotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [items]
  );

  const marginAmount = useMemo(
    () => baseTotal * (marginPercentage / 100),
    [baseTotal, marginPercentage]
  );

  const finalTotal =
    baseTotal +
    marginAmount +
    installationPrice +
    miscCharges;

  const addProduct = (product: Product) => {
    setItems((current) => [
      ...current,
      {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    ]);

    setShowProductModal(false);
    setProductSearch("");
  };

  const updateQuantity = (
    itemId: string,
    quantity: number
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(999, quantity)
              ),
            }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems((current) =>
      current.filter((item) => item.id !== itemId)
    );
  };

  const resetQuote = () => {
    setCustomerId("");
    setItems([]);
    setMarginPercentage(10);
    setInstallationPrice(0);
    setMiscCharges(0);
    setSaved(false);
  };

  const saveQuote = () => {
    if (!customerId || items.length === 0) {
      return;
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 4000);
  };

  return (
    <AppShell role="team">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Quotes</span>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-primary">
                New Quote
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Quote Builder
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Build a professional customer quote with
              automatic pricing calculations.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={resetQuote}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Quote
          </Button>
        </div>

        {saved && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            Quote saved successfully.
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* Main builder */}
          <div className="space-y-6">
            {/* Customer */}
            <Card>
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Customer Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select the customer for this quote.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Customer
                </label>

                <select
                  value={customerId}
                  onChange={(event) =>
                    setCustomerId(event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">
                    Select a customer
                  </option>

                  {customers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {item.email}
                    </option>
                  ))}
                </select>
              </div>

              {customer && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    {customer.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {customer.email}
                  </p>
                </div>
              )}
            </Card>

            {/* Products */}
            <Card className="overflow-hidden p-0">
              <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Package className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Products
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Add products and set quantities.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowProductModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                  <div className="rounded-full bg-slate-100 p-4 text-slate-500">
                    <Package className="h-7 w-7" />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No products added
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Add products to start calculating the
                    customer quote.
                  </p>

                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() =>
                      setShowProductModal(true)
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Product
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px]">
                    <thead>
                      <tr className="border-b border-border bg-slate-50/70 text-left">
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Product
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Unit Price
                        </th>

                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Quantity
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Total
                        </th>

                        <th className="w-12 px-3" />
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-900">
                              {item.name}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            ₹
                            {item.price.toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(event) =>
                                updateQuantity(
                                  item.id,
                                  Number(event.target.value)
                                )
                              }
                              className="w-20 rounded-lg border border-border px-3 py-2 text-center text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-slate-900">
                            ₹
                            {(
                              item.price *
                              item.quantity
                            ).toLocaleString("en-IN")}
                          </td>

                          <td className="px-3 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(item.id)
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Remove product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Pricing */}
            <Card>
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Pricing Configuration
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Adjust margin and additional charges.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Margin %
                  </label>

                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={marginPercentage}
                      onChange={(event) =>
                        setMarginPercentage(
                          Math.max(
                            0,
                            Math.min(
                              100,
                              Number(event.target.value)
                            )
                          )
                        )
                      }
                      className="pr-9"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Installation
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={installationPrice}
                    onChange={(event) =>
                      setInstallationPrice(
                        Math.max(
                          0,
                          Number(event.target.value)
                        )
                      )
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Miscellaneous
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={miscCharges}
                    onChange={(event) =>
                      setMiscCharges(
                        Math.max(
                          0,
                          Number(event.target.value)
                        )
                      )
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Summary */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            <Card className="overflow-hidden p-0">
              <div className="bg-slate-900 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-3">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-300">
                      Quote Summary
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      Customer Pricing
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Products
                  </span>

                  <span className="font-medium text-slate-900">
                    ₹{baseTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Margin ({marginPercentage}%)
                  </span>

                  <span className="font-medium text-slate-900">
                    ₹
                    {marginAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Installation
                  </span>

                  <span className="font-medium text-slate-900">
                    ₹
                    {installationPrice.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Miscellaneous
                  </span>

                  <span className="font-medium text-slate-900">
                    ₹
                    {miscCharges.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="border-t border-border pt-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Final Customer Price
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Including margin & additional charges
                      </p>
                    </div>

                    <p className="text-2xl font-bold text-primary">
                      ₹{finalTotal.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Calculation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Product Total + Margin + Installation +
                    Miscellaneous
                  </p>
                </div>

                <Button
                  fullWidth
                  disabled={
                    !customerId || items.length === 0
                  }
                  onClick={saveQuote}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Save Quote
                </Button>

                <p className="text-center text-xs text-slate-400">
                  Select a customer and add at least one
                  product to save.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add Product
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a product to include in the quote.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowProductModal(false);
                  setProductSearch("");
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-border p-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={productSearch}
                  onChange={(event) =>
                    setProductSearch(event.target.value)
                  }
                  placeholder="Search products..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-5">
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 font-medium text-slate-700">
                    No products available
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Try another search.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="group rounded-xl border border-border p-4 text-left transition hover:border-primary hover:bg-primary/5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {product.category}
                          </p>
                        </div>

                        <Plus className="h-5 w-5 text-slate-400 transition group-hover:text-primary" />
                      </div>

                      <p className="mt-4 text-lg font-bold text-primary">
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
