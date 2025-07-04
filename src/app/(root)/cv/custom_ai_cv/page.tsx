"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TemplatePreviewSelector from "@/components/CvTemplates/TemplatePreviewSelector";
import { dummyData } from "@/lib/Data";
import { useCvWizard } from "@/context/CvWizardContext";

export default function SelectTemplatePage() {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const { data, setAiData } = useCvWizard();
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const formData = data.userData;

  // ✅ Move localStorage access here and guard it
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedJob = localStorage.getItem("selectedJob");

    if (!storedJob) {
      router.push("/jobs");
      return;
    }

    setJob(JSON.parse(storedJob));
  }, [router]);

  useEffect(() => {
    if (!job) return;

    async function generatePreviews() {
      setLoadingTemplates(true);

      try {
        const res = await fetch("/api/jobs/generate-draft-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job,
            ...(formData && Object.keys(formData).length > 0
              ? { userData: formData }
              : {}),
          }),
        });

        const data = await res.json();
        setAiData(data);
      } catch (err) {
        console.error("Failed to generate CV previews", err);
      } finally {
        setLoadingTemplates(false);
      }
    }

    generatePreviews();
  }, [job, formData, setAiData]);

  const handleSelect = (templateId: string) => {
    if (loadingTemplates) return;
    router.push(`/cv/fill-data?template=${templateId}`);
  };

  if (!job) return <p>Loading job...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        Choose a Template for
      </h1>

      <TemplatePreviewSelector
        dummyData={dummyData}
        onSelect={handleSelect}
        showGenerateButton={false}
      />

      {loadingTemplates && <p>Generating previews, please wait...</p>}
    </div>
  );
}
