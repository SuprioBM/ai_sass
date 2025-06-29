import { Job } from "@/types/Cv";

const REMOTIVE_URL = "https://remotive.com/api/remote-jobs";

type Params = {
  query: string;
  location?: string;
};

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  candidate_required_location: string;
  job_type: string;
  publication_date: string;
  description: string;
}

interface RemotiveApiResponse {
  jobs: RemotiveJob[];
  [key: string]: unknown; // for extra fields we don't care about
}

export async function fetchFromRemotive({
  query,
  location = "",
}: Params): Promise<Job[]> {
  const res = await fetch(
    `${REMOTIVE_URL}?search=${encodeURIComponent(query)}`
  );

  let data: RemotiveApiResponse;
  try {
    data = await res.json();
    console.log("✅ Remotive data fetched:", data.jobs?.length || 0);
  } catch (error) {
    console.error("❌ Remotive JSON parsing error:", error);
    return [];
  }
  console.log("Remotive data:", data);

  return data.jobs
    .filter((job) =>
      location
        ? job.candidate_required_location
            ?.toLowerCase()
            .includes(location.toLowerCase())
        : true
    )
    .map((job) => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || "Remote",
      type: "remote", // Always remote on Remotive
      description: job.description,
      url: job.url,
      source: "Remotive",
    }));
}
