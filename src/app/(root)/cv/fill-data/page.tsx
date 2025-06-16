import { Suspense } from "react";
import FillDataPage from "@/components/FillForm";

export default function Page() {
  return (
    <div className="mt-20">
      <h1 className="text-6xl text-center py-10">Fill CV Data</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <FillDataPage />
      </Suspense>
    </div>
  );
}
