"use client";

import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ModernTemplate from "@/components/CvTemplates/ModernTemplate";
import { ClassicTemplate } from "@/components/CvTemplates/ClassicTemplate";
import { CreativeTemplate } from "@/components/CvTemplates/CreativeTemplate";
import StylishTemplate from "@/components/CvTemplates/StylishTemplate";
import MinimalisticTemplate from "@/components/CvTemplates/BlueTemplate";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { CvFormData } from "@/types/Cv";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const templates = [
  {
    id: "ModernTemplate",
    label: "Modern Classic",
    component: (data: CvFormData) => <ModernTemplate data={data} />,
  },
  {
    id: "ClassicTemplate",
    label: "Clean Pro",
    component: (data: CvFormData) => <ClassicTemplate data={data} />,
  },
  {
    id: "CreativeTemplate",
    label: "Elegant Bold",
    component: (data: CvFormData) => <CreativeTemplate data={data} />,
  },
  {
    id: "StylishTemplate",
    label: "Stylish Template",
    component: (data: CvFormData) => <StylishTemplate data={data} />,
  },
  {
    id: "MinimalisticTemplate",
    label: "Minimalistic Blue",
    component: (data: CvFormData) => <MinimalisticTemplate data={data} />,
  },
];

interface TemplatePreviewSelectorProps {
  onSelect?: (templateId: string) => void;
  dummyData: CvFormData;
  showGenerateButton?: boolean;
}

export default function TemplatePreviewSelector({
  onSelect,
  dummyData,
  showGenerateButton = false,
}: TemplatePreviewSelectorProps) {
  const [previews, setPreviews] = useState<{ id: string; imageUrl: string }[]>(
    []
  );
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const renderPreviews = async () => {
      const rendered: { id: string; imageUrl: string }[] = [];

      for (const tpl of templates) {
        const instance = pdf();
        instance.updateContainer(tpl.component(dummyData));
        const blob = await instance.toBlob();

        const arrayBuffer = await blob.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer })
          .promise;
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        rendered.push({ id: tpl.id, imageUrl: canvas.toDataURL() });
      }

      setPreviews(rendered);
    };

    renderPreviews();
  }, [dummyData]);

  const handleClick = (templateId: string) => {
    setSelected(templateId);
    if (onSelect) {
      onSelect(templateId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-20">
      <h1 className="text-5xl font-bold mb-6 text-center">
        Choose a CV Template
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {previews.map((tpl) => (
          <div
            key={tpl.id}
            className={`cursor-pointer border rounded-lg hover:shadow-xl transition ${
              selected === tpl.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleClick(tpl.id)}
          >
            <img
              src={tpl.imageUrl}
              alt={`Preview of ${tpl.id}`}
              className="w-full h-auto rounded-t-lg"
            />
            <div className="p-2 text-center font-semibold capitalize">
              {tpl.id}
            </div>
          </div>
        ))}
      </div>

      {showGenerateButton && selected && (
        <div className="text-center mt-6">
          <button
            onClick={() => onSelect?.(selected)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Generate CV
          </button>
        </div>
      )}
    </div>
  );
}
