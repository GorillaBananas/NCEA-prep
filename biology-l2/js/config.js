/* NCEA Level 2 Biology: the three externally assessed standards.
   Exam: Friday 20 November 2026, morning session (NZQA 2026 timetable). */
NP.start({
  id: 'biology-l2',
  title: 'Level 2 Biology',
  full: 'NCEA Level 2 Biology',
  home: '../',
  ai: true,
  nzqa: 'https://www2.nzqa.govt.nz/ncea/subjects/select-subject/biology/',
  exam: { iso: '2026-11-20T09:30:00+13:00', text: 'Friday 20 November, morning session', short: '20/11' },
  words: {
    noun: 'biology', kit: 'Use full sentences and the key terms.', papers: 'all three standards',
    mixedTitle: 'Final week: mix all three standards',
    mixedText: '12 questions across cells, genetic variation and gene expression, in random order. Includes Upgrade questions, and shows your level: Achieved, Merit or Excellence.',
    how: ['<b>Watch</b> a one-minute animated explainer', '<b>Follow</b> a model answer, built step by step', '<b>Finish</b> one yourself, with the start done for you', '<b>Quiz</b>: five quick questions with instant feedback', '<b>Aim higher</b>: write three answers that climb from Achieved to Merit to Excellence, marked by AI', '<b>Exam tips</b>: what earned marks in the NZQA reports'],
    aimIntro: 'One exam-style question in three parts, like the real paper. Part (a) is Achieved level, (b) is Merit, (c) is Excellence. Write each answer in the box. It is marked against NZQA-style criteria, then you see a model answer. The highlighted lines are what earn the grade.',
  },
  // suggested study order: the processes first, then rotate between standards
  order: ['photosynthesis', 'variation-sources', 'dna-rna', 'aerobic', 'monohybrid', 'transcription', 'enzymes', 'test-cross', 'translation', 'ps-stages', 'codominance', 'mutations', 'anaerobic', 'dihybrid', 'pathways', 'enzyme-factors', 'linkage', 'gene-env', 'ps-rate', 'selection', 'dna-replication', 'drift', 'membranes'],
  lede: 'Each topic is about ten minutes: a one-minute animation, a model answer, then a quick quiz.',
  standards: [
    { code: '91156', short: 'Cells', name: 'Demonstrate understanding of life processes at the cellular level', credits: 4, col: 'var(--calc)',
      units: ['photosynthesis', 'ps-stages', 'ps-rate', 'aerobic', 'anaerobic', 'enzymes', 'enzyme-factors', 'dna-replication', 'membranes'] },
    { code: '91157', short: 'Genetic variation', name: 'Demonstrate understanding of genetic variation and change', credits: 4, col: 'var(--prob)',
      units: ['variation-sources', 'monohybrid', 'test-cross', 'codominance', 'dihybrid', 'linkage', 'selection', 'drift'] },
    { code: '91159', short: 'Gene expression', name: 'Demonstrate understanding of gene expression', credits: 4, col: 'var(--alg)',
      units: ['dna-rna', 'transcription', 'translation', 'mutations', 'pathways', 'gene-env'] },
  ],
});
