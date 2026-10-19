/* "Aim higher": one fixed exam-style question per topic, in three parts that climb
   (a) Achieved, (b) Merit, (c) Excellence. Each part has an optional answer check, a model answer
   with margin notes (key lines are the ones that earn the grade), and a line saying why it earns it.
   Then two "Upgrade this answer" questions: Achieved → Merit and Merit → Excellence.
   Grade language follows NZQA: Merit = relational thinking (linked steps, a model, results related to
   the context); Excellence = extended abstract thinking (a strategy, a chain of reasoning or proof,
   a generalisation, a justified statement in context). Every number here was checked by computation
   (see tools/check-questions.js, which also re-checks each answer against the model's last line). */
(function () {
  const P = NP, T = String.raw, $$ = P.money;
  const L = (id, aim) => { const u = P.unitById[id]; if (u) u.aim = aim; };
  // model-answer line: html (may contain $maths$), margin note, key = the line that earns the grade
  const S = (m, note, key) => ({ m, note, key: !!key });
  // answers given to 1 dp accept anything that rounds to the right value
  const tolDp = (o) => (o.dp != null && o.tol == null ? Object.assign({ tol: Math.max(0.006, 0.51 * 10 ** -o.dp) }, o) : o);
  const num = (answer, o = {}) => Object.assign({ kind: 'num', answer }, tolDp(o));
  const multi = (answer, o = {}) => Object.assign({ kind: 'multi', answer }, tolDp(o));
  const pick = (...choices) => ({ kind: 'mcq', choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });
  const up = (part, shown, choices, ask) => ({ part, shown, ask, choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });

  // a small box-and-whisker plot. groups: [{name, five:[min,lq,med,uq,max], mean, col}]
  const boxes = (groups, lo, hi, step, unit) => {
    const w = 440, rowH = 62, pad = 30, h = groups.length * rowH + 40;
    const X = (v) => pad + ((v - lo) / (hi - lo)) * (w - 2 * pad);
    let s = `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="Box and whisker plots">`;
    groups.forEach((g, i) => {
      const y = 22 + i * rowH, mid = y + 22, [a, b, c, d, e] = g.five;
      s += `<text x="${pad}" y="${y}" class="gl">${g.name}</text>`;
      s += `<line x1="${X(a)}" y1="${mid}" x2="${X(b)}" y2="${mid}" class="ax"/><line x1="${X(d)}" y1="${mid}" x2="${X(e)}" y2="${mid}" class="ax"/>`;
      s += `<line x1="${X(a)}" y1="${mid - 7}" x2="${X(a)}" y2="${mid + 7}" class="ax"/><line x1="${X(e)}" y1="${mid - 7}" x2="${X(e)}" y2="${mid + 7}" class="ax"/>`;
      s += `<rect x="${X(b)}" y="${mid - 13}" width="${X(d) - X(b)}" height="26" style="fill:${g.col};fill-opacity:.18;stroke:${g.col};stroke-width:2"/>`;
      s += `<line x1="${X(c)}" y1="${mid - 13}" x2="${X(c)}" y2="${mid + 13}" style="stroke:${g.col};stroke-width:3"/>`;
    });
    const base = h - 22;
    s += `<line x1="${pad}" y1="${base}" x2="${w - pad}" y2="${base}" class="ax"/>`;
    for (let v = lo; v <= hi; v += step) s += `<line x1="${X(v)}" y1="${base}" x2="${X(v)}" y2="${base + 4}" class="ax"/><text x="${X(v)}" y="${base + 17}" class="tl" text-anchor="middle">${v}</text>`;
    if (unit) s += `<text x="${w - pad}" y="${base - 6}" class="tl" text-anchor="end">${unit}</text>`;
    return s + '</svg>';
  };
  const G = (fns, o) => P.svg.graph(fns, Object.assign({ x0: -2.5, x1: 2.5, y0: -4, y1: 4, step: 1, w: 420, h: 280 }, o));
  const cube = (x) => x ** 3 - 3 * x;

  /* ======================= ALGEBRA (AS 91261) ======================= */

  L('indices', {
    intro: 'Index questions open most algebra papers. The marks climb from simplifying, to solving, to proving.',
    parts: [
      { q: T`Simplify $\dfrac{(3x^2y)^3}{9x^4y}$.`, check: multi([3, 2, 2], { ordered: true, fmt: T`Your answer looks like $ax^my^n$. Give $a$, $m$ and $n$, separated by commas.` }),
        model: [S(T`$(3x^2y)^3 = 27x^6y^3$`, 'Cube every part, including the 3'), S(T`$\dfrac{27x^6y^3}{9x^4y} = 3x^{6-4}y^{3-1}$`, 'Divide the numbers, subtract the powers'), S(T`$= 3x^2y^2$`, 'Correct method, correct answer', true)],
        earns: 'Achieved means using a method correctly. Here that is the index laws, applied one at a time.' },
      { q: T`Solve $4^{x+1} = 8^{x}$. Show an algebraic method.`, check: num(2),
        model: [S(T`$(2^2)^{x+1} = (2^3)^{x}$`, 'Write both sides with the same base', true), S(T`$2^{2x+2} = 2^{3x}$`, 'Power of a power: multiply'), S(T`$2x + 2 = 3x$`, 'Same base, so the powers are equal', true), S(T`$x = 2$`), S(T`Check: $4^3 = 64$ and $8^2 = 64$.`, 'A quick check')],
        earns: 'Merit needs a logical chain of linked steps: change the base, set the powers equal, solve. Guessing x = 2 and checking it shows no method.' },
      { q: T`Show that $\dfrac{3^{n+2} - 3^{n}}{3^{n+1} - 3^{n}}$ has the same value for every whole number $n$, and find that value.`, check: num(4, { fmt: 'Give the value.' }),
        model: [S(T`$= \dfrac{3^{n} \times 9 - 3^{n}}{3^{n} \times 3 - 3^{n}}$`, 'Split each power so 3ⁿ is in every term'), S(T`$= \dfrac{3^{n}(9 - 1)}{3^{n}(3 - 1)}$`, 'Take out the common factor 3ⁿ', true), S(T`$= \dfrac{8}{2} = 4$`, 'The 3ⁿ cancels'), S(T`Since $3^{n}$ cancels, and is never 0, the value is 4 for every $n$.`, 'The statement that finishes the proof', true)],
        earns: 'Excellence needs a general argument: a proof that works for every n, ending in a clear statement. Trying n = 1 and n = 2 only shows it works for those two values.' },
    ],
    up: [
      up(1, [T`$x = 2$, because $4^3 = 64$ and $8^2 = 64$.`], [
        ['An algebraic method: write both sides as powers of 2, then set the powers equal', 1, 'Right. Guess-and-check gets the answer but shows no algebra, and the question asks for an algebraic method.'],
        ['Units on the answer', 0, 'There are no units here. The problem is that the answer was found by guessing.'],
        ['A second solution', 0, 'There is only one solution, x = 2. What is missing is the algebraic method.'],
        ['More decimal places', 0, 'x = 2 is exact. What is missing is a method instead of a guess.']]),
      up(2, [T`$n = 1$: $\dfrac{27 - 3}{9 - 3} = 4$`, T`$n = 2$: $\dfrac{81 - 9}{27 - 9} = 4$`, 'So the value is always 4.'], [
        [T`A general proof: take $3^n$ out of the top and bottom so it cancels for every $n$`, 1, 'Right. Examples can never prove "for every n". Factorising shows why the n disappears.'],
        [T`Test more values, such as $n = 3$ and $n = 4$`, 0, 'More examples still do not prove it for every n. Only a general argument does.'],
        ['Check the two examples on a calculator', 0, 'The examples are already right. The problem is that examples are not a proof.'],
        ['Write the answer as a decimal, 4.0', 0, 'The value is fine. What is missing is a proof that works for every n.']]),
    ],
  });

  L('factorising', {
    intro: T`A rectangular deck has area $(2x^2 + 7x - 15)$ m² and width $(x + 5)$ m.`,
    parts: [
      { q: T`Factorise $x^2 - 2x - 15$.`, check: multi([-5, 3], { fmt: T`The answer is $(x + p)(x + q)$. Give $p$ and $q$.` }),
        model: [S('Two numbers that multiply to −15 and add to −2: −5 and 3.', 'Product, then sum'), S(T`$x^2 - 2x - 15 = (x - 5)(x + 3)$`, 'Correct factors', true), S('Expand to check: −5x + 3x = −2x.', 'Always check')],
        earns: 'Achieved: a standard method, used correctly.' },
      { q: T`Find an expression for the perimeter of the deck, in its simplest form.`, check: multi([6, 4], { ordered: true, fmt: T`The perimeter is $ax + b$. Give $a$ and $b$.` }),
        model: [S(T`$2x^2 + 7x - 15 = (2x - 3)(x + 5)$`, 'Factorise the area'), S(T`The width is $x + 5$, so the length is $2x - 3$.`, 'Link the factors to the rectangle', true), S(T`$P = 2(2x - 3) + 2(x + 5)$`, 'Perimeter = 2 lengths + 2 widths'), S(T`$= 6x + 4$`, 'Simplified', true)],
        earns: 'Merit: the factorising is used for something. You connected the algebra to the shape (area = length × width) and carried it through to the perimeter.' },
      { q: T`The perimeter is 40 m. Find the area of the deck, and explain why $x$ must be greater than 1.5.`, check: num(99, { fmt: 'Give the area in m².' }),
        model: [S(T`$6x + 4 = 40$, so $x = 6$`, 'Use the perimeter from (b)'), S(T`Width $= 6 + 5 = 11$ m, length $= 2(6) - 3 = 9$ m`, 'Back into the context'), S(T`Area $= 11 \times 9 = 99$ m²`, 'Answer the question asked', true), S(T`Check: $2(6)^2 + 7(6) - 15 = 99$ ✓`), S(T`The length $2x - 3$ must be positive: $2x - 3 > 0$, so $x > 1.5$.`, 'Explains the restriction in context', true)],
        earns: 'Excellence: a chain of reasoning across all three parts, a check, and a justified statement about the context (a length cannot be zero or negative).' },
    ],
    up: [
      up(1, [T`$2x^2 + 7x - 15 = (2x - 3)(x + 5)$`], [
        [T`Use the factors: the length is $2x - 3$, so the perimeter is $2(2x - 3) + 2(x + 5) = 6x + 4$`, 1, 'Right. Factorising is only the first step. Merit comes from linking it to the rectangle and finishing the perimeter.'],
        ['Expand the brackets again to show it works', 0, 'A check is good, but it does not answer the question: the perimeter is still missing.'],
        ['Factorise it further', 0, 'It is already fully factorised. What is missing is using it to find the perimeter.'],
        ['Draw a diagram', 0, 'A diagram can help, but the answer still needs the perimeter expression, 6x + 4.']]),
      up(2, [T`$6x + 4 = 40$`, T`$x = 6$`], [
        ['Finish: find the length and width, the area of 99 m², and explain why x > 1.5', 1, 'Right. x = 6 is not what was asked. Excellence needs the full chain to the area, plus the explanation.'],
        ['Write x = 6.0 m', 0, 'x is not a length here, and the question asks for the area and an explanation.'],
        ['Solve it a second way to check', 0, 'Checking is good, but the area and the explanation are still missing.'],
        ['Factorise 6x + 4', 0, 'That does not help. The answer needs the area and the reason x > 1.5.']]),
    ],
  });

  L('alg-fractions', {
    intro: 'Algebraic fractions questions usually end with an equation in a context, such as speed and time.',
    parts: [
      { q: T`Simplify $\dfrac{x^2 - 9}{x^2 + x - 6}$.`, check: multi([-3, -2], { ordered: true, fmt: T`The answer is $\dfrac{x + a}{x + b}$. Give $a$ and $b$.` }),
        model: [S(T`$x^2 - 9 = (x - 3)(x + 3)$`, 'Difference of two squares'), S(T`$x^2 + x - 6 = (x + 3)(x - 2)$`), S(T`$\dfrac{(x - 3)(x + 3)}{(x + 3)(x - 2)} = \dfrac{x - 3}{x - 2}$`, 'Cancel the common bracket', true)],
        earns: 'Achieved: factorise, then cancel a whole bracket.' },
      { q: T`Solve $\dfrac{6}{x} + \dfrac{6}{x + 1} = 5$.`, check: multi([2, -0.6]),
        model: [S(T`$6(x + 1) + 6x = 5x(x + 1)$`, 'Multiply every term by x(x + 1)', true), S(T`$12x + 6 = 5x^2 + 5x$`), S(T`$5x^2 - 7x - 6 = 0$`, 'Rearrange to a quadratic = 0'), S(T`$(5x + 3)(x - 2) = 0$`), S(T`$x = 2$ or $x = -0.6$`, 'Both solutions', true)],
        earns: 'Merit: a logical sequence of steps from fractions, to a quadratic, to both solutions.' },
      { q: T`Aroha tramps 10 km to a hut at $x$ km/h, then walks back 1 km/h faster. Her walking time is 4.5 hours in total. Form an equation and solve it to find her speed on the way to the hut.`, check: num(4, { fmt: 'Give her speed in km/h.' }),
        model: [S(T`time $= \dfrac{\text{distance}}{\text{speed}}$, so $\dfrac{10}{x} + \dfrac{10}{x + 1} = 4.5$`, 'Form the model from the context', true), S(T`$10(x + 1) + 10x = 4.5x(x + 1)$`), S(T`$4.5x^2 - 15.5x - 10 = 0$, or $9x^2 - 31x - 20 = 0$`, 'Double it to clear the decimals'), S(T`$(x - 4)(9x + 5) = 0$, so $x = 4$ or $x = -\tfrac{5}{9}$`), S('A speed cannot be negative, so her speed to the hut was 4 km/h.', 'Rejects a solution, with a reason', true), S('Check: 10 ÷ 4 + 10 ÷ 5 = 2.5 + 2 = 4.5 hours ✓', 'Checks it makes sense')],
        earns: 'Excellence: you formed the model yourself, solved it, and made a justified statement in context, including why one solution is rejected.' },
    ],
    up: [
      up(1, [T`$\dfrac{6}{x} + \dfrac{6}{x + 1} = 5$`, T`$\dfrac{12x + 6}{x(x + 1)} = 5$`], [
        ['Carry on: multiply out, rearrange to a quadratic, and find both solutions', 1, 'Right. Combining the fractions is a good start, but the equation is not solved yet.'],
        ['Cancel the x on the top and bottom', 0, 'You cannot cancel part of a sum. Multiply both sides by x(x + 1) instead.'],
        ['Write it as a mixed number', 0, 'It is an equation to solve, not a number to tidy. Keep going to the solutions.'],
        ['Check it with x = 1', 0, 'Checking needs a solution first. The equation still has to be solved.']]),
      up(2, [T`$\dfrac{10}{x} + \dfrac{10}{x + 1} = 4.5$`, T`$x = 4$ or $x = -0.56$`], [
        ['Say which solution answers the question and why: speed 4 km/h, as a speed cannot be negative', 1, 'Right. Excellence needs a statement in context, including why −0.56 is rejected.'],
        ['Give −0.56 to more decimal places', 0, 'That solution should be rejected, not made more accurate.'],
        ['Add the two solutions', 0, 'That has no meaning here. Choose the solution that makes sense, and say why.'],
        ['Draw the graph', 0, 'The solutions are right. What is missing is the conclusion in context.']]),
    ],
  });

  L('rearranging', {
    intro: 'Rearranging questions climb from using a formula, to building one, to rearranging when the subject appears twice.',
    parts: [
      { q: T`The formula $F = \dfrac{9C}{5} + 32$ converts °C to °F. Make $C$ the subject, then find $C$ when $F = 77$.`, check: num(25, { fmt: 'Give C.' }),
        model: [S(T`$F - 32 = \dfrac{9C}{5}$`, 'Undo the + 32 first'), S(T`$5(F - 32) = 9C$`), S(T`$C = \dfrac{5(F - 32)}{9}$`, 'C is the subject', true), S(T`$C = \dfrac{5(77 - 32)}{9} = 25$`)],
        earns: 'Achieved: undo the operations in reverse order, correctly.' },
      { q: T`A taxi charges a ${$$('4')} flag fall plus ${$$('2.50')} per km. Write a formula for the cost $C$ dollars of a trip of $d$ km, then find how far you can travel for ${$$('49')}.`, check: num(18, { fmt: 'Give the distance in km.' }),
        model: [S(T`$C = 4 + 2.5d$`, 'Form the model', true), S(T`$49 = 4 + 2.5d$`, 'Use it'), S(T`$2.5d = 45$, so $d = 18$`), S('You can travel 18 km.', 'Answer in context', true)],
        earns: 'Merit: you formed a model (the formula) and used it, then gave the answer in context.' },
      { q: T`The average speed for a return trip, out at speed $u$ and back at speed $v$, is $s = \dfrac{2uv}{u + v}$. Make $v$ the subject. A cyclist rides out at 20 km/h. How fast must she ride back to average 24 km/h? Explain why she can never average 40 km/h.`, check: num(30, { fmt: 'Give the return speed in km/h.' }),
        model: [S(T`$s(u + v) = 2uv$`, 'Clear the fraction'), S(T`$su + sv = 2uv$`), S(T`$su = 2uv - sv$`, 'All the v terms on one side', true), S(T`$su = v(2u - s)$`, 'Factorise out v', true), S(T`$v = \dfrac{su}{2u - s}$`), S(T`$v = \dfrac{24 \times 20}{40 - 24} = 30$ km/h`), S(T`For $s = 40$: $2u - s = 40 - 40 = 0$, so there is no possible $v$. Even riding back incredibly fast, the average stays below 40 km/h.`, 'Insight from the formula', true)],
        earns: 'Excellence: v appears twice, so you needed a strategy (collect, then factorise). The final explanation uses the formula to make a correct statement with insight.' },
    ],
    up: [
      up(1, [T`$49 - 4 = 45$`, T`$45 \div 2.5 = 18$ km`], [
        [T`The formula: write $C = 4 + 2.5d$, then use it to find $d$`, 1, 'Right. The arithmetic is correct, but the question asks for a formula. Merit is for forming the model and using it.'],
        ['Units', 0, 'The units are there (km). What is missing is the formula the question asks for.'],
        ['Rounding', 0, '18 is exact. What is missing is the formula.'],
        ['A check by substituting', 0, 'A check is nice, but the formula is still missing.']]),
      up(2, [T`$v = \dfrac{su}{2u - s} = \dfrac{24 \times 20}{40 - 24} = 30$ km/h`], [
        [T`The explanation: when $s = 40$, $2u - s = 0$, so no return speed works`, 1, 'Right. The rearranging is good. The insight about 40 km/h is what lifts it to Excellence.'],
        ['Show the answer to 2 decimal places', 0, '30 is exact. What is missing is the explanation for 40 km/h.'],
        ['A diagram of the trip', 0, 'A diagram is not needed. The explanation using the formula is missing.'],
        ['Rearrange it again for u', 0, 'That is not asked. What is missing is why 40 km/h is impossible.']]),
    ],
  });

  L('quadratics', {
    intro: 'A rectangular lawn is 12 m by 8 m. A path of width x m is laid all the way around it.',
    parts: [
      { q: T`Solve $x^2 - 7x + 10 = 0$.`, check: multi([2, 5]),
        model: [S(T`$(x - 2)(x - 5) = 0$`, 'Factorise'), S(T`$x = 2$ or $x = 5$`, 'Both solutions', true)],
        earns: 'Achieved: a correct method and both solutions.' },
      { q: 'The lawn and path together cover 140 m². Find the width of the path.', check: num(1, { fmt: 'Give the width in m.' }),
        model: [S(T`$(12 + 2x)(8 + 2x) = 140$`, 'The path adds x on each side: 2x per dimension', true), S(T`$4x^2 + 40x + 96 = 140$`), S(T`$x^2 + 10x - 11 = 0$`, 'Divide by 4'), S(T`$(x + 11)(x - 1) = 0$, so $x = 1$ or $x = -11$`), S('A width cannot be negative, so the path is 1 m wide.', 'Relates the answer to the context', true)],
        earns: 'Merit: you formed the model from the picture, solved it, and related the solution to the context.' },
      { q: 'The path must have an area of at least 60 m², and the whole thing must fit in a space 20 m long. Find the range of possible path widths.', check: multi([1.33, 4], { ordered: true, dp: 2, fmt: 'Give the smallest and largest widths to 2 decimal places, separated by a comma. Round the smallest width so the area really is at least 60 m².' }),
        model: [S(T`Path area $= (12 + 2x)(8 + 2x) - 96 = 4x^2 + 40x$`, 'Area of the path alone', true), S(T`$4x^2 + 40x = 60 \Rightarrow x^2 + 10x - 15 = 0$`), S(T`$x = \dfrac{-10 \pm \sqrt{160}}{2} = 1.3246$ (reject the negative)`), S(T`Length: $12 + 2x \le 20$, so $x \le 4$`, 'The second condition', true), S(T`So $1.33 \le x \le 4$ m: the width must be at least 1.3246 m, so to 2 d.p. round up to 1.33 m (1.32 m gives just under 60 m²).`, 'Combined, with insight', true)],
        earns: 'Excellence: you devised a strategy using two conditions, combined them into one range, and commented on the rounding in context.' },
    ],
    up: [
      up(1, [T`$(12 + 2x)(8 + 2x) = 140$`, T`$x = 1$ or $x = -11$`], [
        ['Reject −11, because a width cannot be negative, and state the path is 1 m wide', 1, 'Right. Merit needs the answer related to the context, not just two solutions.'],
        ['Check both solutions in the equation', 0, 'Both do satisfy the equation. The point is that only one makes sense here.'],
        ['Use the quadratic formula instead', 0, 'The method is fine. What is missing is choosing the solution that fits the context.'],
        ['Give the solutions to 2 decimal places', 0, 'They are exact. What is missing is rejecting −11 with a reason.']]),
      up(2, [T`$4x^2 + 40x = 60$`, T`$x = 1.3246$ m`], [
        ['Use the second condition too (12 + 2x ≤ 20, so x ≤ 4) and give the range 1.33 ≤ x ≤ 4', 1, 'Right. The question asks for a range from two conditions. Excellence needs both, combined.'],
        ['Round 1.3246 to 1.3', 0, 'Less accuracy does not help. The missing part is the second condition.'],
        ['Show the negative solution too', 0, 'The negative solution is rightly rejected. The missing part is the upper limit from the 20 m space.'],
        ['Find the area of the lawn', 0, 'That is 96 m², already used. The missing part is the upper limit.']]),
    ],
  });

  L('discriminant', {
    intro: T`The discriminant $b^2 - 4ac$ tells you how many solutions a quadratic has without solving it.`,
    parts: [
      { q: T`Find the discriminant of $2x^2 - 5x + 4 = 0$ and describe its roots.`, check: num(-7, { fmt: 'Give the discriminant.' }),
        model: [S(T`$b^2 - 4ac = (-5)^2 - 4(2)(4)$`, 'Brackets round −5'), S(T`$= 25 - 32 = -7$`), S('Negative, so there are no real roots.', 'Describes the roots', true)],
        earns: 'Achieved: the formula, used correctly, with the meaning stated.' },
      { q: T`For which values of $k$ does $x^2 + kx + 9 = 0$ have two different real roots?`, check: multi([-6, 6], { fmt: 'Give the two boundary values of k.' }),
        model: [S(T`Two different real roots: $b^2 - 4ac > 0$`, 'The right condition: greater than 0', true), S(T`$k^2 - 36 > 0$`), S(T`$k^2 > 36$`), S(T`$k < -6$ or $k > 6$`, 'Both parts of the answer', true)],
        earns: 'Merit: you linked the type of roots to the right inequality and solved it fully, including the negative side.' },
      { q: T`A ball's height is $h = -5t^2 + 20t + 1$ metres after $t$ seconds. Use the discriminant to show the ball never reaches 25 m. What is the greatest height it reaches?`, check: num(21, { fmt: 'Give the greatest height in m.' }),
        model: [S(T`$-5t^2 + 20t + 1 = 25 \Rightarrow -5t^2 + 20t - 24 = 0$`, 'Set up the equation for h = 25'), S(T`$b^2 - 4ac = 400 - 4(-5)(-24) = -80$`), S('Negative, so there is no time when h = 25. The ball never reaches 25 m.', 'Interprets the discriminant in context', true), S(T`For height $H$: $-5t^2 + 20t + 1 - H = 0$ just touches when $400 + 20(1 - H) = 0$`, 'A general height, then discriminant = 0', true), S(T`$420 = 20H$, so $H = 21$ m`), S(T`Check: the top is at $t = 2$, and $h(2) = -20 + 40 + 1 = 21$ ✓`)],
        earns: 'Excellence: the discriminant is used as a tool in a problem, with a general height H, and the result is interpreted in context.' },
    ],
    up: [
      up(1, [T`$k^2 - 36 = 0$`, T`$k = \pm 6$`], [
        [T`The inequality: two different roots need $b^2 - 4ac > 0$, so $k < -6$ or $k > 6$`, 1, 'Right. = 0 gives equal roots. The question asks for two different roots, which needs > 0.'],
        ['Only the positive value, k = 6', 0, 'Both signs matter, and the answer is a range, not single values.'],
        ['A check by substituting k = 6', 0, 'k = 6 gives equal roots, not two different ones. The condition should be > 0.'],
        ['The roots themselves', 0, 'The question asks for k, not the roots. The condition should be > 0.']]),
      up(2, [T`$b^2 - 4ac = 20^2 - 4(-5)(-24) = -80$`], [
        ['Interpret it (negative, so no real t: the ball never reaches 25 m) and find the greatest height, 21 m', 1, 'Right. A number is not a conclusion. Excellence needs the meaning in context and the follow-on question.'],
        ['Take the square root of −80', 0, 'You cannot, in real numbers. That is exactly why there is no solution. Say what it means.'],
        ['Solve with the quadratic formula', 0, 'It has no real solutions. State what the negative discriminant means instead.'],
        ['Round −80', 0, 'It is exact. What is missing is its meaning and the greatest height.']]),
    ],
  });

  L('logs', {
    intro: T`A car bought for ${$$(32000)} loses 15% of its value each year, so its value is $V = 32\,000 \times 0.85^t$ after $t$ years.`,
    parts: [
      { q: T`Solve $3^x = 50$. Give $x$ to 2 decimal places.`, check: num(Math.log(50) / Math.log(3), { dp: 2 }),
        model: [S(T`$x = \log_3 50 = \dfrac{\log 50}{\log 3}$`, 'Take logs'), S(T`$x = 3.56$`, 'Correct, to 2 dp', true)],
        earns: 'Achieved: logs used correctly to solve an exponential equation.' },
      { q: T`After how many whole years is the car first worth less than ${$$(10000)}?`, check: num(8, { fmt: 'Give a whole number of years.' }),
        model: [S(T`$32\,000 \times 0.85^t = 10\,000$`, 'Use the model'), S(T`$0.85^t = 0.3125$`), S(T`$t = \dfrac{\log 0.3125}{\log 0.85} = 7.16$`), S(T`After 7 years it is still worth ${$$(10258)}, so it first drops below ${$$(10000)} after 8 years.`, 'Interprets the rounding in context', true)],
        earns: 'Merit: you used the model and related the answer to the context: whole years, rounded up, with a check.' },
      { q: T`A second car, bought for ${$$(24000)}, loses 10% a year. When are the two cars worth the same? Which is worth more after that, and why?`, check: num(Math.log(0.75) / Math.log(0.85 / 0.9), { dp: 2, fmt: 'Give t to 2 decimal places.' }),
        model: [S(T`$32\,000 \times 0.85^t = 24\,000 \times 0.9^t$`, 'Equate the two models', true), S(T`$\left(\dfrac{0.85}{0.9}\right)^{t} = \dfrac{24\,000}{32\,000} = 0.75$`, 'Collect the powers of t on one side'), S(T`$t = \dfrac{\log 0.75}{\log (0.85 / 0.9)} = 5.03$ years`), S(T`After 5.03 years the second car is worth more, because it loses value more slowly (10% a year instead of 15%).`, 'Statement with a reason', true)],
        earns: 'Excellence: you devised a strategy for t on both sides, solved it with logs, and made a reasoned statement about what happens next.' },
    ],
    up: [
      up(1, [T`$t = \log 0.3125 \div \log 0.85 = 7.16$ years`], [
        [`Interpret it: whole years, and after 7 years it is still above ${$$(10000)}, so the answer is 8 years`, 1, 'Right. 7.16 does not answer "after how many whole years". Merit needs the answer related to the context.'],
        ['Round to 7 years', 0, `After 7 years it is still worth ${$$(10258)}. Rounding down gives the wrong answer here.`],
        ['Give 7.157 years', 0, 'More decimals do not help. The question wants whole years.'],
        ['Use a different log base', 0, 'Any base gives 7.16. What is missing is the interpretation.']]),
      up(2, [`After 5 years: car 1 is worth ${$$(14199)}, car 2 is worth ${$$(14172)}.`, 'So they are worth the same after about 5 years.'], [
        ['An algebraic solution: set the models equal and solve with logs (t = 5.03), then say which is worth more and why', 1, 'Right. Trial and error gives an estimate. Excellence needs a strategy, an accurate answer, and the reasoned statement.'],
        ['Try t = 6 as well', 0, 'More trials still only estimate. Solve it with logs, and answer the second question.'],
        [`Round the values to the nearest ${$$(1000)}`, 0, 'Less accuracy does not help. A method and the second part are missing.'],
        ['Draw both graphs by hand', 0, 'A graph also only estimates. Use logs, then explain which car is worth more.']]),
    ],
  });

  L('simultaneous', {
    intro: 'Simultaneous equations questions climb from solving, to forming, to a line meeting a curve.',
    parts: [
      { q: T`Solve $y = 2x + 3$ and $3x + y = 13$.`, check: multi([2, 7], { ordered: true, fmt: 'Give x, then y, separated by a comma.' }),
        model: [S(T`$3x + (2x + 3) = 13$`, 'Substitute'), S(T`$5x = 10$, so $x = 2$`), S(T`$y = 2(2) + 3 = 7$`, 'Both values', true)],
        earns: 'Achieved: a correct method, giving both x and y.' },
      { q: T`A café sells flat whites at ${$$('5.50')} and muffins at ${$$(4)}. One morning it sells 120 items and takes ${$$(585)}. How many of each did it sell?`, check: multi([70, 50], { ordered: true, fmt: 'Give the flat whites, then the muffins.' }),
        model: [S(T`Let $f$ = flat whites, $m$ = muffins: $f + m = 120$ and $5.5f + 4m = 585$`, 'Form the two equations', true), S(T`$5.5f + 4(120 - f) = 585$`), S(T`$1.5f = 105$, so $f = 70$ and $m = 50$`), S('70 flat whites and 50 muffins.', 'Answer in context', true)],
        earns: 'Merit: you formed the model from words, solved it, and answered in context.' },
      { q: T`A skate ramp's profile is $y = x^2 - 4x + 7$. A straight rail $y = 2x + c$ must just touch the ramp without cutting it. Find $c$ and the point where they touch.`, check: num(-2, { fmt: 'Give c.' }),
        model: [S(T`$x^2 - 4x + 7 = 2x + c \Rightarrow x^2 - 6x + (7 - c) = 0$`, 'Where they meet'), S('"Just touch" means exactly one meeting point, so the discriminant is 0.', 'Links the geometry to the discriminant', true), S(T`$36 - 4(7 - c) = 0 \Rightarrow c = -2$`), S(T`$x^2 - 6x + 9 = (x - 3)^2 = 0$, so $x = 3$, $y = 2(3) - 2 = 4$`), S('The rail touches the ramp at (3, 4), with one repeated root.', 'Full conclusion', true)],
        earns: 'Excellence: you combined two ideas (simultaneous equations and the discriminant) into a strategy, and gave a full, justified conclusion.' },
    ],
    up: [
      up(1, [T`$f + m = 120$`, T`$5.5f + 4m = 585$`], [
        ['Solve the equations and answer in context: 70 flat whites and 50 muffins', 1, 'Right. Setting up is a great start, but the question asks how many of each.'],
        ['Write the equations in a different order', 0, 'The order does not matter. They still need solving.'],
        ['Add the two equations', 0, 'That does not eliminate a letter here. Substitute m = 120 − f instead, then solve.'],
        ['Check the prices', 0, 'The prices are fine. The equations still need solving.']]),
      up(2, [T`$x^2 - 4x + 7 = 2x + c$`, T`$b^2 - 4ac = 0$ gives $c = -2$.`], [
        ['Find the point of contact, (3, 4), and explain that one repeated root means the rail just touches', 1, 'Right. The question asks for c and the point, with the reasoning shown.'],
        ['Check c with a second value', 0, 'c = −2 is the only value. The point of contact and the explanation are missing.'],
        ['Write c = −2.0', 0, 'Accuracy is fine. The point and the explanation are missing.'],
        ['Sketch the ramp', 0, 'A sketch helps, but the question also asks for the point where they touch.']]),
    ],
  });

  /* ======================= CALCULUS (AS 91262) ======================= */

  L('derivative', {
    intro: 'Derivative questions climb from finding a gradient, to using it with a graph, to proving something about it for every x.',
    parts: [
      { q: T`For $f(x) = 2x^3 - 5x^2 + 4x - 1$, find $f'(x)$ and the gradient of the curve at $x = 2$.`, check: num(8, { fmt: 'Give the gradient.' }),
        model: [S(T`$f'(x) = 6x^2 - 10x + 4$`, 'Power rule on each term'), S(T`$f'(2) = 6(2)^2 - 10(2) + 4 = 8$`, 'Substitute into the derivative', true)],
        earns: 'Achieved: differentiate correctly and substitute.' },
      { q: T`Find the gradient of $g(x) = x(x - 3)^2$ at each point where its graph meets the x-axis.`, check: multi([9, 0], { ordered: true, fmt: 'Give the gradient at the left point, then the right point.' }),
        model: [S(T`$g(x) = 0$ when $x = 0$ or $x = 3$`, 'Find both points first', true), S(T`$g(x) = x^3 - 6x^2 + 9x$`, 'Expand before differentiating'), S(T`$g'(x) = 3x^2 - 12x + 9$`), S(T`$g'(0) = 9$ and $g'(3) = 27 - 36 + 9 = 0$`), S('At x = 3 the gradient is 0: the graph touches the axis there and turns.', 'Links the result to the graph', true)],
        earns: 'Merit: several linked steps (find the points, expand, differentiate, substitute) and a link to the graph.' },
      { q: T`Prove that the gradient of $h(x) = x^3 - 3x^2 + 5x$ is positive for every value of $x$. What is the smallest gradient, and what does this mean for the graph?`, check: num(2, { fmt: 'Give the smallest gradient.' }),
        model: [S(T`$h'(x) = 3x^2 - 6x + 5$`), S(T`$= 3(x^2 - 2x) + 5 = 3(x - 1)^2 - 3 + 5 = 3(x - 1)^2 + 2$`, 'Complete the square', true), S(T`$(x - 1)^2 \ge 0$, so $h'(x) \ge 2 > 0$ for every $x$.`, 'A proof for all x', true), S('The smallest gradient is 2, at x = 1. The graph is always increasing and has no turning points.', 'Meaning for the graph')],
        earns: 'Excellence: a general proof (for all x), not a few test values, plus a correct statement about the graph.' },
    ],
    up: [
      up(1, [T`$g'(x) = 3x^2 - 12x + 9$`, T`$g'(0) = 9$`], [
        [T`The other point: the graph also meets the axis at $x = 3$, where $g'(3) = 0$`, 1, 'Right. Two points were asked for. Merit needs the whole sequence, and seeing that the gradient there is 0.'],
        ['The equation of the tangent', 0, 'Not asked. The other point where the graph meets the axis is missing.'],
        [T`The second derivative`, 0, 'Not needed. The missing part is the gradient at x = 3.'],
        ['Units for the gradient', 0, 'There are no units here. The gradient at x = 3 is missing.']]),
      up(2, [T`$h'(x) = 3x^2 - 6x + 5$`, T`$h'(0) = 5$, $h'(1) = 2$, $h'(-2) = 29$`, 'All positive, so the gradient is always positive.'], [
        [T`A proof for every $x$: complete the square to get $3(x - 1)^2 + 2 \ge 2$`, 1, 'Right. Three values cannot prove "for every x". Completing the square (or showing the discriminant is negative) does.'],
        ['Test more values, including large ones', 0, 'Any number of examples is still not a proof.'],
        ['Differentiate again', 0, 'That tells you where h′ is smallest, but you still need the proof that h′ > 0.'],
        ['Draw the graph on a calculator', 0, 'A graph suggests it, but Excellence needs an algebraic proof.']]),
    ],
  });

  L('tangents', {
    intro: T`The curve is $y = x^2 - 4x + 1$.`,
    parts: [
      { q: T`Find the gradient of the curve at $x = 3$.`, check: num(2),
        model: [S(T`$\dfrac{dy}{dx} = 2x - 4$`), S(T`At $x = 3$: $2(3) - 4 = 2$`, 'Substitute into the derivative', true)],
        earns: 'Achieved: differentiate and substitute correctly.' },
      { q: T`Find the equation of the tangent at $x = 3$, in the form $y = mx + c$.`, check: multi([2, -8], { ordered: true, fmt: 'Give m, then c.' }),
        model: [S(T`$m = 2$ (from part a)`), S(T`$y = 3^2 - 4(3) + 1 = -2$, so the point is $(3, -2)$`, 'The y value comes from the curve', true), S(T`$y - (-2) = 2(x - 3)$`), S(T`$y = 2x - 8$`, 'Full equation', true)],
        earns: 'Merit: you linked the gradient (from calculus) with the point (from the curve) to form the line.' },
      { q: 'The tangent at another point P on the curve passes through the origin. Find the possible coordinates of P.', check: multi([1, -1], { fmt: 'Give the possible x values of P.' }),
        model: [S(T`Let P be $(a,\ a^2 - 4a + 1)$. The gradient there is $2a - 4$.`, 'A general point: the key strategy', true), S(T`Tangent: $y - (a^2 - 4a + 1) = (2a - 4)(x - a)$`), S(T`Through $(0, 0)$: $-(a^2 - 4a + 1) = -a(2a - 4)$`), S(T`$-a^2 + 4a - 1 = -2a^2 + 4a \Rightarrow a^2 = 1$, so $a = \pm 1$`), S('P is (1, −2) or (−1, 6). Check: the tangents are y = −2x and y = −6x, both through the origin ✓', 'Both answers, checked', true)],
        earns: 'Excellence: you devised a strategy (a general point a), followed a chain of reasoning, and found every answer.' },
    ],
    up: [
      up(1, [T`$\dfrac{dy}{dx} = 2x - 4 = 2$ at $x = 3$`, T`So the tangent is $y = 2x$.`], [
        [T`Use the point on the curve, $(3, -2)$, to find $c$: $y = 2x - 8$`, 1, 'Right. The gradient is correct, but a line also needs a point. That link earns Merit.'],
        ['Differentiate again', 0, 'Not needed. The tangent needs the point (3, −2) to find c.'],
        [T`Substitute $x = 3$ into $2x - 4$ again`, 0, 'That gives the gradient again. c comes from the point on the curve.'],
        ['Write it as 2x − y = 0', 0, 'That is the same wrong line. c is missing.']]),
      up(2, [T`Try $x = 1$: the tangent is $y = -2x$, which goes through $(0, 0)$.`, T`So P is $(1, -2)$.`], [
        [T`A general method: use the point $(a, a^2 - 4a + 1)$, which gives $a = \pm 1$, so P can also be $(-1, 6)$`, 1, 'Right. Trial found one answer by luck. Excellence needs a method that finds every answer.'],
        ['Check x = 1 again more carefully', 0, 'x = 1 is right, but there is a second point it missed.'],
        ['Round the answer', 0, 'It is exact. A general method and the second point are missing.'],
        ['Find the gradient at the origin', 0, 'The origin is not on the curve. Use a general point instead.']]),
    ],
  });

  L('turning-points', {
    intro: T`The curve is $y = x^3 - 3x^2 - 9x + 2$.`,
    parts: [
      { q: 'Find the x values of the turning points.', check: multi([-1, 3]),
        model: [S(T`$\dfrac{dy}{dx} = 3x^2 - 6x - 9 = 0$`, 'Turning points: gradient 0'), S(T`$x^2 - 2x - 3 = 0 \Rightarrow (x - 3)(x + 1) = 0$`), S(T`$x = -1$ or $x = 3$`, 'Both', true)],
        earns: 'Achieved: set the derivative to 0 and solve correctly.' },
      { q: 'Find the coordinates of each turning point, and justify whether each is a maximum or a minimum.', check: multi([7, -25], { ordered: true, fmt: 'Give the y value of the maximum, then the minimum.' }),
        model: [S(T`$y(-1) = -1 - 3 + 9 + 2 = 7$ and $y(3) = 27 - 27 - 27 + 2 = -25$`, 'y values from the original curve'), S(T`Gradient either side of $x = -1$: $y'(-2) = 15 > 0$, $y'(0) = -9 < 0$`, 'Positive then negative', true), S('So (−1, 7) is a maximum.'), S(T`Either side of $x = 3$: $y'(2) = -9 < 0$, $y'(4) = 15 > 0$`, 'Negative then positive', true), S('So (3, −25) is a minimum.')],
        earns: 'Merit: you linked the gradient to the shape of the curve to justify each turning point. "It is bigger" is not a justification.' },
      { q: T`For which values of $k$ does $x^3 - 3x^2 - 9x + 2 = k$ have three solutions?`, check: multi([-25, 7], { fmt: 'Give the two boundary values of k.' }),
        model: [S('Solutions are where the horizontal line y = k crosses the curve.', 'Turns the equation into a picture', true), S('The curve rises to a maximum of 7, falls to a minimum of −25, then rises again.'), S('The line crosses three times only between the minimum and maximum. At k = 7 or k = −25 it touches a turning point: two solutions.', 'Explains the boundaries', true), S(T`So $-25 < k < 7$.`, 'Strict inequality', true)],
        earns: 'Excellence: you connected the equation to the graph (a new representation), reasoned about the boundaries, and gave a precise answer.' },
    ],
    up: [
      up(1, ['Turning points at (−1, 7) and (3, −25).', '(−1, 7) is the maximum because 7 is bigger.'], [
        ['A proper justification: the gradient either side (positive then negative at x = −1, negative then positive at x = 3)', 1, 'Right. "Bigger" is not a reason: a local maximum can be lower than a minimum elsewhere. Merit needs the gradient test.'],
        ['The y-intercept', 0, 'Not asked. The justification for each turning point is missing.'],
        ['A sketch with no numbers', 0, 'A sketch alone does not justify it. Show the gradient either side.'],
        ['More decimal places', 0, 'The values are exact. The justification is missing.']]),
      up(2, [T`$k = 7$ or $k = -25$`], [
        [T`A range, with reasons: at 7 and −25 the line only touches (two solutions), so three solutions need $-25 < k < 7$`, 1, 'Right. The turning-point values are the boundaries, not the answer. Excellence needs the reasoning about the graph.'],
        ['The x values of the turning points', 0, 'The question asks for k. Use the y values to build a range.'],
        ['Solve the equation for k = 0', 0, 'That is one case. The answer is a range of k.'],
        ['Give k to 2 decimal places', 0, 'The values are exact. It should be a range between them, with reasons.']]),
    ],
  });

  L('gradient-graphs', {
    intro: T`Here is the graph of $y = f(x)$. It has turning points at $(-1, 2)$ and $(1, -2)$.`,
    fig: G([{ f: cube, col: 'var(--c1)' }], { pts: [{ x: -1, y: 2, label: '(−1, 2)' }, { x: 1, y: -2, label: '(1, −2)', dy: 18 }], alt: 'Cubic with a maximum at (−1, 2) and a minimum at (1, −2)' }),
    parts: [
      { q: T`State the x values where $f'(x) = 0$.`, check: multi([-1, 1]),
        model: [S('The gradient is 0 at the turning points.', 'Turning point means flat'), S(T`$f'(x) = 0$ at $x = -1$ and $x = 1$`, 'Read from the graph', true)],
        earns: 'Achieved: read a key feature from the graph correctly.' },
      { q: T`Which graph shows $y = f'(x)$?`, check: pick(
        [G([{ f: (x) => 3 * x * x - 3, col: 'var(--c3)' }], { w: 220, h: 170, ylabels: false }), 1, ''],
        [G([{ f: (x) => 3 - 3 * x * x, col: 'var(--c3)' }], { w: 220, h: 170, ylabels: false }), 0, 'This is negative outside −1 and 1, but f is increasing there, so f′ must be positive.'],
        [G([{ f: (x) => 3 * x, col: 'var(--c3)' }], { w: 220, h: 170, ylabels: false }), 0, 'A straight line through the origin has only one zero. f′ must be zero at both turning points.']),
        model: [S('f′ is zero at x = −1 and x = 1.', 'Turning points → zeros'), S('f is increasing for x < −1 and x > 1, so f′ is positive there.', 'Increasing → positive', true), S('f is decreasing between −1 and 1, so f′ is negative there.', 'Decreasing → negative', true), S('So f′ is a U-shaped parabola through −1 and 1, lowest at x = 0.')],
        earns: 'Merit: you connected two representations, using where f is increasing and decreasing to build the shape of f′.' },
      { q: T`Where is $f$ decreasing fastest, and what is its gradient there? Then explain why the graph of $y = f(x) + 4$ has exactly the same gradient graph.`, check: num(-3, { fmt: 'Give the steepest gradient.' }),
        model: [S('Decreasing fastest means the most negative gradient: the lowest point of the gradient graph.', 'Translates the words into a feature of f′', true), S(T`Here $f(x) = x^3 - 3x$, so $f'(x) = 3x^2 - 3$, lowest at $x = 0$: $f'(0) = -3$.`), S('So f is decreasing fastest at x = 0 (its point of inflection), with gradient −3.'), S('Adding 4 moves the whole curve up. The steepness at every x is unchanged, so f′ is unchanged. Algebraically, the derivative of the constant 4 is 0.', 'A general statement, with a reason', true)],
        earns: 'Excellence: you interpreted "fastest" as a feature of the gradient graph and gave a general reason, both graphical and algebraic.' },
    ],
    up: [
      up(1, [T`$f'(x)$ is zero at $x = -1$ and $x = 1$.`], [
        ['The signs and shape: positive outside −1 and 1, negative between them, so a U-shaped parabola', 1, 'Right. The zeros are an Achieved fact. Merit links where f increases and decreases to the whole shape of f′.'],
        ['The y values of the turning points', 0, 'Those belong to f, not f′. The signs of f′ between the zeros are missing.'],
        ['The y-intercept of f', 0, 'Not relevant to f′. Describe where f′ is positive and negative.'],
        ['More decimal places', 0, 'The zeros are exact. The signs and shape are missing.']]),
      up(2, ['f is decreasing between x = −1 and x = 1.'], [
        ['Where it is fastest: the lowest point of f′, at x = 0 with gradient −3, plus why f + 4 has the same gradient graph', 1, 'Right. "Decreasing" is true but does not answer "fastest". Excellence needs the exact point and the general reason.'],
        ['The x values where f′ = 0', 0, 'There the gradient is 0: not decreasing at all. Look for the most negative gradient.'],
        ['A sketch of f + 4', 0, 'A sketch alone does not explain. Give the reason: the constant differentiates to 0.'],
        ['The y value at x = 0', 0, 'That is the height, not the gradient. The gradient at x = 0 is −3.']]),
    ],
  });

  L('optimisation', {
    intro: 'A farmer has 120 m of fencing to make a rectangular pen, split into two equal halves by one extra fence parallel to the width x.',
    parts: [
      { q: T`The pen's area is $A = 60x - 1.5x^2$. Find $\dfrac{dA}{dx}$, and the value of $x$ where it is 0.`, check: num(20, { fmt: 'Give x.' }),
        model: [S(T`$\dfrac{dA}{dx} = 60 - 3x$`), S(T`$60 - 3x = 0 \Rightarrow x = 20$`, 'Correct', true)],
        earns: 'Achieved: differentiate and solve.' },
      { q: 'Find the maximum area, and prove it is a maximum.', check: num(600, { fmt: 'Give the area in m².' }),
        model: [S(T`$A(20) = 60(20) - 1.5(20)^2 = 600$ m²`, 'Answer the question: the area'), S(T`$A'(19) = 3 > 0$ and $A'(21) = -3 < 0$`, 'Gradient either side', true), S('Positive then negative, so x = 20 gives a maximum: 600 m².', 'Justified conclusion', true)],
        earns: 'Merit: you used the model to answer the question and justified that it is a maximum.' },
      { q: 'Show where the area formula comes from. Then the farmer puts the pen against a long hedge, so one long side needs no fence. Find the new maximum area.', check: num(1200, { fmt: 'Give the area in m².' }),
        model: [S(T`Original: 3 widths + 2 lengths $= 120$, so $l = 60 - 1.5x$ and $A = x(60 - 1.5x) = 60x - 1.5x^2$ ✓`, 'Forms the model from the context', true), S(T`Against the hedge: $3x + l = 120$, so $l = 120 - 3x$`, 'A new model', true), S(T`$A = 120x - 3x^2$, $\dfrac{dA}{dx} = 120 - 6x = 0 \Rightarrow x = 20$`), S(T`$A'(19) = 6 > 0$, $A'(21) = -6 < 0$: a maximum`), S('Pens 20 m wide and 60 m long: 1200 m², double the area for the same fencing.', 'Answer in context, with insight', true)],
        earns: 'Excellence: you formed the models yourself from the description, optimised, justified, and drew a conclusion in context.' },
    ],
    up: [
      up(1, [T`$x = 20$, so $A = 60(20) - 1.5(20)^2 = 600$ m².`], [
        ['A proof that it is a maximum: the gradient is positive before x = 20 and negative after', 1, 'Right. The question says "prove it is a maximum". Merit needs that justification.'],
        ['The length of the pen', 0, 'Nice to know, but the proof of a maximum is what is missing.'],
        ['Units', 0, 'The units are there. The proof is missing.'],
        ['A second value of x', 0, 'There is only one turning point. The proof it is a maximum is missing.']]),
      up(2, [T`$A = 120x - 3x^2$`, T`$A' = 120 - 6x = 0$, so $x = 20$.`], [
        ['Finish in context: justify the maximum and give the dimensions (20 m by 60 m) and the area, 1200 m²', 1, 'Right. x = 20 is not the answer to "find the new maximum area". Excellence needs the full conclusion.'],
        ['Write x = 20 m', 0, 'Units help, but the area is still missing, and so is the justification.'],
        ['Differentiate again', 0, 'That could justify the maximum, but the area and dimensions are still missing.'],
        ['Check x = 20 in the formula from part (a)', 0, 'The formula changed for the hedge. Use the new one and finish the answer.']]),
    ],
  });

  L('antidiff', {
    intro: 'Anti-differentiation reverses the power rule. Every answer needs + c until a point fixes it.',
    parts: [
      { q: T`Find $\displaystyle\int (6x^2 - 4x + 3)\, dx$.`, check: multi([2, -2, 3], { ordered: true, fmt: T`The answer is $ax^3 + bx^2 + dx + c$. Give $a$, $b$ and $d$.` }),
        model: [S('Add one to each power, then divide by the new power.', 'Reverse power rule'), S(T`$= 2x^3 - 2x^2 + 3x + c$`, 'Including + c', true)],
        earns: 'Achieved: the method, applied correctly, with + c.' },
      { q: T`A curve has gradient $\dfrac{dy}{dx} = 6x^2 - 4x + 3$ and passes through $(1, 4)$. Find its equation.`, check: num(1, { fmt: 'Give the constant c.' }),
        model: [S(T`$y = 2x^3 - 2x^2 + 3x + c$`), S(T`$4 = 2 - 2 + 3 + c$`, 'Use the point to find c', true), S(T`$c = 1$, so $y = 2x^3 - 2x^2 + 3x + 1$`, 'The full equation', true)],
        earns: 'Merit: you linked the gradient function with a point to find the particular curve.' },
      { q: T`A water tank holds 800 L. Water leaks out at a slowing rate: $\dfrac{dV}{dt} = 3t - 60$ litres per minute, until the leak stops. Show the tank never empties, and find the least volume of water in it.`, check: num(200, { fmt: 'Give the least volume in litres.' }),
        model: [S(T`$V = 1.5t^2 - 60t + c$, and $V = 800$ at $t = 0$, so $c = 800$`, 'Find c from the start'), S(T`Empty when $1.5t^2 - 60t + 800 = 0$: $b^2 - 4ac = 3600 - 4800 < 0$`, 'Uses the discriminant', true), S('No real solution, so the volume never reaches 0.', 'Interprets it', true), S(T`The leak stops when $\dfrac{dV}{dt} = 0$: $t = 20$ min. $V(20) = 600 - 1200 + 800 = 200$ L`, 'The least volume'), S('The tank never empties. It falls to 200 L after 20 minutes, when the leak stops.', 'Conclusion in context', true)],
        earns: 'Excellence: you combined anti-differentiation with the discriminant in a strategy, interpreted "no solution" correctly, and concluded in context.' },
    ],
    up: [
      up(1, [T`$y = 2x^3 - 2x^2 + 3x$`], [
        [T`$+\,c$, then use the point $(1, 4)$ to find $c = 1$`, 1, 'Right. Without + c the curve might not pass through (1, 4). Using the point is the Merit step.'],
        ['Differentiate it to check', 0, 'It would differentiate back correctly, but it still misses + c and the point.'],
        ['Simplify it', 0, 'It is already simple. The constant is missing.'],
        ['The gradient at (1, 4)', 0, 'Not asked. The constant c is missing.']]),
      up(2, [T`$V = 1.5t^2 - 60t + 800$`, T`$V = 0$ has no solution, so the question must have an error.`], [
        ['Interpret it: no solution means the tank never empties; the leak stops at t = 20, leaving 200 L', 1, 'Right. "No solution" is the answer to "show it never empties". Excellence needs that interpretation and the least volume.'],
        ['Use a different value of c', 0, 'c = 800 is correct. Interpret the result instead.'],
        ['Solve with the quadratic formula anyway', 0, 'It has no real solutions. Say what that means.'],
        ['Round the numbers', 0, 'Rounding does not help. Explain the meaning and find the least volume.']]),
    ],
  });

  L('kinematics', {
    intro: T`A remote-control car moves along a straight track. Its velocity is $v = 6 + 4t - t^2$ m/s, for $0 \le t \le 6$ seconds. It starts at $s = 0$.`,
    parts: [
      { q: T`Find its acceleration at $t = 1$.`, check: num(2, { fmt: 'Give the acceleration in m/s².' }),
        model: [S(T`$a = \dfrac{dv}{dt} = 4 - 2t$`, 'Differentiate velocity'), S(T`$a(1) = 4 - 2 = 2$ m/s²`, 'Correct, with units', true)],
        earns: 'Achieved: differentiate and substitute.' },
      { q: 'Find its maximum velocity, and show it is a maximum.', check: num(10, { fmt: 'Give the velocity in m/s.' }),
        model: [S(T`$a = 4 - 2t = 0 \Rightarrow t = 2$`), S(T`$v(2) = 6 + 8 - 4 = 10$ m/s`, 'The answer asked for', true), S('a > 0 before t = 2 and a < 0 after, so v is a maximum: 10 m/s at t = 2 s.', 'Justified', true)],
        earns: 'Merit: a logical sequence (a = 0, then v), with a justified conclusion.' },
      { q: 'Find its displacement at t = 6, and explain why this is not the total distance it travels. Find the total distance, to 1 decimal place.', check: num(40.83036880224505, { dp: 1, fmt: 'Give the total distance in m.' }),
        model: [S(T`$s = 6t + 2t^2 - \tfrac{1}{3}t^3 + c$, and $s(0) = 0$ gives $c = 0$`), S(T`$s(6) = 36 + 72 - 72 = 36$ m`), S(T`But $v = 0$ when $t^2 - 4t - 6 = 0$: $t = 2 + \sqrt{10} = 5.16$ s. After that $v < 0$: the car reverses.`, 'Notices the change of direction', true), S(T`$s(5.16) = 38.42$ m, so it goes 38.42 m forward, then 2.42 m back.`), S('Total distance = 38.42 + 2.42 = 40.8 m, more than the displacement of 36 m.', 'Distance vs displacement, explained', true)],
        earns: 'Excellence: you identified the relevant concept (a change of direction), followed it through, and explained the difference between distance and displacement.' },
    ],
    up: [
      up(1, [T`$a = 4 - 2t = 0$, so $t = 2$ s.`], [
        ['Finish: the maximum velocity is v(2) = 10 m/s, with a reason it is a maximum', 1, 'Right. t = 2 is when, not what. The question asks for the maximum velocity and a justification.'],
        ['The acceleration at t = 2', 0, 'That is 0, already used. The velocity v(2) is missing.'],
        ['Units on t', 0, 'The units are there. The maximum velocity is missing.'],
        ['Integrate to get s', 0, 'Not needed here. Find v(2) and justify it.']]),
      up(2, [T`$s = 6t + 2t^2 - \tfrac{1}{3}t^3$`, T`$s(6) = 36$ m, so the car travels 36 m.`], [
        ['Check for a change of direction: v = 0 at t = 5.16 s, so it reverses; the total distance is 38.42 + 2.42 = 40.8 m', 1, 'Right. Displacement is not distance when the object turns back. Spotting that is the Excellence step.'],
        ['Add the constant c', 0, 'c = 0 here, so that changes nothing. The change of direction is missing.'],
        ['Find the acceleration at t = 6', 0, 'Not needed. Check whether the velocity changes sign.'],
        ['Give 36 m to 1 dp', 0, 'Accuracy is not the problem. 36 m is the displacement, not the distance.']]),
    ],
  });

  /* ======================= PROBABILITY (AS 91267) ======================= */

  L('trees', {
    intro: 'At a school, 60% of students bike to school. Of those who bike, 25% are late at least once a week. Of those who do not bike, 10% are.',
    fig: P.svg.tree([{ label: 'Bike', p: '0.6' }, { label: 'No bike', p: '0.4' }], [[{ label: 'Late', p: '0.25' }, { label: 'Not', p: '0.75' }], [{ label: 'Late', p: '0.1' }, { label: 'Not', p: '0.9' }]]),
    parts: [
      { q: 'Find the probability that a student bikes and is late.', check: num(0.15),
        model: [S(T`$0.6 \times 0.25 = 0.15$`, 'Multiply along the branches', true)],
        earns: 'Achieved: multiply along a path correctly.' },
      { q: 'A student is late. Find the probability that they bike.', check: num(0.15 / 0.19, { dp: 4 }),
        model: [S(T`$P(\text{late})$ $= 0.6 \times 0.25 + 0.4 \times 0.1 = 0.19$`, 'Add both late paths'), S(T`$P(\text{bike} \mid \text{late})$ $= \dfrac{0.15}{0.19} = 0.7895$`, 'Conditional: divide by P(late)', true)],
        earns: 'Merit: you recognised a conditional probability and linked two calculations to find it.' },
      { q: 'The school wants the overall rate of late students down to 15%. If the rate for students who do not bike stays at 10%, what must the late rate for bikers fall to?', check: num(0.11 / 0.6, { dp: 4, fmt: 'Give it as a probability to 4 decimal places.' }),
        model: [S(T`Let the bikers' late rate be $p$: $0.6p + 0.4 \times 0.1 = 0.15$`, 'Builds an equation from the tree', true), S(T`$0.6p = 0.11$, so $p = 0.1833$`), S('The bikers’ late rate must fall from 25% to about 18.3%.', 'Answer in context', true), S('Check: 0.6 × 0.183 + 0.04 = 0.15 ✓')],
        earns: 'Excellence: you turned the tree into a general equation with an unknown (a strategy) and answered in context.' },
    ],
    up: [
      up(1, [T`$P(\text{bike and late}) = 0.6 \times 0.25 = 0.15$`], [
        [T`It is conditional ("a student is late"): divide by $P(\text{late}) = 0.19$ to get 0.7895`, 1, 'Right. 0.15 answers a different question. Spotting "given late" and dividing is the Merit step.'],
        ['Multiply by 0.4 as well', 0, 'That has no meaning here. Divide by P(late) instead.'],
        ['Add 0.25 and 0.1', 0, 'Those are from different groups. Divide 0.15 by P(late) = 0.19.'],
        ['Write it as a percentage', 0, 'The form is fine. The calculation answers the wrong question.']]),
      up(2, ['Try 20%: 0.6 × 0.2 + 0.04 = 0.16.', 'Try 18%: 0.6 × 0.18 + 0.04 = 0.148.', 'So between 18% and 20%.'], [
        ['An equation: 0.6p + 0.04 = 0.15, so p = 0.1833 (18.3%), stated in context', 1, 'Right. Trial and error narrows it down. Excellence needs a strategy that gives the exact answer.'],
        ['Try 19% as well', 0, 'More trials still only estimate. Form an equation.'],
        ['Round to 20%', 0, 'That gives 16% overall, too high. Solve the equation exactly.'],
        ['Draw a bigger tree', 0, 'The tree is fine. Use it to form an equation with p.']]),
    ],
  });

  const TW = P.svg.table(['', '8+ hours sleep', 'Less than 8', 'Total'], [['Phone in bedroom', 52, 98, 150], ['No phone', 30, 20, 50], ['Total', 82, 118, 200]]);
  L('two-way', {
    intro: '200 Year 12 students were asked whether they keep their phone in their bedroom at night, and how much sleep they usually get.',
    fig: TW,
    parts: [
      { q: 'One student is chosen at random. Find the probability they keep a phone in the bedroom and get 8+ hours of sleep.', check: num(0.26),
        model: [S(T`$\dfrac{52}{200} = 0.26$`, 'Out of everyone: 200', true)],
        earns: 'Achieved: read the table and use the right total.' },
      { q: 'Find the probability of less than 8 hours of sleep for students with a phone in the bedroom, and for students without. Compare them.', check: multi([98 / 150, 0.4], { ordered: true, dp: 2, fmt: 'Give the phone group, then the no-phone group.' }),
        model: [S(T`With a phone: $\dfrac{98}{150} = 0.65$`, 'Out of the phone row only', true), S(T`Without: $\dfrac{20}{50} = 0.40$`), S('Students with a phone in the bedroom were more likely to get less than 8 hours of sleep (65% vs 40%).', 'Comparison in context', true)],
        earns: 'Merit: conditional probabilities from the right rows, and a comparison in context.' },
      { q: 'A parent says: "Most students who get 8+ hours keep a phone in their room, so phones don’t hurt sleep." Find the probability behind their claim, then evaluate the claim.', check: num(52 / 82, { dp: 2, fmt: 'Give P(phone | 8+ hours) to 2 dp.' }),
        model: [S(T`$P(\text{phone} \mid 8+) = \dfrac{52}{82} = 0.6341$, so the "most" is true.`, 'Checks the claim’s number'), S('But 150 of the 200 students (75%) keep a phone, so most of any group will have one.', 'Explains why the number misleads', true), S(T`Compare the groups instead: 8+ hours for $\tfrac{52}{150} = 35\%$ with a phone vs $\tfrac{30}{50} = 60\%$ without.`, 'The right comparison', true), S('So the data does not support the claim: it shows an association between phones and less sleep. It cannot prove phones cause it (other factors, one sample).', 'Justified, qualified conclusion', true)],
        earns: 'Excellence: you evaluated a claim with the right conditional probabilities, explained why the claim’s figure misleads, and qualified the conclusion.' },
    ],
    up: [
      up(1, [T`$P(\text{phone and less than 8}) = \dfrac{98}{200} = 0.49$`], [
        ['Use the phone row as the total (98/150 = 0.65), do the same for no phone (0.40), and compare', 1, 'Right. "For students with a phone" means divide by that group, 150. Then the comparison earns Merit.'],
        ['Divide by 118 instead', 0, 'That would be "given less than 8 hours", the wrong way round. Divide by the phone total, 150.'],
        ['Add the no-phone students', 0, 'That mixes the groups. Work out each group separately, then compare.'],
        ['Write it as a percentage', 0, 'The form is fine. The total used is wrong for "students with a phone".']]),
      up(2, [T`$\dfrac{52}{82} = 0.6341$, so 63% of students who sleep well have a phone.`, 'The parent is right.'], [
        ['Compare the groups the right way round (35% with a phone get 8+ hours vs 60% without), note 75% have phones, and qualify: association, not cause', 1, 'Right. The 63% mostly reflects how many students have phones. Excellence needs the right comparison and a qualified conclusion.'],
        ['Round 0.6341 to 0.6', 0, 'The number is right. The reasoning about it is what is missing.'],
        ['Find the probability of no phone', 0, 'That alone does not evaluate the claim. Compare sleep within each group.'],
        ['Survey more students', 0, 'More data could help later, but this data already contradicts the claim. Show how.']]),
    ],
  });

  L('relative-risk', {
    intro: '400 people were followed through one winter.',
    fig: P.svg.table(['', 'Got flu', 'No flu', 'Total'], [['Vaccinated', 15, 235, 250], ['Not vaccinated', 27, 123, 150], ['Total', 42, 358, 400]]),
    parts: [
      { q: 'Find the risk of flu for people who were vaccinated.', check: num(0.06),
        model: [S(T`$\dfrac{15}{250} = 0.06$`, 'Out of the vaccinated group', true)],
        earns: 'Achieved: the risk for one group, from the right total.' },
      { q: 'Find the relative risk of flu for unvaccinated people compared with vaccinated people, and interpret it.', check: num(3),
        model: [S(T`Unvaccinated risk $= \dfrac{27}{150} = 0.18$`), S(T`$\text{RR} = \dfrac{0.18}{0.06} = 3$`, 'The group named first goes on top', true), S('Unvaccinated people were 3 times as likely to get flu as vaccinated people.', 'Interpretation in context', true)],
        earns: 'Merit: you compared risks (not counts), put the right group on top, and interpreted the result in context.' },
      { q: 'A news story says: "The flu vaccine cuts your chance of getting flu by two-thirds." Use the data to evaluate this claim.', check: num(1 / 3, { dp: 2, fmt: 'Give the relative risk for vaccinated compared with unvaccinated, to 2 dp.' }),
        model: [S(T`$\text{RR} = \dfrac{0.06}{0.18} = 0.33$, so the vaccinated risk is one-third of the unvaccinated risk.`, 'The right RR for this claim'), S('A drop from 18% to 6% is a cut of two-thirds, so the numbers support the claim for this group.', 'Links the number to the claim', true), S('But: this is one winter and one group of 400. People chose whether to be vaccinated, so the groups may differ in other ways (age, health, caution).', 'Questions the data', true), S('"Your chance" is a claim about individuals; the data shows a group average. Conclusion: consistent with the data, but not proof that the vaccine causes the whole difference.', 'Qualified conclusion', true)],
        earns: 'Excellence: the claim is evaluated with the right number, linked to the claim’s wording, and qualified with sound reasons about how the data was collected.' },
    ],
    up: [
      up(1, ['27 − 15 = 12 more unvaccinated people got flu.'], [
        ['Compare risks, not counts: 0.18 ÷ 0.06 = 3, so unvaccinated people were 3 times as likely to get flu', 1, 'Right. The groups are different sizes (150 vs 250), so counts mislead. Relative risk, interpreted, earns Merit.'],
        ['Use 42 as the total', 0, '42 is everyone who got flu. Each risk uses its own group total.'],
        ['Subtract the risks: 0.18 − 0.06', 0, 'That is a difference in risk, not a relative risk. Divide them.'],
        ['Write 12 as a percentage', 0, 'Counts are still the problem. Work out each group’s risk.']]),
      up(2, [T`$\text{RR} = \dfrac{0.06}{0.18} = 0.33$, so the claim is true.`], [
        ['Link 0.33 to "two-thirds", then question the data (one winter, people chose to be vaccinated, group vs individual) and qualify the conclusion', 1, 'Right. The number supports the claim, but Excellence also weighs how far this data can be trusted.'],
        ['Use 3 instead of 0.33', 0, 'Either way round works if explained. What is missing is the evaluation.'],
        ['Round 0.33 to 0.3', 0, 'Accuracy is not the issue. The evaluation is missing.'],
        ['Find the risk for everyone: 42/400', 0, 'That does not compare the groups. The evaluation is missing.']]),
    ],
  });

  L('expected-value', {
    intro: T`At the school fair it costs ${$$(3)} to spin a wheel. You win ${$$(20)} with probability 0.05, ${$$(5)} with probability 0.2, and otherwise nothing.`,
    parts: [
      { q: 'Find the expected winnings per spin, in dollars.', check: num(2),
        model: [S(T`$E = 20 \times 0.05 + 5 \times 0.2 + 0 \times 0.75$`, 'Each value × its probability'), S(T`$= 1 + 1 = 2$, so ${$$(2)} per spin`, 'Correct', true)],
        earns: 'Achieved: expected value calculated correctly.' },
      { q: 'How much profit should the school expect from 300 spins?', check: num(300, { fmt: 'Give the profit in dollars.' }),
        model: [S(T`Profit per spin $= 3 - 2 = 1$ dollar`, 'Cost minus expected payout', true), S(T`$300 \times 1 = 300$`), S(`The school should expect about ${$$(300)} profit.`, 'Answer in context', true)],
        earns: 'Merit: you linked expected value to profit and scaled it to the context.' },
      { q: `The committee wants a bigger top prize but still to expect at least ${$$(150)} from 300 spins. What is the largest top prize they can offer? Comment on the risk.`, check: num(30, { fmt: 'Give the top prize in dollars.' }),
        model: [S(T`Profit per spin must be at least $150 \div 300 = 0.50$ dollars.`, 'Turns the target into a condition', true), S(T`Top prize $T$: $3 - (0.05T + 1) \ge 0.5$`, 'A general inequality'), S(T`$0.05T \le 1.5$, so $T \le 30$`), S(`The largest top prize is ${$$(30)}.`), S(`${$$(150)} is only the expected profit. With a bigger prize the results vary more, so the actual profit could easily be lower.`, 'Insight about expected value', true)],
        earns: 'Excellence: you devised a strategy (a general inequality) and showed insight into what "expected" does and does not guarantee.' },
    ],
    up: [
      up(1, [`Expected winnings = ${$$(2)} per spin.`], [
        [`Link it to profit: the school keeps ${$$(3)} − ${$$(2)} = ${$$(1)} per spin, so about ${$$(300)} from 300 spins`, 1, 'Right. That only repeats part (a). Merit links it to profit and the 300 spins.'],
        ['Multiply 2 by 300', 0, `That is the expected payout, ${$$(600)}, not the profit.`],
        ['Add the cost: 2 + 3', 0, 'Profit is cost minus payout, not the sum.'],
        ['Use the probability 0.75', 0, 'That branch pays nothing, so it adds 0. Work out the profit per spin.']]),
      up(2, [`Try ${$$(30)}: 0.05 × 30 + 1 = 2.5, so the profit is 0.5 × 300 = ${$$(150)}.`, `So ${$$(30)}.`], [
        [`A general method (an inequality giving T ≤ 30) and the comment that ${$$(150)} is expected, not guaranteed`, 1, 'Right. A lucky trial hit the answer. Excellence needs a strategy and insight into the risk.'],
        [`Try ${$$(35)} as well`, 0, 'More trials do not make a method. Set up an inequality.'],
        ['Find the probability of winning', 0, 'Not needed. A general method and the risk comment are missing.'],
        ['Round the profit', 0, 'It is exact. What is missing is the method and the comment.']]),
    ],
  });

  L('normal', {
    intro: 'Kiwifruit weights are normally distributed with mean 105 g and standard deviation 8 g.',
    fig: P.svg.normal(105, 8, { shade: [95, 120], marks: [{ x: 95, label: '95' }, { x: 105, label: '105' }, { x: 120, label: '120' }] }),
    parts: [
      { q: 'Find the probability that a kiwifruit weighs less than 95 g.', check: num(P.Phi(-1.25), { dp: 4 }),
        model: [S(T`$P(X < 95)$, with $\mu = 105$, $\sigma = 8$`, 'Write what you are finding'), S(T`$= 0.1056$`, 'Calculator, normal cdf', true)],
        earns: 'Achieved: a correct normal probability.' },
      { q: 'Kiwifruit between 95 g and 120 g are sold as premium. How many premium kiwifruit would you expect in a tray of 30? Give 1 decimal place.', check: num(30 * (P.Phi(1.875) - P.Phi(-1.25)), { dp: 1 }),
        model: [S(T`$P(95 < X < 120) = 0.8640$`), S(T`Expected number $= 30 \times 0.8640 = 25.9$`, 'Multiply by the number in the tray', true), S('About 26 premium kiwifruit in a tray of 30.', 'Answer in context', true)],
        earns: 'Merit: you linked the probability to an expected number and answered in context.' },
      { q: 'A packer claims "1 in 20 kiwifruit weighs over 120 g." Evaluate this using the model. Then the grower weighs 500 kiwifruit and finds 22 over 120 g. What does this suggest about the model?', check: num(1 - P.Phi(1.875), { dp: 4, fmt: 'Give P(X > 120) to 4 dp.' }),
        model: [S(T`$P(X > 120) = 0.0304$, about 1 in 33`, 'The model’s figure'), S('1 in 20 is 0.05, so by the model the claim overstates it.', 'Evaluates the claim with numbers', true), S(T`Data: $\dfrac{22}{500} = 0.044$, which is more than the model’s 0.030.`), S('The real data has more heavy kiwifruit than the model predicts. The upper tail may be longer, or the standard deviation larger, so the model may underestimate heavy fruit. But one sample of 500 can differ by chance (the model expects about 15), so more data would be needed to be sure.', 'Compares the model with the data, with caution', true)],
        earns: 'Excellence: you evaluated a claim with the model, compared the model with real data, and drew a reasoned conclusion about the model itself.' },
    ],
    up: [
      up(1, [T`$P(95 < X < 120) = 0.8640$`], [
        ['Use it: 30 × 0.8640 = 25.9, so about 26 premium kiwifruit per tray', 1, 'Right. The probability is correct, but the question asks how many in a tray.'],
        ['More decimal places', 0, 'The accuracy is fine. The expected number in the tray is missing.'],
        ['The z-scores', 0, 'Showing working is good, but the expected number is still missing.'],
        ['Subtract it from 1', 0, 'That would be the non-premium fraction. Multiply by 30 instead.']]),
      up(2, [T`$P(X > 120) = 0.0304$, which is 3%, so the claim is wrong.`], [
        ['Compare the model with the grower’s data (4.4% observed vs 3.0%) and say what that suggests about the model', 1, 'Right. The question has a second half. Excellence needs the model checked against real data, with a reasoned conclusion.'],
        ['Round to 0.03', 0, 'Accuracy is not the issue. The comparison with the data is missing.'],
        ['Find P(X < 95) too', 0, 'Not asked. Compare the model with the 22 out of 500.'],
        ['Say the packer is lying', 0, 'Not a statistical conclusion. Compare the model, the claim and the data.']]),
    ],
  });

  L('inverse-normal', {
    intro: 'A machine fills bottles. The volumes are normally distributed.',
    parts: [
      { q: 'With mean 500 mL and standard deviation 4 mL, find the volume that only 5% of bottles are below. Give 1 decimal place.', check: num(500 + 4 * P.invPhi(0.05), { dp: 1 }),
        model: [S(T`$P(X < x) = 0.05$, $\mu = 500$, $\sigma = 4$`, 'Area to the left'), S(T`$x = 493.4$ mL`, 'Calculator, inverse normal', true)],
        earns: 'Achieved: inverse normal used correctly.' },
      { q: 'A new machine also has mean 500 mL, but 2% of bottles are under 492 mL. Find its standard deviation, to 2 decimal places.', check: num(-8 / P.invPhi(0.02), { dp: 2 }),
        model: [S(T`$P(X < 492) = 0.02$, so $z = -2.0537$`, 'Inverse normal on the standard normal'), S(T`$z = \dfrac{x - \mu}{\sigma}$: $-2.0537 = \dfrac{492 - 500}{\sigma}$`, 'Links z to the unknown σ', true), S(T`$\sigma = \dfrac{-8}{-2.0537} = 3.90$ mL`, 'Solved', true)],
        earns: 'Merit: you linked the z-score to the unknown and solved for σ: a logical sequence of steps.' },
      { q: 'The rules say no more than 1% of bottles can be under 492 mL. The standard deviation cannot be reduced below 3.9 mL. What mean should the company set, and what does this cost?', check: num(492 - 3.9 * P.invPhi(0.01), { dp: 1, fmt: 'Give the mean in mL to 1 dp.' }),
        model: [S('With σ fixed, the only thing to change is the mean: move the curve to the right.', 'Strategy', true), S(T`1% below 492: $z = -2.3263$`), S(T`$-2.3263 = \dfrac{492 - \mu}{3.9} \Rightarrow \mu = 492 + 2.3263 \times 3.9 = 501.1$ mL`), S('The average fill rises from 500 to 501.1 mL: about 1.1 mL more per bottle, or 1.1 L extra per 1000 bottles, to meet the rule.', 'The cost, in context', true)],
        earns: 'Excellence: you chose the strategy (move the mean), solved for it, and explained the consequence in context.' },
    ],
    up: [
      up(1, [T`$P(X < 492) = 0.02$, so $z = -2.054$.`], [
        [T`Use $z = \dfrac{x - \mu}{\sigma}$ with $x = 492$ and $\mu = 500$, then solve: $\sigma = 3.90$ mL`, 1, 'Right. The z-score is the first step. Linking it to σ and solving is what earns Merit.'],
        ['More decimal places on z', 0, 'z is accurate enough. It still has to be used to find σ.'],
        [T`Square the z-score`, 0, 'Not needed. Use z = (x − μ)/σ to find σ.'],
        ['Find P(X > 492)', 0, 'That is 0.98, not needed. Use the z-score to find σ.']]),
      up(2, [T`$\mu = 492 + 2.326 \times 3.9 = 501.1$ mL`], [
        ['Explain the strategy (σ is fixed, so move the mean up) and the cost: about 1.1 mL more in every bottle', 1, 'Right. The number is correct. Excellence also needs the reasoning and the consequence in context.'],
        ['Use σ = 3.90 instead of 3.9', 0, 'That changes nothing that matters. The explanation and the cost are missing.'],
        ['Round to 501 mL', 0, 'Rounding down breaks the 1% rule. Keep 501.1, then explain the cost.'],
        ['Find the new median', 0, 'For a normal distribution it equals the mean. The cost is missing.']]),
    ],
  });

  L('distributions', {
    intro: 'Daily phone use (minutes) for two groups of Year 12 students. Group A uses app time limits; Group B does not.',
    fig: boxes([{ name: 'Group A (limits): mean 112', five: [40, 85, 110, 130, 210], col: 'var(--c1)' }, { name: 'Group B (no limits): mean 162', five: [50, 120, 150, 195, 330], col: 'var(--c2)' }], 0, 350, 50, 'minutes'),
    parts: [
      { q: 'Which group has the higher median, and by how many minutes?', check: num(40, { fmt: 'Give the difference in minutes.' }),
        model: [S('Medians: A = 110, B = 150 minutes.', 'Read the middle lines'), S('Group B’s median is 40 minutes higher.', 'Correct, with the size', true)],
        earns: 'Achieved: read and compare a measure of centre.' },
      { q: 'Compare the spreads using the interquartile range.', check: multi([45, 75], { ordered: true, fmt: 'Give the IQR for A, then B.' }),
        model: [S('IQR A = 130 − 85 = 45 minutes; IQR B = 195 − 120 = 75 minutes.', 'Calculated, not eyeballed', true), S('Group B’s daily phone use is more spread out: its middle 50% covers 75 minutes, compared with 45 for Group A.', 'Comparison with numbers, in context', true)],
        earns: 'Merit: the comparison uses calculated values and is written in context.' },
      { q: 'Compare the two distributions fully. Which measure of centre is better for comparing them?', check: pick(
        ['The median, because Group B is skewed to the right', 1, ''],
        ['The mean, because it uses every value', 0, 'The mean is pulled up by Group B’s long right tail (mean 162 vs median 150), so it overstates typical use.'],
        ['The mode, because it is the most common value', 0, 'The mode is not shown and is unreliable for data like this. The median resists the skew.'],
        ['The range, because it shows the extremes', 0, 'The range measures spread, not centre.']),
        model: [S('Shape (from the box plots): A is roughly symmetric, with the median near the middle of the box and similar whiskers; its mean 112 ≈ median 110 agrees. B is skewed to the right, with a long upper whisker to 330, which is also why its mean (162) is above its median (150).', 'Shape read from the graph, backed by numbers', true), S('So compare centres with the median: B is typically 40 minutes higher.', 'Justifies the choice of measure', true), S('Spread: B is more variable (IQR 75 vs 45; range 280 vs 170).'), S('In context: students with app limits tended to use their phones less, and more consistently. This is an observational comparison, so the limits may not be the cause.', 'Conclusion in context, qualified', true)],
        earns: 'Excellence: all three features (shape, centre, spread) compared with numbers, a justified choice of measure, and a qualified conclusion in context.' },
    ],
    up: [
      up(1, ['Group B has a bigger spread.'], [
        ['Numbers and context: IQR 45 minutes for A vs 75 for B, so B’s daily phone use is more variable', 1, 'Right. "Bigger" with no numbers is Achieved at best. Merit needs calculated values in context.'],
        ['Say which group has the higher median', 0, 'That is centre, not spread. The IQR values are missing.'],
        ['Use the word "variability"', 0, 'A better word without numbers is still not enough. Calculate the IQRs.'],
        ['Draw the boxes bigger', 0, 'The plot is fine. The numbers are missing.']]),
      up(2, ['B’s median is 40 minutes higher than A’s.', 'B’s IQR is 30 minutes bigger.'], [
        ['Shape too (B skewed right, shown by mean > median), a reason for using the median, and a qualified conclusion in context', 1, 'Right. Centre and spread are there. Excellence needs shape, a justified measure and a conclusion in context.'],
        ['The means as well', 0, 'The means help only if used to explain the skew. Shape and a conclusion are missing.'],
        ['The sample sizes', 0, 'Worth noting, but the shape and the conclusion are still missing.'],
        ['A dot plot', 0, 'Another graph adds nothing. Shape and a conclusion are missing.']]),
    ],
  });

  // P.upgradeQ (Upgrade this answer questions) is in shared/js/quiz.js
})();
