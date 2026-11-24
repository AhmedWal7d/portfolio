(function () {
  "use strict";
  var body = document.body;

  // Loading page text
  var t = document.createElement("div");
  t.id = "ld-text";
  t.textContent = "Ahmed Walid";
  body.appendChild(t);
  var done = false;
  function hideLoader() {
    if (done) return;
    done = true;
    body.classList.add("is-loaded");
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 1200);
  }
  var minShow = Date.now() + 700;
  function finish() { setTimeout(hideLoader, Math.max(0, minShow - Date.now())); }
  if (document.readyState === "complete") finish();
  else window.addEventListener("load", finish);
  setTimeout(hideLoader, 3500);

  // Scroll progress bar
  var bar = document.createElement("div");
  bar.id = "scroll-progress";
  body.appendChild(bar);

  // Back-to-top button: new look with progress ring
  var btn = document.getElementById("myBtn");
  var C = 2 * Math.PI * 22;
  if (btn) {
    btn.innerHTML =
      '<svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)">' +
      '<circle class="ring-bg" cx="26" cy="26" r="22" fill="none" stroke-width="3"/>' +
      '<circle class="ring" cx="26" cy="26" r="22" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg>' +
      '<svg class="arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="position:relative"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    btn.setAttribute("aria-label", "Back to top");
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  var ring = btn && btn.querySelector(".ring");
  function onScroll() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, st / h) : 0;
    bar.style.width = (p * 100) + "%";
    if (btn) {
      btn.classList.toggle("show", st > 300);
      if (ring) ring.style.strokeDashoffset = C * (1 - p);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Floating dots in hero
  var home = document.getElementById("home");
  if (home) {
    ["d1", "d2", "d3", "d4"].forEach(function (c) {
      var d = document.createElement("span");
      d.className = "hero-dot " + c;
      home.appendChild(d);
    });
  }

  // Reveal fix: tall blocks (portfolio, skills) never hit the old 8% threshold -> blank cards.
  // Use threshold 0 and stagger children. Also a fallback so nothing stays hidden.
  var els = document.querySelectorAll(".reveal");
  els.forEach(function (el) {
    Array.prototype.forEach.call(el.children, function (c, i) { c.style.setProperty("--i", Math.min(i, 12)); });
  });
  function show(el) { el.classList.add("reveal-visible"); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(show);
  }
  setTimeout(function () { els.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) show(el);
  }); }, 1500);

  // Isotope relayout once images are in (thumbnails have fixed height, but be safe)
  window.addEventListener("load", function () {
    if (window.jQuery && jQuery.fn.isotope) {
      try { jQuery(".portfolio-container").isotope("layout"); } catch (e) {}
    }
  });
})();
