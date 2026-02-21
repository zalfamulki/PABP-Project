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
    <div className="relative flex-1 max-w-lg">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Cari produk..."
        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 
                   bg-white text-sm text-gray-900 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                   transition-all duration-200"
        aria-label="Cari produk"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Hapus pencarian"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}