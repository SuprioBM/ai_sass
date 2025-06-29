import { fetchFromJSearch } from "./sources/fetchFromJSearch";
import { fetchFromRemotive } from "./sources/fetchFromRemotive";
import { fetchFromAdzuna } from "./sources/fetchFromAdzuna";
import { fetchFromArbeitNow } from "./sources/fetchFromArbeitNow";

type Job = {
  title: string;
  company: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  description: string;
  url: string;
  source: string;
};

type FetchParams = {
  query: string;
  location?: string;
  type?: "all" | "remote" | "onsite" | "hybrid";
};

export async function fetchAllJobs({
  query,
  location,
  type = "all",
}: FetchParams): Promise<Job[]> {
  if (!query) throw new Error("Query parameter is required");

  console.log(`🌐 Fetching jobs for:
  🔎 Query: "${query}"
  📍 Location: "${location || "any"}"
  🏷️ Type: "${type}"`);

  const sources = [
    { name: "JSearch", fetcher: fetchFromJSearch },
    { name: "Remotive", fetcher: fetchFromRemotive },
    { name: "Adzuna", fetcher: fetchFromAdzuna },
    { name: "ArbeitNow", fetcher: fetchFromArbeitNow },
  ];

  const results = await Promise.allSettled(
    sources.map((source) => {
      return source
        .fetcher({ query, location })
        .then((jobs) => {
          console.log(`✅ ${source.name}: ${jobs.length} jobs fetched.`);
          return jobs;
        })
        .catch((err) => {
          console.error(`❌ ${source.name} error:`, err);
          return [];
        });
    })
  );
   console.log(results);
   
  const allJobs = results
    .filter((r): r is PromiseFulfilledResult<Job[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  console.log(`🧮 Total jobs fetched before filtering: ${allJobs.length}`);

  if (type === "all") return allJobs;

  const filtered = allJobs.filter((job) => job.type === type);
  console.log(`🎯 Jobs after filtering by type="${type}": ${filtered.length}`);
  return filtered;
}
