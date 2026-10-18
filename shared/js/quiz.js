/* Question renderer with instant, explanatory feedback.
   q = { kind: 'num'|'multi'|'mcq', prompt, fig?, scaffold?, answer, answerTex?, choices?, sol?, hint?, dp?, fmt?, wrong? } */
(function () {
  const P = window.NP;
  const TICK = '<svg class="tick" viewBox="0 0 60 44" aria-hidden="true"><path d="M4 24 C 10 28, 16 34, 21 40 C 28 26, 40 12, 56 4"/></svg>';
  const CROSS = '<svg class="cross" viewBox="0 0 44 44" aria-hidden="true"><path d="M8 8 C 18 18, 28 28, 36 37"/><path d="M36 7 C 27 17, 17 28, 7 38"/></svg>';

  function fmtHint(q) {
    if (q.fmt) return q.fmt;
    if (q.kind === 'multi') return q.ordered ? 'Give the values in the order asked, separated by a comma.' : 'Separate your answers with a comma, e.g. 2, −5';
    if (q.dp != null) return 'Give your answer to ' + q.dp + ' decimal place' + (q.dp === 1 ? '' : 's') + '.';
    return 'Fractions like 3/4 are fine.';
  }
  function answerText(q) {
    if (q.answerTex) return '$' + q.answerTex.replace(/</g, '\\lt ') + '$';
    if (q.kind === 'mcq') { const c = q.choices.find((c) => c.ok); return c ? c.t : ''; }
    if (q.kind === 'multi') return '$' + q.answer.map((a) => (q.dp != null ? P.f(a, q.dp) : P.nf(a))).join(',\\ ') + '$';
    return '$' + (q.dp != null ? P.f(q.answer, q.dp) : P.nf(q.answer)) + '$';
  }

  // The slower walkthrough behind "Still don't understand?": the big idea, then each step in plain words.
  // a step that is one whole equation is shown on its own line (display maths), so it never wraps mid-expression
  // and a line with two parts side by side (\qquad) is stacked, one part per line.
  // On narrow screens a long chain A = B = C is also stacked, one step per line, lined up on the = signs.
  const splitTop = (tex, sep) => { const out = []; let depth = 0, cur = ''; for (let i = 0; i < tex.length; i++) { const ch = tex[i]; if (ch === '{') depth++; else if (ch === '}') depth--; if (depth === 0 && tex.startsWith(sep, i)) { out.push(cur); cur = ''; i += sep.length - 1; continue; } cur += ch; } out.push(cur); return out; };
  const disp = (h) => {
    const t = String(h).trim(); if (!/^\$[^$]+\$$/.test(t)) return h;
    const tex = t.slice(1, -1), narrow = window.innerWidth < 700;
    let lines = tex.includes('\\qquad') ? tex.split('\\qquad') : [tex];
    if (narrow) {
      // "A ⇒ B": B starts a new line
      lines = lines.flatMap((l) => l.split(/(?:\\;\s*)?\\Rightarrow(?:\s*\\;)?/).map((x, k) => (k ? '\\Rightarrow ' + x.trim() : x.trim())));
      // "x = 2 or x = 3": one answer per line
      lines = lines.flatMap((l) => {
        const parts = l.split(/(?:\\quad\s*)?\\text\{\s*(or|and)\s*\}(?:\s*\\quad)?/);
        const out = [parts[0].trim()];
        for (let k = 1; k < parts.length; k += 2) out.push('\\text{' + parts[k] + ' }\\ ' + parts[k + 1].trim());
        return out;
      });
      // "a = 3, \quad b = 7": one item per line
      lines = lines.flatMap((l) => (/,\s*\\quad/.test(l) ? l.split(/\\quad/).map((x) => x.trim()) : [l]));
      // a long chain A = B = C: one step per line, lined up on the = signs
      lines = lines.map((l) => {
        if (/\\text|,/.test(l)) return l;
        const eq = splitTop(l, '=');
        return (eq.length > 2 && l.length > 24) || (eq.length === 2 && l.length > 30) ? '\\begin{aligned}' + eq[0] + ' &= ' + eq.slice(1).join(' \\\\ &= ') + '\\end{aligned}' : l;
      });
    }
    return '$$' + (lines.length > 1 ? '\\begin{gathered}' + lines.join('\\\\') + '\\end{gathered}' : lines[0]) + '$$';
  };
  // proper minus signs for negative numbers in plain text (maths is left to KaTeX)
  const minus = (h) => (h == null ? h : String(h).split(/(\$\$?[^$]*\$\$?|<[^>]+>)/).map((seg, i) => (i % 2 ? seg : seg.replace(/(^|[\s(:;,])-(?=\d)/g, '$1\u2212'))).join(''));
  function deepHtml(q) {
    const d = q.more || { steps: (q.sol || []).map((m) => ({ m })) };
    const idea = d.idea || (q.unit && q.unit.recap);
    let h = '<div class="deep">';
    if (idea) h += `<div class="deep-idea"><h4>The big idea</h4><p>${idea}</p></div>`;
    if (d.ask) h += `<p class="deep-ask"><b>What the question wants:</b> ${minus(d.ask)}</p>`;
    h += '<ol class="deep-steps">' + d.steps.map((st) => `<li>${st.say ? `<p class="say">${minus(st.say)}</p>` : ''}${st.m ? `<div class="m">${disp(minus(st.m))}</div>` : ''}</li>`).join('') + '</ol>';
    if (d.check) h += `<p class="deep-check"><b>Check it:</b> ${minus(d.check)}</p>`;
    if (d.trap) h += `<p class="deep-trap"><span class="pen">Watch out:</span> ${minus(d.trap)}</p>`;
    return h + '</div>';
  }
  let qid = 0;
  P.deepHtml = deepHtml; P.disp = (h) => disp(minus(h)); // exposed for tools/walkthroughs.html

  // Render one question. Resolves with {ok, skipped, tries} after the student continues.
  P.ask = (host, q, o = {}) => new Promise((resolve) => {
    const mode = o.mode || 'quiz';
    const tries = o.tries || 1;
    const el = P.h(`<div class="q sheet${mode === 'diag' ? ' diag' : ''}">
      ${o.label ? `<div class="q-label">${o.label}</div>` : ''}
      <div class="q-prompt">${q.prompt}</div>
      ${q.fig ? `<div class="q-fig">${q.fig}</div>` : ''}
      ${q.scaffold ? `<ol class="q-scaffold">${q.scaffold.map((s) => `<li>${s}</li>`).join('')}<li class="gap">?</li></ol>` : ''}
      <div class="q-answer"></div>
      <div class="q-feedback" aria-live="polite"></div>
      <div class="q-mark"></div>
    </div>`);
    host.innerHTML = ''; host.appendChild(el);
    const ans = el.querySelector('.q-answer'), fb = el.querySelector('.q-feedback'), mark = el.querySelector('.q-mark');
    let n = 0, finished = false;

    function finish(ok, msg, skipped) {
      finished = true;
      el.classList.add(ok ? 'is-right' : 'is-wrong');
      mark.innerHTML = ok ? TICK : skipped ? '' : CROSS;
      ans.querySelectorAll('input,button').forEach((b) => (b.disabled = true));
      let html = '';
      if (mode === 'diag') {
        html = ok ? '<p class="pen big">Correct</p>' : `<p class="pen big">${skipped ? 'Skipped. That is useful to know.' : 'Not this time. Noted for your plan.'}</p>`;
      } else if (ok) {
        html = `<p class="pen big">${P.R.pick(['Correct', 'Yes', 'Nailed it', 'Correct, nice working'])}</p>${q.sol ? '<button class="linkbtn showsol">See the full working</button><div class="sol" hidden></div>' : ''}`;
      } else {
        html = `<p class="pen big">${skipped ? 'Here is how it goes' : 'Not quite'}</p>${msg ? `<p class="why">${minus(msg)}</p>` : ''}<p class="ansline">Answer: ${answerText(q)}</p>${q.sol ? '<div class="sol"></div>' : ''}`;
        if (q.more || q.sol) html += `<button class="btn ghost small deepbtn" aria-expanded="false">Still don't understand? Show me step by step</button><div class="deephost" hidden></div>`;
      }
      html += `<div class="row q-next"><button class="btn small nextq">${o.nextLabel || 'Next'}</button></div>`;
      fb.innerHTML = html;
      const sol = fb.querySelector('.sol');
      if (sol) sol.innerHTML = '<ol>' + q.sol.map((s) => `<li>${disp(minus(s))}</li>`).join('') + '</ol>';
      const sb = fb.querySelector('.showsol'); if (sb) sb.onclick = () => { sol.hidden = false; sb.remove(); P.fit(sol); };
      const db = fb.querySelector('.deepbtn');
      if (db) db.onclick = () => {
        const dh = fb.querySelector('.deephost');
        dh.innerHTML = deepHtml(q) + (q.regen && (o.depth || 0) < 1 ? '<div class="row deep-try"><button class="btn small tryone">Try one like it</button><span class="muted small">Not scored. Same type, new numbers.</span></div><div class="nested"></div>' : '');
        dh.hidden = false; db.remove(); P.math(dh);
        dh.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const tb = dh.querySelector('.tryone');
        if (tb) tb.onclick = () => {
          const nq = q.regen(); nq.unit = q.unit; nq.regen = q.regen;
          const nest = dh.querySelector('.nested'); dh.querySelector('.deep-try').remove();
          P.ask(nest, nq, { mode: 'practice', tries: 2, depth: (o.depth || 0) + 1, label: 'Try one like it (not scored)', nextLabel: 'Done' })
            .then((r) => { nest.innerHTML = `<p class="pen big">${r.ok ? 'You have got it now.' : 'Keep going: it clicks with practice.'}</p><p class="muted small">Carry on with the ${o.nextLabel ? '“' + o.nextLabel + '”' : 'Next'} button below.</p>`; nx.focus({ preventScroll: true }); });
          nest.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
      };
      P.math(fb);
      const nx = fb.querySelector('.nextq'); nx.onclick = () => resolve({ ok, skipped: !!skipped, tries: n }); nx.focus({ preventScroll: true });
      if (o.onAnswer) o.onAnswer(ok);
    }

    function attempt(input) {
      if (finished) return;
      const r = P.check(q, input);
      if (r.invalid) { fb.innerHTML = '<p class="warn">I could not read that. ' + fmtHint(q) + '</p>'; P.math(fb); return; }
      n++;
      if (r.ok) return finish(true);
      if (n < tries) {
        fb.innerHTML = `<p class="pen big">Not quite. Have another go.</p>${r.msg ? `<p class="why">${minus(r.msg)}</p>` : q.hint ? `<p class="why">Hint: ${minus(q.hint)}</p>` : ''}`;
        P.math(fb);
        const inp = ans.querySelector('input'); if (inp) { inp.select(); }
        ans.querySelectorAll('.choice.picked').forEach((b) => { b.disabled = true; b.classList.add('struck'); });
        return;
      }
      finish(false, r.msg);
    }

    if (q.kind === 'mcq') {
      const pics = q.choices.some((c) => /<svg/.test(c.t));
      ans.innerHTML = '<div class="choices' + (pics ? ' pics' : '') + '">' + q.choices.map((c, k) => `<button class="choice" data-k="${k}"><span class="key">${'ABCD'[k]}</span><span>${c.t}</span></button>`).join('') + '</div>';
      ans.querySelectorAll('.choice').forEach((b) => (b.onclick = () => { ans.querySelectorAll('.choice').forEach((x) => x.classList.remove('picked')); b.classList.add('picked'); attempt(+b.dataset.k); if (finished) { const right = q.choices.findIndex((c) => c.ok); ans.querySelector(`[data-k="${right}"]`).classList.add('right'); } }));
    } else {
      const id = 'qa' + ++qid;
      ans.innerHTML = `<form class="numform" autocomplete="off"><label class="visually-hidden" for="${id}">Your answer</label><input id="${id}" class="numin" inputmode="decimal" spellcheck="false" placeholder="Your answer"><button class="btn" type="submit">Check</button></form><p class="fmt">${minus(fmtHint(q))}</p>`;
      const f = ans.querySelector('form'), inp = f.querySelector('input');
      f.onsubmit = (e) => { e.preventDefault(); if (inp.value.trim()) attempt(inp.value); };
      setTimeout(() => inp.focus({ preventScroll: true }), 50);
    }
    if (o.skip) {
      const sk = P.h(`<button class="linkbtn skip">${o.skip}</button>`);
      sk.onclick = () => { if (!finished) finish(false, null, true); };
      ans.appendChild(sk);
    }
    P.math(el);
  });

  /* ---------- tiny SVG figure builders for questions ---------- */
  const S = (P.svg = { n: 0 });
  // approximate width in px of a 12px axis label (digits and minus signs)
  const labW = (t) => String(t).length * 7 + 2;
  // smallest step (a multiple of base) that keeps evenly spaced labels apart
  const fitStep = (base, pxPerUnit, sample) => { const need = Math.max(...sample.map(labW)) + 8; let k = 1; while (base * k * pxPerUnit < need && k < 50) k++; return base * k; };
  // graph of functions. fns: [{f, col}], opts: {x0,x1,y0,y1, w, h, pts:[{x,y,label}], step, labels}
  S.graph = (fns, o) => {
    const w = o.w || 420, h = o.h || 300, pad = 30;
    const X = (x) => pad + ((x - o.x0) / (o.x1 - o.x0)) * (w - 2 * pad), Y = (y) => h - pad - ((y - o.y0) / (o.y1 - o.y0)) * (h - 2 * pad);
    let s = `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${o.alt || 'Graph'}">`;
    const step = o.step || 1;
    for (let x = Math.ceil(o.x0 / step) * step; x <= o.x1; x += step) s += `<line x1="${X(x)}" y1="${Y(o.y0)}" x2="${X(x)}" y2="${Y(o.y1)}" class="g"/>`;
    const ys = o.ystep || step;
    for (let y = Math.ceil(o.y0 / ys) * ys; y <= o.y1; y += ys) s += `<line x1="${X(o.x0)}" y1="${Y(y)}" x2="${X(o.x1)}" y2="${Y(y)}" class="g"/>`;
    if (o.y0 <= 0 && o.y1 >= 0) s += `<line x1="${X(o.x0)}" y1="${Y(0)}" x2="${X(o.x1)}" y2="${Y(0)}" class="ax"/>`;
    if (o.x0 <= 0 && o.x1 >= 0) s += `<line x1="${X(0)}" y1="${Y(o.y0)}" x2="${X(0)}" y2="${Y(o.y1)}" class="ax"/>`;
    if (o.labels !== false) {
      const pxX = (w - 2 * pad) / (o.x1 - o.x0), pxY = (h - 2 * pad) / (o.y1 - o.y0);
      const ls = fitStep(o.lstep || step, pxX, [o.x0, o.x1].map((v) => String(v).replace('-', '−')));
      for (let x = Math.ceil(o.x0 / ls) * ls; x <= o.x1; x += ls) if (x !== 0) s += `<text x="${X(x)}" y="${(o.y0 <= 0 && o.y1 >= 0 ? Y(0) : Y(o.y0)) + 14}" class="tl" text-anchor="middle">${String(x).replace('-', '−')}</text>`;
      let lys = o.lystep || ys; while (lys * pxY < 16) lys *= 2;
      if (o.ylabels !== false) for (let y = Math.ceil(o.y0 / lys) * lys; y <= o.y1; y += lys) if (y !== 0) s += `<text x="${(o.x0 <= 0 && o.x1 >= 0 ? X(0) : X(o.x0)) - 5}" y="${Y(y) + 4}" class="tl" text-anchor="end">${String(y).replace('-', '−')}</text>`;
    }
    const cid = 'cp' + (++S.n);
    s += `<clipPath id="${cid}"><rect x="${pad}" y="${pad}" width="${w - 2 * pad}" height="${h - 2 * pad}"/></clipPath><g clip-path="url(#${cid})">`;
    for (const fn of fns) {
      let d = '', n = 200, pen = false;
      for (let k = 0; k <= n; k++) { const x = o.x0 + ((o.x1 - o.x0) * k) / n, y = fn.f(x); if (!isFinite(y) || Math.abs(y) > 1e4) { pen = false; continue; } d += (pen ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(Math.max(o.y0 - 50, Math.min(o.y1 + 50, y))).toFixed(1); pen = true; }
      s += `<path d="${d}" class="cv" style="stroke:${fn.col || 'var(--c1)'}"/>`;
    }
    s += '</g>';
    for (const p of o.pts || []) s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4.5" class="pt"/>${p.label ? `<text x="${X(p.x) + (p.dx || 8)}" y="${Y(p.y) + (p.dy || -8)}" class="pl">${p.label}</text>` : ''}`;
    return s + '</svg>';
  };
  // histogram. groups: [{name, bins:[counts], col}], edges: [x0, x1, ...]
  S.hist = (groups, edges, o = {}) => {
    const w = o.w || 420, rowH = o.rowH || 130, pad = 34, h = groups.length * rowH + 30;
    const X = (x) => pad + ((x - edges[0]) / (edges[edges.length - 1] - edges[0])) * (w - 2 * pad);
    let s = `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${o.alt || 'Histograms'}">`;
    groups.forEach((g, gi) => {
      const top = gi * rowH + 18, base = top + rowH - 30, max = Math.max(...groups.flatMap((q) => q.bins));
      s += `<text x="${pad}" y="${top}" class="gl">${g.name}</text>`;
      g.bins.forEach((c, k) => { const bh = (c / max) * (rowH - 52); s += `<rect x="${X(edges[k]) + 1}" y="${base - bh}" width="${X(edges[k + 1]) - X(edges[k]) - 2}" height="${bh}" style="fill:${g.col || 'var(--c1)'}" class="bar"/>`; });
      s += `<line x1="${pad}" y1="${base}" x2="${w - pad}" y2="${base}" class="ax"/>`;
      const every = o.every || Math.ceil((Math.max(...edges.map(labW)) + 8) / (X(edges[1]) - X(edges[0])));
      edges.forEach((e, k) => { if (k % every === 0) s += `<text x="${X(e)}" y="${base + 14}" class="tl" text-anchor="middle">${e}</text>`; });
    });
    if (o.unit) s += `<text x="${w - pad}" y="${h - 2}" class="tl" text-anchor="end">${o.unit}</text>`;
    return s + '</svg>';
  };
  // probability tree. levels: first [{label,p}], then second per branch [[{label,p}],...]; p strings
  S.tree = (first, second, o = {}) => {
    const w = o.w || 460, h = o.h || (second ? 260 : 160);
    const x0 = 20, x1 = w * 0.42, x2 = w * 0.84;
    let s = `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="Probability tree">`;
    const n1 = first.length;
    const leafCount = second ? second.reduce((a, b) => a + b.length, 0) : n1;
    let leaf = 0;
    const ly = (k) => 20 + (k + 0.5) * ((h - 40) / leafCount);
    first.forEach((b, i) => {
      const kids = second ? second[i] : [];
      const ys = kids.map((_, j) => ly(leaf + j));
      const y1 = second ? (ys[0] + ys[ys.length - 1]) / 2 : ly(i);
      const ym = h / 2;
      s += `<line x1="${x0}" y1="${ym}" x2="${x1 - 40}" y2="${y1}" class="br"/><text x="${x1 - 34}" y="${y1 + 5}" class="nl">${b.label}</text><text x="${(x0 + x1 - 40) / 2}" y="${(ym + y1) / 2 + (y1 < ym ? -8 : 18)}" class="pp" text-anchor="middle">${b.p}</text>`;
      kids.forEach((c, j) => {
        const y2 = ys[j];
        s += `<line x1="${x1 + 4}" y1="${y1}" x2="${x2 - 40}" y2="${y2}" class="br"/><text x="${x2 - 34}" y="${y2 + 5}" class="nl">${c.label}</text><text x="${(x1 + x2 - 36) / 2}" y="${(y1 + y2) / 2 + (y2 < y1 ? -6 : 16)}" class="pp" text-anchor="middle">${c.p}</text>`;
      });
      leaf += second ? kids.length : 1;
    });
    return s + '</svg>';
  };
  // two-way table. rows: [name, ...cells], header: [corner, ...cols]
  S.table = (header, rows) => `<table class="twoway"><thead><tr>${header.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, k) => (k === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody></table>`;
  // normal curve with optional shading
  S.normal = (mu, sd, o = {}) => {
    const w = o.w || 420, h = o.h || 170, pad = 24;
    const xmin = mu - 3.6 * sd, xmax = mu + 3.6 * sd;
    const X = (x) => pad + ((x - xmin) / (xmax - xmin)) * (w - 2 * pad), base = h - 30, top = 16;
    const f = (x) => Math.exp(-((x - mu) ** 2) / (2 * sd * sd));
    const Y = (y) => base - y * (base - top);
    let d = '';
    for (let k = 0; k <= 160; k++) { const x = xmin + ((xmax - xmin) * k) / 160; d += (k ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(f(x)).toFixed(1); }
    let s = `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="Normal curve">`;
    if (o.shade) {
      const a = Math.max(xmin, o.shade[0] == null ? xmin : o.shade[0]), b = Math.min(xmax, o.shade[1] == null ? xmax : o.shade[1]);
      let sd2 = `M${X(a)} ${base}`; for (let k = 0; k <= 80; k++) { const x = a + ((b - a) * k) / 80; sd2 += `L${X(x).toFixed(1)} ${Y(f(x)).toFixed(1)}`; } sd2 += `L${X(b)} ${base}Z`;
      s += `<path d="${sd2}" class="shade"/>`;
    }
    s += `<path d="${d}" class="cv" style="stroke:var(--c1)"/><line x1="${pad}" y1="${base}" x2="${w - pad}" y2="${base}" class="ax"/>`;
    // Labels: the cut-off values matter most. Each takes the first row where it does not touch a neighbour
    // (up to three rows, with a leader line). The mean's label is shown only if it fits; its tick always stays.
    const all = o.marks || [{ x: mu, label: String(mu) }];
    const minor = (m) => all.length > 1 && Math.abs(m.x - mu) < 1e-9;
    const placed = []; let rows = 1;
    const fits = (l, r, row) => placed.every((q) => q.row !== row || r + 4 <= q.l || l >= q.r + 4);
    for (const m of all.filter((q) => !minor(q)).concat(all.filter(minor))) {
      const cx = X(m.x), hw = labW(m.label) / 2; let row = -1;
      for (let k = 0; k < (minor(m) ? 1 : 3); k++) if (fits(cx - hw, cx + hw, k)) { row = k; break; }
      if (row < 0 && minor(m)) { for (let k = 1; k < rows; k++) if (fits(cx - hw, cx + hw, k)) { row = k; break; } }
      placed.push({ m, cx, row, l: cx - hw, r: cx + hw });
      if (row >= 0) rows = Math.max(rows, row + 1);
    }
    for (const q of placed) {
      s += `<line x1="${q.cx}" y1="${base}" x2="${q.cx}" y2="${base + 5 + Math.max(0, q.row) * 13}" class="ax"/>`;
      if (q.row >= 0) s += `<text x="${q.cx}" y="${base + 18 + q.row * 16}" class="tl" text-anchor="middle">${q.m.label}</text>`;
    }
    if (rows > 1) s = s.replace(`viewBox="0 0 ${w} ${h}"`, `viewBox="0 0 ${w} ${h + 16 * (rows - 1)}"`);
    return s + '</svg>';
  };
})();
