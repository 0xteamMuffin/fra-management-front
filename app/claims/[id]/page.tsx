"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  MapPin,
  FileText,
  Users,
  Building,
  Map,
  File,
  Link as LinkIcon,
  FileStack,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import { useClaims } from "@/lib/hooks/useClaims";
import { FRAClaim } from "@/lib/types/api";
import { LoadingPage } from "@/components/ui/loading";
import { ApiError } from "@/components/ui/error-boundary";
import {
  generateClaimDisplayId,
  mapBackendStatusToUI,
  mapClaimantCategoryToUI,
  mapFRATypeToUI,
} from "@/lib/utils/claim-helpers";
import { Button } from "@/components/ui/button";
import { s3Service } from "@/lib/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const statusConfig = {
  Approved: { className: "bg-green-100 text-green-800 border-green-300" },
  "Under SDLC Review": {
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  "Under DLC Review": {
    className: "bg-orange-100 text-orange-800 border-orange-300",
  },
  "Awaiting FRC Verification": {
    className: "bg-blue-100 text-blue-800 border-blue-300",
  },
  Rejected: { className: "bg-red-100 text-red-800 border-red-300" },
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col">
    <p className="text-sm text-muted-foreground flex items-center mb-1">
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </p>
    <p className="font-semibold text-foreground ml-6">{value || "N/A"}</p>
  </div>
);

const ClaimDetailsPage = ({
  params: { lng },
}: {
  params: { lng: string };
}) => {
  const params = useParams();
  const { rawClaims, isLoading, error, refreshClaims } = useClaims({
    autoFetch: true,
  });
  const claim = rawClaims.find((c) => c.id === params.id);

  const handleViewDocument = async (s3Key: string) => {
    const toastId = toast.loading("Generating secure link...");
    const url = await s3Service.getViewUrl(s3Key);
    if (url) {
      toast.success("Link generated!", { id: toastId });
      window.open(url, "_blank");
    } else {
      toast.error("Could not generate link.", { id: toastId });
    }
  };

  if (isLoading) return <LoadingPage message="Loading claim details..." />;
  if (error) return <ApiError error={error} onRetry={refreshClaims} />;
  if (!claim) return <div>Claim not found.</div>;

  const uiStatus = mapBackendStatusToUI(claim.status);
  const currentStatus = statusConfig[uiStatus];

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard/u" },
    { label: "Claim Details" },
  ];

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-between items-start pt-4">
          <div>
            <h1 className="text-3xl font-bold">Claim Details</h1>
            <p className="text-muted-foreground">
              ID: {generateClaimDisplayId(claim)}
            </p>
          </div>
          <Badge className={`text-base px-4 py-2 ${currentStatus.className}`}>
            {uiStatus}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            {uiStatus === "Rejected" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reason for Rejection
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  {claim.otherRelevantInfo || "No reason provided."}
                </p>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              {claim.status === "Pending"
                ? `Submitted on ${new Date(claim.createdAt).toLocaleDateString()}`
                : `Last updated on ${new Date(claim.updatedAt).toLocaleDateString()}`}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailItem
                icon={User}
                label="Applicant"
                value={claim.claimantName}
              />
              <DetailItem
                icon={Users}
                label="Father/Spouse"
                value={claim.fatherOrMotherName || claim.spouseName}
              />
              <DetailItem
                icon={Building}
                label="Category"
                value={mapClaimantCategoryToUI(claim.claimantCategory)}
              />
              <DetailItem
                icon={MapPin}
                label="Village"
                value={claim.villageName}
              />
              <DetailItem
                icon={MapPin}
                label="Gram Panchayat"
                value={claim.gramPanchayat}
              />
              <DetailItem
                icon={MapPin}
                label="District"
                value={claim.district || claim.village?.name}
              />
            </div>
            <hr />
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <FileText className="mr-2" />
                Claimed Rights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailItem
                  icon={FileText}
                  label="Type"
                  value={mapFRATypeToUI(claim.type)}
                />
                <DetailItem
                  icon={MapPin}
                  label="Area"
                  value={`${claim.claimedRights?.landArea || 0} acres`}
                />
                <DetailItem
                  icon={MapPin}
                  label="Boundaries"
                  value={claim.claimedRights?.boundaries || "N/A"}
                />
              </div>
            </div>
            {claim.familyMembers && claim.familyMembers.length > 0 && (
              <>
                <hr />
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Users className="mr-2" />
                    Family Members
                  </h4>
                  <ul className="divide-y border rounded-md">
                    {claim.familyMembers.map((member) => (
                      <li key={member.id} className="flex justify-between p-3">
                        <span>{member.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {member.relationship}, {member.age} yrs
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            {claim.evidence && claim.evidence.length > 0 && (
              <>
                <hr />
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <FileStack className="mr-2" />
                    Evidence
                  </h4>
                  <ul className="divide-y border rounded-md">
                    {claim.evidence.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex justify-between items-center p-3"
                      >
                        <div className="flex items-center">
                          <File className="h-5 w-5 mr-3" />
                          <div>
                            <p>{doc.category}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.s3Key}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(doc.s3Key)}
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ClaimDetailsPage;
