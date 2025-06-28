import { NextResponse } from "next/server";
import { fetchJobsFromJSearch } from "@/lib/jobs/fetchJobs";

export async function POST(req: Request) {
  try {
    const { query, location, skills, experience, salary } = await req.json();

    // 1. Ensure we always have a valid query
    const jobQuery = query?.trim() || "developer";

    // 2. Fetch jobs from JSearch API
    const apiJobs = await fetchJobsFromJSearch({
      query: jobQuery,
      location,
      skills,
      experience,
      salary,
    });

    // 3. Return response
    return NextResponse.json({ jobs: apiJobs });
  } catch (error) {
    console.error("Job API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
