import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

const JOB_EXAMPLES = `
Examples of target companies/roles:
Strategy Consulting: McKinsey & Company, BCG, Bain & Company, Oliver Wyman, EY-Parthenon, Strategy& (PwC), Deloitte S&A (Monitor), Accenture
Bulge Bracket Asset Mgmt: Goldman Sachs Asset Management, Morgan Stanley Investment Mgmt, J.P. Morgan Asset Management, Citi, Bank of America, UBS Asset Management, Barclays, Deutsche Bank, BNP Paribas, Credit Suisse AM
Private Equity: Blackstone, KKR, Apollo, Carlyle, Brookfield, TPG, Bain Capital, Vista, General Atlantic, Silver Lake, Hellman & Friedman, Oaktree, Ares, StepStone, Partners Group
Hedge Funds / Quant: Bridgewater, Citadel, Jane Street, Two Sigma, DE Shaw, Renaissance, Point72, Millennium, Jump, HRT
Big Tech (Strategy/Data): Google, Meta, Amazon, Microsoft, Palantir, Stripe, OpenAI, Nvidia, Tesla, Apple, Adobe, ASML, Broadcom
Venture Capital / Growth: Sequoia, a16z, Insight, General Catalyst, Accel, Lightspeed, Battery, Bessemer, Redpoint, Founders Fund, Coatue, Thrive, etc.
Misc: APM, Biz Ops, Corp Strategy, Finance, Data, Deployment Strategist, Applied AI, Risk, CSE, Growth, Quant, etc.
The search is ONLY for 2026 Internship or Full-Time Roles.
Only return "Yes" if this condition is met: The job is similar to type of companies listed above (even if not exactly named) and is an internship or entry-level full-time role for 2026.
Otherwise, return "No".
`;

export async function isIdealJob(job: {
  title: string;
  company: string;
  loc: string;
  description?: string;
}) {
  const prompt = `
${JOB_EXAMPLES}

Evaluate the following job posting. Respond ONLY with "Yes" or "No".

Title: ${job.title}
Company: ${job.company}
Location: ${job.loc}
Job Description: ${job.description || ""}

Reply with "Yes" only if BOTH conditions are met as described above. Otherwise, reply "No".
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = await result.response.text();
  return response.trim().toLowerCase().startsWith("yes");
}

export async function getSponsorshipLabel(job: {
  title: string;
  company: string;
  loc: string;
  description?: string;
}) {
  const prompt = `
Given the following job posting, does the company or role likely sponsor work visas for international candidates (such as H-1B, F-1 OPT, etc.)? 
Respond ONLY with "Yes" or "No". If unsure, respond "No".

Title: ${job.title}
Company: ${job.company}
Location: ${job.loc}
Job Description: ${job.description || ""}

Reply with "Yes" if there is any indication of sponsorship or if the company is known to sponsor. Otherwise, reply "No".
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = await result.response.text();
  return response.trim().toLowerCase().startsWith("yes") ? "Yes" : "No";
}
