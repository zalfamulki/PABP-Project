// app/page.tsx
// TEKNIK: SSG (Static Site Generation)
// Semua data di-fetch satu kali saat build, bukan saat request

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts, formatCurrency } from "@/lib/api";
import { ArrowRight, Zap, Globe, Monitor, BarChart3, Gamepad2, Cpu, ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Home" };

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center bg-[#0a0b1e] text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-neon-cyan/30 text-neon-cyan text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-bounce">
           <Cpu className="w-4 h-4" />
            Next-Gen Architecture Powered
          </div>

          <h1 className="text-5xl sm:text-7xl font-black leading-[1.1] mb-6 tracking-tighter">
            “Belanja Asik,  <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple neon-text-cyan">
             Harga Nggak Bikin Panik"
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
            ZallShop adalah platform marketplace dengan optimasi maksimal <span className="text-neon-cyan font-semibold">Next.js Build</span>.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-neon-cyan text-game-dark font-bold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.6)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                ENTER MARKETPLACE
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center px-8 py-4 border border-white/20 text-white font-bold rounded-lg hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
            >
              MY INVENTORY
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
      icon: <Globe className="w-8 h-8 text-neon-lime" />,
      label: "SSG",
      title: "Static Generation",
      desc: "Halaman ini di-generate saat build. Tidak ada API call saat runtime → Kecepatan cahaya.",
      borderColor: "border-neon-lime/30",
      shadow: "shadow-[0_0_15px_rgba(56,255,20,0.1)]",
    },
    {
      icon: <Monitor className="w-8 h-8 text-neon-cyan" />,
      label: "SSR",
      title: "Server-Side Rendering",
      desc: "Marketplace di-render di server setiap request. Data selalu fresh, SEO-friendly, mendukung search.",
      borderColor: "border-neon-cyan/30",
      shadow: "shadow-[0_0_15px_rgba(0,243,255,0.1)]",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-neon-purple" />,
      label: "CSR",
      title: "Client-Side Rendering",
      desc: "Inventory & Cart dirender di browser. State dikelola Zustand + sinkronisasi LocalStorage.",
      borderColor: "border-neon-purple/30",
      shadow: "shadow-[0_0_15px_rgba(188,19,254,0.1)]",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-game-card/30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-white mb-4 tracking-widest uppercase">
            <span className="text-neon-purple">THE</span> CORE TECH
          </h2>
          <div className="h-1 w-20 bg-neon-purple mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techniques.map((t) => (
            <div key={t.label} className={`relative group p-8 rounded-2xl bg-game-card border ${t.borderColor} ${t.shadow} hover:bg-white/5 transition-all duration-500`}>
              <div className="absolute -top-4 -left-4 bg-game-dark border border-inherit px-3 py-1 rounded-md text-xs font-bold text-white tracking-widest">
                {t.label}
              </div>
              <div className="mb-6">{t.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{t.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Featured Products (data dari SSG) ────────────────────────────────────────
async function FeaturedProducts() {
  const { products } = await getProducts({ limit: 4 });

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-neon-pink text-xs font-bold tracking-[0.3em] uppercase mb-2">
              <Zap className="w-4 h-4" /> TRENDING NOW
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">FEATURED GEARS</h2>
            <p className="text-gray-500 mt-2 font-medium italic">Prefetched via Static Site Generation (SSG)</p>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-neon-cyan hover:text-game-dark transition-all duration-300"
          >
            VIEW ALL ITEMS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group relative card overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3] bg-game-dark overflow-hidden">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-game-dark via-transparent to-transparent opacity-60" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-neon-cyan uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col bg-game-card">
                <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-neon-cyan transition-colors">{product.title}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-2xl font-black text-white tracking-tighter">
                    {formatCurrency(product.price)}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-neon-cyan group-hover:text-game-dark transition-all duration-300">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="h-1 w-0 bg-neon-cyan group-hover:w-full transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Category Grid (data dari SSG) ────────────────────────────────────────────
async function CategoryGrid() {
  const categories = await getCategories();

  return (
    <section className="py-24 bg-[#0d0e26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-1 bg-neon-cyan rounded-full" />
          <h2 className="text-3xl font-black text-white tracking-widest uppercase">CATEGORIES</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative flex flex-col items-center justify-center p-6 rounded-xl bg-game-card border border-white/5 hover:border-neon-purple/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Gamepad2 className="w-16 h-16 text-white" />
              </div>
              <span className="relative text-sm font-bold text-gray-400 group-hover:text-white capitalize transition-colors text-center">
                {cat.name}
              </span>
              <div className="relative mt-2 h-0.5 w-8 bg-transparent group-hover:bg-neon-purple transition-all duration-300" />
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
    <div className="bg-game-dark">
      <Hero />
      <TechBadges />
      <FeaturedProducts />
      <CategoryGrid />
      
      {/* Footer-like CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8">
             <ShieldCheck className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
             <h3 className="text-2xl font-black text-white mb-2">SECURE TRANSACTIONS</h3>
             <p className="text-gray-400 max-w-sm mx-auto">Tiap item di ZallShop diverifikasi secara manual untuk keamanan maksimal pengguna.</p>
          </div>
        </div>
      </section>
    </div>
  );
}