/* prompt-builder.js — interactive RACE prompt builder */
(function () {
  "use strict";
  const R = document.getElementById("race-r");
  const A = document.getElementById("race-a");
  const C = document.getElementById("race-c");
  const E = document.getElementById("race-e");
  const out = document.getElementById("prompt-out");
  if (!R || !out) return;

  const presets = {
    klantenservice: {
      r: "Je bent een klantenservice-expert, getraind om klantvragen professioneel en efficient te beantwoorden.",
      a: "Schrijf een vriendelijk antwoord op de veelgestelde klantvraag: 'Hoe duurzaam is jullie product?'",
      c: "Het gaat om herbruikbare waterflessen. Het doel is de klant te informeren en te overtuigen van de milieuvoordelen.",
      e: "Maximaal 50 woorden, vriendelijke en informatieve toon, eindig met een uitnodiging om te bestellen."
    },
    marketing: {
      r: "Je bent een ervaren copywriter gespecialiseerd in B2B-marketing.",
      a: "Schrijf 3 varianten van een LinkedIn-post die onze nieuwe dienst aankondigt.",
      c: "Doelgroep: MKB-ondernemers die AI willen inzetten. Toon: enthousiast maar zakelijk, geen jargon.",
      e: "Elke variant max. 120 woorden, met een pakkende openingszin en een duidelijke call-to-action."
    },
    analyse: {
      r: "Je bent een inkoopanalist verantwoordelijk voor het analyseren van orderbevestigingen.",
      a: "Analyseer de bijgevoegde orderbevestiging op korting en waarde: gemiddelde korting, top-3 hoogste spendregels en totale besparing.",
      c: "Je krijgt orderbevestigingen altijd in hetzelfde bijgevoegde format aangeleverd.",
      e: "Zet de uitkomsten in een gestructureerde tabel per onderdeel, met percentages en bedragen in euro's."
    },
    email: {
      r: "Je bent een professionele communicatieadviseur.",
      a: "Herschrijf onderstaande ruwe e-mail tot een heldere, beleefde en beknopte versie.",
      c: "De ontvanger is een belangrijke klant. We moesten een levering helaas met een week uitstellen.",
      e: "Behoud een excuus, geef de nieuwe datum, bied een kleine compensatie aan. Max. 150 woorden."
    }
  };

  function esc(s) {
    return s.replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }

  function render() {
    const r = R.value.trim(), a = A.value.trim(), c = C.value.trim(), e = E.value.trim();
    if (!r && !a && !c && !e) {
      out.innerHTML = '<span class="ph">Je opgebouwde prompt verschijnt hier zodra je de velden invult...\n\nKies hierboven een voorbeeld om snel te starten.</span>';
      return;
    }
    let html = "";
    html += r ? '<span class="r">' + esc(r) + '</span>\n\n' : '<span class="ph">[Rol - wie moet de AI zijn?]</span>\n\n';
    html += a ? '<span class="a">' + esc(a) + '</span>\n\n' : '<span class="ph">[Actie - wat moet de AI doen?]</span>\n\n';
    html += c ? '<span class="c">' + esc(c) + '</span>\n\n' : '<span class="ph">[Context - wat is de situatie?]</span>\n\n';
    html += e ? '<span class="e">' + esc(e) + '</span>' : '<span class="ph">[Einddoel - gewenste output, lengte, toon]</span>';
    out.innerHTML = html;
  }

  function plain() {
    return [R.value.trim(), A.value.trim(), C.value.trim(), E.value.trim()].filter(Boolean).join("\n\n");
  }

  [R, A, C, E].forEach(function (el) { el.addEventListener("input", render); });

  document.querySelectorAll(".preset").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const p = presets[btn.dataset.preset];
      if (!p) return;
      R.value = p.r; A.value = p.a; C.value = p.c; E.value = p.e;
      document.querySelectorAll(".preset").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      render();
    });
  });

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    showToast(ok ? "Prompt gekopieerd" : "Kopieren niet gelukt - selecteer handmatig");
  }

  const copyBtn = document.getElementById("copy-prompt");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    const text = plain();
    if (!text) { showToast("Vul eerst een veld in"); return; }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { showToast("Prompt gekopieerd"); },
        function () { fallbackCopy(text); }
      );
    } else { fallbackCopy(text); }
  });

  const clearBtn = document.getElementById("clear-prompt");
  if (clearBtn) clearBtn.addEventListener("click", function () {
    R.value = A.value = C.value = E.value = "";
    document.querySelectorAll(".preset").forEach(function (b) { b.classList.remove("active"); });
    render();
  });

  render();
})();
