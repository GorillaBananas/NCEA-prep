/* NCEA Level 2 Mathematics and Statistics: the three externally assessed standards.
   Exam: Thursday 19 November 2026, morning session (NZQA 2026 timetable). */
NP.start({
  id: 'maths-l2',
  title: 'Level 2 Maths',
  full: 'NCEA Level 2 Mathematics and Statistics',
  home: '../',
  nzqa: 'https://www2.nzqa.govt.nz/ncea/subjects/subject/mathematics-and-statistics/',
  exam: { iso: '2026-11-19T09:30:00+13:00', text: 'Thursday 19 November, morning session', short: '19/11' },
  // suggested study order: the algebra every paper relies on first, then rotate standards
  order: ['factorising', 'indices', 'alg-fractions', 'derivative', 'trees', 'quadratics', 'two-way', 'tangents', 'normal', 'turning-points', 'logs', 'antidiff', 'relative-risk', 'discriminant', 'kinematics', 'inverse-normal', 'rearranging', 'expected-value', 'optimisation', 'simultaneous', 'gradient-graphs', 'distributions'],
  lede: 'Each topic is about ten minutes: a one-minute animation, a worked example, then a quick quiz.',
  standards: [
    { code: '91261', short: 'Algebra', name: 'Apply algebraic methods in solving problems', credits: 4, col: 'var(--alg)',
      units: ['indices', 'factorising', 'alg-fractions', 'rearranging', 'quadratics', 'discriminant', 'logs', 'simultaneous'] },
    { code: '91262', short: 'Calculus', name: 'Apply calculus methods in solving problems', credits: 5, col: 'var(--calc)',
      units: ['derivative', 'tangents', 'turning-points', 'gradient-graphs', 'optimisation', 'antidiff', 'kinematics'] },
    { code: '91267', short: 'Probability', name: 'Apply probability methods in solving problems', credits: 4, col: 'var(--prob)',
      units: ['trees', 'two-way', 'relative-risk', 'expected-value', 'normal', 'inverse-normal', 'distributions'] },
  ],
});
