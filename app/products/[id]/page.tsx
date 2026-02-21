// app/products/[id]/page.tsx
// TEKNIK: ISR (Incremental Static Regeneration)
// Data di-cache dan di-revalidate setiap 60 detik

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getProducts, formatCurrency, calcDiscountedPrice, Product } from "@/lib/api";
import AddToCartButton from "./AddToCartButton";
import { Star, Package, ArrowLeft, Tag, ShieldCheck } from "lucide-react";

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
    return { title: "Produk Tidak Ditemukan" };
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
            i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"
          }`}
        />
      ))}
      <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Deklarasi dengan tipe eksplisit
  let product: Product | undefined;

  try {
    product = await getProductById(Number(params.id));
  } catch {
    notFound();
  }

  // Guard clause — setelah ini TypeScript tahu product pasti ada
  if (!product) notFound();

  const discountedPrice = calcDiscountedPrice(product.price, product.discountPercentage);
  const savings = product.price - discountedPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-indigo-600 capitalize transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium line-clamp-1">{product.title}</span>
      </nav>

      {/* Back */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Products
      </Link>

      {/* Badge teknik rendering */}
      <div className="flex gap-2 mb-6">
        <span className="badge bg-purple-100 text-purple-700">ISR (revalidate 60s)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ── Kiri: Gambar ── */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
            <Image
              src={product.images[0] ?? product.thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {product.discountPercentage > 0 && (
              <span className="badge absolute top-4 left-4 bg-red-500 text-white text-sm">
                -{Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.slice(0, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200"
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Kanan: Info ── */}
        <div className="flex flex-col gap-5">
          {/* Category & Brand */}
          <div className="flex flex-wrap gap-2">
            <span className="badge bg-indigo-100 text-indigo-700 capitalize">{product.category}</span>
            {product.brand && (
              <span className="badge bg-gray-100 text-gray-600">{product.brand}</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* Rating & Stok */}
          <div className="flex flex-wrap items-center gap-4">
            <StarRating rating={product.rating} />
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Package className="w-4 h-4" />
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">{product.stock} tersedia</span>
              ) : (
                <span className="text-red-500 font-medium">Stok habis</span>
              )}
            </div>
          </div>

          {/* Harga */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-3xl font-extrabold text-gray-900">
                {formatCurrency(discountedPrice)}
              </span>
              {savings > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through pb-0.5">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="badge bg-green-100 text-green-700 text-sm">
                    Hemat {formatCurrency(savings)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Deskripsi</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-start gap-2">
              <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span key={tag} className="badge bg-gray-100 text-gray-600 capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tombol Add to Cart — Client Component */}
          <AddToCartButton product={product} />

          {/* Trust badges */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Pembelian aman · Garansi uang kembali · Gratis ongkir</span>
          </div>
        </div>
      </div>
    </div>
  );
}