/* Explainer player: short scenes, each a live visual plus a narration card.
   Scene = { dur, card: [{at, html}], board: [{at, tex|html, note, hl, wrong}] | draw(api) } */
(function () {
  const P = window.NP;
  const reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (x) => { x = clamp(x); return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };
  P.seg = (p, a, b) => ease((p - a) / (b - a));

  function colors(el) {
    const cs = getComputedStyle(el);
    const g = (n) => cs.getPropertyValue(n).trim();
    return { ink: g('--ink'), muted: g('--muted'), faint: g('--faint'), grid: g('--grid'), line: g('--line'), pen: g('--pen'), hl: g('--hl'), sheet: g('--sheet'), paper: g('--paper'), ok: g('--ok'), c1: g('--c1'), c2: g('--c2'), c3: g('--c3'), c4: g('--c4') };
  }

  function makeApi(ctx, W, H, t, p, C) {
    const fs = clamp(W / 34, 12, 19);
    const api = {
      ctx, W, H, t, p, C, fs, seg: P.seg, ease,
      view(x0, x1, y0, y1, pad = fs * 2.4) {
        const v = { x0, x1, y0, y1, pad };
        v.X = (x) => pad + ((x - x0) / (x1 - x0)) * (W - 2 * pad);
        v.Y = (y) => H - pad - ((y - y0) / (y1 - y0)) * (H - 2 * pad);
        return v;
      },
      axes(v, o = {}) {
        const step = o.step || 1, ystep = o.ystep || step;
        ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = C.grid;
        for (let x = Math.ceil(v.x0 / step) * step; x <= v.x1 + 1e-9; x += step) { ctx.beginPath(); ctx.moveTo(v.X(x), v.Y(v.y0)); ctx.lineTo(v.X(x), v.Y(v.y1)); ctx.stroke(); }
        for (let y = Math.ceil(v.y0 / ystep) * ystep; y <= v.y1 + 1e-9; y += ystep) { ctx.beginPath(); ctx.moveTo(v.X(v.x0), v.Y(y)); ctx.lineTo(v.X(v.x1), v.Y(y)); ctx.stroke(); }
        ctx.strokeStyle = C.muted; ctx.lineWidth = 1.6;
        if (v.y0 <= 0 && v.y1 >= 0) { ctx.beginPath(); ctx.moveTo(v.X(v.x0), v.Y(0)); ctx.lineTo(v.X(v.x1), v.Y(0)); ctx.stroke(); }
        if (v.x0 <= 0 && v.x1 >= 0) { ctx.beginPath(); ctx.moveTo(v.X(0), v.Y(v.y0)); ctx.lineTo(v.X(0), v.Y(v.y1)); ctx.stroke(); }
        if (o.labels !== false) {
          ctx.fillStyle = C.faint; ctx.font = `500 ${fs * 0.72}px Atkinson, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          const ly = v.y0 <= 0 && v.y1 >= 0 ? v.Y(0) + 4 : v.Y(v.y0) + 4;
          const lstep = o.lstep || step * (v.x1 - v.x0 > 12 ? 2 : 1);
          for (let x = Math.ceil(v.x0 / lstep) * lstep; x <= v.x1; x += lstep) if (Math.abs(x) > 1e-9) ctx.fillText(P.n(x, 2).replace('-', '−'), v.X(x), ly);
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          const lx = v.x0 <= 0 && v.x1 >= 0 ? v.X(0) - 6 : v.X(v.x0) - 6;
          const lys = o.lystep || ystep * ((v.y1 - v.y0) / ystep > 12 ? 2 : 1);
          for (let y = Math.ceil(v.y0 / lys) * lys; y <= v.y1; y += lys) if (Math.abs(y) > 1e-9) ctx.fillText(P.n(y, 2).replace('-', '−'), lx, v.Y(y));
        }
        ctx.restore();
      },
      plot(v, f, col, w = 3.5, upto = 1, from = v.x0, to = v.x1) {
        const end = from + (to - from) * clamp(upto); if (end <= from) return;
        ctx.save(); ctx.beginPath(); ctx.rect(v.X(v.x0), v.Y(v.y1), v.X(v.x1) - v.X(v.x0), v.Y(v.y0) - v.Y(v.y1)); ctx.clip();
        ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
        const n = 240; let started = false;
        for (let k = 0; k <= n; k++) { const x = from + ((end - from) * k) / n; const y = f(x); if (!isFinite(y)) { started = false; continue; } const px = v.X(x), py = v.Y(clamp(y, v.y0 - (v.y1 - v.y0), v.y1 + (v.y1 - v.y0))); if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py); }
        ctx.stroke(); ctx.restore();
      },
      dot(v, x, y, col, r = 6, alpha = 1) { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(v.X(x), v.Y(y), r, 0, 7); ctx.fill(); ctx.strokeStyle = C.sheet; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); },
      line(x1, y1, x2, y2, col, w = 2, dash) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); },
      text(str, x, y, o = {}) {
        ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
        const size = fs * (o.size || 1);
        const fam = o.font === 'pen' ? 'Pen, cursive' : o.font === 'head' ? 'Schibsted, sans-serif' : 'Atkinson, sans-serif';
        const wt = o.weight || (o.font === 'pen' ? 700 : o.font === 'head' ? 800 : 700);
        ctx.font = `${o.italic ? 'italic ' : ''}${wt} ${o.font === 'pen' ? size * 1.35 : size}px ${fam}`;
        ctx.fillStyle = o.col || C.ink; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle';
        if (o.bg) { const w = ctx.measureText(str).width; const pad = size * 0.35; let bx = x - (o.align === 'center' ? w / 2 : o.align === 'right' ? w : 0); ctx.fillStyle = o.bg; ctx.fillRect(bx - pad, y - size * 0.75, w + pad * 2, size * 1.5); ctx.fillStyle = o.col || C.ink; }
        ctx.fillText(str, x, y); ctx.restore();
      },
      tangent(v, f, df, a, span, col, alpha = 1) {
        const m = df(a), y = f(a);
        ctx.save(); ctx.globalAlpha = alpha; api.line(v.X(a - span), v.Y(y - m * span), v.X(a + span), v.Y(y + m * span), col, 3); ctx.restore();
        api.dot(v, a, y, col, 6, alpha); return m;
      },
      // shaded region under curve between a and b
      shade(v, f, a, b, col, alpha = 0.3) {
        ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(v.X(a), v.Y(0));
        const n = 120; for (let k = 0; k <= n; k++) { const x = a + ((b - a) * k) / n; ctx.lineTo(v.X(x), v.Y(f(x))); }
        ctx.lineTo(v.X(b), v.Y(0)); ctx.closePath(); ctx.fill(); ctx.restore();
      },
      box(x, y, w, h, o = {}) { ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; if (o.fill) { ctx.fillStyle = o.fill; ctx.fillRect(x, y, w, h); } if (o.stroke !== false) { ctx.strokeStyle = o.stroke || C.line; ctx.lineWidth = o.lw || 1.5; ctx.strokeRect(x, y, w, h); } ctx.restore(); },
      alpha(a, fn) { ctx.save(); ctx.globalAlpha = clamp(a); fn(); ctx.restore(); },
    };
    return api;
  }

  P.Player = function (root, scenes, opts = {}) {
    const el = P.h(`<div class="player">
      <div class="stage">
        <div class="viz"><canvas aria-hidden="true"></canvas><div class="board" role="list"></div></div>
        <div class="card" aria-live="polite"></div>
      </div>
      <div class="controls">
        <button class="ctl prev" aria-label="Previous scene"><svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7"/></svg></button>
        <button class="ctl play" aria-label="Play"><svg class="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg class="i-pause" viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg><svg class="i-again" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/></svg></button>
        <button class="ctl next" aria-label="Next scene"><svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg></button>
        <div class="bar" role="progressbar" aria-label="Explainer progress"></div>
        <span class="clock"></span>
      </div>
    </div>`);
    root.innerHTML = ''; root.appendChild(el);
    const canvas = el.querySelector('canvas'), board = el.querySelector('.board'), card = el.querySelector('.card'), bar = el.querySelector('.bar'), clock = el.querySelector('.clock'), playBtn = el.querySelector('.play');
    const ctx = canvas.getContext('2d');
    const total = scenes.reduce((s, sc) => s + sc.dur, 0);
    scenes.forEach((sc) => { const seg = document.createElement('i'); seg.style.flex = sc.dur; seg.innerHTML = '<b></b>'; bar.appendChild(seg); });
    const segs = [...bar.children];
    let i = 0, t = 0, playing = false, last = 0, done = false, W = 0, H = 0, C = colors(el);
    const st = { el };

    function size() {
      const r = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
      W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function load(k) {
      i = k; t = reduce() ? scenes[k].dur : 0; done = false;
      const sc = scenes[k];
      el.classList.toggle('is-board', !!sc.board);
      card.innerHTML = (sc.card || []).map((c) => `<div class="beat" data-at="${c.at || 0}">${c.html}</div>`).join('');
      board.innerHTML = (sc.board || []).map((b) => `<div class="bline${b.hl ? ' hlrow' : ''}${b.wrong ? ' wrong' : ''}${b.big ? ' big' : ''}" data-at="${b.at || 0}" role="listitem"><div class="m">${b.tex != null ? `$$${b.tex}$$` : b.html}</div>${b.note ? `<div class="pen note">${b.note}</div>` : ''}</div>`).join('');
      P.math(card); P.math(board);
      C = colors(el);
      render();
    }
    function render() {
      const sc = scenes[i]; const p = clamp(t / sc.dur);
      card.querySelectorAll('.beat').forEach((b) => b.classList.toggle('on', t >= +b.dataset.at));
      board.querySelectorAll('.bline').forEach((b) => b.classList.toggle('on', t >= +b.dataset.at));
      if (sc.draw) { ctx.clearRect(0, 0, W, H); if (W > 0) sc.draw(makeApi(ctx, W, H, t, p, C)); }
      segs.forEach((s, k) => { s.firstChild.style.width = (k < i ? 100 : k > i ? 0 : p * 100) + '%'; });
      const el2 = scenes.slice(0, i).reduce((s, x) => s + x.dur, 0) + t;
      clock.textContent = fmt(el2) + ' / ' + fmt(total);
      playBtn.classList.toggle('is-playing', playing); playBtn.classList.toggle('is-done', done && !playing);
      playBtn.setAttribute('aria-label', playing ? 'Pause' : done ? 'Watch again' : 'Play');
      el.querySelector('.prev').disabled = i === 0 && t < 0.5;
      el.querySelector('.next').disabled = i === scenes.length - 1;
    }
    const fmt = (s) => { s = Math.round(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    function frame(now) {
      if (!document.body.contains(el)) return; // unmounted
      if (playing) {
        const dt = Math.min(0.1, (now - last) / 1000); t += dt;
        if (t >= scenes[i].dur) {
          if (i < scenes.length - 1) { load(i + 1); if (reduce()) playing = false; }
          else { t = scenes[i].dur; playing = false; done = true; opts.onEnd && opts.onEnd(); }
        }
        render();
      }
      last = now; requestAnimationFrame(frame);
    }
    st.play = () => { if (done) { load(0); } playing = true; last = performance.now(); render(); };
    st.pause = () => { playing = false; render(); };
    st.toggle = () => (playing ? st.pause() : st.play());
    playBtn.onclick = st.toggle;
    el.querySelector('.prev').onclick = () => { load(t > 1.5 || i === 0 ? i : i - 1); };
    el.querySelector('.next').onclick = () => { if (i < scenes.length - 1) load(i + 1); };
    bar.addEventListener('click', (e) => { const r = bar.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * total; let acc = 0; for (let k = 0; k < scenes.length; k++) { if (x < acc + scenes[k].dur) { load(k); t = reduce() ? scenes[k].dur : x - acc; render(); return; } acc += scenes[k].dur; } });
    el.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { el.querySelector('.next').click(); } if (e.key === 'ArrowLeft') { el.querySelector('.prev').click(); } });
    const ro = new ResizeObserver(() => { size(); render(); }); ro.observe(canvas);
    const mq = window.matchMedia('(prefers-color-scheme: dark)'); mq.addEventListener && mq.addEventListener('change', () => { C = colors(el); render(); });
    size(); load(0); requestAnimationFrame((n) => { last = n; frame(n); });
    if (opts.autoplay && !reduce()) st.play();
    return st;
  };
})();
