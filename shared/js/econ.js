/* Economic models, drawn the same way as SVG (questions, "shift the curve") and on canvas (explainers).
   Coordinates are 0–1 in both directions (quantity across, price up). Straight-line curves:
     down:  q = b − p        up:  q = p − b        vert: q = b        flat: p = b        ppf: quarter ellipse, radius b
   A shift s (−1, 0, +1) moves a curve left/right by D: +1 = right (more quantity at every price); a flat line moves down/up
   and the PPF in/out by DP.
   Model spec: { kind: 'sd' | 'taker' | 'two' | 'ppf', x, y (axis titles), curves: [{ id, kind, b, label, name, col, move }],
                 eq: { p: ['PL', 'PL1'], q: ['Y', 'Y1'] } (equilibrium labels), panels (for 'two'), gap: 'exports' | 'imports' } */
(function () {
  const P = window.NP;
  const E = (P.econ = {});
  const D = 0.17, DP = 0.12;
  // s = +1 always means "right" (more quantity at every price) or, for a flat line, "up".
  // An upward curve q = p − b moves right when b falls, so its offset is subtracted.
  const lineQ = (c, s) => {
    const b = c.b + (c.kind === 'flat' || c.kind === 'ppf' ? s * DP : c.kind === 'up' ? -s * D : s * D);
    if (c.kind === 'down') return { kind: 'down', q: (p) => b - p, p: (q) => b - q, b };
    if (c.kind === 'up') return { kind: 'up', q: (p) => p - b, p: (q) => q + b, b };
    if (c.kind === 'vert') return { kind: 'vert', b };
    if (c.kind === 'flat') return { kind: 'flat', b };
    return { kind: c.kind, b };
  };
  // intersection of a downward curve with an upward or vertical one
  function meet(dn, other) {
    if (!dn || !other) return null;
    if (other.kind === 'up') { const p = (dn.b + other.b) / 2; return { p, q: dn.b - p }; }
    if (other.kind === 'vert') return { p: dn.b - other.b, q: other.b };
    return null;
  }
  E.meet = meet; E.lineQ = lineQ;

  /* ---------- geometry for one panel: lines, points and labels in unit coordinates ---------- */
  function geom(curves, state, o = {}) {
    const out = { lines: [], marks: [], guides: [], labels: [], gaps: [] };
    const now = {}, was = {};
    for (const c of curves) {
      const s = (state && state[c.id]) || 0;
      was[c.id] = lineQ(c, 0); now[c.id] = lineQ(c, s);
      if (s) out.lines.push({ c, L: was[c.id], old: true });
      out.lines.push({ c, L: now[c.id], moved: !!s, s });
    }
    const dn = curves.find((c) => c.kind === 'down'), upc = curves.find((c) => c.kind === 'up' || c.kind === 'vert'), fl = curves.find((c) => c.kind === 'flat');
    if (o.eq && dn && upc && !fl) {
      const e0 = meet(was[dn.id], was[upc.id]), e1 = meet(now[dn.id], now[upc.id]);
      const changed = e1 && e0 && (Math.abs(e1.p - e0.p) > 1e-9 || Math.abs(e1.q - e0.q) > 1e-9);
      if (e0) out.marks.push({ e: e0, lp: o.eq.p[0], lq: o.eq.q[0], faded: changed });
      if (changed) out.marks.push({ e: e1, lp: o.eq.p[1], lq: o.eq.q[1] });
    }
    if (fl && dn) { // price-taker: quantities demanded and supplied at the world price
      const sc = curves.find((c) => c.kind === 'up');
      const show = (W, faded, tag) => {
        const p = W.b, qd = now[dn.id].q(p), qs = sc ? now[sc.id].q(p) : null;
        const p0 = was[fl.id].b, qd0 = was[dn.id].q(p0), qs0 = sc ? was[sc.id].q(p0) : null;
        const t = (a, b) => (tag && Math.abs(a - b) > 1e-9 ? tag : '');
        out.guides.push({ p, qd, qs, faded, tag, tp: t(p, p0), tqd: t(qd, qd0), tqs: qs == null ? '' : t(qs, qs0) });
      };
      const sW = (state && state[fl.id]) || 0, sS = sc ? (state && state[sc.id]) || 0 : 0, sD = (state && state[dn.id]) || 0;
      if (sW || sS || sD) {
        // the starting position, with the original curves
        const p0 = was[fl.id].b; out.guides.push({ p: p0, qd: was[dn.id].q(p0), qs: sc ? was[sc.id].q(p0) : null, faded: true, tag: '', tp: '', tqd: '', tqs: '' });
        show(now[fl.id], false, '1');
      } else show(now[fl.id], false, '');
      // the domestic equilibrium (no trade)
      if (sc && o.domestic) { const e = meet(was[dn.id], was[sc.id]); if (e) out.marks.push({ e, lp: o.domestic, lq: null, faded: true, dot: true }); }
    }
    return out;
  }

  /* ---------- SVG ---------- */
  const sub = (t) => String(t).replace(/^(.*?)(\d+)$/, (m, a, n) => `${a}<tspan font-size="70%" dy="4">${n}</tspan>`);
  function panelSvg(spec, state, x0, y0, w, h) {
    const pad = 34, X = (q) => x0 + pad + q * (w - pad - 12), Y = (p) => y0 + h - pad - p * (h - pad - 10);
    let s = `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(0)}" class="ax"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(1)}" class="ax"/>`;
    s += `<text x="${X(1)}" y="${Y(0) + 26}" text-anchor="end" class="al">${spec.x}</text><text x="${X(0) + 4}" y="${Y(1) + 2}" class="al">${spec.y}</text>`;
    if (spec.title) s += `<text x="${X(0.5)}" y="${y0 + 12}" text-anchor="middle" class="gl">${spec.title}</text>`;
    const g = geom(spec.curves, state, { eq: spec.eq, domestic: spec.domestic });
    // keep labels apart: curve and left-axis labels move down a line; bottom-axis labels drop to a second row
    const placed = [], bottom = [];
    const put = (x, y, anchor = 'start', w = 40) => { const x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x; let yy = y, k = 0;
      while (k++ < 4 && placed.some((r) => Math.abs(r.y - yy) < 13 && x0 < r.x1 && x0 + w > r.x0)) yy += 13;
      placed.push({ x0, x1: x0 + w, y: yy }); return yy; };
    const putB = (x, y) => { let yy = y, k = 0; while (k++ < 3 && bottom.some((r) => Math.abs(r.y - yy) < 11 && Math.abs(r.x - x) < 22)) yy += 11; bottom.push({ x, y: yy }); return yy; };
    for (const { c, L, old, moved } of g.lines) {
      const col = c.col || 'var(--c1)', cls = `mc${old ? ' old' : ''}${moved ? ' new' : ''}`;
      let x1, y1, x2, y2, lx, ly;
      if (L.kind === 'down') { const q0 = Math.max(0.02, L.b - 0.96), q1 = Math.min(0.98, L.b - 0.04); x1 = X(q0); y1 = Y(L.p(q0)); x2 = X(q1); y2 = Y(L.p(q1)); lx = x2 + 4; ly = y2 + (old ? 14 : -4); }
      else if (L.kind === 'up') { const q0 = Math.max(0.02, 0.04 - L.b), q1 = Math.min(0.98, 0.96 - L.b); x1 = X(q0); y1 = Y(L.p(q0)); x2 = X(q1); y2 = Y(L.p(q1)); lx = x2 + 4; ly = y2 + (old ? 14 : 4); }
      else if (L.kind === 'vert') { x1 = x2 = X(L.b); y1 = Y(0.02); y2 = Y(0.96); lx = x2 + 4; ly = Y(0.45) + (old ? 16 : 0); }
      else if (L.kind === 'flat') { x1 = X(0.0); x2 = X(1); y1 = y2 = Y(L.b); lx = X(1) - 2; ly = y1 - 6; }
      else if (L.kind === 'ppf') { const r = L.b; s += `<path d="M ${X(0)} ${Y(r)} A ${X(r) - X(0)} ${Y(0) - Y(r)} 0 0 1 ${X(r)} ${Y(0)}" class="${cls}" style="stroke:${col}"/>`; s += `<text x="${X(r * 0.72) + 6}" y="${Y(r * 0.72) - 6}" class="ml" style="fill:${col}">${sub(old ? c.label : moved ? c.label + '1' : c.label)}</text>`; continue; }
      s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="${cls}" style="stroke:${col}"/>`;
      if (c.label) { const an = L.kind === 'flat' ? 'end' : lx > x0 + w - 30 ? 'end' : 'start', tx = Math.min(lx, x0 + w - 4); s += `<text x="${tx}" y="${put(tx, ly, an, c.label.length * 8 + 10)}" class="ml" text-anchor="${an}" style="fill:${col}">${sub(moved ? c.label + '1' : c.label)}</text>`; }
    }
    for (const m of g.marks) {
      const x = X(m.e.q), y = Y(m.e.p), op = m.faded ? ' opacity=".5"' : '';
      if (!m.dot) s += `<line x1="${X(0)}" y1="${y}" x2="${x}" y2="${y}" class="gd"${op}/><line x1="${x}" y1="${y}" x2="${x}" y2="${Y(0)}" class="gd"${op}/>`;
      s += `<circle cx="${x}" cy="${y}" r="4" class="eq"${op}/>`;
      if (m.lp) { const lx = m.dot ? x + 8 : X(0) - 4, an = m.dot ? 'start' : 'end'; s += `<text x="${lx}" y="${put(lx, m.dot ? y - 6 : y + 4, an, 30)}" text-anchor="${an}" class="al"${op}>${sub(m.lp)}</text>`; }
      if (m.lq) s += `<text x="${x}" y="${putB(x, Y(0) + 13)}" text-anchor="middle" class="al"${op}>${sub(m.lq)}</text>`;
    }
    for (const gd of g.guides) {
      const op = gd.faded ? ' opacity=".45"' : '', y = Y(gd.p);
      const cur = g.guides[g.guides.length - 1];
      if (!(gd.faded && Math.abs(gd.p - cur.p) < 1e-9)) s += `<text x="${X(0) - 4}" y="${put(X(0) - 4, y + 4, 'end')}" text-anchor="end" class="al"${op}>${sub((spec.world || 'Pw') + (gd.tp || ''))}</text>`;
      for (const [q, lab, tg] of [[gd.qd, 'Qd', gd.tqd], [gd.qs, 'Qs', gd.tqs]]) if (q != null && q > 0 && q < 1 && !(gd.faded && gd !== cur && (Math.abs(q - cur.qd) < 1e-9 || Math.abs(q - cur.qs) < 1e-9))) s += `<line x1="${X(q)}" y1="${y}" x2="${X(q)}" y2="${Y(0)}" class="gd"${op}/><text x="${X(q)}" y="${putB(X(q), Y(0) + 13)}" text-anchor="middle" class="al"${op}>${sub(lab + (tg || ''))}</text>`;
      if (gd.qs != null && !gd.faded && spec.gap) { const a = Math.min(gd.qd, gd.qs), b = Math.max(gd.qd, gd.qs); s += `<line x1="${X(a)}" y1="${y + 7}" x2="${X(b)}" y2="${y + 7}" class="gap"/><text x="${X((a + b) / 2)}" y="${y + 22}" text-anchor="middle" class="gl2">${spec.gap}</text>`; }
    }
    for (const pt of spec.points || []) s += `<circle cx="${X(pt.q)}" cy="${Y(pt.p)}" r="5" class="eq"/><text x="${X(pt.q) + 8}" y="${Y(pt.p) - 6}" class="ml">${pt.label}</text>`;
    return s;
  }
  // two-country model: the world (trade) price makes NZ's excess supply equal the other country's excess demand
  function tradePrice(spec, state) {
    const [A, B] = spec.panels;
    const L = (pan, c) => lineQ(c, (state && state[c.id]) || 0);
    const xs = (p) => { const s = A.curves.find((c) => c.kind === 'up'), d = A.curves.find((c) => c.kind === 'down'); return L(A, s).q(p) - L(A, d).q(p); };
    const xd = (p) => { const s = B.curves.find((c) => c.kind === 'up'), d = B.curves.find((c) => c.kind === 'down'); return L(B, d).q(p) - L(B, s).q(p); };
    let lo = 0, hi = 1; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (xs(m) - xd(m) > 0) hi = m; else lo = m; }
    return (lo + hi) / 2;
  }
  E.tradePrice = tradePrice;
  E.svg = (spec, state = {}) => {
    const w = spec.w || 420, h = spec.h || 300;
    const stack = spec.kind === 'two' && typeof window !== 'undefined' && window.innerWidth && window.innerWidth < 600;
    let s = `<svg class="fig${stack ? ' tall' : ''}" viewBox="0 0 ${spec.kind === 'two' && !stack ? w * 2 : w} ${stack ? h * 2 + 10 : h}" role="img" aria-label="${spec.alt || 'Economic model'}">`;
    if (spec.kind === 'two') {
      const pt0 = tradePrice(spec, {}), pt1 = tradePrice(spec, state), moved = Math.abs(pt1 - pt0) > 1e-6;
      spec.panels.forEach((pan, i) => {
        const flat = { id: 'PT', kind: 'flat', b: pt0, label: '', col: 'var(--pen)', move: false };
        const st = Object.assign({}, state); if (moved) st.PT = (pt1 - pt0) / DP;
        const sp = Object.assign({ x: spec.x, y: spec.y, world: 'Pt', gap: i === 0 ? 'X' : 'M' }, pan, { curves: pan.curves.concat([flat]), domestic: pan.domestic });
        s += stack ? panelSvg(sp, st, 0, i * (h + 10), w, h) : panelSvg(sp, st, i * w, 0, w, h);
      });
    } else s += panelSvg(spec, state, 0, 0, w, h);
    return s + '</svg>';
  };

  /* ---------- canvas, for explainers: t (0–1) animates the shift ---------- */
  E.draw = (a, spec, state = {}, t = 1, o = {}) => {
    const { W, H, C } = a, pad = a.fs * 2.4;
    const x0 = o.x0 || 0, w = o.w || W;
    const X = (q) => x0 + pad + q * (w - pad - 14), Y = (p) => H - pad - p * (H - pad - 14);
    a.line(X(0), Y(0), X(1), Y(0), C.muted, 1.6); a.line(X(0), Y(0), X(0), Y(1), C.muted, 1.6);
    a.text(spec.x, X(1), Y(0) + 18, { align: 'right', size: 0.72, col: C.muted, weight: 700 }); a.text(spec.y, X(0) + 6, Y(1) + 6, { size: 0.72, col: C.muted, weight: 700 });
    const col = (c) => (c.col ? { 'var(--c1)': C.c1, 'var(--c2)': C.c2, 'var(--c3)': C.c3, 'var(--c4)': C.c4, 'var(--pen)': C.pen }[c.col] || C.c1 : C.c1);
    const st = {}; for (const k in state) st[k] = state[k] * t;
    const g = geom(spec.curves, st, { eq: spec.eq, domestic: spec.domestic });
    for (const { c, L, old, moved } of g.lines) {
      const cl = col(c), al = old ? 0.35 : 1;
      let p1, p2;
      if (L.kind === 'down') { const q0 = Math.max(0.02, L.b - 0.96), q1 = Math.min(0.98, L.b - 0.04); p1 = [X(q0), Y(L.p(q0))]; p2 = [X(q1), Y(L.p(q1))]; }
      else if (L.kind === 'up') { const q0 = Math.max(0.02, 0.04 - L.b), q1 = Math.min(0.98, 0.96 - L.b); p1 = [X(q0), Y(L.p(q0))]; p2 = [X(q1), Y(L.p(q1))]; }
      else if (L.kind === 'vert') { p1 = [X(L.b), Y(0.02)]; p2 = [X(L.b), Y(0.96)]; }
      else if (L.kind === 'flat') { p1 = [X(0), Y(L.b)]; p2 = [X(1), Y(L.b)]; }
      else if (L.kind === 'ppf') { const pts = []; for (let k = 0; k <= 40; k++) { const th = (k / 40) * Math.PI / 2; pts.push([X(L.b * Math.sin(th)), Y(L.b * Math.cos(th))]); } a.path(pts, { stroke: cl, lw: 3.5, alpha: al, dash: moved ? [9, 6] : null }); a.text(moved ? c.label + '₁' : c.label, X(L.b * 0.72) + 8, Y(L.b * 0.72) - 8, { col: cl, font: 'head', alpha: al }); continue; }
      a.alpha(al, () => a.line(p1[0], p1[1], p2[0], p2[1], cl, 3.5, moved ? [9, 6] : null));
      const lab = moved ? c.label + '₁' : c.label;
      if (!c.label) continue;
      if (L.kind === 'vert') { const nearEdge = p1[0] + 44 > x0 + w; a.text(lab, nearEdge ? p1[0] - 5 : p1[0] + 5, Y(0.45) + (old ? 16 : 0), { col: cl, font: 'head', alpha: al, size: 0.9, align: nearEdge ? 'right' : 'left' }); continue; }
      a.text(lab, Math.min(p2[0] + 4, x0 + w - 6), p2[1] + (L.kind === 'flat' ? -10 : old ? 12 : -6), { col: cl, font: 'head', alpha: al, align: p2[0] + 30 > x0 + w ? 'right' : 'left', size: 0.9 });
    }
    for (const m of g.marks) {
      const x = X(m.e.q), y = Y(m.e.p), al = m.faded ? 0.45 : 1;
      if (!m.dot) a.alpha(al, () => { a.line(X(0), y, x, y, C.faint, 1.4, [4, 4]); a.line(x, y, x, Y(0), C.faint, 1.4, [4, 4]); });
      a.alpha(al, () => { a.ctx.fillStyle = C.ink; a.ctx.beginPath(); a.ctx.arc(x, y, 4.5, 0, 7); a.ctx.fill(); });
      if (m.lp) a.text(m.lp.replace(/(\d)$/, '₁'), m.dot ? x + 8 : X(0) - 4, m.dot ? y - 8 : y, { align: m.dot ? 'left' : 'right', size: 0.72, col: C.muted, alpha: al });
      if (m.lq) a.text(m.lq.replace(/(\d)$/, '₁'), x, Y(0) + 12, { align: 'center', size: 0.72, col: C.muted, alpha: al });
    }
    for (const gd of g.guides) {
      const al = gd.faded ? 0.4 : 1, y = Y(gd.p);
      a.text((spec.world || 'Pw') + (gd.tp ? '₁' : ''), X(0) - 4, y, { align: 'right', size: 0.72, col: C.muted, alpha: al });
      for (const [q, lab, tg] of [[gd.qd, 'Qd', gd.tqd], [gd.qs, 'Qs', gd.tqs]]) if (q != null && q > 0 && q < 1) { a.alpha(al, () => a.line(X(q), y, X(q), Y(0), C.faint, 1.4, [4, 4])); a.text(lab + (tg ? '₁' : ''), X(q), Y(0) + 12, { align: 'center', size: 0.72, col: C.muted, alpha: al }); }
      if (gd.qs != null && !gd.faded && spec.gap) { const lo = Math.min(gd.qd, gd.qs), hi = Math.max(gd.qd, gd.qs); a.line(X(lo), y + 8, X(hi), y + 8, C.pen, 3); a.text(spec.gap, X((lo + hi) / 2), y + 22, { align: 'center', font: 'pen', col: C.pen }); }
    }
    for (const pt of spec.points || []) { a.ctx.fillStyle = C.ink; a.ctx.beginPath(); a.ctx.arc(X(pt.q), Y(pt.p), 5, 0, 7); a.ctx.fill(); a.text(pt.label, X(pt.q) + 8, Y(pt.p) - 8, { font: 'head', size: 0.9 }); }
  };

  /* ---------- ready-made models ---------- */
  const M = (E.models = {});
  M.asad = (o = {}) => Object.assign({ kind: 'sd', x: 'Real output (Y)', y: 'Price level (PL)', alt: 'AS/AD model', eq: { p: ['PL', 'PL1'], q: ['Y', 'Y1'] },
    curves: [{ id: 'AD', kind: 'down', b: 1.0, label: 'AD', name: 'Aggregate demand (AD)', col: 'var(--c1)' }, { id: 'AS', kind: 'up', b: 0.0, label: 'AS', name: 'Aggregate supply (AS)', col: 'var(--c2)' }] }, o);
  M.asadLR = (o = {}) => Object.assign(M.asad(), { curves: [{ id: 'AD', kind: 'down', b: 1.0, label: 'AD', name: 'Aggregate demand (AD)', col: 'var(--c1)' }, { id: 'AS', kind: 'up', b: 0.0, label: 'AS', name: 'Aggregate supply (AS)', col: 'var(--c2)' }, { id: 'LRAS', kind: 'vert', b: 0.78, label: 'LRAS', name: 'Long-run aggregate supply (LRAS)', col: 'var(--c3)', move: true }], eq: { p: ['PL', 'PL1'], q: ['Y', 'Y1'] } }, o);
  M.fx = (o = {}) => Object.assign({ kind: 'sd', x: 'Quantity of NZD', y: 'Price of NZD (in USD)', alt: 'Market for New Zealand dollars', eq: { p: ['Er', 'Er1'], q: ['Q', 'Q1'] },
    curves: [{ id: 'D', kind: 'down', b: 1.0, label: 'D NZD', name: 'Demand for NZD', col: 'var(--c1)' }, { id: 'S', kind: 'up', b: 0.0, label: 'S NZD', name: 'Supply of NZD', col: 'var(--c2)' }] }, o);
  // a price-taking exporter (world price above the domestic equilibrium) or importer (below)
  M.taker = (exporter = true, o = {}) => Object.assign({ kind: 'taker', x: 'Quantity', y: 'Price', alt: exporter ? 'Price-taker model: NZ exports' : 'Price-taker model: NZ imports', gap: exporter ? 'exports' : 'imports', world: 'Pw', domestic: 'Pe',
    curves: [{ id: 'D', kind: 'down', b: 0.9, label: 'D NZ', name: 'NZ demand', col: 'var(--c1)' }, { id: 'S', kind: 'up', b: 0.0, label: 'S NZ', name: 'NZ supply', col: 'var(--c2)' }, { id: 'Pw', kind: 'flat', b: exporter ? 0.6 : 0.3, label: 'Pw', name: 'World price', col: 'var(--pen)' }] }, o);
  M.two = (o = {}) => Object.assign({ kind: 'two', x: 'Quantity', y: 'Price', alt: 'Two-country model', w: 300, h: 280,
    panels: [{ title: 'New Zealand', domestic: 'P NZ', curves: [{ id: 'Snz', kind: 'up', b: -0.05, label: 'S NZ', name: 'NZ supply', col: 'var(--c2)' }, { id: 'Dnz', kind: 'down', b: 0.75, label: 'D NZ', name: 'NZ demand', col: 'var(--c1)' }] },
      { title: 'Overseas', domestic: 'P OS', curves: [{ id: 'Sos', kind: 'up', b: 0.25, label: 'S OS', name: 'Overseas supply', col: 'var(--c2)' }, { id: 'Dos', kind: 'down', b: 0.95, label: 'D OS', name: 'Overseas demand', col: 'var(--c1)' }] }] }, o);
  M.ppf = (o = {}) => Object.assign({ kind: 'ppf', x: 'Capital goods', y: 'Consumer goods', alt: 'Production possibility frontier', curves: [{ id: 'PPF', kind: 'ppf', b: 0.66, label: 'PPF', name: 'PPF', col: 'var(--c3)' }] }, o);

  /* ---------- circular flow (five sectors), SVG with optional letter tags or names on the flows ---------- */
  E.flow = (which = {}, o = {}) => {
    const box = (x, y, t) => `<rect x="${x - 58}" y="${y - 18}" width="116" height="36" rx="8" class="box"/><text x="${x}" y="${y + 5}" text-anchor="middle" class="bt">${t}</text>`;
    const arrow = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="fl" marker-end="url(#fa)"/>`;
    // households top, firms bottom, government left, financial right, overseas bottom right
    const flows = {
      spending: { d: arrow(165, 70, 165, 310), at: [158, 250, 'end'], t: 'Spending' },
      income: { d: arrow(212, 310, 212, 70), at: [222, 160, 'start'], t: 'Income' },
      taxes: { d: arrow(150, 58, 76, 170), at: [100, 100, 'end'], t: 'Taxes' },
      govspend: { d: arrow(76, 210, 122, 310), at: [84, 268, 'end'], t: 'Govt spending' },
      savings: { d: arrow(266, 58, 348, 170), at: [320, 100, 'start'], t: 'Savings' },
      investment: { d: arrow(344, 210, 228, 312), at: [296, 262, 'start'], t: 'Investment' },
      imports: { d: arrow(230, 322, 320, 322), at: [275, 314, 'middle'], t: 'Imports' },
      exports: { d: arrow(320, 342, 230, 342), at: [275, 362, 'middle'], t: 'Exports' },
    };
    let s = `<defs><marker id="fa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--muted)"/></marker></defs>`;
    for (const k in flows) s += flows[k].d;
    s += box(210, 50, 'Households') + box(170, 332, 'Firms') + box(66, 190, 'Government') + box(366, 190, 'Financial') + box(378, 332, 'Overseas');
    for (const k in which) { const f = flows[k]; if (!f) continue; const [x, y, an] = f.at; const t = which[k] === true ? f.t : which[k];
      s += t.length <= 2 ? `<circle cx="${x}" cy="${y}" r="12" class="tag"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" class="tagt">${t}</text>` : `<text x="${x}" y="${y}" text-anchor="${an}" class="flt">${t}</text>`; }
    return `<svg class="fig" viewBox="0 0 440 380" role="img" aria-label="${o.alt || 'Five-sector circular flow model'}">${s}</svg>`;
  };
  E.FLOWS = { income: 'Income (wages, rent, interest, profit)', spending: 'Consumption spending', taxes: 'Taxes', govspend: 'Government spending', savings: 'Savings', investment: 'Investment', exports: 'Export receipts', imports: 'Import payments' };
})();
