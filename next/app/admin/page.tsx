"use client";

import { useAdmin } from "@/hooks/use-admin";
import { LoginForm } from "@/components/admin/login-form";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  const {
    isAuthenticated,
    scrans,
    loading,
    currentPage,
    totalPages,
    sortField,
    sortOrder,
    login,
    approveScran,
    banScran,
    handleSort,
    setCurrentPage,
  } = useAdmin();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <AdminDashboard
      scrans={scrans}
      loading={loading}
      currentPage={currentPage}
      totalPages={totalPages}
      sortField={sortField}
      sortOrder={sortOrder}
      onSort={handleSort}
      onPageChange={setCurrentPage}
      onApprove={approveScran}
      onBan={banScran}
    />
  );
}
