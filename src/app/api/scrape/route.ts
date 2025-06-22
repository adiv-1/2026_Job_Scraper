import { NextRequest, NextResponse } from "next/server";
import { scrapeGoogleJobs } from "@/lib/googleJobsScraper";
import { isIdealJob, getSponsorshipLabel } from "@/lib/filter";
import fs from "fs";
import path from "path";

// --- Logging utility functions ---

// Save logs in project root
const logPath = path.resolve(process.cwd(), "serpapi_usage.log");

// Log this search (timestamp, keyword, location)
function logSearch(keyword: string, location: string) {
  const now = new Date().toISOString();
  const entry = `${now}\t${keyword}\t${location}\n`;
  fs.appendFileSync(logPath, entry, "utf-8");
}

// Count searches made today
function searchesToday() {
  if (!fs.existsSync(logPath)) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const logs = fs.readFileSync(logPath, "utf-8").split("\n").filter(Boolean);
  return logs.filter((line) => line.startsWith(today)).length;
}

// --- API route handler ---

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || "Data Science Intern";
    const location = searchParams.get("location") || "New York";

    // Check quota
    if (searchesToday() >= 25) {
      return NextResponse.json(
        { error: "Daily search quota reached. Try again tomorrow." },
        { status: 429 }
      );
    }

    // Log this search
    logSearch(keyword, location);

    // Scrape jobs and filter only the top 15
    const raw = await scrapeGoogleJobs(keyword, location);
    const jobsToCheck = raw.slice(0, 15);
    const filtered = [];
    for (let job of jobsToCheck) {
      if (await isIdealJob(job)) filtered.push(job);
    }

    // Add sponsorship label to each job
    const jobsWithSponsorship = await Promise.all(
      filtered.map(async (job) => ({
        ...job,
        sponsorship: await getSponsorshipLabel(job),
      }))
    );

    return NextResponse.json(jobsWithSponsorship);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Client-side code (e.g., in a React component)
// const res = await fetch(...);
// if (!res.ok) {
//   setLoading(false);
//   // Optionally set an error state here
//   return;
// }
// const data = await res.json();
// setJobs(data);
// setLoading(false);
