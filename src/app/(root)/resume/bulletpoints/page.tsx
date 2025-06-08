"use client";

import { useState } from "react";

export default function ResumeBulletGenerator() {
  const [experience, setExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience, jobDescription }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      setResult(data.bulletPoints);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        AI Resume Bullet Points Generator
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Your experience (years, roles, skills...)"
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Job description / posting"
          className="w-full border p-2 rounded"
          rows={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Bullet Points"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">Error: {error}</p>}

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-black">
          <h2 className="font-semibold mb-2">Generated Bullet Points:</h2>
          <ul className="list-disc list-inside space-y-1">
            {result
              .split("\n")
              .map((line, idx) =>
                line.trim() ? <li key={idx}>{line}</li> : null
              )}
          </ul>
        </div>
      )}
    </div>
  );
}
