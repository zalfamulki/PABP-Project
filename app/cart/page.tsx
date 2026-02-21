"use client";
// app/cart/page.tsx
// TEKNIK: CSR (Client-Side Rendering)
// Seluruh halaman dirender di browser

import { useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, CartItem } from "@/Store/cartStore";
import { formatCurrency } from "@/lib/api";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package, Tag } from "lucide-react";

// ── Satu Baris Item Keranjang ─────────────────────────────────────────────────
function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleIncrease = useCallback(() => {
    updateQuantity(item.product.id, item.quantity + 1);
  }, [updateQuantity, item.product.id, item.quantity]);

  const handleDecrease = useCallback(() => {
    updateQuantity(item.product.id, item.quantity - 1);
  }, [updateQuantity, item.product.id, item.quantity]);

  const handleRemove = useCallback(() => {
    removeItem(item.product.id);
  }, [removeItem, item.product.id]);

  const itemPrice = item.product.price * (1 - item.product.discountPercentage / 100);
  const itemTotal = itemPrice * item.quantity;

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
      {/* Thumbnail */}
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={item.product.thumbnail}
            alt={item.product.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.product.id}`}
          className="text-sm font-semibold text-gray-800 hover:text-indigo-600 line-clamp-2 transition-colors"
        >
          {item.product.title}
        </Link>
        <p className="text-xs text-gray-500 capitalize mt-0.5">{item.product.category}</p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium text-gray-900">{formatCurrency(itemPrice)}</span>
          {item.product.discountPercentage > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(item.product.price)}
            </span>
          )}
        </div>

        {/* Quantity Control */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={handleDecrease}
              className="p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Kurangi"
            >
              <Minus className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-800 min-w-[2.5rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Tambah"
            >
              <Plus className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            aria-label="Hapus item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Total per item */}
      <div className="text-right flex-shrink-0">
        <span className="text-sm font-bold text-gray-900">{formatCurrency(itemTotal)}</span>
        {item.quantity > 1 && (
          <p className="text-xs text-gray-400 mt-0.5">
            {item.quantity} × {formatCurrency(itemPrice)}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Ringkasan Order ───────────────────────────────────────────────────────────
function OrderSummary() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // useMemo → hitung total hanya saat items berubah
  const { subtotal, savings, total, totalItems } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const total = items.reduce(
      (sum, item) =>
        sum + item.product.price * (1 - item.product.discountPercentage / 100) * item.quantity,
      0
    );
    return {
      subtotal,
      total,
      savings: subtotal - total,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [items]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Order</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({totalItems} item)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Hemat
            </span>
            <span>-{formatCurrency(savings)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5" /> Ongkir
          </span>
          <span className="text-green-600 font-medium">Gratis</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <button
        onClick={() => alert("Checkout berhasil! (Demo)")}
        className="btn-primary w-full mt-6 py-3"
      >
        Checkout Sekarang
      </button>

      <button
        onClick={clearCart}
        className="w-full mt-3 text-sm text-gray-400 hover:text-red-500 transition-colors text-center py-2"
      >
        Kosongkan Keranjang
      </button>
    </div>
  );
}

// ── Keranjang Kosong ──────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="text-center py-20">
      <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-600 mb-2">Keranjang Kosong</h2>
      <p className="text-sm text-gray-400 mb-6">Belum ada produk di keranjangmu.</p>
      <Link href="/products" className="btn-primary inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Mulai Belanja
      </Link>
    </div>
  );
}

// ── Page Export ──────────────────────────────────────────────────────────────
export default function CartPage() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="badge bg-orange-100 text-orange-700">CSR</span>
          <span>Client-Side Rendering · State dikelola Zustand + localStorage</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Link href="/products" className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                <ArrowLeft className="w-4 h-4" />
                Lanjut Belanja
              </Link>
              <span className="text-sm text-gray-500">{items.length} jenis produk</span>
            </div>
            {items.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </div>
          <div>
            <OrderSummary />
          </div>
        </div>
      )}
    </div>
  );
}