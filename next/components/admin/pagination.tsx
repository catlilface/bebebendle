"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="pixel-text text-sm text-white">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="pixel-btn bg-zinc-800 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`pixel-btn px-4 py-2 text-sm font-bold ${
              currentPage === page
                ? "bg-yellow-400 text-black"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="pixel-btn bg-zinc-800 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
