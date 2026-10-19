/* AS 91262 (Maths 2.7) Apply calculus methods in solving problems */
(function () {
  const P = NP, R = P.R, T = String.raw;
  const m = (tex) => '$' + String(tex).replace(/</g, '\\lt ').replace(/([a-z])\^\{1\}/g, '$1') + '$'; // x^{1} reads as x
  const B = (at, tex, note, o = {}) => Object.assign({ at, tex: tex == null ? tex : tex.replace(/</g, '\\lt '), note }, o);
  const C = (at, html) => ({ at, html });
  const nf = P.nf, poly = P.poly, sc = P.sc, ev = P.evalPoly, d = P.dPoly, I = P.iPoly;
  const par = (v) => (v < 0 ? `(${nf(v)})` : nf(v));

  /* ---------- "Still don't understand?" walkthroughs ---------- */
  const St = (say, mm) => ({ say, m: mm });
  const co = (k, v = 'x') => (k === 1 ? v : k === -1 ? '-' + v : nf(k) + v);
  const br = (c) => (c < 0 ? '(' + nf(c) + ')' : nf(c));
  const sub = (terms, x, v = 'x') => poly(terms, v).split(v).join('(' + nf(x) + ')'); // substitute, with brackets
  // power rule, one line per term
  const diffLines = (t, v = 'x') => t.filter(([c]) => c !== 0).map(([c, p]) => p === 0
    ? St(`${m(nf(c))} is a number on its own, so it becomes 0. A flat line has no slope.`, m(T`${nf(c)} \to 0`))
    : p === 1 ? St(`${m(poly([[c, 1]], v))} becomes just ${m(nf(c))}: the ${v} disappears.`, m(T`${poly([[c, 1]], v)} \to ${nf(c)}`))
    : St(`${m(poly([[c, p]], v))}: multiply by the power (${m(T`${p} \times ${br(c)} = ${nf(c * p)}`)}), then take one off the power (${p} − 1 = ${p - 1}).`, m(T`${poly([[c, p]], v)} \to ${poly([[c * p, p - 1]], v)}`)));
  // reverse power rule, one line per term
  const intLines = (t, v = 'x') => t.filter(([c]) => c !== 0).map(([c, p]) => p === 0
    ? St(`${m(nf(c))} is a number on its own, so it gains ${v === 'x' ? 'an' : 'a'} ${v}: it becomes ${m(poly([[c, 1]], v))}. (Differentiate ${m(poly([[c, 1]], v))} and you get ${m(nf(c))} back.)`, m(T`${nf(c)} \to ${poly([[c, 1]], v)}`))
    : St(`${m(poly([[c, p]], v))}: add one to the power (${p} + 1 = ${p + 1}), then divide by the new power (${m(T`${nf(c)} \div ${p + 1} = ${nf(c / (p + 1))}`)}).`, m(T`${poly([[c, p]], v)} \to ${poly([[c / (p + 1), p + 1]], v)}`)));
  // gradient of a polynomial at a point
  const moreGrad = (t, x0, fn) => {
    const dt = d(t), ans = ev(dt, x0), name = fn ? "f'(x)" : T`\dfrac{dy}{dx}`;
    return { steps: [
      St('The gradient comes from the derivative, so differentiate first. Use the power rule on each term: multiply by the power, then take one off the power.'),
      ...diffLines(t),
      St('Put the pieces together.', m(`${name} = ${poly(dt)}`)),
      St(`Now substitute x = ${x0}. Put it in brackets, especially if it is negative.`, m(`${fn ? `f'(${x0})` : '\\text{gradient}'} = ${sub(dt, x0)} = ${nf(ans)}`)),
    ], check: `On a graphics calculator, graph the curve and use the dy/dx tool at x = ${x0}. It shows ${nf(ans)}.`, trap: `Putting x = ${x0} into the original function. That gives the height of the curve, ${m(nf(ev(t, x0)))}, not its gradient.` };
  };
  // tangent to a curve at x1
  const moreTangent = (t, x1, mm, y1, c, askC) => ({ steps: [
    St('A tangent is a straight line, y = mx + c. You need its gradient m and one point it passes through.'),
    St('The tangent has the same gradient as the curve where they touch. Differentiate.', m(T`\dfrac{dy}{dx} = ${poly(d(t))}`)),
    St(`Substitute x = ${x1} to get m.`, m(`m = ${sub(d(t), x1)} = ${nf(mm)}`)),
    St('The point is on the curve, so get its y value from the original equation, not the derivative.', m(`y_1 = ${sub(t, x1)} = ${y1}`)),
    St('Use the straight-line formula with that point and gradient.', m(`y - ${par(y1)} = ${nf(mm)}(x - ${par(x1)})`)),
    St('Expand and rearrange into y = mx + c.', m(`y = ${poly([[mm, 1], [c, 0]])}`)),
    ...(askC ? [St(`So c = ${c}.`)] : []),
  ], check: `At x = ${x1}, your line gives ${mm * x1 + c} and the curve gives ${y1}. They match, so the line touches the curve there.`, trap: 'Using the derivative to get the y value. The point comes from the original curve.' });
  // turning point of a parabola a x^2 + ...
  const moreTP = (t, a, h, k) => ({ steps: [
    St('At a turning point the curve is flat for an instant, so the gradient is zero.'),
    St('Differentiate.', m(`y' = ${poly(d(t))}`)),
    St('Set the derivative to zero and solve.', m(T`${poly(d(t))} = 0 \;\Rightarrow\; x = ${h}`)),
    St('A point needs a y value too. Put x back into the original equation.', m(`y = ${sub(t, h)} = ${k}`)),
    St(`So the turning point is (${h}, ${k}). The ${m('x^2')} term is ${a > 0 ? 'positive, so the curve is ∪-shaped and this is a minimum' : 'negative, so the curve is ∩-shaped and this is a maximum'}.`),
  ], check: `Try x a little either side, ${h - 1} and ${h + 1}: both give y = ${a + k}, which is ${a > 0 ? 'higher' : 'lower'} than ${k}.`, trap: 'Stopping once you have x. The question wants the point, so find y as well.' });
  // anti-differentiate then find c from a point
  const moreFindC = (t, F, x1, y1, c, fname, extra = []) => ({ steps: [
    St('Anti-differentiate each term: add one to the power, then divide by the new power.'),
    ...intLines(t),
    St('Add c. Any number on its own would have disappeared when differentiating, so you must allow for it.', m(`${fname} = ${poly(F)} + c`)),
    St(`The curve passes through (${x1}, ${y1}). Substitute x = ${x1} and y = ${y1}.`, m(`${y1} = ${sub(F, x1)} + c`)),
    St('Work out the numbers, then solve for c.', m(T`${y1} = ${nf(ev(F, x1))} + c \;\Rightarrow\; c = ${c}`)),
    ...extra,
  ], check: `Differentiate ${m(poly(F.concat([[c, 0]])))}. You get ${m(poly(t))} back.`, trap: 'Leaving out c, or adding it after substituting. Write + c first, then substitute.' });
  // fence against a wall: three sides, total L
  const moreFence = (L, x, A) => ({ steps: [
    St(`Let the width (the two sides that meet the wall) be x m. The fence covers x + x + length = ${L}, so the length is ${m(`${L} - 2x`)}.`),
    St('Write the area using only x.', m(`A = x(${L} - 2x) = ${L}x - 2x^2`)),
    St('The biggest area is at a turning point, where the gradient is zero. Differentiate and set to zero.', m(T`A' = ${L} - 4x = 0 \;\Rightarrow\; x = ${x}`)),
    St('Prove it is a maximum.', m(T`A'' = -4 < 0`)),
    St('Now answer the question asked: the area, not x.', m(T`A = ${x} \times ${L - 2 * x} = ${A}`)),
    St(`The largest area is ${A} m².`),
  ], check: `Try a width 1 m either side, ${x - 1} m: the area is ${(x - 1) * (L - 2 * (x - 1))} m², which is smaller.`, trap: `Stopping at x = ${x}. That is the best width, but the question asks for the area.` });

  // graph with an automatic y range
  function autoGraph(fns, x0, x1, o = {}) {
    let lo = Infinity, hi = -Infinity;
    for (const fn of fns) for (let k = 0; k <= 100; k++) { const y = fn.f(x0 + ((x1 - x0) * k) / 100); lo = Math.min(lo, y); hi = Math.max(hi, y); }
    const pad = Math.max(1, (hi - lo) * 0.12); let y0 = Math.floor(lo - pad), y1 = Math.ceil(hi + pad);
    if (y0 > 0) y0 = -1; if (y1 < 0) y1 = 1;
    const span = y1 - y0, ystep = span > 40 ? 10 : span > 20 ? 5 : span > 10 ? 2 : 1;
    return P.svg.graph(fns, Object.assign({ x0, x1, y0, y1, ystep, lystep: ystep * (span / ystep > 10 ? 2 : 1), lstep: 1 }, o));
  }

  /* ================= 1. The gradient function ================= */
  P.addUnit({
    id: 'derivative', title: 'Differentiating: the gradient function', mins: 10,
    blurb: 'Turn any polynomial into its gradient formula, including fractions and negatives.',
    recap: 'Differentiating gives a formula for the gradient (steepness) of a curve at any x. The power rule: multiply by the power, then take one off the power. A number on its own disappears. Expand brackets before you differentiate.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>Differentiating finds the gradient of a curve at any point.</h2>'), C(3.5, '<p>A curve\'s steepness keeps changing. The orange tangent touches it at one point and shows the gradient there.</p>'), C(8.5, '<p class="pen">left: negative, bottom: zero, right: positive</p>')],
        draw(a) { const v = a.view(-3, 3, -1.5, 8); a.axes(v); const f = (x) => x * x, df = (x) => 2 * x; a.plot(v, f, a.C.c1);
          const x = -2.4 + 4.8 * a.seg(a.p, 0.05, 0.95); const g = a.tangent(v, f, df, x, 1.1, a.C.c2);
          a.text(`gradient = ${P.n(g, 1).replace('-', '−')}`, 20, 30, { col: a.C.c2, size: 1.15, bg: a.C.sheet }); a.text('y = x²', v.X(2.2), v.Y(7.2), { col: a.C.c1, align: 'right' }); } },
      { dur: 11, card: [C(0, '<h2>The derivative is a formula for the gradient.</h2>'), C(2.5, `<p class="eq">${m(T`y = x^2 \;\Rightarrow\; \dfrac{dy}{dx} = 2x`)}</p>`), C(6, `<p>At ${m('x = 1.5')} the gradient is ${m(T`2 \times 1.5 = 3`)}. The purple line is the gradient function.</p>`)],
        draw(a) { const v = a.view(-3, 3, -6, 8); a.axes(v); a.plot(v, (x) => x * x, a.C.c1); a.plot(v, (x) => 2 * x, a.C.c4, 3, a.seg(a.p, 0.15, 0.5));
          const al = a.seg(a.p, 0.55, 0.7); a.tangent(v, (x) => x * x, (x) => 2 * x, 1.5, 1, a.C.c2, al); a.dot(v, 1.5, 3, a.C.c4, 7, al);
          a.alpha(al, () => a.line(v.X(1.5), v.Y(2.25), v.X(1.5), v.Y(3), a.C.muted, 1.5, [4, 4])); a.text('dy/dx = 2x', v.X(-2.8), v.Y(-5), { col: a.C.c4, alpha: a.seg(a.p, 0.3, 0.5) }); a.text('at x = 1.5, gradient = 3', v.X(-2.8), v.Y(7.2), { font: 'pen', col: a.C.pen, alpha: al, bg: a.C.sheet }); } },
      { dur: 12, card: [C(0, '<h2>The power rule.</h2>'), C(2.5, '<p>Multiply by the power, then take one off the power.</p>'), C(8, '<p>Each term separately. Lone numbers vanish because a flat line has gradient zero.</p>')],
        board: [B(0.5, 'y = 3x^4', '', { big: true }), B(3, T`\dfrac{dy}{dx} = 4 \times 3x^{3} = 12x^3`, 'times power, power − 1', { hl: true }), B(6.5, T`5x \;\to\; 5`, 'x disappears'), B(8.5, T`7 \;\to\; 0`, 'constants vanish')] },
      { dur: 11, card: [C(0, '<h2>Fractions work exactly the same.</h2>'), C(3, '<p>The examiners noted students losing marks when a fraction was involved. Slow down on these.</p>')],
        board: [B(0.5, T`f(x) = \tfrac{1}{3}x^3 - 2x^2 + 5x - 1`), B(3.5, T`f'(x) = 3 \times \tfrac13 x^2 - 2 \times 2x + 5`), B(6.5, "f'(x) = x^2 - 4x + 5", '⅓ × 3 = 1', { hl: true })] },
      { dur: 10, card: [C(0, '<h2>Brackets? Expand first.</h2>'), C(3, '<p>You cannot differentiate each bracket separately. Multiply out, then differentiate.</p>')],
        board: [B(0.5, 'y = (x + 2)(x - 3)', '', { big: true }), B(2.5, T`\dfrac{dy}{dx} = (1)(1) = 1`, 'no!', { wrong: true }), B(5, 'y = x^2 - x - 6', 'expand first'), B(7, T`\dfrac{dy}{dx} = 2x - 1`, '', { hl: true })] },
    ],
    example: {
      problem: `${m(T`f(x) = 2x^3 - \tfrac12 x^2 + 4x - 7`)}. Find the gradient of the curve at ${m('x = -2')}.`,
      steps: [
        { m: m("f'(x) = 6x^2 - x + 4"), note: '½ × 2 = 1' },
        { m: m("f'(-2) = 6(-2)^2 - (-2) + 4"), note: 'brackets round negatives' },
        { m: m('= 24 + 2 + 4') },
        { m: m('= 30'), note: 'the gradient at x = −2' },
      ],
    },
    faded() {
      const k = R.pick([3, 3, 2]), a = R.nz(-4, 4), b = R.nz(-6, 6), x0 = R.nz(-3, 3);
      const terms = k === 3 ? [[1 / 3, 3], [a, 2], [b, 1], [R.int(-9, 9), 0]] : [[1 / 2, 2], [a, 1], [R.int(-9, 9), 0]];
      const dt = d(terms), ans = ev(dt, x0);
      return { kind: 'num', answer: ans, prompt: `${m(`f(x) = ${poly(terms)}`)}. Find the gradient at ${m(`x = ${x0}`)}.`,
        scaffold: [m(`f'(x) = ${poly(dt)}`)], hint: `Substitute x = ${x0} into f′(x), with brackets round negatives.`,
        wrong: [{ v: ev(terms, x0), msg: 'That is f(x), the height of the curve. The gradient comes from f′(x).' }],
        more: (moreGrad(terms, x0, true)), sol: [m(`f'(${x0}) = ${poly(dt).replace(/x/g, '(' + nf(x0) + ')')}`), m(`= ${nf(ans)}`)] };
    },
    grades: 'AAAAA', // level of each generator below: A = apply a method, M = connect steps or use it in context, E = reason it through
    gens: [
      () => { const a = R.nz(-6, 6), n = R.int(3, 5), b = R.nz(-9, 9), c = R.nz(-9, 9); const t = [[a, n], [b, 1], [c, 0]];
        return P.mcq({ prompt: `Differentiate ${m(`y = ${poly(t)}`)}`, more: ({ steps: [
    St('Differentiate each term on its own with the power rule: multiply by the power, then take one off the power.'),
    ...diffLines(t),
    St('Put the pieces together.', m(T`\dfrac{dy}{dx} = ${poly(d(t))}`)),
  ], check: `Each power should be one less than before: ${n} became ${n - 1}, the x term became a number, and the number on its own disappeared.`, trap: 'Forgetting to take one off the power, or keeping the number on its own.' }), sol: [m(`${poly([[a, n]])} \\to ${poly([[a * n, n - 1]])}`), m(`${poly([[b, 1]])} \\to ${b}`), m(`${c} \\to 0`)] }, P.uniq([
          { t: m(T`\dfrac{dy}{dx} = ${poly(d(t))}`), ok: true },
          { t: m(T`\dfrac{dy}{dx} = ${poly([[a * n, n], [b, 0]])}`), why: 'Take one off the power after multiplying by it.' },
          { t: m(T`\dfrac{dy}{dx} = ${poly(d(t))}${sc(c)}`), why: 'A constant on its own differentiates to 0.' },
          { t: m(T`\dfrac{dy}{dx} = ${poly([[a, n - 1], [b, 0]])}`), why: `Multiply by the power first: ${m(`${n} \\times ${a < 0 ? '(' + a + ')' : a} = ${a * n}`)}.` },
        ]));
      },
      () => { const frac = R.pick([[1 / 3, 3], [1 / 2, 2], [2 / 3, 3], [1 / 4, 4]]); const b = R.nz(-5, 5), c = R.nz(-6, 6), x0 = R.nz(-3, 3);
        const t = [frac].concat(frac[1] - 1 >= 2 ? [[b, frac[1] - 1]] : [], [[c, 1], [R.int(-5, 5), 0]]); const dt = d(t), ans = ev(dt, x0);
        return { kind: 'num', answer: ans, prompt: `Find the gradient of ${m(`y = ${poly(t)}`)} at ${m(`x = ${x0}`)}.`, wrong: [{ v: ev(t, x0), msg: 'That is the y value. Differentiate first, then substitute.' }], more: (moreGrad(t, x0, false)), sol: [m(T`\dfrac{dy}{dx} = ${poly(dt)}`), m(`x = ${x0}: \\ ${poly(dt).replace(/x/g, '(' + nf(x0) + ')')} = ${nf(ans)}`)] }; },
      () => { const a = R.nz(-6, 6), b = R.nz(-6, 6), x0 = R.nz(-4, 4), ans = 2 * x0 + a + b;
        return { kind: 'num', answer: ans, prompt: `${m(`f(x) = (x${sc(a)})(x${sc(b)})`)}. Find ${m(`f'(${x0})`)}.`, wrong: [{ v: 1, msg: 'You cannot differentiate brackets separately. Expand first.' }, { v: (x0 + a) * (x0 + b), msg: 'That is f(' + x0 + '). Expand, differentiate, then substitute.' }], more: ({ steps: [
    St('You cannot differentiate each bracket on its own and multiply. Expand first, so you have an ordinary polynomial.', m(`f(x) = (x${sc(a)})(x${sc(b)}) = ${poly([[1, 2], [a + b, 1], [a * b, 0]])}`)),
    St('Differentiate term by term.', m(`f'(x) = ${poly([[2, 1], [a + b, 0]])}`)),
    St(`Substitute x = ${x0}.`, m(`f'(${x0}) = ${sub([[2, 1], [a + b, 0]], x0)} = ${ans}`)),
  ], check: `Check the expansion by putting x = 1 into both forms. Each gives ${(1 + a) * (1 + b)}.`, trap: 'Differentiating each bracket to 1 and multiplying to get 1.' }), sol: [m(`f(x) = ${poly([[1, 2], [a + b, 1], [a * b, 0]])}`), m(`f'(x) = ${poly([[2, 1], [a + b, 0]])}`), m(`f'(${x0}) = ${ans}`)] }; },
      () => { const b = R.nz(-6, 6), k = R.int(1, 4), x0 = -k, ans = -2 * x0 + b;
        return { kind: 'num', answer: ans, prompt: `Find the gradient of ${m(`y = ${poly([[-1, 2], [b, 1]])}`)} at ${m(`x = ${x0}`)}.`, wrong: [{ v: 2 * x0 + b, msg: m('-x^2') + ' differentiates to ' + m('-2x') + '. Keep the minus.' }], more: ({ steps: [
    St(`${m('-x^2')} means ${m(T`-1 \times x^2`)}. The minus sign belongs to the term.`),
    St('Differentiate each term.', m(T`-x^2 \to -2x \qquad ${poly([[b, 1]])} \to ${b}`)),
    St('So the gradient function is:', m(T`\dfrac{dy}{dx} = ${poly([[-2, 1], [b, 0]])}`)),
    St(`Substitute x = ${x0}, in brackets. A minus times a minus is a plus.`, m(`${sub([[-2, 1], [b, 0]], x0)} = ${ans}`)),
  ], check: `${m(T`-2 \times ${br(x0)} = ${-2 * x0}`)}, and ${-2 * x0} + ${br(b)} = ${ans}.`, trap: `Losing the minus sign and getting ${2 * x0 + b}.` }), sol: [m(T`\dfrac{dy}{dx} = -2x${sc(b)}`), m(`= -2(${x0})${sc(b)} = ${ans}`)] }; },
      () => { const a = R.nz(-5, 5);
        return P.mcq({ prompt: `Differentiate ${m(`f(x) = x^2(x${sc(a)})`)}`, more: ({ steps: [
    St('Expand first: multiply the x² into the bracket.', m(`x^2(x${sc(a)}) = ${poly([[1, 3], [a, 2]])}`)),
    ...diffLines([[1, 3], [a, 2]]),
    St('Together:', m(`f'(x) = ${poly([[3, 2], [2 * a, 1]])}`)),
  ], check: 'Every power should have dropped by one: x³ to x², and x² to x.', trap: 'Differentiating the two parts separately and multiplying. 2x × 1 is not the derivative.' }), sol: [m(`f(x) = ${poly([[1, 3], [a, 2]])}`) + ' (expand first)', m(`f'(x) = ${poly([[3, 2], [2 * a, 1]])}`)] }, P.uniq([
          { t: m(`f'(x) = ${poly([[3, 2], [2 * a, 1]])}`), ok: true },
          { t: m(`f'(x) = 2x`), why: 'You cannot differentiate the parts separately and multiply. Expand first.' },
          { t: m(`f'(x) = 2x(x${sc(a)})`), why: 'Only part of it was differentiated. Expand to ' + m(poly([[1, 3], [a, 2]])) + ' first.' },
          { t: m(`f'(x) = ${poly([[3, 2], [2 * a, 0]])}`), why: m(poly([[a, 2]])) + ' differentiates to ' + m(poly([[2 * a, 1]])) + '.' },
        ]));
      },
    ],
    tips: [
      'Write the line ' + m("f'(x) = \\ldots") + ' every time. It is the method mark.',
      'Put brackets round negative numbers when substituting: ' + m('-(-2)^2 = -4') + '.',
      m('-x^2') + ' means ' + m('-(x^2)') + '. <span class="pen">The examiners flagged this one.</span>',
      'Brackets or products: expand first, then differentiate.',
      'Gradient means f′(x). Height (the y value) means f(x). Do not mix them up.',
    ],
  });

  /* ================= 2. Gradients and tangents ================= */
  P.addUnit({
    id: 'tangents', title: 'Gradients and tangent lines', mins: 10,
    blurb: 'Find the tangent at a point, or work backwards from a gradient to the point.',
    recap: 'A tangent is a straight line that just touches a curve and has the same gradient there. The gradient comes from the derivative. The point comes from the original equation. Then use y − y₁ = m(x − x₁).',
    scenes: [
      { dur: 11, card: [C(0, '<h2>A tangent touches the curve and matches its gradient.</h2>'), C(4, `<p>You need two things for its equation: the gradient ${m('m')} and a point ${m('(x_1, y_1)')}.</p>`)],
        draw(a) { const v = a.view(-1, 6, -3, 8); a.axes(v); const f = (x) => x * x - 4 * x + 5; a.plot(v, f, a.C.c1);
          const al = a.seg(a.p, 0.25, 0.45); a.alpha(al, () => a.line(v.X(1), v.Y(-2), v.X(5.5), v.Y(7), a.C.c2, 3)); a.dot(v, 3, 2, a.C.pen, 7, al);
          a.text('(3, 2)', v.X(3) + 12, v.Y(2) + 18, { font: 'pen', col: a.C.pen, alpha: al }); a.text('tangent: y = 2x − 4', v.X(5.8), v.Y(-2.2), { align: 'right', col: a.C.c2, alpha: a.seg(a.p, 0.55, 0.7), bg: a.C.sheet }); a.text('y = x² − 4x + 5', v.X(1.2), v.Y(7.4), { col: a.C.c1, bg: a.C.sheet }); } },
      { dur: 14, card: [C(0, '<h2>The tangent recipe.</h2>'), C(3, '<p>Gradient from the derivative. Point from the original function. Then the straight-line formula.</p>')],
        board: [B(0.5, "f(x) = x^2 - 4x + 5"), B(2, "f'(x) = 2x - 4"), B(4, "m = f'(3) = 2", 'gradient: use f′'), B(6, 'y_1 = f(3) = 2', 'point: use f'), B(8.5, 'y - 2 = 2(x - 3)'), B(10.5, 'y = 2x - 4', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>Backwards: where is the gradient 6?</h2>'), C(3, '<p>Set the derivative equal to 6 and solve. A common slip in 2025: putting the gradient into f(x) instead.</p>')],
        board: [B(0.5, "f'(x) = 6", 'set f′ = gradient'), B(2.5, '2x - 4 = 6'), B(4.5, 'x = 5'), B(6.5, 'y = f(5) = 25 - 20 + 5 = 10'), B(8.5, '(5,\\ 10)', 'the point', { hl: true })] },
      { dur: 10, card: [C(0, '<h2>Unknown constants.</h2>'), C(3, `<p>"The gradient of ${m('y = x^2 + kx')} at ${m('x = 2')} is 7." Differentiate, substitute, solve for k.</p>`)],
        board: [B(0.5, "y' = 2x + k"), B(3, '2(2) + k = 7'), B(5, 'k = 3', '', { hl: true })] },
    ],
    example: {
      problem: `Find the equation of the tangent to ${m('y = x^3 - 3x^2 + 2')} at ${m('x = 1')}.`,
      steps: [
        { m: m(T`\dfrac{dy}{dx} = 3x^2 - 6x`) },
        { m: m('m = 3(1)^2 - 6(1) = -3'), note: 'gradient' },
        { m: m('y = 1 - 3 + 2 = 0'), note: 'point (1, 0)' },
        { m: m('y - 0 = -3(x - 1)') },
        { m: m('y = -3x + 3') },
      ],
    },
    faded() {
      const a = R.nz(-5, 5), b = R.int(-6, 6), x1 = R.nz(-3, 3); const t = [[1, 2], [a, 1], [b, 0]];
      const mm = 2 * x1 + a, y1 = ev(t, x1), c = y1 - mm * x1;
      return { kind: 'num', answer: c, prompt: `The tangent to ${m(`y = ${poly(t)}`)} at ${m(`x = ${x1}`)} is ${m('y = mx + c')}. Find ${m('c')}.`,
        scaffold: [m(`m = 2(${x1})${sc(a)} = ${mm}`), m(`y_1 = ${y1}`) + ', so the point is ' + m(`(${x1}, ${y1})`)], hint: 'Use y − y₁ = m(x − x₁), then rearrange.',
        more: (moreTangent(t, x1, mm, y1, c, true)), sol: [m(`y - ${par(y1)} = ${mm}(x - ${par(x1)})`), m(`y = ${poly([[mm, 1], [c, 0]])}`), m(`c = ${c}`)] };
    },
    grades: 'MAAAM', // level of each generator below: A = apply a method, M = connect steps or use it in context, E = reason it through
    gens: [
      () => { const cubic = Math.random() < 0.4; const a = R.nz(-4, 4), b = R.int(-5, 5), x1 = R.nz(-3, 3);
        const t = cubic ? [[1, 3], [a, 1], [b, 0]] : [[1, 2], [a, 1], [b, 0]]; const mm = ev(d(t), x1), y1 = ev(t, x1), c = y1 - mm * x1;
        return { kind: 'multi', ordered: true, answer: [mm, c], answerTex: `y = ${poly([[mm, 1], [c, 0]])}`, prompt: `Find the equation of the tangent to ${m(`y = ${poly(t)}`)} at ${m(`x = ${x1}`)}, in the form ${m('y = mx + c')}.`, fmt: 'Enter m, then c. For example: 2, -4',
          more: (moreTangent(t, x1, mm, y1, c, false)), sol: [m(`m = ${nf(mm)}`) + ' (from dy/dx)', m(`y_1 = ${y1}`) + ' (from y)', m(`y - ${par(y1)} = ${mm}(x - ${par(x1)})`), m(`y = ${poly([[mm, 1], [c, 0]])}`)] }; },
      () => { const a = R.pick([1, 1, 2, -1]), b = R.nz(-6, 6), x = R.nz(-4, 5), g = 2 * a * x + b; const t = [[a, 2], [b, 1], [R.int(-5, 5), 0]];
        return { kind: 'num', answer: x, prompt: `At what value of ${m('x')} is the gradient of ${m(`y = ${poly(t)}`)} equal to ${m(String(g))}?`, wrong: [{ v: ev(t, g), msg: 'You put the gradient into the original function. Set dy/dx equal to ' + g + ' instead.' }], more: ({ steps: [
    St('“Gradient” means the derivative. Differentiate.', m(T`\dfrac{dy}{dx} = ${poly(d(t))}`)),
    St(`Set the derivative equal to the gradient you want, ${g}.`, m(`${poly(d(t))} = ${g}`)),
    St('Solve for x.', m(T`${co(2 * a)} = ${g - b} \;\Rightarrow\; x = ${x}`)),
  ], check: `Put x = ${x} into the derivative and you get ${g}, the gradient you wanted.`, trap: `Putting ${g} into the original equation. The gradient goes into the derivative, and you solve for x.` }), sol: [m(T`\dfrac{dy}{dx} = ${poly(d(t))}`), m(`${poly(d(t))} = ${g}`), m(`x = ${x}`)] }; },
      () => { let r1, r2; do { r1 = R.int(-4, 4); r2 = R.int(-4, 4); } while (r1 === r2 || (r1 + r2) % 2 !== 0); const g = R.int(-6, 6), b = (-3 * (r1 + r2)) / 2, c = g + 3 * r1 * r2;
        const t = [[1, 3], [b, 2], [c, 1]];
        return { kind: 'multi', answer: [r1, r2], prompt: `Find the x values where the gradient of ${m(`y = ${poly(t)}`)} is ${m(String(g))}.`, more: ({ steps: [
    St('Differentiate to get the gradient function.', m(T`\dfrac{dy}{dx} = ${poly(d(t))}`)),
    St(`Set it equal to ${g}.`, m(`${poly(d(t))} = ${g}`)),
    St('Move everything to one side so it equals zero.', m(`${poly([[3, 2], [2 * b, 1], [c - g, 0]])} = 0`)),
    St('Take out the common factor 3, then factorise.', m(`3${P.fac(r1)}${P.fac(r2)} = 0`)),
    St('Each bracket gives an answer.', m(T`x = ${r1} \quad\text{or}\quad x = ${r2}`)),
  ], check: `Put x = ${r1} into the derivative. You get ${g}.`, trap: 'Trying to factorise before one side is zero.' }), sol: [m(T`\dfrac{dy}{dx} = ${poly(d(t))} = ${g}`), m(`${poly([[3, 2], [2 * b, 1], [c - g, 0]])} = 0`), m(`3${P.fac(r1)}${P.fac(r2)} = 0`), m(`x = ${r1} \\text{ or } x = ${r2}`)] }; },
      () => { const a = R.nz(-6, 6), c0 = R.int(-5, 5), x = R.nz(-4, 4), g = 2 * x + a; const t = [[1, 2], [a, 1], [c0, 0]];
        return { kind: 'multi', ordered: true, answer: [x, ev(t, x)], prompt: `Find the point on ${m(`y = ${poly(t)}`)} where the gradient is ${m(String(g))}.`, fmt: 'Enter x, then y. For example: 3, -2', wrong: [{ v: [x, g], msg: 'The y value comes from the original equation, not the gradient.' }], more: ({ steps: [
    St('Differentiate.', m(T`\dfrac{dy}{dx} = ${poly([[2, 1], [a, 0]])}`)),
    St(`Set it equal to ${g} and solve.`, m(T`${poly([[2, 1], [a, 0]])} = ${g} \;\Rightarrow\; x = ${x}`)),
    St('A point needs a y value too. Get it from the original equation.', m(`y = ${sub(t, x)} = ${ev(t, x)}`)),
    St('So the point is:', m(`(${x}, ${ev(t, x)})`)),
  ], check: `The gradient at x = ${x} is ${2 * x + a}, as required.`, trap: `Giving ${g} as the y value. That is the gradient, not the height.` }), sol: [m(`2x${sc(a)} = ${g}`), m(`x = ${x}`), m(`y = ${ev(t, x)}`)] }; },
      () => { const a = R.pick([1, 2, 3]), p = R.nz(-3, 3), k = R.nz(-8, 8), G = 2 * a * p + k;
        return { kind: 'num', answer: k, prompt: `The gradient of ${m(`y = ${a === 1 ? '' : a}x^2 + kx`)} at ${m(`x = ${p}`)} is ${m(String(G))}. Find ${m('k')}.`, more: ({ steps: [
    St('Differentiate. k is just an unknown number, so kx differentiates to k, exactly like 5x becomes 5.', m(T`\dfrac{dy}{dx} = ${2 * a}x + k`)),
    St(`At x = ${p} the gradient is ${G}. Substitute both.`, m(`${2 * a}(${p}) + k = ${G}`)),
    St('Solve for k.', m(T`${2 * a * p} + k = ${G} \;\Rightarrow\; k = ${k}`)),
  ], check: `With k = ${k}, the gradient at x = ${p} is ${2 * a * p} + ${br(k)} = ${G}.`, trap: 'Differentiating kx to 0. k is a number, so kx becomes k.' }), sol: [m(T`\dfrac{dy}{dx} = ${2 * a}x + k`), m(`${2 * a}(${p}) + k = ${G}`), m(`k = ${k}`)] }; },
    ],
    tips: [
      '<span class="pen">Gradient from f′(x), point from f(x).</span> Label which one you are using.',
      'Write ' + m('y - y_1 = m(x - x_1)') + ' before substituting. Then rearrange to ' + m('y = mx + c') + '.',
      'If you are given a gradient, set the derivative equal to it. Never put the gradient into f(x).',
      'Check: your tangent should give the same y as the curve at the touching point.',
    ],
  });

  /* ================= 3. Turning points ================= */
  P.addUnit({
    id: 'turning-points', title: 'Turning points', mins: 10,
    blurb: 'Gradient zero means a turning point. Then prove whether it is a max or a min.',
    recap: 'At a turning point the curve is flat, so the derivative equals zero. Solve f′(x) = 0 to get x, then put x into f(x) to get y. To show the type, check the gradient just either side: negative then positive is a minimum, positive then negative is a maximum. The second derivative is another accepted way (positive: minimum; negative: maximum), but gradient either side is the Level 2 method.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>At a turning point the tangent is flat.</h2>'), C(3.5, '<p>Watch the gradient as the tangent slides. It hits zero twice: at the top of the hill and the bottom of the valley.</p>')],
        draw(a) { const v = a.view(-2.6, 2.6, -4, 4); a.axes(v); const f = (x) => x * x * x - 3 * x, df = (x) => 3 * x * x - 3; a.plot(v, f, a.C.c1);
          const x = -2.2 + 4.4 * a.seg(a.p, 0.05, 0.9); const g = a.tangent(v, f, df, x, 0.8, a.C.c2);
          a.text(`gradient = ${P.n(g, 1).replace('-', '−')}`, 20, 30, { col: a.C.c2, size: 1.15, bg: a.C.sheet });
          if (a.p > 0.33) { a.dot(v, -1, 2, a.C.pen, 7); a.text('max (−1, 2)', v.X(-1), v.Y(2) - 22, { align: 'center', font: 'pen', col: a.C.pen }); }
          if (a.p > 0.62) { a.dot(v, 1, -2, a.C.pen, 7); a.text('min (1, −2)', v.X(1), v.Y(-2) + 26, { align: 'center', font: 'pen', col: a.C.pen }); } } },
      { dur: 12, card: [C(0, '<h2>Set the derivative to zero.</h2>'), C(8, '<p>Then put each x back into the original to get the y value.</p>')],
        board: [B(0.5, 'y = x^3 - 3x', '', { big: true }), B(2.5, "y' = 3x^2 - 3 = 0", 'f′ = 0'), B(5, T`x^2 = 1 \;\Rightarrow\; x = \pm 1`), B(8, T`(1, -2) \text{ and } (-1, 2)`, 'y too', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>Prove max or min: gradient either side.</h2>'), C(3, '<p>Down then up: minimum. Up then down: maximum.</p>'), C(7, '<p>Excellence answers justify the type, even when the question does not ask.</p>')],
        board: [B(0.5, "x = 0.9: \\ y' = -0.57", 'going down'), B(3, "x = 1: \\ y' = 0", 'flat'), B(5.5, "x = 1.1: \\ y' = 0.63", 'going up'), B(8, T`\therefore\ \text{minimum at } (1, -2)`, '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Also accepted: the second derivative.</h2>'), C(3, `<p>Differentiate again. Positive means it curves up like a smile: a minimum.</p>`), C(8.5, '<p>This is a Level 3 idea. Use it only if you are sure of it; gradient either side is enough.</p>')],
        board: [B(0.5, "y'' = 6x"), B(3, "x = 1: \\ y'' = 6 > 0", 'min ∪'), B(6, "x = -1: \\ y'' = -6 < 0", 'max ∩')] },
      { dur: 11, card: [C(0, '<h2>Increasing or decreasing?</h2>'), C(3, `<p>Increasing where the gradient is positive: ${m("f'(x) > 0")}.</p>`)],
        board: [B(0.5, 'f(x) = x^2 - 6x'), B(2.5, "f'(x) = 2x - 6 > 0"), B(5, 'x > 3', 'increasing', { hl: true })] },
    ],
    example: {
      problem: `Find the turning points of ${m('f(x) = 2x^3 - 9x^2 + 12x + 1')} and state their nature.`,
      steps: [
        { m: m("f'(x) = 6x^2 - 18x + 12 = 0") },
        { m: m('6(x - 1)(x - 2) = 0 \\Rightarrow x = 1, 2') },
        { m: m('f(1) = 6, \\quad f(2) = 5'), note: 'y values' },
        { m: m("f'(0.9) = 0.66 > 0, \\quad f'(1.1) = -0.54 < 0") + ' (up then down), so ' + m('(1, 6)') + ' is a maximum', note: 'justify: gradient either side' },
        { m: m("f'(1.9) = -0.54 < 0, \\quad f'(2.1) = 0.66 > 0") + ' (down then up), so ' + m('(2, 5)') + ' is a minimum' },
      ],
    },
    faded() {
      const a = R.pick([1, 2, -1, 3]), h = R.nz(-4, 4), k = R.int(-6, 8); const t = [[a, 2], [-2 * a * h, 1], [a * h * h + k, 0]];
      return { kind: 'multi', ordered: true, answer: [h, k], prompt: `Find the turning point of ${m(`y = ${poly(t)}`)}.`, fmt: 'Enter x, then y. For example: 2, -5',
        scaffold: [m(`y' = ${poly(d(t))} = 0`), m(`x = ${h}`)], hint: 'Put x back into the original equation to find y.', wrong: [{ v: [h, 0], msg: 'y is not 0 at the turning point. Substitute x into the original equation.' }],
        more: (moreTP(t, a, h, k)), sol: [m(`y = ${poly(t).replace(/x/g, '(' + nf(h) + ')')} = ${k}`), 'Turning point: ' + m(`(${h}, ${k})`)] };
    },
    grades: 'AAMME', // level of each generator below: A = apply a method, M = connect steps or use it in context, E = reason it through
    gens: [
      () => { const a = R.pick([1, 2, -1, -2, 3]), h = R.nz(-4, 4), k = R.int(-6, 8); const t = [[a, 2], [-2 * a * h, 1], [a * h * h + k, 0]];
        return { kind: 'multi', ordered: true, answer: [h, k], prompt: `Find the coordinates of the turning point of ${m(`y = ${poly(t)}`)}.`, fmt: 'Enter x, then y. For example: 2, -5', more: (moreTP(t, a, h, k)), sol: [m(`y' = ${poly(d(t))} = 0`), m(`x = ${h}`), m(`y = ${k}`), 'Turning point ' + m(`(${h}, ${k})`)] }; },
      () => { let p, q; do { p = R.int(-4, 4); q = R.int(-4, 4); } while (p === q || (p + q) % 2 !== 0); const b = (-3 * (p + q)) / 2, c = 3 * p * q; const t = [[1, 3], [b, 2], [c, 1], [R.int(-5, 5), 0]];
        return { kind: 'multi', answer: [p, q], prompt: `Find the x values of the turning points of ${m(`y = ${poly(t)}`)}.`, more: ({ steps: [
    St('Turning points are where the gradient is zero.'),
    St('Differentiate.', m(`y' = ${poly(d(t))}`)),
    St('Set it to zero. Take out the common factor 3.', m(`3(${poly([[1, 2], [-(p + q), 1], [p * q, 0]])}) = 0`)),
    St('Factorise the bracket.', m(`3${P.fac(p)}${P.fac(q)} = 0`)),
    St('So the turning points are at:', m(T`x = ${p} \quad\text{and}\quad x = ${q}`)),
  ], check: `Put x = ${p} into y′. You get 0.`, trap: 'Setting y = 0 instead of y′ = 0. That finds where the curve crosses the axis, not where it turns.' }), sol: [m(`y' = ${poly(d(t))} = 0`), m(`3${P.fac(p)}${P.fac(q)} = 0`), m(`x = ${p} \\text{ or } x = ${q}`)] }; },
      () => { let p, q; do { p = R.int(-4, 4); q = R.int(-4, 4); } while (p === q || (p + q) % 2 !== 0); const b = (-3 * (p + q)) / 2, c = 3 * p * q; const t = [[1, 3], [b, 2], [c, 1], [R.int(-5, 5), 0]];
        const x0 = R.pick([p, q]), f2 = 6 * x0 + 2 * b, isMax = f2 < 0;
        return P.mcq({ prompt: `${m(`y = ${poly(t)}`)} has a turning point at ${m(`x = ${x0}`)}. What type is it?`, more: ({ steps: [
    St('To decide max or min, check the gradient just either side of the turning point.', m(`y' = ${poly(d(t))}`)),
    St(`Just before: x = ${x0 - 0.5}.`, m(`y'(${x0 - 0.5}) = ${P.n(ev(d(t), x0 - 0.5), 2)}`)),
    St(`Just after: x = ${x0 + 0.5}.`, m(`y'(${x0 + 0.5}) = ${P.n(ev(d(t), x0 + 0.5), 2)}`)),
    St(isMax ? 'Positive then negative: going up, flat, then down. That is the top of a hill, a maximum.' : 'Negative then positive: going down, flat, then up. That is the bottom of a valley, a minimum.'),
  ], check: `Also accepted: the second derivative, y″(${x0}) = ${f2}, ${isMax ? 'negative, so a maximum' : 'positive, so a minimum'}.`, trap: 'Checking points too far away: stay closer than the other turning point.' }), sol: [m(`y'' = ${poly([[6, 1], [2 * b, 0]])}`), m(`y''(${x0}) = ${f2}`) + (isMax ? ' < 0, so a maximum' : ' > 0, so a minimum')] }, [
          { t: 'A maximum', ok: isMax, why: isMax ? '' : `${m(`y''(${x0}) = ${f2}`)} is positive, so it curves up: a minimum.` },
          { t: 'A minimum', ok: !isMax, why: !isMax ? '' : `${m(`y''(${x0}) = ${f2}`)} is negative, so it curves down: a maximum.` },
          { t: 'You cannot tell without a graph', why: 'You can: check the gradient either side (or use the second derivative).' },
        ]);
      },
      () => { const a = R.pick([1, 2, -1, -2]), h = R.nz(-5, 5); const t = [[a, 2], [-2 * a * h, 1], [R.int(-5, 5), 0]]; const inc = a > 0 ? `x > ${h}` : `x < ${h}`, dec = a > 0 ? `x < ${h}` : `x > ${h}`;
        return P.mcq({ prompt: `For which values of ${m('x')} is ${m(`f(x) = ${poly(t)}`)} increasing?`, more: ({ steps: [
    St('Increasing means going uphill, so the gradient is positive.', m(`f'(x) > 0`)),
    St('Differentiate.', m(`f'(x) = ${poly(d(t))}`)),
    St('Write the inequality and move the number across.', m(`${co(2 * a)} > ${2 * a * h}`)),
    St(a > 0 ? `Divide by ${2 * a}.` : `Divide by ${2 * a}. Dividing by a negative number flips the inequality sign.`, m(inc)),
  ], check: `Pick an x in your answer, such as ${a > 0 ? h + 1 : h - 1}. Then f′ = ${2 * a * ((a > 0 ? h + 1 : h - 1) - h)}, which is positive.`, trap: a < 0 ? 'Forgetting to flip the inequality when you divide by a negative.' : 'Mixing up increasing (f′ > 0) and decreasing (f′ < 0).' }), sol: [m(`f'(x) = ${poly(d(t))} > 0`), m(inc)] }, [
          { t: m(inc), ok: true }, { t: m(dec), why: 'That is where it is decreasing. Increasing means ' + m("f'(x) > 0") + '.' }, { t: m(`x > ${-h}`), why: 'Check the sign when you solve ' + m(`${poly(d(t))} > 0`) + '.' }, { t: m(`x = ${h}`), why: 'At that point the gradient is zero: the turning point.' }]);
      },
      () => { let p, q; do { p = R.int(-3, 4); q = R.int(-3, 4); } while (p >= q || (p + q) % 2 !== 0); const b = (-3 * (p + q)) / 2, c = 3 * p * q, e = R.int(-5, 5); const t = [[1, 3], [b, 2], [c, 1], [e, 0]];
        const y = ev(t, q), f2 = 6 * q + 2 * b;
        return P.mcq({ prompt: `${m(`f(x) = ${poly(t)}`)}. Which statement fully proves that ${m(`(${q}, ${y})`)} is a minimum?`, more: ({ steps: [
    St('A full proof has two parts. Part one: it is a turning point, because the gradient is zero there.', m(T`f'(x) = ${poly(d(t))}, \quad f'(${q}) = 0`)),
    St('Part two: what type it is. Check the gradient just either side.', m(T`f'(${q} - 0.1) = ${P.n(ev(d(t), q - 0.1), 3)}, \quad f'(${q} + 0.1) = ${P.n(ev(d(t), q + 0.1), 3)}`)),
    St('Negative then positive: down, flat, up. A minimum. The two facts together make the proof. (The second derivative, f″ > 0, is also accepted.)'),
  ], check: `Also, f(${q}) = ${y}, so the point really is on the curve.`, trap: 'Giving only one of the two facts. Markers want both.' }), sol: ['Show the gradient is zero there AND show the type, with a second derivative or gradients either side.'] }, [
          { t: `${m(`f'(${q}) = 0`)}, with ${m("f'")} negative just before and positive just after`, ok: true },
          { t: `${m(`f'(${q}) = 0`)}`, why: 'That proves it is a turning point, but not which type.' },
          { t: `${m(`f(${q}) = ${y}`)}`, why: 'That only shows the point is on the curve.' },
          { t: `${m(`f''(${q}) = ${f2} > 0`)}`, why: 'You also need to show the gradient is zero there.' },
        ]);
      },
    ],
    tips: [
      'Turning point: ' + m("f'(x) = 0") + '. Then substitute into f(x) for the y value. A point needs both.',
      '<span class="pen">Always justify max or min.</span> Gradient either side is the Level 2 method; the second derivative is also accepted. Excellence answers do it unasked.',
      'Increasing: ' + m("f'(x) > 0") + '. Decreasing: ' + m("f'(x) < 0") + '.',
      'In context, check the turning point makes sense (a time cannot be negative, a length cannot be zero).',
    ],
  });

  /* ================= 4. Sketching gradient graphs ================= */
  const fcub = (x) => (x * x * x - 3 * x) / 2, dfcub = (x) => (3 * x * x - 3) / 2;
  P.addUnit({
    id: 'gradient-graphs', title: 'Sketching the gradient graph', mins: 9,
    blurb: 'Read a curve and sketch its gradient function: turning points become x-intercepts.',
    recap: 'The gradient graph shows how steep f is at each x. Where f has a turning point, f′ crosses the x-axis. Where f goes up, f′ is above the axis. Where f goes down, f′ is below it.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Every point on f gives one point on f′.</h2>'), C(3.5, '<p>Top: the curve and its tangent. Bottom: the gradient of that tangent, plotted as a height.</p>'), C(9, '<p>Flat tangent at the top: zero on the bottom.</p>')],
        draw(a) { const H2 = a.H / 2; const top = a.view(-2.4, 2.4, -2.5, 2.5); const vt = Object.assign({}, top, { Y: (y) => H2 - 14 - ((y + 2.5) / 5) * (H2 - 36) }), vb = Object.assign({}, top, { Y: (y) => a.H - 14 - ((y + 2) / 8) * (H2 - 36) });
          const grid = (v, y0, y1) => { a.line(v.X(-2.4), v.Y(0), v.X(2.4), v.Y(0), a.C.muted, 1.5); a.line(v.X(0), v.Y(y0), v.X(0), v.Y(y1), a.C.muted, 1.5); };
          grid(vt, -2.5, 2.5); grid(vb, -2, 6);
          a.plot(vt, fcub, a.C.c1); const x = -2.2 + 4.4 * a.seg(a.p, 0.05, 0.85);
          a.tangent(vt, fcub, dfcub, x, 0.7, a.C.c2); a.plot(vb, dfcub, a.C.c4, 3.5, (x + 2.2) / 4.4, -2.2, 2.2); a.dot(vb, x, dfcub(x), a.C.c4);
          a.alpha(0.6, () => a.line(vt.X(x), vt.Y(fcub(x)), vb.X(x), vb.Y(dfcub(x)), a.C.muted, 1.2, [4, 5]));
          a.text('f(x)', 16, 24, { col: a.C.c1 }); a.text('f′(x)', 16, H2 + 24, { col: a.C.c4 });
          a.line(0, H2, a.W, H2, a.C.line, 1); } },
      { dur: 12, card: [C(0, '<h2>Three rules do it.</h2>'), C(8, '<p>Use a ruler-straight vertical line from each turning point down to the x-axis of your sketch.</p>')],
        board: [B(0.5, T`\text{turning point on } f \;\to\; f' = 0`, 'x-intercept'), B(3, T`f \text{ going up} \;\to\; f' > 0`, 'above axis'), B(5.5, T`f \text{ going down} \;\to\; f' < 0`, 'below axis')] },
      { dur: 11, card: [C(0, '<h2>Shapes drop one level.</h2>'), C(3, '<p>A parabola\'s gradient graph is a straight line. A cubic\'s is a parabola.</p>'), C(7, '<p>The examiners asked for one smooth curve, correct x-intercepts and a symmetrical shape.</p>')],
        draw(a) { const v = a.view(-3, 5, -6, 8); a.axes(v); const f = (x) => (x - 1) ** 2 - 4, df = (x) => 2 * (x - 1); a.plot(v, f, a.C.c1); a.plot(v, df, a.C.c4, 3.5, a.seg(a.p, 0.25, 0.6));
          const al = a.seg(a.p, 0.6, 0.75); a.alpha(al, () => a.line(v.X(1), v.Y(-4), v.X(1), v.Y(0), a.C.pen, 2, [6, 6])); a.dot(v, 1, 0, a.C.pen, 7, al);
          a.text('f(x) parabola', v.X(-2.8), v.Y(7), { col: a.C.c1, bg: a.C.sheet }); a.text('f′(x) straight line', v.X(4.8), v.Y(-5), { col: a.C.c4, align: 'right', alpha: a.seg(a.p, 0.4, 0.6), bg: a.C.sheet }); } },
    ],
    example: {
      problem: 'The graph of ' + m('f(x)') + ' has a maximum at ' + m('x = -1') + ' and a minimum at ' + m('x = 3') + '. Describe the graph of ' + m("f'(x)") + '.' + P.svg.graph([{ f: (x) => (x ** 3 / 3 - x * x - 3 * x) / 2, col: 'var(--c1)' }], { x0: -3, x1: 5, y0: -6, y1: 4, step: 1, lstep: 1, ystep: 1, lystep: 2, w: 420, h: 240, alt: 'Cubic with a maximum at x = −1 and a minimum at x = 3' }),
      steps: [
        { m: m("f'(x) = 0") + ' at ' + m('x = -1') + ' and ' + m('x = 3'), note: 'turning points → intercepts' },
        { m: 'Left of ' + m('-1') + ', f goes up, so ' + m("f'(x) > 0") },
        { m: 'Between ' + m('-1') + ' and ' + m('3') + ', f goes down, so ' + m("f'(x) < 0") },
        { m: 'Right of ' + m('3') + ', f goes up, so ' + m("f'(x) > 0") },
        { m: 'So ' + m("f'") + ' is a ∪-shaped parabola through ' + m('-1') + ' and ' + m('3') + ', lowest at ' + m('x = 1'), note: 'symmetrical' },
      ],
    },
    faded() {
      let p, q; do { p = R.int(-3, 2); q = R.int(-2, 4); } while (q - p < 2); const s = R.pick([1, -1]); const f = (x) => s * (x ** 3 / 3 - ((p + q) / 2) * x * x + p * q * x) * 0.6;
      const fig = autoGraph([{ f, col: 'var(--c1)' }], p - 2, q + 2, { pts: [{ x: p, y: f(p) }, { x: q, y: f(q) }], alt: 'Cubic curve with two turning points marked' });
      return { kind: 'multi', answer: [p, q], prompt: 'Here is the graph of ' + m('y = f(x)') + '. For which x values is ' + m("f'(x) = 0") + '?', fig,
        scaffold: [m("f'(x) = 0") + ' where the tangent is flat: at the turning points.'], hint: 'Read the x values of the two marked turning points.', more: ({ steps: [
    St('f′(x) is the gradient of the curve. It is zero where the tangent is flat.'),
    St('On a smooth curve, the tangent is flat at the turning points: the tops of hills and the bottoms of valleys.'),
    St(`Read the x values of the two marked turning points.`, m(T`f'(x) = 0 \text{ at } x = ${p} \text{ and } x = ${q}`)),
  ], check: 'Lay a ruler on the curve at each point. It should sit flat.', trap: 'Giving where the curve crosses the x-axis. That is where f(x) = 0, not f′(x) = 0.' }), sol: [m(`x = ${p}`) + ' and ' + m(`x = ${q}`)] };
    },
    grades: 'MMA', // level of each generator below: A = apply a method, M = connect steps or use it in context, E = reason it through
    gens: [
      () => { let p, q; do { p = R.int(-3, 1); q = R.int(0, 3); } while (q - p < 2); const s = R.pick([1, -1]);
        const f = (x) => s * (x ** 3 / 3 - ((p + q) / 2) * x * x + p * q * x), df = (x) => s * (x - p) * (x - q);
        const x0 = p - 1.6, x1 = q + 1.6, mini = (fn) => autoGraph([{ f: fn, col: 'var(--c4)' }], x0, x1, { w: 240, h: 160, ylabels: false, alt: 'graph option' });
        return P.mcq({ prompt: 'Here is the graph of ' + m('y = f(x)') + '. Which graph shows ' + m("y = f'(x)") + '?', fig: autoGraph([{ f, col: 'var(--c1)' }], x0, x1, { alt: 'Cubic curve' }),
          more: ({ steps: [
    St(`Find the turning points of f: x = ${p} and x = ${q}. The gradient is zero there, so f′ crosses the x-axis at ${p} and ${q}.`),
    St(s > 0 ? `Left of ${p}, f goes up, so f′ is positive (above the axis).` : `Left of ${p}, f goes down, so f′ is negative (below the axis).`),
    St(s > 0 ? `Between ${p} and ${q}, f goes down, so f′ is negative (below the axis).` : `Between ${p} and ${q}, f goes up, so f′ is positive (above the axis).`),
    St(s > 0 ? `Right of ${q}, f goes up again, so f′ is positive.` : `Right of ${q}, f goes down again, so f′ is negative.`),
    St(`Together: a ${s > 0 ? '∪' : '∩'}-shaped parabola crossing the axis at ${p} and ${q}. A cubic always has a parabola for its gradient graph.`),
  ], trap: 'Copying the shape of f. Ask “is f going up or down here?”, not “is f high or low?”.' }), sol: ['The turning points of f are at ' + m(`x = ${p}`) + ' and ' + m(`x = ${q}`) + ', so f′ crosses the x-axis there.', `f is ${s > 0 ? 'increasing' : 'decreasing'} on the outside, so f′ is ${s > 0 ? 'positive' : 'negative'} outside those values.`] }, [
          { t: mini(df), ok: true },
          { t: mini((x) => -df(x)), why: `Where f goes ${s > 0 ? 'up' : 'down'}, f′ must be ${s > 0 ? 'positive' : 'negative'}. This one has the signs flipped.` },
          { t: mini(f), why: 'That is f itself, not its gradient graph.' },
          { t: mini((x) => s * (x - p - 1) * (x - q - 1)), why: 'The x-intercepts of f′ must line up exactly with the turning points of f.' },
        ]);
      },
      () => { const h = R.int(-2, 2), s = R.pick([1, -1]); const f = (x) => s * ((x - h) ** 2) - s * 3, df = (x) => 2 * s * (x - h);
        const mini = (fn) => autoGraph([{ f: fn, col: 'var(--c4)' }], h - 3, h + 3, { w: 240, h: 160, ylabels: false, alt: 'graph option' });
        return P.mcq({ prompt: 'Here is the graph of ' + m('y = f(x)') + '. Which graph shows ' + m("y = f'(x)") + '?', fig: autoGraph([{ f, col: 'var(--c1)' }], h - 3, h + 3, { alt: 'Parabola' }),
          more: ({ steps: [
    St(`The turning point of f is at x = ${h}. The gradient is zero there, so f′ crosses the axis at x = ${h}.`),
    St(s > 0 ? `Left of ${h}, f goes down, so f′ is negative. Right of ${h}, f goes up, so f′ is positive.` : `Left of ${h}, f goes up, so f′ is positive. Right of ${h}, f goes down, so f′ is negative.`),
    St(`A parabola's gradient changes at a steady rate, so f′ is a straight line, sloping ${s > 0 ? 'up' : 'down'} through x = ${h}.`),
  ], trap: 'Choosing a horizontal line. That would mean the gradient never changes, which only happens for a straight line.' }), sol: ['A parabola has a straight-line gradient graph.', 'It crosses zero at the turning point, ' + m(`x = ${h}`) + '.', `${s > 0 ? 'Left of it f goes down (negative), right of it f goes up (positive).' : 'Left of it f goes up (positive), right of it f goes down (negative).'}`] }, [
          { t: mini(df), ok: true }, { t: mini((x) => -df(x)), why: 'The slope of this line has the wrong sign. Check whether f is going up or down on the right.' },
          { t: mini((x) => 2 * s * (x - h - 1.5)), why: 'f′ must cross zero exactly at the turning point of f, ' + m(`x = ${h}`) + '.' }, { t: mini(() => 0.0001 + 2 * s), why: 'A horizontal line would mean the gradient never changes, which is only true of a straight line.' }]);
      },
      () => { let p, q; do { p = R.int(-3, 2); q = R.int(-2, 4); } while (q - p < 2); const s = R.pick([1, -1]); const f = (x) => s * (x ** 3 / 3 - ((p + q) / 2) * x * x + p * q * x) * 0.6;
        const neg = s > 0 ? `${p} < x < ${q}` : `x < ${p} \\text{ or } x > ${q}`, pos = s > 0 ? `x < ${p} \\text{ or } x > ${q}` : `${p} < x < ${q}`;
        return P.mcq({ prompt: 'Here is the graph of ' + m('y = f(x)') + '. For which values of x is ' + m("f'(x) < 0") + '?', fig: autoGraph([{ f, col: 'var(--c1)' }], p - 2, q + 2, { pts: [{ x: p, y: f(p) }, { x: q, y: f(q) }], alt: 'Cubic curve with two turning points marked' }),
          more: ({ steps: [
    St('f′(x) < 0 means the gradient is negative: the curve goes downhill as you move to the right.'),
    St(`The curve changes direction at its turning points, x = ${p} and x = ${q}.`),
    St(s > 0 ? 'It goes downhill between them.' : `It goes downhill to the left of ${p} and to the right of ${q}.`, m(neg)),
  ], trap: 'Reading where the curve is below the x-axis. That is f(x) < 0, a different question.' }), sol: [m("f'(x) < 0") + ' where the curve is going down (decreasing).', m(neg)] }, [
          { t: m(neg), ok: true }, { t: m(pos), why: 'There the curve is going up, so the gradient is positive.' }, { t: m(`x = ${p} \\text{ or } x = ${q}`), why: 'At the turning points the gradient is zero, not negative.' }, { t: m('f(x) < 0') + ' (below the axis)', why: 'Below the axis is about the height f(x), not the gradient f′(x).' }]);
      },
    ],
    tips: [
      'Rule a faint vertical line from each turning point of f to your f′ axes. Those are the x-intercepts.',
      '<span class="pen">One smooth curve, correct intercepts, symmetrical.</span> That is what markers look for.',
      'Above the axis on f′ means f is going up. It has nothing to do with whether f is above the axis.',
      'Parabola → straight line. Cubic → parabola. Straight line → horizontal line.',
    ],
  });

  /* ================= 5. Optimisation ================= */
  P.addUnit({
    id: 'optimisation', title: 'Maximum and minimum problems', mins: 10,
    blurb: 'The biggest area, the most profit, the highest point: calculus in context.',
    recap: 'The biggest or smallest value of something is at a turning point. Write the quantity using one letter, differentiate, set it to zero and solve. Then prove it is a maximum or minimum, and answer the question that was actually asked.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>The best value sits at a turning point.</h2>'), C(3, '<p>40 m of fence makes three sides of a paddock against a wall. Width x, length 40 − 2x.</p>'), C(8.5, '<p>The area is greatest where its graph is flat.</p>')],
        draw(a) { const v = a.view(0, 20, 0, 240, a.fs * 3); a.axes(v, { step: 2, ystep: 40, lstep: 4, lystep: 40 }); const A = (x) => x * (40 - 2 * x); a.plot(v, A, a.C.c1);
          const x = 2 + 16 * a.seg(a.p, 0.05, 0.55) - 8 * a.seg(a.p, 0.58, 0.75); a.dot(v, x, A(x), a.C.c2, 7);
          a.text(`x = ${P.n(x, 1)} m, area = ${P.n(A(x), 0)} m²`, 20, 30, { bg: a.C.sheet, col: a.C.c2, size: 1.1 });
          const al = a.seg(a.p, 0.78, 0.9); a.alpha(al, () => a.line(v.X(7), v.Y(200), v.X(13), v.Y(200), a.C.pen, 3)); a.text('max: gradient 0', v.X(10), v.Y(200) - 24, { align: 'center', font: 'pen', col: a.C.pen, alpha: al }); } },
      { dur: 14, card: [C(0, '<h2>Differentiate, set to zero, solve.</h2>'), C(10, '<p>Prove it is a max. Then answer the question that was asked, with units.</p>')],
        board: [B(0.5, 'A = x(40 - 2x) = 40x - 2x^2', 'one variable'), B(3, "A' = 40 - 4x = 0", 'set = 0'), B(5.5, 'x = 10'), B(7.5, "A'' = -4 < 0", 'so a maximum'), B(10, T`A = 10 \times 20 = 200 \text{ m}^2`, '', { hl: true })] },
      { dur: 10, card: [C(0, '<h2>The five-step recipe.</h2>'), C(1, '<ol class="recipe"><li>Write the quantity using one variable.</li><li>Differentiate.</li><li>Set the derivative to zero and solve.</li><li>Show it is a max or min.</li><li>Answer the question, with units.</li></ol>')],
        board: [B(0.5, 'Q(x)'), B(2, "Q'(x)"), B(3.5, "Q'(x) = 0"), B(5, "Q''(x)"), B(6.5, T`\text{answer + units}`, 'in a sentence', { hl: true })] },
    ],
    example: {
      problem: 'Equal squares of side ' + m('x') + ' cm are cut from each corner of a 30 cm square sheet, which is folded into an open box. Find the largest possible volume.',
      steps: [
        { m: m('V = x(30 - 2x)^2 = 4x^3 - 120x^2 + 900x'), note: 'expand first' },
        { m: m("V' = 12x^2 - 240x + 900 = 0") },
        { m: m('12(x - 5)(x - 15) = 0 \\Rightarrow x = 5 \\text{ or } 15') },
        { m: m('x = 15') + ' gives no box, so ' + m('x = 5'), note: 'check context' },
        { m: m("V''(5) = 24(5) - 240 = -120 < 0") + ', a maximum' },
        { m: m('V = 5 \\times 20^2 = 2000') + ' cm³' },
      ],
    },
    faded() {
      const L = 4 * R.int(5, 25), x = L / 4, A = (L * L) / 8;
      return { kind: 'num', answer: A, prompt: `A farmer has ${L} m of fencing to make three sides of a rectangular pen against a long wall. The width is ${m('x')} m. Find the largest possible area, in m².`,
        scaffold: [m(`A = x(${L} - 2x) = ${L}x - 2x^2`), m(`A' = ${L} - 4x = 0 \\Rightarrow x = ${x}`)], hint: 'Put x back into the area formula.',
        wrong: [{ v: x, msg: 'That is the width that gives the maximum. The question asks for the area.' }], more: (moreFence(L, x, A)), sol: [m(`A = ${x}(${L} - ${2 * x}) = ${x} \\times ${L - 2 * x} = ${A}`) + ' m²'] };
    },
    grades: 'EAMAM', // level of each generator below: A = apply a method, M = connect steps or use it in context, E = reason it through
    gens: [
      () => { const L = 4 * R.int(5, 30), x = L / 4, A = (L * L) / 8;
        return { kind: 'num', answer: A, prompt: `${L} m of fencing forms three sides of a rectangle against a wall. Find the maximum area enclosed, in m².`, wrong: [{ v: x, msg: 'That is the best width. Now find the area.' }, { v: (L / 4) ** 2, msg: 'Only three sides are fenced: A = x(' + L + ' − 2x).' }], more: (moreFence(L, x, A)), sol: [m(`A = x(${L} - 2x)`), m(`A' = ${L} - 4x = 0 \\Rightarrow x = ${x}`), m(`A = ${x} \\times ${L - 2 * x} = ${A}`) + ' m²'] }; },
      () => { const a = R.pick([2, 5, 10, 0.5]), x = R.int(6, 30), b = 2 * a * x, c = 10 * R.int(1, Math.max(1, Math.floor((a * x * x * 0.7) / 10))), Pmax = -a * x * x + b * x - c;
        return { kind: 'num', answer: Pmax, prompt: `A business makes ${m('P = ' + poly([[-a, 2], [b, 1], [-c, 0]]))} dollars profit when it sells ${m('x')} items. Find the maximum profit in dollars.`, wrong: [{ v: x, msg: 'That is how many items give the maximum. The question asks for the profit.' }], more: ({ steps: [
    St('The maximum profit is at a turning point. Differentiate the profit formula.', m(`P' = ${poly([[-2 * a, 1], [b, 0]])}`)),
    St('Set it to zero and solve.', m(T`${poly([[-2 * a, 1], [b, 0]])} = 0 \;\Rightarrow\; x = ${x}`)),
    St('Prove it is a maximum.', m(T`P'' = ${nf(-2 * a)} < 0`)),
    St(`Put x = ${x} back into the profit formula.`, m(`P = ${sub([[-a, 2], [b, 1], [-c, 0]], x)} = ${nf(Pmax)}`)),
    St(`The maximum profit is ${P.money(Pmax)}, when ${x} items are sold.`),
  ], check: `Try ${x + 1} items: the profit is ${P.money(ev([[-a, 2], [b, 1], [-c, 0]], x + 1))}, which is less.`, trap: `Giving ${x}. That is the number of items, not the profit.` }), sol: [m(`P' = ${poly([[-2 * a, 1], [b, 0]])} = 0 \\Rightarrow x = ${x}`), m(`P'' = ${-2 * a} < 0`) + ', a maximum', m(`P(${x}) = ${nf(Pmax)}`)] }; },
      () => { const s = 6 * R.int(2, 7), x = s / 6, V = x * (s - 2 * x) ** 2;
        return { kind: 'num', answer: x, prompt: `Squares of side ${m('x')} cm are cut from the corners of a ${s} cm square card to make an open box with ${m(`V = x(${s} - 2x)^2`)}. Find the value of ${m('x')} that gives the largest volume.`,
          wrong: [{ v: s / 2, msg: `With x = ${s / 2} there is no card left for a base: V = 0. Reject it.` }, { v: V, msg: 'That is the volume. The question asks for x.' }],
          more: ({ steps: [
    St('Expand the volume formula so you can differentiate it.', m(`V = x(${s} - 2x)^2 = ${poly([[4, 3], [-4 * s, 2], [s * s, 1]])}`)),
    St('Differentiate and set to zero.', m(`V' = ${poly([[12, 2], [-8 * s, 1], [s * s, 0]])} = 0`)),
    St('Factorise.', m(`12${P.fac(x)}${P.fac(s / 2)} = 0`)),
    St(`So x = ${x} or x = ${s / 2}.`),
    St(`Cutting ${s / 2} cm squares would use up the whole card: the base would be ${s} − ${s} = 0 cm wide, so the volume is 0. Reject it.`, m(`x = ${x}`)),
  ], check: `V(${x}) = ${V} cm³. Try x = ${x + 1}: ${(x + 1) * (s - 2 * (x + 1)) ** 2} cm³, which is smaller.`, trap: 'Differentiating without expanding first, which gives the wrong derivative.' }), sol: [m(`V = ${poly([[4, 3], [-4 * s, 2], [s * s, 1]])}`), m(`V' = ${poly([[12, 2], [-8 * s, 1], [s * s, 0]])} = 0`), m(`x = ${x} \\text{ or } x = ${s / 2}`), m(`x = ${s / 2}`) + ' gives zero volume, so ' + m(`x = ${x}`)] }; },
      () => { const v = R.int(8, 30), h0 = R.pick([0, 1, 1.5, 2, 5]), hmax = h0 + (v * v) / 20;
        return { kind: 'num', answer: hmax, dp: 2, prompt: `A ball's height is ${m(`h = -5t^2 + ${v}t${h0 ? ' + ' + h0 : ''}`)} metres after ${m('t')} seconds. Find its maximum height. Give your answer to 2 decimal places.`, wrong: [{ v: v / 10, msg: 'That is the time it reaches the top. Now find the height then.' }], more: ({ steps: [
    St('At the highest point the ball stops rising for an instant. Its height is not changing, so h′ = 0.'),
    St('Differentiate and set to zero.', m(T`h' = -10t + ${v} = 0 \;\Rightarrow\; t = ${P.n(v / 10)}`)),
    St('Now find the height at that time.', m(T`h = -5(${P.n(v / 10)})^2 + ${v}(${P.n(v / 10)})${h0 ? ' + ' + h0 : ''} = ${P.f(hmax, 2)}`)),
    St(`The maximum height is ${P.f(hmax, 2)} m.`),
  ], check: `h″ = −10, which is negative, so it is a maximum.`, trap: `Giving the time, ${P.n(v / 10)} s, instead of the height.` }), sol: [m(`h' = -10t + ${v} = 0 \\Rightarrow t = ${nf(v / 10)}`), m(`h = -5(${nf(v / 10)})^2 + ${v}(${nf(v / 10)})${h0 ? ' + ' + h0 : ''} = ${P.f(hmax, 2)}`) + ' m'] }; },
      () => { const S = 2 * R.int(5, 30);
        return { kind: 'num', answer: (S * S) / 4, prompt: `Two positive numbers add to ${S}. What is the largest possible value of their product?`, wrong: [{ v: S / 2, msg: 'That is each number. Multiply them.' }], more: ({ steps: [
    St(`Call one number x. The other is ${S} − x, because they add to ${S}.`),
    St('Write the product using x.', m(`P = x(${S} - x) = ${S}x - x^2`)),
    St('Differentiate and set to zero.', m(T`P' = ${S} - 2x = 0 \;\Rightarrow\; x = ${S / 2}`)),
    St(`The other number is ${S} − ${S / 2} = ${S / 2}. Multiply them.`, m(T`${S / 2} \times ${S / 2} = ${(S * S) / 4}`)),
  ], check: `Try numbers either side, ${S / 2 - 1} and ${S / 2 + 1}: their product is ${(S / 2 - 1) * (S / 2 + 1)}, which is smaller.`, trap: `Giving ${S / 2}. That is each number; the question asks for the product.` }), sol: [m(`P = x(${S} - x) = ${S}x - x^2`), m(`P' = ${S} - 2x = 0 \\Rightarrow x = ${S / 2}`), m(`P = ${S / 2} \\times ${S / 2} = ${(S * S) / 4}`)] }; },
    ],
    tips: [
      'Write the quantity using one variable before you differentiate. That is often the hardest step.',
      '<span class="pen">Prove it is a maximum (or minimum).</span> Second derivative or gradients either side.',
      'Answer the question asked. If it asks for the area, do not stop at x.',
      'Reject solutions that do not make sense in context, and say why.',
    ],
  });

  /* ================= 6. Anti-differentiation ================= */
  P.addUnit({
    id: 'antidiff', title: 'Anti-differentiation', mins: 9,
    blurb: 'Run the power rule backwards, never forget + c, and find c from a point.',
    recap: 'Anti-differentiating undoes differentiating. Add one to the power, then divide by the new power. Always add + c, because any number on its own vanishes when you differentiate. Find c by substituting a point you know.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>Anti-differentiating undoes differentiating.</h2>'), C(3, '<p>Add one to the power. Divide by the new power. Add c.</p>')],
        board: [B(0.5, "f'(x) = 6x^2", '', { big: true }), B(3, T`f(x) = \dfrac{6x^3}{3} + c`, 'power + 1, ÷ new power'), B(6, 'f(x) = 2x^3 + c', '', { hl: true }), B(8.5, T`\text{check: } \tfrac{d}{dx}(2x^3) = 6x^2 \checkmark`)] },
      { dur: 11, card: [C(0, '<h2>Why + c?</h2>'), C(3, `<p>Every one of these curves has gradient ${m('2x')}. Anti-differentiating cannot tell which one you started with.</p>`), C(8, '<p>The 2025 examiners listed leaving out + c as a Not Achieved slip.</p>')],
        draw(a) { const v = a.view(-3, 3, -4, 9); a.axes(v); [-3, -1, 1, 3, 5].forEach((c, k) => a.plot(v, (x) => x * x + c, [a.C.c1, a.C.c3, a.C.c4, a.C.c2, a.C.c1][k], 3, a.seg(a.p, 0.05 + k * 0.1, 0.2 + k * 0.1)));
          a.text('y = x² + c', v.X(2.9), v.Y(-3.3), { align: 'right', font: 'pen', col: a.C.pen, bg: a.C.sheet }); } },
      { dur: 12, card: [C(0, '<h2>Finding c: use a point.</h2>'), C(3, '<p>"The curve passes through (2, 5)." Substitute it in and solve.</p>')],
        board: [B(0.5, "f'(x) = 4x - 3"), B(2.5, 'f(x) = 2x^2 - 3x + c'), B(5, '5 = 2(2)^2 - 3(2) + c', 'sub (2, 5)'), B(7.5, 'c = 3'), B(9.5, 'f(x) = 2x^2 - 3x + 3', '', { hl: true })] },
      { dur: 9, card: [C(0, '<h2>Two classic slips.</h2>'), C(5, '<p>Long expressions: tick off each term as you go. Missing a term was another 2025 slip.</p>')],
        board: [B(0.5, T`3x^2 \;\to\; 6x`, "that's differentiating", { wrong: true }), B(3, T`3x^2 \;\to\; x^3`, 'no + c', { wrong: true }), B(5.5, T`3x^2 \;\to\; x^3 + c`, '', { hl: true })] },
    ],
    example: {
      problem: `${m("f'(x) = 3x^2 - 4x + 1")} and the curve passes through ${m('(1, 4)')}. Find ${m('f(x)')}.`,
      steps: [
        { m: m('f(x) = x^3 - 2x^2 + x + c'), note: 'each term, + c' },
        { m: m('4 = 1 - 2 + 1 + c'), note: 'sub (1, 4)' },
        { m: m('c = 4') },
        { m: m('f(x) = x^3 - 2x^2 + x + 4') },
      ],
    },
    faded() {
      const a = R.nz(-3, 3), b = R.nz(-6, 6), x1 = R.nz(-2, 3); const t = [[3 * a === 0 ? 3 : 3 * a, 2], [b, 0]]; const F = I(t); const c = R.int(-8, 8); const y1 = ev(F, x1) + c;
      return { kind: 'num', answer: c, prompt: `${m(`f'(x) = ${poly(t)}`)} and the curve passes through ${m(`(${x1}, ${y1})`)}. Find ${m('c')}.`,
        scaffold: [m(`f(x) = ${poly(F)} + c`)], hint: `Substitute x = ${x1} and y = ${y1}, then solve for c.`, more: (moreFindC(t, F, x1, y1, c, 'f(x)')), sol: [m(`${y1} = ${poly(F).replace(/x/g, '(' + nf(x1) + ')')} + c`), m(`${y1} = ${nf(ev(F, x1))} + c`), m(`c = ${c}`)] };
    },
    grades: 'AMMA', // level of each generator below: A = apply a method, M = connect steps or use it in context, E = reason it through
    gens: [
      () => { const a = R.pick([2, 3, 4, 6, 8, 10, 12]), n = R.pick([1, 2, 3]), b = R.nz(-9, 9); const t = [[a * (n + 1) / (n + 1) * 1, n], [b, 0]]; const F = I(t);
        return P.mcq({ prompt: `Anti-differentiate ${m(poly(t))}`, more: ({ steps: [
    St('Anti-differentiate each term: add one to the power, then divide by the new power.'),
    ...intLines(t),
    St('Add c, because any number on its own disappears when you differentiate.', m(poly(F) + ' + c')),
  ], check: `Differentiate your answer. You get ${m(poly(t))} back.`, trap: 'Differentiating by mistake (taking one off the power), or leaving out + c.' }), sol: [m(`${poly([[a, n]])} \\to ${poly([[a / (n + 1), n + 1]])}`), m(`${b} \\to ${poly([[b, 1]])}`), 'Add c.'] }, P.uniq([
          { t: m(poly(F) + ' + c'), ok: true }, { t: m(poly(F)), why: 'You need + c. Leaving it out was listed as a Not Achieved slip in 2025.' },
          { t: m(poly([[a * n, n - 1]]) + ' + c'), why: 'That is differentiating. Add one to the power instead.' }, { t: m(poly([[a, n + 1], [b, 1]]) + ' + c'), why: `Divide by the new power, ${n + 1}.` }])); },
      () => { const a = R.nz(-3, 3), b = R.nz(-5, 5), e = R.nz(-6, 6), x1 = R.nz(-2, 3); const t = [[3 * a, 2], [2 * b, 1], [e, 0]]; const F = I(t), c = R.int(-9, 9), y1 = ev(F, x1) + c;
        return { kind: 'num', answer: c, prompt: `The gradient of a curve is ${m(`\\dfrac{dy}{dx} = ${poly(t)}`)}. The curve passes through ${m(`(${x1}, ${y1})`)}. Find the constant ${m('c')}.`, wrong: [{ v: y1, msg: 'Substitute the point into the anti-derivative, then solve for c.' }], more: (moreFindC(t, F, x1, y1, c, 'y')), sol: [m(`y = ${poly(F)} + c`), m(`${y1} = ${nf(ev(F, x1))} + c`), m(`c = ${c}`)] }; },
      () => { const a = R.nz(-2, 3), b = R.nz(-4, 4), x1 = R.int(0, 2), x2 = R.nz(-2, 4); const t = [[2 * a, 1], [b, 0]]; const F = I(t), c = R.int(-6, 6), y1 = ev(F, x1) + c, ans = ev(F, x2) + c;
        return { kind: 'num', answer: ans, prompt: `${m(`f'(x) = ${poly(t)}`)} and ${m(`f(${x1}) = ${y1}`)}. Find ${m(`f(${x2})`)}.`, wrong: [{ v: ev(F, x2), msg: 'You forgot c. Find it using f(' + x1 + ') = ' + y1 + ' first.' }], more: (moreFindC(t, F, x1, y1, c, 'f(x)', [St(`Now use the complete function to find f(${x2}).`, m(`f(${x2}) = ${sub(F.concat([[c, 0]]), x2)} = ${nf(ans)}`))])), sol: [m(`f(x) = ${poly(F)} + c`), m(`f(${x1}) = ${y1} \\Rightarrow c = ${c}`), m(`f(${x2}) = ${nf(ans)}`)] }; },
      () => { const a = R.int(1, 3), b = R.nz(-4, 4), e = R.nz(-6, 6); const t = [[5 * a, 4], [2 * b, 1], [e, 0]]; const F = I(t);
        return P.mcq({ prompt: `Find ${m(T`\int (${poly(t)})\, dx`)}`, more: ({ steps: [
    St('Anti-differentiate each term in turn: add one to the power, then divide by the new power.'),
    ...intLines(t),
    St('Put the terms together and add c.', m(poly(F) + ' + c')),
  ], check: `Differentiate your answer. You get ${m(poly(t))} back.`, trap: 'Missing a term in a long expression. Tick each one off as you go.' }), sol: ['Each term in turn: power + 1, divide by the new power.', m(poly(F) + ' + c')] }, P.uniq([
          { t: m(poly(F) + ' + c'), ok: true }, { t: m(poly(F.slice(0, 2)) + ' + c'), why: `You missed a term: ${m(String(e))} becomes ${m(poly([[e, 1]]))}.` },
          { t: m(poly([[a, 5], [2 * b, 2], [e, 1]]) + ' + c'), why: `Divide ${m(poly([[2 * b, 2]]))} by the new power, 2.` }, { t: m(poly([[20 * a, 3], [2 * b, 0]]) + ' + c'), why: 'That is differentiating.' }])); },
    ],
    tips: [
      '<span class="pen">+ c, every time.</span> Even when you find c straight after.',
      'Show how you found c: write the substituted line. The 2025 report says it is needed for Merit and Excellence.',
      'Long expressions: tick each term as you anti-differentiate it so none go missing.',
      'Check by differentiating your answer. You should get back what you started with.',
    ],
  });

  /* ================= 7. Kinematics ================= */
  P.addUnit({
    id: 'kinematics', title: 'Kinematics: distance, velocity, acceleration', mins: 10,
    blurb: 'Move between s, v and a with calculus, and find each constant from the starting conditions.',
    recap: 'Displacement s, velocity v and acceleration a are linked by calculus. Differentiate to go from s to v to a. Anti-differentiate to go back, and find each c from the starting values, when t = 0.',
    scenes: [
      { dur: 11, card: [C(0, '<h2>One chain, two directions.</h2>'), C(3, '<p>Differentiate to go right. Anti-differentiate, and find c, to go left.</p>')],
        draw(a) { const y = a.H / 2, w = a.W, bx = [w * 0.16, w * 0.5, w * 0.84], labels = [['s', 'displacement'], ['v', 'velocity'], ['a', 'acceleration']];
          labels.forEach(([l, n], k) => { const al = a.seg(a.p, k * 0.12, k * 0.12 + 0.15); a.box(bx[k] - 46, y - 46, 92, 92, { fill: a.C.sheet, stroke: a.C.ink, lw: 2.5, alpha: al }); a.text(l, bx[k], y - 6, { align: 'center', size: 2.4, font: 'head', alpha: al }); a.text(n, bx[k], y + 66, { align: 'center', col: a.C.muted, size: 0.85, alpha: al }); });
          const al2 = a.seg(a.p, 0.45, 0.6); for (let k = 0; k < 2; k++) { a.alpha(al2, () => a.line(bx[k] + 56, y - 70, bx[k + 1] - 56, y - 70, a.C.c3, 3)); a.text('differentiate', (bx[k] + bx[k + 1]) / 2, y - 90, { align: 'center', font: 'pen', col: a.C.c3, alpha: al2 }); }
          const al3 = a.seg(a.p, 0.65, 0.8); for (let k = 0; k < 2; k++) { a.alpha(al3, () => a.line(bx[k] + 56, y + 100, bx[k + 1] - 56, y + 100, a.C.pen, 3)); a.text('anti-diff + c', (bx[k] + bx[k + 1]) / 2, y + 122, { align: 'center', font: 'pen', col: a.C.pen, alpha: al3 }); } } },
      { dur: 13, card: [C(0, '<h2>Going right: differentiate.</h2>'), C(8, '<p>"At rest" means velocity is zero.</p>')],
        board: [B(0.5, 's = t^3 - 6t^2 + 9t'), B(2.5, 'v = 3t^2 - 12t + 9', 'ds/dt'), B(4.5, 'a = 6t - 12', 'dv/dt'), B(7.5, 'v = 0: \\ 3(t - 1)(t - 3) = 0'), B(10, T`t = 1 \text{ s and } t = 3 \text{ s}`, 'at rest', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Going left: anti-differentiate, then find c.</h2>'), C(3, `<p>"Starts with velocity 4 m/s" tells you ${m('v(0) = 4')}.</p>`), C(8.5, '<p>Showing how you got c is needed for Merit and Excellence.</p>')],
        board: [B(0.5, 'a = 2t + 1'), B(2.5, 'v = t^2 + t + c'), B(5, '4 = 0 + 0 + c', 'v(0) = 4'), B(7.5, 'v = t^2 + t + 4', '', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>Negative velocity means going backwards.</h2>'), C(4, `<p>Between ${m('t = 1')} and ${m('t = 3')} this particle moves back towards the start.</p>`)],
        draw(a) { const v = a.view(0, 4.2, -4, 10); a.axes(v, { lystep: 2 }); const f = (t) => 3 * t * t - 12 * t + 9; a.plot(v, f, a.C.c1, 3.5, a.seg(a.p, 0, 0.5));
          const al = a.seg(a.p, 0.5, 0.65); a.shade(v, f, 1, 3, a.C.pen, 0.25 * al); a.dot(v, 1, 0, a.C.pen, 7, al); a.dot(v, 3, 0, a.C.pen, 7, al); a.text('moving backwards', v.X(2), v.Y(-1.5), { align: 'center', font: 'pen', col: a.C.pen, alpha: al }); a.text('v (m/s)', v.X(0.1), v.Y(9.4), { col: a.C.c1 }); a.text('t (s)', v.X(4.1), v.Y(0) - 14, { align: 'right', col: a.C.muted }); } },
    ],
    example: {
      problem: `A particle has acceleration ${m('a = 6t - 4')} m/s². It starts from rest at ${m('s = 2')} m. Find its displacement at ${m('t = 3')} s.`,
      steps: [
        { m: m('v = 3t^2 - 4t + c_1') },
        { m: 'At rest at the start: ' + m('v(0) = 0 \\Rightarrow c_1 = 0'), note: 'find c₁' },
        { m: m('s = t^3 - 2t^2 + c_2') },
        { m: m('s(0) = 2 \\Rightarrow c_2 = 2'), note: 'find c₂' },
        { m: m('s(3) = 27 - 18 + 2 = 11') + ' m' },
      ],
    },
    faded() {
      const p = R.int(1, 4), u = R.int(0, 9), t = R.int(2, 6), v = p * t * t + u;
      return { kind: 'num', answer: v, prompt: `A car's acceleration is ${m(`a = ${2 * p}t`)} m/s². Its velocity at ${m('t = 0')} is ${u} m/s. Find its velocity at ${m(`t = ${t}`)} s.`,
        scaffold: [m(`v = ${p === 1 ? '' : p}t^2 + c`), m(`v(0) = ${u} \\Rightarrow c = ${u}`)], hint: `Substitute t = ${t}.`, wrong: [{ v: p * t * t, msg: 'Include c = ' + u + '.' }], more: ({ steps: [
    St('Velocity comes from acceleration by anti-differentiating.'),
    St('Anti-differentiate and add c.', m(`v = ${co(p, 't^2')} + c`)),
    St(`Use the starting velocity: at t = 0, v = ${u}. Every t term is 0 then, so c = ${u}.`, m(`v = ${co(p, 't^2')}${u ? ' + ' + u : ''}`)),
    St(`Substitute t = ${t}.`, m(`v(${t}) = ${p === 1 ? '' : p}(${t})^2${u ? ' + ' + u : ''} = ${v}`)),
    St(`The velocity is ${v} m/s.`),
  ], trap: 'Leaving out c. The starting velocity is given so you can find it.' }), sol: [m(`v(${t}) = ${p === 1 ? '' : p}(${t})^2 + ${u} = ${v}`) + ' m/s'] };
    },
    grades: 'AAMMAM', // level of each generator below: A = apply a method, M = connect steps or use it in context, E = reason it through
    gens: [
      () => { const a = R.int(1, 2), b = R.nz(-6, 6), c = R.int(-5, 9), t = R.int(1, 5); const s = [[a, 3], [b, 2], [c, 1]]; const vv = ev(d(s), t);
        return { kind: 'num', answer: vv, prompt: `A particle's displacement is ${m(`s = ${poly(s, 't')}`)} metres. Find its velocity at ${m(`t = ${t}`)} seconds.`, wrong: [{ v: ev(s, t), msg: 'That is the displacement. Velocity is ds/dt.' }], more: ({ steps: [
    St('Velocity is how fast displacement changes, so differentiate s.'),
    ...diffLines(s, 't'),
    St('Together:', m(T`v = \dfrac{ds}{dt} = ${poly(d(s), 't')}`)),
    St(`Substitute t = ${t}.`, m(`v(${t}) = ${sub(d(s), t, 't')} = ${nf(vv)}`)),
  ], check: `Units: displacement is in m, so velocity is in m/s.`, trap: `Putting t = ${t} into s. That gives the position, not the velocity.` }), sol: [m(`v = ${poly(d(s), 't')}`), m(`v(${t}) = ${nf(vv)}`) + ' m/s'] }; },
      () => { const a = R.int(1, 3), b = R.nz(-6, 6), c = R.int(-5, 9), t = R.int(0, 5); const s = [[a, 3], [b, 2], [c, 1]]; const acc = ev(d(d(s)), t);
        return { kind: 'num', answer: acc, prompt: `${m(`s = ${poly(s, 't')}`)}. Find the acceleration at ${m(`t = ${t}`)}.`, wrong: [{ v: ev(d(s), t), msg: 'That is the velocity. Differentiate once more for acceleration.' }], more: ({ steps: [
    St('Acceleration is how fast velocity changes. Differentiate s to get v, then differentiate v to get a.', m(T`v = ${poly(d(s), 't')} \qquad a = ${poly(d(d(s)), 't')}`)),
    St(`Substitute t = ${t}.`, m(`a(${t}) = ${sub(d(d(s)), t, 't')} = ${acc}`)),
    St(`The acceleration is ${acc} m/s².`),
  ], trap: 'Stopping after one derivative. That gives velocity, not acceleration.' }), sol: [m(`v = ${poly(d(s), 't')}`), m(`a = ${poly(d(d(s)), 't')}`), m(`a(${t}) = ${acc}`) + ' m/s²'] }; },
      () => { const p = R.int(1, 3), q = R.nz(-4, 6), u = R.int(0, 12), t = R.int(1, 6); const at = [[2 * p, 1], [q, 0]]; const V = I(at), ans = ev(V, t) + u;
        return { kind: 'num', answer: ans, prompt: `${m(`a = ${poly(at, 't')}`)} m/s² and the initial velocity is ${u} m/s. Find the velocity at ${m(`t = ${t}`)} s.`, wrong: [{ v: ev(V, t), msg: 'Include c, found from the initial velocity.' }, { v: ev(at, t), msg: 'That is the acceleration. Anti-differentiate to get velocity.' }], more: ({ steps: [
    St('Going from acceleration to velocity means anti-differentiating.', m(`v = ${poly(V, 't')} + c`)),
    St(`“Initial velocity” means the velocity when t = 0. Substitute t = 0 and v = ${u}.`, m(T`${u} = 0 + c \;\Rightarrow\; c = ${u}`)),
    St(`Substitute t = ${t}.`, m(`v(${t}) = ${sub(V, t, 't')}${u ? ' + ' + u : ''} = ${nf(ans)}`)),
  ], trap: 'Forgetting c. Without it, you lose the starting speed.' }), sol: [m(`v = ${poly(V, 't')} + c`), m(`v(0) = ${u} \\Rightarrow c = ${u}`), m(`v(${t}) = ${nf(ans)}`) + ' m/s'] }; },
      () => { const a = R.int(1, 2), b = R.nz(-4, 4), e = R.int(1, 8), s0 = R.int(0, 10), t = R.int(1, 4); const vt = [[3 * a, 2], [2 * b, 1], [e, 0]]; const S = I(vt), ans = ev(S, t) + s0;
        return { kind: 'num', answer: ans, prompt: `${m(`v = ${poly(vt, 't')}`)} m/s and ${m(`s = ${s0}`)} m when ${m('t = 0')}. Find ${m('s')} when ${m(`t = ${t}`)}.`, wrong: [{ v: ev(S, t), msg: `Add the starting position, c = ${s0}.` }], more: ({ steps: [
    St('Going from velocity to displacement means anti-differentiating.'),
    ...intLines(vt, 't'),
    St('Add c.', m(`s = ${poly(S, 't')} + c`)),
    St(`At t = 0, s = ${s0}. Every t term is 0 then, so c = ${s0}.`),
    St(`Substitute t = ${t}.`, m(`s(${t}) = ${sub(S, t, 't')}${s0 ? ' + ' + s0 : ''} = ${nf(ans)}`)),
  ], trap: `Forgetting the starting position, c = ${s0}.` }), sol: [m(`s = ${poly(S, 't')} + c`), m(`c = ${s0}`), m(`s(${t}) = ${nf(ans)}`) + ' m'] }; },
      () => { let p, q; do { p = R.int(1, 6); q = R.int(1, 8); } while (p === q); const vt = [[1, 2], [-(p + q), 1], [p * q, 0]];
        return { kind: 'multi', answer: [p, q], prompt: `A particle's velocity is ${m(`v = ${poly(vt, 't')}`)} m/s. At what times is it at rest?`, more: ({ steps: [
    St('“At rest” means not moving, so the velocity is zero.', m(`${poly(vt, 't')} = 0`)),
    St(`Factorise: two numbers that multiply to ${p * q} and add to ${-(p + q)}.`, m(`(t - ${p})(t - ${q}) = 0`)),
    St('Each bracket gives a time.', m(T`t = ${p} \text{ s} \quad\text{and}\quad t = ${q} \text{ s}`)),
  ], trap: 'Setting s = 0 instead. That is when it is back at the start, not when it has stopped.' }), sol: ['At rest means ' + m('v = 0'), m(`(t - ${p})(t - ${q}) = 0`), m(`t = ${p}`) + ' s and ' + m(`t = ${q}`) + ' s'] }; },
      () => { const u = R.int(10, 30), t = u / 9.8;
        return { kind: 'num', answer: t, dp: 2, prompt: `A ball is thrown straight up at ${u} m/s. Its acceleration is ${m('-9.8')} m/s². How long does it take to reach its highest point? Give your answer to 2 decimal places.`, more: ({ steps: [
    St('Anti-differentiate the acceleration to get the velocity.', m('v = -9.8t + c')),
    St(`At t = 0 it is thrown at ${u} m/s, so c = ${u}.`, m(`v = ${u} - 9.8t`)),
    St('At the highest point the ball stops for an instant before it falls back, so v = 0.', m(`${u} - 9.8t = 0`)),
    St('Solve for t.', m(T`t = \dfrac{${u}}{9.8} = ${P.f(t, 2)} \text{ s}`)),
  ], trap: 'Setting the height to zero. At the top it is the velocity that is zero.' }), sol: [m(`v = -9.8t + c`), m(`v(0) = ${u} \\Rightarrow v = ${u} - 9.8t`), 'Highest point: ' + m('v = 0'), m(T`t = \dfrac{${u}}{9.8} = ${P.f(t, 2)}`) + ' s'] }; },
    ],
    tips: [
      'Write which way you are going: "v = ds/dt" or "v = ∫a dt". It shows the marker your method.',
      '<span class="pen">Find c from the starting values</span>, and write the line that shows it.',
      '"At rest" means v = 0. "Starts from the origin" means s = 0 when t = 0.',
      'Units: m, m/s, m/s². Include them in your final answer.',
    ],
  });
})();
