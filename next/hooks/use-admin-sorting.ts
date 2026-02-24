"use client";

import { useState, useCallback } from "react";

type SortField = "id" | "name" | "price" | "numberOfLikes" | "numberOfDislikes" | "approved";
type SortOrder = "asc" | "desc";

interface UseAdminSortingReturn {
  sortField: SortField;
  sortOrder: SortOrder;
  handleSort: (field: SortField) => void;
  getSortParams: () => { sort: SortField; order: SortOrder };
}

export function useAdminSorting(): UseAdminSortingReturn {
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("desc");
      }
    },
    [sortField]
  );

  const getSortParams = useCallback(
    () => ({
      sort: sortField,
      order: sortOrder,
    }),
    [sortField, sortOrder]
  );

  return {
    sortField,
    sortOrder,
    handleSort,
    getSortParams,
  };
}
