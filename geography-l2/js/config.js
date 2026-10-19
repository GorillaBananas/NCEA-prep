/* NCEA Level 2 Geography: the three externally assessed standards (91241 is no longer examined).
   Exam: Tuesday 10 November 2026, morning session (NZQA 2026 timetable).
   Case studies follow the student's class: the Amazon rainforest (91240) and Laos compared with the USA (91242). */
NP.start({
  id: 'geography-l2',
  title: 'Level 2 Geography',
  full: 'NCEA Level 2 Geography',
  home: '../',
  ai: true,
  nzqa: 'https://www2.nzqa.govt.nz/ncea/subjects/subject/geography',
  exam: { iso: '2026-11-10T09:30:00+13:00', text: 'Tuesday 10 November, morning session', short: '10/11' },
  words: {
    noun: 'geography', kit: 'Bring coloured pencils, a ruler and a calculator to the real exam. Use named places, dates and figures in every answer.', papers: 'all three standards',
    mixedTitle: 'Final week: mix all three standards',
    mixedText: '12 questions across the Amazon, Laos and the USA, and map and graph skills, in random order. Includes Upgrade questions, and shows how you do on Achieved-, Merit- and Excellence-level questions.',
    how: ['<b>Watch</b> a one-minute animated explainer', '<b>Follow</b> a model answer, built step by step', '<b>Finish</b> one yourself, with the start done for you', '<b>Quiz</b>: five quick questions with instant feedback', '<b>Aim higher</b>: write three answers that climb from Achieved to Merit to Excellence, marked by AI', '<b>Exam tips</b>: what earned marks in the NZQA reports'],
    gradeHow: { A: 'explain, with supporting case study or resource evidence', M: 'explain in detail, with detailed evidence and geographic terms', E: 'fully explain with insight, integrating comprehensive evidence and concepts' },
    levelNote: 'these are practice results on quiz questions, not a predicted NZQA grade. The exam is marked on written answers, maps and graphs. Use Aim higher, with AI marking, for writing practice.',
    aimIntro: 'One exam-style question in three parts. Part (a) is Achieved level, (b) is Merit, (c) is Excellence. Write each answer in the box, with specific case study or resource evidence: names, dates and figures. It is marked against NZQA-style criteria, then you see a model answer. The highlighted lines are what earn the grade.',
  },
  // suggested study order: rotate the three standards; skills early because they are quick marks
  order: ['amazon-where', 'dev-indicators', 'grid-refs', 'amazon-climate', 'dev-natural', 'scale-direction', 'amazon-vegetation', 'dev-cultural', 'precis-maps', 'amazon-soils', 'dev-uxo', 'graphs', 'amazon-river', 'dev-railway', 'timelines', 'amazon-interaction', 'dev-indicator-limits', 'concepts', 'amazon-change', 'amazon-perspectives'],
  lede: 'Each topic is about ten minutes: a one-minute animation, a model answer, then a quick quiz. Your case studies: the Amazon rainforest, and Laos compared with the USA.',
  standards: [
    { code: '91240', short: 'The Amazon', lower: 'the Amazon', name: 'Demonstrate geographic understanding of a large natural environment', credits: 4, col: 'var(--calc)',
      units: ['amazon-where', 'amazon-climate', 'amazon-vegetation', 'amazon-soils', 'amazon-river', 'amazon-interaction', 'amazon-change', 'amazon-perspectives'] },
    { code: '91242', short: 'Development', name: 'Demonstrate geographic understanding of differences in development', credits: 4, col: 'var(--c2)',
      units: ['dev-indicators', 'dev-indicator-limits', 'dev-natural', 'dev-cultural', 'dev-uxo', 'dev-railway'] },
    { code: '91243', short: 'Skills', name: 'Apply geography concepts and skills to demonstrate understanding of a given environment', credits: 4, col: 'var(--alg)',
      units: ['grid-refs', 'scale-direction', 'precis-maps', 'graphs', 'timelines', 'concepts'] },
  ],
});
