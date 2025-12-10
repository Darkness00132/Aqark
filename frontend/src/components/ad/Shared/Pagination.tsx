"use client";

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) {
  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    pages.push(1);
    if (currentPage > 4) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-20">
      {getPages().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="btn btn-md btn-disabled cursor-default">
            ...
          </span>
        ) : (
          <button
            key={idx}
            className={`btn btn-md ${
              page === currentPage ? "btn-primary text-white" : "btn-outline"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
}
