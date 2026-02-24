"use client";

import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useAdminSorting } from "@/hooks/use-admin-sorting";
import { useAdminPagination } from "@/hooks/use-admin-pagination";
import { useScransData } from "@/hooks/use-scrans-data";
import { useScranMutations } from "@/hooks/use-scran-mutations";
import type { Scran } from "@/types/scran";

type SortField = "id" | "name" | "price" | "numberOfLikes" | "numberOfDislikes" | "approved";
type SortOrder = "asc" | "desc";

interface UseAdminReturn {
  isAuthenticated: boolean;
  scrans: Scran[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  sortField: SortField;
  sortOrder: SortOrder;
  adminPassword: string;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  approveScran: (id: number) => Promise<void>;
  banScran: (id: number) => Promise<void>;
  handleSort: (field: SortField) => void;
  setCurrentPage: (page: number) => void;
  refresh: () => void;
}

export function useAdmin(): UseAdminReturn {
  // Compose smaller hooks
  const { isAuthenticated, adminPassword, login, logout } = useAdminAuth();
  const { sortField, sortOrder, handleSort } = useAdminSorting();
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    setTotalItems,
  } = useAdminPagination();

  // Data fetching with dependencies
  const { scrans, loading, refetch } = useScransData({
    isAuthenticated,
    adminPassword,
    currentPage,
    sortField,
    sortOrder,
    onUnauthorized: logout,
    onTotalItems: setTotalItems,
  });

  // Mutations
  const { approveScran, banScran } = useScranMutations({
    adminPassword,
    onUnauthorized: logout,
    onSuccess: refetch,
  });

  return {
    isAuthenticated,
    scrans,
    loading,
    currentPage,
    totalPages,
    sortField,
    sortOrder,
    adminPassword,
    login,
    logout,
    approveScran,
    banScran,
    handleSort,
    setCurrentPage,
    refresh: refetch,
  };
}
