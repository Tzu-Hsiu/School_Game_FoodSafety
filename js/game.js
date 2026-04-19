/**
 * game.js — Food Safety Quiz Game Engine
 *
 * A timed, lives-based quiz that tests whether students actually read
 * the guide. The full question bank has 16 questions across 6 pathogens;
 * each play draws MAX_QUESTIONS at random, so replays feel fresh.
 * All answers are anchored to specific facts in the page text.
 *
 * Flow:  START → QUESTION (×MAX_QUESTIONS) → RESULT
 *        Hearts → GAME OVER if lives reach 0
 *
 * Scoring:
 *   Correct answer:  100 pts base  +  (timeLeft × 5) speed bonus
 *   Combo streak  :  2× at 3 streak, 3× at 5 streak
 *   Max possible  :  (100 + 75) × 10 = 1750 pts per play
 */

'use strict';

/* ================================================================
   1. QUESTION BANK
   All questions reference specific facts from the guide content.
   ================================================================ */

const QUESTION_BANK = [
  // ── Section 2 · Norovirus ──────────────────────────────────────
  {
    id: 1,
    category: '🔵 諾羅病毒 Norovirus',
    question: '為什麼酒精乾洗手對諾羅病毒效果有限？',
    options: [
      '酒精濃度通常不夠高',
      '諾羅病毒是病毒而非細菌，酒精無法有效消滅它',
      '乾洗手的摩擦力不足以殺菌',
      '台灣的乾洗手品質較差',
    ],
    correct: 1,
    explanation: '酒精對諾羅病毒無效，因為它是<strong>無套膜病毒（non-enveloped virus）</strong>，酒精破壞不了它的蛋白質外殼。唯一有效的做法是用<strong>肥皂加流水搓洗 20 秒</strong>，物理沖走病毒。',
  },
  {
    id: 2,
    category: '🔵 諾羅病毒 Norovirus',
    question: '諾羅病毒感染所需的最低病毒量是多少顆粒？',
    options: ['1,000 顆', '500 顆', '18 顆', '10,000 顆'],
    correct: 2,
    explanation: '諾羅病毒的感染劑量極低，只需要<strong>約 18 個病毒顆粒</strong>就能讓人中招。這也是為什麼諾羅感染能在學校、郵輪上快速爆發的原因。',
  },

  // ── Section 2 · Bongkrekic Acid ───────────────────────────────
  {
    id: 3,
    category: '🔴 米酵菌酸 Bongkrekic Acid',
    question: '米酵菌酸（Bongkrekic Acid）最危險的特性是哪一個？',
    options: [
      '顏色鮮紅，容易被發現',
      '無色、無味、無臭，且耐高溫、煮沸無法破壞',
      '只在海鮮類食品中出現',
      '冷藏就能完全防止產生',
    ],
    correct: 1,
    explanation: '米酵菌酸是<strong>無色、無味、無臭</strong>的毒素，靠感官完全無法偵測。更危險的是它<strong>極度耐熱</strong>——即使煮沸也無法破壞毒素，這讓它成為最難防範的食安威脅之一。',
  },
  {
    id: 4,
    category: '🔴 米酵菌酸 Bongkrekic Acid',
    question: '以下哪種食物最容易成為米酵菌酸的溫床？',
    options: [
      '剛煮好的白米飯',
      '冷藏保存的新鮮蔬菜',
      '室溫放置過久的濕米粉、粿條、木耳',
      '罐頭食品',
    ],
    correct: 2,
    explanation: '米酵菌酸由唐菖蒲伯克氏菌產生，最容易出現在<strong>室溫放置過久的濕性澱粉類食物</strong>，如米粉、粿條、濕木耳等。超過 2 小時未冷藏就應立即丟棄。',
  },
  {
    id: 5,
    category: '🔴 米酵菌酸 Bongkrekic Acid',
    question: '米酵菌酸的致死率大約是多少？',
    options: ['5–10%', '10–20%', '40–100%', '1–3%'],
    correct: 2,
    explanation: '米酵菌酸的致死率驚人，文獻記載高達<strong>40% 到 100%</strong>，且目前沒有特效解毒劑。這代表一旦中毒，搶救成功率非常低，預防是唯一手段。',
  },

  // ── Section 2 · Bacillus Cereus ───────────────────────────────
  {
    id: 6,
    category: '🟡 仙人掌桿菌 Bacillus Cereus',
    question: '仙人掌桿菌最適合繁殖的溫度範圍是多少？',
    options: ['0–5°C', '60–80°C', '15–50°C', '100°C 以上'],
    correct: 2,
    explanation: '仙人掌桿菌在<strong>15–50°C</strong> 的環境下大量繁殖，這個範圍正好涵蓋了便當在書包裡的溫度。買了的食物超過 2 小時未食用，風險就大幅提升。',
  },
  {
    id: 7,
    category: '🟡 仙人掌桿菌 Bacillus Cereus',
    question: '仙人掌桿菌產生的嘔吐型毒素，加熱後會怎樣？',
    options: [
      '完全被消滅，安全可食用',
      '需要超過 30 分鐘才能消滅',
      '耐熱，煮沸也無法破壞',
      '低溫才能消滅，不能加熱',
    ],
    correct: 2,
    explanation: '和米酵菌酸一樣，仙人掌桿菌產生的<strong>嘔吐型毒素（cereulide）也是耐熱的</strong>。即使你把珍奶重新加熱，毒素依然存在。買了就吃，不要放超過 2 小時。',
  },

  // ── Section 3 · Scenarios ─────────────────────────────────────
  {
    id: 8,
    category: '🏫 外食場景 Real Scenarios',
    question: '選擇便當店時，哪個是最關鍵的衛生指標？',
    options: [
      '排隊人龍的長短',
      '店面的裝潢和年份',
      '砧板是否分區（生熟食分開）、夾具是否分類',
      '有沒有冷氣',
    ],
    correct: 2,
    explanation: '<strong>砧板分區</strong>（生食、熟食各用一塊）和<strong>夾具分類</strong>（不同食材用不同夾子）是防止交叉污染的核心指標。排隊人多只代表食物受歡迎，和衛生無關。',
  },
  {
    id: 9,
    category: '🌃 外食場景 Real Scenarios',
    question: '在夜市評估冰品攤位，哪個訊號代表最高風險？',
    options: [
      '價格比旁邊攤位便宜 5 元',
      '攤主沒有戴手套',
      '冰塊桶放地上、配料開放式未加蓋，且無冷藏',
      '老闆用普通塑膠杯裝',
    ],
    correct: 2,
    explanation: '<strong>冰塊置地（靠近排水溝）+ 配料開放未加蓋</strong>是最危險的組合：冰塊可能受糞口途徑污染（E. coli、諾羅病毒），而配料暴露在飛蟲和灰塵中。即使食材本身沒問題，儲存方式也會讓它變成地雷。',
  },

  // ── Section 4 · Myths ─────────────────────────────────────────
  {
    id: 10,
    category: '💥 破解迷思 Mythbusters',
    question: '「3 秒法則」被科學研究推翻了，真正的原因是？',
    options: [
      '應該是 5 秒才正確',
      '細菌轉移到食物所需的時間是毫秒級，不是秒',
      '地板在台灣其實很乾淨',
      '只要在室內就沒問題',
    ],
    correct: 1,
    explanation: '羅格斯大學 2016 年的研究證實，食物落地<strong>不到一秒</strong>，細菌就已轉移。高水分食物的細菌轉移量甚至高達 97%。再想想：諾羅病毒只需 18 顆顆粒就能讓你中招——你還要賭那「3 秒」嗎？',
  },

  // ── Section 2 · Vibrio parahaemolyticus ───────────────────────
  {
    id: 11,
    category: '🟠 腸炎弧菌 Vibrio parahaemolyticus',
    question: '腸炎弧菌是台灣食物中毒的頭號病因，它主要來自哪種食物？',
    options: [
      '長時間放置的熟飯',
      '生的或未熟透的海鮮，如生魚片、蚵仔',
      '過期的罐頭',
      '隔夜的葉菜類蔬菜',
    ],
    correct: 1,
    explanation: '腸炎弧菌天然棲息於<strong>海水與海鮮</strong>中，主要透過生食或未熟透的海鮮（生魚片、蚵仔、蝦子）感染人體。加熱至 <strong>100°C 持續 1 分鐘</strong>即可殺滅，是它少數的弱點。',
  },
  {
    id: 12,
    category: '🟠 腸炎弧菌 Vibrio parahaemolyticus',
    question: '腸炎弧菌在什麼條件下繁殖速度最快？',
    options: [
      '低溫冷藏的環境下',
      '乾燥的室溫環境',
      '37°C 環境下，每 9–12 分鐘增殖一倍',
      '100°C 沸水中',
    ],
    correct: 2,
    explanation: '腸炎弧菌在 <strong>37°C（約體溫）</strong>的環境下繁殖速度極快，每 9–12 分鐘數量倍增。這代表海鮮料理在夏天室溫下短短 1–2 小時，菌量就能從安全變成危險。<strong>夏天格外要注意。</strong>',
  },

  // ── Section 2 · Salmonella ────────────────────────────────────
  {
    id: 13,
    category: '🟣 沙門氏菌 Salmonella',
    question: '為什麼處理生雞肉時不建議在水槽中沖洗？',
    options: [
      '會讓雞肉變得不好吃',
      '水溫不夠高，無法殺菌',
      '水流會讓細菌四濺，污染水槽周邊的廚具和食材',
      '這樣做其實沒問題，沖洗更乾淨',
    ],
    correct: 2,
    explanation: '沖洗生雞肉的水流會讓<strong>沙門氏菌液滴四濺</strong>，污染水槽、砧板、周邊廚具甚至其他食材，反而增加交叉污染風險。正確做法是直接下鍋烹煮，確保中心溫度達到 <strong>75°C 以上</strong>。',
  },
  {
    id: 14,
    category: '🟣 沙門氏菌 Salmonella',
    question: '沙門氏菌主要潛伏在哪裡，可在室溫表面存活數週？',
    options: [
      '煮熟的白飯',
      '生雞蛋蛋殼表面與生雞肉',
      '冷凍的冰淇淋',
      '密封罐裝飲料',
    ],
    correct: 1,
    explanation: '沙門氏菌常見於<strong>生雞蛋蛋殼表面</strong>和<strong>未熟透的雞肉</strong>中，且能在室溫表面存活數週之久。碰完生蛋或生雞肉後務必洗手，使用過的砧板也要用熱水徹底清潔。',
  },

  // ── Section 2 · Staphylococcus aureus ────────────────────────
  {
    id: 15,
    category: '🩵 金黃色葡萄球菌 S. aureus',
    question: '金黃色葡萄球菌最常透過什麼途徑污染食物？',
    options: [
      '受污染的海水',
      '食物處理者的雙手、皮膚傷口或鼻腔',
      '過期的食用油',
      '土壤中的孢子',
    ],
    correct: 1,
    explanation: '金黃色葡萄球菌<strong>普遍存在於人的皮膚、鼻腔和傷口</strong>。食物處理者如果未洗手就接觸即食食品（飯糰、三明治、奶油泡芙），就會直接將細菌帶入食物。手有傷口時，風險更高。',
  },
  {
    id: 16,
    category: '🩵 金黃色葡萄球菌 S. aureus',
    question: '金黃色葡萄球菌產生的腸毒素有什麼特性？',
    options: [
      '遇熱會分解，加熱後食物安全',
      '只在冷藏環境中才會產生',
      '耐高溫，加熱無法破壞，與仙人掌桿菌毒素相同',
      '只對老人有害，對青少年無影響',
    ],
    correct: 2,
    explanation: '金黃色葡萄球菌產生的<strong>腸毒素（enterotoxin）極耐熱</strong>，即使加熱煮沸也無法破壞。和仙人掌桿菌的毒素一樣，一旦毒素產生，再怎麼加熱都無濟於事。<strong>預防比治療重要：備餐前洗手，不讓它產生。</strong>',
  },
];

