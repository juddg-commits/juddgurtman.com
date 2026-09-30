// The Ask page: the orb, the conversation, and talking to it.
// The bot itself lives in bot/ (a Cloudflare Worker); this file only talks to it.

const HOST = ["localhost", "127.0.0.1"].includes(location.hostname) ? "http://127.0.0.1:8787" : "https://bot.juddgurtman.com";
const UNREACHABLE = "Judd Bot can't be reached right now. You can ask Judd at judd@juddgurtman.com.";
const STOP = /^(stop|bye|goodbye|that's all|that is all|thanks,? that's all|end|exit|never ?mind)\b/i;
const PAGES = {
  "/": "Home", "/ask/": "Ask Judd Bot", "/work/": "Work", "/work/research-agent/": "Research agent",
  "/work/coach/": "Coach", "/work/agent-fleet/": "Agent fleet", "/experience/": "Experience",
  "/writing/": "Writing", "/about/": "About", "/resume/": "Resume",
};
const SAVED = "judd-bot-conversation";   // this tab only (sessionStorage), so Back from a page keeps the chat
// The bot reads only the first 300 characters of each earlier turn, and the Worker refuses a body
// over 4,000, so the page sends no more than that. The cut never splits an emoji.
const clip = (s) => String(s ?? "").slice(0, 300).replace(/[\uD800-\uDBFF]$/, "");
// Speech recognizers don't know the name: "what's good, Judd Bot" came back as "what's good jukebox".
const NAME = /\b(?:juke ?box|jug ?bot|judd? ?bot|judge ?bot|dud ?bot)\b/gi;
const fixName = (text) => text.replace(NAME, "Judd Bot").replace(/\bjud\b/gi, "Judd");
// Of the recognizer's guesses for a phrase, the first that has the name in it, or else its best guess.
const bestGuess = (result) => {
  for (let i = 0; i < result.length; i++) if (/\b(judd|jud)\b/i.test(result[i].transcript)) return result[i].transcript;
  return result[0].transcript;
};
const PAUSE = 1300;   // ms of quiet after you speak that ends the question; a shorter pause mid-sentence doesn't

