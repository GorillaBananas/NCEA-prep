/* Geography figures (SVG). Colours come from CSS variables, so they work in light and dark mode.
   - practice topographic maps with a numbered grid (grid references, distance, direction)
   - climate graph, line graphs, timelines, précis maps
   - Amazon diagrams (layers, nutrient cycle, convectional rain, sketch map, flood pulse)
   - Laos sketch map */
(function () {
  const P = NP, R = P.R;
  const G = (P.geo = {});
  const svg = (w, h, alt, body, cls = '') => `<svg class="fig${cls ? ' ' + cls : ''}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${P.esc(alt)}">${body}</svg>`;
  const tx = (x, y, t, cls = 'ft', anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}"${extra}>${t}</text>`;
  // a tag: lettered circle or a name, with a leader line to (px, py)
  const tag = (t, x, y, px, py, anchor = 'middle') => {
    const lead = `<line x1="${x}" y1="${y}" x2="${px}" y2="${py}" class="lead"/><circle cx="${px}" cy="${py}" r="2.6" fill="var(--ink)"/>`;
    if (t.length <= 2) return `${lead}<circle cx="${x}" cy="${y}" r="12" class="tag"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" class="tagt">${t}</text>`;
    return `${lead}<text x="${x + (anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0)}" y="${y + (y < py ? -4 : 14)}" text-anchor="${anchor}" class="tagt">${t}</text>`;
  };
  const tags = (spots, which) => Object.keys(which || {}).filter((k) => spots[k]).map((k) => { const s = spots[k]; return tag(which[k], s[0], s[1], s[2], s[3], s[4]); }).join('');
  const north = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -20 L8 6 L0 0 L-8 6 Z" class="sym"/><text x="0" y="20" text-anchor="middle" class="ftb">N</text></g>`;
  G.tag = tag; G.north = north;

  /* ======================= practice topographic map ======================= */
  // Grid: 6 columns × 5 rows of 1 km squares. Eastings e0…e0+6 along the bottom, northings n0…n0+5 up the left side.
  const SQ = 62, OX = 36, OY = 16, COLS = 6, ROWS = 5;
  const X = (gx) => OX + gx * SQ, Y = (gy) => OY + (ROWS - gy) * SQ; // gx, gy in squares from the bottom-left corner
  const POINTS = [
    { name: 'school', sym: (x, y) => `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" class="sym"/><path d="M${x - 8} ${y - 6} L${x} ${y - 13} L${x + 8} ${y - 6} Z" class="sym"/>` },
    { name: 'trig point (summit)', sym: (x, y) => `<path d="M${x} ${y - 8} L${x + 8} ${y + 6} L${x - 8} ${y + 6} Z" class="sym"/>` },
    { name: 'hut', sym: (x, y) => `<rect x="${x - 6}" y="${y - 4}" width="12" height="10" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/><path d="M${x - 8} ${y - 4} L${x} ${y - 11} L${x + 8} ${y - 4}" fill="none" stroke="var(--ink)" stroke-width="2"/>` },
    { name: 'lookout', sym: (x, y) => `<circle cx="${x}" cy="${y}" r="6" class="sym"/><circle cx="${x}" cy="${y}" r="10" fill="none" stroke="var(--ink)" stroke-width="1.4"/>` },
    { name: 'church', sym: (x, y) => `<path d="M${x - 2.5} ${y - 9} h5 v5 h5 v5 h-5 v9 h-5 v-9 h-5 v-5 h5 Z" class="sym"/>` },
    { name: 'water tower', sym: (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="var(--c1)" stroke="var(--ink)" stroke-width="1.6"/>` },
    { name: 'radio mast', sym: (x, y) => `<path d="M${x} ${y - 6} L${x} ${y + 8} M${x - 5} ${y + 8} L${x + 5} ${y + 8}" stroke="var(--ink)" stroke-width="2.2" fill="none"/><circle cx="${x}" cy="${y - 8}" r="3.2" class="sym"/><path d="M${x - 7} ${y - 13} Q${x - 10} ${y - 8} ${x - 7} ${y - 3} M${x + 7} ${y - 13} Q${x + 10} ${y - 8} ${x + 7} ${y - 3}" stroke="var(--ink)" stroke-width="1.4" fill="none"/>` },
    { name: 'campground', sym: (x, y) => `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" rx="3" fill="var(--c3)"/><path d="M${x - 5} ${y + 5} L${x} ${y - 5} L${x + 5} ${y + 5} Z" fill="var(--sheet)"/>` },
  ];
  // a smooth-ish path through points given in grid units
  const pth = (pts) => 'M' + pts.map(([gx, gy]) => `${X(gx).toFixed(1)} ${Y(gy).toFixed(1)}`).join(' L');
  G.newMap = () => {
    const e0 = R.int(12, 78), n0 = R.int(20, 88);
    // a river from the top edge to the bottom edge, wandering
    let rx = R.int(15, 45) / 10; const river = [];
    for (let gy = ROWS; gy >= 0; gy -= 0.5) { river.push([Math.max(0.6, Math.min(COLS - 0.6, rx)), gy]); rx += (Math.random() - 0.5) * 0.9; }
    // a road from the left edge to the right edge
    let ry = R.int(15, 35) / 10; const road = [];
    for (let gx = 0; gx <= COLS; gx += 0.75) { road.push([gx, Math.max(0.5, Math.min(ROWS - 0.5, ry))]); ry += (Math.random() - 0.5) * 0.7; }
    const lake = { gx: R.pick([4.6, 5]), gy: R.pick([3.8, 4.1]), rx: 0.55, ry: 0.4 };
    const forest = { gx: R.pick([1, 1.4]), gy: R.pick([0.8, 1.1]), r: 0.6 };
    const town = { gx: R.pick([3.2, 3.6]), gy: R.pick([1.3, 1.6]), w: 0.9, h: 0.7 };
    // point features at tenths, away from each other and from the area features
    const pts = []; const pool = R.shuffle(POINTS).slice(0, 5); let guard = 0;
    while (pts.length < pool.length && guard++ < 500) {
      const gx = R.int(3, COLS * 10 - 3) / 10, gy = R.int(3, ROWS * 10 - 3) / 10;
      const fx = Math.round(gx * 10) % 10, fy = Math.round(gy * 10) % 10;
      if (fx === 0 || fy === 0) continue; // not exactly on a grid line
      if (pts.some((p) => Math.hypot(p.gx - gx, p.gy - gy) < 1.25)) continue;
      if (Math.hypot(gx - lake.gx, (gy - lake.gy) * 1.2) < 0.85 || Math.hypot(gx - town.gx, gy - town.gy) < 0.8) continue;
      pts.push(Object.assign({ gx, gy }, pool[pts.length]));
    }
    return { e0, n0, river, road, lake, forest, town, pts };
  };
  // grid references
  const pad2 = (v) => String(v % 100).padStart(2, '0');
  const t10 = (g) => Math.round(g * 10);
  G.ref4 = (m, gx, gy) => pad2(m.e0 + Math.floor(t10(gx) / 10)) + pad2(m.n0 + Math.floor(t10(gy) / 10));
  G.ref6 = (m, gx, gy) => pad2(m.e0 + Math.floor(t10(gx) / 10)) + (t10(gx) % 10) + pad2(m.n0 + Math.floor(t10(gy) / 10)) + (t10(gy) % 10);
  G.mapSvg = (m, o = {}) => {
    const W = OX + COLS * SQ + 14, H = OY + ROWS * SQ + 92;
    let s = `<rect x="${X(0)}" y="${Y(ROWS)}" width="${COLS * SQ}" height="${ROWS * SQ}" fill="var(--sheet)"/>`;
    s += `<ellipse cx="${X(m.forest.gx)}" cy="${Y(m.forest.gy)}" rx="${m.forest.r * SQ}" ry="${m.forest.r * SQ * 0.8}" class="for"/>`;
    for (let k = 0; k < 7; k++) { const a = k * 0.9, rr = m.forest.r * SQ * 0.5; s += `<circle cx="${(X(m.forest.gx) + Math.cos(a) * rr).toFixed(1)}" cy="${(Y(m.forest.gy) + Math.sin(a) * rr * 0.7).toFixed(1)}" r="3" fill="var(--c3)"/>`; }
    s += `<ellipse cx="${X(m.lake.gx)}" cy="${Y(m.lake.gy)}" rx="${m.lake.rx * SQ}" ry="${m.lake.ry * SQ}" class="wat"/>`;
    s += `<rect x="${X(m.town.gx - m.town.w / 2)}" y="${Y(m.town.gy + m.town.h / 2)}" width="${m.town.w * SQ}" height="${m.town.h * SQ}" class="urb"/>`;
    s += `<path d="${pth(m.river)}" class="riv"/><path d="${pth(m.road)}" class="rd"/>`;
    // grid lines and numbers
    for (let i = 0; i <= COLS; i++) s += `<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(ROWS)}" class="gr"/>${tx(X(i), Y(0) + 15, pad2(m.e0 + i), 'gn')}`;
    for (let j = 0; j <= ROWS; j++) s += `<line x1="${X(0)}" y1="${Y(j)}" x2="${X(COLS)}" y2="${Y(j)}" class="gr"/>${tx(X(0) - 5, Y(j) + 4, pad2(m.n0 + j), 'gn', 'end')}`;
    s += `<rect x="${X(0)}" y="${Y(ROWS)}" width="${COLS * SQ}" height="${ROWS * SQ}" class="frame"/>`;
    // point features
    m.pts.forEach((p, k) => { s += p.sym(X(p.gx), Y(p.gy)); if (o.letters) s += tx(X(p.gx) + 12, Y(p.gy) - 8, 'ABCDEFG'[k], 'ftb', 'start'); });
    if (o.mark) { const p = o.mark; s += `<circle cx="${X(p.gx)}" cy="${Y(p.gy)}" r="15" fill="none" stroke="var(--pen)" stroke-width="2.4"/>`; }
    // scale bar: 1 grid square = 1 km
    const sy = Y(0) + 30;
    s += `<rect x="${X(0)}" y="${sy}" width="${SQ}" height="7" class="sym"/><rect x="${X(1)}" y="${sy}" width="${SQ}" height="7" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.2"/>`;
    s += tx(X(0), sy + 20, '0', 'gn') + tx(X(1), sy + 20, '1', 'gn') + tx(X(2), sy + 20, '2 km', 'gn');
    s += tx(X(2) + 22, sy + 8, '1:50 000. Grid squares are 1 km.', 'gn', 'start');
    s += north(W - 16, sy + 14, 0.8);
    // key
    if (o.key !== false) {
      const ky = Y(0) + 76;
      s += `<line x1="${X(0)}" y1="${ky}" x2="${X(0) + 20}" y2="${ky}" class="riv"/>${tx(X(0) + 25, ky + 4, 'river', 'gn', 'start')}`;
      s += `<line x1="${X(0) + 75}" y1="${ky}" x2="${X(0) + 95}" y2="${ky}" class="rd"/>${tx(X(0) + 100, ky + 4, 'road', 'gn', 'start')}`;
      s += `<rect x="${X(0) + 140}" y="${ky - 6}" width="16" height="12" class="urb"/>${tx(X(0) + 161, ky + 4, 'town', 'gn', 'start')}`;
      s += `<rect x="${X(0) + 205}" y="${ky - 6}" width="16" height="12" class="for"/>${tx(X(0) + 226, ky + 4, 'forest', 'gn', 'start')}`;
      s += `<rect x="${X(0) + 280}" y="${ky - 6}" width="16" height="12" class="wat"/>${tx(X(0) + 301, ky + 4, 'lake', 'gn', 'start')}`;
    }
    return svg(W, H + 8, o.alt || 'Practice topographic map with a numbered grid', s);
  };
  // the key of point features as a small table
  G.keyList = (m) => `<p class="muted small">Symbols: ${m.pts.map((p) => `<span style="white-space:nowrap">${svg(24, 24, p.name, p.sym(12, 13)).replace('class="fig"', 'class="fig" style="width:20px;height:20px;display:inline-block;vertical-align:middle"')} ${p.name}</span>`).join(' · ')}</p>`;
  // 8-point compass direction from p to q (grid north = up), or null when too close to a boundary
  const DIRS = ['east', 'north-east', 'north', 'north-west', 'west', 'south-west', 'south', 'south-east'];
  G.dir8 = (p, q) => {
    const a = (Math.atan2(q.gy - p.gy, q.gx - p.gx) * 180) / Math.PI, aa = (a + 360) % 360;
    const off = ((aa + 22.5) % 45); if (off < 7 || off > 38) return null;
    return DIRS[Math.floor(((aa + 22.5) % 360) / 45)];
  };
  G.DIRS = DIRS;

  /* ======================= climate graph ======================= */
  G.MANAUS = { name: 'Manaus, Brazil (3°S)', months: 'JFMAMJJASOND'.split(''), temp: [26.6, 26.6, 26.6, 26.7, 27.0, 27.3, 27.5, 28.2, 28.6, 28.5, 28.0, 27.2], rain: [306, 297, 321, 331, 233, 117, 67, 56, 79, 114, 188, 254] };
  G.climate = (d = G.MANAUS, o = {}) => {
    const W = 420, H = 270, x0 = 44, x1 = 376, y0 = 226, y1 = 30, bw = (x1 - x0) / 12;
    const rmax = 400, tmin = 0, tmax = 40;
    const ry = (r) => y0 - (r / rmax) * (y0 - y1), ty = (t) => y0 - ((t - tmin) / (tmax - tmin)) * (y0 - y1);
    let s = '';
    for (let r = 0; r <= rmax; r += 100) s += `<line x1="${x0}" y1="${ry(r)}" x2="${x1}" y2="${ry(r)}" class="g"/>${tx(x0 - 5, ry(r) + 4, r, 'tl', 'end')}`;
    for (let t = 0; t <= tmax; t += 10) s += tx(x1 + 6, ty(t) + 4, t, 'tl', 'start');
    d.rain.forEach((r, k) => { s += `<rect x="${x0 + k * bw + 3}" y="${ry(r)}" width="${bw - 6}" height="${y0 - ry(r)}" class="clim-bar"/>`; s += tx(x0 + (k + 0.5) * bw, y0 + 15, d.months[k], 'tl'); });
    s += `<path d="M${d.temp.map((t, k) => `${(x0 + (k + 0.5) * bw).toFixed(1)} ${ty(t).toFixed(1)}`).join(' L')}" class="clim-line"/>`;
    d.temp.forEach((t, k) => (s += `<circle cx="${x0 + (k + 0.5) * bw}" cy="${ty(t)}" r="3" fill="var(--pen)"/>`));
    s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" class="ax"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1 - 6}" class="ax"/><line x1="${x1}" y1="${y0}" x2="${x1}" y2="${y1 - 6}" class="ax"/>`;
    s += tx(x0 - 34, 18, 'Rainfall (mm)', 'al', 'start') + tx(x1 + 30, 18, 'Temp (°C)', 'al', 'end');
    s += tx((x0 + x1) / 2, H - 12, o.title || `Climate graph: ${d.name}, 1991–2020 averages`, 'al');
    return svg(W, H, o.alt || 'Climate graph: rainfall bars and temperature line by month', s);
  };

  /* ======================= line graph ======================= */
  // series: [{ name, pts: [[x, y], …], cls? }], o: { x0, x1, y0, y1, xstep, ystep, xlab, ylab, title, marks }
  G.line = (series, o) => {
    const W = 420, H = 270, L = 52, Rr = 400, T = 24, B = 222;
    const X = (x) => L + ((x - o.x0) / (o.x1 - o.x0)) * (Rr - L), Y = (y) => B - ((y - o.y0) / (o.y1 - o.y0)) * (B - T);
    let s = '';
    for (let y = o.y0; y <= o.y1 + 1e-9; y += o.ystep) s += `<line x1="${L}" y1="${Y(y)}" x2="${Rr}" y2="${Y(y)}" class="g"/>${tx(L - 6, Y(y) + 4, o.yfmt ? o.yfmt(y) : P.n(y, 2), 'tl', 'end')}`;
    for (let x = o.x0; x <= o.x1 + 1e-9; x += o.xstep) s += `<line x1="${X(x)}" y1="${B}" x2="${X(x)}" y2="${B + 5}" class="ax"/>${tx(X(x), B + 18, x, 'tl')}`;
    s += `<line x1="${L}" y1="${B}" x2="${Rr}" y2="${B}" class="ax"/><line x1="${L}" y1="${B}" x2="${L}" y2="${T - 6}" class="ax"/>`;
    const cols = ['var(--c1)', 'var(--c2)', 'var(--c3)'];
    series.forEach((sr, k) => {
      s += `<path d="M${sr.pts.map(([x, y]) => `${X(x).toFixed(1)} ${Y(y).toFixed(1)}`).join(' L')}" class="cv" stroke="${cols[k]}"/>`;
      sr.pts.forEach(([x, y]) => (s += `<circle cx="${X(x)}" cy="${Y(y)}" r="3.2" fill="${cols[k]}"/>`));
      if (series.length > 1) { const [lx, ly] = sr.pts[sr.pts.length - 1]; s += tx(X(lx) - 4, Y(ly) - 9, sr.name, 'al', 'end'); }
    });
    s += tx(L - 44, 14, o.ylab || '', 'al', 'start') + tx((L + Rr) / 2, H - 10, o.title || '', 'al');
    return svg(W, H, o.alt || o.title || 'Line graph', s);
  };

  /* ======================= timeline ======================= */
  // events: [{ y: year, t: label }], o: { y0, y1, step, title }
  G.timeline = (events, o) => {
    const W = 440, L = 24, Rr = 416, ly = 86;
    const X = (y) => L + ((y - o.y0) / (o.y1 - o.y0)) * (Rr - L);
    let s = `<line x1="${L}" y1="${ly}" x2="${Rr}" y2="${ly}" stroke="var(--ink)" stroke-width="2.4"/>`;
    for (let y = o.y0; y <= o.y1; y += o.step) s += `<line x1="${X(y)}" y1="${ly - 6}" x2="${X(y)}" y2="${ly + 6}" class="tk"/>${tx(X(y), ly + 22, y, 'tl')}`;
    const LV = [ly - 18, ly + 42, ly - 40, ly + 62];
    events.forEach((e, k) => { const yy = LV[k % 4], up = yy < ly; s += `<line x1="${X(e.y)}" y1="${ly}" x2="${X(e.y)}" y2="${up ? yy + 4 : yy - 12}" stroke="var(--pen)" stroke-width="1.4"/><circle cx="${X(e.y)}" cy="${ly}" r="4" fill="var(--pen)"/>${tx(X(e.y), yy, e.t, 'ft', X(e.y) < 70 ? 'start' : X(e.y) > W - 70 ? 'end' : 'middle')}`; });
    if (o.title) s += tx(W / 2, 16, o.title, 'ftb');
    return svg(W, 166, o.alt || o.title || 'Timeline', s);
  };

  /* ======================= précis map with conventions ======================= */
  // missing: one of 'title', 'key', 'north', 'scale', 'border', 'source', or null
  G.precis = (missing, o = {}) => {
    const W = 420, H = 300;
    let s = '';
    if (missing !== 'border') s += `<rect x="8" y="8" width="${W - 16}" height="${H - 16}" class="frame"/>`;
    if (missing !== 'title') s += tx(W / 2, 32, o.title || 'Précis map of Port Avela, showing land use in 2025', 'ftb');
    // coast, river, town, airport, port, forest
    s += `<path d="M24 250 C 90 230, 140 262, 210 240 C 270 222, 330 250, 396 232 L396 284 L24 284 Z" class="wat"/>`;
    s += `<path d="M130 52 C 150 100, 120 150, 160 190 C 180 210, 200 222, 210 240" class="riv"/>`;
    s += `<rect x="190" y="160" width="70" height="52" class="urb"/>${tx(225, 191, 'A', 'ftb')}`;
    s += `<rect x="290" y="168" width="80" height="26" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 3"/>${tx(330, 186, 'B', 'ftb')}`;
    s += `<ellipse cx="80" cy="120" rx="46" ry="32" class="for"/>${tx(80, 125, 'C', 'ftb')}`;
    s += `<path d="M180 230 L196 214 M206 238 L222 222" stroke="var(--ink)" stroke-width="4"/>`;
    if (missing !== 'north') s += north(370, 70, 0.9);
    if (missing !== 'scale') s += `<rect x="290" y="112" width="40" height="6" class="sym"/><rect x="330" y="112" width="40" height="6" fill="var(--sheet)" stroke="var(--ink)"/>${tx(290, 132, '0', 'gn')}${tx(330, 132, '1', 'gn')}${tx(370, 132, '2 km', 'gn')}`;
    if (missing !== 'key') s += `<g transform="translate(24 56)"><rect width="84" height="52" fill="var(--sheet)" stroke="var(--line)"/>${tx(6, 14, 'A urban area', 'gn', 'start')}${tx(6, 30, 'B airport', 'gn', 'start')}${tx(6, 46, 'C forest', 'gn', 'start')}</g>`;
    if (missing !== 'source') s += tx(W - 16, H - 20, 'Source: practice resource, 2025', 'gn', 'end');
    return svg(W, H, 'Précis map', s);
  };

  /* ======================= Amazon diagrams ======================= */
  // rainforest layers: tags for emergent, canopy, understorey, shrub, floor
  G.layers = (which, o = {}) => {
    const W = 420, H = 300, B = 268, Ym = (m) => B - m * 3.95;
    let s = `<line x1="40" y1="${B}" x2="400" y2="${B}" stroke="var(--ink)" stroke-width="2"/>`;
    for (let m = 0; m <= 60; m += 10) s += `<line x1="36" y1="${Ym(m)}" x2="40" y2="${Ym(m)}" class="ax"/>${tx(32, Ym(m) + 4, m, 'tl', 'end')}`;
    s += tx(4, 12, 'Height (m)', 'al', 'start');
    const tree = (x, h, cw, ch, col) => `<line x1="${x}" y1="${B}" x2="${x}" y2="${Ym(h) + ch / 2}" stroke="var(--muted)" stroke-width="${h > 40 ? 5 : h > 20 ? 4 : 2.5}"/><ellipse cx="${x}" cy="${Ym(h)}" rx="${cw}" ry="${ch / 2}" fill="${col}" stroke="var(--ink)" stroke-width="1"/>`;
    const dark = 'color-mix(in srgb, var(--c3) 70%, var(--sheet))', mid = 'color-mix(in srgb, var(--c3) 48%, var(--sheet))', light = 'color-mix(in srgb, var(--c3) 28%, var(--sheet))';
    // buttress roots on the emergent
    s += `<path d="M150 ${B} L162 ${B - 26} L170 ${B} M190 ${B} L178 ${B - 26} L172 ${B}" fill="none" stroke="var(--muted)" stroke-width="2.5"/>`;
    s += [70, 125, 230, 285, 345, 380].map((x, k) => tree(x, 35 + (k % 3) * 2, 34, 30, mid)).join('');
    s += tree(170, 52, 38, 26, dark) + tree(318, 50, 30, 22, dark);
    s += [98, 200, 262, 360].map((x) => tree(x, 15, 18, 18, light)).join('');
    s += [56, 140, 215, 300, 390].map((x) => `<ellipse cx="${x}" cy="${Ym(3)}" rx="12" ry="7" fill="${light}" stroke="var(--ink)" stroke-width=".8"/>`).join('');
    s += `<rect x="40" y="${B - 3}" width="360" height="3" fill="var(--c2)" opacity=".6"/>`;
    const spots = { emergent: [250, 24, 186, Ym(54), 'start'], canopy: [86, 34, 70, Ym(35) - 14], understorey: [410, 186, 360, Ym(15), 'end'], shrub: [56, 296, 56, Ym(3) + 6], floor: [320, 296, 320, B - 1], buttress: [180, 296, 166, B - 12] };
    return svg(W, H + 14, o.alt || 'Layers of the Amazon rainforest', s + tags(spots, which));
  };
  // nutrient cycle (Gersmehl): biomass large, litter and soil small
  G.nutrient = (which, o = {}) => {
    const W = 420, H = 336, c = !!o.cleared;
    let s = `<defs><marker id="gah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink)"/></marker></defs>`;
    const B = [210, 100], Lt = [100, 236], S = [320, 236];
    s += `<circle cx="${B[0]}" cy="${B[1]}" r="${c ? 24 : 70}" fill="color-mix(in srgb, var(--c3) 30%, var(--sheet))" stroke="var(--ink)" stroke-width="1.8"/>${tx(B[0], B[1] + (c ? 42 : 5), 'Biomass', 'ftb')}`;
    s += `<circle cx="${Lt[0]}" cy="${Lt[1]}" r="${c ? 12 : 26}" fill="color-mix(in srgb, var(--c2) 30%, var(--sheet))" stroke="var(--ink)" stroke-width="1.8"/>${tx(Lt[0], Lt[1] + 44, 'Litter', 'ftb')}`;
    s += `<circle cx="${S[0]}" cy="${S[1]}" r="${c ? 14 : 24}" fill="color-mix(in srgb, var(--c4) 22%, var(--sheet))" stroke="var(--ink)" stroke-width="1.8"/>${tx(S[0], S[1] + 44, 'Soil', 'ftb')}`;
    const arr = (x1, y1, x2, y2, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--ink)" stroke-width="${w}" marker-end="url(#gah)"/>`;
    const w = c ? 1.5 : 4;
    s += arr(158, 150, 122, 206, w) + arr(132, 236, 288, 236, w) + arr(304, 210, 262, 152, w);
    s += arr(384, 26, 290, 66, 2) + arr(404, 252, 352, 240, 2) + arr(332, 262, 364, 312, c ? 6 : 2.5) + arr(88, 262, 56, 312, c ? 6 : 1.5);
    const spots = { fall: [92, 156, 140, 178, 'end'], decomp: [210, 270, 210, 236], uptake: [336, 160, 283, 181, 'start'], rain: [404, 66, 338, 46, 'end'], weathering: [404, 290, 378, 246, 'end'], leaching: [300, 314, 348, 287, 'end'], runoff: [20, 316, 72, 287, 'start'] };
    return svg(W, H, o.alt || (c ? 'Nutrient cycle after the forest is cleared' : 'Nutrient cycle of the tropical rainforest'), s + tags(spots, which));
  };
  // convectional rainfall
  G.convection = (which, o = {}) => {
    const W = 420, H = 300, B = 262;
    let s = `<defs><marker id="cah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--c2)"/></marker></defs>`;
    s += `<circle cx="52" cy="46" r="20" fill="var(--c2)" opacity=".85"/>`;
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; s += `<line x1="${52 + Math.cos(a) * 26}" y1="${46 + Math.sin(a) * 26}" x2="${52 + Math.cos(a) * 34}" y2="${46 + Math.sin(a) * 34}" stroke="var(--c2)" stroke-width="2.5"/>`; }
    s += `<line x1="70" y1="66" x2="140" y2="${B - 34}" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>`;
    s += `<rect x="20" y="${B}" width="380" height="${H - B}" fill="color-mix(in srgb, var(--c2) 25%, var(--sheet))"/>`;
    for (let x = 30; x < 400; x += 22) s += `<ellipse cx="${x}" cy="${B - 10}" rx="13" ry="11" fill="color-mix(in srgb, var(--c3) 55%, var(--sheet))" stroke="var(--ink)" stroke-width=".8"/>`;
    s += [170, 220, 270].map((x) => `<line x1="${x}" y1="${B - 26}" x2="${x}" y2="130" stroke="var(--c2)" stroke-width="3" marker-end="url(#cah)"/>`).join('');
    s += `<line x1="100" y1="112" x2="400" y2="112" stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="5 4"/>${tx(400, 128, 'condensation level', 'gn', 'end')}`;
    s += `<path d="M150 112 C 140 80, 170 58, 196 66 C 206 30, 262 30, 270 60 C 300 52, 318 82, 304 112 Z" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/>`;
    s += `<path d="M150 112 L304 112 L318 98 L136 98 Z" fill="color-mix(in srgb, var(--ink) 20%, var(--sheet))" stroke="none"/>`;
    for (let x = 166; x < 300; x += 14) s += `<line x1="${x}" y1="124" x2="${x - 8}" y2="${B - 34}" stroke="var(--c1)" stroke-width="1.6" stroke-dasharray="7 9"/>`;
    const spots = { sun: [104, 30, 70, 42, 'start'], et: [96, 196, 168, 214, 'end'], rising: [330, 190, 272, 170, 'start'], condense: [370, 156, 306, 112, 'start'], cloud: [330, 40, 268, 54, 'start'], rain: [96, 156, 172, 168, 'end'] };
    return svg(W, H, o.alt || 'Convectional rainfall over the rainforest', s + tags(spots, which));
  };
  // Amazon (Rio Negro) river level at Manaus through a typical year
  G.flood = (o = {}) => {
    const lev = [22, 24, 25.5, 26.8, 27.8, 28.3, 27.6, 25.2, 21.5, 18.5, 18, 19.6];
    let s = G.line([{ name: 'typical year', pts: lev.map((v, k) => [k + 1, v]) }],
      { x0: 1, x1: 12, y0: 10, y1: 30, xstep: 1, ystep: 5, ylab: 'River level (m)', title: o.title || 'Rio Negro at Manaus: typical river level by month (1 = Jan)', alt: 'River level at Manaus by month' });
    // record low, October 2024: about 12.1 m
    const yy = 222 - ((12.1 - 10) / 20) * 198;
    return s.replace('</svg>', `<line x1="52" y1="${yy}" x2="400" y2="${yy}" stroke="var(--pen)" stroke-width="1.6" stroke-dasharray="5 4"/><text x="396" y="${yy - 6}" class="al" text-anchor="end" style="fill:var(--pen)">record low 12.1 m, Oct 2024</text></svg>`);
  };

  /* ---------- real-outline maps (Natural Earth, built by tools/build-maps.py into mapdata.js) ---------- */
  const D = () => NP.geoData;
  const at = (m, lon, lat) => [+((lon - m.lon0) * m.kx).toFixed(1), +((m.lat1 - lat) * m.ky).toFixed(1)];
  const spotLL = (m, s) => { const [tx0, ty0] = at(m, s[0], s[1]), [px, py] = at(m, s[2], s[3]); return [tx0, ty0, px, py, s[4]]; };
  // graticule: lines every `step` degrees with labels on the left and bottom edges
  const grat = (m, step, o = {}) => {
    const lx = o.right ? m.w - 3 : 3, la = o.right ? 'end' : 'start';
    let s = '';
    const ns = (v) => (v === 0 ? '0°' : Math.abs(v) + '°' + (v > 0 ? 'N' : 'S')), ew = (v) => Math.abs(v) + '°' + (v < 0 ? 'W' : 'E');
    for (let lat = Math.ceil(m.lat0 / step) * step; lat <= m.lat1; lat += step) { const [, y] = at(m, m.lon0, lat); s += `<line x1="0" y1="${y}" x2="${m.w}" y2="${y}" stroke="var(--muted)" stroke-width="${lat === 0 ? 1.2 : 0.6}" stroke-dasharray="${lat === 0 ? '6 4' : '2 4'}" opacity=".8"/>${tx(lx, y - 3, lat === 0 ? 'Equator 0°' : ns(lat), 'gn', la)}`; }
    for (let lon = Math.ceil(m.lon0 / step) * step; lon <= m.lon1; lon += step) { const [x] = at(m, lon, m.lat0); if (x < 30 || x > m.w - 20) continue; s += `<line x1="${x}" y1="0" x2="${x}" y2="${m.h}" stroke="var(--muted)" stroke-width="0.6" stroke-dasharray="2 4" opacity=".8"/>${tx(x, m.h - 4, ew(lon), 'gn')}`; }
    return s;
  };
  const city = (m, lon, lat, name, anchor = 'start', dy = 4, dx = 7) => { const [x, y] = at(m, lon, lat); return `<circle cx="${x}" cy="${y}" r="4" class="sym" stroke="var(--sheet)" stroke-width="1.2"/>${name ? tx(x + (anchor === 'end' ? -dx : anchor === 'start' ? dx : 0), y + dy, name, 'ft', anchor) : ''}`; };
  const label = (m, lon, lat, t, cls = 'gn') => { const [x, y] = at(m, lon, lat); return tx(x, y, t, cls); };
  const scaleBar = (m, km, x, y, latc = 0) => { const px = ((km / (111.32 * Math.cos((latc * Math.PI) / 180))) * m.kx).toFixed(1); return `<rect x="${x}" y="${y}" width="${px / 2}" height="5" class="sym"/><rect x="${x + px / 2}" y="${y}" width="${px / 2}" height="5" fill="var(--sheet)" stroke="var(--ink)"/>${tx(x, y + 17, '0', 'gn')}${tx(+x + +px, y + 17, km + ' km', 'gn')}`; };
  const OCEAN = 'color-mix(in srgb, var(--c1) 14%, var(--sheet))';

  // the Amazon basin in northern South America
  G.amazonMap = (which, o = {}) => {
    const m = D().amazon, W = m.w, H = m.h;
    let s = `<rect width="${W}" height="${H}" fill="${OCEAN}"/><path d="${m.land}" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1"/>`;
    s += `<path d="${m.borders}" fill="none" stroke="var(--faint)" stroke-width=".7"/>`;
    s += `<path d="${m.basin}" fill="color-mix(in srgb, var(--c3) 32%, transparent)" stroke="var(--c3)" stroke-width="1.2"/>`;
    s += `<path d="${m.andes}" fill="color-mix(in srgb, var(--c2) 30%, transparent)" stroke="var(--c2)" stroke-width="1"/>`;
    s += `<path d="${m.rivers}" fill="none" stroke="var(--c1)" stroke-width="1.3" stroke-linejoin="round"/><path d="${m.main}" fill="none" stroke="var(--c1)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
    s += grat(m, 10);
    s += label(m, -51, -13, 'BRAZIL', 'ftb') + label(m, -75, -11, 'PERU') + label(m, -73.5, 3.2, 'COLOMBIA') + label(m, -64.5, 6.6, 'VENEZUELA') + label(m, -64, -18, 'BOLIVIA');
    s += label(m, -40, 6, 'Atlantic Ocean') + label(m, -79.5, -13, 'Pacific') + label(m, -79.5, -14.6, 'Ocean');
    s += city(m, -60.02, -3.12, 'Manaus', 'start', 14) + city(m, -48.5, -1.45, 'Belém', 'start', 13);
    s += north(W - 18, 30, 0.85) + scaleBar(m, 1000, 22, at(m, 0, -16.6)[1]);
    const spots = { andes: [-81, -4, -76.5, -8, 'start'], basin: [-41, -17, -60, -8, 'end'], river: [-54, 8, -55.5, -2.1], mouth: [-41, 1.5, -50.2, -0.4], negro: [-80.5, 6.5, -64.2, -0.5, 'start'] };
    const sp = {}; Object.keys(spots).forEach((k) => (sp[k] = spotLL(m, spots[k])));
    return svg(W, H, o.alt || 'Map of the Amazon basin in northern South America', s + tags(sp, which));
  };
  // Laos and its neighbours
  G.laosMap = (which, o = {}) => {
    const m = D().laos, W = m.w, H = m.h;
    let s = `<rect width="${W}" height="${H}" fill="${OCEAN}"/><path d="${m.land}" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1"/>`;
    s += `<path d="${m.laos}" fill="color-mix(in srgb, var(--c3) 30%, var(--sheet))" stroke="var(--ink)" stroke-width="1.6"/>`;
    s += `<path d="${m.borders}" fill="none" stroke="var(--faint)" stroke-width=".8"/>`;
    s += `<path d="${m.annamite}" fill="color-mix(in srgb, var(--c2) 26%, transparent)" stroke="var(--c2)" stroke-width="1" stroke-dasharray="3 2"/>`;
    if (m.lakes) s += `<path d="${m.lakes}" fill="${OCEAN}" stroke="var(--c1)" stroke-width=".8"/>`;
    s += `<path d="${m.mekong}" fill="none" stroke="var(--c1)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;
    const rail = [[102.6, 17.97], [102.45, 18.93], [102.135, 19.885], [101.98, 20.69], [101.67, 21.19], [101.0, 21.95], [100.98, 22.79], [101.35, 23.6]].map(([a, b]) => at(m, a, b));
    s += `<path d="M${rail.map((p) => p.join(' ')).join(' L')}" class="rail" stroke-width="2.4"/>${label(m, 101.9, 23.25, 'to Kunming')}`;
    s += grat(m, 2, { right: true });
    s += label(m, 104.3, 19.2, 'LAOS', 'ftb') + label(m, 103.2, 22.8, 'CHINA', 'ftb') + tx(at(m, 99.45, 21.6)[0], at(m, 99.45, 21.6)[1], 'MYANMAR', 'gn', 'start') + label(m, 101.2, 15.6, 'THAILAND', 'ftb') + label(m, 104.9, 13.9, 'CAMBODIA', 'ftb') + label(m, 105.4, 21.6, 'VIETNAM', 'ftb');
    s += label(m, 107.8, 20.4, 'Gulf of') + label(m, 107.8, 20.0, 'Tonkin') + label(m, 108.7, 17.0, 'South China') + label(m, 108.7, 16.6, 'Sea');
    s += city(m, 102.6, 17.97, 'Vientiane', 'end', 14) + city(m, 102.135, 19.885, 'Luang Prabang', 'end', 4) + city(m, 105.78, 15.12, 'Pakse', 'start', 4) + city(m, 100.5, 13.75, 'Bangkok', 'start', 4) + city(m, 105.85, 21.03, 'Hanoi', 'start', 4);
    s += north(W - 18, 30, 0.85) + scaleBar(m, 200, 16, at(m, 100, 15.2)[1], 18);
    const spots = { mekong: [100.0, 18.9, 101.25, 17.9, 'start'], rail: [99.6, 20.4, 102.06, 20.3, 'start'], mountains: [108.6, 18.4, 105.6, 17.6, 'end'], landlocked: [108.9, 13.6, 106.9, 14.9, 'end'] };
    const sp = {}; Object.keys(spots).forEach((k) => (sp[k] = spotLL(m, spots[k])));
    return svg(W, H, o.alt || 'Map of Laos and its neighbours', s + tags(sp, which));
  };
  // world locator: Laos, the USA (and New Zealand for reference)
  G.worldMap = (o = {}) => {
    const m = D().world, W = m.w, H = m.h;
    let s = `<rect width="${W}" height="${H}" fill="${OCEAN}"/><path d="${m.land}" fill="color-mix(in srgb, var(--muted) 18%, var(--sheet))" stroke="var(--faint)" stroke-width=".5"/>`;
    s += `<path d="${m.usa}" fill="var(--c1)" stroke="var(--ink)" stroke-width=".6"/><path d="${m.laos}" fill="var(--pen)" stroke="var(--ink)" stroke-width=".6"/><path d="${m.nz}" fill="var(--c3)"/>`;
    const [, ey] = at(m, 0, 0); s += `<line x1="0" y1="${ey}" x2="${W}" y2="${ey}" stroke="var(--muted)" stroke-dasharray="5 4" stroke-width=".8"/>`;
    const [lx, ly] = at(m, 102.5, 18.5); s += `<circle cx="${lx}" cy="${ly}" r="8" fill="none" stroke="var(--pen)" stroke-width="1.8"/>${tx(lx + 12, ly - 8, 'Laos', 'ftb', 'start')}`;
    s += label(m, -100, 52, 'USA', 'ftb') + label(m, 172, -35, 'NZ', 'gn') + tx(4, ey - 3, 'Equator', 'gn', 'start');
    return svg(W, H, o.alt || 'World map showing Laos and the United States', s);
  };
  /* a "put each statement in a category" question from a pool of [text, category index, why?] */
  G.sortGen = (pool, cats, o = {}) => () => {
    let items; let guard = 0;
    do items = R.shuffle(pool).slice(0, o.n || 4); while (new Set(items.map((x) => x[1])).size < Math.min(2, cats.length) && guard++ < 50);
    return { kind: 'sort', prompt: o.prompt || 'Sort each statement.', cats, items: items.map(([t, c, why]) => ({ t, c, why })),
      more: { idea: o.idea, steps: items.map(([t, c, why]) => ({ say: `${t}: <b>${cats[c]}</b>${why ? '. ' + why : ''}` })), trap: o.trap } };
  };
  /* a "label the figure" question */
  G.labelGen = (fig, names, o = {}) => () => {
    const keys = R.shuffle(Object.keys(names)).slice(0, o.n || 4), Lt = 'ABCDE';
    const which = {}; keys.forEach((k, i) => (which[k] = Lt[i]));
    return { kind: 'match', prompt: o.prompt || 'Match each letter to the right label.', fig: fig(which), pairs: keys.map((k, i) => ({ k: Lt[i], a: names[k] })), extra: o.extra || [],
      more: { idea: o.idea, steps: keys.map((k, i) => ({ say: `<b>${Lt[i]}</b> is <b>${names[k]}</b>${o.why && o.why[k] ? ': ' + o.why[k] : '.'}` })), trap: o.trap } };
  };
})();
