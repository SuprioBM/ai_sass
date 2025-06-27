import { NextResponse } from "next/server";
import { fetchJobsFromJSearch } from "@/lib/jobs/fetchJobs";

export async function POST(req: Request) {
  try {
    const { query, location, skills, experience, salary } = await req.json();

    // 1. Fetch jobs from JSearch API
    const apiJobs = await fetchJobsFromJSearch({
      query,
      location,
      skills,
      experience,
      salary,
    });

    // 2. Fetch scraped jobs from external scraper (Playwright server)
    const scraperRes = await fetch(
      "https://your-scraper-url.up.railway.app/scrape",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location, skills, experience, salary }),
      }
    );

    const scrapedData = await scraperRes.json();
    const scrapedJobs = scrapedData.gigs || [];

    // 3. Merge and filter duplicates
    const jobsMap = new Map<string, any>();

    [...apiJobs, ...scrapedJobs].forEach((job) => {
      const key = (job.title + (job.url || "")).toLowerCase().trim();
      if (!jobsMap.has(key)) {
        jobsMap.set(key, job);
      }
    });

    const combinedJobs = Array.from(jobsMap.values());

    // 4. Return response
    return NextResponse.json({ jobs: combinedJobs });
  } catch (error) {
    console.error("Job API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
