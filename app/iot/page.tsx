import { IoTMonitoringDashboard } from "@/components/ui/dashboard/iot-monitoring-dashboard";

export default function DashboardsPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return <IoTMonitoringDashboard />;
}
