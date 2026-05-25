// App entrypoint — wires Tweaks panel + theme + accent + language into the resume.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#2f6b4a",
  "density": "regular",
  "showMono": true,
  "lang": "ru"
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  "#2f6b4a", // forest (default)
  "#c2552d", // terracotta
  "#0a0a0a", // mono ink
  "#3a4be0", // electric indigo
  "#a17a3a", // brass
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const data = getResume(t.lang);

  React.useEffect(() => {
    const root = document.documentElement;
    if (t.theme === "light") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", t.theme);
    root.style.setProperty("--accent", t.accent);
    root.lang = t.lang;
    document.body.dataset.density = t.density;
    document.body.dataset.mono = t.showMono ? "on" : "off";
    document.body.dataset.lang = t.lang;
    document.title = t.lang === "en"
      ? "Dmitry Smirnov — Full Stack Engineer"
      : "Дмитрий Смирнов — Full Stack Engineer";
  }, [t.theme, t.accent, t.density, t.showMono, t.lang]);

  const setLang = (lang) => setTweak("lang", lang);

  return (
    <>
      <ScrollProgress />
      <TopBar data={data} lang={t.lang} onLangChange={setLang} />
      <div className="page">
        <Hero data={data} />
        <StatsBanner data={data} />
        <CareerTimeline data={data} />
        <Experience data={data} />
        <SkillMarquee data={data} />
        <Projects data={data} />
        <Skills data={data} />
        <Side data={data} />
        <Footer data={data} />
      </div>

      <TweaksPanel>
        <TweakSection label={t.lang === "en" ? "Language" : "Язык"} />
        <TweakRadio
          label={t.lang === "en" ? "Locale" : "Локаль"}
          value={t.lang}
          options={["ru", "en"]}
          onChange={(v) => setTweak("lang", v)}
        />

        <TweakSection label={t.lang === "en" ? "Theme" : "Тема"} />
        <TweakRadio
          label={t.lang === "en" ? "Palette" : "Палитра"}
          value={t.theme}
          options={["light", "paper", "dark"]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakColor
          label={t.lang === "en" ? "Accent" : "Акцент"}
          value={t.accent}
          options={ACCENT_OPTIONS}
          onChange={(v) => setTweak("accent", v)}
        />

        <TweakSection label={t.lang === "en" ? "Layout" : "Раскладка"} />
        <TweakRadio
          label={t.lang === "en" ? "Density" : "Плотность"}
          value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakToggle
          label={t.lang === "en" ? "Meta details" : "Мето-детали"}
          value={t.showMono}
          onChange={(v) => setTweak("showMono", v)}
        />

        <TweakSection label={t.lang === "en" ? "Export" : "Экспорт"} />
        <TweakButton
          label={t.lang === "en" ? "Print / PDF" : "Печать / PDF"}
          onClick={() => window.print()}
        />
        <TweakButton
          label={t.lang === "en" ? "Compact PDF (EN + RU)" : "Компактный PDF (EN + RU)"}
          onClick={() => window.downloadCompactResumePdf()}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
