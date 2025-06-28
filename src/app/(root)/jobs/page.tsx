import { Suspense } from "react";
import JobsPageComponent from "@/components/Jobs/JobsPage"; // Adjust path as needed

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading jobs...</div>}>
      <JobsPageComponent />
    </Suspense>
  );
}
