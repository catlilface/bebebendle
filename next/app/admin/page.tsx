"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Scran } from "../../db/schema";

type SortField =
  | "id"
  | "name"
  | "price"
  | "numberOfLikes"
  | "numberOfDislikes"
  | "approved";
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
        },
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
      <div className="retro-bg flex min-h-dvh items-center justify-center">
        <div className="retro-overlay absolute inset-0" />
        <div className="pixel-container relative z-10 w-full max-w-md rounded-none border-4 border-black bg-white p-8">
          <h1 className="pixel-text mb-6 text-2xl font-bold text-black">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-black">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-none border-2 border-black bg-white px-4 py-2 text-black focus:border-yellow-400 focus:outline-none"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-sm font-bold text-red-600">{error}</p>}
            <button
              type="submit"
              className="pixel-btn w-full bg-yellow-400 px-4 py-2 text-lg font-bold text-black hover:bg-yellow-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

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
          <div className="pixel-container flex h-64 items-center justify-center rounded-none bg-zinc-900/80">
            <div className="pixel-text text-lg text-white">Loading...</div>
          </div>
        ) : (
          <>
            <div className="pixel-container overflow-hidden rounded-none border-4 border-black bg-zinc-900/80">
              <table className="w-full">
                <thead className="bg-zinc-800">
                  <tr>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-700"
                      onClick={() => handleSort("id")}
                    >
                      ID {getSortIcon("id")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Image
                    </th>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-700"
                      onClick={() => handleSort("name")}
                    >
                      Name {getSortIcon("name")}
                    </th>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-700"
                      onClick={() => handleSort("price")}
                    >
                      Price {getSortIcon("price")}
                    </th>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-700"
                      onClick={() => handleSort("numberOfLikes")}
                    >
                      Likes {getSortIcon("numberOfLikes")}
                    </th>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-700"
                      onClick={() => handleSort("numberOfDislikes")}
                    >
                      Dislikes {getSortIcon("numberOfDislikes")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Rating
                    </th>
                    <th
                      className="cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-700"
                      onClick={() => handleSort("approved")}
                    >
                      Status {getSortIcon("approved")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {scrans.map((scran) => (
                    <tr key={scran.id} className="hover:bg-zinc-800/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                        {scran.id}
                      </td>
                      <td className="px-6 py-4">
                        {scran.imageUrl && (
                          <img
                            src={scran.imageUrl}
                            alt={scran.name}
                            className="h-12 w-12 rounded-none border-2 border-black object-cover"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-white">
                          {scran.name}
                        </div>
                        {scran.description && (
                          <div className="text-xs text-zinc-400 line-clamp-1">
                            {scran.description}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                        {scran.price.toFixed(2)} ₽
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                        👍 {scran.numberOfLikes}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                        👎 {scran.numberOfDislikes}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-12 overflow-hidden rounded-none border border-zinc-600 bg-zinc-700">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${getLikesPercentage(scran)}%` }}
                            />
                          </div>
                          <span className="text-xs text-white">
                            {getLikesPercentage(scran)}%
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-none px-2 py-1 text-xs font-bold ${
                            scran.approved
                              ? "bg-green-500 text-white"
                              : "bg-yellow-400 text-black"
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
                              className="pixel-btn bg-green-500 px-3 py-1 text-sm font-bold text-white hover:bg-green-600"
                            >
                              Approve
                            </button>
                          )}
                          {scran.approved && (
                            <button
                              onClick={() => handleBan(scran.id)}
                              className="pixel-btn bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
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
                <div className="pixel-text text-sm text-white">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="pixel-btn bg-zinc-800 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pixel-btn px-4 py-2 text-sm font-bold ${
                          currentPage === page
                            ? "bg-yellow-400 text-black"
                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="pixel-btn bg-zinc-800 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700 disabled:opacity-50"
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
