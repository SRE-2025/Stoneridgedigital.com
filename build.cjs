/* ============================================================
   Stoneridge Digital — static page generator
   Run:  node build.cjs
   Generates the service + company pages from one shared layout
   so every page stays consistent. index.html, seo-audit.html and
   join.html are bespoke and NOT overwritten here.
   ============================================================ */
const fs = require("fs");
const path = require("path");
const OUT = __dirname;

/* ---------- shared bits ---------- */
const FONT_URL = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700;800&display=swap";
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preload" as="style" href="${FONT_URL}" onload="this.onload=null;this.rel='stylesheet'"><noscript><link href="${FONT_URL}" rel="stylesheet"></noscript>`;
const FAVICON = `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%232f4a37'/%3E%3Cpath d='M6 24 L16 9 L26 24 Z' fill='%23f4eddb'/%3E%3Cpath d='M9 24 L16 13 L23 24 Z' fill='%232f4a37'/%3E%3C/svg%3E">`;
const arrow = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const chev = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M6 9l6 6 6-6"/></svg>`;
const check = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>`;

const SVCLINKS = [
  ["websites", "Website Design", "Custom sites that convert"],
  ["seo", "SEO", "Local &amp; advanced search"],
  ["aeo", "AEO", "Get found in AI answers"],
  ["advertising", "Advertising", "Meta, Google &amp; AI ads"],
  ["social-content", "Social &amp; Content", "Filmed, edited, posted"],
  ["automation", "Automation &amp; AI", "Reviews, booking, systems"],
];

const brand = (href = "/") => `<a href="${href}" class="brand">
  <img class="mark-img" src="assets/mark.png" alt="" width="625" height="454">
  <span class="word"><span class="a">STONERIDGE</span><span class="b">DIGITAL</span></span></a>`;

const nav = () => `<nav class="nav" id="nav">
  ${brand()}
  <div class="nav-links">
    <div class="nav-dd">
      <a href="services.html" class="dd-toggle">Services ${chev}</a>
      <div class="dd-menu">
        ${SVCLINKS.map(([s, l, d]) => `<a href="${s}.html"><b>${l}</b><small>${d}</small></a>`).join("\n        ")}
      </div>
    </div>
    <a href="work.html">Work</a>
    <a href="about.html">About</a>
    <a href="seo-audit.html">Free Audit</a>
    <a href="book.html">Book a Call</a>
  </div>
  <div class="nav-cta">
    <a href="book.html" class="btn btn-primary" data-hover>Get Started ${arrow}</a>
    <button class="nav-menu-btn" id="menuBtn" aria-label="Menu"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <button class="close" id="menuClose" aria-label="Close">&times;</button>
  <a href="services.html">Services</a>
  <a href="work.html">Work</a>
  <a href="about.html">About</a>
  <a href="process.html">Process</a>
  <a href="faq.html">FAQ</a>
  <a href="seo-audit.html">Free Audit</a>
  <a href="book.html">Book a Call</a>
</div>`;

const topo = (op = 0.4) => `<svg class="topo" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" fill="none" stroke="rgba(244,237,219,${op})" stroke-width="1.4" aria-hidden="true"><path d="M-20 120 Q300 60 720 120 T1460 110"/><path d="M-20 190 Q360 130 720 190 T1460 180"/><path d="M-20 270 Q300 210 720 270 T1460 260"/><path d="M-20 350 Q360 290 720 350 T1460 340"/></svg>`;

const phMtns = () => `<div class="ph-mtns" aria-hidden="true" data-parallax="0.06"><svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice"><path d="M0 300 L0 200 L260 120 L520 185 L780 110 L1040 180 L1300 120 L1440 165 L1440 300 Z" fill="#8ba07f" opacity="0.5"/><path d="M0 300 L0 235 L300 165 L560 220 L820 155 L1080 215 L1340 160 L1440 205 L1440 300 Z" fill="#2f4a37"/></svg></div>`;

const footer = () => `<footer class="footer on-dark">
  ${topo(0.4).replace('viewBox="0 0 1440 400"', 'viewBox="0 0 1440 300"')}
  <div class="wrap">
    <div class="footer-top">
      <div>
        ${brand()}
        <p class="lead-sm">Your one stop for marketing strategies. Custom websites, SEO, paid ads &amp; social — one partner for your local growth.</p>
        <div class="footer-invite"><a href="join.html">◆ &nbsp;Grow with the ridge</a></div>
      </div>
      <div class="footer-cols">
        <div class="col"><p class="footer-title">Services</p>${SVCLINKS.map(([s, l]) => `<a href="${s}.html">${l}</a>`).join("")}</div>
        <div class="col"><p class="footer-title">Company</p><a href="about.html">About</a><a href="work.html">Work</a><a href="industries.html">Who We Serve</a><a href="locations.html">Areas We Serve</a><a href="blog.html">Insights</a><a href="process.html">Process</a><a href="faq.html">FAQ</a><a href="contact.html">Contact</a></div>
        <div class="col"><p class="footer-title">Get in touch</p><a href="book.html">Book a Call</a><a href="seo-audit.html">Free SEO Audit</a><a href="tel:9723135141">972-313-5141</a><a href="mailto:admin@stoneridgedigital.com">admin@stoneridgedigital.com</a></div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year"></span> Stoneridge Digital · <a href="privacy.html" style="color:inherit;">Privacy</a> · <a href="terms.html" style="color:inherit;">Terms</a></span>
      <div class="socials">
        <a href="mailto:admin@stoneridgedigital.com" aria-label="Email"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></a>
      </div>
    </div>
  </div>
</footer>`;

const ctaBand = (title = "Ready when you are.", text = "Book a free call and we'll map the fastest path for your business — no pressure, no jargon.") => `<section class="dark-band">
  ${topo(0.4)}
  <div class="wrap"><div class="inner">
    <div><p class="eyebrow">Let's talk</p><h2 class="h-md" style="font-size:clamp(1.8rem,3.4vw,2.6rem);">${title}</h2><p>${text}</p></div>
    <a href="book.html" class="btn btn-copper btn-lg" data-hover>Book a call ${arrow}</a>
  </div></div>
</section>`;

const pageHero = ({ crumb, eyebrow, title, lead, actions = true, center = false }) => `<header class="page-hero ${center ? "center" : ""}" id="top">
  ${phMtns()}
  <div class="wrap">
    <img class="mark-float reveal in" src="assets/mark.png" alt="" width="58" height="42">
    ${crumb ? `<p class="crumb reveal in">${crumb}</p>` : ""}
    <p class="eyebrow reveal in">${eyebrow}</p>
    <h1 class="h-xl reveal in" style="font-size:clamp(2.5rem,6.5vw,4.6rem);">${title}</h1>
    <p class="lead reveal in" data-delay="1" ${center ? 'style="margin-inline:auto;"' : ""}>${lead}</p>
    ${actions ? `<div class="actions reveal in" data-delay="2"><a href="book.html" class="btn btn-primary btn-lg" data-hover>Book a call ${arrow}</a><a href="seo-audit.html" class="btn btn-ghost btn-lg" data-hover>Get a free audit</a></div>
    <div class="trust-strip reveal in" data-delay="3">
      <span class="ts">${check} Full-service</span>
      <span class="ts">${check} You own your site &amp; data</span>
      <span class="ts">${check} Austin &amp; nationwide</span>
    </div>` : ""}
  </div>
</header>`;

