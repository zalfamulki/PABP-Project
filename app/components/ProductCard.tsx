"use client";
// components/ProductCard.tsx

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useState } from "react";
import { Product, formatCurrency, calcDiscountedPrice } from "@/lib/api";
import { useCartStore } from "@/Store/cartStore";
import { ShoppingCart, Star, Zap, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    },
    [addItem, product]
  );

  const discountedPrice = calcDiscountedPrice(product.price, product.discountPercentage);

  return (
    <Link href={`/products/${product.id}`} className="group relative">
      <div className="card flex flex-col h-full overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(188,19,254,0.3)] group-hover:border-neon-purple/50">

        {/* Gambar Produk */}
        <div className="relative aspect-[4/5] bg-game-dark overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-game-dark/80 via-transparent to-transparent" />
          
          {product.discountPercentage > 0 && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-neon-pink text-white text-[10px] font-black italic shadow-lg">
              SALE {Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>

        {/* Info Produk */}
        <div className="flex flex-col flex-1 p-4 gap-2 relative z-10 bg-game-card/50 backdrop-blur-sm">
          <span className="text-[10px] text-neon-cyan font-bold uppercase tracking-widest flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {product.category}
          </span>

          <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-neon-cyan transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
               <Star className="w-3 h-3 fill-neon-purple text-neon-purple" />
               <span className="text-[10px] font-bold text-white">{product.rating}</span>
            </div>
            <div className="h-1 w-1 bg-gray-600 rounded-full" />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{product.stock} IN STOCK</span>
          </div>

          {/* Harga + Tombol */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tighter">
                {formatCurrency(discountedPrice)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-[10px] text-gray-500 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`p-2.5 rounded-lg border transition-all duration-300 ${
                added
                  ? "bg-neon-lime border-neon-lime text-game-dark"
                  : "bg-white/5 border-white/10 text-white hover:bg-neon-purple hover:border-neon-purple"
              }`}
              aria-label={added ? "Berhasil ditambahkan" : `Tambah ${product.title} ke keranjang`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
});

export default ProductCard;