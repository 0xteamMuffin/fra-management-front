"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SensorMetrics } from "./sensor-metrics";
import { EnvironmentalCharts } from "./environmental-charts";
import { SensorMap } from "./sensor-map";
import { AlertsPanel } from "./alerts-panel";
import { DeviceStatus } from "./device-status";
import {
  RefreshCw,
  Download,
  Settings,
  Activity,
  MapPin,
  Thermometer,
  Droplets,
  Battery,
} from "lucide-react";

interface SensorData {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  village: string;
  soilMoisture: number;
  groundwaterLevel: number;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  lastUpdate: string;
  status: "online" | "offline" | "warning";
}

export function IoTMonitoringDashboard() {
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Mock sensor data
  const [sensorData, setSensorData] = useState<SensorData[]>([
    {
      id: "IOT-001",
      name: "Kondagaon Sensor A",
      location: { lat: 19.076, lng: 82.1391 },
      village: "Kondagaon",
      soilMoisture: 45.2,
      groundwaterLevel: 12.8,
      temperature: 28.5,
      humidity: 65.3,
      batteryLevel: 87,
      lastUpdate: "2024-01-25T10:30:00Z",
      status: "online",
    },
    {
      id: "IOT-002",
      name: "Bastar Sensor B",
      location: { lat: 19.101, lng: 82.052 },
      village: "Bastar",
      soilMoisture: 32.1,
      groundwaterLevel: 8.4,
      temperature: 31.2,
      humidity: 58.7,
      batteryLevel: 23,
      lastUpdate: "2024-01-25T10:25:00Z",
      status: "warning",
    },
    {
      id: "IOT-003",
      name: "Dantewada Sensor C",
      location: { lat: 18.895, lng: 81.354 },
      village: "Dantewada",
      soilMoisture: 28.9,
      groundwaterLevel: 15.2,
      temperature: 29.8,
      humidity: 72.1,
      batteryLevel: 0,
      lastUpdate: "2024-01-24T18:45:00Z",
      status: "offline",
    },
    {
      id: "IOT-004",
      name: "Sukma Sensor D",
      location: { lat: 18.387, lng: 82.064 },
      village: "Sukma",
      soilMoisture: 52.7,
      groundwaterLevel: 18.6,
      temperature: 26.9,
      humidity: 78.4,
      batteryLevel: 94,
      lastUpdate: "2024-01-25T10:32:00Z",
      status: "online",
    },
  ]);

  useEffect(() => {
    // Set initial client-only date
    setLastRefresh(new Date());
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSensorData((prev) =>
      prev.map((sensor) => ({
        ...sensor,
        soilMoisture: Math.max(
          0,
          Math.min(100, sensor.soilMoisture + (Math.random() - 0.5) * 5),
        ),
        groundwaterLevel: Math.max(
          0,
          sensor.groundwaterLevel + (Math.random() - 0.5) * 2,
        ),
        temperature: Math.max(
          0,
          sensor.temperature + (Math.random() - 0.5) * 3,
        ),
        humidity: Math.max(
          0,
          Math.min(100, sensor.humidity + (Math.random() - 0.5) * 8),
        ),
        lastUpdate: new Date().toISOString(),
      })),
    );

    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const getFilteredSensors = () => {
    if (selectedVillage === "all") return sensorData;
    return sensorData.filter((sensor) => sensor.village === selectedVillage);
  };

  const getStatusCounts = () => {
    const filtered = getFilteredSensors();
    return {
      online: filtered.filter((s) => s.status === "online").length,
      warning: filtered.filter((s) => s.status === "warning").length,
      offline: filtered.filter((s) => s.status === "offline").length,
      total: filtered.length,
    };
  };

  const statusCounts = getStatusCounts();
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto p-6 sm:p-8">
          <h1 className="text-4xl font-bold mb-2">
            IoT Environmental Monitoring
          </h1>
          <p className="text-green-100 text-lg">
            Real-time monitoring of environmental sensors across rural villages
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">        {/* Controls Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-green-700">
                  Village Filter
                </label>
                <Select
                  value={selectedVillage}
                  onValueChange={setSelectedVillage}
                >
                  <SelectTrigger className="w-48 border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg">
                    <MapPin className="mr-2 h-4 w-4 text-green-600" />
                    <SelectValue placeholder="Select village" />
                  </SelectTrigger>
                  <SelectContent className="border-green-200">
                    <SelectItem value="all">All Villages</SelectItem>
                    <SelectItem value="Kondagaon">Kondagaon</SelectItem>
                    <SelectItem value="Bastar">Bastar</SelectItem>
                    <SelectItem value="Dantewada">Dantewada</SelectItem>
                    <SelectItem value="Sukma">Sukma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-green-700">
                  Time Range
                </label>
                <Select
                  value={selectedTimeRange}
                  onValueChange={setSelectedTimeRange}
                >
                  <SelectTrigger className="w-36 border-green-200 focus:border-green-500 focus:ring-green-200 rounded-lg">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent className="border-green-200">
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Last updated: {lastRefresh?.toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 rounded-lg transition-all duration-200"
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 rounded-lg transition-all duration-200">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-all duration-200">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-blue-700">Total Sensors</h3>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-800 mb-2">
              {statusCounts.total}
            </div>
            <p className="text-sm text-blue-600">
              Active monitoring devices
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-green-700">Online</h3>
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-800 mb-2">
              {statusCounts.online}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-green-600">
                {statusCounts.total > 0
                  ? Math.round(
                      (statusCounts.online / statusCounts.total) * 100,
                    )
                  : 0}
                % operational
              </p>
              <Badge className="bg-green-100 text-green-800 border-green-300 rounded-full px-2 py-1 text-xs">
                Healthy
              </Badge>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-yellow-700">Warning</h3>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 rounded-full" />
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-800 mb-2">
              {statusCounts.warning}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-yellow-600">
                Require attention
              </p>
              {statusCounts.warning > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 rounded-full px-2 py-1 text-xs">
                  Alert
                </Badge>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-red-700">Offline</h3>
              <div className="p-3 bg-red-100 rounded-lg">
                <div className="w-6 h-6 bg-red-500 rounded-full" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-800 mb-2">
              {statusCounts.offline}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-red-600">
                Need maintenance
              </p>
              {statusCounts.offline > 0 && (
                <Badge className="bg-red-100 text-red-800 border-red-300 rounded-full px-2 py-1 text-xs">
                  Critical
                </Badge>
              )}
            </div>
          </div>
        </div>        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          <Tabs defaultValue="overview" className="space-y-0">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
              <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-white/20 rounded-lg">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm text-white font-medium rounded-md transition-all duration-200"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="sensors"
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm text-white font-medium rounded-md transition-all duration-200"
                >
                  Sensor Data
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm text-white font-medium rounded-md transition-all duration-200"
                >
                  GPS Mapping
                </TabsTrigger>
                <TabsTrigger
                  value="alerts"
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm text-white font-medium rounded-md transition-all duration-200"
                >
                  Alerts
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 bg-gradient-to-br from-white to-green-50">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <EnvironmentalCharts
                      sensors={getFilteredSensors()}
                      timeRange={selectedTimeRange}
                    />
                  </div>
                  <div>
                    <SensorMetrics sensors={getFilteredSensors()} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sensors" className="space-y-6 mt-0">
                <DeviceStatus sensors={getFilteredSensors()} />
              </TabsContent>

              <TabsContent value="map" className="space-y-6 mt-0">
                <SensorMap sensors={getFilteredSensors()} />
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6 mt-0">
                <AlertsPanel sensors={getFilteredSensors()} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
