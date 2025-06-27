"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Job = {
  employer_name: string;
  job_title: string;
  job_description: string;
  job_city: string;
  job_country: string;
  job_apply_link: string;
};

type JobSearchParams = {
  query: string;
  location: string;
  skills: string[];
  salary: string;
  experience: string;
};

interface JobListProps {
  searchParams: JobSearchParams;
}

export const JobList: React.FC<JobListProps> = ({ searchParams }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      setJobs([]);

      try {
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(searchParams),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [searchParams]);

  if (loading)
    return <p className="text-center text-sm text-muted">Loading jobs...</p>;

  if (error) return <p className="text-center text-sm text-red-600">{error}</p>;

  if (jobs.length === 0)
    return <p className="text-center text-sm text-muted">No jobs found yet.</p>;

  return (
    <div className="space-y-4">
      {jobs.map((job, idx) => (
        <Card key={idx} className="p-4">
          <h3 className="font-semibold text-lg">{job.job_title}</h3>
          <p className="text-sm text-muted-foreground">
            {job.employer_name} — {job.job_city}, {job.job_country}
          </p>
          <p className="mt-2 line-clamp-3 text-sm">{job.job_description}</p>
          <a
            href={job.job_apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-blue-600 hover:underline"
          >
            Apply Now →
          </a>
        </Card>
      ))}
    </div>
  );
};