export function startAsk() {
  const $ = (id) => document.getElementById(id);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const form = $("form"), input = $("q"), send = $("send"), mic = $("mic"), turns = $("turns"), stage = $("stage");
  const placeholder = input.placeholder;
  // The page scrolls like any other. As the conversation grows it scrolls just enough to keep the question
  // box in view, but only if the box was in view: a visitor who scrolled up to read isn't pulled back down.
  const dock = document.querySelector(".ask-dock");
  const dockInView = () => { const r = dock.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
  const follow = (update, always = false) => {
    const stay = always || dockInView();
    update?.();
    if (stay) dock.scrollIntoView({ block: "nearest" });
  };

  // ── The orb ───────────────────────────────────────────────────────────────
  // state: idle | typing | listening | thinking | speaking | navigating. Energy eases
  // toward a target per state; kick adds short pulses (a keystroke, a spoken word).
  const orb = { state: "idle", energy: 0.1, kick: 0, mic: 0, spin: 1 };
  const canvas = $("orb"), ctx = canvas.getContext("2d");
  const size = () => {
    const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  new ResizeObserver(size).observe(canvas);

  const LAYERS = [   // shape and motion; the colors come from THEMES
    { r: 1.0, sp: 0.55, seed: 0.0 },
    { r: 0.93, sp: -0.75, seed: 2.1 },
    { r: 0.86, sp: 1.05, seed: 4.4 },
    { r: 0.5, sp: 0.35, seed: 7.3 },
  ];
  // The site's colors (--accent and --ink in global.css): a green orb, ink rings. On dark the
  // layers add up to light ("lighter"), so the core glows. On a light page that would wash out
  // to white, so the layers stack normally and the core is a lighter green.
  const THEMES = {
    light: {
      blend: "source-over", ring: "16,19,22", halo: "10,107,79", glow: [0.07, 0.12],
      layers: [["10,107,79", 0.85], ["30,150,108", 0.6], ["5,70,52", 0.45], ["200,242,224", 0.9]],
    },
    dark: {
      blend: "lighter", ring: "238,241,243", halo: "76,199,154", glow: [0.12, 0.22],
      layers: [["22,120,88", 0.55], ["76,199,154", 0.45], ["20,150,150", 0.3], ["215,250,235", 0.7]],
    },
  };
  const scheme = matchMedia("(prefers-color-scheme: dark)");
  let theme = scheme.matches ? THEMES.dark : THEMES.light;
  scheme.addEventListener("change", () => { theme = scheme.matches ? THEMES.dark : THEMES.light; });
  const TARGET = { idle: 0.08, typing: 0.2, starting: 0.14, listening: 0.18, thinking: 0.38, speaking: 0.3, navigating: 0.5 };
  const SPEED = { thinking: 2.6, navigating: 3.2, listening: 1.4, speaking: 1.5 };

  function blob(cx, cy, R, t, e, L, [rgb, a]) {
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      const n = Math.sin(a * 3 + t * L.sp * 1.3 + L.seed) * 0.5
              + Math.sin(a * 5 - t * L.sp * 0.9 + L.seed * 1.7) * 0.3
              + Math.sin(a * 2 + t * L.sp * 0.6 + L.seed * 2.3) * 0.4;
      const r = R * L.r * (1 + n * (0.035 + e * 0.16));
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * L.r * 1.25);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(0.7, `rgba(${rgb},${a * 0.45})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.fill();
  }
  function rings(cx, cy, R, t, e) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = `rgba(${theme.ring},0.28)`;
    ctx.lineWidth = 1.2;
    ctx.rotate(t * 0.25 * orb.spin);
    const r1 = R * (1.42 + e * 0.06);
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(0, 0, r1, k * 2.094, k * 2.094 + 1.3); ctx.stroke(); }
    ctx.rotate(-t * 0.55 * orb.spin);
    const r2 = R * 1.62;
    for (let k = 0; k < 90; k++) {
      const a = (k / 90) * Math.PI * 2, long = k % 15 === 0, len = long ? 10 : 4;
      ctx.globalAlpha = long ? 0.55 : 0.22;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.lineTo(Math.cos(a) * (r2 + len), Math.sin(a) * (r2 + len));
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  let t = 0, last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt * (SPEED[orb.state] ?? 1) * (reduce ? 0.35 : 1);
    orb.spin += ((orb.state === "thinking" ? 3 : 1) - orb.spin) * 0.05;
    orb.kick *= 0.9;
    orb.mic *= 0.94;   // set by what the recognizer hears, then fades
    let target = TARGET[orb.state] + orb.kick + (orb.state === "listening" ? orb.mic * 1.4 : 0);
    if (orb.state === "idle") target += Math.sin(t * 1.6) * 0.03;
    orb.energy += (Math.min(target, 1) - orb.energy) * 0.14;
    const e = reduce ? orb.energy * 0.4 : orb.energy;

    const w = canvas.clientWidth, h = canvas.clientHeight, cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.26 * (1 + e * 0.12);
    ctx.clearRect(0, 0, w, h);
    // The glow fades out before the canvas edge, so no box shows around the orb.
    const halo = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, Math.min(R * 2.2, Math.min(w, h) / 2));
    halo.addColorStop(0, `rgba(${theme.halo},${theme.glow[0] + e * theme.glow[1]})`);
    halo.addColorStop(1, `rgba(${theme.halo},0)`);
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);
    rings(cx, cy, R, t, e);
    ctx.globalCompositeOperation = theme.blend;
    LAYERS.forEach((L, i) => blob(cx, cy, R, t, e, L, theme.layers[i]));
    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(frame);
  }
  requestAnimationFrame((n) => { size(); last = n; frame(n); });

  let convo = false, busy = false, online = true, typingTimer;
  const status = $("status");
  function setState(s, label) {
    orb.state = s;
    const idle = !online ? "OFFLINE" : convo ? "YOUR TURN" : SR ? "TAP TO TALK" : "ONLINE";
    status.textContent = label ?? { idle, typing: "READY", starting: "ONE MOMENT", listening: "LISTENING", thinking: "THINKING", speaking: "SPEAKING", navigating: "NAVIGATING" }[s];
  }

  // ── The conversation ──────────────────────────────────────────────────────
  const history = [];   // [{q, a}]: the last three go with each question, so follow-ups make sense
  const shown = [];     // what's on screen, saved for this tab
  const save = () => { try { sessionStorage.setItem(SAVED, JSON.stringify({ history, shown })); } catch {} };

  const el = (tag, cls, text) => Object.assign(document.createElement(tag), { className: cls ?? "", textContent: text ?? "" });
  // Own keys only: "constructor" is in every object, but it isn't a page.
  const pageName = (path) => (Object.hasOwn(PAGES, path) ? PAGES[path] : path);
  const label = (u) => (u.hostname === "juddgurtman.com" ? pageName(u.pathname)
    : u.pathname.split("/").filter(Boolean).slice(-2).join("/") || u.hostname);

  function addTurn(question) {
    $("intro")?.remove();
    turns.querySelectorAll(".ask-next").forEach((n) => n.remove());   // only the latest answer offers follow-ups
    $("try").hidden = true;
    stage.classList.add("small");
    const turn = el("div", "ask-turn");
    turn.append(el("div", "ask-q", question));
    const a = el("div", "ask-a"), p = el("p");
    const dots = el("span", "ask-dots");   // "thinking" until the answer's first words replace it
    dots.setAttribute("aria-hidden", "true");
    dots.append(el("i"), el("i"), el("i"));
    p.append(dots);
    a.append(p);
    turn.append(a);
    follow(() => turns.append(turn), true);   // they just asked: show it
    return { a, p };
  }
  function addSources(a, sources) {
    const links = [];
    for (const s of Array.isArray(sources) ? sources : []) {
      try { if (/^https:\/\//.test(s)) links.push(new URL(s)); } catch {}   // skip anything that isn't a real link
    }
    if (!links.length) return;
    const box = el("div", "ask-sources");
    for (const u of links) {
      // Pages on this site open here, by path, so they work on any copy of the site; the rest open in a new tab.
      const onSite = u.hostname === "juddgurtman.com";
      box.append(Object.assign(el("a", "", label(u)), onSite ? { href: u.pathname + u.hash } : { href: u.href, target: "_blank", rel: "noopener" }));
    }
    a.append(box);
  }

  // Questions it can answer next: buttons under the latest answer.
  function addNext(a, list) {
    if (!Array.isArray(list) || !list.length) return;
    const box = el("div", "ask-next");
    for (const q of list) {
      const b = el("button", "", q);
      b.type = "button";
      b.disabled = !online;
      b.addEventListener("click", () => ask(b.textContent));
      box.append(b);
    }
    follow(() => a.append(box));
  }

  let voices = [];
  if ("speechSynthesis" in window) {
    voices = speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => { voices = speechSynthesis.getVoices(); };
  }
  function pickVoice() {   // a calm British voice first, for the Jarvis feel; any English voice after that
    // Voices on the device first: Chrome's online ones stop partway through anything over about 15 seconds.
    for (const pool of [voices.filter((v) => v.localService), voices]) {
      for (const re of [/Google UK English Male/, /Daniel/, /Arthur/, /en-GB/, /Google US English/, /Samantha/, /^en/]) {
        const v = pool.find((v) => re.test(v.name) || re.test(v.lang));
        if (v) return v;
      }
    }
    return null;
  }
  let utterances = 0;   // counted, so a late timer can't cancel a newer one
  // Safari on iPhone speaks later only if the page spoke during a tap: a silent word, said in the tap, does it.
  const unlockSpeech = () => { if ("speechSynthesis" in window) { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } };
  function speak(text, onWord, onEnd) {
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 1.02;
    u.pitch = 0.9;
    u.onboundary = (ev) => { orb.kick = 0.55; onWord?.(ev); };
    // Some voices never start and some never send "end": give up on those instead of staying busy
    // forever. Past the second timer, the words must be done.
    const mine = ++utterances;
    let started = false, ended = false;
    const finish = () => { if (!ended) { ended = true; clearTimeout(late); clearTimeout(stuck); onEnd(); } };
    const giveUp = () => { if (mine === utterances) speechSynthesis.cancel(); finish(); };
    const late = setTimeout(() => started || giveUp(), 5000);
    const stuck = setTimeout(giveUp, 4000 + text.length * 90);
    u.onstart = () => { started = true; };
    u.onend = u.onerror = finish;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  // Reveal the answer word by word: in step with the voice when speaking, on a timer otherwise.
  function deliver(text, { p }, speakIt, done) {
    const words = text.split(/(\s+)/);
    let upTo = 0, timer;
    const show = (n) => {
      if (n <= upTo) return;
      upTo = n;
      follow(() => { p.textContent = words.slice(0, n).join(""); });
    };
    const type = (ms, then) => {   // a word and its space at a time
      orb.kick = 0.25;
      show(upTo + 2);
      if (upTo < words.length) timer = setTimeout(() => type(ms, then), ms); else then?.();
    };
    $("live").textContent = text;
    setState("speaking");
    if (speakIt && "speechSynthesis" in window) {
      // Some voices (Chrome's Google ones) send no word events: then type along at about the pace of speech.
      let heard = false;
      const fallback = setTimeout(() => heard || type(320), 1000);
      speak(text, (ev) => {
        heard = true;
        clearTimeout(timer);
        show(text.slice(0, ev.charIndex + (ev.charLength || 1)).split(/(\s+)/).length);
      }, () => { clearTimeout(fallback); clearTimeout(timer); show(words.length); done(); });
      return;
    }
    type(reduce ? 0 : 45, done);
  }

  async function ask(question) {
    question = question.trim();
    if (!question || busy || !online) return;
    if (listening) stopListening();   // typed or clicked mid-listen: close the mic, or it hears its own answer
    if ($("voice").checked) unlockSpeech();
    quiet = 0;   // a typed question counts as a turn, not a silence
    busy = true;
    send.disabled = true;
    input.value = "";
    const turn = addTurn(question);
    setState("thinking");
    let data;
    const stop = new AbortController();
    const timer = setTimeout(() => stop.abort(), 30000);
    try {
      const res = await fetch(`${HOST}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history: history.slice(-3).map((t) => ({ q: clip(t.q), a: clip(t.a) })) }),
        signal: stop.signal,
      });
      data = await res.json();
    } catch {} finally {
      clearTimeout(timer);
    }
    if (typeof data?.answer !== "string" || !data.answer) data = { kind: "busy", answer: UNREACHABLE, sources: [] };
    const answer = data.answer;
    if (data.kind === "answer" || data.kind === "navigate") history.push({ q: question, a: answer });
    const going = data.kind === "navigate" && Object.hasOwn(PAGES, data.page) ? data.page : null;
    shown.push({ q: question, a: answer, sources: data.sources ?? [], next: data.follow_ups ?? [] });
    save();

    deliver(answer, turn, convo || $("voice").checked, () => {
      busy = false;   // first, so nothing below can leave the page stuck
      send.disabled = !online;
      addSources(turn.a, data.sources);
      if (going) {
        busy = send.disabled = true;   // leaving: a question asked now would be lost
        turn.a.append(el("div", "ask-go", `Opening ${pageName(going)} …`));
        setState("navigating");
        endConvo(true);
        setTimeout(() => { location.href = going; }, 1200);
        return;
      }
      addNext(turn.a, data.follow_ups);
      setState("idle");
      if (convo) setTimeout(listen, 350);   // your turn again
      else input.focus({ preventScroll: true });
    });
  }

  let toastTimer;
  function toast(msg) {
    const box = $("toast");
    box.textContent = msg;
    box.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => box.classList.remove("show"), Math.max(2600, msg.length * 60));   // long enough to read
  }

  input.addEventListener("input", () => {
    if (busy || orb.state === "listening") return;
    orb.kick = Math.min(0.5, orb.kick + 0.18);
    setState("typing");
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => orb.state === "typing" && setState("idle"), 900);
  });
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
  $("voice").addEventListener("change", (e) => { if (e.target.checked) unlockSpeech(); });
  document.querySelectorAll("#try button").forEach((b) => b.addEventListener("click", () => ask(b.textContent)));
  // Three starter questions, different on each visit, so people see how much it can answer.
  const starters = [...document.querySelectorAll("#try button")];
  for (let i = starters.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [starters[i], starters[j]] = [starters[j], starters[i]]; }
  starters.forEach((b, i) => { b.hidden = i >= 3; });

  // ── Talking to it ─────────────────────────────────────────────────────────
  // A conversation: tap the orb or the mic and it listens right away, inside the tap: that's when
  // browsers let a page start the mic, and nothing you say is missed while it talks. It answers out
  // loud and listens again until you say "stop" or tap again. It never listens while it's speaking,
  // so it can't hear itself. Only the recognizer opens the mic.
  if (!SR) { mic.disabled = true; mic.title = "Voice needs Chrome, Edge or Safari"; }
  let rec, listening = false, quiet = 0, startedOnce = false, retried = false;
  // Why the browser won't listen, in words. Silence ("no-speech") is handled on its own.
  const MIC_ERRORS = {
    "not-allowed": "The microphone is blocked for this site. Allow it from the address bar, then tap the orb again.",
    "service-not-allowed": "This browser won't do speech recognition right now. Try Chrome, or type your question.",
    "audio-capture": "No microphone found. Check that one is connected and that your browser may use it.",
    // Not "offline": the browser couldn't reach its speech service (an extension or a blocked Google service, usually).
    "network": "Your browser couldn't reach its speech service, so voice isn't working right now. Tap the orb to try again, or type your question.",
    "language-not-supported": "Voice isn't available in English in this browser. You can type your question.",
  };

  function startConvo() {
    if (!SR || convo || !online) return;
    convo = true;
    quiet = 0;
    startedOnce = false;
    retried = false;
    mic.classList.add("on");
    mic.setAttribute("aria-label", "End the conversation");
    stage.setAttribute("aria-label", "End the conversation");
    unlockSpeech();
    if (busy) { startedOnce = true; return; }   // it listens when the answer finishes, outside this tap
    listen();
  }
  function endConvo(quietly = false) {
    convo = false;
    stopListening();
    if (!quietly) window.speechSynthesis?.cancel();
    mic.classList.remove("on");
    mic.setAttribute("aria-label", "Start a voice conversation");
    stage.setAttribute("aria-label", "Talk to Judd Bot");
    if (!busy && orb.state !== "navigating") setState("idle");
  }

  function listen() {
    if (!convo || busy || listening || !online) return;
    listening = true;
    const r = (rec = new SR());
    r.lang = "en-US";
    r.interimResults = true;
    // It keeps listening through pauses, and the question ends after PAUSE of quiet. Not on Android,
    // whose Chrome is known to repeat results in continuous mode: there it's one phrase at a time.
    r.continuous = !/Android/i.test(navigator.userAgent);
    r.maxAlternatives = 5;
    let finals = "", interim = "", problem = "", wrote = false, hearing = false, pause, nothing;
    const said = () => fixName(`${finals} ${interim}`.replace(/\s+/g, " ").trim());
    const finish = () => { clearTimeout(pause); clearTimeout(nothing); try { r.stop(); } catch {} };
    // Only once the mic is really recording does it say LISTENING, so nobody talks into a mic that isn't on yet.
    const nowHearing = () => {
      if (hearing || rec !== r || !listening) return;   // not for a recognizer that already ended
      hearing = true;
      setState("listening");
      showListening("on");
      nothing = setTimeout(finish, 8000);   // not a word: stop, and it counts as a silence
    };
    // In case a browser never says "audiostart". Chrome can take 1.7 s after "start", so this waits longer.
    r.onstart = () => { startedOnce = true; setTimeout(nowHearing, 3000); };
    r.onaudiostart = nowHearing;
    r.onspeechstart = () => {   // someone's talking: give the words time to come back
      orb.mic = 0.6;
      clearTimeout(nothing);
      nothing = setTimeout(finish, 10000);
    };
    r.onresult = (e) => {
      const heard = [], guess = [];
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) heard.push(bestGuess(e.results[i])); else guess.push(e.results[i][0].transcript);
      }
      finals = heard.join(" ");
      interim = guess.join(" ");
      input.value = said();   // what it hears, as you say it
      wrote = true;
      orb.mic = 0.9;
      clearTimeout(nothing);
      clearTimeout(pause);
      pause = setTimeout(finish, PAUSE);
    };
    r.onerror = (e) => { problem = e.error; };
    r.onend = () => {
      clearTimeout(pause);
      clearTimeout(nothing);
      listening = false;
      showListening("off");
      if (!convo) return;
      if (problem === "network" && !retried) { retried = true; setTimeout(listen, 600); return; }   // sometimes a blip: one more try
      if (MIC_ERRORS[problem]) {
        console.warn(`Judd Bot voice: the browser's speech recognition failed with "${problem}"`);
        if (wrote) input.value = "";
        // After a listen that started fine, a refusal means the browser wants a tap for each one (Safari).
        toast(problem === "not-allowed" && startedOnce ? "Tap the orb to keep talking." : MIC_ERRORS[problem]);
        endConvo();
        return;
      }
      const question = said();
      if (!question) {   // silence: listen once more, then stop and say so
        if (wrote) input.value = "";
        if (++quiet < 2) { setTimeout(listen, 250); return; }
        endConvo();
        toast("I didn't hear anything, so I stopped listening. Tap the orb to try again.");
        return;
      }
      quiet = 0;
      if (STOP.test(question)) { input.value = ""; endConvo(); return; }
      ask(question);
    };
    setState("starting");
    showListening("starting");
    try { r.start(); } catch {
      listening = false;
      showListening("off");
      toast(MIC_ERRORS["service-not-allowed"]);
      endConvo();
    }
  }
  // The orb may be scrolled out of view, so the box and the mic button say it too. mode: starting | on | off
  function showListening(mode) {
    if (online) input.placeholder = { starting: "One moment…", on: "Listening… ask your question" }[mode] ?? placeholder;
    mic.classList.toggle("listening", mode === "on");
    if (mode !== "on") orb.mic = 0;
  }
  function stopListening() {   // close the mic without its events starting anything
    if (rec) { rec.onresult = rec.onend = rec.onerror = rec.onspeechstart = rec.onstart = rec.onaudiostart = null; rec.abort(); }
    listening = false;
    showListening("off");
  }

  const toggle = () => (convo ? endConvo() : startConvo());
  mic.addEventListener("click", toggle);
  stage.addEventListener("click", toggle);
  stage.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  addEventListener("pagehide", () => { stopListening(); window.speechSynthesis?.cancel(); });
  // Back from a page the bot opened: the browser may bring this page back exactly as it was, mid-"Opening".
  addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    turns.querySelectorAll(".ask-go").forEach((n) => n.remove());
    if (convo) endConvo(true);
    busy = false;
    send.disabled = !online;
    setState("idle");
  });

  // ── Start ─────────────────────────────────────────────────────────────────
  // Bring back this tab's conversation (after the bot sent you to a page and you came back).
  try {
    const saved = JSON.parse(sessionStorage.getItem(SAVED) ?? "null");
    if (Array.isArray(saved?.shown) && saved.shown.length) {
      const past = Array.isArray(saved.history) ? saved.history : [];
      history.push(...past.filter((t) => typeof t?.q === "string" && typeof t?.a === "string").slice(-3));
      for (const s of saved.shown.slice(-10)) {
        shown.push(s);
        const turn = addTurn(s.q);
        turn.p.textContent = s.a;
        addSources(turn.a, s.sources);
        addNext(turn.a, s.next);   // addTurn clears it again for every turn but the last
      }
    }
    if (shown.length) follow(null, true);
  } catch {}
  setState("idle");

  // Is the bot up? If not, say so instead of leaving a box that never answers, and keep checking,
  // so one failed check doesn't turn it off for the whole visit.
  const hint = $("hint").textContent;
  function setOnline(up) {
    online = up;
    if (!up && convo) endConvo();
    input.disabled = send.disabled = !up;
    mic.disabled = !up || !SR;
    stage.tabIndex = up ? 0 : -1;
    stage.setAttribute("aria-disabled", String(!up));
    turns.querySelectorAll(".ask-next button").forEach((b) => { b.disabled = !up; });
    $("try").hidden = !up || Boolean(turns.querySelector(".ask-turn"));
    input.placeholder = up ? placeholder : "Judd Bot is offline right now";
    $("hint").textContent = up ? hint : "You can still reach Judd at judd@juddgurtman.com.";
    setState("idle");
  }
  let retry;
  async function checkHealth() {
    clearTimeout(retry);
    let up = false;
    try { up = (await fetch(`${HOST}/health`, { signal: AbortSignal.timeout?.(10000) })).ok; } catch {}
    if (up !== online) setOnline(up);
    if (!up) retry = setTimeout(checkHealth, 30000);
  }
  addEventListener("online", () => { if (!online) checkHealth(); });
  checkHealth().then(() => {
    // A question from another page (?q=...) is asked right away.
    const q = new URLSearchParams(location.search).get("q");
    if (!q) return;
    window.history.replaceState(null, "", location.pathname);   // a reload shouldn't ask it again
    if (online) ask(q);
  });
}
