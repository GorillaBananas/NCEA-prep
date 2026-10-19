/* AS 91223 (Economics 2.2) Analyse international trade using economic concepts and models.
   Concepts (standard, explanatory note 4): major export and import goods and services, major export and import markets,
   the balance on goods and services in the current account. Models (note 5): supply and demand in a two-country model,
   supply and demand where NZ is a price taker, supply and demand for the NZ dollar.
   Trade facts: Stats NZ / MFAT 2025–2026. Exam tips draw on the 2023–2025 NZQA assessment reports and schedules. */
(function () {
  const P = NP, R = P.R, E = P.econ, MD = P.econ.models;
  const C = (at, html) => ({ at, html });
  const L = (at, html, note, o = {}) => Object.assign({ at, html: `<span class="bq">${html}</span>`, note }, o);
  const S = (m, note, key) => ({ m, note, key: !!key });
  const up = (part, shown, choices, ask) => ({ part, shown, ask, choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });
  const St = (say, m) => ({ say, m });
  const $ = (v) => P.money(v);
  const shift = (prompt, model, answer, steps, o = {}) => ({ kind: 'shift', prompt, model, answer, accept: o.accept, why: o.why, wrong: o.wrong, more: { idea: o.idea, steps: steps.map((s) => St(s)), trap: o.trap } });

  /* ======================= 1. NZ’s trade: what, with whom, and the balance ======================= */
  P.addUnit({
    id: 'trade-basics', title: 'NZ’s exports, imports and trading partners', mins: 9,
    blurb: 'Dairy, meat, kiwifruit, logs and tourism out; vehicles, machinery and fuel in. China, Australia, the US.',
    recap: 'New Zealand exports mainly primary products and tourism: dairy (milk powder, butter, cheese), meat (beef and lamb), horticulture (especially kiwifruit), forestry (logs and wood), seafood, and services such as tourism and international education. It imports mainly manufactured goods and fuel: vehicles, machinery and electrical equipment, petroleum, plastics, and services such as New Zealanders’ overseas travel. Its largest trading partners are China, Australia, the United States, the European Union and Japan. The balance on goods and services in the current account is export receipts minus import payments for goods and services: a surplus if exports are larger, a deficit if imports are larger.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>What NZ sells</h2>'), C(3, '<p>Mostly food and primary products, where our land and climate give an advantage. Tourism is one of the biggest service exports, with international education.</p>')],
        board: [L(0.5, '<b>dairy</b>: milk powder, butter, cheese (the largest)'), L(2.5, '<b>meat</b>: beef and lamb'), L(4.5, '<b>horticulture</b>: kiwifruit, apples, wine'), L(6.5, '<b>forestry</b>: logs and timber; <b>seafood</b>'), L(8.5, '<b>services</b>: tourism, international students', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>What NZ buys, and from whom</h2>'), C(3, '<p>Things we do not make much of: vehicles, machinery, fuel, electronics.</p>'), C(7.5, '<p>Main partners: China, Australia, the United States, the EU and Japan.</p>')],
        board: [L(0.5, '<b>imports</b>: vehicles, machinery, petroleum, electrical equipment, plastics'), L(3.5, '<b>partners</b>: China, Australia, United States, EU, Japan'), L(6.5, 'free trade agreements with China, Australia, the UK, the EU and others', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>The balance on goods and services</h2>'), C(3, '<p>Part of the current account. Export receipts minus import payments.</p>')],
        board: [L(0.5, 'export receipts for goods and services: X'), L(2.5, 'import payments for goods and services: M'), L(4.5, 'balance = X − M'), L(6.5, 'X &gt; M: surplus. M &gt; X: deficit.', '', { hl: true })] },
    ],
    example: {
      problem: `In a year, NZ’s exports of goods were ${$('72 billion')} and of services ${$('30 billion')}; imports of goods were ${$('78 billion')} and of services ${$('31 billion')}. Calculate the balance on goods and services and explain what it means.`,
      steps: [
        { m: `Exports: 72 + 30 = ${$('102 billion')}. Imports: 78 + 31 = ${$('109 billion')}.`, note: 'add goods and services' },
        { m: `Balance = 102 − 109 = −${$('7 billion')}.`, note: 'exports minus imports' },
        { m: 'It is a deficit: New Zealand paid more for imports than it earned from exports.', note: 'meaning' },
        { m: 'This is only one part of the current account, which also includes income flows such as interest and dividends paid to and received from overseas. Only an overall current account deficit has to be financed by borrowing from overseas or selling NZ assets to overseas buyers.', note: 'goods and services balance vs current account' },
      ],
    },
    faded() { return balGen()(); },
    grades: 'AAAMM',
    gens: [
      balGen(),
      P.bank([
        { q: 'Which is New Zealand’s largest goods export?', a: 'Dairy products', why: 'Milk powder, butter and cheese earn more than any other goods export.', w: [['Cars', 'NZ imports cars.'], ['Oil', 'NZ is a net importer of fuel.'], ['Electronics', 'NZ imports most electronics.']] },
        { q: 'Which is a major New Zealand import?', a: 'Vehicles and machinery', why: 'NZ makes few cars or large machines, so it imports them.', w: [['Kiwifruit', 'A major export.'], ['Lamb', 'A major export.'], ['Logs', 'A major export.']] },
        { q: 'Which of these is a service export?', a: 'An overseas tourist’s spending in Queenstown', why: 'Foreign visitors’ spending in NZ earns foreign currency, like an export.', w: [['A New Zealander’s holiday in Bali', 'That is a service import.'], ['Milk powder shipped to China', 'A goods export.'], ['A car shipped from Japan', 'A goods import.']] },
        { q: 'Which countries are among New Zealand’s top trading partners?', a: 'China, Australia and the United States', why: 'With the EU and Japan, these are NZ’s biggest markets.', w: [['Brazil, Argentina and Chile', 'Smaller partners.'], ['Russia, Iran and Cuba', 'Very small or no trade.'], ['Fiji, Samoa and Tonga', 'Important neighbours, but small trade totals.']] },
      ]),
      P.terms([['export', 'A good or service sold to people in another country, earning foreign currency.'], ['import', 'A good or service bought from another country.'], ['balance on goods and services', 'Export receipts minus import payments for goods and services.'], ['current account', 'The record of a country’s trade in goods and services and its income flows with the rest of the world.'], ['trade deficit', 'When import payments are larger than export receipts.'], ['free trade agreement (FTA)', 'An agreement between countries to reduce or remove barriers to trade such as tariffs.']]),
      P.bank([
        { q: 'Why does New Zealand export mainly primary products?', a: 'Its land, climate and farming skills let it produce them at lower cost than many countries', why: 'NZ specialises where it is relatively efficient, then trades for goods it makes less efficiently.', w: [['The government bans manufacturing', 'It does not.'], ['Other countries cannot grow food', 'They can, but often at higher cost.'], ['Primary products are the only thing that can be exported', 'Services and manufactures are exported too.']] },
        { q: 'Dairy prices fall sharply while import spending stays the same. What happens to the balance on goods and services?', a: 'It worsens: export receipts fall, so the surplus shrinks or the deficit grows', why: 'Lower prices mean lower export receipts for the same volume.', w: [['It improves', 'Lower receipts worsen it.'], ['No change, because volumes are the same', 'Receipts are price × quantity.'], ['Imports automatically fall to match', 'Not automatically.']] },
      ]),
      P.chain([
        { q: 'Put the chain in order: how a fall in tourist numbers affects the current account.', steps: ['Fewer overseas tourists visit New Zealand', 'Their spending in NZ falls', 'Service export receipts fall', 'Exports fall while imports stay the same', 'The balance on goods and services worsens'] },
      ]),
    ],
    tips: [
      'Know <span class="pen">three exports, three imports and three partners</span>. The 2025 Achieved answers named two top trading partners.',
      'Services count too: overseas tourists’ spending in NZ is an export; NZers’ spending overseas is an import.',
      'Merit in 2025: explaining the effect of higher export receipts on the current account.',
      'Balance on goods and services = exports − imports. Show the subtraction and say “surplus” or “deficit”.',
    ],
    aim: {
      intro: `<div class="resource">(Practice figures.) In one year, New Zealand’s export receipts from goods and services were ${$('102 billion')} and import payments were ${$('109 billion')}. Kiwifruit exports rose 46% after a record harvest, while tourism recovered strongly.</div>`,
      parts: [
        { q: 'Name two major exports and two major imports of New Zealand, and calculate the balance on goods and services.', write: true, words: '30–50',
          model: [S('Exports: dairy products and tourism (also meat, kiwifruit, logs).', 'two exports', true), S('Imports: vehicles and machinery (also fuel, electronics).', 'two imports', true), S(`Balance = 102 − 109 = −${$('7 billion')}: a deficit.`, 'calculation', true)],
          earns: 'Achieved: correct exports, imports and the balance with its sign.', crit: { A: 'Two correct exports, two correct imports; balance minus 7 billion dollars, a deficit.' } },
        { q: 'Explain how the rise in kiwifruit exports affects the balance on goods and services.', write: true, words: '50–80',
          model: [S('The record harvest meant far more kiwifruit was sold overseas, so kiwifruit export receipts rose.', 'event → receipts', true), S('Export receipts are part of the balance on goods and services.', 'link'), S('With import payments unchanged, higher export receipts reduce the deficit (move the balance towards a surplus).', 'effect on the balance', true)],
          earns: 'Merit: the cause is linked to export receipts and to the balance, with the direction explained.', crit: { M: 'Explains more kiwifruit exports → higher export receipts → current account balance on goods and services improves (deficit smaller).' } },
        { q: 'Discuss how the recovery in tourism and the kiwifruit harvest together affect New Zealand’s current account, and which is likely to matter more in the long run.', write: true, words: '90–130',
          model: [S('Both raise export receipts: kiwifruit as a goods export, tourism as a service export, so both reduce the deficit.', 'both effects', true), S('The kiwifruit gain depends on a record harvest, which may not be repeated; a poor season or lower world prices would reverse it.', 'kiwifruit: variable'), S('Tourism brings spending across many industries (hotels, transport, food) and is likely to keep growing as travel recovers.', 'tourism: broad, lasting', true), S('But tourism can be hit by shocks such as a pandemic, and NZers travelling overseas raise service imports too, offsetting part of the gain.', 'qualification'), S('So tourism is likely to matter more in the long run because it is larger and more lasting, while the kiwifruit boost is a strong but possibly one-off gain.', 'justified judgement', true)],
          earns: 'Excellence: both changes are linked to the current account, compared for size and permanence, and a justified judgement is made.',
          crit: { M: 'Explains both raise export receipts and improve the balance.', E: 'Compares the two (one-off harvest vs ongoing recovery; offsetting imports), and makes a justified long-run judgement.' } },
      ],
      up: [
        up(1, ['More kiwifruit exports make the balance better.'], [
          ['Explain the link: more kiwifruit sold → higher export receipts → with imports unchanged the deficit gets smaller', 1, 'Right. Merit explains the steps from the harvest to the balance.'],
          ['Say kiwifruit is grown in the Bay of Plenty', 0, 'Context, not explanation.'],
          ['Repeat the 46%', 0, 'Data without reasoning.'],
          ['Calculate the balance again', 0, 'That was part (a).']]),
        up(2, ['Both help the current account. Tourism is bigger.'], [
          ['Explain how each affects export receipts, compare how lasting each is (one-off harvest vs ongoing recovery), note offsets, and justify the judgement', 1, 'Right. The judgement needs reasons; Excellence compares and weighs them.'],
          ['Name more exports', 0, 'Not discussion.'],
          ['Say both are good', 0, 'Too vague.'],
          ['Describe Queenstown', 0, 'Context, not reasoning.']]),
      ],
    },
  });
  function balGen() {
    return () => { const xg = R.int(60, 80), xs = R.int(20, 35), mg = R.int(62, 85), ms = R.int(20, 35); const bal = xg + xs - mg - ms;
      return { kind: 'num', answer: bal, prompt: `Exports of goods ${$(xg + 'b')}, exports of services ${$(xs + 'b')}, imports of goods ${$(mg + 'b')}, imports of services ${$(ms + 'b')}. Calculate the balance on goods and services in billions of dollars (negative for a deficit).`, fmt: 'Give a number of billions, e.g. -4 for a deficit of 4 billion.',
        wrong: [{ v: -bal, msg: 'It is exports minus imports, not imports minus exports.' }, { v: xg - mg, msg: 'Include services too.' }],
        more: { steps: [St(`Exports: ${xg} + ${xs} = ${xg + xs}. Imports: ${mg} + ${ms} = ${mg + ms}.`), St(`Balance = ${xg + xs} − ${mg + ms} = ${bal} billion: ${bal >= 0 ? 'a surplus' : 'a deficit'}.`)] }, sol: [`(${xg} + ${xs}) − (${mg} + ${ms}) = ${bal}`] }; };
  }

  /* ======================= 2. The price-taker model ======================= */
  const TAKER_X = [
    ['World dairy prices rise', { Pw: 1 }, 'The world price rises from Pw to Pw1. NZ farmers supply more (Qs to Qs1) and NZ consumers buy less (Qd to Qd1), so exports increase.'],
    ['World lamb prices fall', { Pw: -1 }, 'The world price falls from Pw to Pw1. NZ farmers supply less and NZ consumers buy more, so exports decrease.'],
    ['A record kiwifruit harvest from good weather', { S: 1 }, 'Supply shifts right to S NZ1. At the same world price, more is supplied (Qs to Qs1), so exports increase.'],
    ['A drought cuts milk production', { S: -1 }, 'Supply shifts left to S NZ1. At the same world price, less is supplied, so exports decrease.'],
  ];
  P.addUnit({
    id: 'price-taker', title: 'The price-taker model', mins: 12,
    blurb: 'NZ is too small to set world prices. The world price line decides how much we export or import.',
    recap: 'New Zealand is a price taker: it is too small a part of world markets to affect world prices, so it must accept the world price (Pw). On the model, the world price is a horizontal line. If Pw is above NZ’s domestic equilibrium price, NZ producers supply more than NZ consumers demand (Qs > Qd), and the difference is exported. If Pw is below, NZ consumers demand more than NZ produces, and the difference is imported. Export receipts = Pw × quantity exported; producers’ revenue = Pw × Qs.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>The world price sets the deal.</h2>'), C(3, '<p>At Pw, NZ farmers supply Qs but NZ consumers only buy Qd.</p>'), C(8, '<p>The gap, Qs − Qd, is exported.</p>')],
        draw(a) { E.draw(a, MD.taker(true), {}, 1); } },
      { dur: 14, card: [C(0, '<h2>The world price rises.</h2>'), C(3, '<p>Pw to Pw₁: farmers supply more (Qs₁), NZ consumers buy less (Qd₁).</p>'), C(8, '<p>Exports increase. Export receipts rise twice over: more units, at a higher price.</p>')],
        draw(a) { E.draw(a, MD.taker(true), { Pw: 1 }, a.seg(a.p, 0.3, 0.7)); } },
      { dur: 12, card: [C(0, '<h2>Imports work the same way.</h2>'), C(3, '<p>If the world price is below NZ’s domestic price, NZ buys Qd but only makes Qs. The gap is imported.</p>')],
        draw(a) { E.draw(a, MD.taker(false), {}, 1); } },
    ],
    example: {
      problem: `World kiwifruit price ${$('6')} per tray. At that price NZ growers supply 200 million trays and NZ consumers buy 20 million. Calculate exports and export receipts. Then explain what happens if the world price rises to ${$('7')}.`,
      steps: [
        { m: 'Exports = Qs − Qd = 200 − 20 = 180 million trays.', note: 'the gap' },
        { m: `Export receipts = Pw × exports = ${$('6')} × 180 million = ${$('1080 million')}.`, note: 'price × quantity exported' },
        { m: `At ${$('7')}, growers supply more (Qs rises) because it is more profitable, and NZ consumers buy fewer (Qd falls).`, note: 'both sides move' },
        { m: 'So exports increase, and export receipts rise because of both the higher price and the larger quantity.', note: 'result' },
      ],
    },
    faded() { const [ev, ans, why] = R.pick(TAKER_X); return shift(`NZ is a price taker in this export market. <b>${ev}.</b> Show the change on the model.`, MD.taker(true), ans, [why], { why, wrong: takerWrong(ans) }); },
    grades: 'AMAMM',
    gens: [
      () => { const [ev, ans, why] = R.pick(TAKER_X); return shift(`NZ is a price taker in this export market. <b>${ev}.</b> Show the change on the model.`, MD.taker(true), ans, [why], { why, wrong: takerWrong(ans), trap: 'Moving the supply curve when the world price changes. A world price change moves the Pw line; it is not NZ’s supply.' }); },
      () => { const pw = R.pick([4, 5, 6, 8]), qs = R.int(150, 400), qd = R.int(10, 60); const rev = pw * (qs - qd);
        return { kind: 'num', answer: rev, prompt: `World price ${$(pw)} per unit. NZ producers supply ${qs} million units; NZ consumers buy ${qd} million. Calculate export receipts in millions of dollars.`, fmt: 'Give the number of millions.',
          wrong: [{ v: pw * qs, msg: 'That is producers’ total revenue (Pw × Qs). Export receipts are Pw × (Qs − Qd).' }, { v: qs - qd, msg: 'That is the quantity exported. Multiply by the world price.' }],
          more: { steps: [St(`Exports = Qs − Qd = ${qs} − ${qd} = ${qs - qd} million.`), St(`Export receipts = Pw × exports = ${pw} × ${qs - qd} = ${rev} million.`)], trap: 'Using Qs instead of the exported quantity.' }, sol: [`${pw} × (${qs} − ${qd}) = ${rev}`] }; },
      P.bank([
        { q: 'Why is New Zealand a price taker in world markets?', a: 'It supplies too small a share of world output to affect the world price', why: 'Even in dairy, NZ cannot set the world price on its own.', w: [['The government fixes prices', 'It does not.'], ['NZ products are lower quality', 'Not the reason.'], ['NZ has free trade agreements', 'FTAs do not make a country a price taker.']] },
        { q: 'On the price-taker model, what shows the quantity exported?', a: 'The gap between Qs and Qd at the world price', why: 'Producers supply Qs; NZ consumers take Qd; the rest is exported.', w: [['Qs alone', 'Part of Qs is sold in NZ.'], ['The domestic equilibrium quantity', 'That is with no trade.'], ['The height of the world price line', 'That is the price.']] },
        { q: 'The world price of lamb rises. What happens to NZ consumers of lamb?', a: 'They pay more and buy less (Qd falls)', why: 'NZ consumers face the world price too.', w: [['They pay less', 'The price they face rises.'], ['They are unaffected because lamb is exported', 'They pay the world price as well.'], ['They buy more', 'A higher price reduces quantity demanded.']] },
      ]),
      () => { const ev = R.pick([['The world price of cars falls', { Pw: -1 }, 'Pw falls to Pw1: NZ consumers buy more (Qd to Qd1) and the few NZ producers supply less, so imports increase.'], ['NZ incomes rise and people want more cars', { D: 1 }, 'Demand shifts right to D NZ1: at the same world price, imports increase.'], ['The world price of TVs rises', { Pw: 1 }, 'Pw rises to Pw1: NZ consumers buy fewer and NZ supply rises a little, so imports decrease.']]);
        return shift(`NZ imports this product and is a price taker. <b>${ev[0]}.</b> Show the change on the model.`, MD.taker(false), ev[1], [ev[2]], { wrong: takerWrong(ev[1]) }); },
      P.chain([
        { q: 'Put the chain in order: how higher world dairy prices affect NZ farmers.', steps: ['The world price of dairy rises from Pw to Pw1', 'Producing milk becomes more profitable', 'NZ farmers increase quantity supplied from Qs to Qs1', 'Exports increase as NZ consumers buy less (Qd to Qd1)', 'Farmers’ revenue rises from Pw × Qs to Pw1 × Qs1'] },
      ]),
    ],
    tips: [
      'Draw Pw as a <span class="pen">horizontal line</span>. Label Qs, Qd and the gap (exports or imports), and the new ones with a 1.',
      'A world price change moves the Pw line, not NZ’s supply or demand. The 2025 Not Achieved answers showed incorrect movements on the price-taker model.',
      'Merit in 2025: using the graph to calculate export receipts. Export receipts = Pw × (Qs − Qd).',
      'Never write an explanation that contradicts your graph. The 2025 examiners named this as a Not Achieved error.',
    ],
    aim: {
      intro: `<div class="resource">NZ is a price taker in the world beef market. At a world price of ${$('8')} per kg, NZ farmers supply 700 million kg and NZ consumers buy 150 million kg. Strong demand in the United States then pushes the world price to ${$('9')} per kg.</div>`,
      parts: [
        { q: 'Calculate NZ’s beef exports and export receipts at the original world price. Show the change on a price-taker model.', write: true, words: '30–50',
          model: [S('Exports = 700 − 150 = 550 million kg.', 'exports', true), S(`Export receipts = ${$('8')} × 550 million = ${$('4400 million')} (${$('4.4 billion')}).`, 'receipts', true), S('On the model, the world price rises from Pw to Pw1; Qs rises to Qs1 and Qd falls to Qd1, so exports increase.', 'the model change', true)],
          earns: 'Achieved: correct calculations and the correct model change.', crit: { A: 'Exports 550 million kg; receipts 4.4 billion dollars; Pw to Pw1, Qs up, Qd down, exports up.' } },
        { q: 'Explain the effect of the higher world price on NZ beef farmers. Refer to your model.', write: true, words: '60–90',
          model: [S('The world price rises from Pw to Pw1, so producing beef is more profitable.', 'price → profit', true), S('Farmers increase quantity supplied from Qs to Qs1.', 'quantity', true), S('Their total revenue rises from Pw × Qs to Pw1 × Qs1: both the price and the quantity are higher.', 'revenue, with labels', true), S('Exports rise from Qs − Qd to Qs1 − Qd1, so export receipts rise.', 'exports')],
          earns: 'Merit: the effect on farmers is explained with the model’s labels and the revenue change.', crit: { M: 'Explains Pw to Pw1 → Qs to Qs1 → revenue from Pw×Qs to Pw1×Qs1, using labels.' } },
        { q: 'Compare and contrast the effect of the higher world beef price on NZ beef farmers and on NZ households that buy beef.', write: true, words: '100–140',
          model: [S('Farmers gain: they receive Pw1 for every kg and sell more (Qs1), so their revenue and profits rise, and they may hire more workers.', 'farmers gain', true), S('Households lose: they must pay the higher world price Pw1 too, so they buy less beef (Qd to Qd1).', 'households lose', true), S('Households either spend more on beef or switch to substitutes such as chicken, lowering their standard of living a little.', 'how they adjust'), S('Both groups face the same price change, but it raises farmers’ income while it raises households’ costs: the effects are opposite.', 'the contrast', true), S('Overall the farmers’ gain is likely to be larger: their revenue rises on all 700 million kg they produce, while households pay more only on the 150 million kg they buy, so NZ as a whole is likely to benefit.', 'justified judgement')],
          earns: 'Excellence: the effects on both groups are explained with the model, compared and contrasted, and a justified overall view is given.',
          crit: { M: 'Explains farmers gain (higher price and quantity) and households lose (higher price, Qd falls).', E: 'Compares and contrasts both groups in detail using the model (as in the 2024 lamb and 2025 kiwifruit Excellence evidence), with a justified overall judgement.' } },
      ],
      up: [
        up(1, ['Farmers get a higher price so they produce more and earn more.'], [
          ['Use the model’s labels: Pw to Pw1, Qs to Qs1, revenue from Pw × Qs to Pw1 × Qs1, exports from Qs − Qd to Qs1 − Qd1', 1, 'Right. The ideas are right; Merit refers to the model’s labels in the explanation.'],
          ['Add the price in dollars', 0, 'Labels and links are what is missing.'],
          ['Say “as shown on the graph”', 0, 'The 2024 report said this is not enough for Merit.'],
          ['Say the US caused it', 0, 'Context, not explanation.']]),
        up(2, ['Farmers are better off and households are worse off.'], [
          ['Explain each with the model (price and quantity for each group), contrast why the same change has opposite effects, and give a justified overall judgement', 1, 'Right. Excellence compares and contrasts in detail, not just states.'],
          ['Say beef is popular', 0, 'Not reasoning.'],
          ['Add a third group', 0, 'Deepen the two groups asked about first.'],
          ['Repeat part (b)', 0, 'Households are missing.']]),
      ],
    },
  });
  function takerWrong(ans) {
    const out = [];
    if (ans.Pw) out.push({ v: { S: ans.Pw }, msg: 'A world price change moves the Pw line, not NZ supply.' }, { v: { Pw: -ans.Pw }, msg: 'Check the direction of the world price change.' });
    if (ans.S) out.push({ v: { Pw: -ans.S }, msg: 'NZ is a price taker: a change in NZ supply does not move the world price.' }, { v: { S: -ans.S }, msg: 'Check the direction: more output shifts supply right.' });
    if (ans.D) out.push({ v: { Pw: ans.D }, msg: 'NZ demand does not change the world price.' });
    return out;
  }

  /* ======================= 3. The two-country model ======================= */
  const TWO = [
    ['Demand for grass-fed beef rises in the United States', { Dos: 1 }, 'Overseas demand shifts right. The trade price rises from Pt to Pt1, NZ exports rise from X to X1 and the US imports more (M to M1).'],
    ['A drought cuts beef production in New Zealand', { Snz: -1 }, 'NZ supply shifts left. NZ has less to sell at each price, so the trade price rises and the quantity traded falls.'],
    ['NZ farmers have an excellent season', { Snz: 1 }, 'NZ supply shifts right. NZ has more to sell, so the trade price falls and the quantity traded rises.'],
    ['US consumers switch to chicken', { Dos: -1 }, 'Overseas demand shifts left. The trade price falls and NZ exports fall.'],
  ];
  P.addUnit({
    id: 'two-country', title: 'The two-country model', mins: 12,
    blurb: 'NZ’s market beside the overseas market. The trade price balances NZ’s exports with their imports.',
    recap: 'The two-country model shows the market for one product in New Zealand and in another country side by side. Without trade, NZ’s domestic price is lower and the other country’s is higher. With trade, a single trade price (Pt) is set where NZ’s excess supply (its exports, X) equals the other country’s excess demand (its imports, M). A change in either market changes the trade price and the quantity traded: for example, higher overseas demand raises Pt, NZ exports rise from X to X1, and export receipts rise from Pt × X to Pt1 × X1.',
    scenes: [
      { dur: 15, card: [C(0, '<h2>Two markets, one trade price</h2>'), C(3, '<p>NZ (left) can produce cheaply; overseas (right) has higher costs. Without trade, prices differ.</p>'), C(8.5, '<p>At the trade price Pt, NZ’s surplus (X) exactly matches overseas’ shortage (M).</p>')],
        draw(a) {
          const m = MD.two(); const pt = E.tradePrice(m, {});
          m.panels.forEach((pan, i) => E.draw(a, Object.assign({ x: 'Quantity', y: 'Price', world: 'Pt', gap: i ? 'M' : 'X', domestic: pan.domestic }, pan, { curves: pan.curves.concat([{ id: 'PT', kind: 'flat', b: pt, label: '', col: 'var(--pen)' }]) }), {}, 1, { x0: i * a.W / 2, w: a.W / 2 }));
        } },
      { dur: 14, card: [C(0, '<h2>Overseas demand rises</h2>'), C(3, '<p>D OS shifts right: the trade price rises from Pt to Pt₁.</p>'), C(8, '<p>NZ producers supply more and NZ consumers buy less: exports rise from X to X₁. Export receipts rise from Pt × X to Pt₁ × X₁.</p>')],
        draw(a) {
          const m = MD.two(); const t = a.seg(a.p, 0.3, 0.7); const st = { Dos: t };
          const pt = E.tradePrice(m, st);
          m.panels.forEach((pan, i) => E.draw(a, Object.assign({ x: 'Quantity', y: 'Price', world: 'Pt', gap: i ? 'M' : 'X', domestic: pan.domestic }, pan, { curves: pan.curves.concat([{ id: 'PT', kind: 'flat', b: pt, label: '', col: 'var(--pen)' }]) }), i ? { Dos: 1 } : {}, i ? t : 1, { x0: i * a.W / 2, w: a.W / 2 }));
        } },
      { dur: 11, card: [C(0, '<h2>Completing the model in the exam</h2>')],
        board: [L(0.5, 'label both countries’ S and D, and their domestic prices'), L(2.5, 'draw Pt across both panels'), L(4.5, 'mark X (NZ: Qs − Qd) and M (overseas: Qd − Qs): equal lengths'), L(6.5, 'after a change: Pt₁, X₁, M₁, and say receipts go from Pt × X to Pt₁ × X₁', '', { hl: true })] },
    ],
    example: {
      problem: 'Using the two-country model, explain the effect of higher US demand for NZ beef on NZ export receipts.',
      steps: [
        { m: 'US demand shifts right from D US to D US1, so at the old trade price the US wants to import more than NZ exports.', note: 'the change' },
        { m: 'This excess demand pushes the trade price up from Pt to Pt1.', note: 'price' },
        { m: 'In NZ, the higher price means producers supply more and consumers buy less, so exports rise from X to X1.', note: 'NZ panel' },
        { m: 'Export receipts rise from Pt × X to Pt1 × X1, because both price and quantity are higher.', note: 'receipts, with labels' },
      ],
    },
    faded() { const [ev, ans, why] = R.pick(TWO); return shift(`<b>${ev}.</b> Show the change on the two-country model.`, MD.two(), ans, [why], { why }); },
    grades: 'AMAMM',
    gens: [
      () => { const [ev, ans, why] = R.pick(TWO); return shift(`<b>${ev}.</b> Show the change on the two-country model.`, MD.two(), ans, [why], { why, wrong: [{ v: Object.fromEntries(Object.entries(ans).map(([k, v]) => [k, -v])), msg: 'Check the direction of the shift.' }] }); },
      () => { const [ev, ans] = R.pick(TWO); const k = Object.keys(ans)[0], dir = ans[k]; const m = MD.two(); const p0 = E.tradePrice(m, {}), p1 = E.tradePrice(m, ans); const rise = p1 > p0;
        return P.mcq({ prompt: `${ev}. What happens to the trade price (Pt)?`, fig: E.svg(m, ans), more: { steps: [St(`${k.endsWith('os') ? 'The overseas' : 'The NZ'} ${k[0] === 'D' ? 'demand' : 'supply'} curve shifts ${dir > 0 ? 'right' : 'left'}.`), St(rise ? 'At the old price there is now excess demand for traded beef, so Pt rises.' : 'At the old price there is now excess supply, so Pt falls.')] } },
          [{ t: rise ? 'It rises' : 'It falls', ok: true }, { t: rise ? 'It falls' : 'It rises', why: 'Check whether the change creates excess demand or excess supply at the old price.' }, { t: 'It stays the same', why: 'In the two-country model the trade price changes when either market changes.' }]); },
      () => { const pt = R.pick([5, 6, 7]), x = R.int(100, 300), pt1 = pt + R.pick([1, 2]), x1 = x + R.int(20, 80);
        return { kind: 'num', answer: pt1 * x1 - pt * x, prompt: `The trade price rises from ${$(pt)} to ${$(pt1)} per kg and NZ exports rise from ${x} to ${x1} million kg. By how much do NZ export receipts rise, in millions of dollars?`, fmt: 'Give the number of millions.',
          more: { steps: [St(`Before: Pt × X = ${pt} × ${x} = ${pt * x} million.`), St(`After: Pt1 × X1 = ${pt1} × ${x1} = ${pt1 * x1} million.`), St(`Rise = ${pt1 * x1 - pt * x} million.`)] }, sol: [`${pt1} × ${x1} − ${pt} × ${x} = ${pt1 * x1 - pt * x}`] }; },
      P.bank([
        { q: 'In the two-country model, what sets the trade price?', a: 'It is where NZ’s excess supply (exports) equals the other country’s excess demand (imports)', why: 'X = M at the trade price.', w: [['NZ’s domestic equilibrium price', 'That is without trade.'], ['The government', 'Markets set it.'], ['The higher of the two domestic prices', 'It is between the two.']] },
        { q: 'Why is the trade price higher than NZ’s domestic price but lower than the overseas domestic price?', a: 'It must be high enough for NZ to have a surplus and low enough for overseas to have a shortage', why: 'Only between the two prices do both countries want to trade.', w: [['Because of tariffs', 'No tariff in the basic model.'], ['It is always the average', 'Not necessarily the average.'], ['Because NZ sets it', 'NZ alone does not set it here.']] },
      ]),
      P.chain([
        { q: 'Put the chain in order: the effect of a US demand increase on NZ.', steps: ['US demand for beef increases', 'At the old trade price the US wants more imports than NZ offers', 'The trade price rises from Pt to Pt1', 'NZ producers supply more and NZ consumers buy less', 'NZ exports rise from X to X1, and receipts from Pt × X to Pt1 × X1'] },
      ]),
    ],
    tips: [
      'Complete both panels: <span class="pen">S, D, domestic prices, Pt across both, X and M</span>. The 2025 Achieved answers completed the two-country model correctly.',
      'X in NZ and M overseas must be equal at the trade price.',
      'Merit in 2023: explaining the rise in receipts from Pt × X to Pt1 × X1, referring to the graph.',
      'Effects on groups: NZ producers and workers gain from a higher trade price; NZ consumers pay more.',
    ],
    aim: {
      intro: '<div class="resource">New Zealand exports grass-fed beef to the United States. Health trends in the US increase demand for grass-fed beef.</div>',
      parts: [
        { q: 'Show the effect of the increase in US demand on a two-country model, and state what happens to NZ exports.', write: true, words: '30–50',
          model: [S('US demand shifts right from D US to D US1.', 'the shift', true), S('The trade price rises from Pt to Pt1.', 'trade price', true), S('NZ exports rise from X to X1 (and US imports from M to M1).', 'exports', true)],
          earns: 'Achieved: the correct shift and the changes in price and exports.', crit: { A: 'D US right; Pt up to Pt1; NZ exports X to X1.' } },
        { q: 'Explain why NZ export receipts increase. Refer to your model.', write: true, words: '60–90',
          model: [S('Higher US demand creates excess demand for beef at the old trade price, so the trade price rises from Pt to Pt1.', 'price', true), S('At Pt1, NZ farmers supply more and NZ consumers buy less, so exports rise from X to X1.', 'quantity', true), S('Export receipts rise from Pt × X to Pt1 × X1, because both the price and the quantity exported are higher.', 'receipts, with labels', true)],
          earns: 'Merit: the rise in receipts is explained using the model’s labels.', crit: { M: 'Explains trade price up and exports up, so receipts from Pt × X to Pt1 × X1, with labels.' } },
        { q: 'Discuss the effects of the higher trade price on two groups in New Zealand: beef-farm workers and households that buy beef.', write: true, words: '100–140',
          model: [S('Farmers earn more (Pt1 × Qs1), so they expand production and need more workers.', 'workers: more jobs', true), S('Beef-farm workers may get more hours, more jobs and higher wages: their incomes and standard of living rise.', 'workers gain'), S('NZ households must pay the higher price Pt1 too, so they buy less beef (Qd falls) or switch to cheaper meat.', 'households lose', true), S('So the same price rise helps workers through jobs and incomes, but costs households through higher prices.', 'contrast'), S('Workers who also buy beef feel both effects, and their extra income may outweigh the higher price of one food item, if the jobs and wage gains are large, while other households only lose.', 'justified judgement', true)],
          earns: 'Excellence: both groups’ effects are explained with the model, contrasted, and weighed with a justified view (as in the 2023 schedule, where Excellence explained both advantages and disadvantages in context).',
          crit: { M: 'Explains workers gain (more jobs/income) and households pay more.', E: 'Explains both groups in detail with reference to the model, contrasts them, and makes a justified judgement.' } },
      ],
      up: [
        up(1, ['Export receipts go up because the price goes up.'], [
          ['Add the quantity and the labels: Pt to Pt1 and X to X1, so receipts go from Pt × X to Pt1 × X1', 1, 'Right. Merit uses the labels and both parts of receipts.'],
          ['Say Americans like beef', 0, 'Context, not explanation.'],
          ['Draw only the NZ panel', 0, 'The two-country model needs both.'],
          ['Repeat part (a)', 0, 'Explain, do not restate.']]),
        up(2, ['Workers gain and households lose.'], [
          ['Explain each group’s effect with the model, contrast them, and justify which effect is larger for whom', 1, 'Right. Excellence explains and weighs; it does not just state.'],
          ['Name a beef brand', 0, 'Not relevant.'],
          ['Add the government', 0, 'Answer the two groups asked about.'],
          ['Say prices rise', 0, 'Too vague.']]),
      ],
    },
  });

  /* ======================= 4. Protection and free trade ======================= */
  P.addUnit({
    id: 'protection', title: 'Tariffs, quotas, subsidies and free trade', mins: 10,
    blurb: 'Protection raises the price of imports to help local firms, at a cost to consumers. NZ mostly chooses free trade.',
    recap: 'Protection means government policies that shield local producers from imports. A tariff is a tax on imports: it raises the price NZ consumers pay (from Pw to Pw + tariff), so domestic producers supply more, consumers buy less and imports fall; the government gains tariff revenue. A quota limits the quantity of imports. A subsidy is a payment to local producers that lowers their costs, shifting domestic supply right. Protection helps local producers and workers but raises prices for consumers. New Zealand mostly favours free trade and has free trade agreements (FTAs) that reduce barriers with partners such as China, Australia, the UK and the EU.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>A tariff on imports</h2>'), C(3, '<p>The price in NZ rises from Pw to Pw + tariff.</p>'), C(8, '<p>NZ producers supply more, NZ consumers buy less, and imports shrink.</p>')],
        draw(a) { E.draw(a, MD.taker(false), { Pw: 1 }, a.seg(a.p, 0.3, 0.7)); } },
      { dur: 12, card: [C(0, '<h2>Who wins, who loses</h2>')],
        board: [L(0.5, '<b>local producers and workers</b>: higher price, more sales'), L(2.5, '<b>government</b>: tariff revenue'), L(4.5, '<b>consumers</b>: higher prices, less choice', 'lose', { hl: true }), L(6.5, '<b>exporters overseas</b>: lose sales, and may retaliate')] },
      { dur: 11, card: [C(0, '<h2>Why NZ prefers free trade</h2>'), C(3, '<p>NZ depends on exports. Lower barriers abroad help our farmers; lower prices at home help consumers.</p>')],
        board: [L(0.5, 'FTAs: lower tariffs both ways'), L(2.5, 'cheaper imports: lower cost of living'), L(4.5, 'protection invites retaliation against our exports', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain how a tariff on imported shoes would affect NZ shoe makers and NZ consumers.',
      steps: [
        { m: 'A tariff is a tax on imports, so imported shoes cost more: the price in NZ rises from Pw to Pw + tariff.', note: 'what it does' },
        { m: 'At the higher price, NZ shoe makers supply more (Qs rises), so their sales and revenue increase.', note: 'producers gain' },
        { m: 'NZ consumers pay more and buy fewer shoes (Qd falls).', note: 'consumers lose' },
        { m: 'Imports fall from Qd − Qs to the smaller gap at the new price, and the government collects tariff revenue.', note: 'imports and revenue' },
      ],
    },
    faded() { return shift('The government puts a tariff on imported shoes. Show the effect on the price-taker model for an imported good (treat the tariff as raising the price NZ buyers pay).', MD.taker(false), { Pw: 1 }, ['The tariff raises the price in NZ from Pw to Pw1 (Pw + tariff).', 'NZ producers supply more; NZ consumers buy less; imports fall.'], { wrong: [{ v: { S: 1 }, msg: 'That would be a subsidy. A tariff raises the price of imports.' }, { v: { Pw: -1 }, msg: 'A tariff raises the price, not lowers it.' }] }); },
    grades: 'AMAMM',
    gens: [
      P.bank([
        { q: 'What is a tariff?', a: 'A tax on imported goods', why: 'It makes imports dearer, protecting local producers.', w: [['A limit on the number of imports', 'That is a quota.'], ['A payment to local producers', 'That is a subsidy.'], ['A ban on exports', 'Not a tariff.']] },
        { q: 'What is a quota?', a: 'A limit on the quantity of a good that can be imported', why: 'Restricting supply from overseas raises the price in NZ.', w: [['A tax on imports', 'That is a tariff.'], ['A payment to exporters', 'Not a quota.'], ['An agreement to trade freely', 'That is an FTA.']] },
        { q: 'How does a subsidy to local producers protect them?', a: 'It lowers their costs, so domestic supply shifts right and they sell more at the world price', why: 'Imports fall without raising the price consumers pay.', w: [['It raises the world price', 'NZ cannot change the world price.'], ['It taxes imports', 'That is a tariff.'], ['It bans imports', 'That is an embargo.']] },
        { q: 'Who is made worse off by a tariff on imported clothing?', a: 'NZ consumers, who pay higher prices', why: 'Local producers and the government gain.', w: [['NZ clothing makers', 'They gain.'], ['The government', 'It gains revenue.'], ['NZ clothing workers', 'Their jobs are more secure.']] },
      ]),
      () => shift('The government pays a subsidy to NZ apple growers. Show the effect on the price-taker model (NZ imports some apples).', MD.taker(false), { S: 1 }, ['A subsidy lowers growers’ costs, so NZ supply shifts right to S NZ1.', 'At the same world price, NZ produces more, so imports fall.'], { wrong: [{ v: { Pw: 1 }, msg: 'That is a tariff. A subsidy helps local supply, without changing the price.' }, { v: { D: 1 }, msg: 'A subsidy goes to producers, not consumers.' }] }),
      P.terms([['protection', 'Government policies that shield local producers from foreign competition.'], ['tariff', 'A tax on imported goods.'], ['quota', 'A limit on the quantity of a good that can be imported.'], ['subsidy', 'A payment by the government to producers that lowers their costs.'], ['free trade', 'Trade between countries without tariffs, quotas or other barriers.'], ['retaliation', 'When a country responds to another’s trade barriers with barriers of its own.']]),
      P.bank([
        { q: 'Why is the NZ government unlikely to put tariffs on imported bananas?', a: 'It would raise the cost of living, protect almost no local producers, and break free trade commitments', why: 'This was a 2023 exam question; reasons included the cost of living and FTA obligations.', w: [['Bananas cannot be taxed', 'They can.'], ['Bananas are NZ’s biggest export', 'NZ grows very few.'], ['Tariffs lower prices', 'They raise prices.']] },
        { q: 'Why might other countries retaliate if NZ adds tariffs?', a: 'They may put tariffs on NZ exports, hurting NZ farmers and exporters', why: 'NZ depends heavily on exports, so retaliation is costly.', w: [['They would buy more NZ goods', 'Retaliation reduces purchases.'], ['Tariffs make NZ goods cheaper overseas', 'No.'], ['Retaliation never happens', 'It often does.']] },
      ]),
      P.chain([
        { q: 'Put the chain in order: how a tariff protects NZ shoe makers.', steps: ['The government taxes imported shoes', 'The price of shoes in NZ rises from Pw to Pw + tariff', 'NZ shoe makers supply more at the higher price', 'NZ consumers buy fewer shoes', 'Imports fall and local producers gain sales'] },
      ]),
    ],
    tips: [
      'Name the method and <span class="pen">explain how it protects</span>: a tariff raises the price; a quota limits imports; a subsidy lowers local costs.',
      'Excellence in 2023: explaining protection in detail using the price-taker model.',
      'Give both sides: producers and workers gain; consumers lose; trading partners may retaliate.',
      'NZ mostly favours free trade. Know one FTA partner (China, Australia, UK, EU, CPTPP members). The 2024 Achieved answers named one.',
    ],
    aim: {
      intro: '<div class="resource">A group of NZ furniture makers asks the government for a 20% tariff on imported furniture, saying cheap imports are costing jobs. Most furniture sold in NZ is imported.</div>',
      parts: [
        { q: 'Describe what a tariff is and show its effect on a price-taker model for imported furniture.', write: true, words: '30–50',
          model: [S('A tariff is a tax on imported goods.', 'definition', true), S('On the model, the price in NZ rises from Pw to Pw + tariff (Pw1).', 'the model', true), S('NZ supply rises (Qs to Qs1), NZ demand falls (Qd to Qd1), so imports fall.', 'changes', true)],
          earns: 'Achieved: a correct definition and the correct model change.', crit: { A: 'Tariff = tax on imports; price up from Pw to Pw1; Qs up, Qd down, imports down.' } },
        { q: 'Explain how the tariff would protect NZ furniture makers.', write: true, words: '60–90',
          model: [S('The tariff makes imported furniture dearer, so the price in NZ rises from Pw to Pw1.', 'price', true), S('At the higher price, NZ furniture makers can sell more profitably, so they increase supply from Qs to Qs1.', 'producers', true), S('Buyers switch from imports to local furniture as imports fall from Qd − Qs to Qd1 − Qs1.', 'imports fall'), S('So local firms gain sales and revenue, and keep or create jobs.', 'protection achieved', true)],
          earns: 'Merit: how the tariff protects producers is explained using the model.', crit: { M: 'Explains price rises → NZ producers supply more → imports fall → sales and jobs protected, with model labels.' } },
        { q: 'Discuss whether the government should introduce the tariff.', write: true, words: '100–150',
          model: [S('For: NZ furniture makers sell more at a higher price, protecting jobs, and the government gains tariff revenue.', 'benefits', true), S('Against: most furniture is imported, so most buyers pay 20% more: the cost of living rises for many households to protect a few firms.', 'cost to consumers', true), S('Our trading partners may see it as breaking free trade agreements and retaliate with tariffs on NZ exports such as dairy, which matter far more to NZ.', 'retaliation risk'), S('Local firms protected from competition may become less efficient over time.', 'efficiency'), S('On balance the government should not introduce it: the cost to consumers and the risk to NZ’s much larger export industries outweigh the gains to a small industry.', 'justified judgement', true)],
          earns: 'Excellence: benefits and costs are weighed using the context, and a clear, justified recommendation follows.',
          crit: { M: 'Explains one benefit and one cost of the tariff.', E: 'Weighs benefits (jobs, revenue) against costs (higher prices for most buyers, retaliation, FTA obligations, efficiency) and makes a justified recommendation using the context.' } },
      ],
      up: [
        up(1, ['The tariff makes imports cost more so people buy NZ furniture.'], [
          ['Use the model: the price rises from Pw to Pw1, NZ makers supply more (Qs to Qs1), imports fall, so their sales and jobs are protected', 1, 'Right. Merit explains with the model’s labels and links to protection.'],
          ['Give the tariff rate', 0, 'In the resource already.'],
          ['Say NZ furniture is better quality', 0, 'Not the mechanism.'],
          ['Define a quota', 0, 'Not asked.']]),
        up(2, ['The government should not because it makes furniture expensive.'], [
          ['Weigh both sides (jobs and revenue vs cost of living, retaliation, efficiency), use the context (most furniture is imported), then justify the recommendation', 1, 'Right. Excellence weighs the evidence before deciding.'],
          ['Say tariffs are always bad', 0, 'Too sweeping; discuss this case.'],
          ['Add a second tariff', 0, 'Not relevant.'],
          ['Repeat part (b)', 0, 'Costs are missing.']]),
      ],
    },
  });

  /* ======================= 5. The market for NZ dollars ======================= */
  const FXEV = [
    ['More overseas tourists visit New Zealand', { D: 1 }, 'Tourists must buy NZ dollars to spend here: demand for NZD shifts right, and the NZD appreciates (Er to Er1).'],
    ['World dairy prices rise, so NZ export receipts increase', { D: 1 }, 'Overseas buyers pay for NZ exports, so more foreign currency is changed into NZD: demand for NZD rises and the NZD appreciates.'],
    ['NZ interest rates rise above those overseas', { D: 1 }, 'Foreign savers buy NZD to invest here: demand for NZD rises and the NZD appreciates. Also accepted: New Zealand savers keep more of their money in NZ instead of investing overseas, so the supply of NZD falls too (S left). Both push the NZD up.', [{ D: 1, S: -1 }]],
    ['NZ firms import more machinery from the US', { S: 1 }, 'Importers sell NZD to buy US dollars: supply of NZD shifts right and the NZD depreciates.'],
    ['More New Zealanders holiday overseas', { S: 1 }, 'They sell NZD to buy foreign currency: supply of NZD rises and the NZD depreciates.'],
    ['Overseas students stop coming to NZ universities', { D: -1 }, 'Fewer students buy NZD: demand for NZD shifts left and the NZD depreciates.'],
  ];
  P.addUnit({
    id: 'exchange-rate', title: 'The market for NZ dollars', mins: 12,
    blurb: 'Who buys NZ dollars, who sells them, and what shifts the curves. Appreciation and depreciation.',
    recap: 'The exchange rate is the price of the NZ dollar in another currency, such as US dollars. It is set by demand for and supply of NZ dollars. Demand for NZD comes from foreigners who need NZ dollars: buyers of NZ exports, overseas tourists and students in NZ, and foreign investors. Supply of NZD comes from New Zealanders who need foreign currency: importers, NZ tourists overseas, and NZ investors buying overseas assets. If demand rises or supply falls, the NZD appreciates (its price rises from Er to Er1). If demand falls or supply rises, it depreciates.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Demand for NZ dollars</h2>'), C(3, '<p>Anyone overseas who must pay in NZ dollars: buyers of our exports, tourists, students, investors.</p>'), C(8.5, '<p>More of them: demand shifts right, the NZD appreciates from Er to Er₁.</p>')],
        draw(a) { E.draw(a, MD.fx(), { D: 1 }, a.seg(a.p, 0.4, 0.8)); } },
      { dur: 14, card: [C(0, '<h2>Supply of NZ dollars</h2>'), C(3, '<p>Anyone in NZ who must pay in foreign currency: importers, travellers, investors overseas. They sell NZD.</p>'), C(8.5, '<p>More of them: supply shifts right, the NZD depreciates.</p>')],
        draw(a) { E.draw(a, MD.fx(), { S: 1 }, a.seg(a.p, 0.4, 0.8)); } },
      { dur: 11, card: [C(0, '<h2>Sort the event</h2>')],
        board: [L(0.5, 'foreigners need NZD → <b>demand</b>'), L(2.5, 'New Zealanders need foreign currency → <b>supply</b> of NZD'), L(4.5, 'D right or S left → <b>appreciation</b>'), L(6.5, 'D left or S right → <b>depreciation</b>', '', { hl: true })] },
    ],
    example: {
      problem: 'NZ firms increase their imports of vehicles from Japan. Explain the effect on the value of the NZ dollar.',
      steps: [
        { m: 'To pay Japanese sellers, NZ importers must sell NZ dollars to buy yen.', note: 'who sells NZD' },
        { m: 'So the supply of NZ dollars increases: S NZD shifts right to S NZD1.', note: 'the model' },
        { m: 'At the old exchange rate there is now a surplus of NZD, so its price falls from Er to Er1.', note: 'the price' },
        { m: 'The NZ dollar depreciates.', note: 'name it' },
      ],
    },
    faded() { const [ev, ans, why, accept] = R.pick(FXEV); return shift(`<b>${ev}.</b> Show the effect on the market for NZ dollars.`, MD.fx(), ans, [why], { why, accept, wrong: fxWrong(ans, accept) }); },
    grades: 'AMAMM',
    gens: [
      () => { const [ev, ans, why, accept] = R.pick(FXEV); return shift(`<b>${ev}.</b> Show the effect on the market for NZ dollars.`, MD.fx(), ans, [why], { why, accept, wrong: fxWrong(ans, accept), trap: 'Mixing up demand and supply. Ask: who needs NZ dollars (demand), and who is getting rid of them (supply)?' }); },
      () => { const [ev, ans] = R.pick(FXEV); const app = (ans.D || 0) > 0 || (ans.S || 0) < 0;
        return P.mcq({ prompt: `${ev}. What happens to the NZ dollar?`, more: { steps: [St(ans.D ? `Demand for NZD shifts ${ans.D > 0 ? 'right' : 'left'}.` : `Supply of NZD shifts ${ans.S > 0 ? 'right' : 'left'}.`), St(app ? 'The price of the NZD rises: appreciation.' : 'The price of the NZD falls: depreciation.')] } },
          [{ t: app ? 'It appreciates' : 'It depreciates', ok: true }, { t: app ? 'It depreciates' : 'It appreciates', why: 'Work out which curve shifts, then which way the price moves.' }, { t: 'No change: exchange rates are fixed', why: 'NZ has a floating exchange rate set by the market.' }]); },
      P.terms([['exchange rate', 'The price of one currency in terms of another, e.g. 0.60 US dollars per NZ dollar.'], ['appreciation', 'A rise in the value of the NZ dollar against another currency.'], ['depreciation', 'A fall in the value of the NZ dollar against another currency.'], ['demand for NZ dollars', 'From foreigners who need NZ dollars: buyers of exports, tourists, investors.'], ['supply of NZ dollars', 'From New Zealanders selling NZ dollars to get foreign currency: importers, travellers, investors.'], ['floating exchange rate', 'An exchange rate set by demand and supply in the market.']]),
      P.bank([
        { q: 'Which group creates demand for NZ dollars?', a: 'Chinese buyers of NZ milk powder', why: 'They must pay NZ exporters, so they buy NZD.', w: [['NZ importers of cars', 'They supply NZD.'], ['NZ tourists in Bali', 'They supply NZD.'], ['NZ investors buying US shares', 'They supply NZD.']] },
        { q: 'The exchange rate moves from 0.62 to 0.58 US dollars per NZ dollar. What happened?', a: 'The NZ dollar depreciated', why: 'Each NZ dollar buys fewer US dollars.', w: [['The NZ dollar appreciated', 'It buys less, so it fell.'], ['The US dollar depreciated', 'The US dollar rose against the NZD.'], ['Nothing changed', 'The rate fell.']] },
      ]),
      P.chain([
        { q: 'Put the chain in order: how a rise in tourism affects the NZ dollar.', steps: ['More overseas tourists come to New Zealand', 'They exchange their currency for NZ dollars to spend here', 'Demand for NZD shifts right from D NZD to D NZD1', 'At the old exchange rate there is a shortage of NZD', 'The NZD appreciates from Er to Er1'] },
      ]),
    ],
    tips: [
      'Ask <span class="pen">who needs NZ dollars</span> (demand) and who is <span class="pen">selling NZ dollars</span> (supply).',
      'Label the axes: price of NZD (in US dollars) and quantity of NZD; label Er and Er₁.',
      'The 2025 Achieved answers showed the change by correctly shifting demand or supply of NZD.',
      'Appreciation: each NZ dollar buys more foreign currency. Depreciation: it buys less.',
    ],
    aim: {
      intro: '<div class="resource">In 2026 more international students return to New Zealand universities, and record numbers of overseas tourists visit. At the same time, more New Zealanders take holidays overseas.</div>',
      parts: [
        { q: 'Show on the market for NZ dollars the effect of more international students and tourists, and state what happens to the exchange rate.', write: true, words: '30–50',
          model: [S('Students and tourists must buy NZ dollars to pay fees and spend here, so demand for NZD shifts right from D NZD to D NZD1.', 'the shift', true), S('The exchange rate rises from Er to Er1.', 'the price', true), S('The NZ dollar appreciates.', 'name it', true)],
          earns: 'Achieved: the correct shift and the appreciation.', crit: { A: 'Demand for NZD shifts right; Er to Er1; appreciation.' } },
        { q: 'Explain why more New Zealanders holidaying overseas affects the NZ dollar. Refer to the model.', write: true, words: '50–80',
          model: [S('New Zealanders overseas need foreign currency, so they sell NZ dollars to buy it.', 'who sells NZD', true), S('The supply of NZD increases, shifting S NZD right to S NZD1.', 'the shift', true), S('At the old exchange rate there is a surplus of NZD, so the price of the NZD falls from Er to Er1: it depreciates.', 'the result, with labels', true)],
          earns: 'Merit: the cause is linked to the supply of NZD and the exchange rate, using labels.', crit: { M: 'Explains NZers sell NZD for foreign currency → supply of NZD right → surplus → Er falls (depreciation).' } },
        { q: 'Discuss the overall effect on the NZ dollar when both events happen at once.', write: true, words: '90–130',
          model: [S('Students and tourists increase demand for NZD (D NZD to D NZD1), pushing the exchange rate up.', 'effect 1', true), S('New Zealanders travelling overseas increase supply of NZD (S NZD to S NZD1), pushing it down.', 'effect 2', true), S('Both shifts increase the quantity of NZD traded, but their effects on the exchange rate work against each other.', 'combines them'), S('The overall effect depends on which shift is larger: record overseas tourists plus returning students is likely to be a bigger change than more NZ holidays.', 'which is larger', true), S('So the NZ dollar is likely to appreciate a little, but by less than if demand had risen on its own. (Any judgement is accepted if it is justified by the relative size of the two shifts.)', 'justified conclusion')],
          earns: 'Excellence: both shifts are shown and explained together, and the overall effect is reasoned from their relative size using the context.',
          crit: { M: 'Explains that demand and supply of NZD both rise, with opposite effects on the rate.', E: 'Integrates both shifts on the model, reasons which is larger using the context, and reaches a justified conclusion.' } },
      ],
      up: [
        up(1, ['New Zealanders going overseas makes the dollar go down.'], [
          ['Explain the mechanism: they sell NZD to buy foreign currency, supply of NZD shifts right to S NZD1, a surplus forms, and the rate falls from Er to Er1', 1, 'Right. Merit explains which curve shifts and why, with labels.'],
          ['Say Bali is popular', 0, 'Context, not explanation.'],
          ['Say demand for NZD falls', 0, 'It is supply that changes.'],
          ['Define depreciation', 0, 'Not the missing link.']]),
        up(2, ['Demand and supply both increase, so it depends.'], [
          ['Show and explain both shifts, then reason which is larger using the context, and reach a conclusion', 1, 'Right. “It depends” needs reasoning about what it depends on, and a judgement.'],
          ['Say exchange rates are hard to predict', 0, 'Not discussion.'],
          ['Repeat part (a)', 0, 'Combine both events.'],
          ['Draw only one shift', 0, 'Both happen together.']]),
      ],
    },
  });
  function fxWrong(ans, accept) { const k = Object.keys(ans)[0], v = ans[k]; const other = k === 'D' ? 'S' : 'D';
    return (accept ? [{ v: { S: -1 }, msg: 'That can happen too, as New Zealand savers keep money at home. But the main effect is overseas investors buying NZ dollars to invest here: show that change in demand as well.' }] : []).concat([{ v: { [k]: -v }, msg: 'Right curve, wrong direction.' }, { v: { [other]: v }, msg: k === 'D' ? 'This comes from people who need NZ dollars: that is demand.' : 'This comes from people selling NZ dollars: that is supply.' }, { v: { [other]: -v }, msg: k === 'D' ? 'Think about who needs NZ dollars here: that is demand.' : 'Think about who is selling NZ dollars: that is supply.' }]); }

  /* ======================= 6. Effects of exchange-rate changes ======================= */
  const GROUPS = [
    ['NZ exporters', 'lose', 'they receive fewer NZ dollars for each foreign-currency sale, or must raise foreign prices and sell less'],
    ['NZ importers', 'gain', 'imported goods cost fewer NZ dollars, so their costs fall'],
    ['NZ tourists going overseas', 'gain', 'each NZ dollar buys more foreign currency, so overseas holidays are cheaper'],
    ['NZ firms selling to overseas tourists', 'lose', 'NZ becomes more expensive for visitors, so fewer come or they spend less'],
    ['NZ households buying imported goods', 'gain', 'imported goods such as cars and phones become cheaper'],
  ];
  P.addUnit({
    id: 'fx-effects', title: 'Who gains from a rising or falling NZ dollar', mins: 11,
    blurb: 'Appreciation helps importers and travellers, and hurts exporters and tourism. Depreciation does the reverse.',
    recap: 'When the NZ dollar appreciates, each NZ dollar buys more foreign currency. Imports become cheaper in NZ dollars, so importers, households buying imported goods, and New Zealanders travelling overseas gain. Exporters lose: they receive fewer NZ dollars for each foreign-currency sale, or must raise their foreign prices and sell less; NZ tourism becomes dearer for visitors. Cheaper imports also lower inflation. A depreciation has the opposite effects: it helps exporters and tourism, but raises the cost of imports and can add to inflation.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Appreciation: 0.60 → 0.70 US dollars per NZD</h2>'), C(3, '<p>A US buyer pays US<span class="nomath">$</span>7 for lamb. Before, the farmer got NZ<span class="nomath">$</span>11.67. After, only NZ<span class="nomath">$</span>10.</p>'), C(8.5, '<p>An iPhone costing US<span class="nomath">$</span>700 falls from NZ<span class="nomath">$</span>1167 to NZ<span class="nomath">$</span>1000.</p>')],
        board: [L(0.5, '<b>exporters</b>: fewer NZ dollars per sale → lose'), L(2.5, '<b>importers, shoppers</b>: imports cheaper → gain'), L(4.5, '<b>NZers travelling</b>: more spending money → gain'), L(6.5, '<b>tourism in NZ</b>: dearer for visitors → lose', '', { hl: true })] },
      { dur: 12, card: [C(0, '<h2>Depreciation flips it.</h2>'), C(3, '<p>Exporters and tourism gain. Importers and shoppers lose. Imported inflation rises.</p>')],
        board: [L(0.5, 'depreciation → exports more competitive'), L(2.5, '→ imports dearer → cost-push inflation risk'), L(4.5, '→ NZ holidays cheaper for visitors', '', { hl: true })] },
    ],
    example: {
      problem: 'The NZ dollar depreciates. Compare the effect on a kiwifruit exporter and on a car importer.',
      steps: [
        { m: 'After a depreciation, each unit of foreign currency buys more NZ dollars.', note: 'what changes' },
        { m: 'The kiwifruit exporter receives more NZ dollars for each tray sold at the same foreign price, so revenue and profit rise; or it can lower its foreign price and sell more.', note: 'exporter gains' },
        { m: 'The car importer must pay more NZ dollars for each car bought in yen, so its costs rise and it must raise prices or accept lower profits.', note: 'importer loses' },
        { m: 'So the same depreciation helps the exporter and hurts the importer, because one earns foreign currency and the other spends it.', note: 'compare' },
      ],
    },
    faded() { return groupGen()(); },
    grades: 'AMMMM',
    gens: [
      groupGen(),
      () => { const r0 = R.pick([0.55, 0.6, 0.65]), r1 = r0 + R.pick([0.05, -0.05]), usd = R.pick([6, 7, 8, 9]); const n0 = usd / r0, n1 = usd / r1;
        return { kind: 'num', answer: n1, dp: 2, tol: 0.006, prompt: `A NZ exporter sells a product for US<span class="nomath">$</span>${usd}. The exchange rate changes from ${r0.toFixed(2)} to ${r1.toFixed(2)} US dollars per NZ dollar. How many NZ dollars does the exporter now receive per unit?`.replace(/US\$/g, 'US<span class="nomath">$</span>'), fmt: 'Give NZ dollars to 2 decimal places.',
          more: { steps: [St('NZ dollars = US dollars ÷ (US dollars per NZ dollar).'), St(`Before: ${usd} ÷ ${r0.toFixed(2)} = ${P.f(n0, 2)}. After: ${usd} ÷ ${r1.toFixed(2)} = ${P.f(n1, 2)}.`), St(r1 > r0 ? 'Appreciation: the exporter gets fewer NZ dollars.' : 'Depreciation: the exporter gets more NZ dollars.')], trap: 'Multiplying by the exchange rate. Divide.' }, sol: [`${usd} ÷ ${r1.toFixed(2)} = ${P.f(n1, 2)}`] }; },
      P.bank([
        { q: 'Why does an appreciation of the NZ dollar tend to lower inflation?', a: 'Imported goods and inputs become cheaper in NZ dollars', why: 'Lower import prices reduce costs and consumer prices.', w: [['It raises export prices', 'That does not lower NZ prices.'], ['It increases demand for NZ exports', 'It reduces it.'], ['It raises interest rates', 'Not directly.']] },
        { q: 'Why might a depreciation of the NZ dollar increase NZ tourism?', a: 'Overseas visitors get more NZ dollars for their currency, so NZ holidays are cheaper for them', why: 'The same foreign spending money goes further in NZ.', w: [['NZ hotels lower their NZD prices', 'Prices need not change.'], ['Flights become free', 'No.'], ['New Zealanders travel more overseas', 'Overseas travel becomes dearer for NZers.']] },
      ]),
      P.chain([
        { q: 'Put the chain in order: how an appreciation affects NZ dairy farmers.', steps: ['The NZ dollar appreciates', 'Each US dollar earned from dairy exports converts to fewer NZ dollars', 'Dairy companies receive less NZD revenue', 'They pay farmers a lower price for milk', 'Farm incomes fall'] },
      ]),
      P.bank([
        { q: 'The NZ dollar appreciates sharply. Which business is most likely to be hurt?', a: 'A Queenstown ski-lift company that relies on Australian visitors', why: 'NZ becomes dearer for Australians, so fewer visit.', w: [['An Auckland car importer', 'Cars become cheaper to import.'], ['A retailer selling imported clothing', 'Its costs fall.'], ['A NZ family planning a trip to Fiji', 'Their trip becomes cheaper.']] },
      ]),
    ],
    tips: [
      'Start each group with <span class="pen">does it earn or spend foreign currency?</span> Earners lose from appreciation; spenders gain.',
      'Merit in 2025: explaining the impact of a depreciation on NZ tourists. Excellence: comparing tourists and importers.',
      'Use a number example if it helps: US<span class="nomath">$</span>7 at 0.60 is NZ<span class="nomath">$</span>11.67; at 0.70 it is NZ<span class="nomath">$</span>10.',
      'Link to inflation when relevant: depreciation makes imports dearer (cost-push); appreciation does the opposite.',
    ],
    aim: {
      intro: '<div class="resource">Over a year the NZ dollar falls from 0.64 to 0.56 US dollars. A Nelson apple exporter sells to the US. An Auckland electronics retailer imports all its stock from the US and Asia.</div>',
      parts: [
        { q: 'State whether the NZ dollar has appreciated or depreciated, and describe one effect on each business.', write: true, words: '30–50',
          model: [S('The NZ dollar has depreciated: each NZ dollar buys fewer US dollars.', 'name it', true), S('The apple exporter receives more NZ dollars for each US dollar of sales.', 'exporter', true), S('The electronics retailer must pay more NZ dollars for its imported stock.', 'importer', true)],
          earns: 'Achieved: the correct change and one correct effect on each business.', crit: { A: 'Depreciation; exporter gets more NZD; importer pays more NZD.' } },
        { q: 'Explain how the depreciation affects the apple exporter’s revenue.', write: true, words: '50–80',
          model: [S('Apples are sold in US dollars.', 'currency'), S('After the depreciation, each US dollar converts into more NZ dollars (1 ÷ 0.56 = NZ<span class="nomath">$</span>1.79, compared with 1 ÷ 0.64 = NZ<span class="nomath">$</span>1.56).', 'with numbers', true), S('So for the same US price and volume, the exporter’s NZ-dollar revenue rises.', 'revenue up', true), S('Or it can lower its US price, become more competitive, and sell more apples.', 'alternative')],
          earns: 'Merit: the change in revenue is explained, with the currency conversion.', crit: { M: 'Explains each US dollar converts to more NZ dollars so NZD revenue rises (or lower US price and higher sales).' } },
        { q: 'Compare and contrast the effect of the depreciation on the two businesses, and on New Zealand households.', write: true, words: '100–150',
          model: [S('The exporter gains: it earns US dollars, which now buy more NZ dollars, so its revenue and profit rise.', 'exporter gains', true), S('The retailer loses: it spends US dollars, which now cost more NZ dollars, so its costs rise and it must raise prices or accept lower profits.', 'retailer loses', true), S('The contrast is because one earns foreign currency and the other spends it.', 'why opposite'), S('Households pay more for imported electronics and other imports, so their cost of living rises, adding to inflation; but jobs in exporting regions such as Nelson may become more secure.', 'households: mixed'), S('Overall the depreciation shifts income from importers and households towards exporters, so whether a household is better off depends on whether its income comes from exporting.', 'justified conclusion', true)],
          earns: 'Excellence: the opposite effects are explained and contrasted by currency flow, households are included, and a reasoned overall view is given.',
          crit: { M: 'Explains the exporter gains and the importer loses.', E: 'Compares and contrasts both businesses (earn vs spend foreign currency) and households (higher import prices, inflation, export jobs), with a justified overall view (as in the 2025 Excellence evidence).' } },
      ],
      up: [
        up(1, ['The exporter gets more money because the dollar fell.'], [
          ['Show the conversion: each US dollar was NZ<span class="nomath">$</span>1.56 at 0.64 and is NZ<span class="nomath">$</span>1.79 at 0.56, so NZD revenue rises for the same US sales', 1, 'Right. Merit explains the mechanism; a number shows it clearly.'],
          ['Say apples are healthy', 0, 'Not relevant.'],
          ['Name the US', 0, 'Context, not explanation.'],
          ['Say the dollar appreciated', 0, 'It depreciated.']]),
        up(2, ['The exporter gains and the importer loses. Households pay more for imports.'], [
          ['Explain why the effects are opposite (earning vs spending foreign currency), explain households’ mixed position, and give an overall judgement', 1, 'Right. Excellence compares and contrasts with reasons, not a list.'],
          ['Add more businesses', 0, 'Deepen the ones asked about.'],
          ['Repeat the exchange rates', 0, 'Data without reasoning.'],
          ['Say depreciation is bad', 0, 'It helps some groups.']]),
      ],
    },
  });
  function groupGen() {
    return () => { const app = R.pick([true, false]); const g = R.pick(GROUPS); const gains = app ? g[1] === 'gain' : g[1] !== 'gain';
      return P.mcq({ prompt: `The NZ dollar ${app ? 'appreciates' : 'depreciates'}. How are <b>${g[0]}</b> affected?`, more: { steps: [St(`With an appreciation, ${g[0]} ${g[1]}: ${g[2]}.`), St(app ? 'So here they ' + g[1] + '.' : 'A depreciation reverses it, so here they ' + (g[1] === 'gain' ? 'lose' : 'gain') + '.')], trap: 'Ask whether this group earns foreign currency (exporters) or spends it (importers, travellers).' } },
        [{ t: gains ? 'They gain' : 'They lose', ok: true }, { t: gains ? 'They lose' : 'They gain', why: `Think about whether ${g[0]} earn or spend foreign currency.` }, { t: 'No effect', why: 'Exchange rates affect anyone who trades across currencies.' }]); };
  }
})();