/* ================================================================
   2. GAME CONSTANTS
   ================================================================ */

const MAX_QUESTIONS = 10;   // questions drawn per play (pool has 16 — replay variety)
const MAX_LIVES     = 3;
const TIME_PER_Q    = 15;   // seconds
const BASE_SCORE    = 100;
const SPEED_BONUS   = 5;    // per remaining second
const COMBO_3_MULT  = 2;    // multiplier at 3 consecutive correct
const COMBO_5_MULT  = 3;    // multiplier at 5 consecutive correct

/* ================================================================
   3. GAME STATE
   ================================================================ */

let state = {
  phase:         'idle',   // 'idle' | 'question' | 'revealing' | 'result'
  questions:     [],       // shuffled copy of QUESTION_BANK
  currentIndex:  0,
  lives:         MAX_LIVES,
  score:         0,
  combo:         0,
  maxCombo:      0,
  correctCount:  0,
  timerInterval: null,
  timeLeft:      TIME_PER_Q,
};

/* ================================================================
   4. DOM HELPERS
   ================================================================ */

const $  = id => document.getElementById(id);
const el = id => $(id);

/* ================================================================
   5. UTILITY — SHUFFLE ARRAY (Fisher-Yates)
   ================================================================ */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ================================================================
   6. SCREEN SWITCHING
   ================================================================ */

