"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { JobList } from "@/components/Jobs/JobList";

export default function JobsPage() {
  const searchParams = useSearchParams();

  // Extract params from URL query string
  const query = searchParams.get("query") || "";
  const location = searchParams.get("location") || "";
  const skillsParam = searchParams.get("skills") || "";
  const salary = searchParams.get("salary") || "";
  const experience = searchParams.get("experience") || "";

  // skills come as comma-separated string, convert to array
  const skills = skillsParam
    ? skillsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const jobSearchParams = {
    query,
    location,
    skills,
    salary,
    experience,
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-transparent">
      <h1 className="text-2xl font-bold mb-6">Job Listings</h1>
      <JobList searchParams={jobSearchParams} />
    </div>
  );
}
