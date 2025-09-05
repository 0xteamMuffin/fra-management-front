"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface VerificationStatsProps {
  pending: number
  underReview: number
  approved: number
  rejected: number
}

export function VerificationStats({ pending, underReview, approved, rejected }: VerificationStatsProps) {
  const total = pending + underReview + approved + rejected

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Under Review */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Under Review</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-800">{underReview}</div>
          <CardDescription className="text-xs text-green-600">
            {total > 0 ? `${Math.round((underReview / total) * 100)}% of total` : "No claims"}
          </CardDescription>
        </CardContent>
      </Card>

      {/* Approved */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Approved</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{approved}</div>
          <CardDescription className="text-xs text-green-600">
            {total > 0 ? `${Math.round((approved / total) * 100)}% of total` : "No claims"}
          </CardDescription>
        </CardContent>
      </Card>

      {/* Pending */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-700">{pending}</div>
          <CardDescription className="text-xs text-green-600">
            {total > 0 ? `${Math.round((pending / total) * 100)}% of total` : "No claims"}
          </CardDescription>
        </CardContent>
      </Card>

      {/* Rejected */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Rejected</CardTitle>
          <XCircle className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{rejected}</div>
          <CardDescription className="text-xs text-green-600">
            {total > 0 ? `${Math.round((rejected / total) * 100)}% of total` : "No claims"}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
