import { Suspense } from "react";
import FillDataPage from "@/components/FillForm";

export default function Page() {
  return (
    <div>
      <h1>Fill CV Data</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <FillDataPage />
      </Suspense>
    </div>
  );
}
