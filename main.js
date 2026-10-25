/* Pulseboard landing page behaviour. Written by Ian Esquivel, 2026.
   No dependencies. Everything here is progressive: with JS off the page is complete. */
(function () {
  "use strict";
  var root = document.documentElement;
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches || /[?&]static\b/.test(location.search);
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  // 1. Top bar gets a solid background once you scroll past the top.
  var bar = document.querySelector(".topbar");
  function onScroll() { if (bar) bar.classList.toggle("is-solid", window.scrollY > 24); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // 2. Ticker: copy the row once so the CSS loop has no gap.
  $$(".ticker-row").forEach(function (row) {
    $$("span", row).forEach(function (s) { var c = s.cloneNode(true); c.setAttribute("aria-hidden", "true"); row.appendChild(c); });
  });

  // 3. Counters: animate the number in [data-to] from 0 when it comes into view.
  function runCounter(el) {
    var end = parseFloat(el.dataset.to), places = (el.dataset.to.split(".")[1] || "").length, unit = el.dataset.unit || "";
    if (calm) { el.textContent = end.toFixed(places) + unit; return; }
    var start = performance.now(), length = 1400;
    (function tick(now) {
      var t = Math.min(1, (now - start) / length), eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (end * eased).toFixed(places) + unit;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  // 4. Hash card: the stored value types itself out, then the IP is struck through.
  function runHash(card) {
    var out = card.querySelector(".hash-out"), finalText = out.dataset.value, chars = "0123456789abcdef";
    if (calm) { out.textContent = finalText; card.classList.add("is-done"); return; }
    if (card._busy) return; card._busy = true; card.classList.remove("is-done");
    var begin = performance.now() + 250, n = finalText.length;
    var id = setInterval(function () {
      var t = Math.min(1, Math.max(0, (performance.now() - begin) / 1200)), fixed = Math.floor(t * n), html = finalText.slice(0, fixed);
      for (var i = fixed; i < n; i++) html += '<span class="tmp">' + (i < fixed + 4 ? chars[Math.floor(Math.random() * 16)] : "·") + "</span>";
      out.innerHTML = html;
      if (t >= 1) { clearInterval(id); out.textContent = finalText; card.classList.add("is-done"); card._busy = false; }
    }, 45);
  }
  $$("[data-hash-card]").forEach(function (card) {
    card.classList.add("armed");
    if (matchMedia("(hover: hover)").matches) card.addEventListener("pointerenter", function () { runHash(card); });
  });

  // 5. Scroll-in animation. Skipped completely for reduced motion and ?static.
  if (calm) {
    $$("[data-to]").forEach(runCounter);
    $$("[data-hash-card]").forEach(runHash);
    return;
  }
  root.classList.add("anim");

  // Headlines marked [data-words] come in word by word.
  $$("[data-words]").forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", h.textContent.trim());
    h.innerHTML = words.map(function (w, i) { return '<span class="word" aria-hidden="true" style="--wait:' + (i * 0.06).toFixed(2) + 's">' + w + "</span>"; }).join(" ");
    h.setAttribute("data-in", "");
  });
  // Children of [data-in-group] get a small stagger.
  $$("[data-in-group]").forEach(function (g) {
    $$("[data-in]", g).forEach(function (el, i) { el.style.setProperty("--wait", (i * 0.08).toFixed(2) + "s"); });
  });
  $$("[data-in][data-wait]").forEach(function (el) { el.style.setProperty("--wait", el.dataset.wait + "s"); });

  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; seen.unobserve(el);
      el.classList.add("shown");
      $$("[data-to]", el).forEach(runCounter);
      if (el.hasAttribute("data-hash-card")) setTimeout(function () { runHash(el); }, 450);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });
  $$("[data-in]").forEach(function (el) { seen.observe(el); });

  // Safety net: if something never intersects (print, odd browsers), show it after 4 s.
  setTimeout(function () { $$("[data-in]:not(.shown)").forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add("shown"); }); }, 4000);

  // 6. Gentle parallax on the top hero art.
  var art = document.querySelector("[data-drift] img");
  if (art) {
    var queued = false;
    addEventListener("scroll", function () {
      if (queued) return; queued = true;
      requestAnimationFrame(function () { queued = false; var y = Math.min(window.scrollY, innerHeight); art.style.transform = "translateY(" + (y * 0.18).toFixed(1) + "px)"; });
    }, { passive: true });
  }
})();
