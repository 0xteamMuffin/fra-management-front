import VerificationPortal from "@/components/ui/verification/verification-dashboard";
import { OfficialRoute } from "@/components/protected-route";

export default function VerificationPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return (
    <OfficialRoute>
      <VerificationPortal />
    </OfficialRoute>
  );
}
