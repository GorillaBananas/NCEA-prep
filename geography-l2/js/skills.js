/* AS 91243 (Geography 2.4) Apply geography concepts and skills to demonstrate understanding of a given environment.
   The exam gives a resource booklet about an unseen overseas environment (2023 Lake Mead; 2024 Stratford, London;
   2025 Singapore) and asks for précis maps, grid references, distance and direction, timelines, graph patterns,
   tables of change, and an extended answer using concepts. Here the practice maps are generated afresh each time,
   and the written practice uses Port Avela, an INVENTED island port (practice data, not a real place).
   Exam tips draw on the 2023–2025 NZQA assessment reports and schedules. */
(function () {
  const P = NP, R = P.R, G = P.geo;
  const C = (at, html) => ({ at, html });
  const L = (at, html, note, o = {}) => Object.assign({ at, html: `<span class="bq">${html}</span>`, note }, o);
  const F = (at, html) => ({ at, html });
  const S = (m, note, key) => ({ m, note, key: !!key });
  const up = (part, shown, choices, ask) => ({ part, shown, ask, choices: choices.map(([t, ok, why]) => ({ t, ok: !!ok, why })) });
  const St = (say, m) => ({ say, m });

  /* ---------- the practice resource: Port Avela (invented) ---------- */
  const POP = [[1950, 0.2], [1960, 0.35], [1970, 0.6], [1980, 1.1], [1990, 1.6], [2000, 2.3], [2010, 3.0], [2020, 3.4]];
  const URB = [[1950, 15], [1960, 20], [1970, 28], [1980, 40], [1990, 52], [2000, 66], [2010, 78], [2020, 84]];
  const MANG = [[1950, 120], [1960, 112], [1970, 95], [1980, 78], [1990, 60], [2000, 45], [2010, 38], [2020, 36]];
  const EVENTS = [[1819, 'Trading post set up at the harbour'], [1965, 'Independence'], [1972, 'First container terminal opens'], [1981, 'International airport opens on reclaimed land'], [2005, 'Mangrove nature reserve created'], [2018, 'New mega-port opens on reclaimed land in the west']];
  const AVELA = `<div class="resource"><b>Practice resource: Port Avela</b> (an invented island port, about 30 km across, used for practice only).
    <ul><li>Location: on a busy shipping route between two large countries, with a deep natural harbour on the south coast; a bridge links it to the mainland.</li>
    <li>Population: 0.2 million (1950), 0.6 million (1970), 1.6 million (1990), 3.0 million (2010), 3.4 million (2020).</li>
    <li>Urban area: 15% of the island (1950), 52% (1990), 84% (2020). Mangrove forest: 120 km² (1950), 60 km² (1990), 36 km² (2020).</li>
    <li>Events: trading post (1819); independence (1965); first container terminal (1972); airport on reclaimed land (1981); mangrove reserve created (2005); mega-port on reclaimed land in the west (2018).</li>
    <li>Map grid references: container port 2041; old town 2242; airport (reclaimed land) 2643; mangrove reserve 2348; industrial island (reclaimed) 1840.</li></ul></div>`;
  const avelaPop = (o = {}) => G.line([{ name: 'population', pts: POP }], { x0: 1950, x1: 2020, y0: 0, y1: 4, xstep: 10, ystep: 1, ylab: 'Population (millions)', title: 'Figure 1: Population of Port Avela, 1950–2020 (practice data)', alt: 'Line graph of Port Avela population' });

  /* ======================= 1. Grid references ======================= */
  const gridQ = (kind) => () => {
    const m = G.newMap(); const p = R.pick(m.pts);
    const fig = G.mapSvg(m) + G.keyList(m);
    const r4 = G.ref4(m, p.gx, p.gy), r6 = G.ref6(m, p.gx, p.gy);
    const idea = 'Eastings first (the numbers along the bottom), then northings (up the side): “along the corridor, then up the stairs”. A square is named by the lines on its west (left) and south (bottom) edges.';
    if (kind === 4) return { kind: 'gridref', answer: r4, prompt: `Give the 4-figure grid reference of the square that contains the <b>${p.name}</b>.`, fig, more: { idea, steps: [St(`Find the ${p.name}. The line on the left (west) of its square is ${r4.slice(0, 2)}: that is the easting.`), St(`The line below (south of) the square is ${r4.slice(2)}: the northing.`), St(`Easting then northing: <b>${r4}</b>.`)], trap: 'Using the line to the right of, or above, the square. Always the bottom-left corner.' } };
    if (kind === 6) return { kind: 'gridref', answer: r6, prompt: `Give the 6-figure grid reference of the <b>${p.name}</b>.`, fig, more: { idea, steps: [St(`Easting: the line to the left is ${r6.slice(0, 2)}; the symbol is about ${r6[2]} tenths of the way across the square, so ${r6.slice(0, 3)}.`), St(`Northing: the line below is ${r6.slice(3, 5)}; the symbol is about ${r6[5]} tenths of the way up, so ${r6.slice(3)}.`), St(`Together: <b>${r6}</b>.`)], trap: 'Giving the northing first, or forgetting the tenths.' } };
    // which feature is at this reference?
    const others = R.shuffle(m.pts.filter((x) => x !== p)).slice(0, 3);
    return P.mcq({ prompt: `What is found at grid reference <b>${r6}</b>?`, fig, more: { idea, steps: [St(`${r6.slice(0, 2)} along, then ${r6[2]} tenths further east.`), St(`${r6.slice(3, 5)} up, then ${r6[5]} tenths further north.`), St(`That point is the ${p.name}.`)] } }, [{ t: `The ${p.name}`, ok: true, why: `${p.name} is at ${r6}.` }].concat(others.map((o) => ({ t: `The ${o.name}`, why: `The ${o.name} is at ${G.ref6(m, o.gx, o.gy)}.` }))));
  };
  P.addUnit({
    id: 'grid-refs', title: 'Grid references: 4 and 6 figures', mins: 9,
    blurb: 'Along the corridor, up the stairs. Quick marks in the skills paper, and evidence for every map answer.',
    recap: 'A grid reference locates a place on a map. Eastings are the vertical grid lines, numbered along the bottom; northings are the horizontal lines, numbered up the side. Always give the easting first, then the northing: “along the corridor, then up the stairs”. A 4-figure reference names a whole grid square by the lines on its west and south edges (for example 2341). A 6-figure reference pinpoints a feature by adding tenths: estimate how far across the square (0–9) and how far up (0–9), for example 233418. On a 1:50 000 map each square is 1 km across, so a 6-figure reference locates a feature to within 100 m. The 2025 schedule gave Merit for locating changes “with a high level of accuracy”, such as grid references.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Eastings first</h2>'), C(3, '<p>Along the corridor (numbers along the bottom), then up the stairs (numbers up the side).</p>'), C(8, '<p>A square is named by its bottom-left corner.</p>')],
        board: [F(0.5, G.mapSvg(G.newMap(), { letters: true }))] },
      { dur: 14, card: [C(0, '<h2>6 figures: add tenths</h2>'), C(3, '<p>Imagine each square cut into 10 × 10 smaller squares.</p>'), C(8, '<p>How many tenths across? How many tenths up? Slot them in after each pair.</p>')],
        board: [L(0.5, 'easting line <b>23</b>, 3 tenths across → <b>233</b>'), L(3, 'northing line <b>41</b>, 8 tenths up → <b>418</b>'), L(5.5, '6-figure reference: <b>233418</b>'), L(8, '4-figure square: <b>2341</b> (just the two lines)', '', { hl: true })] },
    ],
    example: {
      problem: 'A church symbol sits 3 tenths of the way across the square to the right of easting 23, and 8 tenths of the way up the square above northing 41. Give its 4- and 6-figure grid references.',
      steps: [
        { m: 'The square: easting 23 (its west edge), northing 41 (its south edge), so the 4-figure reference is 2341.', note: 'the square' },
        { m: 'Easting with tenths: 23 and 3 tenths → 233.', note: 'along' },
        { m: 'Northing with tenths: 41 and 8 tenths → 418.', note: 'up' },
        { m: '6-figure reference: 233418. Easting always first.', note: 'together' },
      ],
    },
    faded() { return gridQ(4)(); },
    grades: 'AAAM',
    gens: [gridQ(4), gridQ(6), gridQ('which'), gridQ(6)],
    tips: [
      '<span class="pen">Easting first</span>: along the corridor, then up the stairs.',
      'A 4-figure reference names a square by its bottom-left corner; a 6-figure one adds tenths.',
      'Use grid references as evidence in written answers: “the airport (2643) is on reclaimed land”. The 2025 Merit evidence located changes with grid references.',
      'Check the numbers increase to the right and upwards before you start.',
    ],
    aim: {
      intro: AVELA,
      parts: [
        { q: 'Using grid references, describe where the airport and the container port are located on Port Avela.', write: true, words: '30–50',
          model: [S('The container port is in grid square 2041, on the deep natural harbour on the south coast.', 'port with reference', true), S('The airport is further east, in square 2643, on reclaimed land.', 'airport with reference and direction', true)],
          earns: 'Achieved: features located with grid references from the resource.', crit: { A: 'Locates both features with correct grid references (2041, 2643) and some description.' } },
        { q: 'Using grid references and the resource, explain why the old town (2242) grew where it did.', write: true, words: '60–90',
          model: [S('The old town is in square 2242, north-east of the container port (2041) and the natural harbour.', 'location with evidence', true), S('The deep harbour gave ships shelter, so a trading post was set up there in 1819.', 'reason 1', true), S('Port Avela sits on a busy shipping route between two large countries, so trade and jobs grew around the harbour, and the town grew beside it.', 'reason 2: relative location')],
          earns: 'Merit: the location is explained in detail with grid references and evidence.', crit: { M: 'Explains in detail why the old town grew there (harbour, shipping route, trade), using grid references and resource evidence.' } },
        { q: 'Using grid references and evidence, explain how land use on Port Avela has changed and what this shows about the island’s location.', write: true, words: '120–160',
          model: [S('Land has been reclaimed from the sea for the airport (2643, opened 1981) and the industrial island (1840), and for the mega-port in the west (2018).', 'changes located', true), S('Mangroves in the north (around 2348) have been cleared for housing, shrinking from 120 km² in 1950 to 36 km² in 2020, while urban land rose from 15% to 84%.', 'change with data'), S('Because the island is only about 30 km across, it ran out of space, so it built outwards into the sea.', 'cause: small area'), S('It did so because its location on a busy shipping route makes port and airport land very valuable: the more trade, the more space needed.', 'link to location', true), S('So its location is both an advantage (trade) and a constraint (limited land), which explains why reclamation and a mangrove reserve (2005) both appear on the map.', 'insight: advantage and constraint', true)],
          earns: 'Excellence: changes are located precisely and explained through the concept of location as both advantage and constraint.',
          crit: { M: 'Describes and explains land-use changes with grid references and data.', E: 'Comprehensively explains land-use changes, located with grid references and supported with data, linking them to location (advantage: trade route; constraint: small island), with insight.' } },
      ],
      up: [
        up(1, ['The old town is by the sea because of the harbour.'], [
          ['Locate it precisely (2242, beside the harbour at 2041) and explain both reasons: a sheltered deep harbour (trading post 1819) and a location on a busy shipping route', 1, 'Right. Merit: precise location, detailed explanation.'],
          ['Add that the town is old', 0, 'Not explanation.'],
          ['Give the population', 0, 'Not about the location.'],
          ['Draw the town', 0, 'Not the missing explanation.']]),
        up(2, ['The island has changed a lot. There is an airport and a new port and fewer mangroves.'], [
          ['Locate each change with grid references, quantify it (mangroves 120 → 36 km²; urban 15% → 84%), and explain it through location as both an advantage and a constraint', 1, 'Right. Excellence: precise evidence and a concept used with insight.'],
          ['List more features', 0, 'Still description.'],
          ['Copy the resource text', 0, 'The reports say copying earns little.'],
          ['Say change is bad', 0, 'Opinion.']]),
      ],
    },
  });

  /* ======================= 2. Scale, distance and direction ======================= */
  const distQ = () => {
    const m = G.newMap(); const [a, b] = R.shuffle(m.pts).slice(0, 2);
    const d = Math.hypot(a.gx - b.gx, a.gy - b.gy);
    return { kind: 'num', answer: d, dp: 1, tol: 0.2, prompt: `Use the map (scale 1:50 000; each grid square is 1 km). What is the straight-line distance from the <b>${a.name}</b> to the <b>${b.name}</b>?`, fig: G.mapSvg(m) + G.keyList(m), fmt: 'Give kilometres to 1 decimal place (within 0.2 km is accepted).',
      more: { idea: 'Measure in grid squares, or with a ruler against the scale bar. Each square is 1 km.', steps: [St(`Across: about ${P.f(Math.abs(a.gx - b.gx), 1)} squares. Up or down: about ${P.f(Math.abs(a.gy - b.gy), 1)} squares.`), St(`Straight line: √(${P.f(Math.abs(a.gx - b.gx), 1)}² + ${P.f(Math.abs(a.gy - b.gy), 1)}²) ≈ ${P.f(d, 1)} km. (Or measure with a ruler and compare with the scale bar.)`)] }, sol: [`about ${P.f(d, 1)} km`] };
  };
  const dirQ = () => {
    let m, a, b, d, g = 0;
    do { m = G.newMap(); [a, b] = R.shuffle(m.pts).slice(0, 2); d = G.dir8(a, b); } while (!d && g++ < 50);
    const wrong = R.shuffle(G.DIRS.filter((x) => x !== d)).slice(0, 3);
    const camera = Math.random() < 0.4;
    return P.mcq({ prompt: camera ? `A photographer stands at the <b>${a.name}</b> and points the camera at the <b>${b.name}</b>. In which direction is the camera facing?` : `In which direction is the <b>${b.name}</b> from the <b>${a.name}</b>?`, fig: G.mapSvg(m) + G.keyList(m),
      more: { idea: 'Put your pencil on the place you are going FROM. North is up the map. Use the 8 points: N, NE, E, SE, S, SW, W, NW.', steps: [St(`Start at the ${a.name}.`), St(`The ${b.name} is ${d} of it.`)], trap: 'Giving the direction the wrong way round: “from A to B” starts at A.' } },
      [{ t: d, ok: true, why: `From the ${a.name}, the ${b.name} lies to the ${d}.` }].concat(wrong.map((w) => ({ t: w, why: w === G.DIRS[(G.DIRS.indexOf(d) + 4) % 8] ? 'That is the opposite direction: from B back to A.' : 'Start at the first place and look towards the second; north is up.' }))));
  };
  const scaleQ = () => {
    const sc = R.pick([25000, 50000, 100000, 250000]), cm = R.pick([2, 3, 4.5, 6, 7.5, 8]); const km = (cm * sc) / 100000;
    return { kind: 'num', answer: km, dp: 2, tol: 0.006, prompt: `On a map with a scale of 1:${sc.toLocaleString('en-NZ').replace(/,/g, ' ')}, two places are ${cm} cm apart. What is the real distance in kilometres?`, fmt: 'Give kilometres (up to 2 decimal places).',
      wrong: [{ v: (cm * sc) / 1000, msg: 'That is in metres ÷ 10. 1 km = 100 000 cm.' }, { v: cm * sc, msg: 'That is in centimetres. Divide by 100 000 to get kilometres.' }],
      more: { idea: '1 cm on the map = the scale number in cm on the ground. 100 000 cm = 1 km.', steps: [St(`1 cm = ${sc.toLocaleString('en-NZ')} cm = ${sc / 100000} km.`), St(`${cm} × ${sc / 100000} = ${P.n(km, 3)} km.`)] }, sol: [`${cm} × ${sc / 100000} = ${P.n(km, 3)} km`] };
  };
  P.addUnit({
    id: 'scale-direction', title: 'Scale, distance and direction', mins: 10,
    blurb: 'Measure straight-line distance, convert a scale, and say which way a camera was facing.',
    recap: 'Scale links distance on the map to distance on the ground. A scale of 1:50 000 means 1 cm on the map is 50 000 cm (0.5 km) on the ground; on New Zealand Topo50 maps each grid square is 1 km. To find a straight-line distance, measure with a ruler and compare with the scale bar, or count squares. Give direction with the 8 compass points (N, NE, E, SE, S, SW, W, NW); north is the top of the map unless a north arrow says otherwise. “The direction of B from A” means stand at A and look towards B. To find which way a camera faced in a photo, find two features in the photo on the map, then the line from the camera to them. The 2023 paper asked for the straight-line length of Lake Mead using the scale, and for the direction a camera was facing.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>Scale</h2>'), C(3, '<p>1:50 000: 1 cm on the map is 50 000 cm on the ground, which is 0.5 km.</p>'), C(8, '<p>Grid squares on a Topo50 map are 1 km across.</p>')],
        board: [L(0.5, '1 km = 1 000 m = 100 000 cm'), L(3, '1:50 000 → 1 cm = 0.5 km'), L(5.5, '1:25 000 → 1 cm = 0.25 km'), L(8, 'measure with a ruler; check against the scale bar', '', { hl: true })] },
      { dur: 13, card: [C(0, '<h2>Direction</h2>'), C(3, '<p>“B from A”: stand at A, look at B.</p>'), C(7.5, '<p>A camera: find what is in the photo on the map, then draw the line from where it was taken.</p>')],
        board: [L(0.5, 'eight points: N, NE, E, SE, S, SW, W, NW'), L(3, 'north is up unless the arrow says otherwise'), L(5.5, 'opposite of NE is SW; of NW is SE'), L(8, 'from A to B starts at A', '', { hl: true })] },
    ],
    example: {
      problem: 'On a 1:50 000 map, the lake measures 9.2 cm from west to east. Calculate its straight-line length, then say in which direction a camera faced if it was on the east shore looking across the whole lake.',
      steps: [
        { m: '1 cm on the map = 50 000 cm = 0.5 km.', note: 'the scale' },
        { m: '9.2 × 0.5 = 4.6 km.', note: 'length' },
        { m: 'Standing on the east shore and looking across the lake means looking towards the west shore.', note: 'from the camera to what it sees' },
        { m: 'So the camera faced west.', note: 'direction' },
      ],
    },
    faded() { return scaleQ(); },
    grades: 'AAAM',
    gens: [scaleQ, distQ, dirQ, distQ],
    tips: [
      '<span class="pen">1 km = 100 000 cm</span>. At 1:50 000, 1 cm = 0.5 km.',
      'Use a ruler, and give units (km).',
      'Direction “of B from A”: start at A. Use 8 compass points.',
      'For a camera direction, match two features in the photo to the map. Practise with Google Maps Street View at home.',
    ],
    aim: {
      intro: AVELA + '<div class="resource">On the practice map (1:50 000), the bridge to the mainland is 6.4 cm north of the old town; the airport is 8.2 cm east-north-east of the old town.</div>',
      parts: [
        { q: 'Calculate the straight-line distance from the old town to the bridge, and from the old town to the airport.', write: true, words: '20–40',
          model: [S('At 1:50 000, 1 cm = 0.5 km.', 'scale', true), S('Bridge: 6.4 × 0.5 = 3.2 km. Airport: 8.2 × 0.5 = 4.1 km.', 'distances with units', true)],
          earns: 'Achieved: correct distances with units and working.', crit: { A: 'Correct conversion (1 cm = 0.5 km) giving 3.2 km and 4.1 km, with units.' } },
        { q: 'Describe the location of the airport relative to the old town and the coast, using distance and direction.', write: true, words: '40–70',
          model: [S('The airport is about 4.1 km east-north-east of the old town, in square 2643.', 'distance and direction', true), S('It is built on land reclaimed from the sea on the east coast, away from the old town and the harbour.', 'relative to coast', true), S('This keeps aircraft noise away from the crowded old town and gives a long, flat runway beside the sea.', 'meaning')],
          earns: 'Merit: precise location using distance, direction and grid reference, with its significance.', crit: { M: 'Describes location precisely with distance, compass direction, grid reference and relation to the coast, with some explanation.' } },
        { q: 'Explain how the location and accessibility of the airport and the bridge have helped Port Avela develop.', write: true, words: '110–150',
          model: [S('The airport (2643), 4.1 km from the old town, opened in 1981 on reclaimed land; the bridge, 3.2 km north, links the island to the mainland.', 'locations with evidence', true), S('Together they make the island accessible by air, sea and land, which suits its location on a busy shipping route.', 'accessibility'), S('Better access let trade, tourism and business grow, which explains the rise in population from 0.6 million (1970) to 3.4 million (2020).', 'link to change with data', true), S('But access needed land the small island did not have, so the sea was reclaimed and mangroves were cleared (120 → 36 km²).', 'cost'), S('So accessibility turned the island’s location into an advantage, but its small size remains a constraint, which shapes its future development.', 'insight', true)],
          earns: 'Excellence: location and accessibility linked to change with evidence, and insight into advantage and constraint.',
          crit: { M: 'Explains how location and accessibility helped development, with evidence.', E: 'Comprehensively explains the links between location, accessibility and development/change using precise evidence (distances, grid references, data), with insight (advantage vs constraint, future).' } },
      ],
      up: [
        up(1, ['The airport is to the east of the town by the sea.'], [
          ['Add the distance (about 4.1 km), a precise direction (east-north-east), the grid square (2643), that it is on reclaimed land, and why that site suits an airport', 1, 'Right. Merit: precise location with significance.'],
          ['Add that it opened in 1981', 0, 'Evidence, but not the location.'],
          ['Say it is big', 0, 'Vague.'],
          ['Draw an arrow', 0, 'Not enough.']]),
        up(2, ['The airport and bridge make it easy to get to Port Avela so it grew.'], [
          ['Use precise evidence (locations, distances, dates, population data), explain the chain from accessibility to trade and growth, include the cost (reclamation, mangroves) and judge location as advantage and constraint', 1, 'Right. Excellence: comprehensive evidence and insight.'],
          ['Say accessibility is important', 0, 'General.'],
          ['Copy the event list', 0, 'Copying earns little.'],
          ['Add a definition of accessibility', 0, 'Not enough on its own.']]),
      ],
    },
  });

  /* ======================= 3. Précis maps ======================= */
  const CONV = [['title', 'a title'], ['key', 'a key (legend)'], ['north', 'a north arrow (orientation)'], ['scale', 'a scale'], ['border', 'a border'], ['source', 'a source']];
  const missingQ = () => { const [k, t] = R.pick(CONV); const others = R.shuffle(CONV.filter((c) => c[0] !== k)).slice(0, 3);
    return P.mcq({ prompt: 'Which mapping convention is missing from this précis map?', fig: G.precis(k), more: { idea: 'Check every map against BOLTSS: Border, Orientation (north arrow), Legend (key), Title, Scale, Source.', steps: [St('Border? Orientation? Legend? Title? Scale? Source?'), St(`The missing one is ${t}.`)], trap: 'Losing marks for a missing key or north arrow. The 2024 report: Not Achieved answers often omitted conventions.' } },
      [{ t: t[0].toUpperCase() + t.slice(1), ok: true, why: `It has no ${t.replace(/^an? /, '')}.` }].concat(others.map(([, ot]) => ({ t: ot[0].toUpperCase() + ot.slice(1), why: 'That one is on the map.' })))); };
  const TITLES = [
    { a: 'Précis map showing the location of the port, airport and nature reserve on Port Avela, 2020', w: [['Port Avela', 'Too short: what does the map show, and when?'], ['My map', 'Says nothing.'], ['A map of an island with lots of things', 'Vague: no place, features or date.']] },
    { a: 'Précis map of Lake Mead and the surrounding area, showing Hoover Dam and the Las Vegas urban area, 2018', w: [['Lake Mead', 'Missing what and when.'], ['Précis map', 'Missing where, what and when.'], ['Water', 'Far too vague.']] },
  ];
  P.addUnit({
    id: 'precis-maps', title: 'Précis maps and conventions', mins: 10,
    blurb: 'Simplify a map, keep size, shape and location accurate, and never forget BOLTSS.',
    recap: 'A précis map is a simplified copy of a map or photo that shows only the features asked for, accurately located, sized and shaped. Use the grid on the source map and the frame to place features square by square. Every map needs its conventions; remember BOLTSS: Border, Orientation (north arrow), Legend (key), Title, Scale and Source. A good title says what the map shows, where and when, for example “Précis map showing the location of Changi Airport, Jurong Island and Sentosa Island, Singapore, 2018”. Use colour pencils for areas and symbols, and match them to the key; annotate in pen. The 2025 schedule: Achieved maps showed “a range of the features … with only some accuracy”; Merit maps showed “most of the main features” with “a high level of accuracy”, an “appropriate and detailed” title and an “accurate” key. The 2024 Excellence maps had features in the correct size, shape and location, with all conventions.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>BOLTSS</h2>'), C(3, '<p>Border, Orientation, Legend, Title, Scale, Source.</p>'), C(8, '<p>Missing conventions cost marks every year.</p>')],
        board: [F(0.5, G.precis(null))] },
      { dur: 14, card: [C(0, '<h2>Accuracy</h2>'), C(3, '<p>Use the grid: copy one square at a time.</p>'), C(7.5, '<p>Right size, right shape, right place. Use a ruler for straight lines.</p>')],
        board: [L(0.5, 'show ONLY the features asked for'), L(3, 'match each grid square of the source to the frame'), L(5.5, 'colour areas; symbols for points; every colour in the key'), L(8, 'title = what + where + when', '', { hl: true })] },
    ],
    example: {
      fig: G.precis(null, { title: 'Précis map of Port Avela, showing land use in 2020' }),
      problem: 'Complete a précis map showing the airport, the old town and the mangrove reserve of Port Avela. What must you do to reach Merit?',
      steps: [
        { m: 'Locate each feature square by square from the source map: old town in 2242, airport in 2643, mangrove reserve in 2348.', note: 'accurate location' },
        { m: 'Draw each area the right size and shape: the airport as a long strip on the east coast, the reserve along the northern shore.', note: 'size and shape' },
        { m: 'Colour each area and add every colour and symbol to the key.', note: 'accurate key' },
        { m: 'Add a border, a north arrow, the scale and the source.', note: 'conventions' },
        { m: 'Title: “Précis map showing the old town, airport and mangrove reserve of Port Avela, 2020”.', note: 'detailed title' },
      ],
    },
    faded() { return missingQ(); },
    grades: 'AAAM',
    gens: [
      missingQ,
      () => { const t = R.pick(TITLES); return P.mcq({ prompt: 'Which is the best title for a précis map?', more: { idea: 'A title says what the map shows, where and when.', steps: [St(t.a)] } }, [{ t: t.a, ok: true, why: 'What, where and when: “appropriate and detailed”, as Merit needs.' }].concat(t.w.map(([w, why]) => ({ t: w, why })))); },
      () => ({ kind: 'order', prompt: 'Put the steps for drawing a précis map in a sensible order.', items: ['Read which features you must show', 'Match the grid on the source to the grid on the frame', 'Draw each feature square by square, in the right size and shape', 'Colour the areas and add symbols', 'Add the key, north arrow, scale, source and border', 'Write a detailed title: what, where, when'], given: 0, more: { idea: 'Plan, place, draw, colour, then conventions and title.', steps: [St('Features first, then accuracy, then conventions.')] } }),
      P.bank([
        { q: 'A student’s précis map shows every road, house and stream on the source map. What is wrong?', a: 'A précis map should be simplified, showing only the features asked for', why: 'Extra detail wastes time and hides the main features.', w: [['Nothing: more detail earns more marks', 'It does not.'], ['It should show more houses', 'No.'], ['It needs more colours', 'Not the problem.']] },
        { q: 'What did the 2024 Excellence précis maps have that Merit maps lacked?', a: 'Features in the correct size, shape and location, with all conventions', why: 'From the 2024 assessment report.', w: [['More colours', 'Not the criterion.'], ['A longer title', 'Detail helps, but accuracy is the key.'], ['Extra features not asked for', 'No.']] },
        { q: 'Which part of BOLTSS is the north arrow?', a: 'Orientation', why: 'Border, Orientation, Legend, Title, Scale, Source.', w: [['Legend', 'That is the key.'], ['Scale', 'No.'], ['Source', 'No.']] },
      ], { grade: 'M' }),
    ],
    tips: [
      'Learn <span class="pen">BOLTSS</span>: Border, Orientation, Legend, Title, Scale, Source.',
      'Accuracy: copy square by square using the grid; get size, shape and location right. Use a ruler.',
      'Title: what + where + when. Merit needs an “appropriate and detailed” title and an accurate key.',
      'Bring coloured pencils and a ruler; annotate in pen.',
    ],
    aim: {
      intro: AVELA,
      parts: [
        { q: 'List the conventions your précis map of Port Avela must include, and write a suitable title.', write: true, words: '30–50',
          model: [S('Border, north arrow (orientation), key (legend), title, scale and source.', 'conventions', true), S('Title: “Précis map showing the old town, container port, airport and mangrove reserve of Port Avela, 2020”.', 'title: what, where, when', true)],
          earns: 'Achieved: all main conventions named and an appropriate title.', crit: { A: 'Names the conventions (title, key, north arrow, scale, border, source) and gives a title including what, where and when.' } },
        { q: 'Describe how you would make the précis map accurate, using the grid references in the resource.', write: true, words: '60–90',
          model: [S('I would match the grid on the source map to the frame and place each feature square by square: port 2041, old town 2242, mangrove reserve 2348, industrial island 1840, airport 2643.', 'placing with references', true), S('I would draw each area in its correct size and shape, for example the airport as a long strip on the east coast.', 'size and shape', true), S('I would use a ruler for straight edges, colour each area, and put every colour and symbol in the key.', 'tools and key')],
          earns: 'Merit: a precise method using the grid references, with attention to size, shape and the key.', crit: { M: 'Explains a precise method: matching grids, placing with grid references, correct size and shape, ruler, colours matching key.' } },
        { q: 'Explain what a précis map of Port Avela in 1950 and one in 2020 would show about change on the island, and why.', write: true, words: '110–150',
          model: [S('In 1950 the map would show a small old town (2242) beside the harbour and large mangrove forests, 120 km², in the north.', '1950', true), S('By 2020 it would show urban land covering 84% of the island, an airport (2643) and an industrial island (1840) on reclaimed land, and only 36 km² of mangroves in a reserve.', '2020 with data'), S('The change came because the island’s location on a busy shipping route attracted trade and people: population rose from 0.2 to 3.4 million.', 'cause', true), S('Because the island is small, growth pushed into the mangroves and out into the sea.', 'interaction'), S('Comparing the two maps shows how quickly a cultural environment can replace a natural one, and why the 2005 reserve was needed to protect what was left.', 'insight', true)],
          earns: 'Excellence: the change between the maps is explained with precise evidence and insight.',
          crit: { M: 'Describes and explains differences between the two maps with evidence.', E: 'Comprehensively explains change between 1950 and 2020 with grid references and data, linked to location and limited space, with insight (natural to cultural environment, need for the reserve).' } },
      ],
      up: [
        up(1, ['I would draw the features in the right places and add a key.'], [
          ['Say how: match the grids, place each feature square by square using the references (2041, 2242, 2348, 1840, 2643), keep size and shape, use a ruler, and match colours to the key', 1, 'Right. Merit: a precise, accurate method.'],
          ['Add that you would use colour', 0, 'Not the main point.'],
          ['Say it would be neat', 0, 'Vague.'],
          ['Add the title again', 0, 'Not the method.']]),
        up(2, ['The 2020 map would have more buildings and fewer mangroves.'], [
          ['Locate and quantify the changes (urban 15% → 84%; mangroves 120 → 36 km²; airport 2643; industrial island 1840), explain why (location, small island), and add insight (natural to cultural environment; the 2005 reserve)', 1, 'Right. Excellence: precise evidence with insight.'],
          ['Draw both maps', 0, 'The question asks you to explain.'],
          ['Say development is good', 0, 'Opinion.'],
          ['Repeat the conventions', 0, 'Off the question.']]),
      ],
    },
  });

  /* ======================= 4. Graphs and patterns ======================= */
  const seriesQ = () => {
    // a random growth series with one clear fastest decade
    const y0 = R.pick([1960, 1970, 1980]), n = 6, base = R.int(2, 6) / 10; let v = base; const pts = [[y0, base]];
    const fast = R.int(1, n - 1);
    for (let k = 1; k < n; k++) { v += k === fast ? R.int(10, 14) / 10 : R.int(1, 4) / 10; pts.push([y0 + k * 10, +v.toFixed(1)]); }
    const ymax = Math.ceil(v + 0.5);
    const fig = G.line([{ name: 'population', pts }], { x0: y0, x1: y0 + (n - 1) * 10, y0: 0, y1: ymax, xstep: 10, ystep: 1, ylab: 'Population (millions)', title: 'Population of another coastal city (practice data, not Port Avela)' });
    const t = R.pick(['fast', 'value', 'pct']);
    if (t === 'fast') { const ch = (k) => `${pts[k - 1][0]}–${pts[k][0]}`; const opts = R.shuffle([1, 2, 3, 4, 5].filter((k) => k !== fast)).slice(0, 3);
      return P.mcq({ prompt: 'During which decade did the population grow fastest?', fig, more: { idea: 'The steepest part of the line shows the fastest change.', steps: [St(`Steepest section: ${ch(fast)}, from ${pts[fast - 1][1]} to ${pts[fast][1]} million.`)] } }, [{ t: ch(fast), ok: true, why: `It rose ${P.n(pts[fast][1] - pts[fast - 1][1], 1)} million in that decade, the steepest part of the line.` }].concat(opts.map((k) => ({ t: ch(k), why: `Only ${P.n(pts[k][1] - pts[k - 1][1], 1)} million in that decade.` })))); }
    if (t === 'value') { const k = R.int(1, n - 1); return { kind: 'num', answer: pts[k][1], dp: 1, tol: 0.15, prompt: `Read the graph. What was the population in ${pts[k][0]}?`, fig, fmt: 'Give millions to 1 decimal place.', more: { steps: [St(`Find ${pts[k][0]} on the x-axis, go up to the line, then across to the y-axis: about ${pts[k][1]} million.`)] }, sol: [`about ${pts[k][1]} million`] }; }
    const a = pts[0][1], b = pts[n - 1][1], ans = ((b - a) / a) * 100;
    return { kind: 'num', answer: ans, dp: 0, tol: 0.6, prompt: `Calculate the percentage increase in population from ${pts[0][0]} to ${pts[n - 1][0]}.`, fig, fmt: 'Give a whole-number percentage (no % sign).', wrong: [{ v: ((b - a) / b) * 100, msg: 'Divide by the starting value.' }], more: { steps: [St(`Increase: ${b} − ${a} = ${P.n(b - a, 1)} million.`), St(`÷ ${a} × 100 = ${P.f(ans, 0)}%.`)] }, sol: [`(${b} − ${a}) ÷ ${a} × 100 = ${P.f(ans, 0)}%`] };
  };
  P.addUnit({
    id: 'graphs', title: 'Describing patterns in graphs', mins: 11,
    blurb: 'Trend, data, exception: describe a pattern so it earns Merit, then explain it.',
    recap: 'To describe a pattern in a graph, use TDE: the general Trend (rising, falling, steady, fluctuating), Data to prove it (values with units and years, the amount and rate of change), and any Exception (a period that does not fit, or the fastest or slowest change). A temporal pattern is change over time; a spatial pattern is how something is spread over an area. Describe before you explain. To explain, link the pattern to causes from the resources. Compare two graphs for relationships: a positive relationship (both rise together) or a negative one (one rises as the other falls). The 2025 Merit evidence described the pattern in detail with data, “population rising from 50 000 to 5.7 million while urban area rose from 30% to 99%”, and identified “a positive relationship”. Excellence used the longer time frame and explained the link clearly.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>TDE</h2>'), C(3, '<p>Trend: what is the overall direction?</p>'), C(6.5, '<p>Data: start and end values, with units and years.</p>'), C(9.5, '<p>Exception: the fastest, slowest or odd period.</p>')],
        board: [F(0.5, avelaPop())] },
      { dur: 14, card: [C(0, '<h2>The Merit description</h2>'), C(3, '<p>Not “it went up”. Quantify it, and name the fastest period.</p>')],
        board: [L(0.5, '<b>T</b>: population rose steadily from 1950 to 2020'), L(3, '<b>D</b>: from 0.2 million (1950) to 3.4 million (2020), 17 times larger'), L(5.5, '<b>E</b>: fastest from 1970 to 2010 (+0.5 to +0.7 million a decade); slowing after 2010'), L(8, 'relationship: as population rose, urban area rose (15% → 84%): positive', '', { hl: true })] },
    ],
    example: {
      fig: avelaPop(),
      problem: 'Describe the pattern shown in Figure 1 (population of Port Avela, 1950–2020) in detail.',
      steps: [
        { m: 'Trend: the population of Port Avela increased throughout the period, from 1950 to 2020.', note: 'trend' },
        { m: 'Data: it rose from 0.2 million in 1950 to 3.4 million in 2020, a 17-fold increase.', note: 'data with units and years' },
        { m: 'Exception: growth was fastest from 1970 to 2010 (about 0.5–0.7 million each decade) and slowed after 2010, rising only 0.4 million to 2020.', note: 'rate and exception' },
        { m: 'So this is a temporal pattern of rapid growth that is now slowing.', note: 'summary using the concept' },
      ],
    },
    faded() { return seriesQ(); },
    grades: 'AAAMMM',
    gens: [
      seriesQ,
      seriesQ,
      P.terms([['temporal pattern', 'How something changes over time.'], ['spatial pattern', 'How something is spread or arranged over an area.'], ['positive relationship', 'As one variable increases, the other increases too.'], ['negative relationship', 'As one variable increases, the other decreases.'], ['trend', 'The general direction of change shown by a graph.'], ['anomaly (exception)', 'A value or period that does not fit the general pattern.']]),
      () => P.mcq({ prompt: 'Which is the best (Merit-level) description of the pattern in Figure 1?', fig: avelaPop(), more: { idea: 'TDE: trend, data, exception.', steps: [St('Trend: rising. Data: 0.2 → 3.4 million, 1950–2020. Exception: fastest 1970–2010, slowing after 2010.')] } }, [
        { t: 'Population rose from 0.2 million in 1950 to 3.4 million in 2020, fastest between 1970 and 2010, then slowing after 2010', ok: true, why: 'Trend, data with years and units, and the rate and exception.' },
        { t: 'The population went up a lot', why: 'A trend, but no data: Achieved at best.' },
        { t: 'Population was 3.4 million', why: 'One value, no pattern.' },
        { t: 'The population went up because of the port', why: 'An explanation, not a description; and no data.' }]),
      () => P.mcq({ prompt: 'Port Avela’s population rose from 0.2 to 3.4 million (1950–2020), while mangrove forest fell from 120 to 36 km². What is the relationship?', more: { steps: [St('As population rose, mangrove area fell.'), St('One up, the other down: a negative relationship.')] } }, [
        { t: 'A negative relationship: as population rose, mangrove area fell', ok: true, why: 'Opposite directions.' },
        { t: 'A positive relationship', why: 'Positive means both rise together.' },
        { t: 'No relationship', why: 'There is a clear one.' },
        { t: 'A spatial pattern', why: 'This is a relationship between two temporal patterns.' }]),
      P.bank([
        { q: 'The urban area of Port Avela rose from 15% (1950) to 84% (2020) as population rose from 0.2 to 3.4 million. Which explanation shows Excellence-level thinking?', a: 'A growing population needs homes, jobs and transport, so urban land expands; on a small island it can only spread into the mangroves or out into the sea', why: 'It explains the relationship and links it to the island’s limited space, like the 2025 Excellence evidence.', w: [['Urban area rose', 'Description.'], ['Because there are more people', 'Too thin.'], ['The graph goes up', 'Description.']] },
      ], { grade: 'M' }),
    ],
    tips: [
      'Describe with <span class="pen">TDE</span>: trend, data (values, units, years), exception (fastest, slowest, odd period).',
      'Describe first, then explain, using the resource.',
      'Name relationships: positive or negative.',
      'Do not copy the resource booklet: the 2024 report said Achieved answers often copied it. Use the data to make your own point.',
    ],
    aim: {
      intro: AVELA,
      fig: avelaPop(),
      parts: [
        { q: 'Describe one temporal pattern shown in the resource, using data.', write: true, words: '30–60',
          model: [S('The population of Port Avela increased throughout the period.', 'trend', true), S('It rose from 0.2 million in 1950 to 3.4 million in 2020, growing fastest between 1970 and 2010 and slowing after 2010.', 'data and exception', true)],
          earns: 'Achieved: a pattern described with data.', crit: { A: 'Describes a temporal pattern (population, urban area or mangroves) with some data.' } },
        { q: 'Describe in detail the relationship between population and urban area, then explain it.', write: true, words: '70–110',
          model: [S('As population rose from 0.2 million (1950) to 3.4 million (2020), urban area rose from 15% to 84% of the island: a positive relationship.', 'relationship with data', true), S('Population grew fastest between about 1970 and 2010, while urban area rose steadily throughout.', 'detail'), S('More people need homes, workplaces, roads and services, so built-up land expands as population grows.', 'explanation', true), S('Trade from the port (1972) and the airport (1981) brought jobs that attracted people.', 'cause from the resource')],
          earns: 'Merit: the relationship is described in detail with data and explained.', crit: { M: 'Describes the positive relationship in detail with data for both, and explains it (housing, jobs, services; port and airport).' } },
        { q: 'Explain the relationships between population, urban area and mangrove forest on Port Avela, and their significance for people and the environment.', write: true, words: '120–170',
          model: [S('Population (0.2 → 3.4 million) and urban area (15% → 84%) have a positive relationship; both have a negative relationship with mangrove forest (120 → 36 km²).', 'relationships with data', true), S('Trade from the harbour, the container terminal (1972) and the airport (1981) created jobs, so people came, and they needed land.', 'cause'), S('On an island only about 30 km across, growth spread into the mangroves in the north and onto reclaimed land.', 'interaction with location'), S('For people, this brought jobs and higher incomes; for the environment, it removed habitat and natural coastal protection.', 'significance'), S('The loss slowed after the reserve was created in 2005 (38 km² in 2010, 36 km² in 2020), which suggests planning can balance growth with protecting the environment.', 'insight: sustainability', true)],
          earns: 'Excellence: all three relationships explained with data, with insight into significance and sustainability.',
          crit: { M: 'Describes and explains two relationships with data.', E: 'Comprehensively explains positive and negative relationships between all three variables with data, links them to the island’s location and size, and shows insight into significance for people and environment (sustainability, effect of the 2005 reserve).' } },
      ],
      up: [
        up(1, ['As the population went up the city got bigger because people need houses.'], [
          ['Quantify both (0.2 → 3.4 million; 15% → 84%), name it a positive relationship, note the fastest period, and explain with causes from the resource (port 1972, airport 1981)', 1, 'Right. Merit: detailed description with data, then explanation.'],
          ['Say it is a big change', 0, 'Vague.'],
          ['Copy the resource list', 0, 'Copying earns little.'],
          ['Draw the graph again', 0, 'Not the missing part.']]),
        up(2, ['More people meant more city and fewer mangroves, which is bad for the environment.'], [
          ['Give the three relationships with data, explain the causes and the island’s size, weigh the significance for people and environment, and use the 2005 reserve as evidence about sustainability', 1, 'Right. Excellence: comprehensive and insightful.'],
          ['Add that mangroves are trees', 0, 'Not the missing depth.'],
          ['Say people should protect nature', 0, 'Opinion.'],
          ['Repeat the population data', 0, 'Already given.']]),
      ],
    },
  });

  /* ======================= 5. Timelines ======================= */
  const posQ = () => {
    const y0 = R.pick([1800, 1850, 1900]), y1 = 2025, len = R.pick([15, 18, 20]); const y = R.int(y0 + 10, 2020);
    const ans = ((y - y0) / (y1 - y0)) * len;
    return { kind: 'num', answer: ans, dp: 1, tol: 0.15, prompt: `You draw a timeline ${len} cm long, from ${y0} at the left end to ${y1} at the right end. How far from the left end should you mark the year ${y}?`, fmt: 'Give centimetres to 1 decimal place.',
      wrong: [{ v: ((y - y0) / (y1 - y0)) * 100, msg: 'That is a percentage. Multiply the fraction by the length in cm.' }],
      more: { idea: 'A timeline must be to scale: equal distances for equal times.', steps: [St(`Fraction of the way along: (${y} − ${y0}) ÷ (${y1} − ${y0}) = ${P.f((y - y0) / (y1 - y0), 3)}.`), St(`× ${len} cm = ${P.f(ans, 1)} cm.`)] }, sol: [`(${y} − ${y0}) ÷ (${y1} − ${y0}) × ${len} = ${P.f(ans, 1)} cm`] };
  };
  const orderQ = () => { const ev = R.shuffle(EVENTS).slice(0, 5).sort((a, b) => a[0] - b[0]);
    return { kind: 'order', prompt: 'Put these events from the Port Avela resource in chronological order (earliest first).', items: ev.map(([, t]) => t), more: { idea: 'Chronological = in time order.', steps: ev.map(([y, t]) => St(`${y}: ${t}`)) } }; };
  P.addUnit({
    id: 'timelines', title: 'Timelines', mins: 9,
    blurb: 'In order, to scale, labelled, with a title. The 2025 paper asked for exactly this.',
    recap: 'A timeline shows events in chronological order along a line drawn to scale, so equal lengths of line stand for equal lengths of time. Choose a sensible scale that fits the space (for example 1 cm = 10 years), mark regular dates along the line, then place each event at its exact date and label it (with the event or its number). Give it an accurate title saying what, where and when, for example “Timeline of key events in the development of Port Avela, 1819–2018”. The 2025 paper asked for five events on a timeline with an accurate title; the schedule gave Achieved for placing events “with some level of accuracy” and Merit for “a high level of accuracy”, accurately located and labelled. Use a ruler.',
    scenes: [
      { dur: 13, card: [C(0, '<h2>To scale</h2>'), C(3, '<p>Equal distances for equal times. Pick a scale that fits: 1 cm = 10 years.</p>'), C(8, '<p>Then place each event exactly, and label it.</p>')],
        board: [F(0.5, G.timeline(EVENTS.map(([y, t], k) => ({ y, t: String(k + 1) })), { y0: 1800, y1: 2040, step: 40, title: 'Timeline of key events in the development of Port Avela, 1819–2018' }))] },
      { dur: 12, card: [C(0, '<h2>Checklist</h2>'), C(3, '<p>Ruler, scale, dates, labels, title.</p>')],
        board: [L(0.5, 'events in chronological order'), L(3, 'regular intervals marked along the line'), L(5.5, 'each event at its exact year, labelled'), L(8, 'title: what + where + when', '', { hl: true })] },
    ],
    example: {
      fig: G.timeline(EVENTS.map(([y], k) => ({ y, t: String(k + 1) })), { y0: 1800, y1: 2040, step: 40, title: 'Timeline of key events in the development of Port Avela, 1819–2018' }),
      problem: 'Draw a timeline 18 cm long of the Port Avela events from 1800 to 2040. Where do 1972 and 2005 go?',
      steps: [
        { m: 'The line covers 240 years in 18 cm, so 1 cm = 240 ÷ 18 ≈ 13.3 years. Simpler: make it 24 cm long, 1 cm = 10 years, if there is room.', note: 'choose the scale' },
        { m: 'With 18 cm: 1972 is (1972 − 1800) ÷ 240 × 18 = 12.9 cm from the left end.', note: 'place 1972' },
        { m: '2005 is (2005 − 1800) ÷ 240 × 18 = 15.4 cm from the left end.', note: 'place 2005' },
        { m: 'Label each mark, add dates every 40 years, and title it: “Timeline of key events in the development of Port Avela, 1819–2018”.', note: 'labels and title' },
      ],
    },
    faded() { return orderQ(); },
    grades: 'AAAM',
    gens: [
      orderQ,
      posQ,
      () => P.mcq({ prompt: 'Which is the best title for a timeline of the Port Avela events?', more: { steps: [St('What (key events in the development), where (Port Avela), when (1819–2018).')] } }, [
        { t: 'Timeline of key events in the development of Port Avela, 1819–2018', ok: true, why: 'Accurate: what, where and when.' },
        { t: 'Timeline', why: 'Missing what, where and when.' },
        { t: 'Port Avela', why: 'Missing what and when.' },
        { t: 'Events that happened', why: 'Vague.' }]),
      P.bank([
        { q: 'A student spaces five events evenly along the line, whatever their dates. What is wrong?', a: 'The timeline is not to scale: equal distances must stand for equal times', why: 'Merit needs “a high level of accuracy”.', w: [['Nothing: even spacing looks neat', 'It is inaccurate.'], ['It needs more colour', 'Not the issue.'], ['The events should be in reverse order', 'No.']] },
        { q: 'You must fit 1819 to 2018 on a line 24 cm long. Which scale is sensible?', a: 'Start at 1800 and end at 2040: 240 years in 24 cm, 1 cm = 10 years', why: 'Round start and end dates and a round scale make placing easier.', w: [['1 cm = 1 year', '240 cm: far too long.'], ['1 cm = 100 years', 'Events would be squashed together.'], ['No scale is needed', 'It must be to scale.']] },
      ], { grade: 'M' }),
    ],
    tips: [
      'Put events in <span class="pen">chronological order</span>, to scale, with a ruler.',
      'Mark regular dates (every 10, 20 or 50 years); place each event at its exact year and label it.',
      'Title: what + where + when. The 2025 paper asked for “an accurate title”.',
      'Check the arithmetic: (year − start) ÷ (end − start) × length.',
    ],
    aim: {
      intro: AVELA,
      parts: [
        { q: 'List the six Port Avela events in chronological order and write an accurate title for a timeline of them.', write: true, words: '40–70',
          model: [S('1819 trading post; 1965 independence; 1972 container terminal; 1981 airport; 2005 mangrove reserve; 2018 mega-port.', 'order', true), S('Title: “Timeline of key events in the development of Port Avela, 1819–2018”.', 'title', true)],
          earns: 'Achieved: correct order and an accurate title.', crit: { A: 'All six events in correct order with years; title includes what, where and when.' } },
        { q: 'Explain how you would draw the timeline accurately on a line 24 cm long.', write: true, words: '60–90',
          model: [S('I would run the line from 1800 to 2040, so 240 years fit in 24 cm: 1 cm = 10 years.', 'scale', true), S('I would mark dates every 20 years (every 2 cm) with a ruler.', 'intervals'), S('Each event goes at (year − 1800) ÷ 10 cm: for example 1972 at 17.2 cm and 2005 at 20.5 cm, each labelled.', 'placing with working', true)],
          earns: 'Merit: a precise, to-scale method with worked positions.', crit: { M: 'Chooses a sensible scale, explains marking intervals with a ruler, and calculates positions accurately (e.g. 1972 at 17.2 cm).' } },
        { q: 'Using the timeline and the data, explain how the timing of events helps explain change on Port Avela.', write: true, words: '110–150',
          model: [S('The resource gives no data before 1950, but after independence (1965) events came quickly: the container terminal (1972) and the airport (1981).', 'timing', true), S('These match the fastest population growth, from 0.6 million (1970) to 2.3 million (2000), as trade and jobs drew people in.', 'link to data'), S('That growth cleared mangroves fastest in the same period, from 95 km² (1970) to 45 km² (2000).', 'environmental change'), S('The reserve came only in 2005, after most mangroves were gone, and the 2018 mega-port was built on reclaimed land rather than forest.', 'response'), S('So the timeline shows cause and effect: independence and trade projects drove rapid change, and environmental protection followed later, as a response to that change.', 'insight', true)],
          earns: 'Excellence: the sequence of events is linked to the data to explain change, with insight.',
          crit: { M: 'Links events to changes in the data.', E: 'Comprehensively explains how the timing of events relates to population, urban and mangrove change, using data, with insight (cause and effect; protection as a later response).' } },
      ],
      up: [
        up(1, ['I would draw a line and put the dates on it in order.'], [
          ['Choose a scale (1800–2040, 1 cm = 10 years), mark intervals with a ruler, and calculate each position (1972 at 17.2 cm), labelling each event', 1, 'Right. Merit: accurate, to-scale method.'],
          ['Add colours', 0, 'Not accuracy.'],
          ['Space them evenly', 0, 'That is not to scale.'],
          ['Add a title only', 0, 'Not enough.']]),
        up(2, ['After independence lots of things happened and the island grew.'], [
          ['Link each period of events to the data (population, urban area, mangroves) with figures, and explain the sequence as cause and effect, including the reserve as a later response', 1, 'Right. Excellence: evidence and insight.'],
          ['List the events again', 0, 'Description.'],
          ['Say independence is good', 0, 'Opinion.'],
          ['Draw the timeline', 0, 'Explain, not draw.']]),
      ],
    },
  });

  /* ======================= 6. Concepts and the extended answer ======================= */
  const KC = [
    ['environments', 'Natural and/or cultural surroundings, with characteristics that come from natural and/or cultural processes.'],
    ['location', 'Where something is, absolute or relative; it can be an advantage or a constraint.'],
    ['accessibility', 'How easily a place can be reached, by land, sea or air.'],
    ['perspectives', 'Ways of seeing the world, shaped by values, that explain people’s decisions about environments.'],
    ['change', 'Any alteration to a natural or cultural environment, spatial or temporal, at varying rates.'],
    ['interaction', 'Elements of an environment affecting each other and linked together; one-way or two-way.'],
    ['sustainability', 'Meeting the needs of people now without reducing the ability of future generations to meet theirs: social, economic and environmental.'],
    ['patterns', 'Regular arrangements of features in space (spatial) or over time (temporal).'],
  ];
  const SEE = [['New jobs at the mega-port', 1], ['Higher incomes from tourism', 1], ['Land prices rise', 1], ['Families move into new housing estates', 0], ['Better access to schools and hospitals', 0], ['Old neighbourhoods are demolished', 0], ['Mangrove habitat is lost', 2], ['Coastal flooding risk rises without mangroves', 2], ['Air pollution from aircraft', 2], ['Fish breeding grounds damaged by reclamation', 2]];
  P.addUnit({
    id: 'concepts', title: 'Concepts and the extended answer', mins: 12,
    blurb: 'Change, sustainability, location and accessibility: how to use concepts in the final question, the one people leave blank.',
    recap: 'The last part of the skills paper is an extended answer that applies concepts to the given environment, for example: how location and accessibility contributed to change (2025, Singapore); how social, economic and environmental sustainability were affected by change (2024, Stratford, London); how interaction changed people’s perspectives (2023, Lake Mead). Key concepts include environments, location, accessibility, perspectives, change, interaction, patterns and sustainability; their definitions are in the resource booklet. Classify changes as natural or cultural, positive or negative, and social, economic or environmental. For the extended answer: use the planning box; cover every aspect asked (the 2025 Excellence answers covered all three: location and accessibility, natural environment, cultural environment); use specific evidence from several resources, in your own words; explain links between aspects; and end with insight, such as a prediction for the future. The 2025 report: many candidates left this final concept question incomplete.',
    scenes: [
      { dur: 14, card: [C(0, '<h2>Classify the change</h2>'), C(3, '<p>Natural or cultural? Positive or negative? Social, economic or environmental?</p>'), C(8.5, '<p>Every classification needs evidence from the resource.</p>')],
        board: [L(0.5, '<b>social</b>: people’s lives: housing, health, education, community'), L(3, '<b>economic</b>: jobs, incomes, trade, costs'), L(5.5, '<b>environmental</b>: land, water, air, habitats'), L(8, 'sustainability = all three, now and for the future', '', { hl: true })] },
      { dur: 14, card: [C(0, '<h2>The extended answer</h2>'), C(3, '<p>Plan first. Cover every aspect. Evidence in every paragraph.</p>'), C(8.5, '<p>Link the aspects, then look ahead. Do not leave it blank.</p>')],
        board: [L(0.5, '1. each aspect asked for gets a paragraph'), L(3, '2. specific evidence: data, grid references, dates'), L(5.5, '3. explain the links between aspects'), L(8, '4. insight: what next? who gains, who loses?', '', { hl: true })] },
    ],
    example: {
      problem: 'How has the location and accessibility of Port Avela contributed to the development and change of its natural and cultural environment over time? (Like the 2025 paper.)',
      steps: [
        { m: 'Location and accessibility: Port Avela lies on a busy shipping route with a deep natural harbour, so it was accessible by sea; a trading post began in 1819, the container terminal in 1972, and the airport in 1981.', note: 'aspect 1 with evidence' },
        { m: 'Cultural environment: trade brought jobs and people: population rose from 0.2 million (1950) to 3.4 million (2020) and urban land from 15% to 84% of the island.', note: 'aspect 2 with data' },
        { m: 'Natural environment: the small island had little spare land, so mangroves fell from 120 to 36 km² and the coast was reclaimed for the airport (2643) and the industrial island (1840).', note: 'aspect 3 with data and references' },
        { m: 'Links: accessibility drove trade, trade drove population growth, and growth replaced natural environment with cultural; the reserve (2005) shows a response.', note: 'interrelationship' },
        { m: 'Future: the 2018 mega-port will increase trade further, so pressure on the remaining 36 km² of mangroves and on the sea will grow unless reclamation and protection are planned sustainably.', note: 'insight: prediction' },
      ],
    },
    faded() { return G.sortGen(SEE, ['Social', 'Economic', 'Environmental'], { n: 4, prompt: 'Sort each effect of change on Port Avela: social, economic or environmental?' })(); },
    grades: 'AAAMME',
    gens: [
      P.terms(KC),
      G.sortGen(SEE, ['Social', 'Economic', 'Environmental'], { n: 5, prompt: 'Sort each effect of change on Port Avela: social, economic or environmental?', idea: 'The 2024 Not Achieved answers could not identify social, economic and environmental factors in the resources.' }),
      G.sortGen([['Mangroves cleared for housing', 1], ['Land reclaimed for an airport', 1], ['A river meander cut off by a flood', 0], ['A storm erodes the beach', 0], ['A new bridge to the mainland', 1], ['An earthquake lifts part of the coast', 0], ['A landslide blocks a mountain valley', 0], ['A nature reserve is created', 1]], ['Natural change', 'Cultural change'], { n: 5, prompt: 'Sort each change: natural or cultural?' }),
      P.bank([
        { q: '“As Las Vegas grew, it took more water from Lake Mead, so the lake shrank.” Which concept does this sentence show most clearly?', a: 'Interaction', why: 'Elements of the environment (a city and a lake) affecting each other.', w: [['Location', 'Not the main idea.'], ['Patterns', 'Not the main idea.'], ['Perspectives', 'No viewpoint is described.']] },
        { q: '“The island’s small size meant it had to build into the sea.” Which concept is this?', a: 'Location as a constraint', why: 'Location can be an advantage or a constraint.', w: [['Accessibility', 'Not about ease of reaching it.'], ['Perspectives', 'No viewpoint.'], ['Sustainability', 'Not directly.']] },
        { q: 'Why was the mangrove reserve (2005) a significant change?', a: 'It slowed the loss of mangroves (45 km² in 2000, 36 km² in 2020), protecting habitat and the coast for the future', why: 'Significance: who or what it affects, how much, and for how long.', w: [['It was created in 2005', 'A date, not significance.'], ['Mangroves are trees', 'Description.'], ['It made the island bigger', 'No.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'What did the 2025 Excellence answers to the final question do that Merit answers did not?', a: 'Covered all three aspects with a wide range of specific evidence, showed insight, and predicted future development', why: 'From the 2025 schedule.', w: [['Wrote a longer introduction', 'Not the criterion.'], ['Defined every concept', 'Definitions are in the booklet.'], ['Copied more of the resource', 'Copying earns little.']] },
      ], { grade: 'M' }),
      P.bank([
        { q: 'Which ending to an extended answer shows insight?', a: 'With the 2018 mega-port, trade will keep growing, so pressure on the last 36 km² of mangroves will rise unless reclamation is planned sustainably', why: 'A justified prediction based on the evidence.', w: [['In conclusion, Port Avela has changed', 'Restates.'], ['Port Avela is a nice place', 'Opinion.'], ['The end', 'No.']] },
      ], { grade: 'E' }),
    ],
    tips: [
      '<span class="pen">Do not leave the final question blank.</span> The 2025 report: many papers left the final concept question incomplete or unanswered. Watch the time.',
      'Cover every aspect asked: the 2025 Excellence answers covered location and accessibility, the natural environment and the cultural environment.',
      'Use evidence from several resources in your own words; the 2024 Achieved answers often copied the booklet.',
      'Classify changes: social, economic, environmental; natural or cultural; positive or negative.',
      'Finish with insight: a prediction or a judgement about sustainability.',
    ],
    aim: {
      intro: AVELA,
      parts: [
        { q: 'Identify one social, one economic and one environmental change on Port Avela, with evidence.', write: true, words: '40–70',
          model: [S('Social: the population grew from 0.2 million (1950) to 3.4 million (2020), so many more people live in new urban areas.', 'social', true), S('Economic: the container terminal (1972), airport (1981) and mega-port (2018) brought trade and jobs.', 'economic', true), S('Environmental: mangroves fell from 120 km² to 36 km², and land was reclaimed from the sea.', 'environmental', true)],
          earns: 'Achieved: one change of each kind, with evidence from the resource.', crit: { A: 'Identifies a social, an economic and an environmental change, each with evidence.' } },
        { q: 'Explain the significance of the land reclamation for people and the environment of Port Avela.', write: true, words: '80–120',
          model: [S('Reclamation created land for the airport (2643, 1981), the industrial island (1840) and the mega-port (2018).', 'what, with evidence', true), S('For people, it allowed trade and jobs to grow without demolishing the old town, supporting a population of 3.4 million.', 'significance for people', true), S('For the environment, it covered seabed and coastal habitats, and together with mangrove clearing it removed natural protection from storms and fish breeding grounds.', 'significance for environment'), S('So it was economically vital but environmentally costly.', 'balance')],
          earns: 'Merit: significance explained in detail for people and environment, with evidence.', crit: { M: 'Explains in detail the significance of reclamation for people (land, jobs, trade) and environment (habitat, coast), with evidence.' } },
        { q: 'How has the location and accessibility of Port Avela contributed to the development and change of its natural and cultural environment over time?', write: true, words: '170–230',
          model: [S('Location and accessibility: on a busy shipping route with a deep harbour, Port Avela was easy to reach by sea, so a trading post began in 1819; the container terminal (1972), airport (1981) and bridge made it accessible by sea, air and land.', 'aspect 1', true), S('Cultural environment: trade created jobs and drew people in: population rose from 0.2 to 3.4 million (1950–2020) and urban land from 15% to 84%.', 'aspect 2 with data'), S('Natural environment: on an island only 30 km across, growth spread into the mangroves (120 → 36 km²) and out into the sea through reclamation at 2643 and 1840.', 'aspect 3 with data and references', true), S('These are linked: accessibility drove trade, trade drove growth, and growth replaced natural with cultural environment; the 2005 reserve shows people responding once the loss was obvious.', 'interrelationship'), S('In future, the 2018 mega-port will increase accessibility and trade again, so pressure on the remaining mangroves and the sea will grow; whether the island develops sustainably depends on how it balances reclamation and protection.', 'insight: prediction', true)],
          earns: 'Excellence: all three aspects covered with a wide range of specific evidence, their links explained, and a reasoned prediction (as in the 2025 Excellence evidence).',
          crit: { M: 'Explains, in detail, two aspects and how they are linked, with evidence.', E: 'Comprehensively covers all three aspects (location and accessibility; natural environment; cultural environment) with a wide range of specific evidence from the resource, explains the interrelationships, uses geographic terminology, and predicts future development with insight.' } },
      ],
      up: [
        up(1, ['Reclamation gave more land for the airport but damaged the environment.'], [
          ['Use evidence (airport 2643 in 1981; industrial island 1840; mega-port 2018), explain the significance for people (trade, jobs, space for 3.4 million) and for the environment (habitat, coastal protection) in detail', 1, 'Right. Merit: detailed significance with evidence.'],
          ['Define reclamation', 0, 'Not significance.'],
          ['Say it was a good idea', 0, 'Opinion.'],
          ['Add a map', 0, 'Helpful, but not the explanation.']]),
        up(2, ['Port Avela is in a good location so lots of people came and the mangroves were cut down.'], [
          ['Cover all three aspects with a range of specific evidence (dates, data, grid references), explain how they link, and finish with a reasoned prediction about the future', 1, 'Right. Excellence: comprehensive, linked, insightful.'],
          ['Add the definitions of the concepts', 0, 'They are in the booklet.'],
          ['Copy the resource box', 0, 'Copying earns little.'],
          ['Write about Singapore instead', 0, 'Use the given environment.']]),
      ],
    },
  });
})();
