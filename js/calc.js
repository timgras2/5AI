/* calc.js — Automatiseer-readiness calculator (Sessie 3)
   Gebaseerd op de 8 assessment-vragen uit de cursus. */
(function () {
  "use strict";
  const mount = document.getElementById("calc");
  if (!mount) return;

  const QUESTIONS = [
    { id: "freq", w: 2,   t: "Ik doe deze taak vaak (wekelijks of vaker)" },
    { id: "same", w: 2,   t: "De stappen zijn elke keer (bijna) hetzelfde" },
    { id: "expl", w: 2,   t: "Ik kan de stappen makkelijk stap-voor-stap uitleggen" },
    { id: "time", w: 1.5, t: "De taak is tijdrovend of saai" },
    { id: "out",  w: 1,   t: "Ik zou deze taak het liefst uitbesteden" },
    { id: "judg", w: 2,   t: "Menselijk oordeel is niet cruciaal voor deze taak" },
    { id: "risk", w: 1.5, t: "Het risico is klein als er een fout in sluipt" },
    { id: "done", w: 1,   t: "Het is duidelijk wanneer de taak goed is afgerond" }
  ];
  const MAX = QUESTIONS.reduce(function (s, q) { return s + q.w; }, 0); // 13

  const state = {};

  function result(score) {
    const pct = Math.round((score / MAX) * 100);
    if (score >= 9) return {
      pct: pct, color: "var(--s3)", level: "Sterke kandidaat",
      lvl: "Niveau 2–3",
      rec: "Uitstekend geschikt om te automatiseren. De taak is frequent, voorspelbaar en goed uit te leggen — precies wat een workflow of agent nodig heeft. Begin met een automation-tool (zoals Make of n8n) en bouw stap voor stap uit."
    };
    if (score >= 5) return {
      pct: pct, color: "var(--s4)", level: "Geschikt, met mens-in-de-loop",
      lvl: "Niveau 1–2",
      rec: "Een goede kandidaat met aandachtspunten. Automatiseer de voorspelbare stappen, maar bouw een controlemoment in waar menselijk oordeel of risico meespeelt. Start klein met een connector of een simpele AI-keten."
    };
    return {
      pct: pct, color: "var(--s5)", level: "Beter (nog) niet volledig automatiseren",
      lvl: "AI-ondersteuning",
      rec: "Volledige automatisering is nu risicovol of lastig: de taak varieert, vraagt oordeel, of de gevolgen van een fout zijn groot. Gebruik AI vooral als hulpmiddel (concept, analyse, suggestie) en houd de mens aan het stuur."
    };
  }

  function render() {
    let score = 0;
    QUESTIONS.forEach(function (q) { if (state[q.id]) score += q.w; });
    const r = result(score);

    const rows = QUESTIONS.map(function (q) {
      const on = !!state[q.id];
      return '<button class="calc-q ' + (on ? "on" : "") + '" data-id="' + q.id + '" aria-pressed="' + on + '">' +
        '<span class="calc-check">' + (on ?
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>' : "") +
        '</span><span>' + q.t + '</span></button>';
    }).join("");

    mount.innerHTML =
      '<div class="calc-grid">' +
        '<div class="calc-questions">' + rows + '</div>' +
        '<div class="calc-result">' +
          '<div class="calc-score-num" style="color:' + r.color + '">' + r.pct + '%</div>' +
          '<div class="calc-bar"><div class="calc-fill" style="width:' + r.pct + '%;background:' + r.color + '"></div></div>' +
          '<div class="calc-level" style="background:' + r.color + '">' + r.level + ' · ' + r.lvl + '</div>' +
          '<p class="calc-rec">' + r.rec + '</p>' +
          '<a class="btn btn-ghost" href="tools.html#explorer" style="margin-top:6px">Bekijk passende tools →</a>' +
        '</div>' +
      '</div>';

    mount.querySelectorAll(".calc-q").forEach(function (b) {
      b.addEventListener("click", function () {
        state[b.dataset.id] = !state[b.dataset.id];
        render();
      });
    });
  }

  render();
})();
