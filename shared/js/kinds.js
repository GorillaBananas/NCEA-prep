/* Extra question kinds for the written subjects (biology, economics):
   order  — build a chain of reasoning by putting statements in order
   match  — label a diagram or match terms, one drop-down per row
   shift  — shift the curves on an economic model (needs shared/js/econ.js)
   write  — a written answer, marked by AI against NZQA-style criteria, or self-marked against a model answer
   Each kind: check(q, input) → {ok, msg}; render(answerBox, q, api); optional answer(q), label, retry(), reveal(). */
(function () {
  const P = window.NP;
  const K = (P.kinds = P.kinds || {});
  const esc = (s) => P.esc(s);
  const words = (t) => (String(t).trim().match(/\S+/g) || []).length;

  /* ---------- order: put the links of an explanation in order ---------- */
  // q = { kind: 'order', prompt, items: [statements in the right order], given?: how many are placed for you }
  K.order = {
    label: 'The right order',
    check(q, order) {
      const n = q.items.length; let lead = 0; while (lead < n && order[lead] === lead) lead++;
      const ok = order.length === n && lead === n;
      return { ok, msg: ok ? null : lead > (q.given || 0) ? `The first ${lead} ${lead === 1 ? 'is' : 'are'} right. Each link must lead to the next one.` : 'Start with the cause, then follow each link to the final effect.' };
    },
    answer(q) { return `<ol class="chain-ans">${q.items.map((t) => `<li>${t}</li>`).join('')}</ol>`; },
    render(ans, q, api) {
      const n = q.items.length, given = q.given || 0;
      const st = (q._st = { placed: [], fixed: given, pool: [] });
      for (let k = 0; k < given; k++) st.placed.push(k);
      let rest = q.items.map((_, k) => k).slice(given);
      if (rest.length > 1) { let g = 0; do rest = P.R.shuffle(rest); while (rest.every((v, k) => k === 0 || v > rest[k - 1]) && g++ < 20); }
      st.pool = rest;
      ans.innerHTML = `<div class="chain"><ol class="chain-built"></ol><p class="muted small chain-help">Tap the statements in order. Tap a placed statement to send it back.</p><div class="chain-pool"></div><div class="row"><button class="btn chk" disabled>Check</button></div></div>`;
      const built = ans.querySelector('.chain-built'), pool = ans.querySelector('.chain-pool'), btn = ans.querySelector(".chk");
      st.draw = () => {
        built.innerHTML = st.placed.map((k, i) => `<li><button class="chip placed${i < st.fixed ? ' fixed' : ''}" data-i="${i}"${i < st.fixed ? ' disabled' : ''}>${q.items[k]}</button></li>`).join('') + (st.placed.length < n ? `<li class="slot" aria-hidden="true"></li>` : '');
        pool.innerHTML = st.pool.map((k) => `<button class="chip" data-k="${k}">${q.items[k]}</button>`).join('');
        pool.hidden = !st.pool.length;
        btn.disabled = api.done() || st.placed.length !== n;
        built.querySelectorAll('.chip:not(.fixed)').forEach((b) => (b.onclick = () => { if (api.done()) return; const i = +b.dataset.i; st.pool.push(...st.placed.splice(i, 1)); st.draw(); }));
        pool.querySelectorAll('.chip').forEach((b) => (b.onclick = () => { if (api.done()) return; const k = +b.dataset.k; st.pool.splice(st.pool.indexOf(k), 1); st.placed.push(k); st.draw(); }));
        P.math(ans);
      };
      btn.onclick = () => api.attempt(st.placed.slice());
      st.draw();
    },
    // keep the correct opening links; send the rest back
    retry(ans, q) {
      const st = q._st; let lead = st.fixed; while (lead < st.placed.length && st.placed[lead] === lead) lead++;
      st.pool = P.R.shuffle(st.pool.concat(st.placed.splice(lead)));
      st.fixed = lead; st.draw();
    },
    reveal(ans, q) {
      ans.querySelectorAll('.chain-built .chip').forEach((b, i) => b.classList.add(q._st.placed[i] === i ? 'good' : 'bad'));
      const h = ans.querySelector('.chain-help'); if (h) h.remove();
      const pool = ans.querySelector('.chain-pool'); if (pool) pool.hidden = true;
    },
  };

  /* ---------- match: one drop-down per label ---------- */
  // q = { kind: 'match', prompt, fig?, pairs: [{ k: 'A', a: 'Stroma' }], extra?: [distractor labels] }
  K.match = {
    label: 'Answers',
    check(q, sel) {
      const right = q.pairs.filter((p, k) => sel[k] === p.a).length, ok = right === q.pairs.length;
      return { ok, msg: ok ? null : `${right} of ${q.pairs.length} right.` };
    },
    answer(q) { return `<ul class="match-ans">${q.pairs.map((p) => `<li><b>${p.k}</b> ${p.a}</li>`).join('')}</ul>`; },
    render(ans, q, api) {
      const opts = P.R.shuffle([...new Set(q.pairs.map((p) => p.a).concat(q.extra || []))]);
      ans.innerHTML = `<div class="match">${q.pairs.map((p, k) => `<label class="mrow"><span class="mk">${p.k}</span><select data-k="${k}"><option value="">Choose…</option>${opts.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></label>`).join('')}<div class="row"><button class="btn chk" disabled>Check</button></div></div>`;
      const sels = [...ans.querySelectorAll('select')], btn = ans.querySelector(".chk");
      const upd = () => { btn.disabled = api.done() || sels.some((s) => !s.value); };
      sels.forEach((s) => (s.onchange = () => { s.closest('.mrow').classList.remove('bad'); upd(); }));
      btn.onclick = () => api.attempt(sels.map((s) => s.value));
    },
    retry(ans, q) {
      ans.querySelectorAll('select').forEach((s, k) => { const row = s.closest('.mrow'); if (s.value === q.pairs[k].a) { row.classList.add('good'); s.disabled = true; } else { row.classList.add('bad'); s.value = ''; } });
      ans.querySelector(".chk").disabled = true;
    },
    reveal(ans, q) { ans.querySelectorAll('select').forEach((s, k) => s.closest('.mrow').classList.add(s.value === q.pairs[k].a ? 'good' : 'bad')); },
  };

  /* ---------- shift: move the curves on a model ---------- */
  // q = { kind: 'shift', prompt, model: econ model spec, answer: { curveId: -1 | 0 | 1 }, wrong?: [{ v: {…}, msg }] }
  const movable = (q) => (q.model.curves || q.model.panels.flatMap((p) => p.curves)).filter((c) => c.move !== false);
  K.shift = {
    label: 'The right diagram',
    check(q, st) {
      const ids = movable(q).map((c) => c.id);
      const same = (v) => ids.every((id) => (v[id] || 0) === (st[id] || 0));
      const ok = same(q.answer);
      const w = !ok && (q.wrong || []).find((x) => same(x.v));
      const none = ids.every((id) => !st[id]);
      return { ok, msg: ok ? null : w ? w.msg : none ? 'Something does change here. Which curve does the event affect first?' : null };
    },
    answer(q) { return `<div class="q-fig">${P.econ.svg(q.model, q.answer)}</div>`; },
    render(ans, q, api) {
      const st = (q._st = {});
      const dir = (c) => (c.kind === 'flat' ? ['↓ Down', 'Up ↑'] : c.kind === 'ppf' ? ['← In', 'Out →'] : ['← Left', 'Right →']);
      ans.innerHTML = `<div class="shift"><div class="shift-fig q-fig"></div><div class="shift-ctl">${movable(q).map((c) => `<div class="sc-row"><span class="sc-name">${c.name || c.label}</span><div class="seg" role="group" aria-label="${esc(c.name || c.label)}" data-id="${c.id}"><button data-v="-1">${dir(c)[0]}</button><button data-v="0" class="on">No change</button><button data-v="1">${dir(c)[1]}</button></div></div>`).join('')}</div><div class="row"><button class="btn chk">Check</button></div></div>`;
      const fig = ans.querySelector('.shift-fig');
      const draw = () => { fig.innerHTML = P.econ.svg(q.model, st); };
      ans.querySelectorAll('.seg').forEach((g) => g.querySelectorAll('button').forEach((b) => (b.onclick = () => {
        if (api.done()) return;
        g.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
        st[g.dataset.id] = +b.dataset.v; draw();
      })));
      ans.querySelector(".chk").onclick = () => api.attempt(Object.assign({}, st));
      draw();
    },
    retry(ans) { ans.querySelectorAll('.seg').forEach((g) => g.classList.add('again')); },
  };

  /* ---------- write: a written answer ---------- */
  // q = { kind: 'write', prompt, qtext (the question, for the marker), ctx? (resource), target: 'A'|'M'|'E',
  //       model: [{ m, note, key }], earns, crit?: { A, M, E } marking points, std: { code, name }, subject }
  const RANK = { N: 0, A: 1, M: 2, E: 3 };
  const modelHtml = (q) => `<ol class="aim-steps">${q.model.map((st) => `<li class="${st.key ? 'key' : ''}"><div class="m">${st.m}</div>${st.note ? `<div class="pen note">${st.note}</div>` : ''}</li>`).join('')}</ol>${q.earns ? `<p class="aim-earns">${q.earns}</p>` : ''}`;
  K.write = {
    label: 'Model answer',
    check() { return { ok: false }; },
    answer(q) { return modelHtml(q); },
    render(ans, q, api) {
      const ai = !!(P.ai && P.ai.ready());
      const setup = (P.cfg && P.cfg.home ? P.cfg.home : '../') + 'settings.html';
      ans.innerHTML = `<div class="write">
        <label class="visually-hidden" for="wa${q._id = (K.write.n = (K.write.n || 0) + 1)}">Your answer</label>
        <textarea id="wa${q._id}" class="wa" rows="${q.rows || 6}" placeholder="Write your answer in full sentences. Use the key terms, and link each cause to its effect."></textarea>
        <div class="row"><button class="btn markit">${ai ? 'Mark my answer' : 'Compare with the model answer'}</button><span class="muted small wc">0 words</span></div>
        <p class="muted small wnote">${ai ? 'An AI marker checks it against NZQA-style criteria. It takes about 10 seconds.' : `AI marking is off on this computer, so you mark yourself against the model answer. <a href="${setup}">Turn on AI marking</a>.`}</p></div>`;
      const ta = ans.querySelector('textarea'), btn = ans.querySelector('.markit'), wc = ans.querySelector('.wc');
      ta.oninput = () => { const n = words(ta.value); wc.textContent = n + (n === 1 ? ' word' : ' words'); };
      setTimeout(() => ta.focus({ preventScroll: true }), 50);
      btn.onclick = async () => {
        const text = ta.value.trim();
        if (words(text) < 4) { api.fb.innerHTML = '<p class="warn">Write a little more first: at least a full sentence.</p>'; return; }
        if (!ai) return self(text);
        btn.disabled = true; ta.readOnly = true;
        api.fb.innerHTML = '<p class="marking"><span class="pen">Marking</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></p>';
        try {
          const r = await P.ai.mark(q, text);
          const ok = RANK[r.grade] >= RANK[q.target || 'A'];
          api.finish(ok, null, false, resultHtml(q, r, ok), { grade: r.grade, ai: true });
        } catch (e) {
          ta.readOnly = false;
          self(text, `<p class="warn">The AI marker did not answer (${esc(e.message)}). Mark yourself against the model answer this time.</p>`);
        }
      };
      function self(text, pre = '') {
        btn.disabled = true; ta.readOnly = true;
        api.fb.innerHTML = `${pre}<h4 class="aim-h">Model answer</h4>${modelHtml(q)}<div class="aim-self"><p><b>Mark yourself.</b> Did your answer make the <span class="hl">highlighted points</span>, in your own words?</p><div class="row"><button class="btn small yes">Yes</button><button class="btn ghost small no">Not all of them</button></div></div>`;
        P.math(api.fb);
        const done = (ok) => api.finish(ok, null, false, `${pre}<h4 class="aim-h">Model answer</h4>${modelHtml(q)}<p class="pen big">${ok ? `That is ${P.gradeName[q.target || 'A']}-level writing.` : 'Add the highlighted points to your answer. That is what lifts the grade.'}</p>`, { grade: ok ? q.target || 'A' : null, ai: false });
        api.fb.querySelector('.yes').onclick = () => done(true);
        api.fb.querySelector('.no').onclick = () => done(false);
      }
    },
  };
  const NEXT = { N: 'A', A: 'M', M: 'E' };
  function resultHtml(q, r, ok) {
    const gname = r.grade === 'N' ? 'Not yet Achieved' : P.gradeName[r.grade];
    const list = (h, xs, cls = '') => (xs && xs.length ? `<h4>${h}</h4><ul class="${cls}">${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');
    return `<div class="ai-res">
      <p class="ai-grade"><span class="pen big">${ok ? (r.grade === 'E' ? 'Excellence' : 'That earns ' + gname) : gname}</span>${r.grade !== 'N' ? P.lvl(r.grade) : ''}</p>
      <p>${esc(r.summary)}</p>
      ${list('What earned credit', r.good, 'good')}
      ${list('Fix these', r.errors, 'errs')}
      ${r.grade !== 'E' ? list(`To reach ${P.gradeName[NEXT[r.grade]]}`, r.next, 'next') : ''}
      ${r.better ? `<p class="better"><b>A sentence you could add:</b> ${esc(r.better)}</p>` : ''}
      <p class="muted small">Marked by AI. It is usually right, but check it against the model answer below.</p>
    </div>
    <details class="model-box"${ok ? '' : ' open'}><summary>Model answer</summary>${modelHtml(q)}</details>`;
  }
  P.modelHtml = modelHtml;
  P.gradeRank = RANK;

  /* ---------- question builders shared by the written subjects ---------- */
  const St = (say, m) => ({ say, m });
  // a multiple-choice question from a bank item: { q, a, w: [[wrong, why], …], why?, more?, fig? }
  P.bank = (items, opts = {}) => () => {
    const it = P.R.pick(items);
    const q = P.mcq({ prompt: it.q, fig: it.fig, more: it.more || { steps: [St(it.why || it.a)].concat(it.w.slice(0, 2).map(([t, why]) => St(`Not “${t}”: ${why}`))) } }, P.uniq([{ t: it.a, ok: true, why: it.why }].concat(P.R.shuffle(it.w).slice(0, 3).map(([t, why]) => ({ t, why })))));
    if (opts.grade) q.grade = opts.grade;
    return q;
  };
  // a "which term?" or "what does it mean?" question from a glossary: [[term, meaning], …] (at least 4)
  P.terms = (gloss) => () => {
    const [t, d] = P.R.pick(gloss), others = P.R.shuffle(gloss.filter((g) => g[0] !== t)).slice(0, 3);
    const more = { steps: [St(`<b>${t}</b>: ${d}`), St('Learn the exact meaning. The 2025 examiners gave Achieved to candidates who defined the key terms accurately, and marked down vague or wrong terms.')] };
    return Math.random() < 0.5
      ? P.mcq({ prompt: `Which term matches this meaning? <p class="defn">${d}</p>`, more }, [{ t, ok: true }].concat(others.map(([ot, od]) => ({ t: ot, why: `${ot} means: ${od}` }))))
      : P.mcq({ prompt: `What does <b>${t}</b> mean?`, more }, [{ t: d, ok: true }].concat(others.map(([ot, od]) => ({ t: od, why: `That describes ${ot}.` }))));
  };
  // an "order the chain" question from a bank: { q, steps: [in order], why?: [reason for each link] }
  P.chain = (items, given = 0) => () => {
    const it = P.R.pick(items);
    return { kind: 'order', prompt: it.q, items: it.steps, given, fig: it.fig,
      why: it.end || null,
      more: { idea: it.idea, steps: it.steps.map((s, k) => St(`${s}${it.why && it.why[k] ? ` <span class="muted">(${it.why[k]})</span>` : ''}`)), trap: it.trap || 'Jumping from the cause straight to the final effect. Examiners want every link in between.' } };
  };
})();