function showScreen(screenId) {
  ['screenStart', 'screenPlay', 'screenResult'].forEach(id => {
    const s = $(id);
    if (!s) return;
    if (id === screenId) {
      s.classList.remove('game-screen--hidden');
    } else {
      s.classList.add('game-screen--hidden');
    }
  });
}

/* ================================================================
   7. START SCREEN — update reading-progress hint
   ================================================================ */

function refreshStartScreen() {
  const readCount = typeof getSectionsRead === 'function' ? getSectionsRead() : 0;
  const hint = $('gameStartHint');
  if (!hint) return;

  if (readCount >= 5) {
    hint.textContent = '✅ 你已完成所有章節，準備好了！';
    hint.style.color = 'var(--color-neon-green)';
  } else {
    hint.textContent = `📖 建議先讀完上方內容再來挑戰（已完成 ${readCount}/5 節）`;
    hint.style.color = 'var(--color-text-muted)';
  }
}

/* ================================================================
   8. GAME START
   ================================================================ */

function startGame() {
  state = {
    phase:         'question',
    questions:     shuffle(QUESTION_BANK).slice(0, MAX_QUESTIONS),
    currentIndex:  0,
    lives:         MAX_LIVES,
    score:         0,
    combo:         0,
    maxCombo:      0,
    correctCount:  0,
    timerInterval: null,
    timeLeft:      TIME_PER_Q,
  };

  showScreen('screenPlay');
  renderQuestion();
}

