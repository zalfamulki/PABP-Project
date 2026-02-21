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
//fungsi SSG//
export async function getCategories() {
  const res = await fetch('https://dummyjson.com/products/categories', {
    cache: 'force-cache',  // ← KUNCI SSG
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}
//fungsi SSR//

type GetProductsParams = {
  limit?: number;
  skip?: number;
  category?: string;
  search?: string;
};

export async function getProducts(params?: GetProductsParams) {
  const { limit = 12, skip = 0, category, search } = params ?? {};

  // Build URL berdasarkan params
  let url = search
    ? `https://dummyjson.com/products/search?q=${search}&limit=${limit}&skip=${skip}`
    : category
    ? `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`
    : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

  const res = await fetch(url, {
    cache: "no-store", // penting untuk SSR
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
//fungsi ISR//
export async function getProductById(id: number) {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    next: { revalidate: 60 },  // ← KUNCI ISR
  });
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}
