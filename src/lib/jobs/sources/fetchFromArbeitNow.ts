import { Job } from "@/types/Cv";

interface ArbeitNowJob {
  title: string;
  company: string;
  location: string;
  remote: boolean;
  description: string;
  url: string;
}

interface ArbeitNowApiResponse {
  data: ArbeitNowJob[];
}

export async function fetchFromArbeitNow({
  query,
  location = "",
}: {
  query: string;
  location?: string;
}): Promise<Job[]> {
  const params = new URLSearchParams({ search: query, has_remote: "" });
  const res = await fetch(
    `https://www.arbeitnow.com/api/job-board-api?${params}`
  );
  const data: ArbeitNowApiResponse = await res.json();

  return (data.data || [])
    .filter(
      (j) =>
        !location || j.location.toLowerCase().includes(location.toLowerCase())
    )
    .map((job) => ({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.remote ? "remote" : "onsite",
      description: job.description,
      url: job.url,
      source: "ArbeitNow",
    }));
}
