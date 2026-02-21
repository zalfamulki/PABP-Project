// app/products/[id]/loading.tsx

export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Skeleton */}
        <div className="w-full md:w-1/2 aspect-square skeleton rounded-2xl" />

        {/* Info Skeleton */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <div className="skeleton h-4 w-24 mb-4 rounded" />
            <div className="skeleton h-10 w-3/4 mb-2 rounded" />
            <div className="skeleton h-6 w-1/4 rounded" />
          </div>

          <div className="skeleton h-24 w-full rounded" />

          <div className="space-y-4">
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-xl" />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="skeleton h-16 rounded-lg" />
              <div className="skeleton h-16 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
