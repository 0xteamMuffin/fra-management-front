"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { api, endpoints } from "@/lib/api-client";
import { toast } from "sonner";
import { mapBackendStatusToUI } from "@/lib/utils/claim-helpers";
import { Badge } from "@/components/ui/badge";

const TrackClaimPage = ({
  params: { lng },
}: {
  params: { lng: string };
}) => {
  const [claimId, setClaimId] = useState("");
  const [claimDetails, setClaimDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrackClaim = async () => {
    if (!claimId) {
      toast.error("Please enter a Claim ID");
      return;
    }
    setIsLoading(true);
    setError(null);
    setClaimDetails(null);
    try {
      const response = await api.get(`/claims/track/${claimId}`);
      setClaimDetails(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to track claim");
      toast.error(err.response?.data?.message || "Failed to track claim");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2" />
            Track Your Claim
          </CardTitle>
          <CardDescription>
            Enter your Claim ID to check the current status of your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={claimId}
              onChange={(e) => setClaimId(e.target.value)}
              placeholder="Enter your Claim ID"
            />
            <Button onClick={handleTrackClaim} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Track"
              )}
            </Button>
          </div>

          {claimDetails && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold">Claim Status</h3>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Claim ID</p>
                  <p className="font-medium">{claimDetails.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge>{mapBackendStatusToUI(claimDetails.status)}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{claimDetails.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{claimDetails.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Submitted On</p>
                  <p className="font-medium">
                    {new Date(claimDetails.submittedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(claimDetails.lastUpdate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackClaimPage;
