// The projects shown on Home and Work. Every number here was measured; the case
// study pages say which run or replay it came from.

export type Result = { label: string; value: string };
export type Project = {
  slug?: string;          // has its own case study page at /work/<slug>/
  title: string;
  when: string;
  stack: string;
  summary: string;
  results?: Result[];
  cta?: { label: string; href: string };      // a page on this site to try it
  shots?: { src: string; alt: string }[];     // small screenshots under the summary
  links: { label: string; href: string }[];
};

const repo = "https://github.com/juddg-commits/year-of-ai/tree/main/apps";

export const aiProjects: Project[] = [
  {
    slug: "coach",
    title: "Coach",
    when: "Aug to Sept 2026",
    stack: "Python · FastAPI · Claude API · installable web app",
    summary:
      "A full-stack AI fitness app. You talk to it like a trainer and it acts: an agent logs workouts, meals and weigh-ins through 7 tools and writes each day's session from the weights you actually lifted. Under it: a FastAPI backend, a phone app you can install, and a simulator that runs a fake user through ten days to test every change.",
    results: [
      { label: "Tools the agent can call", value: "7" },
      { label: "Offline tests", value: "37" },
      { label: "Scorecard, first run → best", value: "7 → 13 of 13" },
      { label: "Cost of a 10-day test run", value: "$2.07 → $1.35" },
    ],
    shots: [
      { src: "/images/coach-chat.jpg", alt: "Coach tab: the test user reports a workout and the coach logs it with the log_workout tool" },
      { src: "/images/coach-workout.jpg", alt: "Workout tab: today's session, with bench press set at 165 lb because the last logged session was 160" },
      { src: "/images/coach-journey.jpg", alt: "Journey tab: level 4, XP and daily quests computed from the logs" },
    ],
    links: [{ label: "Code", href: `${repo}/health-coach` }],
  },
  {
    slug: "research-agent",
    title: "Research agent",
    when: "Sept 2026",
    stack: "Python · Claude API · web search",
    summary:
      "Ask it a hard question. It splits the question into smaller ones, researches them in parallel, checks every claim against the exact quote it came from, and writes a brief where every sentence cites a source.",
    results: [
      { label: "Weakly supported claims", value: "64% → 41%" },
      { label: "Sentences with a citation", value: "45 / 46" },
      { label: "Invented sources", value: "0" },
      { label: "Cost per question", value: "$1.68 → $1.25" },
    ],
    links: [{ label: "Code", href: `${repo}/research-agent` }],
  },
  {
    slug: "agent-fleet",
    title: "Agent fleet",
    when: "Sept 2026",
    stack: "Python · MCP · orchestration",
    summary:
      "One orchestrator runs my other agents as tools through an MCP server. Anything that spends money has a cap and waits for a person to approve it, and a stuck job gets shut down so it stops costing money.",
    results: [
      { label: "Agents connected so far", value: "1" },
      { label: "Search cap per question", value: "4 × 3" },
    ],
    links: [{ label: "Code", href: `${repo}/fleet-mcp` }],
  },
  {
    title: "Judd Bot",
    when: "Sept 2026",
    stack: "JavaScript · Cloudflare Workers · Claude API",
    summary:
      "The assistant on this site. Ask it about my work by voice or text: it answers only from a public list of facts, cites a source for every answer, takes you to any page you ask for, and says it doesn't know rather than guess. Code checks every answer before a visitor sees it.",
    results: [
      { label: "Eval questions passed, last run", value: "99 / 100" },
      { label: "Questions per visitor per minute", value: "6" },
    ],
    cta: { label: "Try it", href: "/ask/" },
    links: [{ label: "Code", href: "https://github.com/juddg-commits/juddgurtman.com/tree/main/bot" }],
  },
];

export const dataProjects: Project[] = [
  {
    title: "Fuel price volatility",
    when: "Data project",
    stack: "Python · pandas · EIA data",
    summary:
      "30+ years of weekly U.S. gasoline and diesel prices (26,000+ observations): how volatile they are, how regional prices drift apart, and which shocks drove the biggest swings. A rolling 12-week window, because shorter windows tracked the seasons and longer ones flattened the 2022 shock.",
    links: [{ label: "Code", href: "https://github.com/juddg-commits/fuel-price-volatility" }],
  },
  {
    title: "Movie ratings",
    when: "Data project",
    stack: "Python · APIs · SQLite",
    summary:
      "A pipeline that pulls film data from the TMDb and OMDb APIs into SQLite, then compares how the two rate each genre. They disagree most on war films (TMDb rates them 1.63 points higher) and almost agree on dramas (0.09 apart).",
    links: [{ label: "Code", href: "https://github.com/juddg-commits/movie-ratings-analysis" }],
  },
];

export const writing = [
  {
    title: "A research agent that cites every sentence",
    kind: "Write-up",
    when: "Sept 2026",
    summary: "What broke, starting with zero evidence on the first run, and why the fix I planned was aimed at the wrong cause.",
    href: "https://github.com/juddg-commits/year-of-ai/blob/main/apps/research-agent/WRITEUP.md",
  },
  {
    title: "How the research agent works, and why",
    kind: "Design notes",
    when: "Sept 2026",
    summary: "The six-step pipeline, four layers against made-up answers, and a cost ledger that found where the money went.",
    href: "https://github.com/juddg-commits/year-of-ai/blob/main/apps/research-agent/DESIGN.md",
  },
  {
    title: "How the coach works, and how a fake user tests it",
    kind: "Design notes",
    when: "Sept 2026",
    summary: "The agent loop and its guards, what the model sees, the ten-day simulator, and all 16 runs with their scores.",
    href: "https://github.com/juddg-commits/year-of-ai/blob/main/apps/health-coach/DESIGN.md",
  },
  {
    title: "The shipping log",
    kind: "Log",
    when: "Ongoing",
    summary: "One entry per ship: what it does and the honest version of what broke.",
    href: "https://github.com/juddg-commits/year-of-ai/blob/main/curriculum/log.md",
  },
];
