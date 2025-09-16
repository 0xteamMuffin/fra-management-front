"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Wifi, WifiOff, AlertTriangle } from "lucide-react"

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

interface SensorMapProps {
  sensors: SensorData[]
}

export function SensorMap({ sensors }: SensorMapProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      default:
        return <MapPin className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "border-green-500 bg-green-500/10"
      case "warning":
        return "border-yellow-500 bg-yellow-500/10"
      case "offline":
        return "border-red-500 bg-red-500/10"
      default:
        return "border-muted bg-muted/10"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Visualization */}
      <div className="lg:col-span-2">
        <Card className="border-border bg-white">
          <CardHeader>
            <CardTitle className="text-lg">GPS Sensor Locations</CardTitle>
            <CardDescription>Real-time positioning and status of IoT monitoring devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-muted/20 rounded-lg overflow-hidden">
              {/* Mock Map Background */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Sensor Markers */}
              {sensors.map((sensor, index) => (
                <div
                  key={sensor.id}
                  className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${getStatusColor(
                    sensor.status,
                  )}`}
                  style={{
                    top: `${20 + index * 15}%`,
                    left: `${25 + index * 20}%`,
                  }}
                  title={`${sensor.name} - ${sensor.status}`}
                >
                  {getStatusIcon(sensor.status)}
                </div>
              ))}

              {/* Coordinate Display */}
              <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded px-3 py-2">
                <span className="text-xs text-muted-foreground">Bastar District, Chhattisgarh | Scale: 1:25,000</span>
              </div>

              {/* Legend */}
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded p-3">
                <h4 className="text-sm font-medium mb-2">Status Legend</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-3 w-3 text-green-500" />
                    <span className="text-xs">Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs">Warning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <WifiOff className="h-3 w-3 text-red-500" />
                    <span className="text-xs">Offline</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Details */}
      <div className="space-y-4">
        <Card className="border-border bg-white">
          <CardHeader>
            <CardTitle className="text-base">Sensor Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sensors.map((sensor) => (
                <div key={sensor.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{sensor.name}</h4>
                      <p className="text-xs text-muted-foreground">{sensor.village}</p>
                    </div>
                    <Badge
                      variant={
                        sensor.status === "online"
                          ? "default"
                          : sensor.status === "warning"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {sensor.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Lat:</span> {sensor.location.lat.toFixed(4)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lng:</span> {sensor.location.lng.toFixed(4)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Soil:</span> {sensor.soilMoisture.toFixed(1)}%
                    </div>
                    <div>
                      <span className="text-muted-foreground">Water:</span> {sensor.groundwaterLevel.toFixed(1)}m
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Last update: {new Date(sensor.lastUpdate).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
