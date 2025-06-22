// src/app/page.tsx

"use client";
import React, { useState } from "react";

type Job = {
  title: string;
  company: string;
  loc: string;
  datePosted?: string;
  daysAgo?: string;
  description?: string;
  link?: string;
  sponsorship?: string; // <-- Add this
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("Data Science Intern");
  const [location, setLocation] = useState("New York");

  const fetchJobs = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/scrape?keyword=${encodeURIComponent(
        keyword
      )}&location=${encodeURIComponent(location)}`
    );
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f9f7f3] px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-semibold text-[#232323] mb-2 tracking-tight">
        2026 Full-Time/Intern Job Search
      </h1>
      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          className="rounded-xl border border-[#ebdfc6] bg-[#fffaf3] px-3 py-2 text-lg text-[#232323] placeholder-[#ad9946] focus:outline-none focus:ring-2 focus:ring-[#ffe9b2]"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Keyword (e.g. Data Science Intern)"
        />
        <input
          className="rounded-xl border border-[#ebdfc6] bg-[#fffaf3] px-3 py-2 text-lg text-[#232323] placeholder-[#ad9946] focus:outline-none focus:ring-2 focus:ring-[#ffe9b2]"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. New York)"
        />
        <button
          onClick={fetchJobs}
          className="rounded-xl bg-[#fff5da] hover:bg-[#ffe9b2] px-6 py-2 text-lg font-medium border border-[#ebdfc6] transition-colors text-[#232323]"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {jobs.length > 0 && (
        <div className="w-full max-w-4xl">
          <div className="overflow-x-auto rounded-2xl shadow-md bg-white/70 border border-[#f3ecd2]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8e8c4] text-[#6a5b3b]">
                  <th className="py-3 px-4 font-semibold">Job Title</th>
                  <th className="py-3 px-4 font-semibold">Company</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Date Posted</th>
                  <th className="py-3 px-4 font-semibold">Days Ago</th>
                  <th className="py-3 px-4 font-semibold">Job Description</th>
                  <th className="py-3 px-4 font-semibold">Apply</th>
                  <th className="py-3 px-4 font-semibold">Sponsorship</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, idx) => (
                  <JobRow key={idx} job={job} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <p className="mt-8 text-[#ad9946] text-lg">
          Enter your search criteria and click <b>“Search”</b> to find jobs.
        </p>
      )}
    </main>
  );
}

function JobRow({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);
  const cellClass = "py-3 px-4 text-[#232323]";

  return (
    <tr className="border-b last:border-none border-[#f2e9d6] hover:bg-[#fff8e4]/80 transition-colors">
      <td className={`${cellClass} font-medium`}>{job.title}</td>
      <td className={cellClass}>{job.company}</td>
      <td className={cellClass}>{job.loc}</td>
      <td className={cellClass}>
        {job.datePosted || <span className="text-[#b2a074]/70">N/A</span>}
      </td>
      <td className={cellClass}>
        {job.daysAgo || <span className="text-[#b2a074]/70">N/A</span>}
      </td>
      <td className={`${cellClass} max-w-xs`}>
        {job.description ? (
          <span>
            {expanded || job.description.length < 120
              ? job.description
              : job.description.slice(0, 100) + "... "}
            {job.description.length >= 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[#ad9946] underline ml-1 text-sm"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </span>
        ) : (
          <span className="text-[#b2a074]/70">No description available</span>
        )}
      </td>
      <td className={cellClass}>
        {job.link ? (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#fff5da] px-4 py-2 border border-[#ebdfc6] text-[#9c8530] hover:bg-[#ffe9b2] font-semibold transition"
          >
            Apply
          </a>
        ) : (
          <span className="text-[#b2a074]/70">N/A</span>
        )}
      </td>
      <td className={cellClass}>
        {job.sponsorship || <span className="text-[#b2a074]/70">N/A</span>}
      </td>
    </tr>
  );
}
