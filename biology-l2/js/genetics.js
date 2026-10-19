/* AS 91157 (Biology 2.5) Demonstrate understanding of genetic variation and change.
   Scope from the NZQA 2026 assessment specifications: mutation as a source of new alleles (gametic and somatic),
   monohybrid and dihybrid Punnett squares with ratios as fractions, percentages or decimals, linked genes including
   sex linkage, genetic drift including the founder effect and bottlenecks, natural selection and migration.
   Exam tips draw on the 2025 NZQA assessment report. */
(function () {
  const P = NP, R = P.R, Bio = P.bio;
  const C = (at, html) => ({ at, html });
  const L = (at, html, note, o = {}) => Object.assign({ at, html: `<span class="bq">${html}</span>`, note }, o);
  const S = (m, note, key) => ({ m, note, key: !!key });
  const up = (part, shown, choices, ask) => ({ part, shown, ask, choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });
  const St = (say, m) => ({ say, m });
  const PFMT = 'Give a fraction, decimal or percentage, e.g. 1/4, 0.25 or 25%.';

  /* ---------- genetics engine ---------- */
  // a genotype is an array of alleles; capital letter = dominant. sort so 'Tt' not 'tT'
  const gt = (a, b) => [a, b].sort((x, y) => (x.toUpperCase() === y.toUpperCase() ? (x < y ? -1 : 1) : x < y ? -1 : 1)).join('');
  // monohybrid cross: returns {genotype: count out of 4}
  function cross(p1, p2) { const out = {}; for (const a of p1) for (const b of p2) { const g = gt(a, b); out[g] = (out[g] || 0) + 1; } return out; }
  const isDom = (g) => /[A-Z]/.test(g);
  const fracTxt = (n, d) => { const g = P.gcd(n, d); return n === 0 ? '0' : n === d ? '1' : `${n / g}/${d / g}`; };
  const pct = (x) => `${P.n(x * 100, 2)}%`;
  // trait contexts: letter, dominant phenotype, recessive phenotype, organism
  const TRAITS = [
    { L: 'T', dom: 'tall', rec: 'short', org: 'pea plants', one: 'pea plant' },
    { L: 'P', dom: 'hornless (polled)', rec: 'horned', org: 'cattle', one: 'calf' },
    { L: 'B', dom: 'black fur', rec: 'brown fur', org: 'guinea pigs', one: 'guinea pig' },
    { L: 'W', dom: 'white wool', rec: 'black wool', org: 'sheep', one: 'lamb' },
    { L: 'R', dom: 'round seeds', rec: 'wrinkled seeds', org: 'pea plants', one: 'pea plant' },
    { L: 'G', dom: 'green pods', rec: 'yellow pods', org: 'bean plants', one: 'bean plant' },
  ];
  const ph = (t, g) => (isDom(g) ? t.dom : t.rec);
  const gName = (g) => (g[0] === g[1] ? (isDom(g) ? 'homozygous dominant' : 'homozygous recessive') : 'heterozygous');
  const punnettOf = (p1, p2) => Bio.punnett(p2, p1, (r, c) => gt(r, c), { corner: '' });

  /* ---------- canvas: chromosomes ---------- */
  function chromo(a, x, y, h, cols, w = 12, al = 1) { // cols: [[from 0..1, colour], ...]
    for (let k = 0; k < cols.length; k++) { const y0 = y + cols[k][0] * h, y1 = y + (k + 1 < cols.length ? cols[k + 1][0] : 1) * h; a.round(x - w / 2, y0, w, y1 - y0, w / 2, { fill: cols[k][1], stroke: a.C.ink, lw: 1, alpha: al }); }
  }

  /* ======================= 10. Sources of variation ======================= */
  P.addUnit({
    id: 'variation-sources', title: 'Mutation and meiosis: where variation comes from', mins: 10,
    blurb: 'New alleles come from mutation. New combinations come from meiosis and fertilisation.',
    recap: 'Mutation is the only source of new alleles. A gametic mutation (in a cell that makes gametes) can be inherited; a somatic mutation (in a body cell) cannot. Meiosis makes gametes with half the chromosomes, and it shuffles alleles in two ways: crossing over swaps sections between homologous chromosomes, and independent assortment lines up each pair at random. Segregation means each gamete gets one allele of each gene. Random fertilisation then combines any sperm with any egg. Together these make every offspring unique.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Mutation: the only source of new alleles.</h2>'), C(3, '<p>A change in the base sequence of DNA can create a new allele.</p>'), C(7, '<p>Gametic mutation: in sperm or egg cells, so it can be passed on. Somatic mutation: in body cells, so it dies with the organism.</p>')],
        board: [L(0.5, 'mutation → new allele'), L(3, '<b>gametic</b>: in cells that make gametes → inherited', 'evolution can act on it'), L(6, '<b>somatic</b>: in body cells (e.g. skin) → not inherited', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>Crossing over</h2>'), C(3, '<p>In meiosis, homologous chromosomes pair up. Their chromatids cross and swap matching sections.</p>'), C(8.5, '<p>The result: chromosomes with new combinations of alleles, unlike either parent’s.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const h = H * 0.7, y = H * 0.12, sw = a.seg(a.p, 0.45, 0.65);
          chromo(a, W * 0.3, y, h, [[0, c.c1]]); chromo(a, W * 0.38, y, h, sw > 0.5 ? [[0, c.c1], [0.5, c.c2]] : [[0, c.c1]]);
          chromo(a, W * 0.56, y, h, sw > 0.5 ? [[0, c.c2], [0.5, c.c1]] : [[0, c.c2]]); chromo(a, W * 0.64, y, h, [[0, c.c2]]);
          a.alpha(a.seg(a.p, 0.2, 0.3) * (1 - sw), () => { a.line(W * 0.38, y + h * 0.45, W * 0.56, y + h * 0.55, c.pen, 3); a.line(W * 0.38, y + h * 0.55, W * 0.56, y + h * 0.45, c.pen, 3); });
          a.text('chiasma', W * 0.47, y + h * 0.36, { align: 'center', font: 'pen', col: c.pen, alpha: a.seg(a.p, 0.2, 0.3) * (1 - sw) });
          a.text('recombinant chromatids', W * 0.47, H * 0.92, { align: 'center', font: 'pen', col: c.pen, alpha: a.seg(a.p, 0.65, 0.75) });
        } },
      { dur: 13, card: [C(0, '<h2>Independent assortment and segregation</h2>'), C(3, '<p>Each pair of chromosomes lines up at random, so the mix sent to each gamete is random.</p>'), C(8, '<p>Segregation: the two alleles of each gene separate, so a gamete gets only one.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const flip = a.p > 0.5;
          const pairs = [[c.c1, c.c2], [c.c3, c.c4]];
          pairs.forEach(([x1, x2], k) => { const y = H * (0.2 + k * 0.38), h = H * 0.26; const left = flip && k === 1 ? x2 : x1, right = flip && k === 1 ? x1 : x2; chromo(a, W * 0.42, y, h, [[0, left]], 14); chromo(a, W * 0.58, y, h, [[0, right]], 14); });
          a.line(W * 0.5, H * 0.08, W * 0.5, H * 0.92, c.pen, 2, [6, 6]);
          a.text(flip ? 'another way to line up' : 'one way to line up', W * 0.5, H * 0.96, { align: 'center', font: 'pen', col: c.pen });
        } },
      { dur: 11, card: [C(0, '<h2>Then fertilisation</h2>'), C(3, '<p>Any sperm can fuse with any egg. Millions of combinations from each parent, multiplied together.</p>')],
        board: [L(0.5, 'mutation → new alleles'), L(2.5, 'crossing over → new combinations on one chromosome'), L(4.5, 'independent assortment → new mixes of chromosomes'), L(6.5, 'random fertilisation → new combinations of gametes', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain how crossing over increases genetic variation.',
      steps: [
        { m: 'During meiosis, homologous chromosomes pair up.', note: 'when' },
        { m: 'Non-sister chromatids cross at chiasmata and swap matching sections of DNA.', note: 'what happens' },
        { m: 'Alleles that were on the same chromosome are separated, and new combinations of alleles form on the chromatids.', note: 'the effect on alleles' },
        { m: 'So the gametes carry combinations of alleles that neither parent had, and offspring are more varied.', note: 'link to variation' },
      ],
    },
    faded() { return Bio.labelGen((w) => Bio.crossing(w), { chiasma: 'Chiasma', sister: 'Sister chromatid', recombinant: 'Recombinant chromatid', centromere: 'Centromere' }, { n: 4, extra: ['Nucleus', 'Spindle fibre'], prompt: 'Label the pair of homologous chromosomes during crossing over.' })(); },
    grades: 'AAAMM',
    gens: [
      P.terms([['mutation', 'A change in the base sequence of DNA, which can create a new allele.'], ['gametic mutation', 'A mutation in a cell that makes gametes, so it can be inherited.'], ['somatic mutation', 'A mutation in a body cell, which is not inherited.'], ['crossing over', 'Swapping of matching sections between chromatids of homologous chromosomes in meiosis.'], ['independent assortment', 'Random lining up of homologous pairs in meiosis, so each gamete gets a random mix of chromosomes.'], ['segregation', 'Separation of the two alleles of a gene into different gametes.'], ['homologous chromosomes', 'A matching pair of chromosomes, one from each parent, with the same genes.'], ['allele', 'A different version of a gene.']]),
      Bio.labelGen((w) => Bio.crossing(w), { chiasma: 'Chiasma', sister: 'Sister chromatid', recombinant: 'Recombinant chromatid', centromere: 'Centromere', homologous: 'Homologous chromosome' }, { n: 4, extra: ['Spindle fibre'], prompt: 'Label the diagram of crossing over.' }),
      P.bank([
        { q: 'A skin cell gains a mutation from sunburn. Can it be passed to the person’s children?', a: 'No: it is a somatic mutation, in a body cell, not in a gamete', why: 'Only gametic mutations, in cells that make sperm or eggs, can be inherited.', w: [['Yes, all mutations are inherited', 'Only gametic ones are.'], ['Yes, if the person has many children', 'The number of children does not matter.'], ['Only if it is a dominant allele', 'Dominance does not decide whether it is inherited.']] },
        { q: 'What is the only source of completely new alleles?', a: 'Mutation', why: 'Meiosis and fertilisation shuffle existing alleles; only mutation makes new ones.', w: [['Crossing over', 'It makes new combinations, not new alleles.'], ['Fertilisation', 'It combines existing alleles.'], ['Natural selection', 'Selection acts on alleles that already exist.']] },
        { q: 'In meiosis, when does crossing over happen?', a: 'When homologous chromosomes pair up, before they separate', why: 'Pairing lets the chromatids touch and swap sections.', w: [['After fertilisation', 'Crossing over happens in meiosis, before gametes form.'], ['In mitosis', 'Homologous chromosomes do not pair in mitosis.'], ['When DNA is translated', 'Translation makes proteins.']] },
        { q: 'What does segregation mean in genetics?', a: 'The two alleles of a gene separate so each gamete gets one', why: 'This is why a heterozygote Aa makes A and a gametes in equal numbers.', w: [['Chromatids swapping sections', 'That is crossing over.'], ['Chromosome pairs lining up at random', 'That is independent assortment.'], ['A change in the DNA sequence', 'That is mutation.']] },
      ]),
      P.bank([
        { q: 'Why are siblings (not identical twins) genetically different from each other?', a: 'Each came from a different sperm and egg, made by meiosis with crossing over and independent assortment', why: 'Every gamete is a unique combination, and fertilisation is random.', w: [['They have different parents', 'They share both parents.'], ['Mutations happen in every sibling', 'Mutation is rare; shuffling is the main cause.'], ['Mitosis makes each gamete different', 'Gametes are made by meiosis.']] },
        { q: 'Why does sexual reproduction help a species survive a changing environment?', a: 'It makes varied offspring, so some are more likely to have alleles that suit the new conditions', why: 'Variation gives natural selection something to act on.', w: [['It makes offspring identical to the best parent', 'It makes them different.'], ['It stops mutations happening', 'It does not stop mutations.'], ['It produces more offspring than asexual reproduction', 'Usually fewer. The benefit is variation.']] },
        { q: 'Independent assortment of 23 chromosome pairs gives how many possible combinations in human gametes (ignoring crossing over)?', a: '2²³, about 8.4 million', why: 'Each pair can line up two ways, independently: 2 × 2 × … 23 times.', w: [['23', 'That is the number of pairs.'], ['46', 'That is the number of chromosomes.'], ['2 × 23 = 46', 'The choices multiply, not add.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: how meiosis and fertilisation make a unique offspring.', steps: ['Homologous chromosomes pair up in meiosis', 'Crossing over swaps sections between chromatids', 'Pairs line up and separate at random (independent assortment)', 'Each gamete gets one allele of each gene (segregation)', 'A random sperm fertilises a random egg'] },
        { q: 'Put the steps in order: how a new allele can spread into the next generation.', steps: ['A mutation changes the base sequence in a cell that makes gametes', 'A new allele forms', 'The allele is carried into a gamete', 'That gamete takes part in fertilisation', 'The offspring carries the new allele in every cell'] },
      ]),
    ],
    tips: [
      'Mutation makes <span class="pen">new alleles</span>; meiosis and fertilisation make <span class="pen">new combinations</span>. Keep the two ideas apart.',
      'Gametic mutations are inherited; somatic mutations are not. The 2026 specification names this difference.',
      'Merit in 2025: explain crossing over and segregation as “alleles reshuffled, new combinations, gametes unique”.',
      'Define every term you use. The 2025 report said incorrect definitions were a common Not Achieved error.',
    ],
    aim: {
      intro: '<div class="resource">Two brown kiwi from the same nest look alike but differ genetically. A third kiwi in the population has a pale feather patch caused by a mutation; its chicks do not have it.</div>',
      parts: [
        { q: 'Describe two sources of genetic variation in sexual reproduction.', write: true, words: '40–60',
          model: [S('Crossing over: in meiosis, homologous chromosomes swap sections of chromatids, making new combinations of alleles.', 'source 1', true), S('Independent assortment: homologous pairs line up at random, so each gamete gets a random mix of chromosomes.', 'source 2', true), S('Random fertilisation and mutation also add variation.', 'others')],
          earns: 'Achieved: two correct sources, each described with the right term.',
          crit: { A: 'Two of: mutation, crossing over, independent assortment, segregation, random fertilisation, each correctly described.' } },
        { q: 'Explain why the pale feather patch was not passed on to the kiwi’s chicks.', write: true, words: '50–80',
          model: [S('The mutation was most likely a somatic mutation, in body cells such as the feather-making skin cells.', 'names the type', true), S('Somatic mutations are not in the cells that make gametes.', 'why it matters'), S('So the mutated allele is not carried in the kiwi’s sperm or eggs, and cannot reach the chicks.', 'linked conclusion', true), S('Only gametic mutations can be inherited.', 'contrast')],
          earns: 'Merit: the type of mutation is identified and linked to whether it can reach the gametes.',
          crit: { A: 'States it is a somatic mutation or not in gametes.', M: 'Explains somatic mutation is in body cells, not gamete-forming cells, so the allele is not in the gametes and is not inherited; contrasts with gametic.' } },
        { q: 'Discuss how meiosis and fertilisation make the two nestmates genetically different, and why this variation matters for the kiwi population.', write: true, words: '100–140',
          model: [S('Each chick came from a different egg and sperm, and each gamete is unique.', 'the starting point', true), S('In meiosis, crossing over creates new combinations of alleles on each chromosome, and independent assortment mixes the chromosomes at random.', 'two mechanisms'), S('Segregation sends one allele of each gene into each gamete, and random fertilisation combines any sperm with any egg, so the two chicks get different combinations.', 'links to the nestmates', true), S('Variation in the population means some kiwi may carry alleles that help them survive a new disease or a change in habitat.', 'why it matters'), S('So variation gives natural selection something to act on, which helps the population survive change. A population with little variation is more at risk.', 'justified significance', true)],
          earns: 'Excellence: the mechanisms are linked to explain the nestmates’ differences, and the significance of variation for the population is justified.',
          crit: { M: 'Explains how crossing over, independent assortment and fertilisation make each chick different.', E: 'Links all mechanisms to the different nestmates and discusses why variation matters (survival in changing environments, natural selection), with a justified conclusion about the population.' } },
      ],
      up: [
        up(1, ['The patch was not passed on because it was a somatic mutation.'], [
          ['Explain why: somatic mutations are in body cells, not gamete-making cells, so the allele never reaches the sperm or eggs', 1, 'Right. The term is correct, but Merit needs the reason it is not inherited.'],
          ['Say what a mutation is', 0, 'A definition is fine, but the link to gametes is missing.'],
          ['Say the chicks are lucky', 0, 'Not biology.'],
          ['Name the gene', 0, 'Not given, and not the missing link.']]),
        up(2, ['Crossing over and independent assortment make the chicks different. This variation is good for the population.'], [
          ['Explain each mechanism and fertilisation, link them to the two chicks, and justify why variation helps the population survive change', 1, 'Right. The answer names mechanisms and makes a claim, but explains neither. Excellence needs the links and the justification.'],
          ['List more mechanisms', 0, 'A longer list is still description.'],
          ['Say kiwi are endangered', 0, 'Useful context, but it needs linking to why variation matters.'],
          ['Draw meiosis', 0, 'A diagram alone does not discuss.']]),
      ],
    },
  });

  /* ======================= 11. Monohybrid crosses ======================= */
  function monoQ(kind) {
    const t = R.pick(TRAITS), D = t.L, r = t.L.toLowerCase();
    const opts = [[[D, r], [D, r]], [[D, r], [r, r]], [[D, D], [r, r]], [[D, D], [D, r]]];
    const [p1, p2] = R.pick(opts);
    const off = cross(p1, p2), domN = Object.keys(off).filter(isDom).reduce((s, g) => s + off[g], 0);
    return { t, D, r, p1, p2, off, domN, g1: p1.join(''), g2: p2.join('') };
  }
  P.addUnit({
    id: 'monohybrid', title: 'Monohybrid crosses and Punnett squares', mins: 11,
    blurb: 'Gametes, Punnett square, ratio. The 3:1 and 1:1 patterns, as fractions and percentages.',
    recap: 'A gene comes in versions called alleles. An organism has two alleles for each gene (its genotype). A dominant allele (capital letter) shows its effect whenever it is present; a recessive allele (small letter) shows only when there are two copies. Homozygous means two the same (TT or tt); heterozygous means two different (Tt). For a cross: write each parent’s gametes, fill a Punnett square, then count genotypes and phenotypes. Tt × Tt gives a 3:1 phenotype ratio; Tt × tt gives 1:1. Ratios are expected proportions, not exact counts.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>The words first</h2>'), C(3, '<p>Genotype: the alleles (Tt). Phenotype: what you see (tall).</p>'), C(7, '<p>Homozygous: same alleles (TT, tt). Heterozygous: different (Tt).</p>')],
        board: [L(0.5, '<b>TT</b>: homozygous dominant → tall'), L(3, '<b>Tt</b>: heterozygous → tall (T is dominant)'), L(5.5, '<b>tt</b>: homozygous recessive → short', '', { hl: true })] },
      { dur: 15, card: [C(0, '<h2>Tt × Tt</h2>'), C(3, '<p>Each parent makes T and t gametes, in equal numbers (segregation).</p>'), C(7, '<p>Fill the square. One TT, two Tt, one tt.</p>'), C(11, '<p>Genotypes 1:2:1. Phenotypes 3 tall : 1 short.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const s = Math.min(W * 0.22, H * 0.25), x0 = W * 0.5 - s, y0 = H * 0.24;
          a.text('T', x0 + s / 2, y0 - 16, { align: 'center', font: 'head', col: c.pen }); a.text('t', x0 + 1.5 * s, y0 - 16, { align: 'center', font: 'head', col: c.pen });
          a.text('T', x0 - 18, y0 + s / 2, { align: 'center', font: 'head', col: c.pen }); a.text('t', x0 - 18, y0 + 1.5 * s, { align: 'center', font: 'head', col: c.pen });
          const cells = [['TT', 0, 0], ['Tt', 1, 0], ['Tt', 0, 1], ['tt', 1, 1]];
          cells.forEach(([g, i, j], k) => { a.box(x0 + i * s, y0 + j * s, s, s, { fill: g === 'tt' ? c.paper : c.sheet, stroke: c.line }); a.text(g, x0 + (i + 0.5) * s, y0 + (j + 0.5) * s, { align: 'center', font: 'head', size: 1.2, alpha: a.seg(a.p, 0.3 + k * 0.08, 0.4 + k * 0.08) }); });
          a.text('3 tall : 1 short', W * 0.5, H * 0.9, { align: 'center', font: 'pen', col: c.pen, alpha: a.seg(a.p, 0.75, 0.85) });
        } },
      { dur: 12, card: [C(0, '<h2>Same ratio, four ways</h2>'), C(3, '<p>The specification allows ratios, fractions, percentages or decimals. Be fluent in all four.</p>')],
        board: [L(0.5, '3 : 1'), L(2.5, '3/4 tall, 1/4 short'), L(4.5, '75% tall, 25% short'), L(6.5, '0.75 and 0.25', '', { hl: true }), L(8.5, '<span class="muted">expected proportions: real litters vary by chance</span>')] },
    ],
    example: {
      problem: 'In guinea pigs, black fur (B) is dominant to brown fur (b). Two heterozygous black guinea pigs are crossed. Find the expected phenotype ratio of the offspring.',
      steps: [
        { m: 'Parents: Bb × Bb. Each parent makes gametes B and b.', note: 'gametes first' },
        { m: punnettOf(['B', 'b'], ['B', 'b']), note: 'Punnett square' },
        { m: 'Genotypes: 1 BB : 2 Bb : 1 bb.', note: 'count' },
        { m: 'BB and Bb are black; bb is brown. So 3 black : 1 brown, or 75% black.', note: 'phenotypes' },
      ],
    },
    faded() { const x = monoQ(); const ans = x.domN / 4;
      return { kind: 'num', answer: ans, prob: true, fmt: PFMT, prompt: `In ${x.t.org}, ${x.t.dom} (${x.D}) is dominant to ${x.t.rec} (${x.r}). A ${x.g1} parent is crossed with a ${x.g2} parent. What is the probability that an offspring is ${x.t.dom}?`, scaffold: [`Gametes: ${[...new Set(x.p1)].join(' and ')} from one parent; ${[...new Set(x.p2)].join(' and ')} from the other.`, punnettOf(x.p1, x.p2)],
        more: { steps: [St('Write each parent’s gametes, then fill the Punnett square.'), St('Fill it:', punnettOf(x.p1, x.p2)), St(`Count the squares with at least one ${x.D}: ${x.domN} out of 4.`), St(`So the probability is ${fracTxt(x.domN, 4)} = ${pct(ans)}.`)], trap: `Counting only ${x.D}${x.D}. Any square with a ${x.D} shows the dominant phenotype.` }, sol: [`${x.domN} of 4 squares contain ${x.D}`, `${fracTxt(x.domN, 4)} = ${pct(ans)}`] }; },
    grades: 'AAAMM',
    gens: [
      P.terms([['gene', 'A section of DNA that codes for a protein, and so a characteristic.'], ['allele', 'A different version of the same gene.'], ['genotype', 'The alleles an organism has, e.g. Tt.'], ['phenotype', 'The characteristic that is seen, e.g. tall.'], ['dominant', 'An allele whose effect shows whenever it is present.'], ['recessive', 'An allele whose effect shows only when there are two copies.'], ['homozygous', 'Having two identical alleles for a gene.'], ['heterozygous', 'Having two different alleles for a gene.']]),
      () => { const x = monoQ(); const ans = x.domN / 4;
        return { kind: 'num', answer: ans, prob: true, fmt: PFMT, prompt: `In ${x.t.org}, ${x.t.dom} (${x.D}) is dominant to ${x.t.rec} (${x.r}). ${x.g1} × ${x.g2}. What proportion of the offspring are expected to be ${x.t.dom}?`,
          wrong: [{ v: Object.keys(x.off).filter((g) => g === x.D + x.D).reduce((s, g) => s + x.off[g], 0) / 4, msg: `That counts only ${x.D}${x.D}. Heterozygotes show the dominant phenotype too.` }].filter((w) => Math.abs(w.v - ans) > 1e-9),
          more: { steps: [St('Fill the Punnett square from the gametes.', punnettOf(x.p1, x.p2)), St(`Squares with a ${x.D} are ${x.t.dom}: ${x.domN} of 4.`), St(`${fracTxt(x.domN, 4)} = ${pct(ans)}.`)] }, sol: [`${fracTxt(x.domN, 4)} = ${pct(ans)}`] }; },
      () => { const x = monoQ(); const recN = 4 - x.domN; const ratio = recN === 0 ? `all ${x.t.dom}` : x.domN === 0 ? `all ${x.t.rec}` : `${x.domN / P.gcd(x.domN, recN)} ${x.t.dom} : ${recN / P.gcd(x.domN, recN)} ${x.t.rec}`;
        const all = [`3 ${x.t.dom} : 1 ${x.t.rec}`, `1 ${x.t.dom} : 1 ${x.t.rec}`, `all ${x.t.dom}`, `1 ${x.t.dom} : 3 ${x.t.rec}`, `1 ${x.t.dom} : 2 ${x.t.rec}`];
        return P.mcq({ prompt: `In ${x.t.org}, ${x.t.dom} (${x.D}) is dominant to ${x.t.rec} (${x.r}). What is the expected phenotype ratio from ${x.g1} × ${x.g2}?`, fig: punnettOf(x.p1, x.p2), more: { steps: [St('Count each phenotype in the square.'), St(`${x.domN} ${x.t.dom}, ${recN} ${x.t.rec}.`), St(`Ratio: ${ratio}.`)] } }, P.uniq([{ t: ratio, ok: true }].concat(all.filter((r) => r !== ratio).slice(0, 3).map((r) => ({ t: r, why: `Count the squares: ${x.domN} have a ${x.D}.` }))))); },
      () => { const x = monoQ(); const n = R.pick([40, 60, 80, 120, 200]); const ans = (x.domN / 4) * n;
        return { kind: 'num', answer: ans, prompt: `${x.t.org[0].toUpperCase() + x.t.org.slice(1)}: ${x.t.dom} (${x.D}) is dominant to ${x.t.rec} (${x.r}). A ${x.g1} × ${x.g2} cross produces ${n} offspring. How many are expected to be ${x.t.dom}?`, fmt: 'Give a whole number.',
          more: { steps: [St(`The Punnett square gives ${x.domN}/4 ${x.t.dom}.`, punnettOf(x.p1, x.p2)), St(`Expected number = ${fracTxt(x.domN, 4)} × ${n} = ${ans}.`), St('Real results will be close to this, but not exact: each fertilisation is a chance event.')] }, sol: [`${fracTxt(x.domN, 4)} × ${n} = ${ans}`] }; },
      P.bank([
        { q: 'Why does a heterozygous Tt plant make T and t gametes in equal numbers?', a: 'In meiosis the two alleles segregate, so half the gametes get T and half get t', why: 'Segregation is the basis of every Punnett square.', w: [['Because T is dominant', 'Dominance affects the phenotype, not the gametes.'], ['Because of crossing over', 'Segregation is enough; crossing over is about two genes.'], ['It does not: it makes more T', 'They are equal.']] },
        { q: 'A cross is expected to give 3:1, but a litter of 4 has 2 dominant and 2 recessive. Why?', a: 'Ratios are probabilities; each offspring is a separate chance event, so small samples vary', why: 'Expected ratios appear only with large numbers of offspring.', w: [['The Punnett square was wrong', 'A small sample often differs from the ratio.'], ['A mutation must have happened', 'No need: chance explains it.'], ['Dominance stopped working', 'Dominance does not switch off.']] },
        { q: 'Two tall pea plants produce some short offspring. What are the parents’ genotypes?', a: 'Both Tt', why: 'A short (tt) offspring needs a t from each parent. Tall parents with a t must be Tt.', w: [['Both TT', 'TT × TT cannot give tt.'], ['TT and Tt', 'TT gives only T gametes, so no tt offspring.'], ['Both tt', 'Then the parents would be short.']] },
      ]),
    ],
    tips: [
      'Write the <span class="pen">gametes</span> first, outside the square. The 2025 Achieved candidates identified the correct gametes and completed the Punnett square.',
      'Give ratios in the form asked: ratio, fraction, percentage or decimal. The specification allows all four.',
      'Use a key: say which letter is which allele and which is dominant.',
      'Expected ratios are probabilities. Small families can differ by chance.',
    ],
    aim: {
      intro: '<div class="resource">In sheep, white wool (W) is dominant to black wool (w). A farmer crosses two white sheep. Over several years they have 32 lambs: 23 white and 9 black.</div>',
      parts: [
        { q: 'State the genotypes of the two parents and draw a Punnett square for the cross. Give the expected phenotype ratio.', write: true, words: '30–60',
          model: [S('Both parents must be heterozygous: Ww × Ww.', 'parents', true), S('Gametes: W and w from each parent. Punnett square: WW, Ww, Ww, ww.', 'square', true), S('Expected ratio: 3 white : 1 black (75% white, 25% black).', 'ratio', true)],
          earns: 'Achieved: the right parent genotypes, a correct square and the expected ratio.',
          crit: { A: 'Parents Ww × Ww; gametes W, w; offspring WW, Ww, Ww, ww; 3 white : 1 black.' } },
        { q: 'Explain how you know both parents are heterozygous.', write: true, words: '50–80',
          model: [S('Black lambs are ww: black is recessive, so they need two w alleles.', 'the clue', true), S('Each black lamb got one w allele from each parent.', 'where the alleles came from', true), S('Both parents are white, so each has at least one W.', 'the parents’ phenotype'), S('So each parent must be Ww: heterozygous.', 'conclusion', true)],
          earns: 'Merit: a logical chain from the black lambs back to the parents’ genotypes.',
          crit: { A: 'States black lambs are ww.', M: 'Explains black lambs ww → one w from each parent; parents white so have W → both Ww.' } },
        { q: 'The expected ratio predicts 24 white and 8 black lambs. Discuss whether the farmer’s results fit the prediction, and why real results differ from expected ratios.', write: true, words: '90–130',
          model: [S('Expected: 3/4 × 32 = 24 white and 1/4 × 32 = 8 black. Observed: 23 white and 9 black.', 'uses the data', true), S('The results are very close to the 3:1 prediction, so they support the parents being Ww × Ww.', 'judgement'), S('They are not exact because each lamb is a separate fertilisation, and which sperm meets which egg is random.', 'why they differ', true), S('With only 32 lambs, chance can easily shift the numbers by one or two. The bigger the sample, the closer the results usually get to 3:1.', 'sample size'), S('So a 23:9 result is what we would expect from chance; it does not mean the Punnett square is wrong.', 'justified conclusion', true)],
          earns: 'Excellence: the data are compared with the prediction, the gap is explained by chance and sample size, and a justified conclusion is reached.',
          crit: { M: 'Explains that results are close to 3:1 and that fertilisation is random.', E: 'Compares observed with expected numerically, explains random fertilisation and small sample size, and concludes the results fit the prediction.' } },
      ],
      up: [
        up(1, ['Both parents are Ww because they had black lambs.'], [
          ['Explain the chain: black lambs are ww, so each parent gave a w; the parents are white so also have a W; so both are Ww', 1, 'Right. The conclusion is right, but Merit needs each link in the reasoning.'],
          ['Draw the Punnett square again', 0, 'The square is part (a). Part (b) needs the reasoning.'],
          ['Say that white is dominant', 0, 'True, but only one piece of the chain.'],
          ['Give the ratio', 0, 'The ratio does not explain the genotypes.']]),
        up(2, ['The results are close to 3:1 so they fit. They are not exact because of chance.'], [
          ['Compare the numbers (24:8 expected vs 23:9 observed), explain why chance matters (random fertilisation, a small sample), and conclude', 1, 'Right. The answer is correct but thin. Excellence uses the data and explains the role of chance and sample size.'],
          ['Say the farmer counted wrongly', 0, 'No need: chance explains it.'],
          ['Say a mutation happened', 0, 'Unlikely and unnecessary.'],
          ['Repeat the parents’ genotypes', 0, 'Already done in part (b).']]),
      ],
    },
  });

  /* ======================= 12. Test crosses ======================= */
  P.addUnit({
    id: 'test-cross', title: 'Test crosses: finding an unknown genotype', mins: 9,
    blurb: 'Cross with homozygous recessive. Any recessive offspring means heterozygous. Then weigh the evidence.',
    recap: 'An organism with the dominant phenotype could be homozygous (TT) or heterozygous (Tt). A test cross finds out: cross it with a homozygous recessive (tt). If all offspring show the dominant phenotype, the unknown is probably TT. If about half show the recessive phenotype, it is Tt. One recessive offspring is enough to prove Tt; all-dominant offspring can only make TT more likely, because a Tt parent could produce all-dominant offspring by chance in a small sample.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Tall plant: TT or Tt?</h2>'), C(3, '<p>You cannot tell by looking. Cross it with a short plant, tt.</p>'), C(7.5, '<p>The tt parent can only give t, so each offspring shows which allele the unknown parent gave.</p>')],
        board: [L(0.5, 'TT × tt → all Tt → <b>all tall</b>'), L(3.5, 'Tt × tt → Tt, tt → <b>1 tall : 1 short</b>'), L(7, 'any short offspring ⇒ the unknown parent is Tt', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>The uncertainty is an Excellence idea.</h2>'), C(3, '<p>A Tt plant can give 4 tall offspring in a row by chance: (1/2)⁴ = 1/16.</p>'), C(8, '<p>The more offspring, the surer you can be. Recessive offspring prove Tt; all-dominant offspring never fully prove TT.</p>')],
        board: [L(0.5, '4 tall offspring from Tt × tt: (1/2)<sup>4</sup> = 1/16'), L(3.5, '10 tall offspring: (1/2)<sup>10</sup> ≈ 1/1000'), L(6.5, 'bigger sample → more confidence', '', { hl: true })] },
    ],
    example: {
      problem: 'A black guinea pig (B is dominant to b) is crossed with a brown guinea pig. Of 8 offspring, 5 are black and 3 are brown. What is the black parent’s genotype?',
      steps: [
        { m: 'The brown parent is bb, so it can only give b gametes.', note: 'the tester' },
        { m: 'Brown offspring are bb, so they got a b from the black parent too.', note: 'the clue' },
        { m: 'So the black parent has a b allele: it is Bb (heterozygous).', note: 'conclusion' },
        { m: 'Bb × bb predicts 1:1, and 5:3 is close to that for 8 offspring.', note: 'check with the ratio' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how a test cross shows that a tall plant is heterozygous.', steps: ['Cross the tall plant with a short (tt) plant', 'The tt plant can only give t gametes', 'Some offspring are short (tt)', 'So the tall parent must have given a t allele', 'The tall parent is Tt (heterozygous)'] }], 2)(); },
    grades: 'AAMMME',
    gens: [
      P.bank([
        { q: 'What is a test cross?', a: 'Crossing an organism with the dominant phenotype with a homozygous recessive, to find its genotype', why: 'The recessive parent reveals which alleles the unknown parent passes on.', w: [['Crossing two heterozygotes', 'That gives 3:1; it does not identify an unknown.'], ['Crossing two homozygous dominants', 'Gives all dominant; no information.'], ['A genetic test of a blood sample', 'In this standard, a test cross is a breeding cross.']] },
        { q: 'Why must the tester be homozygous recessive?', a: 'It can only give recessive alleles, so the offspring’s phenotype shows which allele the unknown parent gave', why: 'A recessive tester never hides the unknown’s alleles.', w: [['So all offspring are recessive', 'They are not all recessive unless the unknown is too.'], ['Because recessive organisms are healthier', 'Not the reason.'], ['To make a 3:1 ratio', 'A test cross gives 1:1 or all dominant.']] },
      ]),
      () => { const het = R.pick([true, false]); const n = R.pick([6, 8, 10, 12]); const rec = het ? R.int(Math.floor(n / 2) - 2, Math.ceil(n / 2) + 1) : 0; const t = R.pick(TRAITS);
        const ans = het ? `${t.L}${t.L.toLowerCase()} (heterozygous)` : `Probably ${t.L}${t.L} (homozygous dominant)`;
        return P.mcq({ prompt: `A ${t.one} with ${t.dom} (dominant) is crossed with one with ${t.rec}. Of ${n} offspring, ${n - rec} have ${t.dom} and ${rec} have ${t.rec}. What is the ${t.dom} parent’s genotype?`, more: { steps: [St(`The ${t.rec} parent is ${t.L.toLowerCase()}${t.L.toLowerCase()}, so it only gives ${t.L.toLowerCase()}.`), St(het ? `Some offspring are ${t.rec}, so they got ${t.L.toLowerCase()} from the other parent too. That parent must be heterozygous.` : `No ${t.rec} offspring in ${n}: the parent is probably homozygous. A heterozygote would give all ${n} dominant only ${(0.5 ** n * 100).toFixed(2)}% of the time.`)] } },
          [{ t: ans, ok: true }, { t: het ? `${t.L}${t.L} (homozygous dominant)` : `${t.L}${t.L.toLowerCase()} (heterozygous)`, why: het ? `${t.L}${t.L} cannot produce any ${t.rec} offspring.` : `A heterozygote would usually give about half ${t.rec} offspring.` }, { t: `${t.L.toLowerCase()}${t.L.toLowerCase()} (homozygous recessive)`, why: `That parent would show ${t.rec}.` }]); },
      () => { const n = R.pick([3, 4, 5, 6, 8]); const ans = 0.5 ** n;
        return { kind: 'num', answer: ans, prob: true, dp: n > 5 ? 4 : null, tol: 0.0006, fmt: PFMT, prompt: `A heterozygous Tt plant is test-crossed with tt. What is the probability that all ${n} offspring are tall, just by chance?`, wrong: [{ v: 0.5, msg: `That is for one offspring. For ${n} independent offspring, multiply: (1/2)^${n}.` }],
          more: { steps: [St('Each offspring has a 1/2 chance of being tall (Tt) from Tt × tt.'), St(`Each is independent, so multiply ${n} times.`, `$\\left(\\tfrac12\\right)^{${n}} = \\tfrac{1}{${2 ** n}}$`), St(`≈ ${P.f(ans, 4)}. This is why all-tall offspring make TT likely, but never prove it.`)] }, sol: [`$\\left(\\tfrac12\\right)^{${n}} = \\tfrac{1}{${2 ** n}} \\approx ${P.f(ans, 4)}$`] }; },
      P.bank([
        { q: 'A test cross gives 12 offspring, all showing the dominant phenotype. What can you conclude?', a: 'The parent is very probably homozygous dominant, but this is not certain', why: 'A heterozygote gives 12 dominant offspring with probability (1/2)¹² ≈ 0.0002: unlikely but possible.', w: [['The parent is definitely homozygous', 'A heterozygote could, very rarely, give this result.'], ['The parent is heterozygous', 'Then about half should be recessive.'], ['The test failed', 'The result is informative.']] },
        { q: 'A test cross gives 9 dominant and 1 recessive offspring. What is the unknown parent?', a: 'Heterozygous: one recessive offspring proves it carries the recessive allele', why: 'A homozygous dominant parent cannot give any recessive offspring. The 9:1 split is chance.', w: [['Homozygous dominant, because most are dominant', 'One recessive offspring rules this out.'], ['Cannot tell without 1:1 exactly', 'The single recessive is proof.'], ['Homozygous recessive', 'Then it would show the recessive phenotype.']] },
      ], { grade: 'M' }),
      P.chain([
        { q: 'Put the steps in order: using a test cross to decide if a black guinea pig is BB or Bb.', steps: ['Cross the black guinea pig with a brown (bb) one', 'The brown parent can only give b gametes', 'Count the offspring’s colours', 'If any are brown, the black parent gave b, so it is Bb', 'If all of many offspring are black, it is probably BB'] },
      ]),
      P.bank([
        { q: 'Why is a test cross with 20 offspring more convincing than one with 4?', a: 'With more offspring, it is much less likely that a heterozygote gives no recessives by chance', why: '(1/2)⁴ = 1/16, but (1/2)²⁰ is about one in a million.', w: [['Larger litters are healthier', 'Not the reason.'], ['A bigger sample changes the genotype', 'The genotype is fixed.'], ['It is not; any sample size is equally good', 'Sample size matters a lot.']] },
        { q: 'A breeder wants to prove a prize bull (polled, P dominant) is PP before selling his semen. What is the best plan?', a: 'Test cross him with many horned (pp) cows: any horned calf proves Pp; many polled calves make PP very likely', why: 'More calves gives more confidence, and one horned calf is proof.', w: [['Cross him with a polled cow', 'A polled cow might be PP and hide the result.'], ['Look at his horns', 'He is polled either way.'], ['Cross him once with a horned cow', 'One calf gives little confidence.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      'Test cross = cross with the <span class="pen">homozygous recessive</span>. Say why: it only gives recessive alleles.',
      'One recessive offspring proves heterozygous. All dominant offspring only make homozygous likely.',
      'Excellence in 2025: linking a test cross to the observed ratios and to the uncertainty in the conclusion.',
      'Show the Punnett square for both possible genotypes and compare them with the results.',
    ],
    aim: {
      intro: '<div class="resource">A breeder has a tall pea plant and wants to know its genotype. She crosses it with a short plant (tall, T, is dominant to short, t). The cross gives 6 offspring, all tall.</div>',
      parts: [
        { q: 'Describe what a test cross is and why the breeder used a short plant.', write: true, words: '30–50',
          model: [S('A test cross is a cross between an organism with the dominant phenotype and a homozygous recessive organism, to find the unknown genotype.', 'definition', true), S('The short plant is tt, so it can only give t alleles.', 'why the tester', true)],
          earns: 'Achieved: a correct definition and the reason for using tt.',
          crit: { A: 'Cross with homozygous recessive to find unknown genotype; tt only gives t.' } },
        { q: 'Show the two possible crosses (TT × tt and Tt × tt) with Punnett squares, and explain which one the results support.', write: true, words: '60–90',
          model: [S('TT × tt: gametes T and t, all offspring Tt, all tall.', 'cross 1', true), S('Tt × tt: gametes T, t and t; offspring 1 Tt : 1 tt, so half tall, half short.', 'cross 2', true), S('All 6 offspring are tall, with no short ones.', 'the data'), S('This supports TT, because Tt × tt would be expected to give about 3 short plants out of 6.', 'linked conclusion', true)],
          earns: 'Merit: both possibilities worked out and compared with the results.',
          crit: { A: 'Correct Punnett squares for both crosses.', M: 'Explains that all tall offspring fit TT × tt, while Tt × tt would give about half short.' } },
        { q: 'Discuss how certain the breeder can be that the tall plant is TT, and how she could make her conclusion stronger.', write: true, words: '90–130',
          model: [S('If the plant were Tt, each offspring would have a 1/2 chance of being tall.', 'probability per offspring'), S('The chance of 6 tall offspring in a row from Tt × tt is (1/2)⁶ = 1/64, about 1.6%.', 'calculates the uncertainty', true), S('So the result makes TT very likely, but it does not prove it: a Tt plant could give this result by chance.', 'judgement', true), S('She could grow more offspring. If 20 offspring were all tall, the chance for Tt would be about one in a million.', 'how to strengthen'), S('A single short offspring at any point would prove the plant is Tt, so a larger cross either confirms TT much more strongly or disproves it.', 'justified conclusion', true)],
          earns: 'Excellence: the uncertainty is quantified, the limit of the evidence is stated, and a way to strengthen it is justified.',
          crit: { M: 'Explains that all tall makes TT likely but a heterozygote could give this by chance.', E: 'Calculates or clearly reasons the chance (1/64), states the conclusion is probable not certain, and justifies a larger sample, noting one short offspring would prove Tt.' } },
      ],
      up: [
        up(1, ['TT × tt gives all Tt. Tt × tt gives Tt and tt. The plant is TT.'], [
          ['Compare with the data: all 6 were tall, but Tt × tt would give about half short, so the results support TT', 1, 'Right. Both crosses are there, but the link to the results is missing.'],
          ['Add the gametes', 0, 'Useful, but the missing piece is the comparison with the data.'],
          ['Say short is recessive', 0, 'True, not the missing link.'],
          ['Give the phenotypes as percentages', 0, 'The link to the 6 tall offspring is still missing.']]),
        up(2, ['It is probably TT, but it could be Tt by chance. She should do more crosses.'], [
          ['Quantify the uncertainty ((1/2)⁶ = 1/64), explain why more offspring make it stronger, and that one short plant would prove Tt', 1, 'Right. The ideas are there but not developed. Excellence explains and justifies them.'],
          ['Say she should buy a new plant', 0, 'That avoids the question.'],
          ['Repeat the Punnett squares', 0, 'They were part (b).'],
          ['Say chance is random', 0, 'Too vague to discuss the certainty.']]),
      ],
    },
  });

  /* ======================= 13. Codominance and multiple alleles ======================= */
  const BLOOD = { AA: 'A', AO: 'A', BB: 'B', BO: 'B', AB: 'AB', OO: 'O' };
  const bloodPhen = (g) => BLOOD[g.split('').sort((x, y) => (x === 'O' ? 1 : y === 'O' ? -1 : x < y ? -1 : 1)).join('')];
  const bAll = (s) => s.replace(/A/g, 'I<sup>A</sup>').replace(/B/g, 'I<sup>B</sup>').replace(/O/g, 'i');
  P.addUnit({
    id: 'codominance', title: 'Codominance and multiple alleles', mins: 10,
    blurb: 'When both alleles show, and when a gene has more than two alleles. ABO blood groups use both.',
    recap: 'In complete dominance, one allele hides the other. In codominance, both alleles are fully expressed in a heterozygote: a roan cow (CᴿCᵂ) has both red and white hairs. In incomplete dominance the heterozygote is a blend, such as pink snapdragons. Some genes have more than two alleles in the population: multiple alleles. The ABO blood group gene has three: Iᴬ and Iᴮ are codominant, and both are dominant to i. Each person still carries only two.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Codominance: both show.</h2>'), C(3, '<p>Cattle: CᴿCᴿ red, CᵂCᵂ white, CᴿCᵂ roan, with red and white hairs mixed.</p>'), C(8, '<p>Neither allele is hidden. That is the difference from complete dominance.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const s = W * 0.13, cs = (2 * s) / 6;
          const cow = (x, cols, lab, al) => { a.box(x - s - 3, H * 0.34 - 3, 2 * s + 4, 4 * cs + 4, { stroke: c.line, alpha: al }); for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) a.box(x - s + i * cs, H * 0.34 + j * cs, cs - 2, cs - 2, { fill: cols[(i + j) % cols.length], stroke: false, alpha: al }); a.text(lab, x, H * 0.34 + 4 * cs + 22, { align: 'center', font: 'head', alpha: al }); };
          cow(W * 0.18, [c.pen], 'red', a.seg(a.p, 0.05, 0.15)); cow(W * 0.5, [c.pen, c.paper], 'roan', a.seg(a.p, 0.35, 0.45)); cow(W * 0.82, [c.paper], 'white', a.seg(a.p, 0.15, 0.25));
        } },
      { dur: 13, card: [C(0, '<h2>Multiple alleles: ABO blood groups</h2>'), C(3, '<p>Three alleles in the population: Iᴬ, Iᴮ and i. Each person has two of them.</p>'), C(8, '<p>Iᴬ and Iᴮ are codominant. Both are dominant to i.</p>')],
        board: [L(0.5, 'I<sup>A</sup>I<sup>A</sup> or I<sup>A</sup>i → group A'), L(2.5, 'I<sup>B</sup>I<sup>B</sup> or I<sup>B</sup>i → group B'), L(4.5, 'I<sup>A</sup>I<sup>B</sup> → group AB', 'codominant', { hl: true }), L(6.5, 'ii → group O', 'recessive')] },
      { dur: 12, card: [C(0, '<h2>A favourite exam cross</h2>'), C(3, '<p>Group A (Iᴬi) × group B (Iᴮi). Their children can be any of the four blood groups.</p>')],
        board: [L(0.5, 'gametes: I<sup>A</sup>, i and I<sup>B</sup>, i'), L(3, 'I<sup>A</sup>I<sup>B</sup> (AB), I<sup>A</sup>i (A), I<sup>B</sup>i (B), ii (O)'), L(6, '1 : 1 : 1 : 1', '', { hl: true })] },
    ],
    example: {
      problem: 'A man with blood group A (Iᴬi) and a woman with blood group B (Iᴮi) have a child. Find the probability the child has blood group O.',
      steps: [
        { m: 'Gametes: man Iᴬ or i; woman Iᴮ or i.', note: 'gametes' },
        { m: Bio.punnett(['I<sup>B</sup>', 'i'], ['I<sup>A</sup>', 'i'], (r, c) => (r + c).replace('ii', 'ii')), note: 'square' },
        { m: 'Children: IᴬIᴮ (AB), Iᴬi (A), Iᴮi (B), ii (O).', note: 'genotypes' },
        { m: 'Group O is ii: 1 of 4, so 1/4 or 25%.', note: 'answer' },
      ],
    },
    faded() { return bloodGen()(); },
    grades: 'AAMMM',
    gens: [
      P.terms([['codominance', 'Both alleles are fully expressed in a heterozygote, e.g. roan cattle, or blood group AB.'], ['incomplete dominance', 'The heterozygote has a blend of the two phenotypes, e.g. pink snapdragons from red and white.'], ['multiple alleles', 'A gene with more than two alleles in the population, e.g. the ABO blood group gene.'], ['complete dominance', 'One allele completely hides the other in a heterozygote.']]),
      bloodGen(),
      P.bank([
        { q: 'A red-flowered and a white-flowered snapdragon produce all pink offspring. What does this show?', a: 'Incomplete dominance: the heterozygote is a blend', why: 'Pink is in between. In codominance you would see both red and white.', w: [['Codominance', 'Codominance shows both colours, not a blend.'], ['Complete dominance', 'Then the offspring would be red or white.'], ['Multiple alleles', 'Only two alleles are involved.']] },
        { q: 'Why is blood group AB an example of codominance?', a: 'Both the A and the B antigens are made: neither allele is hidden', why: 'Both alleles are fully expressed.', w: [['Because AB is a blend of A and B', 'It is not a blend; both are fully present.'], ['Because O is recessive', 'True, but that is about i.'], ['Because there are three alleles', 'That is multiple alleles, a different idea.']] },
        { q: 'How many ABO alleles can one person carry?', a: 'Two', why: 'There are three alleles in the population, but each person has only two copies of the gene.', w: [['Three', 'Three exist in the population.'], ['One', 'Body cells have two copies of each gene.'], ['Four', 'No.']] },
        { q: 'Two roan cattle (CᴿCᵂ) are crossed. What is the expected phenotype ratio?', a: '1 red : 2 roan : 1 white', why: 'With codominance, each genotype has its own phenotype, so the 1:2:1 genotype ratio is also the phenotype ratio.', w: [['3 red : 1 white', 'That is complete dominance.'], ['All roan', 'All-roan offspring come only from red × white (CᴿCᴿ × CᵂCᵂ).'], ['1 red : 1 white', 'Roan offspring are missing.']] },
      ]),
      () => { const pRed = R.pick(['red', 'roan', 'white']), pB = R.pick(['red', 'roan', 'white']); const G = { red: ['R', 'R'], roan: ['R', 'W'], white: ['W', 'W'] };
        const off = {}; for (const x of G[pRed]) for (const y of G[pB]) { const g = [x, y].sort().join(''); off[g] = (off[g] || 0) + 1; }
        const roan = (off.RW || 0) / 4;
        const lab = (s) => s.replace(/R/g, 'C<sup>R</sup>').replace(/W/g, 'C<sup>W</sup>');
        return { kind: 'num', answer: roan, prob: true, fmt: PFMT, prompt: `In cattle, coat colour is codominant: C<sup>R</sup>C<sup>R</sup> is red, C<sup>R</sup>C<sup>W</sup> is roan and C<sup>W</sup>C<sup>W</sup> is white. A ${pRed} bull is crossed with a ${pB} cow. What is the probability a calf is roan?`,
          more: { steps: [St(`Bull: ${lab(G[pRed].join(''))}. Cow: ${lab(G[pB].join(''))}.`), St('Square:', Bio.punnett(G[pB].map(lab), G[pRed].map(lab), (r, c) => lab([r.includes('R') ? 'R' : 'W', c.includes('R') ? 'R' : 'W'].sort().join('')))), St(`Roan is C<sup>R</sup>C<sup>W</sup>: ${off.RW || 0} of 4 = ${pct(roan)}.`)] }, sol: [`${off.RW || 0}/4 = ${pct(roan)}`] }; },
      P.bank([
        { q: 'A child has blood group O. Its mother is group A. Which father is impossible?', a: 'Group AB', why: 'An O child (ii) needs an i from each parent. An AB father (IᴬIᴮ) has no i.', w: [['Group O', 'An O father (ii) can give i.'], ['Group A', 'An Iᴬi father can give i.'], ['Group B', 'An Iᴮi father can give i.']] },
        { q: 'Parents are group AB and group O. Which blood groups can their children have?', a: 'A or B only', why: 'IᴬIᴮ × ii gives Iᴬi (A) or Iᴮi (B): never AB or O.', w: [['AB or O, like the parents', 'The children get one allele from each parent: Iᴬ or Iᴮ with i.'], ['Any of the four', 'AB and O are impossible here.'], ['Only O', 'They must get Iᴬ or Iᴮ from the AB parent.']] },
      ], { grade: 'M' }),
    ],
    tips: [
      'Use <span class="pen">superscripts</span> for codominant alleles: Cᴿ and Cᵂ, Iᴬ and Iᴮ. Capital and small letters suggest dominance, which is wrong here.',
      'Codominance: both show (roan, AB). Incomplete dominance: a blend (pink). Do not mix them up.',
      'Merit in 2025: defining complete dominance and codominance accurately, and explaining them with blood groups.',
      'Multiple alleles: three or more in the population, but only two in each person.',
    ],
    aim: {
      intro: '<div class="resource">A hospital is checking a family. The mother is blood group A and the father is blood group B. Their first child is group O. A second child has just been born.</div>',
      parts: [
        { q: 'Describe what is meant by codominance and by multiple alleles, using the ABO blood groups.', write: true, words: '40–60',
          model: [S('Multiple alleles: the ABO gene has three alleles in the population, Iᴬ, Iᴮ and i, though each person has only two.', 'multiple alleles', true), S('Codominance: Iᴬ and Iᴮ are both fully expressed when present together, giving group AB.', 'codominance', true), S('Both Iᴬ and Iᴮ are dominant to i.', 'dominance of i')],
          earns: 'Achieved: both terms defined correctly using the blood group example.',
          crit: { A: 'Multiple alleles = more than two alleles in the population (Iᴬ, Iᴮ, i); codominance = both expressed, AB.' } },
        { q: 'Explain how you can work out both parents’ genotypes from their first child.', write: true, words: '50–80',
          model: [S('A group O child is ii, so it got one i from each parent.', 'the clue', true), S('The mother is group A, so she has Iᴬ; with the i she must be Iᴬi.', 'mother'), S('The father is group B, so he has Iᴮ; with the i he must be Iᴮi.', 'father'), S('So the parents are Iᴬi × Iᴮi.', 'conclusion', true)],
          earns: 'Merit: a linked chain of reasoning from the child back to both parents.',
          crit: { M: 'Explains: O child ii → one i from each parent → mother Iᴬi, father Iᴮi.' } },
        { q: 'Discuss the probability of each blood group for the second child, and explain why the first child’s blood group does not change these chances.', write: true, words: '90–130',
          model: [S('Iᴬi × Iᴮi gives four equally likely genotypes: IᴬIᴮ, Iᴬi, Iᴮi and ii.', 'the square', true), S('So the second child has a 1/4 (25%) chance of each: AB, A, B or O.', 'probabilities', true), S('Group AB shows codominance, A and B show dominance over i, and O shows two recessive alleles, so all four groups are possible from one couple.', 'links to inheritance'), S('Each child comes from a separate fertilisation of a new egg by a new sperm, and segregation makes each gamete independently.', 'independence'), S('So the first child being O does not change the chances for the second: each child is an independent event with the same 1/4 probabilities.', 'justified conclusion', true)],
          earns: 'Excellence: the probabilities are worked out and explained, and the independence of each child is justified from how gametes and fertilisation work.',
          crit: { M: 'Gives 1/4 each for AB, A, B, O from Iᴬi × Iᴮi.', E: 'Explains the 1/4 chances with genotypes and dominance/codominance, and justifies that each fertilisation is independent so the first child does not affect the second.' } },
      ],
      up: [
        up(1, ['The mother is Iᴬi and the father is Iᴮi.'], [
          ['Show the reasoning: the O child is ii, so each parent gave an i; the mother is A and the father is B', 1, 'Right. The genotypes are correct, but Merit needs the chain of reasoning.'],
          ['Add the Punnett square for the second child', 0, 'That is part (c).'],
          ['Say O is recessive', 0, 'One link only.'],
          ['Write the phenotypes again', 0, 'They are in the resource.']]),
        up(2, ['Each blood group has a 25% chance.'], [
          ['Explain where the 25% comes from, and justify why the first child does not affect the second (each fertilisation is independent)', 1, 'Right. The probability is right, but the question also asks why the first child does not change it.'],
          ['Convert 25% to a fraction', 0, 'Same information.'],
          ['Say the second child will be different from the first', 0, 'Not necessarily, and not the reasoning asked for.'],
          ['Describe codominance again', 0, 'That was part (a).']]),
      ],
    },
  });
  function bloodGen() {
    return () => { const types = ['AO', 'BO', 'AB', 'OO', 'AA', 'BB']; const m = R.pick(types), f = R.pick(types);
      const want = R.pick(['A', 'B', 'AB', 'O']); let n = 0; for (const x of m) for (const y of f) if (bloodPhen(x + y) === want) n++;
      return { kind: 'num', answer: n / 4, prob: true, fmt: PFMT, prompt: `A mother is ${bAll(m)} and a father is ${bAll(f)}. What is the probability that their child has blood group ${want}?`,
        more: { steps: [St(`Mother’s gametes: ${bAll(m[0])} and ${bAll(m[1])}. Father’s: ${bAll(f[0])} and ${bAll(f[1])}.`), St('Square:', Bio.punnett([bAll(f[0]), bAll(f[1])], [bAll(m[0]), bAll(m[1])], (r, c, i, j) => { const g = m[i] + f[j]; return `${bAll(g)} (${bloodPhen(g)})`; })), St(`Group ${want}: ${n} of 4 = ${pct(n / 4)}.`)], trap: 'Forgetting that Iᴬi is group A and Iᴮi is group B: i is recessive.' }, sol: [`${n}/4 = ${pct(n / 4)}`] }; };
  }

  /* ======================= 14. Dihybrid crosses ======================= */
  const DI = [{ a: ['R', 'round', 'wrinkled'], b: ['Y', 'yellow', 'green'], org: 'pea seeds' }, { a: ['B', 'black', 'brown'], b: ['S', 'short hair', 'long hair'], org: 'guinea pigs' }, { a: ['T', 'tall', 'short'], b: ['P', 'purple flowers', 'white flowers'], org: 'pea plants' }];
  const gametes4 = (g) => { const [a1, a2, b1, b2] = g; return [...new Set([a1 + b1, a1 + b2, a2 + b1, a2 + b2])]; };
  function diCross(g1, g2) { const out = {}; const G1 = [g1[0] + g1[2], g1[0] + g1[3], g1[1] + g1[2], g1[1] + g1[3]], G2 = [g2[0] + g2[2], g2[0] + g2[3], g2[1] + g2[2], g2[1] + g2[3]]; for (const x of G1) for (const y of G2) { const k = (isDom(x[0] + y[0]) ? 'D' : 'r') + (isDom(x[1] + y[1]) ? 'D' : 'r'); out[k] = (out[k] || 0) + 1; } return out; }
  P.addUnit({
    id: 'dihybrid', title: 'Dihybrid crosses', mins: 11,
    blurb: 'Two genes at once. Four kinds of gamete, a 16-square grid, and the 9:3:3:1 and 1:1:1:1 ratios.',
    recap: 'A dihybrid cross follows two genes at once. If the genes are on different chromosomes (unlinked), independent assortment means each allele of one gene can go into a gamete with either allele of the other. So RrYy makes four kinds of gamete in equal numbers: RY, Ry, rY, ry. RrYy × RrYy gives a 16-square Punnett square and a 9:3:3:1 phenotype ratio. The test cross RrYy × rryy gives 1:1:1:1.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Four gametes from RrYy</h2>'), C(3, '<p>Each gamete gets one allele of each gene: R or r, and Y or y.</p>'), C(7.5, '<p>Unlinked genes assort independently: RY, Ry, rY, ry, all equally likely.</p>')],
        board: [L(0.5, 'R with Y → <b>RY</b>'), L(2, 'R with y → <b>Ry</b>'), L(3.5, 'r with Y → <b>rY</b>'), L(5, 'r with y → <b>ry</b>'), L(7, 'each 1/4 (FOIL: first, outer, inner, last)', '', { hl: true })] },
      { dur: 15, card: [C(0, '<h2>RrYy × RrYy: 16 squares</h2>'), C(4, '<p>9 round yellow : 3 round green : 3 wrinkled yellow : 1 wrinkled green.</p>'), C(9.5, '<p>Shortcut: each gene alone gives 3:1. Multiply: (3:1) × (3:1) = 9:3:3:1.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const s = Math.min(W * 0.17, H * 0.17), x0 = W * 0.5 - 2 * s, y0 = H * 0.12;
          const gs = ['RY', 'Ry', 'rY', 'ry'];
          gs.forEach((g, k) => { a.text(g, x0 + (k + 0.5) * s, y0 - 10, { align: 'center', size: 0.7, col: c.pen }); a.text(g, x0 - 16, y0 + (k + 0.5) * s, { align: 'center', size: 0.7, col: c.pen }); });
          let k = 0;
          for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const g = gs[i] + gs[j]; const R1 = /R/.test(g[0] + g[2]), Y1 = /Y/.test(g[1] + g[3]); const col = R1 && Y1 ? c.c3 : R1 ? c.c1 : Y1 ? c.c2 : c.c4; a.box(x0 + j * s, y0 + i * s, s - 2, s - 2, { fill: col, stroke: false, alpha: 0.75 * a.seg(a.p, 0.1 + k * 0.02, 0.15 + k * 0.02) }); k++; }
          a.text('9 : 3 : 3 : 1', W * 0.5, H * 0.94, { align: 'center', font: 'pen', col: c.pen, alpha: a.seg(a.p, 0.6, 0.7) });
        } },
      { dur: 11, card: [C(0, '<h2>The dihybrid test cross</h2>'), C(3, '<p>RrYy × rryy: the tester only gives ry, so each offspring shows the gamete the other parent gave.</p>')],
        board: [L(0.5, 'RY, Ry, rY, ry each × ry'), L(3, '1 round yellow : 1 round green : 1 wrinkled yellow : 1 wrinkled green', '', { hl: true }), L(6.5, '<span class="muted">a different ratio suggests the genes are linked (next topic)</span>')] },
    ],
    example: {
      problem: 'In pea seeds, round (R) is dominant to wrinkled (r) and yellow (Y) is dominant to green (y). The genes are unlinked. Find the expected phenotype ratio from RrYy × rryy.',
      steps: [
        { m: 'Gametes of RrYy: RY, Ry, rY, ry. Gametes of rryy: ry only.', note: 'gametes' },
        { m: 'Offspring: RrYy, Rryy, rrYy, rryy.', note: 'combine' },
        { m: 'Phenotypes: round yellow, round green, wrinkled yellow, wrinkled green.', note: 'phenotypes' },
        { m: 'Ratio 1 : 1 : 1 : 1 (25% each).', note: 'ratio' },
      ],
    },
    faded() { const d = R.pick(DI); const g = R.pick([[d.a[0], d.a[0].toLowerCase(), d.b[0], d.b[0].toLowerCase()], [d.a[0], d.a[0], d.b[0], d.b[0].toLowerCase()], [d.a[0], d.a[0].toLowerCase(), d.b[0].toLowerCase(), d.b[0].toLowerCase()]]);
      const gs = gametes4(g);
      return P.mcq({ prompt: `What gametes can a ${g.join('')} organism make? (The genes are unlinked.)`, more: { steps: [St('Each gamete gets one allele of each gene.'), St(`Pair each allele of the first gene (${g[0]} or ${g[1]}) with each allele of the second (${g[2]} or ${g[3]}).`), St(`Gametes: ${gs.join(', ')}.`)], trap: 'Putting two alleles of the same gene in one gamete.' } },
        P.uniq([{ t: gs.join(', '), ok: true }, { t: `${g[0]}${g[1]}, ${g[2]}${g[3]}`, why: 'A gamete gets one allele of each gene, not both alleles of one gene.' }, { t: g.join(''), why: 'That is the genotype, with four alleles. Gametes have two.' }, { t: [...new Set([g[0] + g[2], g[1] + g[3]])].join(', '), why: 'Independent assortment also gives the other combinations.' }])); },
    grades: 'MAAM',
    gens: [
      () => { const d = R.pick(DI); const A = d.a[0], a = A.toLowerCase(), B = d.b[0], b = B.toLowerCase();
        const g1 = R.pick([[A, a, B, b], [A, A, B, b], [A, a, B, B]]), g2 = R.pick([[A, a, B, b], [a, a, b, b], [A, a, b, b]]);
        const off = diCross(g1, g2); const want = R.pick(['DD', 'Dr', 'rD', 'rr']); const n = off[want] || 0;
        const name = (k) => `${k[0] === 'D' ? d.a[1] : d.a[2]} and ${k[1] === 'D' ? d.b[1] : d.b[2]}`;
        return { kind: 'num', answer: n / 16, prob: true, fmt: PFMT, prompt: `In ${d.org}, ${d.a[1]} (${A}) is dominant to ${d.a[2]} (${a}), and ${d.b[1]} (${B}) is dominant to ${d.b[2]} (${b}). The genes are unlinked. ${g1.join('')} × ${g2.join('')}. What proportion of offspring are expected to be ${name(want)}?`,
          more: { steps: [St('Shortcut: work out each gene on its own, then multiply (independent assortment).'), St(`Gene 1, ${g1[0]}${g1[1]} × ${g2[0]}${g2[1]}: chance of ${want[0] === 'D' ? d.a[1] : d.a[2]} = ${fracTxt(Object.values(cross([g1[0], g1[1]], [g2[0], g2[1]])).length && Object.entries(cross([g1[0], g1[1]], [g2[0], g2[1]])).filter(([g]) => isDom(g) === (want[0] === 'D')).reduce((s, [, c]) => s + c, 0), 4)}.`), St(`Gene 2, ${g1[2]}${g1[3]} × ${g2[2]}${g2[3]}: chance of ${want[1] === 'D' ? d.b[1] : d.b[2]} = ${fracTxt(Object.entries(cross([g1[2], g1[3]], [g2[2], g2[3]])).filter(([g]) => isDom(g) === (want[1] === 'D')).reduce((s, [, c]) => s + c, 0), 4)}.`), St(`Multiply: ${fracTxt(n, 16)} = ${pct(n / 16)}.`)] }, sol: [`${fracTxt(n, 16)} = ${pct(n / 16)}`] }; },
      P.bank([
        { q: 'What is the expected phenotype ratio from AaBb × AaBb (unlinked genes, complete dominance)?', a: '9 : 3 : 3 : 1', why: 'Each gene gives 3:1; multiplied: 9:3:3:1.', w: [['3 : 1', 'That is one gene.'], ['1 : 1 : 1 : 1', 'That is the test cross AaBb × aabb.'], ['1 : 2 : 1', 'That is one gene’s genotype ratio.']] },
        { q: 'What is the expected phenotype ratio from AaBb × aabb (unlinked genes)?', a: '1 : 1 : 1 : 1', why: 'Four equally likely gametes from AaBb, each paired with ab.', w: [['9 : 3 : 3 : 1', 'That is AaBb × AaBb.'], ['3 : 1', 'That is one gene.'], ['All the same', 'The test cross shows all four combinations.']] },
        { q: 'Why does an AaBb organism make four types of gamete in equal numbers?', a: 'The genes are on different chromosomes, which line up independently in meiosis', why: 'Independent assortment: A can go with B or with b, equally likely.', w: [['Because of crossing over', 'Unlinked genes assort independently even without crossing over.'], ['Because A and B are dominant', 'Dominance does not affect gamete formation.'], ['Because of mutation', 'Mutation is rare.']] },
      ]),
      () => { const n = R.pick([160, 320, 480, 640]); const k = R.pick([[9, 'both dominant traits'], [3, 'the first dominant and the second recessive trait'], [1, 'both recessive traits']]);
        return { kind: 'num', answer: (k[0] / 16) * n, prompt: `AaBb × AaBb (unlinked genes) produces ${n} offspring. How many are expected to show ${k[1]}?`, fmt: 'Give a whole number.',
          more: { steps: [St('The phenotype ratio is 9 : 3 : 3 : 1, out of 16.'), St(`${k[1]}: ${k[0]}/16.`), St(`${k[0]}/16 × ${n} = ${(k[0] / 16) * n}.`)] }, sol: [`${k[0]}/16 × ${n} = ${(k[0] / 16) * n}`] }; },
      P.chain([
        { q: 'Put the steps in order: how to solve a dihybrid cross.', steps: ['Write a key for both genes', 'Write each parent’s genotype', 'List each parent’s gametes (one allele of each gene)', 'Fill in the Punnett square', 'Count the phenotypes and write the ratio'] },
      ]),
    ],
    tips: [
      'Gametes carry <span class="pen">one allele of each gene</span>: RY, Ry, rY, ry. Never RR or Yy in a gamete.',
      'Know the two key ratios: 9:3:3:1 for AaBb × AaBb, and 1:1:1:1 for AaBb × aabb.',
      'Shortcut for probabilities: work out each gene alone, then multiply.',
      'Achieved in 2025: stating the phenotype ratio for the F2 generation accurately.',
    ],
    aim: {
      intro: '<div class="resource">In guinea pigs, black fur (B) is dominant to brown (b) and short hair (S) is dominant to long hair (s). The genes are on different chromosomes. A black, short-haired guinea pig of genotype BbSs is crossed with a brown, long-haired one (bbss).</div>',
      parts: [
        { q: 'List the gametes each parent can make, and give the expected phenotype ratio of the offspring.', write: true, words: '30–50',
          model: [S('BbSs makes four gametes: BS, Bs, bS and bs.', 'gametes 1', true), S('bbss makes only bs.', 'gametes 2'), S('Offspring: 1 black short : 1 black long : 1 brown short : 1 brown long.', 'ratio', true)],
          earns: 'Achieved: correct gametes and the 1:1:1:1 ratio.',
          crit: { A: 'Gametes BS, Bs, bS, bs and bs; ratio 1:1:1:1 with phenotypes.' } },
        { q: 'Explain why the BbSs parent makes four kinds of gamete in equal numbers.', write: true, words: '50–80',
          model: [S('The two genes are on different chromosomes.', 'unlinked', true), S('In meiosis, each pair of homologous chromosomes lines up independently of the other (independent assortment).', 'mechanism', true), S('So the B or b allele can go into a gamete with either S or s, with equal chance.', 'consequence'), S('This gives BS, Bs, bS and bs, each 1/4 of the gametes.', 'conclusion')],
          earns: 'Merit: independent assortment is used to explain the four equal gametes.',
          crit: { M: 'Explains: genes on different chromosomes → independent assortment in meiosis → each allele combines equally with either allele of the other gene.' } },
        { q: 'The breeder gets 40 offspring: 18 black short, 2 black long, 3 brown short and 17 brown long. Discuss what these results suggest about the genes.', write: true, words: '90–130',
          model: [S('If the genes were unlinked, a 1:1:1:1 ratio would give about 10 of each.', 'expected', true), S('Instead, most offspring are black short or brown long, the same combinations as the parents (parental types).', 'reads the data'), S('This suggests the B and S alleles are linked: on the same chromosome, so they are usually inherited together.', 'conclusion', true), S('The few black long and brown short offspring are recombinants, made when crossing over separated the linked alleles in meiosis.', 'explains the minority', true), S('So the statement that the genes are on different chromosomes looks wrong; the data are much better explained by linked genes that are fairly close together.', 'justified judgement')],
          earns: 'Excellence: the data are compared with the expected ratio and explained with linkage and crossing over, leading to a justified conclusion.',
          crit: { M: 'States the results do not fit 1:1:1:1 and suggests the genes are linked.', E: 'Compares with expected 10 each, identifies parental and recombinant types, explains linkage and crossing over, and concludes with justification.' } },
      ],
      up: [
        up(1, ['Because of independent assortment.'], [
          ['Explain it: the genes are on different chromosomes that line up independently, so B or b can go with S or s equally', 1, 'Right. The term is correct, but Merit needs the explanation.'],
          ['Draw the Punnett square', 0, 'The square uses the gametes; it does not explain them.'],
          ['Say there are four gametes', 0, 'That restates part (a).'],
          ['Mention crossing over', 0, 'Not needed for unlinked genes.']]),
        up(2, ['The results are not 1:1:1:1, so the genes might be linked.'], [
          ['Use the numbers (about 10 each expected), identify parental and recombinant types, and explain both with linkage and crossing over', 1, 'Right. The idea is right, but Excellence uses the data and explains why each group appears.'],
          ['Repeat the gametes', 0, 'Not the missing reasoning.'],
          ['Say the breeder made a mistake', 0, 'Linkage explains the data.'],
          ['Calculate 40 ÷ 4', 0, 'A start, but the explanation is missing.']]),
      ],
    },
  });

  /* ======================= 15. Linked genes and sex linkage ======================= */
  P.addUnit({
    id: 'linkage', title: 'Linked genes, crossing over and sex linkage', mins: 11,
    blurb: 'Genes close together travel together, unless crossing over splits them. Genes on X behave differently in males.',
    recap: 'Linked genes are close together on the same chromosome, so they are usually inherited together and do not assort independently. Crossing over can separate them, making recombinant gametes; the closer the genes, the less often this happens, so parental types are common and recombinants rare. Unlinked genes are on different chromosomes, or far apart on the same one. Sex-linked genes are on the X chromosome. Males (XY) have one copy, so a recessive X-linked allele always shows in a male; females (XX) need two copies.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Linked: on the same chromosome, close together.</h2>'), C(3, '<p>A and B ride together into the same gamete: AB and ab are common.</p>'), C(8, '<p>Crossing over between them sometimes makes Ab and aB: recombinants, the rare ones.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const h = H * 0.62, y = H * 0.16, sw = a.seg(a.p, 0.45, 0.6);
          chromo(a, W * 0.38, y, h, sw > 0.5 ? [[0, c.c1], [0.5, c.c2]] : [[0, c.c1]], 16); chromo(a, W * 0.62, y, h, sw > 0.5 ? [[0, c.c2], [0.5, c.c1]] : [[0, c.c2]], 16);
          a.text('A', W * 0.3, y + h * 0.25, { font: 'head' }); a.text(sw > 0.5 ? 'b' : 'B', W * 0.3, y + h * 0.75, { font: 'head' });
          a.text('a', W * 0.68, y + h * 0.25, { font: 'head' }); a.text(sw > 0.5 ? 'B' : 'b', W * 0.68, y + h * 0.75, { font: 'head' });
          a.text(sw > 0.5 ? 'recombinants: Ab and aB' : 'parental: AB and ab', W * 0.5, H * 0.92, { align: 'center', font: 'pen', col: c.pen });
        } },
      { dur: 12, card: [C(0, '<h2>Unlinked does not always mean different chromosomes.</h2>'), C(3, '<p>Genes far apart on one chromosome cross over so often they behave as if unlinked.</p>'), C(7.5, '<p>The 2025 examiners noted many candidates missed this.</p>')],
        board: [L(0.5, 'close together → linked → mostly parental types'), L(3, 'far apart → crossing over in many meioses → close to 1:1:1:1 (at most 50% recombinants)'), L(6, 'different chromosomes → unlinked → 1:1:1:1', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>Sex linkage</h2>'), C(3, '<p>Red–green colour blindness: recessive allele Xᵇ on the X chromosome. The Y has no copy.</p>'), C(8, '<p>A man with Xᵇ is colour blind. A woman needs XᵇXᵇ. Carrier mothers pass it to half their sons.</p>')],
        board: [L(0.5, 'X<sup>B</sup>X<sup>b</sup> (carrier) × X<sup>B</sup>Y (normal)'), L(3, 'daughters: X<sup>B</sup>X<sup>B</sup>, X<sup>B</sup>X<sup>b</sup> → all normal vision'), L(6, 'sons: X<sup>B</sup>Y normal, X<sup>b</sup>Y colour blind', '1/2 of sons', { hl: true })] },
    ],
    example: {
      problem: 'A test cross AaBb × aabb gives 45 AaBb, 43 aabb, 6 Aabb and 6 aaBb. Explain what this shows.',
      steps: [
        { m: 'Unlinked genes would give about 25 of each (1:1:1:1).', note: 'expected' },
        { m: 'Most offspring (88 of 100) are AaBb or aabb: the parental combinations.', note: 'read it' },
        { m: 'So A and B are linked: close together on the same chromosome, and usually inherited together.', note: 'conclusion' },
        { m: 'The 12 Aabb and aaBb are recombinants, made by crossing over between the two genes in meiosis.', note: 'the rare ones' },
      ],
    },
    faded() { return sexGen()(); },
    grades: 'AAMMMM',
    gens: [
      P.terms([['linked genes', 'Genes close together on the same chromosome, usually inherited together.'], ['recombinant', 'An offspring or gamete with a new combination of alleles, made by crossing over.'], ['parental type', 'An offspring with the same combination of alleles as a parent’s chromosome.'], ['sex linkage', 'A gene carried on the X chromosome, so it is inherited differently in males and females.'], ['carrier', 'A heterozygous individual with a recessive allele that does not show.'], ['unlinked genes', 'Genes on different chromosomes, or far apart on the same chromosome, that assort independently.']]),
      sexGen(),
      () => { const tot = 100, rec = R.pick([4, 8, 12, 16, 20, 30, 50]); const par = tot - rec; const p1 = Math.round(par / 2) + R.int(-2, 2), p2 = par - p1, r1 = Math.round(rec / 2), r2 = rec - r1;
        const linked = rec < 40;
        return P.mcq({ prompt: `A test cross AaBb × aabb gives: AaBb ${p1}, aabb ${p2}, Aabb ${r1}, aaBb ${r2}. What do these results show?`, more: { steps: [St('Unlinked genes would give about 25 of each.'), St(linked ? `Here the parental types (AaBb, aabb) are ${par} of 100: far more than half. A and B are linked; Aabb and aaBb are recombinants from crossing over.` : 'Here all four are about equal: 1:1:1:1, so the genes are unlinked (different chromosomes, or far apart on one).')] } },
          [{ t: linked ? 'A and B are linked; the small groups are recombinants from crossing over' : 'A and B are unlinked: about 1:1:1:1', ok: true }, { t: linked ? 'A and B are unlinked: about 1:1:1:1' : 'A and B are linked; the small groups are recombinants', why: linked ? 'The groups are far from equal.' : 'The four groups are about equal, so there is no sign of linkage.' }, { t: 'A mutation has occurred in most offspring', why: 'Mutation is rare, so it cannot explain results in many offspring.' }, { t: 'The genes are sex-linked', why: 'Nothing in the data involves the sex of offspring.' }]); },
      P.bank([
        { q: 'Why are recombinants less common for genes that are very close together?', a: 'Crossing over is less likely to happen in the short stretch between them', why: 'The further apart two genes are, the more likely a crossover falls between them.', w: [['Close genes cannot cross over at all', 'They can, just rarely.'], ['Close genes are always dominant', 'Dominance is unrelated.'], ['Recombinants die', 'They survive; they are just rarely made.']] },
        { q: 'Why are red–green colour-blind men much more common than women?', a: 'Men have one X, so one recessive allele is enough; women need it on both X chromosomes', why: 'The Y chromosome has no matching allele to mask it.', w: [['The allele is on the Y chromosome', 'It is on the X.'], ['Women have a dominant allele on the Y', 'Women have no Y.'], ['The allele is dominant in men', 'Dominance does not change; men just have one copy.']] },
        { q: 'Can a colour-blind father pass colour blindness to his son?', a: 'No: he gives his son a Y chromosome, not his X', why: 'Sons get the X from their mother.', w: [['Yes, half the time', 'Sons never get the father’s X.'], ['Yes, always', 'Sons get the Y from the father.'], ['Only if the son is a carrier', 'Males cannot be carriers of X-linked alleles.']] },
        { q: 'Which statement about unlinked genes is correct?', a: 'They are on different chromosomes, or far apart on the same chromosome', why: 'The 2025 report noted candidates often forgot the second case.', w: [['They are always on different chromosomes', 'Far apart on one chromosome also counts.'], ['They are never separated by crossing over', 'That is closer to linked genes.'], ['They are on the X chromosome', 'That is sex linkage.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: how a recombinant gamete is made from linked genes.', steps: ['Homologous chromosomes carrying A–B and a–b pair up in meiosis', 'Non-sister chromatids cross over between the two genes', 'Sections are swapped, giving A–b and a–B chromatids', 'The chromatids separate into different gametes', 'Some gametes carry a new combination: Ab or aB'] },
      ]),
      P.bank([
        { q: 'A woman with normal vision has a colour-blind son. What is her genotype?', a: 'XᴮXᵇ: a carrier', why: 'The son’s X (with Xᵇ) came from her. She sees normally, so she also has Xᴮ.', w: [['XᴮXᴮ', 'Then she could not give Xᵇ.'], ['XᵇXᵇ', 'Then she would be colour blind.'], ['XᵇY', 'That is a male genotype.']] },
      ], { grade: 'M' }),
    ],
    tips: [
      'Linked: close on the <span class="pen">same chromosome</span>. Unlinked: different chromosomes <b>or far apart on the same one</b>. The 2025 report named missing the second case as a Not Achieved error.',
      'In linkage data, the big groups are parental types and the small ones are recombinants from crossing over.',
      'Write sex-linked genotypes with X and Y: XᴮXᵇ, XᵇY. Males cannot be carriers.',
      'Excellence in 2025 discussed the ratios for linked and unlinked genes and the frequency of crossing over.',
    ],
    aim: {
      intro: '<div class="resource">In fruit flies, the genes for body colour (grey G, black g) and wing shape (normal W, vestigial w) are on the same chromosome. A GgWw fly, with G and W on one chromosome and g and w on the other, is test-crossed with ggww. Results: 415 grey normal, 405 black vestigial, 92 grey vestigial, 88 black normal.</div>',
      parts: [
        { q: 'Describe what linked genes are, and identify the parental and recombinant offspring.', write: true, words: '30–60',
          model: [S('Linked genes are genes close together on the same chromosome, which are usually inherited together.', 'definition', true), S('Parental types: grey normal and black vestigial.', 'parental', true), S('Recombinants: grey vestigial and black normal.', 'recombinant', true)],
          earns: 'Achieved: a correct definition, and both groups identified.',
          crit: { A: 'Linked = close on same chromosome, inherited together; parental = grey normal and black vestigial; recombinant = grey vestigial and black normal.' } },
        { q: 'Explain how the recombinant flies were produced.', write: true, words: '60–90',
          model: [S('In meiosis in the GgWw parent, homologous chromosomes (G–W and g–w) pair up.', 'pairing', true), S('Crossing over happens between the two genes: non-sister chromatids swap sections.', 'crossing over', true), S('This makes chromatids with new combinations, G–w and g–W.', 'new combinations'), S('Gametes with these combinations, fertilised by gw from the ggww parent, give grey vestigial and black normal flies.', 'linked to the offspring', true)],
          earns: 'Merit: crossing over is linked step by step to the recombinant offspring.',
          crit: { M: 'Explains pairing, crossing over between the genes, new allele combinations on chromatids, and recombinant gametes → recombinant offspring.' } },
        { q: 'Discuss why the four groups are not in a 1:1:1:1 ratio, and what the results suggest about how far apart the two genes are.', write: true, words: '90–130',
          model: [S('If the genes were unlinked, independent assortment would give about 250 of each.', 'expected', true), S('Because they are linked, G and W (and g and w) are usually inherited together, so parental types are about 820 of 1000.', 'uses the data'), S('Recombinants form only when crossing over happens between the two genes, which is fairly rare: 180 of 1000, or 18%.', 'calculates', true), S('The further apart two genes are, the more likely a crossover between them, so an 18% recombinant rate suggests the genes are fairly close, but not right next to each other.', 'distance', true), S('If the genes were very far apart, crossing over would happen so often that the result would approach 1:1:1:1.', 'justified comparison')],
          earns: 'Excellence: the data are used to show linkage, the recombinant frequency is calculated, and it is linked to distance between the genes with a justified comparison.',
          crit: { M: 'Explains linkage means parental types are more common than recombinants.', E: 'Compares with 250 each, calculates ~18% recombinants, links frequency of crossing over to distance between genes, and compares with what very distant/unlinked genes would show.' } },
      ],
      up: [
        up(1, ['The recombinants were produced by crossing over.'], [
          ['Explain the steps: pairing in meiosis, a crossover between the genes, G–w and g–W chromatids, and those gametes giving the recombinant flies', 1, 'Right. The term is right; Merit explains how it leads to these flies.'],
          ['Define linked genes again', 0, 'That was part (a).'],
          ['Give the numbers', 0, 'Numbers belong in part (c).'],
          ['Say it is a mutation', 0, 'Wrong mechanism.']]),
        up(2, ['They are linked, so the parental types are more common. The genes are close together.'], [
          ['Use the data: compare with 250 each, calculate the recombinant percentage, and justify how that shows the distance between the genes', 1, 'Right. The claims are right but not supported. Excellence uses the data to justify them.'],
          ['Say there are more flies in two groups', 0, 'True, but not discussion.'],
          ['Define crossing over', 0, 'Part (b) covered it.'],
          ['Say the fruit flies are mutants', 0, 'Not relevant.']]),
      ],
    },
  });
  function sexGen() {
    return () => { const mum = R.pick(['BB', 'Bb', 'bb']), dad = R.pick(['B', 'b']); const who = R.pick(['son', 'daughter', 'child']);
      const X = (a) => `X<sup>${a}</sup>`; const mg = mum.split(''), kids = [];
      for (const m of mg) { kids.push({ sex: 'daughter', g: [m, dad], cb: m === 'b' && dad === 'b' }); kids.push({ sex: 'son', g: [m], cb: m === 'b' }); }
      const pool = who === 'child' ? kids : kids.filter((k) => k.sex === who); const ans = pool.filter((k) => k.cb).length / pool.length;
      return { kind: 'num', answer: ans, prob: true, fmt: PFMT, prompt: `Red–green colour blindness is caused by a recessive allele on the X chromosome (X<sup>b</sup>). A mother is ${X(mum[0])}${X(mum[1])} and a father is ${X(dad)}Y. What is the probability that a ${who === 'child' ? 'child' : who} of theirs is colour blind?`,
        more: { steps: [St(`Mother’s gametes: ${X(mum[0])} or ${X(mum[1])}. Father’s: ${X(dad)} (gives daughters) or Y (gives sons).`), St('Square:', Bio.punnett([X(dad), 'Y'], [X(mum[0]), X(mum[1])], (r, c) => (c === 'Y' ? r + 'Y' : r + c))), St(`${who === 'child' ? 'Of all four children' : `Look only at the ${who}s`}: ${pool.filter((k) => k.cb).length} of ${pool.length} colour blind = ${pct(ans)}.`)], trap: who === 'son' ? 'Using all four squares. “A son” means only the sons count.' : 'A daughter needs X<sup>b</sup> from both parents to be colour blind.' }, sol: [`${pool.filter((k) => k.cb).length}/${pool.length} = ${pct(ans)}`] }; };
  }

  /* ======================= 16. Gene pools and natural selection ======================= */
  P.addUnit({
    id: 'selection', title: 'Gene pools and natural selection', mins: 10,
    blurb: 'Variation, selection pressure, survival, reproduction, allele frequency. Five links, every time.',
    recap: 'A gene pool is all the alleles in a population. Allele frequency is how common one allele is, as a proportion of all copies of that gene. Natural selection changes allele frequency: there is variation; a selection pressure (such as a predator or a poison) means individuals with a helpful phenotype survive and reproduce more; they pass on the alleles behind it; so those alleles become more common over generations. Selection acts on phenotypes, but it changes the frequency of alleles.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Snails on dark rocks</h2>'), C(3, '<p>Some snails are dark, some pale. Birds spot pale snails on dark rocks more easily.</p>'), C(8, '<p>Dark snails survive and breed more. Over generations, the dark allele becomes more common.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const gen = Math.min(3, Math.floor(a.p * 4));
          a.round(W * 0.04, H * 0.06, W * 0.92, H * 0.76, 14, { fill: c.ink, stroke: false, alpha: 0.85 });
          const n = 24, dark = [8, 13, 18, 22][gen];
          for (let k = 0; k < n; k++) { const x = W * 0.1 + (k % 8) * W * 0.11, y = H * 0.18 + Math.floor(k / 8) * H * 0.2; a.ellipse(x, y, 10, 7, { fill: k < dark ? c.muted : c.paper, stroke: c.paper, lw: 1 }); }
          a.text(`generation ${gen + 1}: ${Math.round((dark / n) * 100)}% dark`, W * 0.5, H * 0.92, { align: 'center', font: 'pen', col: c.pen });
        } },
      { dur: 13, card: [C(0, '<h2>The five links examiners look for</h2>')],
        board: [L(0.5, '1. <b>variation</b>: different phenotypes (from different alleles)'), L(2.5, '2. <b>selection pressure</b>: e.g. predators, disease, poison'), L(4.5, '3. helpful phenotype → <b>survive and reproduce</b> more'), L(6.5, '4. they <b>pass on</b> their alleles'), L(8.5, '5. <b>allele frequency</b> of the helpful allele rises', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>Allele frequency, worked out</h2>'), C(3, '<p>100 snails: 36 DD, 48 Dd, 16 dd. That is 200 copies of the gene.</p>')],
        board: [L(0.5, 'D alleles: 2 × 36 + 48 = 120'), L(3, 'frequency of D = 120 ÷ 200 = 0.6'), L(5.5, 'frequency of d = 1 − 0.6 = 0.4', '', { hl: true })] },
    ],
    example: {
      problem: 'Rats exposed to the poison warfarin over many years became mostly resistant. Explain how natural selection caused this.',
      steps: [
        { m: 'There was variation: a few rats had an allele that made them resistant to warfarin.', note: 'variation' },
        { m: 'Warfarin was the selection pressure: non-resistant rats died.', note: 'pressure' },
        { m: 'Resistant rats survived and reproduced more.', note: 'survive and reproduce' },
        { m: 'They passed the resistance allele to their offspring.', note: 'inheritance' },
        { m: 'Over many generations, the frequency of the resistance allele in the gene pool increased.', note: 'allele frequency' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how antibiotic resistance spreads in bacteria.', steps: ['Some bacteria have an allele for resistance', 'An antibiotic is used: the selection pressure', 'Non-resistant bacteria die; resistant ones survive', 'Resistant bacteria reproduce and pass on the allele', 'The frequency of the resistance allele increases'] }], 2)(); },
    grades: 'AAMME',
    gens: [
      P.terms([['gene pool', 'All the alleles of all the genes in a population.'], ['allele frequency', 'The proportion of all copies of a gene in a population that are one particular allele.'], ['natural selection', 'Individuals with helpful phenotypes survive and reproduce more, so their alleles become more common.'], ['selection pressure', 'A factor in the environment, such as a predator or disease, that affects which individuals survive.'], ['population', 'A group of the same species living and breeding in one area.'], ['adaptation', 'A feature that helps an organism survive and reproduce in its environment.']]),
      () => { const AA = R.int(10, 50), Aa = R.int(10, 60), aa = R.int(5, 40); const n = AA + Aa + aa; const f = (2 * AA + Aa) / (2 * n);
        return { kind: 'num', answer: f, dp: 2, tol: 0.006, prompt: `A population of ${n} plants: ${AA} are RR, ${Aa} are Rr and ${aa} are rr. What is the frequency of the R allele?`, fmt: 'Give a decimal to 2 decimal places.', wrong: [{ v: AA / n, msg: 'That is the frequency of the RR genotype. Count alleles: each RR has two R, each Rr has one.' }, { v: (AA + Aa) / n, msg: 'That counts plants with R, not R alleles.' }],
          more: { steps: [St(`Each plant has two alleles, so there are 2 × ${n} = ${2 * n} alleles in total.`), St(`R alleles: 2 × ${AA} (from RR) + ${Aa} (from Rr) = ${2 * AA + Aa}.`), St(`Frequency of R = ${2 * AA + Aa} ÷ ${2 * n} = ${P.f(f, 2)}.`)], trap: 'Dividing by the number of plants instead of the number of alleles.' }, sol: [`(2 × ${AA} + ${Aa}) ÷ ${2 * n} = ${P.f(f, 2)}`] }; },
      P.bank([
        { q: 'What does natural selection act on directly?', a: 'Phenotypes: the features that affect survival', why: 'Predators see colour, not alleles. But because phenotypes come from alleles, allele frequencies change.', w: [['Alleles directly', 'Selection “sees” phenotypes; alleles change as a result.'], ['Mutations as they happen', 'Mutations happen at random, not in response to need.'], ['Individuals’ wishes to survive', 'Not biology.']] },
        { q: 'A student writes: “The rats became resistant because they needed to survive the poison.” What is wrong?', a: 'Resistance alleles were already present by chance; the poison selected rats that had them', why: 'Organisms do not change because they need to. Variation comes first.', w: [['Nothing, it is correct', 'It suggests need causes the change, which is wrong.'], ['Rats cannot be resistant', 'They can and are.'], ['It should say the poison mutated the rats', 'The poison does not cause the mutation.']] },
        { q: 'Why does natural selection change a population, not an individual?', a: 'An individual’s alleles do not change; the proportions of alleles in the population change over generations', why: 'Populations evolve; individuals do not.', w: [['Individuals change their alleles during life', 'Their alleles stay the same.'], ['Only populations have phenotypes', 'Individuals have phenotypes.'], ['It changes both equally', 'Individuals do not evolve.']] },
      ]),
      P.chain([
        { q: 'Put the steps of natural selection in order.', steps: ['There is variation in a phenotype, caused by different alleles', 'A selection pressure acts on the population', 'Individuals with a helpful phenotype survive and reproduce more', 'They pass on the alleles for that phenotype', 'Over generations the allele frequency increases'] },
        { q: 'Put the steps in order: dark snails becoming common on dark rocks.', steps: ['Snails vary in shell colour', 'Birds spot pale snails on dark rocks more easily', 'More dark snails survive to breed', 'They pass on alleles for dark shells', 'The dark allele becomes more frequent in the gene pool'] },
      ]),
      P.bank([
        { q: 'Two snail populations live on dark rocks and on pale sand. Why might their allele frequencies for shell colour end up different?', a: 'Different selection pressures: on each background a different colour is better camouflaged', why: 'The 2025 exam asked about selection pressures in two environments.', w: [['They mutate in different directions on purpose', 'Mutation is random.'], ['Snails choose their colour to match', 'They cannot choose.'], ['Allele frequency cannot differ between populations', 'It can and often does.']] },
        { q: 'Why does natural selection take many generations to change allele frequencies?', a: 'Helpful alleles spread only through more surviving offspring, a little more each generation', why: 'Each generation shifts the frequency a little; it adds up over time.', w: [['Because mutations are slow', 'Selection acts on existing variation.'], ['Because animals live a long time', 'Lifespan matters only through generation time.'], ['It does not; it happens in one generation', 'Usually it takes many.']] },
      ]),
    ],
    tips: [
      'Use all five links: <span class="pen">variation → selection pressure → survive and reproduce → pass on alleles → allele frequency changes</span>.',
      'End with allele frequency, not “the species adapts”. Merit in 2025 explained natural selection in relation to the increase or decrease in allele frequency.',
      'Never write that organisms change because they need to. Variation comes first, by chance.',
      'In allele frequency calculations, count alleles (two per individual), not individuals.',
    ],
    aim: {
      intro: '<div class="resource">The Kaimanawa horses graze in the central North Island. Long hair helps horses survive harsh winters. Over 30 years of severe winters, the frequency of the long-hair allele rose from 0.3 to 0.5 in the herd.</div>',
      parts: [
        { q: 'Describe what is meant by the gene pool and allele frequency of this herd.', write: true, words: '30–50',
          model: [S('The gene pool is all the alleles of all the genes in the herd.', 'gene pool', true), S('Allele frequency is the proportion of all copies of a gene that are one particular allele.', 'allele frequency', true), S('Here, the long-hair allele went from 30% to 50% of the hair-length alleles in the herd.', 'uses the data')],
          earns: 'Achieved: both terms defined correctly.',
          crit: { A: 'Gene pool = all alleles in a population; allele frequency = proportion of a gene’s alleles that are one type.' } },
        { q: 'Explain how natural selection increased the frequency of the long-hair allele.', write: true, words: '70–100',
          model: [S('There was variation in hair length among the horses, caused by different alleles.', 'variation', true), S('Severe winters were the selection pressure.', 'pressure', true), S('Long-haired horses stayed warmer, so more of them survived the winters and reproduced.', 'survival and reproduction', true), S('They passed the long-hair allele to their foals.', 'inheritance'), S('So over generations the frequency of the long-hair allele rose, from 0.3 to 0.5.', 'allele frequency', true)],
          earns: 'Merit: all the links of natural selection, applied to the horses, ending in allele frequency.',
          crit: { M: 'Explains variation, selection pressure (cold), long-haired horses survive and reproduce more, pass on allele, allele frequency rises.' } },
        { q: 'A run of mild winters now begins. Discuss what is likely to happen to the long-hair allele, and why it may not disappear.', write: true, words: '90–130',
          model: [S('In mild winters the cold no longer selects for long hair, so long-haired horses no longer survive better.', 'pressure removed', true), S('If long hair brings a cost in mild weather, such as overheating, short-haired horses may now survive and breed more, and the frequency of the long-hair allele would fall.', 'possible reversal'), S('If there is no cost, its frequency may stay about the same, changing only by chance.', 'alternative'), S('The allele is unlikely to disappear: if it is recessive, it can be hidden in heterozygotes, which selection cannot “see”.', 'why it persists', true), S('So the frequency will probably drift down slowly or level off, rather than vanish, and could rise again if harsh winters return.', 'justified conclusion', true)],
          earns: 'Excellence: the effect of a changed selection pressure is reasoned both ways, with a justified explanation of why the allele persists.',
          crit: { M: 'Explains that without cold winters the selection pressure is removed or reversed, so the allele frequency may fall.', E: 'Discusses changed or removed selection pressure, considers costs of long hair, explains the allele persists (e.g. hidden in heterozygotes, slow change), and reaches a justified conclusion.' } },
      ],
      up: [
        up(1, ['Horses with long hair survived the winter better and passed on their genes, so long hair became more common.'], [
          ['Add the missing links: variation from different alleles, winter as the selection pressure, more reproduction, and finish with the allele frequency rising', 1, 'Right. Close, but it skips variation and ends with “long hair more common” rather than allele frequency.'],
          ['Say long hair is warmer', 0, 'True, but not the missing links.'],
          ['Mention Kaimanawa', 0, 'Context without reasoning.'],
          ['Define a gene pool', 0, 'That was part (a).']]),
        up(2, ['With mild winters, long hair is no longer an advantage, so the allele frequency will go down.'], [
          ['Weigh the possibilities (cost or no cost of long hair), and explain why the allele is unlikely to vanish (hidden in heterozygotes, slow change)', 1, 'Right. One outcome is stated; Excellence discusses alternatives and justifies why the allele persists.'],
          ['Say the horses will cut their hair', 0, 'Not biology.'],
          ['Repeat part (b)', 0, 'The new situation needs new reasoning.'],
          ['Say mutation will remove it', 0, 'Mutation does not target alleles.']]),
      ],
    },
  });

  /* ======================= 17. Genetic drift, founders, bottlenecks, migration ======================= */
  P.addUnit({
    id: 'drift', title: 'Genetic drift, founders, bottlenecks and migration', mins: 10,
    blurb: 'Chance changes allele frequencies too, especially in small populations. Old Blue’s robins are the classic case.',
    recap: 'Genetic drift is a random change in allele frequency from one generation to the next, caused by chance in which individuals breed. Its effect is much stronger in small populations, where alleles can be lost or fixed by chance. The founder effect happens when a few individuals start a new population: its gene pool reflects only their alleles. A bottleneck happens when a population crashes to a few survivors, losing alleles and variation. Migration (gene flow) moves alleles between populations, adding new alleles and making populations more alike.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Drift: chance, not fitness.</h2>'), C(3, '<p>In a small population, a few individuals failing to breed by bad luck can change allele frequencies a lot.</p>'), C(8, '<p>Alleles can be lost for no reason at all.</p>')],
        draw(a) {
          const v = a.view(0, 20, 0, 1); a.axes(v, { step: 5, ystep: 0.5, labels: false });
          a.text('generations', a.W - 20, v.Y(0) + 16, { align: 'right', size: 0.8, col: a.C.muted }); a.text('allele frequency', v.X(0) + 6, v.Y(1) + 4, { size: 0.8, col: a.C.muted });
          const runs = [[0.5, 0.42, 0.55, 0.38, 0.3, 0.22, 0.31, 0.2, 0.12, 0.05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0.5, 0.6, 0.66, 0.58, 0.7, 0.78, 0.74, 0.86, 0.9, 0.95, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [0.5, 0.48, 0.52, 0.5, 0.47, 0.51, 0.5, 0.53, 0.49, 0.5, 0.52, 0.5, 0.49, 0.51, 0.5, 0.48, 0.5, 0.52, 0.51, 0.5, 0.5]];
          const cols = [a.C.pen, a.C.c1, a.C.c3];
          runs.forEach((r, k) => a.plot(v, (x) => r[Math.min(20, Math.floor(x))], cols[k], 3, a.seg(a.p, 0.05 + k * 0.2, 0.3 + k * 0.2)));
          a.alpha(a.seg(a.p, 0.7, 0.8), () => a.text('large population: steady', v.X(9), v.Y(0.57), { font: 'pen', col: a.C.c3 }));
        } },
      { dur: 13, card: [C(0, '<h2>Bottleneck: the black robin</h2>'), C(3, '<p>By 1980 only five Chatham Island black robins were left, with one breeding female, Old Blue.</p>'), C(8, '<p>Today’s birds all descend from her and her mate. Most of the population’s alleles were lost: very little genetic variation remains.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const cols = [c.c1, c.c2, c.c3, c.c4, c.pen];
          const neck = a.seg(a.p, 0.3, 0.6);
          a.path([[W * 0.2, H * 0.08], [W * 0.42, H * 0.45], [W * 0.42, H * 0.55], [W * 0.2, H * 0.92]], { stroke: c.ink, lw: 3 }); a.path([[W * 0.8, H * 0.08], [W * 0.58, H * 0.45], [W * 0.58, H * 0.55], [W * 0.8, H * 0.92]], { stroke: c.ink, lw: 3 });
          for (let k = 0; k < 20; k++) { const x = W * (0.3 + (k % 5) * 0.1), y = H * (0.12 + Math.floor(k / 5) * 0.07); a.ellipse(x, y, 7, 7, { fill: cols[k % 5], stroke: false, alpha: 1 - neck * (k % 5 > 1 ? 1 : 0) }); }
          for (let k = 0; k < 10; k++) { const x = W * (0.32 + (k % 5) * 0.09), y = H * (0.68 + Math.floor(k / 5) * 0.1); a.ellipse(x, y, 7, 7, { fill: cols[k % 2], stroke: false, alpha: neck }); }
          a.text('after: only two colours of allele', W * 0.5, H * 0.97, { align: 'center', font: 'pen', col: c.pen, alpha: neck });
        } },
      { dur: 12, card: [C(0, '<h2>Founders and migrants</h2>')],
        board: [L(0.5, '<b>founder effect</b>: a few individuals start a new population → its gene pool is a small, unusual sample'), L(3.5, '<b>migration (gene flow)</b>: individuals move between populations → new alleles in, frequencies become more alike'), L(7, 'small populations: drift matters most', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain why the Chatham Island black robin has very little genetic variation.',
      steps: [
        { m: 'The population went through a bottleneck: by 1980 only five birds were left, with one breeding pair.', note: 'the event' },
        { m: 'Only the alleles carried by those few birds were passed on; alleles carried only by birds that died were lost.', note: 'alleles lost' },
        { m: 'With so few birds breeding, genetic drift removed more alleles by chance in the generations after.', note: 'drift' },
        { m: 'So today’s population has a small gene pool with little variation, even though numbers have recovered.', note: 'conclusion' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how the founder effect gives an island population an unusual gene pool.', steps: ['A few birds are blown to a new island', 'They carry only some of the alleles of the mainland population', 'They breed only with each other', 'The new population inherits only their alleles, in their proportions', 'Its allele frequencies differ from the mainland’s'] }], 2)(); },
    grades: 'AAMM',
    gens: [
      P.terms([['genetic drift', 'A random change in allele frequency between generations, caused by chance.'], ['founder effect', 'A new population started by a few individuals has a gene pool reflecting only their alleles.'], ['bottleneck', 'A sharp fall in population size that leaves few survivors and loses alleles.'], ['gene flow', 'The movement of alleles between populations when individuals migrate and breed.'], ['genetic variation', 'Differences in alleles between individuals in a population.']]),
      P.bank([
        { q: 'A storm kills most of a weta population at random. The survivors happen to carry fewer alleles for green colour. What is this an example of?', a: 'A bottleneck, with genetic drift: a random loss of alleles', why: 'The deaths were random, not caused by colour, so it is not natural selection.', w: [['Natural selection for brown colour', 'The storm did not favour any colour.'], ['Gene flow', 'No movement between populations.'], ['Mutation', 'No new alleles were made.']] },
        { q: 'Kākāriki from the mainland are released on an island that already has a small kākāriki population. Which process will change the island’s allele frequencies?', a: 'Gene flow (migration)', why: 'New individuals bring in alleles and breed with the island birds.', w: [['Founder effect', 'The island population already exists.'], ['Bottleneck', 'The population is growing, not crashing.'], ['Natural selection', 'Possible later, but the immediate process is gene flow.']] },
        { q: 'Which kind of population is genetic drift strongest in?', a: 'A small population', why: 'Chance has bigger effects when few individuals breed, as with tossing a coin a few times.', w: [['A large population', 'Chance evens out in large numbers.'], ['A population under strong selection', 'Selection is a separate process.'], ['A population with many migrants', 'Gene flow tends to resist drift.']] },
        { q: 'What is the key difference between genetic drift and natural selection?', a: 'Drift is random; selection depends on phenotypes that affect survival and reproduction', why: 'The 2025 report listed confusing these as a Not Achieved error.', w: [['Drift only happens in large populations', 'It is strongest in small ones.'], ['Selection is random', 'Selection is not random.'], ['There is no difference', 'They are different processes.']] },
      ]),
      P.bank([
        { q: 'Why is low genetic variation a risk for kākāpō?', a: 'A new disease or change could affect all birds similarly, with few alleles available to resist it', why: 'Variation is what natural selection works with. Kākāpō went through a severe bottleneck.', w: [['Low variation makes them breed more', 'It does not.'], ['They will all look different', 'Low variation means they are more alike.'], ['It has no effect if the numbers are high', 'Numbers can recover while variation stays low.']] },
        { q: 'Conservation managers move birds between separate kiwi populations. Why?', a: 'To create gene flow, adding alleles and increasing genetic variation', why: 'Moving birds counters drift and inbreeding in small populations.', w: [['To make the populations different', 'Gene flow makes them more alike.'], ['To cause a bottleneck', 'They want to avoid bottlenecks.'], ['To stop natural selection', 'Not the aim.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: how a bottleneck reduces genetic variation.', steps: ['A large population has many alleles', 'A disaster kills most individuals, at random', 'The few survivors carry only some of the alleles', 'The population regrows from the survivors', 'The new population has less genetic variation than before'] },
      ]),
    ],
    tips: [
      'Drift is <span class="pen">random</span>. Selection is not. Say which one, and why. The 2025 report named confusing these as a Not Achieved error.',
      'Merit in 2025: explaining the effect of genetic drift on a small population.',
      'Use NZ examples: the black robin bottleneck (Old Blue), kākāpō, island founder populations.',
      'Migration (gene flow) adds alleles and makes populations more alike. It works against drift.',
    ],
    aim: {
      intro: '<div class="resource">In 1980 only five Chatham Island black robins survived, and only one pair bred: Old Blue and her mate. Today there are about 250 birds. All are descended from that one pair, and they show very little genetic variation.</div>',
      parts: [
        { q: 'Describe what is meant by a bottleneck and by genetic drift.', write: true, words: '30–50',
          model: [S('A bottleneck is a sharp fall in population size, leaving only a few survivors.', 'bottleneck', true), S('Genetic drift is a random change in allele frequency from one generation to the next.', 'drift', true), S('Drift has the most effect in small populations.', 'detail')],
          earns: 'Achieved: both terms defined correctly.',
          crit: { A: 'Bottleneck = sharp fall in population size to few survivors; drift = random change in allele frequency, strongest in small populations.' } },
        { q: 'Explain why today’s black robins show so little genetic variation, even though there are 250 of them.', write: true, words: '60–90',
          model: [S('The bottleneck left only one breeding pair, so only their alleles could be passed on.', 'the bottleneck', true), S('Alleles carried only by other birds were lost from the gene pool.', 'alleles lost'), S('In the small population that followed, genetic drift could remove more alleles by chance.', 'drift', true), S('Numbers have grown, but new alleles only come from mutation, which is very slow. So variation stays low.', 'why numbers do not fix it', true)],
          earns: 'Merit: the bottleneck and drift are linked to the loss of alleles, and the recovery in numbers is explained.',
          crit: { M: 'Explains one breeding pair → only their alleles passed on → others lost; drift in small population; numbers recover but variation does not (only mutation adds alleles).' } },
        { q: 'Discuss the risks that low genetic variation brings for the black robin, and evaluate whether gene flow could help.', write: true, words: '100–140',
          model: [S('With little variation, most birds share the same alleles, so a new disease or a change in habitat could affect them all in the same way.', 'risk 1', true), S('Natural selection needs variation to act on; with few alleles, the population may not be able to adapt.', 'risk 2'), S('Inbreeding is also more likely, so harmful recessive alleles are more often homozygous, lowering fertility or survival.', 'risk 3'), S('Gene flow could add new alleles, but only from another population of black robins, and there is no other population: all are descended from one pair.', 'evaluates gene flow', true), S('So gene flow cannot help here; managers must instead protect the birds and their habitat and avoid further bottlenecks. Variation can only rebuild slowly through mutation.', 'justified judgement', true)],
          earns: 'Excellence: several risks explained, gene flow evaluated against the facts of this case, and a justified judgement reached.',
          crit: { M: 'Explains a risk of low variation (disease, cannot adapt, inbreeding).', E: 'Discusses several risks and evaluates gene flow, recognising there is no other black robin population to supply alleles, with a justified conclusion.' } },
      ],
      up: [
        up(1, ['They went through a bottleneck so they have low variation.'], [
          ['Explain the link: only one pair bred, so only their alleles passed on; drift removed more; recovery in numbers does not add alleles', 1, 'Right. The cause is named; Merit explains how it reduced variation and why numbers did not help.'],
          ['Give the year 1980', 0, 'In the resource already.'],
          ['Define genetic variation', 0, 'Helpful, but not the explanation.'],
          ['Say they are endangered', 0, 'True, not the explanation.']]),
        up(2, ['Low variation means they could all die from one disease. Gene flow would help by adding new alleles.'], [
          ['Evaluate gene flow against the facts: there is no other black robin population to supply alleles, so it cannot work here; then justify what managers should do', 1, 'Right. The general idea of gene flow is right, but it does not fit this case. Excellence evaluates it.'],
          ['Add more diseases', 0, 'More examples do not evaluate gene flow.'],
          ['Say inbreeding is bad', 0, 'True, but explain why and evaluate gene flow.'],
          ['Suggest cloning', 0, 'Clones would add no variation.']]),
      ],
    },
  });
})();
