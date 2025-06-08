// components/TemplatePicker.tsx
"use client";
import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { useCvWizard } from "../context/CvWizardContext";
import ModernTemplate from "@/components/CvTemplates/ModernTemplate";
import { ClassicTemplate } from "@/components/CvTemplates/ClassicTemplate";
import { CreativeTemplate } from "@/components/CvTemplates/CreativeTemplate";
import StylishTemplate from "@/components/CvTemplates/StylishTemplate";
import MinimalisticTemplate from "@/components/CvTemplates/BlueTemplate";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const templates = [
  {
    id: "ModernTemplate",
    label: "Modern Classic",
    component: <ModernTemplate data={{}} />, // Will not render actual content
  },
  {
    id: "ClassicTemplate",
    label: "Clean Pro",
    component: <ClassicTemplate data={{}} />,
  },
  {
    id: "CreativeTemplate",
    label: "Elegant Bold",
    component: <CreativeTemplate data={{}} />,
  },
  {
    id: "StylishTemplate",
    label: "Stylish",
    component: <StylishTemplate data={{}} />,
  },
  {
    id: "MinimalisticTemplate",
    label: "Minimal Blue",
    component: <MinimalisticTemplate data={{}} />,
  },
];

export default function TemplatePicker({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const [previews, setPreviews] = useState<{ id: string; imageUrl: string }[]>(
    []
  );

  useEffect(() => {
    const renderPreviews = async () => {
      const rendered: { id: string; imageUrl: string }[] = [];

      for (const tpl of templates) {
        const instance = pdf();
        instance.updateContainer(tpl.component);
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
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {previews.map((tpl) => (
        <div
          key={tpl.id}
          className="cursor-pointer border rounded-lg hover:shadow-xl transition"
          onClick={() => onSelect(tpl.id)}
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
  );
}
