/* AS 91222 (Economics 2.1) Analyse inflation using economic concepts and models.
   The exam (three questions) uses the AS/AD model and the quantity theory of money, the CPI, and the effects of
   inflation on groups. Exam tips draw on the 2023–2025 NZQA assessment reports. */
(function () {
  const P = NP, R = P.R, E = P.econ, MD = P.econ.models;
  const C = (at, html) => ({ at, html });
  const L = (at, html, note, o = {}) => Object.assign({ at, html: `<span class="bq">${html}</span>`, note }, o);
  const S = (m, note, key) => ({ m, note, key: !!key });
  const up = (part, shown, choices, ask) => ({ part, shown, ask, choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });
  const St = (say, m) => ({ say, m });
  const $ = (v) => P.money(v);
  // a "shift the curve" question
  const shift = (prompt, model, answer, steps, o = {}) => ({ kind: 'shift', prompt, model, answer, accept: o.accept, why: o.why, wrong: o.wrong, more: { idea: o.idea, steps: steps.map((s) => St(s)), trap: o.trap } });
  P.econ.shiftQ = shift;

  /* ======================= 1. Measuring inflation: the CPI ======================= */
  const BASKETS = [
    { items: [['Bread', 3.5, 4.2, 20], ['Petrol (litre)', 2.6, 2.9, 30], ['Rent (week)', 520, 560, 1], ['Bus fare', 2.8, 3.0, 40]] },
    { items: [['Milk (2 L)', 4.2, 4.8, 10], ['Power (unit)', 0.32, 0.36, 300], ['Movie ticket', 18, 19, 2], ['Haircut', 35, 40, 1]] },
  ];
  P.addUnit({
    id: 'cpi', title: 'Measuring inflation: the CPI', mins: 10,
    blurb: 'A basket of goods and services, weighted, compared with a base year. Then the percentage change.',
    recap: 'Inflation is a sustained increase in the general price level. In New Zealand it is measured by the Consumers Price Index (CPI). Stats NZ prices a fixed basket of goods and services bought by a typical household, weighted by how much households spend on each. The cost of the basket is compared with its cost in the base period, which is set to 1000: CPI = (cost of basket now ÷ cost in the base period) × 1000. The inflation rate is the percentage change in the CPI, usually over a year: (new CPI − old CPI) ÷ old CPI × 100.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>The basket</h2>'), C(3, '<p>Stats NZ tracks the prices of hundreds of goods and services a typical household buys: food, rent, petrol, power, haircuts.</p>'), C(8, '<p>Each item is <b>weighted</b> by how much of a household budget it takes. Rent matters more than movie tickets.</p>')],
        board: [L(0.5, 'cost of the basket in the base period: <b>1000</b>'), L(3, 'cost of the same basket now, compared with it'), L(6, 'CPI = cost now ÷ cost in base period × 1000', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>The inflation rate</h2>'), C(3, '<p>The percentage change in the CPI over a year.</p>'), C(7.5, '<p>The Reserve Bank aims to keep annual CPI inflation between 1% and 3%.</p>')],
        board: [L(0.5, 'CPI last year: 1260'), L(2.5, 'CPI this year: 1302'), L(5, 'inflation = (1302 − 1260) ÷ 1260 × 100'), L(7.5, '= 3.3%', 'above the 1–3% target', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>What the CPI does not show</h2>'), C(3, '<p>It is an average. A household that rents and drives a lot may face more inflation than the CPI says.</p>')],
        board: [L(0.5, 'an average household, not yours'), L(2.5, 'the basket changes only every few years'), L(4.5, 'quality changes are hard to price')] },
    ],
    example: {
      problem: 'The CPI was 1240 in June 2025 and 1283 in June 2026. Calculate the annual inflation rate and say what it means.',
      steps: [
        { m: 'Change in the CPI: 1283 − 1240 = 43.', note: 'difference first' },
        { m: 'Inflation rate = 43 ÷ 1240 × 100 = 3.5% (1 d.p.).', note: 'divide by the old CPI' },
        { m: 'On average, the prices of the goods and services in the basket rose by 3.5% over the year.', note: 'meaning' },
        { m: 'That is above the Reserve Bank’s 1–3% target range.', note: 'context' },
      ],
    },
    faded() { const a = R.int(1150, 1350), r = R.pick([1.5, 2.2, 2.8, 3.4, 4.1, 5.0]); const b = Math.round(a * (1 + r / 100)); const ans = ((b - a) / a) * 100;
      return { kind: 'num', answer: ans, dp: 1, tol: 0.06, prompt: `The CPI was ${a} last year and ${b} this year. Calculate the annual inflation rate as a percentage.`, scaffold: [`Change: ${b} − ${a} = ${b - a}`], fmt: 'Give a percentage to 1 decimal place (without the % sign).',
        wrong: [{ v: ((b - a) / b) * 100, msg: 'Divide by the OLD CPI, not the new one.' }, { v: b - a, msg: 'That is the change in points. Turn it into a percentage of the old CPI.' }],
        more: { steps: [St(`Find the change: ${b} − ${a} = ${b - a}.`), St(`Divide by the old CPI: ${b - a} ÷ ${a} = ${P.f((b - a) / a, 4)}.`), St(`× 100 = ${P.f(ans, 1)}%.`)], trap: 'Dividing by the new CPI.' }, sol: [`(${b} − ${a}) ÷ ${a} × 100 = ${P.f(ans, 1)}%`] }; },
    grades: 'AAAMM',
    gens: [
      () => { const a = R.int(1100, 1400), r = R.pick([0.8, 1.6, 2.4, 3.1, 4.6, 6.2]), b = Math.round(a * (1 + r / 100)), ans = ((b - a) / a) * 100;
        return { kind: 'num', answer: ans, dp: 1, tol: 0.06, prompt: `The CPI rose from ${a} to ${b} over one year. What was the inflation rate?`, fmt: 'Give a percentage to 1 decimal place (without the % sign).', wrong: [{ v: ((b - a) / b) * 100, msg: 'Divide by the old CPI.' }],
          more: { steps: [St(`(${b} − ${a}) ÷ ${a} × 100 = ${P.f(ans, 1)}%`)], trap: 'Dividing by the new CPI.' }, sol: [`(${b} − ${a}) ÷ ${a} × 100 = ${P.f(ans, 1)}%`] }; },
      () => { const base = R.int(180, 260) * 10, rise = R.pick([4, 6, 8, 10, 12, 15]); const now = Math.round(base * (1 + rise / 100) / 10) * 10; const cpi = (now / base) * 1000;
        return { kind: 'num', answer: cpi, dp: 1, tol: 0.06, prompt: `A household basket cost ${$(base)} in the base period and costs ${$(now)} now. The base period CPI is 1000. Calculate the CPI now.`, fmt: 'Give the CPI to 1 decimal place.',
          more: { steps: [St('CPI = cost now ÷ cost in the base period × 1000.'), St(`${now} ÷ ${base} × 1000 = ${P.f(cpi, 1)}.`), St(`So prices have risen ${P.f(cpi / 10 - 100, 1)}% since the base period.`)] }, sol: [`${now} ÷ ${base} × 1000 = ${P.f(cpi, 1)}`] }; },
      P.terms([['inflation', 'A sustained increase in the general price level.'], ['Consumers Price Index (CPI)', 'An index of the prices of a fixed basket of goods and services bought by a typical household.'], ['base period', 'The period the CPI is compared with, set to 1000.'], ['weighting', 'Giving each item in the basket importance according to the share of household spending on it.'], ['inflation rate', 'The percentage change in the CPI over a period, usually a year.'], ['purchasing power', 'The amount of goods and services a sum of money can buy.']]),
      P.bank([
        { q: 'Why are items in the CPI basket weighted?', a: 'Households spend much more on some items, so their price changes affect the cost of living more', why: 'A 10% rise in rent hurts far more than a 10% rise in movie tickets.', w: [['So that expensive items count less', 'Weights follow spending share, not price.'], ['To keep the CPI at 1000', 'The base is 1000; weights do not keep it there.'], ['Because the government sets prices', 'Prices are set in markets.']] },
        { q: 'Why might the CPI understate inflation for a student renting in Auckland?', a: 'Their spending is weighted more towards rent, which may be rising faster than the average basket', why: 'The CPI is an average household. A different spending pattern faces different inflation.', w: [['Students do not pay GST', 'They do.'], ['The CPI does not include rent', 'It does.'], ['Students have higher incomes', 'Not the reason, and usually untrue.']] },
        { q: 'The CPI rises from 1200 to 1200. What happened to the general price level?', a: 'It did not change: zero inflation', why: 'No change in the index means no change in the average price level.', w: [['It rose by 1200%', 'The change is zero.'], ['It fell', 'The index did not fall.'], ['Prices of every item stayed the same', 'Some may have risen and others fallen; the average did not change.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: how Stats NZ measures inflation.', steps: ['Choose a basket of goods and services a typical household buys', 'Weight each item by its share of household spending', 'Price the basket every quarter', 'Compare its cost with the base period, set to 1000', 'Calculate the percentage change in the CPI'] },
      ]),
    ],
    tips: [
      'Inflation rate: <span class="pen">divide by the old CPI</span>. Show the working: (new − old) ÷ old × 100.',
      'Define inflation as a <b>sustained</b> increase in the <b>general</b> price level, not one price going up.',
      'Achieved in 2025: describing the CPI as a basket of goods and services. Not Achieved: not being able to describe how it is calculated.',
      'The Reserve Bank’s target is 1–3% annual CPI inflation. Use it to judge whether a figure is high.',
    ],
    aim: {
      intro: `<div class="resource">Annual CPI inflation in New Zealand: 2022: 7.2%. 2023: 4.7%. 2024: 2.2%. A household’s weekly basket cost ${$(1250)} in the base period and ${$(1590)} in 2024.</div>`,
      parts: [
        { q: 'Describe how the CPI is calculated, and calculate the household’s CPI for 2024 (base = 1000).', write: true, words: '40–60',
          model: [S('The CPI measures the cost of a fixed, weighted basket of goods and services bought by a typical household, compared with the base period.', 'describes the CPI', true), S(`CPI = cost now ÷ cost in the base period × 1000 = 1590 ÷ 1250 × 1000 = 1272.`, 'calculation', true), S('So this household’s prices are 27.2% higher than in the base period.', 'meaning')],
          earns: 'Achieved: a correct description and a correct calculation.',
          crit: { A: 'Basket of goods and services bought by a typical household, weighted, compared with base period (1000); CPI = 1272.' } },
        { q: 'Using the data, explain whether New Zealand experienced deflation between 2022 and 2024.', write: true, words: '50–80',
          model: [S('Deflation is a fall in the general price level: a negative inflation rate.', 'definition', true), S('Inflation was positive in every year: 7.2%, then 4.7%, then 2.2%.', 'uses the data'), S('So prices kept rising, just more slowly each year. This is disinflation, not deflation.', 'conclusion', true), S('By 2024 inflation was back within the Reserve Bank’s 1–3% target.', 'context')],
          earns: 'Merit: deflation and disinflation are distinguished and applied to the data.',
          crit: { A: 'Defines deflation or disinflation.', M: 'Uses the data to show inflation was positive but falling, so disinflation not deflation.' } },
        { q: 'Discuss whether the CPI is a good measure of the change in this household’s cost of living over the period.', write: true, words: '90–130',
          model: [S('The CPI measures price changes for an average household basket with fixed weights.', 'what it measures', true), S('If this household spends a larger share on items whose prices rose fast, such as rent or food, its cost of living rose faster than the CPI shows.', 'limitation 1', true), S('The basket is only updated every few years, so new products and changes in what people buy are missed, and quality changes are hard to price.', 'limitation 2'), S('Its own index (1272, a 27.2% rise) can be compared with the national CPI to see how far it differs.', 'uses the data'), S('So the CPI is a good guide to inflation across the economy, but a weak measure for one household whose spending differs from the average.', 'justified judgement', true)],
          earns: 'Excellence: the strengths and limits of the CPI are weighed for this household, leading to a justified judgement.',
          crit: { M: 'Explains that the CPI is an average with fixed weights so it may not match one household.', E: 'Discusses several limitations (weights, basket updates, quality), uses the household data, and makes a justified judgement.' } },
      ],
      up: [
        up(1, ['Inflation went down from 7.2% to 2.2%, so there was deflation.'], [
          ['Correct it: inflation stayed positive, so prices kept rising, more slowly. That is disinflation, not deflation, which needs a negative rate', 1, 'Right. The examiners named mixing up disinflation and deflation as a Not Achieved error.'],
          ['Add the 2023 figure', 0, 'More data does not fix the wrong conclusion.'],
          ['Say the Reserve Bank caused it', 0, 'Not asked, and the conclusion is still wrong.'],
          ['Explain what the CPI is', 0, 'That was part (a).']]),
        up(2, ['The CPI is not a good measure because it is an average.'], [
          ['Explain why that matters for this household (spending shares, rent and food), add another limitation, use the data, and give a balanced judgement', 1, 'Right. One limitation is stated, not discussed. Excellence weighs strengths and limits.'],
          ['Say the CPI is calculated by Stats NZ', 0, 'True, but not discussion.'],
          ['Repeat the CPI calculation', 0, 'That was part (a).'],
          ['Say all averages are bad', 0, 'Too sweeping. Judge it for this household.']]),
      ],
    },
  });

  /* ======================= 2. Inflation, disinflation, deflation ======================= */
  P.addUnit({
    id: 'inflation-terms', title: 'Inflation, disinflation and deflation', mins: 8,
    blurb: 'Read the data carefully. A falling inflation rate does not mean falling prices.',
    recap: 'Inflation: the general price level rises (a positive inflation rate). Disinflation: the inflation rate falls but stays positive, so prices still rise, more slowly. Deflation: the general price level falls (a negative inflation rate). Hyperinflation: very rapid inflation, often hundreds of per cent a year. A low, stable inflation rate is the Reserve Bank’s aim: 1–3% a year.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Same graph, three words</h2>'), C(3, '<p>Above zero and rising: inflation speeding up.</p>'), C(6, '<p>Above zero and falling: disinflation. Prices still rise.</p>'), C(9.5, '<p>Below zero: deflation. Prices fall.</p>')],
        draw(a) {
          const v = a.view(0, 8, -3, 8); a.axes(v, { step: 1, labels: false });
          a.text('inflation rate (%)', v.X(0) + 6, v.Y(8) + 4, { size: 0.75, col: a.C.muted });
          const pts = [3, 5.5, 7.2, 6, 4.7, 2.2, 0.5, -1.2, -0.8]; const f = (x) => { const k = Math.min(7, Math.floor(x)); const t = x - k; return pts[k] * (1 - t) + pts[k + 1] * t; };
          a.plot(v, f, a.C.c1, 4, a.seg(a.p, 0.05, 0.85));
          a.alpha(a.seg(a.p, 0.15, 0.25), () => a.text('inflation rising', v.X(0.3), v.Y(7.3), { font: 'pen', col: a.C.pen }));
          a.alpha(a.seg(a.p, 0.45, 0.55), () => a.text('disinflation', v.X(4.2), v.Y(5.6), { font: 'pen', col: a.C.pen }));
          a.alpha(a.seg(a.p, 0.8, 0.9), () => a.text('deflation', v.X(6.2), v.Y(-2.2), { font: 'pen', col: a.C.pen }));
        } },
      { dur: 11, card: [C(0, '<h2>Why low and stable?</h2>'), C(3, '<p>High inflation erodes savings and makes planning hard. Deflation makes people delay spending, which can slow the economy.</p>')],
        board: [L(0.5, '<b>target</b>: 1–3% a year (Reserve Bank)'), L(3, '<b>high</b>: savings lose value, uncertainty'), L(5.5, '<b>deflation</b>: spending delayed, debts harder to repay', '', { hl: true })] },
    ],
    example: {
      problem: 'Annual inflation was 6.0% in 2023 and 3.5% in 2024. A student says prices fell in 2024. Explain why the student is wrong.',
      steps: [
        { m: 'An inflation rate of 3.5% is positive, so the general price level still rose in 2024.', note: 'read the sign' },
        { m: 'It rose more slowly than in 2023, because the rate fell from 6.0% to 3.5%.', note: 'compare' },
        { m: 'That is disinflation: a falling but positive inflation rate.', note: 'name it' },
        { m: 'Prices fall only with deflation, which needs a negative inflation rate.', note: 'the contrast' },
      ],
    },
    faded() { return termData()(); },
    grades: 'AAMM',
    gens: [
      termData(),
      P.terms([['inflation', 'A sustained increase in the general price level.'], ['disinflation', 'A fall in the inflation rate while it stays positive: prices still rise, more slowly.'], ['deflation', 'A sustained decrease in the general price level: a negative inflation rate.'], ['hyperinflation', 'Extremely rapid inflation, often hundreds of per cent a year.'], ['price stability', 'Low, stable inflation: the Reserve Bank aims for 1–3% a year.']]),
      P.bank([
        { q: 'Why can deflation be harmful to an economy?', a: 'People delay spending, expecting lower prices, so demand and output fall', why: 'Falling prices can also make debts harder to repay in real terms.', w: [['It makes everything cheaper, so it is always good', 'Delayed spending can cause a downturn.'], ['It raises interest rates automatically', 'Not automatic.'], ['It increases exports to zero', 'Not a thing.']] },
        { q: 'Why does the Reserve Bank aim for low positive inflation rather than zero?', a: 'A small buffer avoids the risk of deflation, and measured inflation tends to overstate true price rises', why: '1–3% keeps the economy away from deflation while keeping prices stable.', w: [['Zero inflation is illegal', 'It is not.'], ['Inflation makes everyone richer', 'It does not.'], ['To raise government revenue', 'Not the stated aim.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: why deflation can slow the economy.', steps: ['The general price level starts to fall', 'Households expect prices to fall further', 'They delay buying, so consumption falls', 'Firms sell less and cut production and jobs', 'Incomes fall, so spending falls further'] },
      ]),
    ],
    tips: [
      'Check the sign: <span class="pen">positive but falling = disinflation; negative = deflation.</span>',
      'The 2025 report: Not Achieved candidates mixed up disinflation and deflation. Merit candidates distinguished them using the data.',
      'Quote the data you use, with the year and the figure.',
      'Use the Reserve Bank’s 1–3% target to judge whether inflation is high or low.',
    ],
    aim: {
      intro: '<div class="resource">Annual CPI inflation in an economy: Year 1: 5.8%. Year 2: 3.1%. Year 3: 0.9%. Year 4: −0.6%.</div>',
      parts: [
        { q: 'Define inflation, disinflation and deflation.', write: true, words: '30–50',
          model: [S('Inflation is a sustained increase in the general price level.', 'inflation', true), S('Disinflation is a fall in the inflation rate while it stays positive.', 'disinflation', true), S('Deflation is a sustained fall in the general price level (a negative inflation rate).', 'deflation', true)],
          earns: 'Achieved: three accurate definitions.', crit: { A: 'Three correct definitions.' } },
        { q: 'Using the data, explain which years show disinflation and which show deflation.', write: true, words: '50–80',
          model: [S('Years 2 and 3 show disinflation: the inflation rate fell (5.8% to 3.1% to 0.9%) but stayed positive, so prices still rose.', 'disinflation with data', true), S('Year 4 shows deflation: the rate was negative (−0.6%), so the general price level fell.', 'deflation with data', true)],
          earns: 'Merit: both terms applied correctly to the data, with the figures.', crit: { M: 'Years 2–3 disinflation (falling, positive) and year 4 deflation (negative), using the figures.' } },
        { q: 'Discuss why the change from year 3 to year 4 could worry the central bank more than the high inflation in year 1.', write: true, words: '90–130',
          model: [S('In year 1, inflation of 5.8% was above a 1–3% target, eroding savings, but the central bank can raise interest rates to bring it down.', 'year 1'), S('In year 4 prices fell. If people expect further falls they delay spending, so consumption and AD fall.', 'deflation mechanism', true), S('Firms then cut output and jobs, incomes fall, and spending falls again: a downward spiral that is hard to stop.', 'spiral'), S('Interest rates cannot easily go much below zero, so the central bank has fewer tools against deflation.', 'policy limit', true), S('So deflation can be more dangerous because it feeds on itself and is harder to fix, even though 5.8% inflation is further from the target.', 'justified judgement', true)],
          earns: 'Excellence: both situations are compared, deflation’s self-reinforcing effects and policy limits are explained, and a reasoned judgement is made.',
          crit: { M: 'Explains how deflation leads to delayed spending and lower output.', E: 'Compares the two years, explains the deflationary spiral and the limits of monetary policy, and gives a justified judgement.' } },
      ],
      up: [
        up(1, ['Years 2 and 3 are disinflation and year 4 is deflation.'], [
          ['Support it with the data: years 2–3 fall from 5.8% to 0.9% but stay positive; year 4 is −0.6%, so prices fall', 1, 'Right. The labels are correct; Merit uses the figures to explain each one.'],
          ['Define inflation', 0, 'That was part (a).'],
          ['Say year 1 is hyperinflation', 0, 'Wrong: 5.8% is far from hyperinflation.'],
          ['Draw an AS/AD model', 0, 'Not needed here.']]),
        up(2, ['Deflation is worse because people stop spending.'], [
          ['Explain the spiral (delayed spending → lower output and jobs → lower incomes), the limit on interest rates, and compare with year 1 to justify the judgement', 1, 'Right. The idea is there; Excellence explains it and weighs it against year 1.'],
          ['Say deflation is bad', 0, 'Too vague.'],
          ['Repeat the figures', 0, 'Data without reasoning.'],
          ['Say prices fall', 0, 'Restates the definition.']]),
      ],
    },
  });
  function termData() {
    return () => { const a = R.pick([4.5, 5.8, 3.9, 6.6]), b = R.pick([2.1, 1.4, 3.0]), c = R.pick([-0.4, -1.1, 0.6, 2.4, 1.2]);
      const ask = R.pick([2, 3]); const val = ask === 2 ? b : c, prev = ask === 2 ? a : b;
      const ans = val < 0 ? 'Deflation' : val < prev ? 'Disinflation' : 'Inflation speeding up';
      return P.mcq({ prompt: `Annual inflation: Year 1 ${a}%, Year 2 ${b}%, Year 3 ${c}%. Which word best describes year ${ask}?`, more: { steps: [St(`Year ${ask}: ${val}%, compared with ${prev}% the year before.`), St(val < 0 ? 'Negative, so prices fell: deflation.' : val < prev ? 'Positive but lower than before: prices still rose, more slowly. Disinflation.' : 'Positive and higher than before: inflation speeding up.')] } },
        ['Deflation', 'Disinflation', 'Inflation speeding up', 'Hyperinflation'].map((t) => ({ t, ok: t === ans, why: t === ans ? null : { Deflation: 'Deflation needs a negative rate.', Disinflation: 'Disinflation needs a lower, still positive rate.', 'Inflation speeding up': 'That needs a higher rate than the year before.', Hyperinflation: 'Hyperinflation is extremely high, hundreds of per cent.' }[t] }))); };
  }

  /* ======================= 3. Demand-pull inflation ======================= */
  const DPULL = [
    ['The Reserve Bank lowers the Official Cash Rate, so interest rates fall', 'Cheaper borrowing raises consumption (C) and investment (I)'],
    ['Income tax rates are cut', 'Households have more disposable income, so consumption (C) rises'],
    ['World dairy prices rise sharply', 'Export receipts rise, so net exports (X − M) and farm incomes rise'],
    ['The government spends more on roads and hospitals', 'Government spending (G) rises'],
    ['Consumer confidence rises as house prices climb', 'Households spend more, so consumption (C) rises'],
  ];
  const CPUSH = [
    ['World oil prices rise', 'Fuel and transport costs rise for firms'],
    ['Wages rise faster than productivity', 'Labour costs rise for firms'],
    ['The NZ dollar depreciates, raising the price of imported raw materials', 'Imported inputs cost more'],
    ['A cyclone destroys crops and roads', 'Inputs become scarce and transport costs rise'],
    ['Electricity prices rise for businesses', 'Energy costs of production rise'],
  ];
  P.addUnit({
    id: 'demand-pull', title: 'Demand-pull inflation on the AS/AD model', mins: 11,
    blurb: 'AD = C + I + G + (X − M). Something raises a component, AD shifts right, the price level rises.',
    recap: 'Aggregate demand (AD) is total spending in the economy: AD = C + I + G + (X − M), where C is consumption, I investment, G government spending, X exports and M imports. Demand-pull inflation happens when AD increases faster than the economy can produce. On the AS/AD model, AD shifts right to AD1, the price level rises from PL to PL1, and real output rises from Y to Y1. Causes include lower interest rates, tax cuts, higher government spending, higher export prices and rising confidence.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>AD = C + I + G + (X − M)</h2>'), C(3, '<p>Anything that raises one of these components shifts AD to the right.</p>'), C(8.5, '<p>The price level rises from PL to PL₁: demand-pull inflation. Real output rises too.</p>')],
        draw(a) { E.draw(a, MD.asad(), { AD: 1 }, a.seg(a.p, 0.35, 0.75)); } },
      { dur: 13, card: [C(0, '<h2>The chain examiners want</h2>'), C(3, '<p>Event → component of AD → AD shifts right → excess demand → price level rises.</p>')],
        board: [L(0.5, 'the OCR is cut, so interest rates fall'), L(2.5, '→ borrowing is cheaper: C and I rise'), L(4.5, '→ AD shifts right, AD to AD₁'), L(6.5, '→ at PL there is excess demand, so firms raise prices'), L(8.5, '→ price level rises from PL to PL₁', '', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>Draw, label, then write</h2>'), C(3, '<p>Label the new curve AD₁, and both price levels and outputs. Then use those labels in your sentences.</p>')],
        board: [L(0.5, 'axes: Price level (PL) and Real output (Y)'), L(2.5, 'new curve: AD₁ with an arrow'), L(4.5, 'new equilibrium: PL₁, Y₁'), L(6.5, '“…shifting AD to AD₁, raising the price level from PL to PL₁”', '', { hl: true })] },
    ],
    example: {
      problem: 'The government cuts income tax rates. Explain, using the AS/AD model, how this could cause inflation.',
      steps: [
        { m: 'Lower income tax rates raise households’ disposable income.', note: 'the event' },
        { m: 'Households spend more, so consumption (C), a component of AD, increases.', note: 'the component' },
        { m: 'AD shifts right from AD to AD1.', note: 'the model' },
        { m: 'At the old price level there is now excess demand, so firms raise prices. The price level rises from PL to PL1: demand-pull inflation.', note: 'the result, with labels' },
        { m: 'Real output also rises from Y to Y1, as firms produce more to meet the extra demand.', note: 'output' },
      ],
    },
    faded() { const [ev, why] = R.pick(DPULL); return shift(`<b>${ev}.</b> Show the effect on the AS/AD model.`, MD.asad(), { AD: 1 }, [why + '.', 'That is a component of AD (C + I + G + (X − M)), so AD shifts right to AD₁.', 'The price level rises from PL to PL₁: demand-pull inflation.'], { why, wrong: [{ v: { AS: -1 }, msg: 'That would be cost-push. This event changes spending, not costs.' }, { v: { AD: -1 }, msg: 'Spending rises, so AD shifts right, not left.' }] }); },
    grades: 'AAMMA',
    gens: [
      () => { const [ev, why] = R.pick(DPULL); return shift(`<b>${ev}.</b> Show the effect on the AS/AD model.`, MD.asad(), { AD: 1 }, [why + '.', 'AD shifts right to AD₁.', 'The price level rises from PL to PL₁: demand-pull inflation.'], { why, wrong: [{ v: { AS: -1 }, msg: 'That would be cost-push. This event changes spending.' }, { v: { AD: -1 }, msg: 'Spending rises, so AD shifts right.' }, { v: { AS: 1 }, msg: 'AS shifts when costs or capacity change. This is about spending.' }] }); },
      () => { const ev = R.pick([['The Reserve Bank raises the Official Cash Rate', 'Higher interest rates reduce borrowing, so C and I fall'], ['The government cuts spending sharply', 'Government spending (G) falls'], ['A recession in China cuts demand for NZ exports', 'Exports (X) fall'], ['Consumers lose confidence and save more', 'Consumption (C) falls']]);
        return shift(`<b>${ev[0]}.</b> Show the effect on the AS/AD model.`, MD.asad(), { AD: -1 }, [ev[1] + '.', 'AD shifts left to AD₁.', 'The price level falls from PL to PL₁ (or rises more slowly), and real output falls.'], { why: ev[1], wrong: [{ v: { AD: 1 }, msg: 'Spending falls, so AD shifts left.' }, { v: { AS: 1 }, msg: 'This changes spending, not production costs.' }] }); },
      () => { const [ev, why] = R.pick(DPULL); const comp = /\(C\)/.test(why) ? 'Consumption (C)' : /\(I\)/.test(why) ? 'Consumption (C) and investment (I)' : /\(G\)/.test(why) ? 'Government spending (G)' : 'Net exports (X − M)';
        return P.mcq({ prompt: `${ev}. Which component of AD is affected first?`, more: { steps: [St(why + '.'), St('Name the component: examiners want the link from the event to C, I, G or (X − M).')] } }, P.uniq([{ t: comp, ok: true }].concat(['Consumption (C)', 'Government spending (G)', 'Net exports (X − M)', 'Consumption (C) and investment (I)'].filter((x) => x !== comp).slice(0, 3).map((t) => ({ t, why: `Not first. ${why}.` }))))); },
      P.chain([
        { q: 'Put the chain in order: how a cut in the OCR can cause demand-pull inflation.', steps: ['The Reserve Bank cuts the Official Cash Rate', 'Banks lower interest rates on loans', 'Households and firms borrow and spend more: C and I rise', 'AD shifts right from AD to AD1', 'Excess demand pushes the price level up from PL to PL1'] },
        { q: 'Put the chain in order: how higher dairy prices can cause inflation.', steps: ['World dairy prices rise', 'NZ export receipts and farm incomes rise', 'Exports (X) and farmers’ spending (C) rise', 'AD shifts right to AD1', 'The price level rises from PL to PL1'] },
      ]),
      P.terms([['aggregate demand (AD)', 'Total spending on goods and services in the economy: C + I + G + (X − M).'], ['demand-pull inflation', 'Inflation caused by aggregate demand increasing faster than aggregate supply.'], ['consumption (C)', 'Spending by households on goods and services.'], ['investment (I)', 'Spending by firms on capital goods such as machinery and buildings.'], ['net exports (X − M)', 'Export receipts minus import payments.'], ['Official Cash Rate (OCR)', 'The interest rate set by the Reserve Bank, which influences other interest rates.']]),
    ],
    tips: [
      'Write the formula: <span class="pen">AD = C + I + G + (X − M)</span>. The 2025 Achieved candidates stated it correctly.',
      'Always give the reason for the shift: which component changes and why. Not Achieved in 2025: “did not give reasons for the shift in AD or AS”.',
      'Label AD₁, PL₁ and Y₁ and use those labels in your writing. “As seen on the graph” is not enough for Merit.',
      'Link interest rates to spending. The 2025 report noted candidates who did not link lower interest rates to more spending.',
    ],
    aim: {
      intro: '<div class="resource">In 2026 the Reserve Bank cuts the Official Cash Rate twice. Mortgage rates fall, house prices start to rise again, and retailers report stronger sales.</div>',
      parts: [
        { q: 'State the formula for aggregate demand, and show on an AS/AD model the effect of lower interest rates. Describe the change.', write: true, words: '30–60',
          model: [S('AD = C + I + G + (X − M).', 'formula', true), S('Lower interest rates shift AD right, from AD to AD1.', 'the shift', true), S('The price level rises from PL to PL1 and real output rises from Y to Y1.', 'the change, labelled', true)],
          earns: 'Achieved: the formula, the right shift and the labelled change.', crit: { A: 'AD = C + I + G + (X − M); AD shifts right; price level up PL to PL1; output up.' } },
        { q: 'Explain how the cut in the OCR could lead to inflation. Refer to your model.', write: true, words: '70–100',
          model: [S('A lower OCR leads banks to lower their interest rates.', 'OCR → rates'), S('Borrowing is cheaper and saving is less rewarding, so households spend more (C) and firms invest more (I).', 'rates → components', true), S('Since C and I are components of AD, AD shifts right from AD to AD1.', 'components → AD', true), S('At PL there is now excess demand, so firms raise prices and the price level rises from PL to PL1: demand-pull inflation.', 'AD → price level, using labels', true)],
          earns: 'Merit: the full chain from the OCR to the price level, using the model’s labels.', crit: { M: 'Explains OCR → interest rates → C and I up → AD to AD1 → excess demand → PL to PL1, referring to model labels.' } },
        { q: 'Discuss whether rising house prices are likely to add to the inflation caused by lower interest rates. Use the model in your answer.', write: true, words: '100–140',
          model: [S('Rising house prices make homeowners feel wealthier (the wealth effect), so they spend more and save less: C rises further.', 'house prices → C', true), S('Higher house prices also encourage building, so investment in housing (I) rises.', 'house prices → I'), S('Together with cheaper borrowing, this shifts AD further right (to AD2), raising the price level again.', 'adds to the shift', true), S('How much depends on spare capacity: if firms can raise output easily, more of the extra demand goes into output (Y) than prices.', 'qualification'), S('Since retailers report stronger sales, demand is already rising, so rising house prices are likely to add to inflation rather than just to output.', 'justified judgement', true)],
          earns: 'Excellence: two linked causes are explained on the model, the size of the effect is qualified, and a justified judgement uses the context.',
          crit: { M: 'Explains house prices raise C (wealth effect) and shift AD right.', E: 'Integrates both causes on the model (further AD shift), qualifies by spare capacity, and makes a justified judgement using the context.' } },
      ],
      up: [
        up(1, ['Lower interest rates make AD increase, so prices go up.'], [
          ['Fill the chain: OCR → bank rates → cheaper borrowing → C and I rise → AD to AD1 → excess demand → PL to PL1, using the labels', 1, 'Right. The examiners want each link and the model’s labels in the explanation.'],
          ['Add the AD formula', 0, 'Good to know, but the links are what is missing.'],
          ['Say “as shown on the graph”', 0, 'The 2024 report said this is not enough for Merit.'],
          ['Say inflation is bad', 0, 'Not asked.']]),
        up(2, ['House prices going up will make inflation worse because people spend more.'], [
          ['Explain the wealth effect on C and the effect on I, show a further AD shift, qualify by spare capacity, and judge using the retail sales evidence', 1, 'Right. The claim is reasonable; Excellence explains it on the model and weighs it.'],
          ['Say house prices are high in Auckland', 0, 'Context, not reasoning.'],
          ['Repeat part (b)', 0, 'House prices need their own chain.'],
          ['Say the Reserve Bank should raise the OCR', 0, 'A recommendation is not the discussion asked for.']]),
      ],
    },
  });

  /* ======================= 4. Cost-push inflation ======================= */
  P.addUnit({
    id: 'cost-push', title: 'Cost-push inflation', mins: 10,
    blurb: 'Costs of production rise, AS shifts left, prices up and output down. Compare it with demand-pull.',
    recap: 'Cost-push inflation happens when firms’ costs of production rise, such as wages, oil, imported raw materials or power. Firms pass the higher costs on in higher prices and produce less at each price level. On the AS/AD model, AS shifts left to AS1: the price level rises from PL to PL1, but real output falls from Y to Y1. That makes cost-push worse than demand-pull: higher prices and less output, so unemployment can rise too.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Costs up, AS left</h2>'), C(3, '<p>Higher costs of production: firms supply less at every price level.</p>'), C(8.5, '<p>The price level rises from PL to PL₁, and real output falls from Y to Y₁.</p>')],
        draw(a) { E.draw(a, MD.asad(), { AS: -1 }, a.seg(a.p, 0.35, 0.75)); } },
      { dur: 13, card: [C(0, '<h2>Compare the two causes</h2>'), C(3, '<p>Both raise the price level. Output goes in opposite directions.</p>')],
        board: [L(0.5, '<b>demand-pull</b>: AD right → PL up, Y up'), L(3, '<b>cost-push</b>: AS left → PL up, Y down', '', { hl: true }), L(6, 'cost-push also risks job losses: harder for the Reserve Bank')] },
    ],
    example: {
      problem: 'World oil prices rise by 40%. Explain, using the AS/AD model, how this could cause inflation in New Zealand.',
      steps: [
        { m: 'Oil is a major input: fuel for transport, farming and manufacturing.', note: 'why oil matters' },
        { m: 'Higher oil prices raise firms’ costs of production, so at each price level they supply less.', note: 'costs' },
        { m: 'AS shifts left from AS to AS1.', note: 'the model' },
        { m: 'The price level rises from PL to PL1 (cost-push inflation) and real output falls from Y to Y1.', note: 'result, with labels' },
      ],
    },
    faded() { const [ev, why] = R.pick(CPUSH); return shift(`<b>${ev}.</b> Show the effect on the AS/AD model.`, MD.asad(), { AS: -1 }, [why + '.', 'Higher costs of production: AS shifts left to AS₁.', 'The price level rises from PL to PL₁; real output falls from Y to Y₁.'], { why, wrong: [{ v: { AD: 1 }, msg: 'That would be demand-pull. This event raises costs.' }, { v: { AS: 1 }, msg: 'Higher costs shift AS left, not right.' }] }); },
    grades: 'AMAMM',
    gens: [
      () => { const [ev, why] = R.pick(CPUSH); return shift(`<b>${ev}.</b> Show the effect on the AS/AD model.`, MD.asad(), { AS: -1 }, [why + '.', 'AS shifts left to AS₁.', 'PL rises to PL₁; Y falls to Y₁.'], { why, wrong: [{ v: { AD: 1 }, msg: 'This changes costs, not spending.' }, { v: { AS: 1 }, msg: 'Higher costs shift AS left.' }] }); },
      () => { const both = R.pick([true, false]); const cost = R.pick(CPUSH), dem = R.pick(DPULL);
        const items = both ? [cost, dem] : [cost]; const ans = both ? { AS: -1, AD: 1 } : { AS: -1 };
        return shift(`${items.map((x) => `<b>${x[0]}.</b>`).join(' At the same time, ')} Show the effect${both ? 's' : ''} on the AS/AD model.`, MD.asad(), ans, [`${cost[1]}: AS shifts left.`].concat(both ? [`${dem[1]}: AD shifts right.`, 'Both push the price level up; the effect on output depends on which shift is larger.'] : ['PL rises; Y falls.']), { wrong: [{ v: { AS: -1 }, msg: both ? 'One more change: spending rises too.' : null }].filter((w) => w.msg) }); },
      P.bank([
        { q: 'Why is cost-push inflation often seen as worse than demand-pull inflation?', a: 'Prices rise while real output falls, so unemployment may rise too', why: 'Demand-pull raises output; cost-push lowers it.', w: [['Prices rise more with cost-push', 'Not necessarily; the problem is output.'], ['Only cost-push affects exporters', 'Both can.'], ['Cost-push is always permanent', 'Not necessarily.']] },
        { q: 'A depreciation of the NZ dollar raises the cost of imported machinery parts. How does this affect inflation?', a: 'Firms’ costs rise, AS shifts left, and the price level rises', why: 'Imported inputs are costs of production.', w: [['AD shifts right because imports fall', 'The question is about costs of inputs.'], ['Prices fall because NZ goods are cheaper overseas', 'That affects exports, not this cost.'], ['No effect: machinery is not in the CPI', 'It affects firms’ costs, and so prices.']] },
        { q: 'Wages rise by 5% but productivity rises by 5% too. What happens to costs per unit?', a: 'Little change: each worker produces more, so the cost per unit stays about the same', why: 'Wage rises cause cost-push only if they outpace productivity.', w: [['Cost per unit rises 5%', 'Higher output per worker offsets it.'], ['Cost per unit rises 10%', 'No.'], ['Cost per unit falls 5%', 'No.']] },
      ]),
      P.chain([
        { q: 'Put the chain in order: how higher wages can cause cost-push inflation.', steps: ['Wages rise faster than productivity', 'Labour costs per unit rise for firms', 'Firms supply less at each price level, so AS shifts left to AS1', 'Firms raise prices to cover their costs', 'The price level rises from PL to PL1 and output falls from Y to Y1'] },
      ]),
      P.bank([
        { q: 'In 2022 NZ had high oil prices and strong spending at the same time. On the AS/AD model, what happened?', a: 'AS shifted left and AD shifted right, so the price level rose by more than either alone', why: 'Both causes push prices the same way; their effects on output partly cancel.', w: [['Only AD shifted', 'Oil prices are a cost.'], ['AS shifted right', 'Higher costs shift AS left.'], ['The price level fell', 'Both push it up.']] },
        { q: 'Which change is cost-push, not demand-pull?', a: 'A rise in the price of imported fertiliser used by farms', why: 'Fertiliser is an input, so it raises costs of production.', w: [['A rise in government spending', 'That raises AD.'], ['A cut in income tax', 'That raises C.'], ['Higher export prices for dairy', 'That raises X and incomes: AD.']] },
      ]),
    ],
    tips: [
      'Cost-push: <span class="pen">costs of production up → AS left → PL up, Y down.</span> Name the cost.',
      'Show both PL₁ and Y₁ on the model and say which way each moved.',
      'Excellence in 2024: explaining why a cost increase is widespread rather than a one-off event, referring to both graphs.',
      'If a question gives two events, show both shifts and say which effect is larger, with a reason.',
    ],
    aim: {
      intro: '<div class="resource">After a cyclone damages roads and orchards in Hawke’s Bay, transport costs rise across the North Island. At the same time, world oil prices climb because of conflict overseas.</div>',
      parts: [
        { q: 'Show the effect of these events on the AS/AD model and describe the changes.', write: true, words: '30–50',
          model: [S('Both events raise costs of production, so AS shifts left from AS to AS1.', 'the shift', true), S('The price level rises from PL to PL1.', 'price level', true), S('Real output falls from Y to Y1.', 'output', true)],
          earns: 'Achieved: the right shift and both changes described with labels.', crit: { A: 'AS shifts left; PL rises to PL1; Y falls to Y1.' } },
        { q: 'Explain how higher oil prices lead to cost-push inflation. Refer to your model.', write: true, words: '60–90',
          model: [S('Oil is used to make fuel and in many production processes, so its price affects most firms.', 'why oil', true), S('Higher oil prices raise firms’ costs of production, so they supply less at each price level: AS shifts left from AS to AS1.', 'cost → AS', true), S('Firms pass the higher costs on in higher prices, so the price level rises from PL to PL1.', 'AS → PL', true), S('Output falls from Y to Y1 because production is less profitable at the old prices.', 'output')],
          earns: 'Merit: the cost is linked to the shift and the price level, with labels.', crit: { M: 'Explains oil → production costs → AS left to AS1 → PL to PL1 (and Y to Y1).' } },
        { q: 'Discuss which of the two events is likely to have the bigger and longer-lasting effect on inflation across New Zealand.', write: true, words: '100–140',
          model: [S('The cyclone mainly raises costs in one region and for some industries (transport, horticulture), and repairs will eventually bring costs down.', 'cyclone: localised, temporary', true), S('Higher oil prices raise costs for almost every firm in the country: transport, farming, manufacturing, power.', 'oil: widespread', true), S('So the oil price rise shifts AS further left, giving a bigger rise in the general price level.', 'compares on the model'), S('It may also last longer, because it depends on world events NZ cannot control, and higher costs can feed into wage demands.', 'duration'), S('So the oil price rise is likely to have the larger, longer-lasting effect, while the cyclone’s effect is more local and one-off.', 'justified judgement', true)],
          earns: 'Excellence: the two events are compared for reach and duration, linked to the size of the AS shift, with a justified judgement.',
          crit: { M: 'Explains both events raise costs and shift AS left.', E: 'Compares the reach (regional vs national) and duration of the two cost increases, links to the size of AS shift and PL rise, and makes a justified judgement (as the 2024 Excellence evidence did).' } },
      ],
      up: [
        up(1, ['Oil prices rise so AS goes left and prices rise.'], [
          ['Explain why oil matters to costs, and use the labels: AS to AS1, PL to PL1, Y to Y1', 1, 'Right. Merit needs the reason for the shift and the model labels.'],
          ['Name the conflict', 0, 'Not the missing link.'],
          ['Add AD', 0, 'AD does not change here.'],
          ['Say petrol is expensive', 0, 'Too narrow: the point is firms’ costs.']]),
        up(2, ['Both raise costs and cause inflation. Oil is worse.'], [
          ['Compare reach (one region vs every firm) and duration (repairs vs world prices), link to the size of the AS shift, and justify the judgement', 1, 'Right. The judgement needs reasons; the 2024 Excellence answers explained why one cost increase was wider-ranging.'],
          ['Say cyclones are bad', 0, 'Not discussion.'],
          ['Repeat part (b)', 0, 'Compare the two events instead.'],
          ['Suggest the government fix the roads', 0, 'Not the question.']]),
      ],
    },
  });

  /* ======================= 5. Quantity theory of money ======================= */
  P.addUnit({
    id: 'qtm', title: 'The quantity theory of money: MV = PQ', mins: 11,
    blurb: 'Money supply times velocity equals the price level times output. Hold two still and see what the others do.',
    recap: 'The quantity theory of money says MV = PQ. M is the money supply. V is the velocity of circulation: how many times a dollar is spent in a year. P is the average price level. Q is real output (the quantity of goods and services). MV is total spending; PQ is the value of what is sold. If V and Q are constant, an increase in M causes a proportional increase in P. If velocity rises and output cannot rise, prices rise. In a recession, velocity falls as people spend less, lowering inflation.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>MV = PQ</h2>'), C(3, '<p>Left side: money × how often it is spent = total spending.</p>'), C(7.5, '<p>Right side: price level × real output = the value of everything sold.</p>')],
        board: [L(0.5, '<b>M</b>: money supply'), L(2, '<b>V</b>: velocity of circulation (times each dollar is spent)'), L(4, '<b>P</b>: average price level'), L(6, '<b>Q</b>: real output', ''), L(8, 'MV = total spending = PQ', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Hold V and Q still</h2>'), C(3, '<p>Double M and P must double. That is the quantity theory’s warning about printing money.</p>')],
        board: [L(0.5, 'M 100 × V 5 = 500 = P 2 × Q 250'), L(3.5, 'M 120 × V 5 = 600 = P ? × Q 250'), L(6.5, 'P = 600 ÷ 250 = 2.4: up 20%, like M', 'proportional', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>Velocity can change too</h2>'), C(3, '<p>Recession: people spend less often, V falls, inflation falls.</p>'), C(7, '<p>Boom: V rises; if Q cannot keep up, P rises.</p>')],
        board: [L(0.5, 'V up, M and Q constant → P up'), L(3, 'V down (recession) → P down or rises more slowly'), L(5.5, 'Q up (spare capacity) → absorbs some of the extra spending', '', { hl: true })] },
    ],
    example: {
      problem: `In an economy, M = ${$('50 billion')}, V = 6, and Q = 150 billion units. Calculate P. Then explain what happens to P if M rises to ${$('60 billion')} and V and Q stay the same.`,
      steps: [
        { m: 'MV = 50 × 6 = 300 billion. P = MV ÷ Q = 300 ÷ 150 = 2.', note: 'rearrange: P = MV ÷ Q' },
        { m: 'New MV = 60 × 6 = 360 billion. P = 360 ÷ 150 = 2.4.', note: 'recalculate' },
        { m: 'M rose by 20% and P rose by 20% (2 to 2.4).', note: 'proportional' },
        { m: 'With V and Q fixed, extra money means more spending on the same output, so prices rise in proportion.', note: 'explain' },
      ],
    },
    faded() { return qtmGen('P')(); },
    grades: 'AMMMM',
    gens: [
      qtmGen(),
      qtmGen('pct'),
      P.bank([
        { q: 'In MV = PQ, what is V?', a: 'The velocity of circulation: the number of times each dollar is spent in a year', why: 'V measures how fast money changes hands.', w: [['The value of exports', 'Not in this equation.'], ['The volume of goods produced', 'That is Q.'], ['The variable interest rate', 'Not part of the equation.']] },
        { q: 'Why does velocity usually fall in a recession?', a: 'Households and firms are worried, so they spend less often and save more', why: 'Each dollar changes hands fewer times, lowering MV and so P.', w: [['Because the money supply falls', 'That is M, not V.'], ['Because prices rise', 'Prices tend to rise more slowly in a recession.'], ['Because exports rise', 'Not the reason.']] },
        { q: 'The money supply rises by 10%, but real output also rises by 10%, and V is unchanged. What happens to P?', a: 'Stays about the same: the extra spending buys the extra output', why: 'MV and Q both rise 10%, so P = MV ÷ Q is unchanged.', w: [['Rises by 10%', 'Only if Q stays the same.'], ['Rises by 20%', 'No.'], ['Falls by 10%', 'No.']] },
      ]),
      P.chain([
        { q: 'Put the chain in order: how a rise in velocity can cause inflation (output constant).', steps: ['Confidence rises and people spend money more often', 'Velocity of circulation (V) increases', 'MV, total spending, increases', 'Real output (Q) cannot increase quickly', 'So the price level (P) rises in proportion'] },
      ]),
      P.terms([['money supply (M)', 'The total amount of money in the economy.'], ['velocity of circulation (V)', 'The number of times each dollar is spent in a year.'], ['price level (P)', 'The average level of prices in the economy.'], ['real output (Q)', 'The quantity of goods and services produced.'], ['quantity theory of money', 'MV = PQ: total spending equals the value of output sold.']]),
    ],
    tips: [
      'Write the equation and <span class="pen">name each letter</span>. The 2024 Not Achieved candidates misidentified the components.',
      'Say what is held constant: “if V and Q are constant, an increase in M causes a proportional increase in P”.',
      'Merit in 2025: using the equation to explain that a change in velocity changes inflation by a proportional amount.',
      'Excellence in 2025: explaining how a change in velocity and a change in real output together affect inflation.',
    ],
    aim: {
      intro: '<div class="resource">During a recession, households become cautious and spend money less often. The money supply stays the same. Firms cut production because sales have fallen.</div>',
      parts: [
        { q: 'State the quantity theory of money and say what each letter stands for.', write: true, words: '30–50',
          model: [S('MV = PQ.', 'equation', true), S('M is the money supply; V is the velocity of circulation (how many times each dollar is spent).', 'M and V', true), S('P is the average price level; Q is real output.', 'P and Q', true)],
          earns: 'Achieved: the equation and all four terms correct.', crit: { A: 'MV = PQ with M, V, P, Q correctly identified.' } },
        { q: 'Explain, using the quantity theory, how lower velocity affects the price level.', write: true, words: '60–90',
          model: [S('Cautious households spend each dollar fewer times, so velocity (V) falls.', 'V falls', true), S('With M constant, MV, total spending, falls.', 'MV falls', true), S('If Q stayed the same, P would have to fall in proportion to the fall in V.', 'P falls', true), S('So lower velocity reduces inflation, or causes deflation.', 'conclusion')],
          earns: 'Merit: the change in V is linked through MV to P, with the proportional reasoning.', crit: { M: 'Explains V falls → MV falls → with M and Q constant P falls proportionally → lower inflation.' } },
        { q: 'Firms also cut output (Q falls). Discuss the overall effect on the price level when both V and Q fall.', write: true, words: '90–130',
          model: [S('Lower V reduces total spending (MV), which on its own pushes P down.', 'effect of V', true), S('Lower Q means fewer goods and services; with less output, the same spending would push P up.', 'effect of Q', true), S('P = MV ÷ Q, so the overall effect depends on which falls more, proportionally.', 'uses the equation'), S('If V falls by more than Q (for example V falls 10% and Q 5%), P falls by about 5%; if Q falls by more, P rises.', 'worked comparison', true), S('In a recession, spending usually falls first and most, so the price level is likely to fall or rise only slowly.', 'justified judgement')],
          earns: 'Excellence: the opposing effects are explained with the equation, compared proportionally, and judged in context.',
          crit: { M: 'Explains that lower V lowers P and lower Q raises P.', E: 'Uses P = MV/Q to compare proportional falls in V and Q (as in the 2025 Excellence evidence), and makes a justified judgement about the likely outcome.' } },
      ],
      up: [
        up(1, ['People spend less so V falls and prices fall.'], [
          ['Use the equation: V falls, so MV falls; with M and Q constant, P falls in proportion', 1, 'Right. Merit uses the equation and the proportional change, not just the idea.'],
          ['Define velocity again', 0, 'That was part (a).'],
          ['Add the AS/AD model', 0, 'This question asks for the quantity theory.'],
          ['Say the recession is bad', 0, 'Not explanation.']]),
        up(2, ['V falling lowers P but Q falling raises P, so it could go either way.'], [
          ['Show it with P = MV ÷ Q and proportional changes (e.g. V −10%, Q −5% → P about −5%), then judge what is most likely in a recession', 1, 'Right. The idea is correct; Excellence quantifies the comparison and makes a judgement.'],
          ['Say it is impossible to know', 0, 'You can reason about which is larger.'],
          ['Repeat the equation', 0, 'Use it, do not just state it.'],
          ['Add that M is constant', 0, 'True, but not the missing reasoning.']]),
      ],
    },
  });
  function qtmGen(mode) {
    return () => { const M = R.pick([40, 50, 60, 80, 100]), V = R.pick([4, 5, 6, 8]), Q = R.pick([100, 120, 150, 160, 200]);
      if (mode === 'pct') { const dm = R.pick([5, 10, 15, 20]); return { kind: 'num', answer: dm, prompt: `V and Q are constant. The money supply rises by ${dm}%. By what percentage does the price level rise, according to the quantity theory?`, fmt: 'Give a percentage (without the % sign).',
        more: { steps: [St('MV = PQ. With V and Q fixed, P changes in the same proportion as M.'), St(`So P rises by ${dm}%.`)] }, sol: [`P rises by ${dm}%, the same as M`] }; }
      const ask = mode || R.pick(['P', 'V', 'M']); const Pv = (M * V) / Q;
      const val = { P: Pv, V, M }[ask];
      const known = { P: `M = ${P.money(M + ' billion')}, V = ${V}, Q = ${Q} billion units`, V: `M = ${P.money(M + ' billion')}, P = ${P.n(Pv)}, Q = ${Q} billion units`, M: `V = ${V}, P = ${P.n(Pv)}, Q = ${Q} billion units` }[ask];
      const rearr = { P: 'P = MV ÷ Q', V: 'V = PQ ÷ M', M: 'M = PQ ÷ V' }[ask];
      return { kind: 'num', answer: val, dp: Number.isInteger(val) ? null : 2, tol: 0.006, prompt: `Using MV = PQ: ${known}. Calculate ${ask}${ask === 'M' ? ' (in billions of dollars)' : ''}.`, fmt: 'Give a number.',
        more: { steps: [St(`Rearrange: ${rearr}.`), St(`= ${P.n(val, 2)}.`)], trap: 'Multiplying when you should divide. Rearrange first.' }, sol: [`${rearr} = ${P.n(val, 2)}`] }; };
  }

  /* ======================= 6. Effects of inflation and monetary policy ======================= */
  P.addUnit({
    id: 'inflation-effects', title: 'Who wins and loses from inflation', mins: 11,
    blurb: 'Savers, borrowers, fixed incomes, low-income households, exporters. Then how the Reserve Bank fights back.',
    recap: 'Inflation reduces the purchasing power of money. People on fixed incomes, and savers earning interest below the inflation rate, lose because their money buys less. Borrowers can gain, because the real value of their debt falls. Low-income households are hit hardest, because they spend most of their income on essentials such as food, rent and power. If NZ inflation is higher than our trading partners’, NZ exports become less competitive and imports more attractive. The Reserve Bank fights inflation by raising the Official Cash Rate: higher interest rates reduce C and I, shifting AD left.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Winners and losers</h2>'), C(3, '<p>Ask: does this group’s income or wealth keep up with prices?</p>')],
        board: [L(0.5, '<b>savers</b>: lose if interest &lt; inflation'), L(2.5, '<b>borrowers</b>: gain: the real value of the debt falls'), L(4.5, '<b>fixed incomes</b>: lose purchasing power'), L(6.5, '<b>low-income households</b>: essentials take most of their budget', 'hit hardest', { hl: true }), L(8.5, '<b>exporters</b>: lose competitiveness if NZ inflation is higher')] },
      { dur: 14, card: [C(0, '<h2>The Reserve Bank raises the OCR</h2>'), C(3, '<p>Higher interest rates: borrowing costs more, saving pays more.</p>'), C(8, '<p>C and I fall, AD shifts left, and the price level rises more slowly.</p>')],
        draw(a) { E.draw(a, MD.asad(), { AD: -1 }, a.seg(a.p, 0.35, 0.75)); } },
    ],
    example: {
      problem: 'Explain why low-income households are more negatively affected by inflation than high-income households.',
      steps: [
        { m: 'Low-income households spend a large share of their income on essentials: food, rent, power and transport.', note: 'their spending' },
        { m: 'When prices of essentials rise, they cannot cut back much, so their real income falls and their standard of living drops.', note: 'the effect' },
        { m: 'They have little or no savings to fall back on.', note: 'buffer' },
        { m: 'High-income households spend a smaller share on essentials and can save less or use savings, so inflation reduces their standard of living less.', note: 'the contrast' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how raising the OCR reduces inflation.', steps: ['The Reserve Bank raises the Official Cash Rate', 'Banks raise their lending and deposit rates', 'Borrowing costs more and saving pays more, so C and I fall', 'AD shifts left from AD to AD1', 'The price level rises more slowly, so inflation falls'] }], 2)(); },
    grades: 'MAMMA',
    gens: [
      P.bank([
        { q: 'Inflation is 5%. A savings account pays 3% interest. What happens to the saver?', a: 'The real value of their savings falls by about 2% a year', why: 'Real interest ≈ nominal interest − inflation = 3 − 5 = −2%.', w: [['They gain 3%', 'That ignores inflation.'], ['They gain 8%', 'Inflation does not add to their return.'], ['Nothing changes', 'Their money buys less each year.']] },
        { q: 'Why can inflation benefit borrowers?', a: 'The real value of the money they owe falls, so their repayments are worth less', why: 'Debts are fixed in dollars; inflation reduces what those dollars are worth.', w: [['Their loans are cancelled', 'Not cancelled.'], ['Interest rates always fall during inflation', 'They usually rise.'], ['They can borrow without interest', 'No.']] },
        { q: 'NZ inflation is 6% while Australia’s is 2%. How are NZ exporters affected?', a: 'Their costs and prices rise faster, so their goods become less competitive in Australia', why: 'Relative inflation matters. The 2024 Not Achieved answers said exporters benefit from high inflation.', w: [['They gain, because their prices rise', 'Higher prices make them less competitive.'], ['No effect: exports are in Australian dollars', 'Costs are still in NZ dollars.'], ['Australian buyers buy more from NZ', 'They would buy less.']] },
        { q: 'Who is most affected by a rise in food and rent prices?', a: 'Low-income households, who spend most of their income on essentials', why: 'The 2025 Merit answers explained why low-income earners are more negatively affected.', w: [['High-income households', 'Essentials are a smaller share of their budgets.'], ['Borrowers with mortgages', 'Mortgages are a different effect.'], ['Exporters', 'Not directly.']] },
      ]),
      () => shift('The Reserve Bank raises the Official Cash Rate to fight inflation. Show the effect on the AS/AD model.', MD.asad(), { AD: -1 }, ['Higher interest rates make borrowing dearer and saving more rewarding.', 'C and I fall, so AD shifts left to AD₁.', 'The price level falls (or rises more slowly): PL to PL₁. Output falls too.'], { wrong: [{ v: { AS: -1 }, msg: 'Interest rates mainly affect spending, so AD, not AS.' }, { v: { AD: 1 }, msg: 'Higher interest rates reduce spending.' }], trap: 'Shifting AD right. Higher rates mean less borrowing and spending.' }),
      P.chain([
        { q: 'Put the chain in order: why high inflation hurts NZ exporters.', steps: ['NZ inflation is higher than in trading partners', 'NZ firms’ costs and prices rise faster', 'NZ goods become relatively more expensive overseas', 'Overseas buyers switch to cheaper suppliers', 'NZ export sales and receipts fall'] },
        { q: 'Put the chain in order: why savers lose when inflation exceeds interest rates.', steps: ['Inflation is 6% and savings earn 3% interest', 'Prices rise faster than the savings grow', 'Each dollar saved buys less than before', 'The real value of savings falls', 'Saving is discouraged'] },
      ]),
      P.bank([
        { q: 'Why does the Reserve Bank raise interest rates when inflation is high, even though it slows the economy?', a: 'To reduce spending (AD) so that inflation returns to the 1–3% target', why: 'Lower inflation protects purchasing power in the long run, at a short-run cost to output.', w: [['To increase government revenue', 'Not its aim.'], ['To make imports dearer', 'Not the mechanism.'], ['To raise AD', 'It lowers AD.']] },
        { q: 'Why can inflation lead to “menu costs” for firms?', a: 'Firms must keep changing price lists, labels and menus, which costs time and money', why: 'Frequent price changes are an inefficiency caused by inflation.', w: [['Restaurants charge more for menus', 'Not what it means.'], ['Customers must pay for menus', 'No.'], ['It only affects cafés', 'It affects every firm that changes prices.']] },
      ]),
      P.terms([['real income', 'Income adjusted for inflation: what it can actually buy.'], ['fixed income', 'Income that does not rise with prices.'], ['real interest rate', 'The interest rate minus the inflation rate.'], ['international competitiveness', 'How attractive a country’s goods are to buyers, compared with competitors’.'], ['monetary policy', 'The Reserve Bank’s use of the OCR to influence interest rates, spending and inflation.']]),
    ],
    tips: [
      'For each group, say <span class="pen">how its income or wealth changes compared with prices</span>, then the effect on its standard of living.',
      'The 2024 Not Achieved answers said low-wage earners and savers prefer high inflation, or exporters benefit from it. They do not.',
      'Excellence: compare two groups, explain why one is affected more, and use the context.',
      'Link the OCR to interest rates, then to C and I, then to AD. The 2025 report noted candidates who missed that link.',
    ],
    aim: {
      intro: '<div class="resource">Inflation in New Zealand is 6% this year, while in Australia it is 3%. Mere is a retired teacher living on her savings, which earn 4% interest. Josh and Ana have just borrowed to buy their first home. A Christchurch firm exports wool carpets to Australia.</div>',
      parts: [
        { q: 'Describe how 6% inflation affects Mere.', write: true, words: '30–50',
          model: [S('Mere’s savings earn 4% interest, but prices are rising 6%.', 'uses the data', true), S('So the real value of her savings falls by about 2% a year: her money buys less.', 'effect', true), S('Her standard of living falls.', 'consequence')],
          earns: 'Achieved: the effect on purchasing power, using the figures.', crit: { A: 'Inflation higher than interest so real value of savings / purchasing power falls; standard of living falls.' } },
        { q: 'Explain why Josh and Ana may be better off than Mere because of inflation.', write: true, words: '60–90',
          model: [S('Josh and Ana owe a fixed number of dollars on their mortgage.', 'their position'), S('With 6% inflation, the real value of that debt falls each year, and wages tend to rise with prices.', 'real value of debt', true), S('So their repayments become a smaller share of their income over time.', 'consequence', true), S('Mere is the opposite: as a saver on a fixed return, inflation reduces the value of what she owns.', 'contrast', true)],
          earns: 'Merit: the effect on borrowers is explained and contrasted with savers.', crit: { M: 'Explains real value of debt falls for borrowers while savings lose value, contrasting the two.' } },
        { q: 'Discuss how NZ’s higher inflation affects the carpet exporter, and whether the Reserve Bank raising the OCR would help or hurt the firm.', write: true, words: '100–150',
          model: [S('NZ inflation (6%) is higher than Australia’s (3%), so the firm’s costs, such as wages and wool, rise faster than its Australian competitors’ costs.', 'relative inflation', true), S('To cover them it must raise its prices, so its carpets become less competitive in Australia and sales fall.', 'effect on exports', true), S('A higher OCR reduces C and I, shifts AD left and brings NZ inflation down, which over time helps the firm’s costs and competitiveness.', 'OCR helps'), S('But higher NZ interest rates attract foreign savings, raising demand for the NZ dollar; an appreciation makes the carpets dearer in Australian dollars, and the firm’s own borrowing costs rise.', 'OCR hurts', true), S('So in the short run a higher OCR is likely to hurt the exporter, but lower inflation in the long run helps it. The net effect depends on how far the dollar rises.', 'justified judgement', true)],
          earns: 'Excellence: the effect of relative inflation is explained, the OCR rise is weighed for and against the exporter, and a reasoned judgement is reached.',
          crit: { M: 'Explains relative inflation reduces the firm’s competitiveness and export sales.', E: 'Discusses both benefits (lower inflation) and costs (higher exchange rate, borrowing costs) of a higher OCR for the exporter, with a reasoned short-run vs long-run judgement.' } },
      ],
      up: [
        up(1, ['Josh and Ana are better off because they borrowed.'], [
          ['Explain why: the real value of their fixed debt falls with inflation and wages tend to rise, so repayments shrink as a share of income; contrast with Mere’s savings', 1, 'Right. Merit explains the mechanism and the contrast.'],
          ['Say houses are expensive', 0, 'Not the mechanism.'],
          ['Give the mortgage amount', 0, 'Not given, and not needed.'],
          ['Say Mere is retired', 0, 'Context, not explanation.']]),
        up(2, ['The exporter loses because NZ inflation is higher. Raising the OCR would help by lowering inflation.'], [
          ['Weigh both sides of the OCR rise (lower inflation vs a higher NZ dollar and borrowing costs) and judge the short- and long-run effects', 1, 'Right. Excellence discusses costs as well as benefits before judging.'],
          ['Say Australia has lower inflation', 0, 'In the resource already.'],
          ['Draw a supply and demand graph for carpets', 0, 'Not the reasoning needed.'],
          ['Say the firm should move to Australia', 0, 'Not discussion of the question.']]),
      ],
    },
  });
})();
