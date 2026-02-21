"use client";
// components/ProductCard.tsx

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback } from "react";
import { Product, formatCurrency, calcDiscountedPrice } from "@/lib/api";
import { useCartStore } from "@/Store/cartStore";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

// memo() → hanya re-render jika props `product` berubah
const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // useCallback → fungsi tidak dibuat ulang setiap render
  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // cegah navigasi Link
      addItem(product);
    },
    [addItem, product]
  );

  const discountedPrice = calcDiscountedPrice(product.price, product.discountPercentage);

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="card flex flex-col h-full overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">

        {/* Gambar Produk */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy" // lazy loading aktif
          />
          {product.discountPercentage > 0 && (
            <span className="badge absolute top-2 left-2 bg-red-500 text-white">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>

        {/* Info Produk */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">
            {product.category}
          </span>

          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.stock} stok)</span>
          </div>

          {/* Harga + Tombol */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900">
                {formatCurrency(discountedPrice)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary flex items-center gap-1.5 text-sm py-1.5 px-3"
              aria-label={`Tambah ${product.title} ke keranjang`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
});

export default ProductCard;