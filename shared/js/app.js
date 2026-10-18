/* NCEA Prep — subject app: home, check-up, units, review, progress, parent report.
   Each subject page calls NP.start(config) after loading its unit files. */
(function () {
  const P = window.NP;
  const DAY = 86400000;
  const BOX_DAYS = [0, 1, 2, 4, 7, 14];

  P.start = (cfg) => {
    const KEY = 'ncea-prep:' + cfg.id;
    const app = document.getElementById('app');
    const units = (std) => std.units.map((id) => P.unitById[id]).filter(Boolean);
    const allUnits = () => cfg.standards.flatMap(units);
    // study order: foundations first, then rotate between standards so sessions stay varied
    const studyOrder = () => (cfg.order || []).map((id) => P.unitById[id]).filter(Boolean).concat(allUnits().filter((u) => !(cfg.order || []).includes(u.id)));
    const stdOf = (u) => cfg.standards.find((s) => s.units.includes(u.id));

    /* ---------- progress store (on this device) ---------- */
    let S;
    function load() {
      try { S = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { S = null; }
      if (!S || S.v !== 1) S = { v: 1, units: {}, days: [], secs: 0, diag: null, diagAt: 0 };
    }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage off: progress lasts this visit only */ } }
    const U = (id) => (S.units[id] = S.units[id] || { s: 0, d: null, b: 0, q: 0, box: 0, due: 0, t: 0, w: 0, e: 0, f: 0 });
    const today = () => new Date().toISOString().slice(0, 10);
    function touch() { const d = today(); if (!S.days.includes(d)) { S.days.push(d); if (S.days.length > 90) S.days.shift(); } save(); }
    load();

    // count active learning time (only while the tab is visible and a lesson page is open)
    let timing = null;
    setInterval(() => { if (timing && document.visibilityState === 'visible') { S.secs += 5; if (timing !== '*') U(timing).t += 5; save(); } }, 5000);

    const status = (id) => { const u = U(id); if (u.s === 2) return 'done'; if (u.d === 0) return 'weak'; if (u.s === 1 || u.w || u.e || u.f) return 'started'; return 'new'; };
    const statusText = { done: 'Done', weak: 'Weak spot', started: 'Started', new: '' };
    function nextUnit() {
      const list = studyOrder();
      return list.find((u) => status(u.id) === 'weak') || list.find((u) => status(u.id) === 'started') || list.find((u) => status(u.id) === 'new') || null;
    }
    const dueUnits = () => allUnits().filter((u) => { const x = U(u.id); return x.box > 0 && x.due <= Date.now(); });

    // a realistic daily pace that finishes with a few days spare for review
    function pace(n) {
      const days = Math.max(1, daysLeft() - 4);
      if (days <= 1) return 'Pick the top few and do them today.';
      const perDay = Math.max(1, Math.ceil(n / days));
      const finish = Math.ceil(n / perDay);
      return `${perDay === 1 ? 'One topic' : perDay + ' topics'} a day gets you through in ${finish} day${finish === 1 ? '' : 's'}, with time left for review before the exam.`;
    }
    function daysLeft() { const ms = new Date(cfg.exam.iso) - new Date(); return Math.ceil(ms / DAY); }
    const mins = (s) => { const m = Math.round(s / 60); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60) + ' min'; };

    /* ---------- page chrome ---------- */
    function frame(inner, o = {}) {
      timing = o.timing || null;
      app.innerHTML = `<div class="page${o.wide ? ' wide' : ''}">
        <header class="topbar"><nav class="crumbs"><a class="home" href="${cfg.home}">NCEA Prep</a><span aria-hidden="true">/</span>${o.crumb ? `<a href="#/">${cfg.title}</a><span aria-hidden="true">/</span><b>${o.crumb}</b>` : `<b>${cfg.title}</b>`}</nav>
        ${o.noNav ? '' : `<nav class="right"><a href="#/review">Review${dueUnits().length ? ` <span class="badge">${dueUnits().length}</span>` : ''}</a><a href="#/progress">Progress</a></nav>`}</header>
        <main>${inner}</main></div>`;
      window.scrollTo(0, 0);
      P.math(app);
      return app.querySelector('main');
    }

    /* ---------- home ---------- */
    function home() {
      const left = daysLeft();
      const nu = nextUnit();
      const due = dueUnits();
      const started = Object.keys(S.units).length > 0;
      const head = left > 1 ? `${left} days to the maths exam.` : left === 1 ? 'The maths exam is tomorrow.' : left === 0 ? 'Exam day. You have got this.' : 'The exam is done. Well played.';
      let actions;
      if (!S.diag) {
        actions = `<div class="actions"><a class="btn" href="#/diagnostic">Find my weak spots</a><a class="btn ghost" href="#contents">Choose a topic</a></div>
        <p class="muted small">The check-up is one question per topic, about 15 minutes. Or pick any topic below and start learning straight away.</p>`;
      } else {
        actions = `<div class="actions">${nu ? `<a class="btn" href="#/u/${nu.id}">Next up: ${nu.title}</a>` : '<span class="pen big">Every topic done. Keep the review ticking.</span>'}${due.length ? `<a class="btn ghost" href="#/review">Daily review (${due.length})</a>` : ''}</div>
        <p class="muted small">${nu && status(nu.id) === 'weak' ? 'Picked from your check-up: this is your weakest topic still to do.' : 'Or choose any topic below.'} <a class="linkbtn" href="#/diagnostic">Redo the check-up</a></p>`;
      }
      const contents = cfg.standards.map((std) => {
        const us = units(std);
        const done = us.filter((u) => status(u.id) === 'done').length;
        return `<section class="std" style="--sc:${std.col}">
          <div class="std-head"><h2>${std.short}</h2><p class="muted">AS ${std.code}, ${std.credits} credits. ${std.name}. <a class="practise" href="#/practice/${std.code}">Practise all of ${std.short.toLowerCase()}</a></p><p class="std-count"><b>${done}</b> of ${us.length} done</p></div>
          <ol class="units">${us.map((u) => { const st = status(u.id); return `<li class="unit-row is-${st}">
            ${st === 'done' ? '<span class="margin-mark" aria-hidden="true">✓</span>' : st === 'weak' ? '<span class="margin-mark" aria-hidden="true">!</span>' : ''}
            <a href="#/u/${u.id}"><span class="ut">${u.title}</span><span class="ub">${u.blurb}</span></a>
            <span class="us">${statusText[st] || u.mins + ' min'}</span></li>`; }).join('')}</ol></section>`;
      }).join('');
      const m = frame(`<section class="hero">
          <span class="margin-mark date" aria-hidden="true">${cfg.exam.short}</span>
          <h1>${head}</h1>
          <p class="lede">Exam: ${cfg.exam.text}. ${cfg.lede}</p>
          ${actions}
        </section>
        ${started ? '' : `<section class="how sheet"><h3>How each topic works</h3><ol class="steps5"><li><b>Watch</b> a one-minute animated explainer</li><li><b>Follow</b> a worked example, step by step</li><li><b>Finish</b> one yourself, with the start done for you</li><li><b>Quiz</b>: five quick questions with instant feedback</li><li><b>Exam tips</b>: what earns the marks</li></ol></section>`}
        <div id="contents">${contents}</div>
        <section class="mixed sheet"><div><h3>Final week: mix all three papers</h3><p class="muted">12 questions across algebra, calculus and probability, in random order, like the real exam.</p></div><a class="btn" href="#/practice/all">Start mixed practice</a></section>
        <footer class="foot muted small"><p>Content follows the NZQA standards ${cfg.standards.map((s) => s.code).join(', ')}. Past papers and marking schedules are on the <a href="${cfg.nzqa}" target="_blank" rel="noopener">NZQA subject page</a>.</p></footer>`, { wide: false });
      const c = m.querySelector('a[href="#contents"]'); if (c) c.onclick = (e) => { e.preventDefault(); document.getElementById('contents').scrollIntoView({ behavior: 'smooth' }); };
    }

    /* ---------- unit ---------- */
    const TABS = [['watch', 'Watch'], ['example', 'Example'], ['turn', 'Your turn'], ['quiz', 'Quiz'], ['tips', 'Exam tips']];
    function unit(id, tab) {
      const u = P.unitById[id]; if (!u) return home();
      const std = stdOf(u); const x = U(id);
      if (x.s === 0) { x.s = 1; }
      touch();
      tab = TABS.some((t) => t[0] === tab) ? tab : (x.w ? (x.e ? (x.f ? 'quiz' : 'turn') : 'example') : 'watch');
      const doneTab = { watch: x.w, example: x.e, turn: x.f, quiz: x.s === 2, tips: 0 };
      const m = frame(`<section class="unit-head" style="--sc:${std.col}">
          <p class="std-tag">${std.short}</p>
          <h1 class="unit-title">${u.title}</h1>
          <p class="lede">${u.blurb}</p>
          <ol class="tabs" role="tablist">${TABS.map(([k, label], n) => `<li><a role="tab" href="#/u/${id}/${k}" class="${k === tab ? 'on' : ''}${doneTab[k] ? ' done' : ''}" aria-selected="${k === tab}"><span class="tn">${doneTab[k] ? '✓' : n + 1}</span>${label}</a></li>`).join('')}</ol>
        </section>
        <section class="panel" style="--sc:${std.col}"></section>`, { crumb: std.short, timing: id, wide: tab === 'watch' });
      const panel = m.querySelector('.panel');
      const go = (t) => { location.hash = '#/u/' + id + '/' + t; };
      const nextBtn = (label, t) => `<div class="row after"><button class="btn gonext" data-t="${t}">${label}</button></div>`;
      const wireNext = () => panel.querySelectorAll('.gonext').forEach((b) => (b.onclick = () => go(b.dataset.t)));

      if (tab === 'watch') {
        panel.innerHTML = `<div class="player-host"></div>${nextBtn('Next: worked example', 'example')}`;
        P.Player(panel.querySelector('.player-host'), u.scenes, { autoplay: true, onEnd: () => { x.w = 1; save(); } });
        panel.querySelector('.gonext').onclick = () => { x.w = 1; save(); go('example'); };
      }
      if (tab === 'example') {
        const ex = typeof u.example === 'function' ? u.example() : u.example;
        panel.innerHTML = `<div class="example sheet"><div class="ex-problem">${ex.problem}</div><ol class="ex-steps"></ol><div class="row"><button class="btn reveal">Show the first step</button><span class="muted small ex-count"></span></div></div><div class="ex-after" hidden>${nextBtn('Next: your turn', 'turn')}</div>`;
        P.math(panel);
        const list = panel.querySelector('.ex-steps'), btn = panel.querySelector('.reveal'), cnt = panel.querySelector('.ex-count');
        let k = 0;
        const step = () => {
          const s = ex.steps[k++];
          const li = P.h(`<li class="ex-step"><div class="m">${s.m}</div>${s.note ? `<div class="pen note">${s.note}</div>` : ''}</li>`);
          list.appendChild(li); P.math(li); requestAnimationFrame(() => li.classList.add('on'));
          cnt.textContent = k + ' of ' + ex.steps.length;
          if (k >= ex.steps.length) { btn.remove(); cnt.textContent = ''; panel.querySelector('.ex-after').hidden = false; x.e = 1; save(); wireNext(); }
          else btn.textContent = 'Show the next step';
        };
        btn.onclick = step;
      }
      if (tab === 'turn') {
        panel.innerHTML = `<p class="muted intro">The first steps are done for you. Finish it off. You get two tries.</p><div class="qhost"></div>`;
        const run = () => P.ask(panel.querySelector('.qhost'), u.faded(), { mode: 'practice', tries: 2, nextLabel: 'Start the quiz' }).then(() => { x.f = 1; save(); go('quiz'); });
        run();
      }
      if (tab === 'quiz') quiz(u, panel, x);
      if (tab === 'tips') {
        panel.innerHTML = `<div class="tips sheet"><ul>${u.tips.map((t) => `<li>${t}</li>`).join('')}</ul></div>
          <div class="row after">${(() => { const nu = nextAfter(u); return nu ? `<a class="btn" href="#/u/${nu.id}">Next topic: ${nu.title}</a>` : ''; })()}<a class="btn ghost" href="#/">All topics</a></div>`;
        P.math(panel);
      }
    }
    function nextAfter(u) {
      const list = studyOrder(); const i = list.indexOf(u);
      const later = list.slice(i + 1).concat(list.slice(0, i));
      return later.find((v) => status(v.id) === 'weak') || later.find((v) => status(v.id) !== 'done') || null;
    }

    function pickQs(u, n) {
      const gens = P.R.shuffle(u.gens);
      const qs = []; for (let k = 0; k < n; k++) qs.push(gens[k % gens.length]());
      return qs;
    }

    function quiz(u, panel, x) {
      const N = 5; const qs = pickQs(u, N); let k = 0, score = 0;
      panel.innerHTML = `<div class="pips">${qs.map(() => '<i></i>').join('')}</div><div class="qhost"></div>`;
      const pips = [...panel.querySelectorAll('.pips i')];
      const next = () => {
        if (k >= N) return result();
        pips[k].classList.add('now');
        P.ask(panel.querySelector('.qhost'), qs[k], { label: `Question ${k + 1} of ${N}`, nextLabel: k === N - 1 ? 'See my score' : 'Next question', onAnswer: (ok) => { pips[k].classList.remove('now'); pips[k].classList.add(ok ? 'ok' : 'no'); } })
          .then((r) => { if (r.ok) score++; k++; next(); });
      };
      const result = () => {
        x.q++; x.b = Math.max(x.b, score);
        const mastered = score >= 4;
        if (mastered) { if (x.s !== 2) { x.s = 2; x.box = 1; x.due = Date.now() + BOX_DAYS[1] * DAY; } if (x.d === 0) x.d = 1; }
        save(); touch();
        const nu = nextAfter(u);
        panel.innerHTML = `<div class="result sheet"><p class="score pen">${score}<span>/${N}</span></p>
          <h2>${mastered ? (score === N ? 'Perfect. Topic done.' : 'Topic done.') : score >= 2 ? 'Getting there.' : 'Worth another look.'}</h2>
          <p>${mastered ? 'It will come back in your daily review so it sticks. ' + (nu ? 'On to the next one.' : '') : 'Four out of five marks it done. Watch the explainer again or go straight back in: every quiz has new numbers.'}</p>
          <div class="row after">${mastered && nu ? `<a class="btn" href="#/u/${nu.id}">Next topic: ${nu.title}</a><a class="btn ghost" href="#/u/${u.id}/tips">Exam tips</a>` : `<button class="btn again">New set of questions</button><a class="btn ghost" href="#/u/${u.id}/watch">Watch again</a><a class="btn ghost" href="#/u/${u.id}/tips">Exam tips</a>`}</div></div>`;
        const a = panel.querySelector('.again'); if (a) a.onclick = () => quiz(u, panel, x);
      };
      next();
    }

    /* ---------- check-up (diagnostic) ---------- */
    function diagnostic() {
      const m = frame(`<section class="unit-head"><h1>Find your weak spots</h1>
        <p class="lede">One question from each topic. Skip anything you have not learned or cannot remember: that is exactly what this needs to find. No marks, no pressure.</p></section>
        <form class="sheet diag-setup"><p><b>Which standards are you sitting?</b> If you are not sure, leave all three ticked.</p>
        ${cfg.standards.map((s) => `<label class="check"><input type="checkbox" name="std" value="${s.code}" checked><span><b>${s.short}</b> <span class="muted">AS ${s.code}, ${units(s).length} questions</span></span></label>`).join('')}
        <div class="row"><button class="btn" type="submit">Start the check-up</button><span class="muted small est"></span></div></form>`, { crumb: 'Check-up' });
      const f = m.querySelector('form'), est = m.querySelector('.est');
      const upd = () => { const n = [...f.querySelectorAll('input:checked')].reduce((a, i) => a + units(cfg.standards.find((s) => s.code === i.value)).length, 0); est.textContent = n ? `${n} questions, about ${Math.max(3, Math.round(n * 0.7))} minutes` : 'Tick at least one'; f.querySelector('button').disabled = !n; };
      f.onchange = upd; upd();
      f.onsubmit = (e) => { e.preventDefault(); const codes = [...f.querySelectorAll('input:checked')].map((i) => i.value); runDiag(cfg.standards.filter((s) => codes.includes(s.code))); };
    }
    function runDiag(stds) {
      const list = stds.flatMap(units);
      const m = frame(`<div class="diag-run"><div class="dbar"><i></i></div><div class="qhost"></div><p class="row"><a class="linkbtn" href="#/diagnostic-results">Stop here and see my plan</a></p></div>`, { crumb: 'Check-up', timing: '*' });
      const host = m.querySelector('.qhost'), fill = m.querySelector('.dbar i');
      S.diag = S.diag || {}; let k = 0;
      const next = () => {
        if (k >= list.length) { S.diagAt = Date.now(); save(); location.hash = '#/diagnostic-results'; return; }
        const u = list[k]; const q = (u.diag || u.gens[0])();
        fill.style.width = (k / list.length) * 100 + '%';
        P.ask(host, q, { mode: 'diag', label: `${stdOf(u).short}: ${u.title} (${k + 1} of ${list.length})`, skip: 'I don’t know this yet', nextLabel: k === list.length - 1 ? 'See my plan' : 'Next' })
          .then((r) => { const x = U(u.id); if (x.s !== 2) x.d = r.ok ? 1 : 0; S.diag[u.id] = r.ok ? 1 : 0; touch(); k++; next(); });
      };
      next();
    }
    function diagResults() {
      if (!S.diag) return diagnostic();
      S.diagAt = S.diagAt || Date.now(); save();
      const list = studyOrder().filter((u) => S.diag[u.id] != null);
      const weak = list.filter((u) => S.diag[u.id] === 0 && status(u.id) !== 'done'), ok = list.filter((u) => S.diag[u.id] === 1);
      const row = (u) => `<li class="unit-row"><a href="#/u/${u.id}"><span class="ut">${u.title}</span><span class="ub">${stdOf(u).short}</span></a><span class="us">${u.mins} min</span></li>`;
      frame(`<section class="unit-head"><h1>${weak.length ? 'Here is your plan.' : 'Strong start.'}</h1>
        <p class="lede">${weak.length ? `${weak.length} topic${weak.length > 1 ? 's' : ''} to work on, about ${weak.reduce((a, u) => a + u.mins, 0)} minutes in all. ${pace(weak.length)} The order starts with the basics every paper needs, then mixes algebra, calculus and probability.` : 'Nothing obvious to fix. Work through the quizzes to lock it in, and keep up the daily review.'}</p>
        ${weak.length ? `<div class="actions"><a class="btn" href="#/u/${weak[0].id}">Start: ${weak[0].title}</a></div>` : ''}</section>
        ${weak.length ? `<section class="std"><h2>Work on these</h2><ol class="units">${weak.map(row).join('')}</ol></section>` : ''}
        ${ok.length ? `<section class="std"><h2>Looking good</h2><p class="muted">Right in the check-up. Do the quiz to make it count as done.</p><ol class="units">${ok.map(row).join('')}</ol></section>` : ''}`, { crumb: 'Your plan' });
    }

    /* ---------- daily mixed review ---------- */
    function review() {
      let pool = dueUnits();
      const learning = allUnits().filter((u) => U(u.id).s === 1 && !pool.includes(u));
      const done = allUnits().filter((u) => U(u.id).s === 2 && !pool.includes(u));
      pool = pool.concat(P.R.shuffle(learning), P.R.shuffle(done)).slice(0, 6);
      if (!pool.length) {
        frame(`<section class="unit-head"><h1>Nothing to review yet.</h1><p class="lede">Finish a topic quiz first. Topics come back here a day later, then after 2, 4, 7 and 14 days, which is when memories need a top-up.</p><div class="actions"><a class="btn" href="#/">Choose a topic</a></div></section>`, { crumb: 'Review' });
        return;
      }
      const items = P.R.shuffle(pool).map((u) => ({ u, q: P.R.pick(u.gens)() }));
      const m = frame(`<section class="unit-head"><h1>Daily review</h1><p class="lede">${items.length} mixed questions from topics you have done. Mixing them up is harder, and that is the point: it is how the exam feels.</p></section><div class="pips">${items.map(() => '<i></i>').join('')}</div><div class="qhost"></div>`, { crumb: 'Review', timing: '*' });
      const pips = [...m.querySelectorAll('.pips i')]; let k = 0, score = 0;
      const next = () => {
        if (k >= items.length) {
          touch();
          m.querySelector('.qhost').innerHTML = `<div class="result sheet"><p class="score pen">${score}<span>/${items.length}</span></p><h2>${score === items.length ? 'Clean sweep.' : 'Review done.'}</h2><p>Topics you got right come back later; the ones you missed come back tomorrow.</p><div class="row after"><a class="btn" href="#/">Back to topics</a></div></div>`;
          m.querySelector('.pips').remove(); return;
        }
        const { u, q } = items[k]; pips[k].classList.add('now');
        P.ask(m.querySelector('.qhost'), q, { label: `${stdOf(u).short}: ${u.title}`, nextLabel: k === items.length - 1 ? 'Finish' : 'Next question', onAnswer: (ok) => { pips[k].classList.remove('now'); pips[k].classList.add(ok ? 'ok' : 'no'); } })
          .then((r) => {
            const x = U(u.id);
            if (r.ok) { score++; if (x.s === 2) { x.box = Math.min(5, x.box + 1); x.due = Date.now() + BOX_DAYS[x.box] * DAY; } }
            else { if (x.s === 2) { x.box = 1; x.due = Date.now() + DAY; } }
            save(); k++; next();
          });
      };
      next();
    }

    /* ---------- mixed practice for one standard (or all) ---------- */
    function practice(code) {
      const std = cfg.standards.find((s) => s.code === code);
      const pool = std ? units(std) : allUnits();
      const N = std ? Math.max(8, pool.length + 2) : 12;
      const picks = P.R.shuffle(pool).concat(P.R.shuffle(pool)).slice(0, N);
      const items = picks.map((u) => ({ u, q: P.R.pick(u.gens)() }));
      const title = std ? `${std.short} practice` : 'Mixed practice';
      const m = frame(`<section class="unit-head" style="--sc:${std ? std.col : 'var(--ink)'}"><h1>${title}</h1><p class="lede">${N} questions from ${std ? 'every ' + std.short.toLowerCase() + ' topic' : 'all three papers'}, in random order, like the exam. About ${Math.round(N * 1.5)} minutes. Use paper and your calculator.</p></section><div class="pips">${items.map(() => '<i></i>').join('')}</div><div class="qhost"></div>`, { crumb: title, timing: '*' });
      const pips = [...m.querySelectorAll('.pips i')]; let k = 0; const missed = new Map(); const t0 = Date.now();
      const next = () => {
        if (k >= items.length) {
          touch();
          const score = items.length - [...missed.values()].reduce((a, b) => a + b, 0);
          const mins = Math.max(1, Math.round((Date.now() - t0) / 60000));
          m.querySelector('.pips').remove();
          m.querySelector('.qhost').innerHTML = `<div class="result sheet"><p class="score pen">${score}<span>/${items.length}</span></p><h2>${score === items.length ? 'Exam ready on this one.' : score >= items.length * 0.7 ? 'Solid.' : 'Good practice. Now fix the gaps.'}</h2><p>${mins} minute${mins === 1 ? '' : 's'}.${missed.size ? ' Go back over these topics:' : ''}</p>
            ${missed.size ? `<ol class="units">${[...missed.keys()].map((u) => `<li class="unit-row"><a href="#/u/${u.id}"><span class="ut">${u.title}</span><span class="ub">${stdOf(u).short}</span></a><span class="us">${missed.get(u)} missed</span></li>`).join('')}</ol>` : ''}
            <div class="row after"><button class="btn again">Another set</button><a class="btn ghost" href="#/">Back to topics</a></div></div>`;
          m.querySelector('.again').onclick = () => practice(code);
          return;
        }
        const { u, q } = items[k]; pips[k].classList.add('now');
        P.ask(m.querySelector('.qhost'), q, { label: std ? `Question ${k + 1} of ${items.length}` : `Question ${k + 1} of ${items.length}: ${stdOf(u).short}`, nextLabel: k === items.length - 1 ? 'See my score' : 'Next question', onAnswer: (ok) => { pips[k].classList.remove('now'); pips[k].classList.add(ok ? 'ok' : 'no'); } })
          .then((r) => {
            const x = U(u.id);
            if (r.ok) { if (x.s === 2) { x.box = Math.min(5, x.box + 1); x.due = Date.now() + BOX_DAYS[x.box] * DAY; } }
            else { missed.set(u, (missed.get(u) || 0) + 1); if (x.s === 2) { x.box = 1; x.due = Date.now() + DAY; } }
            save(); k++; next();
          });
      };
      next();
    }

    /* ---------- progress + share with parent ---------- */
    function encode() {
      const u = {}; for (const un of allUnits()) { const x = U(un.id); u[un.id] = [x.s, x.d == null ? -1 : x.d, x.b, x.q, Math.round(x.t / 60)]; }
      const data = { c: cfg.id, at: Date.now(), m: Math.round(S.secs / 60), days: S.days.slice(-30), dg: S.diag ? 1 : 0, u };
      return btoa(unescape(encodeURIComponent(JSON.stringify(data)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    function decode(code) { try { const b = code.replace(/-/g, '+').replace(/_/g, '/'); return JSON.parse(decodeURIComponent(escape(atob(b)))); } catch (e) { return null; } }
    const statusFrom = (s, d) => (s === 2 ? 'done' : d === 0 ? 'weak' : s === 1 ? 'started' : 'new');

    function report(d, mine) {
      const ago = (ts) => { const h = Math.round((Date.now() - ts) / 3600000); return h < 1 ? 'just now' : h < 24 ? h + ' hours ago' : Math.round(h / 24) + ' days ago'; };
      const lastDay = d.days.length ? d.days[d.days.length - 1] : null;
      const weekDays = d.days.filter((x) => Date.now() - new Date(x) < 7 * DAY).length;
      const stds = cfg.standards.map((std) => {
        const us = units(std);
        const rows = us.map((un) => { const r = d.u[un.id] || [0, -1, 0, 0, 0]; const st = statusFrom(r[0], r[1]); return { un, st, r }; });
        const done = rows.filter((r) => r.st === 'done').length;
        return `<section class="std" style="--sc:${std.col}"><div class="std-head"><h2>${std.short}</h2><p class="std-count"><b>${done}</b> of ${us.length} done</p></div>
          <div class="meter"><i style="width:${(done / us.length) * 100}%"></i></div>
          <table class="rep"><thead><tr><th>Topic</th><th>Status</th><th>Best quiz</th><th>Time</th></tr></thead><tbody>${rows.map(({ un, st, r }) => `<tr class="is-${st}"><td>${un.title}</td><td>${{ done: 'Done', weak: 'Weak spot', started: 'Started', new: 'Not started' }[st]}</td><td>${r[3] ? r[2] + '/5' : '–'}</td><td>${r[4] ? r[4] + ' min' : '–'}</td></tr>`).join('')}</tbody></table></section>`;
      }).join('');
      return `<div class="stats"><div><b>${mins(d.m * 60)}</b><span>learning in total</span></div><div><b>${d.days.length}</b><span>day${d.days.length === 1 ? '' : 's'} active</span></div><div><b>${weekDays}</b><span>of the last 7 days</span></div><div><b>${lastDay ? (lastDay === today() ? 'Today' : lastDay) : '–'}</b><span>last session</span></div></div>
        ${!d.dg ? '<p class="note-box">The check-up has not been done yet, so weak spots are not known.</p>' : ''}
        ${stds}
        ${mine ? '' : `<p class="muted small">Snapshot made ${ago(d.at)}. Ask for a fresh link to see newer progress.</p>`}`;
    }

    function progress() {
      const d = { c: cfg.id, at: Date.now(), m: Math.round(S.secs / 60), days: S.days, dg: S.diag ? 1 : 0, u: {} };
      for (const un of allUnits()) { const x = U(un.id); d.u[un.id] = [x.s, x.d == null ? -1 : x.d, x.b, x.q, Math.round(x.t / 60)]; }
      const link = location.href.split('#')[0] + '#/dad/' + encode();
      const m = frame(`<section class="unit-head"><h1>Your progress</h1><p class="lede">Saved on this computer. Use the same browser to keep your progress.</p></section>
        <section class="share sheet"><h3>Send your progress to Dad</h3><p class="muted">This makes a link with your topic scores and time spent. Nothing else.</p>
        <div class="row"><button class="btn copy">Copy link</button><a class="btn ghost" href="mailto:?subject=${encodeURIComponent('My NCEA maths progress')}&body=${encodeURIComponent(link)}">Email it</a><span class="pen copied" hidden>Copied</span></div></section>
        ${report(d, true)}
        <p class="row"><button class="linkbtn reset">Reset all progress on this computer</button></p>`, { crumb: 'Progress', wide: true });
      m.querySelector('.copy').onclick = async () => { try { await navigator.clipboard.writeText(link); } catch (e) { prompt('Copy this link:', link); } m.querySelector('.copied').hidden = false; };
      m.querySelector('.reset').onclick = () => { if (confirm('Delete all progress on this computer? This cannot be undone.')) { localStorage.removeItem(KEY); load(); home(); } };
    }
    function dad(code) {
      const d = decode(code);
      if (!d || d.c !== cfg.id) { frame(`<section class="unit-head"><h1>That link did not open.</h1><p class="lede">It may have been cut short when it was copied. Ask for the link again.</p></section>`, { crumb: 'Progress report', noNav: true }); return; }
      frame(`<section class="unit-head"><h1>Progress report</h1><p class="lede">${cfg.full}. Exam: ${cfg.exam.text}.</p></section>${report(d, false)}`, { crumb: 'Progress report', wide: true, noNav: true });
    }

    /* ---------- router ---------- */
    function route() {
      const h = location.hash.replace(/^#\/?/, '');
      const [a, b, c] = h.split('/');
      if (a === 'u') return unit(b, c);
      if (a === 'diagnostic') return diagnostic();
      if (a === 'diagnostic-results') return diagResults();
      if (a === 'review') return review();
      if (a === 'practice') return practice(b);
      if (a === 'progress') return progress();
      if (a === 'dad') return dad(b || '');
      if (a === 'contents') { home(); document.getElementById('contents').scrollIntoView(); return; }
      home();
    }
    window.addEventListener('hashchange', route);
    route();
  };
})();
