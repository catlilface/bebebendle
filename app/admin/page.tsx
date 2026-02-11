"use client";

import { useState, useEffect, useCallback } from "react";
import { Scran } from "../../db/schema";

type SortField = "id" | "name" | "price" | "numberOfLikes" | "numberOfDislikes" | "approved";
type SortOrder = "asc" | "desc";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [scrans, setScrans] = useState<Scran[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [adminPassword, setAdminPassword] = useState<string>("");
  const itemsPerPage = 10;

  const fetchScrans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/scrans?page=${currentPage}&limit=${itemsPerPage}&sort=${sortField}&order=${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${adminPassword}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setScrans(data.scrans);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        setAdminPassword("");
      }
    } catch (error) {
      console.error("Error fetching scrans:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortField, sortOrder, adminPassword]);

  useEffect(() => {
    if (isAuthenticated && adminPassword) {
      fetchScrans();
    }
  }, [isAuthenticated, fetchScrans]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setAdminPassword(password);
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("An error occurred");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/scrans/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      });
      if (response.ok) {
        fetchScrans();
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        setAdminPassword("");
      }
    } catch (error) {
      console.error("Error approving scran:", error);
    }
  };

  const handleBan = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/scrans/${id}/ban`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      });
      if (response.ok) {
        fetchScrans();
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        setAdminPassword("");
      }
    } catch (error) {
      console.error("Error banning scran:", error);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const getLikesPercentage = (scran: Scran): number => {
    const total = scran.numberOfLikes + scran.numberOfDislikes;
    if (total === 0) return 0;
    return Math.round((scran.numberOfLikes / total) * 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="mb-6 text-2xl font-bold text-black dark:text-zinc-50">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-black focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                placeholder="Enter admin password"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage scrans and approve submissions
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-lg text-zinc-600 dark:text-zinc-400">
              Loading...
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                  <tr>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      onClick={() => handleSort("id")}
                    >
                      ID {getSortIcon("id")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Image
                    </th>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      onClick={() => handleSort("name")}
                    >
                      Name {getSortIcon("name")}
                    </th>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      onClick={() => handleSort("price")}
                    >
                      Price {getSortIcon("price")}
                    </th>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      onClick={() => handleSort("numberOfLikes")}
                    >
                      Likes {getSortIcon("numberOfLikes")}
                    </th>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      onClick={() => handleSort("numberOfDislikes")}
                    >
                      Dislikes {getSortIcon("numberOfDislikes")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Rating
                    </th>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      onClick={() => handleSort("approved")}
                    >
                      Status {getSortIcon("approved")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {scrans.map((scran) => (
                    <tr
                      key={scran.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                        {scran.id}
                      </td>
                      <td className="px-6 py-4">
                        {scran.imageUrl && (
                          <img
                            src={scran.imageUrl}
                            alt={scran.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {scran.name}
                        </div>
                        {scran.description && (
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                            {scran.description}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                        {scran.price.toFixed(2)} ₽
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                        👍 {scran.numberOfLikes}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                        👎 {scran.numberOfDislikes}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-12 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                            <div
                              className="h-full rounded-full bg-green-500"
                              style={{ width: `${getLikesPercentage(scran)}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">
                            {getLikesPercentage(scran)}%
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            scran.approved
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {scran.approved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex gap-2">
                          {!scran.approved && (
                            <button
                              onClick={() => handleApprove(scran.id)}
                              className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-green-700"
                            >
                              Approve
                            </button>
                          )}
                          {scran.approved && (
                            <button
                              onClick={() => handleBan(scran.id)}
                              className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-red-700"
                            >
                              Ban
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
