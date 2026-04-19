# 食在安心：國中生外食求生指南
**Bite Right! — The Middle Schooler's Guide to Safe Eats in Taiwan**

An interactive food-safety educational web page aligned with Taiwan's **108 Curriculum Guidelines (108課綱)**, targeting middle school students (ages 11–14).  
Combines a readable guide with a **10-question quiz game** to verify that students have actually engaged with the content.

---

## Features

| Feature | Description |
|---|---|
| 🦠 Microbe Menu | Visual rogues gallery — 6 pathogens: Norovirus, Bongkrekic Acid, Bacillus Cereus, Vibrio parahaemolyticus, Salmonella, S. aureus |
| 🎮 Survival Simulator | 3 scenario-based click choices with consequence reveals |
| 💥 MythBusters Accordion | 3 debunked myths with scientific explanations |
| 🎒 Survival Kit | 5-point cheat sheet with 108課綱 curriculum alignment |
| 🏆 Quiz Game | 10-question knowledge test: lives, timer, combo multiplier, score |
| 📖 Read Progress | IntersectionObserver tracks which sections the student has scrolled past |

---

## Quiz Game Mechanics

- **16-question pool** — 10 drawn at random per play, so replays feel different
- **3 lives** — wrong answer or timeout costs one life
- **15-second timer** per question (colour shifts yellow → red as time runs low)
- **Speed bonus** — faster correct answers earn extra points (`timeLeft × 5`)
- **Combo multiplier** — 3× streak = ×2, 5× streak = ×3
- **Instant explanation** shown after every answer
- **Reading-progress bar** — lights up as sections are scrolled past; reminds students to read first
- **Grade system** — 4 tiers from 🏆 食安守護者 to 💀 食物中毒

---

## Project Structure

```
FoodSafety/
├── index.html          ← Main page (HTML skeleton, no inline styles/scripts)
├── css/
│   ├── style.css       ← Full page design system and section styles
│   └── game.css        ← Quiz game UI styles (scoped to .game-* classes)
├── js/
│   ├── app.js          ← Simulator choices, myth accordion, nav, read-tracking
│   └── game.js         ← Quiz game engine (state machine, timer, scoring)
└── README.md
```

---

## Getting Started

No build tools or dependencies required. Everything runs in the browser.

**Option 1 — Open directly:**
```
double-click index.html
```

**Option 2 — Local dev server (recommended, avoids CORS quirks):**
```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code: install "Live Server" extension → right-click index.html → Open with Live Server
```
Then visit `http://localhost:8080`.

---

## Adding Images

Image placeholders are marked with `[IMAGE: description]` tags inside `.img-placeholder` divs.  
To replace them, swap the placeholder `<div>` with an `<img>` tag:

```html
<!-- Before -->
<div class="img-placeholder img-placeholder--card">
  <span>[IMAGE: Norovirus particle illustration]</span>
</div>

<!-- After -->
<img src="assets/images/norovirus.png" alt="諾羅病毒示意圖" class="card-img" />
```

Recommended image sources: [CDC PHIL](https://phil.cdc.gov/), [Unsplash](https://unsplash.com/), or commissioned illustration.

---

## Curriculum Alignment (108課綱)

| Core Competency | Description |
|---|---|
| 健體-J-A2 | 系統思考與問題解決 — Systemic thinking and problem-solving |
| 健體-J-C1 | 道德實踐與公民意識 — Ethical practice and civic responsibility |

Suitable for **Grade 7–9 Health Education** (健康教育) or homeroom advisory periods.

---

## Customising the Quiz

All questions live in `js/game.js` in the `QUESTION_BANK` array.  
Each question follows this schema:

```js
{
  id:          1,                    // unique integer
  category:    '🔵 諾羅病毒',        // displayed above the question
  question:    'Question text…',
  options:     ['A', 'B', 'C', 'D'], // exactly 4 options
  correct:     1,                    // zero-based index of correct option
  explanation: 'HTML string…',       // shown after answering (supports <strong>)
}
```

To add questions, push new objects into the array. The game shuffles on every play.

---

## Browser Support

Tested on Chrome 120+, Safari 17+, Firefox 121+, Edge 120+.  
Uses: CSS Custom Properties, IntersectionObserver, `const`/`let`, Arrow functions.  
No polyfills required for modern browsers.

---

## License

Educational use only. Content references Taiwan's TFDA (食藥署) and CDC public health guidelines.  
Please replace `[IMAGE: ...]` placeholders with properly licensed images before public deployment.
