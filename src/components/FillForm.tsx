"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { pdf } from "@react-pdf/renderer";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import CvForm from "@/components/CVform";
import ModernTemplate from "@/components/CvTemplates/ModernTemplate";
import StylishTemplate from "@/components/CvTemplates/StylishTemplate";
import {ClassicTemplate }from "@/components/CvTemplates/ClassicTemplate";
import {CreativeTemplate} from "@/components/CvTemplates/CreativeTemplate";
import { CvFormData } from "@/types/Cv";
import MinimalisticTemplate from "@/components/CvTemplates/BlueTemplate";
import { useCvWizard } from "@/context/CvWizardContext"
import { Button } from "./ui/button";
import { calculateTotalExperienceInYears } from "./CalculateExp";

const templates = {
  ModernTemplate,
  StylishTemplate,
  ClassicTemplate,
  CreativeTemplate,
  MinimalisticTemplate

};

export default function FillDataPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  console.log("Selected Template ID:", templateId);
  
  const TemplateComponent =
    templateId && templates[templateId as keyof typeof templates]
      ? templates[templateId as keyof typeof templates]
      : null;

  console.log("Using Template Component:", TemplateComponent);
  const { data } = useCvWizard();
  const [formData, setFormData] = useState<CvFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    JobTitle: "", // Changed from 'title' to 'JobTitle' for clarity
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
    certificates: [],
    linkedin: "",
    github: "",
    portfolio: ""
  });

  const router = useRouter();

  useEffect(() => {
    if (data.aiData) {
      setFormData(data.aiData as CvFormData);
      console.log("Form data set from AI data:", data.aiData);
      
    }
  }, [data]);

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const debouncedGeneratePdf = useMemo(
    () =>
      debounce(async (data: CvFormData) => {
        try {
          if (!TemplateComponent) {
            throw new Error("No template selected or template not found.");
          }
          const doc = <TemplateComponent data={data} />;
          const asPdf = pdf();
          asPdf.updateContainer(doc);
          const blob = await asPdf.toBlob();

          const url = URL.createObjectURL(blob);
          setPdfBlobUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });

          // Generate a static preview image
          const imageUrl = await generateImageFromBlob(blob);
          setPreviewImageUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return imageUrl;
          });
        } catch (err) {
          console.error("Failed to generate preview", err);
        }
      }, 1000),
    []
  );

  const generateImageFromBlob = async (blob: Blob): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const arrayBuffer = await blob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 5 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context!, viewport }).promise;
    return canvas.toDataURL("image/jpg");
  };

  useEffect(() => {
    debouncedGeneratePdf(formData);
    return () => {
      debouncedGeneratePdf.cancel();
    };
  }, [formData, debouncedGeneratePdf]);

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
    };
  }, [pdfBlobUrl, previewImageUrl]);

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const link = document.createElement("a");
    link.href = pdfBlobUrl;
    link.download = "cv.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{ display: "flex", gap: 20 }}>
      {/* Form Section */}
      <div style={{ flex: 1, maxHeight: "100vh", overflowY: "auto" }}>
        <CvForm
          key={templateId}
          onSubmit={(data) => setFormData(data)}
          formData={formData}
          setFormData={setFormData}
        />
        <button
          onClick={handleDownload}
          className="btn-primary mt-4"
          style={{ marginTop: 20 }}
        >
          Download PDF
        </button>
        <Button
          variant="outline"
          className="ml-4"
          onClick={() => {
            const query = encodeURIComponent(formData.JobTitle || "developer");
            const location = encodeURIComponent(formData.location || "");
            const skills = encodeURIComponent(
              (formData.skills || []).join(",")
            );

            const experienceInYears = calculateTotalExperienceInYears(
              formData.experience || []
            );

            const experience = encodeURIComponent(experienceInYears);
            const salary = ""; // can be added later

            router.push(
              `/jobs?query=${query}&location=${location}&skills=${skills}&experience=${experience}&salary=${salary}`
            );
          }}
        >
          Search Jobs Based on This CV
        </Button>
      </div>

      {/* Preview Section */}
      <div
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: 10,
          height: "100vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: 10 }}>Preview</h2>
        {previewImageUrl ? (
          <img
            src={previewImageUrl}
            alt="PDF Preview"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        ) : (
          <p>Generating preview...</p>
        )}
      </div>
    </div>
  );
}
