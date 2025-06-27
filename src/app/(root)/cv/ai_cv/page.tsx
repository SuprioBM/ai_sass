"use client";

import React, { useState } from "react";
import MainWizard from "../../../../components/Wizard/MainWizard";
import { JobSearchForm } from "../../../../components/Jobs/JobSearchForm";

export default function WizardPage() {
  const [mode, setMode] = useState<"jobDesc" | "jobSearch" | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">AI CV Builder</h1>

      {/* Button Options */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <button
          onClick={() => setMode("jobDesc")}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            mode === "jobDesc" ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Use Job Description
        </button>
        <button
          onClick={() => setMode("jobSearch")}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            mode === "jobSearch"
              ? "bg-green-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Search for Jobs
        </button>
      </div>

      {/* Render Selected Form */}
      {mode === "jobDesc" && <MainWizard />}
      {mode === "jobSearch" && <JobSearchForm />}
    </div>
  );
}
