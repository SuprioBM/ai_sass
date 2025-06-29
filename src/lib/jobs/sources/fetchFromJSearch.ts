import { Job } from "@/types/Cv";

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY!;
const JSEARCH_URL = "https://jsearch.p.rapidapi.com/search";

type Params = {
  query: string;
  location?: string;
};

interface JSearchJob {
  job_title: string;
  employer_name: string;
  job_city: string;
  job_state?: string;
  job_type?: string;
  job_description: string;
  job_apply_link: string;
}

interface JSearchResponse {
  data: JSearchJob[];
}

export async function fetchFromJSearch({
  query,
  location = "",
}: Params): Promise<Job[]> {
  const res = await fetch(
    `${JSEARCH_URL}?query=${encodeURIComponent(
      query
    )}&location=${encodeURIComponent(location)}`,
    {
      headers: {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    }
  );

  const data: JSearchResponse = await res.json();

  return data.data.map((job) => ({
    title: job.job_title,
    company: job.employer_name,
    location: job.job_city + (job.job_state ? ", " + job.job_state : ""),
    type: (job.job_type?.toLowerCase() || "onsite") as
      | "remote"
      | "onsite"
      | "hybrid",
    description: job.job_description,
    url: job.job_apply_link,
    source: "JSearch",
  }));
}
