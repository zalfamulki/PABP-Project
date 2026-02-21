// app/products/[id]/page.tsx
// TEKNIK: ISR (Incremental Static Regeneration)
// Data di-cache dan di-revalidate setiap 60 detik

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getProducts, formatCurrency, calcDiscountedPrice, Product } from "@/lib/api";
import AddToCartButton from "./AddToCartButton";
import { Star, Package, ArrowLeft, Tag, ShieldCheck, Zap, Layers } from "lucide-react";

interface ProductDetailPageProps {
  params: { id: string };
}

// Dynamic metadata berdasarkan data produk
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  try {
    const product = await getProductById(Number(params.id));
    return {
      title: product.title,
      description: product.description.slice(0, 155),
    };
  } catch {
    return { title: "Item Not Found" };
  }
}

// Pre-generate 20 produk pertama saat build (ISR)
export async function generateStaticParams() {
  const { products } = await getProducts({ limit: 20 });
  return products.map((p) => ({ id: String(p.id) }));
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.round(rating) ? "fill-neon-purple text-neon-purple" : "text-gray-700"
          }`}
        />
      ))}
      <span className="text-sm font-bold text-white ml-2 neon-text-purple">{rating}</span>
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  let product: Product | undefined;

  try {
    product = await getProductById(Number(params.id));
  } catch {
    notFound();
  }

  if (!product) notFound();

  const discountedPrice = calcDiscountedPrice(product.price, product.discountPercentage);
  const savings = product.price - discountedPrice;

  return (
    <div className="min-h-screen bg-game-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-black text-neon-cyan hover:text-white transition-all uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO MARKETPLACE
          </Link>
          
          <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex-wrap">
            <Link href="/" className="hover:text-neon-cyan transition-colors">HOME</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-neon-cyan transition-colors">PRODUCTS</Link>
            <span>/</span>
            <span className="text-white">{product.title}</span>
          </nav>
        </div>

        {/* Tech Badge */}
        <div className="flex gap-2 mb-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-neon-purple/10 border border-neon-purple/30 text-[10px] font-bold text-neon-purple tracking-[0.2em]">
            <Layers className="w-3 h-3" />
            ISR DATA STREAM (60S)
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── Kiri: Gambar ── */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-game-card border border-white/5 shadow-2xl group">
              <Image
                src={product.images[0] ?? product.thumbnail}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                priority
              />
              {product.discountPercentage > 0 && (
                <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-neon-pink text-white text-sm font-black italic shadow-[0_0_20px_rgba(255,0,229,0.5)]">
                  -{Math.round(product.discountPercentage)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.slice(0, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-2xl overflow-hidden bg-game-card flex-shrink-0 border border-white/10 hover:border-neon-cyan transition-all cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover p-2"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Kanan: Info ── */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-black text-neon-cyan uppercase tracking-widest">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {product.brand}
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tighter italic">
                {product.title.toUpperCase()}
              </h1>

              <div className="flex flex-wrap items-center gap-6">
                <StarRating rating={product.rating} />
                <div className="h-1 w-1 bg-gray-700 rounded-full" />
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Package className="w-4 h-4 text-neon-cyan" />
                  {product.stock > 0 ? (
                    <span className="text-neon-lime">{product.stock} IN STOCK</span>
                  ) : (
                    <span className="text-neon-pink">OUT OF STOCK</span>
                  )}
                </div>
              </div>
            </div>

            {/* Harga Card */}
            <div className="bg-game-card rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl" />
              <div className="relative flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-500 tracking-[0.3em] uppercase">CURRENT PRICE</span>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {formatCurrency(discountedPrice)}
                  </span>
                  {savings > 0 && (
                    <span className="text-xl text-gray-600 line-through font-bold">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <div className="inline-flex items-center gap-2 text-neon-lime text-xs font-black uppercase tracking-widest mt-2">
                    <Zap className="w-4 h-4 fill-neon-lime" />
                    YOU SAVE {formatCurrency(savings)}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <AddToCartButton product={product} />
              
              <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 tracking-widest uppercase py-4 border-t border-white/5">
                <ShieldCheck className="w-4 h-4 text-neon-cyan" />
                SECURE DATA PROTOCOL · VERIFIED ITEM · INSTANT DELIVERY
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-2">
                <div className="w-1 h-4 bg-neon-purple" />
                Mission Intel
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium italic">
                &ldquo;{product.description}&rdquo;
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 capitalize">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}