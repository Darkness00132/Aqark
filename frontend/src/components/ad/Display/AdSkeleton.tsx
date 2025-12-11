export default function AdSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="skeleton h-96 w-full rounded-3xl mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
              <div className="skeleton h-8 w-3/4 mb-4" />
              <div className="skeleton h-6 w-1/2 mb-6" />
              <div className="skeleton h-32 w-full mb-6" />
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="skeleton h-20 w-full" />
                <div className="skeleton h-20 w-full" />
              </div>
            </div>
          </div>

          <div className="skeleton h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
