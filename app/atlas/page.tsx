"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const Map = dynamic(() => import("@/components/ui/atlas/atlas-view"), { ssr: false });
export default function AtlasPage() {
  return <Map />
}
