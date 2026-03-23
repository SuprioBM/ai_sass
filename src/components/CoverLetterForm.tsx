"use client";

import { useEffect, useState } from "react";

const tones = ["professional", "enthusiastic", "friendly", "confident"];

type SelectedJob = {
  title?: string;
  jobTitle?: string;
  company?: string;
  companyName?: string;
  description?: string;
  jobDescription?: string;
  summary?: string;
  [key: string]: unknown;
};

type CoverLetterFormProps = {
  selectedJob?: SelectedJob | null;
};

type CoverLetterFormData = {
  fullName: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  experience: string;
  tone: string;
};

export default function CoverLetterForm({
  selectedJob,
}: CoverLetterFormProps) {
  const [formData, setFormData] = useState<CoverLetterFormData>({
    fullName: "",
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    experience: "",
    tone: "professional",
  });

  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedJob) return;

    setFormData((prev) => ({
      ...prev,
      jobTitle:
        (selectedJob.title as string) ||
        (selectedJob.jobTitle as string) ||
        prev.jobTitle,
      companyName:
        (selectedJob.company as string) ||
        (selectedJob.companyName as string) ||
        prev.companyName,
      jobDescription:
        (selectedJob.description as string) ||
        (selectedJob.jobDescription as string) ||
        (selectedJob.summary as string) ||
        prev.jobDescription,
    }));
  }, [selectedJob]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCoverLetter("");
    setError("");

    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate cover letter");
      }

      setCoverLetter(data.coverLetter || "");
    } catch (err) {
      console.error("Generate cover letter error:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {selectedJob && (
        <div className="mb-6 border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Selected Job</h2>
          <p>
            <strong>Job Title:</strong>{" "}
            {selectedJob.title || selectedJob.jobTitle || "N/A"}
          </p>
          <p>
            <strong>Company:</strong>{" "}
            {selectedJob.company || selectedJob.companyName || "N/A"}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          placeholder="Your Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="jobTitle"
          placeholder="Job Title"
          value={formData.jobTitle}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="jobDescription"
          placeholder="Paste the job description here..."
          value={formData.jobDescription}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32"
          required
        />

        <textarea
          name="experience"
          placeholder="Describe your relevant experience..."
          value={formData.experience}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32"
          required
        />

        <select
          name="tone"
          value={formData.tone}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-black"
        >
          {tones.map((tone) => (
            <option key={tone} value={tone}>
              {tone.charAt(0).toUpperCase() + tone.slice(1)}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>
      </form>

      {error && (
        <div className="mt-4 border border-red-500 text-red-500 p-3 rounded">
          {error}
        </div>
      )}

      {coverLetter && (
        <div className="mt-6 border p-4 rounded bg-black whitespace-pre-wrap">
          <h2 className="text-lg font-bold mb-2">Generated Cover Letter:</h2>
          <p>{coverLetter}</p>
        </div>
      )}
    </div>
  );
}