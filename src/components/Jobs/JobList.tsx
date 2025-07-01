"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
type Job = {
  location: string;
  title: string;
  description: string;
  url: string;
  type: string;
  source: string;
  id: string; // Unique identifier for the job
};

type JobSearchParams = {
  query: string;
  location: string;
  skills: string[];
  experience: string;
  type: string; // Optional, can be "all", "full-time", "part-time", etc.
};

interface JobListProps {
  searchParams: JobSearchParams;
}

export const JobList: React.FC<JobListProps> = ({ searchParams }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        console.log("Fetched jobs:", data.jobs);
        
        setJobs(data.jobs || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch jobs");
          console.log("Job fetch error:", err);
        } else {
          setError("Failed to fetch jobs");
        }
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
          <h3 className="font-semibold text-lg">{job.title}</h3>
          <p className="text-sm text-muted-foreground">
            {job.source} — {job.type}, {job.location}
          </p>
          <p className="mt-2 line-clamp-3 text-sm">{job.description}</p>

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-fit mt-3 text-sm text-blue-600 hover:underline"
          >
            See Details →
          </a>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button
              variant="default"
              onClick={() => {
                localStorage.setItem("selectedJob", JSON.stringify(job));
                router.push("/cv/custom_ai_cv");
              }}
            >
              Generate CV for This Job
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                localStorage.setItem("selectedJob", JSON.stringify(job));
                router.push("/generate-letter");
              }}
            >
              Generate Cover Letter
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
