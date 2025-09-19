"use client";

import React, { useState, useEffect } from "react";
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
import { useTranslation } from "@/app/i18n/client";

const statusConfig: {
  [key: string]: {
    icon?: React.ElementType;
    className: string;
    textColor: string;
  };
} = {
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

const UserDashboardPage = ({ params: { lng } }: { params: { lng: string } }) => {
  const { t } = useTranslation(lng, "common");
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
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t("welcomeBack", { name: user?.name.split(" ")[0] })}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("claimsSummary")}
              </p>
            </div>
            <Button onClick={() => (window.location.href = "/claims/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("submitNewClaim")}
            </Button>
          </header>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileStack className="mr-2 h-5 w-5" />
                {t("yourClaims", { count: rawClaims.length })}
              </CardTitle>
              <CardDescription>{t("claimsListDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              {rawClaims.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("claimId")}</TableHead>
                      <TableHead>{t("type")}</TableHead>
                      <TableHead>{t("submittedOn")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawClaims.map((claim) => {
                      const uiStatus = mapBackendStatusToUI(claim.status);
                      const status = statusConfig[uiStatus];
                      return (
                        <TableRow key={claim.id}>
                          <TableCell className="font-medium">
                            {generateClaimDisplayId(claim)}
                          </TableCell>
                          <TableCell>{mapFRATypeToUI(claim.type)}</TableCell>
                          <TableCell>
                            {new Date(claim.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn("text-xs py-0.5", status.className)}
                            >
                              {status.icon && (
                                <status.icon
                                  className={cn(
                                    "h-3 w-3 mr-1",
                                    status.textColor,
                                    uiStatus.includes("Review") && "animate-spin"
                                  )}
                                />
                              )}
                              {uiStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/claims/${claim.id}`}>
                                <Eye className="h-3 w-3 mr-1" />
                                {t("viewDetails")}
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t("noClaimsSubmitted")}
                  <Button
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => (window.location.href = "/claims/new")}
                  >
                    {t("fileNewClaim")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserDashboardPage;
