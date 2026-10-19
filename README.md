# NCEA Prep

Short, focused revision for NCEA exams. Each topic is about ten to fifteen minutes:

1. **Watch** a one-minute animated explainer (built in the browser, pausable, step by step).
2. **Example**: a worked example revealed one step at a time, with margin notes on where marks are won.
3. **Your turn**: a "faded" example with the first steps done, two tries.
4. **Quiz**: five questions with instant, explanatory feedback. Numbers change every time.
   After a wrong answer, **"Still don't understand? Show me step by step"** opens a slower walkthrough
   using that question's own numbers: the big idea, each step with the reason for it, how to check,
   and the common trap. **"Try one like it"** then gives a fresh, unscored question of the same type.
   Every question carries its NCEA level: **Achieved** (use a method), **Merit** (link steps, use a model,
   relate it to the context) or **Excellence** (devise a strategy, reason, prove or justify).
5. **Aim higher**: one fixed exam-style question in three parts that climb Achieved → Merit → Excellence.
   The student tries each part and checks the final answer, then sees a model answer. Margin notes mark the
   lines that earn the grade, and a line says why, in NZQA's terms. The student marks their own working
   against the highlighted lines. Two **"Upgrade this answer"** questions follow: a correct answer one grade
   short, and the student picks what it needs to move up.
6. **Exam tips** drawn from the NZQA assessment reports.

Around the topics:

- **Check-up**: one question per topic to find weak spots, then a plan with a daily pace.
- **Free choice**: any topic can be opened at any time.
- **Daily review**: mixed questions from finished topics on a spaced schedule (1, 2, 4, 7, 14 days).
- **Level profile**: practice sets, daily review and the progress page show results by level, for example
  "Solid at Achieved, shaky at Merit", with the next step to take. Mixed practice includes Upgrade questions.
- **Progress link**: the student can send a link that shows a read-only progress report. Progress is saved in the browser; nothing is sent to a server.

## Subjects

| Folder | Subject | Exam |
| --- | --- | --- |
| `maths-l2/` | NCEA Level 2 Mathematics and Statistics: AS 91261 algebra, 91262 calculus, 91267 probability | Thu 19 Nov 2026, morning |
| `biology-l2/` | NCEA Level 2 Biology: AS 91156 cells, 91157 genetic variation and change, 91159 gene expression | Fri 20 Nov 2026, morning |
| `economics-l2/` | NCEA Level 2 Economics: AS 91222 inflation, 91223 international trade, 91224 economic growth | Fri 27 Nov 2026, morning |
| `geography-l2/` | NCEA Level 2 Geography: AS 91240 large natural environment (the Amazon), 91242 differences in development (Laos and the USA), 91243 geographic skills | Tue 10 Nov 2026, morning |

## Written subjects and AI marking

Biology, economics and geography are assessed by written answers, so they add these question kinds (`shared/js/kinds.js`):

- **order**: build a chain of reasoning by tapping statements in order (the Merit skill).
- **match**: label a diagram, one drop-down per letter.
- **shift**: move the curves on an economic model (`shared/js/econ.js` draws the models).
- **sort**: put each statement in a category (natural or cultural; social, economic or environmental).
- **gridref**: type a 4- or 6-figure grid reference (one tenth either way is accepted).
- **write**: a written answer. Aim higher parts with `write: true` use it.

Written answers are marked by the Claude API when AI marking is set up on that computer (`settings.html`).
The marker gets the question, the resource, the marking points (`crit`), the model answer with its key lines,
and the NZQA grade descriptors for the subject, and returns a grade (N, A, M or E) with feedback as structured JSON
(`shared/js/ai.js`). Without a key, the student marks themselves against the model answer.

The key is kept only in that browser. To keep it out of the browser, deploy the small proxy in `tools/marker-proxy/`
and put its address in the settings page instead.

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
maths-l2/             a subject: index.html, config.js, one file of units per standard, and ladders.js (Aim higher)
tools/                checks for question generators; build-maps.py makes geography's real maps
```

### Adding a subject

1. Copy `maths-l2/` to a new folder, for example `physics-l2/`.
2. Edit `js/config.js`: id, title, exam date, standards and the list of unit ids.
3. Write units with `NP.addUnit({ id, title, blurb, mins, recap, scenes, example, faded, grades, gens, tips })`, where `grades` is one letter (A, M or E) per generator. See `maths-l2/js/algebra.js` for the pattern.
4. Add an Aim higher question for each unit (`ladders.js`): three parts, each with a check, a model answer with key lines, and a reason, plus two upgrade questions.
5. Add the subject to the list in the root `index.html`.

### Checking questions

```
npm i katex
node tools/check-questions.js maths-l2 400    # every generator 400 times: answers accepted, TeX renders, one correct choice
node tools/sample-questions.js maths-l2 1 --more   # one example of every question and its walkthrough, for a read-through
```

Two browser checks (serve the folder, e.g. `python3 -m http.server`):

- `tools/figures.html?runs=100`: renders every graph, tree and histogram and reports labels that overlap.
- `tools/walkthroughs.html?runs=5`: open at phone width; renders every walkthrough and reports maths errors or equations wider than the screen.

Every question type must have a `more` walkthrough and a level, and every unit a `recap` and an Aim higher question;
`check-questions.js` fails without them. For Aim higher it also checks that each part's answer appears in its model answer.

## Publishing

GitHub repo settings → **Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)`.
The site then appears at `https://gorillabananas.github.io/NCEA-prep/`.

## Geography maps

The Amazon, Laos and world maps use real coastlines, borders, rivers and regions from
[Natural Earth](https://www.naturalearthdata.com/) (public domain). `tools/build-maps.py` clips, simplifies and projects them
into SVG paths in `geography-l2/js/mapdata.js`; rerun it to change a map. The grid-reference practice maps are invented
and generated afresh for each question. Port Avela, used in the skills practice, is an invented place.
