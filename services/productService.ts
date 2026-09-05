import api from "@/services/api";

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  category?: string;
  categoryName?: string;
  basePrice: number;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProductPayload {
  name: string;
  description?: string;
  category?: string;
  basePrice: number;
  image?: string;
}

function normalizeCategory(product: any): string {
  if (typeof product?.category === "string") {
    return product.category.trim();
  }

  if (
    product?.category &&
    typeof product.category === "object" &&
    typeof product.category.name === "string"
  ) {
    return product.category.name.trim();
  }

  if (typeof product?.categoryName === "string") {
    return product.categoryName.trim();
  }

  return "";
}

function normalizeProduct(product: any): Product {
  return {
    ...product,
    category: normalizeCategory(product),
  };
}

/* ---------------------------------------------
   TRADER PRODUCTS
--------------------------------------------- */

export async function getTraderProducts(): Promise<Product[]> {
  const response = await api.get("/products/trader");

  const products = Array.isArray(response.data)
    ? response.data
    : [];

  return products.map(normalizeProduct);
}

export async function getTraderProduct(
  productId: string
): Promise<Product> {
  const response = await api.get("/products/trader");

  const products = Array.isArray(response.data)
    ? response.data
    : [];

  const product = products.find(
    (item: any) =>
      item?._id === productId ||
      item?.id === productId
  );

  if (!product) {
    throw new Error("Product not found.");
  }

  return normalizeProduct(product);
}

export async function updateTraderProduct(
  productId: string,
  payload: UpdateProductPayload
): Promise<Product> {
  const response = await api.put(
    `/products/trader/${productId}`,
    payload
  );

  return normalizeProduct(response.data);
}

export async function deleteTraderProduct(
  productId: string
): Promise<void> {
  await api.delete(`/products/trader/${productId}`);
}

/* ---------------------------------------------
   VENDOR PRODUCTS
--------------------------------------------- */

export async function getAvailableProducts(): Promise<Product[]> {
  const response = await api.get("/products/available");

  const products = Array.isArray(response.data)
    ? response.data
    : [];

  return products.map(normalizeProduct);
}

export async function lockProduct(
  productId: string
): Promise<Product> {
  const response = await api.post(
    `/products/${productId}/lock`
  );

  return normalizeProduct(response.data);
}

export async function getLockedProducts(): Promise<Product[]> {
  const response = await api.get("/products/locked");

  const products = Array.isArray(response.data)
    ? response.data
    : [];

  return products.map(normalizeProduct);
}

export async function unlockProduct(
  productId: string
): Promise<Product> {
  const response = await api.post(
    `/products/${productId}/unlock`
  );

  return normalizeProduct(response.data);
}