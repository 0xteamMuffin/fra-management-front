"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
} from "lucide-react";

interface SensorData {
  id: string;
  name: string;
  village: string;
  soilMoisture: number;
  groundwaterLevel: number;
  batteryLevel: number;
  status: "online" | "offline" | "warning";
}

interface AlertsPanelProps {
  sensors: SensorData[];
}

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  sensorId: string;
  sensorName: string;
  timestamp: string;
  acknowledged: boolean;
}

export function AlertsPanel({ sensors }: AlertsPanelProps) {
  // Generate alerts based on sensor data
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    sensors.forEach((sensor) => {
      // Low battery alerts
      if (sensor.batteryLevel < 20) {
        alerts.push({
          id: `battery-${sensor.id}`,
          type: sensor.batteryLevel < 10 ? "critical" : "warning",
          title: "Low Battery Level",
          description: `Battery level at ${sensor.batteryLevel}%. Device may go offline soon.`,
          sensorId: sensor.id,
          sensorName: sensor.name,
          timestamp: new Date().toISOString(),
          acknowledged: false,
        });
      }

      // Soil moisture alerts
      if (sensor.soilMoisture < 20) {
        alerts.push({
          id: `soil-${sensor.id}`,
          type: sensor.soilMoisture < 10 ? "critical" : "warning",
          title: "Low Soil Moisture",
          description: `Soil moisture at ${sensor.soilMoisture.toFixed(1)}%. Irrigation may be needed.`,
          sensorId: sensor.id,
          sensorName: sensor.name,
          timestamp: new Date().toISOString(),
          acknowledged: false,
        });
      }

      // Groundwater alerts
      if (sensor.groundwaterLevel < 5) {
        alerts.push({
          id: `water-${sensor.id}`,
          type: "critical",
          title: "Critical Groundwater Level",
          description: `Groundwater level at ${sensor.groundwaterLevel.toFixed(1)}m. Immediate attention required.`,
          sensorId: sensor.id,
          sensorName: sensor.name,
          timestamp: new Date().toISOString(),
          acknowledged: false,
        });
      }

      // Offline sensor alerts
      if (sensor.status === "offline") {
        alerts.push({
          id: `offline-${sensor.id}`,
          type: "warning",
          title: "Sensor Offline",
          description:
            "Device is not responding. Check connectivity and power supply.",
          sensorId: sensor.id,
          sensorName: sensor.name,
          timestamp: new Date().toISOString(),
          acknowledged: false,
        });
      }
    });

    return alerts.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  };

  const alerts = generateAlerts();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical":
        return (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-yellow-100 text-yellow-800"
          >
            Warning
          </Badge>
        );
      case "info":
        return (
          <Badge variant="outline" className="text-xs">
            Info
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Unknown
          </Badge>
        );
    }
  };

  const criticalAlerts = alerts.filter((a) => a.type === "critical").length;
  const warningAlerts = alerts.filter((a) => a.type === "warning").length;

  return (
    <div className="space-y-4">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Alerts
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalAlerts}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Warning Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {warningAlerts}
            </div>
            <p className="text-xs text-muted-foreground">Need monitoring</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {alerts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Active Alerts</CardTitle>
          <CardDescription>
            Real-time notifications from monitoring devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">
                No active alerts. All systems operating normally.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg ${
                    alert.type === "critical"
                      ? "border-red-200 bg-red-50/50"
                      : alert.type === "warning"
                        ? "border-yellow-200 bg-yellow-50/50"
                        : "border-blue-200 bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          {getAlertBadge(alert.type)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Sensor: {alert.sensorName}</span>
                          <span>
                            Time:{" "}
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-transparent"
                      >
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
