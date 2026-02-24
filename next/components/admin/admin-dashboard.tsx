"use client";

import Link from "next/link";
import type { Scran } from "@/types/scran";
import { ScranTable } from "@/components/admin/scran-table";
import { Pagination } from "@/components/admin/pagination";

type SortField = "id" | "name" | "price" | "numberOfLikes" | "numberOfDislikes" | "approved";
type SortOrder = "asc" | "desc";

interface AdminDashboardProps {
  scrans: Scran[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onPageChange: (page: number) => void;
  onApprove: (id: number) => void;
  onBan: (id: number) => void;
}

function LoadingState() {
  return (
    <div className="pixel-container flex h-64 items-center justify-center rounded-none bg-zinc-900/80">
      <div className="pixel-text text-lg text-white">Loading...</div>
    </div>
  );
}

export function AdminDashboard({
  scrans,
  loading,
  currentPage,
  totalPages,
  sortField,
  sortOrder,
  onSort,
  onPageChange,
  onApprove,
  onBan,
}: AdminDashboardProps) {
  return (
    <div className="retro-bg min-h-dvh">
      <div className="retro-overlay absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="pixel-text text-3xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="pixel-text mt-2 text-white">
              Manage scrans and approve submissions
            </p>
          </div>
          <Link
            href="/"
            className="pixel-text text-xl font-bold text-white hover:text-yellow-300"
          >
            бебебендл
          </Link>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <>
            <ScranTable
              scrans={scrans}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={onSort}
              onApprove={onApprove}
              onBan={onBan}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
