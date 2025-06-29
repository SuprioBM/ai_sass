import { Job } from "@/types/Cv";

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID!;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY!;

const SUPPORTED_COUNTRIES = [
  "at",
  "au",
  "be",
  "br",
  "ca",
  "ch",
  "de",
  "es",
  "fr",
  "gb",
  "in",
  "it",
  "mx",
  "nl",
  "nz",
  "pl",
  "sg",
  "us",
  "za",
];

// Adzuna API job shape (partial, only needed fields)
interface AdzunaApiJob {
  title: string;
  company: { display_name: string } | string;
  location: { display_name: string } | string;
  contract_type?: string;
  description: string;
  redirect_url: string;
}

interface AdzunaApiResponse {
  results: AdzunaApiJob[];
  error?: string;
  exception?: string;
}

function inferCountryCode(location?: string): string {
  if (!location) return "us";
  const loc = location.toLowerCase();

  if (loc.includes("bangladesh")) return "in";
  if (loc.includes("india")) return "in";
  if (loc.includes("usa") || loc.includes("united states")) return "us";
  if (loc.includes("canada")) return "ca";
  if (loc.includes("australia")) return "au";
  if (loc.includes("germany")) return "de";
  if (loc.includes("uk") || loc.includes("england") || loc.includes("britain"))
    return "gb";
  if (loc.includes("france")) return "fr";

  return "us";
}

function cleanQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\b\d+\s*(years?)?\s*(experience)?\b/gi, "")
    .replace(/\b(entry|junior|mid|senior)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

type Params = {
  query: string;
  location?: string;
};

export async function fetchFromAdzuna({
  query,
  location = "",
}: Params): Promise<Job[]> {
  const cleanedQuery = cleanQuery(query);

  if (!cleanedQuery || cleanedQuery.length < 2) {
    console.warn("❌ Adzuna skipped: Invalid or empty cleaned query.");
    return [];
  }

  let country = inferCountryCode(location);
  if (!SUPPORTED_COUNTRIES.includes(country)) {
    console.warn(
      `⚠️ Adzuna unsupported country '${country}', falling back to US`
    );
    country = "us";
  }

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=20&what=${encodeURIComponent(
    cleanedQuery
  )}&where=${encodeURIComponent(location || "")}`;

  try {
    const res = await fetch(url);
    const data: AdzunaApiResponse = await res.json();

    console.log("✅ Adzuna data received for country:", country);
    console.log("Adzuna data", data);

    if (data.error || data.exception) {
      console.warn("⚠️ Adzuna API error:", data);
      return [];
    }

    return (data.results || []).map((job) => ({
      title: job.title ?? "No title",
      company:
        typeof job.company === "object" &&
        job.company !== null &&
        "display_name" in job.company
          ? job.company.display_name
          : typeof job.company === "string"
          ? job.company
          : "Unknown",
      location:
        typeof job.location === "object" &&
        job.location !== null &&
        "display_name" in job.location
          ? job.location.display_name
          : typeof job.location === "string"
          ? job.location
          : "Unknown",
      type: (job.contract_type ?? "onsite").toLowerCase() as
        | "remote"
        | "onsite"
        | "hybrid",
      description: job.description ?? "No description",
      url: job.redirect_url ?? "#",
      source: "Adzuna",
    }));
  } catch (err) {
    console.error("❌ Adzuna fetch error:", err);
    return [];
  }
}