const DOMAIN = "https://stoneridgedigital.com";
const OGIMG = `${DOMAIN}/assets/og-image.png`;
const V = Date.now(); // cache-bust CSS/JS on every build
const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
const baseSchema = [
  { "@context": "https://schema.org", "@type": "Organization", "@id": `${DOMAIN}/#organization`, name: "Stoneridge Digital", url: DOMAIN, telephone: "+1-972-313-5141", email: "admin@stoneridgedigital.com", image: `${DOMAIN}/assets/og-image.png`, logo: { "@type": "ImageObject", url: `${DOMAIN}/assets/mark.png`, width: 625, height: 454 }, description: "Full-service marketing agency for local businesses — custom websites, SEO, paid ads, social media and automation.", areaServed: "United States" },
  { "@context": "https://schema.org", "@type": "WebSite", name: "Stoneridge Digital", url: DOMAIN },
];
const layout = ({ title, desc, content, noindex = false, path = "index.html", ogType = "website", schema = [] }) => {
  const url = `${DOMAIN}/${path === "index.html" ? "" : path}`;
  const webPageSchema = { "@context": "https://schema.org", "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description: desc, isPartOf: { "@type": "WebSite", url: DOMAIN, name: "Stoneridge Digital" }, about: { "@id": `${DOMAIN}/#organization` } };
  const breadcrumbSchema = path === "index.html" ? [] : [{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
    { "@type": "ListItem", position: 2, name: title.replace(/\s+[—|].*$/, ""), item: url },
  ] }];
  const allSchema = [...baseSchema, webPageSchema, ...breadcrumbSchema, ...schema].map(jsonld).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
${noindex ? '<meta name="robots" content="noindex,follow">\n' : `<meta name="robots" content="index,follow,max-image-preview:large">\n<link rel="canonical" href="${url}">\n`}<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Stoneridge Digital">
<meta property="og:image" content="${OGIMG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Stoneridge Digital — marketing built for local growth">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${OGIMG}">
<meta name="twitter:image:alt" content="Stoneridge Digital — marketing built for local growth">
${FONTS}
<link rel="stylesheet" href="assets/styles.min.css?v=${V}">
<script>document.documentElement.classList.add('js');</script>
${FAVICON}
${allSchema}
<!-- ANALYTICS: paste your GA4 or Plausible snippet below to enable tracking.
     GA4:  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
           <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-XXXXXXX')</script>
     Plausible: <script defer data-domain="stoneridgedigital.com" src="https://plausible.io/js/script.js"></script> -->
</head>
<body class="sub">
<div class="progress" id="progress"></div>
${nav()}
<main id="main">
${content}
</main>
${footer()}
<script src="assets/app.min.js?v=${V}"></script>
</body>
</html>`;
};

/* ---------- service data ---------- */
const svcIcon = {
  websites: `<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M7 15h6"/>`,
  seo: `<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`,
  aeo: `<path d="M12 3l1.7 4.6L18.5 9l-4.8 1.4L12 15l-1.7-4.6L5.5 9l4.8-1.4z"/><path d="M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>`,
  advertising: `<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>`,
  "social-content": `<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="17" cy="7" r="1"/>`,
  automation: `<path d="M12 3a5 5 0 015 5c0 3-2 4-2 7H9c0-3-2-4-2-7a5 5 0 015-5z"/><path d="M9 20h6M10 22h4"/>`,
};
const genIcon = (paths) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${paths}</svg>`;

const SERVICES = {
  websites: {
    label: "Website Design & Development", eyebrow: "Website design & development",
    meta: "Custom website design for local businesses. Fast, mobile-first sites built around clear customer journeys and measurable inquiries.",
    title: "Websites that work<br>as hard as you do.",
    lead: "Custom-built, fast, and made to guide visitors toward booking — never a template. Your website is the foundation everything else runs on.",
    includes: [
      ["Custom design", "Designed around your brand and your customers — not a stock theme."],
      ["Built to convert", "Clear paths to call, book, and buy on every single page."],
      ["Fast & mobile-first", "Lightweight and responsive, so it feels quick on every device."],
      ["Hosting & maintenance", "We host it, secure it, and keep it running — you don't lift a finger."],
      ["Unlimited edits", "Need a change? Send it over and it's handled."],
      ["SEO foundation", "On-page structure, speed, and tracking done right from day one."],
    ],
    approach: ["We start with your goals and your customers, then design around them.", "Everything is built to be measured, so decisions come from data — not guesses.", "You get a site your team can actually keep up to date."],
    related: ["seo", "advertising", "automation"],
  },
  seo: {
    label: "Local & Advanced SEO", eyebrow: "Search engine optimization",
    meta: "Local and technical SEO for service businesses, including site structure, on-page optimization, content, and search visibility reporting.",
    title: "Show up where<br>your customers search.",
    lead: "Local and advanced SEO built to make your business easier to find when people are looking for what you do.",
    includes: [
      ["On-page SEO", "Titles, structure, and content search engines can actually read."],
      ["Technical SEO", "Speed, crawlability, and the behind-the-scenes fundamentals."],
      ["Local citations", "Consistent listings across the directories that matter."],
      ["Google Business Profile", "Optimized and maintained so you stand out on the map."],
      ["Keyword & competitor research", "We map what your market is searching for."],
      ["Rank tracking & reporting", "Transparent monthly reporting on where you stand."],
    ],
    approach: ["We focus on the searches that actually bring you customers.", "SEO compounds — we build a foundation that keeps working over time.", "You'll always know what we're doing and why."],
    related: ["websites", "aeo", "social-content"],
  },
  aeo: {
    label: "Answer Engine Optimization", eyebrow: "Answer Engine Optimization (AEO)",
    meta: "Answer engine optimization that helps AI search tools understand your services, expertise, and business information more clearly.",
    title: "Show up when<br>AI does the answering.",
    lead: "More and more customers ask ChatGPT, Gemini, Perplexity, and Google's AI for a recommendation instead of scrolling through search results. AEO is the work of making your business the one those engines understand, trust, and surface.",
    includes: [
      ["Entity &amp; knowledge setup", "We make your business a clear, consistent entity across the web so AI engines know exactly who you are and what you do."],
      ["Structured data &amp; schema", "Machine-readable markup that lets AI read your services, location, hours, and reviews correctly."],
      ["Answer-ready content", "Pages written to directly answer the real questions your customers ask — the format AI engines pull from."],
      ["Citations &amp; consistency", "Consistent name, address, and details across the third-party sources AI cross-checks."],
      ["Reputation signals", "The reviews and mentions that build the trust AI models weigh when they recommend a business."],
      ["AI visibility monitoring", "We check how your business appears across ChatGPT, Gemini, Perplexity &amp; Google AI Overviews, and keep refining."],
    ],
    approach: ["Search is shifting from a page of links to a single AI answer — we get you ready for both.", "We optimize the signals AI engines actually read: entities, structure, content, and reputation.", "AEO builds on the same fundamentals as your SEO — think of it as a new front door to the same house."],
    related: ["seo", "websites", "automation"],
  },
  advertising: {
    label: "Meta, Google &amp; AI Ads", eyebrow: "Advertising & paid media",
    meta: "Paid media management for Google, Meta, and emerging ad platforms, with clear targeting, landing pages, measurement, and ongoing refinement.",
    title: "Smart ads across<br>every platform.",
    lead: "Managed, optimized advertising across Meta, Google, and new AI-driven ad platforms — with premium targeting and retargeting, all handled for you.",
    includes: [
      ["Google Ads", "Search, Maps, YouTube &amp; Display campaigns built and optimized to bring in booked jobs."],
      ["Meta Ads", "Facebook &amp; Instagram campaigns that put you in front of the right local audience."],
      ["AI-driven ads", "Emerging AI ad platforms and tools that find and target buyers automatically — we keep you on the cutting edge."],
      ["Smart targeting &amp; retargeting", "Reach the right people, then stay in front of site visitors and past ad-viewers."],
      ["Creative &amp; copy", "Ad creative and messaging that fits your brand."],
      ["Budget &amp; reporting", "Spend managed toward what works, with clear monthly reporting on every dollar."],
    ],
    approach: ["We test, learn, and shift budget toward what performs across Meta, Google and AI platforms.", "Ads work best paired with a site built to convert — we handle both.", "No mystery spend: you see where the money goes."],
    related: ["websites", "seo", "aeo"],
  },
  "social-content": {
    label: "Social Media & Content", eyebrow: "Social media & content",
    meta: "Social media and content support for local businesses, from planning and production to publishing, blogs, and email campaigns.",
    title: "Real content —<br>filmed, edited, posted.",
    lead: "We come to you, capture real content, and run your social accounts — plus blogs and email that keep your audience engaged.",
    includes: [
      ["In-office filming", "We come to you to capture authentic footage each month."],
      ["Edited videos", "Scroll-stopping edits ready for every platform."],
      ["Posts across platforms", "Instagram, Facebook, TikTok & LinkedIn — managed for you."],
      ["Blogs & articles", "SEO-friendly writing that sounds like you."],
      ["Email marketing", "Newsletters and automations that keep you top of mind."],
      ["Community management", "We run the accounts so you can run the business."],
    ],
    approach: ["Content that looks like you — because it is you.", "Consistency beats intensity; we keep you showing up.", "Everything ties back to your bigger marketing picture."],
    related: ["websites", "seo", "automation"],
  },
  automation: {
    label: "Automation & AI", eyebrow: "Automation, reviews & AI",
    meta: "Practical marketing automation for reviews, missed calls, lead follow-up, scheduling, reporting, and after-hours customer communication.",
    title: "Systems that catch<br>every opportunity.",
    lead: "Reviews, missed-call text-back, an after-hours AI receptionist, and reporting — the systems that make sure nothing slips through.",
    includes: [
      ["Review management", "Automated review requests across Google, Apple Maps & Yelp."],
      ["Missed-call text-back", "Every missed call gets an instant text so you stay in the game."],
      ["AI receptionist", "An after-hours assistant that answers, qualifies & books."],
      ["Automated booking", "Appointments booked around the clock, hands-free."],
      ["Analytics & dashboards", "Live dashboards so you always know what's happening."],
      ["Monthly reporting", "The numbers that matter, summarized every month."],
    ],
    approach: ["We plug the leaks so opportunities don't slip away.", "Automation frees your team to focus on the work that matters.", "Everything is set up, monitored, and maintained by us."],
    related: ["websites", "seo", "social-content"],
  },
};

const relatedBlock = (slugs) => `<section class="band-alt"><div class="wrap">
  <div class="sec-head center reveal"><p class="eyebrow">Explore more</p><h2 class="h-lg">Related services.</h2></div>
  <div class="related">${slugs.map(s => `<a href="${s}.html" class="reveal" data-tilt>${SERVICES[s].label} ${arrow}</a>`).join("")}</div>
