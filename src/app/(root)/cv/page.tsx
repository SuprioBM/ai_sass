"use client";

import { useState,useEffect } from "react";
import CvForm from "@/components/CVform";
import CvDocument from "@/components/CvTemplates/BlueTemplate";
import { pdf } from "@react-pdf/renderer";

// Recursively convert { value: string } and nested objects to plain strings/objects
function extractValue(field: any): any {
  if (field === null || field === undefined) return field;

  if (Array.isArray(field)) {
    return field.map(extractValue);
  }

  if (typeof field === "object") {
    if ("value" in field) return extractValue(field.value);

    const cleanedObj: any = {};
    for (const key in field) {
      cleanedObj[key] = extractValue(field[key]);
    }
    return cleanedObj;
  }

  return field;
}
export default function CVPage() {
    const [cvData, setCvData] = useState<any>(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  
    const generatePdfPreview = async (data: any) => {
      const doc = <CvDocument data={data} />;
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
  
      // Revoke old URL to avoid memory leaks
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
  
      setPdfBlobUrl(url);
    };
  
    const handleSubmit = async (data: any) => {
      setCvData(data);
      await generatePdfPreview(data);
    };
  
    const handleDownload = () => {
      if (!pdfBlobUrl) return;
      const link = document.createElement("a");
      link.href = pdfBlobUrl;
      link.download = "cv.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
  
    // Clean up blob URL on component unmount
    useEffect(() => {
      return () => {
        if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      };
    }, [pdfBlobUrl]);
  
    return (
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Build Your CV</h1>
        
        {pdfBlobUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <iframe
              src={pdfBlobUrl}
              width="100%"
              height="600px"
              title="CV Preview"
            />
            <button
              onClick={handleDownload}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    );
  }

