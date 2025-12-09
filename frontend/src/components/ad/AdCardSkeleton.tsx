function AdCardSkeleton() {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-lg mx-auto overflow-hidden border border-gray-100">
      {/* Image Skeleton */}
      <div className="relative h-[220px] sm:h-[260px] bg-gray-200 animate-pulse">
        {/* Type badge skeleton */}
        <div className="absolute top-4 right-4 bg-gray-300 h-7 w-20 rounded-full animate-pulse" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded-lg w-full animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
        </div>

        {/* Location Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>

        {/* Features Skeleton */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl w-24">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl w-24">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
          </div>
        </div>

        {/* Address Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>

        {/* User Skeleton */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
        </div>

        {/* Date Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
        </div>

        {/* Price & CTA Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
            <div className="h-7 bg-gray-200 rounded w-28 animate-pulse" />
          </div>
          <div className="bg-gray-200 h-12 w-24 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Example usage with multiple skeletons
export default function AdCardsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <AdCardSkeleton key={i} />
      ))}
    </div>
  );
}
