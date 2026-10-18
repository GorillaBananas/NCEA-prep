/* NCEA Prep — core helpers shared by every subject.
   Plain script (no modules) so pages also work when opened straight from disk. */
(function () {
  const P = (window.NP = window.NP || {});
  P.units = [];
  P.unitById = {};
  P.addUnit = (u) => { P.units.push(u); P.unitById[u.id] = u; };

  /* ---------- random ---------- */
  const R = (P.R = {
    int(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
    nz(a, b) { let v; do v = R.int(a, b); while (v === 0); return v; },
    pick(a) { return a[Math.floor(Math.random() * a.length)]; },
    shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    sign() { return Math.random() < 0.5 ? -1 : 1; },
    distinct(n, a, b, avoid = []) { const out = []; let guard = 0; while (out.length < n && guard++ < 999) { const v = R.int(a, b); if (!out.includes(v) && !avoid.includes(v)) out.push(v); } return out; },
  });

  /* ---------- number formatting ---------- */
  const gcd = (P.gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; });
  P.round = (x, dp) => { const f = 10 ** dp; return Math.round((x + Number.EPSILON * Math.sign(x)) * f) / f; };
  // plain number for TeX, trimmed to dp places
  P.n = (x, dp = 4) => {
    if (Object.is(x, -0)) x = 0;
    if (Number.isInteger(x)) return String(x);
    return String(P.round(x, dp));
  };
  // fixed decimal places (for probabilities)
  P.f = (x, dp = 4) => P.round(x, dp).toFixed(dp);
  // best fraction approximation with small denominator, or null
  P.toFrac = (x, maxQ = 24) => {
    for (let q = 1; q <= maxQ; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) { const g = gcd(p, q); return [p / g, q / g]; } }
    return null;
  };
  // number as TeX, using a fraction where it is exact
  P.nf = (x) => {
    if (Number.isInteger(x)) return String(x);
    const fr = P.toFrac(x);
    if (!fr) return P.n(x);
    const [p, q] = fr;
    return (p < 0 ? '-' : '') + '\\frac{' + Math.abs(p) + '}{' + q + '}';
  };
  P.fracTex = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q); p /= g; q /= g; if (q === 1) return String(p); return (p < 0 ? '-' : '') + '\\frac{' + Math.abs(p) + '}{' + q + '}'; };

  // polynomial / sum of terms as TeX. terms: [[coef, power], ...]; coef may be fractional
  P.poly = (terms, v = 'x') => {
    let s = '';
    for (const [c, pw] of terms) {
      if (c === 0) continue;
      const neg = c < 0, a = Math.abs(c);
      s += s === '' ? (neg ? '-' : '') : (neg ? ' - ' : ' + ');
      let coef = P.nf(a);
      if (pw !== 0 && a === 1) coef = '';
      let vv = '';
      if (pw === 1) vv = v;
      else if (pw !== 0) vv = v + '^{' + P.nf(pw) + '}';
      s += coef + vv;
    }
    return s === '' ? '0' : s;
  };
  // signed constant for "x + 3" / "x - 3"
  P.sc = (c) => (c < 0 ? ' - ' + P.nf(-c) : ' + ' + P.nf(c));
  // factor for a root r: x - r, or just x when r = 0
  P.fac = (r, v = 'x') => (r === 0 ? v : '(' + v + P.sc(-r) + ')');
  // linear factor (x + c)
  P.lin = (c, v = 'x', a = 1) => '(' + (a === 1 ? '' : a === -1 ? '-' : a) + v + (c === 0 ? '' : P.sc(c)) + ')';
  // evaluate polynomial terms
  P.evalPoly = (terms, x) => terms.reduce((s, [c, p]) => s + c * x ** p, 0);
  P.dPoly = (terms) => terms.filter(([c, p]) => p !== 0 && c !== 0).map(([c, p]) => [c * p, p - 1]);
  P.iPoly = (terms) => terms.filter(([c]) => c !== 0).map(([c, p]) => [c / (p + 1), p + 1]);

  /* ---------- answer parsing ---------- */
  // safe arithmetic parser: + - * / ^ ( ) sqrt pi e, implicit multiply, fractions
  P.parseNum = (src) => {
    if (src == null) return NaN;
    let s = String(src).trim().toLowerCase()
      .replace(/[−–]/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/√/g, 'sqrt').replace(/π/g, 'pi')
      .replace(/^[a-z]{1,3}(\([a-z0-9]+\))?\s*=\s*/, '') // strip "x =", "f(2) ="
      .replace(/\s+/g, '');
    if (s.endsWith('%')) { const v = P.parseNum(s.slice(0, -1)); return v / 100; }
    let i = 0;
    const peek = () => s[i];
    const num = () => { const m = /^(\d+\.?\d*|\.\d+)(e[-+]?\d+)?/.exec(s.slice(i)); if (!m) return NaN; i += m[0].length; return parseFloat(m[0]); };
    const ident = () => { const m = /^[a-z]+/.exec(s.slice(i)); if (!m) return null; i += m[0].length; return m[0]; };
    function expr() { let v = term(); while (peek() === '+' || peek() === '-') { const op = s[i++]; const r = term(); v = op === '+' ? v + r : v - r; } return v; }
    function term() {
      let v = power();
      for (;;) {
        const c = peek();
        if (c === '*' || c === '/') { i++; const r = power(); v = c === '*' ? v * r : v / r; }
        else if (c === '(' || (c && /[a-z\d.]/.test(c))) { v *= power(); } // implicit multiply
        else return v;
      }
    }
    function power() { const b = unary(); if (peek() === '^') { i++; return b ** power(); } return b; }
    function unary() { if (peek() === '-') { i++; return -unary(); } if (peek() === '+') { i++; return unary(); } return primary(); }
    function primary() {
      const c = peek();
      if (c === '(') { i++; const v = expr(); if (peek() !== ')') return NaN; i++; return v; }
      if (c && /[a-z]/.test(c)) {
        const id = ident();
        if (id === 'pi') return Math.PI;
        if (id === 'e') return Math.E;
        const fns = { sqrt: Math.sqrt, ln: Math.log, log: Math.log10 };
        if (fns[id]) { const a = power(); return fns[id](a); }
        return NaN;
      }
      return num();
    }
    try { const v = expr(); return i === s.length ? v : NaN; } catch (e) { return NaN; }
  };
  P.parseList = (src) => String(src || '').split(/,|;|\bor\b|\band\b|&/i).map((x) => x.trim()).filter(Boolean).map(P.parseNum);

  P.tolFor = (q, a) => (q.tol != null ? q.tol : Math.max(0.006, Math.abs(a) * 0.0005));
  // check an answer. returns {ok, invalid, msg}
  P.check = (q, input) => {
    if (q.kind === 'mcq') { const ch = q.choices[input]; return { ok: !!(ch && ch.ok), msg: ch && ch.why }; }
    const near = (u, a) => Math.abs(u - a) <= P.tolFor(q, a);
    const wrongMsg = (vals) => { for (const w of q.wrong || []) { const wv = [].concat(w.v); if (wv.length === vals.length && wv.every((x, k) => near(vals[k], x))) return w.msg; } return null; };
    if (q.kind === 'num') {
      const v = P.parseNum(input);
      if (Number.isNaN(v)) return { ok: false, invalid: true };
      if (near(v, q.answer)) return { ok: true };
      // right value, wrong rounding?
      if (q.dp != null && Math.abs(v - q.answer) < 0.05 * Math.max(1, Math.abs(q.answer)) && Math.abs(v - q.answer) > P.tolFor(q, q.answer)) {
        const w = wrongMsg([v]); return { ok: false, msg: w || 'Close. Check your rounding: give the answer to ' + q.dp + ' decimal places.' };
      }
      return { ok: false, msg: wrongMsg([v]) };
    }
    if (q.kind === 'multi') {
      const vals = P.parseList(input);
      if (!vals.length || vals.some(Number.isNaN)) return { ok: false, invalid: true };
      const need = q.answer.length;
      if (vals.length !== need) return { ok: false, msg: 'There ' + (need === 1 ? 'is 1 answer' : 'are ' + need + ' answers') + ' here. Separate them with a comma.' };
      let ok;
      if (q.ordered) ok = vals.every((v, k) => near(v, q.answer[k]));
      else { const left = q.answer.slice(); ok = vals.every((v) => { const k = left.findIndex((a) => near(v, a)); if (k < 0) return false; left.splice(k, 1); return true; }); }
      if (ok) return { ok: true };
      const sorted = q.ordered ? vals : vals.slice();
      return { ok: false, msg: wrongMsg(sorted) || (q.ordered ? null : wrongMsg(vals.slice().reverse())) };
    }
    return { ok: false, invalid: true };
  };

  /* ---------- statistics ---------- */
  const phi = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  P.phi = phi;
  // standard normal CDF via erfc (Numerical Recipes Chebyshev fit, relative error < 1.2e-7)
  const erfc = (x) => {
    const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  };
  P.Phi = (z) => 0.5 * erfc(-z / Math.SQRT2);
  // inverse normal: Acklam's rational approximation, polished with Newton steps
  P.invPhi = (p) => {
    if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const pl = 0.02425; let x, q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    else if (p <= 1 - pl) { q = p - 0.5; r = q * q; x = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    else { q = Math.sqrt(-2 * Math.log(1 - p)); x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    for (let k = 0; k < 2; k++) x -= (P.Phi(x) - p) / phi(x);
    return x;
  };
  P.normCdf = (x, mu, sd) => P.Phi((x - mu) / sd);

  /* ---------- small helpers ---------- */
  P.esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  P.math = (el) => {
    if (!el || !window.renderMathInElement) return;
    window.renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], ignoredClasses: ['nomath'], throwOnError: false });
    P.fit(el);
  };
  // a displayed equation still wider than its box (e.g. on a phone) is scaled down to fit, to no less than 68%
  P.fit = (el) => {
    if (!el || !el.querySelectorAll) return;
    el.querySelectorAll('.katex-display').forEach((d) => {
      d.style.fontSize = '';
      const k = d.querySelector('.katex'), cw = d.clientWidth;
      if (!k || !cw) return;
      if (k.scrollWidth > cw) d.style.fontSize = Math.max(0.68, (cw - 4) / k.scrollWidth) + 'em';
    });
  };
  // money amounts must not be read as maths delimiters
  P.money = (v) => '<span class="nomath">$' + (typeof v === 'number' ? v.toLocaleString('en-NZ', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 }) : v) + '</span>';
  P.h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  // make a question from a unit's generator, remembering both so "Try one like it" can make another
  // make a question from a unit's generator, tagged with its unit and NCEA level (u.grades lines up with u.gens)
  P.gen = (u, g) => { const q = g(); q.unit = u; q.regen = g; const k = u.gens.indexOf(g); if (!q.grade && k >= 0 && u.grades) q.grade = u.grades[k]; return q; };
  // build an MCQ question: choices = [{t, ok, why}], shuffled
  P.mcq = (base, choices) => Object.assign({ kind: 'mcq', choices: R.shuffle(choices) }, base);
  // remove duplicate distractors (same text) keeping the correct one
  P.uniq = (choices) => { const seen = new Set(); return choices.filter((c) => { if (seen.has(c.t)) return false; seen.add(c.t); return true; }); };
})();
