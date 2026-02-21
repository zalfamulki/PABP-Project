// app/products/loading.tsx
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-game-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="mb-10 relative">
          <div className="absolute -left-4 top-0 w-1 h-12 skeleton" />
          <div className="flex items-center gap-3 mb-2">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
          <div className="skeleton h-10 w-64 rounded" />
        </div>

        {/* Search Skeleton */}
        <div className="mb-8">
          <div className="skeleton h-14 w-full rounded-xl" />
        </div>

        {/* Category Filter Skeleton */}
        <div className="mb-10">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-8 w-24 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}