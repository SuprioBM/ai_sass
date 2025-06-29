import { NextResponse } from "next/server";
import { fetchAllJobs } from "@/lib/jobs/fetchAllJobs";

const experienceMap: Record<string, string> = {
  any: "", // no experience keyword
  entry: "1 year", // no experience keyword
  mid: "3 years", // mid-level approx
  senior: "5 years", // senior approx
};

export async function POST(req: Request) {
  try {
    const {
      query,
      location,
      skills = [],
      experience = "",
      type = "all",
    } = await req.json();

    // Build enriched query string: query + skills + mapped experience
    const experienceQuery = experienceMap[experience] || "";
    const jobQuery = [
      query?.trim() || "developer",
      ...skills,
      experienceQuery ? `${experienceQuery} experience` : "",
    ]
      .filter(Boolean)
      .join(" ");

    // Fetch jobs from all integrated APIs
    const jobs = await fetchAllJobs({
      query: jobQuery,
      location,
      type,
    });
    console.log(`Fetched ${jobs.length} jobs for query: "${jobQuery}"`);
    
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Job Aggregator Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs." },
      { status: 500 }
    );
  }
}
