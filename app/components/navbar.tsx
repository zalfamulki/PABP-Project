"use client";
// Client Component karena butuh akses Zustand store

import Link from "next/link";
import { useCartStore } from "@/Store/cartStore";
import { ShoppingCart, Store } from "lucide-react";

function CartBadge() {
  // Selector langsung — computed di sini, bukan di store
  const totalItems = useCartStore(
    (state) => state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-indigo-600 font-bold text-xl hover:text-indigo-700 transition-colors"
          >
            <Store className="w-6 h-6" />
            <span>NextShop</span>
          </Link>

          {/* Navigation */}
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Products
            </Link>
          </div>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
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