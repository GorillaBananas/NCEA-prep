/* Biology figures.
   SVG (for questions, scalable, labelled with letter tags or names) and canvas drawers (for explainers).
   All colours come from CSS variables, so figures work in light and dark mode. */
(function () {
  const P = NP;
  const B = (P.bio = {});

  /* ---------- SVG helpers ---------- */
  // a tag: either a lettered circle (for "label the diagram" questions) or a name, with a leader line to (px, py)
  const tag = (t, tx, ty, px, py, anchor = 'middle') => {
    const lead = `<line x1="${tx}" y1="${ty}" x2="${px}" y2="${py}" class="lead"/><circle cx="${px}" cy="${py}" r="2.6" fill="var(--ink)"/>`;
    if (t.length <= 2) return `${lead}<circle cx="${tx}" cy="${ty}" r="12" class="tag"/><text x="${tx}" y="${ty + 4.5}" text-anchor="middle" class="tagt">${t}</text>`;
    return `${lead}<text x="${tx + (anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0)}" y="${ty + (ty < py ? -4 : 14)}" text-anchor="${anchor}" class="tagt">${t}</text>`;
  };
  const svg = (w, h, alt, body) => `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${alt}">${body}</svg>`;
  // tags: {key: 'A'} or {key: 'name'}; only keys present are drawn
  const tags = (spots, which) => Object.keys(which || {}).filter((k) => spots[k]).map((k) => { const s = spots[k]; return tag(which[k], s[0], s[1], s[2], s[3], s[4]); }).join('');

  /* chloroplast */
  B.chloroplast = (which, o = {}) => {
    const g = (x, y) => Array.from({ length: 5 }, (_, i) => `<rect x="${x - 19}" y="${y - 20 + i * 8}" width="38" height="6.5" rx="3" fill="var(--c3)" opacity=".7"/>`).join('');
    const stacks = [[120, 112], [178, 146], [238, 104], [298, 142]];
    let s = `<ellipse cx="210" cy="125" rx="178" ry="92" fill="color-mix(in srgb, var(--c3) 10%, var(--sheet))" class="bio"/><ellipse cx="210" cy="125" rx="169" ry="84" fill="none" class="bio" stroke-width="1.4"/>`;
    s += `<path d="M138 108 L160 140 M196 140 L220 108 M256 104 L280 136" stroke="var(--c3)" stroke-width="3" opacity=".6"/>`;
    s += stacks.map(([x, y]) => g(x, y)).join('');
    s += `<ellipse cx="300" cy="78" rx="18" ry="10" fill="var(--sheet)" stroke="var(--faint)"/>`;
    const spots = { outer: [210, 14, 210, 33], inner: [62, 46, 104, 74, 'end'], granum: [96, 216, 120, 122], thylakoid: [238, 218, 238, 112], stroma: [350, 214, 300, 182], starch: [380, 44, 312, 74] };
    return svg(420, 240, o.alt || 'Chloroplast', s + tags(spots, which));
  };
  /* mitochondrion */
  B.mitochondrion = (which, o = {}) => {
    // inner membrane with folds (cristae)
    let d = 'M 52 125 '; const top = [], bot = [];
    for (let k = 0; k < 6; k++) { const x = 85 + k * 52; top.push(`L ${x - 12} 62 L ${x - 8} 108 L ${x + 8} 108 L ${x + 12} 62`); bot.push(`L ${x + 12} 188 L ${x + 8} 142 L ${x - 8} 142 L ${x - 12} 188`); }
    d += 'C 52 80, 60 62, 70 62 ' + top.join(' ') + ' L 350 62 C 362 62, 370 80, 370 125 C 370 170, 362 188, 350 188 ' + bot.reverse().join(' ') + ' L 70 188 C 60 188, 52 170, 52 125 Z';
    let s = `<ellipse cx="211" cy="125" rx="178" ry="88" fill="color-mix(in srgb, var(--c2) 9%, var(--sheet))" class="bio"/>`;
    s += `<path d="${d}" fill="color-mix(in srgb, var(--c2) 20%, var(--sheet))" class="bio" stroke-width="1.8"/>`;
    const spots = { outer: [211, 16, 211, 37], inner: [40, 214, 70, 188, 'start'], crista: [126, 226, 129, 160], matrix: [300, 226, 268, 125], ims: [392, 40, 364, 64, 'end'] };
    return svg(422, 240, o.alt || 'Mitochondrion', s + tags(spots, which));
  };
  /* enzyme and substrate: stage = 'apart' | 'complex' | 'products' | 'denatured' */
  B.enzyme = (stage = 'apart', which, o = {}) => {
    const site = stage === 'denatured' ? 'L 168 92 C 180 70, 200 104, 214 84 L 236 92' : 'L 176 92 L 176 62 L 222 62 L 222 92 L 236 92';
    let s = `<path d="M 80 160 C 70 110, 100 92, 140 92 ${site} C 290 92, 320 120, 312 160 C 306 200, 240 214, 190 210 C 130 206, 88 196, 80 160 Z" fill="color-mix(in srgb, var(--c1) 22%, var(--sheet))" class="bio"/>`;
    const sub = (x, y) => `<rect x="${x}" y="${y}" width="44" height="30" rx="3" fill="color-mix(in srgb, var(--c2) 45%, var(--sheet))" class="bio"/>`;
    if (stage === 'apart') s += sub(177, 14) + `<path d="M199 48 L199 56" stroke="var(--muted)" stroke-width="2" stroke-dasharray="3 3"/>`;
    if (stage === 'complex') s += sub(177, 62);
    if (stage === 'products') s += `<rect x="150" y="14" width="22" height="30" rx="3" transform="rotate(-14 160 30)" fill="color-mix(in srgb, var(--c2) 45%, var(--sheet))" class="bio"/><rect x="232" y="18" width="22" height="30" rx="3" transform="rotate(12 242 34)" fill="color-mix(in srgb, var(--c2) 45%, var(--sheet))" class="bio"/>`;
    if (stage === 'denatured') s += sub(177, 14);
    const spots = { site: [330, 52, 222, 74, 'start'], substrate: [70, 30, 177, 28, 'end'], enzyme: [330, 186, 290, 170, 'start'], complex: [70, 60, 182, 76, 'end'], products: [330, 22, 252, 32, 'start'] };
    return svg(400, 230, o.alt || 'Enzyme and substrate', s + tags(spots, which));
  };
  /* homologous chromosomes, before and after crossing over */
  B.crossing = (which, o = {}) => {
    const c = (x, col, col2, cut) => { const r = (y0, y1, cc) => `<rect x="${x}" y="${y0}" width="16" height="${y1 - y0}" rx="8" fill="${cc}" class="bio" stroke-width="1.2"/>`; return cut ? r(30, 96, col) + r(96, 200, col2) : r(30, 200, col); };
    let s = c(90, 'var(--c1)', 'var(--c1)') + c(110, 'var(--c1)', 'var(--c2)', 1) + c(150, 'var(--c2)', 'var(--c1)', 1) + c(170, 'var(--c2)', 'var(--c2)');
    s += `<circle cx="118" cy="115" r="5" fill="var(--ink)"/><circle cx="158" cy="115" r="5" fill="var(--ink)"/>`;
    s += `<path d="M126 96 C 138 84, 142 84, 150 96" fill="none" stroke="var(--pen)" stroke-width="2.4"/>`;
    s += `<text x="100" y="222" text-anchor="middle" class="al">from one parent</text><text x="180" y="222" text-anchor="middle" class="al">from the other</text>`;
    const spots = { chiasma: [262, 60, 140, 92, 'start'], sister: [30, 150, 98, 150, 'end'], recombinant: [262, 150, 158, 150, 'start'], homologous: [262, 196, 182, 184, 'start'], centromere: [262, 116, 163, 115, 'start'] };
    return svg(400, 232, o.alt || 'Crossing over between homologous chromosomes', s + tags(spots, which));
  };
  /* translation at a ribosome */
  B.translation = (which, o = {}) => {
    const codons = ['AUG', 'GCU', 'UUC', 'AAA', 'UGA'];
    let s = `<rect x="20" y="170" width="380" height="26" rx="5" fill="color-mix(in srgb, var(--c3) 16%, var(--sheet))" class="bio" stroke-width="1.4"/>`;
    codons.forEach((c, k) => { s += `<text x="${62 + k * 74}" y="188" text-anchor="middle" class="tagt" style="font-family:var(--f-body);letter-spacing:2px">${c}</text>`; if (k) s += `<line x1="${25 + k * 74}" y1="172" x2="${25 + k * 74}" y2="194" stroke="var(--line)"/>`; });
    s += `<path d="M 80 168 C 70 120, 110 96, 170 92 C 230 88, 280 110, 270 168 Z" fill="color-mix(in srgb, var(--c4) 16%, var(--sheet))" class="bio" stroke-width="1.6"/>`;
    // tRNA in the ribosome, carrying an amino acid; growing chain
    s += `<path d="M 118 158 L 118 128 L 160 128 L 160 158" fill="none" stroke="var(--c1)" stroke-width="5" stroke-linecap="round"/><text x="139" y="164" text-anchor="middle" class="al">CGA</text>`;
    s += `<path d="M 192 158 L 192 128 L 234 128 L 234 158" fill="none" stroke="var(--c1)" stroke-width="5" stroke-linecap="round"/><text x="213" y="164" text-anchor="middle" class="al">AAG</text>`;
    s += `<circle cx="139" cy="112" r="11" fill="var(--c2)"/><circle cx="213" cy="112" r="11" fill="var(--c2)"/><circle cx="120" cy="84" r="11" fill="var(--c2)"/><line x1="128" y1="92" x2="134" y2="102" stroke="var(--ink)" stroke-width="2"/><line x1="150" y1="112" x2="202" y2="112" stroke="var(--ink)" stroke-width="2" stroke-dasharray="4 3"/>`;
    const spots = { mrna: [36, 222, 50, 196, 'start'], codon: [212, 228, 210, 196], trna: [300, 44, 234, 132, 'start'], anticodon: [300, 78, 222, 160, 'start'], amino: [40, 60, 112, 80, 'end'], ribosome: [300, 112, 262, 140, 'start'], bond: [176, 44, 176, 112] };
    return svg(420, 240, o.alt || 'Translation at a ribosome', s + tags(spots, which));
  };
  /* membrane transport */
  B.membrane = (which, o = {}) => {
    let s = '';
    for (let x = 20; x < 400; x += 16) { if (x > 150 && x < 186) continue; if (x > 266 && x < 314) continue; s += `<circle cx="${x}" cy="92" r="6" fill="var(--c1)" opacity=".75"/><circle cx="${x}" cy="148" r="6" fill="var(--c1)" opacity=".75"/><line x1="${x - 2}" y1="98" x2="${x - 2}" y2="118" stroke="var(--c1)" stroke-width="1.4"/><line x1="${x + 2}" y1="98" x2="${x + 2}" y2="118" stroke="var(--c1)" stroke-width="1.4"/><line x1="${x - 2}" y1="122" x2="${x - 2}" y2="142" stroke="var(--c1)" stroke-width="1.4"/><line x1="${x + 2}" y1="122" x2="${x + 2}" y2="142" stroke="var(--c1)" stroke-width="1.4"/>`; }
    s += `<rect x="152" y="80" width="12" height="80" rx="4" fill="var(--c4)" opacity=".8"/><rect x="176" y="80" width="12" height="80" rx="4" fill="var(--c4)" opacity=".8"/>`;
    s += `<path d="M 270 80 C 262 100, 262 140, 272 160 L 310 160 C 320 140, 320 100, 312 80 Z" fill="color-mix(in srgb, var(--c3) 40%, var(--sheet))" class="bio" stroke-width="1.4"/>`;
    s += `<line x1="170" y1="40" x2="170" y2="190" stroke="var(--pen)" stroke-width="2.4" marker-end="url(#ah)"/><line x1="291" y1="200" x2="291" y2="40" stroke="var(--pen)" stroke-width="2.4" marker-end="url(#ah)"/><text x="304" y="214" class="al">ATP</text>`;
    s += `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--pen)"/></marker></defs>`;
    s += `<text x="12" y="30" class="al">outside the cell</text><text x="12" y="222" class="al">inside the cell</text>`;
    const spots = { bilayer: [60, 196, 60, 150], channel: [110, 40, 160, 84, 'end'], carrier: [370, 120, 314, 120, 'start'], phos: [60, 50, 68, 88] };
    return svg(420, 232, o.alt || 'Cell membrane with transport proteins', s + tags(spots, which));
  };
  /* Punnett square as a table: gametes across (cols) and down (rows) */
  B.punnett = (cols, rows, cell, o = {}) => `<table class="twoway punnett"><thead><tr><th>${o.corner || ''}</th>${cols.map((g) => `<th>${g}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => `<tr><th>${r}</th>${cols.map((c, j) => `<td>${cell ? cell(r, c, i, j) : ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  // monospace DNA / RNA sequence block
  // a "label the diagram" question: fig(which) draws the figure; names = {spot: 'Name'}; picks n spots at random
  B.labelGen = (fig, names, o = {}) => () => {
    const keys = P.R.shuffle(Object.keys(names)).slice(0, o.n || 4), L = 'ABCDE';
    const which = {}; keys.forEach((k, i) => (which[k] = L[i]));
    return { kind: 'match', prompt: o.prompt || 'Match each letter to the right label.', fig: fig(which), pairs: keys.map((k, i) => ({ k: L[i], a: names[k] })), extra: o.extra || [],
      more: { idea: o.idea, steps: keys.map((k, i) => ({ say: `<b>${L[i]}</b> is the <b>${names[k].toLowerCase()}</b>${o.why && o.why[k] ? ': ' + o.why[k] : '.'}` })), trap: o.trap } };
  };
  B.seq = (label, s) => `<div class="seq"><span class="seql">${label}</span><code>${s.match(/.{1,3}/g).join(' ')}</code></div>`;

  /* ---------- canvas drawers for explainers (a = player api) ---------- */
  B.cv = {
    chloroplast(a, cx, cy, w, h, al = 1) {
      const C = a.C;
      a.ellipse(cx, cy, w / 2, h / 2, { fill: C.sheet, stroke: C.c3, lw: 2.5, alpha: al });
      a.ellipse(cx, cy, w / 2 - 7, h / 2 - 7, { stroke: C.c3, lw: 1.2, alpha: al });
      const stacks = [[-0.28, -0.08], [-0.08, 0.16], [0.12, -0.1], [0.3, 0.14]];
      for (const [dx, dy] of stacks) for (let i = 0; i < 5; i++) a.round(cx + dx * w - w * 0.05, cy + dy * h - h * 0.14 + i * h * 0.065, w * 0.1, h * 0.05, 3, { fill: C.c3, stroke: false, alpha: al * 0.75 });
    },
    mito(a, cx, cy, w, h, al = 1) {
      const C = a.C;
      a.ellipse(cx, cy, w / 2, h / 2, { fill: C.sheet, stroke: C.c2, lw: 2.5, alpha: al });
      const pts = []; const n = 6; const x0 = cx - w * 0.4, x1 = cx + w * 0.4, yt = cy - h * 0.32, yb = cy + h * 0.32;
      pts.push([x0, cy]);
      for (let k = 0; k < n; k++) { const x = x0 + ((k + 0.5) / n) * (x1 - x0); pts.push([x - 8, yt], [x - 5, cy - 6], [x + 5, cy - 6], [x + 8, yt]); }
      pts.push([x1, cy]);
      for (let k = n - 1; k >= 0; k--) { const x = x0 + ((k + 0.5) / n) * (x1 - x0); pts.push([x + 8, yb], [x + 5, cy + 6], [x - 5, cy + 6], [x - 8, yb]); }
      a.path(pts, { close: true, stroke: C.c2, lw: 1.8, alpha: al });
    },
    // enzyme with a notch; substrate block at (sx, sy); bent = denatured
    enzyme(a, cx, cy, s, o = {}) {
      const C = a.C, al = o.alpha == null ? 1 : o.alpha;
      const notch = o.bent ? [[cx - 0.18 * s, cy - 0.5 * s], [cx - 0.05 * s, cy - 0.62 * s], [cx + 0.06 * s, cy - 0.44 * s], [cx + 0.2 * s, cy - 0.55 * s]] : [[cx - 0.14 * s, cy - 0.5 * s], [cx - 0.14 * s, cy - 0.78 * s], [cx + 0.14 * s, cy - 0.78 * s], [cx + 0.14 * s, cy - 0.5 * s]];
      const body = [[cx - 0.75 * s, cy - 0.5 * s], ...notch, [cx + 0.75 * s, cy - 0.5 * s], [cx + 0.85 * s, cy], [cx + 0.6 * s, cy + 0.45 * s], [cx - 0.6 * s, cy + 0.45 * s], [cx - 0.85 * s, cy]];
      a.path(body, { close: true, fill: o.fill || C.c1, stroke: C.ink, lw: 2, alpha: al * 0.9 });
    },
    substrate(a, x, y, s, o = {}) { a.round(x - 0.14 * s, y - 0.28 * s, 0.28 * s, 0.28 * s, 4, { fill: a.C.c2, stroke: a.C.ink, lw: 2, alpha: o.alpha == null ? 1 : o.alpha }); },
    // a stretch of DNA as a ladder: pairs = [['A','T'],…]; open = 0..1 unzipped from the left
    ladder(a, x0, y, w, pairs, o = {}) {
      const C = a.C, n = pairs.length, dx = w / n, gap = o.gap || 46, open = o.open || 0;
      const col = { A: C.c1, T: C.c2, G: C.c3, C: C.c4, U: C.pen };
      pairs.forEach(([t, b], k) => {
        const x = x0 + (k + 0.5) * dx, sep = gap * 0.7 * Math.max(0, Math.min(1, (open - k / n) * 3));
        const yt = y - gap / 2 - sep, yb = y + gap / 2 + sep;
        a.line(x, yt, x, yt + gap / 2 - 3, col[t] || C.ink, 5); a.line(x, yb, x, yb - gap / 2 + 3, col[b] || C.ink, 5);
        a.text(t, x, yt - 12, { align: 'center', size: 0.72, col: col[t] }); a.text(b, x, yb + 12, { align: 'center', size: 0.72, col: col[b] });
      });
    },
  };
})();