</div></section>`;

const servicePage = (slug) => {
  const s = SERVICES[slug];
  const content = `${pageHero({ crumb: `<a href="services.html">Services</a> / ${s.label}`, eyebrow: s.eyebrow, title: s.title, lead: s.lead })}
<section><div class="wrap">
  <div class="sec-head reveal"><p class="eyebrow">What's included</p><h2 class="h-lg">Everything you get.</h2></div>
  <div class="inc-grid">
    ${s.includes.map(([t, d], i) => `<div class="inc inc-static reveal" data-anim="${i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : ""}" data-delay="${i % 3}"><div class="ic">${genIcon(svcIcon[slug])}</div><h3>${t}</h3><p>${d}</p></div>`).join("\n    ")}
  </div>
</div></section>
<section class="band-alt"><div class="wrap"><div class="two-col">
  <div class="reveal" data-anim="left">
    <p class="eyebrow">How we approach it</p>
    <h2 class="h-lg" style="margin-bottom:24px;">Built around<br>your business.</h2>
    <ul class="checklist" style="grid-template-columns:1fr;">
      ${s.approach.map(a => `<li>${check}<span>${a}</span></li>`).join("\n      ")}
    </ul>
    <a href="book.html" class="btn btn-primary btn-lg" style="margin-top:30px;" data-hover>Book a call ${arrow}</a>
  </div>
  <div class="panel-img reveal" data-anim="right"><div class="topo">${topo(0.4)}</div><img class="pmark" src="assets/mark.png" alt="" loading="lazy"></div>
</div></div></section>
${relatedBlock(s.related)}
${ctaBand()}`;
  const schema = [{ "@context": "https://schema.org", "@type": "Service", serviceType: s.label, name: s.label, description: s.lead.replace(/<[^>]+>/g, ""), provider: { "@type": "Organization", name: "Stoneridge Digital", url: DOMAIN }, areaServed: "United States" }];
  return { file: `${slug}.html`, html: layout({ title: `${s.label} — Stoneridge Digital`, desc: s.meta, content, path: `${slug}.html`, schema }) };
};

/* ---------- standalone pages ---------- */
const pages = [];

// Services overview
pages.push({
  file: "services.html",
  html: layout({
    path: "services.html",
    title: "Services — Stoneridge Digital",
    desc: "Websites, SEO, advertising, social & content, and automation — one partner for your entire marketing.",
    content: `${pageHero({ center: true, eyebrow: "What we do", title: "One partner for<br>your whole funnel.", lead: "From the first click to the booked call, we own the entire journey — and report on every step. Pick a focus, or let us run it all." })}
<section><div class="wrap">
  <div class="inc-grid">
    ${SVCLINKS.map(([s, l, d], i) => `<a href="${s}.html" class="inc inc-link reveal" data-anim="${i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : ""}" data-delay="${i % 3}"><div class="ic">${genIcon(svcIcon[s])}</div><h3>${l}</h3><p>${d}</p><span class="inc-cta">Explore service ${arrow}</span></a>`).join("\n    ")}
    <a href="book.html" class="inc inc-link inc-featured reveal" data-delay="2"><div class="ic">${genIcon('<path d="M12 3v18M3 12h18"/>')}</div><h3>All of it, together</h3><p>Bring the whole marketing engine under one accountable partner.</p><span class="inc-cta">Book a call ${arrow}</span></a>
  </div>
</div></section>
${ctaBand("Not sure where to start?", "Tell us about your business and we'll point you to the right first move.")}`,
  }),
});

// About
pages.push({
  file: "about.html",
  html: layout({
    path: "about.html",
    title: "About — Stoneridge Digital",
    desc: "Stoneridge Digital is a full-service marketing agency built to be the one partner local businesses can count on.",
    content: `${pageHero({ center: true, eyebrow: "Our story", title: "Marketing, without<br>the runaround.", lead: "Stoneridge Digital exists because local businesses were tired of juggling five vendors who each blamed the other. We do it all, under one roof, and stand behind the work." })}
<section><div class="wrap"><div class="two-col">
  <div class="reveal" data-anim="left">
    <p class="eyebrow">Why Stoneridge</p>
    <h2 class="h-lg" style="margin-bottom:22px;">Named for the climb.</h2>
    <p class="lead" style="margin-bottom:16px;">A stoneridge is steady ground on the way up. That's how we see our role — the dependable footing under your growth, one deliberate step at a time.</p>
    <p style="color:var(--sage);">We're a full-service team: designers, marketers, writers, and strategists who actually talk to each other. One point of contact, one plan, one partner accountable for the whole thing.</p>
  </div>
  <div class="panel-img reveal" data-anim="right"><div class="topo">${topo(0.4)}</div><img class="pmark" src="assets/mark.png" alt="" loading="lazy"></div>
</div></div></section>
<section class="band-alt"><div class="wrap">
  <div class="sec-head center reveal"><p class="eyebrow">What we value</p><h2 class="h-lg">How we work.</h2></div>
  <div class="rows" style="max-width:820px;margin:0 auto;">
    <div class="rowi reveal"><span class="rn">01</span><div><h3>Straight talk</h3><p>No jargon, no smoke. We tell you what we'd do and why — and set realistic expectations on every call.</p></div></div>
    <div class="rowi reveal"><span class="rn">02</span><div><h3>Custom, always</h3><p>Never a template. Everything is built for your business and your market.</p></div></div>
    <div class="rowi reveal"><span class="rn">03</span><div><h3>One partner</h3><p>Website, SEO, ads, social, automation — handled by one team that owns the outcome.</p></div></div>
    <div class="rowi reveal"><span class="rn">04</span><div><h3>Earn your trust</h3><p>We'd rather win your business with good work and honest advice than with sales pressure. If we're not the right fit, we'll say so.</p></div></div>
  </div>
</div></section>
${ctaBand()}`,
  }),
});

// Work — honest capabilities showcase (no invented client case studies)
const workCaps = [
  ["websites", `<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M7 15h6"/>`, "Custom Websites", "Fast, custom-built sites engineered to convert visitors into booked business — never a template."],
  ["seo", `<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`, "Local SEO", "On-page, technical &amp; local citations so you show up when nearby customers are searching."],
  ["aeo", `<path d="M12 3l1.7 4.6L18.5 9l-4.8 1.4L12 15l-1.7-4.6L5.5 9l4.8-1.4z"/><path d="M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>`, "Answer Engine Optimization", "Get surfaced when customers ask ChatGPT, Gemini &amp; Google's AI for a recommendation."],
  ["advertising", `<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="7"/><rect x="12" y="7" width="3" height="11"/><rect x="17" y="13" width="3" height="5"/>`, "Meta, Google &amp; AI Ads", "Facebook, Instagram, Google &amp; AI-driven ad campaigns, managed and optimized toward booked jobs."],
  [`social-content`, `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>`, "Social &amp; Content", "Real content — filmed, edited &amp; posted across the platforms your customers actually use."],
  ["automation", `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`, "Automation &amp; AI", "Missed-call text-back, review requests &amp; after-hours booking so no lead ever slips away."],
  ["automation", `<path d="M3 3v18h18"/><path d="M7 14l3-3 3 2 5-6"/>`, "Analytics &amp; Reporting", "Live dashboards and clear monthly reports — you always know exactly what's working."],
];
pages.push({
  file: "work.html",
  html: layout({
    path: "work.html",
    title: "What We Do — Stoneridge Digital",
    desc: "Everything Stoneridge Digital handles for local businesses — custom websites, local SEO, paid ads, social, automation and reporting, all under one roof.",
    content: `${pageHero({ center: true, eyebrow: "What we do", title: "The work behind<br>a booked calendar.", lead: "We're a full-service growth partner for local businesses. Here's everything we handle so you don't have to juggle five different vendors." })}
<section><div class="wrap">
  <div class="sec-head center reveal"><p class="eyebrow">Capabilities</p><h2 class="h-lg">Everything under one roof.</h2></div>
  <div class="inc-grid">
  ${workCaps.map(([href, icon, t, d], i) => `<a href="${href}.html" class="inc inc-link reveal" data-anim="${i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : ""}" data-delay="${i % 3}"><div class="ic"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${icon}</svg></div><h3>${t}</h3><p>${d}</p><span class="inc-cta">Explore capability ${arrow}</span></a>`).join("\n  ")}
  </div>
</div></section>
<section class="band-alt"><div class="wrap">
  <div class="sec-head center reveal"><p class="eyebrow">How an engagement works</p><h2 class="h-lg">Built around your business.</h2><p>No two businesses get the same plan. We start where you'll see the fastest return, then expand as it works.</p></div>
  <div class="rows" style="max-width:860px;margin:0 auto;">
    <div class="rowi reveal" data-anim="left"><span class="rn">01</span><div><h3>Discover</h3><p>We dig into your market, competitors and current presence to find the clearest path forward — and set realistic expectations together.</p></div></div>
    <div class="rowi reveal" data-anim="left"><span class="rn">02</span><div><h3>Build</h3><p>Your custom site, SEO foundation and tracking go live — engineered to convert and measure from day one.</p></div></div>
    <div class="rowi reveal" data-anim="left"><span class="rn">03</span><div><h3>Amplify</h3><p>Ads, social and content start bringing qualified local traffic to your door, all managed for you.</p></div></div>
    <div class="rowi reveal" data-anim="left"><span class="rn">04</span><div><h3>Refine</h3><p>We double down on what's working and report clearly every month. Steady, deliberate progress.</p></div></div>
  </div>
</div></section>
${ctaBand("Want to see what we'd do for you?", "Book a free call and we'll map the fastest path for your business first — no pressure, no jargon.")}`,
  }),
});

