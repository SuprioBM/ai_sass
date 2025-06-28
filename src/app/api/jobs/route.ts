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

    // 3. Fetch scraped jobs from external Playwright server
    let scrapedJobs = [];
    try {
      const scraperRes = await fetch(
        "https://playwright-kyd4.onrender.com/scrape",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: jobQuery, skills }),
        }
      );

      const scrapedData = await scraperRes.json();
      scrapedJobs = scrapedData?.gigs || [];
    } catch (scrapeErr) {
      console.error("Scraper failed:", scrapeErr);
    }

    // 4. Merge and deduplicate based on title + seller or URL
    const jobsMap = new Map<string, any>();

    [...apiJobs, ...scrapedJobs].forEach((job) => {
      const key = ((job.url || ""))
        .toLowerCase()
        .trim();

      if (!jobsMap.has(key)) {
        jobsMap.set(key, job);
      }
    });

    const combinedJobs = Array.from(jobsMap.values());

    // 5. Return response
    return NextResponse.json({ jobs: combinedJobs });
  } catch (error) {
    console.error("Job API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
