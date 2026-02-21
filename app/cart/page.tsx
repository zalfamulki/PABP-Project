"use client";
// app/cart/page.tsx
// TEKNIK: CSR (Client-Side Rendering)
// Seluruh halaman dirender di browser

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, CartItem } from "@/Store/cartStore";
import { formatCurrency } from "@/lib/api";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package, Tag, Zap, Cpu } from "lucide-react";

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
    <div className="flex items-start gap-4 p-5 bg-game-card rounded-2xl border border-white/5 hover:border-neon-purple/30 transition-all duration-300">
      {/* Thumbnail */}
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-game-dark border border-white/10">
          <Image
            src={item.product.thumbnail}
            alt={item.product.title}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.product.id}`}
          className="text-sm font-bold text-white hover:text-neon-cyan line-clamp-2 transition-colors uppercase italic tracking-tighter"
        >
          {item.product.title}
        </Link>
        <p className="text-[10px] text-neon-cyan font-bold uppercase tracking-widest mt-1">{item.product.category}</p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-black text-white">{formatCurrency(itemPrice)}</span>
          {item.product.discountPercentage > 0 && (
            <span className="text-xs text-gray-600 line-through">
              {formatCurrency(item.product.price)}
            </span>
          )}
        </div>

        {/* Quantity Control */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center rounded-lg bg-game-dark border border-white/10 overflow-hidden">
            <button
              onClick={handleDecrease}
              className="p-2 hover:bg-neon-pink hover:text-white transition-all"
              aria-label="Kurangi"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-4 py-1 text-sm font-black text-white min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-2 hover:bg-neon-cyan hover:text-game-dark transition-all"
              aria-label="Tambah"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="p-2 text-gray-600 hover:text-neon-pink transition-colors"
            aria-label="Hapus item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Total per item */}
      <div className="text-right flex-shrink-0">
        <span className="text-base font-black text-neon-cyan italic">{formatCurrency(itemTotal)}</span>
        {item.quantity > 1 && (
          <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">
            {item.quantity} UNITS
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
    <div className="bg-game-card rounded-3xl border border-white/10 p-8 sticky top-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-purple" />
      <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest italic">Inventory Summary</h2>

      <div className="space-y-4 text-xs font-bold uppercase tracking-widest">
        <div className="flex justify-between text-gray-500">
          <span>SUBTOTAL ({totalItems} UNITS)</span>
          <span className="text-white">{formatCurrency(subtotal)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-neon-pink">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> REBATE
            </span>
            <span>-{formatCurrency(savings)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-500">
          <span className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5" /> TRANSIT
          </span>
          <span className="text-neon-lime">ENCRYPTED FREE</span>
        </div>
        <div className="border-t border-white/10 pt-4 flex justify-between font-black text-white text-lg italic">
          <span>TOTAL</span>
          <span className="text-neon-cyan neon-text-cyan">{formatCurrency(total)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full mt-8 py-4 rounded-xl bg-neon-cyan text-game-dark font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_35px_rgba(0,243,255,0.6)] transition-all flex items-center justify-center"
      >
        INITIATE PURCHASE
      </Link>

      <button
        onClick={clearCart}
        className="w-full mt-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest hover:text-neon-pink transition-colors text-center py-2"
      >
        PURGE INVENTORY
      </button>
    </div>
  );
}

// ── Keranjang Kosong ──────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="text-center py-32 bg-game-card/50 rounded-3xl border border-dashed border-white/10">
      <div className="relative inline-block mb-8">
         <ShoppingCart className="w-20 h-20 text-white/10 mx-auto" />
         <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-neon-pink animate-pulse" />
         </div>
      </div>
      <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-widest">NO LOOT DETECTED</h2>
      <p className="text-sm text-gray-500 mb-10 italic">Your digital arsenal is currently empty.</p>
      <Link href="/products" className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-neon-cyan hover:text-game-dark transition-all duration-300">
        <ArrowLeft className="w-5 h-5" />
        START MISSION
      </Link>
    </div>
  );
}

// ── Page Export ──────────────────────────────────────────────────────────────
export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-game-dark flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 relative">
          <div className="absolute -left-4 top-0 w-1 h-12 bg-neon-pink shadow-[0_0_10px_rgba(255,0,229,0.8)]" />
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded bg-neon-pink/10 border border-neon-pink/30 text-[10px] font-bold text-neon-pink tracking-widest">
              CSR ENGINE
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <Cpu className="w-3 h-3" />
              ZUSTAND SYNCED
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
             MY <span className="text-neon-pink">INVENTORY</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <Link href="/products" className="flex items-center gap-2 text-xs font-black text-neon-cyan hover:text-white transition-all uppercase tracking-widest">
                  <ArrowLeft className="w-4 h-4" />
                  CONTINUE LOOTING
                </Link>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{items.length} UNIQUE ITEMS</span>
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} />
                ))}
              </div>
            </div>
            <div>
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
