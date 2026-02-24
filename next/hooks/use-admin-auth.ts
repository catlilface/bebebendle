"use client";

import { useState, useCallback } from "react";

interface UseAdminAuthReturn {
  isAuthenticated: boolean;
  adminPassword: string;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setAdminPassword(password);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAdminPassword("");
  }, []);

  return {
    isAuthenticated,
    adminPassword,
    login,
    logout,
  };
}
