"use client";
import dynamic from "next/dynamic";

const DSSEnginePage = dynamic(
  () =>
    import("@/components/ui/dss/dss-engine").then((mod) => mod.DSSEnginePage),
  { ssr: false },
);

export default function DashboardsPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return <DSSEnginePage />;
}
