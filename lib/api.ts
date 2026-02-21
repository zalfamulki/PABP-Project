// lib/api.ts

const BASE_URL = "https://dummyjson.com";

// ─── Type Definitions ───────────────────────────────────────────────────────

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

// ─── SSG: cache: "force-cache" ──────────────────────────────────────────────
// Data di-fetch SATU KALI saat `npm run build`.
// Semua request berikutnya pakai data yang sama (0 latency API).

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/products/categories`, {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error(`Gagal fetch kategori: ${res.status}`);
  return res.json();
}

// ─── SSR: cache: "no-store" ─────────────────────────────────────────────────
// Data di-fetch SETIAP REQUEST dari server.
// Cocok untuk halaman yang datanya sering berubah atau perlu search/filter.

export async function getProducts(params?: {
  limit?: number;
  skip?: number;
  category?: string;
  search?: string;
}): Promise<ProductsResponse> {
  const { limit = 12, skip = 0, category, search } = params ?? {};

  let url: string;

  if (search) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  } else if (category) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Gagal fetch produk: ${res.status}`);
  return res.json();
}

// ─── ISR: next.revalidate ───────────────────────────────────────────────────
// Data di-cache dan di-refresh otomatis setiap 60 detik.
// Cocok untuk detail produk yang jarang berubah.

export async function getProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Produk tidak ditemukan: ${res.status}`);
  return res.json();
}

// ─── Utility Functions ──────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function calcDiscountedPrice(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100);
}