/* ================================================================
   9. RENDER QUESTION
   ================================================================ */

function renderQuestion() {
  if (state.currentIndex >= state.questions.length) {
    endGame(false); // Completed all questions
    return;
  }

  const q = state.questions[state.currentIndex];
  state.phase    = 'question';
  state.timeLeft = TIME_PER_Q;

  // HUD
  updateHUD();

  // Category + question text
  el('qCategory').textContent = q.category;
  el('qText').textContent     = q.question;

  // Build option buttons
  const grid = el('optionsGrid');
  grid.innerHTML = '';
  const keys = ['A', 'B', 'C', 'D'];

  q.options.forEach((text, idx) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.dataset.idx = idx;
    btn.innerHTML = `
      <span class="opt-key">${keys[idx]}</span>
      <span class="opt-text">${text}</span>
    `;
    btn.addEventListener('click', () => handleAnswer(idx));
    grid.appendChild(btn);
  });

  // Keyboard shortcuts (A/B/C/D)
  window._gameKeyHandler = e => {
    if (state.phase !== 'question') return;
    const map = { a: 0, b: 1, c: 2, d: 3 };
    const k   = e.key.toLowerCase();
    if (k in map) handleAnswer(map[k]);
  };
  document.addEventListener('keydown', window._gameKeyHandler);

  // Explanation box + next button (hidden initially)
  renderExplanationArea('');
  el('btnNext').classList.remove('is-visible');

  // Combo display
  updateComboDisplay();

  // Start timer
  startTimer();
}

/* ================================================================
   10. TIMER
   ================================================================ */

function startTimer() {
  clearTimer();

  const bar = el('timerBar');
  if (bar) {
    bar.style.transition = 'none';
    bar.style.width      = '100%';
    bar.className        = 'timer-bar';
    // Force reflow so transition resets
    void bar.offsetWidth;
    bar.style.transition = `width ${TIME_PER_Q}s linear`;
    bar.style.width      = '0%';
  }

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerBar();

    if (state.timeLeft <= 0) {
      handleTimeOut();
    }
  }, 1000);
}

function clearTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateTimerBar() {
  const bar = el('timerBar');
  if (!bar) return;
  const pct = (state.timeLeft / TIME_PER_Q) * 100;

  if (pct <= 30) {
    bar.className = 'timer-bar danger';
  } else if (pct <= 55) {
    bar.className = 'timer-bar warn';
  } else {
    bar.className = 'timer-bar';
  }
}

