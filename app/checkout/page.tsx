"use client";
// app/checkout/page.tsx

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/Store/cartStore";
import { formatCurrency } from "@/lib/api";
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, Truck, Package } from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + item.product.price * (1 - item.product.discountPercentage / 100) * item.quantity,
      0
    );
  }, [items]);

  const handleCompletePurchase = () => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    // Simulasi loading 2 detik
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-game-dark flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-game-card p-10 rounded-3xl border border-neon-lime/30 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-neon-lime shadow-[0_0_15px_rgba(57,255,20,0.6)]" />
          <CheckCircle2 className="w-20 h-20 text-neon-lime mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">MISSION ACCOMPLISHED</h2>
          <p className="text-gray-400 mb-8 italic">Your order has been encrypted and sent to the delivery drones.</p>
          <Link
            href="/products"
            className="block w-full py-4 rounded-xl bg-neon-cyan text-game-dark font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
          >
            RETURN TO BASE
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-game-dark flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">NO DATA TO PROCESS</h2>
          <Link href="/products" className="btn-neon inline-block px-8 py-3 bg-neon-cyan text-game-dark font-black rounded-lg">
            GO TO MARKETPLACE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-black text-neon-cyan hover:text-white transition-all uppercase tracking-widest mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO INVENTORY
        </Link>

        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-10">
          SECURE <span className="text-neon-purple">CHECKOUT</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Order Summary */}
          <div className="space-y-6">
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
              ITEM VERIFICATION
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.product.thumbnail} alt={item.product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate uppercase">{item.product.title}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{item.quantity} UNITS x {formatCurrency(item.product.price * (1 - item.product.discountPercentage / 100))}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-game-card rounded-2xl border border-white/10 space-y-3">
               <div className="flex justify-between text-xs font-bold uppercase text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-white">{formatCurrency(total)}</span>
               </div>
               <div className="flex justify-between text-xs font-bold uppercase text-gray-500">
                  <span>Processing</span>
                  <span className="text-neon-lime">FREE</span>
               </div>
               <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-black text-white italic">
                  <span>TOTAL</span>
                  <span className="text-neon-cyan">{formatCurrency(total)}</span>
               </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-6">
            <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">
              PAYMENT PROTOCOL
            </h2>
            
            <div className="space-y-4">
               <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/50 flex items-center gap-4">
                  <CreditCard className="w-6 h-6 text-neon-purple" />
                  <div>
                    <p className="text-xs font-black text-white uppercase">Neural Credits</p>
                    <p className="text-[10px] text-neon-purple/70 uppercase">Standard Payment Method</p>
                  </div>
                  <div className="ml-auto">
                     <CheckCircle2 className="w-5 h-5 text-neon-purple" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center opacity-50">
                    <Truck className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                    <p className="text-[10px] font-black text-gray-500 uppercase">Express</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center opacity-50">
                    <Package className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                    <p className="text-[10px] font-black text-gray-500 uppercase">Gift Warp</p>
                  </div>
               </div>

               <div className="pt-6">
                  <button
                    onClick={handleCompletePurchase}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl bg-neon-purple text-white font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(188,19,254,0.4)] hover:shadow-[0_0_35px_rgba(188,19,254,0.6)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        FINALIZE ORDER
                      </>
                    )}
                  </button>
                  <p className="text-[9px] text-gray-600 text-center mt-4 font-bold uppercase tracking-widest leading-relaxed">
                    By clicking finalize, you agree to the terms of the ZallShop digital licensing agreement.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
