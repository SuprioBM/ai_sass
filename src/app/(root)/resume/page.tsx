"use client";

import React, { useEffect, useState } from "react";
import CoverLetterForm from "@/components/CoverLetterForm";

type SelectedJob = {
  title?: string;
  jobTitle?: string;
  company?: string;
  companyName?: string;
  description?: string;
  jobDescription?: string;
  summary?: string;
  location?: string;
  [key: string]: unknown;
};

const ResumePage = () => {
  const [selectedJob, setSelectedJob] = useState<SelectedJob | null>(null);

  useEffect(() => {
    const storedJob = localStorage.getItem("selectedJob");

    if (!storedJob) return;

    try {
      const parsedJob = JSON.parse(storedJob);
      setSelectedJob(parsedJob);
    } catch (error) {
      console.error("Failed to parse selectedJob from localStorage:", error);
    }
  }, []);

  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Generate Cover Letter</h1>

      <CoverLetterForm selectedJob={selectedJob} />
    </div>
  );
};

export default ResumePage;