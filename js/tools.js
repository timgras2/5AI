/* tools.js — interactive tool explorer: filter, search, sort, expandable detail */
(function () {
  "use strict";
  const grid = document.getElementById("tool-grid");
  if (!grid) return;

  let tools = [];
  let state = { cat: "alle", level: "alle", q: "", sort: "default" };

  const lvlClass = { 1: "lvl-1", 2: "lvl-2", 3: "lvl-3", 4: "lvl-4" };
  const lvlText = { 1: "Instap", 2: "Gemiddeld", 3: "Gevorderd", 4: "Technisch" };
  const STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>';

  function stars(n) {
    let s = "";
    for (let i = 1; i <= 5; i++) s += '<span class="' + (i <= n ? "star-on" : "star-off") + '">' + STAR + '</span>';
    return '<span class="stars">' + s + '</span>';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function card(t) {
    const pros = (t.pros || []).map(function (p) { return '<li class="pro">' + esc(p) + '</li>'; }).join("");
    const cons = (t.cons || []).map(function (c) { return '<li class="con">' + esc(c) + '</li>'; }).join("");
    let detail = "";
    if (pros) detail += '<h5>Sterke punten</h5><ul>' + pros + '</ul>';
    if (cons) detail += '<h5>Aandachtspunten</h5><ul>' + cons + '</ul>';
    if (t.starter) {
      detail += '<h5>Starter-prompt</h5><div class="starter"><button class="starter-copy" data-copy="' + esc(t.starter) + '">Kopieer</button>' + esc(t.starter) + '</div>';
    }
    const more = detail
      ? '<button class="tool-more" type="button">Meer info <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="m6 9 6 6 6-6"/></svg></button>' +
        '<div class="tool-detail"><div class="tool-detail-inner">' + detail + '</div></div>'
      : "";
    return '<article class="tool reveal">' +
      '<div class="tool-h">' +
        '<span class="tool-name">' + t.name + '</span>' +
        '<span class="level-badge ' + lvlClass[t.level] + '">' + lvlText[t.level] + '</span>' +
      '</div>' +
      '<div class="cat">' + t.cat + '</div>' +
      '<div class="tool-rating">' +
        '<span class="rg">Gebruiksgemak ' + stars(t.ease || 3) + '</span>' +
        '<span class="rg">Kwaliteit ' + stars(t.quality || 3) + '</span>' +
      '</div>' +
      '<p class="desc">' + t.desc + '</p>' +
      more +
      '<div class="foot">' +
        '<span class="price">' + t.price + '</span>' +
        '<a class="link" href="' + t.url + '" target="_blank" rel="noopener">Bezoek ' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M7 17 17 7M9 7h8v8"/></svg>' +
        '</a>' +
      '</div>' +
    '</article>';
  }

  function apply() {
    let list = tools.filter(function (t) {
      if (state.cat !== "alle" && t.cat !== state.cat) return false;
      if (state.level !== "alle" && String(t.level) !== state.level) return false;
      if (state.q) {
        const hay = (t.name + " " + t.desc + " " + t.cat + " " + (t.pros || []).join(" ")).toLowerCase();
        if (!hay.includes(state.q.toLowerCase())) return false;
      }
      return true;
    });
    if (state.sort === "level") list.sort(function (a, b) { return a.level - b.level; });
    else if (state.sort === "rating") list.sort(function (a, b) { return (b.quality || 0) - (a.quality || 0); });
    else if (state.sort === "ease") list.sort(function (a, b) { return (b.ease || 0) - (a.ease || 0); });
    else if (state.sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });

    document.getElementById("tool-count").textContent =
      list.length + (list.length === 1 ? " tool" : " tools") + " gevonden";

    grid.innerHTML = list.length
      ? list.map(card).join("")
      : '<div class="empty">Geen tools gevonden. Pas je filters of zoekterm aan.</div>';
    requestAnimationFrame(function () {
      grid.querySelectorAll(".reveal").forEach(function (r) { r.classList.add("in"); });
    });
  }

  /* expand + copy via delegation (survives re-render) */
  grid.addEventListener("click", function (e) {
    const more = e.target.closest(".tool-more");
    if (more) { more.closest(".tool").classList.toggle("open"); return; }
    const copy = e.target.closest(".starter-copy");
    if (copy) {
      const text = copy.dataset.copy || "";
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { if (window.showToast) showToast("Starter-prompt gekopieerd"); },
          function () { fallbackCopy(text); }
        );
      } else fallbackCopy(text);
    }
  });
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    if (window.showToast) showToast(ok ? "Starter-prompt gekopieerd" : "Kopieren niet gelukt");
  }

  document.querySelectorAll("[data-filter-cat]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-filter-cat]").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active"); state.cat = b.dataset.filterCat; apply();
    });
  });
  document.querySelectorAll("[data-filter-level]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-filter-level]").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active"); state.level = b.dataset.filterLevel; apply();
    });
  });
  const search = document.getElementById("tool-search");
  if (search) search.addEventListener("input", function (e) { state.q = e.target.value; apply(); });
  const sort = document.getElementById("tool-sort");
  if (sort) sort.addEventListener("change", function (e) { state.sort = e.target.value; apply(); });

  function load(data) {
    tools = data.tools;
    const u = document.getElementById("tools-updated");
    if (u) u.textContent = data.updated;
    apply();
  }

  if (window.TOOLS_DATA) {
    load(window.TOOLS_DATA);
  } else {
    fetch("data/tools.json")
      .then(function (r) { return r.json(); })
      .then(load)
      .catch(function () { grid.innerHTML = '<div class="empty">Kon de tool-lijst niet laden.</div>'; });
  }
})();
