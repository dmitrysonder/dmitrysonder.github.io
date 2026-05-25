// Extras: scroll progress, stats banner with counters, skill marquee, career Gantt timeline.

const { useState: _useState, useEffect: _useEffect, useRef: _useRef } = React;

// ─── Scroll Progress ─────────────────────────────────────────────────
function ScrollProgress() {
  const [p, setP] = _useState(0);
  _useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-bar" style={{ transform: `scaleX(${p})` }}></div>
    </div>
  );
}

// ─── Animated number counter ─────────────────────────────────────────
function useInView(threshold = 0.3) {
  const ref = _useRef(null);
  const [seen, setSeen] = _useState(false);
  _useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function CountUp({ value }) {
  const [ref, seen] = useInView(0.4);
  const [display, setDisplay] = _useState("0");

  const match = String(value).match(/([^\d-]*)([\d\s,.]+)(.*)/);
  const prefix = match ? match[1] : "";
  const numStr = match ? match[2].replace(/[\s,]/g, "") : "0";
  const suffix = match ? match[3] : "";
  const target = parseFloat(numStr) || 0;

  _useEffect(() => {
    if (!seen) return;
    if (!match) { setDisplay(String(value)); return; }
    const start = performance.now();
    const dur = 1200;
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const cur = target * eased;
      const formatted =
        target >= 1000
          ? Math.floor(cur).toLocaleString("en-US").replace(/,/g, value.includes(",") ? "," : " ")
          : (Number.isInteger(target) ? Math.floor(cur).toString() : cur.toFixed(1));
      setDisplay(prefix + formatted + suffix);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);

  // Reset on value change (e.g. lang switch) — show static target immediately if not yet seen
  _useEffect(() => {
    if (!seen) setDisplay(String(value));
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

// ─── Stats Banner ────────────────────────────────────────────────────
function StatsBanner({ data }) {
  const stats = data.ui.stats;
  return (
    <section className="stats" data-screen-label="Stats">
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat-value"><CountUp value={s.value} /></div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-note">{s.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Skill Marquee ───────────────────────────────────────────────────
const MARQUEE_ROW_1 = [
  "TypeScript", "Node.js", "React", "Solidity", "NestJS", "PostgreSQL",
  "AWS", "Next.js", "GraphQL", "tRPC", "Docker", "Prisma", "BullMQ",
  "LayerZero", "Axelar", "Hardhat", "EVM", "Google Apps Script",
];
const MARQUEE_ROW_2_RU = [
  "смарт-контракты", "платежные интеграции", "CI/CD", "event sourcing",
  "cross-chain", "yield-стратегии", "LLM-пайплайны", "API-дизайн",
  "REST", "Web3", "AWS Lambda", "DynamoDB", "MongoDB", "Telegram API",
];
const MARQUEE_ROW_2_EN = [
  "smart contracts", "payment integrations", "CI/CD", "event sourcing",
  "cross-chain", "yield strategies", "LLM pipelines", "API design",
  "REST", "Web3", "AWS Lambda", "DynamoDB", "MongoDB", "Telegram API",
];

function MarqueeRow({ items, dir = 1, speed = 50 }) {
  const dup = [...items, ...items, ...items];
  return (
    <div className={`marquee-row dir-${dir > 0 ? "fwd" : "rev"}`} style={{ "--speed": `${speed}s` }}>
      <div className="marquee-track">
        {dup.map((s, i) => (
          <span key={i} className="marquee-item">
            {s}<span className="marquee-sep">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillMarquee({ data }) {
  const row2 = data.lang === "en" ? MARQUEE_ROW_2_EN : MARQUEE_ROW_2_RU;
  return (
    <section className="marquee" aria-hidden="true" data-screen-label="Marquee">
      <MarqueeRow items={MARQUEE_ROW_1} dir={1} speed={70} />
      <MarqueeRow items={row2} dir={-1} speed={90} />
    </section>
  );
}

// ─── Career Gantt Timeline ───────────────────────────────────────────
const TIMELINE = {
  start: 2018,
  end: 2026.5,
  bars: [
    { id: "alttoken",   company: "AltTokenFund",      role_ru: "Ethereum Smart Contract",  role_en: "Ethereum Smart Contract",  start: 2018.75, end: 2019.0 },
    { id: "spreadsheet",company: "Spreadsheet Fund",  role_ru: "Software Engineer / CEO",  role_en: "Software Engineer / CEO",  start: 2019.1,  end: 2023.4 },
    { id: "epam",       company: "EPAM Systems",      role_ru: "Senior QA Automation",     role_en: "Senior QA Automation",     start: 2019.95, end: 2021.45 },
    { id: "interswap",  company: "InterSwap",         role_ru: "CTO / Senior Engineer",    role_en: "CTO / Senior Engineer",    start: 2021.0,  end: 2025.1 },
    { id: "vaulty",     company: "Vaulty.fi",         role_ru: "Senior Backend & Solidity",role_en: "Senior Backend & Solidity",start: 2021.4,  end: 2022.0 },
    { id: "skillbox",   company: "Skillbox",          role_ru: "Backend Engineer",         role_en: "Backend Engineer",         start: 2023.7,  end: 2024.55 },
    { id: "fundraise",  company: "Fundraise Up",      role_ru: "Backend Engineer",         role_en: "Backend Engineer",         start: 2025.1,  end: 2026.0 },
    { id: "soulbook",   company: "SoulBook.io",       role_ru: "CTO / Founder",            role_en: "CTO / Founder",            start: 2026.0,  end: 2026.5, now: true },
  ],
};

function CareerTimeline({ data }) {
  const ui = data.ui;
  const [hover, setHover] = _useState(null);
  const span = TIMELINE.end - TIMELINE.start;
  const years = [];
  for (let y = TIMELINE.start; y <= Math.floor(TIMELINE.end); y++) years.push(y);

  const lanes = [];
  const placed = TIMELINE.bars.map((b) => {
    let lane = 0;
    while (lanes[lane] && lanes[lane] > b.start) lane++;
    lanes[lane] = b.end;
    return { ...b, lane };
  });
  const laneCount = lanes.length;
  const roleKey = data.lang === "en" ? "role_en" : "role_ru";

  return (
    <section className="section" id="timeline" data-screen-label="Timeline">
      <Reveal className="section-head">
        <div className="section-label">{ui.sections.timeline.num}</div>
        <h2 className="section-title">{ui.sections.timeline.title}</h2>
      </Reveal>

      <Reveal className="gantt" delay={100}>
        <div className="gantt-years">
          {years.map((y) => (
            <div className="gantt-year" key={y} style={{ left: `${((y - TIMELINE.start) / span) * 100}%` }}>
              <span className="gantt-year-label">{y}</span>
              <div className="gantt-year-tick"></div>
            </div>
          ))}
        </div>

        <div className="gantt-lanes" style={{ "--lanes": laneCount }}>
          {placed.map((b) => {
            const left = ((b.start - TIMELINE.start) / span) * 100;
            const width = ((b.end - b.start) / span) * 100;
            const isHover = hover === b.id;
            return (
              <div
                key={b.id}
                className={`gantt-bar ${b.now ? "is-now" : ""} ${isHover ? "is-hover" : ""}`}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  top: `calc(var(--lane-h) * ${b.lane})`,
                }}
                onMouseEnter={() => setHover(b.id)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="gantt-bar-inner">
                  <span className="gantt-bar-company">{b.company}</span>
                  <span className="gantt-bar-role">{b[roleKey]}</span>
                </div>
                {b.now && <span className="gantt-now-tag">{ui.nowTag}</span>}
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

// ─── Compact bilingual PDF export ────────────────────────────────────
// Builds a compact one-page resume in EN + RU, opens a print window
// and triggers the browser's "Save as PDF" dialog.
function downloadCompactResumePdf() {
  const ru = (typeof getResume === "function") ? getResume("ru") : window.RESUME_RU;
  const en = (typeof getResume === "function") ? getResume("en") : window.RESUME_EN;

  const esc = (s) => String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const renderColumn = (d, labels) => {
    const top = d.experience.slice(0, 4);
    const skills = [
      ...d.skills.languages, ...d.skills.backend, ...d.skills.frontend,
      ...d.skills.blockchain, ...d.skills.infra,
    ];
    return `
      <section class="col">
        <header class="col-head">
          <h1>${esc(d.name.first)} ${esc(d.name.last)}</h1>
          <div class="role">${esc(d.role)} · ${esc(d.location)}</div>
          <div class="links">
            <span>${esc(d.email)}</span>
            <span>${esc(d.site)}</span>
            <span>github.com/${esc(d.github)}</span>
          </div>
          <p class="intro">${esc(d.intro)}</p>
        </header>

        <h2>${esc(labels.exp)}</h2>
        <ul class="exp">
          ${top.map((e) => `
            <li>
              <div class="exp-line"><strong>${esc(e.role)}</strong> · ${esc(e.company)} <span class="year">${esc(e.year)}</span></div>
              <div class="exp-sum">${esc(e.summary)}</div>
            </li>`).join("")}
        </ul>

        <h2>${esc(labels.projects)}</h2>
        <ul class="proj">
          ${d.projects.slice(0, 3).map((p) => `
            <li><strong>${esc(p.name)}</strong> — ${esc(p.desc)}</li>`).join("")}
        </ul>

        <h2>${esc(labels.skills)}</h2>
        <div class="skills">${skills.map(esc).join(" · ")}</div>

        <h2>${esc(labels.edu)}</h2>
        <div>${esc(d.education.degree)}, ${esc(d.education.school)}</div>

        <h2>${esc(labels.langs)}</h2>
        <div>${d.langs.map((l) => `${esc(l.name)} (${esc(l.level)})`).join(" · ")}</div>
      </section>
    `;
  };

  const labelsRu = { exp: "Опыт", projects: "Проекты", skills: "Навыки", edu: "Образование", langs: "Языки" };
  const labelsEn = { exp: "Experience", projects: "Projects", skills: "Skills", edu: "Education", langs: "Languages" };

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Dmitry Smirnov · Resume (EN + RU)</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #111;
    font-size: 9.5px;
    line-height: 1.4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10mm;
  }
  .col { break-inside: avoid; }
  h1 {
    font-size: 18px;
    margin: 0 0 2px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  h2 {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 10px 0 4px;
    color: #2f6b4a;
    border-bottom: 1px solid #ddd;
    padding-bottom: 2px;
  }
  .role { font-size: 10px; color: #444; margin-bottom: 3px; }
  .links { display: flex; flex-wrap: wrap; gap: 8px; font-size: 8.5px; color: #666; margin-bottom: 6px; }
  .intro { margin: 4px 0 0; font-size: 9.5px; }
  ul { list-style: none; padding: 0; margin: 0; }
  ul.exp li { margin-bottom: 6px; }
  .exp-line { font-size: 10px; }
  .exp-line .year { color: #888; float: right; font-variant-numeric: tabular-nums; }
  .exp-sum { font-size: 9px; color: #333; margin-top: 1px; }
  ul.proj li { margin-bottom: 3px; font-size: 9px; }
  .skills { font-size: 8.5px; color: #333; }
  @media print {
    .no-print { display: none !important; }
  }
  .toolbar {
    position: fixed; top: 12px; right: 12px;
    background: #111; color: #fff; padding: 8px 12px;
    border-radius: 6px; font-size: 12px; cursor: pointer;
    font-family: inherit; border: 0;
  }
</style>
</head>
<body>
  <button class="toolbar no-print" onclick="window.print()">Save as PDF</button>
  <div class="wrap">
    ${renderColumn(en, labelsEn)}
    ${renderColumn(ru, labelsRu)}
  </div>
  <script>
    window.addEventListener("load", () => setTimeout(() => window.print(), 300));
  <\/script>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (!w) { alert("Allow pop-ups to download the PDF."); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

Object.assign(window, { ScrollProgress, StatsBanner, SkillMarquee, CareerTimeline, CountUp, downloadCompactResumePdf });
