// components/ProductCardSkeleton.tsx
export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/5]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="skeleton h-2 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="flex items-center justify-between mt-4">
          <div className="skeleton h-6 w-20 rounded" />
          <div className="skeleton h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}