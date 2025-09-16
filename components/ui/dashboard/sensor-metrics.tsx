"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplets, Thermometer, Gauge, Battery } from "lucide-react"

interface SensorData {
  id: string
  name: string
  soilMoisture: number
  groundwaterLevel: number
  temperature: number
  humidity: number
  batteryLevel: number
  status: "online" | "offline" | "warning"
}

interface SensorMetricsProps {
  sensors: SensorData[]
}

export function SensorMetrics({ sensors }: SensorMetricsProps) {
  const getAverageValue = (field: keyof SensorData) => {
    const onlineSensors = sensors.filter((s) => s.status === "online")
    if (onlineSensors.length === 0) return 0
    const sum = onlineSensors.reduce((acc, sensor) => acc + (sensor[field] as number), 0)
    return sum / onlineSensors.length
  }

  const avgSoilMoisture = getAverageValue("soilMoisture")
  const avgGroundwater = getAverageValue("groundwaterLevel")
  const avgTemperature = getAverageValue("temperature")
  const avgHumidity = getAverageValue("humidity")

  const getSoilMoistureStatus = (value: number) => {
    if (value < 20) return { status: "Low", color: "text-red-600" }
    if (value < 40) return { status: "Moderate", color: "text-yellow-600" }
    return { status: "Good", color: "text-green-600" }
  }

  const getGroundwaterStatus = (value: number) => {
    if (value < 5) return { status: "Critical", color: "text-red-600" }
    if (value < 10) return { status: "Low", color: "text-yellow-600" }
    return { status: "Normal", color: "text-green-600" }
  }

  return (
    <div className="space-y-4">
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Environmental Metrics</CardTitle>
          <CardDescription>Average readings from active sensors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Soil Moisture */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Soil Moisture</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{avgSoilMoisture.toFixed(1)}%</div>
                <div className={`text-xs ${getSoilMoistureStatus(avgSoilMoisture).color}`}>
                  {getSoilMoistureStatus(avgSoilMoisture).status}
                </div>
              </div>
            </div>
            <Progress value={avgSoilMoisture} className="h-2" />
          </div>

          {/* Groundwater Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gauge className="h-4 w-4 text-cyan-500" />
                <span className="text-sm font-medium">Groundwater Level</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{avgGroundwater.toFixed(1)}m</div>
                <div className={`text-xs ${getGroundwaterStatus(avgGroundwater).color}`}>
                  {getGroundwaterStatus(avgGroundwater).status}
                </div>
              </div>
            </div>
            <Progress value={Math.min(100, (avgGroundwater / 20) * 100)} className="h-2" />
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{avgTemperature.toFixed(1)}°C</div>
                <div className="text-xs text-muted-foreground">Normal</div>
              </div>
            </div>
            <Progress value={Math.min(100, (avgTemperature / 50) * 100)} className="h-2" />
          </div>

          {/* Humidity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-teal-500" />
                <span className="text-sm font-medium">Humidity</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{avgHumidity.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Normal</div>
              </div>
            </div>
            <Progress value={avgHumidity} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Battery Status */}
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-base">Device Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sensors.map((sensor) => (
              <div key={sensor.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Battery
                    className={`h-4 w-4 ${
                      sensor.batteryLevel > 50
                        ? "text-green-500"
                        : sensor.batteryLevel > 20
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  />
                  <span className="text-sm">{sensor.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{sensor.batteryLevel}%</div>
                  <div
                    className={`w-16 h-1 rounded-full ${
                      sensor.batteryLevel > 50
                        ? "bg-green-500"
                        : sensor.batteryLevel > 20
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${Math.max(8, (sensor.batteryLevel / 100) * 64)}px` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
