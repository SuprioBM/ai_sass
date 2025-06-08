"use client";

import TemplatePreviewSelector from "@/components/CvTemplates/TemplatePreviewSelector";
import { useRouter } from "next/navigation";
import { dummyData } from "@/lib/Data";
// ✅ set the worker source

export default function TemplatePage() {
  const router = useRouter();

  return (
    <TemplatePreviewSelector
      dummyData={dummyData}
      onSelect={(id) => router.push(`/cv/fill-data?template=${id}`)}
      showGenerateButton={false}
    />
    
  );
}
