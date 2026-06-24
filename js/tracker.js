/* tracker.js — 30/60/90-day next-steps tracker with localStorage persistence */
(function () {
  "use strict";
  const mount = document.getElementById("tracker");
  if (!mount) return;

  const phases = [
    { id: "p30", label: "Eerste 30 dagen", color: "var(--s1)", title: "Ontdekken & selecteren",
      items: [
        ["Kies 3 kleine taken en probeer voor elk een andere AI-aanpak", "Houd simpel bij welke stijl per taak werkt."],
        ["Houd 1 week een mini-logboek bij", "Noteer per dag: taak, aanpak en resultaat (1–10)."],
        ["Maak 3 herbruikbare prompts van je beste logboek-notities", "Test elke prompt 2× en verfijn tot hij consistent oplevert."],
        ["Vergelijk 2 verschillende promptstijlen voor dezelfde taak", "Welke geeft consistent het beste resultaat?"],
        ["Kies op dag 30 jouw 1 meest veelbelovende use-case", "Weeg: kost het tijd? Complexiteit? Frequentie? Strategisch belang?"]
      ]
    },
    { id: "p60", label: "Dag 30–60", color: "var(--s3)", title: "Verdiepen & meten",
      items: [
        ["Bouw een vaste werkstroom rond je gekozen taak", "Input → verwerking → controle → output, consistent herhaalbaar."],
        ["Doe een voor- en nameting: 1 week zonder, 1 week met AI", "Wat is het verschil in tijd en kwaliteit?"],
        ["Stel een vaste instructieset in", "Documenteer achtergrond, toon en voorbeelden voor consistente output."],
        ["Experimenteer met 1 radicaal andere aanpak voor dezelfde taak", "Welke past beter bij jouw situatie en tijd?"],
        ["Beslis: blijf je zelf doen, of wordt het tijd voor een andere route?", "Kost het >2 uur/week en blijf je hangen? Dan is specialist een optie."]
      ]
    },
    { id: "p90", label: "Dag 60–90", color: "var(--s5)", title: "Bewijzen & vooruitkijken",
      items: [
        ["Reken uit wat je AI-werkstroom oplevert", "Bespaarde uren × uurtarief of kwaliteitsverbetering op 1 A4."],
        ["Automatiseer 1 handmatige stap in je werkstroom", "En controleer of de kwaliteit overeind blijft."],
        ["Scan 2 nieuwe taken en beoordeel ze", "Tijd, complexiteit, risico — zelf doen, aannemen of specialist?"],
        ["Plan 1 vast moment per maand (30 min) voor AI", "Test 1 nieuwe aanpak en evalueer je resultaten."],
        ["Maak je plan voor de volgende 90 dagen", "Welke taken, in welke volgorde, en welke route per taak?"]
      ]
    }
  ];

  const KEY = "5ai-tracker";
  let done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { done = {}; }

  const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>';

  function key(p, i) { return p + "-" + i; }

  function render() {
    let total = 0, doneCount = 0;
    let html = "";
    phases.forEach((p) => {
      let pDone = 0;
      const rows = p.items.map((it, i) => {
        const k = key(p.id, i); total++;
        const isDone = !!done[k];
        if (isDone) { doneCount++; pDone++; }
        return `<div class="task-item ${isDone ? "done" : ""}" data-key="${k}" role="button" tabindex="0" aria-pressed="${isDone}">
          <span class="checkbox">${check}</span>
          <span class="ti-text">${it[0]}<small>${it[1]}</small></span>
        </div>`;
      }).join("");
      html += `<div class="phase reveal">
        <div class="phase-head">
          <span class="pill" style="background:${p.color}">${p.label}</span>
          <h3>${p.title}</h3>
          <span class="pcount">${pDone}/${p.items.length}</span>
        </div>${rows}</div>`;
    });
    mount.innerHTML = html;

    const pct = total ? Math.round((doneCount / total) * 100) : 0;
    document.getElementById("track-fill").style.width = pct + "%";
    document.getElementById("track-pct").textContent = pct + "%";
    document.getElementById("track-sub").textContent = doneCount + " van " + total + " stappen afgerond";

    mount.querySelectorAll(".task-item").forEach((el) => {
      const toggle = () => {
        const k = el.dataset.key;
        done[k] = !done[k];
        localStorage.setItem(KEY, JSON.stringify(done));
        render();
      };
      el.addEventListener("click", toggle);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    });
    mount.querySelectorAll(".reveal").forEach((r) => r.classList.add("in"));
  }

  document.getElementById("track-reset")?.addEventListener("click", () => {
    done = {}; localStorage.removeItem(KEY); render(); showToast("Voortgang gereset");
  });

  render();
})();
