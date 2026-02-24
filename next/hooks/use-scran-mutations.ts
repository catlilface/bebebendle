"use client";

import { useCallback } from "react";

interface UseScranMutationsParams {
  adminPassword: string;
  onUnauthorized: () => void;
  onSuccess: () => void;
}

interface UseScranMutationsReturn {
  approveScran: (id: number) => Promise<void>;
  banScran: (id: number) => Promise<void>;
}

export function useScranMutations({
  adminPassword,
  onUnauthorized,
  onSuccess,
}: UseScranMutationsParams): UseScranMutationsReturn {
  const approveScran = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`/api/admin/scrans/${id}/approve`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminPassword}`,
          },
        });

        if (response.ok) {
          onSuccess();
        } else if (response.status === 401) {
          onUnauthorized();
        }
      } catch (error) {
        console.error("Error approving scran:", error);
      }
    },
    [adminPassword, onUnauthorized, onSuccess]
  );

  const banScran = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`/api/admin/scrans/${id}/ban`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminPassword}`,
          },
        });

        if (response.ok) {
          onSuccess();
        } else if (response.status === 401) {
          onUnauthorized();
        }
      } catch (error) {
        console.error("Error banning scran:", error);
      }
    },
    [adminPassword, onUnauthorized, onSuccess]
  );

  return {
    approveScran,
    banScran,
  };
}