function handleTimeOut() {
  clearTimer();
  if (state.phase !== 'question') return;

  state.phase = 'revealing';
  state.combo = 0;
  state.lives--;

  disableAllOptions();
  highlightCorrectOption();
  updateHUD();

  const q = state.questions[state.currentIndex];
  renderExplanationArea(
    `⏱ 時間到！Time's up. — 正確答案是選項 ${['A','B','C','D'][q.correct]}`,
    false,
    q.explanation
  );
  showNextButton();
}

/* ================================================================
   11. ANSWER HANDLING
   ================================================================ */

function handleAnswer(chosenIdx) {
  if (state.phase !== 'question') return;

  clearTimer();
  state.phase = 'revealing';

  document.removeEventListener('keydown', window._gameKeyHandler);

  const q         = state.questions[state.currentIndex];
  const isCorrect = chosenIdx === q.correct;

  // Style options
  const optBtns = el('optionsGrid').querySelectorAll('.opt-btn');
  optBtns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correct) {
      btn.classList.add('state-correct');
    } else if (idx === chosenIdx && !isCorrect) {
      btn.classList.add('state-wrong');
    } else {
      btn.classList.add('state-dimmed');
    }
  });

  if (isCorrect) {
    const speedBonus = Math.max(0, state.timeLeft) * SPEED_BONUS;

    state.combo++;
    state.maxCombo   = Math.max(state.maxCombo, state.combo);
    state.correctCount++;

    let multiplier = 1;
    if (state.combo >= 5) multiplier = COMBO_5_MULT;
    else if (state.combo >= 3) multiplier = COMBO_3_MULT;

    const gained = (BASE_SCORE + speedBonus) * multiplier;
    state.score += Math.round(gained);

    updateHUD(true); // trigger score pop animation
    updateComboDisplay();

    renderExplanationArea(
      `✅ 正確！+${Math.round(gained)} 分（速度加分 +${speedBonus}${multiplier > 1 ? `  ×${multiplier} COMBO!` : ''}）`,
      true,
      q.explanation
    );

  } else {
    state.combo = 0;
    state.lives--;

    updateHUD();
    updateComboDisplay();

    renderExplanationArea(
      `❌ 答錯了！正確答案是選項 ${['A','B','C','D'][q.correct]}`,
      false,
      q.explanation
    );
  }

  // Check game-over before showing next button
  if (state.lives <= 0) {
    setTimeout(() => endGame(true), 1800);
    return;
  }

  showNextButton();
}

/* ================================================================
   12. UI HELPERS
   ================================================================ */

function disableAllOptions() {
  el('optionsGrid').querySelectorAll('.opt-btn').forEach(b => { b.disabled = true; });
}

function highlightCorrectOption() {
  const q    = state.questions[state.currentIndex];
  const btns = el('optionsGrid').querySelectorAll('.opt-btn');
  btns.forEach((btn, idx) => {
    if (idx === q.correct) btn.classList.add('state-correct');
    else btn.classList.add('state-dimmed');
  });
}

function renderExplanationArea(headerText, isCorrect = false, bodyHtml = '') {
  const box = el('explanationBox');
  if (!box) return;

  if (!headerText) {
    box.classList.remove('is-visible', 'correct-explain', 'wrong-explain');
    return;
  }

  box.classList.toggle('correct-explain', isCorrect);
  box.classList.toggle('wrong-explain',  !isCorrect);
  box.querySelector('.explanation-box__title').textContent = headerText;
  box.querySelector('.explanation-box__text').innerHTML   = bodyHtml;
  box.classList.add('is-visible');
}

function showNextButton() {
  const btn  = el('btnNext');
  const last = state.currentIndex >= state.questions.length - 1;
  btn.textContent = last ? '查看結果 ▶' : '下一題 ▶';
  btn.classList.add('is-visible');
}

function updateHUD(scorePopped = false) {
  const liveEl   = el('hudLives');
  const scoreEl  = el('hudScore');
  const progEl   = el('hudProgress');
  if (!liveEl || !scoreEl || !progEl) return;

  // Lives: filled hearts + empty hearts
  const filled = '❤️'.repeat(Math.max(0, state.lives));
  const empty  = '🖤'.repeat(Math.max(0, MAX_LIVES - state.lives));
  liveEl.textContent = filled + empty;

  scoreEl.textContent = state.score.toLocaleString();
  if (scorePopped) {
    scoreEl.classList.remove('pop');
    void scoreEl.offsetWidth;
    scoreEl.classList.add('pop');
  }

  const total = state.questions.length;
  progEl.textContent = `Q${state.currentIndex + 1}/${total}`;
}

