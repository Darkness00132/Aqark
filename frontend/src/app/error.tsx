"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-40">
      <h2 className="text-2xl font-bold text-error">حدث خطـا</h2>
      <p className="mt-2 text-error mb-2 ">{error.message}</p>
      <button onClick={() => reset()} className="btn btn-error">
        حاول مرة أخرى
      </button>
    </div>
  );
}
