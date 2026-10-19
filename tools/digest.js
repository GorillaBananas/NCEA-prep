/* Export a plain-text content digest of one subject, for content review (no code, no diagrams).
   Usage: node tools/digest.js geography-l2 [samples per generator, default 6] > digest.txt
   Contains: each unit's summary, explainer text, worked example, exam tips, Aim higher (questions, model answers,
   marking points, upgrade questions), and a de-duplicated sample of generated quiz questions with their marked answers. */
const vm = require('vm'), fs = require('fs'), path = require('path');
const subject = process.argv[2] || 'geography-l2', N = +process.argv[3] || 6;
const root = path.join(__dirname, '..');
const ctx = { console, Math, JSON, Number, String, Object, Array, Set, Promise, isFinite, parseFloat, encodeURIComponent, decodeURIComponent };
ctx.window = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
['shared/js/core.js', 'shared/js/player.js', 'shared/js/quiz.js', 'shared/js/kinds.js'].forEach(load);
if (fs.existsSync(path.join(root, 'shared/js/econ.js'))) load('shared/js/econ.js');
const html = fs.readFileSync(path.join(root, subject, 'index.html'), 'utf8');
[...html.matchAll(/src="js\/([\w-]+)\.js"/g)].map((m) => m[1]).filter((f) => f !== 'config').forEach((f) => load(path.join(subject, 'js', f + '.js')));
const P = ctx.NP; let cfg; P.start = (c) => (cfg = c); load(path.join(subject, 'js/config.js'));

const T = (h) => (h == null ? '' : String(h).replace(/<svg[\s\S]*?<\/svg>/g, '[figure]').replace(/<\/t[hd]>/g, ' | ').replace(/<\/(tr|li|p|div)>/g, '\n').replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim());
const out = [];
const w = (s = '') => out.push(s);
const shiftTxt = (a) => Object.entries(a || {}).filter(([, v]) => v).map(([k, v]) => `${k} ${v > 0 ? 'right/up' : 'left/down'}`).join(', ') || 'no change';
function qText(q) {
  const lines = [`[${q.kind}${q.grade ? ', ' + q.grade : ''}] ${T(q.prompt)}${q.fig && /\[figure\]|<svg/.test(q.fig) ? ' [figure]' : q.fig ? '\n  Resource: ' + T(q.fig) : ''}`];
  if (q.kind === 'mcq') q.choices.forEach((c) => lines.push(`  ${c.ok ? '✓' : '✗'} ${T(c.t)}${c.why ? ' — ' + T(c.why) : ''}`));
  else if (q.kind === 'num') lines.push(`  answer: ${P.n(q.answer, 4)}${q.dp != null ? ` (dp ${q.dp})` : ''}${q.sol ? ' — ' + q.sol.map(T).join('; ') : ''}`);
  else if (q.kind === 'order') lines.push(...q.items.map((t, k) => `  ${k + 1}. ${T(t)}`));
  else if (q.kind === 'match') lines.push(...q.pairs.map((p) => `  ${p.k} = ${T(p.a)}`));
  else if (q.kind === 'sort') lines.push(...q.items.map((it) => `  ${T(it.t)} → ${q.cats[it.c]}`));
  else if (q.kind === 'gridref') lines.push(`  answer: ${q.answer}`);
  else if (q.kind === 'shift') lines.push(`  answer: ${shiftTxt(q.answer)}${(q.accept || []).length ? '; also accepted: ' + q.accept.map(shiftTxt).join(' / ') : ''}${q.why ? ' — ' + T(q.why) : ''}`);
  if (q.why && q.kind !== 'shift' && q.kind !== 'mcq') lines.push(`  why: ${T(q.why)}`);
  return lines.join('\n');
}
w(`CONTENT DIGEST: ${cfg.full}. Exam: ${cfg.exam.text}.`);
for (const std of cfg.standards) {
  w(`\n==================== AS ${std.code} ${std.short}: ${std.name} ====================`);
  for (const id of std.units) {
    const u = P.unitById[id]; if (!u) continue;
    w(`\n######## UNIT ${id}: ${T(u.title)}\nBlurb: ${T(u.blurb)}\nSummary: ${T(u.recap)}`);
    w('Explainer:'); u.scenes.forEach((s, k) => w(`  Scene ${k + 1}: ${(s.card || []).map((c) => T(c.html)).join(' ')}${(s.board || []).filter((b) => !/<svg/.test(b.html || '')).map((b) => ' | ' + T(b.html || b.tex)).join('')}`));
    const ex = typeof u.example === 'function' ? u.example() : u.example;
    w(`Worked example: ${T(ex.problem)}`); ex.steps.forEach((s, k) => w(`  ${k + 1}. ${T(s.m)}${s.note ? ' (' + T(s.note) + ')' : ''}`));
    w('Exam tips:'); u.tips.forEach((t) => w(`  - ${T(t)}`));
    const a = u.aim;
    if (a) {
      w(`Aim higher. Context: ${T(a.intro)}`);
      a.parts.forEach((p, k) => {
        w(`  Part (${'abc'[k]}) [target ${'AME'[k]}]: ${T(p.q)}`);
        p.model.forEach((s) => w(`    ${s.key ? '*' : '-'} ${T(s.m)}`));
        w(`    Earns: ${T(p.earns)}`);
        if (p.crit) Object.entries(p.crit).forEach(([g, c]) => w(`    Marking ${g}: ${T(c)}`));
      });
      (a.up || []).forEach((x, k) => { w(`  Upgrade ${k + 1} (part ${'abc'[x.part]}): student wrote "${x.shown.map(T).join(' ')}"`); x.choices.forEach((c) => w(`    ${c.ok ? '✓' : '✗'} ${T(c.t)} — ${T(c.why)}`)); });
    }
    w('Quiz questions (samples):');
    const seen = new Set();
    for (const g of [u.faded, ...u.gens]) for (let r = 0; r < N; r++) {
      let q; try { q = g(); } catch (e) { continue; }
      const key = T(q.prompt).replace(/\d+(\.\d+)?/g, '#').slice(0, 120) + q.kind;
      if (seen.has(key)) continue; seen.add(key);
      w(qText(q));
    }
  }
}
process.stdout.write(out.join('\n') + '\n');
