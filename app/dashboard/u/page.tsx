"use client";

import React from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileStack,
  CheckCircle2,
  Loader2,
  XCircle,
  Eye,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useClaims } from "@/lib/hooks/useClaims";
import { LoadingPage } from "@/components/ui/loading";
import { ApiError } from "@/components/ui/error-boundary";
import {
  generateClaimDisplayId,
  mapBackendStatusToUI,
  mapFRATypeToUI,
} from "@/lib/utils/claim-helpers";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useTranslation } from "react-i18next"; // Import the hook

const statusConfig: {
  [key: string]: {
    icon?: React.ElementType;
    className: string;
    textColor: string;
  };
} = {
  // These keys MUST match the output of mapBackendStatusToUI
  Approved: {
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800",
    textColor: "text-green-800",
  },
  "Under SDLC Review": {
    icon: Loader2,
    className: "bg-yellow-100 text-yellow-800",
    textColor: "text-yellow-800",
  },
  "Under DLC Review": {
    icon: Loader2,
    className: "bg-orange-100 text-orange-800",
    textColor: "text-orange-800",
  },
  "Awaiting FRC Verification": {
    className: "bg-blue-100 text-blue-800",
    textColor: "text-blue-800",
  },
  Rejected: {
    icon: XCircle,
    className: "bg-red-100 text-red-800",
    textColor: "text-red-800",
  },
};

// Maps the status string to a stable i18n key
const statusKeyMap: { [key: string]: string } = {
  Approved: "statusApproved",
  "Under SDLC Review": "statusUnderSdlcReview",
  "Under DLC Review": "statusUnderDlcReview",
  "Awaiting FRC Verification": "statusAwaitingFrc",
  Rejected: "statusRejected",
};

const UserDashboardPage = () => {
  const { t } = useTranslation(); // Initialize the translation function
  const { user } = useAuth();
  const { rawClaims, isLoading, error, refreshClaims } = useClaims({
    autoFetch: true,
  });

  if (isLoading) {
    return <LoadingPage message={t("fetchingClaims")} />;
  }

  if (error) {
    return <ApiError error={error} onRetry={refreshClaims} />;
  }
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto p-6 sm:p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {t("welcomeBack", { name: user?.name.split(" ")[0] })}
                </h1>
                <p className="text-green-100 text-lg">
                  {t("claimsSummaryDescription")}
                </p>
              </div>
              <Button 
                onClick={() => (window.location.href = "/claims/new")}
                className="bg-white text-green-600 hover:bg-green-50 hover:text-green-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                {t("submitNewClaim")}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">          {/* Custom Card Component */}
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center gap-3 text-white">
                <FileStack className="w-7 h-7" />
                <div>
                  <h2 className="text-2xl font-bold">
                    {t("yourClaimsCount", { count: rawClaims.length })}
                  </h2>
                  <p className="text-green-100 mt-1">{t("claimsListDescription")}</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 bg-gradient-to-br from-white to-green-50">
              {rawClaims.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-green-200">
                        <TableHead className="text-green-700 font-semibold">{t("tableHeaderClaimId")}</TableHead>
                        <TableHead className="text-green-700 font-semibold">{t("tableHeaderType")}</TableHead>
                        <TableHead className="text-green-700 font-semibold">{t("tableHeaderSubmittedOn")}</TableHead>
                        <TableHead className="text-green-700 font-semibold">{t("tableHeaderStatus")}</TableHead>
                        <TableHead className="text-right text-green-700 font-semibold">
                          {t("tableHeaderActions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rawClaims.map((claim) => {
                        const uiStatus = mapBackendStatusToUI(claim.status);
                        const status = statusConfig[uiStatus];
                        const statusI18nKey = statusKeyMap[uiStatus] || uiStatus;
                        return (
                          <TableRow key={claim.id} className="hover:bg-green-50/50 border-green-100">
                            <TableCell className="font-medium text-green-800">
                              {generateClaimDisplayId(claim)}
                            </TableCell>
                            <TableCell className="text-gray-700">{mapFRATypeToUI(claim.type)}</TableCell>
                            <TableCell className="text-gray-700">
                              {new Date(claim.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn("text-xs py-1 px-2 rounded-full font-medium", status.className)}
                              >
                                {status.icon && (
                                  <status.icon
                                    className={cn(
                                      "h-3 w-3 mr-1",
                                      status.textColor,
                                      uiStatus.includes("Review") &&
                                        "animate-spin",
                                    )}
                                  />
                                )}
                                {t(statusI18nKey)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button asChild variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 rounded-lg transition-all duration-200">
                                <Link href={`/claims/${claim.id}`}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  {t("viewDetailsButton")}
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                    <FileStack className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <div className="text-lg font-medium text-green-700 mb-2">
                      {t("noClaimsSubmitted")}
                    </div>
                    <p className="text-green-600 mb-4">Start your forest rights claim journey today!</p>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      onClick={() => (window.location.href = "/claims/new")}
                    >
                      <PlusCircle className="mr-2 h-5 w-5" />
                      {t("fileNewClaim")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserDashboardPage;