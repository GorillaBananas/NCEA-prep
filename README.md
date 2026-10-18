# NCEA Prep

Short, focused revision for NCEA exams. Each topic is about ten minutes:

1. **Watch** a one-minute animated explainer (built in the browser, pausable, step by step).
2. **Example**: a worked example revealed one step at a time, with margin notes on where marks are won.
3. **Your turn**: a "faded" example with the first steps done, two tries.
4. **Quiz**: five questions with instant, explanatory feedback. Numbers change every time.
   After a wrong answer, **"Still don't understand? Show me step by step"** opens a slower walkthrough
   using that question's own numbers: the big idea, each step with the reason for it, how to check,
   and the common trap. **"Try one like it"** then gives a fresh, unscored question of the same type.
5. **Exam tips** drawn from the NZQA assessment reports.

Around the topics:

- **Check-up**: one question per topic to find weak spots, then a plan with a daily pace.
- **Free choice**: any topic can be opened at any time.
- **Daily review**: mixed questions from finished topics on a spaced schedule (1, 2, 4, 7, 14 days).
- **Progress link**: the student can send a link that shows a read-only progress report. Progress is saved in the browser; nothing is sent to a server.

## Subjects

| Folder | Subject | Exam |
| --- | --- | --- |
| `maths-l2/` | NCEA Level 2 Mathematics and Statistics: AS 91261 algebra, 91262 calculus, 91267 probability | Thu 19 Nov 2026, morning |

## How it is built

Plain HTML, CSS and JavaScript. No build step, no server, no accounts. It works on GitHub Pages and when opened from disk.

```
index.html            front page listing subjects
shared/css/           design (base.css) and components (app.css)
shared/js/core.js     random numbers, maths formatting, answer parsing and checking, normal distribution
shared/js/player.js   animated explainer player
shared/js/quiz.js     question renderer and small SVG figure builders
shared/js/app.js      the subject app: home, check-up, units, review, progress, parent report
shared/vendor/        KaTeX (maths typesetting) and fonts, self-hosted
maths-l2/             a subject: index.html, config.js and one file of units per standard
tools/                checks for question generators
```

### Adding a subject

1. Copy `maths-l2/` to a new folder, for example `physics-l2/`.
2. Edit `js/config.js`: id, title, exam date, standards and the list of unit ids.
3. Write units with `NP.addUnit({ id, title, blurb, mins, scenes, example, faded, gens, tips })`. See `maths-l2/js/algebra.js` for the pattern.
4. Add the subject to the list in the root `index.html`.

### Checking questions

```
npm i katex
node tools/check-questions.js maths-l2 400    # every generator 400 times: answers accepted, TeX renders, one correct choice
node tools/sample-questions.js maths-l2 1 --more   # one example of every question and its walkthrough, for a read-through
```

Two browser checks (serve the folder, e.g. `python3 -m http.server`):

- `tools/figures.html?runs=100`: renders every graph, tree and histogram and reports labels that overlap.
- `tools/walkthroughs.html?runs=5`: open at phone width; renders every walkthrough and reports maths errors or equations wider than the screen.

Every question type must have a `more` walkthrough and every unit a `recap`; `check-questions.js` fails without them.

## Publishing

GitHub repo settings → **Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)`.
The site then appears at `https://gorillabananas.github.io/NCEA-prep/`.
