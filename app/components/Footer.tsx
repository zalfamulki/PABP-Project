// components/Footer.tsx
import Link from "next/link";
import { Store } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
              <Store className="w-5 h-5" />
              NextShop
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Demo Next.js 14 dengan SSG, SSR, CSR, Zustand, dan optimasi performa.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Navigasi</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-indigo-600 transition-colors">Home (SSG)</Link></li>
              <li><Link href="/products" className="hover:text-indigo-600 transition-colors">Products (SSR)</Link></li>
              <li><Link href="/cart" className="hover:text-indigo-600 transition-colors">Cart (CSR)</Link></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tech Stack</h3>
            <ul className="space-y-1 text-sm text-gray-500">
              <li>Next.js 14 (App Router)</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Zustand</li>
              <li>dummyjson.com API</li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} NextShop · Tugas Pengembangan Aplikasi Berbasis Platform
        </div>
      </div>
    </footer>
  );
}