"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api-client";
import {
  Shield,
  User,
  Mail,
  Lock,
  Phone,
  CheckCircle,
  AlertCircle,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

interface SetupStatus {
  needsSetup: boolean;
  hasAdmin: boolean;
  totalUsers: number;
  adminUsers: number;
}

export default function SetupPage() {
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "System Administrator",
    email: "admin@fra.gov.in",
    password: "admin123",
    phone: "+91-9999999999",
  });

  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await api.get<SetupStatus>("/setup/status");
      setSetupStatus(response.data);

      // If setup is not needed, redirect to login
      if (!response.data.needsSetup && response.data.hasAdmin) {
        toast.info("System already configured. Redirecting to login...");
        router.push("/login/govt");
        return;
      }
    } catch (error) {
      console.error("Failed to check setup status:", error);
      toast.error("Failed to check system status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);

    try {
      const response = await api.post("/setup/admin", formData);

      if (response.data.token) {
        toast.success("Admin user created successfully!");

        // Auto-login the new admin
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user_data", JSON.stringify(response.data.user));
        await login({
          email: response.data.user.email,
          password: formData.password,
        });

        // Redirect to admin panel
        router.push("/admin");
      }
    } catch (error: any) {
      console.error("Failed to create admin:", error);
      toast.error(
        error.response?.data?.message || "Failed to create admin user",
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg text-muted-foreground">
            Checking system status...
          </p>
        </div>
      </div>
    );
  }

  if (!setupStatus?.needsSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <CardTitle>System Already Configured</CardTitle>
            <CardDescription>
              The system has been set up and admin users exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Total Users: {setupStatus?.totalUsers || 0}</p>
              <p>• Admin Users: {setupStatus?.adminUsers || 0}</p>
            </div>
            <Button
              onClick={() => router.push("/login/govt")}
              className="w-full mt-4"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Settings className="w-12 h-12 text-green-600 mr-3" />
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">FRA System Setup</h1>
          <p className="text-gray-600 mt-2">
            Create the first administrator account to get started
          </p>
        </div>

        {/* Setup Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Create Administrator Account
            </CardTitle>
            <CardDescription>
              This will be the primary admin account with full system access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter email address"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter password"
                  required
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 6 characters recommended
                </p>
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">
                      Important Notes:
                    </p>
                    <ul className="text-blue-800 space-y-1 text-xs">
                      <li>
                        • This account will have full administrative privileges
                      </li>
                      <li>
                        • You can create additional users later through the
                        admin panel
                      </li>
                      <li>
                        • Please change the default password after first login
                      </li>
                      <li>• Keep these credentials secure</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isCreating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Administrator...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Create Administrator
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Forest Rights Act Management System</p>
          <p className="text-xs mt-1">Initial Setup • Version 1.0</p>
        </div>
      </div>
    </div>
  );
}
