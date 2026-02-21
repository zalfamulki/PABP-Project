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
  if (searchParams.q) return { title: `Search: "${searchParams.q}"` };
  if (searchParams.category) return { title: `Category: ${searchParams.category}` };
  return { title: "Marketplace" };
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
        <div className="col-span-full text-center py-20 bg-game-card rounded-2xl border border-dashed border-white/10">
          <ServerCrash className="w-16 h-16 text-neon-pink mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white">NO LOOT FOUND</h3>
          <p className="text-sm text-gray-500 mt-2 italic">Gagal menemukan item di koordinat ini.</p>
        </div>
      );
    }

    return (
      <>
        {/* Info jumlah hasil */}
        <div className="col-span-full mb-4 flex items-center gap-2">
           <div className="h-px flex-1 bg-white/10" />
           <p className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest px-4 py-1 rounded-full border border-neon-cyan/20">
            {total} ITEMS DETECTED
          </p>
           <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Kartu produk */}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="col-span-full flex items-center justify-center gap-3 mt-12">
            {page > 1 && (
              <PaginationLink
                href={buildHref({ query, category, page: page - 1 })}
                label="PREV"
                icon={<ChevronLeft className="w-4 h-4" />}
              />
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-game-card border border-white/10 rounded-xl">
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
            </div>
            {page < totalPages && (
              <PaginationLink
                href={buildHref({ query, category, page: page + 1 })}
                label="NEXT"
                icon={<ChevronRight className="w-4 h-4" />}
              />
            )}
          </div>
        )}
      </>
    );
  } catch {
    return (
      <div className="col-span-full text-center py-20 bg-game-card rounded-2xl border border-red-500/20">
        <ServerCrash className="w-16 h-16 text-neon-pink mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white uppercase tracking-widest">SYSTEM OVERLOAD</h3>
        <p className="text-sm text-gray-400 mt-2 italic">Koneksi ke data center terputus.</p>
        <Link href="/products" className="btn-neon mt-6 inline-block">REBOOT CONNECTION</Link>
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
      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-black transition-all ${
        active
          ? "bg-neon-cyan text-game-dark shadow-[0_0_15px_rgba(0,243,255,0.4)]"
          : "text-gray-400 hover:text-white hover:bg-white/5"
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
    <div className="min-h-screen bg-game-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/30 text-[10px] font-bold text-neon-cyan tracking-widest">
              SSR ACTIVE
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">REAL-TIME DATA STREAM</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
             MARKET<span className="text-neon-cyan">PLACE</span>
          </h1>
        </div>

        {/* Search */}
        <div className="mb-8 group">
          <Suspense fallback={<div className="skeleton h-14 w-full rounded-xl" />}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Category Filter */}
        <div className="mb-10">
          <Suspense
            fallback={
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton h-8 w-24 rounded-full flex-shrink-0" />
                ))}
              </div>
            }
          >
            <CategoryFilter categories={categories} />
          </Suspense>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Suspense fallback={<ProductsLoading />}>
            <ProductGrid query={query} category={category} page={page} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}