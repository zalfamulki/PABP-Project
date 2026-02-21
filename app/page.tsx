// app/page.tsx
// TEKNIK: SSG (Static Site Generation)
// Semua data di-fetch satu kali saat build, bukan saat request

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/lib/api";
import { ArrowRight, Zap, Globe, Monitor, BarChart3 } from "lucide-react";

export const metadata: Metadata = { title: "Home" };

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Next.js 14 · SSG · SSR · CSR
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Belanja Cerdas,
            <br />
            <span className="text-yellow-300">Performa Maksimal</span>
          </h1>

          <p className="text-lg text-indigo-100 mb-8">
            Demo aplikasi modern dengan Static Generation, Server-Side Rendering,
            Client-Side Rendering, dan Zustand state management.
          </p>

          {/* Tombol — tanpa override !important */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Lihat Produk
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center px-5 py-2.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Keranjang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section Penjelasan Rendering ─────────────────────────────────────────────
function TechBadges() {
  const techniques = [
    {
      icon: <Globe className="w-5 h-5 text-green-600" />,
      label: "SSG",
      title: "Static Generation",
      desc: "Halaman ini di-generate saat build. Tidak ada API call saat runtime → sangat cepat.",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      icon: <Monitor className="w-5 h-5 text-blue-600" />,
      label: "SSR",
      title: "Server-Side Rendering",
      desc: "Halaman Products di-render di server setiap request. Data selalu fresh, mendukung search.",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-orange-600" />,
      label: "CSR",
      title: "Client-Side Rendering",
      desc: "Halaman Cart dirender di browser. State dikelola Zustand + tersimpan di localStorage.",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Tiga Teknik Rendering Modern
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Masing-masing halaman mengimplementasikan teknik yang berbeda
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {techniques.map((t) => (
            <div key={t.label} className={`rounded-xl p-5 border ${t.bg} ${t.border}`}>
              <div className="flex items-center gap-2 mb-3">
                {t.icon}
                <span className="font-bold text-gray-800">{t.label}</span>
                <span className="ml-auto badge bg-white text-gray-600 border border-gray-200">
                  {t.title}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Featured Products (data dari SSG) ────────────────────────────────────────
async function FeaturedProducts() {
  const { products } = await getProducts({ limit: 4 }); // fetch saat build

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Produk Unggulan</h2>
            <p className="text-sm text-gray-500 mt-1">Data di-fetch saat build time (SSG)</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group card overflow-hidden">
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority // above-the-fold → tidak lazy
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-indigo-600 font-medium uppercase">{product.category}</p>
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mt-0.5">{product.title}</h3>
                <p className="text-sm font-bold text-gray-900 mt-1">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Category Grid (data dari SSG) ────────────────────────────────────────────
async function CategoryGrid() {
  const categories = await getCategories(); // fetch saat build

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Jelajahi Kategori</h2>
        <p className="text-sm text-gray-500 mb-8">
          {categories.length} kategori tersedia · Data SSG dari dummyjson.com
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
            >
              <div className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 capitalize transition-colors">
                {cat.name}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-400">Lihat produk</span>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Page Export ──────────────────────────────────────────────────────────────
export default async function HomePage() {
  return (
    <>
      <Hero />
      <TechBadges />
      <FeaturedProducts />
      <CategoryGrid />
    </>
  );
}