## The site's pages

The text of every page on juddgurtman.com, as visitors see it. Use it like the facts: cite a page by its ID (like "P3") when your answer uses it. The pages are in Judd's own words, in the first person; answer in the third person.

### P1 | https://juddgurtman.com/ | Home

I check what a number is actually counting before I trust it.
I study Information Analysis at the University of Michigan. In summer 2026 I audited dashboards and call data as an analytics intern. This year I've built a lead router on Palantir Foundry, a research agent that cites every sentence and a code fixer that has to prove its fix. I publish what broke and the measured numbers behind every claim.
- Resume
- LinkedIn
- GitHub
- Email
Or ask Judd Bot about my work →
Studying: Information Analysis, Michigan '27
Building: A fleet of AI agents run by one orchestrator
Last role: Data Analytics Intern, TrueSource
Looking for: Full-time data and AI roles from 2027, open to relocating
Selected work
All work →
Oct 2026 Ontology · AIP Logic · AIP Evals · Workshop · TypeScript · Claude
Lead router on Palantir Foundry
A lead router for a made-up plumbing and heating shop. A classifier labels each lead by category, urgency and safety hazard, a drafting step writes a reply from the shop's own records, and every draft waits in a queue for a person to approve, edit or reject. The data is fictional, and nothing is sent.
Read the case study →
Calls with every field right, run 3 → run 5: 79 → 99 of 168
Blind safety leads, classifier calls right: 72 / 72
Real hazards my SQL rule caught on those leads: 6 / 12
False safety openings, runs 1 to 5 → run 6: 15 → 0
Aug to Sept 2026 Python · FastAPI · Claude API · installable web app
Coach
A full-stack AI fitness app. You talk to it like a trainer and it acts: an agent logs workouts, meals and weigh-ins through 7 tools and writes each day's session from the weights you actually lifted. Under it: a FastAPI backend, a phone app you can install, and a simulator that runs a fake user through ten days to test every change.
[Image: Coach tab: the test user reports a workout and the coach logs it with the log_workout tool]
[Image: Workout tab: today's session, with bench press set at 165 lb because the last logged session was 160]
[Image: Journey tab: level 4, XP and daily quests computed from the logs]
Read the case study → Code ↗
Tools the agent can call: 7
Offline tests: 37
Scorecard, run 1 → 3 of the last 5 runs: 7 → 13 of 13
Cost of a 10-day test run, run 1 → run 16: $2.07 → $1.35
Sept 2026 Python · Claude API · web search
Research agent
Ask it a hard question. It splits the question into smaller ones, researches them in parallel, checks every claim against the exact quote it came from, and writes a brief where every sentence cites a source.
Read the case study → Code ↗
Weakly supported claims, saved replay: 66% → 54%
Sentences with a citation, tuned run: 45 / 46
Invented sources, every saved run: 0
Cost per question, first → tuned run: $1.68 → $1.25
Oct 2026 Python · Claude API · Docker
Code fixer
Point it at a small Python repo whose tests fail. It copies the repo, runs the tests in a locked-down container, lets Claude find and fix the bug with five tools, and checks the result in a fresh container. It never edits your repo: you get a patch to review and a trace of every step.
Code ↗
Held-out bugs fixed, run once (Oct 2), re-graded Oct 5: 9 / 10
Cost per fix, held-out run: $0.078
Time per fix, held-out run: 43 s
Eval cases, each verified before it counts: 29
Sept 2026 Python · MCP · orchestration
Agent fleet
One orchestrator runs my other agents as tools through an MCP server. Anything that spends money has a cap and waits for a person to approve it, and a stuck job gets shut down so it stops costing money.
Read the case study → Code ↗
Agents connected so far: 2
Search cap per question: 4 × 3
Sept 2026 JavaScript · Cloudflare Workers · Claude API
Judd Bot
The assistant on this site. Ask it about my work by voice or text: it answers only from a public list of facts, cites a source for every answer, takes you to any page you ask for, and says it doesn't know rather than guess. Code checks every answer before a visitor sees it.
Try it → Code ↗
Eval questions passed, run of Nov 24: 111 / 111
Questions per visitor per minute: 6
Experience
More →
Data Analytics Intern, TrueSource Summer 2026 Audited 29 KPIs across 4 dashboards and documented 7 inconsistencies. The analytics team added disclaimers to the live dashboards. Assistant varsity lacrosse coach, Aspen High School Spring 2026 Also a volunteer youth flag football coach since 2024.
Writing
All writing →
A research agent that cites every sentence Sept 2026 What broke, starting with zero evidence on the first run, and why the fix I planned was aimed at the wrong cause. How the research agent works, and why Sept 2026 The six-step pipeline, four layers against made-up answers, and a cost ledger that found where the money went.

### P2 | https://juddgurtman.com/work/ | Work: all projects

Work
The Year of AI is one project at a time, shipped in public, each with a write-up of what broke. Every number below came from a measured run, and each case study says which one.
AI projects
Oct 2026 Ontology · AIP Logic · AIP Evals · Workshop · TypeScript · Claude
Lead router on Palantir Foundry
A lead router for a made-up plumbing and heating shop. A classifier labels each lead by category, urgency and safety hazard, a drafting step writes a reply from the shop's own records, and every draft waits in a queue for a person to approve, edit or reject. The data is fictional, and nothing is sent.
Read the case study →
Calls with every field right, run 3 → run 5: 79 → 99 of 168
Blind safety leads, classifier calls right: 72 / 72
Real hazards my SQL rule caught on those leads: 6 / 12
False safety openings, runs 1 to 5 → run 6: 15 → 0
Aug to Sept 2026 Python · FastAPI · Claude API · installable web app
Coach
A full-stack AI fitness app. You talk to it like a trainer and it acts: an agent logs workouts, meals and weigh-ins through 7 tools and writes each day's session from the weights you actually lifted. Under it: a FastAPI backend, a phone app you can install, and a simulator that runs a fake user through ten days to test every change.
[Image: Coach tab: the test user reports a workout and the coach logs it with the log_workout tool]
[Image: Workout tab: today's session, with bench press set at 165 lb because the last logged session was 160]
[Image: Journey tab: level 4, XP and daily quests computed from the logs]
Read the case study → Code ↗
Tools the agent can call: 7
Offline tests: 37
Scorecard, run 1 → 3 of the last 5 runs: 7 → 13 of 13
Cost of a 10-day test run, run 1 → run 16: $2.07 → $1.35
Sept 2026 Python · Claude API · web search
Research agent
Ask it a hard question. It splits the question into smaller ones, researches them in parallel, checks every claim against the exact quote it came from, and writes a brief where every sentence cites a source.
Read the case study → Code ↗
Weakly supported claims, saved replay: 66% → 54%
Sentences with a citation, tuned run: 45 / 46
Invented sources, every saved run: 0
Cost per question, first → tuned run: $1.68 → $1.25
Oct 2026 Python · Claude API · Docker
Code fixer
Point it at a small Python repo whose tests fail. It copies the repo, runs the tests in a locked-down container, lets Claude find and fix the bug with five tools, and checks the result in a fresh container. It never edits your repo: you get a patch to review and a trace of every step.
Code ↗
Held-out bugs fixed, run once (Oct 2), re-graded Oct 5: 9 / 10
Cost per fix, held-out run: $0.078
Time per fix, held-out run: 43 s
Eval cases, each verified before it counts: 29
Sept 2026 Python · MCP · orchestration
Agent fleet
One orchestrator runs my other agents as tools through an MCP server. Anything that spends money has a cap and waits for a person to approve it, and a stuck job gets shut down so it stops costing money.
Read the case study → Code ↗
Agents connected so far: 2
Search cap per question: 4 × 3
Sept 2026 JavaScript · Cloudflare Workers · Claude API
Judd Bot
The assistant on this site. Ask it about my work by voice or text: it answers only from a public list of facts, cites a source for every answer, takes you to any page you ask for, and says it doesn't know rather than guess. Code checks every answer before a visitor sees it.
Try it → Code ↗
Eval questions passed, run of Nov 24: 111 / 111
Questions per visitor per minute: 6
Data projects
Apr 2026 Python · pandas · EIA data
Fuel price volatility
30+ years of weekly U.S. gasoline and diesel prices (26,000+ observations): how volatile they are, how regional prices drift apart, and which shocks drove the biggest swings. A rolling 12-week window, because shorter windows tracked the seasons and longer ones flattened the 2022 shock.
Code ↗
Dec 2025 Python · APIs · SQLite
Movie ratings
A pipeline that pulls film data from the TMDb and OMDb APIs into SQLite, then compares how the two rate each genre. They disagree most on war films (TMDb rates them 1.63 points higher) and almost agree on dramas (0.09 apart).
Code ↗
For fun
[Image: Clout Royale home base: a pixel-art mansion with upgrade stations]
[Image: Clout Royale mission: a top-down arena fight against parody creator characters]
Sept 2026 · TypeScript · Phaser 3
Clout Royale
A satirical top-down arena game about the creator economy. You play a gym influencer defending your mansion from waves of parody creators. Eliminations earn clout, your Aura meter powers your abilities, and your Cringe meter slows you down when you overdo it.
Play it in your browser (keyboard needed) ↗ Code ↗
Desktop only: keyboard and mouse.

### P3 | https://juddgurtman.com/work/coach/ | Coach case study

← All work
Coach
A full-stack AI fitness app I designed and built. You talk to it like a trainer and it acts: it logs your workouts, meals and weigh-ins, writes each day's session from the weights you actually lifted, and remembers you between sessions. A simulated user runs it through ten days to test every change.
Code ↗ Design notes and every run ↗
Built: August to September 2026
Stack: Python, FastAPI, Claude API (Opus), YouTube Data API, HTML/CSS/JS
Size: About 4,600 lines of code and tests, 19 API routes
Tested by: 37 offline tests and a 10-day simulated user, 16 runs
Built with: Claude Code as my pair programmer
[Image: Coach tab: the test user reports a workout and the coach logs it with the log_workout tool]
Coach: you report a workout in plain words; the agent calls log_workout, then answers from the numbers.
[Image: Workout tab: today's session, with bench press set at 165 lb because the last logged session was 160]
Workout: today's session, written from your log. Bench is 165 because Friday was 160 at effort 8.
[Image: Journey tab: level 4, XP and daily quests computed from the logs]
Journey: level, XP and quests, recomputed from the log files on every request.
Screens from the simulated test user (run 16, day 8), not a real person's data.
What's under it
The model is one part of eight. Most of the work was everything around it: the parts that make the agent's actions real, keep its answers tied to the data, and stop it from costing money it shouldn't.
Part · What it does
Phone app · One HTML file with three tabs. It installs to the home screen, and a service worker caches the app shell so it opens offline. Every decision is made on the server.
API · FastAPI, 19 routes: chat, history, the weekly program, today's workout, finishing a workout, progress, the game state, form videos and login.
Agent engine · The system prompt in three blocks, cached frozen part first; 7 tools; a loop of at most 8 rounds per message. A failed turn is rolled back, and after 120 messages the conversation is saved to memory and starts fresh.
Programming · The weekly program and each day's session come back as JSON that must match a schema. Loads come from the lift history, parsed from the logs in both the simulator's format and a real one.
Game layer · XP, levels, quests, streaks, gear and trophies, derived from the log files on every request and never stored as a counter.
Form videos · YouTube Data API search, re-ranked by title match and form words, with junk filtered out. Any failure falls back to a plain YouTube link.
Storage · Plain markdown logs in one data folder, kept out of git. On a server, the folder sits on a volume so redeploys keep it.
Security and cost · A password gate (HttpOnly cookie, rate-limited login), a required header so other sites can't trigger paid calls, and a log of every model call's tokens, cache hits and dollars.
The results
From 16 simulated ten-day runs in September 2026. A scorecard of 13 checks grades each run, and it can re-score any old run for free, so these compare like for like.
What · Result · Measured on
Scorecard, first run · 7 of 13 · Run 1
Scorecard, last 5 runs · 13 of 13 in 3 · Runs 12 to 16; the other two scored 12 and 9
Cost of the same ten days · $2.07 → $1.23–1.35 · Run 1 vs. the full runs among 12 to 16
Asks for bodyweight before the first weigh-in · 4–5 → 0 · Runs 8, 9 and 11 vs. runs 12, 13, 15 and 16
How one message works
Each message runs a small loop: the model decides, code acts, and the result goes back to the model until it answers.
- 01 Your message You
Anything: a workout you just did, a meal, a weigh-in, or "how am I doing?"
- 02 The model decides Claude, with the full context
It sees the coaching rules, your profile and recent sessions, and today: the date, your plan, the workout card on screen, and trends computed in code.
- 03 A tool call One of 7 tools
log_workout, log_meal, log_weight, save_profile, save_note, save_plan or mark_plan_kept. Logging only happens through a tool.
- 04 The result goes back Code
The app saves it and hands the result back to the model. The loop repeats until it answers in text, at most 8 rounds.
- 05 Guards Code
A failed turn is rolled back. A reply that says "Logged" with no tool call gets one hidden check asking for the call.
Give the model the data; don't make it remember or compute
Most wrong answers in the early runs traced back to data the model never saw. So the facts are computed in code and put in front of it:
- Every date carries its weekday and age ("Wed 2026-09-16 (7 days ago)"). Without them, the first run called 8 days "three weeks."
- Weight trends and weekly averages are computed, with a note when it's too early to call a trend.
- Lift history covers every logged session, not just the last 10, so the starting point never scrolls out of view.
- Empty sections say so. With no weigh-ins yet, a missing section read like a blocker, and the coach kept asking for bodyweight. Now it says there are none yet and nothing waits on one.
Frozen first, changing last
The system prompt is three blocks: the coaching rules (the same bytes every time, not even today's date), then the profile and recent sessions, then today. Only the part that changed gets billed at full price. The first run paid full price on 330,704 input tokens for $2.07. Run 16 paid full price on 13,248, read 305,847 from the cache at a tenth of the price, and cost $1.35.
Progress you can't fake
There's a game layer (XP, levels, quests), but it's computed from the log files on every request and never stored as a counter. A tap can't mint progress; only a logged workout, meal or weigh-in can.
How a fake user tests it
Chatting with the coach a few times tells you very little. So simulate.py plays a scripted user against the real app for ten days: 27 messages, plus the weekly program and workout cards. The user is 21, 5'10", about 184 lb, wants to lose 10 lb and bench 185, and has left-knee tendinitis that lunges and split squats flare up.
- A fake clock. Day 8 really is "next Monday" to the app, so week two has a real week one behind it.
- Fake data only. Each run writes to its own folder and refuses to start if the app points anywhere else.
- A hard budget. Before every call, it stops the run if the biggest call so far could push spending past the limit.
- A control user. The same ten days with only the knee removed, so any difference comes from the injury. The coach said yes to lunges and never invented an injury.
- A scorecard of rules, not a model as judge. A model's verdict can change when nothing changed. Thirteen string checks give the same answer every time, cost nothing, and print what they saw.
Test user, day 10
how am I doing overall? weight trend, bench progress, and am I hitting my protein?
Coach
Weight — 184.2 → 182.8 over 8 days, 4 weigh-ins. Last-7-day average 183.5 vs 184.2 the week before. Directionally right, but under two weeks of data is too early to call a trend.
Bench — the strongest part of your file. 155x5x3 → 160x5x3 → 165x5x3 in 9 days, and effort went down from 8 to 7 on the heavier bar.
Protein — this is the hole. Three logged days in the last week, best was 39 g against 175.
From simulation run 16, lightly trimmed. Every number came from the test user's logs, computed in code.
What broke, and what fixed it
What the runs caught · The fix
The chat gave different weights than its own workout card, and called 8 days "three weeks." (Run 1) · Today's card goes in the prompt; every date carries its weekday and age.
It said "we locked it" about a plan the user never answered. (Run 2) · Saved sessions now say when he didn't reply.
It typed "[log_workout] Logged" instead of calling the tool, and saved nothing. It learned the marker from its own saved chats. (Run 5) · Tool calls stay out of the transcripts it reads back.
It asked for bodyweight in 4 to 5 replies before the first weigh-in. (Runs 8, 9, 11) · The context says nothing waits on it, and a new rule lets skipped questions go: 0 asks in runs 12, 13, 15 and 16.
It said "Logged: 3 slices pepperoni" with no tool call. (Run 13) · Code catches "Logged" with no tool in the turn and asks once for the call.
A run lost most of day 1 to refused requests, and the app kept no reason. (Run 14) · Every failed call is logged; a refused conversation is saved and retried once.
Lift history passed every simulated run and read nothing from a real log. The simulator wrote "140x8x3"; a real log says "3x8 @140." · It reads both now. A simulator only tests what it types.
The form-video feature quietly fell back to plain links because the API key was the wrong kind. · Errors are logged instead of swallowed; integrations get one real test call.
Known issues
- Some answers aren't saved on the turn they're given. They get saved later, but the tool check on that message fails.
- The coach no longer asks for a weigh-in at all. It waits until the user reports one.
- The "Logged" check and the retry have only been proven by offline tests, not in a live run yet.
- One scripted user. The scorecard only knows failures a run has already shown.
How I built it
I built it with Claude Code as my pair programmer between August and September 2026. I designed the product, the tools and the checks, tested it on my own training logs, read every simulated transcript, chose each fix, and re-ran the simulation until the results held up across repeat runs.
Next case study Agent fleet → One orchestrator running my agents as tools, with a person approving anything that costs money.

### P4 | https://juddgurtman.com/work/research-agent/ | Research agent case study

← All work
Research agent
Ask it a hard question and get back a short brief where every sentence cites a source. It splits the question up, researches the parts in parallel, and checks every claim against the exact quote it came from before anything reaches the brief.
Code ↗ Design notes ↗ Write-up ↗
Shipped: September 2026
Stack: Python, Claude API (Opus 5 and Sonnet 5), web search
Per question: $0.37 and 7.5 minutes for a two-part question on the shipped code (run of Sep 28)
Built with: Claude Code as my pair programmer
The results
Measured on saved runs from September 28, 2026, and a replay saved on October 4. Before and after compare the same question or the same claims, so the only thing that changed is the fix.
What · Before · After · Measured on
Weakly supported ("partial") claims · 66% · 54% · A saved replay of the tuned run's 116 claims (Oct 4): API quotes vs. recovered quotes
Sentences with a citation · · 45 of 46 · The tuned run (Sep 28). The later runs: 28 of 28, 33 of 33, 24 of 27
Invented sources · · 0 · Every saved run
Cost per question · $1.68 · $1.25 · The same question: the first run vs. the tuned run (Sep 28)
Time per question · 6 min 40 s · 2 min 29 s · The same two runs
What the writer reads · ~194k tokens · ~11.6k · The tuned run: raw search results vs. compact notes
How it works
It's a fixed pipeline with model steps inside it, not one open-ended agent loop. Code sets the order; the model decides within each step what to search, what counts as support, and how to write. That keeps cost, time and failures predictable, and every step can be tested on its own.
- 01 Plan Opus 5, structured output
Breaks the question into 2 to 4 sub-questions. Each one has to stand alone, because each worker only ever sees its own.
- 02 Research Sonnet 5, one worker each, in parallel
Each worker runs up to 3 web searches and writes cited prose. Code turns every citation into an evidence record: claim, quote, URL.
- 03 Recover quotes Plain code, no tokens
The API caps quotes at about 150 characters. Code downloads the source page, finds the quote and completes its sentence.
- 04 Validate Opus 5, parallel batches
A separate model checks each claim against its quote: supported, partial or unsupported. Unsupported claims are dropped.
- 05 Fit context Code, and a cheaper model if needed
The writer sees compact notes, never raw pages. Notes that run over budget are condensed per sub-question and keep their sources.
- 06 Write and audit Opus 5, then code
A structured brief with [S#] citations. Code strips citations to sources that don't exist and counts uncited sentences.
What comes out
The opening of a real brief, for the question "Are AI medical scribes actually reducing doctor burnout?" Every bracketed number points to a source the agent read and checked.
Research brief, bottom line
Ambient AI documentation is now deployed at enterprise scale across most large US health systems — Microsoft reports 400–600+ healthcare organizations on DAX/Dragon Copilot [S2][S3], and Abridge alone spans Kaiser Permanente's 40 hospitals and 24,000+ physicians, Johns Hopkins' 6,700 clinicians, and Mayo Clinic [S6][S8]. The burnout evidence is real but modest and uneven: the first RCT found improvements in burnout, work exhaustion and task load with any scribe but documentation-time savings only for one of two vendors [S15][S17], and a 5-system JAMA study found 13.4 fewer EHR minutes and 16.0 fewer documentation minutes per 8 patient-hours with no significant change in after-hours 'pajama time' [S24].
Quoted as the agent wrote it. Read the full brief and its 53 sources ↗
What broke
The newest search tool returned no citations.
The newest version of the web search tool routes results through a code sandbox, and it came back with no citations at all. I only found out by dumping the raw response for one worker. The older search tool returned cited claims on the same sub-question, so I pinned it. For an agent built on provenance, citations matter more than the newest tool.
My planned fix was aimed at the wrong cause.
Too many claims came back "partial." My plan was to show the checker all of a claim's quotes at once. Before building that, I counted why claims were partial across three runs: 76 to 88% had a quote that was cut off at about 150 characters. The worker had read the whole page; only the excerpt was short.
So the agent now downloads the page with a plain HTTP request and completes the sentence. Matching has to work on words, not characters, because the quote is markdown and the page isn't. Real Wikipedia pages exposed edge cases my first tests missed (link targets, [7] markers, two excerpts glued into one), and handling them recovered more of the cut-off quotes. On a saved replay of the tuned run's 116 claims (October 4), partial claims fell from 66% to 54% and supported claims rose from 29% to 41%.
The first run cost $1.68 and took almost 7 minutes.
A cost ledger for every step showed what I didn't expect: validation, which is basically a grading job, was a third of the cost and took 152 seconds. Lowering how hard it thinks and running its batches in parallel cut it to $0.35 and 31 seconds, partly because the tuned run had fewer claims to check. With a realistic size limit for the notes, so a condensing step stopped running, and a length target for the brief, the same question went to $1.25 and 2 minutes 29 seconds.
The grader isn't as consistent as it looks.
In the saved replay, 5 of the 56 claims whose quote hadn't changed still got a different verdict, all stricter. A claim looks weaker next to stronger ones in the same batch. So one run's small differences are noise, and any real evaluation has to repeat runs.
How it avoids making things up
- Cite it or it doesn't count. Text without a citation never reaches the brief; it's logged as uncited.
- A separate check of every claim against its quote. The checker judges support, not truth, and fails closed: a claim it skipped counts as unsupported. It caught real misattributions, like a Cleveland Clinic statistic cited to a Mass General Brigham quote.
- The writer only sees checked notes and has to cite every factual sentence. Partial support has to be hedged.
- Code audits the brief. It strips citations to sources that don't exist and counts sentences without one.
Known issues
- Partial claims are still about half: 54% in the saved replay. The main cause now is claims that bundle several facts from different sentences. Pages that block downloads or are PDFs keep their cut-off quote.
- A claim's verdict can change when the claims graded next to it change.
- The brief can overshoot its length target: asked for 600 to 900 words, the tuned run wrote 1,204. The other runs stayed inside it.
How I built it
I built it with Claude Code as my pair programmer. It wrote most of the code. I picked what to build, tested it on real questions, measured every step, and decided which problems were worth fixing.
Next case study Coach → An AI trainer tested by a fake user for ten days at a time.

### P5 | https://juddgurtman.com/work/agent-fleet/ | Agent fleet case study

← All work
Agent fleet
My agents are separate apps, each with its own folder, tests and ship. A small MCP server exposes all of them as tools, so one orchestrator agent can run them. Anything that spends money has a cap and waits for a person to approve it.
Code ↗
Shipped: September 2026
Stack: Python, Model Context Protocol (MCP)
Agents connected: The research agent and the code fixer, so far
Built with: Claude Code as my pair programmer
How it works
Every agent follows one result contract: run its command line with --json, and it prints progress on one channel and exactly one JSON object on the other. The server only has to know that contract, not how each agent works inside.
- 01 A request The orchestrator, in Claude Code
Decides which agent a goal needs and calls it like any other tool.
- 02 The MCP server Python, over stdio
One small server exposes every agent as a tool. It checks the settings a caller asked for against the caps.
- 03 The agent runs Its own app, in its own environment
The server starts the agent's command line with --json. Agents never share dependencies, so adding one changes nothing else.
- 04 Progress streams back Code
The agent's stage lines ([3/6]...) become progress updates the caller can watch.
- 05 One result The result contract
Exactly one JSON object: status, output, error, cost in dollars, seconds, and the files it saved.
The tools so far
Tool · What it does · Cost
research · Runs the research agent: a brief where every sentence cites its source. Cost and time measured on a two-part question with the shipped code (run of Sep 28). · $0.37, 7.5 min
recent_research · Lists past briefs, so a caller can reuse one instead of paying again. · Free
fix_code · Runs the code fixer: a Python repo with failing tests in, a patch checked in a fresh sandbox out. It never edits the repo. About $0.06 a fix on its dev eval, and the server caps a fix at $0.50. · ~$0.06
Guarding the money
- Caps a caller can't raise. A research call can ask for at most 4 sub-questions with 3 searches each. It can ask for less, never more.
- A person in the loop. Paid tools aren't pre-approved, so the orchestrator has to ask before it spends.
- Stuck jobs get killed. A cancelled or stuck call shuts down the agent's process so it stops spending. The cleanup runs no matter how the call ends, not only on a timeout.
- Failures say what they cost. Every error comes back as a tool error that includes what was spent.
What I learned
- In an MCP server over stdio, never print to stdout. That channel carries the protocol itself, so one stray print breaks the connection.
- Big results need a limit. The caller caps a tool result at about 25,000 tokens, so long output is cut and points to the saved file instead.
- A paid run must never crash after the money is spent. Anything that touches the network catches its errors and keeps what it already has.
What's next
A front door that sends every request to the right agent and checks my rules on privacy and cost before anything runs, and more agents behind it.
How I built it
I built it with Claude Code as my pair programmer, and the orchestrator itself runs in Claude Code.
Next case study Lead router on Palantir Foundry → Drafted replies for a made-up plumbing shop, with a person approving every one.

### P6 | https://juddgurtman.com/experience/ | Experience

Experience
Where my rule about checking what a number is actually counting comes from.
See my full resume →
June to July 2026
Six weeks, remote
Data Analytics Intern
TrueSource, an OnPoint Group company
- My first estimate of a system's failure rate looked alarming. I took it to the person who owns the process, learned that much of what I'd counted was routing working as designed, and re-cut the outcomes into four categories: handled correctly, intended routing, caller error and true system error. The real error rate was far lower and matched the team's own figure.
- Found why the data was confusing: many call records weren't linked to a Salesforce work order, so outcomes couldn't be measured. Proposed a first-contact resolution metric, and learned it needs a clear definition before anyone builds scorecards on it.
- Audited 29 KPIs across 4 operational dashboards (31 tabs), documented 7 inconsistencies between them from formulas and date filters, and made 8 consolidation recommendations. The analytics team added disclaimers to the live dashboards and flagged one for a rebuild.
- Validated a Power BI model against Salesforce: sample-tested 10 records, then compared the full populations across 2 tables. After my manager's review I changed my first verdict and documented what my first check missed.
- Used AI to classify a large set of calls by reason and resolution, and added a third angle to the analysis that nobody had asked for.
- Gave five presentations in six weeks, the last one to company leadership.
What I took from it: check a number with the person who owns the process before trusting your own cut of the data, and change your conclusion when the evidence changes.
2022 to now
Aspen, Colorado
Work in Aspen
- Bosq, a Michelin-starred restaurant: food runner and server support, summer 2025.
- Labor for a Neighbor: started a neighborhood labor service (window washing, yard work and hauling), summer 2024.
- Jay's Valet: part-time since 2022, now a valet lead running shifts.
Since January 2024
Volunteer
Youth flag football coach
I've coached youth flag football as a volunteer with the Michigan Youth Sports Initiative since January 2024, with a team of about 15 kids.
Spring 2026
Aspen High School
Assistant varsity lacrosse coach
Assistant coach for the Aspen High School varsity lacrosse team, a roster of about 30 players, for the spring 2026 season.
Graduating May 2027
University of Michigan
Information Analysis. I like the part of analytics where the data is messier than the dashboard suggests, and I've spent this year learning to build AI that holds up there.

### P7 | https://juddgurtman.com/writing/ | Writing

Writing
Every build ships with a write-up of what broke and design notes on why it works the way it does. They live next to the code on GitHub.
- Write-upSept 2026 A research agent that cites every sentence ↗ What broke, starting with zero evidence on the first run, and why the fix I planned was aimed at the wrong cause.
- Design notesSept 2026 How the research agent works, and why ↗ The six-step pipeline, four layers against made-up answers, and a cost ledger that found where the money went.
- Design notesSept 2026 How the coach works, and how a fake user tests it ↗ The agent loop and its guards, what the model sees, the ten-day simulator, and all 16 runs with their scores.
- LogOngoing The shipping log ↗ One entry per ship: what it does and the honest version of what broke.

### P8 | https://juddgurtman.com/about/ | About

About
I'm a senior at the University of Michigan studying Information Analysis, graduating in May 2027. I like the part of analytics where the data is messier than the dashboard suggests, and I've spent this year learning to build AI that holds up there.
My working rule: I check what a number is actually counting before I trust it. It came from an internship where my first, alarming estimate turned out to be counting routing that worked as designed. I ask "why" a lot, too: "What's the point of using fake data?" changed what I built next. Sports made me competitive.
Why AI? In August 2026 I wrote down, "I want to build something real so I can learn and understand AI." That became my Year of AI: one project at a time, shipped in public. I learn fast and I'm ambitious: I'm not a computer science major, and since August 2026 I've built Coach, the research agent, the agent fleet, a code fixer and a lead router on Palantir Foundry, each with its own tests and measured results. Some projects start from plain curiosity. The fuel-price one began after I watched Landman, and I built Clout Royale because I've been a gamer my whole life.
Outside of class I coach youth flag football, which I've done as a volunteer since January 2024, and in spring 2026 I was an assistant coach for the Aspen High School varsity lacrosse team. I'm an elite skier, raised on Aspen's mountains. I follow sports analytics a little too closely and love to cook. I lift, and I built Coach partly for my own training. I'm into house music, and this fall I'm taking an electronic music production class to learn to make it. And I can solve a Rubik's cube in about 30 seconds.
[Image: Judd Gurtman]
How I work
- 01 Measure before fixing.
My research agent's obvious fix was aimed at the wrong cause. Counting first showed the real one.
- 02 Only claim what I measured.
Every AI result on this site traces back to a run, a trace file or a controlled replay.
- 03 A person approves anything risky.
If one of my agents is about to spend money or talk to someone, it waits for a human.
Get in touch
I'm looking for full-time data and AI roles starting in 2027, after I graduate. I'm a U.S. citizen, so I don't need visa sponsorship, and I'm open to relocating anywhere in the U.S. and to in-office, hybrid or remote work.
- Resume
- LinkedIn
- GitHub
- Email
Email reaches me at judd@juddgurtman.com.
Or ask Judd Bot about my work.

### P9 | https://juddgurtman.com/resume/ | Resume

Resume
- Download PDF
- LinkedIn
- GitHub
- Email
Judd Gurtman
Ann Arbor, MI judd@juddgurtman.com juddgurtman.com linkedin.com/in/judd-gurtman-208769235 github.com/juddg-commits
Information Analysis senior (May 2027) who checks what a number is actually counting, then builds and tests the fix.
Education
University of Michigan, School of Information · B.S. Information, Information Analysis Expected May 2027
Coursework: Data-Oriented Programming (Python, SQL), Statistics and Data Analysis, Information Ethics; this fall: Data Manipulation, Data Exploration, User Modeling, client capstone.
Online courses completed: Google Data Analytics (Coursera); Analyzing and Visualizing Data with Power BI (DavidsonX, edX).
Experience
TrueSource, an OnPoint Group company · Data Analytics Intern, remote Jun to Jul 2026
- Took my first failure-rate estimate to the process owner and re-cut outcomes into 4 categories (handled correctly, intended routing, caller error, true system error); the real rate was far lower, matching the team's.
- Gave five presentations in six weeks, the last one to company leadership.
- Audited 29 KPIs across 4 dashboards (31 tabs), traced 7 inconsistencies to formulas and date filters, and made 8 consolidation recommendations; the team added disclaimers to the live dashboards and flagged one for a rebuild.
- Validated a Power BI model against Salesforce: sample-tested 10 records, then compared full populations across 2 tables; after my manager's review, changed my verdict and documented what my first check missed.
- Found why the data was hard to read: many call records had no linked Salesforce work order; classified calls by reason with AI and proposed a first-contact resolution metric.
Jay's Valet, Aspen · Valet lead (part-time) 2022 to present
- Run shifts that range from 2 or 3 valets to more than 10, depending on the event.
Bosq, Aspen (Michelin-starred restaurant) · Food runner and server support Summer 2025
Labor for a Neighbor, Aspen · Founder Summer 2024
- Started and ran a window washing, yard work and hauling service: 20 to 40 customers in one summer with a crew of 3 to 5.
Projects
Lead router on Palantir Foundry · Ontology, AIP Logic, AIP Evals, Workshop, TypeScript, Claude Oct 2026
- Built a lead router for a sample plumbing business: it classifies each lead, drafts a reply from customer, price and schedule records, and queues it for a person to approve, edit or reject. The classifier names the hazard, and code writes the safety steps.
- Tested my SQL safety rule on blind leads written by a separate session: it caught 6 of 12 real hazards while the classifier got all 72 calls right, so I made the rule flag-only. No safety lead has missed its safety opening on any run.
- Scored prompts v2 to v4 on the final key and one judge wording: calls with every field right rose from 79 to 99 of 168.
Research agent: cited research briefs · Python, Claude API, web search Sep 2026
- Counted causes before fixing: in three runs, 76 to 88% of weak claims came from quotes cut off at 150 characters; recovering full sentences cut them from 66% to 54% in a saved replay.
Coach: full-stack fitness app · Python, FastAPI, Claude API Aug to Sep 2026
- Built a FastAPI backend (19 routes), an installable phone front end and a Claude agent that acts through 7 tools: it logs workouts, meals and weigh-ins and writes each day's session from logged lifts.
Fuel price volatility · Python, pandas Apr 2026
- Compared 26,000+ weekly EIA fuel prices across regions: the West Coast's gap to the U.S. average varies over 2x the Gulf Coast's.
Movie ratings · Python, APIs, SQLite Dec 2025
- Compared how two sources rate each film genre: TMDb rates action and horror 0.7 to 0.8 points above OMDb, and on drama they agree within 0.1.
Leadership
Michigan Youth Sports Initiative: volunteer youth flag football coach, team of about 15, since 2024 · Aspen High School: assistant varsity lacrosse coach, roster of about 30, spring 2026
Skills
Code and data: Python (pandas, NumPy, matplotlib), SQL, JavaScript, TypeScript, FastAPI, REST APIs, Git, GitHub Actions, Cloudflare Workers, Power BI (model validation), Salesforce, Excel
AI: Claude API (tool use, structured outputs, prompt caching), MCP, multi-agent orchestration, LLM evaluation, Claude Code
Interests: Skiing, sports analytics, lacrosse, house music

### P10 | https://juddgurtman.com/work/lead-router/ | Lead router case study

← All work
Lead router on Palantir Foundry
A small plumbing and heating shop gets leads at all hours, and some of them are emergencies. I built a lead router for a made-up shop: it labels each lead, drafts a reply from the shop's own records, and holds every draft in a queue for a person. The data is fictional, and nothing is sent.
Built: October 2026
Stack: Ontology, AIP Logic, AIP Evals, Workshop, TypeScript, Claude
Tested by: 56 test leads, drafted 3 times each (168 calls a run), 6 scored runs
Data: Fictional. Nothing is sent.
Built with: Claude Code as my pair programmer
[Image: The review queue in Workshop: leads sorted with safety leads first, a no-heat message from a customer with a 6-month-old, and a draft reply that opens with safety steps above Approve, Edit and Reject buttons]
The review queue. Safety leads sort to the top. This one is a no-heat call with a 6-month-old in the house. Code puts the safety steps at the top of the reply, and a person approves, edits or rejects it.
[Image: A spam lead offering search rankings, with a draft whose reply is NO_REPLY and whose status is pending]
Spam. The draft is NO_REPLY. Approve and Edit are blocked for it, so it can only be rejected.
[Image: The Ontology's seven object types with their counts: Opening 38, Customer 30, Decision 1, Draft 4, Job 95, Service 27 and Lead 56]
The Ontology. Seven object types: Lead, Customer, Job, Service, Opening, Draft and Decision. 56 leads, 30 customers and 95 past jobs.
[Image: The evaluation suite's list of runs from October 11 to October 26, each with 168 test cases and an average duration of 8 to 10 seconds]
Scored runs. Each run drafts every lead three times, 168 calls, so I can see what a prompt change did.
What it is
A slow reply loses the job, because people call the next company on the list. So I built a lead router for a made-up shop on Palantir's AIP Developer Tier. A classifier in AIP Logic labels each lead by category, urgency and safety hazard. Then a drafting step writes a reply from the shop's own records: customers, past jobs, prices and open appointment windows. Every draft lands in a Workshop queue, where a person approves, edits or rejects it.
Code decides which leads are red, puts the safety instructions at the top of a reply, and checks every fact in a draft before a person sees it.
- 01 A lead arrives Fictional data
A message to the shop, at any hour. Some are emergencies and some are spam.
- 02 Safety floor A SQL rule, no model
Reads the subject, the message and the outdoor temperature and flags gas, carbon monoxide, flooding or no heat. A hit makes the lead red and sends it to a person.
- 03 Classify Claude Sonnet 5.5, in AIP Logic
Labels the lead by category, urgency and safety hazard.
- 04 Draft TypeScript functions and one model call
Code gathers the shop's records for this customer (past jobs, prices, open appointment windows) and builds the prompt. The model writes the reply.
- 05 Check Code
Puts the safety instructions at the top of a safety reply and checks every fact in the draft before a person sees it.
- 06 Review A person, in a Workshop queue
Approves, edits or rejects. A spam draft can only be rejected, and an edit to a safety reply has to keep the full safety opening.
The results
Every run drafts the 56 test leads 3 times, 168 calls. The runs are numbered 1 to 6, from October 9 to October 26, 2026.
What · Before · After · Measured on
Calls with every field right · 79 of 168 · 99 of 168 · Run 3 (Oct 12, prompt v2) vs. run 5 (Oct 26, prompt v4), on the final key and one judge wording
Calls with a false safety opening · 15 · 0 · Every run from 1 to 5 vs. run 6 (Oct 26), the first after the safety rule became flag-only
Safety-lead calls that got their opening · · 48 of 48 · Run 6
Blind safety leads: the classifier · · 72 of 72 · 24 leads written by a separate session, 3 calls each (Oct 26)
Blind safety leads: my SQL rule · · 6 of 12 · The real hazards among those 24 leads. It also left 7 of the 12 lookalikes alone
Time to draft · · about 9 s · The median per eval call in run 6. The 90th percentile was 13 seconds
How it's tested
Scoring runs in AIP Evals. Code grades two things: whether the draft matched the right customer, and whether it cited exactly the records it should. An LLM judge from a different model family grades what the reply says and what it avoids. My own script re-scores every exported run, and it has never disagreed with the platform on the code-graded fields.
The judge is noisier. In run 6 it failed one lead (L025) on all 3 calls for not saying the price covered sink drains, though the reply quoted the listed price.
The drafting rules started as Python on my laptop and became TypeScript functions on Foundry, with the prompt inside that code. A parity test checks that the TypeScript builds the exact same prompt as the Python, byte for byte. It matches on 144 of 144 prompts.
The classifier, v1 to v2
I froze v1's prompt before it saw a lead. On the first 40 leads, it got all three labels right on every run for 32 of them. Safety was 120 of 120 calls, and urgency was the weakest at 107 of 120. I wrote v2 after seeing v1's misses, so its perfect score on those 40 is a training score and I don't count it.
On 8 held-out leads, v1 got 3 right on every run and v2 got all 8. The catch is that those 8 were written from the rules v2 encodes. The miss I remember is a chirping carbon monoxide detector that v1 called a question with no urgency, on all 3 runs. On 8 later safety leads, written by a fresh Claude session that hadn't seen any prompt or result, v2 got all 24 calls right.
Keeping the test honest
From the second draft prompt on, a fresh Claude session wrote each prompt from a short brief, without seeing the results or the answer key. The held-out leads came from sessions like that too, and so did anything else that could be tuned to the test.
The answer key changed four times. Every old key stays byte for byte as it was, so I can re-score any old run exactly, and the answers live only in the keys and the eval suites, never anywhere a function can read.
Four draft prompts
Facts are the cleanest trend, because code grades them. Calls that cited exactly the records in the key went from 41 of 144 on v1 (run 1) to 102, 102, 123, 122 and 115 of 168 in runs 2 to 6. I reworded the judge's rubric at run 3, so its scores only compare within runs 1 and 2 and within runs 3 to 6. From run 3 on, calls with every field right went 79, 99, 99 and 98 of 168.
Each prompt answered the run before it.
- v1 was the baseline for run 1.
- v2 moved the "marked urgent" line into code. Replies cite the customer's own record, give price ranges and past jobs, offer windows only for a visit, and ask new senders for a phone number.
- v3 tells a safety customer with a booked job not to wait for it, and a quote offers the free estimate, with no appointment windows unless the customer asks for them.
- v4 treats a customer asking "when" as wanting a visit, names the booked job, and gives a past job its date.
I stopped after run 5, when v4 matched v3 at 99 of 168 calls with every field right, and wrote the leftover misses down as known limits instead of writing a fifth prompt.
The safety floor
The safety floor is a SQL rule with no model in it. It reads a lead's subject, message and the outdoor temperature and flags gas, carbon monoxide, flooding or no heat. At first a floor hit also chose the safety opening a draft starts with. On the 56 leads it was right on 50, with 5 false flags and 1 miss.
Those 5 false flags put a safety opening on 15 calls in every run from 1 to 5. For most of the project my notes blamed the classifier for them. They were the floor's.
Then I had a separate Claude session write 24 test leads for the floor, 12 real hazards and 12 lookalikes. Nobody has read their messages. The floor caught 6 of the 12 hazards and left 7 of the 12 lookalikes alone. The classifier got all 72 calls right.
So the floor only raises a flag now. A hit still makes the lead red and sends it to a person, but the opening comes from the classifier. Run 6 was the first with that change. It had no false openings, all 48 calls on safety leads got their opening, and the judge's score for what a reply avoids went from 140 to 153 of 156.
The Edit action had the same kind of hole. Its check only looked at the opening's first words, and in my test it let through all 16 cut openings and all 48 swapped ones. Now it matches the hazard's full opening and gets 144 of 144 test cases right.
Known limits
- On two leads (L019 and L052) the key and the prompt disagree, and I left both as they are.
- Two others (L034 and L055) drop the customer's past job on every call.
- The judge misread 5 calls in run 6, so a difference of a few calls between runs doesn't mean much. One run can't tell me whether the facts dip in run 6, from 122 to 115, came from the floor change.
- Nothing is sent, and there's one approval so far, so I have no approval or edit rates.
- The held-out sets are small: 8 leads, then 8 safety leads.
What's next
The next fix is a better floor, because the classifier has matched the key on every label I've measured since v2. A second version of the floor gets all 56 right on the leads it was written from, but only 8 of 12 hazards and 9 of 12 lookalikes on the blind set. I want a bigger blind set before I trust it. After that comes sending, behind the same approval step, and letting my orchestrator agent call the approval actions.
How I built it
Built with help from LLMs, mostly Claude. Claude Code did most of the typing on my laptop, and Claude in the desktop app drove the browser on Foundry. I decided what to build, how to test it, and what counts.
Next case study Research agent → A brief where every sentence cites its source.