// Process
pages.push({
  file: "process.html",
  html: layout({
    path: "process.html",
    title: "Our Process — Stoneridge Digital",
    desc: "How Stoneridge Digital works, from discovery to build to ongoing growth — clear steps and monthly reporting.",
    content: `${pageHero({ center: true, eyebrow: "How it works", title: "Four steps,<br>zero guesswork.", lead: "A simple, transparent process — you always know what's happening now and what's next." })}
<section><div class="wrap"><div class="rows" style="max-width:860px;margin:0 auto;">
  <div class="rowi reveal" data-anim="left"><span class="rn">01</span><div><h3>Discover</h3><p>We dig into your market, competitors, and current presence to find the clearest path forward — and set realistic expectations together.</p></div></div>
  <div class="rowi reveal" data-anim="left"><span class="rn">02</span><div><h3>Build</h3><p>Your custom site, SEO foundation, and tracking go live — engineered to convert and measure from day one.</p></div></div>
  <div class="rowi reveal" data-anim="left"><span class="rn">03</span><div><h3>Amplify</h3><p>Ads, social, and content start bringing qualified local traffic to your door, all managed for you.</p></div></div>
  <div class="rowi reveal" data-anim="left"><span class="rn">04</span><div><h3>Refine</h3><p>We double down on what's working and report clearly every month. Steady, deliberate progress.</p></div></div>
</div></div></section>
${ctaBand()}`,
  }),
});

// FAQ
const faqs = [
  ["How do agreements work?", "We keep it simple and transparent. On our first call we'll walk through exactly what's included and the terms that fit your goals — no jargon, no surprises."],
  ["Is my website really custom, or a template?", "Every site is custom-built for your business and market. Never a template — that's the whole point."],
  ["What kind of timeline should I expect?", "Every business and market is different, so we won't hand you a one-size-fits-all promise. On our first call we'll walk through realistic expectations, then report progress transparently every month."],
  ["Do you work with businesses outside Austin?", "Absolutely. We're based in Austin but serve local businesses across Texas and nationwide — the playbook travels."],
  ["Can I pick just one service?", "Yes. Start with what you need most — many clients begin with a website or SEO and grow from there."],
  ["Who will I actually be working with?", "One dedicated point of contact, backed by our full team. No being passed around."],
  ["How do you report on the work?", "Clear monthly reporting plus live dashboards, so you always know what's happening and why."],
  ["What does getting started look like?", "Book a call, we run a free audit of your market, then we build a plan tailored to your goals. No pressure, no jargon."],
];
pages.push({
  file: "faq.html",
  html: layout({
    path: "faq.html",
    schema: [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f[0], acceptedAnswer: { "@type": "Answer", text: f[1] } })) }],
    title: "FAQ — Stoneridge Digital",
    desc: "Answers to common questions about working with Stoneridge Digital — contracts, timelines, services and getting started.",
    content: `${pageHero({ center: true, eyebrow: "Good to know", title: "Questions,<br>answered.", lead: "Everything you might want to know before we talk. Still curious? Just book a call.", actions: false })}
<section style="padding-top:20px;"><div class="wrap"><div class="faq reveal">
  ${faqs.map(f => `<div class="faq-item"><button class="faq-q">${f[0]} <span class="ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="faq-a"><p>${f[1]}</p></div></div>`).join("\n  ")}
</div></div></section>
${ctaBand()}`,
  }),
});

// Contact
pages.push({
  file: "contact.html",
  html: layout({
    path: "contact.html",
    title: "Contact — Stoneridge Digital",
    desc: "Get in touch with Stoneridge Digital. Call, email, or send a note and we'll reply within one business day.",
    content: `${pageHero({ center: true, eyebrow: "Say hello", title: "Let's talk.", lead: "Tell us a little about your business. We'll reply within one business day — no pressure, no spam.", actions: false })}
<section style="padding-top:10px;"><div class="wrap"><div class="contact-grid">
  <div class="contact-info reveal" data-anim="left">
    <div class="line"><span class="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.4 2.1L8.1 9.9a16 16 0 006 6l1.5-1.2a2 2 0 012.1-.4c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/></svg></span><span><small>Call us</small><b><a href="tel:9723135141">972-313-5141</a></b></span></div>
    <div class="line"><span class="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span><span><small>Email us</small><b><a href="mailto:admin@stoneridgedigital.com">admin@stoneridgedigital.com</a></b></span></div>
    <div class="line"><span class="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.4-7-11a7 7 0 0114 0c0 4.6-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg></span><span><small>Serving</small><b>Austin &amp; local markets nationwide</b></span></div>
    <div class="line" style="border-bottom:0;"><span class="ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/><circle cx="11" cy="11" r="2"/></svg></span><span><small>Prefer a time?</small><b><a href="book.html">Book a call →</a></b></span></div>
  </div>
  <form class="form-card reveal" data-anim="right" id="contactForm">
    <input type="hidden" name="access_key" value="3e24fbee-675b-442e-a981-fde6a9d7ed4b">
    <input type="hidden" name="subject" value="New contact — Stoneridge Digital">
    <input type="hidden" name="from_name" value="Stoneridge Digital Website">
    <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">
    <div class="form-row"><div class="field"><label>Name</label><input name="name" required placeholder="Jane Smith"></div><div class="field"><label>Business</label><input name="business" placeholder="Smith Family Dental"></div></div>
    <div class="form-row"><div class="field"><label>Email</label><input type="email" name="email" required placeholder="you@business.com"></div><div class="field"><label>Phone <span style="color:var(--sage-soft);font-weight:400;">(optional)</span></label><input name="phone" placeholder="(555) 123-4567"></div></div>
    <div class="field"><label>What are you interested in?</label><select name="interest"><option>Not sure yet — help me choose</option><option>Website design &amp; development</option><option>SEO</option><option>Advertising</option><option>Social &amp; content</option><option>Automation &amp; AI</option><option>Full-service</option></select></div>
    <div class="field"><label>Anything you'd like us to know? <span style="color:var(--sage-soft);font-weight:400;">(optional)</span></label><textarea name="message" placeholder="We'd love more of the right customers from our local area..."></textarea></div>
    <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;" data-hover id="contactSubmit">Send it →</button>
    <p class="form-privacy"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg> No spam, ever — a real person replies within one business day.</p>
    <p class="form-note" id="contactStatus"></p>
  </form>
</div></div></section>`,
  }),
});

// Book
pages.push({
  file: "book.html",
  html: layout({
    path: "book.html",
    title: "Book a Call — Stoneridge Digital",
    desc: "Book a call with Stoneridge Digital — new client discovery, current client check-in, or a design & strategy session.",
    content: `${pageHero({ center: true, eyebrow: "Let's talk", title: "Book a call that<br>fits where you are.", lead: "Pick the conversation that matches your moment, tell us when works, and we'll confirm your time by email within one business day.", actions: false })}
