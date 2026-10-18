/* Print one rendered example of every generator, for a human read-through of the maths.
   Usage: node tools/sample-questions.js maths-l2 [reps] [--more] > samples.txt   (--more adds the step-by-step walkthroughs) */
const vm = require('vm'), fs = require('fs'), path = require('path');
const subject = process.argv[2] || 'maths-l2', root = path.join(__dirname, '..');
const ctx = { console, Math, JSON }; ctx.window = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx);
['shared/js/core.js', 'shared/js/player.js', 'shared/js/quiz.js'].forEach(load);
for (const f of ['algebra', 'calculus', 'probability']) if (fs.existsSync(path.join(root, subject, 'js', f + '.js'))) load(path.join(subject, 'js', f + '.js'));
const P = ctx.NP; const strip = (s) => String(s || '').replace(/<svg[\s\S]*?<\/svg>/g, '[figure]').replace(/<table[\s\S]*?<\/table>/g, (t) => '[table ' + t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() + ']').replace(/<[^>]+>/g, '');
const reps = +process.argv[3] || 1, showMore = process.argv.includes('--more');
for (const u of P.units) {
  console.log('\n######## ' + u.id + ' — ' + u.title);
  const gens = [['faded', u.faded], ...u.gens.map((g, k) => ['gen' + k, g])];
  for (const [name, g] of gens) for (let r = 0; r < reps; r++) {
    const q = g();
    console.log(`\n[${name}] ${strip(q.prompt)}`);
    if (q.fig) console.log('  fig: ' + strip(q.fig));
    if (q.scaffold) console.log('  given: ' + q.scaffold.map(strip).join(' | '));
    if (q.kind === 'mcq') q.choices.forEach((c) => console.log(`  ${c.ok ? '✓' : ' '} ${strip(c.t)}${c.ok ? '' : '   — ' + strip(c.why)}`));
    else console.log('  ANSWER: ' + JSON.stringify(q.answer) + (q.dp != null ? ` (dp ${q.dp})` : '') + (q.ordered ? ' ordered' : ''));
    if (q.sol) console.log('  sol: ' + q.sol.map(strip).join(' | '));
    if (showMore && q.more) { const d = q.more; console.log('  MORE:'); d.steps.forEach((st, i) => console.log(`   ${i + 1}. ${strip(st.say || '')}${st.m ? '  ⟶ ' + strip(st.m) : ''}`)); if (d.check) console.log('   check: ' + strip(d.check)); if (d.trap) console.log('   trap: ' + strip(d.trap)); }
  }
}
