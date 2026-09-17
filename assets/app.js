/* ============================================================
   STONERIDGE DIGITAL — Interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- CONFIG: drop your real links/keys here ---------- */
  const CONFIG = {
    // Scheduler links (Calendly / Cal.com / TidyCal). Leave blank to fall back to the contact form.
    booking: {
      new:     "", // e.g. "https://calendly.com/stoneridge/discovery"
      current: "", // e.g. "https://calendly.com/stoneridge/client-checkin"
      design:  "", // e.g. "https://calendly.com/stoneridge/design-strategy"
    },
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Year ---------- */
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Nav scroll state + progress ---------- */
  const nav = $("#nav"), progress = $("#progress");
  const onScroll = () => {
    const y = window.scrollY;
    nav && nav.classList.toggle("scrolled", y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Mobile menu ---------- */
  const mm = $("#mobileMenu");
  $("#menuBtn") && $("#menuBtn").addEventListener("click", () => mm.classList.add("open"));
  $("#menuClose") && $("#menuClose").addEventListener("click", () => mm.classList.remove("open"));
  mm && $$("a", mm).forEach(a => a.addEventListener("click", () => mm.classList.remove("open")));

  /* ---------- Custom cursor ---------- */
  const dot = $("#cDot"), ring = $("#cRing");
  if (dot && ring && window.matchMedia("(hover: hover)").matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener("mouseover", e => {
      if (e.target.closest("a,button,[data-hover],input,textarea,select")) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", e => {
      if (e.target.closest("a,button,[data-hover],input,textarea,select")) ring.classList.remove("is-hover");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revs = $$(".reveal:not(.in)");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revs.forEach(el => io.observe(el));
  } else {
    revs.forEach(el => el.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  const fmt = (v, dec) => dec ? v.toFixed(1) : Math.round(v).toLocaleString();
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dec = target % 1 !== 0;
    const span = el.querySelector("span");
    const dur = 1600; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      span.textContent = fmt(target * eased, dec);
      if (p < 1) requestAnimationFrame(tick);
      else { span.textContent = fmt(target, dec); if (suffix) { const s = document.createElement("i"); s.className = "suffix"; s.style.fontStyle = "normal"; s.textContent = suffix; el.appendChild(s); } }
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !reduce) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.5 });
    $$("[data-count]").forEach(el => co.observe(el));
  } else {
    $$("[data-count]").forEach(el => { el.querySelector("span").textContent = el.dataset.count; if (el.dataset.suffix) el.querySelector("span").textContent += el.dataset.suffix; });
  }

  /* ---------- 3D tilt + glow tracking ---------- */
  if (window.matchMedia("(hover: hover)").matches && !reduce) {
    $$("[data-tilt]").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        const rotX = (0.5 - py) * 6, rotY = (px - 0.5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Hero canvas: flowing constellation ---------- */
  const canvas = $("#hero-canvas");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, pts = [], mouse = { x: -999, y: -999 };
    const COLORS = ["rgba(207,138,72,", "rgba(229,167,96,", "rgba(185,198,179,"];
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.width = canvas.offsetWidth * dpr;
      h = canvas.height = canvas.offsetHeight * dpr;
      const count = Math.min(90, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 13000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * dpr, vy: (Math.random() - 0.5) * 0.25 * dpr,
        r: (Math.random() * 1.6 + 0.6) * dpr, c: COLORS[Math.floor(Math.random() * COLORS.length)]
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", e => { const r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * dpr; mouse.y = (e.clientY - r.top) * dpr; });
    canvas.addEventListener("mouseleave", () => { mouse.x = mouse.y = -999; });
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        // mouse repel
        const dxm = p.x - mouse.x, dym = p.y - mouse.y, dm = Math.hypot(dxm, dym);
        if (dm < 130 * dpr) { p.x += (dxm / dm) * 1.4; p.y += (dym / dm) * 1.4; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.c + "0.75)"; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
          if (d < 130 * dpr) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(207,138,72," + (0.14 * (1 - d / (130 * dpr))) + ")";
            ctx.lineWidth = dpr; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- Booking buttons ---------- */
  $$("[data-book]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const url = CONFIG.booking[btn.dataset.book];
      if (url) { e.preventDefault(); window.open(url, "_blank", "noopener"); }
      else {
        // fall back to contact form, pre-tagging the request type
        const map = { new: "New client discovery call", current: "Current client check-in", design: "Design / strategy call" };
        const msg = $("#contactForm [name=message]");
        if (msg) msg.value = "I'd like to book a " + (map[btn.dataset.book] || "call") + ". My preferred times are: ";
        const subj = $("#contactForm [name=subject]");
        if (subj) subj.value = "Call request (" + (map[btn.dataset.book] || "call") + ") — Stoneridge Digital";
      }
    });
  });

  /* ---------- Booking page (book.html): track cards + call-type + date floor ---------- */
  const bookForm = $("#bookForm");
  if (bookForm) {
    const subjEl = bookForm.querySelector("[name=subject]");
    const trackToLabel = { new: "New Client Discovery", current: "Current Client Check-in", design: "Design / Strategy Call" };
    const radios = $$("input[name=call_type]", bookForm);
    const cards = $$("#trackCards [data-track]");
    const syncSubject = () => {
      const sel = bookForm.querySelector("input[name=call_type]:checked");
      if (subjEl && sel) subjEl.value = "New call booking — " + sel.value;
      cards.forEach(c => c.classList.toggle("is-active", sel && trackToLabel[c.dataset.track] === sel.value));
    };
    const selectTrack = (t) => {
      const label = trackToLabel[t];
      const r = radios.find(x => x.value === label);
      if (r) { r.checked = true; syncSubject(); }
    };
    radios.forEach(r => r.addEventListener("change", syncSubject));
    cards.forEach(btn => btn.addEventListener("click", () => {
      selectTrack(btn.dataset.track);
      bookForm.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }));
    // Preselect from ?track=
    const q = new URLSearchParams(location.search).get("track");
    if (q && trackToLabel[q]) selectTrack(q);
    // Don't allow booking a day in the past
    const dateEl = bookForm.querySelector("[name=preferred_date]");
    if (dateEl) dateEl.min = new Date().toISOString().split("T")[0];
    syncSubject();
  }

  /* ---------- Contact form (Web3Forms → admin@stoneridgedigital.com) ---------- */
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = $("#contactStatus"), btn = $("#contactSubmit");
      const key = form.querySelector("[name=access_key]").value;
      if (!key || key.includes("YOUR_")) {
        status.style.color = "var(--copper)";
        status.textContent = "⚠ Add your Web3Forms access key in the form to enable sending (see README).";
        return;
      }
      btn.disabled = true; const label = btn.textContent; btn.textContent = "Sending…";
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form)
        });
        const data = await res.json();
        if (data.success) {
          form.reset();
          status.style.color = "#79c081";
          status.textContent = "✓ Thank you — we've received it and will reply within one business day.";
        } else throw new Error(data.message || "Failed");
      } catch (err) {
        status.style.color = "var(--copper)";
        status.textContent = "Something went wrong. Please email admin@stoneridgedigital.com directly.";
      } finally { btn.disabled = false; btn.textContent = label; }
    });
  }

  /* ===================== FEATURE MODULES ===================== */

  /* ---------- Intro / preloader ---------- */
  const intro = $("#intro");
  if (intro) {
    const finish = () => intro.classList.add("done");
    if (reduce) { document.documentElement.classList.add("no-intro"); }
    else {
      window.addEventListener("load", () => setTimeout(finish, 1900));
      setTimeout(finish, 3200); // safety
      intro.addEventListener("click", finish);
    }
  }

  /* ---------- Rotating headline word ---------- */
  const rot = $("#rotWord");
  if (rot && !reduce) {
    const words = (rot.dataset.words || "").split("|").filter(Boolean);
    let i = 0;
    if (words.length) {
      setInterval(() => {
        i = (i + 1) % words.length;
        rot.style.transition = "opacity .3s, transform .3s";
        rot.style.opacity = "0"; rot.style.transform = "translateY(-8px)";
        setTimeout(() => {
          rot.textContent = words[i];
          rot.style.opacity = "1"; rot.style.transform = "none";
        }, 300);
      }, 2600);
    }
  }

  /* ---------- Hero parallax mountains ---------- */
  const mtns = $$(".hero-mtns .layer");
  if (mtns.length && window.matchMedia("(hover: hover)").matches && !reduce) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => {
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    });
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      mtns.forEach(l => {
        const d = parseFloat(l.dataset.depth || 1);
        l.style.transform = `translate(${cx * d * 14}px, ${cy * d * 6}px)`;
      });
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Live Growth Dashboard ---------- */
  const dash = $("#dash");
  if (dash) {
    const fmt = (v, money) => (money ? "$" : "") + Math.round(v).toLocaleString();
    // KPI count-up
    const countKpi = (el) => {
      const target = +el.dataset.target, money = el.dataset.money === "1";
      const t0 = performance.now(), dur = 1500;
      const setFinal = () => el.textContent = fmt(target, money);
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * e, money);
        if (p < 1) requestAnimationFrame(tick); else setFinal();
      };
      requestAnimationFrame(tick);
      setTimeout(setFinal, dur + 120);
    };
    // Live activity feed
    const events = [
      { i: "🎯", c: "#e0a86c", t: "New lead captured — Frisco Smiles" },
      { i: "▲", c: "#86d18f", t: 'Ranked #1 — "pediatric dentist frisco"' },
      { i: "★", c: "#e0a86c", t: "New 5-star review — Access To Health" },
      { i: "📞", c: "#86d18f", t: "Missed call auto-texted back" },
      { i: "🗓", c: "#e0a86c", t: "Appointment booked by AI receptionist" },
      { i: "↗", c: "#86d18f", t: "+38 visitors from Google today" },
      { i: "▶", c: "#e0a86c", t: "Reel published — 3.1k reach" },
      { i: "✉", c: "#86d18f", t: "Email campaign — 27% open rate" },
      { i: "🎯", c: "#e0a86c", t: "New lead captured — Capital ENT" },
      { i: "▲", c: "#86d18f", t: 'Ranked #2 — "foot doctor near me"' },
    ];
    const feed = $("#dashFeed");
    let ei = 0;
    const times = ["just now", "1m ago", "2m ago", "4m ago", "6m ago"];
    const pushEvent = () => {
      if (!feed) return;
      const e = events[ei % events.length]; ei++;
      const li = document.createElement("li");
      li.className = "df-item";
      li.innerHTML = `<span class="di" style="color:${e.c}">${e.i}</span><span>${e.t}</span><span class="dt">just now</span>`;
      feed.prepend(li);
      [...feed.children].forEach((c, k) => { const dt = c.querySelector(".dt"); if (dt && k > 0) dt.textContent = times[Math.min(k, times.length - 1)]; });
      while (feed.children.length > 5) feed.lastElementChild.remove();
    };
    // Periodic "live" KPI ticks
    let feedTimer, tickTimer;
    const kLeads = $("#kLeads"), kRev = $("#kRev"), kCalls = $("#kCalls");
    const liveTick = () => {
      if (!kLeads) return;
      kLeads.textContent = fmt((+kLeads.textContent.replace(/[^0-9]/g, "") || 128) + 1);
      kCalls.textContent = fmt((+kCalls.textContent.replace(/[^0-9]/g, "") || 96) + (Math.random() > 0.6 ? 1 : 0));
      kRev.textContent = fmt((+kRev.textContent.replace(/[^0-9]/g, "") || 184000) + 250 + Math.floor(Math.random() * 400), true);
    };
    const start = () => {
      dash.classList.add("in-view");
      // set chart bar heights in JS (robust across engines)
      $$(".dc-bars span", dash).forEach(b => {
        const h = parseFloat(b.style.getPropertyValue("--h")) || 0;
        b.style.height = (h * 1.26).toFixed(1) + "px";
      });
      $$(".kpi-v", dash).forEach(countKpi);
      // seed a few feed items, then stream
      pushEvent(); pushEvent(); pushEvent();
      if (!reduce) {
        feedTimer = setInterval(pushEvent, 2800);
        tickTimer = setInterval(liveTick, 4200);
      }
    };
    if ("IntersectionObserver" in window && !reduce) {
      const dobs = new IntersectionObserver((ents) => {
        ents.forEach(en => { if (en.isIntersecting) { start(); dobs.unobserve(en.target); } });
      }, { threshold: 0.3 });
      dobs.observe(dash);
    } else { start(); }
  }

  /* ---------- Before / After slider ---------- */
  const ba = $("#ba");
  if (ba) {
    const before = ba.querySelector(".before"), divider = ba.querySelector(".divider"), handle = ba.querySelector(".handle");
    const setPos = (clientX) => {
      const r = ba.getBoundingClientRect();
      let pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      divider.style.left = pct + "%"; handle.style.left = pct + "%";
    };
    let dragging = false;
    const down = () => dragging = true;
    const up = () => dragging = false;
    const move = (e) => { if (!dragging) return; const x = e.touches ? e.touches[0].clientX : e.clientX; setPos(x); };
    ba.addEventListener("mousedown", (e) => { down(); setPos(e.clientX); });
    ba.addEventListener("touchstart", (e) => { down(); setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", up); window.addEventListener("touchend", up);
  }

  /* ---------- Growth chart draw on scroll ---------- */
  const chart = $("#growthChart");
  if (chart) {
    if ("IntersectionObserver" in window && !reduce) {
      const co = new IntersectionObserver((ents) => {
        ents.forEach(en => {
          if (en.isIntersecting) {
            chart.querySelectorAll(".chart-line, .chart-area").forEach(p => p.classList.add("draw"));
            co.unobserve(en.target);
          }
        });
      }, { threshold: 0.4 });
      co.observe(chart);
    } else {
      chart.querySelectorAll(".chart-line, .chart-area").forEach(p => p.classList.add("draw"));
    }
  }

  /* ---------- Testimonial carousel ---------- */
  const carousel = $("#carousel");
  if (carousel) {
    const slides = $$(".c-slide", carousel);
    const dotsWrap = $(".c-dots", carousel);
    let idx = 0, timer;
    slides.forEach((_, k) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Slide " + (k + 1));
      b.addEventListener("click", () => { go(k); rest(); });
      dotsWrap.appendChild(b);
    });
    const dots = $$("button", dotsWrap);
    const go = (n) => {
      idx = n;
      slides.forEach((s, k) => s.classList.toggle("active", k === n));
      dots.forEach((d, k) => d.classList.toggle("active", k === n));
    };
    const next = () => go((idx + 1) % slides.length);
    const rest = () => { clearInterval(timer); timer = setInterval(next, 6000); };
    go(0); if (!reduce) rest();
  }

  /* ---------- FAQ accordion ---------- */
  $$(".faq-item").forEach(item => {
    const q = $(".faq-q", item), a = $(".faq-a", item);
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      $$(".faq-item").forEach(it => { it.classList.remove("open"); $(".faq-a", it).style.maxHeight = null; });
      if (!open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ---------- Scroll parallax ([data-parallax]) ---------- */
  const paras = $$("[data-parallax]");
  if (paras.length && !reduce) {
    let ticking = false;
    const apply = () => {
      const vh = window.innerHeight;
      paras.forEach(p => {
        const speed = parseFloat(p.dataset.parallax) || 0.15;
        const r = p.getBoundingClientRect();
        const mid = r.top + r.height / 2 - vh / 2;
        p.style.transform = `translate3d(0, ${(mid * -speed).toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(apply); ticking = true; } }, { passive: true });
    apply();
  }

  /* ---------- Active nav link highlight ---------- */
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".nav-links a, .dd-menu a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("#")[0];
    if (href && href === here) a.classList.add("active");
  });

  /* ===================== CONVERSION + A11Y LAYER ===================== */
  const SITE = { phone: "972-313-5141", tel: "tel:9723135141", book: "book.html", email: "admin@stoneridgedigital.com" };

  /* ---------- Skip-to-content link ---------- */
  if (!$("#skip-link")) {
    const skip = document.createElement("a");
    skip.id = "skip-link"; skip.href = "#main"; skip.className = "skip-link"; skip.textContent = "Skip to content";
    document.body.prepend(skip);
    // mark a main landmark if none
    const main = document.querySelector("main") || document.querySelector("header.hero, .page-hero, header, section");
    if (main && !document.getElementById("main")) main.id = "main";
  }

  /* ---------- Header click-to-call ---------- */
  const navCta = $(".nav-cta");
  if (navCta && !$(".nav-call")) {
    const call = document.createElement("a");
    call.className = "nav-call"; call.href = SITE.tel; call.setAttribute("aria-label", "Call " + SITE.phone);
    call.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.4 2.1L8.1 9.9a16 16 0 006 6l1.5-1.2a2 2 0 012.1-.4c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/></svg><span>${SITE.phone}</span>`;
    navCta.insertBefore(call, navCta.firstChild);
  }

  /* ---------- Sticky mobile call/book bar ---------- */
  if (!$("#mbar")) {
    const bar = document.createElement("div");
    bar.id = "mbar"; bar.className = "mbar"; bar.setAttribute("aria-hidden", "false");
    bar.innerHTML = `<a href="${SITE.tel}" class="mbar-btn call"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.4 2.1L8.1 9.9a16 16 0 006 6l1.5-1.2a2 2 0 012.1-.4c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/></svg> Call</a><a href="${SITE.book}" class="mbar-btn book">Book a call</a>`;
    document.body.appendChild(bar);
    const toggleBar = () => bar.classList.toggle("show", window.scrollY > 500);
    window.addEventListener("scroll", toggleBar, { passive: true }); toggleBar();
  }

  /* ---------- Keyboard-accessible dropdown ---------- */
  $$(".nav-dd").forEach(dd => {
    const toggle = $(".dd-toggle", dd);
    if (!toggle) return;
    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");
    const open = (v) => { dd.classList.toggle("open", v); toggle.setAttribute("aria-expanded", v ? "true" : "false"); };
    dd.addEventListener("focusin", () => open(true));
    dd.addEventListener("focusout", (e) => { if (!dd.contains(e.relatedTarget)) open(false); });
    dd.addEventListener("keydown", (e) => { if (e.key === "Escape") { open(false); toggle.blur(); } });
  });

  /* ---------- Smart form fields (mobile keyboards + on-blur validation) ---------- */
  $$("form input, form textarea").forEach(f => {
    const name = (f.name || "").toLowerCase();
    if (f.type === "email" || name.includes("email")) { f.setAttribute("inputmode", "email"); f.setAttribute("autocomplete", "email"); f.setAttribute("autocapitalize", "off"); }
    if (name.includes("phone") || f.type === "tel") { f.type = "tel"; f.setAttribute("inputmode", "tel"); f.setAttribute("autocomplete", "tel"); }
    if (name === "name") f.setAttribute("autocomplete", "name");
    if (name.includes("business") || name.includes("company")) f.setAttribute("autocomplete", "organization");
    if (name.includes("website") || name.includes("url") || name.includes("links")) { f.setAttribute("inputmode", "url"); f.setAttribute("autocapitalize", "off"); }
    // on-blur validation
    f.addEventListener("blur", () => {
      if (!f.value.trim()) { f.classList.remove("valid", "invalid"); return; }
      const ok = f.checkValidity();
      f.classList.toggle("valid", ok); f.classList.toggle("invalid", !ok);
    });
    f.addEventListener("input", () => { if (f.classList.contains("invalid") && f.checkValidity()) { f.classList.remove("invalid"); f.classList.add("valid"); } });
  });
})();
