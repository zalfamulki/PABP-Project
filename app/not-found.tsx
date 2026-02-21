// app/not-found.tsx
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="w-16 h-16 text-indigo-300 mb-4" />
      <h1 className="text-5xl font-extrabold text-gray-800 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-gray-600 mb-4">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-400 mb-8 max-w-sm">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link href="/" className="btn-primary">Kembali ke Beranda</Link>
    </div>
  );
}