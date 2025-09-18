import { FRAClaimFormNew } from "@/components/ui/claims/fra-claim-form-new"
import { ProtectedRoute } from "@/components/protected-route"

export default function ClaimsPage() {
  return (
    <ProtectedRoute>
      <FRAClaimFormNew />
    </ProtectedRoute>
  )
}
