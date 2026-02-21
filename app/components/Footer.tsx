// components/Footer.tsx
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-game-dark border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-neon-cyan font-bold text-xl neon-text-cyan">
              <Gamepad2 className="w-6 h-6" />
              ZallShop
            </Link>
            <p className="mt-2 text-sm text-gray-400">
             Kami menghubungkan Anda dengan berbagai produk berkualitas dari penjual terpercaya. Nikmati pengalaman belanja online yang aman, nyaman, dan menyenangkan.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-widest">Navigasi</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-neon-cyan transition-colors">Home (SSG)</Link></li>
              <li><Link href="/products" className="hover:text-neon-cyan transition-colors">Marketplace (SSR)</Link></li>
              <li><Link href="/cart" className="hover:text-neon-cyan transition-colors">Cart (CSR)</Link></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-widest">Tech Stack</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-neon-cyan rounded-full"></span> Next.js 14 (App Router)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-neon-purple rounded-full"></span> TypeScript</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-neon-pink rounded-full"></span> Tailwind CSS</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-neon-lime rounded-full"></span> Zustand</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> dummyjson.com API</li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} ZallShop · Tugas Pengembangan Aplikasi Berbasis Platform
        </div>
      </div>
    </footer>
  );
}