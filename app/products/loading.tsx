// app/products/loading.tsx
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="skeleton h-4 w-32 rounded mb-2" />
        <div className="skeleton h-8 w-48 rounded" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-7 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}