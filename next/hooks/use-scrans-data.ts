"use client";

import { useState, useCallback, useEffect } from "react";
import type { Scran } from "@/types/scran";

type SortField = "id" | "name" | "price" | "numberOfLikes" | "numberOfDislikes" | "approved";
type SortOrder = "asc" | "desc";

interface UseScransDataParams {
  isAuthenticated: boolean;
  adminPassword: string;
  currentPage: number;
  sortField: SortField;
  sortOrder: SortOrder;
  onUnauthorized: () => void;
  onTotalItems: (total: number) => void;
}

interface UseScransDataReturn {
  scrans: Scran[];
  loading: boolean;
  refetch: () => void;
}

export function useScransData({
  isAuthenticated,
  adminPassword,
  currentPage,
  sortField,
  sortOrder,
  onUnauthorized,
  onTotalItems,
}: UseScransDataParams): UseScransDataReturn {
  const [scrans, setScrans] = useState<Scran[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldRefetch, setShouldRefetch] = useState(0);

  const fetchScrans = useCallback(async () => {
    if (!isAuthenticated || !adminPassword) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/scrans?page=${currentPage}&limit=10&sort=${sortField}&order=${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${adminPassword}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setScrans(data.scrans);
        onTotalItems(data.total);
      } else if (response.status === 401) {
        onUnauthorized();
      }
    } catch (error) {
      console.error("Error fetching scrans:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, adminPassword, currentPage, sortField, sortOrder, onUnauthorized, onTotalItems]);

  useEffect(() => {
    if (isAuthenticated && adminPassword) {
      fetchScrans();
    }
  }, [isAuthenticated, fetchScrans, shouldRefetch]);

  const refetch = useCallback(() => {
    setShouldRefetch((prev) => prev + 1);
  }, []);

  return {
    scrans,
    loading,
    refetch,
  };
}
