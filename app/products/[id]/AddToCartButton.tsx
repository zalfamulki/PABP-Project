"use client";
// app/products/[id]/AddToCartButton.tsx

import { useState, useCallback } from "react";
import { Product } from "@/lib/api";
import { useCartStore } from "@/Store/cartStore";
import { ShoppingCart, Check } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false); // local state untuk feedback visual
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = useCallback(() => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // reset tombol setelah 2 detik
  }, [addItem, product]);

  const isOutOfStock = product.stock === 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock || added}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
        added
          ? "bg-green-500 text-white cursor-default"
          : isOutOfStock
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md active:scale-95"
      }`}
    >
      {added ? (
        <><Check className="w-5 h-5" /> Ditambahkan!</>
      ) : (
        <><ShoppingCart className="w-5 h-5" /> {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}</>
      )}
    </button>
  );
}