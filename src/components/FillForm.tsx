"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { pdf } from "@react-pdf/renderer";
import debounce from "lodash.debounce";

import CvForm from "@/components/CVform";
import ModernTemplate from "@/components/CvTemplates/ModernTemplate";
import StylishTemplate from "@/components/CvTemplates/StylishTemplate";
import { ClassicTemplate } from "@/components/CvTemplates/ClassicTemplate";
import { CreativeTemplate } from "@/components/CvTemplates/CreativeTemplate";
import MinimalisticTemplate from "@/components/CvTemplates/BlueTemplate";

import { CvFormData } from "@/types/Cv";
import { useCvWizard } from "@/context/CvWizardContext";
import { Button } from "./ui/button";
import { calculateTotalExperienceInYears } from "./CalculateExp";

const templates = {
  ModernTemplate,
  StylishTemplate,
  ClassicTemplate,
  CreativeTemplate,
  MinimalisticTemplate,
};

const EMPTY_FORM_DATA: CvFormData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  JobTitle: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certificates: [],
  linkedin: "",
  github: "",
  portfolio: "",
};

function isNonEmptyObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && Object.keys(value).length > 0;
}

function hasMeaningfulFormData(data: CvFormData): boolean {
  return Boolean(
    data.name?.trim() ||
      data.email?.trim() ||
      data.phone?.trim() ||
      data.location?.trim() ||
      data.summary?.trim() ||
      data.JobTitle?.trim() ||
      data.linkedin?.trim() ||
      data.github?.trim() ||
      data.portfolio?.trim() ||
      data.experience?.length ||
      data.education?.length ||
      data.skills?.length ||
      data.languages?.length ||
      data.projects?.length ||
      data.certificates?.length
  );
}

export default function FillDataPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data } = useCvWizard();

  const templateId = searchParams.get("template");

  const TemplateComponent = useMemo(() => {
    if (!templateId) return null;
    return templates[templateId as keyof typeof templates] ?? null;
  }, [templateId]);

  const [formData, setFormData] = useState<CvFormData>(EMPTY_FORM_DATA);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const initializedFromAIRef = useRef(false);
  const latestPreviewJobRef = useRef(0);

  const generateImageFromBlob = useCallback(async (blob: Blob): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const arrayBuffer = await blob.arrayBuffer();
    const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdfDocument.getPage(1);
    const viewport = page.getViewport({ scale: 2.2 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create canvas context for PDF preview.");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    return canvas.toDataURL("image/jpeg", 0.9);
  }, []);

  const generatePdfPreview = useCallback(
    async (dataToRender: CvFormData) => {
      if (!TemplateComponent) {
        setPreviewImageUrl(null);
        setPdfBlobUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        return;
      }

      const currentJobId = ++latestPreviewJobRef.current;
      setIsGeneratingPreview(true);

      try {
        const doc = <TemplateComponent data={dataToRender} />;
        const asPdf = pdf();
        asPdf.updateContainer(doc);

        const blob = await asPdf.toBlob();

        if (currentJobId !== latestPreviewJobRef.current) return;

        const objectUrl = URL.createObjectURL(blob);

        setPdfBlobUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return objectUrl;
        });

        const imageUrl = await generateImageFromBlob(blob);

        if (currentJobId !== latestPreviewJobRef.current) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setPreviewImageUrl(imageUrl);
      } catch (error) {
        console.error("Failed to generate PDF preview:", error);
      } finally {
        if (currentJobId === latestPreviewJobRef.current) {
          setIsGeneratingPreview(false);
        }
      }
    },
    [TemplateComponent, generateImageFromBlob]
  );

  const debouncedGeneratePdf = useMemo(() => {
    return debounce((nextData: CvFormData) => {
      void generatePdfPreview(nextData);
    }, 400);
  }, [generatePdfPreview]);

  useEffect(() => {
    const aiData = data?.aiData;

    if (initializedFromAIRef.current) return;
    if (!isNonEmptyObject(aiData)) return;

    const parsedAiData = aiData as CvFormData;
    if (!hasMeaningfulFormData(parsedAiData)) return;

    setFormData(parsedAiData);
    initializedFromAIRef.current = true;
  }, [data?.aiData]);

  useEffect(() => {
    debouncedGeneratePdf(formData);

    return () => {
      debouncedGeneratePdf.cancel();
    };
  }, [formData, debouncedGeneratePdf]);

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  const handleDownload = useCallback(() => {
    if (!pdfBlobUrl) return;

    const link = document.createElement("a");
    link.href = pdfBlobUrl;
    link.download = "cv.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [pdfBlobUrl]);

  const handleSearchJobs = useCallback(() => {
    const query = encodeURIComponent(formData.JobTitle || "developer");
    const location = encodeURIComponent(formData.location || "");
    const skills = encodeURIComponent((formData.skills || []).join(","));
    const experienceInYears = calculateTotalExperienceInYears(formData.experience || []);
    const experience = encodeURIComponent(String(experienceInYears));
    const salary = "";

    router.push(
      `/jobs?query=${query}&location=${location}&skills=${skills}&experience=${experience}&salary=${salary}`
    );
  }, [formData, router]);

  if (!TemplateComponent) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Invalid template</h2>
        <p>Please go back and select a valid CV template.</p>
      </div>
    );
  }

  return (
  <div className="flex flex-col lg:flex-row gap-5">
  {/* LEFT */}
  <div className="flex-1">
    <div className="border rounded p-4 h-[50vh] flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2">
        <CvForm
          key={templateId}
          onSubmit={(updatedData) => setFormData(updatedData)}
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-4 shrink-0">
        <button onClick={handleDownload} className="btn-primary">
          Download PDF
        </button>

        <Button variant="outline" onClick={handleSearchJobs}>
          Search Jobs Based on This CV
        </Button>
      </div>
    </div>
  </div>

  {/* RIGHT */}
  <div className="flex-1">
    <div className="border rounded p-3 h-[80vh] overflow-y-auto">
      <h2 className="mb-2">Preview</h2>

      {previewImageUrl ? (
        <img
          src={previewImageUrl}
          alt="PDF Preview"
          className="w-full rounded shadow"
        />
      ) : isGeneratingPreview ? (
        <p>Generating preview...</p>
      ) : (
        <p>No preview available yet.</p>
      )}
    </div>
  </div>
</div>
    
  );
}