<section style="padding-top:10px;"><div class="wrap">
  <div class="book-grid" id="trackCards">
    <button type="button" class="book-card reveal" data-track="new" data-anim="left"><div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg></div><h3>New Client Discovery</h3><p>Not a client yet? Let's map your market, goals &amp; the best first move.</p><span class="btn btn-primary" style="justify-content:center;pointer-events:none;">Schedule discovery call</span></button>
    <button type="button" class="book-card reveal" data-track="current" data-delay="1"><div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg></div><h3>Current Client Check-in</h3><p>Already with us? Grab time for strategy, reporting, or anything on your mind.</p><span class="btn btn-ghost" style="justify-content:center;pointer-events:none;">Schedule check-in</span></button>
    <button type="button" class="book-card reveal" data-track="design" data-anim="right" data-delay="2"><div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/><circle cx="11" cy="11" r="2"/></svg></div><h3>Design / Strategy Call</h3><p>Ready to build or refresh? A working session on your website, brand &amp; campaigns.</p><span class="btn btn-ghost" style="justify-content:center;pointer-events:none;">Schedule design call</span></button>
  </div>

  <div class="join-card reveal" id="bookForm" style="max-width:680px;margin:44px auto 0;">
    <form id="contactForm">
      <input type="hidden" name="access_key" value="3e24fbee-675b-442e-a981-fde6a9d7ed4b">
      <input type="hidden" name="subject" value="New call booking — Stoneridge Digital">
      <input type="hidden" name="from_name" value="Stoneridge Digital · Book a Call">
      <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">
      <div class="field"><label>What kind of call?</label>
        <div class="pill-group" role="radiogroup" aria-label="Call type">
          <label class="pill"><input type="radio" name="call_type" value="New Client Discovery" checked><span>New Client Discovery</span></label>
          <label class="pill"><input type="radio" name="call_type" value="Current Client Check-in"><span>Current Client Check-in</span></label>
          <label class="pill"><input type="radio" name="call_type" value="Design / Strategy Call"><span>Design / Strategy Call</span></label>
        </div>
      </div>
      <div class="form-row">
        <div class="field"><label>Name</label><input name="name" required placeholder="Jane Smith"></div>
        <div class="field"><label>Email</label><input type="email" name="email" required placeholder="you@business.com"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Phone <span style="color:var(--sage-soft);font-weight:400;">(optional)</span></label><input name="phone" placeholder="(555) 123-4567"></div>
        <div class="field"><label>Business <span style="color:var(--sage-soft);font-weight:400;">(optional)</span></label><input name="business" placeholder="Your business name"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Preferred day</label><input type="date" name="preferred_date" required></div>
        <div class="field"><label>Preferred time</label>
          <select name="preferred_time">
            <option>Morning (8am–12pm)</option>
            <option>Early afternoon (12–3pm)</option>
            <option>Late afternoon (3–6pm)</option>
            <option>I'm flexible</option>
          </select>
        </div>
      </div>
      <div class="field"><label>Anything you'd like us to know? <span style="color:var(--sage-soft);font-weight:400;">(optional)</span></label><textarea name="message" placeholder="A quick note about what you're hoping to cover..."></textarea></div>
      <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;" data-hover id="contactSubmit">Request my time →</button>
      <p class="form-privacy"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg> This sends your request straight to us — we'll confirm the exact time by email within one business day.</p>
      <p class="form-note" id="contactStatus" style="text-align:center;"></p>
    </form>
  </div>
  <p class="price-note" style="margin-top:26px;">Prefer email? <a href="mailto:admin@stoneridgedigital.com">admin@stoneridgedigital.com</a> · Or call <a href="tel:9723135141">972-313-5141</a></p>
</div></section>`,
  }),
});

/* ---------- Insights / blog ---------- */
const thumb = () => `<div class="thumb"><div class="topo">${topo(0.4)}</div><img src="assets/mark.png" alt="" loading="lazy"></div>`;
const ARTICLES = [
  {
    slug: "insights-local-seo", cat: "SEO", date: "July 2026", read: "5 min read",
    title: "Local SEO: the basics most businesses miss",
    excerpt: "Before you chase rankings, get these fundamentals right — they do most of the heavy lifting.",
    body: `<p class="lead">Local SEO isn't magic, and it isn't a secret. Most of the wins come from doing a handful of unglamorous things properly and consistently. Here's where to start.</p>
<h2>Claim and complete your Google Business Profile</h2>
<p>Your Google Business Profile is one of the most important local assets you have. Claim it, verify it, and fill in <strong>every</strong> relevant field — hours, services, service areas, photos, and a real description of what you do. Our <a href="seo.html">local SEO service</a> connects that profile work with the pages and technical signals on your site.</p>
<ul><li>Add real photos of your team and space, not stock images.</li><li>Keep your hours accurate, especially around holidays.</li><li>Post updates occasionally — it signals an active business.</li></ul>
<h2>Keep your name, address & phone consistent everywhere</h2>
<p>Search engines cross-check your business details across the web. If your address is formatted three different ways across five directories, that inconsistency works against you. Pick one format and use it everywhere.</p>
<div class="callout">A single source of truth for your name, address, and phone number is one of the highest-leverage things a local business can fix.</div>
<h2>Earn reviews the right way</h2>
<p>Reviews influence both rankings and the humans reading them. Ask happy customers at the right moment, make it easy with a direct link, and always respond — to the good and the not-so-good.</p>
<h2>Build pages for what you actually do</h2>
<p>If you offer five services, one catch-all page won't cut it. Give each meaningful service its own page with genuinely useful content. It helps search engines understand you, and it helps customers find exactly what they need. That structure should be part of the <a href="websites.html">website design</a>, not an afterthought.</p>
<h2>Be patient — and consistent</h2>
<p>Local SEO compounds. The work you do this month keeps paying off months from now. The businesses that win are rarely the cleverest — they're the most consistent.</p>`,
  },
  {
    slug: "insights-website-converts", cat: "Websites", date: "July 2026", read: "4 min read",
    title: "What actually makes a website convert",
    excerpt: "A pretty site that doesn't turn visitors into customers is just expensive decoration. Here's what matters.",
    body: `<p class="lead">A website's job isn't to win design awards — it's to help the right person take the next step. These are the fundamentals that make that happen.</p>
<h2>Speed comes first</h2>
<p>If your site takes too long to load, a chunk of visitors leave before they see anything. Fast, lightweight pages aren't a nice-to-have — they're the price of entry. Our <a href="websites.html">custom website work</a> starts with that performance foundation.</p>
<h2>One obvious next step per page</h2>
<p>Every page should make it painfully clear what to do next: call, book, or get a quote. When you give people five equally-weighted options, many choose none.</p>
<ul><li>Put your primary action above the fold.</li><li>Repeat it as people scroll — don't make them hunt.</li><li>Use plain language: "Book a call," not "Engage our services."</li></ul>
<h2>Answer the questions in the visitor's head</h2>
<p>What do you do? Who's it for? Why you? What happens next? If your homepage answers those in a few seconds, you're ahead of most.</p>
<div class="callout">Clarity beats cleverness. A visitor who understands you in five seconds is worth more than one who's impressed but confused.</div>
<h2>Earn trust quickly</h2>
<p>Real photos, clear contact info, and genuine reviews do more for trust than any amount of polish. People buy from businesses that feel real and reachable.</p>
<h2>Design for the phone</h2>
<p>Most local searches happen on mobile. If the experience is anything less than effortless on a phone, you're leaving people behind. A strong mobile experience also supports the usability and technical quality addressed through <a href="seo.html">search optimization</a>.</p>`,
  },
  {
    slug: "insights-content-system", cat: "Social", date: "June 2026", read: "5 min read",
    title: "A social content system you'll actually stick to",
    excerpt: "Consistency beats intensity. Here's how to keep showing up without it taking over your week.",
    body: `<p class="lead">Most businesses don't have a content problem — they have a consistency problem. The fix isn't working harder; it's building a system that keeps going when motivation doesn't.</p>
<h2>Batch, don't scramble</h2>
<p>Trying to create content daily is exhausting and it shows. Instead, set aside one focused session to capture a month's worth at once. One good filming day beats thirty rushed ones.</p>
<h2>Capture once, use everywhere</h2>
<p>A single piece of footage can become a reel, a few photos, a blog snippet, and an email. Think in terms of raw material you can repurpose, not one-off posts. A structured <a href="social-content.html">social and content workflow</a> makes that reuse much easier.</p>
<ul><li>Film a short "how it works" clip → reel + website video.</li><li>Answer a common customer question → post + FAQ + email.</li><li>Show behind the scenes → story + a human touch on your site.</li></ul>
<h2>Keep a simple calendar</h2>
<p>You don't need a complex tool. A basic plan of what goes out and when removes the daily "what do I post?" decision — which is usually what kills consistency. Add only the <a href="automation.html">automation</a> that supports the process instead of making it harder to manage.</p>
<div class="callout">The best content system is the one that still runs on your busiest week.</div>
<h2>Let it sound like you</h2>
<p>Polished-but-generic content gets ignored. Content that actually sounds and looks like your business builds a real connection — even if it's a little rough around the edges.</p>`,
  },
];
const relatedArticles = (curSlug) => ARTICLES.filter(a => a.slug !== curSlug).slice(0, 2);
const articlePage = (a) => {
  const content = `<header class="page-hero" id="top">
  ${phMtns()}
  <div class="wrap">
    <p class="crumb reveal in"><a href="blog.html">Insights</a> / ${a.cat}</p>
    <div class="article-meta reveal in"><span class="cat">${a.cat}</span><span>${a.date}</span><span>·</span><span>${a.read}</span></div>
    <h1 class="h-xl reveal in" style="font-size:clamp(2.2rem,5.5vw,3.8rem);max-width:16ch;">${a.title}</h1>
  </div>
</header>
<section style="padding-top:10px;"><div class="wrap"><div class="prose reveal">${a.body}</div></div></section>
<section class="band-alt"><div class="wrap">
  <div class="sec-head center reveal"><p class="eyebrow">Keep reading</p><h2 class="h-lg">More insights.</h2></div>
  <div class="blog-grid" style="max-width:780px;margin:0 auto;grid-template-columns:1fr 1fr;">
    ${relatedArticles(a.slug).map(r => `<a href="${r.slug}.html" class="post reveal">${thumb()}<div class="pbody"><span class="cat">${r.cat}</span><h3>${r.title}</h3><p>${r.excerpt}</p><span class="rm">Read ${arrow}</span></div></a>`).join("")}
  </div>
</div></section>
${ctaBand("Want this handled for you?", "We build the site, run the SEO, and produce the content — so you can run your business.")}`;
  const schema = [{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.excerpt, datePublished: "2026-07-01", author: { "@type": "Organization", name: "Stoneridge Digital" }, publisher: { "@type": "Organization", name: "Stoneridge Digital", logo: { "@type": "ImageObject", url: `${DOMAIN}/assets/mark.png` } }, image: OGIMG }];
  const seoTitles = {
    "insights-local-seo": "Local SEO Basics Most Businesses Miss | Stoneridge",
    "insights-website-converts": "What Makes a Website Convert | Stoneridge Digital",
    "insights-content-system": "A Practical Social Content System | Stoneridge Digital",
  };
  return { file: `${a.slug}.html`, html: layout({ title: seoTitles[a.slug], desc: a.excerpt, content, path: `${a.slug}.html`, ogType: "article", schema }) };
};
ARTICLES.forEach(a => pages.push(articlePage(a)));

