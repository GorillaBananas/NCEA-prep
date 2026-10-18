/* AS 91267 (Maths 2.12) Apply probability methods in solving problems */
(function () {
  const P = NP, R = P.R, T = String.raw;
  const m = (tex) => '$' + String(tex).replace(/</g, '\\lt ') + '$';
  const B = (at, tex, note, o = {}) => Object.assign({ at, tex: tex == null ? tex : tex.replace(/</g, '\\lt '), note }, o);
  const C = (at, html) => ({ at, html });
  const f4 = (x) => P.f(x, 4), nf = P.nf, n = P.n;
  const PT = 0.0006; // tolerance for 4 d.p. probabilities

  /* ---------- shared canvas helpers ---------- */
  function drawTree(a, first, second, opts = {}) {
    const { W, H, C: col } = a; const x0 = W * 0.04, x1 = W * 0.34, x2 = W * 0.64; const ym = H / 2;
    const leafY = (k) => H * 0.12 + k * ((H * 0.76) / 3);
    const p = a.p; let leaf = 0;
    first.forEach((b, i) => {
      const y1 = (leafY(leaf) + leafY(leaf + 1)) / 2; const al = a.seg(p, 0.02 + i * 0.08, 0.15 + i * 0.08);
      a.alpha(al, () => a.line(x0, ym, x1 - 46, y1, col.muted, 2)); a.text(b.l, x1 - 40, y1, { alpha: al, font: 'head' }); a.text(b.p, (x0 + x1 - 46) / 2, (ym + y1) / 2 + (y1 < ym ? -16 : 18), { alpha: al, font: 'pen', col: col.pen, align: 'center' });
      second[i].forEach((c, j) => {
        const y2 = leafY(leaf + j); const al2 = a.seg(p, 0.2 + (leaf + j) * 0.06, 0.32 + (leaf + j) * 0.06);
        a.alpha(al2, () => a.line(x1 + 8, y1, x2 - 46, y2, col.muted, 2)); a.text(c.l, x2 - 40, y2, { alpha: al2, font: 'head' }); a.text(c.p, (x1 + x2 - 38) / 2, (y1 + y2) / 2 + (y2 < y1 ? -14 : 18), { alpha: al2, font: 'pen', col: col.pen, align: 'center' });
        if (c.end) a.text(c.end, x2 + 56, y2, { alpha: a.seg(p, opts.endAt || 0.6, (opts.endAt || 0.6) + 0.1), col: c.hl ? col.ink : col.muted, bg: c.hl ? col.hl : null });
      });
      leaf += second[i].length;
    });
  }
  function drawTable(a, head, rows, o = {}) {
    const { W, H, C: col, fs } = a; const cols = head.length, cw = Math.min(150, (W - 40) / cols), rh = fs * 2.4;
    const x0 = (W - cw * cols) / 2, y0 = (H - rh * (rows.length + 1)) / 2;
    const al = a.seg(a.p, 0, 0.12);
    for (let r = 0; r <= rows.length; r++) for (let c = 0; c < cols; c++) {
      const x = x0 + c * cw, y = y0 + r * rh; const txt = r === 0 ? head[c] : rows[r - 1][c];
      const key = r + ',' + c; const hl = o.hl && o.hl(key, a.p);
      a.box(x, y, cw, rh, { fill: hl ? col.hl : r === 0 || c === 0 ? col.paper : col.sheet, stroke: col.line, alpha: al });
      a.text(String(txt), c === 0 ? x + 10 : x + cw - 12, y + rh / 2, { align: c === 0 ? 'left' : 'right', alpha: al, font: r === 0 || c === 0 ? 'head' : 'body', weight: r === 0 || c === 0 || r === rows.length || c === cols - 1 ? 800 : 500, size: c === 0 ? 0.88 : 1 });
    }
    return { x0, y0, cw, rh };
  }
  function bell(a, v, mu, sd, colr, w = 3.5, upto = 1) { const f = (x) => Math.exp(-((x - mu) ** 2) / (2 * sd * sd)); a.plot(v, f, colr, w, upto); return f; }

  /* ---------- context banks ---------- */
  const TABLES = [
    { r: ['Skipped breakfast', 'Ate breakfast'], c: ['Tired in class', 'Not tired'], who: 'students', rp: ['skipped breakfast', 'ate breakfast'], cp: ['were tired in class', 'were not tired in class'], ci: 'be tired in class', cn: 'being tired in class' },
    { r: ['Phone in bedroom', 'No phone'], c: ['Under 8 h sleep', '8 h or more'], who: 'teenagers', rp: ['have a phone in their bedroom', 'have no phone in their bedroom'], cp: ['sleep under 8 hours', 'sleep 8 hours or more'], ci: 'sleep under 8 hours', cn: 'sleeping under 8 hours' },
    { r: ['No seatbelt', 'Seatbelt'], c: ['Injured', 'Not injured'], who: 'people in crashes', rp: ['wore no seatbelt', 'wore a seatbelt'], cp: ['were injured', 'were not injured'], ci: 'be injured', cn: 'being injured' },
    { r: ['Smoker', 'Non-smoker'], c: ['Asthma', 'No asthma'], who: 'adults', rp: ['smoke', 'do not smoke'], cp: ['have asthma', 'do not have asthma'], ci: 'have asthma', cn: 'having asthma' },
    { r: ['Revised weekly', 'Did not revise'], c: ['Passed', 'Did not pass'], who: 'students', rp: ['revised weekly', 'did not revise weekly'], cp: ['passed', 'did not pass'], ci: 'pass', cn: 'passing' },
  ];
  function makeTable() {
    const ctx = R.pick(TABLES); let a, b, c, d;
    do { a = R.int(8, 90); b = R.int(10, 140); c = R.int(8, 90); d = R.int(10, 140); } while (Math.abs(a / (a + b) - c / (c + d)) < 0.05);
    if (a / (a + b) < c / (c + d)) [a, b, c, d] = [c, d, a, b]; // the first row is the higher-risk group, as in real data
    const tot = a + b + c + d;
    const fig = P.svg.table(['', ctx.c[0], ctx.c[1], 'Total'], [[ctx.r[0], a, b, a + b], [ctx.r[1], c, d, c + d], ['Total', a + c, b + d, tot]]);
    return { ctx, a, b, c, d, tot, fig };
  }

  /* ================= 1. Probability trees ================= */
  P.addUnit({
    id: 'trees', title: 'Probability trees', mins: 10,
    blurb: 'Multiply along the branches, add the ends. Then work backwards for the Merit questions.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>A tree shows events one after another.</h2>'), C(3, '<p>30% chance of rain. When it rains the bus is late 40% of the time; when dry, 10%.</p>'), C(8.5, '<p>Each pair of branches adds to 1.</p>')],
        draw(a) { drawTree(a, [{ l: 'Rain', p: '0.3' }, { l: 'Dry', p: '0.7' }], [[{ l: 'Late', p: '0.4', end: '0.3 × 0.4 = 0.12', hl: true }, { l: 'On time', p: '0.6', end: '0.18' }], [{ l: 'Late', p: '0.1', end: '0.7 × 0.1 = 0.07', hl: true }, { l: 'On time', p: '0.9', end: '0.63' }]], { endAt: 0.62 }); } },
      { dur: 12, card: [C(0, '<h2>AND: multiply. OR: add.</h2>'), C(3, '<p>Along one path is AND. Several paths that all count is OR.</p>'), C(8, '<p>The 2025 examiners listed muddling these two as a Not Achieved error.</p>')],
        board: [B(0.5, T`P(\text{rain and late}) = 0.3 \times 0.4 = 0.12`, 'along: ×'), B(3.5, T`P(\text{late}) = 0.12 + 0.07`, 'two paths: +'), B(6, T`= 0.19`, '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Backwards: given it was late, was it raining?</h2>'), C(3, '<p>"Given" shrinks the world to the late paths only. Take your part of it.</p>'), C(9, '<p>This reverse calculation is a typical Merit question.</p>')],
        board: [B(0.5, T`P(\text{rain} \mid \text{late}) = \dfrac{P(\text{rain and late})}{P(\text{late})}`, 'part ÷ whole'), B(4, T`= \dfrac{0.12}{0.19}`), B(6.5, '= 0.6316', '4 d.p.', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>"At least one" is quickest the other way.</h2>'), C(3, '<p>Everything except "none".</p>')],
        board: [B(0.5, T`P(\text{at least one late in 2 days})`), B(2.5, T`= 1 - P(\text{not late, not late})`, '1 − none'), B(5, T`= 1 - 0.81^2 = 0.3439`, '', { hl: true })] },
    ],
    example: {
      problem: 'A bag holds 5 red and 3 blue counters. Two are taken out without replacement. Find the probability they are different colours.',
      steps: [
        { m: m(T`P(R, B) = \tfrac58 \times \tfrac37 = \tfrac{15}{56}`), note: '7 left after one' },
        { m: m(T`P(B, R) = \tfrac38 \times \tfrac57 = \tfrac{15}{56}`) },
        { m: m(T`P(\text{different}) = \tfrac{15}{56} + \tfrac{15}{56} = \tfrac{30}{56}`), note: 'either order: add' },
        { m: m('= 0.5357') + ' (4 d.p.)' },
      ],
    },
    faded() {
      const p = R.pick([0.2, 0.3, 0.4, 0.6, 0.25]), q = R.pick([0.1, 0.2, 0.3, 0.5, 0.6]), r = R.pick([0.05, 0.15, 0.25, 0.4]);
      const ans = p * q + (1 - p) * r;
      return { kind: 'num', answer: ans, dp: 4, tol: PT, prompt: `P(A) = ${p}. If A happens, P(B) = ${q}. If A does not happen, P(B) = ${r}. Find P(B).`,
        fig: P.svg.tree([{ label: 'A', p: String(p) }, { label: 'not A', p: n(1 - p) }], [[{ label: 'B', p: String(q) }, { label: 'not B', p: n(1 - q) }], [{ label: 'B', p: String(r) }, { label: 'not B', p: n(1 - r) }]]),
        scaffold: [m(`P(A \\text{ and } B) = ${p} \\times ${q} = ${n(p * q)}`), m(`P(\\text{not } A \\text{ and } B) = ${n(1 - p)} \\times ${r} = ${n((1 - p) * r)}`)], hint: 'B can happen two ways. Add them.',
        sol: [m(`P(B) = ${n(p * q)} + ${n((1 - p) * r)} = ${f4(ans)}`)] };
    },
    gens: [
      () => { const p = R.pick([0.2, 0.3, 0.35, 0.45, 0.6, 0.7]), q = R.pick([0.15, 0.25, 0.4, 0.55, 0.8]);
        return { kind: 'num', answer: p * q, dp: 4, tol: PT, prompt: `${Math.round(p * 100)}% of customers buy a coffee. Of those, ${Math.round(q * 100)}% also buy food. Find the probability a customer buys a coffee and food.`, wrong: [{ v: p + q, msg: 'AND along a branch means multiply, not add.' }], sol: [m(`${p} \\times ${q} = ${f4(p * q)}`)] }; },
      () => { const p = R.pick([0.2, 0.3, 0.4, 0.15]), q = R.pick([0.4, 0.5, 0.7, 0.85]), r = R.pick([0.05, 0.1, 0.2, 0.3]); const ans = p * q + (1 - p) * r;
        return { kind: 'num', answer: ans, dp: 4, tol: PT, prompt: `A test for a virus: ${Math.round(p * 100)}% of people tested have it. The test is positive for ${Math.round(q * 100)}% of people with the virus and ${Math.round(r * 100)}% of people without it. Find the probability that a test is positive.`,
          fig: P.svg.tree([{ label: 'Virus', p: String(p) }, { label: 'No virus', p: n(1 - p) }], [[{ label: '+', p: String(q) }, { label: '−', p: n(1 - q) }], [{ label: '+', p: String(r) }, { label: '−', p: n(1 - r) }]]),
          wrong: [{ v: p * q, msg: 'People without the virus can test positive too. Add both positive paths.' }, { v: q + r, msg: 'Multiply along each path first, then add the paths.' }],
          sol: [m(`${p} \\times ${q} + ${n(1 - p)} \\times ${r}`), m(`= ${n(p * q)} + ${n((1 - p) * r)} = ${f4(ans)}`)] }; },
      () => { const p = R.pick([0.1, 0.2, 0.3]), q = R.pick([0.7, 0.8, 0.9]), r = R.pick([0.05, 0.1, 0.15, 0.2]); const tot = p * q + (1 - p) * r, ans = (p * q) / tot;
        return { kind: 'num', answer: ans, dp: 4, tol: PT, prompt: `${Math.round(p * 100)}% of emails are spam. A filter flags ${Math.round(q * 100)}% of spam and ${Math.round(r * 100)}% of real emails. An email is flagged. Find the probability it is spam.`,
          fig: P.svg.tree([{ label: 'Spam', p: String(p) }, { label: 'Real', p: n(1 - p) }], [[{ label: 'Flagged', p: String(q) }, { label: 'Not', p: n(1 - q) }], [{ label: 'Flagged', p: String(r) }, { label: 'Not', p: n(1 - r) }]]),
          wrong: [{ v: p * q, msg: 'That is P(spam and flagged). "Given flagged" means divide by P(flagged).' }, { v: q, msg: 'That is P(flagged given spam), the other way round.' }],
          sol: [m(`P(\\text{flagged}) = ${n(p * q)} + ${n((1 - p) * r)} = ${n(tot)}`), m(T`P(\text{spam} \mid \text{flagged}) = \dfrac{${n(p * q)}}{${n(tot)}} = ${f4(ans)}`)] }; },
      () => { const r = R.int(3, 8), b = R.int(2, 7), N = r + b, same = (r * (r - 1) + b * (b - 1)) / (N * (N - 1));
        return { kind: 'num', answer: same, dp: 4, tol: PT, prompt: `A bag has ${r} red and ${b} blue marbles. Two are taken without replacement. Find the probability both are the same colour.`,
          wrong: [{ v: (r / N) ** 2 + (b / N) ** 2, msg: 'Without replacement, there is one fewer marble for the second pick.' }, { v: (r * (r - 1)) / (N * (N - 1)), msg: 'Both blue also counts as the same colour.' }],
          sol: [m(T`P(RR) = \tfrac{${r}}{${N}} \times \tfrac{${r - 1}}{${N - 1}}`), m(T`P(BB) = \tfrac{${b}}{${N}} \times \tfrac{${b - 1}}{${N - 1}}`), m(T`P(\text{same}) = \tfrac{${r * (r - 1) + b * (b - 1)}}{${N * (N - 1)}} = ${f4(same)}`)] }; },
      () => { const pick = R.int(0, 2);
        const qs = [['the bus is late AND it rained', 'Multiply along the branch: 0.3 × 0.4', true], ['the bus is late', 'Add the two late paths: 0.3 × 0.4 + 0.7 × 0.1', false], ['it rains on both of two days (independent)', 'Multiply: 0.3 × 0.3', true]][pick];
        return P.mcq({ prompt: `Using the rain and bus tree (rain 0.3; late 0.4 if rain, 0.1 if dry), how do you find the probability that ${qs[0]}?`, sol: [qs[1]] }, P.uniq([
          { t: qs[1], ok: true }, { t: 'Add: 0.3 + 0.4', why: 'Adding is for different paths that both count. Along one path, multiply.' },
          { t: pick === 1 ? 'Multiply: 0.4 × 0.1' : 'Add the two late paths: 0.3 × 0.4 + 0.7 × 0.1', why: pick === 1 ? 'Those are on different paths. Multiply along each path, then add the paths.' : 'That is the total probability of being late, not just with rain.' },
          { t: 'Divide: 0.4 ÷ 0.3', why: 'Dividing is only for "given" questions.' }])); },
      () => { const p = R.pick([0.2, 0.3, 0.4, 0.6, 0.7, 0.8]), atl = 1 - (1 - p) ** 2;
        return { kind: 'num', answer: p, prompt: `The chance of rain on any day is ${m('p')}, independently. The probability of rain on at least one of two days is ${n(atl)}. Find ${m('p')}.`,
          wrong: [{ v: atl / 2, msg: 'Use 1 − P(no rain both days): ' + m(`1 - (1-p)^2 = ${n(atl)}`) + '.' }],
          sol: [m(`1 - (1 - p)^2 = ${n(atl)}`), m(`(1 - p)^2 = ${n(1 - atl)}`), m(`1 - p = ${n(1 - p)}`), m(`p = ${p}`)] }; },
    ],
    tips: [
      '<span class="pen">AND: multiply along. OR: add the paths.</span> Write which paths you are adding.',
      'Give probabilities to at least 4 decimal places, as the 2025 report asks. Any answer outside 0 to 1 is a red flag.',
      '"Given that..." means divide by the probability of what is given.',
      'Draw and label the tree even when one is not given. Annotated diagrams helped Merit candidates in 2025.',
    ],
  });

  /* ================= 2. Two-way tables ================= */
  const BF = [['', 'Tired', 'Not tired', 'Total'], ['Ate breakfast', 30, 90, 120], ['Skipped', 45, 35, 80], ['Total', 75, 125, 200]];
  P.addUnit({
    id: 'two-way', title: 'Two-way tables and conditional probability', mins: 9,
    blurb: 'Pick the right total. That is nearly the whole skill.',
    scenes: [
      { dur: 11, card: [C(0, '<h2>200 students, two questions each.</h2>'), C(3, '<p>Did they eat breakfast? Are they tired in class? The totals are the key to everything.</p>')],
        draw(a) { drawTable(a, BF[0], BF.slice(1), { hl: (k, p) => p > 0.5 && k === '3,3' }); } },
      { dur: 12, card: [C(0, '<h2>"And" or a single group: out of the grand total.</h2>'), C(5, `<p>${m(T`P(\text{tired}) = \tfrac{75}{200} = 0.375`)}</p>`), C(8, `<p>${m(T`P(\text{skipped and tired}) = \tfrac{45}{200} = 0.225`)}</p>`)],
        draw(a) { drawTable(a, BF[0], BF.slice(1), { hl: (k, p) => (p < 0.6 ? k === '3,1' || k === '3,3' : k === '2,1' || k === '3,3') }); } },
      { dur: 13, card: [C(0, '<h2>"Given" changes the total.</h2>'), C(3, '<p>Given they skipped breakfast, you only look at the 80 who skipped.</p>'), C(8, `<p class="eq">${m(T`P(\text{tired} \mid \text{skipped}) = \tfrac{45}{80} = 0.5625`)}</p>`)],
        draw(a) { drawTable(a, BF[0], BF.slice(1), { hl: (k, p) => k === '2,1' || (p > 0.3 && k === '2,3') }); a.text('row total, not 200', a.W / 2, a.H * 0.86, { align: 'center', font: 'pen', col: a.C.pen, alpha: a.seg(a.p, 0.4, 0.5) }); } },
      { dur: 11, card: [C(0, '<h2>The order matters.</h2>'), C(3, '<p>Given tired: now the total is the 75 tired students.</p>')],
        board: [B(0.5, T`P(\text{tired} \mid \text{skipped}) = \tfrac{45}{80} = 0.5625`), B(3.5, T`P(\text{skipped} \mid \text{tired}) = \tfrac{45}{75} = 0.6`, 'different!', { hl: true })] },
    ],
    example: () => { const t = makeTable(); const { ctx, c, d, tot } = t; const den = c + d;
      return { problem: `<p>A survey of ${tot} ${ctx.who}:</p>${t.fig}<p>One of the ${ctx.who} who ${ctx.rp[1]} is chosen at random. Find the probability they ${ctx.cp[0]}.</p>`,
        steps: [{ m: `Given they ${ctx.rp[1]}: only use the "${ctx.r[1]}" row, ${den} ${ctx.who}.`, note: 'shrink the total' }, { m: `Of those, ${c} are in the "${ctx.c[0]}" column.` }, { m: m(T`\dfrac{${c}}{${den}} = ${f4(c / den)}`), note: '4 d.p.' }] }; },
    faded() { const t = makeTable(); const { ctx, a, b } = t;
      return { kind: 'num', answer: a / (a + b), dp: 4, tol: PT, fig: t.fig, prompt: `One of the ${ctx.who} who ${ctx.rp[0]} is chosen at random. Find the probability they ${ctx.cp[0]}.`,
        scaffold: [`They ${ctx.rp[0]}, so the total is that row: ${m(String(a + b))}.`], hint: `Divide ${a} by ${a + b}.`, wrong: [{ v: a / t.tot, msg: 'That uses the grand total. A "given" question uses the row total.' }], sol: [m(T`\dfrac{${a}}{${a + b}} = ${f4(a / (a + b))}`)] }; },
    gens: [
      () => { const t = makeTable(); const { ctx, a, tot } = t;
        return { kind: 'num', answer: a / tot, dp: 4, tol: PT, fig: t.fig, prompt: `One of these ${ctx.who} is chosen at random. Find the probability they ${ctx.rp[0]} and ${ctx.cp[0]}.`, wrong: [{ v: a / (t.a + t.b), msg: '"And" uses the grand total, not the row total.' }], sol: [m(T`\dfrac{${a}}{${tot}} = ${f4(a / tot)}`)] }; },
      () => { const t = makeTable(); const { ctx, c, d } = t;
        return { kind: 'num', answer: c / (c + d), dp: 4, tol: PT, fig: t.fig, prompt: `One of the ${ctx.who} who ${ctx.rp[1]} is chosen at random. Find the probability they ${ctx.cp[0]}.`, wrong: [{ v: c / t.tot, msg: 'Use the row total, ' + (c + d) + ', not the grand total.' }, { v: c / (t.a + c), msg: 'That is the column total. You are given the row.' }], sol: [m(T`\dfrac{${c}}{${c + d}} = ${f4(c / (c + d))}`)] }; },
      () => { const t = makeTable(); const { ctx, a, c } = t;
        return { kind: 'num', answer: c / (a + c), dp: 4, tol: PT, fig: t.fig, prompt: `One of the ${ctx.who} who ${ctx.cp[0]} is chosen at random. Find the probability they ${ctx.rp[1]}.`, wrong: [{ v: c / (c + t.d), msg: 'You are given the column "' + ctx.c[0] + '", so use that column total.' }, { v: c / t.tot, msg: 'A "given" question needs the total of the given group.' }], sol: [`Given they ${ctx.cp[0]}: use the "${ctx.c[0]}" column total, ${a + c}`, m(T`\dfrac{${c}}{${a + c}} = ${f4(c / (a + c))}`)] }; },
      () => { const t = makeTable(); const { ctx, a, b, c, tot } = t;
        return P.mcq({ fig: t.fig, prompt: `Which calculation gives the probability that one of these ${ctx.who} ${ctx.cp[0].replace(/^were /, 'was ').replace(/^(have|sleep|do) /, (w) => ({ 'have ': 'has ', 'sleep ': 'sleeps ', 'do ': 'does ' }[w]))}, given that they ${ctx.rp[0]}?`, sol: ['Given they ' + ctx.rp[0] + ', divide by the "' + ctx.r[0] + '" row total.'] }, P.uniq([
          { t: m(T`\dfrac{${a}}{${a + b}}`), ok: true }, { t: m(T`\dfrac{${a}}{${tot}}`), why: 'That is P(both). "Given" means divide by the row total.' },
          { t: m(T`\dfrac{${a}}{${a + c}}`), why: 'That divides by the column total: the probability the other way round.' }, { t: m(T`\dfrac{${a + b}}{${tot}}`), why: 'That is the probability of being in that row at all.' }])); },
      () => { const t = makeTable(); const { ctx, a, b, c, tot } = t; const ans = (a + b + c) / tot;
        return { kind: 'num', answer: ans, dp: 4, tol: PT, fig: t.fig, prompt: `One of these ${ctx.who} is chosen at random. Find the probability they ${ctx.rp[0]} or ${ctx.cp[0]}, or both.`, wrong: [{ v: (2 * a + b + c) / tot, msg: 'You counted the overlap twice. Add the three cells instead.' }], sol: [`Add the three cells in that row or column: ${a} + ${b} + ${c} = ${a + b + c}`, m(T`\dfrac{${a + b + c}}{${tot}} = ${f4(ans)}`)] }; },
    ],
    tips: [
      'Ask yourself: <span class="pen">out of whom?</span> That decides the bottom of the fraction.',
      '"And" uses the grand total. "Given" uses the total of the given row or column.',
      'Write the fraction before the decimal. It shows your method if the arithmetic slips.',
      'P(A given B) and P(B given A) are usually different. Read the order carefully.',
    ],
  });

  /* ================= 3. Relative risk ================= */
  P.addUnit({
    id: 'relative-risk', title: 'Relative risk', mins: 9,
    blurb: 'Compare the risk in two groups, then say what it means in plain words.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Relative risk compares two groups.</h2>'), C(3, '<p>Find the risk in each group (a conditional probability), then divide.</p>')],
        board: [B(0.5, T`\text{RR} = \dfrac{P(\text{injured} \mid \text{no seatbelt})}{P(\text{injured} \mid \text{seatbelt})}`), B(4, T`= \dfrac{30/120}{20/400} = \dfrac{0.25}{0.05}`), B(7.5, T`= 5`, '', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>Say it in words, with the context.</h2>'), C(3, `<p>"People not wearing a seatbelt were <b>5 times as likely</b> to be injured as people wearing one."</p>`), C(8, '<p>The group on top of the fraction goes first in the sentence.</p>')],
        board: [B(0.5, T`\text{RR} > 1`, 'more likely'), B(2, T`\text{RR} = 1`, 'no difference'), B(3.5, T`\text{RR} < 1`, 'less likely')] },
      { dur: 11, card: [C(0, '<h2>Careful with the wording.</h2>'), C(5, '<p>"Times as likely" and "% more likely" are different scales.</p>')],
        board: [B(0.5, T`\text{RR} = 1.5`), B(2.5, null, 'no', { wrong: true, html: '<p class="bq">“1.5% more likely”</p>' }), B(5, null, '', { hl: true, html: '<p class="bq"><span class="hl">“1.5 times as likely” = “50% more likely”</span></p>' })] },
      { dur: 13, card: [C(0, '<h2>Excellence: judge a claim.</h2>'), C(3, '<p>Claim: "Students with phones in the bedroom are twice as likely to sleep under 8 hours." Your table gives RR = 1.6.</p>'), C(9, '<p>So the claim overstates it. Also: one survey shows a link, not that phones cause it.</p>')],
        board: [B(4, T`\text{RR} = 1.6 < 2`), B(6.5, T`\text{claim not supported}`, 'use numbers', { hl: true })] },
    ],
    example: () => { const t = makeTable(); const { ctx, a, b, c, d } = t; const rr = (a / (a + b)) / (c / (c + d));
      return { problem: `${t.fig}<p>How many times as likely are ${ctx.who} who ${ctx.rp[0]} to ${ctx.ci}, compared with ${ctx.who} who ${ctx.rp[1]}?</p>`,
        steps: [{ m: `Risk for those who ${ctx.rp[0]}: ` + m(T`\tfrac{${a}}{${a + b}} = ${f4(a / (a + b))}`), note: 'group 1' }, { m: `Risk for those who ${ctx.rp[1]}: ` + m(T`\tfrac{${c}}{${c + d}} = ${f4(c / (c + d))}`), note: 'group 2' }, { m: m(T`\text{RR} = \dfrac{${f4(a / (a + b))}}{${f4(c / (c + d))}} = ${P.f(rr, 2)}`) }, { m: `${ctx.who[0].toUpperCase() + ctx.who.slice(1)} who ${ctx.rp[0]} were ${P.f(rr, 2)} times as likely to ${ctx.ci} as those who ${ctx.rp[1]}.`, note: 'in context' }] }; },
    faded() { const p1 = R.pick([0.12, 0.18, 0.24, 0.3, 0.36]), p2 = R.pick([0.04, 0.06, 0.08, 0.1, 0.15]);
      return { kind: 'num', answer: p1 / p2, dp: 2, tol: 0.011, prompt: `In a study, ${n(p1 * 100)}% of smokers and ${n(p2 * 100)}% of non-smokers developed a condition. Find the relative risk for smokers compared with non-smokers.`,
        scaffold: [m(`P(\\text{condition} \\mid \\text{smoker}) = ${p1}`), m(`P(\\text{condition} \\mid \\text{non-smoker}) = ${p2}`)], hint: 'Divide the smokers\' risk by the non-smokers\' risk.', wrong: [{ v: p2 / p1, msg: 'Upside down. The group being compared (smokers) goes on top.' }, { v: p1 - p2, msg: 'Relative risk is a division, not a subtraction.' }], sol: [m(T`\text{RR} = \dfrac{${p1}}{${p2}} = ${P.f(p1 / p2, 2)}`)] }; },
    gens: [
      () => { const t = makeTable(); const { ctx, a, b, c, d } = t; const rr = (a / (a + b)) / (c / (c + d));
        return { kind: 'num', answer: rr, dp: 2, tol: 0.011, fig: t.fig, prompt: `Find the relative risk of ${ctx.cn} for ${ctx.who} who ${ctx.rp[0]}, compared with those who ${ctx.rp[1]}. Give your answer to 2 decimal places.`,
          wrong: [{ v: 1 / rr, msg: 'Upside down. The group who ' + ctx.rp[0] + ' goes on top.' }, { v: a / c, msg: 'Divide each count by its own row total first.' }],
          sol: [m(T`\tfrac{${a}}{${a + b}} = ${f4(a / (a + b))}`), m(T`\tfrac{${c}}{${c + d}} = ${f4(c / (c + d))}`), m(T`\text{RR} = ${P.f(rr, 2)}`)] }; },
      () => { const rr = R.pick([1.2, 1.5, 1.8, 2.5, 3.2, 4]); const pct = Math.round((rr - 1) * 100);
        return P.mcq({ prompt: `The relative risk of injury for cyclists without helmets compared with cyclists with helmets is ${rr}. Which statement is correct?`, sol: [`RR = ${rr} means ${rr} times as likely, which is the same as ${pct}% more likely.`] }, [
          { t: `Cyclists without helmets were ${rr} times as likely to be injured as cyclists with helmets.`, ok: true },
          { t: `Cyclists without helmets were ${rr}% more likely to be injured.`, why: `${rr} times as likely is ${pct}% more likely, not ${rr}%.` },
          { t: `Cyclists with helmets were ${rr} times as likely to be injured.`, why: 'The group on top of the fraction (without helmets) has the higher risk.' },
          { t: `${Math.round((rr / (1 + rr)) * 100)}% of injured cyclists had no helmet.`, why: 'Relative risk compares two risks. It does not tell you that percentage.' }]); },
      () => { let t, rr; do { t = makeTable(); rr = (t.a / (t.a + t.b)) / (t.c / (t.c + t.d)); } while (rr < 1.15); const { ctx, a, b, c, d } = t;
        const support = Math.random() < 0.5; const claim = support ? P.round(rr, 1) : P.round(rr + R.pick([0.8, 1.2, 1.6]), 1);
        const calc = [m(T`\text{RR} = \dfrac{${a}/${a + b}}{${c}/${c + d}} = ${P.f(rr, 2)}`), support ? `That matches the claim of about ${claim}.` : `The claim says ${claim}, but the data gives ${P.f(rr, 2)}.`];
        return P.mcq({ fig: t.fig, prompt: `A report claims ${ctx.who} who ${ctx.rp[0]} are about ${claim} times as likely to ${ctx.ci} as those who ${ctx.rp[1]}. Is the claim supported by this data?`, sol: calc }, [
          { t: `Yes. The relative risk is ${P.f(rr, 2)}, which is about ${claim}.`, ok: support, why: support ? '' : `${P.f(rr, 2)} is not close to ${claim}. Calculate it carefully.` },
          { t: `No. The relative risk is ${P.f(rr, 2)}, not ${claim}.`, ok: !support, why: !support ? '' : `${P.f(rr, 2)} rounds to ${claim}, so the claim matches.` },
          { t: `Yes, because ${a} is more than ${c}.`, why: 'Raw counts ignore group sizes. Use the risk in each group.' },
          { t: 'You cannot tell without knowing the cause.', why: 'You can check the size of the claim with relative risk. Causation is a separate point you can add.' }].filter((o, k) => k !== 2 || a > c)); },
      () => { const p2 = R.pick([0.02, 0.04, 0.05, 0.08, 0.1]), rr = R.pick([1.5, 2, 2.5, 3, 4]);
        return { kind: 'num', answer: p2 * rr, dp: 4, tol: PT, prompt: `The risk of a side effect is ${p2} for people taking a placebo. The relative risk for people taking the drug, compared with placebo, is ${rr}. Find the risk of a side effect for people taking the drug.`, wrong: [{ v: p2 / rr, msg: 'RR above 1 means the drug group has the higher risk: multiply.' }], sol: [m(T`\text{RR} = \dfrac{p}{${p2}} = ${rr}`), m(`p = ${rr} \\times ${p2} = ${n(p2 * rr)}`)] }; },
    ],
    tips: [
      'Show both conditional probabilities before dividing. The method marks are there.',
      '<span class="pen">"5 times as likely", not "5% more likely".</span> The 2025 Excellence answers used precise language.',
      'Name both groups and the outcome in your sentence: who, compared with whom, for what.',
      'To evaluate a claim: calculate, compare with the claim, then note limits (sample size, link not cause).',
    ],
  });

  /* ================= 4. Expected value ================= */
  P.addUnit({
    id: 'expected-value', title: 'Expected value', mins: 8,
    blurb: 'The long-run average of a game or the expected count in a group.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Expected value: the long-run average.</h2>'), C(3, `<p>A raffle ticket wins ${P.money(10)} with probability 0.1, ${P.money(2)} with 0.3, otherwise nothing.</p>`), C(8.5, `<p>Multiply each value by its probability and add.</p>`)],
        board: [B(4, T`E(X) = 10(0.1) + 2(0.3) + 0(0.6)`), B(7, '= 1 + 0.6 = 1.6', '$1.60 a ticket', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>It is the balance point.</h2>'), C(3, '<p>Bar heights are the probabilities. The distribution balances at 1.6.</p>')],
        draw(a) { const v = a.view(-1, 11, -0.2, 0.75); const X = [0, 2, 10], Pp = [0.6, 0.3, 0.1]; a.line(v.X(-1), v.Y(0), v.X(11), v.Y(0), a.C.muted, 2);
          X.forEach((x, k) => { const h = Pp[k] * a.seg(a.p, 0.05 + k * 0.1, 0.2 + k * 0.1); a.box(v.X(x) - 18, v.Y(h), 36, v.Y(0) - v.Y(h), { fill: a.C.c4, stroke: false, alpha: 0.8 }); a.text(String(x), v.X(x), v.Y(0) + 16, { align: 'center' }); a.text(String(Pp[k]), v.X(x), v.Y(h) - 14, { align: 'center', col: a.C.muted, size: 0.85, alpha: a.seg(a.p, 0.2 + k * 0.1, 0.3 + k * 0.1) }); });
          const al = a.seg(a.p, 0.5, 0.65); const cx = v.X(1.6), cy = v.Y(0); const ctx = a.ctx; ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = a.C.pen; ctx.beginPath(); ctx.moveTo(cx, cy + 4); ctx.lineTo(cx - 14, cy + 30); ctx.lineTo(cx + 14, cy + 30); ctx.closePath(); ctx.fill(); ctx.restore();
          a.text('E(X) = 1.6 balances here', cx + 22, cy + 34, { font: 'pen', col: a.C.pen, alpha: al }); } },
      { dur: 11, card: [C(0, '<h2>Expected number: n × p.</h2>'), C(3, '<p>500 students, each late with probability 0.19.</p>'), C(7, '<p>Round sensibly in context: you cannot have 0.5 of a student.</p>')],
        board: [B(3, '500 \\times 0.19 = 95', 'n × p', { hl: true }), B(6, T`\text{about 95 students}`)] },
    ],
    example: {
      problem: `A game costs ${P.money(3)} to play. You win ${P.money(20)} with probability 0.05, ${P.money(5)} with probability 0.2, and nothing otherwise. What is the expected profit per game?`,
      steps: [
        { m: m('E(\\text{winnings}) = 20(0.05) + 5(0.2) + 0(0.75)') },
        { m: m('= 1 + 1 = 2'), note: '$2 back on average' },
        { m: m('E(\\text{profit}) = 2 - 3 = -1'), note: 'take off the cost' },
        { m: 'On average you lose ' + P.money(1) + ' per game.' },
      ],
    },
    faded() { const x = [R.int(5, 20) * 5, R.int(1, 5) * 2, 0], p1 = R.pick([0.05, 0.1, 0.15]), p2 = R.pick([0.2, 0.25, 0.3, 0.4]), p3 = 1 - p1 - p2; const E = x[0] * p1 + x[1] * p2;
      return { kind: 'num', answer: E, prompt: `A prize wheel pays ${P.money(x[0])} with probability ${p1}, ${P.money(x[1])} with probability ${p2}, and nothing otherwise. Find the expected payout in dollars.`, scaffold: [m(`E = ${x[0]}(${p1}) + ${x[1]}(${p2}) + 0(${n(p3)})`)], hint: 'Work out each product and add.', sol: [m(`= ${n(x[0] * p1)} + ${n(x[1] * p2)} = ${n(E)}`)] }; },
    gens: [
      () => { const v = R.distinct(3, 1, 9).sort((a, b) => a - b); const ps = R.pick([[0.2, 0.5, 0.3], [0.1, 0.6, 0.3], [0.25, 0.25, 0.5], [0.4, 0.35, 0.25]]); const E = v.reduce((s, x, k) => s + x * ps[k], 0);
        return { kind: 'num', answer: E, prompt: `${m('X')} takes the values ${v.join(', ')} with probabilities ${ps.join(', ')}. Find ${m('E(X)')}.`, wrong: [{ v: (v[0] + v[1] + v[2]) / 3, msg: 'Weight each value by its probability.' }], sol: [m(`E(X) = ${v.map((x, k) => `${x}(${ps[k]})`).join(' + ')}`), m(`= ${n(E)}`)] }; },
      () => { const N = R.pick([200, 250, 400, 500, 800, 1200]), p = R.pick([0.12, 0.15, 0.19, 0.23, 0.31, 0.07]); const E = N * p;
        return { kind: 'num', answer: Math.round(E), tol: 0.6, prompt: `Each of ${N} students has a probability of ${p} of being chosen for a survey. How many students would you expect to be chosen? Give a whole number.`, sol: [m(`${N} \\times ${p} = ${n(E)}`), 'About ' + Math.round(E) + ' students.'] }; },
      () => { const cost = R.pick([2, 3, 5, 10]), w1 = R.pick([20, 25, 50, 100]), p1 = R.pick([0.02, 0.04, 0.05]), w2 = R.pick([4, 5, 6]), p2 = R.pick([0.1, 0.2, 0.3]); const E = w1 * p1 + w2 * p2 - cost;
        return { kind: 'num', answer: E, prompt: `A game costs ${P.money(cost)}. You win ${P.money(w1)} with probability ${p1} or ${P.money(w2)} with probability ${p2}, otherwise nothing. Find the expected profit per game in dollars (negative for a loss).`, wrong: [{ v: E + cost, msg: 'That is the expected winnings. Subtract the cost to play.' }], sol: [m(`E(\\text{win}) = ${w1}(${p1}) + ${w2}(${p2}) = ${n(E + cost)}`), m(`E(\\text{profit}) = ${n(E + cost)} - ${cost} = ${n(E)}`)] }; },
      () => { const hi = R.pick([10, 12, 20]), lo = R.pick([2, 4]), p = R.pick([0.25, 0.2, 0.4, 0.5]); const E = hi * p + lo * (1 - p);
        return { kind: 'num', answer: p, prompt: `A spinner pays ${hi} points with probability ${m('p')} and ${lo} points otherwise. Its expected value is ${n(E)}. Find ${m('p')}.`, sol: [m(`${hi}p + ${lo}(1 - p) = ${n(E)}`), m(`${hi - lo}p = ${n(E - lo)}`), m(`p = ${p}`)] }; },
      () => { const N = R.pick([30, 40, 50, 180]), p = R.pick([0.3, 0.2, 0.25]), q = R.pick([0.4, 0.5, 0.8]); const E = N * p * q;
        return { kind: 'num', answer: E, prompt: `Over ${N} school days, the probability of rain on a day is ${p}, and on a rainy day the probability the bus is late is ${q}. On how many days would you expect rain and a late bus?`, wrong: [{ v: N * p, msg: 'That counts every rainy day. You also need the bus to be late.' }], sol: [m(`P = ${p} \\times ${q} = ${n(p * q)}`), m(`${N} \\times ${n(p * q)} = ${n(E)}`) + ' days'] }; },
    ],
    tips: [
      'Write ' + m('E(X) = \\sum x \\, P(x)') + ' as a line of working, with every product shown.',
      '<span class="pen">Profit = winnings − cost.</span> Read whether the question wants winnings or profit.',
      'Expected numbers: ' + m('n \\times p') + '. Round sensibly in context and say "about".',
      'Expected values found from a tree are a typical Merit step in the exam.',
    ],
  });

  /* ================= 5. The normal distribution ================= */
  const nz = (z) => P.Phi(z);
  const CTX = [
    { d: 'The weights of apples', u: 'g', mu: [140, 150, 160], sd: [8, 10, 12] },
    { d: 'The heights of Year 12 students', u: 'cm', mu: [168, 170, 172], sd: [8, 9, 10] },
    { d: 'The times to finish a puzzle', u: 's', mu: [60, 80, 90], sd: [8, 10, 12] },
    { d: 'The volumes in drink bottles', u: 'mL', mu: [250, 500, 600], sd: [4, 5, 8] },
    { d: 'The lengths of snapper caught', u: 'mm', mu: [300, 320, 350], sd: [20, 25, 40] },
    { d: 'The weights of newborn lambs', u: 'kg', mu: [4, 5], sd: [0.4, 0.5, 0.8] },
  ];
  function normalQ(ctx) {
    ctx = ctx || R.pick(CTX); const mu = R.pick(ctx.mu), sd = R.pick(ctx.sd); const zs = [-2, -1.75, -1.5, -1.25, -1, -0.75, -0.5, -0.25, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const z1 = R.pick(zs); let z2 = R.pick(zs); while (z2 <= z1) z2 = R.pick(zs.concat([2.25, 2.5]));
    return { mu, sd, a: P.round(mu + z1 * sd, 4), b: P.round(mu + z2 * sd, 4), z1, z2, c: ctx.d, u: ctx.u };
  }
  P.addUnit({
    id: 'normal', title: 'The normal distribution', mins: 10,
    blurb: 'Standardise with z, find areas with your calculator, and always sketch first.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>Symmetric, bell-shaped, centred on the mean.</h2>'), C(3, `<p>Heights: mean ${m('\\mu = 170')} cm, standard deviation ${m('\\sigma = 8')} cm.</p>`), C(7.5, '<p>About 68% of values are within one standard deviation of the mean.</p>')],
        draw(a) { const v = a.view(140, 200, 0, 1.15); a.line(v.X(140), v.Y(0), v.X(200), v.Y(0), a.C.muted, 1.5); const f = bell(a, v, 170, 8, a.C.c1, 3.5, a.seg(a.p, 0, 0.4));
          const al = a.seg(a.p, 0.55, 0.75); if (al > 0) a.shade(v, f, 162, 178, a.C.c2, 0.3 * al);
          [146, 154, 162, 170, 178, 186, 194].forEach((x) => a.text(String(x), v.X(x), v.Y(0) + 16, { align: 'center', col: a.C.muted, size: 0.85 }));
          a.text('68%', v.X(170), v.Y(0.45), { align: 'center', font: 'pen', col: a.C.pen, alpha: al, size: 1.3 }); a.text('μ', v.X(170), v.Y(1.08), { align: 'center', col: a.C.c1 }); } },
      { dur: 13, card: [C(0, `<h2>Finding a probability: ${m('P(X < 180)')}.</h2>`), C(3, '<p>Sketch and shade. Then use normal cdf on your calculator: lower, upper, σ, μ.</p>'), C(9, '<p>Bigger than 0.5? It should be: 180 is above the mean.</p>')],
        draw(a) { const v = a.view(140, 200, 0, 1.15); a.line(v.X(140), v.Y(0), v.X(200), v.Y(0), a.C.muted, 1.5); const f = bell(a, v, 170, 8, a.C.c1);
          const t = a.seg(a.p, 0.1, 0.5); a.shade(v, f, 140, 140 + 40 * t, a.C.c2, 0.35); a.text('180', v.X(180), v.Y(0) + 16, { align: 'center' }); a.text('170', v.X(170), v.Y(0) + 16, { align: 'center', col: a.C.muted });
          const al = a.seg(a.p, 0.55, 0.7); a.text('z = (180 − 170) ÷ 8 = 1.25', 20, 30, { alpha: al, bg: a.C.sheet }); a.text('P(X < 180) = 0.8944', 20, 64, { alpha: a.seg(a.p, 0.7, 0.8), font: 'pen', col: a.C.pen, size: 1.2 }); } },
      { dur: 12, card: [C(0, '<h2>Between two values.</h2>'), C(3, `<p>${m('P(160 < X < 175)')}: put both ends into normal cdf.</p>`)],
        draw(a) { const v = a.view(140, 200, 0, 1.15); a.line(v.X(140), v.Y(0), v.X(200), v.Y(0), a.C.muted, 1.5); const f = bell(a, v, 170, 8, a.C.c1);
          const t = a.seg(a.p, 0.1, 0.45); a.shade(v, f, 160, 160 + 15 * t, a.C.c2, 0.35); a.text('160', v.X(160), v.Y(0) + 16, { align: 'center' }); a.text('175', v.X(175), v.Y(0) + 16, { align: 'center' });
          a.text(`= ${f4(nz(0.625) - nz(-1.25))}`, v.X(168), v.Y(0.35), { align: 'center', font: 'pen', col: a.C.pen, alpha: a.seg(a.p, 0.5, 0.65), size: 1.2 }); } },
      { dur: 10, card: [C(0, '<h2>Expected numbers.</h2>'), C(3, '<p>Of 200 students, how many under 180 cm? Multiply and round in context.</p>')],
        board: [B(3, '200 \\times 0.8944 = 178.9', 'n × p'), B(5.5, T`\text{about 179 students}`, '', { hl: true })] },
    ],
    example: {
      problem: 'Apple weights are normally distributed with mean 150 g and standard deviation 12 g. Find the probability an apple weighs more than 165 g. In a box of 500, how many would you expect to weigh more than 165 g?',
      steps: [
        { m: 'Sketch: shade to the right of 165 (above the mean, so expect less than 0.5)', note: 'sketch first' },
        { m: m(T`z = \dfrac{165 - 150}{12} = 1.25`) },
        { m: m('P(X > 165) = 0.1056'), note: '4 d.p.' },
        { m: m('500 \\times 0.1056 = 52.8'), note: 'about 53 apples' },
      ],
    },
    faded() { const q = normalQ(); const c = q.c, u = q.u; const ans = nz(q.z2);
      return { kind: 'num', answer: ans, dp: 4, tol: PT, prompt: `${c} are normally distributed with mean ${q.mu} ${u} and standard deviation ${q.sd} ${u}. Find ${m(`P(X < ${n(q.b)})`)}.`, fig: P.svg.normal(q.mu, q.sd, { shade: [null, q.b], marks: [{ x: q.mu, label: String(q.mu) }, { x: q.b, label: n(q.b) }] }),
        scaffold: [m(T`z = \dfrac{${n(q.b)} - ${q.mu}}{${q.sd}} = ${n(q.z2)}`)], hint: 'Use normal cdf with a very low lower bound, or the standard normal for z = ' + n(q.z2) + '.', wrong: [{ v: 1 - ans, msg: 'That is the area above. "Less than" is the area to the left.' }], sol: [m(`P(X < ${n(q.b)}) = ${f4(ans)}`)] }; },
    gens: [
      () => { const q = normalQ(); const c = q.c, u = q.u; const ans = nz(q.z1);
        return { kind: 'num', answer: ans, dp: 4, tol: PT, prompt: `${c} are normally distributed with mean ${q.mu} ${u} and standard deviation ${q.sd} ${u}. Find the probability a value is less than ${n(q.a)} ${u}.`, wrong: [{ v: 1 - ans, msg: 'That is the area to the right. Sketch it: "less than" is the left.' }], sol: [m(T`z = \tfrac{${n(q.a)} - ${q.mu}}{${q.sd}} = ${n(q.z1)}`), m(`P(X < ${n(q.a)}) = ${f4(ans)}`)] }; },
      () => { const q = normalQ(); const c = q.c, u = q.u; const ans = 1 - nz(q.z1);
        return { kind: 'num', answer: ans, dp: 4, tol: PT, prompt: `${c} are normally distributed with mean ${q.mu} ${u} and standard deviation ${q.sd} ${u}. Find the probability a value is more than ${n(q.a)} ${u}.`, wrong: [{ v: 1 - ans, msg: 'That is the area to the left. "More than" is the right.' }], sol: [m(T`z = \tfrac{${n(q.a)} - ${q.mu}}{${q.sd}} = ${n(q.z1)}`), m(`P(X > ${n(q.a)}) = 1 - ${f4(nz(q.z1))} = ${f4(ans)}`)] }; },
      () => { const q = normalQ(); const c = q.c, u = q.u; const ans = nz(q.z2) - nz(q.z1);
        return { kind: 'num', answer: ans, dp: 4, tol: PT, fig: P.svg.normal(q.mu, q.sd, { shade: [q.a, q.b], marks: [{ x: q.a, label: n(q.a) }, { x: q.mu, label: String(q.mu) }, { x: q.b, label: n(q.b) }].filter((x, k, arr) => arr.findIndex((y) => y.x === x.x) === k) }), prompt: `${c} are normally distributed with mean ${q.mu} ${u} and standard deviation ${q.sd} ${u}. Find ${m(`P(${n(q.a)} < X < ${n(q.b)})`)}.`, wrong: [{ v: nz(q.z2) + nz(q.z1), msg: 'Subtract the smaller area from the bigger one, do not add.' }], sol: [m(`P(X < ${n(q.b)}) - P(X < ${n(q.a)})`), m(`= ${f4(nz(q.z2))} - ${f4(nz(q.z1))} = ${f4(ans)}`)] }; },
      () => { const q = normalQ(CTX[4]); const N = R.pick([200, 300, 500, 1000]); const p = 1 - nz(q.z1), E = N * p;
        return { kind: 'num', answer: Math.round(E), tol: 1.01, prompt: `Snapper lengths are normally distributed, mean ${q.mu} mm, standard deviation ${q.sd} mm. Of ${N} snapper caught, how many would you expect to be longer than ${n(q.a)} mm? Give a whole number.`, wrong: [{ v: Math.round(N * (1 - p)), msg: 'That counts the shorter ones. "Longer than" is the right-hand area.' }], sol: [m(`P(X > ${n(q.a)}) = ${f4(p)}`), m(`${N} \\times ${f4(p)} = ${n(E, 1)}`), 'About ' + Math.round(E) + ' snapper.'] }; },
      () => { const q = normalQ(); const c = q.c, u = q.u; const z = q.z1;
        return { kind: 'num', answer: z, prompt: `${c} have mean ${q.mu} ${u} and standard deviation ${q.sd} ${u}. Find the z-score of ${n(q.a)} ${u}.`, wrong: [{ v: -z, msg: 'Check the sign: below the mean gives a negative z.' }], sol: [m(T`z = \dfrac{x - \mu}{\sigma} = \dfrac{${n(q.a)} - ${q.mu}}{${q.sd}} = ${n(z)}`)] }; },
    ],
    tips: [
      '<span class="pen">Sketch, shade, label.</span> Annotated sketches support Merit and Excellence answers.',
      'Sense-check: above the mean and "less than" means an answer over 0.5.',
      'Write the probability statement, like ' + m('P(X > 165) = 0.1056') + ', not just the number.',
      'Probabilities to 4 decimal places. Expected numbers: round sensibly and say "about".',
    ],
  });

  /* ================= 6. Inverse normal ================= */
  P.addUnit({
    id: 'inverse-normal', title: 'Inverse normal: finding values, σ and μ', mins: 10,
    blurb: 'Work backwards from an area to a value. The jump from Achieved to Merit.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>Inverse normal works backwards.</h2>'), C(3, '<p>You know the area. You want the value that cuts it off.</p>'), C(8, '<p>On most calculators: InvN with the area to the <b>left</b>.</p>')],
        draw(a) { const v = a.view(140, 200, 0, 1.15); a.line(v.X(140), v.Y(0), v.X(200), v.Y(0), a.C.muted, 1.5); const f = bell(a, v, 170, 8, a.C.c1);
          a.shade(v, f, 140, 183.16, a.C.c2, 0.3 * a.seg(a.p, 0.05, 0.25)); const al = a.seg(a.p, 0.3, 0.45); a.text('area 0.95', v.X(166), v.Y(0.35), { align: 'center', font: 'pen', col: a.C.pen, alpha: al, size: 1.2 });
          const al2 = a.seg(a.p, 0.55, 0.7); a.alpha(al2, () => a.line(v.X(183.16), v.Y(0), v.X(183.16), v.Y(0.3), a.C.pen, 3)); a.text('x = ?', v.X(183.16), v.Y(0) + 18, { align: 'center', font: 'pen', col: a.C.pen, alpha: al2 }); a.text('top 5%', v.X(190), v.Y(0.2), { col: a.C.muted, alpha: al2 }); } },
      { dur: 12, card: [C(0, '<h2>The tallest 5%.</h2>'), C(3, `<p>Mean 170 cm, sd 8 cm. Top 5% means 95% are below.</p>`)],
        board: [B(0.5, T`P(X > x) = 0.05 \;\Rightarrow\; P(X < x) = 0.95`, 'left area'), B(3.5, T`z = 1.6449`), B(6, T`x = 170 + 1.6449 \times 8`), B(8.5, T`x = 183.2 \text{ cm}`, '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>Finding σ (a Merit favourite).</h2>'), C(3, '<p>Bottles: mean 500 mL. 2% contain less than 490 mL. Find σ.</p>'), C(9.5, '<p>Below the mean, so z is negative. Examiners checked for this.</p>')],
        board: [B(2.5, T`z = \text{InvNorm}(0.02) = -2.0537`, 'negative!'), B(5.5, T`\dfrac{490 - 500}{\sigma} = -2.0537`), B(8.5, T`\sigma = \dfrac{-10}{-2.0537} = 4.87 \text{ mL}`, '', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>Finding μ.</h2>'), C(3, '<p>σ = 3. 10% of values are above 60. Find the mean.</p>')],
        board: [B(2, T`P(X < 60) = 0.9 \;\Rightarrow\; z = 1.2816`), B(5, T`\dfrac{60 - \mu}{3} = 1.2816`), B(7.5, T`\mu = 60 - 3.8448 = 56.16`, '', { hl: true })] },
    ],
    example: {
      problem: 'Lamb weights are normally distributed with mean 18 kg and standard deviation 2.5 kg. The heaviest 10% are sold as premium. What is the minimum weight for premium?',
      steps: [
        { m: 'Heaviest 10%: area to the right is 0.1, so area to the left is 0.9', note: 'left area' },
        { m: m('z = 1.2816') + ' (positive: above the mean)' },
        { m: m('x = 18 + 1.2816 \\times 2.5 = 21.20') },
        { m: 'Premium lambs weigh at least about 21.2 kg.', note: 'answer in context' },
      ],
    },
    faded() { const mu = R.pick([50, 70, 100, 150]), sd = R.pick([5, 8, 10, 15]), p = R.pick([0.8, 0.85, 0.9, 0.95, 0.975]); const z = P.invPhi(p), x = mu + z * sd;
      return { kind: 'num', answer: x, dp: 1, tol: 0.11, prompt: `${m('X')} is normal with mean ${mu} and standard deviation ${sd}. Find ${m('x')} such that ${m(`P(X < x) = ${p}`)}. Give 1 decimal place.`, scaffold: [m(`z = \\text{InvNorm}(${p}) = ${n(z, 4)}`)], hint: 'x = mean + z × standard deviation', wrong: [{ v: mu - z * sd, msg: 'Area ' + p + ' to the left is above the mean, so x is bigger than ' + mu + '.' }], sol: [m(`x = ${mu} + ${n(z, 4)} \\times ${sd} = ${P.f(x, 1)}`)] }; },
    gens: [
      () => { const mu = R.pick([60, 75, 100, 170, 250]), sd = R.pick([4, 6, 8, 10, 15]), p = R.pick([0.1, 0.2, 0.25, 0.7, 0.8, 0.9, 0.95]); const x = mu + P.invPhi(p) * sd;
        return { kind: 'num', answer: x, dp: 1, tol: 0.11, prompt: `${m('X')} is normal with mean ${mu} and standard deviation ${sd}. Find the value ${m('x')} with ${m(`P(X < x) = ${p}`)}. Give 1 decimal place.`, wrong: [{ v: mu - P.invPhi(p) * sd, msg: 'Check which side of the mean x is on.' }], sol: [m(`z = ${n(P.invPhi(p), 4)}`), m(`x = ${mu} ${P.invPhi(p) < 0 ? '-' : '+'} ${n(Math.abs(P.invPhi(p)), 4)} \\times ${sd} = ${P.f(x, 1)}`)] }; },
      () => { const mu = R.pick([55, 60, 65, 70]), sd = R.pick([8, 10, 12, 15]), top = R.pick([5, 10, 15, 20, 2.5]); const z = P.invPhi(1 - top / 100), x = mu + z * sd;
        return { kind: 'num', answer: x, dp: 1, tol: 0.11, prompt: `Test scores are normal with mean ${mu} and standard deviation ${sd}. What score is needed to be in the top ${top}%? Give 1 decimal place.`, wrong: [{ v: mu + P.invPhi(top / 100) * sd, msg: 'Top ' + top + '% means ' + (100 - top) + '% below. Use the left area ' + n(1 - top / 100) + '.' }], sol: [`Area to the left: ${n(1 - top / 100)}`, m(`z = ${n(z, 4)}`), m(`x = ${mu} + ${n(z, 4)} \\times ${sd} = ${P.f(x, 1)}`)] }; },
      () => { const mu = R.pick([250, 330, 500, 750, 1000]), d = R.pick([5, 8, 10, 12, 15]), pc = R.pick([1, 2, 2.5, 5, 10]); const z = P.invPhi(pc / 100), sd = -d / z;
        return { kind: 'num', answer: sd, dp: 2, tol: 0.02, prompt: `Bottles are filled with a mean of ${mu} mL. ${pc}% of bottles contain less than ${mu - d} mL. Assuming a normal distribution, find the standard deviation. Give 2 decimal places.`, wrong: [{ v: d / P.invPhi(1 - pc / 100) * -1, msg: 'The standard deviation must be positive. Check the sign of z: below the mean is negative.' }], sol: [m(`z = \\text{InvNorm}(${n(pc / 100)}) = ${n(z, 4)}`), m(T`\dfrac{${mu - d} - ${mu}}{\sigma} = ${n(z, 4)}`), m(T`\sigma = \dfrac{${-d}}{${n(z, 4)}} = ${P.f(sd, 2)}`) + ' mL'] }; },
      () => { const sd = R.pick([2, 3, 4, 5, 8]), x = R.pick([20, 40, 60, 80, 100]), pc = R.pick([5, 10, 15, 20]); const z = P.invPhi(1 - pc / 100), mu = x - z * sd;
        return { kind: 'num', answer: mu, dp: 1, tol: 0.11, prompt: `${m('X')} is normal with standard deviation ${sd}. ${pc}% of values are above ${x}. Find the mean. Give 1 decimal place.`, wrong: [{ v: x + z * sd, msg: 'Above-the-mean value: ' + x + ' is bigger than μ, so subtract.' }], sol: [m(`P(X < ${x}) = ${n(1 - pc / 100)} \\Rightarrow z = ${n(z, 4)}`), m(T`\dfrac{${x} - \mu}{${sd}} = ${n(z, 4)}`), m(`\\mu = ${x} - ${n(z * sd, 4)} = ${P.f(mu, 1)}`)] }; },
      () => { const pc = R.pick([5, 10, 15, 20, 25]); const below = Math.random() < 0.5; const z = P.invPhi(below ? pc / 100 : 1 - pc / 100);
        return P.mcq({ prompt: `The ${below ? 'lowest' : 'highest'} ${pc}% of a normal distribution lie ${below ? 'below' : 'above'} a value ${m('x')}. Which z-score goes with ${m('x')}?`, sol: [`${below ? 'Below' : 'Above'} the mean, so z is ${below ? 'negative' : 'positive'}.`, m(`z = \\text{InvNorm}(${n(below ? pc / 100 : 1 - pc / 100)}) = ${n(z, 4)}`)] }, [
          { t: m(n(z, 4)), ok: true }, { t: m(n(-z, 4)), why: `The value is ${below ? 'below' : 'above'} the mean, so z must be ${below ? 'negative' : 'positive'}.` },
          { t: m(n(pc / 100, 4)), why: 'That is the area, not the z-score.' }, { t: m(n(P.invPhi(pc / 200 + 0.5), 4)), why: 'Use the area to the left of x with InvNorm.' }]); },
    ],
    tips: [
      '<span class="pen">InvNorm uses the area to the LEFT.</span> Top 5%? Enter 0.95.',
      'Below the mean, z is negative. Write the sign every time.',
      'Finding σ or μ: write ' + m(T`z = \dfrac{x - \mu}{\sigma}`) + ', substitute, then rearrange. The steps earn Merit.',
      'Sketch with the known area shaded and the unknown marked.',
    ],
  });

  /* ================= 7. Comparing distributions ================= */
  const SHAPES = {
    sym: [1, 3, 7, 12, 16, 12, 7, 3, 1],
    right: [6, 14, 16, 12, 8, 5, 3, 2, 1],
    left: [1, 2, 3, 5, 8, 12, 16, 14, 6],
    bi: [3, 9, 12, 7, 3, 7, 12, 9, 3],
  };
  const SHAPE_WORDS = { sym: 'roughly symmetric', right: 'skewed to the right (long tail to high values)', left: 'skewed to the left (long tail to low values)', bi: 'bimodal (two peaks)' };
  const HCTX = [['Commute time', 'minutes', 0, 5], ['Weekly screen time', 'hours', 0, 5], ['Height', 'cm', 140, 5], ['Test mark', '%', 10, 10]];
  const jitter = (arr) => arr.map((c) => Math.max(0, c + R.int(-1, 1)));
  const shift = (arr, k) => { const out = Array(arr.length).fill(0); arr.forEach((c, i) => { const j = i + k; if (j >= 0 && j < out.length) out[j] += c; }); return out; };
  const edgesFor = (h, nb) => Array.from({ length: nb + 1 }, (_, k) => h[2] + k * h[3]);
  const median = (bins, edges) => { const N = bins.reduce((a, b) => a + b, 0); let acc = 0; for (let k = 0; k < bins.length; k++) { if (acc + bins[k] >= N / 2) return [edges[k], edges[k + 1]]; acc += bins[k]; } };

  P.addUnit({
    id: 'distributions', title: 'Comparing distributions', mins: 9,
    blurb: 'Shape, centre, spread, with numbers and context. And when a normal model does not fit.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>Shape first.</h2>'), C(3, '<p>Symmetric, or skewed? A skew is named after its long tail.</p>'), C(8, '<p>Right-skewed: most values low, a few very high, like incomes or commute times.</p>')],
        draw(a) { const sets = [['symmetric', SHAPES.sym, a.C.c1], ['skewed right', SHAPES.right, a.C.c2]]; const w = a.W / 2;
          sets.forEach(([lab, bins, col], s) => { const al = a.seg(a.p, s * 0.3, s * 0.3 + 0.2); const bw = (w - 60) / bins.length, base = a.H * 0.75;
            bins.forEach((c, k) => a.box(s * w + 30 + k * bw, base - c * (a.H * 0.035), bw - 3, c * (a.H * 0.035), { fill: col, stroke: false, alpha: al * 0.85 }));
            a.line(s * w + 26, base, s * w + w - 26, base, a.C.muted, 1.5); a.text(lab, s * w + w / 2, base + 30, { align: 'center', font: 'pen', col: a.C.pen, alpha: al }); }); } },
      { dur: 12, card: [C(0, '<h2>Centre: median or mean.</h2>'), C(3, '<p>In a skewed distribution the mean is dragged towards the tail.</p>'), C(8, '<p>So for skewed data, the median is the better summary of a typical value.</p>')],
        board: [B(0.5, T`\text{right skew: mean} > \text{median}`), B(3, T`\text{left skew: mean} < \text{median}`), B(5.5, T`\text{symmetric: mean} \approx \text{median}`)] },
      { dur: 11, card: [C(0, '<h2>Spread: IQR or standard deviation.</h2>'), C(3, '<p>Always compare with numbers, and always in context.</p>'), C(7, '<p class="pen">"Year 13 commute times were more spread out (IQR 18 min vs 9 min)."</p>')],
        board: [B(0.5, T`\text{IQR} = Q_3 - Q_1`), B(3, T`\text{sd: a typical distance from the mean}`)] },
      { dur: 11, card: [C(0, '<h2>When is a normal model wrong?</h2>'), C(3, '<p>Normal means symmetric, one peak, bell-shaped. A strongly skewed or two-peaked histogram does not fit.</p>'), C(8, '<p>Recognising this was a 2025 Excellence skill.</p>')],
        draw(a) { const bins = SHAPES.right; const bw = (a.W * 0.7) / bins.length, base = a.H * 0.75, x0 = a.W * 0.15; const k = a.H * 0.035;
          bins.forEach((c, i) => a.box(x0 + i * bw, base - c * k, bw - 3, c * k, { fill: a.C.c2, stroke: false, alpha: 0.8 }));
          const al = a.seg(a.p, 0.3, 0.5); const ctx = a.ctx; ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = a.C.c1; ctx.lineWidth = 3; ctx.beginPath();
          for (let i = 0; i <= 100; i++) { const x = x0 + (i / 100) * bins.length * bw; const z = (i / 100 - 0.42) / 0.2; const y = base - 13.5 * k * Math.exp(-z * z / 2); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
          a.text('normal curve does not fit the tail', a.W / 2, base + 30, { align: 'center', font: 'pen', col: a.C.pen, alpha: a.seg(a.p, 0.5, 0.65) }); } },
    ],
    example: {
      problem: 'Commute times (minutes) for two year groups. Year 12: median 18, IQR 9, symmetric. Year 13: median 24, IQR 18, skewed to the right. Compare them.',
      steps: [
        { m: '<b>Shape:</b> Year 12 times are roughly symmetric; Year 13 times are skewed to the right, with a few very long commutes.', note: 'shape' },
        { m: '<b>Centre:</b> Year 13 students typically take longer: median 24 min compared with 18 min.', note: 'centre + numbers' },
        { m: '<b>Spread:</b> Year 13 times are more variable: IQR 18 min compared with 9 min.', note: 'spread + numbers' },
        { m: 'A normal model may suit Year 12, but not Year 13 because of the skew.', note: 'Excellence' },
      ],
    },
    faded() { const key = R.pick(['sym', 'right', 'left']); const h = R.pick(HCTX); const bins = jitter(SHAPES[key]); const e = edgesFor(h, bins.length); const [lo, hi] = median(bins, e);
      const opts = []; for (let k = 0; k < bins.length; k++) opts.push([e[k], e[k + 1]]); const near = opts.filter(([x]) => Math.abs(x - lo) <= 2 * h[3] && x !== lo).slice(0, 3);
      return P.mcq({ fig: P.svg.hist([{ name: h[0], bins, col: 'var(--c4)' }], e, { unit: h[1] }), prompt: `${bins.reduce((a, b) => a + b, 0)} values are shown. In which interval is the median?`,
        scaffold: [`The median is the middle value: value number ${Math.ceil(bins.reduce((a, b) => a + b, 0) / 2)} when they are in order.`, 'Add up the bars from the left until you pass halfway.'], sol: [`The running total passes halfway in the ${lo} to ${hi} interval.`] },
        [{ t: `${lo} to ${hi}`, ok: true }].concat(near.map(([a2, b2]) => ({ t: `${a2} to ${b2}`, why: 'Add the bar heights from the left. The median is where the running total passes halfway.' })))); },
    gens: [
      () => { const key = R.pick(['sym', 'right', 'left', 'bi']); const h = R.pick(HCTX); const bins = jitter(SHAPES[key]);
        return P.mcq({ fig: P.svg.hist([{ name: h[0], bins, col: 'var(--c4)' }], edgesFor(h, bins.length), { unit: h[1] }), prompt: 'Which best describes the shape of this distribution?', sol: [`It is ${SHAPE_WORDS[key]}.`] },
          Object.keys(SHAPE_WORDS).map((k) => ({ t: SHAPE_WORDS[k][0].toUpperCase() + SHAPE_WORDS[k].slice(1), ok: k === key, why: k === key ? '' : 'Look at where the tail is: a skew is named after the long tail, not the peak.' }))); },
      () => { const h = R.pick(HCTX); const k = R.pick([1, 2]); const A = jitter(SHAPES.sym), Bb = jitter(shift(SHAPES.sym, k)); const hiName = 'Group B';
        return P.mcq({ fig: P.svg.hist([{ name: 'Group A', bins: A, col: 'var(--c1)' }, { name: 'Group B', bins: Bb, col: 'var(--c3)' }], edgesFor(h, A.length), { unit: h[1] }), prompt: `Compare the centres of these two distributions of ${h[0].toLowerCase()}.`, sol: ['Group B\'s peak and middle sit further right: higher values are typical for Group B.'] }, [
          { t: `${hiName} has the higher median ${h[0].toLowerCase()}.`, ok: true }, { t: 'Group A has the higher median.', why: 'Group A\'s values sit further left, so they are lower.' },
          { t: 'They have the same centre because they have the same shape.', why: 'Same shape, but Group B is shifted to the right.' }, { t: 'Group B is more spread out.', why: 'That is about spread, not centre, and the widths look similar.' }]); },
      () => { const h = R.pick(HCTX); const narrow = [0, 1, 4, 14, 22, 14, 4, 1, 0], wide = [3, 5, 7, 9, 10, 9, 7, 5, 3];
        const swap = Math.random() < 0.5; const A = jitter(swap ? wide : narrow), Bb = jitter(swap ? narrow : wide);
        return P.mcq({ fig: P.svg.hist([{ name: 'Group A', bins: A, col: 'var(--c1)' }, { name: 'Group B', bins: Bb, col: 'var(--c3)' }], edgesFor(h, A.length), { unit: h[1] }), prompt: 'Which statement about spread is correct?', sol: [`Group ${swap ? 'A' : 'B'}'s values cover a wider range and are less bunched in the middle.`] }, [
          { t: `Group ${swap ? 'A' : 'B'} is more spread out.`, ok: true }, { t: `Group ${swap ? 'B' : 'A'} is more spread out.`, why: 'A taller, narrower histogram means values are bunched together: less spread.' },
          { t: 'They have the same spread because they have the same centre.', why: 'Centre and spread are separate features.' }, { t: 'Group A is skewed to the right.', why: 'Both are roughly symmetric.' }]); },
      () => { const key = R.pick(['right', 'left', 'bi', 'sym']); const h = R.pick(HCTX); const bins = jitter(SHAPES[key]); const fits = key === 'sym';
        return P.mcq({ fig: P.svg.hist([{ name: h[0], bins, col: 'var(--c4)' }], edgesFor(h, bins.length), { unit: h[1] }), prompt: 'Would a normal distribution be a good model for this data?', sol: [fits ? 'Yes: it is roughly symmetric with one peak, like a bell.' : `No: the data is ${SHAPE_WORDS[key]}, but a normal distribution is symmetric with one peak.`] }, [
          { t: 'Yes: it is roughly symmetric and bell-shaped.', ok: fits, why: fits ? '' : `Look again: it is ${SHAPE_WORDS[key]}.` },
          { t: `No: it is ${key === 'sym' ? 'skewed' : SHAPE_WORDS[key].split(' (')[0]}, and a normal distribution is symmetric with one peak.`, ok: !fits, why: !fits ? '' : 'This one is roughly symmetric with one peak, so a normal model is reasonable.' },
          { t: 'Yes: any data with enough values is normal.', why: 'Sample size does not make skewed data symmetric.' }]); },
      () => { const right = Math.random() < 0.5;
        return P.mcq({ prompt: `A distribution is skewed to the ${right ? 'right' : 'left'}. How do the mean and median usually compare?`, sol: [`The mean is pulled towards the long tail, so it is ${right ? 'larger' : 'smaller'} than the median.`] }, [
          { t: `The mean is ${right ? 'greater' : 'less'} than the median.`, ok: true }, { t: `The mean is ${right ? 'less' : 'greater'} than the median.`, why: 'The mean is dragged towards the tail.' }, { t: 'They are equal.', why: 'Only in a symmetric distribution are they about equal.' }]); },
    ],
    tips: [
      '<span class="pen">Shape, centre, spread: with numbers, in context.</span> All three, with values, for Excellence.',
      'Name skew by the tail: long tail to the right means skewed right.',
      'Use comparison words: "typically higher", "more variable", and quote both values.',
      'If asked whether a normal model fits, comment on symmetry and the number of peaks.',
    ],
  });
})();
