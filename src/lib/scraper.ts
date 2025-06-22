// src/lib/googleJobsScraper.ts
const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);

type JobResult = {
  title: string;
  company: string;
  loc: string;
  description?: string;
  datePosted?: string;
  link?: string;
};

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
      // Map jobs to unified format, extracting description and date posted if available
      const jobs: JobResult[] = data.jobs_results.map((job: any) => ({
        title: job.title,
        company: job.company_name,
        loc: job.location,
        description: job.description?.split("\n")[0] || "",
        datePosted: job.detected_extensions?.posted_at || "",
        link:
          (job.related_links &&
            job.related_links[0] &&
            job.related_links[0].link) ||
          job.apply_link ||
          job.link ||
          "",
      }));
      resolve(jobs);
    });
  });
}
