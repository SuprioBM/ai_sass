"use client";
import React from "react";
import { StickyScroll } from "./ui/sticky-scroll";

const content = [
  {
    title: "AI-Optimized Resume Creation",
    description:
      "Generate ATS-friendly, professional resumes instantly using AI. Just provide your details and the AI handles structure, tone, and layout to align with your career goals.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white text-center px-6">
        <h2 className="text-2xl font-semibold">AI-Optimized Resume Creation</h2>
      </div>
    ),
  },
  {
    title: "Job-Aware Tailoring",
    description:
      "Upload a job description, and the AI customizes your resume with the right keywords and phrasing to increase interview chances. Perfect for role-specific applications.",
    content: (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src="/icons/ai_analytics.png"
          width={300}
          height={300}
          className="h-full w-full object-contain p-4"
          alt="AI Analytics"
        />
      </div>
    ),
  },
  {
    title: "Real-Time Writing Assistant",
    description:
      "Get feedback while you write — from tone and clarity to grammar and keyword suggestions. Your resume improves in real time with intelligent recommendations.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 text-white text-center px-6">
        <h2 className="text-2xl font-semibold">Real-Time Writing Assistant</h2>
      </div>
    ),
  },
  {
    title: "One-Click Export to PDF/DOCX",
    description:
      "Download your finished resume in popular formats like PDF or DOCX with one click — fully styled and ready to send with your next application.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yellow-600 via-orange-600 to-rose-600 text-white text-center px-6">
        <h2 className="text-2xl font-semibold">One-Click Export</h2>
      </div>
    ),
  },
];

export function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-4">
      <StickyScroll content={content} />
    </div>
  );
}
