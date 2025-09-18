"use client";

import React, { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { ApiError } from "@/components/ui/error-boundary";
import { AdminRoute } from "@/components/protected-route";
import { useApi } from "@/lib/hooks/useApi";
import { adminService, type AdminStats } from "@/lib/api/admin.service";
import { geographicService } from "@/lib/api";
import { UserRole } from "@/lib/types/api";
import {
  Database,
  Users,
  MapPin,
  Building2,
  TreePine,
  Upload,
  Download,
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import {
  AddStateModal,
  AddDistrictModal,
  AddVillageModal,
} from "@/components/admin/modals";

export default function AdminPanelPage() {
  return (
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  );
}

function AdminPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API hooks
  const {
    execute: getStats,
    isLoading: statsLoading,
    error: statsError,
  } = useApi(adminService.getStats);

  const { execute: quickSetup, isLoading: setupLoading } = useApi(
    adminService.quickSetup,
  );

  const { execute: seedStates, isLoading: statesLoading } = useApi(
    adminService.seedIndianStates,
  );

  const { execute: createUser, isLoading: userLoading } = useApi(
    adminService.createUser,
  );

  // Load initial data
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      console.log("Loading admin stats...");
      const data = await getStats();
      console.log("Admin stats result:", data);
      if (data) {
        setStats(data);
      }
      setError(null);
    } catch (err: any) {
      console.error("Load stats error:", err);
      setError(err.message || "Failed to load admin statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSetup = async () => {
    try {
      console.log("Starting quick setup...");
      const result = await quickSetup();
      console.log("Quick setup result:", result);
      if (result) {
        toast.success(
          `Quick setup completed! Created ${result.results.states} states, ${result.results.districts} districts, ${result.results.villages} villages, and ${result.results.users} users.`,
        );
        await loadStats(); // Refresh stats
      }
    } catch (error: any) {
      console.error("Quick setup error:", error);
      toast.error(error.message || "Quick setup failed");
    }
  };

  const handleSeedStates = async () => {
    try {
      console.log("Starting seed states...");
      const states = await seedStates();
      console.log("Seed states result:", states);
      if (states) {
        toast.success(`Successfully created ${states.length} Indian states`);
        await loadStats();
      }
    } catch (error: any) {
      console.error("Seed states error:", error);
      toast.error(error.message || "Failed to seed states");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-lg">Loading admin panel...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage system data, users, and configuration
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <ApiError error={error} onRetry={loadStats} className="mb-6" />
        )}

        {/* Quick Actions */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Quick Setup
            </CardTitle>
            <CardDescription>
              Get started quickly by seeding essential data for the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleQuickSetup}
                disabled={setupLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {setupLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Database className="w-4 h-4 mr-2" />
                )}
                Complete Setup
              </Button>
              <Button
                onClick={handleSeedStates}
                disabled={statesLoading}
                variant="outline"
              >
                {statesLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <MapPin className="w-4 h-4 mr-2" />
                )}
                Seed States Only
              </Button>
              <Button onClick={loadStats} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Stats
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="States"
            value={stats?.states || 0}
            icon={MapPin}
            color="blue"
            description="Indian states and UTs"
          />
          <StatCard
            title="Districts"
            value={stats?.districts || 0}
            icon={Building2}
            color="green"
            description="District boundaries"
          />
          <StatCard
            title="Villages"
            value={stats?.villages || 0}
            icon={TreePine}
            color="amber"
            description="Village locations"
          />
          <StatCard
            title="Users"
            value={stats?.users || 0}
            icon={Users}
            color="purple"
            description="System users"
          />
          <StatCard
            title="FRA Claims"
            value={stats?.claims || 0}
            icon={FileSpreadsheet}
            color="teal"
            description="Filed claims"
          />
          <StatCard
            title="Schemes"
            value={stats?.schemes || 0}
            icon={BarChart3}
            color="pink"
            description="Government schemes"
          />
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="geographic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="geographic">Geographic Data</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="schemes">Schemes</TabsTrigger>
            <TabsTrigger value="import-export">Import/Export</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="geographic">
            <GeographicManagement onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="schemes">
            <SchemeManagement onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="import-export">
            <ImportExportManagement />
          </TabsContent>

          <TabsContent value="system">
            <SystemManagement stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Utility Components
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  description,
}: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    teal: "bg-teal-100 text-teal-800 border-teal-200",
    pink: "bg-pink-100 text-pink-800 border-pink-200",
  };

  return (
    <Card
      className={`border ${colorClasses[color as keyof typeof colorClasses]} bg-opacity-50`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

// Management Components
function GeographicManagement({
  onStatsUpdate,
}: {
  onStatsUpdate: () => void;
}) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [showAddState, setShowAddState] = useState(false);
  const [showAddDistrict, setShowAddDistrict] = useState(false);
  const [showAddVillage, setShowAddVillage] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  // API hooks
  const { execute: getAllStates } = useApi(geographicService.states.getAll);
  const { execute: getAllDistricts } = useApi(
    geographicService.districts.getAll,
  );
  const { execute: createState } = useApi(adminService.bulkCreateStates);
  const { execute: createDistrict } = useApi(adminService.bulkCreateDistricts);
  const { execute: createVillage } = useApi(adminService.bulkCreateVillages);

  // Load states and districts on mount
  useEffect(() => {
    loadStates();
    loadDistricts();
  }, []);

  const loadStates = async () => {
    try {
      const data = await getAllStates();
      if (data) setStates(data);
    } catch (error) {
      console.error("Failed to load states:", error);
      setStates([]);
    }
  };

  const loadDistricts = async () => {
    try {
      const data = await getAllDistricts();
      if (data) setDistricts(data);
    } catch (error) {
      console.error("Failed to load districts:", error);
      setDistricts([]);
    }
  };

  const handleAddState = async (stateData: { name: string; code: string }) => {
    try {
      const result = await createState({ states: [stateData] });
      if (result) {
        toast.success(`State "${stateData.name}" created successfully`);
        setShowAddState(false);
        await loadStates();
        onStatsUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create state");
    }
  };

  const handleAddDistrict = async (districtData: {
    name: string;
    code: string;
    stateId: string;
  }) => {
    try {
      const result = await createDistrict({
        districts: [
          {
            ...districtData,
            boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }),
          },
        ],
      });
      if (result) {
        toast.success(`District "${districtData.name}" created successfully`);
        setShowAddDistrict(false);
        await loadDistricts();
        onStatsUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create district");
    }
  };

  const handleAddVillage = async (villageData: {
    name: string;
    districtId: string;
  }) => {
    try {
      const result = await createVillage({
        villages: [
          {
            ...villageData,
            coordinates: JSON.stringify({ type: "Point", coordinates: [0, 0] }),
            boundary: JSON.stringify({ type: "Polygon", coordinates: [[]] }),
          },
        ],
      });
      if (result) {
        toast.success(`Village "${villageData.name}" created successfully`);
        setShowAddVillage(false);
        onStatsUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create village");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Geographic Data Management</CardTitle>
          <CardDescription>
            Manage states, districts, and villages data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => setShowAddState(true)}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Add State
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => setShowAddDistrict(true)}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Add District
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => setShowAddVillage(true)}
            >
              <TreePine className="w-4 h-4 mr-2" />
              Add Village
            </Button>
          </div>

          <div className="text-sm text-muted-foreground bg-yellow-50 p-4 rounded border">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Use "Complete Setup" above to quickly seed all Indian states, Odisha
            districts, and sample villages.
          </div>
        </CardContent>
      </Card>

      {/* Add State Modal */}
      {showAddState && (
        <AddStateModal
          onClose={() => setShowAddState(false)}
          onSubmit={handleAddState}
        />
      )}

      {/* Add District Modal */}
      {showAddDistrict && (
        <AddDistrictModal
          states={states}
          onClose={() => setShowAddDistrict(false)}
          onSubmit={handleAddDistrict}
        />
      )}

      {/* Add Village Modal */}
      {showAddVillage && (
        <AddVillageModal
          districts={districts}
          onClose={() => setShowAddVillage(false)}
          onSubmit={handleAddVillage}
        />
      )}
    </div>
  );
}

