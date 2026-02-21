"use client";
// app/products/[id]/AddToCartButton.tsx

import { useState, useCallback } from "react";
import { Product } from "@/lib/api";
import { useCartStore } from "@/Store/cartStore";
import { Check, Zap } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = useCallback(() => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [addItem, product]);

  const isOutOfStock = product.stock === 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock || added}
      className={`group relative flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden ${
        added
          ? "bg-neon-lime text-game-dark cursor-default shadow-[0_0_20px_rgba(57,255,20,0.5)]"
          : isOutOfStock
          ? "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
          : "bg-neon-cyan text-game-dark shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_35px_rgba(0,243,255,0.6)] active:scale-95"
      }`}
    >
      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
      
      <span className="relative flex items-center gap-3">
        {added ? (
          <><Check className="w-5 h-5" /> ACQUIRED</>
        ) : (
          <>
            {isOutOfStock ? (
              "NOT AVAILABLE"
            ) : (
              <>
                <Zap className="w-5 h-5 fill-game-dark" /> 
                ADD TO INVENTORY
              </>
            )}
          </>
        )}
      </span>
    </button>
  );
}