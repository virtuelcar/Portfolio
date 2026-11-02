(function () {
  "use strict";
  var LANG = document.documentElement.lang === "en" ? "en" : "fr";
  var WEBHOOK = window.AGENT_WEBHOOK_URL || "";
  var LOCALE = LANG === "fr" ? "fr-CH" : "en-GB";

  var T = {
    fr: {
      c: " : ",
      steps: ["Lecture des exports", "Calcul des KPI par le code", "Rédaction de la note par Claude", "Contrôle de la note"],
      run: "Lancer l'analyse", running: "Analyse en cours…", again: "Relancer l'analyse",
      ads: "Publicité", spend: "Dépenses", impressions: "Impressions", clicks: "Clics",
      sources: "Sources", raw: "Voir les données brutes (JSON)", channel: "Canal",
      site: "Site (GA4)", email: "Emailing", crm: "CRM", sessions: "sessions", sent: "envois", leads: "leads",
      kpiTitle: "Les chiffres du mois", signalsTitle: "Détecté par le code", noteTitle: "La note de l'agent",
      signalsHint: "Variations repérées par des règles, avant toute IA. Claude part de cette liste.",
      vsPrev: "vs mois précédent", over3: "sur 3 mois",
      totalSpend: "Dépenses publicitaires", costPer: "Coût par conversion", roas: "ROAS", closeRate: "Taux de vente CRM",
      tabs: ["Email", "Slack", "Google Docs"],
      hello: "Bonjour,", wins: "Ce qui fonctionne", alerts: "À surveiller", recos: "Recommandations", check: "À vérifier avant d'agir",
      why: "Pourquoi", impact: "Impact attendu", effort: "Effort", effortV: { low: "faible", medium: "moyen", high: "élevé" },
      sevV: { high: "priorité haute", medium: "à suivre" },
      from: "De", to: "À", subject: "Objet", agentName: "Agent analyste marketing", toName: "Direction marketing",
      sign: "L'agent analyste · note générée automatiquement, à valider avant toute décision.",
      period: "Période", channelTable: "Publicité, détail du dernier mois",
      metaLive: function (m) { return "Note rédigée par " + m.model + " en " + fmtNum(m.duration_ms / 1000, 1) + " s · " + fmtNum((m.input_tokens || 0) + (m.output_tokens || 0), 0) + " tokens."; },
      metaFixture: "Exemple de note : l'agent n'est pas encore branché sur cette page. Les chiffres et les variations ci-dessus sont, eux, calculés en direct.",
      offline: "L'agent n'est pas encore branché sur cette page. Les KPI ci-dessus sont calculés en direct ; la note de Claude sera disponible très bientôt.",
      errors: { daily_quota: "La démo a atteint son quota du jour. Revenez demain, ou contactez-moi pour une démonstration.", visitor_quota: "Vous avez atteint le nombre d'analyses prévu par visiteur aujourd'hui. Merci de votre intérêt !", unknown_dataset: "Entreprise inconnue.", model_error: "Claude n'a pas pu rédiger la note cette fois. L'agent préfère le signaler plutôt que d'inventer : réessayez dans un instant.", network: "Impossible de joindre l'agent. Vérifiez votre connexion et réessayez." },
      metrics: { roas: "ROAS", cost_per_conversion: "coût par conversion", ctr_pct: "CTR", frequency: "fréquence", qualification_rate_pct: "taux de qualification", cost_per_qualified: "coût par lead qualifié", click_rate_pct: "taux de clic", conv_per_1000_sent: "conversions pour 1 000 envois", conv_rate_pct: "taux de conversion", conv_rate_mobile_pct: "conversion mobile", conv_rate_desktop_pct: "conversion ordinateur", contacted_48h_pct: "leads rappelés sous 48 h", close_rate_pct: "taux de vente", leads: "leads", sales: "ventes" },
      scopes: { "Total paid": "Publicité, total", "Email": "Emailing", "Site": "Site", "CRM": "CRM" }
    },
    en: {
      c: ": ",
      steps: ["Reading the exports", "Computing the KPIs in code", "Claude writes the note", "Checking the note"],
      run: "Run the analysis", running: "Analysing…", again: "Run it again",
      ads: "Advertising", spend: "Spend", impressions: "Impressions", clicks: "Clicks",
      sources: "Sources", raw: "See the raw data (JSON)", channel: "Channel",
      site: "Website (GA4)", email: "Email", crm: "CRM", sessions: "sessions", sent: "sends", leads: "leads",
      kpiTitle: "This month's figures", signalsTitle: "Detected by code", noteTitle: "The agent's note",
      signalsHint: "Changes flagged by rules, before any AI. Claude starts from this list.",
      vsPrev: "vs previous month", over3: "over 3 months",
      totalSpend: "Ad spend", costPer: "Cost per conversion", roas: "ROAS", closeRate: "CRM close rate",
      tabs: ["Email", "Slack", "Google Docs"],
      hello: "Hello,", wins: "What works", alerts: "To watch", recos: "Recommendations", check: "Check before acting",
      why: "Why", impact: "Expected impact", effort: "Effort", effortV: { low: "low", medium: "medium", high: "high" },
      sevV: { high: "high priority", medium: "to watch" },
      from: "From", to: "To", subject: "Subject", agentName: "Marketing analyst agent", toName: "Marketing leadership",
      sign: "The analyst agent · automatically generated note, to be validated before any decision.",
      period: "Period", channelTable: "Advertising, last month in detail",
      metaLive: function (m) { return "Note written by " + m.model + " in " + fmtNum(m.duration_ms / 1000, 1) + " s · " + fmtNum((m.input_tokens || 0) + (m.output_tokens || 0), 0) + " tokens."; },
      metaFixture: "Example note: the agent is not connected to this page yet. The figures and changes above are computed live.",
      offline: "The agent is not connected to this page yet. The KPIs above are computed live; Claude's note will be available very soon.",
      errors: { daily_quota: "The demo has reached today's limit. Come back tomorrow, or contact me for a walkthrough.", visitor_quota: "You have reached today's number of analyses per visitor. Thanks for your interest!", unknown_dataset: "Unknown company.", model_error: "Claude could not write the note this time. The agent would rather say so than make things up: please try again in a moment.", network: "Could not reach the agent. Check your connection and try again." },
      metrics: { roas: "ROAS", cost_per_conversion: "cost per conversion", ctr_pct: "CTR", frequency: "frequency", qualification_rate_pct: "qualification rate", cost_per_qualified: "cost per qualified lead", click_rate_pct: "click rate", conv_per_1000_sent: "conversions per 1,000 sends", conv_rate_pct: "conversion rate", conv_rate_mobile_pct: "mobile conversion", conv_rate_desktop_pct: "desktop conversion", contacted_48h_pct: "leads called back within 48 h", close_rate_pct: "close rate", leads: "leads", sales: "sales" },
      scopes: { "Total paid": "Advertising, total", "Email": "Email", "Site": "Website", "CRM": "CRM" }
    }
  }[LANG];

  // ── formatting ──
  function esc(s) { s = String(s == null ? "" : s); if (LANG === "fr") s = s.replace(/ ([:;!?%»])/g, "\u00a0$1").replace(/« /g, "«\u00a0"); return s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmtNum(v, d) { if (v == null) return "–"; return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }).format(v); }
  function fmtMoney(v, d) { if (v == null) return "–"; var n = fmtNum(v, d); return LANG === "fr" ? n + " CHF" : "CHF " + n; }
  function fmtPct(v) { if (v == null) return "–"; return LANG === "fr" ? fmtNum(v, 2) + " %" : fmtNum(v, 2) + "%"; }
  function fmtDelta(v) { if (v == null) return ""; var s = (v > 0 ? "+" : v < 0 ? "−" : "") + fmtNum(Math.abs(v), 1); return LANG === "fr" ? s + " %" : s + "%"; }
  function fmtMetric(key, v) {
    if (/_pct$/.test(key)) return fmtPct(v);
    if (/^cost/.test(key) || key === "spend") return fmtMoney(v, 2);
    if (key === "roas" || key === "frequency" || key === "conv_per_1000_sent") return fmtNum(v, 2);
    return fmtNum(v, 0);
  }
  function monthName(m) { var p = m.split("-"); return new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric" }).format(new Date(+p[0], +p[1] - 1, 1)); }
  function changeOf(a, b) { return a ? Math.round((b - a) / a * 1000) / 10 : null; }

  // ── state ──
  var DATA = null, current = null;
  var $ = function (id) { return document.getElementById(id); };

  fetch("agent/demo-data.json").then(function (r) { return r.json(); }).then(function (d) {
    DATA = d; renderCompanies(); select("ecommerce");
  });

  function renderCompanies() {
    $("companies").innerHTML = Object.keys(DATA).map(function (k) {
      var ds = DATA[k];
      return '<button type="button" role="radio" class="company" data-k="' + k + '" aria-checked="false">' +
        '<span class="label">' + esc(ds.sector[LANG]) + '</span><span class="cname">' + esc(ds.name) + '</span>' +
        '<span class="cpitch">' + esc(ds.pitch[LANG]) + '</span><span class="ccity">' + esc(ds.city) + '</span></button>';
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll(".company"), function (b) {
      b.addEventListener("click", function () { select(b.dataset.k); });
    });
  }

  function select(k) {
    current = k;
    Array.prototype.forEach.call(document.querySelectorAll(".company"), function (b) { b.setAttribute("aria-checked", b.dataset.k === k ? "true" : "false"); });
    renderPreview(DATA[k]);
    $("result").hidden = true; $("progress").hidden = true; $("error").hidden = true;
    $("run").textContent = T.run;
  }

  function renderPreview(ds) {
    var months = ds.ads.map(function (r) { return r.month; }).filter(function (m, i, a) { return a.indexOf(m) === i; }).sort();
    var last = months[months.length - 1];
    var rows = ds.ads.filter(function (r) { return r.month === last; });
    var hasRev = rows.some(function (r) { return r.revenue != null; });
    var sources = rows.map(function (r) { return r.channel.split(" · ")[0]; }).concat(["GA4", T.email]).concat(ds.crm ? [T.crm] : []);
    var site = ds.site.filter(function (r) { return r.month === last; })[0];
    var em = ds.email.filter(function (r) { return r.month === last; })[0];
    var crm = ds.crm ? ds.crm.filter(function (r) { return r.month === last; })[0] : null;
    var html = '<p class="sources"><span class="label">' + T.sources + '</span>' + sources.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join("") +
      '<span class="period">' + T.period + T.c + esc(monthName(months[0])) + ' – ' + esc(monthName(last)) + '</span></p>';
    html += '<div class="table-wrap"><table><caption>' + T.ads + ', ' + esc(monthName(last)) + '</caption><thead><tr><th scope="col">' + T.channel + '</th><th scope="col">' + T.spend + '</th><th scope="col">' + T.impressions + '</th><th scope="col">' + T.clicks + '</th><th scope="col">' + esc(cap(ds.labels.conversions[LANG])) + '</th>' + (hasRev ? '<th scope="col">' + esc(cap(ds.labels.revenue[LANG])) + '</th>' : '') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + esc(r.channel) + '</th><td>' + fmtMoney(r.spend) + '</td><td>' + fmtNum(r.impressions) + '</td><td>' + fmtNum(r.clicks) + '</td><td>' + fmtNum(r.conversions) + '</td>' + (hasRev ? '<td>' + fmtMoney(r.revenue) + '</td>' : '') + '</tr>'; }).join("") +
      '</tbody></table></div>';
    html += '<p class="also">' + T.site + T.c + fmtNum(site.sessions) + ' ' + T.sessions + ' · ' + T.email + T.c + fmtNum(em.sent) + ' ' + T.sent + (crm ? ' · ' + T.crm + T.c + fmtNum(crm.leads) + ' ' + T.leads : '') + '</p>';
    html += '<details class="raw"><summary>' + T.raw + '</summary><pre>' + esc(JSON.stringify({ ads: ds.ads, email: ds.email, site: ds.site, crm: ds.crm }, null, 1)) + '</pre></details>';
    $("preview").innerHTML = html;
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ── run ──
  var busy = false;
  $("run").addEventListener("click", function () { if (!busy && DATA) run(); });

  function setStep(i, state) {
    var li = $("progress").children[i]; if (!li) return;
    li.className = state;
  }

  function run() {
    busy = true;
    var btn = $("run"); btn.disabled = true; btn.textContent = T.running;
    $("error").hidden = true; $("result").hidden = true;
    var p = $("progress"); p.hidden = false;
    p.innerHTML = T.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
    var ds = DATA[current], t0 = performance.now();

    setStep(0, "active");
    var request = WEBHOOK ? fetch(WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dataset: current, lang: LANG }) })
      .then(function (r) { return r.json(); }) : null;

    var kpis;
    wait(500).then(function () {
      setStep(0, "done"); setStep(1, "active");
      kpis = computeKpis(ds);
      return wait(600);
    }).then(function () {
      setStep(1, "done"); setStep(2, "active");
      if (request) return request;
      return wait(1800).then(function () {
        var fx = window.AGENT_FIXTURE && window.AGENT_FIXTURE[current] && window.AGENT_FIXTURE[current][LANG];
        return { ok: true, kpis: kpis, note: fx || null, fixture: true };
      });
    }).then(function (res) {
      if (!res || !res.ok) throw new Error((res && res.error) || "model_error");
      setStep(2, "done"); setStep(3, "active");
      return wait(350).then(function () { setStep(3, "done"); render(ds, res.kpis || kpis, res); });
    }).catch(function (e) {
      var code = e && e.message && T.errors[e.message] ? e.message : "network";
      Array.prototype.forEach.call(p.children, function (li) { if (li.className === "active") li.className = "failed"; });
      var el = $("error"); el.textContent = T.errors[code]; el.hidden = false;
    }).then(function () {
      busy = false; btn.disabled = false; btn.textContent = T.again;
    });
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // ── render result ──
  function render(ds, k, res) {
    var last = k.period.last, prev = k.period.previous;
    var tot = k.totals[last], totP = k.totals[prev];
    var tiles = [
      { l: T.totalSpend, v: fmtMoney(tot.spend), d: changeOf(totP.spend, tot.spend), good: 0 },
      { l: cap(ds.labels.conversions[LANG]), v: fmtNum(tot.conversions), d: changeOf(totP.conversions, tot.conversions), good: 1 },
      { l: T.costPer, v: fmtMoney(tot.cost_per_conversion, 2), d: changeOf(totP.cost_per_conversion, tot.cost_per_conversion), good: -1 }
    ];
    if (tot.roas != null) tiles.push({ l: T.roas, v: fmtNum(tot.roas, 2), d: changeOf(totP.roas, tot.roas), good: 1 });
    else if (k.crm) tiles.push({ l: T.closeRate, v: fmtPct(k.crm[last].close_rate_pct), d: changeOf(k.crm[prev].close_rate_pct, k.crm[last].close_rate_pct), good: 1 });

    var html = '<div class="res-block"><div class="res-head"><h3>' + T.kpiTitle + '</h3><span class="label">' + esc(monthName(last)) + ' · ' + T.vsPrev + '</span></div><div class="tiles">' +
      tiles.map(function (t) {
        var cls = t.d == null || t.good === 0 ? "" : (t.d * t.good > 0 ? "up" : t.d * t.good < 0 ? "down" : "");
        return '<div class="tile"><div class="tl">' + esc(t.l) + '</div><div class="tv">' + t.v + '</div><div class="td ' + cls + '">' + fmtDelta(t.d) + '</div></div>';
      }).join("") + '</div></div>';

    var sig = k.signals.slice().sort(function (a, b) {
      return Math.abs(b.change_3m_pct == null ? b.change_1m_pct : b.change_3m_pct) - Math.abs(a.change_3m_pct == null ? a.change_1m_pct : a.change_3m_pct);
    }).slice(0, 6);
    html += '<div class="res-block"><div class="res-head"><h3>' + T.signalsTitle + '</h3><span class="label">' + T.signalsHint + '</span></div><ul class="signals">' +
      sig.map(function (s) {
        var c = s.change_3m_pct != null ? s.change_3m_pct : s.change_1m_pct;
        return '<li class="' + s.assessment + '"><span class="sdot" aria-hidden="true"></span><span class="sscope">' + esc(T.scopes[s.scope] || s.scope) + '</span><span class="smetric">' + esc(T.metrics[s.metric] || s.metric) + '</span><span class="sval">' + fmtMetric(s.metric, s.from) + ' → <b>' + fmtMetric(s.metric, s.to) + '</b></span><span class="sdelta">' + fmtDelta(c) + (s.change_3m_pct != null ? ' ' + T.over3 : '') + '</span></li>';
      }).join("") + '</ul></div>';

    html += '<div class="res-block"><div class="res-head"><h3>' + T.noteTitle + '</h3></div>';
    if (res.note) {
      html += '<div class="tabs" role="tablist">' + T.tabs.map(function (t, i) { return '<button type="button" role="tab" id="tab-' + i + '" aria-controls="pane-' + i + '" aria-selected="' + (i === 0) + '">' + t + '</button>'; }).join("") + '</div>';
      html += '<div class="pane" role="tabpanel" id="pane-0" aria-labelledby="tab-0">' + emailView(ds, k, res.note) + '</div>';
      html += '<div class="pane" role="tabpanel" id="pane-1" aria-labelledby="tab-1" hidden>' + slackView(ds, k, res.note) + '</div>';
      html += '<div class="pane" role="tabpanel" id="pane-2" aria-labelledby="tab-2" hidden>' + docView(ds, k, res.note) + '</div>';
      html += '<p class="meta">' + esc(res.fixture ? T.metaFixture : T.metaLive(res.meta)) + '</p>';
    } else {
      html += '<p class="meta">' + esc(T.offline) + '</p>';
    }
    html += '</div>';

    var box = $("result"); box.innerHTML = html; box.hidden = false;
    Array.prototype.forEach.call(box.querySelectorAll('[role="tab"]'), function (tab, i, all) {
      tab.addEventListener("click", function () {
        Array.prototype.forEach.call(all, function (t, j) { t.setAttribute("aria-selected", i === j); $("pane-" + j).hidden = i !== j; });
      });
    });
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function recoList(n) {
    return '<ol class="recos">' + n.recommendations.map(function (r) {
      return '<li><strong>' + esc(r.action) + '</strong><p><span>' + T.why + T.c.replace(/ $/, '') + '</span> ' + esc(r.rationale) + '</p><p><span>' + T.impact + T.c.replace(/ $/, '') + '</span> ' + esc(r.expected_impact) + '</p><p class="eff">' + T.effort + ' ' + esc(T.effortV[r.effort] || r.effort) + '</p></li>';
    }).join("") + '</ol>';
  }
  function bullets(list, alert) {
    if (!list || !list.length) return "";
    return '<ul class="nl">' + list.map(function (w) { return '<li><b class="fig">' + esc(w.figure) + '</b> ' + esc(w.text) + (alert && w.severity ? ' <em class="sev ' + esc(w.severity) + '">' + esc(T.sevV[w.severity] || w.severity) + '</em>' : '') + '</li>'; }).join("") + '</ul>';
  }

  function emailView(ds, k, n) {
    return '<div class="mock email"><dl class="mhead"><div><dt>' + T.from + '</dt><dd>' + T.agentName + '</dd></div><div><dt>' + T.to + '</dt><dd>' + T.toName + ', ' + esc(ds.name) + '</dd></div><div><dt>' + T.subject + '</dt><dd><b>' + esc(n.title) + '</b></dd></div></dl>' +
      '<div class="mbody"><p>' + T.hello + '</p><p>' + esc(n.summary) + '</p>' +
      (n.wins.length ? '<h4>' + T.wins + '</h4>' + bullets(n.wins) : '') +
      (n.alerts.length ? '<h4>' + T.alerts + '</h4>' + bullets(n.alerts, true) : '') +
      '<h4>' + T.recos + '</h4>' + recoList(n) +
      '<h4>' + T.check + '</h4><p>' + esc(n.human_check) + '</p><p class="sign">' + T.sign + '</p></div></div>';
  }

  function slackView(ds, k, n) {
    var time = new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit" }).format(new Date());
    return '<div class="mock slack"><div class="schan"># marketing-performance</div><div class="smsg"><div class="avatar" aria-hidden="true">KA</div><div class="scontent">' +
      '<div class="sname"><b>' + T.agentName + '</b> <span class="app">APP</span> <span class="stime">' + time + '</span></div>' +
      '<p><b>' + esc(n.title) + '</b></p><p>' + esc(n.summary) + '</p>' +
      (n.wins.length ? '<p class="sh">✅ ' + T.wins + '</p><ul>' + n.wins.map(function (w) { return '<li><b>' + esc(w.figure) + '</b> · ' + esc(w.text) + '</li>'; }).join("") + '</ul>' : '') +
      (n.alerts.length ? '<p class="sh">⚠️ ' + T.alerts + '</p><ul>' + n.alerts.map(function (w) { return '<li><b>' + esc(w.figure) + '</b> · ' + esc(w.text) + '</li>'; }).join("") + '</ul>' : '') +
      '<p class="sh">👉 ' + T.recos + '</p><ol>' + n.recommendations.map(function (r) { return '<li><b>' + esc(r.action) + '</b><br>' + esc(r.rationale) + '</li>'; }).join("") + '</ol>' +
      '<p class="sctx">🔎 ' + esc(n.human_check) + '</p></div></div></div>';
  }

  function docView(ds, k, n) {
    var last = k.period.last;
    var hasRoas = k.paid.some(function (p) { return p.months[last].roas != null; });
    var table = '<table class="dtable"><thead><tr><th>' + T.channel + '</th><th>' + T.spend + '</th><th>' + esc(cap(ds.labels.conversions[LANG])) + '</th><th>' + T.costPer + '</th>' + (hasRoas ? '<th>ROAS</th>' : '') + '</tr></thead><tbody>' +
      k.paid.map(function (p) { var m = p.months[last]; return '<tr><td>' + esc(p.channel) + '</td><td>' + fmtMoney(m.spend) + '</td><td>' + fmtNum(m.conversions) + '</td><td>' + fmtMoney(m.cost_per_conversion, 2) + '</td>' + (hasRoas ? '<td>' + fmtNum(m.roas, 2) + '</td>' : '') + '</tr>'; }).join("") +
      '</tbody></table>';
    return '<div class="mock doc"><div class="dbar"><span class="dicon" aria-hidden="true"></span>' + esc(n.title) + '</div><div class="dpage">' +
      '<h1>' + esc(n.title) + '</h1><p class="dmeta">' + esc(ds.name) + ' · ' + esc(monthName(k.period.first)) + ' – ' + esc(monthName(last)) + '</p>' +
      '<p>' + esc(n.summary) + '</p><h2>' + T.channelTable + '</h2><div class="table-wrap">' + table + '</div>' +
      (n.wins.length ? '<h2>' + T.wins + '</h2>' + bullets(n.wins) : '') +
      (n.alerts.length ? '<h2>' + T.alerts + '</h2>' + bullets(n.alerts, true) : '') +
      '<h2>' + T.recos + '</h2>' + recoList(n) + '<h2>' + T.check + '</h2><p>' + esc(n.human_check) + '</p></div></div>';
  }
})();
