/* AS 91159 (Biology 2.7) Demonstrate understanding of gene expression.
   Scope from the NZQA 2026 assessment specifications: nucleic acid structure and the genetic code (A, T, G, C, U and how
   they relate), transcription and translation, gene mutations with plant or animal (including human) examples,
   metabolic pathways, and how genes and the environment interact. Exam tips draw on the 2025 NZQA assessment report. */
(function () {
  const P = NP, R = P.R, Bio = P.bio;
  const C = (at, html) => ({ at, html });
  const L = (at, html, note, o = {}) => Object.assign({ at, html: `<span class="bq">${html}</span>`, note }, o);
  const S = (m, note, key) => ({ m, note, key: !!key });
  const up = (part, shown, choices, ask) => ({ part, shown, ask, choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });
  const St = (say, m) => ({ say, m });

  /* ---------- the genetic code (mRNA codons) ---------- */
  const BASES = 'UCAG', AA1 = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const NAME3 = { F: 'Phe', L: 'Leu', S: 'Ser', Y: 'Tyr', '*': 'Stop', C: 'Cys', W: 'Trp', P: 'Pro', H: 'His', Q: 'Gln', R: 'Arg', I: 'Ile', M: 'Met', T: 'Thr', N: 'Asn', K: 'Lys', V: 'Val', A: 'Ala', D: 'Asp', E: 'Glu', G: 'Gly' };
  const CODE = {}; let k = 0;
  for (const a of BASES) for (const b of BASES) for (const c of BASES) CODE[a + b + c] = NAME3[AA1[k++]];
  const SENSE = Object.keys(CODE).filter((c) => CODE[c] !== 'Stop' && c !== 'AUG');
  const tmplToMRNA = { T: 'A', A: 'U', G: 'C', C: 'G' }, mrnaToTmpl = { A: 'T', U: 'A', G: 'C', C: 'G' };
  const anti = { A: 'U', U: 'A', G: 'C', C: 'G' };
  const tri = (s) => s.match(/.{1,3}/g).join(' ');
  const translate = (m) => { const out = []; for (let i = 0; i + 3 <= m.length; i += 3) { const aa = CODE[m.slice(i, i + 3)]; out.push(aa); if (aa === 'Stop') break; } return out; };
  const randMRNA = (n) => Array.from({ length: n }, () => R.pick(SENSE)).join('');
  // a small codon chart for just the codons in a question
  const chart = (codons) => { const u = [...new Set(codons)].sort(); return `<table class="ctable"><thead><tr><th>mRNA codon</th>${u.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody><tr><th>amino acid</th>${u.map((c) => `<td>${CODE[c]}</td>`).join('')}</tr></tbody></table>`; };
  const codonsOf = (m) => m.match(/.{3}/g) || [];

  /* ======================= 18. From gene to protein: DNA and RNA ======================= */
  P.addUnit({
    id: 'dna-rna', title: 'From gene to protein: DNA and RNA', mins: 9,
    blurb: 'A gene is a recipe for a protein. RNA carries the recipe out of the nucleus.',
    recap: 'A gene is a sequence of DNA bases that codes for a protein (often an enzyme). The sequence of bases decides the sequence of amino acids, which decides how the protein folds, its shape, and so its function. DNA stays in the nucleus, but proteins are made at ribosomes in the cytoplasm, so the code is copied into messenger RNA (mRNA). RNA differs from DNA: it is single-stranded, has the sugar ribose, and has uracil (U) instead of thymine (T). Gene expression has two stages: transcription (DNA → mRNA, in the nucleus) and translation (mRNA → protein, at ribosomes).',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Gene → protein → characteristic</h2>'), C(3, '<p>The order of bases in a gene sets the order of amino acids in a protein.</p>'), C(7.5, '<p>The amino acid order sets the protein’s shape. Shape sets function.</p>')],
        board: [L(0.5, 'DNA base sequence'), L(2.5, '↓ transcription (nucleus)'), L(4.5, 'mRNA codons'), L(6.5, '↓ translation (ribosome)'), L(8.5, 'amino acid sequence → protein shape → function', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>DNA and RNA: spot the differences</h2>')],
        board: [L(0.5, 'strands: DNA double, RNA single'), L(2.5, 'sugar: DNA deoxyribose, RNA ribose'), L(4.5, 'bases: DNA A T G C; RNA A <b>U</b> G C', 'U replaces T', { hl: true }), L(7, 'where: DNA stays in the nucleus; mRNA travels to the ribosomes')] },
      { dur: 12, card: [C(0, '<h2>Why bother with mRNA?</h2>'), C(3, '<p>DNA is too large to leave the nucleus, and it must be kept safe.</p>'), C(7, '<p>mRNA is a short, disposable working copy of one gene. Many copies can be made, so lots of protein can be made fast.</p>')],
        board: [L(0.5, 'DNA: master copy, stays in nucleus'), L(3, 'mRNA: working copy, leaves through nuclear pores'), L(6, 'tRNA: brings amino acids; rRNA: part of ribosomes')] },
    ],
    example: {
      problem: 'Explain why DNA cannot be translated directly into a protein.',
      steps: [
        { m: 'DNA is found in the nucleus and is too large to pass through the nuclear pores.', note: 'location' },
        { m: 'Proteins are made at ribosomes in the cytoplasm.', note: 'where proteins are made' },
        { m: 'So the code of one gene is first transcribed into mRNA, which is small and single-stranded.', note: 'the solution' },
        { m: 'mRNA leaves the nucleus and carries the code to a ribosome, where it is translated.', note: 'linked conclusion' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how a gene controls a characteristic.', steps: ['A gene has a sequence of DNA bases', 'It is transcribed into mRNA', 'The mRNA codons are translated into a sequence of amino acids', 'The amino acid sequence folds into a protein with a particular shape', 'The protein’s shape decides its function, which affects the characteristic'] }], 2)(); },
    grades: 'AAAMM',
    gens: [
      P.terms([['gene', 'A sequence of DNA bases that codes for a protein.'], ['mRNA', 'Messenger RNA: a single-stranded copy of a gene that carries the code to a ribosome.'], ['tRNA', 'Transfer RNA: carries a specific amino acid to the ribosome and has an anticodon.'], ['ribosome', 'The organelle, made of rRNA and protein, where translation happens.'], ['uracil', 'The base in RNA that replaces thymine and pairs with adenine.'], ['gene expression', 'Using the code in a gene to make a protein: transcription, then translation.'], ['ribose', 'The sugar in RNA (DNA has deoxyribose).']]),
      P.bank([
        { q: 'Which base is found in RNA but not in DNA?', a: 'Uracil (U)', why: 'U replaces T in RNA and pairs with A.', w: [['Thymine (T)', 'Thymine is in DNA, not RNA.'], ['Adenine (A)', 'Adenine is in both.'], ['Guanine (G)', 'Guanine is in both.']] },
        { q: 'Which describes RNA?', a: 'Single-stranded, with ribose and uracil', why: 'All three differ from DNA.', w: [['Double-stranded, with deoxyribose and thymine', 'That is DNA.'], ['Single-stranded, with deoxyribose and thymine', 'RNA has ribose and uracil.'], ['Double-stranded, with ribose and uracil', 'RNA is usually single-stranded.']] },
        { q: 'Where are proteins made?', a: 'At ribosomes in the cytoplasm', why: 'mRNA brings the code to the ribosomes.', w: [['In the nucleus', 'DNA is there, but proteins are made at ribosomes.'], ['In the mitochondria', 'Mostly ATP production.'], ['In the cell membrane', 'Some proteins sit there, but they are made at ribosomes.']] },
        { q: 'In RNA, which base pairs with adenine?', a: 'Uracil', why: 'A pairs with U in RNA (and with T in DNA).', w: [['Thymine', 'That is in DNA.'], ['Cytosine', 'C pairs with G.'], ['Guanine', 'G pairs with C.']] },
      ]),
      () => { const d = Array.from({ length: 9 }, () => R.pick('ATGC'.split(''))).join(''); const m = d.split('').map((b) => tmplToMRNA[b]).join('');
        return P.mcq({ prompt: `A DNA template strand reads <code>${tri(d)}</code>. Which mRNA is made from it?`, more: { steps: [St('mRNA is complementary to the template strand.'), St('Pair: T→A, A→U, G→C, C→G. (U replaces T in RNA.)'), St(`mRNA: <code>${tri(m)}</code>`)], trap: 'Writing T in mRNA. RNA has U instead.' } },
          P.uniq([{ t: `<code>${tri(m)}</code>`, ok: true }, { t: `<code>${tri(m.replace(/U/g, 'T'))}</code>`, why: 'That uses T. RNA uses U.' }, { t: `<code>${tri(d.replace(/T/g, 'U'))}</code>`, why: 'That copies the template; mRNA is complementary to it.' }, { t: `<code>${tri(d.split('').map((b) => ({ A: 'T', T: 'A', G: 'C', C: 'G' })[b]).join(''))}</code>`, why: 'That is the complementary DNA strand, with T. mRNA has U.' }])); },
      P.bank([
        { q: 'Why is mRNA needed in gene expression?', a: 'DNA stays in the nucleus, so mRNA carries a copy of the gene to the ribosomes', why: 'DNA is too big to leave the nucleus and is protected there.', w: [['mRNA makes the DNA', 'DNA is not made from mRNA.'], ['Ribosomes can only read single-stranded DNA', 'They read mRNA.'], ['mRNA is the protein', 'mRNA codes for the protein.']] },
        { q: 'How does a change in a gene change a characteristic?', a: 'It can change the amino acid sequence, so the protein folds into a different shape and works differently', why: 'Base sequence → amino acid sequence → shape → function → characteristic.', w: [['It changes the mRNA into DNA', 'Not the mechanism.'], ['It changes the number of chromosomes', 'A gene change does not.'], ['It always kills the cell', 'Many changes have small or no effects.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: from gene to protein.', steps: ['In the nucleus, the gene is transcribed into mRNA', 'mRNA leaves the nucleus through a nuclear pore', 'mRNA attaches to a ribosome', 'tRNAs bring amino acids, matching codons to anticodons', 'Amino acids are joined into a polypeptide that folds into a protein'] },
      ]),
    ],
    tips: [
      'Know three differences between DNA and RNA: <span class="pen">strands, sugar, T vs U</span>.',
      'The 2025 report asked candidates to explain why DNA cannot be translated directly. Link the nucleus, the size of DNA and the ribosomes.',
      'Say “sequence of bases → sequence of amino acids → shape → function”. That chain earns Merit and Excellence.',
      'Achieved in 2025: describing the function of mRNA and tRNA and labelling the DNA template and mRNA strands.',
    ],
    aim: {
      intro: '<div class="resource">The gene for the protein keratin is found in the nucleus of a skin cell. Keratin is made in large amounts at ribosomes in the cytoplasm.</div>',
      parts: [
        { q: 'Describe three differences between DNA and mRNA.', write: true, words: '30–50',
          model: [S('DNA is double-stranded; mRNA is single-stranded.', 'strands', true), S('DNA contains the sugar deoxyribose; mRNA contains ribose.', 'sugar', true), S('DNA has the base thymine; mRNA has uracil instead.', 'bases', true)],
          earns: 'Achieved: three correct differences, each stated for both molecules.',
          crit: { A: 'Three of: strands, sugar, T vs U, length (whole chromosome vs one gene), location (stays in nucleus vs leaves).' } },
        { q: 'Explain why the keratin gene is first transcribed into mRNA rather than being translated directly from DNA.', write: true, words: '60–90',
          model: [S('DNA is very large and cannot leave the nucleus through the nuclear pores; it also needs to be kept safe there.', 'DNA stays', true), S('Keratin is made at ribosomes in the cytoplasm.', 'where protein is made'), S('So a copy of just the keratin gene is made as mRNA, which is small enough to leave the nucleus.', 'the solution', true), S('mRNA carries the code to the ribosomes, where it is translated into keratin.', 'linked conclusion')],
          earns: 'Merit: the location of DNA and of protein synthesis are linked to the need for mRNA.',
          crit: { M: 'Explains DNA cannot leave nucleus (size/protection), ribosomes in cytoplasm, so mRNA copy carries code out.' } },
        { q: 'Discuss how the base sequence of the keratin gene decides the properties of keratin, and why making many mRNA copies helps skin cells.', write: true, words: '100–140',
          model: [S('The sequence of bases in the gene is transcribed into a sequence of codons in mRNA.', 'gene → mRNA', true), S('Each codon codes for one amino acid, so the codon sequence sets the order of amino acids in keratin.', 'mRNA → amino acids', true), S('The amino acid order decides how the chain folds, and so keratin’s shape, which makes it tough and fibrous, suited to protecting skin.', 'sequence → shape → function', true), S('One gene can be transcribed many times, and each mRNA can be translated by many ribosomes.', 'many copies'), S('So skin cells can make large amounts of keratin quickly while the DNA stays safe in the nucleus. That is why mRNA is efficient as well as necessary.', 'justified conclusion')],
          earns: 'Excellence: the full chain from base sequence to function is linked, and the benefit of many mRNA copies is justified.',
          crit: { M: 'Explains codons set the amino acid sequence, which sets the protein.', E: 'Links base sequence → codons → amino acid order → folding/shape → function (toughness), and justifies why many mRNA copies allow large amounts of keratin while protecting DNA.' } },
      ],
      up: [
        up(1, ['DNA cannot leave the nucleus so mRNA is used.'], [
          ['Explain the link: DNA is too large to leave and must be protected; proteins are made at ribosomes in the cytoplasm; so mRNA copies the gene and carries it there', 1, 'Right. The fact is correct, but Merit needs the full chain linking location to the need for mRNA.'],
          ['Say mRNA is single-stranded', 0, 'True, but not the missing link.'],
          ['Name the enzyme', 0, 'Not the missing link.'],
          ['Say keratin is a protein', 0, 'True, but not explanation.']]),
        up(2, ['The base sequence decides the amino acids, which decides the protein.'], [
          ['Link amino acid order to folding, shape and keratin’s function, and justify why many mRNA copies help skin cells', 1, 'Right. The chain stops early, and the second half of the question is missing.'],
          ['Give a DNA sequence', 0, 'An example sequence does not discuss.'],
          ['Name the bases', 0, 'Not the missing part.'],
          ['Say skin is important', 0, 'Too vague.']]),
      ],
    },
  });

  /* ======================= 19. Transcription ======================= */
  P.addUnit({
    id: 'transcription', title: 'Transcription', mins: 9,
    blurb: 'RNA polymerase reads the template strand and builds mRNA by complementary base pairing.',
    recap: 'Transcription happens in the nucleus. The DNA of one gene unwinds and the two strands separate. RNA polymerase moves along the template strand, joining free RNA nucleotides that are complementary to it: A pairs with U, T with A, G with C, and C with G. The finished mRNA has the same sequence as the other DNA strand (the coding strand), but with U instead of T. The mRNA leaves the nucleus through a nuclear pore, and the DNA rewinds.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Unzip one gene, read one strand.</h2>'), C(3, '<p>The template strand is read. RNA polymerase adds matching RNA nucleotides one by one.</p>'), C(8.5, '<p>T in the template → A in mRNA. A → U. G → C. C → G.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const tmpl = 'TACGGATTC'.split(''); const n = tmpl.length, dx = (W * 0.86) / n, x0 = W * 0.07;
          const col = { A: c.c1, T: c.c2, G: c.c3, C: c.c4, U: c.pen };
          const shown = Math.floor(a.seg(a.p, 0.15, 0.85) * n);
          tmpl.forEach((b, k) => { const x = x0 + (k + 0.5) * dx; a.line(x, H * 0.7, x, H * 0.6, col[b], 6); a.text(b, x, H * 0.76, { align: 'center', size: 0.8, col: col[b] }); });
          a.text('DNA template', x0, H * 0.88, { size: 0.8, col: c.muted });
          for (let k = 0; k < shown; k++) { const b = tmplToMRNA[tmpl[k]], x = x0 + (k + 0.5) * dx; a.line(x, H * 0.42, x, H * 0.52, col[b], 6); a.text(b, x, H * 0.36, { align: 'center', size: 0.8, col: col[b] }); }
          a.text('mRNA', x0, H * 0.24, { size: 0.8, col: c.muted });
          const px = x0 + (shown + 0.5) * dx; if (shown < n) a.ellipse(px, H * 0.56, dx * 0.9, H * 0.12, { fill: c.c4, stroke: false, alpha: 0.35 });
          if (shown < n) a.text('RNA polymerase', Math.min(px, W * 0.75), H * 0.08, { align: 'center', font: 'pen', col: c.c4 });
        } },
      { dur: 12, card: [C(0, '<h2>Template strand vs coding strand</h2>'), C(3, '<p>The mRNA is complementary to the template strand.</p>'), C(7, '<p>So it matches the coding strand, except U for T.</p>')],
        board: [L(0.5, `coding: <code>ATG CCT AAG</code>`), L(2.5, `template: <code>TAC GGA TTC</code>`), L(4.5, `mRNA: <code>AUG CCU AAG</code>`, 'same as coding, U for T', { hl: true })] },
      { dur: 11, card: [C(0, '<h2>Then out it goes</h2>'), C(3, '<p>The mRNA detaches, the DNA rewinds, and the mRNA leaves through a nuclear pore to a ribosome.</p>')],
        board: [L(0.5, '1. DNA unwinds; hydrogen bonds break'), L(2.5, '2. RNA polymerase builds mRNA on the template'), L(4.5, '3. mRNA detaches; DNA rewinds'), L(6.5, '4. mRNA leaves the nucleus through a pore', '', { hl: true })] },
    ],
    example: {
      problem: 'A DNA template strand reads TAC CGA GTT. Write the mRNA and explain how it is made.',
      steps: [
        { m: 'mRNA: <code>AUG GCU CAA</code>', note: 'T→A, A→U, G→C, C→G' },
        { m: 'In the nucleus, the DNA of the gene unwinds and the hydrogen bonds between the strands break.', note: 'unwind' },
        { m: 'RNA polymerase moves along the template strand, joining free RNA nucleotides that pair with each base.', note: 'enzyme + pairing' },
        { m: 'The finished mRNA leaves the nucleus through a nuclear pore.', note: 'leaves' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: the steps of transcription.', steps: ['The DNA of the gene unwinds and the strands separate', 'RNA polymerase attaches to the template strand', 'Free RNA nucleotides pair with complementary DNA bases', 'RNA polymerase joins them to form mRNA', 'The mRNA detaches and leaves through a nuclear pore'] }], 2)(); },
    grades: 'AAAMM',
    gens: [
      () => { const m = randMRNA(R.int(3, 4)); const t = m.split('').map((b) => mrnaToTmpl[b]).join('');
        return P.mcq({ prompt: `A DNA template strand reads <code>${tri(t)}</code>. What is the mRNA?`, more: { steps: [St('Pair each template base: T→A, A→U, G→C, C→G.'), St(`mRNA: <code>${tri(m)}</code>`)] } },
          P.uniq([{ t: `<code>${tri(m)}</code>`, ok: true }, { t: `<code>${tri(m.replace(/U/g, 'T'))}</code>`, why: 'mRNA uses U, not T.' }, { t: `<code>${tri(t.replace(/T/g, 'U'))}</code>`, why: 'That copies the template. mRNA is complementary to it.' }, { t: `<code>${tri(m.split('').reverse().join(''))}</code>`, why: 'Right bases, wrong order. Pair each base where it is.' }])); },
      () => { const m = randMRNA(3); const coding = m.replace(/U/g, 'T');
        return P.mcq({ prompt: `An mRNA reads <code>${tri(m)}</code>. What is the DNA <b>coding</b> strand?`, more: { steps: [St('The coding strand has the same sequence as the mRNA, but with T instead of U.'), St(`Coding strand: <code>${tri(coding)}</code>`)], trap: 'Giving the template strand. The template is complementary to the mRNA; the coding strand matches it.' } },
          P.uniq([{ t: `<code>${tri(coding)}</code>`, ok: true }, { t: `<code>${tri(m.split('').map((b) => mrnaToTmpl[b]).join(''))}</code>`, why: 'That is the template strand.' }, { t: `<code>${tri(m)}</code>`, why: 'DNA has T, not U.' }])); },
      P.terms([['transcription', 'Making an mRNA copy of a gene, in the nucleus.'], ['RNA polymerase', 'The enzyme that joins RNA nucleotides to make mRNA.'], ['template strand', 'The DNA strand that is read to make mRNA.'], ['coding strand', 'The DNA strand with the same sequence as the mRNA (T instead of U).'], ['nuclear pore', 'A gap in the nuclear envelope that mRNA passes through.'], ['complementary base pairing', 'In transcription: A–U, T–A, G–C, C–G.']]),
      P.bank([
        { q: 'Why is only one strand of DNA used as a template in transcription?', a: 'RNA polymerase reads only the template strand of a gene, so the mRNA matches the other (coding) strand; reading both would give two different mRNAs', why: 'The template is read to build mRNA that matches the coding strand.', w: [['Both strands are always read at once', 'Only the template is read for a given gene.'], ['The other strand is damaged', 'It is not damaged.'], ['RNA polymerase is too small for two', 'Not the reason.']] },
        { q: 'Why does transcription happen in the nucleus?', a: 'The DNA is in the nucleus and cannot leave it', why: 'The copy is made where the DNA is.', w: [['Ribosomes are in the nucleus', 'Ribosomes are in the cytoplasm.'], ['RNA polymerase only works in the dark', 'Not a thing.'], ['mRNA is too big for the cytoplasm', 'mRNA leaves the nucleus.']] },
        { q: 'A cell transcribes one gene thousands of times. Why is this useful?', a: 'Many mRNA copies let many ribosomes make the protein at the same time', why: 'This multiplies protein output without risking the DNA.', w: [['It makes more DNA', 'Transcription makes RNA.'], ['It removes mutations', 'Copying does not remove mutations.'], ['It slows protein production', 'It speeds it up.']] },
      ]),
      P.chain([
        { q: 'Put the steps of transcription in order.', steps: ['A gene’s DNA unwinds', 'The hydrogen bonds between bases break', 'RNA polymerase reads the template strand', 'Complementary RNA nucleotides are joined into mRNA', 'mRNA leaves the nucleus; DNA rewinds'] },
      ]),
    ],
    tips: [
      'Transcription pairing: <span class="pen">T→A, A→U, G→C, C→G</span>. Check every A in the template became U.',
      'Template strand is read; the mRNA matches the coding strand (with U). Label which is which.',
      'Name RNA polymerase and say where it happens: the nucleus.',
      'Achieved in 2025: identifying and labelling the DNA template and mRNA strands.',
    ],
    aim: {
      intro: '<div class="resource">Part of the template strand of a gene for an enzyme in a ryegrass leaf reads: <code>TAC CTT GGA</code>.</div>',
      parts: [
        { q: 'Write the mRNA sequence transcribed from this template strand, and describe where transcription happens.', write: true, words: '20–40',
          model: [S('mRNA: <code>AUG GAA CCU</code>.', 'complementary, U for T', true), S('Transcription happens in the nucleus.', 'where', true)],
          earns: 'Achieved: the correct mRNA and the correct place.',
          crit: { A: 'mRNA AUG GAA CCU; nucleus.' } },
        { q: 'Explain how RNA polymerase uses complementary base pairing to produce this mRNA.', write: true, words: '60–90',
          model: [S('The DNA of the gene unwinds and the hydrogen bonds between the two strands break.', 'unwind', true), S('RNA polymerase moves along the template strand.', 'enzyme'), S('Free RNA nucleotides pair with the exposed bases: A with U, T with A, G with C and C with G. So TAC gives AUG.', 'pairing with the example', true), S('RNA polymerase joins the nucleotides, so the mRNA has a sequence complementary to the template.', 'linked conclusion')],
          earns: 'Merit: the process is explained step by step and the pairing rule is applied to the sequence.',
          crit: { M: 'Explains unwinding, RNA polymerase along template, complementary pairing (A–U, T–A, G–C, C–G) applied to the sequence.' } },
        { q: 'Discuss why the mRNA has the same sequence as the coding strand except for one difference, and why this matters for making the correct enzyme.', write: true, words: '90–130',
          model: [S('The mRNA is complementary to the template strand, and so is the coding strand.', 'both complementary to the template', true), S('So the mRNA and the coding strand carry the same sequence, except that RNA has uracil where DNA has thymine: coding ATG GAA CCT, mRNA AUG GAA CCU.', 'the one difference', true), S('This means the mRNA carries exactly the information in the gene.', 'meaning'), S('Its codons are translated into the correct amino acids in the correct order (AUG = Met, GAA = Glu, CCU = Pro), so the enzyme folds into the right shape.', 'links to the enzyme', true), S('If the copy were wrong, the amino acids could change and the active site might not work.', 'why accuracy matters')],
          earns: 'Excellence: the relationship between the three sequences is explained and linked to producing a working enzyme.',
          crit: { M: 'Explains mRNA matches coding strand because both are complementary to the template, with U instead of T.', E: 'Links the accurate copy to the correct codons and amino acid sequence, enzyme shape/active site and function.' } },
      ],
      up: [
        up(1, ['RNA polymerase makes mRNA from the DNA. A pairs with U.'], [
          ['Explain the steps: unwinding, RNA polymerase moving along the template, each pairing rule applied to the sequence', 1, 'Right. One rule and the enzyme are named; Merit explains how the mRNA is built.'],
          ['Write the mRNA again', 0, 'That was part (a).'],
          ['Say it happens in the nucleus', 0, 'True but not the missing explanation.'],
          ['Draw a ribosome', 0, 'Ribosomes are for translation.']]),
        up(2, ['The mRNA is the same as the coding strand but with U instead of T.'], [
          ['Explain why (both are complementary to the template) and link the accurate copy to the right amino acids and a working enzyme', 1, 'Right. A correct statement; Excellence explains it and its significance.'],
          ['Write out the coding strand', 0, 'Helpful, but the reasoning is missing.'],
          ['Say uracil is a base', 0, 'Not the reasoning.'],
          ['Name the enzyme', 0, 'Not the reasoning.']]),
      ],
    },
  });

  /* ======================= 20. Translation and the genetic code ======================= */
  P.addUnit({
    id: 'translation', title: 'Translation and the genetic code', mins: 11,
    blurb: 'Codon meets anticodon. Amino acids join. Know the code is triplet, redundant and universal.',
    recap: 'Translation happens at a ribosome. The mRNA is read in codons: groups of three bases, each coding for one amino acid. tRNA molecules each carry one specific amino acid and have an anticodon complementary to a codon. At the ribosome, each codon pairs with the matching anticodon, and the amino acids are joined by peptide bonds into a polypeptide. AUG is the start codon; UAA, UAG and UGA are stop codons. The code is a triplet code, redundant (most amino acids have several codons), and universal (the same in almost all organisms).',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Codon, anticodon, amino acid</h2>'), C(3, '<p>The ribosome holds the mRNA. A tRNA with the matching anticodon brings its amino acid.</p>'), C(8.5, '<p>The amino acids are joined by a peptide bond. The ribosome moves on one codon.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const codons = ['AUG', 'GCU', 'UUC', 'AAA', 'UGA']; const step = Math.min(4, Math.floor(a.p * 5)); const cw = W * 0.18;
          a.round(W * 0.04, H * 0.72, W * 0.92, H * 0.1, 6, { fill: c.c3, stroke: false, alpha: 0.25 });
          codons.forEach((cd, k) => a.text(cd, W * 0.04 + (k + 0.5) * cw, H * 0.77, { align: 'center', font: 'head', size: 0.85 }));
          const rx = W * 0.04 + (step + 0.5) * cw;
          a.ellipse(rx, H * 0.6, cw * 1.1, H * 0.22, { fill: c.c4, stroke: false, alpha: 0.18 });
          const aas = codons.slice(0, step + 1).map((cd) => CODE[cd]).filter((x) => x !== 'Stop');
          aas.forEach((aa, k) => { const x = rx - (aas.length - 1 - k) * 34; a.ellipse(x, H * 0.3, 15, 15, { fill: c.c2, stroke: c.ink, lw: 1.5 }); a.text(aa, x, H * 0.3, { align: 'center', size: 0.62, font: 'head' }); if (k) a.line(x - 34 + 15, H * 0.3, x - 15, H * 0.3, c.ink, 2); });
          a.text(codons[step] === 'UGA' ? 'stop codon: chain released' : `codon ${codons[step]} ↔ anticodon ${codons[step].split('').map((b) => anti[b]).join('')}`, W * 0.5, H * 0.94, { align: 'center', font: 'pen', col: c.pen });
        } },
      { dur: 12, card: [C(0, '<h2>Reading the code</h2>'), C(3, '<p>Exams give you a codon table. Look up each mRNA codon: never the DNA.</p>')],
        board: [L(0.5, 'AUG → Met (start)'), L(2.5, 'GCU, GCC, GCA, GCG → all Ala', 'redundant'), L(5, 'UAA, UAG, UGA → stop'), L(7.5, 'anticodon = complement of the codon (A–U, G–C)', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>Three properties of the code</h2>')],
        board: [L(0.5, '<b>triplet</b>: three bases per amino acid'), L(2.5, '<b>redundant (degenerate)</b>: most amino acids have more than one codon'), L(5, '<b>universal</b>: the same code in almost every organism'), L(7.5, '<b>non-overlapping</b>: each base is read once', '', { hl: true })] },
    ],
    example: {
      problem: `An mRNA reads AUG GGC UGG UAA. Use the table to give the amino acid sequence. ${chart(['AUG', 'GGC', 'UGG', 'UAA'])}`,
      steps: [
        { m: 'Split into codons: AUG | GGC | UGG | UAA.', note: 'threes' },
        { m: 'AUG = Met (the start codon).', note: 'start' },
        { m: 'GGC = Gly, UGG = Trp.', note: 'look up' },
        { m: 'UAA = stop. The polypeptide is Met–Gly–Trp.', note: 'stop: no amino acid' },
      ],
    },
    faded() { const m = 'AUG' + randMRNA(2); const aa = translate(m); const cods = codonsOf(m);
      return { kind: 'order', prompt: `Put these in order to describe how the mRNA <code>${tri(m)}</code> is translated.`, items: ['The mRNA attaches to a ribosome', `A tRNA with anticodon UAC brings methionine to the start codon AUG`, `A tRNA with anticodon ${cods[1].split('').map((b) => anti[b]).join('')} brings ${aa[1]} to codon ${cods[1]}`, `A peptide bond joins Met to ${aa[1]}`, `The ribosome moves along and a tRNA brings ${aa[2]} to codon ${cods[2]}`], given: 2,
        more: { steps: [St('Translation starts when mRNA attaches to a ribosome, at the start codon AUG.'), St('Each codon is matched by a tRNA with the complementary anticodon, carrying one amino acid.'), St('Neighbouring amino acids are joined by peptide bonds as the ribosome moves along the mRNA.')] } }; },
    grades: 'AAAMMM',
    gens: [
      () => { const m = 'AUG' + randMRNA(R.int(2, 3)) + R.pick(['UAA', 'UAG', 'UGA']); const aa = translate(m).filter((x) => x !== 'Stop'); const right = aa.join('–');
        const wrong1 = translate(m.slice(1) + 'A').filter((x) => x !== 'Stop').join('–');
        return P.mcq({ prompt: `Translate the mRNA <code>${tri(m)}</code> using the table.`, fig: chart(codonsOf(m).concat(codonsOf(m.slice(1) + 'A'))), more: { steps: [St('Read the mRNA in threes from the start codon AUG.'), St(codonsOf(m).map((c) => `${c} = ${CODE[c]}`).join(', ')), St(`Stop codons add no amino acid. So: ${right}.`)], trap: 'Reading from the wrong base, or including the stop codon as an amino acid.' } },
          P.uniq([{ t: right, ok: true }, { t: right + '–Stop', why: 'A stop codon does not code for an amino acid.' }, { t: wrong1 || 'none', why: 'That reads the codons one base out of step.' }, { t: aa.slice().reverse().join('–'), why: 'Right amino acids, wrong order: read from the start codon.' }])); },
      () => { const c = R.pick(SENSE); const ac = c.split('').map((b) => anti[b]).join('');
        return P.mcq({ prompt: `What is the anticodon of the tRNA that pairs with the mRNA codon <code>${c}</code>? Write it base by base under the codon.`, more: { steps: [St('The anticodon is complementary to the codon: A–U, U–A, G–C, C–G.'), St(`${c} → ${ac}.`)], trap: 'Using T. tRNA is RNA, so it has U.' } },
          P.uniq([{ t: ac, ok: true }, { t: ac.replace(/U/g, 'T'), why: 'tRNA is RNA: it has U, not T.' }, { t: c, why: 'That is the codon itself.' }, { t: ac.split('').reverse().join(''), why: 'Here, pair each base in place, without reversing.' }])); },
      P.terms([['codon', 'A sequence of three mRNA bases that codes for one amino acid (or stop).'], ['anticodon', 'Three bases on a tRNA, complementary to a codon.'], ['peptide bond', 'The bond that joins two amino acids.'], ['start codon', 'AUG: begins translation and codes for methionine.'], ['stop codon', 'UAA, UAG or UGA: ends translation; codes for no amino acid.'], ['redundant (degenerate) code', 'Most amino acids are coded for by more than one codon.'], ['universal code', 'The same codons code for the same amino acids in almost all organisms.']]),
      P.bank([
        { q: 'Why is the genetic code described as redundant (degenerate)?', a: 'Most amino acids are coded for by more than one codon', why: 'There are 64 codons but only 20 amino acids. This is why some mutations are silent.', w: [['Some codons code for two amino acids', 'Each codon codes for only one.'], ['Some DNA is never used', 'Not what redundant means here.'], ['The code is the same in all organisms', 'That is “universal”.']] },
        { q: 'Why can a bacterium make a human protein if given the human gene?', a: 'The genetic code is universal: codons mean the same amino acids in both', why: 'This is the basis of making human insulin in bacteria.', w: [['Bacteria have human ribosomes', 'They have their own ribosomes.'], ['The code is redundant', 'Redundancy is about several codons per amino acid.'], ['Bacteria can read DNA directly', 'They still transcribe and translate.']] },
        { q: 'Why does a codon have three bases rather than two?', a: 'Two bases give only 16 combinations, too few for 20 amino acids; three give 64', why: '4² = 16 < 20; 4³ = 64 ≥ 20.', w: [['Because DNA has three strands', 'DNA has two.'], ['Because ribosomes have three parts', 'Not the reason.'], ['It is random', 'There is a mathematical reason.']] },
      ]),
      P.bank([
        { q: 'What is the job of tRNA?', a: 'To carry a specific amino acid to the ribosome and match it to the right codon with its anticodon', why: 'The anticodon makes sure the right amino acid goes in the right place.', w: [['To carry the code from the nucleus', 'That is mRNA.'], ['To join amino acids together', 'The ribosome does this.'], ['To unzip DNA', 'That is in replication and transcription.']] },
        { q: 'What makes sure amino acids join in the right order?', a: 'Complementary pairing between each mRNA codon and a tRNA anticodon', why: 'Each tRNA anticodon only pairs with one codon (or a few), and carries one amino acid.', w: [['The amino acids attract each other in order', 'They do not.'], ['The ribosome chooses at random', 'Pairing is specific.'], ['The DNA joins them', 'DNA stays in the nucleus.']] },
      ]),
      P.chain([
        { q: 'Put the steps of translation in order.', steps: ['mRNA attaches to a ribosome', 'A tRNA with anticodon UAC brings methionine to the start codon AUG', 'The next tRNA pairs with the next codon, bringing its amino acid', 'A peptide bond joins the two amino acids', 'This repeats until a stop codon releases the polypeptide'] },
      ]),
    ],
    tips: [
      'Translate <span class="pen">mRNA</span> codons with the table, never the DNA. Split into threes first.',
      'Anticodons are complementary to codons and contain U, not T.',
      'Merit in 2025: recognising the complementary nature of codons and anticodons, and explaining redundancy linked to silent mutations.',
      'Excellence in 2025: discussing the relationship between codons, anticodons, tRNA, mRNA and amino acids in one connected answer.',
    ],
    aim: {
      intro: `<div class="resource">Part of an mRNA for a muscle protein reads <code>AUG CAU GGU UGG</code>. Codon table: ${chart(['AUG', 'CAU', 'GGU', 'UGG', 'CAC', 'GGA'])}</div>`,
      parts: [
        { q: 'Give the amino acid sequence coded for by this mRNA, and describe what a codon is.', write: true, words: '30–50',
          model: [S('Met – His – Gly – Trp.', 'translation', true), S('A codon is a sequence of three mRNA bases that codes for one amino acid.', 'definition', true)],
          earns: 'Achieved: correct translation and a correct definition.',
          crit: { A: 'Met–His–Gly–Trp; codon = three mRNA bases coding for one amino acid.' } },
        { q: 'Explain how tRNA makes sure histidine is placed second in the chain.', write: true, words: '60–90',
          model: [S('Each tRNA carries one specific amino acid and has an anticodon of three bases.', 'tRNA', true), S('The second codon is CAU. The tRNA carrying histidine has the complementary anticodon GUA.', 'pairing applied', true), S('At the ribosome, the anticodon GUA pairs with codon CAU by complementary base pairing, so histidine is placed next to methionine.', 'placement'), S('A peptide bond joins methionine and histidine.', 'joining', true)],
          earns: 'Merit: codon–anticodon pairing is explained and applied to the example.',
          crit: { M: 'Explains tRNA carries specific amino acid, anticodon GUA pairs with CAU, so His placed in order; peptide bond.' } },
        { q: 'The table shows that histidine has two codons (CAU and CAC) and glycine has more than one. Discuss what this tells you about the genetic code, and how it protects the muscle protein from some mutations.', write: true, words: '90–130',
          model: [S('The genetic code is redundant (degenerate): most amino acids are coded for by more than one codon.', 'property', true), S('There are 64 codons but only 20 amino acids, so many codons share an amino acid, usually differing in the third base.', 'why'), S('If a substitution changed CAU to CAC, the tRNA for histidine still pairs, and histidine is still added.', 'applies it', true), S('The amino acid sequence, and so the protein’s shape and function, stay the same: a silent mutation.', 'consequence', true), S('So redundancy means some mutations, especially in the third base, have no effect, which helps keep proteins such as this muscle protein working.', 'justified conclusion')],
          earns: 'Excellence: redundancy is explained, applied to a specific mutation, and linked through amino acids to protein shape and function.',
          crit: { M: 'Explains the code is redundant and that a change from CAU to CAC still codes for histidine.', E: 'Links redundancy to silent mutations, applies it to the example, and connects unchanged amino acid sequence to unchanged shape and function of the protein.' } },
      ],
      up: [
        up(1, ['tRNA brings histidine because its anticodon matches the codon.'], [
          ['Give the actual pairing (codon CAU, anticodon GUA), explain complementary pairing at the ribosome, and the peptide bond', 1, 'Right. The idea is right but general. Merit applies it to the sequence.'],
          ['List the amino acids again', 0, 'That was part (a).'],
          ['Say histidine is an amino acid', 0, 'True, not explanation.'],
          ['Describe transcription', 0, 'This question is about translation.']]),
        up(2, ['The code is redundant, so some mutations are silent.'], [
          ['Apply it: a change from CAU to CAC still codes for histidine, so the amino acid sequence, shape and function of the protein stay the same', 1, 'Right. The terms are correct; Excellence explains and applies them.'],
          ['Define a codon again', 0, 'That was part (a).'],
          ['Say mutations are bad', 0, 'Not the point here.'],
          ['Count the codons in the table', 0, 'Not the reasoning.']]),
      ],
    },
  });

  /* ======================= 21. Mutations and protein function ======================= */
  function mutate(m, type) {
    const cods = codonsOf(m); const i = R.int(1, cods.length - 2); // not the start codon, not the last
    if (type === 'silent' || type === 'missense' || type === 'nonsense') {
      for (let tries = 0; tries < 400; tries++) { const pos = i * 3 + R.int(0, 2); const nb = R.pick('UCAG'.split('').filter((b) => b !== m[pos])); const mm = m.slice(0, pos) + nb + m.slice(pos + 1); const a0 = CODE[m.slice(i * 3, i * 3 + 3)], a1 = CODE[mm.slice(i * 3, i * 3 + 3)];
        if ((type === 'silent' && a1 === a0) || (type === 'missense' && a1 !== a0 && a1 !== 'Stop') || (type === 'nonsense' && a1 === 'Stop')) return { mm, pos, i }; }
      return null;
    }
    const pos = i * 3 + R.int(0, 2);
    if (type === 'insertion') return { mm: m.slice(0, pos) + R.pick('UCAG'.split('')) + m.slice(pos), pos, i };
    return { mm: m.slice(0, pos) + m.slice(pos + 1), pos, i }; // deletion
  }
  const MUTNAME = { silent: 'substitution: silent', missense: 'substitution: missense', nonsense: 'substitution: nonsense', insertion: 'insertion: frameshift', deletion: 'deletion: frameshift' };
  P.addUnit({
    id: 'mutations', title: 'Mutations and protein function', mins: 12,
    blurb: 'Silent, missense, nonsense, frameshift. Follow the change from base to amino acid to shape to symptom.',
    recap: 'A gene mutation is a change in the DNA base sequence. A substitution swaps one base: it may be silent (the codon still codes for the same amino acid, because the code is redundant), missense (one amino acid changes), or nonsense (a stop codon forms early, giving a short protein). A substitution does not change the length of the reading frame. An insertion or deletion of one base shifts the reading frame: every codon after it changes (a frameshift), usually wrecking the protein. Changes in the amino acid sequence can change how the protein folds, its shape and its function.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Substitution: one base swapped</h2>'), C(3, '<p>GAG → GUG: glutamic acid becomes valine. That one change causes sickle cell anaemia.</p>'), C(8.5, '<p>Every other codon stays the same, and the protein is the same length.</p>')],
        board: [L(0.5, 'normal: <code>CUG ACU CCU <b>GAG</b> GAG</code> → Leu Thr Pro <b>Glu</b> Glu'), L(4, 'sickle: <code>CUG ACU CCU <b>GUG</b> GAG</code> → Leu Thr Pro <b>Val</b> Glu', 'missense', { hl: true }), L(8, '<span class="muted">same length; one amino acid different</span>')] },
      { dur: 13, card: [C(0, '<h2>Three outcomes of a substitution</h2>')],
        board: [L(0.5, '<b>silent</b>: GGU → GGC, both Gly: no change', 'redundant code'), L(3.5, '<b>missense</b>: one amino acid changes; effect depends on where'), L(6.5, '<b>nonsense</b>: UGG (Trp) → UGA (stop): protein cut short', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>Frameshift: insertion or deletion</h2>'), C(3, '<p>Delete one base and every codon after it is read out of step.</p>'), C(8, '<p>All the amino acids after the mutation can change, and a stop codon often appears. Usually the protein does not work at all.</p>')],
        board: [L(0.5, '<code>AUG GCU UCA AAG UAA</code> → Met Ala Ser Lys stop'), L(3.5, 'delete the 4th base:'), L(5, '<code>AUG CUU CAA AGU AA…</code> → Met Leu Gln Ser…', 'all changed', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>The chain examiners reward</h2>'), C(3, '<p>Base change → codon → amino acid → protein shape → function → symptom.</p>'), C(7, '<p>In 2025, top answers linked the mutation all the way to the shape of the protein, how it works, and the symptoms of cystic fibrosis.</p>')],
        board: [L(0.5, 'base change'), L(2, '→ codon change'), L(3.5, '→ amino acid change (or stop)'), L(5, '→ polypeptide folds differently'), L(6.5, '→ shape / active site changes'), L(8, '→ protein does not work → symptoms', '', { hl: true })] },
    ],
    example: {
      problem: 'Cystic fibrosis is often caused by deleting three bases (one codon) from the CFTR gene. Explain why this is not a frameshift, and why it still causes the disease.',
      steps: [
        { m: 'Deleting three bases removes exactly one codon, so the codons after it are still read in the right frame.', note: 'not a frameshift' },
        { m: 'One amino acid (phenylalanine) is missing from the CFTR protein; the rest are unchanged.', note: 'effect on sequence' },
        { m: 'The missing amino acid changes how the protein folds, so its shape is wrong.', note: 'shape' },
        { m: 'The faulty CFTR protein does not reach the membrane or work as a chloride channel, so mucus becomes thick and sticky: the symptoms of cystic fibrosis.', note: 'function → symptoms' },
      ],
    },
    faded() { return mutGen('missense')(); },
    grades: 'AMMMAE',
    gens: [
      P.terms([['mutation', 'A change in the base sequence of DNA.'], ['substitution', 'One base is replaced by another.'], ['silent mutation', 'A substitution that does not change the amino acid, because the code is redundant.'], ['missense mutation', 'A substitution that changes one amino acid.'], ['nonsense mutation', 'A substitution that makes an early stop codon.'], ['frameshift', 'An insertion or deletion that shifts how every following codon is read.']]),
      mutGen(),
      mutGen(),
      P.bank([
        { q: 'Why does a single-base insertion usually do more damage than a single-base substitution?', a: 'It shifts the reading frame, so every codon after it changes, not just one', why: 'A substitution affects one codon; a frameshift affects all the rest.', w: [['Insertions add an extra amino acid only', 'They shift every following codon.'], ['Substitutions never change amino acids', 'Missense ones do.'], ['Insertions only happen in stop codons', 'They can happen anywhere.']] },
        { q: 'A substitution changes one amino acid deep inside an enzyme’s active site. What is the likely effect?', a: 'The active site changes shape, so the substrate may no longer fit and the enzyme may not work', why: 'Where the change happens matters: the active site is the most sensitive region.', w: [['No effect, because only one amino acid changed', 'One change in the active site can stop the enzyme.'], ['The enzyme becomes shorter', 'Missense does not change length.'], ['The DNA cannot be transcribed', 'Transcription still happens.']] },
        { q: 'Why does a substitution not change the length of the polypeptide (unless it makes a stop codon)?', a: 'It does not shift the reading frame: the same number of codons are read', why: 'The 2025 Merit answers explained this.', w: [['Because ribosomes skip it', 'They read every codon.'], ['Because the mutation is repaired', 'Not necessarily.'], ['It does change the length', 'Only nonsense mutations shorten it.']] },
      ]),
      P.bank([
        { q: 'Why is a mutation in a gametic cell more significant for a family than one in a skin cell?', a: 'A gametic mutation can be inherited by the children; a skin cell mutation cannot', why: 'Somatic mutations stay in the person.', w: [['Skin cell mutations are always harmless', 'They can cause cancer.'], ['Gametic mutations are always harmful', 'They may be neutral.'], ['There is no difference', 'Only gametic mutations are passed on.']] },
        { q: 'Which mutation is most likely to have no effect?', a: 'A substitution in the third base of a codon', why: 'Third-base changes are often silent, because of the code’s redundancy.', w: [['A deletion near the start of the gene', 'A frameshift there changes almost everything.'], ['A nonsense mutation near the start', 'A very short protein is rarely functional.'], ['An insertion in the middle of the gene', 'Frameshift from there on.']] },
      ]),
      P.bank([
        { q: 'A missense mutation swaps a charged amino acid for a non-charged one on the surface of haemoglobin, and the molecules stick together into fibres. What does this show?', a: 'One amino acid change can alter how proteins fold and interact, changing their function', why: 'That is sickle cell anaemia: Glu → Val makes haemoglobin molecules stick together, distorting red blood cells.', w: [['Missense mutations never matter', 'This one matters a great deal.'], ['The gene has been deleted', 'Only one base changed.'], ['The mutation was a frameshift', 'It was a substitution.']] },
        { q: 'Two people have different substitutions in the same gene. One is healthy; one has a genetic disease. What is the best explanation?', a: 'One substitution is silent or changes a non-critical amino acid; the other changes an amino acid that is critical to the protein’s shape', why: 'The effect depends on what the new codon codes for and where in the protein it is.', w: [['One of them must be a frameshift', 'Both are substitutions.'], ['The healthy person has two copies of the gene', 'Everyone has two copies.'], ['Diseases are not caused by substitutions', 'Many are, e.g. sickle cell.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      'Classify the mutation precisely: <span class="pen">substitution (silent, missense, nonsense)</span> or insertion/deletion (frameshift).',
      'The 2025 report: most answers explained the change in amino acid sequence but forgot to say the other amino acids and the length of the chain were unchanged. Say both.',
      'For Excellence, link all the way: base → codon → amino acid → shape → function → symptoms.',
      'Translate the mutated mRNA with the codon table; show the old and new amino acid side by side.',
    ],
    aim: {
      intro: `<div class="resource">Part of a normal mRNA for an enzyme reads <code>AUG UUU GGA UGG CAA</code> (Met–Phe–Gly–Trp–Gln). Two mutations are found in different people:<br>Mutation 1: <code>AUG UUU GGC UGG CAA</code><br>Mutation 2: <code>AUG UUU GGA UGA CAA</code><br>Codon table: ${chart(['AUG', 'UUU', 'GGA', 'GGC', 'UGG', 'UGA', 'CAA'])}</div>`,
      parts: [
        { q: 'Identify the type of each mutation, and describe what a substitution is.', write: true, words: '30–50',
          model: [S('Both are substitutions: one base has been replaced by another.', 'definition', true), S('Mutation 1 is a silent substitution: GGA and GGC both code for glycine.', 'mutation 1', true), S('Mutation 2 is a nonsense substitution: UGG (Trp) has become UGA, a stop codon.', 'mutation 2', true)],
          earns: 'Achieved: a correct definition and both mutations identified.',
          crit: { A: 'Substitution = one base replaced; mutation 1 silent; mutation 2 nonsense (stop codon).' } },
        { q: 'Explain how each mutation affects the amino acid sequence.', write: true, words: '60–90',
          model: [S('Mutation 1 changes GGA to GGC, but both code for glycine because the code is redundant.', 'mutation 1', true), S('So the amino acid sequence is unchanged (Met–Phe–Gly–Trp–Gln), and the protein is the same length.', 'result 1'), S('Mutation 2 changes UGG (tryptophan) to UGA, a stop codon.', 'mutation 2', true), S('Translation stops early, so the polypeptide is only Met–Phe–Gly: shorter, missing all amino acids after that point.', 'result 2', true)],
          earns: 'Merit: each mutation is linked to its effect on the amino acid sequence and the length of the chain.',
          crit: { M: 'Explains mutation 1 still codes Gly (redundancy) → same sequence; mutation 2 creates stop → translation ends early → shortened polypeptide.' } },
        { q: 'Discuss which person is likely to have a working enzyme, linking each mutation to the enzyme’s shape and function.', write: true, words: '100–140',
          model: [S('Person 1’s enzyme has exactly the same amino acid sequence, so it folds into the same shape.', 'person 1: sequence → shape', true), S('Its active site is unchanged, so the substrate still fits and the enzyme works normally.', 'person 1: function'), S('Person 2’s polypeptide stops after three amino acids, so most of the enzyme is missing.', 'person 2: sequence', true), S('It cannot fold into the right 3D shape and will have no proper active site, so it cannot catalyse the reaction.', 'person 2: shape → function', true), S('So person 1 almost certainly has a working enzyme and person 2 does not. Person 2 may still be healthy if their other copy of the gene is normal and makes enough enzyme.', 'justified judgement')],
          earns: 'Excellence: each mutation is followed through sequence, shape and function, the two people are compared, and the judgement is qualified sensibly.',
          crit: { M: 'Explains person 1’s enzyme works (same sequence) and person 2’s does not (shortened).', E: 'Links each mutation through amino acid sequence → folding/shape → active site → function, compares the two, and qualifies the conclusion (e.g. second allele).' } },
      ],
      up: [
        up(1, ['Mutation 1 does not change the amino acids. Mutation 2 makes a stop codon.'], [
          ['Explain both: GGA and GGC both code for glycine (redundancy) so the sequence and length are unchanged; the stop codon ends translation early so the chain is shorter', 1, 'Right. The effects are stated; Merit explains why, and what happens to the chain.'],
          ['Say both are substitutions', 0, 'That was part (a).'],
          ['Write the codon table again', 0, 'Use it to explain.'],
          ['Say mutation 2 is worse', 0, 'Part (c) asks that; here explain the sequences.']]),
        up(2, ['Person 1 has a working enzyme because the amino acids are the same. Person 2 does not because the protein is short.'], [
          ['Link each through shape and the active site to function, and qualify the judgement (person 2 may have a normal second allele)', 1, 'Right. The verdicts are right, but Excellence links sequence to shape to function, and qualifies the conclusion.'],
          ['Name the enzyme', 0, 'Not given, and not the missing reasoning.'],
          ['Say mutations are random', 0, 'True, not relevant.'],
          ['Repeat part (b)', 0, 'Go further: shape and function.']]),
      ],
    },
  });
  function mutGen(force) {
    return () => {
      let type = force || R.pick(['silent', 'missense', 'nonsense', 'insertion', 'deletion']), m, res;
      for (let g = 0; g < 50; g++) { m = 'AUG' + randMRNA(4) + 'UAA'; res = mutate(m, type); if (res) break; }
      if (!res) { type = 'missense'; res = mutate(m, type); }
      const a0 = translate(m).filter((x) => x !== 'Stop'), a1 = translate(res.mm).filter((x) => x !== 'Stop');
      const fig = `${Bio.seq('normal mRNA', m)}${Bio.seq('mutated mRNA', res.mm.length % 3 ? res.mm + '…' : res.mm)}${chart(codonsOf(m).concat(codonsOf(res.mm)))}`;
      const choices = ['silent', 'missense', 'nonsense', type === 'deletion' ? 'deletion' : 'insertion'].map((t) => ({ t: MUTNAME[t], ok: t === type, why: t === type ? null : { silent: 'A silent change keeps the same amino acid.', missense: 'Missense changes one amino acid and keeps the length.', nonsense: 'Nonsense makes an early stop codon.', insertion: 'An insertion adds a base and shifts the frame.', deletion: 'A deletion removes a base and shifts the frame.' }[t] }));
      return P.mcq({ prompt: 'Compare the two mRNA sequences. What type of mutation is this?', fig, more: { steps: [St(`Normal: ${a0.join('–')}.`), St(`Mutated: ${a1.join('–')}${res.mm.length !== m.length ? ' (the codons after the change are read out of step)' : ''}.`), St(type === 'silent' ? 'One base changed, but the codon still codes for the same amino acid: silent.' : type === 'missense' ? 'One base changed, and one amino acid changed; the length is the same: missense.' : type === 'nonsense' ? 'One base changed, and the codon became a stop codon: nonsense. The chain is shorter.' : `A base was ${type === 'insertion' ? 'added' : 'removed'}, so every codon after it changed: a frameshift.`)], trap: 'Classifying by the base change alone. Translate both and compare the amino acids.' } }, choices);
    };
  }

  /* ======================= 22. Metabolic pathways ======================= */
  const PATHS = [
    { name: 'chlorophyll', steps: ['precursor', 'intermediate', 'chlorophyll'], org: 'a plant', show: (miss) => (miss ? 'yellow leaves (chlorosis)' : 'green leaves') },
    { name: 'melanin', steps: ['tyrosine', 'DOPA', 'melanin'], org: 'a mouse', show: (miss) => (miss ? 'white (albino) fur' : 'dark fur') },
    { name: 'red eye pigment', steps: ['precursor', 'brown pigment', 'red pigment'], org: 'a fruit fly', show: (miss) => (miss ? 'brown or white eyes' : 'red eyes') },
  ];
  P.addUnit({
    id: 'pathways', title: 'Metabolic pathways', mins: 10,
    blurb: 'Gene makes enzyme, enzyme makes step. Block a step and the product goes missing.',
    recap: 'A metabolic pathway is a series of reactions, each catalysed by a different enzyme, turning a starting substance (precursor) into a final product. Each enzyme is coded for by a gene. If a mutation stops gene 2 making a working enzyme 2, the pathway is blocked at step 2: the substance before the block (the substrate of enzyme 2) can build up, and nothing after the block is made. Adding the missing product, or an intermediate after the block, can restore the phenotype; adding one before the block cannot. Environmental factors, such as a missing co-factor like magnesium, can block a step too.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>One gene, one enzyme, one step</h2>'), C(3, '<p>Gene 1 codes for enzyme 1, which turns the precursor into an intermediate. Gene 2 codes for enzyme 2, which turns the intermediate into the product.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const xs = [0.12, 0.5, 0.88].map((x) => x * W); const y = H * 0.55; const names = ['precursor', 'intermediate', 'product'];
          xs.forEach((x, k) => { a.round(x - W * 0.12, y - 22, W * 0.24, 44, 10, { fill: k === 2 ? c.c3 : c.sheet, stroke: c.ink, alpha: a.seg(a.p, k * 0.2, k * 0.2 + 0.1) }); a.text(names[k], x, y, { align: 'center', size: 0.78, font: 'head', alpha: a.seg(a.p, k * 0.2, k * 0.2 + 0.1), col: k === 2 ? c.paper : c.ink }); });
          [0, 1].forEach((k) => { a.arrow(xs[k] + W * 0.12, y, xs[k + 1] - W * 0.12, y, c.ink, 2.5, a.seg(a.p, 0.15 + k * 0.2, 0.25 + k * 0.2)); a.text(`enzyme ${k + 1}`, (xs[k] + xs[k + 1]) / 2, y - 32, { align: 'center', font: 'pen', col: c.pen, alpha: a.seg(a.p, 0.15 + k * 0.2, 0.25 + k * 0.2) }); a.text(`↑ gene ${k + 1}`, (xs[k] + xs[k + 1]) / 2, y + 40, { align: 'center', size: 0.75, col: c.muted, alpha: a.seg(a.p, 0.5, 0.6) }); });
        } },
      { dur: 14, card: [C(0, '<h2>Block step 2</h2>'), C(3, '<p>Gene 2 is mutated, so enzyme 2 does not work.</p>'), C(7, '<p>The intermediate piles up. No product is made, so the phenotype changes.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const xs = [0.12, 0.5, 0.88].map((x) => x * W); const y = H * 0.5; const names = ['precursor', 'intermediate', 'product'];
          xs.forEach((x, k) => { a.round(x - W * 0.12, y - 22, W * 0.24, 44, 10, { fill: k === 1 ? c.hl : c.sheet, stroke: c.ink, alpha: k === 2 ? 0.3 : 1 }); a.text(names[k], x, y, { align: 'center', size: 0.78, font: 'head', alpha: k === 2 ? 0.3 : 1 }); });
          a.arrow(xs[0] + W * 0.12, y, xs[1] - W * 0.12, y, c.ink, 2.5);
          a.arrow(xs[1] + W * 0.12, y, xs[2] - W * 0.12, y, c.muted, 2.5, 0.4);
          const bx = (xs[1] + xs[2]) / 2; a.line(bx - 12, y - 12, bx + 12, y + 12, c.pen, 4); a.line(bx + 12, y - 12, bx - 12, y + 12, c.pen, 4);
          a.text('builds up', xs[1], y + 46, { align: 'center', font: 'pen', col: c.pen, alpha: a.seg(a.p, 0.4, 0.5) });
          a.text('none made', xs[2], y + 46, { align: 'center', font: 'pen', col: c.pen, alpha: a.seg(a.p, 0.5, 0.6) });
        } },
      { dur: 12, card: [C(0, '<h2>Real examples</h2>')],
        board: [L(0.5, '<b>chlorophyll</b>: a gene mutation, or a lack of magnesium (a co-factor), blocks a step → yellow leaves'), L(3.5, '<b>albinism</b>: tyrosinase gene mutated → no melanin'), L(6, '<b>PKU</b>: enzyme that converts phenylalanine missing → phenylalanine builds up', '', { hl: true })] },
    ],
    example: {
      problem: 'In a plant, gene 1 codes for enzyme 1 (precursor → intermediate) and gene 2 codes for enzyme 2 (intermediate → chlorophyll). A plant has yellow leaves. Explain how a mutation in gene 1 could cause this.',
      steps: [
        { m: 'A mutation in gene 1 changes the base sequence, so enzyme 1 has the wrong amino acid sequence.', note: 'gene → enzyme' },
        { m: 'Enzyme 1 folds into the wrong shape, so its active site no longer fits the precursor.', note: 'shape' },
        { m: 'The precursor is not converted to the intermediate, so enzyme 2 has no substrate.', note: 'blocks the pathway' },
        { m: 'No chlorophyll is made, so the leaves are pale or yellowish (chlorosis): other pigments show without the green.', note: 'phenotype' },
      ],
    },
    faded() { return pathGen()(); },
    grades: 'AMMMM',
    gens: [
      P.terms([['metabolic pathway', 'A series of enzyme-controlled reactions that turns a precursor into a final product.'], ['precursor', 'The starting substance in a metabolic pathway.'], ['intermediate', 'A substance made part-way along a pathway.'], ['one gene–one enzyme', 'Each enzyme in a pathway is coded for by its own gene.'], ['co-factor', 'A non-protein substance, such as a magnesium ion, that some enzymes need to work.']]),
      pathGen(),
      pathGen(true),
      P.bank([
        { q: 'A plant has yellow leaves. Its genes are normal, but the soil lacks magnesium. Why are the leaves yellow?', a: 'Magnesium is needed for an enzyme in the chlorophyll pathway, so the pathway is blocked and chlorophyll is not made', why: 'The 2025 exam asked exactly this: an environmental factor affecting enzyme 2.', w: [['Magnesium is a mutation', 'Magnesium is a nutrient, not a mutation.'], ['The genes are switched off by sunlight', 'Not the reason.'], ['Yellow is the dominant colour', 'This is not about dominance.']] },
        { q: 'A person with PKU cannot convert phenylalanine to tyrosine. Why do they follow a low-phenylalanine diet?', a: 'Phenylalanine builds up before the blocked step and is harmful, so less is eaten', why: 'The substance before the block accumulates.', w: [['To make more tyrosine', 'Less phenylalanine does not make tyrosine.'], ['To repair the gene', 'Diet cannot change the gene.'], ['Because phenylalanine is the final product', 'It is the substrate of the blocked enzyme.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: how a gene mutation leads to albino fur.', steps: ['A mutation changes the base sequence of the tyrosinase gene', 'The enzyme has a different amino acid sequence', 'It folds into a different shape and its active site no longer fits its substrate', 'Melanin is not made', 'The fur is white (albino)'] },
      ]),
    ],
    tips: [
      'Draw the pathway with each <span class="pen">gene → enzyme → step</span> labelled.',
      'Before the block: substance builds up. After the block: nothing is made.',
      'The 2025 report: many candidates only restated the resource. Explain the link between genes and enzymes, and between each enzyme and its step.',
      'Environmental factors, such as missing magnesium, can block a step too. Merit in 2025 linked magnesium to enzyme 2 and chlorophyll.',
    ],
    aim: {
      intro: '<div class="resource">In a plant, gene A codes for enzyme A, which converts a colourless precursor into a yellow pigment. Gene B codes for enzyme B, which converts the yellow pigment into chlorophyll. Enzyme B needs magnesium ions to work. Plant 1 has a mutation in gene A. Plant 2 has normal genes but grows in soil lacking magnesium.</div>',
      parts: [
        { q: 'Describe what a metabolic pathway is, using this example.', write: true, words: '30–50',
          model: [S('A metabolic pathway is a series of reactions, each catalysed by a different enzyme.', 'definition', true), S('Here, enzyme A converts the precursor into yellow pigment, and enzyme B converts the yellow pigment into chlorophyll.', 'applied', true), S('Each enzyme is coded for by its own gene (gene A and gene B).', 'gene–enzyme')],
          earns: 'Achieved: a correct definition applied to the example.',
          crit: { A: 'Series of enzyme-controlled reactions; precursor → yellow pigment (enzyme A) → chlorophyll (enzyme B); genes code for enzymes.' } },
        { q: 'Explain why plant 1 has no chlorophyll.', write: true, words: '60–90',
          model: [S('The mutation in gene A changes the base sequence, so enzyme A has a different amino acid sequence.', 'gene → enzyme', true), S('Enzyme A folds into a different shape and its active site no longer fits the precursor.', 'shape'), S('So no yellow pigment is made, and enzyme B has no substrate.', 'blocks step 1', true), S('No chlorophyll is made, so the leaves are pale.', 'phenotype', true)],
          earns: 'Merit: the mutation is linked through the enzyme to the blocked pathway and the missing product.',
          crit: { M: 'Explains gene A mutated → enzyme A wrong shape → precursor not converted → no yellow pigment → no chlorophyll.' } },
        { q: 'Discuss how the leaves of plant 1 and plant 2 would differ in colour, and explain how a gardener could tell the two causes apart.', write: true, words: '100–140',
          model: [S('Plant 1: enzyme A does not work, so the precursor is not converted. No yellow pigment and no chlorophyll: the leaves are pale or colourless.', 'plant 1', true), S('Plant 2: enzyme A works, so yellow pigment is made. Without magnesium, enzyme B cannot work, so yellow pigment builds up and is not turned into chlorophyll: the leaves are yellow.', 'plant 2', true), S('So the colour differs because the block is at a different step of the pathway.', 'compares'), S('The gardener could add magnesium to the soil. Plant 2 would turn green, because enzyme B would start working.', 'test', true), S('Plant 1 would stay pale, because its problem is a faulty enzyme A caused by its gene, which magnesium cannot fix.', 'justified distinction')],
          earns: 'Excellence: the two blocks are compared step by step, the colours are predicted from the pathway, and a test that separates genetic and environmental causes is justified.',
          crit: { M: 'Explains plant 2 lacks chlorophyll because enzyme B needs magnesium.', E: 'Compares where each block is, predicts pale (no pigment) vs yellow (pigment builds up), and justifies adding magnesium to tell genetic from environmental causes.' } },
      ],
      up: [
        up(1, ['Gene A is mutated so there is no chlorophyll.'], [
          ['Link the steps: the mutation changes enzyme A’s amino acids and shape, so the precursor is not converted, enzyme B has no substrate, and no chlorophyll is made', 1, 'Right. Merit needs the chain between the mutation and the missing chlorophyll.'],
          ['Say chlorophyll is green', 0, 'True, not explanation.'],
          ['Describe gene B', 0, 'Gene B is normal in plant 1.'],
          ['Say the plant will die', 0, 'Not asked.']]),
        up(2, ['Both plants have no chlorophyll. Plant 1 has a gene problem and plant 2 has a soil problem.'], [
          ['Compare where each block is (step A vs step B), predict the different colours from the pathway, and justify a test such as adding magnesium', 1, 'Right. The causes are named, but Excellence compares the pathways and justifies how to tell them apart.'],
          ['Say both plants are yellow', 0, 'Plant 1 lacks the yellow pigment too.'],
          ['Add water to the soil', 0, 'Not the missing factor.'],
          ['Name the mutation type', 0, 'Not relevant to telling them apart.']]),
      ],
    },
  });
  function pathGen(supp) {
    return () => { const p = R.pick(PATHS); const blocked = R.pick([1, 2]); const [s0, s1, s2] = p.steps;
      if (!supp) { const builds = blocked === 1 ? s0 : s1;
        return P.mcq({ prompt: `In ${p.org}, gene 1 codes for enzyme 1 (${s0} → ${s1}) and gene 2 codes for enzyme 2 (${s1} → ${s2}). Gene ${blocked} has a mutation that stops its enzyme working. Which substance builds up?`, more: { steps: [St(`Enzyme ${blocked} does not work, so its substrate, ${builds}, is not converted.`), St(`${builds} builds up, and nothing after the block (${blocked === 1 ? `${s1} and ${s2}` : s2}) is made.`)], trap: 'Choosing the product. The product is missing; the substance before the block builds up.' } },
          P.uniq([{ t: builds, ok: true }, { t: s2, why: `${s2} is after the block, so it is not made at all.` }, { t: blocked === 1 ? s1 : s0, why: blocked === 1 ? `${s1} is made by enzyme 1, which is not working.` : `${s0} is converted normally by enzyme 1, so it does not build up.` }])); }
      const fixes = blocked === 1 ? [s1, s2] : [s2];
      const ans = blocked === 1 ? `${s1} (or ${s2})` : s2;
      return P.mcq({ prompt: `In ${p.org}, gene 1 codes for enzyme 1 (${s0} → ${s1}) and gene 2 codes for enzyme 2 (${s1} → ${s2}). Gene ${blocked} is mutated, giving ${p.show(true)}. Which substance, if supplied, would give ${p.show(false)}?`, more: { steps: [St(`The block is at step ${blocked}.`), St(`Only a substance after the block can be used: ${fixes.join(' or ')}.`), St(`${s0}${blocked === 2 ? ` or ${s1}` : ''} is before the block, so it would just build up.`)] } },
        P.uniq([{ t: ans, ok: true }, { t: s0, why: `${s0} is before the block; the faulty enzyme still cannot convert it.` }, { t: blocked === 1 ? 'None of them' : s1, why: blocked === 1 ? 'Anything after the block works.' : `${s1} is the substrate of the faulty enzyme 2; it would just build up.` }])); };
  }

  /* ======================= 23. Genes and the environment ======================= */
  P.addUnit({
    id: 'gene-env', title: 'Genes and the environment', mins: 9,
    blurb: 'Phenotype = genotype + environment. Temperature-sensitive enzymes, nutrition, soil pH.',
    recap: 'An organism’s phenotype depends on its genotype and its environment interacting. Genes set the range of what is possible; the environment affects where in that range the organism ends up. Example: Himalayan rabbits have an allele for an enzyme that makes dark pigment but is inactive above about 35 °C (its shape is altered at that temperature), so only the cold extremities (ears, nose, paws) are dark. Other examples: hydrangea flower colour depends on soil pH; plant height depends on light and nutrients; identical twins can differ because of their environments.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>The Himalayan rabbit</h2>'), C(3, '<p>Its pigment enzyme only works below about 35 °C.</p>'), C(7.5, '<p>Ears, nose, feet and tail are cooler, so they are dark. The warm body is white.</p>'), C(11, '<p>Shave a patch and put an ice pack on it: the fur grows back dark.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const cx = W * 0.5, cy = H * 0.58;
          a.ellipse(cx, cy, W * 0.26, H * 0.2, { fill: c.sheet, stroke: c.ink });
          a.ellipse(cx + W * 0.24, cy - H * 0.12, W * 0.1, H * 0.1, { fill: c.sheet, stroke: c.ink });
          a.ellipse(cx + W * 0.22, cy - H * 0.3, W * 0.025, H * 0.12, { fill: c.ink, stroke: c.ink, rot: -0.3 }); a.ellipse(cx + W * 0.28, cy - H * 0.3, W * 0.025, H * 0.12, { fill: c.ink, stroke: c.ink, rot: 0.2 });
          a.ellipse(cx + W * 0.33, cy - H * 0.12, W * 0.02, H * 0.03, { fill: c.ink, stroke: false });
          [-0.18, 0.12].forEach((dx) => a.ellipse(cx + W * dx, cy + H * 0.2, W * 0.04, H * 0.04, { fill: c.ink, stroke: false }));
          a.ellipse(cx - W * 0.26, cy - H * 0.02, W * 0.03, H * 0.04, { fill: c.ink, stroke: false });
          a.alpha(a.seg(a.p, 0.75, 0.85), () => { a.ellipse(cx - W * 0.04, cy - H * 0.04, W * 0.06, H * 0.05, { fill: c.ink, stroke: c.c1, lw: 3 }); a.text('ice pack → dark fur', cx - W * 0.04, cy + H * 0.34, { align: 'center', font: 'pen', col: c.c1 }); });
          a.text('cool parts: enzyme works', W * 0.04, H * 0.08, { font: 'pen', col: c.pen, alpha: a.seg(a.p, 0.4, 0.5) });
        } },
      { dur: 12, card: [C(0, '<h2>More examples</h2>')],
        board: [L(0.5, '<b>hydrangeas</b>: same plant, blue flowers in acid soil, pink in alkaline soil'), L(3.5, '<b>height</b>: genes for tall + poor nutrition → shorter than possible'), L(6.5, '<b>identical twins</b>: same genotype; differences come from environment', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain why a Himalayan rabbit has dark ears but a white body.',
      steps: [
        { m: 'The rabbit has an allele for an enzyme that makes dark pigment (melanin).', note: 'genotype' },
        { m: 'This enzyme is temperature-sensitive: it works below about 35 °C but its shape is altered and it is inactive at body-core temperature. New enzyme made in cooler skin works.', note: 'enzyme property' },
        { m: 'The ears lose heat and are cooler than the body, so the enzyme works there and makes pigment.', note: 'environment' },
        { m: 'So the phenotype depends on the genotype and the environment (temperature) interacting.', note: 'interaction' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: why a patch of shaved Himalayan rabbit fur grows back dark under an ice pack.', steps: ['The rabbit has the allele for a temperature-sensitive pigment enzyme', 'The ice pack cools the skin below about 35 °C', 'In the cool skin, the enzyme keeps its working shape', 'It catalyses the making of dark pigment', 'The new fur in that patch grows dark'] }], 2)(); },
    grades: 'AAMM',
    gens: [
      P.terms([['phenotype', 'The characteristics an organism shows, resulting from genotype and environment.'], ['genotype', 'The alleles an organism has.'], ['temperature-sensitive enzyme', 'An enzyme that works only within a certain temperature range.'], ['environmental factor', 'Something outside the genes, such as temperature, soil pH or diet, that affects the phenotype.'], ['identical twins', 'Twins from one fertilised egg, with the same genotype.']]),
      P.bank([
        { q: 'Hydrangeas of the same variety have blue flowers in one garden and pink in another. What is the most likely cause?', a: 'Different soil pH affecting the flower pigments', why: 'Same genotype; the environment (soil) changes the phenotype.', w: [['Different genotypes', 'Same variety, same genotype.'], ['Mutations in each garden', 'Too unlikely to be the cause.'], ['Codominance', 'Not the explanation here.']] },
        { q: 'Identical twins raised apart differ in height by 8 cm. What does this show?', a: 'The environment, such as nutrition, affects phenotype as well as genotype', why: 'Same genotype, different environments, different phenotypes.', w: [['They are not really identical', 'They have the same genotype.'], ['Height is controlled only by genes', 'Then they would be the same height.'], ['One has a mutation for height', 'Unnecessary: environment explains it.']] },
        { q: 'Why does a Himalayan rabbit kept somewhere very cold develop more dark fur?', a: 'More of its skin is below the temperature at which the pigment enzyme works', why: 'The enzyme is active in more places, so more pigment is made.', w: [['The cold causes a mutation', 'Cold does not change the allele.'], ['Dark fur is dominant in the cold', 'Dominance does not change with temperature.'], ['It eats more pigment', 'Pigment is made by an enzyme.']] },
      ]),
      P.bank([
        { q: 'Two genetically identical cuttings of a plant are grown, one in rich soil and one in poor soil. The first grows tall; the second stays short. What is the best conclusion?', a: 'The genotype allows tall growth, but the environment decides whether it is reached', why: 'Genes set the potential; environment affects how much is expressed.', w: [['The short plant has a different genotype', 'Cuttings have the same genotype.'], ['Soil changed the genes', 'Soil does not change genes.'], ['Height is purely environmental', 'Genes matter too: a short variety would not grow tall even in rich soil.']] },
        { q: 'How could a scientist show that a feature is affected by the environment, not only by genes?', a: 'Grow genetically identical organisms in different conditions and compare their phenotypes', why: 'Holding genotype constant isolates the effect of the environment.', w: [['Compare unrelated organisms in the same conditions', 'That changes the genotype, not the environment.'], ['Count the chromosomes', 'Not informative here.'], ['Look at one organism once', 'No comparison.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: why a Himalayan rabbit’s body fur is white.', steps: ['The rabbit has the allele for a temperature-sensitive pigment enzyme', 'Its body core is warmer than about 35 °C', 'At this temperature the enzyme’s active site changes shape', 'The enzyme cannot catalyse pigment production', 'No pigment is made, so the body fur is white'] },
      ]),
    ],
    tips: [
      'Write the idea in full: <span class="pen">phenotype results from genotype and environment interacting</span>.',
      'For temperature-sensitive enzymes, link temperature to enzyme shape and the active site, then to pigment and phenotype.',
      'Use identical genotypes (twins, cuttings, clones) as evidence that the environment matters.',
      'Achieved in 2025: describing that genes and the environment interact to produce a phenotype.',
    ],
    aim: {
      intro: '<div class="resource">Siamese cats are born white all over. As they grow, their ears, face, paws and tail become dark. A Siamese cat that spends winter outdoors in Canterbury becomes darker overall than its littermate kept in a warm house.</div>',
      parts: [
        { q: 'Describe what is meant by the statement “phenotype is the result of genotype and environment”.', write: true, words: '30–50',
          model: [S('The genotype is the set of alleles an organism has; it sets what features are possible.', 'genotype', true), S('The environment, such as temperature or diet, affects how those genes are expressed.', 'environment', true), S('So the observable features (phenotype) depend on both together.', 'interaction')],
          earns: 'Achieved: genotype, environment and their interaction described correctly.',
          crit: { A: 'Defines genotype and environment and states both affect the phenotype.' } },
        { q: 'Explain why Siamese kittens are born white and later develop dark points.', write: true, words: '60–90',
          model: [S('Siamese cats have an allele for a temperature-sensitive enzyme that makes dark pigment.', 'genotype', true), S('In the uterus the kitten is kept warm all over, so the enzyme is inactive and no pigment is made: the kitten is white.', 'why white at birth', true), S('After birth, the extremities (ears, face, paws, tail) lose more heat and are cooler.', 'environment changes'), S('The enzyme works in these cool areas, so pigment is made there and the points turn dark.', 'linked conclusion', true)],
          earns: 'Merit: the enzyme’s temperature sensitivity is linked to both the white newborn and the dark points.',
          crit: { M: 'Explains temperature-sensitive enzyme; warm uterus → inactive → white; cooler extremities after birth → enzyme active → dark points.' } },
        { q: 'Discuss why the outdoor cat becomes darker than its littermate, and what this shows about genes and the environment.', write: true, words: '100–140',
          model: [S('Littermates of the same breed carry the same allele for the temperature-sensitive enzyme.', 'same genotype for the trait', true), S('Outdoors in a Canterbury winter, more of the cat’s skin falls below the temperature at which the enzyme works.', 'environment', true), S('Below that temperature the enzyme keeps its working shape and its active site catalyses pigment production, so dark fur grows over a larger area.', 'mechanism'), S('In the warm house, only the coolest extremities are cold enough, so the indoor cat stays paler.', 'contrast'), S('This shows that the genotype gives the ability to make pigment, but the environment (temperature) decides where and how much it is expressed: the phenotype comes from both interacting.', 'justified conclusion', true)],
          earns: 'Excellence: the two cats are compared through the enzyme mechanism, and a clear general conclusion about gene–environment interaction is justified.',
          crit: { M: 'Explains colder environment → enzyme works in more of the skin → more dark fur.', E: 'Compares the cats (same allele, different temperatures), links temperature to enzyme shape/activity and pigment, and concludes about gene–environment interaction.' } },
      ],
      up: [
        up(1, ['The kittens are white because it is warm inside the mother. Later the cold parts go dark.'], [
          ['Name and explain the cause: an allele for a temperature-sensitive pigment enzyme that is inactive when warm and works in the cooler extremities', 1, 'Right. The pattern is described, but Merit explains it with the enzyme.'],
          ['Say Siamese cats are a breed', 0, 'Not explanation.'],
          ['Say dark is dominant', 0, 'Not the mechanism.'],
          ['Describe the colours again', 0, 'That restates the resource.']]),
        up(2, ['The outdoor cat is colder so it gets darker. This shows the environment affects phenotype.'], [
          ['Compare through the mechanism (same allele, enzyme active over more of the colder skin) and conclude that phenotype comes from genotype and environment interacting', 1, 'Right. The idea is there; Excellence explains it through the enzyme and states the general conclusion.'],
          ['Say Canterbury is cold', 0, 'That is in the resource.'],
          ['Say the outdoor cat has a different gene', 0, 'Littermates share this allele; the point is environment.'],
          ['Define genotype again', 0, 'That was part (a).']]),
      ],
    },
  });
})();
