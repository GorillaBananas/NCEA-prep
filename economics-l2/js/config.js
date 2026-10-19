/* NCEA Level 2 Economics: the three externally assessed standards.
   Exam: Friday 27 November 2026, morning session (NZQA 2026 timetable). */
NP.start({
  id: 'economics-l2',
  title: 'Level 2 Economics',
  full: 'NCEA Level 2 Economics',
  home: '../',
  ai: true,
  nzqa: 'https://www2.nzqa.govt.nz/ncea/subjects/select-subject/economics/',
  exam: { iso: '2026-11-27T09:30:00+13:00', text: 'Friday 27 November, morning session', short: '27/11' },
  words: {
    noun: 'economics', kit: 'Bring a ruler and calculator to the real exam. Here, use full sentences and the model’s labels.', papers: 'all three standards',
    mixedTitle: 'Final week: mix all three standards',
    mixedText: '12 questions across inflation, trade and growth, in random order. Includes model-shifting and Upgrade questions, and shows how you do on Achieved-, Merit- and Excellence-level questions.',
    how: ['<b>Watch</b> a one-minute animated explainer', '<b>Follow</b> a model answer, built step by step', '<b>Finish</b> one yourself: shift the curve or build the chain', '<b>Quiz</b>: five quick questions with instant feedback', '<b>Aim higher</b>: write three answers that climb from Achieved to Merit to Excellence, marked by AI', '<b>Exam tips</b>: what earned marks in the NZQA reports'],
    gradeHow: { A: 'identify, define or describe the concepts, and explain causes and impacts using economic models', M: 'give detailed explanations of causes and impacts, using the models and the context', E: 'integrate the changes shown on the models into detailed explanations, and compare or contrast causes and their impacts on different groups' },
    levelNote: 'these are practice results on quiz questions, not a predicted NZQA grade. Quiz questions check that you can recognise and apply the ideas; the exam is marked on written explanations. Use Aim higher, with AI marking, for writing practice.',
    aimIntro: 'One exam-style question in three parts, like the real paper. Part (a) is Achieved level, (b) is Merit, (c) is Excellence. Write each answer in the box, using the model’s labels (AD to AD1, PL to PL1). It is marked against NZQA-style criteria, then you see a model answer. The highlighted lines are what earn the grade.',
  },
  // suggested study order: the models first, then rotate between standards
  order: ['demand-pull', 'price-taker', 'circular-flow', 'cost-push', 'exchange-rate', 'ppf', 'cpi', 'two-country', 'measuring-growth', 'qtm', 'fx-effects', 'growth-asad', 'inflation-terms', 'trade-basics', 'causes-growth', 'inflation-effects', 'protection', 'growth-effects'],
  lede: 'Each topic is about ten minutes: a one-minute animation, a model answer, then a quick quiz where you shift the curves yourself.',
  standards: [
    { code: '91222', short: 'Inflation', name: 'Analyse inflation using economic concepts and models', credits: 4, col: 'var(--c2)',
      units: ['cpi', 'inflation-terms', 'demand-pull', 'cost-push', 'qtm', 'inflation-effects'] },
    { code: '91223', short: 'International trade', name: 'Analyse international trade using economic concepts and models', credits: 4, col: 'var(--alg)',
      units: ['trade-basics', 'price-taker', 'two-country', 'protection', 'exchange-rate', 'fx-effects'] },
    { code: '91224', short: 'Economic growth', name: 'Analyse economic growth using economic concepts and models', credits: 4, col: 'var(--calc)',
      units: ['measuring-growth', 'circular-flow', 'ppf', 'growth-asad', 'causes-growth', 'growth-effects'] },
  ],
});
