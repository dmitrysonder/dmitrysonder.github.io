// Main resume layout — Hero, Experience, Projects, Skills, Side, Footer
const { useState, useEffect, useRef } = React;

function useScrollPast(threshold = 8) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return past;
}

function useClock(tz, locale) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  try {
    return now.toLocaleTimeString(locale || "ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: tz });
  } catch (e) {
    return now.toLocaleTimeString();
  }
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add("in");
        io.disconnect();
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, as: As = "div", className = "", ...rest }) {
  const ref = useReveal();
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return <As ref={ref} className={`reveal ${className}`} style={style} {...rest}>{children}</As>;
}

function TopBar({ data, lang, onLangChange }) {
  const past = useScrollPast(8);
  const time = useClock(data.tz, data.ui.locale);
  const ui = data.ui;
  return (
    <header className={`topbar ${past ? "is-scrolled" : ""}`}>
      <div className="topbar-inner">
        <div className="topbar-mark">
          <span className="topbar-dot"></span>
          <span>DS · Full Stack Engineer</span>
        </div>
        <nav className="topbar-nav">
          <a href="#timeline">{ui.nav.exp === "Опыт" ? "Карьера" : "Career"}</a>
          <a href="#experience">{ui.nav.exp}</a>
          <a href="#projects">{ui.nav.proj}</a>
          <a href="#skills">{ui.nav.skills}</a>
          <a href="#contact">{ui.nav.contact}</a>
        </nav>
        <div className="topbar-end">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              className={`lang-btn ${lang === "ru" ? "is-active" : ""}`}
              onClick={() => onLangChange("ru")}
              aria-pressed={lang === "ru"}
            >RU</button>
            <span className="lang-sep">/</span>
            <button
              className={`lang-btn ${lang === "en" ? "is-active" : ""}`}
              onClick={() => onLangChange("en")}
              aria-pressed={lang === "en"}
            >EN</button>
          </div>
          <div className="topbar-clock">{ui.tzCity} · {time}</div>
        </div>
      </div>
    </header>
  );
}

function Hero({ data }) {
  const ui = data.ui;
  const [copied, setCopied] = useState(null);
  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1400);
    } catch (e) {}
  };

  return (
    <section className="hero">
      <Reveal className="hero-meta">
        <span><span className="marker"></span>{ui.available} · {(new Date()).getFullYear()}</span>
        <span>{data.location}</span>
        <span>@{data.handle}</span>
      </Reveal>

      <Reveal as="h1" className="hero-name" delay={80}>
        {data.name.first}<br />
        <span className="ital">{data.name.last}</span>
      </Reveal>

      <Reveal className="hero-grid" delay={180}>
        <div className="hero-role">
          {ui.nowAt}
          <span className="role-line">{ui.nowLine}</span>
        </div>
        <p className="hero-intro">{data.intro}</p>
      </Reveal>

      <Reveal className="contacts" delay={260} id="contact">
        <button className={`contact ${copied === "email" ? "is-copied" : ""}`} onClick={() => copy("email", data.email)}>
          <span className="contact-label">{ui.emailHint}</span>
          <span className="contact-value">{data.email}<span className="arrow">↗</span></span>
          <span className="copied">{ui.copied}</span>
        </button>
        <a className="contact" href={data.githubUrl} target="_blank" rel="noreferrer">
          <span className="contact-label">GitHub</span>
          <span className="contact-value">@{data.github}<span className="arrow">↗</span></span>
        </a>
        <a className="contact" href={data.siteUrl} target="_blank" rel="noreferrer">
          <span className="contact-label">{ui.contactSite}</span>
          <span className="contact-value">{data.site}<span className="arrow">↗</span></span>
        </a>
        <div className="contact" style={{ cursor: "default" }}>
          <span className="contact-label">{ui.contactStatus}</span>
          <span className="contact-value" style={{ color: "var(--accent)" }}>{ui.openToWork}</span>
        </div>
      </Reveal>
    </section>
  );
}