// Blog index
pages.push({
  file: "blog.html",
  html: layout({
    path: "blog.html",
    title: "Insights — Stoneridge Digital",
    desc: "Practical marketing insights for local businesses — SEO, websites, social, and the systems that tie them together.",
    content: `${pageHero({ center: true, eyebrow: "Insights", title: "Practical ideas<br>for local growth.", lead: "No fluff, no hype — just useful thinking on websites, SEO, social, and the systems that make marketing actually work.", actions: false })}
<section style="padding-top:14px;"><div class="wrap"><div class="blog-grid">
  ${ARTICLES.map((a, i) => `<a href="${a.slug}.html" class="post reveal" data-anim="${i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : ""}" data-delay="${i % 3}">${thumb()}<div class="pbody"><span class="cat">${a.cat}</span><h3>${a.title}</h3><p>${a.excerpt}</p><span class="rm">Read article ${arrow}</span></div></a>`).join("\n  ")}
</div></div></section>
${ctaBand()}`,
  }),
});

// Industries — dedicated, tailored landing pages per vertical
const INDUSTRY_PAGES = [
  { slug: "dental-marketing", name: "Dental & Orthodontics", icon: "M12 3a5 5 0 015 5c0 3-2 4-2 7H9c0-3-2-4-2-7a5 5 0 015-5z", card: "New-patient marketing that fills the schedule.", noun: "practices",
    eyebrow: "Dental marketing", title: "Marketing for dental<br>&amp; orthodontic practices.",
    lead: "New patients come from being the practice that's easy to find, easy to trust, and easy to book — that's exactly what we build.",
    pains: [["Compete with the DSO chains", "Stand out against corporate groups and their ad budgets with a sharper local presence."], ["Turn visitors into booked chairs", "A website designed to move people from browsing to booking an appointment."], ["Win the review game", "Automated review requests that keep your 5-star reputation growing."], ["Rank for what you do", "Show up for the procedures and neighborhoods that matter most to your practice."]],
    faqs: [["Do you work with dental practices?", "Yes — dental and orthodontic practices are a core focus. Everything is tailored to your services and local market."], ["Can you help us attract specific procedures?", "We build content and campaigns around the treatments you want more of, and the local searches patients actually make."], ["Do you manage our reviews?", "Yes — automated review requests across Google, Apple Maps and Yelp are part of our automation service."]],
    related: ["websites", "seo", "automation"] },
  { slug: "medical-marketing", name: "Medical & Specialty", icon: "M12 2v20M2 12h20", card: "A trusted, professional presence for practices & specialists.", noun: "practices",
    eyebrow: "Medical marketing", title: "Marketing for medical<br>&amp; specialty practices.",
    lead: "Patients research carefully before they choose a provider. We help your practice look established, trustworthy, and easy to reach.",
    pains: [["Build trust for big decisions", "A polished, professional presence that reassures patients from the first click."], ["Stand out among specialists", "Clear positioning so the right patients understand why you're the right choice."], ["Make booking effortless", "Simple paths to call or request an appointment on every device."], ["Be found locally", "Local SEO and an optimized profile so nearby patients find you first."]],
    faqs: [["Do you work with medical practices?", "Yes — from primary care to specialty practices. Everything is tailored to your patients and market."], ["Can you keep our messaging professional?", "Absolutely. We keep the tone clean, clear, and appropriate for healthcare."], ["Do you handle our Google Business Profile?", "Yes — optimizing and maintaining it is part of our local SEO work."]],
    related: ["websites", "seo", "social-content"] },
  { slug: "legal-marketing", name: "Legal", icon: "M12 3v18M6 7l6-4 6 4M4 21h16", card: "Be found the moment someone needs counsel.", noun: "firms",
    eyebrow: "Legal marketing", title: "Marketing for<br>law firms.",
    lead: "When someone needs a lawyer, they search — and they choose fast. We help your firm be the one they find and trust.",
    pains: [["Rank in a crowded field", "Local and technical SEO built for competitive legal search terms."], ["Earn trust in seconds", "A credible, confident website that turns visitors into consultations."], ["Capture every lead", "Clear calls, forms, and missed-call text-back so no inquiry slips away."], ["Stand apart", "Positioning and content that set your firm apart from every other."]],
    faqs: [["Do you work with law firms?", "Yes — across practice areas. Everything is tailored to your firm and local market."], ["Can you help us rank for competitive terms?", "We focus on the searches most likely to bring you the right cases, and build steadily toward them."], ["Do you handle intake follow-up?", "Our automation service includes missed-call text-back and booking so inquiries get a fast response."]],
    related: ["seo", "advertising", "automation"] },
  { slug: "home-services-marketing", name: "Home Services", icon: "M3 12l9-9 9 9M5 10v10h14V10", card: "Book more jobs across your service area.", noun: "businesses",
    eyebrow: "Home services marketing", title: "Marketing for home<br>service businesses.",
    lead: "When the AC quits or a pipe bursts, homeowners call whoever they find first. We make sure that's you.",
    pains: [["Show up for urgent searches", "Local SEO and ads aimed at the 'near me, right now' searches that drive jobs."], ["Cover your whole service area", "Genuinely localized pages so you're found across every town you serve."], ["Never miss a lead", "Missed-call text-back and after-hours booking so no job gets away."], ["Win the next call with reviews", "Automated review requests that build the reputation homeowners look for."]],
    faqs: [["Do you work with home service businesses?", "Yes — HVAC, plumbing, electrical, roofing, landscaping and more. Everything is tailored to your trade and area."], ["Can you help across multiple cities?", "Yes — we build localized service-area pages for each city you cover."], ["What about calls we miss on a job?", "Missed-call text-back automatically replies so the customer stays engaged until you can call back."]],
    related: ["seo", "advertising", "automation"] },
  { slug: "fitness-marketing", name: "Fitness & Wellness", icon: "M6 6l12 12M4 12h16", card: "Fill classes and memberships with real content.", noun: "studios",
    eyebrow: "Fitness marketing", title: "Marketing for fitness<br>&amp; wellness studios.",
    lead: "People join places that feel alive online. We capture your community and turn interest into sign-ups.",
    pains: [["Fill classes & memberships", "A site and funnel built to turn interest into trials and sign-ups."], ["Show your community", "Real filmed content that captures the energy of your space."], ["Stand out from big-box gyms", "Positioning that plays to what makes your studio different."], ["Stay consistent online", "We run your social so you can run your floor."]],
    faqs: [["Do you work with gyms and studios?", "Yes — from boutique studios to wellness centers. Everything is tailored to your members and market."], ["Do you create the content?", "Yes — we film, edit and post real content that looks like your space and your people."], ["Can you help with sign-ups?", "We build clear paths to book a trial or join, and can run ads to drive them."]],
    related: ["social-content", "websites", "advertising"] },
  { slug: "medspa-marketing", name: "Med Spa & Aesthetics", icon: "M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 20l-4.9 2.6.9-5.5-4-3.9 5.5-.8z", card: "Marketing as polished as your results.", noun: "med spas",
    eyebrow: "Med spa marketing", title: "Marketing for med spas<br>&amp; aesthetics.",
    lead: "Your marketing should look as refined as your work. We build a brand and presence that attracts the right clientele.",
    pains: [["A brand that's as refined as you", "Elevated design and content that match the quality of your treatments."], ["Showcase treatments tastefully", "Content that highlights your services with polish, not hype."], ["Attract the right clients", "Targeting and positioning aimed at the clientele you want."], ["Book more consultations", "Clear, low-friction paths to book a consult."]],
    faqs: [["Do you work with med spas?", "Yes — med spas and aesthetics practices. Everything is tailored to your treatments and clientele."], ["Can you make it look premium?", "Yes — elevated, on-brand design is central to how we work with aesthetics clients."], ["Do you run the social content?", "We film, edit and manage social so your feed stays as polished as your space."]],
    related: ["websites", "social-content", "advertising"] },
];
const industryPage = (ind) => {
  const content = `${pageHero({ crumb: `<a href="industries.html">Who We Serve</a> / ${ind.name}`, eyebrow: ind.eyebrow, title: ind.title, lead: ind.lead })}
<section><div class="wrap">
  <div class="sec-head reveal"><p class="eyebrow">What we solve</p><h2 class="h-lg">The challenges we<br>help with.</h2></div>
  <div class="inc-grid">
    ${ind.pains.map(([t, d], i) => `<div class="inc inc-static reveal" data-anim="${i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : ""}" data-delay="${i % 3}"><div class="ic">${genIcon(`<path d="${ind.icon}"/>`)}</div><h3>${t}</h3><p>${d}</p></div>`).join("\n    ")}
  </div>
</div></section>
<section class="band-alt"><div class="wrap">
  <div class="sec-head center reveal"><p class="eyebrow">What we do</p><h2 class="h-lg">Everything your ${ind.noun}<br>need, under one roof.</h2></div>
  <div class="inc-grid">
    ${SVCLINKS.map(([s, l, d], i) => `<a href="${s}.html" class="inc inc-link reveal" data-anim="${i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : ""}" data-delay="${i % 3}"><div class="ic">${genIcon(svcIcon[s])}</div><h3>${l}</h3><p>${d}</p><span class="inc-cta">Explore service ${arrow}</span></a>`).join("\n    ")}
  </div>
</div></section>
<section><div class="wrap">
  <div class="sec-head center reveal"><p class="eyebrow">${ind.name} questions</p><h2 class="h-lg">Good to know.</h2></div>
  <div class="faq reveal">
    ${ind.faqs.map(f => `<div class="faq-item"><button class="faq-q">${f[0]} <span class="ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="faq-a"><p>${f[1]}</p></div></div>`).join("\n    ")}
  </div>
</div></section>
${relatedBlock(ind.related)}
${ctaBand()}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", serviceType: ind.eyebrow, name: ind.eyebrow, description: ind.lead.replace(/<[^>]+>/g, ""), provider: { "@type": "Organization", name: "Stoneridge Digital", url: DOMAIN }, areaServed: "United States" },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: ind.faqs.map(f => ({ "@type": "Question", name: f[0], acceptedAnswer: { "@type": "Answer", text: f[1] } })) },
  ];
  return { file: `${ind.slug}.html`, html: layout({ path: `${ind.slug}.html`, title: `${ind.eyebrow.replace(/^./, x => x.toUpperCase())} — Stoneridge Digital`, desc: ind.lead.replace(/<[^>]+>/g, ""), content, schema }) };
};
INDUSTRY_PAGES.forEach(ind => pages.push(industryPage(ind)));

