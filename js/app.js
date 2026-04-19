/**
 * app.js — Food Safety Guide: Page Interaction Logic
 *
 * Handles:
 *   - Survival Simulator scenario choices (Section 3)
 *   - Mythbusters accordion toggles (Section 4)
 *   - Sticky nav active-link highlight on scroll
 *   - Section read-progress tracking (feeds into game.js)
 */

'use strict';

/* ================================================================
   1. SURVIVAL SIMULATOR
   ================================================================ */

/** Tracks which scenario IDs have already been answered. */
const scenarioAnswered = {};

/** Running correct-answer count for the simulator score tracker. */
let simulatorScore = 0;

/**
 * Called when a student clicks an option button inside a scenario card.
 * @param {HTMLButtonElement} btn - The button element that was clicked.
 */
function handleChoice(btn) {
  const scenarioId = btn.dataset.scenario;

  // Prevent double-answering the same scenario
  if (scenarioAnswered[scenarioId]) return;
  scenarioAnswered[scenarioId] = true;

  const isCorrect = btn.dataset.correct === 'true';
  const choice    = btn.dataset.choice;

  // Lock both buttons and style them correct/wrong
  const card = document.getElementById('scenario-' + scenarioId);
  card.querySelectorAll('.option-btn').forEach(b => {
    b.disabled = true;
    b.classList.add(b.dataset.correct === 'true' ? 'is-correct' : 'is-wrong');
  });

  // Reveal the relevant consequence panel
  const panel = document.getElementById('consequence-' + scenarioId + '-' + choice);
  if (panel) {
    panel.classList.add('is-visible');
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }

  if (isCorrect) simulatorScore++;
  updateSimulatorScore();
}

/** Refreshes the score display below the scenario list. */
function updateSimulatorScore() {
  const display = document.getElementById('score-display');
  const verdict = document.getElementById('score-verdict');
  if (!display || !verdict) return;

  display.textContent = simulatorScore;

  const totalAnswered = Object.keys(scenarioAnswered).length;
  if (totalAnswered < 3) {
    verdict.textContent = '繼續作答… Keep going…';
    verdict.style.color = 'var(--color-text-muted)';
    return;
  }

  const messages = [
    { min: 3, text: '🏆 滿分！你是外食求生大師 Food Safety Pro!',    color: 'var(--color-neon-green)' },
    { min: 2, text: '👍 不錯！再複習一題 Good — review the miss.',    color: 'var(--color-warning)'    },
    { min: 1, text: '😬 加強一下，重讀上面內容 Time to re-read!',    color: 'var(--color-warning)'    },
    { min: 0, text: '😅 從頭讀起，這頁救你的肚子 Start from top.',   color: 'var(--color-alert-red)'  },
  ];

  const msg = messages.find(m => simulatorScore >= m.min);
  verdict.textContent = msg.text;
  verdict.style.color  = msg.color;
}

/* ================================================================
   2. MYTHBUSTERS ACCORDION
   ================================================================ */

/**
 * Toggles the open/closed state of a myth card.
 * @param {string} id - The element ID of the myth card.
 */
function toggleMyth(id) {
  const card = document.getElementById(id);
  if (!card) return;
  card.classList.toggle('is-open');
}

/* ================================================================
   3. STICKY NAV — ACTIVE LINK ON SCROLL
   ================================================================ */

const NAV_SECTION_IDS = ['microbes', 'simulator', 'myths', 'kit', 'spot', 'game'];

function initNavHighlight() {
  const navLinks = Array.from(document.querySelectorAll('.nav__links a'));

  window.addEventListener('scroll', () => {
    const scrollMid = window.scrollY + window.innerHeight / 2;

    NAV_SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el || !navLinks[i]) return;

      const top    = el.offsetTop;
      const bottom = top + el.offsetHeight;

      navLinks[i].classList.toggle('is-active', scrollMid >= top && scrollMid < bottom);
    });
  }, { passive: true });
}

/* ================================================================
   4. SECTION READ-PROGRESS TRACKING
   ================================================================ */

/**
 * Observes when each major section scrolls into view and marks it
 * as "read" — both in the DOM (for the game's reading-tracker bar)
 * and in the exported readSections object (consumed by game.js).
 */
const readSections = {
  microbes:  false,
  simulator: false,
  myths:     false,
  kit:       false,
  spot:      false,
};

function initReadProgress() {
  const options = { threshold: 0.25 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      if (id in readSections && !readSections[id]) {
        readSections[id] = true;
        markSectionRead(id);
        observer.unobserve(entry.target); // only fire once per section
      }
    });
  }, options);

  Object.keys(readSections).forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

/**
 * Updates the reading-tracker bar inside the game section.
 * @param {string} sectionId
 */
function markSectionRead(sectionId) {
  // Map section IDs to reading-tracker step indices
  const stepMap = { microbes: 0, simulator: 1, myths: 2, kit: 3, spot: 4 };
  const idx = stepMap[sectionId];
  if (idx === undefined) return;

  const steps = document.querySelectorAll('.rt-step');
  if (steps[idx]) steps[idx].classList.add('is-read');
}

/**
 * Returns a count of how many sections the student has scrolled past.
 * Called by game.js to personalise the start screen.
 * @returns {number} 0–4
 */
function getSectionsRead() {
  return Object.values(readSections).filter(Boolean).length;
}

/* ================================================================
   5. BOOT
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavHighlight();
  initReadProgress();
});

// Expose functions needed by inline event handlers and game.js
window.handleChoice    = handleChoice;
window.toggleMyth      = toggleMyth;
window.getSectionsRead = getSectionsRead;