function ExpItem({ item, idx, open, onToggle }) {
  return (
    <div className={`exp-item ${open ? "is-open" : ""}`} onClick={onToggle} data-screen-label={`Exp ${idx + 1} ${item.company}`}>
      <div className="exp-year">
        {item.now ? <><span className="now">●</span> {item.year}</> : item.year}
      </div>
      <div className="exp-main">
        <div className="exp-role">{item.role}</div>
        <div className="exp-company">
          {item.company} <span className="industry">· {item.industry}</span>
        </div>
      </div>
      <div className="exp-arrow">↗</div>

      <div className="exp-details">
        <div className="exp-details-inner">
          {item.summary && <p className="exp-summary">{item.summary}</p>}
          <ul className="exp-bullets">
            {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <div className="exp-stack">
            {item.stack.map((s) => <span key={s} className="tag">{s}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Experience({ data }) {
  const ui = data.ui;
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section className="section" id="experience" data-screen-label="Experience">
      <Reveal className="section-head">
        <div className="section-label">{ui.sections.exp.num}</div>
        <h2 className="section-title">{ui.sections.exp.title}</h2>
      </Reveal>
      <Reveal className="exp-list" delay={100}>
        {data.experience.map((item, idx) => (
          <ExpItem
            key={idx}
            item={item}
            idx={idx}
            open={openIdx === idx}
            onToggle={() => setOpenIdx(openIdx === idx ? -1 : idx)}
          />
        ))}
      </Reveal>
    </section>
  );
}

function Projects({ data }) {
  const ui = data.ui;
  return (
    <section className="section" id="projects" data-screen-label="Projects">
      <Reveal className="section-head">
        <div className="section-label">{ui.sections.proj.num}</div>
        <h2 className="section-title">{ui.sections.proj.title}</h2>
      </Reveal>
      <Reveal className="projects-grid" delay={100}>
        {data.projects.map((p, i) => (
          <article className="project" key={i}>
            <div className="project-head">
              <div className="project-name">{p.name}</div>
              <span className={`project-status ${p.status}`}>
                <span className="dot"></span>{p.status === "live" ? ui.statusLive : ui.statusShipped}
              </span>
            </div>
            <p className="project-desc">{p.desc}</p>
            <div className="project-metrics">
              {p.metrics.map((m, j) => (
                <div className="metric" key={j}>
                  <div className="metric-value">{window.CountUp ? <window.CountUp value={m.value} /> : m.value}</div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  );
}

function Skills({ data }) {
  const ui = data.ui;
  return (
    <section className="section" id="skills" data-screen-label="Skills">
      <Reveal className="section-head">
        <div className="section-label">{ui.sections.skills.num}</div>
        <h2 className="section-title">{ui.sections.skills.title}</h2>
      </Reveal>
      <Reveal className="skills-grid" delay={100}>
        <div className="section-label" style={{ marginTop: 8 }}>{ui.skillsAside}</div>
        <div>
          {ui.skillGroups.map((g) => (
            <div key={g.key} className="skills-group">
              <div className="skills-group-label">{g.label}</div>
              <div className="skills-list">
                {(data.skills[g.key] || []).map((s) => (
                  <span key={s} className="skill">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Side({ data }) {
  const ui = data.ui;
  return (
    <section className="section" data-screen-label="Side">
      <Reveal className="section-head">
        <div className="section-label">{ui.sections.side.num}</div>
        <h2 className="section-title">{ui.sections.side.title}</h2>
      </Reveal>
      <Reveal className="side-grid" delay={100}>
        <div className="side">
          <div className="side-label">{ui.sideLabels.langs}</div>
          {data.langs.map((l) => (
            <div className="side-row" key={l.name}>
              <strong>{l.name}</strong>
              <span className="meta">{l.level}</span>
            </div>
          ))}
        </div>
        <div className="side">
          <div className="side-label">{ui.sideLabels.edu}</div>
          <div className="side-row">
            <strong>{data.education.degree}</strong>
            <span className="meta">{data.education.schoolShort}</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 8, lineHeight: 1.5 }}>
            {data.education.school}
          </div>
        </div>
        <div className="side">
          <div className="side-label">{ui.sideLabels.certs}</div>
          {data.certs.map((c, i) => (
            <div key={i}>
              <div className="side-row">
                <strong>{c.name}</strong>
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-faint)", fontFamily: "var(--mono)", letterSpacing: "0.04em", marginTop: 4 }}>
                {c.issuer} · {c.date}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Footer({ data }) {
  const ui = data.ui;
  return (
    <footer className="footer" data-screen-label="Footer">
      <Reveal as="h2" className="footer-cta">
        {ui.footerCta[0]}<br />
        {ui.footerCta[1]} <a href={`mailto:${data.email}`}>{data.email}</a>
      </Reveal>
      <div className="footer-row">
        <div>{ui.footerCopy}</div>
        <div className="footer-links">
          <a href={data.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={data.siteUrl} target="_blank" rel="noreferrer">{ui.contactSite} ↗</a>
          <a href={`mailto:${data.email}`}>Email ↗</a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { TopBar, Hero, Experience, Projects, Skills, Side, Footer });
