const{useState:_useState,useEffect:_useEffect,useRef:_useRef}=React;function ScrollProgress(){const[s,a]=_useState(0);return _useEffect(()=>{const e=()=>{const r=document.documentElement.scrollHeight-window.innerHeight;a(r>0?window.scrollY/r:0)};return e(),window.addEventListener("scroll",e,{passive:!0}),()=>window.removeEventListener("scroll",e)},[]),React.createElement("div",{className:"scroll-progress","aria-hidden":"true"},React.createElement("div",{className:"scroll-progress-bar",style:{transform:`scaleX(${s})`}}))}function useInView(s=.3){const a=_useRef(null),[e,r]=_useState(!1);return _useEffect(()=>{const l=a.current;if(!l)return;const o=new IntersectionObserver(([p])=>{p.isIntersecting&&(r(!0),o.disconnect())},{threshold:s});return o.observe(l),()=>o.disconnect()},[s]),[a,e]}function CountUp({value:s}){const[a,e]=useInView(.4),[r,l]=_useState("0"),o=String(s).match(/([^\d-]*)([\d\s,.]+)(.*)/),p=o?o[1]:"",m=o?o[2].replace(/[\s,]/g,""):"0",t=o?o[3]:"",c=parseFloat(m)||0;return _useEffect(()=>{if(!e)return;if(!o){l(String(s));return}const n=performance.now(),d=1200;let i;const u=v=>{const f=Math.min(1,(v-n)/d),h=1-Math.pow(1-f,3),g=c*h,y=c>=1e3?Math.floor(g).toLocaleString("en-US").replace(/,/g,s.includes(",")?",":" "):Number.isInteger(c)?Math.floor(g).toString():g.toFixed(1);l(p+y+t),f<1&&(i=requestAnimationFrame(u))};return i=requestAnimationFrame(u),()=>cancelAnimationFrame(i)},[e,s]),_useEffect(()=>{e||l(String(s))},[s]),React.createElement("span",{ref:a},r)}function StatsBanner({data:s}){const a=s.ui.stats;return React.createElement("section",{className:"stats","data-screen-label":"Stats"},React.createElement("div",{className:"stats-grid"},a.map((e,r)=>React.createElement("div",{className:"stat",key:r},React.createElement("div",{className:"stat-value"},React.createElement(CountUp,{value:e.value})),React.createElement("div",{className:"stat-label"},e.label),React.createElement("div",{className:"stat-note"},e.note)))))}const MARQUEE_ROW_1=["TypeScript","Node.js","React","Solidity","NestJS","PostgreSQL","AWS","Next.js","GraphQL","tRPC","Docker","Prisma","BullMQ","LayerZero","Axelar","Hardhat","EVM","Google Apps Script"],MARQUEE_ROW_2_RU=["\u0441\u043C\u0430\u0440\u0442-\u043A\u043E\u043D\u0442\u0440\u0430\u043A\u0442\u044B","\u043F\u043B\u0430\u0442\u0435\u0436\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438","CI/CD","event sourcing","cross-chain","yield-\u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438","LLM-\u043F\u0430\u0439\u043F\u043B\u0430\u0439\u043D\u044B","API-\u0434\u0438\u0437\u0430\u0439\u043D","REST","Web3","AWS Lambda","DynamoDB","MongoDB","Telegram API"],MARQUEE_ROW_2_EN=["smart contracts","payment integrations","CI/CD","event sourcing","cross-chain","yield strategies","LLM pipelines","API design","REST","Web3","AWS Lambda","DynamoDB","MongoDB","Telegram API"];function MarqueeRow({items:s,dir:a=1,speed:e=50}){const r=[...s,...s,...s];return React.createElement("div",{className:`marquee-row dir-${a>0?"fwd":"rev"}`,style:{"--speed":`${e}s`}},React.createElement("div",{className:"marquee-track"},r.map((l,o)=>React.createElement("span",{key:o,className:"marquee-item"},l,React.createElement("span",{className:"marquee-sep"},"/")))))}function SkillMarquee({data:s}){const a=s.lang==="en"?MARQUEE_ROW_2_EN:MARQUEE_ROW_2_RU;return React.createElement("section",{className:"marquee","aria-hidden":"true","data-screen-label":"Marquee"},React.createElement(MarqueeRow,{items:MARQUEE_ROW_1,dir:1,speed:70}),React.createElement(MarqueeRow,{items:a,dir:-1,speed:90}))}const TIMELINE={start:2018,end:2026.5,bars:[{id:"alttoken",company:"AltTokenFund",role_ru:"Ethereum Smart Contract",role_en:"Ethereum Smart Contract",start:2018.75,end:2019},{id:"spreadsheet",company:"Spreadsheet Fund",role_ru:"Software Engineer / CEO",role_en:"Software Engineer / CEO",start:2019.1,end:2023.4},{id:"epam",company:"EPAM Systems",role_ru:"Senior QA Automation",role_en:"Senior QA Automation",start:2019.95,end:2021.45},{id:"interswap",company:"InterSwap",role_ru:"CTO / Senior Engineer",role_en:"CTO / Senior Engineer",start:2021,end:2025.1},{id:"vaulty",company:"Vaulty.fi",role_ru:"Senior Backend & Solidity",role_en:"Senior Backend & Solidity",start:2021.4,end:2022},{id:"skillbox",company:"Skillbox",role_ru:"Backend Engineer",role_en:"Backend Engineer",start:2023.7,end:2024.55},{id:"fundraise",company:"Fundraise Up",role_ru:"Backend Engineer",role_en:"Backend Engineer",start:2025.1,end:2026},{id:"soulbook",company:"SoulBook.io",role_ru:"CTO / Founder",role_en:"CTO / Founder",start:2026,end:2026.5,now:!0}]};function CareerTimeline({data:s}){const a=s.ui,[e,r]=_useState(null),l=TIMELINE.end-TIMELINE.start,o=[];for(let n=TIMELINE.start;n<=Math.floor(TIMELINE.end);n++)o.push(n);const p=[],m=TIMELINE.bars.map(n=>{let d=0;for(;p[d]&&p[d]>n.start;)d++;return p[d]=n.end,{...n,lane:d}}),t=p.length,c=s.lang==="en"?"role_en":"role_ru";return React.createElement("section",{className:"section",id:"timeline","data-screen-label":"Timeline"},React.createElement(Reveal,{className:"section-head"},React.createElement("div",{className:"section-label"},a.sections.timeline.num),React.createElement("h2",{className:"section-title"},a.sections.timeline.title)),React.createElement(Reveal,{className:"gantt",delay:100},React.createElement("div",{className:"gantt-years"},o.map(n=>React.createElement("div",{className:"gantt-year",key:n,style:{left:`${(n-TIMELINE.start)/l*100}%`}},React.createElement("span",{className:"gantt-year-label"},n),React.createElement("div",{className:"gantt-year-tick"})))),React.createElement("div",{className:"gantt-lanes",style:{"--lanes":t}},m.map(n=>{const d=(n.start-TIMELINE.start)/l*100,i=(n.end-n.start)/l*100,u=e===n.id;return React.createElement("div",{key:n.id,className:`gantt-bar ${n.now?"is-now":""} ${u?"is-hover":""}`,style:{left:`${d}%`,width:`${i}%`,top:`calc(var(--lane-h) * ${n.lane})`},onMouseEnter:()=>r(n.id),onMouseLeave:()=>r(null)},React.createElement("div",{className:"gantt-bar-inner"},React.createElement("span",{className:"gantt-bar-company"},n.company),React.createElement("span",{className:"gantt-bar-role"},n[c])),n.now&&React.createElement("span",{className:"gantt-now-tag"},a.nowTag))}))))}function downloadCompactResumePdf(){const s=typeof getResume=="function"?getResume("ru"):window.RESUME_RU,a=typeof getResume=="function"?getResume("en"):window.RESUME_EN,e=t=>String(t!=null?t:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),r=(t,c)=>{const n=t.experience.slice(0,4),d=[...t.skills.languages,...t.skills.backend,...t.skills.frontend,...t.skills.blockchain,...t.skills.infra];return`
      <section class="col">
        <header class="col-head">
          <h1>${e(t.name.first)} ${e(t.name.last)}</h1>
          <div class="role">${e(t.role)} \xB7 ${e(t.location)}</div>
          <div class="links">
            <span>${e(t.email)}</span>
            <span>${e(t.site)}</span>
            <span>github.com/${e(t.github)}</span>
          </div>
          <p class="intro">${e(t.intro)}</p>
        </header>

        <h2>${e(c.exp)}</h2>
        <ul class="exp">
          ${n.map(i=>`
            <li>
              <div class="exp-line"><strong>${e(i.role)}</strong> \xB7 ${e(i.company)} <span class="year">${e(i.year)}</span></div>
              <div class="exp-sum">${e(i.summary)}</div>
            </li>`).join("")}
        </ul>

        <h2>${e(c.projects)}</h2>
        <ul class="proj">
          ${t.projects.slice(0,3).map(i=>`
            <li><strong>${e(i.name)}</strong> \u2014 ${e(i.desc)}</li>`).join("")}
        </ul>

        <h2>${e(c.skills)}</h2>
        <div class="skills">${d.map(e).join(" \xB7 ")}</div>

        <h2>${e(c.edu)}</h2>
        <div>${e(t.education.degree)}, ${e(t.education.school)}</div>

        <h2>${e(c.langs)}</h2>
        <div>${t.langs.map(i=>`${e(i.name)} (${e(i.level)})`).join(" \xB7 ")}</div>
      </section>
    `},l={exp:"\u041E\u043F\u044B\u0442",projects:"\u041F\u0440\u043E\u0435\u043A\u0442\u044B",skills:"\u041D\u0430\u0432\u044B\u043A\u0438",edu:"\u041E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435",langs:"\u042F\u0437\u044B\u043A\u0438"},p=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Dmitry Smirnov \xB7 Resume (EN + RU)</title>
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
    ${r(a,{exp:"Experience",projects:"Projects",skills:"Skills",edu:"Education",langs:"Languages"})}
    ${r(s,l)}
  </div>
  <script>
    window.addEventListener("load", () => setTimeout(() => window.print(), 300));
  <\/script>
</body>
</html>`,m=window.open("","_blank");if(!m){alert("Allow pop-ups to download the PDF.");return}m.document.open(),m.document.write(p),m.document.close()}Object.assign(window,{ScrollProgress,StatsBanner,SkillMarquee,CareerTimeline,CountUp,downloadCompactResumePdf});
