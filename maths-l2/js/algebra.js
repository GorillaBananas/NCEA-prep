/* AS 91261 (Maths 2.6) Apply algebraic methods in solving problems */
(function () {
  const P = NP, R = P.R, T = String.raw;
  const m = (tex) => '$' + String(tex).replace(/</g, '\\lt ').replace(/([a-z])\^\{1\}/g, '$1') + '$'; // x^{1} reads as x
  const B = (at, tex, note, o = {}) => Object.assign({ at, tex: tex == null ? tex : tex.replace(/</g, '\\lt '), note }, o);
  const C = (at, html) => ({ at, html });
  const nf = P.nf, poly = P.poly, sc = P.sc;
  const lin = (c) => '(x' + (c === 0 ? '' : sc(c)) + ')';
  const signed = (c) => (c < 0 ? '-' + Math.abs(c) : String(c));
  const br = (c) => (c < 0 ? '(' + c + ')' : String(c));

  /* ================= 1. Index laws and surds ================= */
  P.addUnit({
    id: 'indices', title: 'Index laws and surds', mins: 9,
    blurb: 'Simplify powers, roots and negative indices without the classic slips.',
    scenes: [
      { dur: 10, card: [C(0, '<h2>A power hits everything inside the bracket.</h2>'), C(3, `<p>Examiners flagged this slip in last year's exam: writing ${m('(2y)^3')} as ${m('2y^3')}.</p>`), C(6.5, '<p>Write it out once and you will not make that mistake again.</p>')],
        board: [B(0.4, '(2y)^3', '', { big: true }), B(2.4, '= 2y^3', 'not this', { wrong: true }), B(4.6, T`= 2y \times 2y \times 2y`), B(6.6, '= 8y^3', 'cube every factor', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Three laws do nearly everything.</h2>'), C(5, '<p>Numbers in front are ordinary numbers. Multiply or divide them as usual.</p>'), C(8.5, '<p>Put it together and big expressions collapse fast.</p>')],
        board: [B(0.5, T`x^a \times x^b = x^{a+b}`, 'multiply: add'), B(2.2, T`\dfrac{x^a}{x^b} = x^{a-b}`, 'divide: subtract'), B(3.9, T`(x^a)^b = x^{ab}`, 'bracket: multiply'), B(8.5, T`\dfrac{(3x^2)^2 \times x}{x^3} = \dfrac{9x^5}{x^3} = 9x^2`, '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Negative and fractional powers are just code.</h2>'), C(4, '<p>Negative means one over. The bottom of a fraction power is a root, the top is a power.</p>'), C(8.5, '<p>Take the root first, so the numbers stay small.</p>')],
        board: [B(0.5, T`x^{-2} = \dfrac{1}{x^2}`, 'negative: flip'), B(2.5, T`x^{\frac12} = \sqrt{x}`, 'half: square root'), B(4.5, T`x^{\frac23} = \sqrt[3]{x^2}`, 'bottom root, top power'), B(8.5, T`8^{\frac23} = \left(\sqrt[3]{8}\right)^2 = 2^2 = 4`, '', { hl: true })] },
      { dur: 9, card: [C(0, '<h2>"Write in index form" means one single power.</h2>'), C(3.5, '<p>Turn the root into a fraction power. Dividing turns it negative.</p>')],
        board: [B(0.5, T`\dfrac{1}{\sqrt{x}}`, '', { big: true }), B(2.5, T`= \dfrac{1}{x^{\frac12}}`), B(4.5, T`= x^{-\frac12}`, 'one power', { hl: true })] },
    ],
    example: {
      problem: `Simplify ${m(T`\dfrac{(2x^3y)^3}{4x^5y}`)}`,
      steps: [
        { m: m(T`(2x^3y)^3 = 2^3 x^{9} y^3 = 8x^9y^3`), note: 'cube every factor' },
        { m: m(T`\dfrac{8x^9y^3}{4x^5y}`) },
        { m: m(T`= \dfrac{8}{4}\,x^{9-5}\,y^{3-1}`), note: 'divide: subtract powers' },
        { m: m(T`= 2x^4y^2`) },
      ],
    },
    faded() {
      const k = R.pick([2, 3]), a = R.int(2, 4), n = R.pick([2, 3]);
      const top = k ** n, divs = [2, 3, 4, 6, 8, 9, 12, 16].filter((d) => top % d === 0 && top / d > 1);
      const mm = R.pick(divs), b = R.int(1, a * n - 1), c = top / mm, p = a * n - b;
      return {
        kind: 'multi', ordered: true, answer: [c, p], answerTex: p === 1 ? `${c}x` : `${c}x^{${p}}`,
        prompt: `Simplify ${m(T`\dfrac{(${k}x^{${a}})^{${n}}}{${mm}${b === 1 ? 'x' : `x^{${b}}`}}`)}. Your answer looks like ${m('cx^p')}.`,
        fmt: 'Enter the number in front, then the power. For example: 3, 4',
        scaffold: [m(T`(${k}x^{${a}})^{${n}} = ${top}x^{${a * n}}`) + ' (power of a power: multiply)', m(T`\dfrac{${top}x^{${a * n}}}{${mm}${b === 1 ? 'x' : `x^{${b}}`}}`)],
        hint: 'Divide the numbers. For the powers, subtract the bottom one from the top one.',
        wrong: [{ v: [c, a + n - b], msg: 'For a power of a power, multiply the indices: ' + m(`(x^${a})^${n} = x^{${a * n}}`) + '.' }],
        sol: [m(T`${top} \div ${mm} = ${c}`), m(T`x^{${a * n} - ${b}} = ${p === 1 ? 'x' : `x^{${p}}`}`), 'Answer: ' + m(p === 1 ? `${c}x` : `${c}x^{${p}}`)],
      };
    },
    gens: [
      () => {
        const k = R.pick([2, 3, 5]), n = R.pick([2, 3]), v = R.pick(['y', 'x', 'a']);
        return P.mcq({ prompt: `Simplify ${m(`(${k}${v})^${n}`)}`, sol: [m(`(${k}${v})^${n} = ${Array(n).fill(k + v).join(T` \times `)}`), m(`= ${k ** n}${v}^${n}`)] }, P.uniq([
          { t: m(`${k ** n}${v}^${n}`), ok: true },
          { t: m(`${k}${v}^${n}`), why: `Only the ${v} got the power. The ${k} is inside the bracket, so it must be raised to the power too.` },
          { t: m(`${k * n}${v}^${n}`), why: `That multiplied ${k} by ${n}. Raising to the power ${n} means ${Array(n).fill(k).join(' × ')}.` },
          { t: m(`${k ** n}${v}`), why: `The ${v} needs the power as well.` },
        ]));
      },
      () => {
        const [b, p, q, val] = R.pick([[8, 2, 3, 4], [27, 2, 3, 9], [16, 3, 4, 8], [32, 3, 5, 8], [4, 3, 2, 8], [9, 3, 2, 27], [25, 3, 2, 125], [64, 2, 3, 16], [81, 3, 4, 27], [125, 2, 3, 25]]);
        const neg = Math.random() < 0.5; const ans = neg ? 1 / val : val; const root = Math.round(b ** (1 / q));
        return {
          kind: 'num', answer: ans, tol: neg ? 1e-4 : undefined, answerTex: neg ? `\\frac{1}{${val}}` : String(val), fmt: 'Work it out without a calculator. A fraction like 1/4 is fine.',
          prompt: `Evaluate ${m(`${b}^{${neg ? '-' : ''}\\frac{${p}}{${q}}}`)}`,
          wrong: neg ? [{ v: val, msg: 'The negative index means one over: the answer is ' + m(`\\frac{1}{${val}}`) + '.' }] : [],
          sol: [m(T`${q === 2 ? '\\sqrt{' + b + '}' : '\\sqrt[' + q + ']{' + b + '}'} = ${root}`) + ' (the bottom of the fraction is the root)', m(`${root}^${p} = ${val}`) + ' (the top is the power)', neg ? 'Negative index, so flip it: ' + m(`\\frac{1}{${val}}`) : ''].filter(Boolean),
        };
      },
      () => {
        const a = R.int(2, 5), b = R.int(1, 4), n = a + 0.5 - b;
        return {
          kind: 'num', answer: n, answerTex: nf(n),
          prompt: `Write ${m(T`\dfrac{x^{${a}}\sqrt{x}}{x^{${b}}}`)} in the form ${m('x^n')}. What is ${m('n')}?`,
          fmt: 'A fraction like 3/2 or a decimal like 1.5 is fine.',
          wrong: [{ v: a + 2 - b, msg: m(T`\sqrt{x} = x^{\frac12}`) + ', not ' + m('x^2') + '.' }],
          sol: [m(T`\sqrt{x} = x^{\frac12}`), m(T`x^{${a}} \times x^{\frac12} = x^{${nf(a + 0.5)}}`), m(T`x^{${nf(a + 0.5)} - ${b}} = x^{${nf(n)}}`)],
        };
      },
      () => {
        const q = R.pick([2, 3]), p = R.pick([1, 2, 4, 5].filter((x) => x % q !== 0)), n = -p / q;
        const xp = p === 1 ? 'x' : `x^{${p}}`, rootTex = q === 2 ? `\\sqrt{${xp}}` : `\\sqrt[3]{${xp}}`;
        return {
          kind: 'num', answer: n, answerTex: nf(n), fmt: 'A fraction like -2/3 is fine.',
          prompt: `Write ${m(T`\dfrac{1}{${p === 1 ? (q === 2 ? '\\sqrt{x}' : '\\sqrt[3]{x}') : rootTex}}`)} as ${m('x^n')}. What is ${m('n')}?`,
          wrong: [{ v: p / q, msg: 'It is one over the root, so the power is negative.' }, { v: -q / p, msg: 'The root goes on the bottom of the fraction: ' + m(T`\sqrt[${q}]{x^{${p}}} = x^{\frac{${p}}{${q}}}`) + '.' }],
          sol: [m(T`${rootTex} = x^{\frac{${p}}{${q}}}`) + ' (root on the bottom)', 'One over it makes the power negative: ' + m(`x^{${nf(n)}}`)],
        };
      },
      () => {
        const k = R.pick([2, 3, 4]), a = R.int(2, 4), mm = R.int(2, 5), b = R.int(1, 5);
        const c = k * k * mm, p = 2 * a + b;
        return P.mcq({ prompt: `Simplify ${m(T`(${k}x^{${a}})^2 \times ${mm}x^{${b}}`)}`, sol: [m(T`(${k}x^{${a}})^2 = ${k * k}x^{${2 * a}}`), m(T`${k * k}x^{${2 * a}} \times ${mm}x^{${b}} = ${c}x^{${p}}`)] }, P.uniq([
          { t: m(`${c}x^{${p}}`), ok: true },
          { t: m(`${2 * k * mm}x^{${p}}`), why: `${m(`${k}^2`)} is ${k * k}, not ${2 * k}.` },
          { t: m(`${c}x^{${a * 2 * b}}`), why: 'When you multiply, add the powers. Do not multiply them.' },
          { t: m(`${k * mm}x^{${p}}`), why: `The ${k} is inside the bracket, so it gets squared too.` },
        ]));
      },
      () => {
        const [r, v] = R.pick([[4, 8], [9, 27], [16, 64], [25, 125], [36, 216]]);
        return {
          kind: 'num', answer: r, prompt: `Solve ${m(T`x^{\frac32} = ${v}`)}`, fmt: 'Give the exact value.',
          wrong: [{ v: v ** (3 / 2), msg: 'Undo the power by raising both sides to the flipped power, ' + m(T`\tfrac23`) + '.' }, { v: v / 1.5, msg: 'You cannot divide by a power. Raise both sides to the power ' + m(T`\tfrac23`) + '.' }],
          sol: ['Raise both sides to the power ' + m(T`\tfrac23`) + ' (the flip of ' + m(T`\tfrac32`) + ')', m(T`x = ${v}^{\frac23} = \left(\sqrt[3]{${v}}\right)^2 = ${Math.round(Math.cbrt(v))}^2 = ${r}`)],
        };
      },
    ],
    tips: [
      `Show each law as you use it. A bare answer can get Correct Answer Only, which is not enough for Merit.`,
      `${m('(2y)^3 = 8y^3')}, not ${m('2y^3')}. <span class="pen">Every factor gets the power.</span>`,
      `If the question says "positive indices", finish by flipping: ${m(T`3x^{-2} = \dfrac{3}{x^2}`)}.`,
      `Fraction powers: root first, then power. ${m(T`27^{\frac23} = 3^2 = 9`)}.`,
      'Check your simplified answer by putting x = 2 into the question and into your answer. Same number? You are right.',
    ],
  });

  /* ================= 2. Expanding and factorising ================= */
  P.addUnit({
    id: 'factorising', title: 'Expanding and factorising', mins: 10,
    blurb: 'Brackets in, brackets out. The skill that unlocks the rest of the paper.',
    scenes: [
      { dur: 11, card: [C(0, '<h2>Expanding: every term times every term.</h2>'), C(3, `<p>Picture ${m('(x+3)(x+2)')} as a rectangle. Its area is the four pieces added up.</p>`), C(8, `<p class="eq">${m('(x+3)(x+2) = x^2 + 5x + 6')}</p>`)],
        draw(a) {
          const { ctx, W, H, p, C: col } = a; const s = Math.min(W * 0.8, H * 0.74), x0 = (W - s) / 2 + 10, y0 = (H - s * 0.88) / 2 - 6;
          const wx = s * 0.62, w3 = s * 0.38, hx = s * 0.62, h2 = s * 0.26;
          const pieces = [[x0, y0, wx, hx, 'x²', col.c1], [x0 + wx, y0, w3, hx, '3x', col.c2], [x0, y0 + hx, wx, h2, '2x', col.c3], [x0 + wx, y0 + hx, w3, h2, '6', col.c4]];
          pieces.forEach(([x, y, w, h, l, c], k) => { const al = a.seg(p, 0.15 + k * 0.14, 0.3 + k * 0.14); a.box(x, y, w, h, { fill: c, alpha: al * 0.22, stroke: false }); a.box(x, y, w, h, { stroke: col.ink, alpha: al, lw: 2 }); a.text(l, x + w / 2, y + h / 2, { align: 'center', size: 1.5, alpha: al, col: col.ink, font: 'head' }); });
          a.text('x', x0 + wx / 2, y0 - 16, { align: 'center', size: 1.1 }); a.text('+3', x0 + wx + w3 / 2, y0 - 16, { align: 'center', size: 1.1 });
          a.text('x', x0 - 16, y0 + hx / 2, { align: 'center', size: 1.1 }); a.text('+2', x0 - 20, y0 + hx + h2 / 2, { align: 'center', size: 1.1 });
          a.text('3x + 2x = 5x', x0 + s * 0.5, y0 + hx + h2 + 34, { align: 'center', font: 'pen', col: col.pen, alpha: a.seg(p, 0.75, 0.85) });
        } },
      { dur: 12, card: [C(0, '<h2>Factorising runs it backwards.</h2>'), C(2.5, `<p>For ${m('x^2 + 7x + 12')}: find two numbers that <b>multiply to 12</b> and <b>add to 7</b>.</p>`), C(8, '<p>Check by expanding. It takes five seconds and saves marks.</p>')],
        board: [B(0.5, 'x^2 + 7x + 12', '', { big: true }), B(3, T`1 \times 12 \qquad 2 \times 6 \qquad 3 \times 4`, 'which adds to 7?'), B(6, '= (x+3)(x+4)', '3 + 4 = 7', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>Negatives: the signs do the work.</h2>'), C(3, `<p>${m('x^2 - x - 12')}: multiply to −12, add to −1. That is −4 and 3.</p>`), C(7, '<p>A negative product means one number of each sign.</p>')],
        board: [B(0.5, 'x^2 - x - 12', '', { big: true }), B(3, T`-4 \times 3 = -12, \quad -4 + 3 = -1`), B(6, '= (x-4)(x+3)', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>Two shortcuts to spot.</h2>'), C(2, '<p>Common factor first, always.</p>'), C(6, '<p>A square minus a square splits into a plus and a minus bracket.</p>')],
        board: [B(1, '2x^2 - 8x = 2x(x - 4)', 'common factor'), B(5.5, T`9x^2 - 25 = (3x)^2 - 5^2`, 'square minus square'), B(8, '= (3x-5)(3x+5)', '', { hl: true })] },
      { dur: 14, card: [C(0, `<h2>When there is a number in front of ${m('x^2')}.</h2>`), C(2.5, `<p>${m('2x^2 + 7x + 3')}: multiply ${m('2 \\times 3 = 6')}. Two numbers that multiply to 6 and add to 7: 6 and 1.</p>`), C(7, '<p>Split the middle term, then factorise in pairs.</p>')],
        board: [B(0.5, '2x^2 + 7x + 3', '', { big: true }), B(4, '= 2x^2 + 6x + x + 3', 'split 7x'), B(7, '= 2x(x+3) + 1(x+3)', 'pairs'), B(10, '= (2x+1)(x+3)', 'same bracket', { hl: true })] },
    ],
    example: {
      problem: `Factorise ${m('3x^2 - 10x - 8')}`,
      steps: [
        { m: m(T`a \times c = 3 \times (-8) = -24`), note: 'multiply the ends' },
        { m: 'Two numbers that multiply to −24 and add to −10: ' + m('-12') + ' and ' + m('2') },
        { m: m('3x^2 - 12x + 2x - 8'), note: 'split the middle' },
        { m: m('3x(x - 4) + 2(x - 4)') },
        { m: m('(3x + 2)(x - 4)'), note: 'expand to check' },
      ],
    },
    faded() {
      let p, q; do { p = R.nz(-9, 9); q = R.nz(-9, 9); } while (p === q || p + q === 0);
      const b = p + q, c = p * q;
      return {
        kind: 'multi', answer: [p, q], answerTex: `(x${sc(p)})(x${sc(q)})`,
        prompt: `Factorise ${m(poly([[1, 2], [b, 1], [c, 0]]))}. The answer is ${m('(x + p)(x + q)')}.`,
        fmt: 'Enter the two numbers p and q, separated by a comma. For example: 3, -5',
        scaffold: [`I need two numbers that multiply to ${m(String(c))} and add to ${m(String(b))}.`],
        hint: c < 0 ? 'The product is negative, so one number is positive and one is negative.' : b < 0 ? 'Both numbers are negative.' : 'Both numbers are positive.',
        wrong: [{ v: [-p, -q], msg: 'The signs are the wrong way round. Expand your brackets to check.' }],
        sol: [m(`${p} \\times ${signed(q)} = ${c}`) + ' and ' + m(`${p} + ${signed(q)} = ${b}`), 'So ' + m(`${poly([[1, 2], [b, 1], [c, 0]])} = (x${sc(p)})(x${sc(q)})`)],
      };
    },
    gens: [
      () => {
        let p, q; do { p = R.nz(-9, 9); q = R.nz(-9, 9); } while (p === q || p + q === 0);
        const b = p + q, c = p * q, ex = poly([[1, 2], [b, 1], [c, 0]]);
        const choices = [{ t: m(`(x${sc(p)})(x${sc(q)})`), ok: true }, { t: m(`(x${sc(-p)})(x${sc(-q)})`), why: `Expand it: you get ${m(poly([[1, 2], [-b, 1], [c, 0]]))}. The signs are flipped.` }];
        const alt = [];
        for (let d = 1; d <= Math.abs(c); d++) if (c % d === 0) for (const s of [1, -1]) { const u = s * d, w = c / u; if (u !== p && u !== q && u + w !== b && u <= w) alt.push([u, w]); }
        if (alt.length) { const [u, w] = R.pick(alt); choices.push({ t: m(`(x${sc(u)})(x${sc(w)})`), why: `These multiply to ${c}, but add to ${u + w}, not ${b}.` }); }
        choices.push({ t: m(`(x${sc(p)})(x${sc(-q)})`), why: `Expand it: the middle term would be ${m(poly([[p - q, 1]]))}.` });
        return P.mcq({ prompt: `Factorise ${m(ex)}`, sol: [`Two numbers that multiply to ${c} and add to ${b}: ${p} and ${q}.`, m(`${ex} = (x${sc(p)})(x${sc(q)})`)] }, P.uniq(choices).slice(0, 4));
      },
      () => {
        const a = R.nz(-8, 8), b = R.nz(-8, 8);
        return {
          kind: 'multi', ordered: true, answer: [a + b, a * b], answerTex: poly([[1, 2], [a + b, 1], [a * b, 0]]),
          prompt: `Expand ${m(`(x${sc(a)})(x${sc(b)})`)} into the form ${m('x^2 + bx + c')}.`, fmt: 'Enter b, then c, separated by a comma. For example: 5, -6',
          wrong: [{ v: [a + b, a + b], msg: 'The last term is the two numbers multiplied together.' }, { v: [a * b, a + b], msg: 'Other way round: b is the x-coefficient (the sum), c is the constant (the product).' }],
          sol: [m(`x \\times x = x^2`), m(`x \\times ${br(b)} + ${br(a)} \\times x = ${poly([[a + b, 1]])}`), m(`${br(a)} \\times ${br(b)} = ${a * b}`), 'So ' + m(poly([[1, 2], [a + b, 1], [a * b, 0]]))],
        };
      },
      () => {
        const k = R.int(1, 5), q = R.int(1, 9), ex = `${k * k === 1 ? '' : k * k}x^2 - ${q * q}`, kx = (k === 1 ? '' : k) + 'x';
        return P.mcq({ prompt: `Factorise ${m(ex)}`, sol: [m(`${ex} = (${kx})^2 - ${q}^2`), m(`= (${kx} - ${q})(${kx} + ${q})`)] }, P.uniq([
          { t: m(`(${kx} - ${q})(${kx} + ${q})`), ok: true },
          { t: m(`(${kx} - ${q})^2`), why: `That expands to ${m(`${k * k === 1 ? '' : k * k}x^2 - ${2 * k * q}x + ${q * q}`)}. A difference of two squares needs one plus and one minus.` },
          { t: m(`(${kx} + ${q})^2`), why: 'That gives a plus at the end. You need one plus bracket and one minus bracket.' },
          { t: m(`(${k * k === 1 ? '' : k * k}x - ${q})(x + ${q})`), why: 'Take the square root of each part first: ' + m(`${k * k === 1 ? '' : k * k}x^2 = (${kx})^2`) + '.' },
        ]));
      },
      () => {
        const a = R.pick([2, 3, 5]); let p, q; do { p = R.nz(-6, 6); q = R.nz(-6, 6); } while (p % a === 0 || a * q + p === 0);
        // (a x + p)(x + q) = a x^2 + (aq + p) x + pq
        const ex = poly([[a, 2], [a * q + p, 1], [p * q, 0]]);
        return P.mcq({ prompt: `Factorise ${m(ex)}`, sol: [`Multiply the ends: ${m(`${a} \\times ${signed(p * q)} = ${a * p * q}`)}. Two numbers that multiply to ${a * p * q} and add to ${a * q + p}: ${m(String(a * q))} and ${m(String(p))}.`, m(`${ex} = (${a}x${sc(p)})(x${sc(q)})`), 'Expand to check.'] }, P.uniq([
          { t: m(`(${a}x${sc(p)})(x${sc(q)})`), ok: true },
          { t: m(`(${a}x${sc(q)})(x${sc(p)})`), why: `Expand it: the middle term would be ${m(poly([[a * p + q, 1]]))}, not ${m(poly([[a * q + p, 1]]))}.` },
          { t: m(`(${a}x${sc(-p)})(x${sc(-q)})`), why: 'The signs are flipped. Expand to check.' },
          { t: m(`${a}(x${sc(p)})(x${sc(q)})`), why: `That expands to ${m(poly([[a, 2], [a * (p + q), 1], [a * p * q, 0]]))}.` },
        ]));
      },
      () => {
        const a = R.int(2, 5), b = R.nz(-7, 7);
        const ex = `(${a}x${sc(b)})^2`, ans = poly([[a * a, 2], [2 * a * b, 1], [b * b, 0]]);
        return P.mcq({ prompt: `Expand ${m(ex)}`, sol: [m(`${ex} = (${a}x${sc(b)})(${a}x${sc(b)})`), m(`= ${a * a}x^2 ${b < 0 ? '-' : '+'} ${Math.abs(a * b)}x ${b < 0 ? '-' : '+'} ${Math.abs(a * b)}x + ${b * b}`), m(`= ${ans}`)] }, P.uniq([
          { t: m(ans), ok: true },
          { t: m(poly([[a * a, 2], [b * b, 0]])), why: 'You lost the middle term. Write it as two brackets multiplied together.' },
          { t: m(poly([[a * a, 2], [a * b, 1], [b * b, 0]])), why: 'The middle term appears twice, so it is ' + m(`2 \\times ${a} \\times ${signed(b)}x`) + '.' },
          { t: m(poly([[a, 2], [2 * a * b, 1], [b * b, 0]])), why: `The ${a} is squared too: ${m(`(${a}x)^2 = ${a * a}x^2`)}.` },
        ]));
      },
      () => {
        const k = R.pick([2, 3, 5]); let p, q; do { p = R.nz(-6, 6); q = R.nz(-6, 6); } while (p === q || p + q === 0);
        const ex = poly([[k, 2], [k * (p + q), 1], [k * p * q, 0]]);
        return P.mcq({ prompt: `Fully factorise ${m(ex)}`, sol: [`Take out the common factor ${k}: ${m(`${k}(${poly([[1, 2], [p + q, 1], [p * q, 0]])})`)}`, `Then factorise the bracket: ${m(`${k}(x${sc(p)})(x${sc(q)})`)}`] }, P.uniq([
          { t: m(`${k}(x${sc(p)})(x${sc(q)})`), ok: true },
          { t: m(`(x${sc(p)})(x${sc(q)})`), why: `Expand it: you get ${m(poly([[1, 2], [p + q, 1], [p * q, 0]]))}. You lost the common factor ${k}.` },
          { t: m(`${k}(${poly([[1, 2], [p + q, 1], [p * q, 0]])})`), why: '"Fully" factorise means the bracket must be factorised too.' },
          { t: m(`(${k}x${sc(p)})(${k}x${sc(q)})`), why: `That expands to ${m(poly([[k * k, 2], [k * (p + q), 1], [p * q, 0]]))}.` },
        ]));
      },
    ],
    tips: [
      'Take out a common factor first. "Fully factorise" means nothing more will come out.',
      'Expand your answer to check it. If you get the question back, you are right.',
      `${m('(x+5)^2 = x^2 + 10x + 25')}. <span class="pen">Do not forget the middle term.</span>`,
      'Factorising is the key to quadratics, algebraic fractions and calculus questions. If it is shaky, fix it first.',
    ],
  });

  /* ================= 3. Algebraic fractions ================= */
  P.addUnit({
    id: 'alg-fractions', title: 'Algebraic fractions', mins: 9,
    blurb: 'Factorise, cancel, combine. Examiners flagged fractions as a weak spot in 2025.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>Factorise first, then cancel.</h2>'), C(3, '<p>You can only cancel factors: whole brackets or numbers that multiply the whole top and bottom.</p>'), C(8, `<p>The 2025 examiners said weak algebra, especially with fractions, held students back on all three papers.</p>`)],
        board: [B(0.5, T`\dfrac{x^2 - 9}{x + 3}`, '', { big: true }), B(3.5, T`= \dfrac{(x-3)(x+3)}{x+3}`, 'factorise'), B(6.5, 'x - 3', 'cancel the bracket', { hl: true })] },
      { dur: 10, card: [C(0, '<h2>The two illegal cancels.</h2>'), C(2.5, '<p>A plus sign glues terms together. You cannot cancel part of a sum.</p>'), C(7, '<p>If in doubt, test with a number. Put x = 2 in both sides.</p>')],
        board: [B(0.5, T`\dfrac{x^2 + 5}{x} = x + 5`, 'illegal', { wrong: true }), B(3.5, T`\dfrac{x + 6}{3} = x + 2`, 'illegal', { wrong: true }), B(6.5, T`\dfrac{x + 6}{3} = \dfrac{x}{3} + 2`, 'fine', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Adding: get a common denominator.</h2>'), C(3, '<p>Multiply each top by whatever its bottom is missing.</p>'), C(8, '<p>Then add the tops and tidy.</p>')],
        board: [B(0.5, T`\dfrac{2}{x} + \dfrac{3}{x+1}`, '', { big: true }), B(3.5, T`= \dfrac{2(x+1) + 3x}{x(x+1)}`, 'common bottom'), B(7, T`= \dfrac{5x + 2}{x(x+1)}`, '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>Equations with fractions: clear them.</h2>'), C(3, '<p>Multiply every term by the lowest common denominator. The fractions vanish.</p>')],
        board: [B(0.5, T`\dfrac{x}{3} + \dfrac{x}{4} = 14`, '', { big: true }), B(3.5, '4x + 3x = 168', 'times by 12'), B(6.5, '7x = 168'), B(8.5, 'x = 24', 'check: 8 + 6 = 14', { hl: true })] },
    ],
    example: {
      problem: `Simplify ${m(T`\dfrac{x^2 + x - 6}{x^2 - 4}`)}`,
      steps: [
        { m: 'Top: ' + m('x^2 + x - 6 = (x+3)(x-2)'), note: 'factorise top' },
        { m: 'Bottom: ' + m('x^2 - 4 = (x-2)(x+2)'), note: 'square minus square' },
        { m: m(T`\dfrac{(x+3)(x-2)}{(x-2)(x+2)}`) },
        { m: m(T`= \dfrac{x+3}{x+2}`), note: 'cancel (x − 2)' },
      ],
    },
    faded() {
      let p, q; do { p = R.nz(-7, 7); q = R.nz(-7, 7); } while (p === q || p + q === 0);
      const top = poly([[1, 2], [p + q, 1], [p * q, 0]]);
      return {
        kind: 'num', answer: q, answerTex: `x${sc(q)}`,
        prompt: `Simplify ${m(T`\dfrac{${top}}{x${sc(p)}}`)}. The answer is ${m('x + k')}. What is ${m('k')}?`,
        fmt: 'Enter the number k, for example -4',
        scaffold: [`Factorise the top: ${m(`${top} = (x${sc(p)})(x${sc(q)})`)}`, m(T`\dfrac{(x${sc(p)})(x${sc(q)})}{x${sc(p)}}`)],
        hint: 'Cancel the bracket that is on the top and the bottom.',
        wrong: [{ v: p, msg: `You kept the bracket that cancels. ${m(`(x${sc(p)})`)} is on top and bottom, so it goes.` }, { v: -q, msg: 'Check the sign.' }],
        sol: ['Cancel ' + m(`(x${sc(p)})`) + ' from top and bottom', 'Answer: ' + m(`x${sc(q)}`)],
      };
    },
    gens: [
      () => {
        let p, q; do { p = R.nz(-7, 7); q = R.nz(-7, 7); } while (p === q || p + q === 0);
        const top = poly([[1, 2], [p + q, 1], [p * q, 0]]);
        return P.mcq({ prompt: `Simplify ${m(T`\dfrac{${top}}{x${sc(p)}}`)}`, sol: [m(T`\dfrac{(x${sc(p)})(x${sc(q)})}{x${sc(p)}}`), m(`= x${sc(q)}`)] }, P.uniq([
          { t: m(`x${sc(q)}`), ok: true },
          { t: m(`x${sc(p)}`), why: `That is the bracket that cancels. Factorise the top: ${m(`(x${sc(p)})(x${sc(q)})`)}.` },
          { t: m(`x${sc(-q)}`), why: 'Check the sign by expanding ' + m(`(x${sc(p)})(x${sc(-q)})`) + '.' },
          { t: m(poly([[1, 1], [p + q - 1, 0]])), why: 'You cannot cancel part of a sum. Factorise the top first.' },
        ]));
      },
      () => {
        let k, q; do { k = R.int(1, 7); q = R.nz(-7, 7); } while (q === k || q === -k);
        const top = `x^2 - ${k * k}`, bot = poly([[1, 2], [q - k, 1], [-k * q, 0]]);
        return P.mcq({ prompt: `Simplify ${m(T`\dfrac{${top}}{${bot}}`)}`, sol: ['Top: ' + m(`${top} = (x-${k})(x+${k})`), 'Bottom: ' + m(`${bot} = (x-${k})(x${sc(q)})`), 'Cancel ' + m(`(x-${k})`) + ': ' + m(T`\dfrac{x+${k}}{x${sc(q)}}`)] }, P.uniq([
          { t: m(T`\dfrac{x+${k}}{x${sc(q)}}`), ok: true },
          { t: m(T`\dfrac{x-${k}}{x${sc(q)}}`), why: `${m(`(x-${k})`)} is the bracket on both top and bottom, so that is the one that cancels.` },
          { t: m(T`\dfrac{x+${k}}{x${sc(-q)}}`), why: 'Check the sign in the bottom bracket by expanding.' },
          { t: m(T`\dfrac{-${k * k}}{${poly([[q - k, 1], [-k * q, 0]])}}`), why: `You cannot cancel ${m('x^2')} from a sum. Factorise first.` },
        ]));
      },
      () => {
        const a = R.int(1, 5), b = R.int(1, 5), c = R.int(1, 4);
        const top = poly([[a + b, 1], [a * c, 0]]);
        return P.mcq({ prompt: `Write as a single fraction: ${m(T`\dfrac{${a}}{x} + \dfrac{${b}}{x + ${c}}`)}`, sol: ['Common denominator: ' + m(`x(x+${c})`), m(T`\dfrac{${a}(x+${c}) + ${b}x}{x(x+${c})}`), m(T`= \dfrac{${top}}{x(x+${c})}`)] }, P.uniq([
          { t: m(T`\dfrac{${top}}{x(x+${c})}`), ok: true },
          { t: m(T`\dfrac{${a + b}}{2x + ${c}}`), why: 'You cannot add the tops and add the bottoms. Use a common denominator.' },
          { t: m(T`\dfrac{${a + b}}{x(x+${c})}`), why: `Each top must be multiplied by what its bottom is missing: ${m(`${a}(x+${c})`)} and ${m(`${b}x`)}.` },
          { t: m(T`\dfrac{${poly([[a + b, 1], [a, 0]])}}{x(x+${c})}`), why: `Multiply out fully: ${m(`${a}(x+${c}) = ${a}x + ${a * c}`)}.` },
        ]));
      },
      () => {
        const [a, b] = R.pick([[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [2, 6], [5, 10]]);
        const L = (a * b) / P.gcd(a, b), t = R.int(1, 6), x = L * t, k = x / a + x / b;
        return {
          kind: 'num', answer: x, prompt: `Solve ${m(T`\dfrac{x}{${a}} + \dfrac{x}{${b}} = ${nf(k)}`)}`,
          sol: [`Multiply every term by ${L}: ${m(`${L / a}x + ${L / b}x = ${nf(k * L)}`)}`, m(`${L / a + L / b}x = ${nf(k * L)}`), m(`x = ${x}`)],
          hint: `Multiply every term by ${L} to clear the fractions.`,
        };
      },
      () => {
        let b, d; do { b = R.int(2, 6); d = R.int(2, 6); } while (b === d);
        const x = R.int(-6, 9), t = R.nz(-4, 4); const a = b * t - x, c = x - d * t;
        // (x + a)/b = (x - c)/d
        return {
          kind: 'num', answer: x, prompt: `Solve ${m(T`\dfrac{x ${a < 0 ? '-' : '+'} ${Math.abs(a)}}{${b}} = \dfrac{x ${c < 0 ? '+' : '-'} ${Math.abs(c)}}{${d}}`)}`,
          sol: ['Cross-multiply: ' + m(`${d}(x${sc(a)}) = ${b}(x${sc(-c)})`), m(`${d}x${sc(d * a)} = ${b}x${sc(-b * c)}`), m(`${d - b}x = ${-b * c - d * a}`), m(`x = ${x}`)],
          hint: 'Cross-multiply, then expand the brackets.',
        };
      },
    ],
    tips: [
      '<span class="pen">Factorise before you cancel.</span> Only whole brackets or whole factors cancel.',
      'For adding fractions, multiply each top by what its bottom is missing. Never add bottoms together.',
      'In an equation, multiply every single term by the common denominator, including terms with no fraction.',
      'Test with a number. If your simplified answer and the original give different values for x = 2, something went wrong.',
    ],
  });

  /* ================= 4. Rearranging formulas ================= */
  P.addUnit({
    id: 'rearranging', title: 'Rearranging and forming equations', mins: 8,
    blurb: 'Change the subject of a formula, and turn words into an equation you can solve.',
    scenes: [
      { dur: 11, card: [C(0, '<h2>Undo it in reverse order.</h2>'), C(3, `<p>To make ${m('t')} the subject, peel off what was done to it, last thing first.</p>`)],
        board: [B(0.5, 'v = u + at', '', { big: true }), B(3, 'v - u = at', 'undo + u'), B(6, T`t = \dfrac{v - u}{a}`, 'undo × a', { hl: true })] },
      { dur: 10, card: [C(0, '<h2>Squares come off last.</h2>'), C(3, `<p>Get ${m('r^2')} on its own first, then square root both sides.</p>`)],
        board: [B(0.5, T`A = \pi r^2`, '', { big: true }), B(3, T`r^2 = \dfrac{A}{\pi}`, 'divide by π'), B(6, T`r = \sqrt{\dfrac{A}{\pi}}`, 'root last', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>The Excellence trick: the subject appears twice.</h2>'), C(3, '<p>Collect every term with x on one side. Then take x out as a common factor.</p>')],
        board: [B(0.5, T`y = \dfrac{x + 2}{x}`, '', { big: true }), B(3, 'xy = x + 2', 'times by x'), B(5.5, 'xy - x = 2', 'x terms together'), B(8, 'x(y - 1) = 2', 'factorise'), B(10.5, T`x = \dfrac{2}{y - 1}`, '', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>Words to equations.</h2>'), C(2, '<p>Name the unknown, write what the words say, then solve.</p>'), C(7, '<p>Finish with a sentence that answers the question.</p>')],
        board: [B(0.5, null, '', { html: '<p>A rectangle is 3 cm longer than it is wide. Its perimeter is 46 cm.</p>' }), B(3, 'w + (w + 3) + w + (w + 3) = 46', 'w = width'), B(6, '4w + 6 = 46'), B(8, T`w = 10 \text{ cm}`, '', { hl: true })] },
    ],
    example: {
      problem: `Make ${m('r')} the subject of ${m(T`V = \tfrac{1}{3}\pi r^2 h`)}`,
      steps: [
        { m: m(T`3V = \pi r^2 h`), note: 'times by 3' },
        { m: m(T`r^2 = \dfrac{3V}{\pi h}`), note: 'divide by πh' },
        { m: m(T`r = \sqrt{\dfrac{3V}{\pi h}}`), note: 'root last' },
      ],
    },
    faded() {
      const u = R.int(2, 12), a = R.int(2, 6), t = R.int(2, 9), v = u + a * t;
      return {
        kind: 'num', answer: t, prompt: `Using ${m('v = u + at')}, find ${m('t')} when ${m(`v = ${v}`)}, ${m(`u = ${u}`)} and ${m(`a = ${a}`)}.`,
        scaffold: ['Rearrange first: ' + m('v - u = at'), m(T`t = \dfrac{v - u}{a}`)],
        wrong: [{ v: (v + u) / a, msg: 'Subtract u from v, do not add it.' }, { v: v - u * a, msg: 'Subtract u first, then divide by a.' }],
        sol: [m(T`t = \dfrac{${v} - ${u}}{${a}} = \dfrac{${v - u}}{${a}} = ${t}`)],
      };
    },
    gens: [
      () => {
        const a = R.int(2, 7), b = R.nz(-9, 9), c = R.int(2, 5);
        return P.mcq({ prompt: `Make ${m('x')} the subject of ${m(T`y = \dfrac{${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}}{${c}}`)}`, sol: [m(`${c}y = ${a}x${sc(b)}`), m(`${c}y${sc(-b)} = ${a}x`), m(T`x = \dfrac{${c}y${sc(-b)}}{${a}}`)] }, P.uniq([
          { t: m(T`x = \dfrac{${c}y${sc(-b)}}{${a}}`), ok: true },
          { t: m(T`x = \dfrac{${c}y${sc(b)}}{${a}}`), why: `To undo ${m(sc(b).trim())}, do the opposite.` },
          { t: m(T`x = \dfrac{y${sc(-b)}}{${a * c}}`), why: `Multiply both sides by ${c} first. Do not divide.` },
          { t: m(T`x = ${c}y${sc(-b)} - ${a}`), why: `${m('x')} is multiplied by ${a}, so divide by ${a}. Do not subtract it.` },
        ]));
      },
      () => {
        const k = R.pick([['\\pi', 'π'], ['4', '4'], ['2g', '2g'], ['k', 'k']])[0];
        return P.mcq({ prompt: `Make ${m('r')} the subject of ${m(`A = ${k} r^2`)}, where ${m('r > 0')}.`, sol: [m(T`r^2 = \dfrac{A}{${k}}`), m(T`r = \sqrt{\dfrac{A}{${k}}}`)] }, P.uniq([
          { t: m(T`r = \sqrt{\dfrac{A}{${k}}}`), ok: true },
          { t: m(T`r = \dfrac{A}{2${k}}`), why: 'Halving does not undo a square. Take the square root.' },
          { t: m(T`r = \dfrac{\sqrt{A}}{${k}}`), why: `Divide by ${m(k)} first, then square root everything.` },
          { t: m(T`r = \left(\dfrac{A}{${k}}\right)^2`), why: 'Squaring undoes a square root, not a square. Take the square root.' },
        ]));
      },
      () => {
        const u = R.int(0, 8), a = R.int(2, 6), s = R.int(5, 40), v2 = u * u + 2 * a * s, v = Math.sqrt(v2);
        return {
          kind: 'num', answer: v, dp: 2, prompt: `Using ${m('v^2 = u^2 + 2as')}, find ${m('v')} when ${m(`u = ${u}`)}, ${m(`a = ${a}`)} and ${m(`s = ${s}`)}. Take ${m('v > 0')}.`,
          wrong: [{ v: v2, msg: `That is ${m('v^2')}. Square root it to get ${m('v')}.` }, { v: u + 2 * a * s, msg: `Square u first: ${m(`${u}^2 = ${u * u}`)}.` }],
          sol: [m(`v^2 = ${u}^2 + 2 \\times ${a} \\times ${s} = ${v2}`), m(T`v = \sqrt{${v2}} = ${P.f(v, 2)}`)],
        };
      },
      () => {
        const a = R.int(1, 6), b = R.int(1, 5);
        return P.mcq({ prompt: `Make ${m('x')} the subject of ${m(T`y = \dfrac{x + ${a}}{x - ${b}}`)}`, sol: [m(`y(x - ${b}) = x + ${a}`), m(`xy - ${b}y = x + ${a}`), m(`xy - x = ${a} + ${b}y`) + ' (x terms on one side)', m(`x(y - 1) = ${a} + ${b}y`) + ' (factorise)', m(T`x = \dfrac{${a} + ${b}y}{y - 1}`)] }, P.uniq([
          { t: m(T`x = \dfrac{${a} + ${b}y}{y - 1}`), ok: true },
          { t: m(T`x = \dfrac{${a} - ${b}y}{y - 1}`), why: `Check the sign when you move ${m(`-${b}y`)} across.` },
          { t: m(T`x = \dfrac{${a} + ${b}y}{1 - y}`), why: 'Collect x terms on the same side you started: ' + m('xy - x') + '.' },
          { t: m(T`x = y(x - ${b}) - ${a}`), why: 'x is still on both sides. Collect the x terms and factorise.' },
        ]));
      },
      () => {
        const d = R.int(2, 9), w = R.int(4, 20), Pm = 2 * (w + w + d);
        return {
          kind: 'num', answer: w, prompt: `A rectangle is ${d} cm longer than it is wide. Its perimeter is ${Pm} cm. Find its width in cm.`,
          wrong: [{ v: w + d, msg: 'That is the length. The question asks for the width.' }, { v: (Pm - d) / 2, msg: 'There are two lengths and two widths in a perimeter.' }],
          sol: ['Let the width be ' + m('w') + '. Length is ' + m(`w + ${d}`) + '.', m(`2w + 2(w + ${d}) = ${Pm}`), m(`4w + ${2 * d} = ${Pm}`), m(`w = ${w}`) + ' cm'],
        };
      },
    ],
    tips: [
      'Write each step on a new line. Each line is evidence of method.',
      'Square roots come last. Get the squared thing on its own first.',
      'If the subject appears twice, collect those terms on one side and factorise it out. This is a common Excellence step.',
      'In word problems, say what your letter means ("let w be the width in cm") and finish with a sentence that answers the question.',
    ],
  });

  /* ================= 5. Solving quadratics ================= */
  P.addUnit({
    id: 'quadratics', title: 'Solving quadratic equations', mins: 10,
    blurb: 'Factorise or use the formula. Always two answers to look for.',
    scenes: [
      { dur: 10, card: [C(0, '<h2>Solving means: where does the curve cross zero?</h2>'), C(4, `<p>${m('x^2 - 2x - 3 = 0')} has two solutions because the parabola cuts the x-axis twice.</p>`)],
        draw(a) {
          const v = a.view(-3, 5, -5, 6); a.axes(v);
          const f = (x) => x * x - 2 * x - 3; a.plot(v, f, a.C.c1, 3.5, a.seg(a.p, 0, 0.5));
          const al = a.seg(a.p, 0.55, 0.7); a.dot(v, -1, 0, a.C.pen, 7, al); a.dot(v, 3, 0, a.C.pen, 7, al);
          a.text('x = −1', v.X(-1) - 14, v.Y(0) + 26, { align: 'right', font: 'pen', col: a.C.pen, alpha: al }); a.text('x = 3', v.X(3) + 14, v.Y(0) + 26, { font: 'pen', col: a.C.pen, alpha: al });
          a.text('y = x² − 2x − 3', v.X(-2.8), v.Y(5.4), { col: a.C.c1, alpha: a.seg(a.p, 0.3, 0.5), bg: a.C.sheet });
        } },
      { dur: 12, card: [C(0, '<h2>Factorise, then each bracket equals zero.</h2>'), C(4, '<p>If two things multiply to zero, one of them must be zero.</p>')],
        board: [B(0.5, 'x^2 - 2x - 3 = 0', '', { big: true }), B(2.5, '(x - 3)(x + 1) = 0'), B(5, T`x - 3 = 0 \;\text{ or }\; x + 1 = 0`, 'either can be zero'), B(8, T`x = 3 \;\text{ or }\; x = -1`, '', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>Never divide by x.</h2>'), C(3, '<p>You throw away the answer x = 0. Make it equal zero and factorise instead.</p>')],
        board: [B(0.5, 'x^2 = 5x', '', { big: true }), B(2.2, 'x = 5', 'lost one!', { wrong: true }), B(4.8, 'x^2 - 5x = 0'), B(6.6, 'x(x - 5) = 0'), B(8.4, T`x = 0 \;\text{ or }\; x = 5`, '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Won\'t factorise? Use the formula.</h2>'), C(3, `<p>Your formula sheet has it. Write the substitution out in full, with brackets around negatives.</p>`), C(9, '<p>Round at the end, not in the middle.</p>')],
        board: [B(0.5, T`x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}`, '', { big: true }), B(3.5, T`2x^2 + 3x - 4 = 0: \quad x = \dfrac{-3 \pm \sqrt{3^2 - 4(2)(-4)}}{2(2)}`), B(7, T`= \dfrac{-3 \pm \sqrt{41}}{4}`), B(9.5, T`x = 0.85 \;\text{ or }\; x = -2.35`, '', { hl: true })] },
      { dur: 10, card: [C(0, '<h2>Backwards: from solutions to an equation.</h2>'), C(3, '<p>A favourite Achieved question. Flip the signs into brackets, then expand.</p>')],
        board: [B(0.5, T`\text{Solutions } x = 2 \text{ and } x = -5`), B(3, '(x - 2)(x + 5) = 0', 'flip the signs'), B(6, 'x^2 + 3x - 10 = 0', '', { hl: true })] },
    ],
    example: {
      problem: `A rectangle has length ${m('(x + 4)')} cm and width ${m('x')} cm. Its area is 45 cm². Find the width.`,
      steps: [
        { m: m('x(x + 4) = 45'), note: 'area = length × width' },
        { m: m('x^2 + 4x - 45 = 0'), note: 'make it = 0' },
        { m: m('(x + 9)(x - 5) = 0') },
        { m: m(T`x = -9 \;\text{ or }\; x = 5`) },
        { m: 'A width cannot be negative, so the width is ' + m('5') + ' cm.', note: 'answer in context' },
      ],
    },
    faded() {
      let p, q; do { p = R.nz(-8, 8); q = R.nz(-8, 8); } while (p === q);
      const ex = poly([[1, 2], [-(p + q), 1], [p * q, 0]]);
      return {
        kind: 'multi', answer: [p, q], prompt: `Solve ${m(ex + ' = 0')}`,
        scaffold: [m(`(x${sc(-p)})(x${sc(-q)}) = 0`) + ' (factorised)'],
        hint: 'Set each bracket equal to zero.',
        wrong: [{ v: [-p, -q], msg: `If ${m(`x${sc(-p)} = 0`)} then ${m(`x = ${p}`)}. Flip the sign.` }],
        sol: [m(`x${sc(-p)} = 0 \\Rightarrow x = ${p}`), m(`x${sc(-q)} = 0 \\Rightarrow x = ${q}`)],
      };
    },
    gens: [
      () => {
        let p, q; do { p = R.nz(-9, 9); q = R.nz(-9, 9); } while (p === q);
        const ex = poly([[1, 2], [-(p + q), 1], [p * q, 0]]);
        return { kind: 'multi', answer: [p, q], prompt: `Solve ${m(ex + ' = 0')}`, wrong: [{ v: [-p, -q], msg: 'Your signs are flipped. If (x − 3) = 0 then x = 3.' }], sol: [m(`(x${sc(-p)})(x${sc(-q)}) = 0`), m(`x = ${p} \\text{ or } x = ${q}`)] };
      },
      () => {
        let a, b, c, D; do { a = R.int(1, 3); b = R.nz(-7, 7); c = R.nz(-9, 9); D = b * b - 4 * a * c; } while (D <= 0 || Number.isInteger(Math.sqrt(D)));
        const r1 = (-b + Math.sqrt(D)) / (2 * a), r2 = (-b - Math.sqrt(D)) / (2 * a), ex = poly([[a, 2], [b, 1], [c, 0]]);
        return { kind: 'multi', answer: [r1, r2], dp: 2, tol: 0.006, prompt: `Solve ${m(ex + ' = 0')}. Give your answers to 2 decimal places.`,
          sol: [m(T`x = \dfrac{-(${b}) \pm \sqrt{(${b})^2 - 4(${a})(${c})}}{2(${a})}`), m(T`= \dfrac{${-b} \pm \sqrt{${D}}}{${2 * a}}`), m(`x = ${P.f(r1, 2)} \\text{ or } x = ${P.f(r2, 2)}`)],
          wrong: [{ v: [(b + Math.sqrt(D)) / (2 * a), (b - Math.sqrt(D)) / (2 * a)], msg: 'The formula starts with ' + m('-b') + '. Check the sign.' }] };
      },
      () => {
        const k = R.nz(-9, 9);
        return { kind: 'multi', answer: [0, k], prompt: `Solve ${m(`x^2 = ${k}x`)}`, sol: [m(`x^2 ${k < 0 ? '+' : '-'} ${Math.abs(k)}x = 0`), m(`x(x${sc(-k)}) = 0`), m(`x = 0 \\text{ or } x = ${k}`)], hint: 'Do not divide by x. Move everything to one side and factorise.' };
      },
      () => {
        let p, q; do { p = R.nz(-7, 7); q = R.nz(-7, 7); } while (p === q);
        return { kind: 'multi', ordered: true, answer: [-(p + q), p * q], answerTex: poly([[1, 2], [-(p + q), 1], [p * q, 0]]) + ' = 0',
          prompt: `A quadratic ${m('x^2 + bx + c = 0')} has solutions ${m(`x = ${p}`)} and ${m(`x = ${q}`)}. Find ${m('b')} and ${m('c')}.`, fmt: 'Enter b, then c. For example: -3, 2',
          wrong: [{ v: [p + q, p * q], msg: `Flip the signs into the brackets: ${m(`(x${sc(-p)})(x${sc(-q)})`)}.` }],
          sol: [m(`(x${sc(-p)})(x${sc(-q)}) = 0`), m(poly([[1, 2], [-(p + q), 1], [p * q, 0]]) + ' = 0'), m(`b = ${-(p + q)}, \\ c = ${p * q}`)] };
      },
      () => {
        const d = R.int(1, 6), w = R.int(2, 12), A = w * (w + d);
        return { kind: 'num', answer: w, prompt: `A rectangle is ${m(`(x + ${d})`)} cm long and ${m('x')} cm wide. Its area is ${A} cm². Find ${m('x')}.`,
          wrong: [{ v: -(w + d), msg: 'A length cannot be negative. Reject that solution.' }],
          sol: [m(`x(x + ${d}) = ${A}`), m(`${poly([[1, 2], [d, 1], [-A, 0]])} = 0`), m(`(x - ${w})(x + ${w + d}) = 0`), m(`x = ${w}`) + ' (reject ' + m(`-${w + d}`) + ', a width cannot be negative)'] };
      },
    ],
    tips: [
      'Get everything on one side so it equals zero before you factorise.',
      'Two solutions is normal. In a context, say which one you reject and why. <span class="pen">"Width can\'t be negative"</span> earns credit.',
      'Formula: write the substitution with brackets around negatives, ' + m('(-3)^2') + ' not ' + m('-3^2') + '.',
      'Use your calculator to check: substitute each answer back in and you should get 0.',
    ],
  });

  /* ================= 6. The discriminant ================= */
  P.addUnit({
    id: 'discriminant', title: 'The discriminant', mins: 8,
    blurb: 'One quick calculation tells you how many solutions there are.',
    scenes: [
      { dur: 14, card: [C(0, `<h2>${m('b^2 - 4ac')} counts the solutions.</h2>`), C(3, '<p>Watch the curve rise. The discriminant falls, and the crossings disappear.</p>'), C(9, '<p>Positive: two. Zero: one. Negative: none.</p>')],
        draw(a) {
          const v = a.view(-2, 4, -4, 6); a.axes(v);
          const k = -3 + 6 * a.seg(a.p, 0.08, 0.85); const f = (x) => x * x - 2 * x + k; a.plot(v, f, a.C.c1);
          const D = 4 - 4 * k; const label = D > 0.05 ? 'two real roots' : D > -0.05 ? 'one repeated root' : 'no real roots';
          if (D >= 0) { const r = Math.sqrt(Math.max(0, D)) / 2; a.dot(v, 1 - r, 0, a.C.pen); a.dot(v, 1 + r, 0, a.C.pen); }
          a.text(`b² − 4ac = ${P.n(D, 1).replace('-', '−')}`, a.W - 20, 30, { align: 'right', size: 1.1, bg: a.C.sheet });
          a.text(label, a.W - 20, 64, { align: 'right', font: 'pen', col: a.C.pen });
          a.text(`y = x² − 2x ${k < 0 ? '−' : '+'} ${P.n(Math.abs(k), 1)}`, 20, 30, { col: a.C.c1, bg: a.C.sheet });
        } },
      { dur: 11, card: [C(0, '<h2>The three cases.</h2>'), C(6, '<p>"Equal roots" and "one repeated root" mean the same thing: discriminant equals zero.</p>')],
        board: [B(0.5, 'b^2 - 4ac > 0', 'two real roots'), B(2.5, 'b^2 - 4ac = 0', 'one repeated root'), B(4.5, 'b^2 - 4ac < 0', 'no real roots')] },
      { dur: 12, card: [C(0, '<h2>The classic question: find k.</h2>'), C(3, '<p>Set the discriminant to what the question says, then solve for k.</p>'), C(8, '<p>Two answers here. Missing the negative one costs the mark.</p>')],
        board: [B(0.5, T`x^2 + kx + 9 = 0 \text{ has equal roots}`), B(3, 'k^2 - 4(1)(9) = 0', 'Δ = 0'), B(5.5, 'k^2 = 36'), B(7.5, T`k = \pm 6`, 'both!', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>The Excellence link: a line touching a curve.</h2>'), C(3, '<p>Substitute the line into the curve. If they touch at one point, the resulting quadratic has discriminant zero.</p>')],
        board: [B(0.5, T`y = x^2 + 1,\ \ y = mx`), B(3, 'x^2 - mx + 1 = 0'), B(5.5, 'm^2 - 4 = 0', 'touches: Δ = 0'), B(8, T`m = \pm 2`, '', { hl: true })] },
    ],
    example: {
      problem: `For what values of ${m('k')} does ${m('kx^2 + 4x + 1 = 0')} have two distinct real roots?`,
      steps: [
        { m: m('a = k, \\ b = 4, \\ c = 1'), note: 'name a, b, c' },
        { m: m('b^2 - 4ac > 0'), note: 'two roots: > 0' },
        { m: m('16 - 4k > 0') },
        { m: m('k < 4') + ' (and ' + m('k \\neq 0') + ', or it is not a quadratic)', note: 'Excellence detail' },
      ],
    },
    faded() {
      const mm = R.int(2, 8), c = mm * mm;
      return { kind: 'multi', answer: [2 * mm, -2 * mm], prompt: `${m(`x^2 + kx + ${c} = 0`)} has equal roots. Find the possible values of ${m('k')}.`,
        scaffold: ['Equal roots, so ' + m('b^2 - 4ac = 0'), m(`k^2 - 4(1)(${c}) = 0`), m(`k^2 = ${4 * c}`)],
        wrong: [{ v: [2 * mm], msg: 'A square root has a positive and a negative answer.' }],
        hint: 'Square root both sides. There are two answers.',
        sol: [m(T`k = \pm\sqrt{${4 * c}} = \pm ${2 * mm}`)] };
    },
    gens: [
      () => { const a = R.nz(-4, 5), b = R.nz(-9, 9), c = R.nz(-9, 9), D = b * b - 4 * a * c; const ex = poly([[a, 2], [b, 1], [c, 0]]);
        return { kind: 'num', answer: D, prompt: `Find the discriminant of ${m(ex + ' = 0')}.`, wrong: [{ v: -b * b - 4 * a * c, msg: m(`(${b})^2`) + ' is positive.' }, { v: b * b + 4 * a * c, msg: 'Check the sign of ' + m('4ac') + '.' }], sol: [m(`b^2 - 4ac = (${b})^2 - 4(${a})(${c})`), m(`= ${b * b} ${-4 * a * c < 0 ? '-' : '+'} ${Math.abs(4 * a * c)} = ${D}`)] }; },
      () => {
        const type = R.pick([0, 1, 2]); let a, b, c, D;
        do { a = R.int(1, 4); b = R.nz(-9, 9); c = type === 1 ? (b * b) / (4 * a) : R.nz(-9, 9); D = b * b - 4 * a * c; } while (!Number.isInteger(c) || (type === 0 && D <= 0) || (type === 2 && D >= 0) || (type === 1 && D !== 0));
        const ex = poly([[a, 2], [b, 1], [c, 0]]);
        const opts = [{ t: 'Two different real roots', ok: D > 0 }, { t: 'One repeated real root', ok: D === 0 }, { t: 'No real roots', ok: D < 0 }];
        opts.forEach((o) => { if (!o.ok) o.why = `The discriminant is ${m(`(${b})^2 - 4(${a})(${c}) = ${D}`)}, which is ${D > 0 ? 'positive' : D < 0 ? 'negative' : 'zero'}.`; });
        return P.mcq({ prompt: `Describe the roots of ${m(ex + ' = 0')}.`, sol: [m(`b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${D}`), D > 0 ? 'Positive, so two different real roots.' : D === 0 ? 'Zero, so one repeated root.' : 'Negative, so no real roots.'] }, opts);
      },
      () => { const a = R.pick([1, 4, 9]), mm = R.int(1, 5), c = mm * mm, k = 2 * Math.sqrt(a) * mm;
        return { kind: 'multi', answer: [k, -k], prompt: `${m(`${a === 1 ? '' : a}x^2 + kx + ${c} = 0`)} has exactly one solution. Find the possible values of ${m('k')}.`, wrong: [{ v: [k], msg: 'There are two values: positive and negative.' }], sol: [m(`k^2 - 4(${a})(${c}) = 0`), m(`k^2 = ${4 * a * c}`), m(T`k = \pm ${k}`)] }; },
      () => { const b = R.pick([2, 4, 6, 8, 10, 12]), c = R.int(1, 5), k = (b * b) / (4 * c);
        return { kind: 'num', answer: k, answerTex: nf(k), prompt: `${m(`kx^2 + ${b}x + ${c} = 0`)} has equal roots. Find ${m('k')}.`, sol: [m(`${b}^2 - 4(k)(${c}) = 0`), m(`${b * b} = ${4 * c}k`), m(`k = ${nf(k)}`)] }; },
      () => { const b = R.pick([2, 4, 6, 8, 10]), v = (b * b) / 4; const s = R.pick([1, -1]);
        return P.mcq({ prompt: `For which values of ${m('k')} does ${m(`x^2 ${s > 0 ? '+' : '-'} ${b}x + k = 0`)} have no real roots?`, sol: [m(`b^2 - 4ac < 0`), m(`${b * b} - 4k < 0`), m(`k > ${v}`)] }, [
          { t: m(`k > ${v}`), ok: true }, { t: m(`k < ${v}`), why: `${m(`${b * b} - 4k < 0`)} rearranges to ${m(`4k > ${b * b}`)}.` }, { t: m(`k = ${v}`), why: 'That gives a discriminant of zero: one repeated root.' }, { t: m(`k > ${-v}`), why: m(`${b * b}`) + ' is positive whatever the sign of b.' }]);
      },
    ],
    tips: [
      'Write ' + m('a = ..., b = ..., c = ...') + ' before you substitute. It stops sign errors.',
      'Square roots give two answers: ' + m(T`k^2 = 36 \Rightarrow k = \pm 6`) + '.',
      'Use the exact words: "two distinct real roots", "one repeated root", "no real roots".',
      'Excellence questions often hide the discriminant inside a context, like a line just touching a curve. Substitute, rearrange to = 0, then use ' + m('b^2 - 4ac = 0') + '.',
    ],
  });

  /* ================= 7. Logs and exponential equations ================= */
  P.addUnit({
    id: 'logs', title: 'Logs and exponential equations', mins: 10,
    blurb: 'A log is just a power. Use it to get x down from the exponent.',
    scenes: [
      { dur: 10, card: [C(0, '<h2>A log answers one question: what power?</h2>'), C(3.5, `<p>${m(T`\log_2 8`)} asks: what power of 2 gives 8? Answer: 3.</p>`)],
        board: [B(0.5, '2^3 = 8', '', { big: true }), B(3, T`\log_2 8 = 3`, 'same fact', { big: true, hl: true }), B(6.5, T`\log_{10} 1000 = 3, \quad \log_3 \tfrac{1}{9} = -2`)] },
      { dur: 11, card: [C(0, '<h2>Three log laws.</h2>'), C(5, '<p>The third one is the hero. It brings a power down to the ground.</p>')],
        board: [B(0.5, T`\log(ab) = \log a + \log b`), B(2, T`\log\left(\tfrac{a}{b}\right) = \log a - \log b`), B(3.5, T`\log(a^n) = n\log a`, 'the useful one', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Solve when x is a power.</h2>'), C(3, '<p>Take log of both sides. The power comes down. Divide.</p>'), C(9, '<p>Your calculator does the last line. Use the log or ln button.</p>')],
        board: [B(0.5, '3^x = 50', '', { big: true }), B(2.5, T`\log 3^x = \log 50`, 'log both sides'), B(5, T`x \log 3 = \log 50`, 'power comes down'), B(7.5, T`x = \dfrac{\log 50}{\log 3} = 3.561`, '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>In context: growth.</h2>'), C(3, `<p>${P.money(200)} grows 5% a year: ${m('A = 200 \\times 1.05^t')}. When does it double?</p>`), C(8, `<p>${m('1.05^t = 2')}, so ${m(T`t = \frac{\log 2}{\log 1.05} = 14.2`)} years.</p>`)],
        draw(a) {
          const v = a.view(0, 22, 0, 600, a.fs * 3); a.axes(v, { step: 2, ystep: 100, lstep: 4, lystep: 200 });
          const f = (t) => 200 * 1.05 ** t; a.plot(v, f, a.C.c1, 3.5, a.seg(a.p, 0, 0.55));
          const al = a.seg(a.p, 0.5, 0.65); a.alpha(al, () => a.line(v.X(0), v.Y(400), v.X(22), v.Y(400), a.C.pen, 2, [6, 6]));
          const t0 = Math.log(2) / Math.log(1.05); const al2 = a.seg(a.p, 0.65, 0.8);
          a.alpha(al2, () => a.line(v.X(t0), v.Y(400), v.X(t0), v.Y(0), a.C.pen, 2, [6, 6])); a.dot(v, t0, 400, a.C.pen, 7, al2);
          a.text('t = 14.2 years', v.X(t0) + 10, v.Y(400) + 26, { font: 'pen', col: a.C.pen, alpha: al2 });
          a.text('$400', v.X(1), v.Y(400) - 16, { col: a.C.pen, alpha: al });
        } },
      { dur: 11, card: [C(0, '<h2>Log equations: rewrite as a power.</h2>'), C(3, `<p>${m(T`\log_b y = n`)} means ${m('y = b^n')}.</p>`)],
        board: [B(0.5, T`\log_2(x + 1) = 5`, '', { big: true }), B(3, 'x + 1 = 2^5', 'undo the log'), B(5.5, 'x = 31', '', { hl: true })] },
    ],
    example: {
      problem: `Solve ${m('5 \\times 2^x = 120')}`,
      steps: [
        { m: m('2^x = 24'), note: 'get the power alone first' },
        { m: m(T`x \log 2 = \log 24`), note: 'log both sides' },
        { m: m(T`x = \dfrac{\log 24}{\log 2}`) },
        { m: m('x = 4.585') + ' (3 d.p.)' },
      ],
    },
    faded() {
      const a = R.pick([2, 3, 4, 5, 1.5, 1.08]), b = R.int(7, 90), x = Math.log(b) / Math.log(a);
      return { kind: 'num', answer: x, dp: 2, prompt: `Solve ${m(`${a}^x = ${b}`)}. Give ${m('x')} to 2 decimal places.`,
        scaffold: [m(T`\log ${a}^x = \log ${b}`), m(T`x \log ${a} = \log ${b}`)], hint: 'Divide both sides by log ' + a + '.',
        wrong: [{ v: Math.log(a) / Math.log(b), msg: 'Upside down. It is log ' + b + ' divided by log ' + a + '.' }, { v: b / a, msg: 'You cannot divide by the base. Use logs.' }],
        sol: [m(T`x = \dfrac{\log ${b}}{\log ${a}} = ${P.f(x, 2)}`)] };
    },
    gens: [
      () => { const [b, val, tex] = R.pick([[2, 5, '32'], [2, -3, '\\tfrac{1}{8}'], [3, 4, '81'], [3, -2, '\\tfrac{1}{9}'], [10, 3, '1000'], [10, -2, '0.01'], [5, 3, '125'], [9, 0.5, '3'], [4, 0.5, '2'], [8, 1 / 3, '2'], [2, 0.5, '\\sqrt{2}'], [7, 0, '1']]);
        return { kind: 'num', answer: val, answerTex: nf(val), prompt: `Evaluate ${m(`\\log_{${b}} ${tex}`)} without a calculator.`, sol: [`What power of ${b} gives ${m(tex)}?`, m(`${b}^{${nf(val)}} = ${tex}`), 'So the answer is ' + m(nf(val))] }; },
      () => { const a = R.pick([2, 3, 6, 1.2, 1.05, 0.8]), b = a < 1 ? R.pick([0.5, 0.3, 0.1]) : R.pick([5, 7, 10, 20, 30, 50, 75, 100, 150, 200].filter((v) => v !== a)), x = Math.log(b) / Math.log(a);
        return { kind: 'num', answer: x, dp: 2, prompt: `Solve ${m(`${a}^x = ${b}`)}. Give ${m('x')} to 2 decimal places.`, wrong: [{ v: Math.log(a) / Math.log(b), msg: 'Upside down: log ' + b + ' ÷ log ' + a + '.' }], sol: [m(T`x\log ${a} = \log ${b}`), m(T`x = \dfrac{\log ${b}}{\log ${a}} = ${P.f(x, 2)}`)] }; },
      () => { const b = R.pick([2, 3, 5, 10]), n = R.int(2, b === 10 ? 3 : 5), a = R.nz(-9, 9), x = b ** n - a;
        return { kind: 'num', answer: x, prompt: `Solve ${m(`\\log_{${b}}(x ${a < 0 ? '-' : '+'} ${Math.abs(a)}) = ${n}`)}`, wrong: [{ v: b * n - a, msg: `${m(`${b}^${n}`)} means ${Array(n).fill(b).join(' × ')}, not ${b} × ${n}.` }], sol: [m(`x${sc(a)} = ${b}^${n} = ${b ** n}`), m(`x = ${x}`)] }; },
      () => { const P0 = R.pick([2000, 5000, 8000, 12000]), r = R.pick([3, 4, 5, 6, 8]), mult = R.pick([1.5, 2, 2.5]), tgt = P0 * mult, t = Math.log(mult) / Math.log(1 + r / 100);
        return { kind: 'num', answer: t, dp: 2, prompt: `An investment of ${P.money(P0)} grows by ${r}% each year, so its value is ${m(`V = ${P0} \\times ${nf(1 + r / 100)}^t`)}. Find ${m('t')} when it reaches ${P.money(tgt)}. Give ${m('t')} to 2 decimal places.`,
          sol: [m(`${P0} \\times ${nf(1 + r / 100)}^t = ${tgt}`), m(`${nf(1 + r / 100)}^t = ${nf(mult)}`), m(T`t = \dfrac{\log ${nf(mult)}}{\log ${nf(1 + r / 100)}} = ${P.f(t, 2)}`), 'In context: it passes ' + P.money(tgt) + ' during year ' + Math.ceil(t) + '.'],
          wrong: [{ v: Math.log(tgt) / Math.log(1 + r / 100), msg: 'Divide both sides by ' + P0 + ' before taking logs.' }] }; },
      () => { const [b, x, y, n] = R.pick([[6, 4, 9, 2], [10, 25, 4, 2], [2, 4, 8, 5], [3, 3, 27, 4], [12, 8, 18, 2], [10, 5, 20, 2], [4, 2, 32, 3]]);
        return { kind: 'num', answer: n, prompt: `Evaluate ${m(`\\log_{${b}} ${x} + \\log_{${b}} ${y}`)} without a calculator.`, sol: [m(`\\log_{${b}} ${x} + \\log_{${b}} ${y} = \\log_{${b}} (${x} \\times ${y}) = \\log_{${b}} ${x * y}`), m(`${b}^{${n}} = ${x * y}`) + ', so the answer is ' + m(String(n))] }; },
      () => { const c = R.int(2, 9), a = R.pick([2, 3, 1.5]), d = c * R.int(5, 60), x = Math.log(d / c) / Math.log(a);
        return { kind: 'num', answer: x, dp: 2, prompt: `Solve ${m(`${c} \\times ${a}^x = ${d}`)}. Give ${m('x')} to 2 decimal places.`, wrong: [{ v: Math.log(d) / Math.log(c * a), msg: `Divide by ${c} first. ${m(`${c} \\times ${a}^x`)} is not ${m(`${c * a}^x`)}.` }], sol: [m(`${a}^x = ${nf(d / c)}`), m(T`x = \dfrac{\log ${nf(d / c)}}{\log ${a}} = ${P.f(x, 2)}`)] }; },
    ],
    tips: [
      'Get the power on its own before taking logs: divide out any number in front first.',
      'Write the log line, ' + m(T`x\log 3 = \log 50`) + '. A calculator answer alone is not enough for Merit.',
      'In context, answer the question asked. If they ask "how many whole years", round up and say why.',
      m(T`\log_b y = n`) + ' means ' + m('y = b^n') + '. <span class="pen">Rewrite, then solve.</span>',
    ],
  });

  /* ================= 8. Simultaneous equations and modelling ================= */
  P.addUnit({
    id: 'simultaneous', title: 'Simultaneous equations and modelling', mins: 10,
    blurb: 'Where a line meets a curve, and turning a real situation into equations.',
    scenes: [
      { dur: 11, card: [C(0, '<h2>Solving together = where the graphs meet.</h2>'), C(4, `<p>The line ${m('y = x + 3')} crosses the curve ${m('y = x^2 - 2x - 1')} twice.</p>`)],
        draw(a) {
          const v = a.view(-3, 6, -3, 10); a.axes(v);
          a.plot(v, (x) => x * x - 2 * x - 1, a.C.c1, 3.5, a.seg(a.p, 0, 0.4)); a.plot(v, (x) => x + 3, a.C.c2, 3.5, a.seg(a.p, 0.3, 0.6));
          const al = a.seg(a.p, 0.65, 0.8); a.dot(v, 4, 7, a.C.pen, 7, al); a.dot(v, -1, 2, a.C.pen, 7, al);
          a.text('(4, 7)', v.X(4) + 12, v.Y(7) + 6, { font: 'pen', col: a.C.pen, alpha: al }); a.text('(−1, 2)', v.X(-1) - 12, v.Y(2) - 18, { align: 'right', font: 'pen', col: a.C.pen, alpha: al });
        } },
      { dur: 13, card: [C(0, '<h2>Substitute, then solve the quadratic.</h2>'), C(9, '<p>Find the y values too. A point needs both.</p>')],
        board: [B(0.5, 'x^2 - 2x - 1 = x + 3', 'set equal'), B(3, 'x^2 - 3x - 4 = 0'), B(5, '(x - 4)(x + 1) = 0'), B(7.5, T`x = 4,\ y = 7 \quad\text{and}\quad x = -1,\ y = 2`, 'y too!', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>Two straight lines: eliminate.</h2>'), C(3, '<p>Make one variable match, then add or subtract the equations.</p>')],
        board: [B(0.5, T`2x + 3y = 13 \qquad x - y = -1`), B(3, '2x - 2y = -2', '× 2'), B(5.5, '5y = 15', 'subtract'), B(8, T`y = 3,\ x = 2`, '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Words into two equations.</h2>'), C(2, `<p>Adult tickets ${P.money(12)}, child tickets ${P.money(7)}. 40 tickets sold for ${P.money(380)}.</p>`), C(9, '<p>One equation for "how many", one for "how much".</p>')],
        board: [B(3, 'a + c = 40', 'how many'), B(5, '12a + 7c = 380', 'how much'), B(7.5, '12a + 7(40 - a) = 380'), B(10, T`a = 20,\ c = 20`, '', { hl: true })] },
    ],
    example: {
      problem: `A ball's height in metres is ${m('h = -5t^2 + 20t + 1.8')}, where ${m('t')} is in seconds. When is it 16.8 m high?`,
      steps: [
        { m: m('-5t^2 + 20t + 1.8 = 16.8'), note: 'set h = 16.8' },
        { m: m('-5t^2 + 20t - 15 = 0') },
        { m: m('t^2 - 4t + 3 = 0'), note: '÷ by −5' },
        { m: m('(t - 1)(t - 3) = 0') },
        { m: 'At ' + m('t = 1') + ' s on the way up and ' + m('t = 3') + ' s on the way down.', note: 'both make sense' },
      ],
    },
    faded() {
      let p, q; do { p = R.int(-4, 5); q = R.int(-4, 5); } while (p === q);
      const mm = R.nz(-3, 3), k = R.int(-4, 6);
      // x^2 + bx + c = mx + k with roots p, q  =>  x^2 + (b - m)x + (c - k) = (x-p)(x-q)
      const b = -(p + q) + mm, c = p * q + k;
      return { kind: 'multi', answer: [p, q], prompt: `Find the x values where ${m(`y = ${poly([[1, 2], [b, 1], [c, 0]])}`)} meets ${m(`y = ${poly([[mm, 1], [k, 0]])}`)}.`,
        scaffold: [m(`${poly([[1, 2], [b, 1], [c, 0]])} = ${poly([[mm, 1], [k, 0]])}`), m(`${poly([[1, 2], [-(p + q), 1], [p * q, 0]])} = 0`)],
        hint: 'Factorise and set each bracket to zero.', sol: [m(`${P.fac(p)}${P.fac(q)} = 0`), m(`x = ${p} \\text{ or } x = ${q}`)] };
    },
    gens: [
      () => { let x, y; do { x = R.int(-5, 6); y = R.int(-5, 6); } while (x === 0 && y === 0); let a, b, c, d; do { a = R.nz(-4, 5); b = R.nz(-4, 5); c = R.nz(-4, 5); d = R.nz(-4, 5); } while (a * d - b * c === 0);
        const e1 = poly([[a, 1]]) + ' ' + (b < 0 ? '-' : '+') + ' ' + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'y', e2 = poly([[c, 1]]) + ' ' + (d < 0 ? '-' : '+') + ' ' + (Math.abs(d) === 1 ? '' : Math.abs(d)) + 'y';
        return { kind: 'multi', ordered: true, answer: [x, y], prompt: `Solve the simultaneous equations ${m(`${e1} = ${a * x + b * y}`)} and ${m(`${e2} = ${c * x + d * y}`)}.`, fmt: 'Enter x, then y. For example: 2, -3', wrong: [{ v: [y, x], msg: 'Right numbers, wrong order. Give x first.' }], sol: ['Eliminate one variable, solve for the other, then substitute back.', m(`x = ${x}, \\ y = ${y}`), 'Check in both equations.'] }; },
      () => { let p, q; do { p = R.int(-4, 5); q = R.int(-4, 5); } while (p === q); const mm = R.nz(-3, 3), k = R.int(-4, 6), b = -(p + q) + mm, c = p * q + k;
        return { kind: 'multi', answer: [p, q], prompt: `The line ${m(`y = ${poly([[mm, 1], [k, 0]])}`)} meets the curve ${m(`y = ${poly([[1, 2], [b, 1], [c, 0]])}`)}. Find the x values of the meeting points.`, sol: [m(`${poly([[1, 2], [b, 1], [c, 0]])} = ${poly([[mm, 1], [k, 0]])}`), m(`${poly([[1, 2], [-(p + q), 1], [p * q, 0]])} = 0`), m(`x = ${p} \\text{ or } ${q}`)] }; },
      () => { const pa = R.pick([12, 15, 18, 20]), pc = R.pick([5, 6, 8, 10]), a = R.int(10, 60), c = R.int(10, 60), n = a + c, tot = pa * a + pc * c;
        return { kind: 'multi', ordered: true, answer: [a, c], prompt: `A school show sold ${n} tickets. Adult tickets cost ${P.money(pa)} and student tickets ${P.money(pc)}. Ticket sales came to ${P.money(tot)}. How many of each were sold?`, fmt: 'Enter adults, then students. For example: 25, 30',
          wrong: [{ v: [c, a], msg: 'Right numbers, wrong order. Give adults first.' }], sol: [m(`a + s = ${n}`), m(`${pa}a + ${pc}s = ${tot}`), m(`${pa}a + ${pc}(${n} - a) = ${tot}`), m(`${pa - pc}a = ${tot - pc * n}`), m(`a = ${a}, \\ s = ${c}`)] }; },
      () => { const v = R.int(8, 25), h0 = R.pick([0, 1, 1.5, 2, 10, 20]), t = (v + Math.sqrt(v * v + 20 * h0)) / 10;
        return { kind: 'num', answer: t, dp: 2, prompt: `A ball's height in metres is ${m(`h = -5t^2 + ${v}t${h0 ? ' + ' + h0 : ''}`)}, where ${m('t')} is in seconds. When does it hit the ground? Give your answer to 2 decimal places.`,
          sol: [m(`-5t^2 + ${v}t${h0 ? ' + ' + h0 : ''} = 0`), h0 ? 'Use the formula: ' + m(T`t = \dfrac{-${v} \pm \sqrt{${v}^2 - 4(-5)(${h0})}}{2(-5)}`) : m(`t(-5t + ${v}) = 0`), m(`t = ${P.f(t, 2)}`) + ' s' + (h0 ? ' (the negative solution is before it was thrown, so reject it)' : ' (t = 0 is when it was thrown)')],
          wrong: [{ v: v / 10, msg: 'That is when it is highest. It hits the ground when h = 0.' }] }; },
    ],
    tips: [
      'A meeting point has an x and a y. Find both unless the question only asks for x.',
      'Define your letters in word problems: "let a be the number of adult tickets".',
      'For a model like ' + m('h = -5t^2 + ...') + ', say which solutions make sense and why.',
      'Check your answers in the original equations. It takes seconds and catches most slips.',
    ],
  });
})();
