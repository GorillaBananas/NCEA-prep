/* AS 91242 (Geography 2.3) Demonstrate geographic understanding of differences in development.
   Case studies: Laos (Lao PDR) and the United States. The exam is ONE question with parts:
   2023: (a) disadvantages of one indicator, (b) one factor that causes differences;
   2024: (a) one factor, (b) one strategy; 2025: TWO strategies by governments and/or NGOs.
   Data: UNDP Human Development Report 2025 (2023 data), World Bank, UNICEF LSIS III (2023), UN IGME,
   Lao and international news to September 2026. Exam tips from the 2023–2025 NZQA reports. */
(function () {
  const P = NP, R = P.R, G = P.geo;
  const C = (at, html) => ({ at, html });
  const L = (at, html, note, o = {}) => Object.assign({ at, html: `<span class="bq">${html}</span>`, note }, o);
  const F = (at, html) => ({ at, html });
  const S = (m, note, key) => ({ m, note, key: !!key });
  const up = (part, shown, choices, ask) => ({ part, shown, ask, choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });
  const St = (say, m) => ({ say, m });
  const $ = (v) => P.money(v);
  const US = (v) => 'US' + P.money(v);
  const BOTH = 'Use <span class="pen">both</span> places in every part, with data for each. The reports: answers built on one place “could not meet the criteria for higher-level performance”.';

  // UNDP HDR 2025 (2023 data); under-5 mortality UN IGME 2024 estimate (Laos) and about 6 (USA)
  const DATA = [
    ['Human Development Index (HDI)', '0.617 (rank 147)', '0.938 (rank 17)'],
    ['Life expectancy at birth', '69.0 years', '79.3 years'],
    ['Expected years of schooling', '9.6 years', '15.9 years'],
    ['Mean years of schooling (adults)', '6.1 years', '13.9 years'],
    ['GNI per capita (PPP, 2021 international dollars)', '8,106', '73,650'],
    ['Under-5 deaths per 1,000 births', 'about 29', 'about 6'],
  ];
  const table = (rows = DATA) => `<table class="ctable"><thead><tr><th>Indicator (2023)</th><th>Laos</th><th>USA</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table><p class="muted small">Sources: UNDP Human Development Report 2025; UN IGME.</p>`;

  /* ======================= 1. Measuring development ======================= */
  P.addUnit({
    id: 'dev-indicators', title: 'Laos and the USA: measuring development', mins: 11,
    blurb: 'What development means, the indicators, and the gap between your two case studies in numbers.',
    recap: 'Development is the process of improving people’s quality of life and standard of living: economic, social, political and environmental. It is measured with indicators. Economic indicators include GDP or GNI per capita and the share of workers in farming. Social indicators include life expectancy, under-5 mortality, literacy and years of schooling. The Human Development Index (HDI) combines income, health and education into one score from 0 to 1. Laos (Lao PDR), a landlocked country in Southeast Asia of about 7.8 million people, has an HDI of 0.617 (rank 147 of 193 in 2023); the USA, with about 340 million people, has 0.938 (rank 17). A person in the USA can expect to live about 10 years longer (79.3 against 69.0), and average income (GNI per capita, adjusted for prices) is about nine times higher. Laos is improving: poverty fell from 24.6% (2012/13) to 15% (2024/25).',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Where are your case studies?</h2>'), C(3, '<p>Laos: landlocked, in mainland Southeast Asia. About 7.8 million people.</p>'), C(8, '<p>The USA: North America, coasts on two oceans. About 340 million people.</p>')],
        board: [F(0.5, G.worldMap())] },
      { dur: 15, card: [C(0, '<h2>The gap in numbers</h2>'), C(3, '<p>HDI 0.617 against 0.938. Life expectancy 69 against 79.</p>'), C(8, '<p>Income per person about nine times higher in the USA.</p>')],
        board: [F(0.5, `<table class="ctable"><thead><tr><th>2023</th><th>Laos</th><th>USA</th></tr></thead><tbody><tr><td>HDI</td><td>0.617</td><td>0.938</td></tr><tr><td>Life expectancy</td><td>69.0</td><td>79.3</td></tr><tr><td>Mean years at school</td><td>6.1</td><td>13.9</td></tr><tr><td>GNI per person (PPP)</td><td>8,106</td><td>73,650</td></tr></tbody></table>`)] },
      { dur: 12, card: [C(0, '<h2>Three kinds of indicator</h2>'), C(3, '<p>Economic, social, and composite (several combined).</p>')],
        board: [L(0.5, '<b>economic</b>: GDP or GNI per capita, % working in farming'), L(3, '<b>social</b>: life expectancy, under-5 mortality, literacy, schooling'), L(5.5, '<b>composite</b>: HDI = health + education + income'), L(8, 'always quote data for BOTH places', '', { hl: true })] },
    ],
    example: {
      fig: G.worldMap(),
      problem: 'Using indicators, describe the differences in development between Laos and the USA.',
      steps: [
        { m: 'On the Human Development Index (2023), the USA scores 0.938 (rank 17) and Laos 0.617 (rank 147), so the USA is far more developed overall.', note: 'composite indicator, both places' },
        { m: 'Health: life expectancy is 79.3 years in the USA but 69.0 in Laos, and under-5 deaths are about 6 per 1,000 births in the USA against about 29 in Laos.', note: 'social indicators' },
        { m: 'Education: an adult in the USA has 13.9 years of schooling on average, against 6.1 in Laos.', note: 'education' },
        { m: 'Income: GNI per capita (adjusted for prices) is about 73,650 international dollars in the USA against 8,106 in Laos, about nine times more.', note: 'economic indicator' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the comparison in a logical order.', steps: ['Define development: improving quality of life and standard of living', 'Compare an overall indicator: HDI 0.617 (Laos) against 0.938 (USA)', 'Compare health: life expectancy 69.0 against 79.3 years', 'Compare education: 6.1 against 13.9 mean years of schooling', 'Compare income: GNI per capita about nine times higher in the USA'] }], 2)(); },
    grades: 'AAAAMM',
    gens: [
      () => { const t = R.pick(['gni', 'le', 'school', 'hdi']); const fig = table();
        if (t === 'gni') return { kind: 'num', answer: 73650 / 8106, dp: 1, tol: 0.06, prompt: 'Use the table. How many times higher is GNI per capita in the USA than in Laos?', fig, fmt: 'Give the answer to 1 decimal place.', wrong: [{ v: 8106 / 73650, msg: 'Divide the USA figure by the Laos figure.' }], more: { steps: [St('73,650 ÷ 8,106 = 9.1.'), St('So average income, adjusted for prices, is about nine times higher in the USA.')] }, sol: ['73 650 ÷ 8 106 = 9.1'] };
        if (t === 'le') return { kind: 'num', answer: 10.3, dp: 1, tol: 0.06, prompt: 'Use the table. How many more years can a person in the USA expect to live than a person in Laos?', fig, fmt: 'Give years to 1 decimal place.', more: { steps: [St('79.3 − 69.0 = 10.3 years.')] }, sol: ['79.3 − 69.0 = 10.3'] };
        if (t === 'school') return { kind: 'num', answer: 7.8, dp: 1, tol: 0.06, prompt: 'Use the table. How many more years of schooling does the average adult in the USA have than in Laos?', fig, fmt: 'Give years to 1 decimal place.', more: { steps: [St('Mean years of schooling: 13.9 − 6.1 = 7.8 years.')] }, sol: ['13.9 − 6.1 = 7.8'] };
        return { kind: 'num', answer: 0.938 - 0.617, dp: 3, tol: 0.0006, prompt: 'Use the table. What is the difference between the HDI of the USA and the HDI of Laos?', fig, fmt: 'Give 3 decimal places.', more: { steps: [St('0.938 − 0.617 = 0.321.'), St('HDI runs from 0 to 1, so this is a large gap.')] }, sol: ['0.938 − 0.617 = 0.321'] }; },
      P.terms([['development', 'The process of improving people’s quality of life and standard of living, economically, socially, politically and environmentally.'], ['indicator', 'A measure used to compare levels of development, such as life expectancy or GNI per capita.'], ['Human Development Index (HDI)', 'A composite indicator from 0 to 1 combining life expectancy, education and income per person.'], ['GNI per capita', 'The total income of a country’s people divided by its population, often adjusted for prices (PPP).'], ['under-5 mortality rate', 'The number of children who die before the age of five, per 1,000 live births.'], ['life expectancy', 'The average number of years a person born now can expect to live.']]),
      G.sortGen([['GNI per capita', 0], ['GDP per capita', 0], ['% of workers in farming', 0], ['Life expectancy', 1], ['Under-5 mortality rate', 1], ['Youth literacy rate', 1], ['Mean years of schooling', 1], ['Human Development Index', 2]], ['Economic', 'Social', 'Composite'], { n: 5, prompt: 'Sort each indicator: economic, social or composite?', idea: 'A composite indicator combines several measures; the HDI combines health, education and income.' }),
      P.bank([
        { q: 'Where is Laos?', a: 'In mainland Southeast Asia, landlocked between China, Vietnam, Cambodia, Thailand and Myanmar', why: 'It is the only landlocked country in Southeast Asia.', w: [['An island in the Pacific', 'No.'], ['In South Asia, next to India', 'No.'], ['On the coast of the South China Sea', 'It has no coast.']], fig: G.laosMap({}) },
        { q: 'What was the HDI rank of Laos in the 2025 Human Development Report?', a: '147th of 193', why: 'The USA was 17th.', w: [['17th', 'That is the USA.'], ['1st', 'No.'], ['193rd', 'Far too low.']] },
        { q: 'How did poverty change in Laos between 2012/13 and 2024/25?', a: 'It fell from 24.6% to 15% of people', why: 'World Bank: about 500,000 fewer people in poverty than a decade earlier.', w: [['It rose from 15% to 24.6%', 'The other way round.'], ['It stayed the same', 'It fell.'], ['It fell to zero', 'No.']] },
      ]),
      P.bank([
        { q: 'Why is the HDI often a better guide to development than GDP per capita alone?', a: 'It includes health and education as well as income', why: 'Development is more than income.', w: [['It is always higher', 'Not the point.'], ['It counts only money', 'That is GDP.'], ['It measures happiness', 'It does not.']] },
        { q: 'Under-5 mortality is about 29 per 1,000 in Laos and about 6 in the USA. What does this suggest?', a: 'Healthcare, clean water and nutrition are much weaker in Laos', why: 'Child deaths are a sensitive measure of basic services. In Laos only about 26% of households use safely managed drinking water.', w: [['Laos has more children', 'A rate per 1,000 births allows for that.'], ['Doctors in the USA work harder', 'Not the explanation.'], ['The data must be wrong', 'It is consistent with other indicators.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Which statement best compares development in the two places?', a: 'The USA is ahead on every indicator in the table, and the relative gap is far bigger for income (about 9 times higher) than for life expectancy (about 15% higher: 79.3 against 69.0 years)', why: 'A precise comparison uses data for both places and notes where the gap is biggest.', w: [['The USA is rich and Laos is poor', 'Too general for Merit.'], ['Laos is undeveloped', 'Inaccurate: it is developing and improving.'], ['They are about the same', 'No.']] },
      ], { grade: 'M' }),
    ],
    tips: [
      BOTH,
      'Use precise, current data: HDI 0.617 against 0.938 (2023); life expectancy 69.0 against 79.3 years; GNI per capita 8,106 against 73,650 (PPP).',
      'The 2024 report: out-of-date or inaccurate case study information limited grades.',
      'Say what the numbers mean for people’s lives, not just the numbers.',
      'Name both places, and draw a simple location map of Laos and its neighbours.',
    ],
    aim: {
      intro: `<div class="resource">${table()}</div>`,
      parts: [
        { q: 'Describe the difference in development between Laos and the USA, using two indicators.', write: true, words: '40–70',
          model: [S('On the HDI, the USA scores 0.938 (rank 17) but Laos only 0.617 (rank 147).', 'indicator 1, both places', true), S('Life expectancy is 79.3 years in the USA but 69.0 in Laos, about 10 years less.', 'indicator 2, both places', true)],
          earns: 'Achieved: two indicators, with data for both places.', crit: { A: 'Two indicators correctly compared with data for both Laos and the USA.' } },
        { q: 'Explain what the differences in under-5 mortality and schooling show about quality of life in Laos and the USA.', write: true, words: '80–120',
          model: [S('Under-5 deaths are about 29 per 1,000 births in Laos but about 6 in the USA.', 'data', true), S('This shows weaker healthcare, nutrition and clean water in Laos: only about 26% of households use safely managed drinking water, and almost a third of young children are stunted.', 'what it shows', true), S('Adults in Laos have 6.1 years of schooling on average against 13.9 in the USA.', 'data'), S('So fewer people in Laos have the skills for well-paid work, which keeps incomes and choices lower.', 'meaning for people', true)],
          earns: 'Merit: the indicators are explained in detail, with what they mean for people in both places.', crit: { M: 'Explains in detail what both indicators show about health services, living conditions, skills and incomes, with detailed data for both places.' } },
        { q: 'Using the data, fully explain the differences in development between Laos and the USA, including how the indicators are linked.', write: true, words: '140–190',
          model: [S('Overall, the USA (HDI 0.938) is far more developed than Laos (0.617).', 'overall', true), S('Income: GNI per capita is about 73,650 against 8,106, about nine times higher, so Americans can afford more food, healthcare and education.', 'income'), S('Health: life expectancy is 10.3 years higher in the USA and child deaths far lower, reflecting better services, water and nutrition.', 'health'), S('Education: adults in the USA have 13.9 years of schooling against 6.1, which raises productivity and wages.', 'education'), S('These indicators reinforce each other: low income limits spending on health and schools; poor health and schooling keep productivity and incomes low. This cycle helps explain why the gap persists, although Laos is improving: poverty fell from 24.6% to 15% in about a decade.', 'insight: links and change', true)],
          earns: 'Excellence: comprehensive data for both places, with insight into how the indicators are linked and how the gap is changing.',
          crit: { M: 'Explains the differences in detail across several indicators for both places.', E: 'Fully explains differences across income, health and education with comprehensive data for both places, showing insight (links between indicators, cycle of poverty, change over time).' } },
      ],
      up: [
        up(1, ['Children in Laos die more and people go to school less.'], [
          ['Add the data for both places (29 against 6 per 1,000; 6.1 against 13.9 years) and explain what each shows about services and people’s lives', 1, 'Right. Merit: detailed explanation with detailed evidence for both places.'],
          ['Add that the USA is rich', 0, 'General.'],
          ['Define under-5 mortality', 0, 'Not explanation.'],
          ['Add the HDI ranking', 0, 'Not the indicators asked about.']]),
        up(2, ['The USA is more developed on all the indicators, like HDI, life expectancy and income.'], [
          ['Give the data for each, explain what each means, and show how income, health and education reinforce each other, with how Laos is changing', 1, 'Right. Excellence: comprehensive evidence and insight into links.'],
          ['List more indicators', 0, 'A longer list is still description.'],
          ['Say that Laos should copy the USA', 0, 'Opinion.'],
          ['Repeat the HDI', 0, 'Already given.']]),
      ],
    },
  });

  /* ======================= 2. Disadvantages of indicators ======================= */
  P.addUnit({
    id: 'dev-indicator-limits', title: 'Indicators: their disadvantages', mins: 10,
    blurb: 'Averages hide inequality, GDP misses farming for your own family, and more. The 2023 exam asked exactly this.',
    recap: 'Every indicator has disadvantages. GDP or GNI per capita is an average, so it hides inequality between rich and poor, regions or ethnic groups: the USA is rich on average but has large gaps in income and health between groups and states. GDP counts only money transactions, so it misses subsistence farming and informal work, which matter in Laos, where over half of workers farm. Exchange rates distort comparisons unless prices are adjusted (PPP). Data can be old or unreliable in poorer countries. Single indicators show one side of development: GDP ignores health, education, freedom and the environment. Even the HDI ignores inequality, political freedom and the environment, and is a snapshot rather than showing change. So geographers use several indicators together, and inequality-adjusted measures.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Averages hide inequality</h2>'), C(3, '<p>GNI per capita in the USA is about 73,650. But many Americans earn far less.</p>'), C(8, '<p>In Laos, cities such as Vientiane are far better off than remote mountain villages.</p>')],
        board: [L(0.5, 'average = total ÷ population'), L(3, 'a few very rich people raise the average'), L(5.5, 'gaps between regions, ethnic groups, men and women are hidden'), L(8, 'disadvantage: the average describes no real person', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>What GDP leaves out</h2>'), C(3, '<p>Rice grown to feed your own family is never sold, so GDP does not count it.</p>'), C(8, '<p>GDP ignores health, education, freedom and the environment.</p>')],
        board: [L(0.5, 'subsistence farming and informal work: not counted'), L(3, 'exchange rates distort comparisons (use PPP)'), L(5.5, 'data from poor, rural areas can be old or unreliable'), L(8, 'use several indicators, not one', '', { hl: true })] },
    ],
    example: {
      fig: table(),
      problem: 'With reference to ONE named indicator, explain the disadvantages of using this indicator to measure differences in development in case study areas. (2023 paper, part a.)',
      steps: [
        { m: 'Indicator: GNI per capita, which is about 73,650 international dollars in the USA and 8,106 in Laos (2023, adjusted for prices).', note: 'name it, with data for both' },
        { m: 'It is an average, so it hides inequality. The USA’s high average includes millions on low incomes; in Laos, Vientiane is far better off than remote villages in the northern mountains.', note: 'disadvantage 1, both places' },
        { m: 'It counts only money transactions. Over half of workers in Laos farm, much of it to feed their families, so real living standards are higher than GNI suggests and the gap is overstated.', note: 'disadvantage 2, Laos' },
        { m: 'It measures income, not quality of life: it ignores health, education and the environment. So it should be used with social indicators such as life expectancy (69.0 against 79.3 years).', note: 'disadvantage 3 and conclusion' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the explanation of one disadvantage of GNI per capita.', steps: ['GNI per capita is total income divided by population', 'So it is an average for the whole country', 'A small number of very rich people can raise the average', 'Many people earn far less than the average', 'So it hides inequality within a country, such as between Vientiane and remote villages'] }], 2)(); },
    grades: 'AAMMME',
    gens: [
      P.bank([
        { q: 'What is the main disadvantage of using an average such as GNI per capita?', a: 'It hides inequality between rich and poor, or between regions', why: 'An average describes no real person.', w: [['It is too hard to calculate', 'No.'], ['It includes too many people', 'Not the issue.'], ['It is always out of date', 'Not the main disadvantage.']] },
        { q: 'Why might GDP per capita understate living standards in rural Laos?', a: 'It misses subsistence farming, such as rice grown to feed the family', why: 'No money changes hands, so it is not counted.', w: [['Rural people do not pay tax', 'Not the reason.'], ['It counts too much tourism', 'No.'], ['It is adjusted for prices', 'That helps, not hinders.']] },
        { q: 'Why do geographers adjust income for purchasing power (PPP)?', a: 'The same amount of money buys more in Laos than in the USA', why: 'Without PPP, exchange rates exaggerate the gap.', w: [['To make the USA look richer', 'No.'], ['Because the kip is not a currency', 'It is.'], ['To include health', 'That is the HDI.']] },
        { q: 'What does the HDI leave out?', a: 'Inequality, political freedom and the environment', why: 'It combines only health, education and income.', w: [['Life expectancy', 'Included.'], ['Income', 'Included.'], ['Education', 'Included.']] },
      ]),
      P.terms([['average', 'A single figure (total ÷ number) that can hide large differences between people.'], ['inequality', 'Unequal sharing of income, wealth or services between people, groups or regions.'], ['subsistence farming', 'Growing food mainly to feed your own family, not to sell.'], ['informal economy', 'Work that is not registered or taxed, so it is often missing from official data.'], ['purchasing power parity (PPP)', 'An adjustment that allows for different prices in different countries.']]),
      G.sortGen([['It is an average, so it hides inequality within a country', 0], ['It misses subsistence farming and informal work', 0], ['Exchange rates distort it unless it is adjusted for prices (PPP)', 0], ['It ignores health and education', 0], ['It ignores damage to the environment', 0], ['It counts unpaid work such as growing your own food', 1], ['It already allows for inequality between rich and poor', 1], ['It measures happiness directly', 1], ['It cannot be compared between countries at all', 1]], ['A real disadvantage of GDP per capita', 'Not true'], { n: 5, prompt: 'Sort each statement about GDP (or GNI) per capita as an indicator: is it a real disadvantage, or not true?', idea: 'GDP per capita is an average of money income: it hides inequality, misses subsistence and informal work, and ignores health, education and the environment. Adjusting for prices (PPP) makes countries comparable.' }),
      P.bank([
        { q: 'Life expectancy in the USA is 79.3, but it varies a lot between states and groups. What disadvantage does this show?', a: 'A national average hides differences within a country', why: 'Use the case study to show the disadvantage, not just state it.', w: [['Life expectancy is a bad indicator for rich countries', 'Not the point.'], ['The figure is wrong', 'It is an accurate average.'], ['It only measures money', 'It measures health.']] },
        { q: 'Why can data for remote mountain villages in Laos be less reliable?', a: 'They are hard to reach, so surveys are less frequent and may miss people', why: 'Reliability is a disadvantage of many indicators in poorer, rugged countries.', w: [['Villagers refuse all surveys', 'Too general.'], ['Mountains change the numbers', 'No.'], ['There are no villages', 'There are many.']] },
      ], { grade: 'M' }),
      P.chain([
        { q: 'Put the explanation in order: why GDP per capita overstates the gap between Laos and the USA.', steps: ['Over half of workers in Laos are farmers', 'Much of their food is grown for their own families', 'No money changes hands, so it is not counted in GDP', 'GDP per capita in Laos is lower than real living standards', 'So the gap with the USA looks bigger than it is'] },
      ]),
      P.bank([
        { q: 'Which conclusion shows insight about indicators?', a: 'No single indicator captures development, so combining economic, social and inequality-adjusted indicators gives a truer picture of the gap', why: 'Insight: a reasoned judgement that goes beyond listing disadvantages.', w: [['GDP is useless', 'Too sweeping.'], ['HDI is perfect', 'It has limits.'], ['Laos is poor', 'Not about indicators.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      BOTH,
      'Name ONE indicator, then explain several disadvantages, each <span class="pen">shown with your case studies</span>.',
      'Classic disadvantages: averages hide inequality; GDP misses subsistence and informal work; exchange rates; reliability; one-dimensional.',
      'Excellence: say what the disadvantage means for the comparison (does it overstate or understate the gap?).',
    ],
    aim: {
      intro: '<div class="resource">With reference to ONE named indicator, explain the disadvantages of using this indicator to measure differences in development in your case study areas, Laos and the USA. (Like the 2023 paper, part a.)</div>',
      parts: [
        { q: 'Name one indicator, give its value for Laos and the USA, and state one disadvantage.', write: true, words: '30–60',
          model: [S('GNI per capita (PPP) is 8,106 in Laos and 73,650 in the USA (2023).', 'indicator with data', true), S('It is an average, so it hides inequality between rich and poor people in each country.', 'disadvantage', true)],
          earns: 'Achieved: a named indicator with data and a disadvantage explained.', crit: { A: 'Names an indicator with data for both places and explains a disadvantage.' } },
        { q: 'Explain in detail two disadvantages of your indicator, using evidence from both case studies.', write: true, words: '90–130',
          model: [S('First, GNI per capita is an average: the USA’s 73,650 includes millions on low incomes, while in Laos people in Vientiane are much better off than in remote northern mountain villages.', 'disadvantage 1, both places', true), S('So it hides who is actually poor in each country.', 'meaning'), S('Second, it counts only money: over half of workers in Laos farm, often growing rice for their own families.', 'disadvantage 2, Laos', true), S('This food is not counted, so living standards in Laos are higher than GNI suggests.', 'meaning')],
          earns: 'Merit: two disadvantages, each explained in detail with case study evidence.', crit: { M: 'Explains in detail two disadvantages with specific evidence from both Laos and the USA.' } },
        { q: 'Fully explain the disadvantages of your indicator and how they affect the comparison of development between Laos and the USA.', write: true, words: '140–190',
          model: [S('GNI per capita shows the USA (73,650) about nine times richer than Laos (8,106).', 'the comparison', true), S('It hides inequality: within the USA there are large gaps between groups and states, and within Laos between Vientiane and remote, often ethnic-minority, villages. So both countries contain people far poorer than the average.', 'inequality'), S('It misses subsistence farming, which is large in Laos but small in the USA, so it overstates the gap between them.', 'bias in the comparison', true), S('It ignores health and education: Laos has improved life expectancy and cut poverty from 24.6% to 15%, which income alone does not show.', 'one-dimensional'), S('So GNI per capita is useful but biased: it exaggerates the gap and hides inequality. It should be combined with social and inequality-adjusted indicators, such as the HDI and life expectancy, for a fair comparison.', 'judgement with insight', true)],
          earns: 'Excellence: the disadvantages are fully explained, with how each distorts the comparison, and a reasoned judgement.',
          crit: { M: 'Explains several disadvantages with evidence.', E: 'Fully explains disadvantages with comprehensive evidence from both places and insight into how they distort the comparison (overstates/understates the gap), with a reasoned conclusion about using several indicators.' } },
      ],
      up: [
        up(1, ['GNI is an average so it hides inequality, and it does not count farming.'], [
          ['Show each with case study evidence: the USA’s 73,650 average hides low-income groups; Vientiane against remote villages; over half of Lao workers farm, often for their own food; and say what each means', 1, 'Right. Merit: detailed explanation with evidence from both places.'],
          ['Add a third disadvantage in one word', 0, 'More listing.'],
          ['Define GNI', 0, 'Not the missing part.'],
          ['Say the USA is richer', 0, 'Not about the disadvantages.']]),
        up(2, ['GNI has disadvantages so it is not a good indicator.'], [
          ['Explain how each disadvantage changes the comparison (the subsistence economy overstates the gap; averages hide inequality in both), then judge how GNI should be used with other indicators', 1, 'Right. Excellence: full explanation with insight and a reasoned judgement.'],
          ['Say GNI is useless', 0, 'Too sweeping.'],
          ['Add the HDI ranks', 0, 'Evidence without reasoning.'],
          ['Write about a strategy', 0, 'Off the question.']]),
      ],
    },
  });

  /* ======================= 3. Natural factors ======================= */
  P.addUnit({
    id: 'dev-natural', title: 'Natural factors: location, relief and climate', mins: 11,
    blurb: 'Landlocked, mountainous Laos against the resource-rich, two-ocean USA.',
    recap: 'Natural factors include location, relief, climate and natural resources. Laos is the only landlocked country in Southeast Asia, so its trade must cross neighbours’ borders to reach ports such as Bangkok or the Vietnamese coast, adding cost and time. About 70% of Laos is rugged mountains and plateaus (including the Annamite range along the Vietnamese border), which makes roads expensive, isolates villages from schools and clinics, and leaves little flat land for farming, mostly along the Mekong. Its tropical monsoon climate brings floods in the wet season and droughts, which damage harvests for a mostly farming population. Laos does have resources: rivers for hydropower, copper and gold. The USA, by contrast, has coasts on two oceans with many ports, huge fertile plains, navigable rivers such as the Mississippi, and abundant coal, oil, gas and farmland, which supported early industrialisation and trade.',
    scenes: [
      { dur: 15, card: [C(0, '<h2>Landlocked and mountainous</h2>'), C(3, '<p>No coastline: exports must cross Thailand or Vietnam to reach a port.</p>'), C(8, '<p>Mountains, including the Annamite range, cover most of the country.</p>')],
        board: [F(0.5, G.laosMap({ mekong: 'Mekong River', mountains: 'Annamite mountains', landlocked: 'No coastline' }))] },
      { dur: 14, card: [C(0, '<h2>How each one holds development back</h2>'), C(3, '<p>Every natural factor needs a chain: factor → effect → development.</p>')],
        board: [L(0.5, '<b>landlocked</b> → higher transport costs → fewer, dearer exports'), L(3, '<b>mountains</b> → costly roads → villages cut off from schools and clinics'), L(5.5, '<b>monsoon</b> → floods and droughts → lost harvests for farming families'), L(8, 'USA: two coasts, plains, Mississippi, resources → trade and industry', '', { hl: true })] },
    ],
    example: {
      fig: G.laosMap({ mekong: 'Mekong River', mountains: 'Annamite mountains', landlocked: 'No coastline' }),
      problem: 'Name ONE factor and explain how it contributes to differences in development in named case study areas. (2024 paper, part a.) Factor: location.',
      steps: [
        { m: 'Factor: location. Laos is the only landlocked country in Southeast Asia; the USA has long coastlines on the Atlantic and Pacific Oceans.', note: 'name it for both places' },
        { m: 'Laos’s exports must travel by road or rail through Thailand or Vietnam to reach a port, which adds cost, delay and border fees.', note: 'how it works in Laos' },
        { m: 'So Lao goods are less competitive, fewer foreign firms invest, and incomes stay low: GNI per capita is 8,106 (PPP).', note: 'effect on development, with data' },
        { m: 'The USA’s many deep-water ports and navigable rivers made trade cheap from the start, helping it industrialise and reach 73,650 per person: location helps explain the gap.', note: 'contrast with the USA' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how being landlocked holds back development in Laos.', steps: ['Laos has no coastline', 'Exports must cross Thailand or Vietnam to reach a port', 'Transport costs and delays rise', 'Lao goods are less competitive and attract less investment', 'Fewer jobs and lower incomes: GNI per capita 8,106 against 73,650 in the USA'] }], 2)(); },
    grades: 'AAAME',
    gens: [
      G.labelGen(G.laosMap, { mekong: 'Mekong River', rail: 'Laos–China Railway', mountains: 'Annamite mountains', landlocked: 'Border with Vietnam: no coastline' }, { prompt: 'Match each letter on the map of Laos to the right label.', n: 4 }),
      G.sortGen([['Laos has no coastline', 0], ['Most of Laos is rugged mountains', 0], ['Monsoon floods damage rice harvests', 0], ['The Mekong supplies water for hydropower', 1], ['The USA has ports on two oceans', 1], ['The USA has vast fertile plains', 1], ['Laos has copper and gold deposits', 1], ['Mountain villages are far from clinics', 0]], ['Holds development back', 'Helps development'], { n: 5, prompt: 'Sort each natural factor: does it hold development back, or help it?' }),
      P.bank([
        { q: 'Why is being landlocked a disadvantage for Laos?', a: 'Exports and imports must cross other countries to reach ports, adding cost and delay', why: 'Higher trade costs mean fewer exports and less investment.', w: [['It cannot have rivers', 'It has the Mekong.'], ['It cannot trade at all', 'It trades through neighbours.'], ['It is colder', 'No.']] },
        { q: 'How do mountains hold back development in Laos?', a: 'Roads are expensive to build, so many villages are cut off from markets, schools and clinics', why: 'Remote villages have lower incomes and worse health and education.', w: [['They stop all rain', 'No.'], ['They make it too cold for crops', 'Not the main point.'], ['They have no people', 'Many people live there.']] },
        { q: 'Which natural advantage helped the USA develop?', a: 'Coasts on two oceans, navigable rivers and abundant resources such as coal, oil and farmland', why: 'Cheap transport and resources supported industry and trade.', w: [['Being landlocked', 'It is not.'], ['A tropical monsoon climate', 'Not the USA.'], ['High mountains everywhere', 'No.']] },
      ]),
      P.bank([
        { q: 'Why does the monsoon climate affect development more in Laos than similar weather would in the USA?', a: 'Over half of Lao workers farm, many with little irrigation or insurance, so floods and droughts directly cut food and income', why: 'Vulnerability depends on how people make a living.', w: [['It never rains in the USA', 'It does.'], ['Monsoons only happen in Laos', 'They affect much of Asia.'], ['Lao people do not farm rice', 'Rice is the main crop.']] },
        { q: 'Which statement uses location to explain a difference in development, with both places?', a: 'Laos’s exports must cross Thailand or Vietnam to reach a port, while the USA’s many ports make trade cheap, so the USA earns far more from trade', why: 'Merit explains the link for both places.', w: [['Laos is in Asia and the USA is in America', 'Location described, not explained.'], ['Laos is landlocked', 'Only one place, no effect.'], ['The USA is big', 'Not the factor.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Which shows insight about natural factors?', a: 'Natural factors are not fixed destiny: Laos is using its rivers for hydropower and a railway to turn “land-locked” into “land-linked”', why: 'Insight: natural factors interact with human choices.', w: [['Laos will always be poor because of mountains', 'Too deterministic.'], ['Mountains are pretty', 'Off the point.'], ['The USA has no natural problems', 'It has many.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      BOTH,
      'Choose ONE factor and explore it in depth. The 2024 report: Merit candidates often “described several factors rather than exploring one in depth”.',
      'For every factor, write the chain: <span class="pen">factor → effect → development indicator</span>, for both places.',
      'Use Laos’s nickname: the government aims to turn “land-locked” into “land-linked”.',
      'Excellence: compare both places evenly, with data, and show how the factor interacts with others (location and relief together).',
    ],
    aim: {
      intro: '<div class="resource">Name ONE factor and explain how it contributes to differences in development between Laos and the USA. (Like the 2024 paper, part a.) Factor: relief (landforms) and location.</div>',
      parts: [
        { q: 'Describe how relief differs between Laos and the USA.', write: true, words: '30–60',
          model: [S('Most of Laos, roughly 70%, is rugged mountains and plateaus, such as the Annamite range along the border with Vietnam.', 'Laos', true), S('The USA has mountains in the west but also vast, flat, fertile plains, such as the Great Plains, and navigable rivers such as the Mississippi.', 'USA', true)],
          earns: 'Achieved: relief described for both places with evidence.', crit: { A: 'Describes relief in both places with some evidence.' } },
        { q: 'Explain in detail how relief contributes to differences in development between Laos and the USA.', write: true, words: '90–130',
          model: [S('In Laos, mountains make roads costly and slow to build, so many villages are hours from a town.', 'cause', true), S('Families there are far from schools, clinics and markets, so they have less education, worse health and lower incomes; most flat land is along the Mekong.', 'effect on development', true), S('This helps explain low indicators such as 6.1 mean years of schooling and a life expectancy of 69.0.', 'evidence'), S('The USA’s plains made farming, railways and cities cheap to build, supporting trade and industry, which helps explain its 13.9 years of schooling and a life expectancy of 79.3.', 'contrast')],
          earns: 'Merit: the factor is explained in detail for both places, with evidence.', crit: { M: 'Explains in detail how relief affects access, farming and services in Laos and the USA, with data for both.' } },
        { q: 'Fully explain how relief and location interact to create differences in development between Laos and the USA.', write: true, words: '140–190',
          model: [S('Laos is both landlocked and mountainous, and the two factors reinforce each other.', 'interaction', true), S('Being landlocked means exports must travel overland through Thailand or Vietnam; mountains make that overland route slow and costly, so trade costs are very high.', 'how they combine'), S('High costs deter investment and keep most people in farming, so GNI per capita is 8,106 (PPP) against 73,650 in the USA.', 'effect with data'), S('The USA’s plains, navigable rivers and ports on two oceans made transport cheap, so it industrialised early and became a trading power.', 'contrast'), S('But natural factors are not destiny: the Laos–China Railway (2021) cuts through the mountains to link Laos to China, aiming to turn “land-locked” into “land-linked”, which shows how strategies can reduce the effect of natural factors.', 'insight', true)],
          earns: 'Excellence: the interaction of two natural factors is fully explained with data for both places, with insight.',
          crit: { M: 'Explains relief and location effects in both places in detail.', E: 'Fully explains how relief and location reinforce each other in Laos compared with the USA, with comprehensive data, and insight (natural factors are not destiny; strategies such as the railway).' } },
      ],
      up: [
        up(1, ['Laos is mountainous so it is less developed than the USA, which is flat.'], [
          ['Explain the chain for both places: mountains → costly roads → villages cut off from schools, clinics and markets → lower schooling and life expectancy (with data); plains in the USA → cheap transport and farming', 1, 'Right. Merit: detailed explanation for both places.'],
          ['Add the height of the highest mountain', 0, 'Evidence without explanation.'],
          ['Say the USA also has mountains', 0, 'True, but not explanation.'],
          ['Define relief', 0, 'Not enough.']]),
        up(2, ['Laos is landlocked and mountainous, which makes it poorer than the USA.'], [
          ['Show how the two factors reinforce each other (overland trade through mountains), with data for both places, and add insight such as the railway changing the effect', 1, 'Right. Excellence: interaction, evidence, insight.'],
          ['List more natural factors', 0, 'Breadth instead of depth.'],
          ['Describe the USA’s history', 0, 'Off the factor.'],
          ['Say Laos should build ports', 0, 'It has no coast.']]),
      ],
    },
  });

  /* ======================= 4. Cultural factors ======================= */
  const LAOS_TIME = [{ y: 1893, t: 'French rule' }, { y: 1953, t: 'Independence' }, { y: 1964, t: 'US bombing' }, { y: 1975, t: 'Lao PDR' }, { y: 1986, t: 'Market reforms' }, { y: 2021, t: 'Railway' }];
  P.addUnit({
    id: 'dev-cultural', title: 'Cultural factors: colonisation, war and politics', mins: 12,
    blurb: 'French rule, the heaviest bombing in history, a one-party state and late reforms, against the USA’s long head start.',
    recap: 'Cultural (human) factors include colonisation, war, political systems, trade and globalisation. France ruled Laos from 1893 to 1953 and invested little: few roads, schools or industries. After independence came civil war, and from 1964 to 1973 the USA dropped more than 2 million tonnes of bombs on Laos in about 580,000 bombing missions, making it the most heavily bombed country per person in history. About 30% of some 270 million cluster submunitions failed to explode; about 80 million remain, killing and injuring people and blocking farmland, roads and schools. In 1975 the communist Lao People’s Revolutionary Party took power; central planning failed, and market reforms (the New Economic Mechanism) began in 1986. Laos joined ASEAN in 1997 and the WTO in 2013. Recently, heavy borrowing for dams and the railway left public debt above the size of the economy, and inflation peaked at about 41% in early 2023. The USA, independent since 1776, industrialised in the 1800s with a stable democracy, open trade and heavy investment in education and technology.',
    scenes: [
      { dur: 15, card: [C(0, '<h2>Laos: a history of setbacks</h2>'), C(3, '<p>Colonial neglect, then war, then a planned economy that failed.</p>'), C(8, '<p>Reforms since 1986 have brought growth.</p>')],
        board: [F(0.5, G.timeline(LAOS_TIME, { y0: 1880, y1: 2030, step: 30, title: 'Key events in Laos, 1893–2021' }))] },
      { dur: 14, card: [C(0, '<h2>The bombing</h2>'), C(3, '<p>1964–1973: more than 2 million tonnes of bombs, about 580,000 bombing missions.</p>'), C(8, '<p>About 80 million bomblets still lie in the ground.</p>')],
        board: [L(0.5, 'about 270 million cluster submunitions dropped; about 30% did not explode'), L(3, 'unexploded ordnance (UXO) kills and maims farmers and children'), L(5.5, 'land that cannot be farmed safely, roads and schools that cannot be built'), L(8, 'a cultural factor that still holds development back', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>The USA’s head start</h2>'), C(3, '<p>Independence in 1776. Industrialised in the 1800s.</p>'), C(7.5, '<p>Stable government, open trade, mass education, technology.</p>')],
        board: [L(0.5, 'industrialisation: factories, railways, cities'), L(3, 'market economy and global trade'), L(5.5, 'investment in schools and universities: 13.9 years of schooling'), L(8, '150+ years of growth against Laos’s 40 years of reform', '', { hl: true })] },
    ],
    example: {
      fig: G.timeline(LAOS_TIME, { y0: 1880, y1: 2030, step: 30, title: 'Key events in Laos, 1893–2021' }),
      problem: 'Name ONE factor and explain how it contributes to differences in development in named case study areas. Factor: war (a cultural factor).',
      steps: [
        { m: 'Factor: war. From 1964 to 1973 the USA dropped more than 2 million tonnes of bombs on Laos in about 580,000 bombing missions.', note: 'name and evidence' },
        { m: 'About 30% of some 270 million cluster submunitions did not explode; an estimated 80 million remain in the ground.', note: 'the legacy' },
        { m: 'Unexploded ordnance (UXO) kills and injures farmers and children, and makes farmland, roads and building sites dangerous, so families farm less land and investment is held back.', note: 'effect on people and the economy' },
        { m: 'Clearance costs money that could go to health and schools. The USA has had no large-scale war on its mainland since the Civil War (1861–65), so it could build continuously: one reason its HDI (0.938) is far above Laos’s (0.617).', note: 'contrast and link to development' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how UXO holds back development in Laos.', steps: ['The USA bombed Laos heavily from 1964 to 1973', 'About 30% of the cluster submunitions did not explode', 'About 80 million remain in fields, forests and villages', 'Farmers cannot safely use some land, and people are killed or injured', 'Food production, incomes and investment stay lower'] }], 2)(); },
    grades: 'AAAME',
    gens: [
      () => ({ kind: 'order', prompt: 'Put these events in the history of Laos in time order.', items: ['France makes Laos a protectorate (1893)', 'Laos becomes independent (1953)', 'Heavy US bombing during the Vietnam War (1964–1973)', 'The Lao People’s Democratic Republic is founded (1975)', 'Market reforms begin: the New Economic Mechanism (1986)', 'The Laos–China Railway opens (2021)'], more: { idea: 'Colonisation, war and politics are cultural factors.', steps: LAOS_TIME.map((e) => St(`${e.y}: ${e.t}`)) } }),
      P.bank([
        { q: 'About how many unexploded cluster submunitions remain in Laos?', a: 'About 80 million', why: 'More than 1 million have been cleared since the 1990s.', w: [['About 80', 'Far too few.'], ['About 80,000', 'Far too few.'], ['None: all have been cleared', 'Most remain.']] },
        { q: 'How did French colonisation (1893–1953) affect development in Laos?', a: 'France invested little in roads, schools or industry, so Laos was left with weak foundations', why: 'Colonial neglect is a long-term cultural factor.', w: [['France built a large railway network', 'Laos had almost no railway until 2021.'], ['It made Laos an industrial power', 'No.'], ['It had no effect', 'It left weak foundations.']] },
        { q: 'What happened in Laos in 1986?', a: 'The government began market reforms (the New Economic Mechanism), allowing private business and trade', why: 'This led to faster growth after years of central planning.', w: [['Independence from France', 'That was 1953.'], ['The bombing ended', '1973.'], ['The railway opened', '2021.']] },
      ]),
      G.sortGen([['French colonisation from 1893 to 1953', 0], ['US bombing from 1964 to 1973', 0], ['A one-party communist state since 1975', 0], ['Market reforms from 1986', 0], ['Monsoon floods', 1], ['Mountainous relief', 1], ['Being landlocked', 1], ['Rich deposits of copper and gold', 1]], ['Cultural factor', 'Natural factor'], { n: 5, prompt: 'Sort each factor: cultural (human) or natural?' }),
      P.bank([
        { q: 'How did high debt and inflation in 2022–2023 affect development in Laos?', a: 'Prices rose fast (inflation peaked at about 41% in early 2023), so families could afford less food, and the government had less to spend on health and schools', why: 'Debt repayments take money from services.', w: [['They raised everyone’s living standards', 'The opposite.'], ['They only affected the USA', 'No.'], ['They had no effect on families', 'They hit families hard.']] },
        { q: 'Why did the USA’s early industrialisation contribute to its higher development?', a: 'It created jobs, income and tax revenue over 150 years, which paid for schools, health and infrastructure', why: 'Development builds on itself over time.', w: [['Factories improved the climate', 'No.'], ['It meant no one farmed', 'Not the point.'], ['It happened after Laos', 'Much earlier.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Which sentence shows insight about cultural factors?', a: 'The same country that bombed Laos has funded much of the clean-up, showing how one cultural factor can both create and help reduce differences in development', why: 'The USA has given more than 390 million US dollars for UXO work since 1995.', w: [['War is bad', 'Opinion.'], ['Laos was bombed', 'Description.'], ['The USA is rich', 'Not insight.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      BOTH,
      'War and UXO is a powerful factor: use the figures (2 million tonnes, 580,000 missions, about 80 million unexploded submunitions remain).',
      'Show change over time: colonisation → war → central planning → reforms since 1986.',
      'The 2025 report: some candidates wrote about gender instead of location. Keep the focus on differences between places.',
      'Excellence: explain how the factor still affects indicators today, for both places.',
    ],
    aim: {
      intro: '<div class="resource">Name ONE cultural factor and explain how it contributes to differences in development between Laos and the USA. Factor: war and its legacy.</div>',
      parts: [
        { q: 'Describe the US bombing of Laos and what remains today.', write: true, words: '30–60',
          model: [S('From 1964 to 1973 the USA dropped more than 2 million tonnes of bombs on Laos, in about 580,000 bombing missions.', 'bombing', true), S('About 30% of the cluster submunitions failed to explode, and about 80 million remain in the ground.', 'legacy', true)],
          earns: 'Achieved: the factor described with accurate evidence.', crit: { A: 'Describes the bombing and remaining UXO with some accurate figures.' } },
        { q: 'Explain in detail how unexploded ordnance (UXO) holds back development in Laos.', write: true, words: '90–130',
          model: [S('UXO lies in fields, forests and villages, so farmers risk death or injury when they plough or dig.', 'danger', true), S('More than 20,000 people have been killed or injured since the bombing ended, many of them children and farmers.', 'evidence'), S('Families leave contaminated land unused, so they grow less food and earn less; many families lose a worker.', 'effect on income', true), S('Roads, schools and dams cost more because land must be cleared first, which slows investment and services.', 'effect on infrastructure')],
          earns: 'Merit: the effects on people and the economy are explained in detail, with evidence.', crit: { M: 'Explains in detail how UXO affects safety, farming, incomes and investment in Laos, with evidence.' } },
        { q: 'Fully explain how war has contributed to differences in development between Laos and the USA.', write: true, words: '140–190',
          model: [S('Laos was bombed from 1964 to 1973, and about 80 million unexploded submunitions remain; the USA has had no large-scale war on its mainland since the Civil War (1861–65).', 'contrast', true), S('In Laos, UXO limits farming, raises building costs and causes casualties, which keeps incomes low: GNI per capita is 8,106 (PPP) against 73,650 in the USA.', 'effects with data'), S('War also delayed nation-building: after 1975, the new government inherited a damaged country, and central planning failed until reforms in 1986.', 'long-term effect'), S('Meanwhile, the USA kept building industry, schools and infrastructure, so the gap widened over decades.', 'the gap grows'), S('So war is a cultural factor whose legacy is still active 50 years later, and it links both places: the USA has paid more than 390 million US dollars for clearance since 1995, but this aid was paused in 2025 before a smaller new agreement in 2026, which shows how decisions in one country affect development in another.', 'insight', true)],
          earns: 'Excellence: the factor is fully explained for both places, with comprehensive evidence and insight.',
          crit: { M: 'Explains how war affects development in Laos in detail, compared with the USA.', E: 'Fully explains war as a factor for both places, with comprehensive data, the long-term legacy (UXO, delayed reform), and insight (connection between the two places; aid and its pause).' } },
      ],
      up: [
        up(1, ['There are many bombs left in Laos so people get hurt and can’t farm.'], [
          ['Add evidence (about 80 million remain; over 20,000 casualties since the war) and explain each effect: less land farmed, lost workers, higher costs for roads and schools, slower investment', 1, 'Right. Merit: detailed explanation with evidence.'],
          ['Add that bombs are dangerous', 0, 'Still general.'],
          ['Describe the Vietnam War', 0, 'Background, not the effect.'],
          ['Say the USA is rich', 0, 'Not the explanation.']]),
        up(2, ['War made Laos less developed than the USA because of UXO.'], [
          ['Compare both places with data, explain short- and long-term effects (UXO, delayed nation-building), and add insight such as the USA funding clearance and pausing it in 2025', 1, 'Right. Excellence: both places, comprehensive evidence, insight.'],
          ['Add a list of other factors', 0, 'Breadth, not depth.'],
          ['Describe a bomb', 0, 'Off the point.'],
          ['Say war is wrong', 0, 'Opinion.']]),
      ],
    },
  });

  /* ======================= 5. Strategy 1: UXO clearance ======================= */
  P.addUnit({
    id: 'dev-uxo', title: 'Strategy 1: clearing unexploded bombs', mins: 11,
    blurb: 'Government and NGOs working together: how clearance reduces differences, and its limits.',
    recap: 'Clearing unexploded ordnance (UXO) is a strategy run by the government of Laos and non-governmental organisations (NGOs). The government’s National Regulatory Authority coordinates clearance; teams from UXO Lao, the HALO Trust and the Mines Advisory Group (MAG) survey and destroy bombs; COPE provides artificial limbs and rehabilitation. Laos even added its own Sustainable Development Goal 18, “Lives safe from UXO”. The USA, Japan and others fund it: the USA has given more than 390 million US dollars since 1995. More than 1 million items have been cleared, including over 49,000 in the first eight months of 2026. Cleared land can be farmed, built on and invested in, and casualties fall, which raises incomes, food security and access to schools and clinics. Limits: about 80 million items remain, clearance is slow and costly, and US funding was paused in early 2025 (a new 15 million US dollar agreement followed in August 2026), with some donors cutting aid.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Who does it?</h2>'), C(3, '<p>The Lao government coordinates. NGOs do much of the work.</p>'), C(8, '<p>Foreign governments pay: the USA, Japan and others.</p>')],
        board: [L(0.5, '<b>government</b>: National Regulatory Authority, UXO Lao; SDG 18 “Lives safe from UXO”'), L(3, '<b>NGOs</b>: HALO Trust, MAG (clearance); COPE (artificial limbs, rehabilitation)'), L(5.5, '<b>funding</b>: USA more than 390 million US dollars since 1995'), L(8, 'survey → clear → hand land back to villages', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>How it reduces differences</h2>'), C(3, '<p>Safe land → more food and income. Fewer injuries → more people working.</p>'), C(8, '<p>Roads, schools and clinics can be built.</p>')],
        board: [L(0.5, 'land handed back → farm more → food and income rise'), L(3, 'fewer casualties → families keep workers, children stay in school'), L(5.5, 'cheaper building → roads, schools, clinics, investment'), L(8, 'limit: about 80 million items remain; US aid paused in 2025, partly restored in 2026', '', { hl: true })] },
    ],
    example: {
      fig: G.laosMap({ mountains: 'Annamite mountains', mekong: 'Mekong River' }),
      problem: 'Explain how a government and/or an NGO has taken a strategy that reduces differences in development between your case studies. Strategy: UXO clearance in Laos.',
      steps: [
        { m: 'Strategy: clearing unexploded ordnance, coordinated by the Lao government’s National Regulatory Authority and carried out with NGOs such as the HALO Trust and MAG, funded by donors including the USA.', note: 'name it and who does it' },
        { m: 'Teams survey villages, locate bombs and destroy them, then hand the land back. More than 1 million items have been cleared, over 49,000 in just the first eight months of 2026.', note: 'how it works, with evidence' },
        { m: 'Farmers can then plant rice on safe land, so food production and incomes rise, and fewer people are killed or injured, so families keep their workers.', note: 'how it raises development' },
        { m: 'This narrows the gap with the USA, where land is safe and productive, by lifting incomes and health in rural Laos, although about 80 million items remain and US funding was suspended in 2025.', note: 'link to the difference, and a limit' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how UXO clearance reduces differences in development.', steps: ['Survey teams identify contaminated land in a village', 'Clearance teams find and destroy the bombs', 'The land is handed back to the village as safe', 'Farmers grow more food and earn more; children walk to school safely', 'Rural incomes and health rise, narrowing the gap with richer countries such as the USA'] }], 2)(); },
    grades: 'AMAME',
    gens: [
      P.bank([
        { q: 'Which of these is a non-governmental organisation (NGO) involved in UXO work in Laos?', a: 'The HALO Trust', why: 'Other NGOs include MAG and COPE.', w: [['The National Regulatory Authority', 'A government body.'], ['The US State Department', 'A foreign government.'], ['The World Bank', 'An international financial institution.']] },
        { q: 'What does COPE do?', a: 'Provides artificial limbs and rehabilitation for people injured by UXO', why: 'It helps survivors return to work and school.', w: [['Destroys bombs', 'That is clearance teams.'], ['Builds the railway', 'No.'], ['Runs the HDI', 'No.']] },
        { q: 'What is Laos’s Sustainable Development Goal 18?', a: '“Lives safe from UXO”, a national goal added to the UN’s 17', why: 'It shows the government sees UXO as central to development.', w: [['Zero poverty', 'That is SDG 1.'], ['Clean energy', 'That is SDG 7.'], ['Build a railway', 'No.']] },
        { q: 'How much has the USA given for UXO work in Laos since 1995?', a: 'More than 390 million US dollars', why: 'It was paused in early 2025; new US funding of 15 million US dollars through MAG was agreed in August 2026.', w: [['Nothing', 'It has been the largest donor.'], ['About 39 thousand US dollars', 'Far too little.'], ['About 39 billion US dollars', 'Far too much.']] },
      ]),
      P.chain([
        { q: 'Put the chain in order: how UXO clearance reduces differences in development.', steps: ['Survey teams identify contaminated land in a village', 'Clearance teams find and destroy the bombs', 'The land is handed back to the village as safe', 'Farmers grow more food and earn more; children walk to school safely', 'Rural incomes and health rise, narrowing the gap with richer countries such as the USA'] },
        { q: 'Put the chain in order: how a cut in donor funding could widen the gap.', steps: ['A donor stops funding clearance', 'Clearance teams shrink or stop work', 'Contaminated land stays unused', 'Accidents continue and investment stays away', 'Rural incomes stay low, so the gap with the USA does not narrow'] },
      ]),
      G.sortGen([['More than 1 million items cleared since the 1990s', 0], ['Cleared land can be farmed and built on', 0], ['Fewer people killed or injured', 0], ['About 80 million items remain', 1], ['US funding paused in early 2025', 1], ['Clearance is slow and expensive', 1], ['Survivors get artificial limbs from COPE', 0]], ['Success', 'Limitation'], { n: 4, prompt: 'Sort each point about UXO clearance: a success or a limitation?' }),
      P.bank([
        { q: 'How does clearing UXO help children’s education?', a: 'Safe paths and school sites mean children can walk to school and new schools can be built', why: 'Education is a key development indicator: Laos has 6.1 mean years of schooling against 13.9 in the USA.', w: [['Children learn about bombs', 'Not the main effect.'], ['Bomb teams teach classes', 'No.'], ['It has no effect on schools', 'It does.']] },
        { q: 'Why is UXO clearance a slow strategy?', a: 'Each area must be surveyed and searched carefully, and about 80 million items remain across rugged, forested land', why: 'At current rates it would take a very long time.', w: [['Most bombs have already been cleared', 'Most remain.'], ['People do not want the land', 'They do.'], ['Bombs are easy to see', 'They are hidden.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Which evaluation shows insight?', a: 'Clearance only reduces differences if land is then used productively, so it works best combined with roads, markets and farm support', why: 'Insight: the strategy depends on other factors.', w: [['Clearance solves everything', 'Too simple.'], ['Clearance does nothing', 'It has clear benefits.'], ['The bombs are old', 'Not evaluation.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      BOTH,
      'Name WHO runs the strategy: government (National Regulatory Authority, UXO Lao) and NGOs (HALO Trust, MAG, COPE). The 2025 question asked about governments and/or NGOs.',
      'Explain <span class="pen">how</span> it reduces differences: safe land → food and income → health and education.',
      'Use evidence: more than 1 million items cleared; about 80 million remain; US funding of more than 390 million US dollars since 1995, paused in early 2025, then a new 15 million US dollar agreement in August 2026; some other donors have cut aid.',
      'The 2025 Merit and Excellence answers discussed TWO specific strategies and how each reduced differences. Pair this with the railway.',
    ],
    aim: {
      intro: '<div class="resource">Explain how government and/or non-governmental organisations have taken or may take actions or strategies to reduce differences in development in your case study countries. (Like the 2025 paper.) Strategy: UXO clearance in Laos.</div>',
      parts: [
        { q: 'Describe the UXO clearance strategy in Laos, including who carries it out.', write: true, words: '40–70',
          model: [S('The Lao government’s National Regulatory Authority coordinates clearance of unexploded bombs, with UXO Lao and NGOs such as the HALO Trust and MAG doing the clearing.', 'who', true), S('Donors including the USA (more than 390 million US dollars since 1995) and Japan fund it; more than 1 million items have been cleared.', 'how, with evidence', true)],
          earns: 'Achieved: the strategy and its actors described with evidence.', crit: { A: 'Describes the strategy, names government/NGO actors, with some evidence.' } },
        { q: 'Explain in detail how UXO clearance reduces differences in development between Laos and the USA.', write: true, words: '100–140',
          model: [S('Clearance teams make land safe and hand it back to villages.', 'action', true), S('Farmers can plant more rice and graze animals, so food supply and incomes rise; over half of Lao workers farm, so this reaches many families.', 'economic effect', true), S('Fewer people are killed or injured, so families keep their workers and children stay in school; COPE helps survivors return to work.', 'social effect'), S('Roads, schools and clinics can be built more cheaply on cleared land.', 'services'), S('So rural incomes, health and education rise, closing part of the gap with the USA, where GNI per capita is about nine times higher.', 'link to the gap')],
          earns: 'Merit: the strategy is explained in detail, linked to development indicators and the gap.', crit: { M: 'Explains in detail how clearance raises farming, incomes, safety, schooling and services in Laos, linked to the gap with the USA, with evidence.' } },
        { q: 'Fully explain how successful UXO clearance has been, and could be, in reducing differences in development between Laos and the USA.', write: true, words: '150–200',
          model: [S('Successes: more than 1 million items cleared, over 49,000 in the first eight months of 2026, and land returned for farming, schools and roads.', 'success with evidence', true), S('This raises rural incomes and safety, which lifts indicators such as life expectancy (69.0) and schooling (6.1 years) towards the USA’s 79.3 and 13.9.', 'link to indicators'), S('Limits: about 80 million items remain, so at current rates the work will take generations; US funding was paused in early 2025 (a new 15 million US dollar agreement followed in August 2026) and other donors have cut aid.', 'limits with evidence', true), S('The strategy also depends on what follows: cleared land only raises development if farmers can reach markets and get support.', 'condition'), S('So clearance is essential but not sufficient: it removes a barrier left by war, but it narrows the gap slowly, and its future depends on decisions by donors such as the USA, which links the two case studies.', 'judgement with insight', true)],
          earns: 'Excellence: successes and limits fully explained with evidence, leading to a judgement with insight.',
          crit: { M: 'Explains how clearance reduces differences, with evidence.', E: 'Fully explains successes and limits with comprehensive evidence (items cleared, remaining, funding pause), links to development indicators for both places, and makes an insightful judgement (necessary but not sufficient; depends on donors and complementary strategies).' } },
      ],
      up: [
        up(1, ['Clearing bombs makes Laos safer so it is more developed.'], [
          ['Explain each link: safe land → more farming and income; fewer injuries → workers and pupils kept; cheaper building → schools and roads; and link it to the gap with the USA, with evidence', 1, 'Right. Merit: detailed, linked explanation.'],
          ['Name the bombs', 0, 'Not the explanation.'],
          ['Say the USA should pay', 0, 'Opinion.'],
          ['Add that it is dangerous work', 0, 'True, but not development.']]),
        up(2, ['UXO clearance helps but there are still many bombs left.'], [
          ['Weigh successes and limits with figures (over 1 million cleared, about 80 million remaining, US funding paused in 2025, then partly restored in 2026), explain what else is needed, and judge how much it narrows the gap', 1, 'Right. Excellence: full evaluation with insight.'],
          ['Add the date of the war', 0, 'Background.'],
          ['List the NGOs again', 0, 'Already given.'],
          ['Say it is the best strategy', 0, 'Unsupported.']]),
      ],
    },
  });

  /* ======================= 6. Strategy 2: the Laos–China Railway ======================= */
  P.addUnit({
    id: 'dev-railway', title: 'Strategy 2: the Laos–China Railway', mins: 11,
    blurb: 'From “land-locked” to “land-linked”: a government strategy with big gains and big debts.',
    recap: 'The Laos–China Railway is a government strategy to overcome being landlocked, part of China’s Belt and Road Initiative. It opened in December 2021, running about 420 km from Vientiane through Luang Prabang to Boten on the Chinese border, and on to Kunming. The Lao section cost about 6 billion US dollars, built by a joint venture that is about 70% Chinese and 30% Lao, paid for largely with Chinese loans. By September 2025 it had carried more than 67 million tonnes of freight and almost 60 million passengers along the whole line; trains run up to 18 a day in Laos, and goods can reach Europe in as little as 15 days. It cuts transport costs and journey times, raises exports (such as cassava, rubber and minerals) and tourism, and creates jobs. Limits: debt (public debt rose above the size of the economy and inflation peaked at about 41% in early 2023), much of the profit goes to Chinese firms, land was taken from villages, and tickets are costly for many rural Lao people. Hydropower, the “battery of Southeast Asia”, is a similar government strategy: electricity exports earned about 2.65 billion US dollars in 2023.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>From land-locked to land-linked</h2>'), C(3, '<p>Opened December 2021: Vientiane to the Chinese border, then on to Kunming.</p>'), C(8, '<p>Goods can now reach China, and even Europe, by train.</p>')],
        board: [F(0.5, G.laosMap({ rail: 'Laos–China Railway', mekong: 'Mekong River' }))] },
      { dur: 14, card: [C(0, '<h2>Gains and costs</h2>'), C(3, '<p>Over 67 million tonnes of freight and almost 60 million passengers along the whole line (including China) by 2025.</p>'), C(8, '<p>But it was built with Chinese loans, and debt helped drive inflation to about 41%.</p>')],
        board: [L(0.5, 'cheaper, faster transport → more exports, tourism, jobs'), L(3, 'freight to Europe in as little as 15 days'), L(5.5, 'cost: about 6 billion US dollars for the Lao section, mostly loans'), L(8, 'who benefits? profits, land, ticket prices', '', { hl: true })] },
    ],
    example: {
      fig: G.laosMap({ rail: 'Laos–China Railway', mekong: 'Mekong River' }),
      problem: 'Name ONE strategy and explain how it has reduced (or could reduce) differences in development in named case study areas. (2024 paper, part b.)',
      steps: [
        { m: 'Strategy: the Laos–China Railway, a project of the Lao government with China, opened in December 2021, linking Vientiane to Kunming.', note: 'name it, who, when' },
        { m: 'It reduces the disadvantage of being landlocked: freight now moves by train to China and on to Europe in as little as 15 days, with more than 67 million tonnes carried on the whole line, including the Chinese section, by September 2025.', note: 'how it works, with evidence' },
        { m: 'Cheaper, faster transport makes Lao exports such as cassava and rubber more competitive, and tourism has grown, creating jobs and raising incomes.', note: 'effect on development' },
        { m: 'This could narrow the gap with the USA, which has always had cheap access to ports, but the loans helped push public debt above the size of the economy, so the gains may be shared unevenly.', note: 'link to the difference, and a limit' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how the railway could reduce differences in development.', steps: ['The railway links landlocked Laos to China', 'Freight is cheaper and faster to move', 'Lao exports become more competitive, and tourists arrive', 'Firms expand and create jobs', 'Incomes rise, narrowing the gap with richer countries such as the USA'] }], 2)(); },
    grades: 'AAAMME',
    gens: [
      P.bank([
        { q: 'When did the Laos–China Railway open?', a: 'December 2021', why: 'It runs from Vientiane to the Chinese border at Boten and on to Kunming.', w: [['1975', 'The year the Lao PDR was founded.'], ['1986', 'The year market reforms began.'], ['2030', 'It is already open.']] },
        { q: 'How was the Lao section of the railway paid for?', a: 'Largely with loans from China, through a joint venture about 70% Chinese and 30% Lao', why: 'This added to Laos’s high debt.', w: [['Entirely by the USA', 'No.'], ['By ticket sales before it was built', 'No.'], ['By the World Food Programme', 'No.']] },
        { q: 'Which phrase describes the government’s aim for the railway?', a: 'To turn Laos from “land-locked” into “land-linked”', why: 'It targets the natural factor of location.', w: [['To make Laos self-sufficient with no trade', 'The opposite.'], ['To move the capital', 'No.'], ['To replace the Mekong', 'No.']] },
        { q: 'What is meant by Laos as the “battery of Southeast Asia”?', a: 'Its many hydropower dams export electricity to neighbours such as Thailand', why: 'Electricity exports earned about 2.65 billion US dollars in 2023.', w: [['It makes car batteries', 'No.'], ['It imports most of its power', 'It exports it.'], ['It stores oil', 'No.']] },
      ]),
      () => { const t = R.pick(['freight', 'trains']);
        if (t === 'trains') return { kind: 'num', answer: 350, dp: 0, tol: 0.5, prompt: 'Daily train services in Laos rose from 4 when the railway opened to 18 by 2025. Calculate the percentage increase.', fmt: 'Give a whole-number percentage (no % sign).', wrong: [{ v: 14, msg: 'That is the increase in trains. Turn it into a percentage of the starting number.' }, { v: (14 / 18) * 100, msg: 'Divide by the starting number (4).' }], more: { steps: [St('Increase: 18 − 4 = 14 trains.'), St('14 ÷ 4 × 100 = 350%.')] }, sol: ['(18 − 4) ÷ 4 × 100 = 350%'] };
        return { kind: 'num', answer: 12.8, dp: 1, tol: 0.06, prompt: 'Freight on the railway from January to October rose from about 3.995 million tonnes in 2024 to 4.506 million tonnes in 2025. Calculate the percentage increase.', fmt: 'Give 1 decimal place (no % sign).', more: { steps: [St('Increase: 4.506 − 3.995 = 0.511 million tonnes.'), St('0.511 ÷ 3.995 × 100 = 12.8%.')] }, sol: ['(4.506 − 3.995) ÷ 3.995 × 100 = 12.8%'] }; },
      G.sortGen([['Cheaper, faster transport for exports', 0], ['More tourists reach Luang Prabang', 0], ['Freight to Europe in as little as 15 days', 0], ['Jobs in logistics and tourism', 0], ['Large debts owed to China', 1], ['Much of the profit goes to Chinese firms', 1], ['Villagers lost land to the route', 1], ['Tickets are too expensive for many rural people', 1]], ['Benefit', 'Problem'], { n: 5, prompt: 'Sort each point about the Laos–China Railway: a benefit or a problem?' }),
      P.chain([
        { q: 'Put the chain in order: how borrowing for big projects can hurt development.', steps: ['Laos borrows heavily for dams and the railway', 'Debt repayments take a large share of government income', 'The value of the kip falls and import prices rise', 'Inflation peaks at about 41% in early 2023', 'Families can afford less food, and less is spent on schools and health'] },
      ]),
      P.bank([
        { q: 'Why might the railway increase inequality within Laos even as it raises national income?', a: 'Benefits concentrate in towns along the line, while remote mountain villages far from stations gain little', why: 'Strategies can reduce the gap between countries while widening gaps within one.', w: [['Everyone in Laos lives next to the line', 'No.'], ['It carries only passengers', 'It carries much freight.'], ['It runs only in the USA', 'No.']] },
        { q: 'How does the railway reduce a natural factor that holds Laos back?', a: 'It cuts through mountains and links landlocked Laos directly to China’s markets and ports', why: 'It targets location and relief.', w: [['It changes the climate', 'No.'], ['It gives Laos a coastline', 'It cannot.'], ['It removes UXO', 'That is a different strategy.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Which evaluation of the two strategies shows insight?', a: 'UXO clearance helps the poorest rural families directly but slowly; the railway raises national income faster but risks debt and uneven benefits, so together they tackle different causes of the gap', why: 'Comparing strategies and who they help shows insight.', w: [['The railway is better because it is bigger', 'Unsupported.'], ['Both have solved the problem', 'No.'], ['Neither does anything', 'Both have effects.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      BOTH,
      'Say who runs it: the Lao government with China, under the Belt and Road Initiative.',
      'Explain HOW it reduces the gap: it targets being landlocked → cheaper trade → exports, tourism, jobs → incomes.',
      'Use evidence: opened December 2021; more than 67 million tonnes of freight on the whole line (Laos and China) by September 2025; freight to Europe in as little as 15 days; debt above the size of the economy; inflation about 41% (early 2023).',
      'Excellence (2025): two strategies, each fully explained; one may be less detailed than the other. Weigh gains against debt and uneven benefits.',
    ],
    aim: {
      intro: '<div class="resource">Explain how government and/or non-governmental organisations have taken or may take TWO actions or strategies to reduce differences in development between your case study countries. (Like the 2025 paper.) Strategy one: UXO clearance. Strategy two: the Laos–China Railway.</div>',
      parts: [
        { q: 'Describe the Laos–China Railway strategy.', write: true, words: '40–70',
          model: [S('The Lao government, with China, opened the Laos–China Railway in December 2021, linking Vientiane to the Chinese border and Kunming.', 'what, who, when', true), S('It aims to turn landlocked Laos into a “land-linked” country; by September 2025 the whole line (including China) had carried more than 67 million tonnes of freight.', 'aim and evidence', true)],
          earns: 'Achieved: the strategy described with evidence.', crit: { A: 'Describes the railway, who built it and its aim, with some evidence.' } },
        { q: 'Explain in detail how the railway could reduce differences in development between Laos and the USA.', write: true, words: '100–140',
          model: [S('Being landlocked has made Lao trade slow and costly, unlike the USA with ports on two oceans.', 'the problem', true), S('The railway carries freight to China, and on to Europe in as little as 15 days, so transport costs fall.', 'how it works', true), S('Exports such as cassava, rubber and minerals become more competitive, and tourists can reach places such as Luang Prabang quickly, creating jobs.', 'economic effects'), S('Higher incomes and tax revenue can pay for schools and health, so indicators such as GNI per capita (8,106 against 73,650) and life expectancy could move closer to the USA’s.', 'link to the gap')],
          earns: 'Merit: the strategy’s effects are explained in detail, linked to the gap.', crit: { M: 'Explains in detail how the railway overcomes landlocked location, raising trade, jobs and incomes, linked to the gap with the USA, with evidence.' } },
        { q: 'Fully explain how TWO strategies, UXO clearance and the railway, have reduced or could reduce differences in development between Laos and the USA.', write: true, words: '170–230',
          model: [S('UXO clearance: government agencies and NGOs such as the HALO Trust and MAG have cleared more than 1 million items, returning land to farming, cutting casualties and allowing schools and roads to be built.', 'strategy 1 with evidence', true), S('It helps the poorest rural families directly, raising food production, income and safety, but about 80 million items remain and US funding was paused in 2025 and only partly restored in 2026, so progress is slow.', 'strategy 1 evaluated'), S('The railway: since December 2021 the whole line (including China) has carried more than 67 million tonnes of freight, cutting trade costs for a landlocked country and boosting exports and tourism.', 'strategy 2 with evidence', true), S('It raises national income faster, but it was built largely with Chinese loans; debt rose above the size of the economy and inflation reached about 41% in early 2023, hurting the poor, and its benefits cluster along the line.', 'strategy 2 evaluated'), S('Together they tackle different causes of the gap with the USA: clearance removes a legacy of war in rural areas, while the railway tackles location. Neither closes the gap alone (HDI 0.617 against 0.938), but combined they could narrow it if debt is managed and gains reach remote villages.', 'comparison and judgement with insight', true)],
          earns: 'Excellence: two strategies fully explained, each with evidence, weighed against each other with insight.',
          crit: { M: 'Explains, in detail, two strategies with detailed evidence.', E: 'Fully explains, with insight, two strategies: how each reduces differences, with integrated evidence for each, limits, and an insightful comparison or judgement (different causes, who benefits, debt, funding).' } },
      ],
      up: [
        up(1, ['The railway helps Laos trade more so it gets richer.'], [
          ['Explain the chain: landlocked → costly trade (unlike the USA) → railway cuts costs (freight to Europe in 15 days) → exports, tourism and jobs → incomes and services; link it to the gap with data', 1, 'Right. Merit: detailed explanation, linked to the gap.'],
          ['Add the length of the railway', 0, 'Evidence without explanation.'],
          ['Say China built it', 0, 'Who, but not how.'],
          ['Say trains are fast', 0, 'Too general.']]),
        up(2, ['UXO clearance makes land safe and the railway helps trade. Both reduce the gap.'], [
          ['Fully explain each with evidence, evaluate each (slow and underfunded; debt and uneven benefits), and compare how they tackle different causes of the gap', 1, 'Right. Excellence: two strategies, fully explained with insight.'],
          ['Add a third strategy', 0, 'The question asks for two.'],
          ['Describe the war', 0, 'Background, not the strategy.'],
          ['Say Laos will soon be like the USA', 0, 'Unsupported.']]),
      ],
    },
  });
})();
