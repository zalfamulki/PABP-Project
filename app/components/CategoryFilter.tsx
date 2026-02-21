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
        params.delete("category"); // klik kategori aktif → hapus filter
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
    <div className="flex flex-wrap gap-2">
      {/* Tombol All */}
      <button
        onClick={() => handleClick("")}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
          !activeCategory
            ? "bg-indigo-600 text-white shadow-sm"
            : "bg-white text-gray-600 border border-gray-300 hover:border-indigo-300"
        }`}
      >
        Semua
      </button>

      {/* Tombol per kategori */}
      {categories.slice(0, 15).map((cat) => (
        <button
          key={cat.slug}
          onClick={() => handleClick(cat.slug)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200 ${
            activeCategory === cat.slug
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-gray-600 border border-gray-300 hover:border-indigo-300"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}