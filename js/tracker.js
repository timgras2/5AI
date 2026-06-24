/* tracker.js — 30/60/90-day next-steps tracker with localStorage persistence */
(function () {
  "use strict";
  const mount = document.getElementById("tracker");
  if (!mount) return;

  const phases = [
    { id: "p30", label: "Eerste 30 dagen", color: "var(--s1)", title: "Fundament leggen",
      items: [
        ["Kies één AI-assistent en gebruik die dagelijks", "ChatGPT, Claude of Gemini — pak er één en bouw routine op."],
        ["Selecteer 1 repetitieve taak om te verbeteren", "Denk aan e-mails, samenvattingen of productteksten."],
        ["Schrijf je eerste prompts met het RACE-framework", "Rol · Actie · Context · Einddoel."],
        ["Documenteer wat wel en niet werkt", "Houd een simpel logje bij van je beste prompts."],
        ["Maak een 'Project' of 'Agent' met vaste context", "Upload je tone-of-voice, voorbeelden en richtlijnen."]
      ]
    },
    { id: "p60", label: "Dag 30–60", color: "var(--s3)", title: "Uitbreiden & automatiseren",
      items: [
        ["Bouw een AI-keten van 2–3 stappen", "Laat de output van stap 1 de input van stap 2 zijn."],
        ["Doe de automatiseer-assessment op 3 taken", "Frequentie, complexiteit, risico en menselijk oordeel."],
        ["Probeer een automatiseringstool (Zapier of Make)", "Koppel je AI aan e-mail, agenda of een spreadsheet."],
        ["Betrek een collega en deel je beste workflow", "Adoptie groeit het snelst via concrete voorbeelden."],
        ["Reserveer een vast wekelijks 'AI-uurtje'", "Experimenteren wordt pas waardevol als het routine is."]
      ]
    },
    { id: "p90", label: "Dag 60–90", color: "var(--s5)", title: "Bouwen & meten",
      items: [
        ["Bouw één simpele tool met vibecoding", "Lovable, Bolt of Claude artifacts — begin klein."],
        ["Bepaal KPI's voor je belangrijkste use-case", "Tijdsbesparing, doorlooptijd, kwaliteit of klanttevredenheid."],
        ["Meet de nulmeting vs. de situatie met AI", "Cijfers maken waarde zichtbaar en overtuigen anderen."],
        ["Schrijf een mini-businesscase (1 A4)", "Probleem, oplossing, resultaat en vervolgstap."],
        ["Kies je volgende use-case en herhaal de cyclus", "Verkennen → Uitbreiden → Automatiseren → Bouwen → Meten."]
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
