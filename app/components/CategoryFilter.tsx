"use client";
// components/CategoryFilter.tsx

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/lib/api";

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";

  const handleClick = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (activeCategory === slug) {
        params.delete("category");
      } else {
        params.set("category", slug);
      }
      params.delete("q");
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams, activeCategory]
  );

  return (
    <div className="flex flex-wrap gap-3">
      {/* Tombol All */}
      <button
        onClick={() => handleClick("")}
        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
          !activeCategory
            ? "bg-neon-cyan text-game-dark border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.4)]"
            : "bg-white/5 text-gray-400 border-white/10 hover:border-neon-cyan/50 hover:text-white"
        }`}
      >
        ALL GEARS
      </button>

      {/* Tombol per kategori */}
      {categories.slice(0, 15).map((cat) => (
        <button
          key={cat.slug}
          onClick={() => handleClick(cat.slug)}
          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
            activeCategory === cat.slug
              ? "bg-neon-purple text-white border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.4)]"
              : "bg-white/5 text-gray-400 border-white/10 hover:border-neon-purple/50 hover:text-white"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}