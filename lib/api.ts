// lib/api.ts

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
  tags?: string[];
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

// ─── Constants ──────────────────────────────────────────────────────────────

const BASE_URL = "https://dummyjson.com";
const USD_TO_IDR = 15000;

// ─── Utility Functions ──────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calcDiscountedPrice(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100);
}

function adjustProductPrice(product: Product): Product {
  return {
    ...product,
    price: Math.round(product.price * USD_TO_IDR),
  };
}

// ─── API Functions ──────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error("Gagal mengambil kategori");
  return res.json();
}

export async function getProducts(params?: {
  limit?: number;
  skip?: number;
  category?: string;
  search?: string;
}): Promise<ProductsResponse> {
  const { limit = 12, skip = 0, category, search } = params ?? {};

  let url = `${BASE_URL}/products`;

  if (search) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  } else if (category) {
    url = `${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal mengambil produk");
  
  const data: ProductsResponse = await res.json();
  
  return {
    ...data,
    products: data.products.map(adjustProductPrice),
  };
}

export async function getProductById(id: number | string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error(`Produk tidak ditemukan`);
  
  const product: Product = await res.json();
  return adjustProductPrice(product);
}
