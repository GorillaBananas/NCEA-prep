/* AS 91224 (Economics 2.3) Analyse economic growth using economic concepts and models.
   The exam (three questions) uses the circular flow model, the AS/AD model and the PPF, with measures of growth and
   its effects on groups, the government and the environment. Exam tips draw on the 2023–2025 NZQA assessment reports. */
(function () {
  const P = NP, R = P.R, E = P.econ, MD = P.econ.models;
  const C = (at, html) => ({ at, html });
  const L = (at, html, note, o = {}) => Object.assign({ at, html: `<span class="bq">${html}</span>`, note }, o);
  const S = (m, note, key) => ({ m, note, key: !!key });
  const up = (part, shown, choices, ask) => ({ part, shown, ask, choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });
  const St = (say, m) => ({ say, m });
  const $ = (v) => P.money(v);
  const shift = (prompt, model, answer, steps, o = {}) => ({ kind: 'shift', prompt, model, answer, accept: o.accept, why: o.why, wrong: o.wrong, more: { idea: o.idea, steps: steps.map((s) => St(s)), trap: o.trap } });

  /* ======================= 1. Measuring growth ======================= */
  P.addUnit({
    id: 'measuring-growth', title: 'Measuring economic growth', mins: 11,
    blurb: 'Real GDP, per person, as a percentage change. Then what GDP leaves out.',
    recap: 'Economic growth is an increase in the real output of goods and services in an economy over time, measured by the change in real Gross Domestic Product (GDP). Nominal GDP is measured at current prices, so it rises with inflation; real GDP removes the effect of price changes. Real GDP per capita (real GDP ÷ population) shows output per person and is a better guide to living standards. The growth rate is the percentage change in real GDP. GDP leaves out unpaid work, leisure, the environment and how income is shared, so wider measures such as net social welfare (NSW) or wellbeing indicators adjust for these.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Growth = more real output</h2>'), C(3, '<p>Nominal GDP can rise just because prices rise. Real GDP strips that out.</p>'), C(8, '<p>Divide by population to get real GDP per capita: output per person.</p>')],
        board: [L(0.5, '<b>nominal GDP</b>: at current prices'), L(2.5, '<b>real GDP</b>: at constant prices (inflation removed)'), L(4.5, '<b>real GDP per capita</b> = real GDP ÷ population'), L(6.5, 'growth rate = (new − old) ÷ old × 100', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>What GDP misses</h2>'), C(3, '<p>GDP counts market output only. It can rise while wellbeing falls.</p>')],
        board: [L(0.5, 'unpaid work: caring, volunteering, housework'), L(2.5, 'damage to the environment, and resources used up'), L(4.5, 'how income is shared; leisure time; quality of life'), L(6.5, '<b>net social welfare</b>: GDP adjusted for these', '', { hl: true })] },
    ],
    example: {
      problem: `Real GDP rose from ${$('380 billion')} to ${$('391 billion')}. The population rose from 5.20 million to 5.31 million. Calculate the growth rate of real GDP and of real GDP per capita, and explain what they show.`,
      steps: [
        { m: 'Real GDP growth = (391 − 380) ÷ 380 × 100 = 2.9%.', note: 'percentage change' },
        { m: `Per capita: before 380 ÷ 5.20 = ${$('73 077')}; after 391 ÷ 5.31 = ${$('73 635')} per person.`, note: 'divide by population' },
        { m: 'Per-capita growth = (73 635 − 73 077) ÷ 73 077 × 100 = 0.8%.', note: 'percentage change' },
        { m: 'The economy grew 2.9%, but most of it came from more people. Output per person, a better guide to living standards, grew only 0.8%.', note: 'interpret' },
      ],
    },
    faded() { return growthGen()(); },
    grades: 'AAAMM',
    gens: [
      growthGen(),
      () => { const nom = R.int(380, 460), defl = R.pick([105, 108, 110, 112, 115]); const real = (nom / defl) * 100;
        return { kind: 'num', answer: real, dp: 1, tol: 0.06, prompt: `Nominal GDP is ${$(nom + ' billion')}. The price index (GDP deflator) is ${defl}, with the base year = 100. Calculate real GDP in billions of dollars.`, fmt: 'Give billions to 1 decimal place.',
          wrong: [{ v: (nom * defl) / 100, msg: 'Divide by the price index, do not multiply: real GDP removes inflation.' }],
          more: { steps: [St('Real GDP = nominal GDP ÷ price index × 100.'), St(`${nom} ÷ ${defl} × 100 = ${P.f(real, 1)} billion.`), St('It is smaller than nominal GDP because prices have risen since the base year.')] }, sol: [`${nom} ÷ ${defl} × 100 = ${P.f(real, 1)}`] }; },
      P.terms([['economic growth', 'An increase in the real output of goods and services over time, measured by real GDP.'], ['Gross Domestic Product (GDP)', 'The total value of final goods and services produced in a country in a year.'], ['real GDP', 'GDP adjusted to remove the effect of price changes.'], ['real GDP per capita', 'Real GDP divided by the population: output per person.'], ['net social welfare (NSW)', 'A measure of wellbeing that adjusts GDP for things it leaves out, such as unpaid work, leisure and environmental damage.'], ['nominal GDP', 'GDP measured at current prices, including the effect of inflation.']]),
      P.bank([
        { q: 'Why is real GDP better than nominal GDP for measuring growth?', a: 'Nominal GDP can rise just because prices rise; real GDP shows the change in actual output', why: 'Growth is about more goods and services, not higher prices.', w: [['Real GDP includes unpaid work', 'Neither does.'], ['Nominal GDP ignores exports', 'Both include exports.'], ['Real GDP is always larger', 'Not necessarily.']] },
        { q: 'Why might real GDP per capita be a better measure of living standards than real GDP?', a: 'It allows for population growth, showing output per person', why: 'If population grows as fast as GDP, each person is no better off.', w: [['It includes the environment', 'It does not.'], ['It removes inflation', 'Real GDP already does that.'], ['It counts only exports', 'No.']] },
        { q: 'A city’s GDP rises after a factory opens, but the river becomes polluted. What does GDP miss?', a: 'The cost of environmental damage, which lowers wellbeing', why: 'Net social welfare would subtract the pollution cost.', w: [['The factory’s output', 'GDP counts that.'], ['Workers’ wages', 'GDP counts those.'], ['Nothing: GDP measures wellbeing exactly', 'It does not.']] },
        { q: 'Which activity adds to wellbeing but is not counted in GDP?', a: 'A parent caring for their own children at home', why: 'Unpaid work has no market transaction, so GDP misses it.', w: [['A childcare centre caring for children', 'That is paid, so GDP counts it.'], ['Building a new house', 'Counted.'], ['Exporting butter', 'Counted.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: from nominal GDP to growth per person.', steps: ['Measure nominal GDP at current prices', 'Remove the effect of inflation to get real GDP', 'Divide by the population to get real GDP per capita', 'Compare it with last year’s figure', 'Express the change as a percentage growth rate'] },
      ]),
    ],
    tips: [
      'Define growth carefully: <span class="pen">an increase in real GDP (real output) over time</span>.',
      'Merit in 2025: explaining the difference between GDP and net social welfare measures. Merit in 2024: explaining the limitations of real GDP.',
      'Show calculations step by step, then say what they mean for living standards.',
      'Use per-capita figures when the population is growing.',
    ],
    aim: {
      intro: `<div class="resource">Last year New Zealand’s real GDP grew 2.5%, while the population grew 2.0%. The Treasury’s wellbeing indicators showed rising housing costs and falling water quality in some regions.</div>`,
      parts: [
        { q: 'Define economic growth and real GDP per capita.', write: true, words: '30–50',
          model: [S('Economic growth is an increase in the real output of goods and services in the economy over time.', 'growth', true), S('Real GDP per capita is real GDP divided by the population: real output per person.', 'per capita', true)],
          earns: 'Achieved: both terms defined correctly.', crit: { A: 'Growth = increase in real GDP/real output over time; real GDP per capita = real GDP ÷ population.' } },
        { q: 'Explain why living standards may have risen only slightly even though real GDP grew 2.5%.', write: true, words: '50–80',
          model: [S('Real GDP grew 2.5%, but the population grew 2.0%.', 'uses the data', true), S('So real GDP per capita grew only about 0.5%: output per person barely rose.', 'per capita', true), S('Living standards depend on output per person, so they rose only slightly.', 'conclusion')],
          earns: 'Merit: the data are used to show that per-capita growth was small, and why that matters.', crit: { M: 'Explains population growth absorbs most of the GDP growth so per-capita growth ~0.5%, so living standards rose little.' } },
        { q: 'Discuss whether real GDP is a good measure of New Zealanders’ wellbeing, using the information given.', write: true, words: '100–140',
          model: [S('Real GDP measures market output, and higher output usually means more income and jobs, so it is a useful guide.', 'strength', true), S('But it ignores how growth affects quality of life: rising housing costs reduce what households have left to spend, even if GDP rises.', 'limitation 1, with context'), S('It ignores environmental damage: falling water quality lowers wellbeing but is not subtracted from GDP.', 'limitation 2, with context', true), S('It also ignores unpaid work, leisure and how income is shared.', 'other limitations'), S('So real GDP alone overstates wellbeing here; a wider measure such as net social welfare or the wellbeing indicators gives a fuller picture.', 'justified judgement', true)],
          earns: 'Excellence: strengths and limitations of GDP are weighed using the context, leading to a justified judgement.',
          crit: { M: 'Explains limitations of GDP such as environment or housing costs.', E: 'Weighs the usefulness of GDP against several limitations, using the resource (housing, water quality, per-capita data), and makes a justified judgement favouring wider measures such as NSW.' } },
      ],
      up: [
        up(1, ['GDP grew 2.5% so living standards went up 2.5%.'], [
          ['Correct it with per capita: population grew 2.0%, so output per person grew only about 0.5%, so living standards rose only a little', 1, 'Right. Merit uses the population data to adjust the growth figure.'],
          ['Add the definition of GDP', 0, 'That does not fix the error.'],
          ['Say GDP is nominal', 0, 'The figure is real GDP.'],
          ['Say 2.5% is high', 0, 'Not the point.']]),
        up(2, ['GDP is not a good measure because it leaves out the environment.'], [
          ['Weigh it: say what GDP does show (output, income), use both pieces of context (housing costs, water quality), add other limitations, and judge against a wider measure', 1, 'Right. One limitation is not a discussion. Excellence weighs strengths and limitations.'],
          ['Define NSW', 0, 'Use it in the argument, not alone.'],
          ['Say GDP is calculated by Stats NZ', 0, 'Not discussion.'],
          ['Repeat part (b)', 0, 'Not the question.']]),
      ],
    },
  });
  function growthGen() {
    return () => { const a = R.int(340, 420), g = R.pick([1.2, 1.8, 2.4, 3.1, 3.6, -0.8]); const b = Math.round(a * (1 + g / 100) * 10) / 10; const ans = ((b - a) / a) * 100;
      return { kind: 'num', answer: ans, dp: 1, tol: 0.06, prompt: `Real GDP changed from ${$(a + ' billion')} to ${$(b + ' billion')}. Calculate the economic growth rate as a percentage.`, fmt: 'Give a percentage to 1 decimal place (negative if it fell, no % sign).',
        wrong: [{ v: ((b - a) / b) * 100, msg: 'Divide by the earlier figure.' }, { v: b - a, msg: 'That is the change in billions. Turn it into a percentage.' }],
        more: { steps: [St(`Change: ${P.n(b)} − ${a} = ${P.n(b - a, 1)}.`), St(`÷ ${a} × 100 = ${P.f(ans, 1)}%.`), St(ans < 0 ? 'Negative: real output fell, so there was no growth.' : 'Positive: the economy grew.')] }, sol: [`(${P.n(b)} − ${a}) ÷ ${a} × 100 = ${P.f(ans, 1)}%`] }; };
  }

  /* ======================= 2. The circular flow ======================= */
  const FLOWNAMES = E.FLOWS;
  P.addUnit({
    id: 'circular-flow', title: 'The five-sector circular flow', mins: 12,
    blurb: 'Households, firms, government, financial and overseas sectors, and the money flowing between them.',
    recap: 'The circular flow model shows money flowing between five sectors. Households supply resources to firms and receive income (wages, rent, interest, profit), which they spend on consumption. Some income leaks out as savings (to the financial sector), taxes (to the government) and import payments (overseas). Money flows back in as injections: investment (from the financial sector to firms), government spending and export receipts. When injections are larger than leakages, the flow grows: more spending, more production, more income, more jobs: growth in actual output in the short run. Lasting growth also needs more productive capacity.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>The inner loop</h2>'), C(3, '<p>Households earn income from firms, and spend it on what firms produce.</p>'), C(8, '<p>The more spending, the more firms produce, and the more income they pay out.</p>')],
        board: [L(0.5, 'firms → households: <b>income</b> (wages, rent, interest, profit)'), L(3.5, 'households → firms: <b>consumption spending</b>'), L(6.5, 'more spending → more production → more income', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>Leakages and injections</h2>'), C(3, '<p>Leakages leave the loop: savings, taxes, imports.</p>'), C(7.5, '<p>Injections come in: investment, government spending, exports.</p>'), C(11, '<p>Injections &gt; leakages: the economy grows.</p>')],
        board: [L(0.5, '<b>leakages</b>: S (savings), T (taxes), M (imports)'), L(3, '<b>injections</b>: I (investment), G (government spending), X (exports)'), L(6, 'I + G + X &gt; S + T + M → flows grow → growth', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>The diagram</h2>'), C(3, '<p>Learn where each arrow goes. Exam questions ask you to identify flows and explain what changes.</p>')],
        board: [{ at: 0.5, html: E.flow({ income: true, spending: true, taxes: true, govspend: true, savings: true, investment: true, exports: true, imports: true }) }] },
    ],
    example: {
      fig: E.flow({ exports: true, income: true, spending: true, taxes: true }),
      problem: 'Tourist numbers rise strongly. Explain the effect on the flows in the circular flow model.',
      steps: [
        { m: 'Overseas tourists’ spending in NZ is an export, so export receipts from the overseas sector to firms increase.', note: 'the injection' },
        { m: 'Firms such as hotels and tour companies sell more, so they increase production and hire more workers.', note: 'firms respond' },
        { m: 'The income flow from firms to households increases (more wages and profits).', note: 'income' },
        { m: 'Households spend more, so consumption spending rises; they also pay more taxes and save more.', note: 'knock-on flows' },
        { m: 'Government tax revenue rises and, with fewer people unemployed, its spending on benefits can fall.', note: 'government' },
      ],
    },
    faded() { return flowLabel()(); },
    grades: 'AAMM',
    gens: [
      flowLabel(),
      P.bank([
        { q: 'Which of these is an injection into the circular flow?', a: 'Government spending', why: 'Injections: investment, government spending, exports.', w: [['Taxes', 'A leakage.'], ['Savings', 'A leakage.'], ['Import payments', 'A leakage.']] },
        { q: 'Which flow goes from the financial sector to firms?', a: 'Investment', why: 'Savings deposited with banks are lent to firms to buy capital.', w: [['Savings', 'Savings go from households to the financial sector.'], ['Taxes', 'Taxes go to the government.'], ['Export receipts', 'They come from overseas.']] },
        { q: 'Which flow goes from households to the overseas sector?', a: 'Import payments', why: 'Spending on goods and services made overseas leaks out of NZ’s flow.', w: [['Export receipts', 'Those come in from overseas.'], ['Government spending', 'From government to firms (and households).'], ['Income', 'From firms to households.']] },
      ]),
      P.bank([
        { q: 'Firms increase production. What happens to government revenue and spending?', a: 'Tax revenue rises and spending on benefits falls as more people are employed', why: 'The 2025 Excellence answers explained both: more revenue and less expenditure.', w: [['Both fall', 'Revenue rises with incomes.'], ['Revenue falls, spending rises', 'The opposite.'], ['No change', 'Both change.']] },
        { q: 'Households become worried and save much more. What happens to the circular flow?', a: 'Consumption spending falls, so firms produce less and incomes fall', why: 'Higher savings is a bigger leakage; unless investment rises to match, the flow shrinks.', w: [['The flow grows, because savings are good', 'Not in the short run.'], ['Exports rise', 'Not connected.'], ['Taxes rise', 'Taxes fall as incomes fall.']] },
        { q: 'Why does an increase in exports lead to more than its own value of extra income?', a: 'The extra income is spent again and again around the flow', why: 'Each round of spending becomes someone else’s income (the multiplier idea).', w: [['Exports are taxed twice', 'No.'], ['Exports come in two flows', 'No.'], ['It does not', 'The extra income is respent.']] },
      ]),
      P.chain([
        { q: 'Put the chain in order: how more investment leads to growth.', steps: ['Firms borrow from the financial sector to build a new factory', 'The investment injection increases', 'Firms increase production and employ more workers', 'Income paid to households rises', 'Households spend more, so the flows grow further'] },
        { q: 'Put the chain in order: how a fall in exports shrinks the circular flow.', steps: ['Overseas demand for NZ goods falls', 'Export receipts to firms fall', 'Firms cut production and jobs', 'Income paid to households falls', 'Consumption spending and tax revenue fall'] },
      ]),
    ],
    tips: [
      'Name the flow, its <span class="pen">direction</span> (from which sector to which), and whether it rises or falls.',
      'The 2025 Not Achieved answers could not identify the relevant flows. Learn the diagram.',
      'Merit in 2025: explaining the impact of increased production with specific reference to two or more flows.',
      'Excellence in 2025: the impact on the government, referring to both higher revenue and lower expenditure.',
    ],
    aim: {
      intro: '<div class="resource">A new sustainable aviation fuel plant opens in Southland. It employs 300 people, buys inputs from local firms, and sells most of its fuel to airlines overseas.</div>',
      parts: [
        { q: 'Identify three flows in the circular flow model that increase as a result of the new plant.', write: true, words: '30–50',
          model: [S('Export receipts from the overseas sector to firms rise, as fuel is sold overseas.', 'flow 1', true), S('Income from firms to households rises, as the plant pays 300 workers.', 'flow 2', true), S('Consumption spending from households to firms rises as workers spend their wages; taxes to the government rise too.', 'flow 3', true)],
          earns: 'Achieved: three correct flows with their direction.', crit: { A: 'Three correct flows (e.g. export receipts, income, consumption spending, investment, taxes) with direction.' } },
        { q: 'Explain how the plant affects the government sector.', write: true, words: '60–90',
          model: [S('The plant’s workers earn wages, so they pay more income tax.', 'income tax', true), S('Their spending raises GST collected, and the firm’s profits are taxed, so tax revenue increases.', 'more revenue'), S('Workers who were unemployed no longer need benefits, so government spending on transfers falls.', 'less expenditure', true), S('So the government’s budget position improves on both sides.', 'conclusion')],
          earns: 'Merit: the effects on government revenue and spending are explained through the flows.', crit: { M: 'Explains more tax revenue (income tax, GST, company tax) and less spending on benefits.' } },
        { q: 'Discuss the positive and negative effects of the plant on economic growth in Southland, and judge which is larger.', write: true, words: '100–150',
          model: [S('Positive: export receipts are an injection; with 300 jobs and local suppliers, income and spending rise around the flow, so real output grows.', 'positive, through the flows', true), S('The extra income is respent with local businesses, so growth is larger than the plant’s own output.', 'multiplier'), S('Negative: workers and resources may be drawn away from other firms, and the plant needs inputs and land that have an opportunity cost.', 'negative 1'), S('Some inputs and machinery may be imported, a leakage that reduces the local effect; there may be environmental costs not counted in GDP.', 'negative 2', true), S('On balance the positive effect is larger, because the plant brings a large new injection of export receipts and jobs to a region, while the leakages and costs are smaller.', 'justified judgement', true)],
          earns: 'Excellence: positive and negative effects are explained through the model and weighed, with a reasoned judgement (as in the 2025 Excellence evidence).',
          crit: { M: 'Explains a positive and a negative effect on growth.', E: 'Explains positive effects (injection, multiplier) and negative effects (opportunity cost, leakages, environment) using the circular flow, and makes a reasoned judgement about which is larger.' } },
      ],
      up: [
        up(1, ['The government gets more tax.'], [
          ['Explain both sides: more income tax, GST and company tax from the new jobs and spending; less spending on benefits as people find work', 1, 'Right. The 2025 Excellence answers covered both revenue and expenditure; Merit at least explains the links.'],
          ['Say the government is a sector', 0, 'True, but not explanation.'],
          ['Name the region', 0, 'Context, not reasoning.'],
          ['Say taxes are a leakage', 0, 'True, but explain the change.']]),
        up(2, ['The plant is good for growth because it creates jobs.'], [
          ['Explain the positives through the flows, add negatives (opportunity cost, imported inputs, environment), and judge which is larger with reasons', 1, 'Right. Excellence needs both sides and a reasoned judgement.'],
          ['Repeat the 300 jobs', 0, 'Data without discussion.'],
          ['Say aviation fuel is green', 0, 'Not discussion of growth.'],
          ['Define growth', 0, 'Not asked here.']]),
      ],
    },
  });
  function flowLabel() {
    return () => { const keys = P.R.shuffle(Object.keys(FLOWNAMES)).slice(0, 4), Lt = 'ABCD'; const which = {}; keys.forEach((k, i) => (which[k] = Lt[i]));
      return { kind: 'match', prompt: 'Match each lettered flow in the five-sector circular flow model to its name.', fig: E.flow(which), pairs: keys.map((k, i) => ({ k: Lt[i], a: FLOWNAMES[k] })), extra: Object.keys(FLOWNAMES).filter((k) => !keys.includes(k)).slice(0, 2).map((k) => FLOWNAMES[k]),
        more: { idea: 'Follow each arrow: which sector does the money leave, and which does it reach?', steps: keys.map((k, i) => St(`<b>${Lt[i]}</b>: ${FLOWNAMES[k]}.`)) } }; };
  }

  /* ======================= 3. The PPF ======================= */
  const PPFQ = [
    ['A large migration of skilled workers into New Zealand', 1, 'More labour increases productive capacity: the PPF shifts out.'],
    ['New technology raises productivity across industries', 1, 'Better technology means more output from the same resources: the PPF shifts out.'],
    ['A cyclone destroys roads, bridges and orchards', -1, 'Resources are destroyed, so productive capacity falls: the PPF shifts in.'],
    ['Firms invest heavily in new machinery', 1, 'More capital goods increase productive capacity: the PPF shifts out.'],
    ['A long-term fall in the working-age population', -1, 'Less labour means less productive capacity: the PPF shifts in.'],
  ];
  P.addUnit({
    id: 'ppf', title: 'The production possibility frontier', mins: 11,
    blurb: 'Inside the curve: unused resources. Curve shifts out: more capacity. Know the difference.',
    recap: 'A production possibility frontier (PPF) shows the maximum combinations of two goods (here capital goods and consumer goods) an economy can produce with all its resources fully and efficiently used, and its current technology. A point on the PPF uses all resources; a point inside means resources are unemployed or underused (a fall in actual output); a point outside is unattainable now. Economic growth in productive capacity (more or better resources or technology) shifts the PPF out; destroying resources shifts it in. Moving along the PPF shows opportunity cost: making more of one good means giving up some of the other. Producing more capital goods now shifts the PPF further out in future.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>On, inside, outside</h2>'), C(3, '<p>On the curve (B): all resources used. Inside (A): unemployment, idle factories.</p>'), C(8.5, '<p>Moving from A to B is growth in actual output, without new resources.</p>')],
        draw(a) { E.draw(a, MD.ppf({ points: [{ q: 0.25, p: 0.25, label: 'A' }, { q: 0.4, p: 0.52, label: 'B' }, { q: 0.62, p: 0.6, label: 'C (unattainable)' }] }), {}, 1); } },
      { dur: 13, card: [C(0, '<h2>Shift out: more capacity</h2>'), C(3, '<p>More resources (workers, capital), better technology, or more skills.</p>'), C(8, '<p>A shift in means resources destroyed, for example by a cyclone.</p>')],
        draw(a) { E.draw(a, MD.ppf(), { PPF: 1 }, a.seg(a.p, 0.3, 0.7)); } },
      { dur: 12, card: [C(0, '<h2>Opportunity cost and the future</h2>'), C(3, '<p>Choosing more capital goods today means fewer consumer goods now.</p>'), C(7.5, '<p>But more machines and infrastructure shift the PPF further out later: more of everything in future.</p>')],
        board: [L(0.5, 'along the curve: more of one = less of the other'), L(3, 'that sacrifice is the <b>opportunity cost</b>'), L(5.5, 'more capital goods now → bigger PPF later', '', { hl: true })] },
    ],
    example: {
      fig: E.svg(MD.ppf({ points: [{ q: 0.4, p: 0.52, label: 'B' }, { q: 0.25, p: 0.25, label: 'A (recession)' }] }), { PPF: -1 }),
      problem: 'Explain the difference between a fall in output caused by a recession and one caused by an earthquake, using the PPF.',
      steps: [
        { m: 'In a recession, spending falls and firms lay off workers, but the workers and factories still exist.', note: 'recession' },
        { m: 'So production moves from a point on the PPF to a point inside it: resources are underused, but the PPF does not move.', note: 'point inside' },
        { m: 'An earthquake destroys buildings, roads and machinery, so productive capacity is reduced.', note: 'earthquake' },
        { m: 'So the PPF itself shifts in. This is worse for long-term growth, because the capacity must be rebuilt before output can recover.', note: 'compare' },
      ],
    },
    faded() { const [ev, d, why] = R.pick(PPFQ); return shift(`<b>${ev}.</b> Show the effect on the PPF.`, MD.ppf(), { PPF: d }, [why], { why, wrong: [{ v: { PPF: -d }, msg: 'Check the direction: does this add to or destroy resources?' }] }); },
    grades: 'AMAME',
    gens: [
      () => { const [ev, d, why] = R.pick(PPFQ); return shift(`<b>${ev}.</b> Show the effect on the PPF.`, MD.ppf(), { PPF: d }, [why], { why, wrong: [{ v: { PPF: -d }, msg: 'Check the direction.' }] }); },
      P.bank([
        { q: 'What does a point inside the PPF show?', a: 'Resources are unemployed or underused', why: 'The economy could produce more of both goods with what it has.', w: [['Maximum efficiency', 'That is a point on the curve.'], ['An output the economy cannot reach', 'That is outside the curve.'], ['Economic growth', 'Growth moves the point out or shifts the curve.']] },
        { q: 'A recession causes high unemployment. How is this shown on the PPF?', a: 'Production moves to a point inside the PPF; the curve stays where it is', why: 'Resources still exist but are not used. The 2025 Achieved answers understood this difference.', w: [['The PPF shifts in', 'That is for destroyed resources.'], ['The PPF shifts out', 'Unemployment does not add capacity.'], ['A point outside the PPF', 'Unattainable.']] },
        { q: 'What is the opportunity cost of producing more capital goods?', a: 'The consumer goods given up to make them', why: 'Moving along the PPF, more of one means less of the other.', w: [['The money spent on capital goods', 'Opportunity cost is the next best alternative given up.'], ['Nothing, if resources are fully used', 'On the PPF there is always a trade-off.'], ['The extra capital goods made', 'That is the gain, not the cost.']] },
      ]),
      P.terms([['production possibility frontier (PPF)', 'A curve showing the maximum combinations of two goods an economy can produce with all resources fully used and given technology.'], ['opportunity cost', 'The next best alternative given up when a choice is made.'], ['productive capacity', 'The maximum output an economy can produce with its resources and technology.'], ['capital goods', 'Goods used to produce other goods, such as machinery and buildings.'], ['consumer goods', 'Goods bought by households for their own use.'], ['unemployment of resources', 'When resources such as labour or machinery are not being used, so output is inside the PPF.']]),
      P.chain([
        { q: 'Put the chain in order: how producing more capital goods now leads to future growth.', steps: ['The economy chooses more capital goods and fewer consumer goods', 'The opportunity cost is fewer consumer goods now', 'The extra machinery and infrastructure add to productive capacity', 'The PPF shifts outwards in the future', 'The economy can then produce more of both goods'] },
      ]),
      P.bank([
        { q: 'Why is a fall in productive capacity worse for long-term growth than unemployment of resources?', a: 'Lost capacity must be rebuilt before output can recover, while idle resources can be put back to work quickly', why: 'The 2025 Excellence answers explained exactly this.', w: [['Unemployment is always worse', 'Not for long-term growth.'], ['They are equally bad', 'Lost capacity takes longer to fix.'], ['Lost capacity is temporary', 'It lasts until resources are rebuilt.']] },
        { q: 'After a cyclone, the government spends heavily on rebuilding roads rather than on consumer goods. Using the PPF, why might this help?', a: 'Rebuilding capital restores productive capacity, shifting the PPF back out, so future output is higher', why: 'The 2024 Excellence answers used the cyclone context to discuss this trade-off.', w: [['It moves production outside the PPF', 'Unattainable.'], ['It has no effect on the PPF', 'Capital goods add capacity.'], ['It reduces opportunity cost to zero', 'There is still a cost: fewer consumer goods now.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      '<span class="pen">Inside the PPF = underused resources. PPF shifts = changed capacity.</span> The 2025 Achieved answers understood this difference.',
      'Label the axes with the two goods, and mark points or shifts clearly (PPF to PPF₁).',
      'Merit in 2024: showing opportunity cost on the PPF and explaining capital vs consumer goods. Not Achieved: could not show it.',
      'Excellence in 2025: explaining why lost capacity is worse for long-term growth than unemployment.',
    ],
    aim: {
      intro: '<div class="resource">Cyclone Gabrielle in 2023 destroyed roads, bridges and orchards in Hawke’s Bay and Tairāwhiti. In the months afterwards many orchard workers were also out of work. The government chose to spend billions on rebuilding infrastructure.</div>',
      parts: [
        { q: 'Show the effect of the destruction of roads, bridges and orchards on a PPF, and describe what it means.', write: true, words: '30–50',
          model: [S('The PPF shifts in from PPF to PPF1.', 'the shift', true), S('The cyclone destroyed resources (capital and land), so productive capacity fell.', 'meaning', true), S('The economy can now produce less of both goods at most.', 'consequence')],
          earns: 'Achieved: the correct shift and its meaning.', crit: { A: 'PPF shifts inwards; productive capacity reduced because resources destroyed.' } },
        { q: 'Explain the difference between the orchard workers being out of work and the destruction of the orchards, using the PPF.', write: true, words: '60–90',
          model: [S('Workers out of work are an unused resource: they still exist and could work.', 'unemployment', true), S('This moves production to a point inside the PPF; the curve itself does not move.', 'point inside', true), S('Destroyed orchards are lost capacity, so the PPF itself shifts in.', 'capacity lost', true), S('So one is underuse of existing resources; the other is a loss of resources.', 'contrast')],
          earns: 'Merit: the two effects are distinguished clearly on the PPF.', crit: { M: 'Explains unemployment = point inside PPF; destruction = PPF shifts in; contrasts them.' } },
        { q: 'Discuss the government’s decision to spend heavily on rebuilding infrastructure rather than on consumer goods. Refer to opportunity cost and the PPF.', write: true, words: '100–150',
          model: [S('Spending on infrastructure means producing more capital goods and fewer consumer goods: the opportunity cost is the consumer goods given up now.', 'opportunity cost', true), S('On the PPF this is a move along the curve towards capital goods.', 'on the model'), S('Rebuilt roads and bridges restore productive capacity and let orchards and firms reach markets again, so the PPF shifts back out over time.', 'future capacity', true), S('Rebuilding restores lost capacity, which matters more for long-term growth than unemployment, and the construction work also employs idle workers.', 'links the two effects'), S('So the decision is justified: households give up some consumption now, but the region gains higher output and incomes in future.', 'justified judgement', true)],
          earns: 'Excellence: the trade-off is explained with opportunity cost and the PPF, linked to future capacity, and the decision is evaluated (as in the 2024 cyclone Excellence evidence).',
          crit: { M: 'Explains the opportunity cost of more capital goods and that it rebuilds capacity.', E: 'Discusses the trade-off between current consumption and capital goods, its effect on future capacity on the PPF, and justifies whether the decision is sound.' } },
      ],
      up: [
        up(1, ['Unemployed workers and destroyed orchards both reduce output.'], [
          ['Distinguish them on the PPF: unemployment is a point inside (resources unused); destruction shifts the PPF in (resources lost)', 1, 'Right. Merit shows the difference on the model.'],
          ['Say both are bad', 0, 'Not explanation.'],
          ['Name the cyclone', 0, 'Context, not explanation.'],
          ['Draw only one PPF', 0, 'Show both effects.']]),
        up(2, ['Rebuilding is a good idea because it fixes the damage.'], [
          ['Explain the opportunity cost (consumer goods given up now), the move along the PPF, and the future outward shift, then justify the decision', 1, 'Right. Excellence weighs the trade-off with the model before judging.'],
          ['List the damaged roads', 0, 'Context, not reasoning.'],
          ['Say the government has money', 0, 'Not the economic argument.'],
          ['Define a PPF', 0, 'Use it; do not just define it.']]),
      ],
    },
  });

  /* ======================= 4. Growth on the AS/AD model ======================= */
  const GROWTH_EV = [
    ['Firms invest in new technology that raises productivity', { AS: 1, LRAS: 1 }, 'Productive capacity rises: AS and LRAS shift right. Real output rises from Y to Y1 and the price level falls from PL to PL1: long-run growth without inflation.'],
    ['Migration adds 60 000 workers to the labour force', { AS: 1, LRAS: 1 }, 'More labour raises productive capacity: AS and LRAS shift right, so real output rises. The new residents also spend, so showing AD right as well is accepted; the price level then depends on which shift is larger.', [{ AS: 1, LRAS: 1, AD: 1 }]],
    ['World demand for NZ exports rises', { AD: 1 }, 'Exports (X) are part of AD, so AD shifts right. Real output rises from Y to Y1 (growth), but the price level rises too.'],
    ['The government spends more on hospitals and schools', { AD: 1 }, 'Government spending (G) is part of AD, so AD shifts right. Output rises in the short run; prices rise too.'],
  ];
  P.addUnit({
    id: 'growth-asad', title: 'Growth on the AS/AD model', mins: 11,
    blurb: 'More spending gives short-run growth with inflation. More capacity gives long-run growth with stable prices.',
    recap: 'On the AS/AD model, economic growth is a rise in real output (Y to Y1). An increase in aggregate demand (AD shifts right), from more consumption, investment, government spending or exports, raises real output in the short run, but also raises the price level. An increase in productive capacity, from more or better resources, technology or skills, shifts aggregate supply right (AS, and the long-run AS line, LRAS, where the economy is at full capacity). This raises real output and lowers the price level: sustainable long-run growth. Investment does both: it adds to AD now and to AS later.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>AD right: growth, with inflation</h2>'), C(3, '<p>More spending: firms produce more, Y rises to Y₁. But PL rises to PL₁ too.</p>'), C(8, '<p>Near full capacity (LRAS), extra demand mostly raises prices.</p>')],
        draw(a) { E.draw(a, MD.asadLR(), { AD: 1 }, a.seg(a.p, 0.3, 0.7)); } },
      { dur: 14, card: [C(0, '<h2>AS and LRAS right: sustainable growth</h2>'), C(3, '<p>More capacity: AS shifts right, and LRAS too. Y rises; PL falls.</p>'), C(8.5, '<p>Growth without inflation. This is what productivity, skills and technology deliver.</p>')],
        draw(a) { E.draw(a, MD.asadLR(), { AS: 1, LRAS: 1 }, a.seg(a.p, 0.3, 0.7)); } },
      { dur: 11, card: [C(0, '<h2>Which curve?</h2>')],
        board: [L(0.5, 'spending changes (C, I, G, X − M) → <b>AD</b>'), L(3, 'capacity changes (labour, capital, technology, skills) → <b>AS and LRAS</b>'), L(6, 'investment: AD now, AS later', '', { hl: true })] },
    ],
    example: {
      fig: E.svg(MD.asadLR(), { AS: 1, LRAS: 1 }),
      problem: 'Explain, using the AS/AD model, how an increase in labour productivity leads to economic growth.',
      steps: [
        { m: 'Higher productivity means each worker produces more, so firms’ costs per unit fall and productive capacity rises.', note: 'the cause' },
        { m: 'AS shifts right from AS to AS1, and LRAS shifts right as full-capacity output increases.', note: 'the model' },
        { m: 'Real output rises from Y to Y1: economic growth.', note: 'growth' },
        { m: 'The price level falls from PL to PL1, so this growth comes without inflation and can be sustained.', note: 'price level' },
      ],
    },
    faded() { const [ev, ans, why, accept] = R.pick(GROWTH_EV); return shift(`<b>${ev}.</b> Show the effect on the AS/AD model.`, MD.asadLR(), ans, [why], { why, accept, wrong: gWrong(ans) }); },
    grades: 'AMAMM',
    gens: [
      () => { const [ev, ans, why, accept] = R.pick(GROWTH_EV); return shift(`<b>${ev}.</b> Show the effect on the AS/AD model.`, MD.asadLR(), ans, [why], { why, accept, wrong: gWrong(ans), trap: 'Changes in capacity move AS and LRAS together. Changes in spending move AD.' }); },
      P.bank([
        { q: 'Why is growth from an AS increase seen as more sustainable than growth from an AD increase?', a: 'It raises output while lowering the price level, so it does not cause inflation', why: 'AD-led growth pushes prices up and is limited by capacity.', w: [['AS growth is always faster', 'Not necessarily.'], ['AD growth lowers prices', 'It raises them.'], ['AS growth needs no investment', 'It usually needs investment.']] },
        { q: 'What does the LRAS line show?', a: 'The economy’s full-capacity output, set by its resources and technology', why: 'Growth in capacity shifts it right.', w: [['Total spending', 'That is AD.'], ['The price level', 'That is on the y-axis.'], ['Imports', 'No.']] },
        { q: 'Firms build new factories. Which curves shift?', a: 'AD now (investment spending) and AS later (more capacity)', why: 'Investment is both spending today and capacity tomorrow.', w: [['Only AD', 'It also adds capacity.'], ['Only AS', 'It is also spending now.'], ['Neither', 'Both.']] },
      ]),
      P.terms([['aggregate supply (AS)', 'The total output firms are willing to supply at each price level.'], ['long-run aggregate supply (LRAS)', 'The economy’s full-capacity output, set by resources and technology.'], ['productivity', 'Output per worker or per hour worked.'], ['sustainable growth', 'Growth that meets present needs without reducing the ability of future generations to meet theirs.'], ['productive capacity', 'The maximum output the economy can produce.']]),
      P.chain([
        { q: 'Put the chain in order: how education spending leads to long-run growth.', steps: ['The government invests in education and training', 'Workers gain skills (human capital)', 'Labour productivity rises', 'AS and LRAS shift right', 'Real output rises from Y to Y1 and the price level falls from PL to PL1'] },
      ]),
      P.bank([
        { q: 'NZ is near full capacity when AD rises sharply. What is the likely result?', a: 'Little extra output, but a large rise in the price level', why: 'Close to LRAS, firms cannot produce much more, so extra demand mainly raises prices.', w: [['A large rise in output with stable prices', 'That needs spare capacity or more AS.'], ['A fall in output', 'Not from more demand.'], ['A fall in the price level', 'Prices rise.']] },
      ]),
    ],
    tips: [
      'Sort the cause: <span class="pen">spending → AD; capacity → AS and LRAS</span>.',
      'Show the change in both Y and PL, with labels, and say whether the growth is inflationary.',
      'The 2025 Achieved answers stated the AD formula correctly; Merit referred directly to the models in the explanation.',
      'Long-run growth comes from productivity, skills, technology and capital. Say how each adds capacity.',
    ],
    aim: {
      intro: '<div class="resource">The government invests in faster broadband and training for rural workers. At the same time, strong export prices are raising farm incomes and spending.</div>',
      parts: [
        { q: 'Show on an AS/AD model the effect of higher export prices on real output and the price level.', write: true, words: '30–50',
          model: [S('Higher export prices raise exports (X) and farm spending (C), so AD shifts right from AD to AD1.', 'the shift', true), S('Real output rises from Y to Y1.', 'output', true), S('The price level rises from PL to PL1.', 'price level', true)],
          earns: 'Achieved: the right shift and the changes in output and price level.', crit: { A: 'AD right; Y to Y1; PL to PL1.' } },
        { q: 'Explain how investment in broadband and training leads to long-run economic growth. Refer to the model.', write: true, words: '60–90',
          model: [S('Broadband and training raise productivity: workers and firms can produce more with the same resources.', 'productivity', true), S('Productive capacity increases, so AS shifts right from AS to AS1 and LRAS shifts right.', 'AS and LRAS', true), S('Real output rises from Y to Y1, and the price level falls from PL to PL1.', 'results, labelled', true), S('Because capacity has grown, this growth can be sustained without inflation.', 'sustainable')],
          earns: 'Merit: the investment is linked to productivity, the AS and LRAS shift, and the results, using labels.', crit: { M: 'Explains productivity → capacity → AS and LRAS right → Y up, PL down, with labels.' } },
        { q: 'Discuss which source of growth, the export boom or the investment, is better for New Zealand in the long run.', write: true, words: '100–150',
          model: [S('The export boom raises AD, so output rises quickly, but the price level rises too, and the boom depends on world prices that may fall.', 'export boom: quick but inflationary, uncertain', true), S('The investment raises AS and LRAS, so output rises while the price level falls, and the higher capacity lasts.', 'investment: lasting, non-inflationary', true), S('Investment also adds to AD in the short run while the broadband is built, giving some growth now as well.', 'investment does both'), S('If both happen together, AD and AS both shift right: output rises strongly, and the effect on the price level depends on which shift is larger.', 'combined effect'), S('So the investment is better in the long run: it builds lasting capacity and keeps inflation down, while the export boom is welcome but temporary.', 'justified judgement', true)],
          earns: 'Excellence: both sources are compared on the model for output, prices and permanence, and a justified long-run judgement is made.',
          crit: { M: 'Explains the AD shift from exports and the AS shift from investment.', E: 'Compares the two sources on the model (output, price level, permanence), considers the combined effect, and justifies which is better in the long run.' } },
      ],
      up: [
        up(1, ['Training makes workers better so the economy grows.'], [
          ['Explain the links with the model: training raises productivity → capacity rises → AS and LRAS shift right → Y to Y1, PL to PL1', 1, 'Right. Merit explains the mechanism and uses the model’s labels.'],
          ['Say broadband is fast', 0, 'Not the mechanism.'],
          ['Shift AD', 0, 'Training mainly changes capacity, so AS.'],
          ['Define growth', 0, 'Not the missing link.']]),
        up(2, ['Investment is better because it is long-term.'], [
          ['Compare both on the model (AD vs AS shifts; price level; permanence), consider them together, then justify the judgement', 1, 'Right. Excellence compares and justifies; “long-term” needs explaining.'],
          ['Say exports are bad', 0, 'Exports help too; compare them.'],
          ['Repeat part (b)', 0, 'The export boom is missing.'],
          ['Add the AD formula', 0, 'Not discussion.']]),
      ],
    },
  });
  function gWrong(ans) { return ans.AD ? [{ v: { AS: 1, LRAS: 1 }, msg: 'This is about spending, so it moves AD.' }, { v: { AD: -1 }, msg: 'Spending rises, so AD shifts right.' }, { v: { AS: 1 }, msg: 'This is about spending, so AD.' }] : [{ v: { AD: 1 }, msg: 'This adds capacity, so AS (and LRAS) shift.' }, { v: { AS: 1 }, msg: 'Capacity rises, so LRAS shifts right as well as AS.' }, { v: { LRAS: 1 }, msg: 'AS shifts too: costs per unit fall.' }]; }

  /* ======================= 5. Causes of growth ======================= */
  P.addUnit({
    id: 'causes-growth', title: 'What causes economic growth', mins: 9,
    blurb: 'More resources, better resources, better technology, and the spending to use them.',
    recap: 'Economic growth comes from increasing the quantity or quality of resources and using them fully. Supply-side causes raise productive capacity: more capital (investment in machinery and infrastructure), more labour (population growth, migration, more people working), better skills and education (human capital), new technology, and new natural resources. Demand-side causes raise spending, so existing resources are fully used: higher exports, consumption, investment and government spending. Productivity, output per worker, is the key to sustained growth in living standards.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>More and better resources</h2>'), C(3, '<p>Land, labour, capital and enterprise. More of them, or better ones, means more output.</p>')],
        board: [L(0.5, '<b>capital</b>: machinery, roads, broadband'), L(2.5, '<b>labour</b>: more workers (migration, participation)'), L(4.5, '<b>human capital</b>: skills, education, health'), L(6.5, '<b>technology</b>: more output from the same inputs', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>Productivity is the engine.</h2>'), C(3, '<p>More workers raise GDP, but not GDP per person. Higher productivity raises both.</p>')],
        board: [L(0.5, 'more workers → more output, same output per person'), L(3, 'higher productivity → more output per worker → higher living standards', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain why investment in new machinery leads to economic growth.',
      steps: [
        { m: 'New machinery adds to the economy’s stock of capital.', note: 'more capital' },
        { m: 'Each worker can produce more with better equipment, so labour productivity rises.', note: 'productivity' },
        { m: 'Productive capacity increases: the PPF shifts out and AS shifts right.', note: 'the models' },
        { m: 'Real output rises, so the economy grows; the spending on the machines also raises AD in the short run.', note: 'growth' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how skilled migration leads to growth.', steps: ['Skilled migrants move to New Zealand', 'The labour force grows and gains skills', 'Productive capacity increases', 'Firms can produce more goods and services', 'Real GDP rises: economic growth'] }], 2)(); },
    grades: 'AAMM',
    gens: [
      P.bank([
        { q: 'Which is a supply-side cause of economic growth?', a: 'Better education and training for workers', why: 'Skills raise productivity and productive capacity.', w: [['A rise in consumer confidence', 'That raises demand.'], ['Higher government spending on benefits', 'That raises demand.'], ['A fall in interest rates', 'That raises demand.']] },
        { q: 'Why does investment in roads and ports help growth?', a: 'It lowers transport costs and delays, raising productivity for many firms', why: 'Infrastructure is capital that helps the whole economy produce more.', w: [['It raises the price level', 'Not a cause of growth.'], ['It reduces exports', 'It helps exports.'], ['It reduces the labour force', 'No.']] },
        { q: 'Why can population growth raise GDP without raising living standards?', a: 'Output rises, but it is shared among more people, so output per person may not rise', why: 'Living standards depend on real GDP per capita.', w: [['Population growth lowers GDP', 'It usually raises GDP.'], ['More people means less inflation', 'Not the point.'], ['GDP ignores population', 'Per capita accounts for it.']] },
      ]),
      P.terms([['productivity', 'Output per worker or per hour worked.'], ['human capital', 'The skills, knowledge and health of workers.'], ['capital', 'Human-made resources used in production, such as machinery and buildings.'], ['infrastructure', 'Basic structures such as roads, ports, broadband and power networks.'], ['labour force', 'People who are working or actively looking for work.']]),
      P.chain([
        { q: 'Put the chain in order: how new technology leads to growth in living standards.', steps: ['Firms adopt new technology', 'Each worker can produce more output', 'Labour productivity rises', 'Real output per person rises', 'Incomes and living standards rise'] },
        { q: 'Put the chain in order: how higher export demand causes growth.', steps: ['Overseas demand for NZ goods rises', 'Export receipts rise', 'Firms increase production to meet demand', 'They employ more workers and use idle resources', 'Real output rises'] },
      ]),
      P.bank([
        { q: 'Which cause of growth most directly raises living standards in the long run?', a: 'Higher productivity from skills and technology', why: 'It raises output per person, not just total output.', w: [['A bigger population', 'More output, not necessarily per person.'], ['Higher export prices', 'Helpful but can reverse.'], ['More government borrowing', 'Not a direct cause.']] },
      ]),
    ],
    tips: [
      'Link every cause to <span class="pen">productive capacity or spending</span>, then to real output.',
      'Distinguish more resources (quantity) from better resources (quality: skills, technology).',
      'Use per-capita reasoning: population growth raises GDP but not necessarily GDP per person.',
      'Merit in 2024: explaining how consumer vs capital goods affect long-term growth potential.',
    ],
    aim: {
      intro: '<div class="resource">New Zealand’s labour productivity has grown more slowly than in most other OECD countries. The government is considering spending on either more skilled migration or more investment in technology and training.</div>',
      parts: [
        { q: 'Define productivity and describe two causes of economic growth.', write: true, words: '30–50',
          model: [S('Productivity is output per worker (or per hour worked).', 'definition', true), S('Investment in capital, such as machinery and infrastructure, increases productive capacity.', 'cause 1', true), S('Growth in the labour force or in workers’ skills increases productive capacity.', 'cause 2', true)],
          earns: 'Achieved: a correct definition and two correct causes.', crit: { A: 'Productivity = output per worker/hour; two causes such as capital investment, labour force growth, skills, technology.' } },
        { q: 'Explain how investment in technology and training raises economic growth.', write: true, words: '60–90',
          model: [S('New technology and training let each worker produce more: labour productivity rises.', 'productivity', true), S('Productive capacity increases, so the PPF shifts out and AS and LRAS shift right.', 'capacity, models', true), S('Real output rises, and because output per worker rises, real GDP per capita rises too.', 'growth per person', true)],
          earns: 'Merit: the investment is linked through productivity to capacity and growth.', crit: { M: 'Explains technology/training → productivity → capacity (PPF out / AS right) → real output and per-capita growth.' } },
        { q: 'Discuss whether skilled migration or investment in technology and training is the better way to raise New Zealand’s living standards.', write: true, words: '100–150',
          model: [S('Skilled migration adds workers, so total output rises quickly and skill shortages ease.', 'migration: benefit', true), S('But output is shared among more people, so real GDP per capita may rise only a little; it also raises demand for housing and services.', 'migration: limit'), S('Investment in technology and training raises output per worker, so it raises real GDP per capita, which is what living standards depend on.', 'investment: per person', true), S('It takes longer to pay off and has an opportunity cost now (fewer consumer goods), but it tackles NZ’s weak productivity directly.', 'investment: cost'), S('So investment in technology and training is the better way to raise living standards, because it raises output per person; migration mainly raises total output.', 'justified judgement', true)],
          earns: 'Excellence: both options are weighed using per-capita reasoning and the context, with a justified judgement.',
          crit: { M: 'Explains how each option raises output.', E: 'Compares the options using GDP vs GDP per capita, opportunity cost and time, links to NZ’s low productivity, and makes a justified judgement.' } },
      ],
      up: [
        up(1, ['Technology and training make the economy grow.'], [
          ['Explain the links: they raise productivity, which raises capacity (PPF out, AS right), so real output and output per person rise', 1, 'Right. Merit explains the mechanism.'],
          ['Name a technology', 0, 'An example helps, but the mechanism is missing.'],
          ['Say training is expensive', 0, 'Not asked here.'],
          ['Define growth again', 0, 'Not the missing link.']]),
        up(2, ['Migration is quicker but investment is better long term.'], [
          ['Explain why: migration raises total output but not much per person; investment raises output per worker; weigh time and opportunity cost; then justify', 1, 'Right. Excellence explains and weighs the claims.'],
          ['List more options', 0, 'Discuss the two given.'],
          ['Say migrants are skilled', 0, 'In the resource already.'],
          ['Say both are good', 0, 'Not a judgement.']]),
      ],
    },
  });

  /* ======================= 6. Effects of growth ======================= */
  P.addUnit({
    id: 'growth-effects', title: 'Who gains from growth, and the costs', mins: 11,
    blurb: 'More jobs, incomes and tax revenue. But also pollution, inequality and higher prices. Weigh them.',
    recap: 'Economic growth usually brings higher incomes, more jobs, and more tax revenue with less spending on benefits, so the government can spend more on health and education. It can also bring costs: environmental damage and depletion of resources, congestion, higher prices (if demand outruns capacity) and rising house prices. Growth may make income distribution more unequal if the gains go mainly to owners of capital or skilled workers. Sustainable growth meets today’s needs without reducing the ability of future generations to meet theirs.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>The benefits</h2>')],
        board: [L(0.5, '<b>households</b>: more jobs, higher incomes'), L(2.5, '<b>government</b>: more tax revenue, less spent on benefits'), L(4.5, '<b>public services</b>: more to spend on health, education'), L(6.5, '<b>firms</b>: higher sales and profits', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>The costs</h2>')],
        board: [L(0.5, '<b>environment</b>: pollution, emissions, water quality'), L(2.5, '<b>resources</b>: used up faster'), L(4.5, '<b>inequality</b>: gains may go to some more than others'), L(6.5, '<b>prices</b>: inflation and house prices if demand outruns supply', '', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>For Excellence: weigh them.</h2>'), C(3, '<p>Compare two groups, or the benefits and costs, then make a reasoned judgement about which is larger.</p>')],
        board: [L(0.5, 'compare: who gains more, and why?'), L(3, 'judge: does the benefit outweigh the cost here?'), L(5.5, 'justify with the context', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain how economic growth affects the government’s budget.',
      steps: [
        { m: 'With growth, incomes and spending rise, so the government collects more income tax, GST and company tax.', note: 'revenue up' },
        { m: 'More people are employed, so fewer need unemployment benefits: government spending on benefits falls.', note: 'spending down' },
        { m: 'So the budget balance improves, giving room to spend more on services or reduce debt.', note: 'result' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how growth can increase inequality.', steps: ['Growth is led by industries needing highly skilled workers', 'Demand for skilled workers rises faster than for unskilled', 'Skilled wages rise faster than unskilled wages', 'Owners of capital also earn higher profits', 'Income becomes less evenly distributed'] }], 2)(); },
    grades: 'AMMME',
    gens: [
      P.bank([
        { q: 'How does economic growth usually affect unemployment?', a: 'It falls, as firms produce more and hire more workers', why: 'Output needs labour.', w: [['It rises', 'Usually the opposite.'], ['No effect', 'Growth usually creates jobs.'], ['It rises because prices rise', 'Not the usual link.']] },
        { q: 'Why might growth harm the environment?', a: 'More production can mean more pollution, emissions and use of natural resources', why: 'These costs are not subtracted from GDP.', w: [['Growth always cleans the environment', 'Not always.'], ['Because GDP includes pollution as a cost', 'GDP does not subtract it.'], ['Because growth lowers taxes', 'Not the reason.']] },
        { q: 'Why might growth make income less equal?', a: 'The gains may go mostly to owners of capital and highly skilled workers', why: 'The 2024 Excellence answers explained whether growth makes distribution more or less equal.', w: [['Growth always makes everyone equally richer', 'Not necessarily.'], ['Everyone pays more tax', 'Not the reason.'], ['Prices fall for the poor only', 'No.']] },
      ]),
      () => shift('Strong growth pushes AD beyond the economy’s capacity. Show the effect on the AS/AD model.', MD.asadLR(), { AD: 1 }, ['Spending rises: AD shifts right.', 'Near full capacity, output rises a little but the price level rises: growth can bring inflation.'], { wrong: [{ v: { AS: 1, LRAS: 1 }, msg: 'Capacity has not changed; spending has.' }] }),
      P.terms([['sustainable growth', 'Growth that meets present needs without reducing the ability of future generations to meet theirs.'], ['income distribution', 'How income is shared among people or households.'], ['externality', 'A cost or benefit to people outside a transaction, such as pollution.'], ['standard of living', 'The level of material wellbeing of people, often measured by real GDP per capita.'], ['resource depletion', 'Using up natural resources faster than they can be replaced.']]),
      P.chain([
        { q: 'Put the chain in order: how growth improves public services.', steps: ['Real output and incomes rise', 'Tax revenue rises and spending on benefits falls', 'The government has more money available', 'It spends more on hospitals and schools', 'People’s health and skills improve'] },
      ]),
      P.bank([
        { q: 'A dairy boom raises GDP but worsens water quality in rivers. Which statement is the best judgement?', a: 'Growth raised incomes, but wellbeing rose less than GDP suggests, because the environmental cost is not counted', why: 'Excellence answers weigh the benefit against the uncounted cost.', w: [['The boom was purely good', 'It ignores the environmental cost.'], ['The boom reduced GDP', 'GDP rose.'], ['Water quality does not matter for wellbeing', 'It does.']] },
        { q: 'Tourism grows strongly in Queenstown. Who is most likely to lose?', a: 'Low-income residents who rent, as housing costs rise', why: 'Growth raises demand for housing; renters pay more without sharing the gains.', w: [['Hotel owners', 'They gain.'], ['Tour operators', 'They gain.'], ['The government', 'It gains tax revenue.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      'For each group, say <span class="pen">how its income, costs or wellbeing changes, and why</span>.',
      'Excellence in 2025: explaining both increased revenue and decreased expenditure for the government, and judging which effect of growth was larger.',
      'Excellence in 2024: comparing two groups and explaining whether growth makes income distribution more or less equal.',
      'Do not just list costs and benefits. Weigh them in the context, then judge.',
    ],
    aim: {
      intro: '<div class="resource">Tourism in Queenstown grows rapidly. Hotels and tour operators report record profits and are hiring. House prices and rents rise sharply, and traffic congestion and water pollution increase.</div>',
      parts: [
        { q: 'Describe one benefit and one cost of this growth for Queenstown.', write: true, words: '30–50',
          model: [S('Benefit: more jobs and higher incomes, as hotels and tour operators hire more workers.', 'benefit', true), S('Cost: housing becomes more expensive as house prices and rents rise.', 'cost', true), S('Congestion and water pollution are further costs.', 'other costs')],
          earns: 'Achieved: one benefit and one cost described with the context.', crit: { A: 'One benefit (jobs, incomes, profits, tax revenue) and one cost (housing, congestion, pollution).' } },
        { q: 'Explain how the growth affects two groups: tourism business owners and low-income workers who rent.', write: true, words: '60–90',
          model: [S('Business owners gain: record visitor numbers raise their sales and profits.', 'owners gain', true), S('Low-income workers may find jobs more easily and earn more hours.', 'workers gain some'), S('But rents rise sharply, taking a larger share of their incomes, so their real disposable income may not rise.', 'workers lose some', true), S('So owners clearly gain, while renters gain jobs but lose through housing costs.', 'contrast')],
          earns: 'Merit: the effects on both groups are explained with reasons.', crit: { M: 'Explains business owners gain profits; low-income renters gain work but face higher rents.' } },
        { q: 'Discuss whether this growth makes income distribution in Queenstown more or less equal, and whether the benefits outweigh the costs.', write: true, words: '100–150',
          model: [S('Income: business owners’ profits rise faster than most wages, and many tourism jobs are low-paid, so the gap between high and low incomes is likely to widen.', 'income inequality', true), S('Wealth is different from income: owners of houses and hotels also gain as property values rise. That increases their wealth on paper; selling would realise a capital gain, and renting out earns rental income, but a rise in value is not itself income.', 'wealth, kept separate from income', true), S('Housing affordability hits low-income renters: rents take a bigger share of their pay, so their real disposable income can fall even if their wages rise.', 'affordability and real disposable income'), S('So by income, wealth and living costs, the growth is likely to make distribution less equal.', 'distribution judgement'), S('Benefits include jobs, profits and tax revenue the government can spend; costs include congestion and water pollution, which are not counted in GDP and fall on everyone.', 'weighs benefits and costs'), S('On balance the growth brings real economic benefits, but they are unevenly shared and come with environmental costs, so policies such as more housing and water infrastructure are needed for the benefits to outweigh the costs for most residents.', 'justified judgement', true)],
          earns: 'Excellence: income, wealth and housing affordability are analysed separately for different groups, benefits and costs are weighed in context, and a qualified, justified judgement is reached.',
          crit: { M: 'Explains that owners gain more than renters, so inequality may rise.', E: 'Analyses distribution between groups, keeping income inequality (profits vs wages), wealth gains (rising property values) and housing affordability (rents vs real disposable income) distinct; weighs benefits against costs (including uncounted environmental costs); and makes a qualified, justified judgement.' } },
      ],
      up: [
        up(1, ['Owners get more profit. Renters pay more rent.'], [
          ['Explain each: why profits rise (record visitors), why renters gain jobs but lose to higher rents, and contrast the net effect on each group', 1, 'Right. Merit explains the reasons and the net effect.'],
          ['Say Queenstown is busy', 0, 'Context, not explanation.'],
          ['Add a third group', 0, 'Deepen the two asked about.'],
          ['Define growth', 0, 'Not asked.']]),
        up(2, ['Growth makes inequality worse and the costs are high.'], [
          ['Separate income (profits vs wages), wealth (rising property values) and housing affordability (rents vs real disposable income), show who gains most and least, weigh benefits against costs in the context, and give a qualified judgement', 1, 'Right. Excellence explains and weighs the claims, and does not mix up income and wealth.'],
          ['List more costs', 0, 'A longer list is not discussion.'],
          ['Say growth is bad', 0, 'Too sweeping; it has benefits.'],
          ['Repeat part (b)', 0, 'Go further: distribution and the overall judgement.']]),
      ],
    },
  });
})();
