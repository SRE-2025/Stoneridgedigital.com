/* ============================================================
   STONERIDGE DIGITAL — SEO Audit engine
   Live scan via Google PageSpeed Insights (Lighthouse) +
   branded report + lead email to admin@stoneridgedigital.com
   ============================================================ */
(function () {
  "use strict";

  /* ---------- CONFIG ---------- */
  const CONFIG = {
    // Optional: a Google PageSpeed Insights API key raises rate limits.
    // Get one free at https://developers.google.com/speed/docs/insights/v5/get-started
    // The tool works without a key for low volume.
    PSI_KEY: "",
    // Web3Forms access key — receives every audit lead at admin@stoneridgedigital.com.
    // Free key at https://web3forms.com (enter admin@stoneridgedigital.com as the email).
    WEB3FORMS_KEY: "YOUR_WEB3FORMS_ACCESS_KEY",
    ADMIN_EMAIL: "admin@stoneridgedigital.com",
  };

  const $ = (s, c = document) => c.querySelector(s);
  const form = $("#auditForm");
  if (!form) return;

  const stages = { form: $("#stageForm"), scan: $("#stageScan"), report: $("#stageReport") };
  const show = (name) => Object.entries(stages).forEach(([k, el]) => el.classList.toggle("active", k === name));

  const normalizeUrl = (raw) => {
    let u = raw.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    if (!u || !u.includes(".")) return null;
    return "https://" + u;
  };

  const grade = (v) => v >= 90 ? "good" : v >= 50 ? "ok" : "bad";

  /* ---------- Scan progress animation ---------- */
  const C = 2 * Math.PI * 52; // ring circumference
  let scanTimer = null;
  function startScan() {
    const fill = $("#scanFill"), pct = $("#scanPct"), steps = [...document.querySelectorAll(".scan-step")];
    fill.setAttribute("stroke-dasharray", C.toFixed(1));
    let p = 0;
    scanTimer = setInterval(() => {
      // ease toward 90% while waiting for the API; final jump on completion
      p += Math.max(0.4, (90 - p) * 0.03);
      if (p > 90) p = 90;
      fill.style.strokeDashoffset = (C * (1 - p / 100)).toFixed(1);
      pct.textContent = Math.round(p) + "%";
      const active = Math.min(steps.length - 1, Math.floor(p / 20));
      steps.forEach((s, i) => s.classList.toggle("done", i < active));
    }, 90);
  }
  function finishScan() {
    clearInterval(scanTimer);
    const fill = $("#scanFill"), pct = $("#scanPct"), steps = [...document.querySelectorAll(".scan-step")];
    fill.style.strokeDashoffset = "0"; pct.textContent = "100%";
    steps.forEach(s => s.classList.add("done"));
  }

  /* ---------- PageSpeed Insights ---------- */
  async function runPSI(url) {
    const base = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
    const cats = ["performance", "seo", "accessibility", "best-practices"];
    const params = new URLSearchParams();
    params.set("url", url);
    params.set("strategy", "mobile");
    cats.forEach(c => params.append("category", c));
    if (CONFIG.PSI_KEY) params.set("key", CONFIG.PSI_KEY);
    const res = await fetch(base + "?" + params.toString());
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error && body.error.message ? body.error.message : "PSI request failed (" + res.status + ")");
    }
    return res.json();
  }

  function parseReport(data, url) {
    const lh = data.lighthouseResult || {};
    const cat = lh.categories || {};
    const audits = lh.audits || {};
    const score = (k) => cat[k] && cat[k].score != null ? Math.round(cat[k].score * 100) : null;

    const scores = {
      performance: score("performance"),
      seo: score("seo"),
      accessibility: score("accessibility"),
      best: score("best-practices"),
    };
    const vals = Object.values(scores).filter(v => v != null);
    const overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;

    // Metric helper
    const metric = (id) => audits[id] && audits[id].displayValue ? audits[id].displayValue : null;

    // Build findings from key audits
    const check = (id, label, tip) => {
      const a = audits[id];
      if (!a) return null;
      const s = a.score;
      let state = "warn";
      if (s === 1) state = "pass"; else if (s === 0 || (s != null && s < 0.5)) state = "fail";
      return { state, label, detail: (state === "pass" ? (a.title || label) : (tip || a.title)) };
    };

    const findings = [
      check("document-title", "Page title tag", "Add a unique, keyword-rich <title> to every page."),
      check("meta-description", "Meta description", "Write a compelling meta description to lift click-through from search."),
      check("viewport", "Mobile viewport", "Add a responsive viewport tag so mobile users get a proper layout."),
      check("image-alt", "Image alt text", "Add descriptive alt text to images for SEO and accessibility."),
      check("is-on-https", "Secure (HTTPS)", "Serve your site over HTTPS to protect visitors and rank better."),
      check("link-text", "Descriptive link text", "Replace generic 'click here' links with descriptive anchor text."),
      check("crawlable-anchors", "Crawlable links", "Ensure links are crawlable so search engines can find every page."),
      check("tap-targets", "Tap target sizing", "Space out mobile buttons so they're easy to tap."),
      check("color-contrast", "Color contrast", "Increase text/background contrast for readability & accessibility."),
    ].filter(Boolean);

    const perfMetrics = {
      lcp: metric("largest-contentful-paint"),
      fcp: metric("first-contentful-paint"),
      cls: metric("cumulative-layout-shift"),
      tbt: metric("total-blocking-time"),
    };

    return { url, scores, overall, findings, perfMetrics };
  }

  /* ---------- Render report ---------- */
  function gauge(val) {
    const r = 40, c = 2 * Math.PI * r;
    const off = c * (1 - (val || 0) / 100);
    const cls = grade(val || 0);
    return `<div class="gauge"><svg width="92" height="92" viewBox="0 0 92 92">
      <circle cx="46" cy="46" r="${r}" fill="none" stroke="rgba(243,236,217,0.12)" stroke-width="7"/>
      <circle cx="46" cy="46" r="${r}" fill="none" class="stroke-${cls}" stroke-width="7" stroke-linecap="round"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${c.toFixed(1)}" data-target="${off.toFixed(1)}"/>
      </svg><div class="val ${cls}">${val != null ? val : "—"}</div></div>`;
  }

  function renderReport(r, meta) {
    const host = r.url.replace(/^https?:\/\//, "");
    const oc = grade(r.overall);
    const findingRows = r.findings.map(f => {
      const icon = f.state === "pass" ? "✓" : f.state === "fail" ? "✕" : "!";
      return `<div class="finding ${f.state}"><span class="badge">${icon}</span><div><b>${f.label}</b><p>${f.detail}</p></div></div>`;
    }).join("");

    const pm = r.perfMetrics;
    const pmRow = (pm.lcp || pm.fcp || pm.cls || pm.tbt) ? `
      <div class="score-grid" style="margin-top:6px;margin-bottom:34px;">
        ${pm.lcp ? `<div class="score-card"><div class="cap" style="margin-bottom:8px;">Largest Contentful Paint</div><b style="font-family:var(--display);font-size:1.4rem;">${pm.lcp}</b></div>` : ""}
        ${pm.fcp ? `<div class="score-card"><div class="cap" style="margin-bottom:8px;">First Contentful Paint</div><b style="font-family:var(--display);font-size:1.4rem;">${pm.fcp}</b></div>` : ""}
        ${pm.tbt ? `<div class="score-card"><div class="cap" style="margin-bottom:8px;">Total Blocking Time</div><b style="font-family:var(--display);font-size:1.4rem;">${pm.tbt}</b></div>` : ""}
        ${pm.cls ? `<div class="score-card"><div class="cap" style="margin-bottom:8px;">Cumulative Layout Shift</div><b style="font-family:var(--display);font-size:1.4rem;">${pm.cls}</b></div>` : ""}
      </div>` : "";

    $("#reportBody").innerHTML = `
      <div class="report-head">
        <div>
          <p class="eyebrow">Your Stoneridge audit</p>
          <div class="site">${host}</div>
          <small>Analyzed on mobile · powered by Google Lighthouse</small>
        </div>
        <div class="overall"><div><small style="color:var(--sage-dim);">Overall</small><div class="big ${oc}">${r.overall}</div></div></div>
      </div>

      <div class="score-grid">
        <div class="score-card">${gauge(r.scores.seo)}<div class="cap">SEO</div></div>
        <div class="score-card">${gauge(r.scores.performance)}<div class="cap">Performance</div></div>
        <div class="score-card">${gauge(r.scores.accessibility)}<div class="cap">Accessibility</div></div>
        <div class="score-card">${gauge(r.scores.best)}<div class="cap">Best Practices</div></div>
      </div>

      ${pmRow}

      <div class="findings">
        <h3>What we found &amp; how to fix it</h3>
        ${findingRows || "<p style='color:var(--muted)'>No individual checks were returned for this URL.</p>"}
      </div>

      <div class="report-cta">
        <h3 class="h-md" style="font-size:1.6rem;margin-bottom:10px;">Want us to fix every one of these for you?</h3>
        <p style="color:rgba(244,237,219,0.85);max-width:52ch;margin:0 auto 22px;">This is just the surface. Book a call and we'll walk through what these results mean for your business — and how we'd approach them.</p>
        <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
          <a href="index.html#book" class="btn btn-copper btn-lg" data-hover>Book a strategy call</a>
          <a href="index.html#contact" class="btn btn-ghost on-dark btn-lg" data-hover>Get in touch</a>
        </div>
        <p class="emailed-note" id="emailNote">${meta.emailed
          ? `✓ A full copy of this report is on its way to <b>${meta.email}</b>.`
          : `We saved your results${meta.email ? " for " + meta.email : ""}. ${meta.emailErr || ""}`}</p>
      </div>`;

    // animate gauges
    requestAnimationFrame(() => {
      document.querySelectorAll("#reportBody circle[data-target]").forEach(c => {
        c.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)";
        requestAnimationFrame(() => { c.style.strokeDashoffset = c.getAttribute("data-target"); });
      });
    });
  }

  /* ---------- Email the lead + report to admin@ (and enable visitor auto-reply) ---------- */
  async function emailReport(r, lead) {
    if (!CONFIG.WEB3FORMS_KEY || CONFIG.WEB3FORMS_KEY.includes("YOUR_")) {
      return { emailed: false, emailErr: "Add your Web3Forms key to auto-email reports (see README)." };
    }
    const host = r.url.replace(/^https?:\/\//, "");
    const lines = r.findings.map(f => `${f.state === "pass" ? "PASS" : f.state === "fail" ? "FAIL" : "WARN"} — ${f.label}: ${f.detail}`).join("\n");
    const summary =
`STONERIDGE DIGITAL — SEO AUDIT REPORT
Website: ${host}
Overall score: ${r.overall}/100

SCORES
  SEO ............. ${r.scores.seo ?? "—"}
  Performance ..... ${r.scores.performance ?? "—"}
  Accessibility ... ${r.scores.accessibility ?? "—"}
  Best Practices .. ${r.scores.best ?? "—"}

CORE WEB VITALS
  LCP: ${r.perfMetrics.lcp || "—"}   FCP: ${r.perfMetrics.fcp || "—"}
  TBT: ${r.perfMetrics.tbt || "—"}   CLS: ${r.perfMetrics.cls || "—"}

FINDINGS
${lines}

LEAD
  Name:  ${lead.name}
  Email: ${lead.email}
  Site:  ${host}`;

    const payload = {
      access_key: CONFIG.WEB3FORMS_KEY,
      subject: `SEO Audit (${r.overall}/100) — ${host}`,
      from_name: "Stoneridge Digital Audit Tool",
      name: lead.name,
      email: lead.email,          // sets reply-to so the visitor gets any auto-response
      replyto: lead.email,
      website: host,
      overall_score: r.overall,
      message: summary,
    };
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (data.success) return { emailed: true };
    return { emailed: false, emailErr: "We'll follow up by email shortly." };
  }

  /* ---------- Orchestrate ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("#formErr"); err.style.display = "none";
    const url = normalizeUrl($("#siteInput").value);
    const lead = { name: form.name.value.trim(), email: form.email.value.trim() };
    if (!url) { err.textContent = "Please enter a valid website (e.g. yourbusiness.com)."; err.style.display = "block"; return; }

    show("scan"); startScan();

    let report, emailMeta = { emailed: false, email: lead.email };
    try {
      const data = await runPSI(url);
      report = parseReport(data, url);
    } catch (ex) {
      // Graceful fallback: still capture the lead, tell them a manual audit is coming
      clearInterval(scanTimer);
      show("form");
      err.innerHTML = "We couldn't auto-scan that URL right now (" + (ex.message || "network error") +
        "). Double-check the domain, or <a href='index.html#contact' style='color:var(--copper-bright);text-decoration:underline;'>request a manual audit</a> and we'll email it to you.";
      err.style.display = "block";
      // fire the lead anyway so admin@ still hears about it
      emailReport({ url, scores: {}, overall: 0, findings: [], perfMetrics: {} }, lead).catch(() => {});
      return;
    }

    // email in parallel with the finish animation
    const mailPromise = emailReport(report, lead).catch(() => ({ emailed: false, emailErr: "" }));
    finishScan();
    const mailRes = await mailPromise;
    emailMeta = Object.assign(emailMeta, mailRes);

    setTimeout(() => { show("report"); renderReport(report, emailMeta); window.scrollTo({ top: 0, behavior: "smooth" }); }, 650);
  });
})();
