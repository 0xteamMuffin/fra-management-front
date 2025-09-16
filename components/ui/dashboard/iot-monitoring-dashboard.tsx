"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SensorMetrics } from "./sensor-metrics"
import { EnvironmentalCharts } from "./environmental-charts"
import { SensorMap } from "./sensor-map"
import { AlertsPanel } from "./alerts-panel"
import { DeviceStatus } from "./device-status"
import { RefreshCw, Download, Settings, Activity, MapPin, Thermometer, Droplets, Battery } from 'lucide-react'

interface SensorData {
  id: string
  name: string
  location: { lat: number; lng: number }
  village: string
  soilMoisture: number
  groundwaterLevel: number
  temperature: number
  humidity: number
  batteryLevel: number
  lastUpdate: string
  status: "online" | "offline" | "warning"
}

export function IoTMonitoringDashboard() {
  const [selectedVillage, setSelectedVillage] = useState("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

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
  ])

  useEffect(() => {
    // Set initial client-only date
    setLastRefresh(new Date())
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSensorData((prev) =>
      prev.map((sensor) => ({
        ...sensor,
        soilMoisture: Math.max(0, Math.min(100, sensor.soilMoisture + (Math.random() - 0.5) * 5)),
        groundwaterLevel: Math.max(0, sensor.groundwaterLevel + (Math.random() - 0.5) * 2),
        temperature: Math.max(0, sensor.temperature + (Math.random() - 0.5) * 3),
        humidity: Math.max(0, Math.min(100, sensor.humidity + (Math.random() - 0.5) * 8)),
        lastUpdate: new Date().toISOString(),
      })),
    )

    setLastRefresh(new Date())
    setIsRefreshing(false)
  }

  const getFilteredSensors = () => {
    if (selectedVillage === "all") return sensorData
    return sensorData.filter((sensor) => sensor.village === selectedVillage)
  }

  const getStatusCounts = () => {
    const filtered = getFilteredSensors()
    return {
      online: filtered.filter((s) => s.status === "online").length,
      warning: filtered.filter((s) => s.status === "warning").length,
      offline: filtered.filter((s) => s.status === "offline").length,
      total: filtered.length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white">
        <div className="container mx-auto px-6 pt-8 border-b pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">IoT Environmental Monitoring</h1>
            <p className="text-muted-foreground text-balance">
              Real-time monitoring of environmental sensors across rural villages
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Village Filter</label>
              <Select value={selectedVillage} onValueChange={setSelectedVillage}>
                <SelectTrigger className="w-48">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select village" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Villages</SelectItem>
                  <SelectItem value="Kondagaon">Kondagaon</SelectItem>
                  <SelectItem value="Bastar">Bastar</SelectItem>
                  <SelectItem value="Dantewada">Dantewada</SelectItem>
                  <SelectItem value="Sukma">Sukma</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Time Range</label>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Last updated: {lastRefresh?.toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sensors</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent >
              <div className="text-3xl font-bold text-foreground mb-1">{statusCounts.total}</div>
              <p className="text-sm text-muted-foreground">Active monitoring devices</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Online</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-1">{statusCounts.online}</div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {statusCounts.total > 0 ? Math.round((statusCounts.online / statusCounts.total) * 100) : 0}% operational
                </p>
                <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                  Healthy
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warning</CardTitle>
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 mb-1">{statusCounts.warning}</div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Require attention</p>
                {statusCounts.warning > 0 && (
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
                    Alert
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Offline</CardTitle>
              <div className="p-2 bg-red-500/10 rounded-lg">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-1">{statusCounts.offline}</div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Need maintenance</p>
                {statusCounts.offline > 0 && (
                  <Badge variant="destructive" className="bg-red-500/10 text-red-700 border-red-200">
                    Critical
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-muted/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sensors" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Sensor Data
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              GPS Mapping
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <EnvironmentalCharts sensors={getFilteredSensors()} timeRange={selectedTimeRange} />
              </div>
              <div>
                <SensorMetrics sensors={getFilteredSensors()} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-6">
            <DeviceStatus sensors={getFilteredSensors()} />
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <SensorMap sensors={getFilteredSensors()} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel sensors={getFilteredSensors()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
