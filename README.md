# 2026 Job Scraper

A personal project to streamline the search for 2026 full-time and internship roles at top companies. This web app scrapes Google Jobs using [SerpApi](https://serpapi.com/), then uses Google Gemini (LLM) to filter for highly relevant roles and label whether a job is likely to sponsor work visas. The result is a clean, searchable interface showing only the most relevant opportunities for students and early-career professionals.

## What This Project Does

- **Google Jobs Scraping:** Fetches job listings by keyword and location using SerpApi.
- **LLM Filtering:** Uses Google Gemini to filter for target companies/roles (consulting, finance, tech, etc.) and only shows 2026 internships or entry-level full-time roles.
- **Sponsorship Labeling:** Uses Gemini to label whether a job is likely to sponsor work visas (e.g., H-1B, F-1 OPT).
- **Job Details:** Displays job title, company, location, date posted, days since posting, description, apply link, and sponsorship status.
- **Daily Quota:** Limits the number of searches per day to avoid API overuse.
- **Modern UI:** Built with Next.js App Router and React for a fast, responsive experience.

## Why I Built This

Finding relevant, high-quality job postings for competitive roles is time-consuming and often requires sifting through hundreds of listings. This project automates that process, focusing on the types of roles and companies most sought after by students and recent grads, and adds a sponsorship label to help international candidates.

## How It Works

1. **Enter a keyword and location** (e.g., "Data Science Intern", "New York").
2. The app scrapes Google Jobs for matching roles.
3. Each job is filtered by an LLM (Google Gemini) to check if it matches target companies/roles and is for 2026 internships or entry-level full-time positions.
4. The LLM also labels whether the job/company is likely to sponsor work visas.
5. Results are displayed in a table with all relevant details and a direct apply link.

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
```

### 2. Set up environment variables

Create a `.env.local` file in the root directory with:

```
SERPAPI_KEY=your_serpapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/page.tsx` — Main UI and job search page
- `src/app/api/scrape/route.ts` — API route for scraping, filtering, and labeling jobs
- `src/lib/googleJobsScraper.ts` — Google Jobs scraping logic
- `src/lib/filter.ts` — LLM-based filtering and sponsorship labeling

## Deploy

You can deploy this app to [Vercel](https://vercel.com/) or any platform that supports Next.js.
