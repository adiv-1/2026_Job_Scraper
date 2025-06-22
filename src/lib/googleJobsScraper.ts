// src/lib/googleJobsScraper.ts
const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);

type JobResult = {
  title: string;
  company: string;
  loc: string;
  city?: string;
  country?: string;
  description?: string;
  datePosted?: string;
  daysAgo?: string;
  link?: string;
};

function extractCityCountry(loc: string): { city: string; country: string } {
  if (!loc) return { city: "", country: "" };
  // Example: "New York, NY, United States"
  const parts = loc.split(",").map((s) => s.trim());
  let city = "",
    country = "";
  if (parts.length === 1) {
    city = parts[0];
  } else if (parts.length === 2) {
    city = parts[0];
    country = parts[1];
  } else {
    city = parts[0];
    country = parts[parts.length - 1];
  }
  return { city, country };
}

function getDaysAgo(datePosted: string): string {
  if (!datePosted) return "N/A";
  // Try to parse common formats e.g., "2 days ago"
  const match = datePosted.match(/(\d+)\s+day/);
  if (match) return match[1];
  // Try for absolute dates
  const parsedDate = new Date(datePosted);
  if (!isNaN(parsedDate.getTime())) {
    const diffMs = Date.now() - parsedDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)).toString();
  }
  return "N/A";
}

export async function scrapeGoogleJobs(
  keyword: string,
  location: string
): Promise<JobResult[]> {
  return new Promise((resolve, reject) => {
    const params = {
      engine: "google_jobs",
      q: keyword,
      location: location,
      hl: "en",
    };

    search.json(params, (data: any) => {
      if (!data.jobs_results) {
        resolve([]);
        return;
      }
      const jobs: JobResult[] = data.jobs_results.map((job: any) => {
        const { city, country } = extractCityCountry(job.location || "");
        const datePosted = job.detected_extensions?.posted_at || "";
        return {
          title: job.title,
          company: job.company_name,
          loc: job.location,
          city,
          country,
          description: job.description?.split("\n")[0] || "",
          datePosted,
          daysAgo: getDaysAgo(datePosted),
          link:
            (job.related_links &&
              job.related_links[0] &&
              job.related_links[0].link) ||
            job.apply_link ||
            job.link ||
            "",
        };
      });
      resolve(jobs);
    });
  });
}
