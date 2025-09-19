import { FRAClaimFormNew } from "@/components/ui/claims/fra-claim-form-new";
import { ProtectedRoute } from "@/components/protected-route";

export default function ClaimsPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return (
    <ProtectedRoute>
      <FRAClaimFormNew />
    </ProtectedRoute>
  );
}
