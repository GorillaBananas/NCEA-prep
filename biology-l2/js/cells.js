/* AS 91156 (Biology 2.4) Demonstrate understanding of life processes at the cellular level.
   Scope from the NZQA 2026 assessment specifications: photosynthesis (light-dependent and light-independent),
   aerobic and anaerobic respiration, enzymes and the factors that affect them (temperature, pH, substrate
   concentration, co-factors, co-enzymes, inhibitors), DNA replication in cell division (antiparallel strands,
   complementary base pairing, semi-conservative), movement of materials (including facilitated diffusion).
   Exam tips draw on the 2025 NZQA assessment report. */
(function () {
  const P = NP, R = P.R, Bio = P.bio;
  const C = (at, html) => ({ at, html });
  const L = (at, html, note, o = {}) => Object.assign({ at, html: `<span class="bq">${html}</span>`, note }, o);
  const S = (m, note, key) => ({ m, note, key: !!key });
  const up = (part, shown, choices, ask) => ({ part, shown, ask, choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });
  const St = (say, m) => ({ say, m });
  const sub = (s) => s.replace(/(\d)/g, '<sub>$1</sub>');
  const CO2 = 'CO<sub>2</sub>', O2 = 'O<sub>2</sub>', H2O = 'H<sub>2</sub>O', GLU = 'C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>';

  /* ======================= 1. Photosynthesis and the chloroplast ======================= */
  P.addUnit({
    id: 'photosynthesis', title: 'Photosynthesis and the chloroplast', mins: 9,
    blurb: 'What goes in, what comes out, and where. These are the first Achieved marks.',
    recap: 'Photosynthesis uses light energy, absorbed by chlorophyll in chloroplasts, to turn carbon dioxide and water into glucose. Oxygen is released as a by-product. The light energy ends up stored as chemical energy in glucose, which the plant uses for respiration and to build starch, cellulose and other molecules.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Photosynthesis turns light energy into chemical energy.</h2>'), C(3.5, `<p>In: carbon dioxide (through the stomata) and water (from the roots). Out: glucose, and oxygen as a by-product.</p>`), C(9, '<p>Chlorophyll in the chloroplasts captures the light.</p>')],
        draw(a) {
          const { W, H, C: c } = a, cx = W * 0.5, cy = H * 0.52;
          Bio.cv.chloroplast(a, cx, cy, W * 0.46, H * 0.36, a.seg(a.p, 0, 0.15));
          a.text('chloroplast', cx - 12, cy + H * 0.25, { align: 'right', font: 'pen', col: c.c3, alpha: a.seg(a.p, 0.1, 0.2) });
          const al = (s) => a.seg(a.p, s, s + 0.12);
          for (let k = 0; k < 3; k++) a.arrow(W * (0.14 + k * 0.07), H * 0.1, W * (0.3 + k * 0.05), H * 0.36, c.c2, 3, al(0.18));
          a.text('light', W * 0.12, H * 0.08, { font: 'pen', col: c.c2, alpha: al(0.18) });
          a.arrow(W * 0.04, cy, cx - W * 0.24, cy, c.ink, 2.5, al(0.32)); a.text(`CO₂`, W * 0.05, cy - 16, { alpha: al(0.32), font: 'head' });
          a.arrow(cx, H * 0.96, cx, cy + H * 0.19, c.c1, 2.5, al(0.42)); a.text('H₂O', cx + 10, H * 0.92, { alpha: al(0.42), font: 'head', col: c.c1 });
          a.arrow(cx + W * 0.24, cy - 14, W * 0.96, cy - 40, c.c3, 2.5, al(0.6)); a.text('glucose', W * 0.97, cy - 58, { alpha: al(0.6), font: 'head', col: c.c3, align: 'right' });
          a.arrow(cx + W * 0.24, cy + 14, W * 0.96, cy + 40, c.muted, 2.5, al(0.72)); a.text('O₂ (by-product)', W * 0.97, cy + 60, { alpha: al(0.72), font: 'head', col: c.muted, align: 'right' });
        } },
      { dur: 12, card: [C(0, '<h2>Learn the equation both ways.</h2>'), C(3, '<p>The word equation is enough for Achieved. The balanced equation shows you know it in detail.</p>'), C(8, '<p>Light and chlorophyll go over the arrow: they are needed, but they are not reactants.</p>')],
        board: [L(0.5, `carbon dioxide + water <span class="pen">→</span> glucose + oxygen`, 'word equation'), L(3.5, `6${CO2} + 6${H2O} → ${GLU} + 6${O2}`, 'balanced', { hl: true }), L(7, '<span class="muted">over the arrow: light energy, chlorophyll</span>')] },
      { dur: 13, card: [C(0, '<h2>Inside the chloroplast</h2>'), C(3, '<p>Thylakoids are flat membrane sacs, stacked into grana. Chlorophyll sits in the thylakoid membranes: the light-dependent stage happens here.</p>'), C(8.5, '<p>The stroma is the fluid around them. It holds the enzymes for the light-independent stage.</p>')],
        draw(a) {
          const { W, H, C: c } = a, cx = W * 0.5, cy = H * 0.5;
          Bio.cv.chloroplast(a, cx, cy, W * 0.78, H * 0.6, 1);
          a.tag('outer and inner membrane', W * 0.08, H * 0.1, cx - W * 0.25, cy - H * 0.26, { alpha: a.seg(a.p, 0.08, 0.18) });
          a.tag('granum (stack of thylakoids)', W * 0.06, H * 0.9, cx - W * 0.22, cy, { alpha: a.seg(a.p, 0.25, 0.35) });
          a.tag('stroma', W * 0.72, H * 0.9, cx + W * 0.1, cy + H * 0.2, { alpha: a.seg(a.p, 0.6, 0.7) });
        } },
      { dur: 11, card: [C(0, '<h2>What the plant does with glucose</h2>'), C(3, '<p>Glucose is not just food. It is the raw material for most of the plant.</p>')],
        board: [L(0.5, 'respiration, to release energy as ATP'), L(2.5, 'starch, to store energy (insoluble)'), L(4.5, 'cellulose, to build cell walls'), L(6.5, 'sucrose, to carry in the phloem'), L(8.5, 'with nitrates: amino acids and proteins')] },
    ],
    example: {
      problem: 'Describe where photosynthesis takes place in a leaf cell, and state its reactants and products.',
      steps: [
        { m: 'Photosynthesis happens in the chloroplasts, most of them in the palisade mesophyll cells near the top of the leaf.', note: 'where, exactly' },
        { m: 'Chlorophyll in the thylakoid membranes absorbs light energy.', note: 'role of chlorophyll' },
        { m: 'The reactants are carbon dioxide, which diffuses in through the stomata, and water, from the roots through the xylem.', note: 'both reactants' },
        { m: 'The products are glucose and oxygen. The oxygen diffuses out through the stomata.', note: 'both products' },
      ],
    },
    faded() { return Bio.labelGen((w) => Bio.chloroplast(w), { outer: 'Outer membrane', granum: 'Granum', stroma: 'Stroma', thylakoid: 'Thylakoid' }, { n: 4, extra: ['Matrix', 'Crista', 'Nucleus'], prompt: 'Label the chloroplast.', idea: 'Light is absorbed in the thylakoid membranes (stacked into grana). The light-independent reactions happen in the stroma.' })(); },
    grades: 'AAAMM',
    gens: [
      P.terms([['photosynthesis', 'Using light energy to make glucose from carbon dioxide and water, releasing oxygen.'], ['chlorophyll', 'The green pigment that absorbs light energy, found in the thylakoid membranes.'], ['chloroplast', 'The organelle where photosynthesis happens.'], ['stomata', 'Pores in the leaf surface where carbon dioxide diffuses in and oxygen diffuses out.'], ['thylakoid', 'A flattened membrane sac inside a chloroplast, holding chlorophyll.'], ['stroma', 'The fluid inside the chloroplast where the light-independent reactions happen.'], ['granum', 'A stack of thylakoids.']]),
      Bio.labelGen((w) => Bio.chloroplast(w), { outer: 'Outer membrane', granum: 'Granum', stroma: 'Stroma', thylakoid: 'Thylakoid', starch: 'Starch grain' }, { n: 4, extra: ['Matrix', 'Crista'], prompt: 'Label the chloroplast.' }),
      P.bank([
        { q: 'Which gas is a <b>reactant</b> in photosynthesis?', a: 'Carbon dioxide', why: 'Carbon dioxide and water are the reactants. Oxygen is a product.', w: [['Oxygen', 'Oxygen is a product, released as a by-product.'], ['Nitrogen', 'Nitrogen is not part of photosynthesis.'], ['Argon', 'Argon is an inert gas: it takes no part in photosynthesis.']] },
        { q: 'Where in a plant cell does photosynthesis happen?', a: 'In the chloroplasts', why: 'Chloroplasts hold the chlorophyll and the enzymes. The 2025 examiners noted candidates who wrote “cytoplasm” lost the mark.', w: [['In the cytoplasm', 'The 2025 examiners flagged this exact error. It is the chloroplast.'], ['In the mitochondria', 'Mitochondria are for aerobic respiration.'], ['In the nucleus', 'The nucleus holds the DNA.']] },
        { q: 'What is the role of chlorophyll?', a: 'It absorbs light energy', why: 'Chlorophyll is a pigment in the thylakoid membranes that traps light energy for the light-dependent stage.', w: [['It stores glucose', 'Glucose is stored as starch, not by chlorophyll.'], ['It speeds up respiration', 'That is enzymes, in mitochondria.'], ['It lets carbon dioxide into the leaf', 'That is the stomata.']] },
        { q: 'Which are the products of photosynthesis?', a: 'Glucose and oxygen', why: 'Glucose stores the energy; oxygen is the by-product from splitting water.', w: [['Carbon dioxide and water', 'Those are the reactants (and the products of aerobic respiration).'], ['Glucose and carbon dioxide', 'Carbon dioxide is used up, not made.'], ['Oxygen and water', 'Water is used up. Glucose is missing.']] },
        { q: 'How does carbon dioxide get into a leaf?', a: 'It diffuses in through the stomata', why: 'The concentration of CO₂ is lower inside the leaf because it is being used, so it diffuses in through the open stomata.', w: [['It is taken up by the roots', 'The roots take up water and minerals, not CO₂.'], ['It is made by the chloroplasts', 'Chloroplasts use CO₂. Mitochondria make some, but most comes from the air.'], ['It is pumped in by active transport', 'It moves by diffusion, down its concentration gradient.']] },
      ]),
      P.bank([
        { q: 'Why are most chloroplasts in the palisade cells, near the upper surface of a leaf?', a: 'That is where the most light reaches, so more light energy can be absorbed', why: 'Light enters from above. More chloroplasts where the light is strongest means more light absorbed and a faster rate of photosynthesis.', w: [['To be close to the stomata for oxygen', 'Most stomata are on the lower surface, and oxygen is a product, not a need.'], ['Because they need to be near the xylem', 'Water reaches every cell. Light is the reason.'], ['To protect them from the wind', 'Position is about light absorption.']] },
        { q: 'Why is a large surface area of thylakoid membranes useful?', a: 'It holds more chlorophyll, so more light energy can be absorbed', why: 'Stacking many thylakoids into grana packs a large membrane area, and so lots of chlorophyll, into a small chloroplast.', w: [['It stores more glucose', 'Glucose is made in the stroma and stored as starch.'], ['It lets more water in', 'The membranes are for chlorophyll and the light-dependent reactions.'], ['It makes the leaf greener so it is warmer', 'The point is absorbing light energy, not heat.']] },
        { q: 'Why is oxygen called a by-product of photosynthesis?', a: 'It comes from splitting water and is not needed by the reaction, so it is released', why: 'Water is split in the light-dependent stage to supply electrons and hydrogen. The oxygen left over diffuses out (some is used in the plant’s own respiration).', w: [['It is made from carbon dioxide', 'The oxygen released comes from water, not CO₂.'], ['It is a waste the plant cannot use', 'Plants do use some oxygen, in respiration.'], ['It is made in the mitochondria', 'Mitochondria use oxygen.']] },
        { q: 'A plant is kept in the dark for two days, then a leaf is tested for starch. Why is there no starch?', a: 'Without light, no glucose is made, and the starch store is used up in respiration', why: 'Respiration carries on day and night. In the dark, photosynthesis stops, so the plant breaks down its starch for glucose.', w: [['Starch is destroyed by the dark', 'Darkness does not destroy starch. It is used.'], ['The chloroplasts move to the roots', 'Chloroplasts do not move to the roots.'], ['Starch only forms in the dark', 'It forms from glucose made in the light.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: how the carbon in a CO₂ molecule ends up in a plant’s cell wall.', steps: ['CO₂ diffuses into the leaf through the stomata', 'It diffuses into a palisade cell and into a chloroplast', 'In the stroma it is fixed into glucose', 'Glucose molecules are joined to make cellulose', 'Cellulose is laid down in the cell wall'], idea: 'Follow the carbon: in, fixed, built into something bigger.' },
        { q: 'Put the steps in order: how light energy ends up as stored chemical energy.', steps: ['Chlorophyll in the thylakoid membranes absorbs light energy', 'The energy is used to make ATP and NADPH', 'ATP and NADPH power the fixing of CO₂ in the stroma', 'Glucose is made, storing the energy in its chemical bonds', 'Glucose is joined into starch to store it'], idea: 'Energy flows from light, to ATP and NADPH, to glucose, to starch.' },
      ]),
    ],
    tips: [
      'Know the word equation and the balanced one: <span class="pen">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</span>. Light and chlorophyll go over the arrow.',
      'Say <b>chloroplast</b>, then be precise: chlorophyll in the <b>thylakoid membranes</b>, light-independent reactions in the <b>stroma</b>. The 2025 report noted candidates who wrote “cytoplasm” lost the mark.',
      'Do not mix up photosynthesis and respiration. Examiners named this as a common Not Achieved error in 2025.',
      'Use the resource. In 2025, higher grades went to answers that linked the biology to the plant and place in the question.',
    ],
    aim: {
      intro: '<div class="resource">Kawakawa grows in the shade of the forest floor, where only a little light gets through. Its leaves are thin, and the cells near the upper surface are packed with chloroplasts.</div>',
      parts: [
        { q: 'Describe where photosynthesis takes place in a kawakawa leaf cell, and state the reactants and products.', write: true, words: '40–60',
          model: [S('Photosynthesis takes place in the chloroplasts.', 'where', true), S('Chlorophyll in the thylakoid membranes absorbs the light energy.', 'role of chlorophyll'), S('The reactants are carbon dioxide and water.', 'both reactants', true), S('The products are glucose and oxygen.', 'both products', true)],
          earns: 'Achieved: correct location and all four substances, using the right terms.',
          crit: { A: 'Chloroplast as the site; reactants carbon dioxide and water; products glucose and oxygen. A word or balanced equation is acceptable.', M: 'Also explains the roles: chlorophyll in thylakoids absorbs light; stroma is where CO₂ is turned into glucose.' } },
        { q: 'Explain how the structure of a chloroplast suits it to carry out photosynthesis.', write: true, words: '60–90',
          model: [S('Thylakoid membranes are stacked into grana, which gives a large surface area.', 'structure'), S('This holds a lot of chlorophyll, so more light energy can be absorbed for the light-dependent stage.', 'linked to function', true), S('The stroma contains the enzymes for the light-independent stage, close to where ATP and NADPH are made.', 'structure → function', true), S('So the energy captured in the grana can be used straight away to turn carbon dioxide into glucose.', 'links the two stages')],
          earns: 'Merit: each structure is linked to how it helps, with a reason (more chlorophyll so more light absorbed), not just named.',
          crit: { A: 'Names thylakoids or grana and stroma, or says chlorophyll absorbs light.', M: 'Explains how the structure helps: stacked thylakoids/grana → large surface area → more chlorophyll → more light absorbed; stroma holds enzymes for the light-independent stage.', E: 'Links both stages and the structures to the rate of glucose production.' } },
        { q: 'Discuss how the features of kawakawa leaves help the plant survive on the shaded forest floor. Link light absorption to glucose production and to the plant’s energy needs.', write: true, words: '100–150',
          model: [S('On the forest floor, light intensity is low, so light is the limiting factor for photosynthesis.', 'uses the context', true), S('Thin leaves and many chloroplasts near the upper surface mean the little light that arrives is not wasted: more chlorophyll absorbs more of it.', 'feature → light absorbed'), S('More light absorbed means more ATP and NADPH from the light-dependent stage, so more CO₂ can be fixed into glucose in the stroma.', 'chain to glucose', true), S('The plant respires all the time, using glucose to make ATP for growth and repair.', 'energy need'), S('To survive and grow, the plant must make at least as much glucose as respiration uses. These leaf features help it reach that point even in dim light.', 'justified conclusion', true)],
          earns: 'Excellence: a linked chain from the leaf features, through light absorption and the two stages, to glucose and the plant’s need to cover its respiration, all tied to the shady habitat.',
          crit: { M: 'Explains that more chloroplasts or thin leaves absorb more light, so the rate of photosynthesis increases.', E: 'Links low light as the limiting factor → features maximise light absorption → more ATP/NADPH → more glucose → glucose must meet respiration needs for survival and growth, using the resource context.' } },
      ],
      up: [
        up(1, ['The chloroplast has grana and stroma. The grana have chlorophyll. The stroma is a fluid.'], [
          ['Say how each part helps: stacked thylakoids give more chlorophyll to absorb more light; the stroma holds the enzymes that make glucose', 1, 'Right. The answer names the parts but never says how they help. Merit needs the link from structure to function.'],
          ['Draw a diagram of the chloroplast', 0, 'A diagram can support an answer, but the missing piece is how each structure helps.'],
          ['Add the word equation', 0, 'The equation does not explain the structure.'],
          ['Name more parts, such as the outer membrane', 0, 'More names is still Achieved. Explaining is what moves it up.']]),
        up(2, ['Kawakawa has thin leaves and lots of chloroplasts, so it absorbs more light. This means it can photosynthesise faster and make more glucose.'], [
          ['Link it to the shade: light is limiting there, and the glucose made must cover what respiration uses for the plant to survive', 1, 'Right. The answer explains, but does not discuss why this matters on the forest floor or link glucose to the plant’s energy needs.'],
          ['Say that glucose is C₆H₁₂O₆', 0, 'A formula adds no reasoning.'],
          ['Mention that oxygen is released', 0, 'True, but it does not help the plant survive in the shade.'],
          ['Repeat that the leaves are thin', 0, 'Restating the resource earns nothing. Use it to reason.']]),
      ],
    },
  });

  /* ======================= 2. The two stages ======================= */
  P.addUnit({
    id: 'ps-stages', title: 'Light-dependent and light-independent stages', mins: 10,
    blurb: 'Two stages, two places, one handover: ATP and NADPH. This is where Merit starts.',
    recap: 'Stage 1, the light-dependent stage, happens on the thylakoid membranes: chlorophyll absorbs light, water is split (releasing oxygen), and the energy is stored in ATP and NADPH. Stage 2, the light-independent stage (the Calvin cycle), happens in the stroma: ATP and NADPH from stage 1 are used to fix carbon dioxide into glucose. Stage 2 stops soon after the light goes off, because it runs out of ATP and NADPH.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Stage 1: light-dependent, on the thylakoids.</h2>'), C(3.5, '<p>Chlorophyll absorbs light. The energy splits water: this is photolysis. Oxygen is released.</p>'), C(8.5, '<p>The energy is caught in two carrier molecules: ATP and NADPH.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const y = H * 0.5;
          for (let i = 0; i < 4; i++) a.round(W * 0.12, y - H * 0.18 + i * H * 0.1, W * 0.3, H * 0.07, 6, { fill: c.c3, stroke: false, alpha: 0.6 });
          a.text('thylakoids', W * 0.04, y + H * 0.3, { font: 'pen', col: c.c3 });
          a.arrow(W * 0.08, H * 0.06, W * 0.2, y - H * 0.2, c.c2, 3, a.seg(a.p, 0.05, 0.15)); a.text('light', W * 0.05, H * 0.05, { font: 'pen', col: c.c2, alpha: a.seg(a.p, 0.05, 0.15) });
          a.arrow(W * 0.27, H * 0.95, W * 0.27, y + H * 0.2, c.c1, 2.5, a.seg(a.p, 0.25, 0.35)); a.text('H₂O', W * 0.3, H * 0.92, { font: 'head', col: c.c1, alpha: a.seg(a.p, 0.25, 0.35) });
          a.arrow(W * 0.44, y - H * 0.12, W * 0.62, H * 0.12, c.muted, 2.5, a.seg(a.p, 0.4, 0.5)); a.text('O₂ out', W * 0.64, H * 0.1, { font: 'head', col: c.muted, alpha: a.seg(a.p, 0.4, 0.5) });
          a.arrow(W * 0.44, y + H * 0.05, W * 0.68, y + H * 0.05, c.pen, 3, a.seg(a.p, 0.62, 0.72)); a.text('ATP + NADPH', W * 0.7, y + H * 0.05, { font: 'head', col: c.pen, alpha: a.seg(a.p, 0.62, 0.72) });
        } },
      { dur: 13, card: [C(0, '<h2>Stage 2: light-independent, in the stroma.</h2>'), C(3.5, '<p>The Calvin cycle. Carbon dioxide is fixed: joined onto a carbon compound already there.</p>'), C(8, '<p>ATP gives the energy. NADPH gives the hydrogen. Glucose is built. The spent ADP and NADP go back to the thylakoids.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const cx = W * 0.55, cy = H * 0.5, r = Math.min(W, H) * 0.24;
          const t = a.p * Math.PI * 2;
          a.ellipse(cx, cy, r, r, { stroke: c.c3, lw: 4, alpha: a.seg(a.p, 0, 0.15) });
          a.text('Calvin cycle', cx, cy, { align: 'center', font: 'head', alpha: a.seg(a.p, 0.05, 0.2) });
          a.dot({ X: (x) => x, Y: (y) => y }, cx + r * Math.cos(t), cy + r * Math.sin(t), c.c3, 7);
          a.arrow(W * 0.05, cy - r, cx - r * 0.8, cy - r * 0.5, c.ink, 2.5, a.seg(a.p, 0.15, 0.25)); a.text('CO₂ in', W * 0.04, cy - r - 16, { font: 'head', alpha: a.seg(a.p, 0.15, 0.25) });
          a.arrow(W * 0.05, cy + r * 0.2, cx - r, cy + r * 0.2, c.pen, 2.5, a.seg(a.p, 0.35, 0.45)); a.text('ATP + NADPH', W * 0.04, cy + r * 0.2 - 16, { font: 'head', col: c.pen, alpha: a.seg(a.p, 0.35, 0.45) });
          a.arrow(cx + r, cy, W * 0.97, cy - r * 0.6, c.c3, 3, a.seg(a.p, 0.55, 0.65)); a.text('glucose', W * 0.86, cy - r * 0.75, { font: 'head', col: c.c3, alpha: a.seg(a.p, 0.55, 0.65) });
          a.arrow(cx - r * 0.2, cy + r, W * 0.12, H * 0.94, c.muted, 2.2, a.seg(a.p, 0.72, 0.82)); a.text('ADP + NADP back to stage 1', W * 0.04, H * 0.96, { size: 0.8, col: c.muted, alpha: a.seg(a.p, 0.72, 0.82) });
        } },
      { dur: 12, card: [C(0, '<h2>The handover is the Merit link.</h2>'), C(3, '<p>Stage 2 does not use light directly. It depends on stage 1 for ATP and NADPH.</p>'), C(7.5, '<p>So when the light goes off, stage 2 soon stops too.</p>')],
        board: [L(0.5, '<b>Light-dependent</b>: thylakoid membranes', 'where'), L(2, 'light absorbed → water split → O₂ released → ATP + NADPH made'), L(5, '<b>Light-independent</b>: stroma', 'where'), L(6.5, 'CO₂ fixed → glucose built, using ATP and NADPH', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain why the light-independent stage stops shortly after a plant is put in the dark, even though it does not use light.',
      steps: [
        { m: 'The light-independent stage needs ATP and NADPH to turn carbon dioxide into glucose.', note: 'what stage 2 needs' },
        { m: 'ATP and NADPH are made only in the light-dependent stage, which needs light energy absorbed by chlorophyll.', note: 'where they come from' },
        { m: 'In the dark, no new ATP or NADPH is made, and what is left is quickly used up.', note: 'the link' },
        { m: 'So carbon dioxide can no longer be fixed, and glucose production stops.', note: 'conclusion' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how the light-dependent stage supplies the light-independent stage.', steps: ['Chlorophyll in the thylakoid membranes absorbs light energy', 'The energy splits water molecules, releasing oxygen', 'The energy is captured in ATP and NADPH', 'ATP and NADPH move into the stroma', 'They are used to fix carbon dioxide into glucose'], idea: 'Stage 1 makes the energy carriers. Stage 2 spends them.' }], 2)(); },
    grades: 'AAMMM',
    gens: [
      P.bank([
        { q: 'Where does the light-dependent stage happen?', a: 'On the thylakoid membranes', why: 'That is where the chlorophyll is.', w: [['In the stroma', 'The stroma is where the light-independent stage happens.'], ['In the cytoplasm', 'Photosynthesis happens inside chloroplasts.'], ['In the mitochondrial matrix', 'That is part of aerobic respiration.']] },
        { q: 'Where does the light-independent stage happen?', a: 'In the stroma', why: 'The stroma holds the enzymes of the Calvin cycle.', w: [['On the thylakoid membranes', 'That is the light-dependent stage.'], ['In the stomata', 'Stomata are pores in the leaf.'], ['In the cell wall', 'The cell wall gives support.']] },
        { q: 'Which substance is split in the light-dependent stage?', a: 'Water', why: 'Light energy splits water (photolysis), releasing oxygen as a by-product.', w: [['Carbon dioxide', 'CO₂ is used in the light-independent stage.'], ['Glucose', 'Glucose is made, not split, in photosynthesis.'], ['Chlorophyll', 'Chlorophyll absorbs light; it is not split.']] },
        { q: 'Which products of the light-dependent stage are used in the light-independent stage?', a: 'ATP and NADPH', why: 'ATP supplies energy and NADPH supplies hydrogen to turn CO₂ into glucose.', w: [['Oxygen and water', 'Oxygen is released; water is a reactant of stage 1.'], ['Glucose and oxygen', 'Glucose is made in stage 2.'], ['Carbon dioxide and ATP', 'CO₂ comes from the air, not from stage 1.']] },
        { q: 'Which gas is taken in by the light-independent stage?', a: 'Carbon dioxide', why: 'CO₂ is fixed in the Calvin cycle.', w: [['Oxygen', 'Oxygen is released by stage 1.'], ['Nitrogen', 'Not part of photosynthesis.'], ['Water vapour', 'Water is used in stage 1.']] },
      ]),
      P.terms([['light-dependent stage', 'The stage on the thylakoid membranes that uses light to split water and make ATP and NADPH.'], ['light-independent stage', 'The stage in the stroma that uses ATP and NADPH to fix carbon dioxide into glucose (the Calvin cycle).'], ['photolysis', 'Splitting water using light energy, releasing oxygen.'], ['ATP', 'The molecule that carries energy within cells.'], ['NADPH', 'A carrier that brings hydrogen (and energy) from the light-dependent stage to the light-independent stage.'], ['carbon fixation', 'Joining carbon dioxide onto an organic molecule in the Calvin cycle.']]),
      P.bank([
        { q: 'Why does the light-independent stage stop soon after the light goes off?', a: 'It runs out of ATP and NADPH, which only the light-dependent stage makes', why: 'Stage 2 does not use light directly, but it depends on stage 1 for its energy carriers.', w: [['The enzymes in the stroma need light to work', 'The enzymes do not need light. They need ATP and NADPH.'], ['Carbon dioxide cannot enter in the dark', 'Stomata may close, but the main reason is no ATP and NADPH.'], ['Glucose is broken down in the dark', 'Respiration goes on, but that does not explain why stage 2 stops.']] },
        { q: 'Why does a plant give off oxygen in the light but not in the dark?', a: 'Oxygen comes from splitting water in the light-dependent stage, which needs light', why: 'No light, no photolysis, so no oxygen made. Respiration then uses oxygen.', w: [['Oxygen is made in the Calvin cycle', 'The Calvin cycle uses CO₂ and makes glucose, not oxygen.'], ['Stomata close in the dark so it cannot escape', 'Oxygen is not being made at all in the dark.'], ['It is stored in starch at night', 'Oxygen is not stored in starch.']] },
        { q: 'A herbicide stops plants splitting water. What happens to glucose production?', a: 'It stops, because no ATP and NADPH are made for the light-independent stage', why: 'Splitting water supplies electrons and hydrogen for stage 1. Without stage 1, stage 2 has no ATP or NADPH.', w: [['It increases, because more water is left', 'Water is not the limit here. The carriers are missing.'], ['It carries on, because stage 2 does not need water', 'Stage 2 needs the products of stage 1.'], ['Only oxygen release is affected', 'No oxygen also means no ATP and NADPH, so glucose stops too.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: from light to glucose.', steps: ['Light energy is absorbed by chlorophyll in the thylakoids', 'Water is split, releasing oxygen', 'ATP and NADPH are made', 'In the stroma, CO₂ is fixed using ATP and NADPH', 'Glucose is made'] },
        { q: 'Put the steps in order: why glucose production stops in the dark.', steps: ['No light energy is absorbed by chlorophyll', 'The light-dependent stage stops', 'No new ATP or NADPH is made', 'The light-independent stage runs out of ATP and NADPH', 'CO₂ is no longer fixed, so no glucose is made'] },
      ]),
      P.bank([
        { q: 'Which statement best compares the two stages?', a: 'Stage 1 converts light energy into chemical energy (ATP, NADPH); stage 2 uses that energy to build glucose', why: 'That is the energy story of photosynthesis in one sentence.', w: [['Stage 1 makes glucose; stage 2 makes oxygen', 'The other way round, and stage 2 does not make oxygen.'], ['Both stages need light directly', 'Only stage 1 uses light directly.'], ['Stage 2 happens at night and stage 1 in the day', 'Stage 2 runs in the day too, as long as ATP and NADPH are supplied.']] },
        { q: 'Why is the light-independent stage in the stroma, close to the thylakoids?', a: 'ATP and NADPH from the thylakoids can reach the Calvin cycle enzymes quickly', why: 'Short distances mean the energy carriers are used straight away.', w: [['Because the stroma has chlorophyll', 'Chlorophyll is in the thylakoid membranes.'], ['So oxygen can be used', 'The Calvin cycle uses CO₂, not O₂.'], ['Because light cannot reach the stroma', 'Light reaches both; the reason is the handover.']] },
      ]),
    ],
    tips: [
      'Match each stage to its place: <span class="pen">light-dependent → thylakoids, light-independent → stroma.</span>',
      'The Merit link is the handover: stage 2 needs ATP and NADPH from stage 1. Say it in words.',
      'Oxygen comes from splitting <b>water</b>, not from carbon dioxide.',
      'Use the names “light-dependent” and “light-independent”. The 2026 specification says both are assessed.',
    ],
    aim: {
      intro: '<div class="resource">A student grows pondweed in a sealed jar under a lamp and measures the gases. After two hours the lamp is switched off. Oxygen release stops almost at once. Carbon dioxide uptake slows over the next minute, then stops.</div>',
      parts: [
        { q: 'Describe what happens in the light-dependent stage of photosynthesis, and where it happens.', write: true, words: '40–60',
          model: [S('It happens on the thylakoid membranes in the chloroplast.', 'where', true), S('Chlorophyll absorbs light energy.', 'step 1'), S('The energy splits water, releasing oxygen.', 'photolysis', true), S('ATP and NADPH are made.', 'products', true)],
          earns: 'Achieved: the place and the main events, with the right terms.',
          crit: { A: 'Thylakoid/grana; light absorbed by chlorophyll; water split; oxygen released; ATP and NADPH made (most of these).', M: 'Links the products of stage 1 to their use in stage 2.' } },
        { q: 'Explain why oxygen release stopped almost at once when the lamp was switched off.', write: true, words: '50–80',
          model: [S('Oxygen is released when water is split in the light-dependent stage.', 'where O₂ comes from', true), S('This stage needs light energy absorbed by chlorophyll.', 'needs light'), S('When the lamp goes off, no light is absorbed, so water is no longer split.', 'the link', true), S('So oxygen stops being made straight away.', 'conclusion')],
          earns: 'Merit: a linked explanation: oxygen comes from photolysis, which needs light, so it stops at once.',
          crit: { A: 'States oxygen is made in the light-dependent stage, or that light is needed.', M: 'Explains: oxygen comes from splitting water in the light-dependent stage, which needs light, so no light means no water split and no oxygen.' } },
        { q: 'Discuss why carbon dioxide uptake kept going for a short time after the lamp was switched off, and then stopped. Refer to both stages.', write: true, words: '90–130',
          model: [S('Carbon dioxide is used in the light-independent stage in the stroma, which does not use light directly.', 'stage 2', true), S('It uses ATP and NADPH made in the light-dependent stage.', 'the dependence', true), S('When the lamp goes off, some ATP and NADPH are still in the stroma, so CO₂ fixation carries on for a short time.', 'explains the delay', true), S('No new ATP or NADPH is made in the dark, so once the supply is used up the Calvin cycle stops and CO₂ uptake stops.', 'explains the stop', true), S('The oxygen stops at once and the CO₂ a minute later because the two stages are linked by these carriers, not by light itself.', 'compares the two results')],
          earns: 'Excellence: both results explained by the link between the stages, with the delay justified by the store of ATP and NADPH.',
          crit: { M: 'Explains that CO₂ is used in the light-independent stage, which needs ATP and NADPH from the light-dependent stage.', E: 'Explains both the short delay (left-over ATP and NADPH) and the stop (no new carriers), and compares with the oxygen result, using the data.' } },
      ],
      up: [
        up(1, ['Oxygen stopped because there was no light. Plants need light for photosynthesis.'], [
          ['Say where oxygen comes from: splitting water in the light-dependent stage, which needs light, so it stops at once', 1, 'Right. The answer is true but general. Merit needs the linked mechanism: no light → no water split → no oxygen.'],
          ['Add that plants are green', 0, 'Not relevant to the mechanism.'],
          ['Say that photosynthesis makes glucose', 0, 'True, but it does not explain the oxygen.'],
          ['Use a longer sentence', 0, 'Length is not the issue. The missing link is how light leads to oxygen.']]),
        up(2, ['CO₂ is used in the Calvin cycle, which uses ATP and NADPH from the light-dependent stage. In the dark, stage 1 stops, so stage 2 stops.'], [
          ['Explain the delay: ATP and NADPH already in the stroma let CO₂ fixation continue until they run out, unlike oxygen release, which stops at once', 1, 'Right. The answer explains why it stops, but not why it kept going for a minute. Excellence uses all the data.'],
          ['Name the enzyme in the Calvin cycle', 0, 'An extra name does not address the delay in the data.'],
          ['Repeat that light is needed', 0, 'It does not explain why CO₂ uptake continued for a while.'],
          ['Draw the chloroplast', 0, 'The structure is not the issue.']]),
      ],
    },
  });

  /* ======================= 3. Limiting factors ======================= */
  const psCurve = (sat, max) => (x) => (x <= 0 ? 0 : max * (1 - Math.exp(-x / sat)));
  P.addUnit({
    id: 'ps-rate', title: 'Limiting factors and the rate of photosynthesis', mins: 10,
    blurb: 'Light, carbon dioxide and temperature. Read the graph, find the limiting factor, explain why.',
    recap: 'The rate of photosynthesis is held back by whichever factor is in shortest supply: the limiting factor. More light gives more ATP and NADPH; more carbon dioxide gives more substrate for the Calvin cycle; warmth speeds up the enzymes until they start to denature. When a graph levels off, the factor on the x-axis is no longer limiting; something else is.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Turn up the light: the rate rises, then levels off.</h2>'), C(4, '<p>At first, light is the limiting factor. More light → more ATP and NADPH → faster.</p>'), C(9, '<p>On the flat part, light is no longer limiting. Something else is: CO₂ or temperature.</p>')],
        draw(a) {
          const v = a.view(0, 10, 0, 10); a.axes(v, { step: 2, labels: false });
          a.text('light intensity', a.W - 20, v.Y(0) + 18, { align: 'right', size: 0.8, col: a.C.muted }); a.text('rate', v.X(0) + 6, v.Y(10) + 4, { size: 0.8, col: a.C.muted });
          a.plot(v, psCurve(2.2, 6), a.C.c3, 4, a.seg(a.p, 0.05, 0.45));
          a.alpha(a.seg(a.p, 0.3, 0.4), () => a.text('light limiting', v.X(1.2), v.Y(5), { font: 'pen', col: a.C.pen }));
          a.alpha(a.seg(a.p, 0.6, 0.7), () => a.text('something else limiting', v.X(5.2), v.Y(7.2), { font: 'pen', col: a.C.pen }));
        } },
      { dur: 13, card: [C(0, '<h2>Raise the CO₂: the plateau goes up.</h2>'), C(4, '<p>The higher curve proves CO₂ was limiting the lower one on its flat part.</p>')],
        draw(a) {
          const v = a.view(0, 10, 0, 10); a.axes(v, { step: 2, labels: false });
          a.text('light intensity', a.W - 20, v.Y(0) + 18, { align: 'right', size: 0.8, col: a.C.muted });
          a.plot(v, psCurve(2.2, 5), a.C.c3, 4); a.text('low CO₂', v.X(8.4), v.Y(5) + 18, { size: 0.8, col: a.C.c3 });
          a.plot(v, psCurve(2.6, 8.5), a.C.c1, 4, a.seg(a.p, 0.2, 0.6)); a.alpha(a.seg(a.p, 0.5, 0.6), () => a.text('high CO₂', v.X(8.2), v.Y(8.5) - 16, { size: 0.8, col: a.C.c1 }));
        } },
      { dur: 13, card: [C(0, '<h2>Temperature works through the enzymes.</h2>'), C(3, '<p>Warmer: more kinetic energy, more collisions with the Calvin cycle enzymes, faster.</p>'), C(8, '<p>Too hot: the enzymes denature, and the rate falls fast.</p>')],
        draw(a) {
          const v = a.view(0, 50, 0, 10); a.axes(v, { step: 10, labels: false });
          a.text('temperature', a.W - 20, v.Y(0) + 18, { align: 'right', size: 0.8, col: a.C.muted });
          const f = (t) => (t < 30 ? 8.5 * Math.pow(t / 30, 1.6) : Math.max(0, 8.5 * (1 - ((t - 30) / 14) ** 2)));
          a.plot(v, f, a.C.c2, 4, a.seg(a.p, 0.05, 0.6));
          a.alpha(a.seg(a.p, 0.55, 0.65), () => a.text('optimum', v.X(28), v.Y(8.5) - 18, { font: 'pen', col: a.C.pen }));
          a.alpha(a.seg(a.p, 0.7, 0.8), () => a.text('denaturing', v.X(39), v.Y(4.5), { font: 'pen', col: a.C.pen }));
        } },
      { dur: 12, card: [C(0, '<h2>Time of day joins it up.</h2>'), C(3, '<p>Dawn: light limits. Midday: light is high, so CO₂ or temperature limits. Night: no light, so no photosynthesis, but respiration carries on.</p>')],
        board: [L(0.5, 'dawn: <b>light</b> limiting'), L(3, 'midday: light high → <b>CO₂</b> or <b>temperature</b> limiting'), L(6, 'very hot afternoon: stomata close → <b>CO₂</b> limiting'), L(8.5, 'night: no photosynthesis; respiration continues', '', { hl: true })] },
    ],
    example: {
      problem: 'A graph shows the rate of photosynthesis rising as light intensity increases from 0 to 4 units, then staying level from 4 to 10 units. Explain the shape of the graph.',
      steps: [
        { m: 'From 0 to 4 units, the rate rises because light is the limiting factor.', note: 'name it' },
        { m: 'More light means more energy absorbed by chlorophyll, so more ATP and NADPH are made, and the light-independent stage runs faster.', note: 'the mechanism' },
        { m: 'Above 4 units the rate is level, so light is no longer limiting.', note: 'read the graph' },
        { m: 'Another factor, such as carbon dioxide concentration or temperature, is now limiting the rate.', note: 'what limits now' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: why raising CO₂ speeds up photosynthesis on the flat part of a light curve.', steps: ['On the plateau, light is not the limiting factor', 'Carbon dioxide is in short supply', 'More CO₂ means more substrate for the Calvin cycle enzymes in the stroma', 'More CO₂ is fixed per second', 'Glucose is made faster, so the rate rises'] }], 2)(); },
    grades: 'AAMMME',
    gens: [
      P.terms([['limiting factor', 'The factor in shortest supply, which holds back the rate.'], ['light intensity', 'How much light energy reaches the leaf.'], ['optimum temperature', 'The temperature at which enzymes work fastest.'], ['denature', 'When an enzyme’s active site changes shape permanently, so it no longer works.'], ['rate of photosynthesis', 'How fast photosynthesis happens, often measured by oxygen released or CO₂ taken up per minute.'], ['plateau', 'The flat part of a graph, where increasing the factor on the x-axis no longer increases the rate.']]),
      () => { // read a light curve: where does light stop being limiting?
        const max = R.pick([6, 7, 8, 9]), k = R.pick([4, 5, 6]);
        const f = (x) => (x < k ? (max * x) / k : max);
        const fig = P.svg.graph([{ f, col: 'var(--c3)' }], { x0: 0, x1: 10, y0: 0, y1: 10, step: 1, ystep: 1, w: 420, h: 260, alt: 'Rate of photosynthesis against light intensity' });
        return P.mcq({ prompt: `The graph shows the rate of photosynthesis (y) against light intensity (x, arbitrary units). What is the lowest light intensity at which light stops being the limiting factor?`, fig, more: { steps: [St('Light is limiting while the rate rises with light. Find where the line stops rising.'), St(`It levels off at ${k} units. Beyond that, more light does not raise the rate, so something else (CO₂ or temperature) is limiting.`)], trap: 'Picking where the rate is highest on the axis. Look for where it stops rising.' } },
          P.uniq([{ t: `${k} units`, ok: true }, { t: `${k - 2} units`, why: 'The rate is still rising there, so light is still limiting.' }, { t: `${Math.min(10, k + 3)} units`, why: 'Light is not limiting here either, but the question asks for the lowest intensity where it stops limiting.' }, { t: `${max} units`, why: 'That is the maximum rate on the y-axis, not a light intensity.' }].filter((c) => !/^-|^0 /.test(c.t))));
      },
      P.bank([
        { q: 'Why does more light increase the rate of photosynthesis (when light is limiting)?', a: 'More light energy is absorbed, so more ATP and NADPH are made for the light-independent stage', why: 'That is the link examiners look for: light → ATP and NADPH → Calvin cycle runs faster.', w: [['Light heats the leaf so enzymes work faster', 'That is temperature, not light intensity.'], ['Light opens more stomata, letting out more oxygen', 'Oxygen leaving is not what limits the rate.'], ['Light is a reactant that is turned into glucose', 'Light is energy, not a reactant atom in glucose.']] },
        { q: 'Why does more carbon dioxide increase the rate (when CO₂ is limiting)?', a: 'There is more substrate for the Calvin cycle enzymes, so more CO₂ is fixed into glucose per second', why: 'CO₂ is used in the light-independent stage.', w: [['More CO₂ lets chlorophyll absorb more light', 'Chlorophyll absorbs light regardless of CO₂.'], ['CO₂ splits water faster', 'Water is split using light energy.'], ['CO₂ raises the temperature', 'Not the mechanism examiners want.']] },
        { q: 'Why does the rate fall sharply above about 35–40 °C?', a: 'The enzymes denature: their active sites change shape, so substrates no longer fit', why: 'High temperature breaks the bonds holding the enzyme’s shape. It is permanent.', w: [['Enzymes are killed', 'Enzymes are not alive. Say “denatured”.'], ['The plant runs out of light', 'Temperature does not change light supply.'], ['Molecules move too slowly', 'At high temperatures molecules move faster. The problem is shape.']] },
        { q: 'On a hot, dry afternoon a plant closes its stomata. Which factor is now most likely to limit photosynthesis?', a: 'Carbon dioxide concentration', why: 'Closed stomata stop CO₂ diffusing in, so the Calvin cycle runs short of substrate.', w: [['Light intensity', 'Light is high in the afternoon.'], ['Chlorophyll', 'Chlorophyll does not run out in an afternoon.'], ['Oxygen', 'Oxygen is a product, not a limit on the rate.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: why photosynthesis speeds up as temperature rises from 10 °C to 25 °C.', steps: ['The temperature rises', 'Enzyme and substrate molecules gain kinetic energy', 'They move faster and collide more often', 'More enzyme–substrate complexes form per second', 'The light-independent stage, and so photosynthesis, speeds up'] },
        { q: 'Put the steps in order: why photosynthesis slows on a very hot day.', steps: ['The temperature rises above the optimum', 'Bonds holding the enzymes’ shape break', 'The active sites change shape', 'Substrates no longer fit, so fewer reactions happen', 'The rate of photosynthesis falls'] },
      ]),
      P.bank([
        { q: 'A greenhouse grower already has bright lights and warm air. Which change is most likely to raise the yield, and why?', a: 'Add carbon dioxide, because with light and temperature high, CO₂ is probably the limiting factor', why: 'Raise the factor that is in shortest supply; raising the others does nothing.', w: [['Brighter lights, because light is always limiting', 'Light is already high; on a plateau extra light does nothing.'], ['Raise the temperature to 45 °C', 'The enzymes would denature.'], ['Add oxygen to the air', 'Oxygen is a product of photosynthesis.']] },
        { q: 'Two plants get the same light. Plant A’s rate is higher. The only other difference is CO₂ concentration. What does this show?', a: 'CO₂ was limiting plant B’s rate', why: 'Same light, higher rate with more CO₂: CO₂ was the factor holding B back.', w: [['Light was limiting both plants', 'If light were limiting both, extra CO₂ would not raise the rate.'], ['Temperature was limiting', 'Temperature was the same for both.'], ['Plant A has more chlorophyll', 'The only difference given is CO₂.']] },
      ]),
      P.bank([
        { q: 'Why does a plant at night take in oxygen and give out carbon dioxide?', a: 'Photosynthesis stops without light, but respiration carries on all the time', why: 'Respiration uses O₂ and releases CO₂ day and night. In the day, photosynthesis is faster and hides it.', w: [['Photosynthesis runs backwards at night', 'It does not run backwards. Respiration is a separate process.'], ['Plants only respire at night', 'Plants respire all the time.'], ['The stomata reverse direction at night', 'Diffusion follows concentration gradients, set by which process is faster.']] },
        { q: 'At dawn, light is very weak. What is the main limiting factor on the rate of photosynthesis?', a: 'Light intensity', why: 'In low light, too little ATP and NADPH is made, so light is in shortest supply.', w: [['Carbon dioxide', 'CO₂ is plentiful at dawn after a night of respiration.'], ['Oxygen', 'Oxygen does not limit photosynthesis.'], ['Water', 'Water is not usually limiting in a well-watered plant.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      'Name the limiting factor, then say <span class="pen">why it limits</span>: light → ATP and NADPH; CO₂ → substrate for the Calvin cycle; temperature → enzyme collisions.',
      'On a graph, a plateau means the x-axis factor is no longer limiting. Name what might be.',
      'For temperature, use kinetic energy and collisions, then denaturing above the optimum. The 2025 report rewarded this detail at Merit.',
      'Link to the time of day when the question gives one. Merit candidates in 2025 connected light and temperature to times of day.',
    ],
    aim: {
      intro: '<div class="resource">A grower measures the rate of photosynthesis in tomato plants in a glasshouse at three times on a sunny summer day: 6 am (dim light, 12 °C), midday (bright light, 26 °C), and 3 pm (bright light, 38 °C, glasshouse vents closed).</div>',
      parts: [
        { q: 'State the factor most likely to limit photosynthesis at 6 am, and describe the effect of that factor on the rate.', write: true, words: '30–50',
          model: [S('At 6 am, light intensity is the limiting factor, because the light is dim.', 'names it, with a reason', true), S('As light intensity increases, the rate of photosynthesis increases.', 'describes the effect', true)],
          earns: 'Achieved: the right factor and the right direction of its effect.',
          crit: { A: 'Light intensity is limiting at 6 am; more light, faster rate.', M: 'Explains why: more light → more ATP and NADPH → faster light-independent stage.' } },
        { q: 'Explain why the rate at midday is much higher than at 6 am.', write: true, words: '60–90',
          model: [S('At midday the light is bright, so chlorophyll absorbs more light energy.', 'more light'), S('More ATP and NADPH are made in the light-dependent stage, so the light-independent stage can fix more CO₂.', 'linked to the stages', true), S('It is also warmer (26 °C), so enzyme and substrate molecules have more kinetic energy and collide more often.', 'temperature'), S('More enzyme–substrate complexes form per second, so CO₂ is fixed into glucose faster.', 'linked to the rate', true)],
          earns: 'Merit: both differences explained with the mechanism, linked to the rate.',
          crit: { A: 'More light and warmer at midday, so a faster rate.', M: 'Explains: more light → more ATP/NADPH; warmer → more kinetic energy and collisions with enzymes → faster fixing of CO₂.' } },
        { q: 'At 3 pm the light is still bright, but the rate is lower than at midday. Discuss the likely reasons, and justify which change would best raise the rate.', write: true, words: '100–150',
          model: [S('At 38 °C the temperature is above the optimum for the Calvin cycle enzymes.', 'uses the data', true), S('Some enzymes denature: bonds holding their shape break, the active site changes shape, and the substrate no longer fits, so less CO₂ is fixed and fewer reactions happen.', 'mechanism'), S('With the vents closed, CO₂ in the glasshouse is used up, so CO₂ may also be limiting.', 'second factor', true), S('Light is not limiting, because it is still bright, so more light would not help.', 'rules one out'), S('Opening the vents would both cool the air and let in CO₂, so it targets the two factors limiting the rate. That makes it the best change.', 'justified choice', true)],
          earns: 'Excellence: the factors are weighed against the data, one is ruled out, and the recommendation is justified by linking it to both limiting factors.',
          crit: { M: 'Explains that high temperature denatures enzymes or that closed vents mean less CO₂, with the mechanism.', E: 'Discusses both temperature and CO₂ using the data, rules out light, and justifies one change (e.g. opening vents cools and adds CO₂).' } },
      ],
      up: [
        up(1, ['At midday it is brighter and warmer so photosynthesis is faster.'], [
          ['Explain each: more light gives more ATP and NADPH; warmth gives more enzyme collisions, so CO₂ is fixed faster', 1, 'Right. The answer gives the reasons but not how they speed things up. Merit needs the mechanism.'],
          ['Add the time of day again', 0, 'The times are already in the question. Explain the mechanism.'],
          ['Say the plant is happier in the sun', 0, 'Not biology. Explain the mechanism.'],
          ['Give the word equation', 0, 'The equation does not explain the rate.']]),
        up(2, ['At 3 pm it is too hot, so the enzymes denature and the rate drops. They should cool the glasshouse.'], [
          ['Weigh both factors from the data (heat and CO₂ from closed vents), rule out light, and justify why opening the vents is best', 1, 'Right. The answer explains one factor. Excellence weighs the evidence and justifies the recommendation.'],
          ['Say how many degrees too hot it is', 0, 'Numbers alone do not discuss or justify.'],
          ['Add that light makes ATP', 0, 'Light is not limiting at 3 pm. It needs ruling out, with a reason.'],
          ['Suggest turning on more lights', 0, 'Light is already bright, so this would not help.']]),
      ],
    },
  });

  /* ======================= 4. Aerobic respiration ======================= */
  P.addUnit({
    id: 'aerobic', title: 'Aerobic respiration and the mitochondrion', mins: 10,
    blurb: 'Glucose plus oxygen gives lots of ATP. Know the three stages and where they happen.',
    recap: 'Aerobic respiration releases energy from glucose using oxygen, storing it in ATP. Glycolysis happens in the cytoplasm and splits glucose into pyruvate, making 2 ATP. In the mitochondria, the Krebs cycle (in the matrix) releases carbon dioxide, and the electron transport chain (on the inner membrane, folded into cristae) uses oxygen and makes most of the ATP: about 36 to 38 in all. Water is made when oxygen accepts electrons and hydrogen.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>Respiration releases the energy stored in glucose.</h2>'), C(3, '<p>It happens in every living cell, all the time: plants and animals.</p>'), C(7.5, '<p>The energy is caught in ATP, the cell’s energy currency.</p>')],
        board: [L(0.5, `glucose + oxygen <span class="pen">→</span> carbon dioxide + water + energy (ATP)`, 'word equation'), L(3.5, `${GLU} + 6${O2} → 6${CO2} + 6${H2O} + ATP`, 'balanced', { hl: true }), L(7, '<span class="muted">the reverse of photosynthesis’s equation, but a different process</span>')] },
      { dur: 14, card: [C(0, '<h2>Three stages, three places</h2>'), C(3, '<p>1. Glycolysis in the cytoplasm: glucose → 2 pyruvate, 2 ATP. No oxygen needed.</p>'), C(7, '<p>2. Krebs cycle in the matrix: CO₂ released, hydrogen carriers loaded.</p>'), C(10.5, '<p>3. Electron transport chain on the cristae: oxygen used, water made, about 32–34 ATP.</p>')],
        draw(a) {
          const { W, H, C: c } = a;
          a.round(W * 0.03, H * 0.08, W * 0.94, H * 0.84, 18, { fill: c.paper, stroke: c.line, alpha: 1 });
          a.text('cytoplasm', W * 0.07, H * 0.15, { font: 'pen', col: c.muted });
          a.text('glucose → 2 pyruvate', W * 0.07, H * 0.3, { font: 'head', size: 0.85, alpha: a.seg(a.p, 0.15, 0.25) });
          a.text('+2 ATP', W * 0.07, H * 0.38, { col: c.pen, size: 0.85, alpha: a.seg(a.p, 0.18, 0.28) });
          Bio.cv.mito(a, W * 0.62, H * 0.6, W * 0.62, H * 0.5, a.seg(a.p, 0.25, 0.35));
          a.arrow(W * 0.24, H * 0.42, W * 0.36, H * 0.55, c.ink, 2.5, a.seg(a.p, 0.35, 0.45));
          a.text('Krebs: matrix → CO₂', W * 0.62, H * 0.6, { align: 'center', font: 'head', size: 0.8, bg: c.sheet, alpha: a.seg(a.p, 0.5, 0.6) });
          a.text('ETC on cristae: O₂ → H₂O, ~34 ATP', W * 0.62, H * 0.92, { align: 'center', font: 'head', size: 0.78, col: c.pen, alpha: a.seg(a.p, 0.75, 0.85) });
        } },
      { dur: 12, card: [C(0, '<h2>Why the folds matter</h2>'), C(3, '<p>The inner membrane is folded into cristae. That gives a large surface area for the electron transport chain.</p>'), C(8, '<p>More membrane, more ATP made. Very active cells, like muscle and sperm, have many mitochondria with many cristae.</p>')],
        draw(a) {
          const { W, H, C: c } = a;
          Bio.cv.mito(a, W * 0.5, H * 0.5, W * 0.8, H * 0.6, 1);
          a.tag('outer membrane', W * 0.06, H * 0.1, W * 0.3, H * 0.24, { alpha: a.seg(a.p, 0.05, 0.15) });
          a.tag('crista (fold of inner membrane)', W * 0.06, H * 0.92, W * 0.38, H * 0.66, { alpha: a.seg(a.p, 0.2, 0.3) });
          a.tag('matrix', W * 0.78, H * 0.92, W * 0.62, H * 0.5, { alpha: a.seg(a.p, 0.4, 0.5) });
        } },
    ],
    example: {
      problem: 'Explain why a muscle cell contains many mitochondria with many cristae.',
      steps: [
        { m: 'Muscle cells need a lot of energy to contract, supplied as ATP.', note: 'the need' },
        { m: 'Most ATP is made by aerobic respiration in the mitochondria, in the electron transport chain on the inner membrane.', note: 'where ATP is made' },
        { m: 'Cristae fold the inner membrane, giving a large surface area for the electron transport chain.', note: 'structure' },
        { m: 'So more mitochondria with more cristae can make more ATP, meeting the muscle’s high energy demand.', note: 'linked conclusion' },
      ],
    },
    faded() { return Bio.labelGen((w) => Bio.mitochondrion(w), { outer: 'Outer membrane', inner: 'Inner membrane', crista: 'Crista', matrix: 'Matrix' }, { n: 4, extra: ['Stroma', 'Granum', 'Thylakoid'], prompt: 'Label the mitochondrion.', idea: 'The Krebs cycle happens in the matrix; the electron transport chain is on the inner membrane, folded into cristae.' })(); },
    grades: 'AAAMM',
    gens: [
      P.terms([['aerobic respiration', 'Releasing energy from glucose using oxygen, producing carbon dioxide, water and lots of ATP.'], ['ATP', 'The molecule cells use to carry and supply energy.'], ['glycolysis', 'The first stage of respiration, in the cytoplasm, splitting glucose into two pyruvate.'], ['Krebs cycle', 'The stage in the mitochondrial matrix that releases carbon dioxide.'], ['electron transport chain', 'The stage on the inner mitochondrial membrane that uses oxygen and makes most of the ATP.'], ['cristae', 'Folds of the inner mitochondrial membrane that give a large surface area.'], ['matrix', 'The fluid inside the inner membrane of a mitochondrion.']]),
      Bio.labelGen((w) => Bio.mitochondrion(w), { outer: 'Outer membrane', inner: 'Inner membrane', crista: 'Crista', matrix: 'Matrix', ims: 'Intermembrane space' }, { n: 4, extra: ['Stroma', 'Thylakoid'], prompt: 'Label the mitochondrion.' }),
      P.bank([
        { q: 'Where does glycolysis happen?', a: 'In the cytoplasm', why: 'Glycolysis does not need mitochondria or oxygen.', w: [['In the mitochondrial matrix', 'That is the Krebs cycle.'], ['On the cristae', 'That is the electron transport chain.'], ['In the chloroplast', 'Chloroplasts are for photosynthesis.']] },
        { q: 'Which stage of aerobic respiration uses oxygen?', a: 'The electron transport chain', why: 'Oxygen is the final acceptor of electrons and hydrogen, forming water.', w: [['Glycolysis', 'Glycolysis does not need oxygen.'], ['The Krebs cycle', 'The Krebs cycle releases CO₂; oxygen is used at the end of the chain.'], ['All three stages equally', 'Only the electron transport chain uses oxygen directly.']] },
        { q: 'About how many ATP does aerobic respiration make from one glucose?', a: 'About 36–38', why: '2 from glycolysis, 2 from the Krebs cycle, and about 32–34 from the electron transport chain.', w: [['2', 'That is anaerobic respiration, or glycolysis alone.'], ['6', 'Six is the number of O₂ and CO₂ molecules in the equation.'], ['100', 'Far too many.']] },
        { q: 'What are the products of aerobic respiration?', a: 'Carbon dioxide, water and ATP', why: 'Glucose and oxygen go in.', w: [['Glucose and oxygen', 'Those are the reactants.'], ['Lactic acid and ATP', 'That is anaerobic respiration in animals.'], ['Ethanol and carbon dioxide', 'That is anaerobic respiration in yeast and plants.']] },
        { q: 'Where is carbon dioxide released in aerobic respiration?', a: 'In the Krebs cycle, in the matrix', why: 'Carbon atoms from pyruvate leave as CO₂ in the matrix.', w: [['In glycolysis', 'Glycolysis releases no CO₂.'], ['On the cristae', 'The cristae are where oxygen is used.'], ['In the cytoplasm', 'Only glycolysis is in the cytoplasm.']] },
      ]),
      P.bank([
        { q: 'Why does the inner mitochondrial membrane have so many folds (cristae)?', a: 'To give a large surface area for the electron transport chain, so more ATP is made', why: 'More membrane means more electron transport chains, and so more ATP per second.', w: [['To store glucose', 'Glucose is not stored in mitochondria.'], ['To let more oxygen in through the outer membrane', 'The folds are in the inner membrane, for the chain.'], ['To hold the DNA', 'Mitochondrial DNA is in the matrix; the folds are for ATP production.']] },
        { q: 'Why do sperm cells have many mitochondria in the mid-piece?', a: 'They need lots of ATP to power the tail as they swim', why: 'High energy demand → many mitochondria → lots of aerobic respiration.', w: [['To store energy for the embryo', 'Sperm do not supply the embryo’s energy.'], ['To carry oxygen to the egg', 'Mitochondria do not carry oxygen.'], ['To make glucose', 'Mitochondria use glucose (as pyruvate), not make it.']] },
        { q: 'Why does aerobic respiration stop if oxygen runs out, even though glycolysis does not use oxygen?', a: 'Without oxygen to accept electrons, the electron transport chain and Krebs cycle stop', why: 'Oxygen is the final electron acceptor. Without it the chain backs up and the mitochondria stop making ATP. Only glycolysis can continue (anaerobically).', w: [['Glycolysis needs oxygen', 'Glycolysis does not need oxygen.'], ['Glucose cannot enter the cell', 'Glucose entry does not depend on oxygen.'], ['Carbon dioxide builds up and stops it', 'The key problem is no final electron acceptor.']] },
      ]),
      P.chain([
        { q: 'Put the stages of aerobic respiration in order.', steps: ['Glucose enters the cell', 'In the cytoplasm, glycolysis splits glucose into two pyruvate (2 ATP)', 'Pyruvate moves into the mitochondrial matrix', 'The Krebs cycle releases CO₂ and loads hydrogen carriers', 'On the cristae, the electron transport chain uses oxygen and makes most of the ATP'] },
        { q: 'Put the steps in order: why a sprinter’s leg muscles have many mitochondria.', steps: ['Sprinting muscles contract hard and often', 'Contraction needs a lot of ATP', 'Most ATP comes from the electron transport chain in mitochondria', 'Many mitochondria with many cristae give a large surface area for the chain', 'So the cells can make ATP fast enough to meet demand'] },
      ]),
    ],
    tips: [
      'Learn the <span class="pen">stage → place</span> pairs: glycolysis → cytoplasm; Krebs → matrix; electron transport chain → cristae (inner membrane).',
      'Say “releases energy”, never “makes energy”. Energy is transferred to ATP.',
      'Plants respire too, all the time. Do not write that plants only photosynthesise.',
      'Merit candidates in 2025 explained the functions of the different parts of the mitochondrion. Link each part to what happens there.',
    ],
    aim: {
      intro: '<div class="resource">Hummingbirds hover by beating their wings about 50 times a second. Their flight muscle cells contain far more mitochondria than human muscle cells, and the inner membranes of those mitochondria are very tightly folded.</div>',
      parts: [
        { q: 'Describe aerobic respiration: give the equation and the three stages, with where each happens.', write: true, words: '50–70',
          model: [S('Glucose + oxygen → carbon dioxide + water + energy (ATP).', 'equation', true), S('Glycolysis happens in the cytoplasm.', 'stage 1', true), S('The Krebs cycle happens in the mitochondrial matrix.', 'stage 2', true), S('The electron transport chain happens on the inner membrane (cristae).', 'stage 3', true)],
          earns: 'Achieved: the equation and the three stages placed correctly.',
          crit: { A: 'Word or balanced equation; glycolysis in cytoplasm, Krebs cycle in matrix, electron transport chain on inner membrane/cristae.' } },
        { q: 'Explain why the hummingbird’s flight muscle cells have so many mitochondria with tightly folded inner membranes.', write: true, words: '60–90',
          model: [S('Hovering needs very fast, constant muscle contraction, which uses a lot of ATP.', 'energy demand', true), S('Most ATP is made by the electron transport chain on the inner mitochondrial membrane.', 'where ATP comes from'), S('Tightly folded cristae give a very large surface area for the electron transport chain.', 'structure'), S('More mitochondria and more cristae mean more ATP can be made per second, meeting the high demand.', 'linked conclusion', true)],
          earns: 'Merit: the structure is linked to its function and to the bird’s energy demand.',
          crit: { A: 'States muscles need lots of energy or that mitochondria make ATP.', M: 'Explains: high ATP demand; ETC on cristae; folding gives large surface area → more ATP; more mitochondria → more ATP.' } },
        { q: 'Discuss why hovering muscles rely on aerobic rather than anaerobic respiration. Compare the two in your answer.', write: true, words: '100–140',
          model: [S('Aerobic respiration makes about 36–38 ATP per glucose; anaerobic makes only 2.', 'compares yield', true), S('Hovering is constant work, so the muscles need a large, steady supply of ATP that only aerobic respiration can give.', 'links to the context', true), S('Anaerobic respiration in animals makes lactic acid, which builds up and causes muscle fatigue, so it cannot be kept up for long.', 'downside of anaerobic'), S('Aerobic respiration needs a steady oxygen supply, and its products, CO₂ and water, are easily removed.', 'why aerobic suits'), S('So aerobic respiration is the only way to keep hovering going; anaerobic is useful only for short bursts.', 'justified judgement', true)],
          earns: 'Excellence: a comparison of yield and products, linked to the demands of hovering, ending in a justified judgement.',
          crit: { M: 'Explains aerobic gives much more ATP, or that lactic acid causes fatigue.', E: 'Compares ATP yield and products of both, links to constant high demand of hovering, and justifies why aerobic is needed (anaerobic only for bursts).' } },
      ],
      up: [
        up(1, ['Hummingbirds need lots of energy, so they have more mitochondria.'], [
          ['Explain how: ATP is made by the electron transport chain on the cristae, and more folds and more mitochondria mean more ATP per second', 1, 'Right. The answer gives the need but not how the structure meets it. Merit links structure to function.'],
          ['Say how fast the wings beat', 0, 'That is already in the resource. Use it to explain, do not repeat it.'],
          ['Say that mitochondria are organelles', 0, 'True, but it does not explain anything.'],
          ['Give the word equation', 0, 'The equation does not explain the structure.']]),
        up(2, ['Aerobic respiration makes more ATP than anaerobic, so the hummingbird uses aerobic respiration.'], [
          ['Compare in detail (36–38 vs 2 ATP, lactic acid and fatigue), link to constant hovering, and give a justified judgement', 1, 'Right. The answer states one difference. Excellence compares fully and links it to the context.'],
          ['Add the balanced equation for aerobic respiration', 0, 'The equation does not compare or justify.'],
          ['Say anaerobic is bad', 0, 'Too vague, and anaerobic has a use: short bursts.'],
          ['Name the three stages', 0, 'Describing the stages does not make the comparison.']]),
      ],
    },
  });

  /* ======================= 5. Anaerobic respiration ======================= */
  P.addUnit({
    id: 'anaerobic', title: 'Anaerobic respiration, and comparing the two', mins: 9,
    blurb: 'No oxygen: glycolysis only, 2 ATP, lactic acid or ethanol. Then compare and contrast.',
    recap: 'Anaerobic respiration releases energy from glucose without oxygen. It happens in the cytoplasm and is really glycolysis alone, so it makes only 2 ATP per glucose. In animal cells the pyruvate becomes lactic acid. In yeast and plant cells it becomes ethanol and carbon dioxide (fermentation). It is fast and needs no oxygen, but it gives far less ATP than aerobic respiration, and lactic acid causes muscle fatigue.',
    scenes: [
      { dur: 12, card: [C(0, '<h2>No oxygen? Glycolysis carries on.</h2>'), C(3, '<p>Without oxygen the mitochondria stop, but glycolysis in the cytoplasm still gives 2 ATP.</p>'), C(7.5, '<p>The pyruvate is turned into something else, so glycolysis can keep going.</p>')],
        board: [L(0.5, '<b>Animals</b>: glucose → lactic acid + 2 ATP', 'muscle'), L(3.5, '<b>Yeast, plants</b>: glucose → ethanol + carbon dioxide + 2 ATP', 'fermentation'), L(7, 'both in the <b>cytoplasm</b>, no oxygen needed', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Compare and contrast: the Excellence move</h2>'), C(3, '<p>Put the two side by side on every feature. Then say when each is useful.</p>')],
        board: [L(0.5, 'oxygen: aerobic needs it; anaerobic does not'), L(2.5, 'ATP per glucose: aerobic 36–38; anaerobic 2'), L(4.5, 'where: aerobic cytoplasm + mitochondria; anaerobic cytoplasm only'), L(6.5, 'products: aerobic CO₂ + water; anaerobic lactic acid, or ethanol + CO₂'), L(8.5, 'speed: anaerobic is faster, for short bursts', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>The oxygen debt</h2>'), C(3, '<p>After a sprint you keep breathing hard. The extra oxygen is used to break down the lactic acid.</p>'), C(8, '<p>Lactic acid lowers the pH in the muscle, which slows its enzymes: that is fatigue.</p>')],
        draw(a) {
          const v = a.view(0, 10, 0, 10); a.axes(v, { step: 2, labels: false });
          a.text('time', a.W - 20, v.Y(0) + 18, { align: 'right', size: 0.8, col: a.C.muted }); a.text('lactic acid', v.X(0) + 6, v.Y(10) + 4, { size: 0.8, col: a.C.muted });
          const f = (t) => (t < 3 ? 1 : t < 5 ? 1 + 3.5 * (t - 3) : 8 * Math.exp(-(t - 5) / 1.8) + 1);
          a.plot(v, f, a.C.pen, 4, a.seg(a.p, 0.05, 0.7));
          a.alpha(a.seg(a.p, 0.25, 0.35), () => a.text('sprint', v.X(3.2), v.Y(9.4), { font: 'pen', col: a.C.ink }));
          a.alpha(a.seg(a.p, 0.6, 0.7), () => a.text('recovery: oxygen debt repaid', v.X(5.6), v.Y(6), { font: 'pen', col: a.C.ink }));
        } },
    ],
    example: {
      problem: 'Compare aerobic and anaerobic respiration in human muscle.',
      steps: [
        { m: 'Aerobic respiration needs oxygen; anaerobic respiration does not.', note: 'one feature, both sides' },
        { m: 'Aerobic happens in the cytoplasm and mitochondria; anaerobic happens in the cytoplasm only.', note: 'location' },
        { m: 'Aerobic makes about 36–38 ATP per glucose; anaerobic makes only 2.', note: 'yield' },
        { m: 'Aerobic produces carbon dioxide and water; anaerobic produces lactic acid, which causes muscle fatigue.', note: 'products' },
        { m: 'So aerobic suits long, steady activity, and anaerobic gives fast energy for short bursts when oxygen cannot be supplied quickly enough.', note: 'when each is useful' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: why your legs ache at the end of a 400 m sprint.', steps: ['Muscles need ATP faster than oxygen can be delivered', 'Cells switch to anaerobic respiration', 'Pyruvate is turned into lactic acid', 'Lactic acid builds up and lowers the pH in the muscle', 'Enzymes work less well, causing fatigue and pain'] }], 2)(); },
    grades: 'AAMMM',
    gens: [
      P.terms([['anaerobic respiration', 'Releasing energy from glucose without oxygen, making only 2 ATP.'], ['lactic acid', 'The product of anaerobic respiration in animal cells.'], ['fermentation', 'Anaerobic respiration in yeast and plants, making ethanol and carbon dioxide.'], ['oxygen debt', 'The extra oxygen needed after exercise to break down lactic acid.'], ['muscle fatigue', 'Muscles working less well, partly because lactic acid lowers the pH.'], ['glycolysis', 'Splitting glucose into pyruvate in the cytoplasm; the only energy-releasing stage in anaerobic respiration (pyruvate is then turned into lactic acid, or ethanol and CO₂).']]),
      P.bank([
        { q: 'What does anaerobic respiration in yeast produce?', a: 'Ethanol, carbon dioxide and 2 ATP', why: 'This is fermentation, used in brewing and baking.', w: [['Lactic acid and 2 ATP', 'That is animal cells.'], ['Carbon dioxide, water and 36 ATP', 'That is aerobic respiration.'], ['Oxygen and glucose', 'Those are products of photosynthesis.']] },
        { q: 'Where does anaerobic respiration happen?', a: 'In the cytoplasm', why: 'It is glycolysis plus one extra step, both in the cytoplasm.', w: [['In the mitochondria', 'Mitochondria need oxygen to work.'], ['In the chloroplasts', 'That is photosynthesis.'], ['In the nucleus', 'The nucleus does not respire.']] },
        { q: 'How many ATP does anaerobic respiration make per glucose?', a: '2', why: 'Only glycolysis runs, giving 2 ATP.', w: [['36–38', 'That is aerobic.'], ['0', 'It does release some energy.'], ['6', 'Not a respiration yield.']] },
        { q: 'What does anaerobic respiration in human muscle produce?', a: 'Lactic acid and 2 ATP', why: 'No CO₂ is produced in animal anaerobic respiration.', w: [['Ethanol and carbon dioxide', 'That is yeast and plants.'], ['Carbon dioxide and water', 'That is aerobic.'], ['Glucose and oxygen', 'Those are photosynthesis products.']] },
      ]),
      P.bank([
        { q: 'Why does bread dough rise when yeast is added?', a: 'Yeast respires anaerobically, releasing carbon dioxide gas that is trapped in the dough', why: 'The CO₂ from fermentation makes bubbles. The ethanol evaporates in the oven.', w: [['Yeast releases oxygen', 'Respiration uses oxygen; it does not release it.'], ['Yeast makes lactic acid', 'Yeast makes ethanol and CO₂.'], ['The flour photosynthesises', 'Flour is not alive.']] },
        { q: 'Why can a sprinter keep going for only about 40 seconds at full speed?', a: 'Anaerobic respiration supplies the extra ATP, but lactic acid builds up and causes fatigue', why: 'Anaerobic respiration is fast but limited by lactic acid build-up.', w: [['The body runs out of glucose', 'Glucose does not run out in 40 seconds.'], ['Aerobic respiration makes too much ATP', 'More ATP would not stop them.'], ['The mitochondria explode', 'They do not. The issue is lactic acid.']] },
        { q: 'Why do you keep breathing hard after a sprint has finished?', a: 'Extra oxygen is needed to break down the lactic acid: the oxygen debt', why: 'The lactic acid is converted back, mostly in the liver, using oxygen.', w: [['To cool the body', 'Sweating cools the body.'], ['To store oxygen for next time', 'Oxygen is not stored like that.'], ['Because the lungs are damaged', 'Heavy breathing after exercise is normal.']] },
      ]),
      P.bank([
        { q: 'Which statement correctly compares the two?', a: 'Aerobic gives far more ATP per glucose; anaerobic is faster and needs no oxygen', why: 'That is the trade-off.', w: [['Anaerobic gives more ATP but is slower', 'Anaerobic gives much less ATP.'], ['Both happen only in mitochondria', 'Anaerobic is in the cytoplasm.'], ['Both produce lactic acid', 'Only anaerobic in animals does.']] },
        { q: 'Why is anaerobic respiration useful to plant roots in waterlogged soil?', a: 'There is little oxygen in waterlogged soil, so roots can still get some ATP', why: 'Waterlogging pushes air out of the soil spaces. Fermentation keeps root cells alive for a while.', w: [['It gives more ATP than aerobic', 'It gives much less.'], ['It makes oxygen for the leaves', 'Respiration never makes oxygen.'], ['It stops the roots taking up water', 'Not a benefit.']] },
        { q: 'Why is less energy released in anaerobic respiration?', a: 'Glucose is only partly broken down: much energy is left in the lactic acid or ethanol', why: 'Without the Krebs cycle and electron transport chain, most of the energy in glucose is not released.', w: [['Energy is destroyed without oxygen', 'Energy is not destroyed; it stays in the product.'], ['Anaerobic uses less glucose', 'It uses glucose faster.'], ['The ATP is used up straight away', 'All ATP is used; the yield is still only 2.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: how anaerobic respiration keeps going.', steps: ['Glucose is split into pyruvate in glycolysis, making 2 ATP', 'Without oxygen, pyruvate cannot enter the Krebs cycle', 'Pyruvate is converted to lactic acid (in animals)', 'This frees up the carrier that glycolysis needs', 'So glycolysis can continue, still making 2 ATP per glucose'] },
      ]),
    ],
    tips: [
      'Compare <span class="pen">both sides of every feature</span>: oxygen, place, ATP, products, speed. Two separate descriptions are not a comparison.',
      'Animals make lactic acid. Yeast and plants make ethanol and carbon dioxide. No CO₂ in animal anaerobic respiration.',
      'Excellence in 2025: link energy demand in the context to when each type is useful.',
      'The 2025 examiners named confusing photosynthesis with respiration as a Not Achieved error. Keep them separate.',
    ],
    aim: {
      intro: '<div class="resource">A winemaker adds yeast to crushed grapes in an open vat, then seals the vat. Bubbles stream from the airlock for several days. The alcohol content rises to about 12%, then fermentation stops, even though sugar is still left.</div>',
      parts: [
        { q: 'Describe anaerobic respiration in yeast: where it happens and what it produces.', write: true, words: '30–50',
          model: [S('Anaerobic respiration happens in the cytoplasm of the yeast cell, without oxygen.', 'where, no oxygen', true), S('Glucose is broken down to ethanol and carbon dioxide.', 'products', true), S('Only 2 ATP are made per glucose.', 'yield')],
          earns: 'Achieved: the right products and place, using correct terms.',
          crit: { A: 'Cytoplasm; no oxygen; ethanol and carbon dioxide; 2 ATP.' } },
        { q: 'Explain why sealing the vat makes the yeast produce alcohol, and why bubbles form.', write: true, words: '60–90',
          model: [S('In the open vat, yeast respires aerobically, using the oxygen in the juice.', 'before sealing'), S('Once the vat is sealed, the oxygen is used up and not replaced.', 'the change', true), S('Without oxygen, yeast switches to anaerobic respiration (fermentation), turning glucose into ethanol and carbon dioxide.', 'mechanism', true), S('The carbon dioxide gas escapes through the airlock as bubbles.', 'links to the bubbles', true)],
          earns: 'Merit: the sealing is linked to the loss of oxygen, the switch to fermentation, and both results.',
          crit: { A: 'States no oxygen leads to anaerobic respiration making ethanol and CO₂.', M: 'Explains sealing → oxygen used up → anaerobic respiration → ethanol made and CO₂ released as bubbles.' } },
        { q: 'Discuss why fermentation stops at about 12% alcohol even though sugar remains. Compare the yeast’s position with a muscle cell working anaerobically.', write: true, words: '100–140',
          model: [S('Ethanol is a product of fermentation, and as it builds up it becomes toxic to the yeast.', 'the cause', true), S('At about 12% it damages the yeast cells (their membranes and enzymes), so they stop respiring or die, so fermentation stops while sugar is left.', 'mechanism, uses the data', true), S('In a muscle cell the product is lactic acid. It also builds up and lowers the pH, slowing enzymes and causing fatigue.', 'the comparison'), S('The difference is that lactic acid can be removed: it is carried away in the blood and broken down with oxygen (the oxygen debt), so the muscle recovers.', 'contrast'), S('In the sealed vat nothing removes the ethanol, so the yeast cannot recover. In both cases the build-up of the product, not the supply of glucose, is what stops anaerobic respiration.', 'justified conclusion', true)],
          earns: 'Excellence: the data are explained by product build-up, and the comparison with muscle shows a real similarity and a real difference, leading to a general conclusion.',
          crit: { M: 'Explains that ethanol builds up and is toxic, stopping fermentation.', E: 'Explains the toxicity mechanism using the 12% data; compares with lactic acid in muscle (similar build-up, but lactic acid is removed/oxygen debt); concludes that product build-up, not glucose, limits anaerobic respiration.' } },
      ],
      up: [
        up(1, ['When the vat is sealed the yeast does anaerobic respiration and makes alcohol and gas.'], [
          ['Link the steps: sealing means the oxygen is used up and not replaced, so the yeast switches to fermentation; the CO₂ escapes as bubbles', 1, 'Right. The answer says what happens but not why. Merit links sealing to oxygen loss and both results.'],
          ['Name the gas', 0, 'Naming CO₂ helps, but the missing piece is the link from sealing to the switch.'],
          ['Say yeast is a fungus', 0, 'True, but not the explanation.'],
          ['Add the percentage of alcohol', 0, 'The 12% is for part (c).']]),
        up(2, ['The yeast stops because the alcohol is toxic and kills it. Muscles also make lactic acid which causes fatigue.'], [
          ['Explain the mechanism using the data, and contrast: lactic acid is removed and broken down with oxygen, but ethanol in the vat is not, so the yeast cannot recover', 1, 'Right. The answer mentions both but never compares them. Excellence needs the similarity and the difference, and a conclusion.'],
          ['Say how long fermentation took', 0, 'The days are not the point. The comparison is.'],
          ['Explain that yeast also respires aerobically', 0, 'True, but it does not explain the 12% or compare with muscle.'],
          ['Give the equation for fermentation', 0, 'The equation does not compare.']]),
      ],
    },
  });

  /* ======================= 6. How enzymes work ======================= */
  P.addUnit({
    id: 'enzymes', title: 'How enzymes work', mins: 9,
    blurb: 'Active site, substrate, enzyme–substrate complex. Draw it, label it, explain specificity.',
    recap: 'Enzymes are proteins that act as biological catalysts: they speed up reactions without being used up. Each enzyme has an active site with a specific shape that fits only its substrate. The substrate binds to the active site, forming an enzyme–substrate complex; the reaction happens, and the products are released. The enzyme is left unchanged and can be used again. Enzymes work by lowering the activation energy of the reaction.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Lock and key</h2>'), C(3, '<p>The active site has a shape that fits one substrate. That is why enzymes are specific.</p>'), C(7.5, '<p>Substrate in → enzyme–substrate complex → products out. The enzyme is unchanged and ready again.</p>')],
        draw(a) {
          const { W, H, C: c } = a, s = Math.min(W, H) * 0.42, cx = W * 0.5, cy = H * 0.62;
          Bio.cv.enzyme(a, cx, cy, s, { fill: c.c1 });
          const p = a.p; const top = cy - 0.78 * s + 0.28 * s;
          if (p < 0.6) { const y = top - (1 - a.seg(p, 0.1, 0.45)) * H * 0.4; Bio.cv.substrate(a, cx, y, s); }
          else { const sp = a.seg(p, 0.6, 0.9) * W * 0.2; a.round(cx - 0.14 * s - sp, top - 0.28 * s - sp * 0.6, 0.13 * s, 0.28 * s, 4, { fill: c.c2, stroke: c.ink }); a.round(cx + 0.01 * s + sp, top - 0.28 * s - sp * 0.6, 0.13 * s, 0.28 * s, 4, { fill: c.c2, stroke: c.ink }); }
          a.text('enzyme', cx, cy + 0.15 * s, { align: 'center', font: 'head', col: c.paper });
          a.alpha(a.seg(p, 0.42, 0.5) * (1 - a.seg(p, 0.58, 0.62)), () => a.text('enzyme–substrate complex', cx, H * 0.08, { align: 'center', font: 'pen', col: c.pen }));
          a.alpha(a.seg(p, 0.7, 0.8), () => a.text('products released', cx, H * 0.08, { align: 'center', font: 'pen', col: c.pen }));
        } },
      { dur: 12, card: [C(0, '<h2>Why it speeds things up</h2>'), C(3, '<p>Every reaction needs a push of energy to start: the activation energy.</p>'), C(7, '<p>An enzyme lowers the activation energy, so the reaction happens fast at body temperature.</p>')],
        draw(a) {
          const v = a.view(0, 10, 0, 10); a.axes(v, { step: 2, labels: false });
          a.text('progress of reaction', a.W - 20, v.Y(0) + 18, { align: 'right', size: 0.8, col: a.C.muted }); a.text('energy', v.X(0) + 6, v.Y(10) + 4, { size: 0.8, col: a.C.muted });
          const g = (h) => (x) => 6 - 3 * (x / 10) + h * Math.exp(-((x - 5) ** 2) / 2.2);
          a.plot(v, g(3.5), a.C.muted, 3.5, a.seg(a.p, 0.05, 0.4)); a.alpha(a.seg(a.p, 0.3, 0.4), () => a.text('no enzyme', v.X(5.2), v.Y(9.3), { font: 'pen', col: a.C.muted }));
          a.plot(v, g(1.4), a.C.c1, 3.5, a.seg(a.p, 0.45, 0.8)); a.alpha(a.seg(a.p, 0.7, 0.8), () => a.text('with enzyme: lower', v.X(5.6), v.Y(7.2), { font: 'pen', col: a.C.c1 }));
        } },
      { dur: 11, card: [C(0, '<h2>Words that earn marks</h2>')],
        board: [L(0.5, '<b>catalyst</b>: speeds up a reaction, not used up'), L(2.5, '<b>active site</b>: the part with a specific shape'), L(4.5, '<b>specific</b>: only one substrate fits'), L(6.5, '<b>enzyme–substrate complex</b>: substrate bound in the active site'), L(8.5, '<b>activation energy</b>: lowered by the enzyme', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain why the enzyme amylase breaks down starch but not protein.',
      steps: [
        { m: 'Amylase has an active site with a specific shape.', note: 'specificity' },
        { m: 'Only starch has the shape that fits (is complementary to) that active site.', note: 'fit' },
        { m: 'So starch can bind and form an enzyme–substrate complex, and be broken down.', note: 'complex forms' },
        { m: 'Protein has a different shape, so it cannot bind, and no complex forms.', note: 'the contrast' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how an enzyme catalyses a reaction.', steps: ['The substrate collides with the enzyme', 'The substrate fits into the active site', 'An enzyme–substrate complex forms', 'The reaction happens and products form', 'The products leave; the enzyme is unchanged and can be reused'] }], 2)(); },
    grades: 'AAAMM',
    gens: [
      P.terms([['enzyme', 'A protein that acts as a biological catalyst.'], ['catalyst', 'A substance that speeds up a reaction without being used up.'], ['active site', 'The part of an enzyme with a specific shape where the substrate binds.'], ['substrate', 'The molecule an enzyme acts on.'], ['enzyme–substrate complex', 'The substrate bound in the enzyme’s active site.'], ['activation energy', 'The energy needed to start a reaction; enzymes lower it.'], ['specificity', 'Each enzyme acts on only one substrate, because of the shape of its active site.']]),
      Bio.labelGen((w) => Bio.enzyme('complex', w), { site: 'Active site', enzyme: 'Enzyme', complex: 'Enzyme–substrate complex' }, { n: 3, extra: ['Product', 'Inhibitor'], prompt: 'Label the diagram of an enzyme at work.' }),
      P.bank([
        { q: 'Why can one enzyme be used over and over again?', a: 'It is not changed or used up by the reaction', why: 'A catalyst comes out of the reaction unchanged.', w: [['It makes copies of itself', 'Enzymes do not copy themselves.'], ['It is broken down and rebuilt each time', 'It is not broken down.'], ['It stores the products for later', 'The products are released.']] },
        { q: 'Why does each enzyme act on only one substrate?', a: 'Only that substrate’s shape fits the active site', why: 'The shapes are complementary, like a lock and key.', w: [['The enzyme chooses the most useful substrate', 'Enzymes do not choose.'], ['Other substrates are too big to reach the cell', 'The reason is the shape of the active site.'], ['Enzymes are only made when that substrate is present', 'Not the reason for specificity.']] },
        { q: 'How do enzymes speed up reactions?', a: 'They lower the activation energy', why: 'Less energy needed to start, so the reaction happens faster at body temperature.', w: [['They add heat to the reaction', 'Enzymes do not add heat.'], ['They are used up as fuel', 'They are not used up.'], ['They raise the activation energy', 'They lower it.']] },
        { q: 'What are enzymes made of?', a: 'Protein', why: 'Enzymes are proteins folded into a precise 3D shape.', w: [['Carbohydrate', 'Starch and glucose are carbohydrates; enzymes are proteins.'], ['Fat', 'Not an enzyme.'], ['DNA', 'DNA codes for enzymes but is not one.']] },
      ]),
      P.bank([
        { q: 'A mutation changes the shape of an enzyme’s active site. What is the most likely effect?', a: 'The substrate no longer fits, so the enzyme cannot catalyse the reaction', why: 'Function depends on the shape of the active site.', w: [['The enzyme works faster', 'A different shape rarely helps.'], ['The substrate changes shape to fit', 'The substrate stays the same.'], ['Nothing, because enzymes are reusable', 'Reusable or not, it needs the right shape.']] },
        { q: 'Why does a very small amount of enzyme process a lot of substrate?', a: 'Each enzyme molecule is reused many times, very quickly', why: 'One enzyme molecule can catalyse thousands of reactions a second.', w: [['The enzyme multiplies', 'Enzymes do not multiply.'], ['The substrate breaks down by itself', 'Without the enzyme it would be very slow.'], ['The products help the enzyme', 'Not the reason.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: what happens at the active site.', steps: ['A substrate molecule collides with the enzyme', 'It fits the active site, which has a complementary shape', 'An enzyme–substrate complex forms, lowering the activation energy', 'The substrate is changed into products', 'The products are released and the active site is free again'] },
      ]),
    ],
    tips: [
      'Draw it: enzyme, active site, substrate, enzyme–substrate complex. The 2025 report gave Achieved for a correct diagram, and noted that not identifying the active site was a common Not Achieved error.',
      'Use the exact words: <span class="pen">active site, specific, complementary, enzyme–substrate complex.</span>',
      'Enzymes are not alive. They are not “killed”; they are denatured.',
      'Say “catalyst, not used up” and “lowers activation energy”. Each is a mark-earning idea.',
    ],
    aim: {
      intro: '<div class="resource">Kiwifruit contain the enzyme actinidin, which breaks down proteins. If raw kiwifruit is added to gelatine (a protein) to make a jelly, the jelly does not set. Cooked or tinned kiwifruit does not have this effect.</div>',
      parts: [
        { q: 'Describe what an enzyme is and how actinidin acts on its substrate.', write: true, words: '40–60',
          model: [S('An enzyme is a protein that acts as a biological catalyst: it speeds up a reaction without being used up.', 'definition', true), S('Actinidin has an active site with a specific shape.', 'active site', true), S('The protein in gelatine binds to the active site, forming an enzyme–substrate complex, and is broken down.', 'the action', true)],
          earns: 'Achieved: a correct definition and a description of the enzyme–substrate complex.',
          crit: { A: 'Protein/biological catalyst; active site; substrate binds; enzyme–substrate complex; products.' } },
        { q: 'Explain why actinidin breaks down gelatine, but does not break down the sugar (sucrose) in the jelly’s syrup.', write: true, words: '60–90',
          model: [S('Enzymes are specific because each active site has a particular shape.', 'specificity', true), S('Gelatine (protein) has a shape that is complementary to actinidin’s active site, so it binds and forms an enzyme–substrate complex.', 'why gelatine is broken down', true), S('Starch has a different shape, so it cannot fit the active site; no complex forms and it is not broken down.', 'the contrast', true), S('So the gelatine is broken down into smaller pieces and the jelly does not set.', 'links to the result')],
          earns: 'Merit: specificity explained by the shape of the active site, applied to both substances and linked to the jelly.',
          crit: { M: 'Explains specificity: complementary shape of active site to protein → complex forms; starch different shape → no complex.' } },
        { q: 'Discuss why cooked kiwifruit does not stop jelly from setting, linking enzyme structure to function.', write: true, words: '90–130',
          model: [S('Actinidin is a protein whose function depends on the precise 3D shape of its active site.', 'structure → function', true), S('Cooking heats it well above its optimum, so the bonds holding its shape break.', 'mechanism'), S('The active site changes shape permanently: the enzyme is denatured.', 'denaturation', true), S('Gelatine no longer fits the active site, so no enzyme–substrate complexes form and the gelatine is not broken down.', 'consequence'), S('So the gelatine proteins stay long and can form the network that sets the jelly. Raw kiwifruit breaks them first; cooked kiwifruit cannot.', 'justified comparison', true)],
          earns: 'Excellence: denaturation is linked from bonds to shape to lost function, and used to compare raw and cooked fruit in the context.',
          crit: { M: 'Explains heat denatures the enzyme so it no longer works.', E: 'Links structure to function: heat breaks bonds → active site shape changes permanently → substrate no longer fits → gelatine not broken down → jelly sets; compares raw vs cooked.' } },
      ],
      up: [
        up(1, ['Actinidin breaks down protein. Starch is not a protein so it is not broken down.'], [
          ['Explain why, using shape: the active site is complementary to the protein, so it binds and forms a complex; starch’s shape does not fit', 1, 'Right. The answer says what happens, not why. Merit needs the active site and its specific shape.'],
          ['Say that starch is a carbohydrate', 0, 'True, but the reason is the shape of the active site.'],
          ['Say that enzymes are catalysts', 0, 'True, but it does not explain specificity.'],
          ['Name another enzyme', 0, 'Not relevant.']]),
        up(2, ['Cooking denatures the enzyme so it does not work any more, and the jelly sets.'], [
          ['Link structure to function: heat breaks the bonds holding the shape, the active site changes permanently, gelatine no longer fits, so no complexes form; then compare raw and cooked', 1, 'Right. “Denatures” is correct, but Excellence explains what denaturing does and why that changes the result.'],
          ['Give the cooking temperature', 0, 'A number does not explain the mechanism.'],
          ['Say the enzyme is killed', 0, 'Enzymes are not alive. That would lose marks.'],
          ['Repeat that raw kiwifruit stops jelly setting', 0, 'That is in the resource. Explain it.']]),
      ],
    },
  });

  /* ======================= 7. Factors affecting enzymes ======================= */
  const enzCurve = (opt, width) => (t) => { if (t <= 0) return 0; if (t < opt) return 8.5 * Math.pow(t / opt, 1.7); return Math.max(0, 8.5 * (1 - ((t - opt) / width) ** 2)); };
  P.addUnit({
    id: 'enzyme-factors', title: 'Temperature, pH and other factors', mins: 11,
    blurb: 'Kinetic energy and collisions, then denaturing. Plus pH, substrate concentration and inhibitors.',
    recap: 'As temperature rises, molecules gain kinetic energy and collide more often, so more enzyme–substrate complexes form and the rate rises, up to the optimum. Above the optimum, bonds holding the enzyme’s shape break, the active site changes shape and the enzyme denatures: the rate falls fast. Every enzyme also has an optimum pH; away from it the active site changes shape. More substrate raises the rate until all active sites are busy. Inhibitors block or change the active site; co-factors and co-enzymes are helpers some enzymes need.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Temperature: up, then a cliff.</h2>'), C(3, '<p>Rising side: more kinetic energy → more collisions → more enzyme–substrate complexes per second.</p>'), C(8.5, '<p>Past the optimum: bonds break, the active site changes shape, the enzyme denatures. Permanent.</p>')],
        draw(a) {
          const v = a.view(0, 60, 0, 10); a.axes(v, { step: 10, labels: false });
          for (let t = 10; t <= 60; t += 10) a.text(String(t), v.X(t), v.Y(0) + 14, { align: 'center', size: 0.7, col: a.C.faint });
          a.text('°C', a.W - 18, v.Y(0) + 14, { size: 0.75, col: a.C.muted });
          a.plot(v, enzCurve(37, 14), a.C.c1, 4, a.seg(a.p, 0.05, 0.7));
          a.alpha(a.seg(a.p, 0.3, 0.4), () => a.text('more collisions', v.X(8), v.Y(5), { font: 'pen', col: a.C.ink }));
          a.alpha(a.seg(a.p, 0.5, 0.6), () => a.text('optimum ~37 °C', v.X(30), v.Y(9.5), { font: 'pen', col: a.C.pen }));
          a.alpha(a.seg(a.p, 0.7, 0.8), () => a.text('denatured', v.X(46), v.Y(3), { font: 'pen', col: a.C.pen }));
        } },
      { dur: 12, card: [C(0, '<h2>Denatured: the shape is gone.</h2>'), C(3, '<p>The substrate no longer fits, so no complex can form. Cooling it down does not fix it.</p>'), C(8, '<p>Cold is different: the enzyme is just slow, and works again when warmed.</p>')],
        draw(a) {
          const { W, H, C: c } = a, s = Math.min(W * 0.24, H * 0.36);
          Bio.cv.enzyme(a, W * 0.28, H * 0.66, s, { fill: c.c1 }); Bio.cv.substrate(a, W * 0.28, H * 0.66 - 0.5 * s, s);
          a.text('active', W * 0.28, H * 0.92, { align: 'center', font: 'pen', col: c.ok });
          const b = a.seg(a.p, 0.2, 0.5);
          Bio.cv.enzyme(a, W * 0.72, H * 0.66, s, { fill: c.c1, bent: b > 0.5 }); Bio.cv.substrate(a, W * 0.72, H * 0.66 - 0.78 * s - b * 0.3 * s, s);
          a.text(b > 0.5 ? 'denatured: no fit' : 'heating…', W * 0.72, H * 0.92, { align: 'center', font: 'pen', col: c.pen });
        } },
      { dur: 13, card: [C(0, '<h2>pH has an optimum too.</h2>'), C(3, '<p>Pepsin in the stomach works best near pH 2. Amylase in saliva near pH 7.</p>'), C(8, '<p>Away from the optimum, charges on the active site change, so it changes shape and fits the substrate less well.</p>')],
        draw(a) {
          const v = a.view(0, 14, 0, 10); a.axes(v, { step: 2, labels: false });
          for (let t = 2; t <= 14; t += 2) a.text(String(t), v.X(t), v.Y(0) + 14, { align: 'center', size: 0.7, col: a.C.faint });
          a.text('pH', a.W - 18, v.Y(0) + 14, { size: 0.75, col: a.C.muted });
          const bell = (m, w) => (x) => 8.5 * Math.exp(-((x - m) ** 2) / (2 * w * w));
          a.plot(v, bell(2, 1), a.C.c2, 4, a.seg(a.p, 0.1, 0.5)); a.alpha(a.seg(a.p, 0.4, 0.5), () => a.text('pepsin', v.X(2.6), v.Y(9), { font: 'pen', col: a.C.c2 }));
          a.plot(v, bell(7, 1.2), a.C.c3, 4, a.seg(a.p, 0.5, 0.9)); a.alpha(a.seg(a.p, 0.8, 0.9), () => a.text('amylase', v.X(7.6), v.Y(9), { font: 'pen', col: a.C.c3 }));
        } },
      { dur: 13, card: [C(0, '<h2>Substrate, inhibitors, helpers</h2>')],
        board: [L(0.5, '<b>more substrate</b>: faster, until every active site is busy (plateau)'), L(3, '<b>competitive inhibitor</b>: similar shape, blocks the active site'), L(5.5, '<b>non-competitive inhibitor</b>: binds elsewhere, changes the active site’s shape'), L(8, '<b>co-factor</b> (e.g. a metal ion) or <b>co-enzyme</b> (e.g. from a vitamin): needed by some enzymes to work', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain the effect of increasing temperature from 20 °C to 60 °C on a human enzyme.',
      steps: [
        { m: 'From 20 °C to about 37 °C the rate increases.', note: 'describe' },
        { m: 'The enzyme and substrate molecules gain kinetic energy, move faster and collide more often, so more enzyme–substrate complexes form per second.', note: 'mechanism' },
        { m: 'The rate is highest at the optimum, about 37 °C.', note: 'optimum' },
        { m: 'Above 37 °C, the bonds holding the enzyme’s shape break, so the active site changes shape and the enzyme is denatured.', note: 'denaturing' },
        { m: 'The substrate no longer fits, so fewer complexes form and the rate falls to zero. This is permanent.', note: 'consequence' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: why the rate falls above the optimum temperature.', steps: ['The temperature rises above the optimum', 'The enzyme vibrates so much that bonds holding its shape break', 'The active site changes shape: the enzyme is denatured', 'The substrate no longer fits the active site', 'Fewer enzyme–substrate complexes form, so the rate falls'] }], 2)(); },
    grades: 'AMAMME',
    gens: [
      () => { // read the optimum from a graph
        const opt = R.pick([30, 35, 37, 40, 45, 50]), w = R.pick([10, 12, 14]);
        const fig = P.svg.graph([{ f: enzCurve(opt, w), col: 'var(--c1)' }], { x0: 0, x1: 70, y0: 0, y1: 10, step: 10, ystep: 2, w: 420, h: 250, alt: 'Rate of an enzyme reaction against temperature' });
        return P.mcq({ prompt: 'The graph shows the rate of an enzyme reaction (y) against temperature in °C (x). What is the enzyme’s optimum temperature?', fig, more: { steps: [St('The optimum is where the rate is highest: the peak of the curve.'), St(`The peak is at ${opt} °C.`), St('Below it, more heat means more collisions. Above it, the enzyme denatures.')] } },
          P.uniq([{ t: `${opt} °C`, ok: true }, { t: `${opt + w} °C`, why: 'The rate has fallen to zero there: the enzyme is fully denatured.' }, { t: `${opt - 15} °C`, why: 'The rate is still rising there.' }, { t: '100 °C', why: 'Off the graph, and far too hot.' }]));
      },
      P.bank([
        { q: 'Why does the rate of an enzyme reaction increase from 10 °C to 30 °C?', a: 'Molecules have more kinetic energy, so they collide more often and more enzyme–substrate complexes form', why: 'This is the mechanism the 2025 examiners rewarded at Merit: kinetic energy and collision frequency.', w: [['The enzyme gets bigger', 'Enzymes do not grow with heat.'], ['The active site changes shape to fit better', 'Below the optimum the shape does not change.'], ['More enzyme is made', 'The amount of enzyme does not change in a test tube.']] },
        { q: 'What happens to an enzyme at a temperature well above its optimum?', a: 'It denatures: its active site changes shape permanently', why: 'Bonds holding the shape break. Cooling does not reverse it.', w: [['It dies', 'Enzymes are not alive.'], ['It works faster forever', 'The rate falls above the optimum.'], ['It pauses, then works again when cooled', 'That is what happens at low temperatures, not high.']] },
        { q: 'An enzyme is kept at 5 °C, then warmed to 37 °C. What happens?', a: 'It works slowly at 5 °C, then works normally at 37 °C', why: 'Cold only slows enzymes (fewer collisions). It does not denature them.', w: [['It is denatured by the cold', 'Cold does not denature enzymes.'], ['It never works again', 'It recovers fully when warmed.'], ['It works faster at 5 °C', 'Fewer collisions means slower.']] },
        { q: 'Pepsin works in the stomach. Why does it stop working when it reaches the small intestine (pH about 8)?', a: 'pH 8 is far from its optimum (about pH 2), so its active site changes shape', why: 'Each enzyme has an optimum pH. A big change alters the charges on the active site, so the substrate no longer fits.', w: [['It is too hot in the intestine', 'The temperature is the same.'], ['It is used up in the stomach', 'Enzymes are not used up.'], ['It has no substrate there', 'There is protein; the problem is the pH.']] },
      ]),
      P.bank([
        { q: 'Adding more substrate increases the rate, until the rate levels off. Why does it level off?', a: 'All the active sites are occupied, so enzyme concentration is now limiting', why: 'Each enzyme can only process one substrate at a time. More substrate has to wait.', w: [['The substrate is used up', 'There is more substrate than before.'], ['The enzyme is denatured', 'Substrate concentration does not denature enzymes.'], ['The products block the substrate', 'Not the usual reason for the plateau.']] },
        { q: 'How does a competitive inhibitor slow an enzyme?', a: 'It has a similar shape to the substrate and blocks the active site', why: 'It competes with the substrate for the active site.', w: [['It changes the pH', 'That is a different factor.'], ['It binds elsewhere and changes the active site', 'That is a non-competitive inhibitor.'], ['It heats the enzyme', 'Inhibitors do not heat enzymes.']] },
        { q: 'What is a co-factor?', a: 'A non-protein helper, such as a metal ion, that some enzymes need to work', why: 'For example, magnesium is a co-factor for enzymes in chlorophyll making. Co-enzymes are organic helpers, often from vitamins.', w: [['A second substrate', 'A co-factor helps the enzyme; it is not the substrate.'], ['An inhibitor', 'Inhibitors slow enzymes.'], ['A product of the reaction', 'Not a product.']] },
        { q: 'How does a non-competitive inhibitor work?', a: 'It binds to another part of the enzyme and changes the active site’s shape', why: 'The substrate then cannot fit, however much substrate there is.', w: [['It sits in the active site', 'That is a competitive inhibitor.'], ['It speeds up the enzyme', 'Inhibitors slow enzymes.'], ['It breaks down the substrate', 'It does not act on the substrate.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: why an enzyme works faster at 35 °C than at 15 °C.', steps: ['The temperature is higher', 'Enzyme and substrate molecules have more kinetic energy', 'They move faster and collide more often', 'More enzyme–substrate complexes form per second', 'More product is made per second'] },
        { q: 'Put the steps in order: why pepsin stops working in alkaline conditions.', steps: ['The pH rises far above pepsin’s optimum', 'Charges on the active site change', 'Bonds holding the active site’s shape are disrupted', 'Protein no longer fits the active site', 'Fewer complexes form, so protein is not digested'] },
      ]),
      P.bank([
        { q: 'Why does the rate fall much faster above the optimum than it rises below it?', a: 'Above the optimum, enzymes are permanently denatured, so the number of working enzymes falls quickly', why: 'Below the optimum the enzymes all still work, just with fewer collisions. Above it, more and more are denatured.', w: [['Molecules slow down above the optimum', 'They speed up; the problem is shape.'], ['There is less substrate at high temperature', 'Substrate amount does not change.'], ['The graph is drawn wrongly', 'The steep fall is real.']] },
        { q: 'Some enzymes in hot-spring bacteria at Rotorua have an optimum near 80 °C. What does this suggest?', a: 'Their structure has stronger bonds that keep the active site’s shape at high temperatures', why: 'Each enzyme’s optimum suits where it works. Stronger bonds resist denaturing.', w: [['They are not made of protein', 'They are still proteins.'], ['They do not need an active site', 'All enzymes have an active site.'], ['They would work even faster at 100 °C', 'Above their optimum, they too denature.']] },
      ]),
      P.bank([
        { q: 'A student says: “At 60 °C the enzyme is killed.” What should they write instead, and why?', a: '“The enzyme is denatured: its active site has changed shape so the substrate no longer fits”, because enzymes are not living things', why: 'Examiners want the correct term and the effect on the active site.', w: [['“The enzyme is tired”', 'Not a biological explanation.'], ['“The enzyme melts”', 'Proteins do not melt; they denature.'], ['Nothing; “killed” is fine', 'It is wrong, and the mechanism is missing.']] },
        { q: 'Two enzymes from the same person: one from the stomach, one from the mouth. They have the same optimum temperature but different optimum pH. Why?', a: 'Body temperature is the same everywhere, but pH differs between stomach and mouth, and each enzyme suits its own place', why: 'Optimum conditions match where the enzyme works.', w: [['Different enzymes always have different everything', 'They share a temperature optimum here.'], ['Stomach enzymes are cooler', 'The stomach is at body temperature.'], ['pH does not affect enzymes', 'It does.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      'Temperature, rising side: <span class="pen">kinetic energy → collisions → enzyme–substrate complexes</span>. The 2025 report rewarded exactly this at Merit.',
      'Above the optimum: bonds break → active site changes shape → substrate does not fit → denatured. Never “killed”.',
      'Answer only the factor asked about. In 2025, candidates who wrote about inhibitors and co-factors when the question did not ask lost credit.',
      'Excellence linked the rate to the conditions in the context and to why that rate matters to the organism.',
    ],
    aim: {
      intro: '<div class="resource">Bacteria in Rotorua’s hot pools make enzymes that work fastest at 75 °C. A washing-powder company tests one of these enzymes against a human enzyme at 20 °C, 40 °C and 75 °C. Of the three temperatures tested, the human enzyme works best at 40 °C (its true optimum is about 37 °C), and it does nothing at 75 °C.</div>',
      parts: [
        { q: 'Describe what is meant by an enzyme’s optimum temperature, and describe what happens to the human enzyme at 75 °C.', write: true, words: '30–50',
          model: [S('The optimum temperature is the temperature at which the enzyme works fastest.', 'definition', true), S('At 75 °C the human enzyme is denatured: its active site has changed shape, so it no longer works.', 'describes denaturing', true)],
          earns: 'Achieved: a correct definition and a correct description of denaturing.',
          crit: { A: 'Optimum = temperature of fastest rate; at 75 °C the human enzyme is denatured / active site changed shape.' } },
        { q: 'Explain why the human enzyme works faster at 40 °C than at 20 °C.', write: true, words: '50–80',
          model: [S('At 40 °C the enzyme and substrate molecules have more kinetic energy than at 20 °C.', 'kinetic energy', true), S('They move faster and collide more often.', 'collisions', true), S('So more enzyme–substrate complexes form per second, and the rate is higher.', 'linked to rate', true), S('40 °C is still not above the optimum, so the enzyme is not denatured.', 'rules out denaturing')],
          earns: 'Merit: the full chain from kinetic energy to collisions to complexes to rate.',
          crit: { A: 'States warmer means faster.', M: 'Explains kinetic energy → more collisions → more enzyme–substrate complexes per second → faster rate.' } },
        { q: 'Discuss which enzyme the company should use in a washing powder for hot and for cold washes. Justify your answer using enzyme structure and the data.', write: true, words: '100–150',
          model: [S('In a hot wash (about 75 °C), the human enzyme denatures: the heat breaks the bonds holding its shape, so its active site changes and stains no longer fit.', 'hot: human fails', true), S('The hot-pool enzyme has an optimum of 75 °C, so its structure holds its shape at that temperature, and it works fastest there.', 'hot: bacterial wins', true), S('In a cold wash (20 °C), both enzymes are below their optimum, so both are slow (fewer collisions). Neither is denatured.', 'cold: both slow'), S('At 20 °C the human enzyme is closer to its optimum, so it will probably work faster than the hot-pool enzyme, which is 55 °C below its optimum.', 'cold: comparison'), S('So the company should use the hot-pool enzyme for hot washes, and the human-type enzyme for cold washes, or a mix for a powder used at any temperature.', 'justified recommendation', true)],
          earns: 'Excellence: both washes are reasoned from the data and from structure, the enzymes are compared at each temperature, and the recommendation follows from the reasoning.',
          crit: { M: 'Explains that the human enzyme denatures at 75 °C while the bacterial enzyme does not.', E: 'Discusses both hot and cold washes using the optimum data and structure (bonds/active site), compares the enzymes at each, and justifies a recommendation.' } },
      ],
      up: [
        up(1, ['At 40 °C it is warmer, so the enzyme works faster.'], [
          ['Explain the mechanism: more kinetic energy, more collisions, more enzyme–substrate complexes per second', 1, 'Right. The answer describes the effect. Merit explains it with kinetic energy and collisions.'],
          ['Add that 40 °C is body temperature', 0, 'Nearly, but it does not explain the rate.'],
          ['Say that the enzyme is happier', 0, 'Not biology.'],
          ['Draw a graph', 0, 'A graph shows the effect but does not explain it.']]),
        up(2, ['The bacterial enzyme should be used because it works at 75 °C and the human one is denatured.'], [
          ['Cover both hot and cold washes, compare the enzymes at each temperature using their optimums, and justify a recommendation', 1, 'Right. The answer deals with hot water only and gives a verdict without weighing the options. Excellence discusses and justifies.'],
          ['Say the bacteria come from Rotorua', 0, 'That is context, not reasoning.'],
          ['Add that enzymes are proteins', 0, 'Use it in the reasoning, not as a stand-alone fact.'],
          ['Recommend boiling the clothes', 0, 'That would denature both enzymes.']]),
      ],
    },
  });

  /* ======================= 8. DNA and replication ======================= */
  const PAIR = { A: 'T', T: 'A', G: 'C', C: 'G' };
  const randDNA = (n) => Array.from({ length: n }, () => R.pick('ATGC'.split(''))).join('');
  const comp = (s) => s.split('').map((b) => PAIR[b]).join('');
  P.addUnit({
    id: 'dna-replication', title: 'DNA structure and replication', mins: 10,
    blurb: 'Two antiparallel strands, A with T, G with C. Copying is semi-conservative.',
    recap: 'DNA is a double helix of two strands of nucleotides. Each nucleotide has a phosphate, the sugar deoxyribose and a base. The bases pair by complementary base pairing: adenine with thymine, guanine with cytosine, held by hydrogen bonds. The two strands run in opposite directions (antiparallel). Before a cell divides, DNA replicates: the strands separate, each acts as a template, and new nucleotides pair up. Each new molecule has one old strand and one new strand: replication is semi-conservative. Complementary base pairing is what makes the two copies identical.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>DNA: a twisted ladder</h2>'), C(3, '<p>The sides are sugar–phosphate backbones. The rungs are pairs of bases.</p>'), C(7.5, '<p>A always pairs with T. G always pairs with C. That is complementary base pairing.</p>')],
        draw(a) {
          const { W, H } = a; const pairs = 'ATGCCGTA'.split('').map((b) => [b, PAIR[b]]);
          Bio.cv.ladder(a, W * 0.08, H * 0.5, W * 0.84, pairs.slice(0, Math.max(1, Math.round(8 * a.seg(a.p, 0.05, 0.6)))));
          a.alpha(a.seg(a.p, 0.6, 0.7), () => a.text('hydrogen bonds hold each pair', W * 0.5, H * 0.92, { align: 'center', font: 'pen', col: a.C.pen }));
        } },
      { dur: 13, card: [C(0, '<h2>Antiparallel</h2>'), C(3, '<p>The two strands run in opposite directions: one 5′ to 3′, the other 3′ to 5′.</p>'), C(8, '<p>New nucleotides can only be added to one end, so the two new strands are built in opposite directions.</p>')],
        draw(a) {
          const { W, H, C: c } = a;
          a.arrow(W * 0.1, H * 0.3, W * 0.9, H * 0.3, c.c1, 4, a.seg(a.p, 0.1, 0.25)); a.text('5′', W * 0.06, H * 0.3, { font: 'head', alpha: a.seg(a.p, 0.1, 0.25) }); a.text('3′', W * 0.93, H * 0.3, { font: 'head', alpha: a.seg(a.p, 0.1, 0.25) });
          a.arrow(W * 0.9, H * 0.7, W * 0.1, H * 0.7, c.c2, 4, a.seg(a.p, 0.3, 0.45)); a.text('5′', W * 0.93, H * 0.7, { font: 'head', alpha: a.seg(a.p, 0.3, 0.45) }); a.text('3′', W * 0.06, H * 0.7, { font: 'head', alpha: a.seg(a.p, 0.3, 0.45) });
          for (let k = 0; k < 9; k++) a.line(W * (0.15 + k * 0.088), H * 0.34, W * (0.15 + k * 0.088), H * 0.66, c.line, 3);
        } },
      { dur: 14, card: [C(0, '<h2>Replication: unzip, then copy.</h2>'), C(3, '<p>An enzyme (helicase) breaks the hydrogen bonds; the strands separate.</p>'), C(7, '<p>Free nucleotides pair with each exposed base. DNA polymerase joins them into a new strand.</p>'), C(11, '<p>Each new DNA molecule keeps one old strand: semi-conservative.</p>')],
        draw(a) {
          const { W, H } = a; const pairs = 'ATGCCGTAGC'.split('').map((b) => [b, PAIR[b]]);
          Bio.cv.ladder(a, W * 0.06, H * 0.5, W * 0.88, pairs, { open: a.seg(a.p, 0.1, 0.7), gap: H * 0.14 });
        } },
    ],
    example: {
      problem: 'One strand of DNA reads 5′ ATG GCA TTC 3′. Write the complementary strand and explain how replication keeps the base sequence the same.',
      steps: [
        { m: '<code>3′ TAC CGT AAG 5′</code>', note: 'A–T, G–C, and antiparallel' },
        { m: 'The two strands separate when the hydrogen bonds between the bases break.', note: 'unzip' },
        { m: 'Each strand acts as a template. Free nucleotides pair with the exposed bases by complementary base pairing.', note: 'template' },
        { m: 'So each new strand is complementary to its template, and each new molecule is identical to the original.', note: 'conclusion' },
        { m: 'Each new molecule has one original and one new strand: semi-conservative replication.', note: 'name it' },
      ],
    },
    faded() { const s = randDNA(9); return { kind: 'mcq', ...P.mcq({ prompt: `One DNA strand reads <code>${s.match(/.../g).join(' ')}</code>. Which is the complementary strand?`, more: { steps: [St('Pair each base: A with T, T with A, G with C, C with G.'), St(`Complement: <code>${comp(s).match(/.../g).join(' ')}</code>`)], trap: 'Using U. U is only in RNA.' } }, P.uniq([{ t: `<code>${comp(s).match(/.../g).join(' ')}</code>`, ok: true }, { t: `<code>${s.match(/.../g).join(' ')}</code>`, why: 'That is the same strand, not the complement.' }, { t: `<code>${comp(s).replace(/T/g, 'U').match(/.../g).join(' ')}</code>`, why: 'U is in RNA. DNA uses T.' }, { t: `<code>${s.split('').map((b) => ({ A: 'G', G: 'A', T: 'C', C: 'T' })[b]).join('').match(/.../g).join(' ')}</code>`, why: 'A pairs with T, and G with C.' }])) }; },
    grades: 'AAAMMM',
    gens: [
      () => { const s = randDNA(12); const right = comp(s); const fmt = (x) => `<code>${x.match(/.../g).join(' ')}</code>`;
        return P.mcq({ prompt: `Give the complementary DNA strand for <code>${s.match(/.../g).join(' ')}</code>, written base by base underneath it (left to right, in the same order).`, more: { steps: [St('A pairs with T and G pairs with C, base by base.'), St(`So the complement is ${fmt(right)}.`)] } }, P.uniq([{ t: fmt(right), ok: true }, { t: fmt(right.replace(/T/g, 'U')), why: 'U only appears in RNA.' }, { t: fmt(right.split('').reverse().join('')), why: 'That is the complement read in the opposite direction. The question asks for each partner base written directly under its base, in the same order.' }, { t: fmt(s.split('').map((b) => ({ A: 'G', G: 'A', T: 'C', C: 'T' })[b]).join('')), why: 'Wrong pairing. A–T and G–C.' }])); },
      () => { const a = R.int(15, 35); const t = a, g = 50 - a, c = g;
        return { kind: 'num', answer: g, prompt: `In a sample of DNA, ${a}% of the bases are adenine. What percentage are guanine?`, fmt: 'Give a whole-number percentage.', wrong: [{ v: a, msg: 'That is thymine, which equals adenine.' }, { v: 100 - a, msg: 'A and T together are ' + 2 * a + '%. Halve what is left for G.' }],
          more: { steps: [St(`A pairs with T, so thymine is also ${a}%.`), St(`A + T = ${2 * a}%, so G + C = ${100 - 2 * a}%.`), St(`G pairs with C, so they are equal: ${g}% each.`)], trap: 'Forgetting that T equals A before splitting the rest.' }, sol: [`A = T = ${a}%`, `G + C = 100 − ${2 * a} = ${100 - 2 * a}%`, `G = ${g}%`] }; },
      P.terms([['nucleotide', 'A unit of DNA: a phosphate, a deoxyribose sugar and a base.'], ['complementary base pairing', 'A pairs with T and G pairs with C, held by hydrogen bonds.'], ['antiparallel', 'The two DNA strands run in opposite directions.'], ['semi-conservative replication', 'Each new DNA molecule has one original strand and one new strand.'], ['DNA polymerase', 'The enzyme that joins free nucleotides into a new strand.'], ['helicase', 'The enzyme that unzips DNA by breaking the hydrogen bonds between bases.'], ['template', 'An existing strand used as a pattern to build a complementary strand.']]),
      P.bank([
        { q: 'Why is DNA replication called semi-conservative?', a: 'Each new DNA molecule has one original strand and one new strand', why: 'Half of the old molecule is “conserved” in each copy.', w: [['Half the DNA is copied each time', 'All of it is copied.'], ['The new molecules are half as long', 'They are full length.'], ['Only one strand is copied', 'Both strands act as templates.']] },
        { q: 'Why must DNA replicate before a cell divides by mitosis?', a: 'So each daughter cell gets a complete, identical copy of the DNA', why: 'Mitosis makes two genetically identical cells for growth and repair.', w: [['So the cell can make proteins', 'Protein making does not need replication.'], ['To make the cell bigger', 'Growth is not the reason.'], ['So the daughter cells are different', 'Mitosis makes identical cells.']] },
        { q: 'What holds the two strands of DNA together?', a: 'Hydrogen bonds between complementary bases', why: 'Hydrogen bonds are weak individually, so the strands can be separated for copying.', w: [['Peptide bonds', 'Those join amino acids.'], ['The sugar–phosphate backbone', 'The backbone holds each strand together lengthways.'], ['Enzymes', 'Enzymes unzip and build DNA but do not hold it together.']] },
      ]),
      P.bank([
        { q: 'How does complementary base pairing make sure replication is accurate?', a: 'Each exposed base can only pair with one type of nucleotide, so the new strand’s sequence is set by the template', why: 'A only with T, G only with C: the template fixes the sequence.', w: [['DNA polymerase checks every gene', 'The pairing rule does most of the work.'], ['Mistakes are impossible', 'Mistakes (mutations) can happen, just rarely.'], ['The two new strands are copied from each other', 'Each is copied from an old template.']] },
        { q: 'Why does the antiparallel structure matter in replication?', a: 'New nucleotides are added in one direction only, so the two new strands are built in opposite directions', why: 'Each strand is copied along its own direction (5′ to 3′ for the new strand).', w: [['It means only one strand can be copied', 'Both are copied.'], ['It makes the strands identical', 'The strands are complementary, not identical.'], ['It has no effect', 'It decides the direction each new strand is built.']] },
      ]),
      P.chain([
        { q: 'Put the steps of DNA replication in order.', steps: ['Helicase breaks the hydrogen bonds and the strands separate', 'Each original strand acts as a template', 'Free nucleotides pair with the exposed bases (A–T, G–C)', 'DNA polymerase joins the nucleotides into a new strand', 'Two identical molecules form, each with one old and one new strand'] },
      ]),
    ],
    tips: [
      'Base pairing: <span class="pen">A–T, G–C in DNA</span>. U only appears in RNA.',
      'Use the word <b>antiparallel</b>, and say what it means: the strands run in opposite directions. The 2026 specification names it.',
      'Semi-conservative: each new molecule has one old strand and one new strand. Say why that keeps copies identical.',
      'Link replication to cell division: each daughter cell needs a full, identical copy.',
    ],
    aim: {
      intro: '<div class="resource">Before a skin cell divides by mitosis, its DNA is copied. One stretch of one strand reads <code>5′ TAC GGA CTT 3′</code>.</div>',
      parts: [
        { q: 'Write the complementary strand for this stretch, and describe the structure of a DNA molecule.', write: true, words: '40–60',
          model: [S('Complementary strand: <code>3′ ATG CCT GAA 5′</code>.', 'A–T, G–C', true), S('DNA is a double helix of two strands of nucleotides.', 'structure', true), S('Each nucleotide has a phosphate, a deoxyribose sugar and a base.', 'nucleotide'), S('The bases pair A with T and G with C, held by hydrogen bonds, and the strands run in opposite directions (antiparallel).', 'pairing and direction', true)],
          earns: 'Achieved: the right complementary strand and a correct description using the key terms.',
          crit: { A: 'Correct complement ATG CCT GAA; double helix; nucleotides (phosphate, sugar, base); A–T, G–C; hydrogen bonds; antiparallel.' } },
        { q: 'Explain how DNA is replicated so that each new skin cell gets an identical copy.', write: true, words: '70–100',
          model: [S('Helicase breaks the hydrogen bonds between bases, so the two strands separate.', 'unzip', true), S('Each strand acts as a template.', 'template', true), S('Free nucleotides pair with the exposed bases by complementary base pairing, and DNA polymerase joins them into a new strand.', 'build', true), S('Because A only pairs with T and G only with C, each new strand has exactly the right sequence, so both new molecules are identical to the original.', 'why identical')],
          earns: 'Merit: the steps are linked, and complementary base pairing is used to explain why the copies are identical.',
          crit: { A: 'Describes strands separating and new strands forming.', M: 'Explains the sequence: H-bonds broken, templates, complementary nucleotides added, DNA polymerase; base pairing rule gives identical copies.' } },
        { q: 'Discuss why replication is called semi-conservative, and why the antiparallel structure means the two new strands are built in different directions. Link this to the need for accurate copying.', write: true, words: '100–140',
          model: [S('After replication, each new DNA molecule has one original strand and one newly made strand: half of the original is conserved, so it is semi-conservative.', 'semi-conservative', true), S('Because each original strand is used as a template and bases pair complementarily, both new molecules are identical to the original.', 'why the copies match'), S('The two strands run in opposite directions. DNA polymerase can only add nucleotides to one end of a growing strand (building it 5′ to 3′).', 'antiparallel', true), S('So the two new strands are built in opposite directions: one continuously, the other in short pieces that are joined later.', 'consequence'), S('Both features help the cell copy billions of bases accurately, so each skin cell gets the same instructions and can work in the same way.', 'links to accuracy', true)],
          earns: 'Excellence: both features are explained and linked together to the need for accurate copying in cell division.',
          crit: { M: 'Explains semi-conservative (one old, one new strand) and that strands run in opposite directions.', E: 'Discusses both: semi-conservative with its significance; antiparallel → polymerase adds in one direction → new strands built in opposite directions; links to accuracy and identical daughter cells.' } },
      ],
      up: [
        up(1, ['The DNA unzips and new bases join on to make two copies.'], [
          ['Explain the steps with the terms: hydrogen bonds break, each strand is a template, complementary nucleotides pair (A–T, G–C), DNA polymerase joins them, so copies are identical', 1, 'Right. The answer is a general description. Merit explains each step and why the copies are the same.'],
          ['Say that DNA is a double helix', 0, 'True, but it does not explain replication.'],
          ['Say it happens in the nucleus', 0, 'True, but it does not explain how the copies are identical.'],
          ['Draw the DNA', 0, 'A drawing can help, but the explanation is missing.']]),
        up(2, ['It is semi-conservative because each new DNA has one old and one new strand. The strands are antiparallel so they go in opposite directions.'], [
          ['Explain the consequences: polymerase builds in one direction, so the two new strands are made in opposite directions; and link both features to accurate copying', 1, 'Right. The answer defines both terms. Excellence discusses what they mean for how replication happens and why it matters.'],
          ['Draw an arrow for each strand', 0, 'A diagram alone does not discuss consequences.'],
          ['Repeat the base-pairing rule', 0, 'Base pairing is right, but the question is about the two features.'],
          ['Name helicase', 0, 'An extra enzyme name does not complete the discussion.']]),
      ],
    },
  });

  /* ======================= 9. Moving materials ======================= */
  P.addUnit({
    id: 'membranes', title: 'Moving materials in and out of cells', mins: 9,
    blurb: 'Diffusion, osmosis, facilitated diffusion, active transport. Down the gradient or against it?',
    recap: 'Diffusion is the net movement of particles from high to low concentration; it needs no energy. Osmosis is the diffusion of water across a partially permeable membrane, from a dilute solution to a more concentrated one. Facilitated diffusion moves larger or charged particles, such as glucose and ions, down their concentration gradient through channel or carrier proteins, with no energy. Active transport uses carrier proteins and energy from ATP to move particles against their concentration gradient.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Down the gradient: no energy needed.</h2>'), C(3, '<p>Diffusion: particles spread from high to low concentration.</p>'), C(7, '<p>Facilitated diffusion: the same direction, but through a protein channel or carrier, for particles that cannot cross the lipid layer.</p>')],
        draw(a) {
          const { W, H, C: c } = a; const my = H * 0.5;
          a.box(0, my - 10, W, 20, { fill: c.c1, stroke: false, alpha: 0.25 });
          a.round(W * 0.47, my - 22, W * 0.06, 44, 6, { fill: c.c4, stroke: false, alpha: 0.8 });
          const n = 14;
          for (let k = 0; k < n; k++) { const sx = W * 0.05 + ((k * 97) % (W * 0.9)), sy = H * 0.08 + ((k * 53) % (H * 0.32)); const goes = k % 3 === 0; const t = a.seg(a.p, 0.2 + (k % 5) * 0.08, 0.5 + (k % 5) * 0.08); const x = goes ? sx + (W * 0.5 - sx) * Math.min(1, t * 1.2) : sx; const y = goes ? sy + (H * 0.75 - sy) * t : sy; a.ellipse(x, y, 6, 6, { fill: c.c2, stroke: false }); }
          a.text('high concentration', W * 0.04, H * 0.06, { size: 0.8, col: c.muted }); a.text('low concentration', W * 0.04, H * 0.94, { size: 0.8, col: c.muted });
        } },
      { dur: 12, card: [C(0, '<h2>Osmosis is about water.</h2>'), C(3, '<p>Water diffuses across a partially permeable membrane from where there is more free water (dilute) to less (concentrated).</p>'), C(8, '<p>Plant cells in pure water swell and go turgid. In salty water they lose water and wilt.</p>')],
        board: [L(0.5, 'dilute solution (more water) → concentrated solution (less water)'), L(3.5, 'through a <b>partially permeable</b> membrane'), L(6, 'no energy needed', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>Against the gradient: active transport.</h2>'), C(3, '<p>Carrier proteins pump particles from low to high concentration. This costs ATP from respiration.</p>'), C(7.5, '<p>Example: root hair cells taking up mineral ions from dilute soil water.</p>')],
        board: [L(0.5, 'low → high concentration'), L(2.5, 'carrier protein + <b>ATP</b>'), L(4.5, 'cells doing a lot of it have many mitochondria', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain why root hair cells need many mitochondria to absorb nitrate ions from the soil.',
      steps: [
        { m: 'The nitrate concentration in the soil water is lower than inside the root hair cell.', note: 'the gradient' },
        { m: 'So nitrate must be moved against its concentration gradient, by active transport through carrier proteins.', note: 'name the process' },
        { m: 'Active transport needs energy from ATP.', note: 'needs energy' },
        { m: 'Mitochondria make ATP by aerobic respiration, so many mitochondria supply the energy needed.', note: 'linked conclusion' },
      ],
    },
    faded() { return Bio.labelGen((w) => Bio.membrane(w), { bilayer: 'Phospholipid bilayer', channel: 'Channel protein', carrier: 'Carrier protein' }, { n: 3, extra: ['Cell wall', 'Ribosome'], prompt: 'Label the membrane.' })(); },
    grades: 'AAMM',
    gens: [
      P.terms([['diffusion', 'The net movement of particles from high to low concentration.'], ['osmosis', 'The diffusion of water across a partially permeable membrane, from a dilute to a more concentrated solution.'], ['facilitated diffusion', 'Diffusion through channel or carrier proteins, down the concentration gradient, with no energy used.'], ['active transport', 'Moving particles against their concentration gradient using carrier proteins and ATP.'], ['concentration gradient', 'A difference in concentration between two areas.'], ['partially permeable membrane', 'A membrane that lets some particles through but not others.']]),
      P.bank([
        { q: 'Which process moves glucose into a cell down its concentration gradient through a carrier protein, with no ATP?', a: 'Facilitated diffusion', why: 'Down the gradient + protein + no energy = facilitated diffusion.', w: [['Active transport', 'Active transport goes against the gradient and uses ATP.'], ['Osmosis', 'Osmosis is the movement of water.'], ['Simple diffusion', 'Glucose is too big to cross the lipid layer without a protein.']] },
        { q: 'Which process needs energy from ATP?', a: 'Active transport', why: 'Moving particles against their gradient needs energy.', w: [['Diffusion', 'No energy needed.'], ['Osmosis', 'No energy needed.'], ['Facilitated diffusion', 'Uses proteins but no energy.']] },
        { q: 'A plant cell is placed in pure water. What happens?', a: 'Water enters by osmosis and the cell becomes turgid', why: 'The cell contents are more concentrated, so water moves in. The cell wall stops it bursting.', w: [['Water leaves and the cell wilts', 'That happens in a concentrated solution.'], ['The cell bursts', 'The cell wall prevents bursting in plants.'], ['Nothing happens', 'Water moves in by osmosis.']] },
        { q: 'Why can’t charged ions such as sodium pass straight through the lipid part of a membrane?', a: 'The lipid layer repels charged particles, so they need channel or carrier proteins', why: 'Ions cross by facilitated diffusion or active transport, through proteins.', w: [['They are too heavy', 'Charge, not mass, is the main reason.'], ['Membranes never let ions through', 'They do, through proteins.'], ['Ions only move by osmosis', 'Osmosis is for water.']] },
      ]),
      P.bank([
        { q: 'Why do cells that carry out a lot of active transport have many mitochondria?', a: 'Active transport uses ATP, which mitochondria make in aerobic respiration', why: 'Energy demand links structure (many mitochondria) to function.', w: [['Mitochondria are the carrier proteins', 'Carriers are in the cell membrane.'], ['Mitochondria store the ions', 'They do not store ions.'], ['To make glucose for the ions', 'Mitochondria use glucose (as pyruvate), not make it.']] },
        { q: 'Why does a cyanide poison, which stops respiration, stop mineral uptake by roots but not water uptake?', a: 'Minerals are taken up by active transport, which needs ATP; water enters by osmosis, which does not', why: 'No respiration, no ATP, so active transport stops. Osmosis needs no energy.', w: [['Cyanide blocks the stomata', 'Not the reason.'], ['Water uptake needs ATP too', 'Osmosis needs no ATP.'], ['Minerals are too big for osmosis', 'Osmosis is only water anyway; the key is energy.']] },
        { q: 'Why does facilitated diffusion stop speeding up at high concentration gradients?', a: 'All the channel or carrier proteins are in use, so they limit the rate', why: 'There is a fixed number of transport proteins, like enzymes with active sites.', w: [['The particles run out', 'The gradient is high, so there are plenty.'], ['ATP runs out', 'Facilitated diffusion does not use ATP.'], ['The membrane gets thicker', 'It does not.']] },
      ]),
      P.chain([
        { q: 'Put the steps in order: how a root hair cell takes up nitrate ions.', steps: ['Nitrate concentration is lower in the soil water than in the cell', 'Nitrate must move against its concentration gradient', 'A carrier protein in the membrane binds the nitrate', 'ATP from respiration changes the carrier’s shape', 'The nitrate is released inside the cell'] },
      ]),
    ],
    tips: [
      'Sort by two questions: <span class="pen">Down or against the gradient? Energy or not?</span>',
      'Facilitated diffusion is still diffusion: down the gradient, no ATP, but through proteins.',
      'Osmosis is only for water, across a partially permeable membrane.',
      'Link active transport to mitochondria and ATP when a question gives a cell with many mitochondria.',
    ],
    aim: {
      intro: '<div class="resource">Cells lining the small intestine absorb glucose from digested food. Their membranes have many folds (microvilli), contain glucose carrier proteins, and the cells have many mitochondria. After a meal, glucose is first absorbed quickly, then the last of it is absorbed even when the concentration in the intestine is lower than in the cells.</div>',
      parts: [
        { q: 'Describe facilitated diffusion and active transport, saying how each one differs.', write: true, words: '40–60',
          model: [S('Facilitated diffusion moves particles down their concentration gradient through channel or carrier proteins.', 'facilitated', true), S('It does not need energy.', 'no ATP'), S('Active transport moves particles against their concentration gradient using carrier proteins.', 'active', true), S('It needs energy from ATP.', 'energy', true)],
          earns: 'Achieved: both processes described with the direction and the energy difference.',
          crit: { A: 'Facilitated: down gradient, proteins, no energy. Active: against gradient, carriers, ATP.' } },
        { q: 'Explain how the features of these intestine cells help them absorb glucose quickly after a meal.', write: true, words: '60–90',
          model: [S('After a meal, glucose concentration is higher in the intestine than in the cells, so glucose moves in by facilitated diffusion through the carrier proteins.', 'process + gradient', true), S('Microvilli give a large surface area, so there are more carrier proteins and more glucose can cross at once.', 'feature → function', true), S('Many carrier proteins means the rate is not held back by a shortage of carriers.', 'feature → function')],
          earns: 'Merit: each feature is linked to how it speeds up glucose uptake.',
          crit: { M: 'Explains: gradient → facilitated diffusion; microvilli → surface area → more carriers → faster absorption.' } },
        { q: 'Discuss how these cells absorb the last of the glucose when its concentration in the intestine is lower than in the cells. Use all the features in the resource and justify why the cells have so many mitochondria.', write: true, words: '100–140',
          model: [S('When the intestine’s glucose concentration falls below the cell’s, diffusion would move glucose the wrong way, out of the cell.', 'the problem', true), S('So the cells use active transport: carrier proteins move glucose against its concentration gradient.', 'the solution', true), S('Active transport needs energy from ATP, which is made in mitochondria by aerobic respiration.', 'energy'), S('Many mitochondria supply the large amount of ATP needed, and microvilli give room for many carriers, so very little glucose is wasted.', 'links all features'), S('So the cells use facilitated diffusion while the gradient is in their favour, then switch to active transport, and the many mitochondria are justified by the energy that active transport costs.', 'justified conclusion', true)],
          earns: 'Excellence: the change in gradient is used to explain the switch in process, and every feature is linked to its role, with the mitochondria justified.',
          crit: { M: 'Explains that active transport moves glucose against the gradient using ATP.', E: 'Discusses the change from facilitated diffusion to active transport as the gradient reverses; links microvilli, carriers and mitochondria to their roles; justifies many mitochondria by ATP demand.' } },
      ],
      up: [
        up(1, ['The cells have microvilli and lots of carrier proteins so they absorb glucose.'], [
          ['Link each feature to how it helps: microvilli give a large surface area for more carriers, so glucose moves in by facilitated diffusion faster', 1, 'Right. Features are named but not linked to how they speed up absorption.'],
          ['Say that glucose is a sugar', 0, 'Not relevant.'],
          ['Draw a cell', 0, 'A drawing does not explain the link.'],
          ['Say that glucose is needed for respiration', 0, 'True, but not how it is absorbed.']]),
        up(2, ['When there is less glucose in the intestine, the cells use active transport which uses ATP from mitochondria.'], [
          ['Explain why the switch happens (the gradient reverses), link microvilli, carriers and mitochondria to their roles, and justify why so many mitochondria are needed', 1, 'Right. The answer is correct but brief. Excellence discusses the change and justifies the structure.'],
          ['Add the respiration equation', 0, 'The equation does not discuss the switch.'],
          ['Say that ATP is energy', 0, 'Too vague, and it is not the missing reasoning.'],
          ['Repeat the resource', 0, 'Restating the resource earns nothing.']]),
      ],
    },
  });
})();