function UserManagement({ onStatsUpdate }: { onStatsUpdate: () => void }) {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: UserRole.VillagePerson,
    phone: "",
  });

  const { execute: createUser, isLoading: creating } = useApi(
    adminService.createUser,
  );

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const user = await createUser({
        ...newUser,
        phone: newUser.phone || undefined,
      });

      if (user) {
        toast.success(`User ${user.name} created successfully`);
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: UserRole.VillagePerson,
          phone: "",
        });
        onStatsUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <CardDescription>
            Add new users with different role permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="role">Role *</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      role: e.target.value as UserRole,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value={UserRole.VillagePerson}>Village Person</option>
                  <option value={UserRole.GramSabha}>Gram Sabha</option>
                  <option value={UserRole.SubDivisionalCommittee}>
                    Sub Divisional Committee
                  </option>
                  <option value={UserRole.DistrictCommittee}>
                    District Committee
                  </option>
                </select>
              </div>
            </div>

            <Button type="submit" disabled={creating} className="w-full">
              {creating ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Users className="w-4 h-4 mr-2" />
              )}
              Create User
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SchemeManagement({ onStatsUpdate }: { onStatsUpdate: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Government Schemes</CardTitle>
        <CardDescription>
          Manage government schemes and eligibility criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-4" />
          <p>Scheme management will be implemented here</p>
          <p className="text-sm">
            Configure schemes, eligibility, and assignments
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ImportExportManagement() {
  const { execute: exportData } = useApi(adminService.exportData);

  const handleExport = async () => {
    try {
      const blob = await exportData();
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fra_data_export_${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Data exported successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Export failed");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.csv";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          // TODO: Implement import endpoint
          toast.info("Import functionality coming soon");
        } catch (error: any) {
          toast.error(error.message || "Import failed");
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Export system data for backup or analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Import</CardTitle>
          <CardDescription>Import data from CSV or JSON files</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SystemManagement({ stats }: { stats: AdminStats | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Information</CardTitle>
        <CardDescription>System status and configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span>Database Status:</span>
            <Badge variant="outline" className="text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Total Records:</span>
            <span>
              {stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
