"use client";
// components/SearchBar.tsx

import { useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // useRef menyimpan timeout ID antar render tanpa memicu re-render
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);

      // Batalkan timeout sebelumnya sebelum buat yang baru
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
          params.set("q", value.trim());
        } else {
          params.delete("q");
        }
        params.delete("page"); // reset ke halaman 1 saat search berubah
        router.push(`/products?${params.toString()}`);
      }, 400); // debounce 400ms
    },
    [router, searchParams]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    clearTimeout(timeoutRef.current); // batalkan timeout yang mungkin pending
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-neon-cyan opacity-70" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="SCAN FOR GEARS, WEAPONS, OR ITEMS..."
        className="w-full pl-12 pr-12 py-4 rounded-xl border border-white/10 
                   bg-game-card text-sm text-white placeholder-gray-500
                   focus:outline-none focus:ring-1 focus:ring-neon-cyan focus:border-neon-cyan/50
                   transition-all duration-300 shadow-inner tracking-widest font-bold"
        aria-label="Cari produk"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-neon-pink transition-colors"
          aria-label="Hapus pencarian"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300 group-focus-within:w-full" />
    </div>
  );
}