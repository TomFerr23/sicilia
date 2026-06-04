import { Suspense } from "react";
import ItineraryClient from "@/components/ItineraryClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ItineraryClient />
    </Suspense>
  );
}
