/* Stress-test every question generator.
   Usage: node tools/check-questions.js maths-l2 [runs]   (needs katex: npm i katex)
   Checks: valid shape, finite answers, exactly one correct MCQ choice, no duplicate choices,
   the stated answer (and its rounded form) is accepted, wrong-answer hints never match the answer,
   and every piece of TeX renders. */
const vm = require('vm'), fs = require('fs'), path = require('path');
const katex = require(process.env.KATEX || 'katex');
const subject = process.argv[2] || 'maths-l2', RUNS = +process.argv[3] || 300;
const root = path.join(__dirname, '..');
const ctx = { console, Math, JSON, Number, String, Object, Array, Set, Promise, isFinite, parseFloat, encodeURIComponent, decodeURIComponent };
ctx.window = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
['shared/js/core.js', 'shared/js/player.js', 'shared/js/quiz.js'].forEach(load);
const cfgSrc = fs.readFileSync(path.join(root, subject, 'js/config.js'), 'utf8');
const unitFiles = [...fs.readFileSync(path.join(root, subject, 'index.html'), 'utf8').matchAll(/src="js\/([\w-]+)\.js"/g)].map((m) => m[1]).filter((f) => f !== 'config');
unitFiles.forEach((f) => load(path.join(subject, 'js', f + '.js')));
const P = ctx.NP;
let cfg; ctx.NP.start = (c) => (cfg = c); vm.runInContext(cfgSrc, ctx);

