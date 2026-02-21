// app/loading.tsx

export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="loading loading-spinner loading-lg text-primary"></div>
      <p className="text-gray-500 animate-pulse">Memuat halaman...</p>
    </div>
  );
}
