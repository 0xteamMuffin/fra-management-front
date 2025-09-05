"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface SensorData {
  id: string
  name: string
  soilMoisture: number
  groundwaterLevel: number
  temperature: number
  humidity: number
}

interface EnvironmentalChartsProps {
  sensors: SensorData[]
  timeRange: string
}

export function EnvironmentalCharts({ sensors, timeRange }: EnvironmentalChartsProps) {
  // Generate mock historical data
  const generateHistoricalData = () => {
    const hours = timeRange === "1h" ? 1 : timeRange === "24h" ? 24 : timeRange === "7d" ? 168 : 720
    const interval = timeRange === "1h" ? 5 : timeRange === "24h" ? 60 : timeRange === "7d" ? 360 : 1440

    return Array.from({ length: Math.floor(hours * (60 / interval)) }, (_, i) => {
      const time = new Date(Date.now() - (hours * 60 - i * interval) * 60 * 1000)
      return {
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        soilMoisture: 35 + Math.sin(i * 0.1) * 10 + Math.random() * 5,
        groundwater: 12 + Math.cos(i * 0.05) * 3 + Math.random() * 2,
        temperature: 28 + Math.sin(i * 0.08) * 4 + Math.random() * 2,
        humidity: 65 + Math.cos(i * 0.12) * 15 + Math.random() * 5,
      }
    })
  }

  const historicalData = generateHistoricalData()

  return (
    <div className="space-y-4">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Soil Moisture Trends</CardTitle>
          <CardDescription>Real-time soil moisture levels across monitoring sites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="soilMoisture"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Groundwater Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line type="monotone" dataKey="groundwater" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Temperature & Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
