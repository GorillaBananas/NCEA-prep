/* AS 91240 (Geography 2.1) Demonstrate geographic understanding of a large natural environment.
   Case study: the Amazon rainforest. The exam is ONE question, often in two parts:
   2023 and 2025: name a characteristic and explain how elements or processes interact to create it;
   2024: (a) how the environment formed and changes over time, (b) how one group's perception of it has changed.
   Exam tips draw on the 2023–2025 NZQA assessment reports and schedules. Facts checked October 2026. */
(function () {
  const P = NP, R = P.R, G = P.geo;
  const C = (at, html) => ({ at, html });
  const L = (at, html, note, o = {}) => Object.assign({ at, html: `<span class="bq">${html}</span>`, note }, o);
  const F = (at, html) => ({ at, html });
  const S = (m, note, key) => ({ m, note, key: !!key });
  const up = (part, shown, choices, ask) => ({ part, shown, ask, choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });
  const St = (say, m) => ({ say, m });
  const $ = (v) => P.money(v);
  const STD = 'Name your environment at the start of every answer: “the Amazon rainforest, South America”.';

  /* ======================= 1. Where and what ======================= */
  const CONCEPTS = [
    ['environments', 'Natural and/or cultural surroundings, with characteristics that come from natural and/or cultural processes.'],
    ['location', 'Where something is, in absolute terms (latitude, longitude) or relative terms (in relation to other places). It can be an advantage or a constraint.'],
    ['perspectives', 'Ways of seeing the world, shaped by values and world views, that explain people’s different decisions about environments.'],
    ['change', 'Any alteration to a natural or cultural environment. It can be spatial or temporal, fast or slow, and is normal.'],
    ['interaction', 'Elements of an environment affecting each other and linked together, by movements and flows. It can be one-way or two-way.'],
    ['processes', 'A sequence of actions, natural or cultural, that shapes environments, such as convection, leaching or deforestation.'],
  ];
  P.addUnit({
    id: 'amazon-where', title: 'The Amazon: location and elements', mins: 10,
    blurb: 'Where it is, how big it is, and the elements and processes the exam asks about.',
    recap: 'The Amazon rainforest is the world’s largest tropical rainforest, about 5.5 million km², most of it in the Amazon basin of South America. It spreads across nine countries; Brazil has about 60%. It lies mostly between about 5°N and 15°S, so the equator crosses it, and it sits east of the Andes, which supply the Amazon River that drains east to the Atlantic Ocean. Its natural elements are climate, vegetation, soils and landforms (relief and drainage). Natural processes such as convection, evapotranspiration, leaching, nutrient cycling, erosion and deposition link these elements together.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Absolute and relative location</h2>'), C(3, '<p>Absolute: on the equator, mostly between 5°N and 15°S.</p>'), C(8, '<p>Relative: east of the Andes, drained by the Amazon River to the Atlantic.</p>')],
        board: [F(0.5, G.amazonMap({ andes: 'Andes', basin: 'Amazon basin', river: 'Amazon River', negro: 'Rio Negro' }))] },
      { dur: 13, card: [C(0, '<h2>The scale</h2>'), C(3, '<p>About 5.5 million km² of forest: about 20 times the area of New Zealand.</p>'), C(8, '<p>Nine countries. Brazil has about 60%.</p>')],
        board: [L(0.5, 'about <b>5.5 million km²</b> of rainforest'), L(3, 'nine countries: Brazil, Peru, Colombia, Bolivia, Venezuela, Ecuador, Guyana, Suriname, French Guiana'), L(6.5, 'location is an <b>advantage</b> for growth: heat and rain all year', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>Elements and processes</h2>'), C(3, '<p>Elements are the parts. Processes are what links and changes them.</p>'), C(8, '<p>Every exam answer explains how they interact.</p>')],
        board: [L(0.5, '<b>elements</b>: climate, vegetation, soils, landforms (relief, rivers)'), L(3, '<b>processes</b>: convection, evapotranspiration, leaching, nutrient cycling, erosion, deposition, flooding'), L(6, '<b>characteristic</b>: what the environment is like, e.g. dense vegetation, infertile soils, high rainfall', '', { hl: true })] },
    ],
    example: {
      problem: 'Describe the location of your large natural environment.',
      steps: [
        { m: 'The Amazon rainforest is in northern South America, in the basin of the Amazon River.', note: 'name and continent' },
        { m: 'Absolute location: it straddles the equator, mostly between about 5°N and 15°S, and from about 50°W to 75°W.', note: 'absolute location' },
        { m: 'Relative location: it lies east of the Andes mountains, and the Amazon River drains it east to the Atlantic Ocean near Belém.', note: 'relative location' },
        { m: 'It covers about 5.5 million km² across nine countries; about 60% is in Brazil.', note: 'scale, with figures' },
      ],
    },
    faded() { return P.chain([{ q: 'Put the description of the Amazon’s location in a logical order, from big to small.', steps: ['Continent: northern South America', 'Absolute location: across the equator, about 5°N to 15°S', 'Relative location: east of the Andes, draining to the Atlantic', 'Scale: about 5.5 million km² across nine countries', 'Within it: the city of Manaus, where the Rio Negro meets the Amazon'] }], 2)(); },
    grades: 'AAAAM',
    gens: [
      G.labelGen(G.amazonMap, { andes: 'Andes mountains', basin: 'Amazon basin (rainforest)', river: 'Amazon River', mouth: 'Mouth of the Amazon (Atlantic)', negro: 'Rio Negro' }, { prompt: 'Match each letter on the sketch map to the right label.', idea: 'Learn this sketch map: you can draw it in the exam to show location. Examiners rewarded clear, annotated maps.' }),
      P.bank([
        { q: 'Which statement gives the Amazon’s absolute location?', a: 'It lies mostly between about 5°N and 15°S, across the equator', why: 'Absolute location uses latitude and longitude.', w: [['It lies east of the Andes', 'That is relative location.'], ['It is near Manaus', 'Relative, and Manaus is inside it.'], ['It is in a hot, wet climate', 'That is a characteristic, not a location.']] },
        { q: 'Which statement gives the Amazon’s relative location?', a: 'It lies east of the Andes and drains to the Atlantic Ocean', why: 'Relative location describes a place in relation to other places.', w: [['It is at about 3°S, 60°W', 'That is absolute location (Manaus).'], ['It covers 5.5 million km²', 'That is scale.'], ['It has 16,000 tree species', 'A characteristic.']] },
        { q: 'About how much of the Amazon rainforest is in Brazil?', a: 'About 60%', why: 'The rest is shared by eight other countries.', w: [['About 10%', 'Far too low.'], ['All of it', 'Nine countries share it.'], ['About 30%', 'Too low.']] },
        { q: 'About how big is the Amazon rainforest?', a: 'About 5.5 million km², roughly 20 times New Zealand', why: 'New Zealand is about 268,000 km².', w: [['About 55,000 km²', 'Far too small.'], ['About 550 km²', 'Far too small.'], ['About 55 million km²', 'Bigger than Asia: too big.']] },
      ]),
      P.terms(CONCEPTS),
      P.bank([
        { q: 'Which of these is a natural process, not an element?', a: 'Leaching', why: 'Leaching is a process: rainwater washes nutrients down and out of the soil.', w: [['Soil', 'An element.'], ['Vegetation', 'An element.'], ['Climate', 'An element.']] },
        { q: 'Which of these is a characteristic of the Amazon, as the exam uses the word?', a: 'Infertile soils', why: 'A characteristic is what the environment is like. The 2023 and 2025 papers asked you to name one and explain how it formed.', w: [['Convection', 'A process.'], ['Brazil', 'A country, not a characteristic.'], ['Deforestation', 'A cultural process.']] },
        { q: 'Which of these is a cultural process?', a: 'Deforestation for cattle pasture', why: 'Cultural processes are caused by people.', w: [['Evapotranspiration', 'Natural.'], ['Deposition of silt in floods', 'Natural.'], ['Convectional rainfall', 'Natural.']] },
      ]),
      P.bank([
        { q: 'Why is the Amazon’s location on the equator an advantage for plant growth?', a: 'The sun is high in the sky all year, so it is hot and wet all year and plants can grow continuously', why: 'Location affects climate, and climate drives growth. This links location to a characteristic, as Merit needs.', w: [['It is far from the sea', 'Most of it is not, and that is not the reason.'], ['It has a cold season that rests the soil', 'There is no cold season.'], ['It is high above sea level', 'Most of the basin is low and flat.']] },
        { q: 'How does the Amazon’s relative location next to the Andes shape the environment?', a: 'Rivers from the Andes carry sediment that is deposited on the floodplains, making them fertile', why: 'The Andes are the source of the Amazon and its white-water tributaries.', w: [['The Andes block all rain', 'Rain still falls; the Andes force moist air up.'], ['The Andes make the basin cold', 'The basin is hot.'], ['It has no effect', 'It supplies water and sediment.']] },
      ], { grade: 'M' }),
    ],
    tips: [
      STD,
      'Use <span class="pen">both kinds of location</span>: absolute (latitude) and relative (east of the Andes, draining to the Atlantic).',
      'Use the exam’s words: elements (climate, vegetation, soils, landforms), processes, characteristic.',
      'The 2024 report: Not Achieved answers used pre-prepared essays that did not answer the question. Learn the facts, then shape them to the question asked.',
      'Draw an annotated sketch map. Excellence answers in 2024 had “detailed, annotated diagrams”.',
    ],
    aim: {
      intro: '<div class="resource">Your large natural environment: the Amazon rainforest, South America.</div>',
      parts: [
        { q: 'Describe the location of the Amazon rainforest, using absolute and relative location.', write: true, words: '30–60',
          model: [S('The Amazon rainforest straddles the equator in northern South America, mostly between about 5°N and 15°S.', 'absolute', true), S('It lies east of the Andes and is drained by the Amazon River east to the Atlantic Ocean.', 'relative', true), S('It covers about 5.5 million km² across nine countries, about 60% of it in Brazil.', 'scale')],
          earns: 'Achieved: absolute and relative location, with some specific evidence.', crit: { A: 'Correct absolute location (equator / latitudes) and relative location (east of the Andes, Atlantic, South America), with some specific facts.' } },
        { q: 'Explain how the Amazon’s location affects its climate.', write: true, words: '60–90',
          model: [S('Because the Amazon is on the equator, the midday sun is almost overhead all year, so insolation is intense and constant.', 'location → sun', true), S('This keeps temperatures high all year: Manaus averages 27.4 °C, with only about 2 °C between the coolest and warmest months.', 'evidence'), S('The heat drives evaporation and convection, so moist air rises and cools, giving heavy rain: about 2,360 mm a year at Manaus.', 'location → rain', true), S('Trade winds blowing in from the Atlantic bring more moisture, so its relative location adds to the rainfall.', 'relative location')],
          earns: 'Merit: the link from location to temperature and rainfall is explained in detail, with figures.', crit: { M: 'Explains in detail how equatorial location gives constant high sun angle and insolation, hence high temperatures and convectional rain, with figures (e.g. Manaus ~27 °C, ~2,360 mm).' } },
        { q: 'Fully explain how the Amazon’s location interacts with natural processes to make it the largest tropical rainforest in the world.', write: true, words: '120–170',
          model: [S('Its equatorial location gives intense sunlight and high temperatures all year, so there is no cold season to stop plant growth.', 'location → climate', true), S('The heat drives evaporation and transpiration, and convection lifts the moist air, so rain falls almost every day, about 2,360 mm a year at Manaus.', 'processes with evidence'), S('Its relative location helps too: Atlantic trade winds carry moisture far inland, and the forest recycles it, as trees transpire water that falls again as rain further west.', 'two-way interaction', true), S('The Andes to the west supply the Amazon River and its sediment, and the huge, low, flat basin gives space for forest across 5.5 million km².', 'relief and drainage'), S('So location sets the conditions, and the processes link climate, vegetation and rivers into a system that sustains itself, which is why the forest is so large and continuous.', 'insight: a self-sustaining system', true)],
          earns: 'Excellence: several elements and processes are linked to location, including the two-way link between forest and rain, with integrated evidence.',
          crit: { M: 'Explains how location produces the climate that supports the forest, with evidence.', E: 'Fully explains the interaction between location (equatorial, east of the Andes, Atlantic trade winds) and processes (insolation, convection, evapotranspiration, moisture recycling, river supply) as a system, including a two-way link, with integrated specific evidence and geographic concepts.' } },
      ],
      up: [
        up(1, ['The Amazon is hot and wet because it is on the equator.'], [
          ['Explain the links: the sun is high all year, so insolation is intense; that heats the ground, drives convection and rain; add figures for Manaus', 1, 'Right. Merit explains how, step by step, with detailed evidence.'],
          ['Add that the Amazon is in Brazil', 0, 'Location detail, but not explanation.'],
          ['Say that it is very hot', 0, 'Still description.'],
          ['Define climate', 0, 'Not asked.']]),
        up(2, ['The Amazon is big because it is on the equator and gets lots of rain.'], [
          ['Link location to several processes (insolation, convection, trade winds, moisture recycling, rivers from the Andes) and show the two-way link between forest and rain, with figures', 1, 'Right. Excellence explains the whole system, with insight and evidence throughout.'],
          ['List the nine countries', 0, 'Evidence of size, not explanation.'],
          ['Say it is the largest rainforest', 0, 'Restates the question.'],
          ['Describe the animals', 0, 'Off the question.']]),
      ],
    },
  });

  /* ======================= 2. Climate ======================= */
  const M = G.MANAUS, MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const climateQ = () => {
    const k = R.int(0, 11), type = R.pick(['range', 'month', 'diff', 'wettest', 'driest']);
    const fig = G.climate(), more = (s) => ({ idea: 'On a climate graph, bars show rainfall (left axis, mm) and the line shows temperature (right axis, °C). Read values carefully against the right axis.', steps: s.map((x) => St(x)) });
    if (type === 'range') return { kind: 'num', answer: 2.0, dp: 1, tol: 0.25, prompt: 'Use the climate graph for Manaus. Calculate the annual temperature range (warmest month minus coolest month).', fig, fmt: 'Give °C to 1 decimal place.', why: 'Warmest September 28.6 °C, coolest January–March 26.6 °C: a range of only about 2 °C, typical of an equatorial climate.', more: more(['Warmest month: September, about 28.6 °C.', 'Coolest months: January to March, about 26.6 °C.', '28.6 − 26.6 = 2.0 °C. A tiny range: there is no winter.']), sol: ['28.6 − 26.6 = 2.0 °C'] };
    if (type === 'month') return { kind: 'num', answer: M.rain[k], dp: 0, tol: 15, prompt: `Use the climate graph for Manaus. About how much rain falls in ${MON[k]}?`, fig, fmt: 'Give millimetres. Read from the left axis.', why: `${MON[k]}: about ${M.rain[k]} mm.`, more: more([`Find the ${MON[k]} bar.`, `Read across to the left (rainfall) axis: about ${M.rain[k]} mm.`]), sol: [`about ${M.rain[k]} mm`] };
    if (type === 'diff') return { kind: 'num', answer: 331 - 56, dp: 0, tol: 20, prompt: 'Use the climate graph for Manaus. How much more rain falls in the wettest month than in the driest month?', fig, fmt: 'Give millimetres.', why: 'April (about 331 mm) minus August (about 56 mm) = about 275 mm.', more: more(['Wettest: April, about 331 mm.', 'Driest: August, about 56 mm.', '331 − 56 = 275 mm. Rain falls all year, but there is a drier season from June to October.']), sol: ['331 − 56 = 275 mm'] };
    if (type === 'wettest') return P.mcq({ prompt: 'Use the climate graph for Manaus. Which month is the wettest?', fig, more: more(['The tallest bar is April, about 331 mm.', 'The wet season runs from about December to May, when the ITCZ is overhead.']) }, [{ t: 'April', ok: true, why: 'About 331 mm.' }, { t: 'August', why: 'August is the driest month.' }, { t: 'January', why: 'Wet (about 306 mm), but April is wetter.' }, { t: 'September', why: 'September is the warmest month, not the wettest.' }]);
    return P.mcq({ prompt: 'Use the climate graph for Manaus. Which statement describes the pattern correctly?', fig, more: more(['Temperature: 26.6 to 28.6 °C, so hot all year.', 'Rain: over 200 mm a month from December to May, under 120 mm from June to October.']) }, [{ t: 'Hot all year with a 2 °C range; a wet season from December to May and a drier season from June to October', ok: true, why: 'Trend with data: Achieved-level description; add figures for Merit.' }, { t: 'A hot summer and a cold winter, with rain all year', why: 'There is no cold season: the range is about 2 °C.' }, { t: 'Dry all year with occasional storms', why: 'About 2,360 mm falls in a year.' }, { t: 'Wettest in August, driest in April', why: 'The other way round.' }]);
  };
  P.addUnit({
    id: 'amazon-climate', title: 'Climate: hot, wet and convectional', mins: 12,
    blurb: 'Why it rains almost every afternoon, how the forest makes its own rain, and how to read a climate graph.',
    recap: 'The Amazon has an equatorial climate: hot all year (Manaus averages 27.4 °C, with a range of only about 2 °C) and very wet (about 2,360 mm a year at Manaus), with a wetter season from about December to May and a drier season from about June to October. The sun is high all year, so the ground heats strongly. Water evaporates and plants transpire (evapotranspiration). The warm, moist air rises (convection), cools and condenses into towering cumulonimbus clouds, giving heavy afternoon rain: convectional rainfall. The Intertropical Convergence Zone (ITCZ), where trade winds meet and air rises, moves with the overhead sun and brings the wet season. Trade winds carry moisture from the Atlantic, and the forest recycles a large share of it: water transpired by trees falls again as rain further west, in “flying rivers”.',
    scenes: [
      { dur: 15, card: [C(0, '<h2>Convectional rainfall</h2>'), C(3, '<p>Sun heats the forest. Water evaporates and is transpired.</p>'), C(7, '<p>The warm, moist air rises, cools and condenses.</p>'), C(11, '<p>Huge clouds build, and it pours in the afternoon.</p>')],
        board: [F(0.5, G.convection({ sun: 'strong sun', et: 'evaporation', rising: 'air rises', condense: 'condenses', cloud: 'cloud', rain: 'rain' }))] },
      { dur: 13, card: [C(0, '<h2>Read the climate graph</h2>'), C(3, '<p>Temperature line: flat, about 27 °C. No winter.</p>'), C(7.5, '<p>Rain bars: over 200 mm a month from December to May; a drier season June to October.</p>')],
        board: [F(0.5, G.climate())] },
      { dur: 14, card: [C(0, '<h2>The forest makes its own rain</h2>'), C(3, '<p>Trade winds bring moisture from the Atlantic.</p>'), C(7, '<p>Trees transpire it back into the air; it rains again further west.</p>'), C(10.5, '<p>Clear the forest and the rain cycle weakens.</p>')],
        board: [L(0.5, 'Atlantic moisture → rain → trees transpire it back'), L(3, 'the forest recycles about a quarter to a half of its rain'), L(6, '“flying rivers” carry moisture to the Andes and southern Brazil'), L(9, 'two-way interaction: climate ⇄ vegetation', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain how convectional rainfall forms in the Amazon.',
      steps: [
        { m: 'The Amazon is on the equator, so the sun is high all year and heats the ground and the forest intensely.', note: 'insolation' },
        { m: 'Water evaporates from rivers and wet leaves, and trees transpire water from their leaves: evapotranspiration.', note: 'moisture' },
        { m: 'The warm, moist air is lighter, so it rises (convection), cooling as it rises.', note: 'rising air' },
        { m: 'At the condensation level, water vapour condenses into towering cumulonimbus clouds.', note: 'condensation' },
        { m: 'By mid-afternoon heavy rain and thunderstorms fall: about 2,360 mm a year at Manaus.', note: 'rain, with evidence' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how convectional rainfall forms.', steps: ['The sun is high overhead all year', 'The ground and forest heat up strongly', 'Evapotranspiration adds water vapour to the air', 'The warm, moist air rises and cools', 'Water vapour condenses into cumulonimbus clouds', 'Heavy afternoon rain falls'] }], 2)(); },
    grades: 'AAAMMME',
    gens: [
      climateQ,
      G.labelGen(G.convection, { sun: 'Intense insolation', et: 'Evapotranspiration', rising: 'Warm moist air rises', condense: 'Cooling and condensation', cloud: 'Cumulonimbus cloud', rain: 'Convectional rain' }, { prompt: 'Match each letter on the diagram to the stage of convectional rainfall.' }),
      climateQ,
      P.chain([
        { q: 'Put the chain in order: how convectional rainfall forms.', steps: ['The sun is high overhead all year', 'The ground and forest heat up strongly', 'Evapotranspiration adds water vapour to the air', 'The warm, moist air rises and cools', 'Water vapour condenses into cumulonimbus clouds', 'Heavy afternoon rain falls'] },
        { q: 'Put the chain in order: how the forest recycles rain.', steps: ['Trade winds carry moisture in from the Atlantic', 'Rain falls on the eastern Amazon', 'Trees take up the water through their roots', 'Leaves transpire it back into the air', 'Winds carry it further west, where it falls again as rain'] },
      ]),
      P.bank([
        { q: 'Why is the temperature range at Manaus only about 2 °C?', a: 'The sun is high in the sky all year, so insolation hardly changes between seasons', why: 'At the equator, day length and sun angle barely change through the year.', w: [['Clouds stop all sunlight', 'Clouds reduce maximums a little, but this is not the main reason.'], ['The ocean warms it in winter', 'There is no winter; Manaus is 1,500 km inland.'], ['It is at high altitude', 'Manaus is low-lying.']] },
        { q: 'What causes the wet season, from about December to May?', a: 'The ITCZ, a zone of rising air where the trade winds meet, moves over the central Amazon', why: 'The ITCZ follows the overhead sun, so the band of heaviest rain shifts during the year.', w: [['Winter storms from Antarctica', 'Not at the equator.'], ['Snow melting in the Andes', 'That affects river levels, not rain.'], ['Cyclones from the Atlantic', 'Not the cause.']] },
        { q: 'Why does convectional rain usually fall in the afternoon?', a: 'Heating builds up through the morning, so convection is strongest by mid-afternoon', why: 'It takes several hours of heating for clouds to grow tall enough to rain.', w: [['The sun is lowest in the afternoon', 'The sun is highest around midday.'], ['Trees transpire only at night', 'Most transpiration is in daylight.'], ['Winds stop in the afternoon', 'Not the cause.']] },
      ]),
      P.bank([
        { q: 'How does the vegetation affect the climate of the Amazon?', a: 'Trees transpire huge amounts of water, which falls again as rain, so the forest makes much of its own rainfall', why: 'This is a two-way interaction: climate supports the forest, and the forest supports the climate.', w: [['It does not: only climate affects vegetation', 'The link goes both ways.'], ['Trees block the wind, so it rains less', 'Not the main effect.'], ['Leaves reflect all the sunlight', 'Forests absorb most sunlight.']] },
        { q: 'Why does the drier season (June to October) still have some rain?', a: 'Convection and transpiration continue, even when the ITCZ has moved north', why: 'The forest keeps transpiring, so local convection still produces some storms.', w: [['Snowmelt falls as rain', 'No.'], ['Cyclones arrive', 'No.'], ['It has no rain at all', 'August still averages about 56 mm.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Scientists warn that large-scale deforestation could make parts of the Amazon drier. Why?', a: 'Fewer trees transpire less water, so less moisture is recycled into rain further west, so the dry season lengthens', why: 'This is the forest–rain feedback; some scientists warn that losing about 20–25% of the forest could tip parts towards a drier, savanna-like state.', w: [['Cleared land reflects more rain', 'Rain is not reflected.'], ['Cattle drink the rain', 'Not the mechanism.'], ['Deforestation moves the equator', 'It cannot.']] },
        { q: 'Which statement shows insight into the Amazon’s climate?', a: 'The rainfall depends partly on the forest itself, so the climate and the vegetation sustain each other', why: 'Excellence answers explain two-way interactions.', w: [['It is hot and wet', 'Description only.'], ['It rains about 2,360 mm a year', 'Evidence, but no explanation.'], ['The wettest month is April', 'A fact, not insight.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      STD,
      'Name the processes: <span class="pen">insolation, evapotranspiration, convection, condensation</span>. Merit needs the links in order.',
      'Use climate data: Manaus 27.4 °C average, range about 2 °C, about 2,360 mm a year, wettest April, driest August.',
      'Excellence: show the two-way link. The forest makes much of its own rain, so climate and vegetation sustain each other.',
      'Draw and annotate a convection diagram. Diagrams were rewarded in the 2024 report.',
    ],
    aim: {
      intro: '<div class="resource">Characteristic: high rainfall in the Amazon rainforest. Manaus (3°S) averages about 2,360 mm of rain a year and 27.4 °C, with a range of about 2 °C.</div>',
      parts: [
        { q: 'Explain why the Amazon rainforest is hot all year.', write: true, words: '30–60',
          model: [S('The Amazon is on the equator, so the sun is high in the sky all year.', 'location', true), S('Insolation is intense and hardly changes between seasons, so temperatures stay high: Manaus averages 27.4 °C with a range of only about 2 °C.', 'explanation with evidence', true)],
          earns: 'Achieved: the cause is explained (not just described), with some evidence.', crit: { A: 'Explains equatorial location → high sun angle all year → constant high temperature, with some evidence.' } },
        { q: 'Explain in detail how convectional rainfall forms in the Amazon.', write: true, words: '70–110',
          model: [S('The high sun heats the ground and forest strongly each morning.', 'heating', true), S('Water evaporates and trees transpire, so the air near the ground becomes warm and moist.', 'evapotranspiration', true), S('Warm, moist air is less dense, so it rises by convection and cools as it rises.', 'convection'), S('At the condensation level the water vapour condenses into tall cumulonimbus clouds.', 'condensation', true), S('By mid-afternoon heavy rain and thunderstorms fall, giving Manaus about 2,360 mm a year.', 'result with evidence')],
          earns: 'Merit: every stage is linked in order, with geographic terms and evidence.', crit: { M: 'Explains in detail heating → evapotranspiration → rising air (convection) → cooling → condensation → cumulonimbus → rain, with evidence.' } },
        { q: 'Fully explain how the climate and the vegetation of the Amazon interact to create its high rainfall.', write: true, words: '120–170',
          model: [S('The equatorial climate supports dense forest: constant heat and water let trees grow all year.', 'climate → vegetation', true), S('The forest returns the favour: its 390 billion or so trees transpire huge volumes of water, adding moisture to the air.', 'vegetation → climate', true), S('This moisture feeds convection, so it rains again; moisture from the Atlantic is recycled several times as it moves west, in “flying rivers”.', 'recycling'), S('So the forest generates a large share of its own rainfall, roughly a quarter to a half.', 'evidence'), S('This two-way interaction means that clearing forest reduces transpiration and rainfall, which could make the dry season longer and stress the remaining forest: change in one element changes the whole system.', 'insight: feedback and change', true)],
          earns: 'Excellence: a two-way interaction between climate and vegetation is fully explained, with evidence and insight into what happens if one element changes.',
          crit: { M: 'Explains how the climate supports the forest and how transpiration adds to rainfall.', E: 'Fully explains the two-way interaction (climate supports forest; forest transpiration recycles moisture into rain), with evidence (Manaus data, recycling share, flying rivers) and insight such as the effect of deforestation on rainfall.' } },
      ],
      up: [
        up(1, ['It rains a lot because it is hot and the hot air rises and makes rain.'], [
          ['Add every link: heating, evapotranspiration, rising and cooling air, condensation level, cumulonimbus, afternoon rain; with the Manaus rainfall figure', 1, 'Right. Merit links each stage with the right terms and evidence.'],
          ['Say that it rains every day', 0, 'Description, not explanation.'],
          ['Add that the Amazon is big', 0, 'Off the point.'],
          ['Draw the sun', 0, 'A diagram helps, but the links must be explained.']]),
        up(2, ['The climate is hot and wet so lots of trees grow. The trees also need the rain.'], [
          ['Show the link back: trees transpire water that falls again as rain (recycled moisture, flying rivers), so the forest makes some of its own rain; add evidence and what deforestation would do', 1, 'Right. Excellence explains the two-way interaction with insight.'],
          ['Add more about the animals', 0, 'Off the question.'],
          ['Repeat that it is hot and wet', 0, 'Description again.'],
          ['Name the nine countries', 0, 'Location detail, not interaction.']]),
      ],
    },
  });

  /* ======================= 3. Vegetation ======================= */
  P.addUnit({
    id: 'amazon-vegetation', title: 'Vegetation: layers and adaptations', mins: 11,
    blurb: 'Five layers, a race for light, and the adaptations that come from heavy rain and poor soil.',
    recap: 'The Amazon has the greatest variety of plants on Earth: about 390 billion trees of about 16,000 species. Because it is hot and wet all year, plants grow all year, so they compete above all for light. The result is layers: emergent trees (up to 50–60 m), a dense canopy (about 30–45 m) that absorbs most of the light, an understorey of young trees, a shrub layer and a dark forest floor that receives only about 2% of the sunlight. Plants are adapted to the climate and soils: buttress roots support tall trees with shallow roots in thin soil, drip tips shed heavy rain, lianas climb to the light, epiphytes grow on branches to reach it, and trees are evergreen because there is no cold or dry season to drop leaves in.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>A race for light</h2>'), C(3, '<p>Water and warmth are never short. Light is.</p>'), C(7, '<p>So the forest grows in layers. Only about 2% of sunlight reaches the floor.</p>')],
        board: [F(0.5, G.layers({ emergent: 'Emergent', canopy: 'Canopy', understorey: 'Understorey', shrub: 'Shrub layer', floor: 'Forest floor' }))] },
      { dur: 14, card: [C(0, '<h2>Adaptations</h2>'), C(3, '<p>Each one is a response to an element: rain, light or soil.</p>')],
        board: [L(0.5, '<b>buttress roots</b>: support tall trees whose roots are shallow (thin soil)'), L(3, '<b>drip tips</b>: shed heavy rain so fungi do not grow'), L(5.5, '<b>lianas, epiphytes</b>: climb or perch to reach light'), L(8, '<b>evergreen</b>: no cold or dry season, so leaves are kept', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain how the climate of the Amazon leads to the layered structure of the vegetation.',
      steps: [
        { m: 'The equatorial climate is hot (about 27 °C) and wet (about 2,360 mm a year) all year, so there is no season when plants stop growing.', note: 'climate' },
        { m: 'With water and warmth never short, the limiting factor is light, so plants compete to grow upwards.', note: 'competition for light' },
        { m: 'The canopy at 30–45 m forms a continuous layer that absorbs most of the sunlight; emergents up to 50–60 m break through it.', note: 'upper layers' },
        { m: 'Below, only shade-tolerant plants survive: the understorey and shrub layer have large leaves to catch dim light, and only about 2% of sunlight reaches the floor.', note: 'lower layers, with evidence' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: why the rainforest grows in layers.', steps: ['The climate is hot and wet all year', 'Plants can grow continuously, so water and warmth are not limiting', 'Light becomes the limiting factor', 'Trees compete to grow tall and form a dense canopy', 'The canopy absorbs most light, so only shade-tolerant plants grow below'] }], 2)(); },
    grades: 'AAAMME',
    gens: [
      G.labelGen(G.layers, { emergent: 'Emergent layer', canopy: 'Canopy', understorey: 'Understorey', shrub: 'Shrub layer', floor: 'Forest floor', buttress: 'Buttress roots' }, { prompt: 'Match each letter on the cross-section of the rainforest to its name.' }),
      P.bank([
        { q: 'What is the purpose of drip tips on rainforest leaves?', a: 'To shed heavy rain quickly so fungi and algae do not grow on the leaf', why: 'An adaptation to very high rainfall.', w: [['To store water for the dry season', 'They shed water, not store it.'], ['To catch insects', 'No.'], ['To protect against frost', 'There is no frost.']] },
        { q: 'Why do many tall rainforest trees have buttress roots?', a: 'Their roots are shallow because nutrients are near the surface, so buttresses help support them', why: 'An adaptation to thin, infertile soils.', w: [['To reach water deep underground', 'Buttresses are above ground and water is plentiful.'], ['To climb other trees', 'That is lianas.'], ['To protect from fire', 'Not their purpose.']] },
        { q: 'What are epiphytes?', a: 'Plants such as bromeliads and orchids that grow on branches to reach the light', why: 'They take water and nutrients from rain and debris, not from the tree.', w: [['Woody vines that climb from the ground', 'Those are lianas.'], ['The tallest trees', 'Those are emergents.'], ['Fungi that decompose leaves', 'Decomposers.']] },
        { q: 'Why are rainforest trees evergreen?', a: 'There is no cold or dry season, so there is no reason to drop all their leaves', why: 'They can photosynthesise all year.', w: [['They grow in poor soil', 'Not the reason.'], ['To shed heavy rain', 'That is drip tips.'], ['Because the canopy shades them', 'Not the reason.']] },
      ]),
      P.bank([
        { q: 'About how much sunlight reaches the forest floor?', a: 'About 2%', why: 'The dense canopy absorbs nearly all of it.', w: [['About 50%', 'Far too much.'], ['About 25%', 'Too much.'], ['None at all', 'A little reaches it.']] },
        { q: 'About how many tree species grow in the Amazon?', a: 'About 16,000', why: 'Out of about 390 billion trees.', w: [['About 160', 'Far too few.'], ['About 1,600', 'Too few.'], ['About 16 million', 'Too many.']] },
        { q: 'Which layer forms a continuous roof at about 30–45 m?', a: 'The canopy', why: 'Emergents rise above it.', w: [['The emergent layer', 'Scattered tall trees above the canopy.'], ['The understorey', 'Lower, in shade.'], ['The shrub layer', 'Near the ground.']] },
      ]),
      P.chain([
        { q: 'Put the chain in order: why the forest floor has few plants.', steps: ['The canopy forms a dense, continuous layer', 'It absorbs most of the incoming sunlight', 'Only about 2% of the light reaches the floor', 'Few plants can photosynthesise enough to grow', 'So the floor is dark and fairly open'] },
        { q: 'Put the chain in order: how soils lead to buttress roots.', steps: ['Heavy rain leaches nutrients from the soil', 'Nutrients are found only in a thin layer near the surface', 'Tree roots spread out shallowly to reach them', 'Shallow roots give poor support for tall trees', 'Buttress roots develop to hold the trees up'] },
      ]),
      P.bank([
        { q: 'Which statement explains how the vegetation interacts with the soil?', a: 'Rapid leaf fall and decay supply nutrients, which shallow roots take up quickly before they are leached', why: 'The vegetation both depends on and feeds the thin nutrient layer.', w: [['Trees grow tall because the soil is very fertile', 'The soil is infertile.'], ['The vegetation has no effect on the soil', 'It supplies the nutrients.'], ['Roots go deep to find nutrients', 'Most roots are shallow.']] },
        { q: 'Why does the Amazon have such high biodiversity?', a: 'Constant heat, water and light in many layers create many niches, and the forest has had a long time to evolve', why: 'Each layer offers different conditions, so many species can live together.', w: [['Because the soil is fertile', 'It is not.'], ['Because there are no predators', 'There are many.'], ['Because it is cold at night', 'It is not.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'A student writes: “The vegetation is shaped by the climate.” What would make this Excellence?', a: 'Explain the two-way links: climate drives growth and layering, while the forest shapes the climate (shade, humidity, transpiration and rain) and the soil (leaf litter)', why: 'Excellence shows interactions between several elements, with evidence and insight.', w: [['Add a list of animals', 'Off the question.'], ['Say the climate is hot', 'Description.'], ['Add the height of the canopy', 'Evidence, but not insight.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      STD,
      'Link each adaptation to the element that caused it: <span class="pen">drip tips → rain; buttresses → thin soil; lianas → light</span>.',
      'Use numbers: about 16,000 tree species; canopy 30–45 m; emergents up to 50–60 m; about 2% of light reaches the floor.',
      'Draw and annotate a cross-section of the layers.',
      'Excellence: link vegetation back to climate (transpiration) and to soils (litter), not just one way.',
    ],
    aim: {
      intro: '<div class="resource">Characteristic: the dense, layered vegetation of the Amazon rainforest.</div>',
      parts: [
        { q: 'Describe the layers of vegetation in the Amazon rainforest.', write: true, words: '40–70',
          model: [S('Emergent trees rise up to 50–60 m above a dense canopy at about 30–45 m.', 'upper layers', true), S('Below are the understorey of young trees and the shrub layer, in deep shade.', 'lower layers', true), S('The forest floor is dark: only about 2% of sunlight reaches it.', 'floor with evidence')],
          earns: 'Achieved: the layers are named and described with some evidence.', crit: { A: 'Names and describes layers (emergent, canopy, understorey, shrub, floor) with some evidence (heights, light).' } },
        { q: 'Explain how two adaptations of rainforest plants result from the climate or soils.', write: true, words: '70–110',
          model: [S('Drip tips: rain is very heavy, about 2,360 mm a year at Manaus.', 'adaptation 1: cause', true), S('Pointed leaf tips let water run off quickly, so the leaf dries and fungi and algae do not grow on it.', 'adaptation 1: how'), S('Buttress roots: heavy rain leaches nutrients, so they are only in a thin layer near the surface.', 'adaptation 2: cause', true), S('Roots stay shallow to reach them, and buttresses up to several metres high support trees 50 m tall.', 'adaptation 2: how')],
          earns: 'Merit: each adaptation is linked in detail to the element that caused it.', crit: { M: 'Explains in detail two adaptations (e.g. drip tips, buttress roots, lianas, epiphytes) and the climate or soil process behind each, with evidence.' } },
        { q: 'Fully explain how the climate, soils and vegetation interact to create the dense, layered vegetation of the Amazon.', write: true, words: '130–180',
          model: [S('The hot, wet climate (about 27 °C, 2,360 mm) means plants can grow all year, so light, not water or warmth, limits growth.', 'climate → vegetation', true), S('Trees compete upwards: a canopy at 30–45 m absorbs most light, emergents break through, and only about 2% of light reaches the floor, so distinct layers form.', 'layering with evidence'), S('The soils are leached and infertile, but the forest supplies its own nutrients: leaves fall and decompose within weeks, and shallow roots take them up quickly.', 'soil ⇄ vegetation', true), S('The vegetation in turn shapes the climate: transpiration adds moisture that falls as rain, and the canopy keeps the air below humid.', 'vegetation → climate'), S('So the dense layers are the result of a closed, self-reinforcing system. If the forest is cleared, nutrients and rain are both lost, so it may not grow back.', 'insight', true)],
          earns: 'Excellence: three elements are linked with two-way interactions, with integrated evidence and insight into how the system sustains itself.',
          crit: { M: 'Explains how climate and light competition create layers, with evidence.', E: 'Fully explains the interactions between climate, soils (leaching, nutrient cycle) and vegetation (layers, transpiration), including two-way links, with integrated evidence and insight (self-sustaining system, vulnerability to clearing).' } },
      ],
      up: [
        up(1, ['Trees have drip tips because it rains a lot, and buttress roots to hold them up.'], [
          ['Explain each fully: why heavy rain is a problem and how drip tips solve it; why roots are shallow (leached soil, nutrients near the surface) and how buttresses help; with figures', 1, 'Right. Merit gives detailed cause-and-effect for each.'],
          ['Add a third adaptation without explaining it', 0, 'More description does not reach Merit.'],
          ['Draw a leaf', 0, 'A diagram helps, but the explanation is missing.'],
          ['Say the Amazon is very big', 0, 'Off the point.']]),
        up(2, ['It is hot and wet so trees grow in layers, and the soil is poor.'], [
          ['Link the three elements: climate → growth all year → competition for light → layers; soil is leached but fed by litter and shallow roots; transpiration feeds rain; and say what this means if the forest is cleared', 1, 'Right. Excellence explains the system, with evidence and insight.'],
          ['List all five layers', 0, 'Description.'],
          ['Say that it is the largest rainforest', 0, 'Not interaction.'],
          ['Add the number of countries', 0, 'Off the point.']]),
      ],
    },
  });

  /* ======================= 4. Soils and the nutrient cycle ======================= */
  P.addUnit({
    id: 'amazon-soils', title: 'Soils and the nutrient cycle', mins: 12,
    blurb: 'The world’s richest forest grows on poor soil. Leaching, fast decay and the nutrient cycle explain why.',
    recap: 'Most Amazon soils are latosols (oxisols): deep, red or yellow and infertile. Constant heat and rain cause rapid chemical weathering, so soils are deep, and heavy rain leaches soluble nutrients down and out of reach, leaving iron and aluminium oxides that colour the soil red. Fallen leaves decompose within weeks in the hot, humid conditions, and shallow roots and fungi take up the nutrients almost at once. So most nutrients are stored in the living biomass, not the soil or litter. When the forest is cleared, the store is removed (often burned), the remaining nutrients are leached or washed away, and the land becomes infertile within a few years. Amazonian dark earths (terra preta), made by Indigenous people with charcoal and waste, show that soils can be improved.',
    scenes: [
      { dur: 15, card: [C(0, '<h2>The nutrient cycle</h2>'), C(3, '<p>Three stores: biomass, litter, soil. Circle size shows how much is stored.</p>'), C(8, '<p>Biomass is huge. Litter and soil are small: nutrients move through them fast.</p>')],
        board: [F(0.5, G.nutrient({ fall: 'leaf fall', decomp: 'decay', uptake: 'uptake', rain: 'rain', leaching: 'leaching' }))] },
      { dur: 13, card: [C(0, '<h2>Leaching</h2>'), C(3, '<p>About 2,360 mm of rain a year moves down through the soil.</p>'), C(7, '<p>It dissolves nutrients and carries them below the roots. Iron and aluminium oxides stay: red soil.</p>')],
        board: [L(0.5, 'heavy rain → water moves down through the soil'), L(3, 'soluble nutrients dissolved and carried away: <b>leaching</b>'), L(5.5, 'iron and aluminium oxides left: red, infertile <b>latosol</b>'), L(8, 'nutrients survive only because the forest recycles them fast', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Clear the forest…</h2>'), C(3, '<p>The biomass store is cut and burned. Litter stops.</p>'), C(7.5, '<p>Rain leaches and washes away what is left. Crops fail within a few years.</p>')],
        board: [F(0.5, G.nutrient({ leaching: 'more leaching', runoff: 'more runoff' }, { cleared: true }))] },
    ],
    example: {
      problem: 'Explain why the soils of the Amazon are infertile, even though the forest is so lush.',
      steps: [
        { m: 'Heavy rain (about 2,360 mm a year at Manaus) soaks down through the soil, dissolving soluble nutrients and carrying them below the roots: leaching.', note: 'leaching' },
        { m: 'This leaves iron and aluminium oxides, giving deep, red, infertile latosols.', note: 'the soil left' },
        { m: 'In the heat and humidity, fallen leaves decompose within weeks, so little litter builds up.', note: 'fast decay' },
        { m: 'Shallow roots and fungi take up the released nutrients almost at once, so most nutrients are stored in the living biomass, not the soil.', note: 'the nutrient cycle' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how leaching makes the soil infertile.', steps: ['Rain falls heavily almost every day', 'Water moves down through the soil', 'It dissolves soluble nutrients', 'The nutrients are carried below the reach of roots', 'Iron and aluminium oxides are left behind: red, infertile soil'] }], 2)(); },
    grades: 'AAMMME',
    gens: [
      G.labelGen(G.nutrient, { fall: 'Leaf fall', decomp: 'Decomposition', uptake: 'Uptake by roots', rain: 'Nutrients dissolved in rain', weathering: 'Weathering of rock', leaching: 'Leaching', runoff: 'Runoff' }, { prompt: 'Match each lettered flow on the nutrient cycle to its name.', idea: 'Circles are stores (biomass, litter, soil). Arrows are flows between them. Thicker arrows show bigger flows.' }),
      P.terms([['leaching', 'Rainwater washing soluble nutrients down through the soil, out of reach of plant roots.'], ['latosol (oxisol)', 'The deep, red, infertile soil of the tropical rainforest, rich in iron and aluminium oxides.'], ['biomass', 'The total mass of living things, which in the rainforest holds most of the nutrients.'], ['decomposition', 'The breakdown of dead matter by fungi and bacteria, releasing nutrients.'], ['nutrient cycle', 'The movement of nutrients between the stores of biomass, litter and soil.'], ['weathering', 'The breakdown of rock in place, which in hot, wet conditions is rapid and chemical.']]),
      P.chain([
        { q: 'Put the chain in order: the rainforest nutrient cycle.', steps: ['Leaves and branches fall to the forest floor', 'Fungi and bacteria decompose them within weeks', 'Nutrients are released into the thin top layer of soil', 'Shallow roots and fungi take them up quickly', 'The nutrients are stored again in the trees'] },
        { q: 'Put the chain in order: what happens after the forest is cleared for crops.', steps: ['Trees are cut and burned, removing the main nutrient store', 'Ash gives a short burst of fertility', 'With no canopy, heavy rain hits bare soil', 'Nutrients are leached and topsoil is washed away', 'Within a few years the soil is too poor for crops'] },
      ]),
      P.bank([
        { q: 'Why are most nutrients stored in the biomass rather than the soil?', a: 'Decay is fast and roots take nutrients up at once, before rain can leach them', why: 'The nutrient cycle is fast and tight: little stays in the litter or soil.', w: [['The soil has no nutrients at all', 'It has a few, in a thin top layer.'], ['Leaves never fall', 'Leaves fall all year.'], ['Animals eat all the nutrients', 'Not the main reason.']] },
        { q: 'Why is the litter store small even though leaves fall all year?', a: 'Heat and humidity let decomposers break leaves down within weeks', why: 'Fast decomposition means little litter builds up.', w: [['Leaves are washed into rivers', 'Some are, but decay is the main reason.'], ['Few leaves fall', 'Many fall, all year.'], ['It is too cold for decay', 'It is hot.']] },
        { q: 'Why are Amazon soils red?', a: 'Leaching removes soluble nutrients but leaves iron and aluminium oxides', why: 'Iron oxides are rust-coloured.', w: [['They contain a lot of humus', 'Humus makes soil dark, and there is little of it.'], ['Red clay is carried from the Andes', 'Not the main reason.'], ['Fires turn them red', 'No.']] },
      ]),
      P.bank([
        { q: 'Why does cleared rainforest land often become useless for farming within a few years?', a: 'Clearing removes the biomass store; with no litter or roots, heavy rain leaches and erodes what is left', why: 'The fertility was in the forest, not the soil.', w: [['Cattle eat the soil', 'No.'], ['The climate becomes cold', 'No.'], ['The ash makes the soil acidic forever', 'Ash briefly adds nutrients.']] },
        { q: 'What does terra preta (Amazonian dark earth) show?', a: 'People can improve rainforest soils: Indigenous communities added charcoal and waste, creating fertile soils that still exist', why: 'It is evidence that soil is not fixed: cultural processes changed it.', w: [['All Amazon soils are naturally fertile', 'Most are not.'], ['Soils cannot be changed', 'They were changed.'], ['It is a type of rock', 'It is a soil.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Which statement shows insight about the nutrient cycle?', a: 'The forest is fertile because of the cycle, not the soil, so clearing it breaks the system that made the land productive', why: 'This links the elements and predicts the effect of change.', w: [['The soil is red', 'Description.'], ['Leaves fall and rot', 'Partial.'], ['The rainforest has many trees', 'Off the point.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      STD,
      'Name the processes: <span class="pen">chemical weathering, leaching, decomposition, nutrient uptake</span>.',
      'Draw the nutrient cycle with circles sized by store: big biomass, small litter and soil. Annotate the flows.',
      'Merit: explain why the soil is poor even though the forest is lush.',
      'Excellence: explain what happens to the system when the forest is cleared, with evidence.',
    ],
    aim: {
      intro: '<div class="resource">Characteristic: the infertile soils (latosols) of the Amazon rainforest.</div>',
      parts: [
        { q: 'Explain how leaching affects Amazon soils.', write: true, words: '40–70',
          model: [S('Heavy rain, about 2,360 mm a year at Manaus, soaks down through the soil.', 'cause', true), S('It dissolves soluble nutrients and carries them below the roots, so the soil is infertile.', 'leaching', true), S('Iron and aluminium oxides are left behind, so the soil is red.', 'result')],
          earns: 'Achieved: leaching is explained, with evidence.', crit: { A: 'Explains heavy rain → nutrients dissolved and washed down out of reach → infertile red soil, with some evidence.' } },
        { q: 'Explain in detail how the nutrient cycle keeps the forest growing on infertile soils.', write: true, words: '80–120',
          model: [S('Leaves, branches and dead animals fall to the floor all year.', 'leaf fall', true), S('Because it is hot and humid, fungi and bacteria decompose them within weeks, releasing nutrients into a thin top layer of soil.', 'decomposition', true), S('Shallow roots, helped by fungi, take up these nutrients almost at once, before rain can leach them.', 'uptake', true), S('So most nutrients are stored in the living biomass, and the litter and soil stores stay small: a fast, tight cycle.', 'stores')],
          earns: 'Merit: each part of the cycle is explained in detail, with terms.', crit: { M: 'Explains in detail leaf fall → rapid decomposition → quick uptake by shallow roots/fungi → storage in biomass, with the reason the soil stays poor.' } },
        { q: 'Fully explain how climate, soils and vegetation interact to create infertile soils, and what happens when the forest is cleared.', write: true, words: '130–180',
          model: [S('Constant heat and rain cause deep chemical weathering and heavy leaching, so the soil itself holds few nutrients.', 'climate → soil', true), S('The vegetation compensates: fast decay and shallow roots recycle nutrients, so most are held in the biomass, not the soil.', 'vegetation ⇄ soil', true), S('The canopy also shields the soil from the full force of the rain, reducing erosion.', 'protection'), S('When forest is cleared, the biomass store is cut and burned. Ash gives one or two good harvests, then heavy rain on bare ground leaches and erodes what is left.', 'change'), S('So farms and pasture decline within a few years, which pushes farmers to clear more forest. The soil’s fertility depended on the system, not the soil.', 'insight', true)],
          earns: 'Excellence: the elements are linked as a system, and the effect of clearing is explained with insight.',
          crit: { M: 'Explains leaching and the nutrient cycle.', E: 'Fully explains how climate (weathering, leaching), vegetation (litter, roots, canopy) and soils interact, and the consequences of clearing (loss of store, leaching, erosion, decline, more clearing), with insight and evidence.' } },
      ],
      up: [
        up(1, ['Leaves fall and rot and the trees use the nutrients again.'], [
          ['Explain each link: why decay is fast (heat, humidity, decomposers), why uptake is fast (shallow roots, fungi), and why nutrients end up in the biomass not the soil', 1, 'Right. Merit explains the cycle in detail.'],
          ['Add that the soil is red', 0, 'Description.'],
          ['Name one tree species', 0, 'Not the missing explanation.'],
          ['Repeat it more simply', 0, 'Still too brief.']]),
        up(2, ['The soil is poor because of leaching. If you cut the trees the soil gets worse.'], [
          ['Link climate, soil and vegetation as a system (weathering, leaching, fast cycle, canopy protection), then explain step by step why cleared land fails and what that leads to', 1, 'Right. Excellence shows the interaction and the consequences with insight.'],
          ['Add a definition of leaching', 0, 'Not enough on its own.'],
          ['Say farmers should not clear the forest', 0, 'An opinion, not explanation.'],
          ['Name the soil type', 0, 'Helpful, but not the missing depth.']]),
      ],
    },
  });

  /* ======================= 5. Rivers and landforms ======================= */
  P.addUnit({
    id: 'amazon-river', title: 'Rivers, floods and landforms', mins: 12,
    blurb: 'The biggest river on Earth, a 10 m flood every year, and the landforms it builds.',
    recap: 'The Amazon River rises in the Andes and flows about 6,400 km east to the Atlantic. It carries about a fifth of all the river water that reaches the world’s oceans. Its basin is low and very flat, so the river meanders slowly across a wide floodplain. Each year the river rises and falls by about 10 m at Manaus: the flood pulse, peaking around June. White-water rivers from the Andes, such as the Solimões, carry sediment that is deposited on the floodplain (várzea), renewing its fertility; black-water rivers such as the Rio Negro carry little sediment and flood igapó forest. Lateral erosion and deposition form meanders, oxbow lakes and levees. The flood pulse links the river to the forest: fish feed in the flooded forest and spread seeds. Droughts can lower the river sharply: the Rio Negro at Manaus fell to a record low of about 12.1 m in October 2024.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>The flood pulse</h2>'), C(3, '<p>The river at Manaus rises about 10 m from November to June.</p>'), C(8, '<p>Water spreads into the forest for months. In 2024, drought set a record low.</p>')],
        board: [F(0.5, G.flood())] },
      { dur: 14, card: [C(0, '<h2>White water and black water</h2>'), C(3, '<p>White water from the Andes: full of sediment. It floods várzea, which is fertile.</p>'), C(8, '<p>Black water (Rio Negro): little sediment, acidic, dark with tannins. It floods igapó.</p>')],
        board: [L(0.5, 'Andes: erosion → sediment carried downstream'), L(3, 'floods spread out → water slows → <b>deposition</b>'), L(5.5, '<b>várzea</b>: fertile, silty floodplain forest'), L(8, 'at Manaus the dark Rio Negro meets the pale Solimões: the Meeting of the Waters', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Meanders and oxbow lakes</h2>'), C(3, '<p>On a flat floodplain the river swings from side to side.</p>'), C(7, '<p>Erosion on the outside bend, deposition on the inside. A neck is cut through in a flood: an oxbow lake.</p>')],
        board: [L(0.5, 'outside bend: fast water → lateral <b>erosion</b>'), L(3, 'inside bend: slow water → <b>deposition</b>'), L(5.5, 'meander neck narrows, then is cut through in a flood'), L(8, 'old bend is sealed off by deposits: <b>oxbow lake</b>', '', { hl: true })] },
    ],
    example: {
      problem: 'Explain how the annual flood pulse shapes the floodplain of the Amazon.',
      steps: [
        { m: 'Heavy wet-season rain and snowmelt in the Andes raise the river: at Manaus it rises about 10 m, peaking around June.', note: 'cause, with evidence' },
        { m: 'The water spills over its banks and spreads across the very flat floodplain for months.', note: 'flooding' },
        { m: 'As it spreads, it slows and deposits sediment, coarsest near the channel (building levees) and finest further away.', note: 'deposition' },
        { m: 'Each year’s silt renews the várzea, which is why these floodplain soils are far more fertile than the leached soils of the dry-land forest.', note: 'result' },
      ],
    },
    faded() { return P.chain([{ q: 'Finish the chain: how an oxbow lake forms.', steps: ['On the flat floodplain, the river flows in meanders', 'Fast water on the outside of each bend erodes the bank', 'Slow water on the inside of the bend deposits sediment', 'Two bends grow towards each other and the neck narrows', 'A flood cuts through the neck; the old bend is sealed off as an oxbow lake'] }], 2)(); },
    grades: 'AAAMME',
    gens: [
      () => { const t = R.pick(['rise', 'peak', 'low']); const fig = G.flood(); const more = (s) => ({ idea: 'The flood pulse: the river rises for about seven months and falls for about five.', steps: s.map((x) => St(x)) });
        if (t === 'rise') return { kind: 'num', answer: 10.3, dp: 0, tol: 1.1, prompt: 'Use the graph of the river level at Manaus. About how much does the river rise from its lowest to its highest level in a typical year?', fig, fmt: 'Give metres.', why: 'From about 18 m (November) to about 28.3 m (June): about 10 m.', more: more(['Lowest: about 18 m in November.', 'Highest: about 28.3 m in June.', '28.3 − 18 ≈ 10 m.']), sol: ['28.3 − 18 ≈ 10 m'] };
        if (t === 'peak') return P.mcq({ prompt: 'Use the graph. In which month is the river at Manaus usually highest?', fig, more: more(['The line peaks at month 6: June.']) }, [{ t: 'June', ok: true, why: 'The peak comes after months of wet-season rain.' }, { t: 'January', why: 'Still rising.' }, { t: 'October', why: 'Near the lowest.' }, { t: 'April', why: 'The wettest month for rain, but the river peaks later because water takes time to arrive from across the basin.' }]);
        return { kind: 'num', answer: 18 - 12.1, dp: 1, tol: 0.6, prompt: 'Use the graph. The record low in October 2024 was 12.1 m. How far below the typical November low (about 18 m) was it?', fig, fmt: 'Give metres to 1 decimal place.', why: 'About 18 − 12.1 = 5.9 m below normal: a severe drought.', more: more(['Typical low: about 18 m.', 'Record low: 12.1 m (October 2024).', '18 − 12.1 = 5.9 m.']), sol: ['18 − 12.1 = 5.9 m'] }; },
      P.bank([
        { q: 'What is várzea?', a: 'Floodplain forest flooded by sediment-rich white water, with fertile soils', why: 'Annual silt renews the soil.', w: [['Forest flooded by black water', 'That is igapó.'], ['Dry-land forest that never floods', 'That is terra firme.'], ['A tributary of the Amazon', 'No.']] },
        { q: 'About how much does the river at Manaus rise each year?', a: 'About 10 m', why: 'From about 18 m in November to about 28 m in June.', w: [['About 1 m', 'Far too little.'], ['About 50 m', 'Far too much.'], ['It does not change', 'It changes a lot.']] },
        { q: 'Why is the Rio Negro dark?', a: 'It carries tannins from decaying leaves and very little sediment', why: 'Black water drains sandy, leached lowlands, not the Andes.', w: [['It carries red Andean mud', 'That is white water, and it is pale.'], ['It is polluted by oil', 'Not the main reason.'], ['It is very deep', 'Depth does not make it dark.']] },
        { q: 'About what share of all river water reaching the oceans comes from the Amazon?', a: 'About a fifth', why: 'It is by far the world’s largest river by flow.', w: [['About half', 'Too much.'], ['About 1%', 'Far too little.'], ['About 90%', 'Far too much.']] },
      ]),
      G.labelGen(G.amazonMap, { andes: 'Andes (source of sediment)', basin: 'Low, flat Amazon basin', river: 'Amazon River', mouth: 'Mouth: Atlantic Ocean', negro: 'Rio Negro (black water)' }, { prompt: 'Match each letter on the sketch map to the right label.' }),
      P.chain([
        { q: 'Put the chain in order: how an oxbow lake forms.', steps: ['On the flat floodplain, the river flows in meanders', 'Fast water on the outside of each bend erodes the bank', 'Slow water on the inside of the bend deposits sediment', 'Two bends grow towards each other and the neck narrows', 'A flood cuts through the neck; the old bend is sealed off as an oxbow lake'] },
        { q: 'Put the chain in order: how a levee forms.', steps: ['The river floods and spreads over its banks', 'Water slows suddenly as it leaves the deep channel', 'The heaviest sediment is deposited first, beside the channel', 'Each flood adds another layer', 'Raised banks, called levees, build up along the river'] },
      ]),
      P.bank([
        { q: 'How does the flood pulse interact with the vegetation?', a: 'Fish swim into the flooded forest to feed on fruit and seeds, and spread the seeds when the water falls', why: 'A two-way link: the forest feeds the fish, and the fish disperse the forest.', w: [['Floods kill all the trees each year', 'Floodplain trees are adapted to months under water.'], ['Floods have no effect on plants', 'They have large effects.'], ['Trees stop the river rising', 'No.']] },
        { q: 'Why does the river at Manaus peak in June, after the wettest month of rain (April)?', a: 'Water from the huge basin and the Andes takes weeks to drain into the main river', why: 'The basin is vast and flat, so water moves slowly.', w: [['Snow melts in December', 'Not the reason for a June peak.'], ['The ocean pushes water up the river in June', 'Tides do not do this at Manaus.'], ['Evaporation stops in June', 'No.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'In 2023 and 2024, rivers fell to record lows. Which statement best explains the effect on the environment?', a: 'Less flooding meant less sediment and fewer fish reaching the forest, and dry forest burned more easily, so the river, soils, vegetation and animals all changed together', why: 'Excellence links change in one element to others.', w: [['Only boats were affected', 'People were affected, but so was the natural environment.'], ['The river will never recover', 'Flood pulses vary naturally.'], ['Lower rivers make soils more fertile', 'Less silt, not more.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      STD,
      'Use processes: <span class="pen">erosion, transportation, deposition</span>, lateral erosion on meanders.',
      'Use figures: about 6,400 km long; about a fifth of world river flow to the oceans; about a 10 m flood at Manaus; record low about 12.1 m in October 2024.',
      'Draw annotated diagrams of a meander and an oxbow lake.',
      'Excellence: link the river to the forest (fish, seeds, silt) and show how change in the flood pulse changes the system.',
    ],
    aim: {
      intro: '<div class="resource">Characteristic: the floodplain (várzea) of the Amazon River, which floods for months each year.</div>',
      parts: [
        { q: 'Describe the flood pulse of the Amazon at Manaus.', write: true, words: '30–60',
          model: [S('The river rises for about seven months, from about 18 m in November to about 28 m in June.', 'pattern with figures', true), S('So it rises about 10 m each year, flooding the várzea forest for months, then falls again.', 'size and effect', true)],
          earns: 'Achieved: the pattern is described with evidence.', crit: { A: 'Describes the annual rise and fall (~10 m, peak ~June, low ~Nov) with some evidence.' } },
        { q: 'Explain how deposition during floods makes the várzea more fertile than the rest of the rainforest.', write: true, words: '70–110',
          model: [S('White-water rivers such as the Solimões carry sediment eroded from the Andes.', 'source', true), S('In the flood, water spreads across the flat floodplain, slows down and deposits this silt.', 'deposition', true), S('Each year’s new layer adds nutrients, renewing the soil.', 'renewal'), S('The dry-land forest, by contrast, has old, leached latosols, so the várzea is far more fertile.', 'contrast')],
          earns: 'Merit: the process is explained in detail, with a comparison.', crit: { M: 'Explains erosion in Andes → sediment transported → floods slow → deposition → annual renewal of nutrients, compared with leached dry-land soils.' } },
        { q: 'Fully explain how the river, the vegetation and the soils interact on the Amazon floodplain.', write: true, words: '130–180',
          model: [S('Heavy rain in the basin and the Andes drives a flood pulse of about 10 m at Manaus.', 'climate → river', true), S('Floodwater deposits silt, renewing the várzea soils each year.', 'river → soils', true), S('Trees there are adapted to months under water, and fish swim into the flooded forest to eat fruit and seeds, which they spread as the water falls.', 'river ⇄ vegetation', true), S('The forest in turn slows the water, encouraging deposition, and its roots hold the banks, reducing erosion.', 'vegetation → river'), S('So the flood pulse is the engine of the system. In the 2023–24 droughts, the Rio Negro fell to about 12.1 m, so less silt was laid down and fish could not reach the forest, which shows how a change in one element affects the others.', 'insight with evidence', true)],
          earns: 'Excellence: two-way interactions between three elements, with integrated evidence and insight into change.',
          crit: { M: 'Explains how floods renew soils and affect vegetation.', E: 'Fully explains interactions between river (flood pulse, deposition), soils (renewal) and vegetation (adapted trees, fish and seed dispersal, slowing water), with integrated evidence and insight (e.g. drought of 2023–24).' } },
      ],
      up: [
        up(1, ['The floods bring mud that makes the soil good.'], [
          ['Explain the whole process: where the sediment comes from (Andes), how floods slow and deposit it, how it renews nutrients each year, and why the dry-land forest soils are poorer', 1, 'Right. Merit gives detailed cause and effect with a comparison.'],
          ['Say how long the river is', 0, 'Evidence, but not explanation.'],
          ['Say that floods happen every year', 0, 'Still description.'],
          ['Name the Meeting of the Waters', 0, 'Interesting, but not the process.']]),
        up(2, ['The river floods the forest and makes the soil fertile so trees grow.'], [
          ['Add the links back from the forest (slowing water, roots holding banks), the fish and seeds, the 10 m pulse, and what the 2023–24 drought did to the system', 1, 'Right. Excellence shows two-way interactions with evidence and insight.'],
          ['List the tributaries', 0, 'Not interaction.'],
          ['Repeat the definition of várzea', 0, 'Not enough.'],
          ['Say the river is very big', 0, 'Description.']]),
      ],
    },
  });

  /* ======================= 6. Interaction: the exam question ======================= */
  const CHARS = [
    { c: 'dense, layered vegetation', steps: ['Equatorial location gives intense sunlight all year', 'High temperatures and heavy rain let plants grow continuously', 'Light, not water or warmth, limits growth', 'Trees compete upwards, forming a dense canopy at 30–45 m', 'Only shade-tolerant plants grow below, so distinct layers form'] },
    { c: 'high rainfall', steps: ['The sun heats the ground and forest strongly', 'Evaporation and transpiration fill the air with water vapour', 'The warm, moist air rises by convection and cools', 'Water vapour condenses into cumulonimbus clouds', 'Heavy afternoon rain falls: about 2,360 mm a year at Manaus'] },
    { c: 'infertile soils', steps: ['Heat and rain cause deep chemical weathering', 'Heavy rain leaches soluble nutrients down out of reach', 'Iron and aluminium oxides are left: red latosols', 'Fallen leaves decompose within weeks', 'Roots take nutrients up at once, so most are held in the biomass, not the soil'] },
    { c: 'fertile floodplains (várzea)', steps: ['Rain and snowmelt in the Andes swell the rivers', 'White-water rivers carry sediment eroded from the Andes', 'The river rises about 10 m and spreads across the floodplain', 'The water slows and deposits silt', 'Each year’s silt renews the nutrients in the soil'] },
  ];
  P.addUnit({
    id: 'amazon-interaction', title: 'Interaction: the exam question', mins: 12,
    blurb: '“Name one characteristic and explain how elements or processes interact to create it.” How to answer it.',
    recap: 'The 2023 and 2025 exams asked: name ONE characteristic of your environment, then explain how elements or processes interact to create it. Choose a characteristic you can explain deeply, such as the dense, layered vegetation, the high rainfall, the infertile soils or the fertile floodplains. Name it clearly. Then explain the chain: which elements (climate, soils, vegetation, landforms) and processes (convection, evapotranspiration, leaching, decomposition, deposition) are involved, how each affects the next, and where the links go both ways. Integrate specific evidence: figures, place names, species. Excellence answers “fully explain” with insight, for example a two-way interaction or a feedback loop, and integrate evidence throughout. Interaction means elements affecting each other; it can be one-way or two-way.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Read the question</h2>'), C(3, '<p>Name ONE characteristic. Explain how elements or processes interact to create it.</p>'), C(8, '<p>Not a general essay about the Amazon: only what makes that characteristic.</p>')],
        board: [L(0.5, '1. <b>name</b> the characteristic, e.g. infertile soils'), L(2.5, '2. <b>elements</b>: which ones? climate, vegetation, soils, landforms'), L(4.5, '3. <b>processes</b>: how they link: leaching, decomposition…'), L(6.5, '4. <b>evidence</b> in every paragraph: figures, names, places', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>One-way and two-way</h2>'), C(3, '<p>One-way: climate → leaching → infertile soil.</p>'), C(7.5, '<p>Two-way: the forest feeds the soil, and the soil limits the forest. That is insight.</p>')],
        board: [L(0.5, 'climate → soil: heavy rain leaches nutrients'), L(3, 'vegetation → soil: leaf litter supplies nutrients'), L(5.5, 'soil → vegetation: poor soil → shallow roots, buttresses'), L(8, 'two-way links + evidence throughout = Excellence', '', { hl: true })] },
    ],
    example: {
      problem: 'Name ONE characteristic of your large natural environment. Explain how the elements or processes of the environment interact to create this characteristic. (Characteristic: high rainfall.)',
      steps: [
        { m: 'Characteristic: the high rainfall of the Amazon rainforest, about 2,360 mm a year at Manaus.', note: 'name it, with evidence' },
        { m: 'Climate: on the equator the sun is high all year, so the ground and forest heat strongly; water evaporates and trees transpire.', note: 'element and processes' },
        { m: 'The warm, moist air rises by convection, cools and condenses into cumulonimbus clouds, giving heavy afternoon rain.', note: 'the chain' },
        { m: 'Vegetation: about 390 billion trees transpire huge amounts of water, which falls again as rain further west, so the forest recycles a quarter to a half of its rain.', note: 'two-way interaction' },
        { m: 'So climate and vegetation sustain each other: deforestation would reduce transpiration and so the rainfall that the forest itself needs.', note: 'insight' },
      ],
    },
    faded() { const c = R.pick(CHARS); return P.chain([{ q: `Finish the explanation of how processes interact to create this characteristic: <b>${c.c}</b>.`, steps: c.steps }], 2)(); },
    grades: 'AAMMME',
    gens: [
      G.sortGen([['Climate', 0], ['Vegetation', 0], ['Soils', 0], ['Relief and drainage', 0], ['Convection', 1], ['Leaching', 1], ['Decomposition', 1], ['Deposition', 1], ['Evapotranspiration', 1], ['Infertile red soils', 2], ['High biodiversity', 2], ['Heavy afternoon rain', 2]], ['Element', 'Process', 'Characteristic'], { n: 5, prompt: 'Sort each item: is it an element, a process, or a characteristic of the Amazon?', idea: 'Elements are the parts, processes are what link and change them, and a characteristic is what the environment is like as a result.' }),
      P.bank([
        { q: 'Which is the best opening to: “Name one characteristic and explain how elements or processes interact to create it”?', a: 'Characteristic: the infertile soils of the Amazon rainforest, which are formed by the interaction of climate, vegetation and soil processes', why: 'Name the characteristic and the environment, and point to the interaction.', w: [['The Amazon is a big rainforest in South America with many animals', 'General: it does not name a characteristic.'], ['Climate', 'An element, not a characteristic.'], ['Leaching is when water washes nutrients away', 'A definition, not an answer.']] },
        { q: 'What does “interaction” mean in geography?', a: 'Elements of an environment affecting each other and being linked together, one-way or two-way', why: 'This is the definition in the exam paper.', w: [['People talking to each other', 'Not in this sense.'], ['Only how people change nature', 'Interaction includes natural elements.'], ['A single process on its own', 'Interaction needs links.']] },
      ]),
      P.chain(CHARS.map((c) => ({ q: `Put the explanation in order. Characteristic: <b>${c.c}</b>.`, steps: c.steps }))),
      P.bank([
        { q: 'Which sentence shows a two-way interaction?', a: 'The forest depends on rain, and its transpiration supplies much of that rain', why: 'Each element affects the other.', w: [['Heavy rain leaches nutrients', 'One-way.'], ['The canopy is 30–45 m high', 'Evidence, not interaction.'], ['The Amazon is on the equator', 'Location.']] },
        { q: 'A student explains how leaching makes the soil infertile, but uses no figures or names. What will limit the grade?', a: 'Lack of specific case study evidence', why: 'Merit needs “detailed evidence”; Excellence needs it integrated throughout.', w: [['It is too long', 'Length is not the issue.'], ['It uses the word “leaching”', 'Good terminology.'], ['It explains a process', 'That is what is asked.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Which pair of facts is the best evidence for the characteristic “dense, layered vegetation”?', a: 'About 16,000 tree species; only about 2% of sunlight reaches the floor', why: 'Specific, accurate figures linked to the characteristic.', w: [['It is very green; it has lots of trees', 'General, not specific.'], ['It is in Brazil; it is big', 'Location, not evidence of layering.'], ['Leaching; convection', 'Processes, not evidence.']] },
        { q: 'Which plan would lead to the best answer?', a: 'Name one characteristic; explain the climate, soil and vegetation links in order; show a two-way link; add figures in each paragraph; draw an annotated diagram', why: 'Matches the Excellence descriptors.', w: [['Write everything you know about the Amazon', 'The 2024 report criticised pre-prepared answers.'], ['Write about deforestation only', 'Cultural content only did not achieve in 2024.'], ['Define each concept', 'Definitions do not answer the question.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'What turns a Merit answer into Excellence on this question?', a: 'Fully explaining the links, including two-way interactions or feedback, with comprehensive evidence integrated throughout', why: 'From the 2025 schedule: “fully explains … integrates comprehensive evidence … showing insight”.', w: [['Writing more facts in a list', 'Facts need to be part of the explanation.'], ['Adding a conclusion', 'Not enough on its own.'], ['Covering three characteristics', 'The question asks for ONE.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      'Answer the question asked. The 2024 report: Not Achieved answers were pre-prepared or did not address the question.',
      '<span class="pen">Name ONE characteristic</span>, then explain how the elements or processes create it.',
      'Merit: “explains, in detail … with detailed evidence”. Excellence: “fully explains … integrates comprehensive evidence … showing insight”.',
      'Use a diagram: the nutrient cycle, a convection diagram or the layers. Annotate it.',
      'Plan in the planning box: characteristic, elements, processes, evidence, two-way links.',
    ],
    aim: {
      intro: '<div class="resource">Name ONE characteristic of the Amazon rainforest. Natural characteristics (elements) include landforms (relief), climate, soils and vegetation. Explain how the elements or processes of the environment interact to create this characteristic. (Like the 2025 paper.)</div>',
      parts: [
        { q: 'Name one characteristic and explain one process that helps to create it.', write: true, words: '40–70',
          model: [S('Characteristic: the infertile soils of the Amazon rainforest.', 'named', true), S('Leaching: heavy rain, about 2,360 mm a year at Manaus, washes soluble nutrients down out of reach of plant roots, leaving red, infertile latosols.', 'one process explained with evidence', true)],
          earns: 'Achieved: a characteristic named and one process explained with evidence.', crit: { A: 'Names a valid characteristic; explains one process creating it, with some case study evidence.' } },
        { q: 'Explain in detail how two or more processes interact to create your characteristic.', write: true, words: '90–130',
          model: [S('Constant heat and rain cause rapid chemical weathering, so soils are deep but old and weathered.', 'process 1', true), S('Heavy rain leaches soluble nutrients down, leaving iron and aluminium oxides that make the soil red.', 'process 2', true), S('Leaf litter decomposes within weeks in the heat and humidity, and shallow roots take the nutrients up at once.', 'process 3'), S('So nutrients are stored in the biomass, not the soil, and the soil itself remains infertile.', 'interaction')],
          earns: 'Merit: several processes are explained in detail and linked to the characteristic, with evidence.', crit: { M: 'Explains in detail how two or more processes (weathering, leaching, decomposition, uptake) interact to create the characteristic, with detailed evidence and terms.' } },
        { q: 'Fully explain how the elements interact to create your characteristic, including at least one two-way interaction.', write: true, words: '150–200',
          model: [S('Climate → soil: the equatorial climate (27.4 °C, 2,360 mm) drives deep chemical weathering and heavy leaching, so the soil holds few nutrients.', 'climate and soil', true), S('Vegetation → soil: the forest drops leaves all year; in the heat, decomposers break them down within weeks, returning nutrients to a thin top layer.', 'vegetation and soil'), S('Soil → vegetation: because nutrients are only near the surface, roots stay shallow and trees develop buttress roots; fungi help capture nutrients before they are leached.', 'two-way link', true), S('Vegetation → climate → soil: the canopy shields the soil from heavy rain and transpiration keeps the rain coming, so the system holds together.', 'feedback'), S('So the soil is infertile but the forest is lush, because the nutrients circulate in the living system. When land is cleared, the store is lost and fertility collapses within a few years, which shows how tightly the elements depend on each other.', 'insight', true)],
          earns: 'Excellence: the interactions between elements are fully explained, with two-way links, integrated evidence and insight.',
          crit: { M: 'Explains in detail how elements and processes create the characteristic.', E: 'Fully explains interactions between climate, vegetation and soils, including at least one two-way interaction, integrating comprehensive evidence throughout, with insight (e.g. why clearing destroys fertility).' } },
      ],
      up: [
        up(1, ['The soil is infertile because of leaching from the rain.'], [
          ['Add more processes and link them: weathering, leaching (with the rainfall figure), fast decomposition, rapid uptake, so nutrients sit in the biomass, not the soil', 1, 'Right. Merit explains several processes in detail.'],
          ['Add a definition of soil', 0, 'Not needed.'],
          ['Name the country', 0, 'Not explanation.'],
          ['Say it is very infertile', 0, 'Description.']]),
        up(2, ['Rain leaches the soil and the leaves rot and give nutrients, and roots take them up.'], [
          ['Organise by element pairs, show a two-way link (soil shapes roots; roots and litter shape soil), add figures in every part, and explain the insight that fertility lives in the system', 1, 'Right. Excellence: interactions fully explained, evidence integrated, insight shown.'],
          ['Add a paragraph on deforestation only', 0, 'Cultural change alone does not answer this question.'],
          ['Write the same thing again in a diagram', 0, 'A diagram should add to it.'],
          ['List the layers of the forest', 0, 'Off the characteristic.']]),
      ],
    },
  });

  /* ======================= 7. Formation and change over time ======================= */
  const CHG = [
    ['Uplift of the Andes reverses the river’s flow towards the Atlantic', 0, 'Over millions of years.'],
    ['The river rises about 10 m each wet season', 0, 'The annual flood pulse.'],
    ['A meander is cut off to form an oxbow lake', 0, 'Erosion and deposition.'],
    ['El Niño brings severe drought in 2023–24', 0, 'A natural climate cycle, made worse by warming.'],
    ['Silt is deposited on the várzea each year', 0, 'Deposition.'],
    ['Forest is cleared for cattle pasture', 1, 'Cultural: most cleared land becomes pasture.'],
    ['The Trans-Amazonian Highway opens land to settlers in the 1970s', 1, 'Roads lead to clearing along them.'],
    ['Fires are lit to clear land after logging', 1, 'Cultural, though drought makes them spread.'],
    ['Indigenous peoples create fertile terra preta soils', 1, 'People changed the soil.'],
    ['Hydroelectric dams flood river valleys', 1, 'e.g. Belo Monte on the Xingu.'],
  ];
  P.addUnit({
    id: 'amazon-change', title: 'Formation and change over time', mins: 12,
    blurb: 'How the Amazon formed, how it changes every year, and how people are changing it now.',
    recap: 'The Amazon has formed over millions of years. As the Andes rose, the river system that once drained west and north was reorganised; by about 10 million years ago the Amazon flowed east to the Atlantic, carrying Andean sediment across the basin. Change continues at different rates. Every year the flood pulse raises the river about 10 m and deposits silt; meanders migrate and leave oxbow lakes; wet and dry seasons follow the ITCZ. Droughts linked to El Niño, such as 2023–24, cut river levels to record lows and let fires spread. Cultural change is now fast: since the 1970s roads, cattle ranching, soy, logging, dams and fires have cleared about a fifth of Brazil’s Amazon forest. Deforestation in Brazil’s Amazon peaked at 27,772 km² in 2004, fell to 4,571 km² by 2012, rose to 13,038 km² in 2021 and fell to 5,796 km² in 2025. Scientists warn that more clearing plus warming could push parts of the forest past a tipping point into drier, degraded forest.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Formation: slow, natural change</h2>'), C(3, '<p>The Andes rose. By about 10 million years ago the river flowed east to the Atlantic.</p>'), C(8, '<p>Andean sediment built the huge, flat lowland. The forest spread across it.</p>')],
        board: [L(0.5, 'tectonic uplift of the Andes'), L(3, 'river drains east → sediment carried across the basin'), L(5.5, 'low, flat plain + equatorial climate → rainforest'), L(8, 'natural change continues: flood pulse, meanders, droughts', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>Change at different rates</h2>'), C(3, '<p>Annual: the flood pulse, wet and dry seasons.</p>'), C(6.5, '<p>Every few years: El Niño droughts. 2023–24 was the worst on record.</p>'), C(10, '<p>Decades: deforestation since the 1970s.</p>')],
        board: [L(0.5, 'every year: river rises about 10 m, deposits silt'), L(3, 'decades: meanders migrate, oxbow lakes form'), L(5.5, '2024: Rio Negro at Manaus record low, about 12.1 m'), L(8, 'since the 1970s: about a fifth of Brazil’s Amazon cleared', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Deforestation in Brazil’s Amazon</h2>'), C(3, '<p>27,772 km² cleared in 2004. 4,571 km² in 2012.</p>'), C(7, '<p>Up to 13,038 km² in 2021. Down to 5,796 km² in 2025.</p>')],
        board: [F(0.5, G.line([{ name: 'cleared', pts: [[2004, 27.8], [2008, 12.9], [2012, 4.6], [2016, 7.9], [2019, 10.1], [2021, 13.0], [2023, 9.0], [2025, 5.8]] }], { x0: 2004, x1: 2025, y0: 0, y1: 30, xstep: 3, ystep: 5, ylab: 'Thousand km² a year', title: 'Forest cleared each year, Brazilian Amazon (INPE PRODES)' }))] },
    ],
    example: {
      problem: 'Explain how your chosen large natural environment is formed and changes over time. (2024 paper, part a.)',
      steps: [
        { m: 'Formation: as the Andes rose, the river system was reorganised; by about 10 million years ago the Amazon drained east to the Atlantic.', note: 'long-term natural formation' },
        { m: 'Rivers carried sediment from the Andes and built a huge, low, flat basin; with an equatorial climate, rainforest spread across it.', note: 'how the landscape formed' },
        { m: 'Natural change continues each year: the river rises about 10 m at Manaus, flooding the várzea and depositing silt, and meanders migrate to leave oxbow lakes.', note: 'ongoing natural change' },
        { m: 'Change also comes in shocks: El Niño droughts in 2023–24 dropped the Rio Negro to about 12.1 m, its lowest since records began, and fires spread through dry forest.', note: 'natural variability' },
        { m: 'Cultural change is fastest: clearing for pasture since the 1970s has removed about a fifth of Brazil’s Amazon forest, weakening the forest–rain cycle.', note: 'cultural change, linked to natural processes' },
      ],
    },
    faded() { return G.sortGen(CHG, ['Natural change', 'Cultural change'], { n: 4, prompt: 'Sort each change in the Amazon: natural or cultural?' })(); },
    grades: 'AAMMME',
    gens: [
      G.sortGen(CHG, ['Natural change', 'Cultural change'], { n: 5, prompt: 'Sort each change in the Amazon: natural or cultural?', idea: 'The 2024 report: answers that discussed ONLY cultural change did not achieve. Include natural processes.' }),
      () => { const pairs = [[2004, 27772, 2012, 4571], [2012, 4571, 2021, 13038], [2021, 13038, 2025, 5796]]; const [y1, a, y2, b] = R.pick(pairs); const ans = ((b - a) / a) * 100;
        return { kind: 'num', answer: ans, dp: 0, tol: 0.6, prompt: `In Brazil’s Amazon, ${P.n(a).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} km² of forest were cleared in ${y1} and ${P.n(b).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} km² in ${y2}. Calculate the percentage change.`, fmt: 'Give a whole-number percentage, negative for a fall (no % sign).',
          wrong: [{ v: ((b - a) / b) * 100, msg: 'Divide by the earlier year’s figure.' }],
          more: { steps: [St(`Change: ${b} − ${a} = ${b - a} km².`), St(`÷ ${a} × 100 = ${P.f(ans, 0)}%.`), St(ans < 0 ? 'A fall in the rate of clearing, but forest was still being lost.' : 'A rise in the rate of clearing.')] }, sol: [`(${b} − ${a}) ÷ ${a} × 100 = ${P.f(ans, 0)}%`] }; },
      P.chain([
        { q: 'Put the chain in order: how the Amazon basin formed.', steps: ['Tectonic plates collide on the west coast of South America', 'The Andes are uplifted', 'The river system is reorganised to drain east to the Atlantic', 'Rivers carry Andean sediment across the basin', 'A huge, low, flat lowland forms, covered by rainforest'] },
        { q: 'Put the chain in order: how a road leads to deforestation.', steps: ['A highway is built into the forest', 'Settlers, loggers and ranchers can reach new land', 'Forest is cut and burned along the road and side roads', 'The land is turned into cattle pasture', 'A “fishbone” pattern of clearing spreads out from the road'] },
      ]),
      P.bank([
        { q: 'Why did the 2024 examiners say that answers about only cultural change did not achieve?', a: 'The question asked how the environment is formed and changes, which needs natural processes too', why: 'Formation is natural: uplift, erosion, deposition, climate.', w: [['Cultural change is not real', 'It is real, but not enough on its own.'], ['Deforestation has stopped', 'It has not.'], ['Examiners dislike deforestation', 'Not the reason.']] },
        { q: 'How did the 2023–24 drought change the environment?', a: 'Rivers fell to record lows, cutting off floodplain lakes, and dry forest burned more easily', why: 'The Rio Negro at Manaus fell to about 12.1 m in October 2024.', w: [['It made the forest wetter', 'The opposite.'], ['It raised the river by 10 m', 'That is a normal wet season.'], ['It had no effect on the forest', 'It had large effects.']] },
        { q: 'At what rates does change happen in the Amazon?', a: 'Slowly over millions of years (uplift), every year (floods), every few years (droughts) and fast in decades (deforestation)', why: 'Change “occurs at varying rates”: the exam’s definition.', w: [['Only slowly', 'Floods and clearing are fast.'], ['Only in the last 50 years', 'Natural change is ancient.'], ['Never: it is stable', 'It is always changing.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'What is the “tipping point” that scientists warn about?', a: 'If enough forest is lost and the climate warms, less transpiration means less rain, so parts of the forest could dry into degraded forest or savanna', why: 'A feedback: natural and cultural change reinforce each other.', w: [['The point where all trees are cut down', 'It happens well before that.'], ['When the river reverses again', 'No.'], ['When tourists stop visiting', 'No.']] },
        { q: 'Which sentence shows insight about change in the Amazon?', a: 'Cultural change, such as clearing, alters natural processes, such as rainfall recycling, so the two kinds of change reinforce each other', why: 'Linking natural and cultural change shows insight.', w: [['The Amazon has changed a lot', 'General.'], ['People cut down trees', 'Description.'], ['The Andes are tall', 'A fact, not insight.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Deforestation fell from 13,038 km² (2021) to 5,796 km² (2025). Why might this not mean the Amazon is safe?', a: 'Forest is still being lost each year, fires in droughts degrade forest that is not counted as cleared, and the total lost keeps growing towards a tipping point', why: 'A falling rate is still a loss: the cumulative total matters.', w: [['It means the forest is growing again', 'Slower loss is not growth.'], ['Because the figures are wrong', 'They are official satellite figures.'], ['Because 2025 was a wet year', 'Not the key point.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      STD,
      'Include <span class="pen">natural</span> formation and change. The 2024 report: answers covering only cultural changes were Not Achieved.',
      'Show different rates of change: millions of years (Andes), every year (flood pulse), every few years (droughts), decades (deforestation).',
      'Use figures: 27,772 km² cleared (2004), 4,571 km² (2012), 13,038 km² (2021), 5,796 km² (2025); river low of about 12.1 m (October 2024).',
      'Excellence: link natural and cultural change, for example clearing weakens rainfall recycling, making droughts and fires worse.',
    ],
    aim: {
      intro: '<div class="resource">Explain how your chosen large natural environment is formed and changes over time. (Like the 2024 paper, part a.) Your environment: the Amazon rainforest.</div>',
      parts: [
        { q: 'Explain one way the Amazon changes naturally every year.', write: true, words: '40–70',
          model: [S('Each wet season the Amazon floods: at Manaus the river rises about 10 m, from about 18 m in November to about 28 m in June.', 'change with evidence', true), S('The water spreads over the várzea, slows and deposits silt, so the floodplain is renewed each year.', 'process explained', true)],
          earns: 'Achieved: a natural change is explained, with evidence.', crit: { A: 'Explains a natural annual change (flood pulse, seasons) with some evidence.' } },
        { q: 'Explain in detail how the Amazon basin formed.', write: true, words: '80–120',
          model: [S('Tectonic collision on the west of South America uplifted the Andes.', 'uplift', true), S('This reorganised the rivers so that, by about 10 million years ago, the Amazon drained east to the Atlantic.', 'drainage change', true), S('Rivers eroded the Andes and carried huge amounts of sediment east, depositing it across the basin to make a low, flat plain.', 'erosion and deposition'), S('With an equatorial climate of heat and heavy rain, rainforest spread across this lowland.', 'climate and vegetation')],
          earns: 'Merit: the formation is explained in detail, linking several processes.', crit: { M: 'Explains in detail uplift of the Andes, reversal/reorganisation of drainage, erosion and deposition of sediment, and how climate allowed forest to spread.' } },
        { q: 'Fully explain how the Amazon was formed and how it is changing, at different rates, both naturally and because of people.', write: true, words: '160–220',
          model: [S('Formation took millions of years: Andean uplift sent the Amazon east to the Atlantic by about 10 million years ago, and Andean sediment built a vast, flat basin under an equatorial climate.', 'slow formation', true), S('Every year, natural change continues: the river rises about 10 m at Manaus, depositing silt on the várzea, and meanders migrate, leaving oxbow lakes.', 'annual change'), S('Every few years, El Niño droughts strike: in 2023–24 the Rio Negro fell to about 12.1 m at Manaus, the lowest since records began, and fires spread.', 'periodic change with evidence', true), S('Over decades, cultural change has been fastest: roads such as the Trans-Amazonian Highway opened the forest in the 1970s, and clearing for cattle peaked at 27,772 km² in 2004, before falling to 5,796 km² in 2025.', 'cultural change with evidence'), S('The two kinds of change interact: less forest means less transpiration and rain, which makes droughts and fires worse. So people are speeding up natural change, which could push parts of the forest past a tipping point.', 'insight: interaction of natural and cultural change', true)],
          earns: 'Excellence: formation and change are fully explained at several rates, natural and cultural, with integrated evidence and insight into how they interact.',
          crit: { M: 'Explains formation and natural and cultural change in detail.', E: 'Fully explains formation (uplift, drainage, sediment) and change at different rates (annual floods, droughts, decades of deforestation), integrating evidence, with insight into how cultural change alters natural processes (feedback, tipping point).' } },
      ],
      up: [
        up(1, ['The Amazon formed when the Andes were made and the river flowed.'], [
          ['Explain the processes: tectonic uplift, the drainage turning east (about 10 million years ago), erosion in the Andes, deposition across the basin, and the climate that let forest spread', 1, 'Right. Merit links several processes in detail.'],
          ['Add that the Andes are very high', 0, 'A fact, not explanation.'],
          ['Write about deforestation instead', 0, 'Not the formation.'],
          ['Say it was a long time ago', 0, 'Too vague.']]),
        up(2, ['The Amazon formed naturally and now people are cutting it down, which changes it a lot.'], [
          ['Cover change at different rates (millions of years, every year, every few years, decades) with figures, and explain how clearing interacts with natural processes (less rain, more drought and fire)', 1, 'Right. Excellence: comprehensive evidence and insight into interacting changes.'],
          ['Add more about how bad deforestation is', 0, 'Opinion, and cultural only.'],
          ['Describe the animals that are lost', 0, 'Off the question.'],
          ['Repeat the formation', 0, 'Not the missing part.']]),
      ],
    },
  });

  /* ======================= 8. Perspectives: how perception has changed ======================= */
  const GOV = ['1970: Brazil’s government builds the Trans-Amazonian Highway to settle an “empty” frontier', '1988: Chico Mendes is murdered; the new Constitution protects Indigenous lands', '2004: a plan with satellite monitoring and law enforcement begins to cut clearing', '2019–2022: enforcement is weakened and clearing rises to 13,038 km² (2021)', '2023 onwards: a goal to end illegal deforestation by 2030; COP30 is held in Belém in 2025'];
  P.addUnit({
    id: 'amazon-perspectives', title: 'Perspectives: how views have changed', mins: 12,
    blurb: 'From a frontier to conquer to a forest to protect: how Brazil’s government has seen the Amazon over time.',
    recap: 'A perspective is a way of seeing an environment, shaped by values and world views. Perspectives explain decisions. The 2024 exam asked how ONE person or group’s perception of the environment has changed over time. The Brazilian government is a strong example. In the 1960s–70s it saw the Amazon as an empty frontier to occupy and develop (“integrate so as not to surrender it”); it built the Trans-Amazonian Highway (from 1970) and gave incentives for cattle ranching. From the late 1980s, after the murder of rubber tapper Chico Mendes (1988), the 1988 Constitution protected Indigenous lands, and international pressure grew. In 2004 a plan using satellite monitoring and enforcement cut clearing from 27,772 km² to 4,571 km² by 2012. From 2019 to 2022 the government again put development first and weakened enforcement: clearing rose to 13,038 km² in 2021. From 2023 it set a goal to end illegal deforestation by 2030, clearing fell to 5,796 km² in 2025, and Brazil hosted COP30 in Belém, launching a fund to pay countries to keep forests standing. Indigenous peoples such as the Kayapó have long seen the forest as their home and ancestors’ land, to be guarded, a view close to kaitiakitanga.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>1960s–1980s: a frontier to conquer</h2>'), C(3, '<p>The military government saw an empty, unused land that must be occupied.</p>'), C(8, '<p>Roads, settlers and cattle ranching were encouraged with tax breaks.</p>')],
        board: [L(0.5, 'view: the Amazon is <b>empty land</b> to develop and secure'), L(3, '1970: Trans-Amazonian Highway begins'), L(5.5, 'decision: settle farmers, subsidise ranching'), L(8, 'result: “fishbone” clearing along the roads', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>1988–2012: a forest to protect</h2>'), C(3, '<p>Chico Mendes’ murder, the 1988 Constitution, and world pressure shifted the view.</p>'), C(8, '<p>From 2004: satellites, fines, protected areas. Clearing fell by about 84%.</p>')],
        board: [L(0.5, 'view: a forest with global value, to be protected'), L(3, 'Indigenous lands and protected areas expanded'), L(5.5, 'clearing: 27,772 km² (2004) → 4,571 km² (2012)', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>Since 2019: swings, then COP30</h2>'), C(3, '<p>2019–22: development first again. Clearing rose to 13,038 km² in 2021.</p>'), C(8, '<p>From 2023: zero illegal deforestation by 2030. COP30 in Belém, 2025.</p>')],
        board: [F(0.5, G.timeline([{ y: 1970, t: 'Highway' }, { y: 1988, t: 'Constitution' }, { y: 2004, t: 'Clearing plan' }, { y: 2021, t: '13,038 km²' }, { y: 2025, t: 'COP30' }], { y0: 1960, y1: 2030, step: 10, title: 'How Brazil’s government has seen the Amazon, 1970–2025' }))] },
    ],
    example: {
      problem: 'Explain how one person or group’s perception of your chosen large natural environment has changed over time. (2024 paper, part b.)',
      steps: [
        { m: 'Group: the government of Brazil, which controls about 60% of the Amazon rainforest.', note: 'name the group' },
        { m: '1960s–1970s: it saw the Amazon as an empty frontier to occupy and develop (“land without men for men without land”), so it built the Trans-Amazonian Highway from 1970 and subsidised cattle ranching.', note: 'early perception, with evidence of decisions' },
        { m: 'Late 1980s–2012: after Chico Mendes’ murder (1988), the 1988 Constitution and global pressure, it came to see the forest as valuable to protect. From 2004 satellite monitoring and enforcement cut clearing from 27,772 km² to 4,571 km² (2012).', note: 'change, with causes and evidence' },
        { m: '2019–2022: the government again put development first and weakened enforcement, and clearing rose to 13,038 km² in 2021.', note: 'the perception swung back' },
        { m: 'Since 2023: a goal to end illegal deforestation by 2030 and hosting COP30 in Belém (2025) show a view of the forest as worth more standing; clearing fell to 5,796 km² in 2025. So the perception has changed with leaders, science and world pressure, and is not one-way.', note: 'insight: why it changed' },
      ],
    },
    faded() { return { kind: 'order', prompt: 'Put the changes in the Brazilian government’s view of the Amazon in time order.', items: GOV, given: 2, more: { idea: 'A perception that changed over time: from frontier, to protection, to development again, to protection.', steps: GOV.map((g) => St(g)) } }; },
    grades: 'AAAME',
    gens: [
      () => ({ kind: 'order', prompt: 'Put the changes in the Brazilian government’s view of the Amazon in time order.', items: GOV, more: { idea: 'The perception swung: frontier → protection → development → protection.', steps: GOV.map((g) => St(g)), trap: 'Do not say the government “always” wanted to protect it, or “always” wanted to clear it. It changed.' } }),
      G.sortGen([['“Land without men for men without land.”', 0, 'Brazilian government, 1970s.'], ['Tax breaks for cattle ranches in the forest', 0], ['Satellite monitoring and fines for illegal clearing', 1], ['Protecting Indigenous lands in the 1988 Constitution', 1], ['A goal to end illegal deforestation by 2030', 1], ['Building a highway to bring in settlers', 0], ['A fund paying countries to keep forests standing', 1], ['Weakening environmental enforcement to speed up development', 0]], ['Develop the forest', 'Protect the forest'], { n: 5, prompt: 'Sort each statement or decision: does it show a perspective focused on developing the Amazon, or on protecting it?' }),
      P.bank([
        { q: 'What is a perspective?', a: 'A way of seeing the world, shaped by values and world views, which explains people’s decisions about environments', why: 'From the exam’s concept definitions.', w: [['A photograph of a landscape', 'No.'], ['A fact about an environment', 'A perspective is a viewpoint.'], ['A natural process', 'No.']] },
        { q: 'How did the Brazilian government see the Amazon in the 1970s?', a: 'As an empty frontier to occupy and develop', why: 'It built roads and encouraged settlers and ranching.', w: [['As a sacred forest to protect', 'That is closer to Indigenous perspectives.'], ['As a tourist destination', 'Not the main view.'], ['As worthless', 'It was seen as valuable to develop.']] },
        { q: 'How did Brazil’s Amazon deforestation change between 2004 and 2012?', a: 'It fell from 27,772 km² to 4,571 km² a year, about 84%', why: 'After a plan with satellite monitoring and enforcement.', w: [['It doubled', 'It fell.'], ['It stayed the same', 'It fell sharply.'], ['It stopped completely', 'It fell, but did not stop.']] },
        { q: 'Where was COP30, the 2025 UN climate conference, held?', a: 'Belém, at the mouth of the Amazon', why: 'Hosting it there signalled a perception of the forest as globally important.', w: [['Manaus', 'Belém, not Manaus.'], ['Rio de Janeiro', 'That hosted the 1992 Earth Summit.'], ['Brasília', 'No.']] },
      ]),
      P.bank([
        { q: 'Why did the Brazilian government’s perception change after the late 1980s?', a: 'Chico Mendes’ murder, Indigenous protests, scientific evidence and international pressure showed the forest’s value standing', why: 'Explain causes of the change, not just that it changed.', w: [['The forest had all been cleared', 'Most remained.'], ['Cattle ranching became illegal', 'It did not.'], ['Brazil left the United Nations', 'No.']] },
        { q: 'What does the rise in clearing to 13,038 km² in 2021 show about perception?', a: 'The government’s view swung back towards development, and weaker enforcement led to more clearing', why: 'Perceptions change and can reverse; decisions follow them.', w: [['That satellites were broken', 'No.'], ['That there was a drought', 'Not the main cause.'], ['That perception never changes', 'It shows it changing.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Which sentence would lift an answer about changing perception to Excellence?', a: 'The government’s view has swung with its leaders, the economy and global pressure, so the forest’s future depends on which perspective holds power', why: 'Insight into WHY the perception changes and what that means.', w: [['The government changed its mind', 'Too general.'], ['Clearing was 5,796 km² in 2025', 'Evidence, but not insight on its own.'], ['Deforestation is bad', 'Opinion.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      'Choose ONE group, such as the Brazilian government, and <span class="pen">show its view at different times</span>, with dates.',
      'For each period: the perception, a decision it led to, and evidence of the result (km² cleared).',
      'Explain WHY the perception changed: events (Chico Mendes, 1988), science, international pressure, leaders.',
      'Excellence: show the swings (not one-way), and link the perception to change in the environment.',
      'You can compare with Indigenous peoples (such as the Kayapó), who see the forest as home to guard, close to the Māori concept of kaitiakitanga.',
    ],
    aim: {
      intro: '<div class="resource">Explain how one person or group’s perception of your chosen large natural environment has changed over time. (Like the 2024 paper, part b.) Your environment: the Amazon rainforest. Group: the government of Brazil.</div>',
      parts: [
        { q: 'Describe how the Brazilian government saw the Amazon in the 1970s, and one decision it made.', write: true, words: '40–70',
          model: [S('In the 1970s the military government saw the Amazon as an empty frontier to be occupied and developed.', 'perception', true), S('So in 1970 it began the Trans-Amazonian Highway and encouraged settlers and cattle ranchers with incentives.', 'decision with evidence', true)],
          earns: 'Achieved: a perception and a decision, with evidence.', crit: { A: 'Describes the early development/frontier perception and a linked decision (highway, settlement, ranching incentives) with some evidence.' } },
        { q: 'Explain in detail how and why the government’s perception changed between the 1970s and 2012.', write: true, words: '90–130',
          model: [S('In the 1970s the forest was seen as land to develop, so roads and ranching spread clearing.', 'starting view', true), S('In 1988 the murder of rubber tapper Chico Mendes drew world attention, and the new Constitution protected Indigenous lands.', 'causes of change', true), S('Scientific evidence and international pressure grew, so the forest came to be seen as valuable standing.', 'more causes'), S('In 2004 the government launched a plan with satellite monitoring, fines and protected areas, and clearing fell from 27,772 km² (2004) to 4,571 km² (2012).', 'new view → decisions → evidence', true)],
          earns: 'Merit: the change and its causes are explained in detail, with dates and figures.', crit: { M: 'Explains in detail the shift from development to protection, with causes (Chico Mendes 1988, Constitution, pressure, science) and evidence (2004 plan, 27,772 → 4,571 km²).' } },
        { q: 'Fully explain how the Brazilian government’s perception of the Amazon has changed from the 1970s to today, and why.', write: true, words: '160–220',
          model: [S('1970s: the forest was seen as an empty frontier; the Trans-Amazonian Highway and ranching subsidies led to “fishbone” clearing.', 'phase 1', true), S('1988–2012: Chico Mendes’ murder, the 1988 Constitution and global pressure shifted the view to protection; satellite monitoring from 2004 cut clearing from 27,772 km² to 4,571 km² by 2012.', 'phase 2 with causes and evidence'), S('2019–2022: a government that put economic development and sovereignty first weakened enforcement, and clearing rose to 13,038 km² in 2021.', 'phase 3: a reversal', true), S('Since 2023: the goal of ending illegal deforestation by 2030 and hosting COP30 in Belém in 2025 show a view of the forest as worth more standing, partly because of payments such as the new forest fund; clearing fell to 5,796 km² in 2025.', 'phase 4 with evidence'), S('So the perception has not changed in one direction: it swings with leaders, the economy and international pressure. Because the government controls about 60% of the forest, each swing changes how fast the environment itself changes.', 'insight', true)],
          earns: 'Excellence: the changing perception is fully explained across several periods, with causes, integrated evidence and insight.',
          crit: { M: 'Explains the change from development to protection with causes and evidence.', E: 'Fully explains changes across several periods (1970s frontier, 1988–2012 protection, 2019–22 reversal, 2023+ protection/COP30), why each happened, with integrated dates and figures, and insight (perception swings; decisions change the environment).' } },
      ],
      up: [
        up(1, ['The government used to want to cut it down but now it wants to protect it.'], [
          ['Explain the change with dates, causes (Chico Mendes 1988, the Constitution, pressure, science) and evidence of new decisions (2004 plan; 27,772 to 4,571 km²)', 1, 'Right. Merit explains how and why in detail.'],
          ['Say that deforestation is bad', 0, 'Opinion, not explanation.'],
          ['Add a definition of perception', 0, 'Not enough.'],
          ['Name the president', 0, 'Detail without explanation.']]),
        up(2, ['The government’s view changed from development to protection because of pressure, and deforestation fell.'], [
          ['Show all the phases, including the 2019–22 reversal, with evidence for each, and explain why the view keeps swinging and what that means for the forest', 1, 'Right. Excellence shows the full pattern with insight.'],
          ['Add more about Chico Mendes’ life', 0, 'Detail, not insight.'],
          ['Add a list of animals', 0, 'Off the question.'],
          ['Repeat the 2004 figure', 0, 'Evidence already given.']]),
      ],
    },
  });
})();