let errors = 0; const seen = new Map();
const err = (where, msg, q) => { const key = where + msg; if (seen.has(key)) return; seen.set(key, 1); errors++; console.log('✗', where, '—', msg); if (q) console.log('   prompt:', String(q.prompt).slice(0, 160)); };
function texIn(s, where) {
  if (s == null) return; s = String(s);
  if (/NaN|undefined|Infinity|\[object/.test(s)) err(where, 'bad text: ' + s.slice(0, 120));
  const stripped = s.replace(/<span class="nomath">[^<]*<\/span>/g, '');
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g; let m;
  while ((m = re.exec(stripped))) { const tex = m[1] || m[2]; try { katex.renderToString(tex, { throwOnError: true, displayMode: !!m[1] }); } catch (e) { err(where, 'TeX: ' + e.message.slice(0, 100) + ' in ' + tex.slice(0, 80)); } }
  if ((stripped.match(/\$/g) || []).length % 2) err(where, 'odd number of $ in: ' + stripped.slice(0, 120));
  // maths code must sit inside $...$, never in plain text
  const plain = stripped.replace(/\$\$[\s\S]+?\$\$|\$[^$]+?\$/g, '').replace(/<[^>]+>/g, '');
  if (/\\[a-zA-Z]+/.test(plain)) err(where, 'maths code outside $...$: ' + plain.match(/.{0,30}\\[a-zA-Z]+.{0,20}/)[0]);
  // tidy maths: no "1x", no "+ -3" or "- -3", no "x^{1}"
  const re2 = /\$([^$]+?)\$/g; let mm2;
  while ((mm2 = re2.exec(stripped))) { const t = mm2[1]; if (/(^|[^\d.{])1x\b/.test(t) || /[+-] -\d/.test(t) || /\^\{1\}/.test(t)) err(where, 'untidy maths: ' + t.slice(0, 80)); }
}
function checkMore(q, where) {
  const d = q.more;
  if (!d) return err(where, 'no step-by-step walkthrough', q);
  if (!d.steps || !d.steps.length) return err(where, 'walkthrough has no steps', q);
  d.steps.forEach((st, k) => { if (!st || (!st.say && !st.m)) err(where, 'empty walkthrough step ' + k); texIn(st && st.say, where + '.more.say'); texIn(st && st.m, where + '.more.m'); });
  ['ask', 'check', 'trap', 'idea'].forEach((k) => texIn(d[k], where + '.more.' + k));
}
function checkQ(q, where) {
  if (!q || !q.prompt) return err(where, 'no prompt');
  checkMore(q, where);
  ['prompt', 'hint', 'fmt', 'fig'].forEach((k) => k !== 'fig' && texIn(q[k], where + '.' + k));
  (q.scaffold || []).forEach((s) => texIn(s, where + '.scaffold'));
  (q.sol || []).forEach((s) => texIn(s, where + '.sol'));
  if (q.answerTex) texIn('$' + q.answerTex + '$', where + '.answerTex');
  (q.wrong || []).forEach((w) => texIn(w.msg, where + '.wrong'));
  if (q.kind === 'mcq') {
    const ok = q.choices.filter((c) => c.ok).length;
    if (ok !== 1) err(where, ok + ' correct choices', q);
    if (q.choices.length < 2 || q.choices.length > 4) err(where, q.choices.length + ' choices', q);
    if (new Set(q.choices.map((c) => c.t)).size !== q.choices.length) err(where, 'duplicate choices', q);
    q.choices.forEach((c) => { texIn(c.t, where + '.choice'); texIn(c.why, where + '.why'); if (!c.ok && !c.why) err(where, 'wrong choice without explanation: ' + c.t); });
    if (!P.check(q, q.choices.findIndex((c) => c.ok)).ok) err(where, 'correct choice rejected', q);
  } else if (q.kind === 'num') {
    if (!isFinite(q.answer)) return err(where, 'answer not finite: ' + q.answer, q);
    if (!P.check(q, String(q.answer)).ok) err(where, 'exact answer rejected', q);
    if (q.dp != null && !P.check(q, P.f(q.answer, q.dp)).ok) err(where, 'rounded answer rejected', q);
    if (q.dp == null && !Number.isInteger(q.answer) && !P.toFrac(q.answer, 2000)) err(where, 'non-exact answer without dp: ' + q.answer, q);
  } else if (q.kind === 'multi') {
    if (!Array.isArray(q.answer) || q.answer.some((a) => !isFinite(a))) return err(where, 'bad multi answer', q);
    const s = q.answer.map((a) => (q.dp != null ? P.f(a, q.dp) : String(a))).join(', ');
    if (!P.check(q, s).ok) err(where, 'answer rejected: ' + s, q);
    if (!q.ordered && new Set(q.answer.map((a) => P.round(a, 6))).size !== q.answer.length) err(where, 'repeated values in unordered answer: ' + s, q);
  } else err(where, 'unknown kind ' + q.kind, q);
}

const ids = cfg.standards.flatMap((s) => s.units);
for (const id of ids) {
  const u = P.unitById[id];
  if (!u) { err(id, 'unit missing'); continue; }
  ['title', 'blurb', 'recap'].forEach((k) => texIn(u[k], id + '.' + k));
  if (!u.recap) err(id, 'no big-idea recap');
  if (!u.scenes || !u.scenes.length) err(id, 'no scenes');
  u.scenes.forEach((s, k) => { (s.card || []).forEach((c) => texIn(c.html, `${id}.scene${k}`)); (s.board || []).forEach((b) => { if (b.tex != null) texIn('$$' + b.tex + '$$', `${id}.scene${k}.board`); else texIn(b.html, `${id}.scene${k}.board`); }); if (!s.board && !s.draw) err(id, 'scene ' + k + ' has no visual'); });
  const exs = typeof u.example === 'function' ? Array.from({ length: 20 }, () => u.example()) : [u.example];
  exs.forEach((ex) => { texIn(ex.problem, id + '.example'); ex.steps.forEach((s) => { texIn(s.m, id + '.example.step'); }); });
  u.tips.forEach((t) => texIn(t, id + '.tips'));
  const gens = [['faded', u.faded], ...u.gens.map((g, k) => ['gen' + k, g])]; if (u.diag) gens.push(['diag', u.diag]);
  for (const [name, g] of gens) for (let r = 0; r < RUNS; r++) { let q; try { q = g(); } catch (e) { err(`${id}.${name}`, 'threw ' + e.message); break; } checkQ(q, `${id}.${name}`); }
  const total = u.scenes.reduce((a, s) => a + s.dur, 0);
  console.log(`  ${id.padEnd(16)} ${u.gens.length} generators, explainer ${total}s`);
}
console.log(errors ? `\n${errors} problem(s) found.` : `\nAll ${ids.length} units passed (${RUNS} runs per generator).`);
process.exit(errors ? 1 : 0);
