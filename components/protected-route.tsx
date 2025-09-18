"use client";

import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/lib/types/api";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();

  // Show loading state
  if (isLoading) {
    return <LoadingPage message="Checking authentication..." />;
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="max-w-md text-center p-6">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this page.
          </p>
          <div className="space-x-4">
            <Link href="/login/govt">
              <Button className="bg-green-600 hover:bg-green-700">
                Login as Government Official
              </Button>
            </Link>
            <Link href="/login/citizen">
              <Button variant="outline">Login as Citizen</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="max-w-md text-center p-6">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-2">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Required roles: {allowedRoles.join(", ")}
            <br />
            Your role: {user?.role}
          </p>
          <Link href="/dashboard/u">
            <Button variant="outline">Go to Your Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}

// Convenience wrapper for specific role protections
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.DistrictCommittee]}>
      {children}
    </ProtectedRoute>
  );
}

export function OfficialRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      allowedRoles={[
        UserRole.GramSabha,
        UserRole.SubDivisionalCommittee,
        UserRole.DistrictCommittee,
      ]}
    >
      {children}
    </ProtectedRoute>
  );
}
