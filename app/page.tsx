import { Hero } from "@/components/ui/hero/hero";
import { Features } from "@/components/ui/features";

export default function HomePage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  return (
    <div>
      <Hero />
    </div>
  );
}
