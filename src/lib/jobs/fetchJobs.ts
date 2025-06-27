// /lib/fetchJobs.ts
const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY!;
const JSEARCH_URL = "https://jsearch.p.rapidapi.com/search";

type JobSearchParams = {
  query: string;
  location?: string;
  skills?: string[];
  experience?: string;
  salary?: string;
};

export async function fetchJobsFromJSearch(params: JobSearchParams) {
  const {
    query,
    location = "",
    skills = [],
    experience = "",
    salary = "",
  } = params;

  const response = await fetch(
    `${JSEARCH_URL}?query=${query} ${skills.join(" ")}&location=${location}`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    }
  );

  const data = await response.json();
  return data.data || [];
}
