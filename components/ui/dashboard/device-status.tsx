"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, AlertTriangle, Battery, MapPin, Settings } from "lucide-react"

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

interface DeviceStatusProps {
  sensors: SensorData[]
}

export function DeviceStatus({ sensors }: DeviceStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      default:
        return <WifiOff className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Online
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Warning
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Offline
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600"
    if (level > 20) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Device Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((sensor) => (
          <Card key={sensor.id} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{sensor.name}</CardTitle>
                  <CardDescription className="text-sm">{sensor.village}</CardDescription>
                </div>
                {getStatusIcon(sensor.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(sensor.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Battery</span>
                  <span className={`font-medium ${getBatteryColor(sensor.batteryLevel)}`}>{sensor.batteryLevel}%</span>
                </div>
                <Progress value={sensor.batteryLevel} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Soil:</span>
                  <div className="font-medium">{sensor.soilMoisture.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Water:</span>
                  <div className="font-medium">{sensor.groundwaterLevel.toFixed(1)}m</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Temp:</span>
                  <div className="font-medium">{sensor.temperature.toFixed(1)}°C</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Humidity:</span>
                  <div className="font-medium">{sensor.humidity.toFixed(1)}%</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                  <Settings className="mr-2 h-3 w-3" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Device Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Device Management</CardTitle>
          <CardDescription>Detailed status and configuration of all monitoring devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Soil Moisture</TableHead>
                  <TableHead>Groundwater</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sensors.map((sensor) => (
                  <TableRow key={sensor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sensor.name}</div>
                        <div className="text-sm text-muted-foreground">{sensor.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{sensor.village}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sensor.location.lat.toFixed(4)}, {sensor.location.lng.toFixed(4)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(sensor.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Battery className={`h-4 w-4 ${getBatteryColor(sensor.batteryLevel)}`} />
                        <span className={`text-sm font-medium ${getBatteryColor(sensor.batteryLevel)}`}>
                          {sensor.batteryLevel}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{sensor.soilMoisture.toFixed(1)}%</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{sensor.groundwaterLevel.toFixed(1)}m</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{new Date(sensor.lastUpdate).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
