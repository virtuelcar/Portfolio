/* KPI engine for the marketing analyst agent.
   Pure function, no dependencies: the same code runs in the browser and in the n8n Code node.
   The numbers are computed here, never by the language model. */
function computeKpis(ds) {
  var months = [];
  function addMonth(m) { if (months.indexOf(m) < 0) months.push(m); }
  (ds.ads || []).forEach(function (r) { addMonth(r.month); });
  (ds.site || []).forEach(function (r) { addMonth(r.month); });
  months.sort();
  var last = months[months.length - 1], prev = months[months.length - 2], first = months[0];

  function div(a, b) { return b ? a / b : null; }
  function r2(x) { return x === null || x === undefined ? null : Math.round(x * 100) / 100; }
  function pct(x) { return x === null ? null : Math.round(x * 10000) / 100; } // ratio -> % with 2 decimals
  function change(a, b) { return a && b !== null && b !== undefined ? Math.round((b - a) / a * 1000) / 10 : null; }

  // Paid channels
  var channels = [];
  (ds.ads || []).forEach(function (r) { if (channels.indexOf(r.channel) < 0) channels.push(r.channel); });
  var paid = channels.map(function (ch) {
    var byMonth = {};
    (ds.ads || []).filter(function (r) { return r.channel === ch; }).forEach(function (r) {
      byMonth[r.month] = {
        spend: r.spend, impressions: r.impressions, clicks: r.clicks, conversions: r.conversions,
        revenue: r.revenue === undefined ? null : r.revenue,
        ctr_pct: pct(div(r.clicks, r.impressions)),
        cpc: r2(div(r.spend, r.clicks)),
        conv_rate_pct: pct(div(r.conversions, r.clicks)),
        cost_per_conversion: r2(div(r.spend, r.conversions)),
        roas: r.revenue === undefined ? null : r2(div(r.revenue, r.spend)),
        frequency: r.frequency === undefined ? null : r.frequency,
        qualified: r.qualified === undefined ? null : r.qualified,
        qualification_rate_pct: r.qualified === undefined ? null : pct(div(r.qualified, r.conversions)),
        cost_per_qualified: r.qualified === undefined ? null : r2(div(r.spend, r.qualified)),
        won: r.won === undefined ? null : r.won,
        cost_per_won: r.won === undefined || !r.won ? null : r2(div(r.spend, r.won))
      };
    });
    return { channel: ch, months: byMonth };
  });

  // Totals across paid channels
  var totals = {};
  months.forEach(function (m) {
    var t = { spend: 0, conversions: 0, revenue: 0, hasRevenue: false };
    (ds.ads || []).filter(function (r) { return r.month === m; }).forEach(function (r) {
      t.spend += r.spend; t.conversions += r.conversions;
      if (r.revenue !== undefined) { t.revenue += r.revenue; t.hasRevenue = true; }
    });
    totals[m] = {
      spend: t.spend, conversions: t.conversions,
      revenue: t.hasRevenue ? t.revenue : null,
      cost_per_conversion: r2(div(t.spend, t.conversions)),
      roas: t.hasRevenue ? r2(div(t.revenue, t.spend)) : null
    };
  });

  var email = {};
  (ds.email || []).forEach(function (r) {
    email[r.month] = {
      sent: r.sent, conversions: r.conversions, revenue: r.revenue === undefined ? null : r.revenue,
      open_rate_pct: pct(div(r.opened, r.sent)),
      click_rate_pct: pct(div(r.clicked, r.sent)),
      click_to_open_pct: pct(div(r.clicked, r.opened)),
      conv_per_1000_sent: r2(div(r.conversions * 1000, r.sent))
    };
  });

  var site = {};
  (ds.site || []).forEach(function (r) {
    var o = { sessions: r.sessions, conversions: r.conversions, conv_rate_pct: pct(div(r.conversions, r.sessions)) };
    if (r.sessions_mobile !== undefined) {
      o.mobile_share_pct = pct(div(r.sessions_mobile, r.sessions));
      o.conv_rate_mobile_pct = pct(div(r.conversions_mobile, r.sessions_mobile));
      o.conv_rate_desktop_pct = pct(div(r.conversions - r.conversions_mobile, r.sessions - r.sessions_mobile));
    }
    site[r.month] = o;
  });

  var crm = null;
  if (ds.crm) {
    crm = {};
    ds.crm.forEach(function (r) {
      crm[r.month] = {
        leads: r.leads, sales: r.sales, revenue: r.revenue,
        contacted_48h_pct: pct(div(r.contacted_48h, r.leads)),
        test_drive_rate_pct: pct(div(r.test_drives, r.leads)),
        close_rate_pct: pct(div(r.sales, r.leads))
      };
    });
  }

  // Signals: notable moves, detected by rules (not by the model)
  // dir: +1 when a rise is good, -1 when a rise is bad
  var signals = [];
  function watch(scope, metric, series, dir, threshold) {
    if (!series[first] || !series[last]) return;
    var a = series[first][metric], p = series[prev] ? series[prev][metric] : null, b = series[last][metric];
    if (a === null || b === null || a === undefined || b === undefined) return;
    var c3 = change(a, b), c1 = p !== null ? change(p, b) : null;
    var base = c3 !== null ? c3 : c1;
    if (base === null) return;
    if (Math.abs(base) >= threshold || (c1 !== null && Math.abs(c1) >= threshold)) {
      signals.push({ scope: scope, metric: metric, from: a, previous: p, to: b,
        change_3m_pct: c3, change_1m_pct: c1, assessment: (base * dir) >= 0 ? "positive" : "negative" });
    }
  }
  paid.forEach(function (p) {
    watch(p.channel, "roas", p.months, 1, 15);
    watch(p.channel, "cost_per_conversion", p.months, -1, 15);
    watch(p.channel, "ctr_pct", p.months, 1, 20);
    watch(p.channel, "frequency", p.months, -1, 30);
    watch(p.channel, "qualification_rate_pct", p.months, 1, 15);
    watch(p.channel, "cost_per_qualified", p.months, -1, 15);
  });
  watch("Total paid", "roas", totals, 1, 10);
  watch("Total paid", "cost_per_conversion", totals, -1, 10);
  watch("Email", "click_rate_pct", email, 1, 15);
  watch("Email", "conv_per_1000_sent", email, 1, 15);
  watch("Site", "conv_rate_pct", site, 1, 10);
  watch("Site", "conv_rate_mobile_pct", site, 1, 15);
  watch("Site", "conv_rate_desktop_pct", site, 1, 15);
  if (crm) {
    watch("CRM", "contacted_48h_pct", crm, 1, 10);
    watch("CRM", "close_rate_pct", crm, 1, 15);
    watch("CRM", "leads", crm, 1, 15);
    watch("CRM", "sales", crm, 1, 15);
  }

  // Share of paid spend vs share of value in the last month
  var mix = paid.map(function (p) {
    var m = p.months[last], t = totals[last];
    return {
      channel: p.channel,
      spend_share_pct: pct(div(m.spend, t.spend)),
      conversions_share_pct: pct(div(m.conversions, t.conversions)),
      revenue_share_pct: t.revenue ? pct(div(m.revenue, t.revenue)) : null
    };
  });

  return {
    company: ds.name, currency: ds.currency || "CHF",
    conversion_label: ds.labels ? ds.labels.conversions : null,
    revenue_label: ds.labels ? ds.labels.revenue : null,
    period: { first: first, previous: prev, last: last, months: months },
    paid: paid, totals: totals, mix_last_month: mix,
    email: email, site: site, crm: crm, signals: signals
  };
}
if (typeof module !== "undefined") module.exports = { computeKpis: computeKpis };
