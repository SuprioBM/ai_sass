"use client";

import { useState } from "react";

const tones = ["professional", "enthusiastic", "friendly", "confident"];

export default function CoverLetterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    experience: "",
    tone: "professional",
  });

  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCoverLetter("");

    const res = await fetch("/api/generate-cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setCoverLetter(data.coverLetter);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
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

      {coverLetter && (
        <div className="mt-6 border p-4 rounded bg-black whitespace-pre-wrap">
          <h2 className="text-lg font-bold mb-2">Generated Cover Letter:</h2>
          <p>{coverLetter}</p>
        </div>
      )}
    </div>
  );
}
