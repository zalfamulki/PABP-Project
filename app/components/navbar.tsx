"use client";
// Client Component karena butuh akses Zustand store

import Link from "next/link";
import { useCartStore } from "@/Store/cartStore";
import { ShoppingCart, Gamepad2 } from "lucide-react";

function CartBadge() {
  const totalItems = useCartStore(
    (state) => state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-neon-pink text-[10px] font-bold text-white shadow-[0_0_10px_rgba(255,0,229,0.5)]">
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-game-dark/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-neon-cyan font-black text-2xl hover:text-white transition-all neon-text-cyan"
          >
            <Gamepad2 className="w-8 h-8" />
            <span className="tracking-tighter">ZALLSHOP</span>
          </Link>

          {/* Navigation */}
          <div className="hidden sm:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-neon-cyan transition-colors uppercase tracking-widest">
              Home
            </Link>
            <Link href="/products" className="text-sm font-semibold text-gray-400 hover:text-neon-cyan transition-colors uppercase tracking-widest">
              Marketplace
            </Link>
          </div>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-gray-400 hover:text-neon-purple hover:bg-white/5 transition-all"
            aria-label="Keranjang Belanja"
          >
            <ShoppingCart className="w-6 h-6" />
            <CartBadge />
          </Link>

        </div>
      </div>
    </nav>
  );
}