pages.push({
  file: "industries.html",
  html: layout({
    path: "industries.html",
    title: "Who We Serve — Stoneridge Digital",
    desc: "Stoneridge Digital works with local service businesses — dental, medical, legal, home services, fitness, and med spas.",
    content: `${pageHero({ center: true, eyebrow: "Who we serve", title: "Built for local<br>service businesses.", lead: "We specialize in the businesses that live and die by their local reputation. If your customers are nearby and your calendar matters, we speak your language." })}
<section><div class="wrap"><div class="inc-grid">
  ${INDUSTRY_PAGES.map((ind, i) => `<a href="${ind.slug}.html" class="inc inc-link reveal" data-anim="${i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : ""}" data-delay="${i % 3}"><div class="ic">${genIcon(`<path d="${ind.icon}"/>`)}</div><h3>${ind.name}</h3><p>${ind.card}</p><span class="inc-cta">Explore industry ${arrow}</span></a>`).join("\n  ")}
</div>
<p class="price-note" style="margin-top:34px;">Don't see your industry? We work with plenty of others — <a href="book.html">let's talk</a>.</p>
</div></section>
${ctaBand()}`,
  }),
});

// Legal — Privacy
pages.push({
  file: "privacy.html",
  html: layout({
    path: "privacy.html",
    title: "Privacy Policy — Stoneridge Digital", noindex: true,
    desc: "Privacy policy for Stoneridge Digital.",
    content: `${pageHero({ eyebrow: "Legal", title: "Privacy Policy", lead: "How we handle the information you share with us.", actions: false })}
<section style="padding-top:6px;"><div class="wrap"><div class="legal reveal">
  <p class="updated">Last updated: July 2026 · <strong>Template — please have counsel review before launch.</strong></p>
  <p>Stoneridge Digital ("we," "us") respects your privacy. This policy explains what we collect and how we use it.</p>
  <h2>Information we collect</h2>
  <p>When you submit a form, we collect the details you provide — such as your name, business, email, and phone number — so we can respond to your inquiry. We may also collect standard analytics data (pages visited, general location, device type) to improve the site.</p>
  <h2>How we use it</h2>
  <ul><li>To reply to your inquiry and provide the services you request.</li><li>To improve our website and communications.</li><li>To send occasional updates, only if you've opted in.</li></ul>
  <h2>Sharing</h2>
  <p>We do not sell your personal information. We may share it with trusted service providers (for example, our form and email tools) solely to operate our business.</p>
  <h2>Your choices</h2>
  <p>You can request that we access, correct, or delete your information at any time by emailing <a href="mailto:admin@stoneridgedigital.com">admin@stoneridgedigital.com</a>.</p>
  <h2>Contact</h2>
  <p>Questions about this policy? Reach us at <a href="mailto:admin@stoneridgedigital.com">admin@stoneridgedigital.com</a> or 972-313-5141.</p>
</div></div></section>`,
  }),
});

// Legal — Terms
pages.push({
  file: "terms.html",
  html: layout({
    path: "terms.html",
    title: "Terms of Service — Stoneridge Digital", noindex: true,
    desc: "Terms of service for Stoneridge Digital.",
    content: `${pageHero({ eyebrow: "Legal", title: "Terms of Service", lead: "The basics of using this website and working with us.", actions: false })}
<section style="padding-top:6px;"><div class="wrap"><div class="legal reveal">
  <p class="updated">Last updated: July 2026 · <strong>Template — please have counsel review before launch.</strong></p>
  <h2>Using this website</h2>
  <p>This site is provided for general information about our services. Content may change without notice, and we make no guarantees about specific outcomes.</p>
  <h2>Services & engagements</h2>
  <p>Any work we do together is governed by a separate written agreement that sets out the scope, start date, and how either party may end the engagement.</p>
  <h2>Intellectual property</h2>
  <p>The Stoneridge Digital name, logo, and site content are our property. Work products created for a client are handled per that client's agreement.</p>
  <h2>Limitation of liability</h2>
  <p>To the fullest extent permitted by law, Stoneridge Digital is not liable for indirect or consequential damages arising from use of this site.</p>
  <h2>Contact</h2>
  <p>Questions? Email <a href="mailto:admin@stoneridgedigital.com">admin@stoneridgedigital.com</a>.</p>
</div></div></section>`,
  }),
});

// 404
pages.push({
  file: "404.html",
  html: layout({
    path: "404.html",
    title: "Page not found — Stoneridge Digital", noindex: true,
    desc: "The page you're looking for couldn't be found.",
    content: `<header class="err-hero">
  ${phMtns()}
  <div class="big404">404</div>
  <div class="ov"><div class="wrap" style="max-width:600px;">
    <img class="mark-float" src="assets/mark.png" alt="" width="56" style="margin:0 auto 18px;">
    <h1 class="h-lg" style="margin-bottom:14px;">This trail went cold.</h1>
    <p class="lead" style="margin:0 auto 28px;">The page you're after doesn't exist — but the good stuff is a click away.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;"><a href="/" class="btn btn-primary btn-lg" data-hover>Back home ${arrow}</a><a href="services.html" class="btn btn-ghost btn-lg" data-hover>See services</a></div>
  </div></div>
</header>`,
  }),
});

/* ---------- Service-area pages ----------
   Only Austin is indexable until the other markets have original local
   research, proof, and content. This avoids thin doorway-page patterns. */
