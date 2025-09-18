'use client';
import dynamic from 'next/dynamic';

const DSSEnginePage = dynamic(
  () => import('@/components/ui/dss/dss-engine').then(mod => mod.DSSEnginePage),
  { ssr: false }
)

export default function DashboardsPage() {
  return <DSSEnginePage />
}