function updateComboDisplay() {
  const div = el('comboDisplay');
  if (!div) return;

  if (state.combo >= 5) {
    div.textContent = `🔥 ${state.combo} 連擊！×${COMBO_5_MULT} COMBO!`;
    div.classList.add('is-visible');
  } else if (state.combo >= 3) {
    div.textContent = `⚡ ${state.combo} 連擊！×${COMBO_3_MULT} COMBO`;
    div.classList.add('is-visible');
  } else if (state.combo === 2) {
    div.textContent = '👏 2 連擊！Keep going!';
    div.classList.add('is-visible');
  } else {
    div.textContent = '';
    div.classList.remove('is-visible');
  }
}

/* ================================================================
   13. NEXT QUESTION
   ================================================================ */

function nextQuestion() {
  state.currentIndex++;

  if (state.currentIndex >= state.questions.length) {
    endGame(false);
  } else {
    renderQuestion();
  }
}

/* ================================================================
   14. END GAME
   ================================================================ */

/**
 * @param {boolean} isDead - true if the player ran out of lives.
 */
function endGame(isDead) {
  clearTimer();
  state.phase = 'result';

  document.removeEventListener('keydown', window._gameKeyHandler);

  const pct = Math.round((state.correctCount / state.questions.length) * 100);

  // Determine grade
  const grades = [
    { min: 90, emoji: '🏆', zh: '食安守護者',       en: 'Food Safety Guardian',  color: 'var(--color-neon-green)' },
    { min: 70, emoji: '💪', zh: '優秀外食偵探',    en: 'Safety Detective',       color: 'var(--color-neon-green)' },
    { min: 50, emoji: '📖', zh: '需要複習',         en: 'Review the Guide',       color: 'var(--color-warning)'    },
    { min:  0, emoji: '🤢', zh: '你的腸胃需要你',  en: 'Your Gut Needs You',     color: 'var(--color-alert-red)'  },
  ];

  const grade = isDead
    ? { emoji: '💀', zh: '食物中毒', en: 'Food Poisoned', color: 'var(--color-alert-red)' }
    : grades.find(g => pct >= g.min);

  // Populate result screen
  el('resultGrade').textContent   = grade.emoji;
  el('resultGradeLabel').textContent = isDead ? 'GAME OVER' : 'RESULT';
  el('resultTitleZh').textContent = grade.zh;
  el('resultTitleEn').textContent = grade.en;
  el('resultTitleZh').style.color = grade.color;

  el('resultStatScore').textContent   = state.score.toLocaleString();
  el('resultStatCorrect').textContent = `${state.correctCount}/${state.questions.length}`;
  el('resultStatCombo').textContent   = `×${state.maxCombo > 0
    ? (state.maxCombo >= 5 ? COMBO_5_MULT : state.maxCombo >= 3 ? COMBO_3_MULT : 1)
    : 1}`;

  // Breakdown
  const speedBonusTotal = state.score - (state.correctCount * BASE_SCORE);
  el('bdBase').textContent     = `+${(state.correctCount * BASE_SCORE).toLocaleString()}`;
  el('bdSpeed').textContent    = `+${Math.max(0, speedBonusTotal).toLocaleString()}`;
  el('bdLostLives').textContent = `-${(MAX_LIVES - state.lives) * 0} pts`; // flavour only
  el('bdTotal').textContent    = state.score.toLocaleString();

  showScreen('screenResult');
}

/* ================================================================
   15. RESTART
   ================================================================ */

function restartGame() {
  showScreen('screenStart');
  refreshStartScreen();
}

/* ================================================================
   16. BOOT — wire up static buttons
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const btnStart   = el('btnStart');
  const btnNext    = el('btnNext');
  const btnRestart = el('btnRestart');

  if (btnStart)   btnStart.addEventListener('click', startGame);
  if (btnNext)    btnNext.addEventListener('click', nextQuestion);
  if (btnRestart) btnRestart.addEventListener('click', restartGame);

  // Refresh the start screen hint every 2 s while idle, so the
  // reading-progress dots update as the student scrolls the page.
  setInterval(() => {
    if (state.phase === 'idle') refreshStartScreen();
  }, 2000);

  refreshStartScreen();
});
