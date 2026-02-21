// app/products/page.tsx
// TEKNIK: SSR (Server-Side Rendering)
// Data di-fetch di server setiap kali ada request masuk

import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import ProductCard from "@/app/components/ProductCard";
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton";
import SearchBar from "@/app/components/Searchbar";
import CategoryFilter from "@/app/components/CategoryFilter";
import { ChevronLeft, ChevronRight, ServerCrash } from "lucide-react";

// Paksa SSR — tidak ada cache build-time
export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 12;

interface ProductsPageProps {
  searchParams: {
    q?: string;
    category?: string;
    page?: string;
  };
}

// generateMetadata dinamis berdasarkan searchParams
export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  if (searchParams.q) return { title: `Hasil: "${searchParams.q}"` };
  if (searchParams.category) return { title: `Kategori: ${searchParams.category}` };
  return { title: "Semua Produk" };
}

// ── Product Grid (async Server Component) ────────────────────────────────────
async function ProductGrid({
  query,
  category,
  page,
}: {
  query?: string;
  category?: string;
  page: number;
}) {
  try {
    const { products, total } = await getProducts({
      limit: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
      category,
      search: query,
    });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    if (products.length === 0) {
      return (
        <div className="col-span-full text-center py-20">
          <ServerCrash className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">Tidak ada produk ditemukan</h3>
          <p className="text-sm text-gray-400 mt-1">Coba kata kunci atau kategori lain</p>
        </div>
      );
    }

    return (
      <>
        {/* Info jumlah hasil */}
        <p className="col-span-full text-sm text-gray-500 mb-2">
          Menampilkan {products.length} dari {total} produk
          {query && ` untuk "${query}"`}
          {category && ` dalam kategori "${category}"`}
        </p>

        {/* Kartu produk */}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="col-span-full flex items-center justify-center gap-2 mt-8">
            {page > 1 && (
              <PaginationLink
                href={buildHref({ query, category, page: page - 1 })}
                label="Prev"
                icon={<ChevronLeft className="w-4 h-4" />}
              />
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + Math.max(1, page - 2);
              if (p > totalPages) return null;
              return (
                <PaginationLink
                  key={p}
                  href={buildHref({ query, category, page: p })}
                  label={String(p)}
                  active={p === page}
                />
              );
            })}
            {page < totalPages && (
              <PaginationLink
                href={buildHref({ query, category, page: page + 1 })}
                label="Next"
                icon={<ChevronRight className="w-4 h-4" />}
              />
            )}
          </div>
        )}
      </>
    );
  } catch {
    return (
      <div className="col-span-full text-center py-20">
        <ServerCrash className="w-12 h-12 text-red-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Gagal memuat produk</h3>
        <p className="text-sm text-gray-400 mt-1">Periksa koneksi internet dan coba lagi.</p>
        <Link href="/products" className="btn-primary mt-4">Coba Lagi</Link>
      </div>
    );
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function buildHref({ query, category, page }: { query?: string; category?: string; page: number }) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  return `/products?${params.toString()}`;
}

function PaginationLink({
  href,
  label,
  active,
  icon,
}: {
  href: string;
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "bg-white text-gray-600 border border-gray-300 hover:border-indigo-300"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function ProductsLoading() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}

// ── Page Export ──────────────────────────────────────────────────────────────
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = searchParams.q;
  const category = searchParams.category;
  const page = Number(searchParams.page ?? 1);

  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="badge bg-blue-100 text-blue-700">SSR</span>
          <span>Data di-fetch di server setiap request</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Semua Produk</h1>
      </div>

      {/* Search — wajib dibungkus Suspense karena useSearchParams() */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <Suspense fallback={<div className="skeleton h-10 w-full rounded-lg" />}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Category Filter — wajib dibungkus Suspense */}
      <div className="mb-6">
        <Suspense
          fallback={
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-7 w-20 rounded-full" />
              ))}
            </div>
          }
        >
          <CategoryFilter categories={categories} />
        </Suspense>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <Suspense fallback={<ProductsLoading />}>
          <ProductGrid query={query} category={category} page={page} />
        </Suspense>
      </div>
    </div>
  );
}