const LOCATIONS = [
  { city: "Austin", indexable: true, metro: "Greater Austin area", angle: "We help businesses serving Austin build a clearer website, stronger local search presence, and a marketing system designed to turn attention into real inquiries.", areas: "Austin and the surrounding metro", landmark: "across the Austin metro" },
  { city: "Round Rock", metro: "Greater Austin area", angle: "Round Rock's fast growth just north of Austin makes it a prime market — if local customers can actually find you.", areas: "Downtown Round Rock, La Frontera, Teravista and the Dell area", landmark: "from Old Settlers Park to La Frontera" },
  { city: "Cedar Park", metro: "Greater Austin area", angle: "Cedar Park's booming family community rewards businesses with a sharp, trustworthy local presence.", areas: "Buttercup Creek, the Bell District, Twin Creeks and the 1890 Ranch area", landmark: "around the Bell District and 1890 Ranch" },
  { city: "Georgetown", metro: "Greater Austin area", angle: "Georgetown blends historic charm with rapid growth — a great place to build a loyal local following online.", areas: "the historic Downtown Square, Sun City, Wolf Ranch and Berry Creek", landmark: "around the Georgetown Square" },
  { city: "Dallas", metro: "DFW metro", angle: "Dallas is a big, competitive market — standing out takes a site and a strategy built to cut through the noise.", areas: "Uptown, Deep Ellum, Bishop Arts, Oak Cliff, Lakewood and Preston Hollow", landmark: "from the Arts District to the Bishop Arts shops" },
  { city: "Fort Worth", metro: "DFW metro", angle: "Fort Worth blends deep roots with fast growth. We help local businesses look modern without losing that hometown feel.", areas: "Sundance Square, West 7th, the Near Southside, the TCU area and the Stockyards", landmark: "from Sundance Square to the Stockyards" },
  { city: "Plano", metro: "DFW metro", angle: "Plano is affluent and crowded with corporate neighbors. Local businesses here win on trust, reviews and a polished presence.", areas: "Legacy West, Downtown Plano, Willow Bend and West Plano", landmark: "from Legacy West to historic Downtown Plano" },
  { city: "Frisco", metro: "DFW metro", angle: "Frisco is booming with young families and new development — a market where showing up first genuinely matters.", areas: "The Star, Frisco Square, Stonebriar and Preston Road", landmark: "from The Star to Stonebriar Centre" },
  { city: "McKinney", metro: "DFW metro", angle: "McKinney's charm and rapid growth make it a great place to build a loyal local following — if people can find you.", areas: "Historic Downtown, Adriatica, Craig Ranch and Stonebridge Ranch", landmark: "from the historic square to Adriatica Village" },
  { city: "Arlington", metro: "DFW metro", angle: "Arlington sits at the heart of the Mid-Cities and draws huge crowds — we help local businesses turn that traffic into customers.", areas: "the Entertainment District, downtown, the UTA area and Dalworthington Gardens", landmark: "near AT&T Stadium and Globe Life Field" },
  { city: "Irving", metro: "DFW metro", angle: "Irving's Las Colinas corridor is dense with business. Local shops and practices here need a sharp, findable presence to compete.", areas: "Las Colinas, the Toyota Music Factory area, Valley Ranch and downtown Irving", landmark: "from Las Colinas to the Music Factory" },
  { city: "Denton", metro: "DFW metro", angle: "Denton's creative, college-town energy rewards businesses that show real personality online — exactly what we build.", areas: "the Downtown Square, the UNT and TWU areas, and Rayzor Ranch", landmark: "around the Downtown Denton Square" },
];
const cityPage = (loc) => {
  const c = loc.city;
  const slug = `marketing-${c.toLowerCase().replace(/[^a-z]/g, "-")}`;
  const localFaqs = [
    [`Do you help businesses that serve ${c}?`, `Yes. We can build and manage marketing for businesses whose customers are in ${c} and the surrounding ${loc.metro}. The work is delivered remotely and tailored to the services, customers, and competition you actually face.`],
    [`How can you help a ${c} business get found locally?`, `Depending on the business, that can include a fast website, on-page and technical SEO, Google Business Profile guidance, consistent business information, and useful content built around genuine customer questions.`],
    [`Do we have to meet in person?`, `No. Strategy, reviews, approvals, and reporting can all be handled by call and email, so we can support a business serving ${c} without implying that we maintain an office there.`],
  ];
  const content = `${pageHero({ crumb: `<a href="locations.html">Locations</a> / ${c}`, eyebrow: `${c} marketing company`, title: `The marketing company<br>built for ${c} businesses.`, lead: loc.angle })}
<section><div class="wrap"><div class="two-col">
  <div class="reveal" data-anim="left">
    <p class="eyebrow">Built around your market</p>
    <h2 class="h-lg" style="margin-bottom:20px;">Marketing for businesses<br>serving ${c}.</h2>
    <p class="lead" style="margin-bottom:16px;">We start with what your customers search for, what they need to trust, and how they prefer to contact you. Then we connect your website, search visibility, advertising, content, and follow-up around that path.</p>
    <p style="color:var(--sage);">Stoneridge Digital serves clients remotely. This page describes markets we can support; it does not represent a physical office in ${c}.</p>
    <a href="book.html" class="btn btn-primary btn-lg" style="margin-top:26px;" data-hover>Book a call ${arrow}</a>
  </div>
  <div class="panel-img reveal" data-anim="right"><div class="topo">${topo(0.4)}</div><img class="pmark" src="assets/mark.png" alt="" loading="lazy"></div>
</div></div></section>
<section class="band-alt"><div class="wrap">
  <div class="sec-head center reveal"><p class="eyebrow">What we do</p><h2 class="h-lg">Everything ${c} needs,<br>under one roof.</h2></div>
  <div class="inc-grid">
    ${SVCLINKS.map(([s, l, d], i) => `<a href="${s}.html" class="inc inc-link reveal" data-anim="${i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : ""}" data-delay="${i % 3}"><div class="ic">${genIcon(svcIcon[s])}</div><h3>${l}</h3><p>${d}</p><span class="inc-cta">Explore service ${arrow}</span></a>`).join("\n    ")}
  </div>
</div></section>
<section><div class="wrap">
  <div class="sec-head center reveal"><p class="eyebrow">${c} questions</p><h2 class="h-lg">Good to know.</h2></div>
  <div class="faq reveal">
    ${localFaqs.map(f => `<div class="faq-item"><button class="faq-q">${f[0]} <span class="ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg></span></button><div class="faq-a"><p>${f[1]}</p></div></div>`).join("\n    ")}
  </div>
</div></section>
${ctaBand(`Grow your ${c} business.`, `Book a free call and we'll map the fastest path for your ${c} business — no pressure, no jargon.`)}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", serviceType: "Digital marketing", name: `Digital marketing in ${c}, TX`, areaServed: { "@type": "City", name: `${c}, Texas` }, provider: { "@type": "Organization", name: "Stoneridge Digital", url: DOMAIN } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: localFaqs.map(f => ({ "@type": "Question", name: f[0], acceptedAnswer: { "@type": "Answer", text: f[1] } })) },
  ];
  const pageTitle = c === "Austin" ? "Digital Marketing for Austin Businesses | Stoneridge" : `${c} Digital Marketing Agency | Stoneridge Digital`;
  return { file: `${slug}.html`, indexable: Boolean(loc.indexable), html: layout({ noindex: !loc.indexable, path: `${slug}.html`, title: pageTitle, desc: `Web design, SEO, paid media, content and automation for businesses serving ${c}, Texas. See how Stoneridge Digital can support your growth.`, content, schema }) };
};
const cityPages = LOCATIONS.map(cityPage);
cityPages.forEach(p => pages.push(p));

// Locations index
pages.push({
  file: "locations.html",
  html: layout({
    path: "locations.html",
    title: "Areas We Serve — Stoneridge Digital",
    desc: "Remote web design, SEO, paid media, content and automation support for businesses serving Austin, Texas and markets nationwide.",
    content: `${pageHero({ center: true, eyebrow: "Areas we serve", title: "Marketing support,<br>wherever you operate.", lead: "Stoneridge Digital works remotely with service businesses across the United States, with focused support for businesses serving Austin and other Texas markets." })}
<section><div class="wrap"><div class="related">
  ${LOCATIONS.filter(l => l.indexable).map((l, i) => `<a href="marketing-${l.city.toLowerCase().replace(/[^a-z]/g, "-")}.html" class="reveal" data-delay="${i % 3}">${l.city} ${arrow}</a>`).join("\n  ")}
</div>
<p class="price-note" style="margin-top:34px;">We also support businesses throughout Texas and nationwide. <a href="book.html">Tell us where you operate</a> and what you want to improve.</p>
</div></section>
${ctaBand()}`,
  }),
});

/* ---------- write everything ---------- */
Object.keys(SERVICES).forEach(slug => pages.push(servicePage(slug)));
let n = 0;
pages.forEach(p => { fs.writeFileSync(path.join(OUT, p.file), p.html); n++; console.log("wrote", p.file); });

/* ---------- sitemap.xml + robots.txt ---------- */
const indexable = [
  "index.html", "services.html", "websites.html", "seo.html", "aeo.html", "advertising.html",
  "social-content.html", "automation.html", "about.html", "work.html", "industries.html",
  "process.html", "faq.html", "contact.html", "book.html", "seo-audit.html", "blog.html", "locations.html",
  ...INDUSTRY_PAGES.map(i => `${i.slug}.html`),
  ...ARTICLES.map(a => `${a.slug}.html`),
  ...cityPages.filter(p => p.indexable).map(p => p.file),
];
const LASTMOD = "2026-09-23";
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(u => `  <url><loc>${DOMAIN}/${u === "index.html" ? "" : u}</loc><lastmod>${LASTMOD}</lastmod></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`);
console.log("wrote sitemap.xml, robots.txt");
console.log(`\n✔ generated ${n} pages + sitemap + robots`);
