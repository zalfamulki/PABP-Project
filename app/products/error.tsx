"use client";
// app/products/error.tsx

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Products page error:", error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-700 mb-2">Terjadi Kesalahan</h2>
      <p className="text-sm text-gray-500 mb-6">
        {error.message ?? "Gagal memuat produk. Silakan coba lagi."}
      </p>
      <div className="flex justify-center gap-3">
        <button onClick={reset} className="btn-primary">Coba Lagi</button>
        <Link href="/" className="btn-secondary">Ke Beranda</Link>
      </div>
    </div>
  );
}