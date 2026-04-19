/**
 * spotgame.js — "Spot the Hazard" game engine (Image Hub / 大家來找碴 style)
 *
 * Students are shown 3 food-preparation scenes with generated images.
 * Each scene has 4 HAZARD hotspots defined by percentage coordinates.
 * Click a hazard zone → highlighted red + explanation.
 * Click outside     → miss feedback.
 * Find all 4 hazards in a scene → advance to next.
 * After all 3 scenes → final results screen.
 */

'use strict';

/* ================================================================
   1. SCENE DATA (Coordinates are in %, x from left, y from top)
   ================================================================ */

const SPOT_SCENES = [

  /* ----------------------------------------------------------
     SCENE 1 — 補習班便當店備餐區
     ---------------------------------------------------------- */
  {
    id: 1,
    emoji: '🏫',
    title: '補習班便當店',
    subtitle: 'Bento Counter',
    context: '提示：找出 4 個明顯的食安違規！點擊畫面中有問題的地方。',
    hazardCount: 4,
    image: 'images/scene1_bento.png',
    completeTip: '這幾個問題在台灣外食攤位上非常常見，記住了就等於每天多一層保護。',
    hotspots: [
      {
        id: 0,
        x: 25, y: 90, r: 12, // Bottom left: cutting board with raw/cooked
        badge: '⚠️ 生熟同板',
        name: '砧板區',
        detail: '切完生雞肉，同一塊砧板直接放上白飯',
        verdict: '⚠️ 交叉污染！',
        explain: '生雞肉含有<strong>沙門氏菌</strong>與<strong>彎曲桿菌</strong>。同一砧板切生肉再放熟飯，細菌直接轉移至熟食。應各自使用專屬砧板並以顏色區分。',
      },
      {
        id: 1,
        x: 48, y: 80, r: 15, // Center bottom: tongs touching raw meat
        badge: '⚠️ 夾具混用',
        name: '夾具架',
        detail: '夾過生肉的夾子，直接夾旁邊的熟食或共用',
        verdict: '⚠️ 交叉污染！',
        explain: '用夾過生肉的夾子直接夾熟食，是台灣外食交叉污染的頭號原因。不同食材應配備各自夾具。',
      },
      {
        id: 2,
        x: 20, y: 44, r: 16, // Left mid: open bento boxes with flies
        badge: '⚠️ 超時暴露',
        name: '食物展示區',
        detail: '便當無遮蓋，已放置 3 小時（時鐘顯示），且有蒼蠅',
        verdict: '⚠️ 超過安全時限！',
        explain: '熟食在 15–60°C 環境中放超過 2 小時，就會大量增殖並產生耐熱毒素。',
      },
      {
        id: 3,
        x: 35, y: 55, r: 12, // Center left: vendor bare hands on bento
        badge: '⚠️ 徒手備餐',
        name: '備餐人員',
        detail: '未戴手套，用手直接拿取食物裝盒',
        verdict: '⚠️ 手部污染風險！',
        explain: '人的雙手帶有金黃色葡萄球菌，傷口、皮膚問題者菌量更多。備餐全程應戴手套或使用夾具。',
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 2 — 夜市飲料攤
     ---------------------------------------------------------- */
  {
    id: 2,
    emoji: '🌃',
    title: '夜市飲料攤',
    subtitle: 'Night Market Drink Stall',
    context: '提示：找出 4 個明顯的食安違規！點擊畫面中有問題的地方。',
    hazardCount: 4,
    image: 'images/scene2_nightmarket.png',
    completeTip: '夜市飲料攤的冰品和手部衛生是最大的風險點，學會判斷就能安全喝好料。',
    hotspots: [
      {
        id: 0,
        x: 27, y: 90, r: 12, // Bottom left: Ice bucket on ground
        badge: '⚠️ 冰桶置地',
        name: '製冰區',
        detail: '裝冰塊的大桶直接放在地面，半開蓋',
        verdict: '⚠️ 冰塊污染風險！',
        explain: '地面排水溝含有大量病原。冰塊桶置地，容易被積水飛濺污染。應架高存放並加蓋。',
      },
      {
        id: 1,
        x: 31, y: 56, r: 12, // Center left: open toppings with flies
        badge: '⚠️ 配料開放',
        name: '配料吧台',
        detail: '珍珠等配料全部開蓋放室溫，蒼蠅在飛',
        verdict: '⚠️ 配料暴露污染！',
        explain: '戶外環境飛蟲多，開放配料是細菌的派對場地。應加蓋冷藏，取用時才開啟。',
      },
      {
        id: 2,
        x: 52, y: 46, r: 10, // Center: holding money while making drink
        badge: '⚠️ 摸錢備料',
        name: '收銀/備料區',
        detail: '手握鈔票，同時另一手直接碰觸飲料杯',
        verdict: '⚠️ 手部交叉污染！',
        explain: '鈔票與硬幣含有多種病原體。收款後未洗手就備料，細菌直接污染飲料。',
      },
      {
        id: 3,
        x: 63, y: 75, r: 15, // Center right: dirty rag
        badge: '⚠️ 髒抹布',
        name: '清潔區',
        detail: '吧台上一條明顯很髒的濕抹布',
        verdict: '⚠️ 抹布二次污染！',
        explain: '髒抹布是細菌的超級培養皿，應使用一次性紙巾，或經常更換乾淨布巾。',
      }
    ]
  },

  /* ----------------------------------------------------------
     SCENE 3 — 學校廚房備餐區
     ---------------------------------------------------------- */
  {
    id: 3,
    emoji: '🍳',
    title: '學校廚房備餐區',
    subtitle: 'School Kitchen Prep Area',
    context: '提示：找出 4 個明顯的食安違規！點擊畫面中有問題的地方。',
    hazardCount: 4,
    image: 'images/scene3_kitchen.png',
    completeTip: '學校廚房是大規模食物製備環境，一個疏忽可能讓全班中毒！',
    hotspots: [
      {
        id: 0,
        x: 18, y: 75, r: 15, // Left: eggs cracking into food
        badge: '⚠️ 蛋殼污染',
        name: '煎蛋站',
        detail: '打蛋時蛋殼碎片掉出，可能落入熟食',
        verdict: '⚠️ 沙門氏菌污染！',
        explain: '沙門氏菌大量存在於蛋殼表面。打蛋時蛋液濺至熟食，即造成二次污染。',
      },
      {
        id: 1,
        x: 50, y: 90, r: 12, // Bottom center: raw meat and veg on same board
        badge: '⚠️ 生熟同砧板',
        name: '切配台',
        detail: '生豬肉與蔬菜在同一塊綠色砧板上',
        verdict: '⚠️ 交叉污染！',
        explain: '廚房應依顏色分類砧板：紅色生肉、綠色蔬菜、黃色熟食，混用易交叉污染。',
      },
      {
        id: 2,
        x: 50, y: 12, r: 12, // Top center: open noodles
        badge: '⚠️ 粿條室溫',
        name: '備料架',
        detail: '打開的濕粿條放室溫，時鐘顯示已超過2小時',
        verdict: '⚠️ 米酵菌酸風險！',
        explain: '濕粿條在室溫下超過2小時，可能產生致死率高的米酵菌酸。應全程冷藏。',
      },
      {
        id: 3,
        x: 84, y: 27, r: 15, // Right fridge top: shrimp dripping
        badge: '⚠️ 生熟交叉',
        name: '冷藏室',
        detail: '冰箱上層生蝦汁液滴落到下層熟食區',
        verdict: '⚠️ 腸炎弧菌污染！',
        explain: '生海鮮汁液污染熟食。冰箱儲存鐵則：熟食放上層、生食放下層。',
      }
    ]
  }
];

/* ================================================================
   2. GAME STATE
   ================================================================ */

let sp = {
  sceneIdx: 0,
  foundHazards: new Set(),   // hotspot IDs found
  misses: 0,           // wrong clicks
  totalScore: 0,
  sceneHazards: [0, 0, 0],   // hazards found per scene
  sceneMisses: [0, 0, 0],   // misses per scene
};

/* ================================================================
   3. RENDER SCENE
   ================================================================ */

function renderScene(idx) {
  const scene = SPOT_SCENES[idx];
  const mount = document.getElementById('spotMount');
  if (!mount) return;

  // Reset per-scene state
  sp.foundHazards = new Set();
  sp.misses = 0;

  mount.innerHTML = `
    ${buildHUD(scene, idx)}
    <div class="sp-body" id="spBody">
      ${buildSceneHeader(scene, idx)}
      
      <div class="sp-image-container" id="spImgContainer">
        <!-- Main Image -->
        <img src="${scene.image}" alt="Scene Image" class="sp-main-img" draggable="false" />
        
        <!-- Hotspots Overlay -->
        <div class="sp-hotspots" id="spHotspots">
          ${scene.hotspots.map(h => `
            <div class="sp-hotspot" data-hid="${h.id}" 
                 style="left: ${h.x}%; top: ${h.y}%; width: ${h.r * 2}%; height: ${h.r * 2}%; transform: translate(-50%, -50%);">
            </div>
          `).join('')}
        </div>

        <!-- Miss Feedback Animation Container -->
        <div class="sp-miss-feedbacks" id="spMissContainer"></div>
      </div>

      <!-- Explanation Panel (Hidden until found) -->
      <div class="sp-explanation-panel" id="spExplainPanel">
        <div class="sp-exp-placeholder">點擊畫面中找出有食安問題的地方！</div>
      </div>

      <div class="sp-overlay" id="spOverlay"></div>
    </div>
  `;

  // Wire click handlers
  const imgCont = document.getElementById('spImgContainer');
  imgCont.addEventListener('click', (e) => handleImageClick(e, scene));

  updateHUD(scene);
}

/* ----------------------------------------------------------------
   Build HUD bar HTML
   ---------------------------------------------------------------- */
function buildHUD(scene, idx) {
  return `
    <div class="sp-hud" id="spHud">
      <div class="sp-hud__scene">
        ${scene.emoji} 場景 ${idx + 1} / ${SPOT_SCENES.length} &nbsp;—&nbsp; ${scene.title}
      </div>
      <div class="sp-hud__found">
        找到 <strong id="spFoundNum">0</strong> / ${scene.hazardCount} 個問題
      </div>
      <div class="sp-hud__right">
        <span class="sp-misses" id="spMissText">誤判 0 次</span>
      </div>
    </div>
  `;
}

/* ----------------------------------------------------------------
   Build scene header HTML
   ---------------------------------------------------------------- */
function buildSceneHeader(scene, idx) {
  return `
    <div class="sp-scene-header">
      <div class="sp-scene-meta">
        <span class="sp-scene-num">Scene ${idx + 1}</span>
        <span class="sp-scene-emoji">${scene.emoji}</span>
        <div>
          <div class="sp-scene-title">${scene.title}</div>
          <div class="sp-scene-subtitle">${scene.subtitle}</div>
        </div>
      </div>
      <p class="sp-scene-context">${scene.context}</p>
    </div>
  `;
}

/* ================================================================
   4. CLICK HANDLER
   ================================================================ */

function handleImageClick(e, scene) {
  // Check if click was on a hotspot
  const hotspotEl = e.target.closest('.sp-hotspot');

  if (hotspotEl) {
    const hid = parseInt(hotspotEl.dataset.hid, 10);

    if (sp.foundHazards.has(hid)) {
      // Already found, just show explanation again
      showExplanation(scene.hotspots.find(h => h.id === hid));
      return;
    }

    // ── Correct! ──────────────────────────────────────
    hotspotEl.classList.add('is-found');
    sp.foundHazards.add(hid);
    updateHUD(scene);
    showExplanation(scene.hotspots.find(h => h.id === hid));
    checkSceneComplete(scene);

  } else {
    // ── Wrong click ───────────────────────────────────
    sp.misses++;
    updateHUD(scene);

    // Show miss feedback at click location relative to container
    const rect = document.getElementById('spImgContainer').getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    showMissFeedback(x, y);

    // Clear explanation
    document.getElementById('spExplainPanel').innerHTML = `
      <div class="sp-exp-miss">❌ 這裡沒有問題，再找找看！</div>
    `;
  }
}

function showMissFeedback(x, y) {
  const container = document.getElementById('spMissContainer');
  const cross = document.createElement('div');
  cross.className = 'sp-miss-cross';
  cross.style.left = x + 'px';
  cross.style.top = y + 'px';
  container.appendChild(cross);

  // Remove after animation
  setTimeout(() => cross.remove(), 800);
}

function showExplanation(hotspotData) {
  const panel = document.getElementById('spExplainPanel');
  panel.innerHTML = `
    <div class="sp-exp-card slide-up">
      <div class="sp-exp-header">
        <span class="sp-badge">${hotspotData.badge}</span>
        <span class="sp-exp-name">${hotspotData.name}</span>
      </div>
      <div class="sp-exp-detail">${hotspotData.detail}</div>
      <div class="sp-verdict">${hotspotData.verdict}</div>
      <div class="sp-explain">${hotspotData.explain}</div>
    </div>
  `;
}

/* ================================================================
   5. HUD UPDATE
   ================================================================ */

function updateHUD(scene) {
  const foundEl = document.getElementById('spFoundNum');
  const missEl = document.getElementById('spMissText');
  if (foundEl) foundEl.textContent = sp.foundHazards.size;
  if (missEl) {
    missEl.textContent = `誤判 ${sp.misses} 次`;
    missEl.classList.toggle('has-misses', sp.misses > 0);
  }
}


/* ================================================================
   6. SCENE COMPLETION CHECK
   ================================================================ */

function checkSceneComplete(scene) {
  if (sp.foundHazards.size < scene.hazardCount) return;

  // Save per-scene stats
  sp.sceneHazards[sp.sceneIdx] = sp.foundHazards.size;
  sp.sceneMisses[sp.sceneIdx] = sp.misses;

  // Calculate scene score
  const baseScore = sp.foundHazards.size * 100;
  const cleanBonus = sp.misses === 0 ? 100 : 0;
  const sceneScore = baseScore + cleanBonus;
  sp.totalScore += sceneScore;

  const isLast = sp.sceneIdx >= SPOT_SCENES.length - 1;

  // Slight delay so user can read last explanation
  setTimeout(() => {
    showSceneOverlay(scene, sceneScore, cleanBonus, isLast);
  }, 1200);
}

/* ================================================================
   7. SCENE COMPLETE OVERLAY
   ================================================================ */

function showSceneOverlay(scene, sceneScore, cleanBonus, isLast) {
  const overlay = document.getElementById('spOverlay');
  if (!overlay) return;

  overlay.innerHTML = `
    <div class="sp-overlay__emoji">${sp.misses === 0 ? '🏅' : '✅'}</div>
    <div class="sp-overlay__title">
      場景通過！
      <span class="ol-sub">Scene ${sp.sceneIdx + 1} Complete</span>
    </div>
    <div class="sp-overlay__stats">
      <div class="sp-stat">
        <div class="sp-stat__num green">${scene.hazardCount}/${scene.hazardCount}</div>
        <div class="sp-stat__label">Hazards Found</div>
      </div>
      <div class="sp-stat">
        <div class="sp-stat__num ${sp.misses === 0 ? 'green' : 'red'}">${sp.misses}</div>
        <div class="sp-stat__label">Wrong Clicks</div>
      </div>
      <div class="sp-stat">
        <div class="sp-stat__num green">+${sceneScore}</div>
        <div class="sp-stat__label">Scene Score${cleanBonus > 0 ? ' 🌟' : ''}</div>
      </div>
    </div>
    ${cleanBonus > 0 ? '<p class="sp-overlay__tip"><strong>🌟 零誤判獎勵 +100！</strong>完美通關！</p>' : ''}
    <p class="sp-overlay__tip">${scene.completeTip}</p>
    <button class="sp-overlay__btn" id="spNextBtn">
      ${isLast ? '查看最終結果 →' : `下一場景：${SPOT_SCENES[sp.sceneIdx + 1].title} →`}
    </button>
  `;

  overlay.classList.add('is-visible');

  document.getElementById('spNextBtn').addEventListener('click', () => {
    overlay.classList.remove('is-visible');
    if (isLast) {
      showFinalResults();
    } else {
      sp.sceneIdx++;
      renderScene(sp.sceneIdx);
    }
  });
}

/* ================================================================
   8. FINAL RESULTS
   ================================================================ */

function showFinalResults() {
  const mount = document.getElementById('spotMount');
  if (!mount) return;

  const totalHazards = SPOT_SCENES.reduce((sum, s) => sum + s.hazardCount, 0);
  const totalMisses = sp.sceneMisses.reduce((a, b) => a + b, 0);
  const pct = Math.round((totalHazards / (totalHazards + totalMisses)) * 100);

  const grades = [
    { min: 100, emoji: '🏆', zh: '食安火眼金睛', en: 'Eagle Eye Inspector', color: 'var(--color-neon-green)' },
    { min: 80, emoji: '🥇', zh: '優秀觀察者', en: 'Sharp Observer', color: 'var(--color-neon-green)' },
    { min: 60, emoji: '📋', zh: '還在學習中', en: 'Still Learning', color: 'var(--color-warning)' },
    { min: 0, emoji: '📖', zh: '需要找碴特訓', en: 'Needs Training', color: 'var(--color-alert-red)' },
  ];
  const grade = grades.find(g => pct >= g.min);

  mount.innerHTML = `
    <div class="sp-final is-visible" id="spFinal">
      <div class="sp-final__grade">${grade.emoji}</div>
      <div class="sp-final__title" style="color:${grade.color}">
        ${grade.zh}
        <span class="ft-sub">${grade.en}</span>
      </div>

      <div class="sp-final__row">
        <div class="sp-stat">
          <div class="sp-stat__num green">${sp.totalScore}</div>
          <div class="sp-stat__label">Total Score</div>
        </div>
        <div class="sp-stat">
          <div class="sp-stat__num green">${totalHazards}/${totalHazards}</div>
          <div class="sp-stat__label">Hazards Found</div>
        </div>
        <div class="sp-stat">
          <div class="sp-stat__num ${totalMisses === 0 ? 'green' : 'red'}">${totalMisses}</div>
          <div class="sp-stat__label">Total Misses</div>
        </div>
        <div class="sp-stat">
          <div class="sp-stat__num green">${pct}%</div>
          <div class="sp-stat__label">Accuracy</div>
        </div>
      </div>

      <div class="sp-final__breakdown">
        ${SPOT_SCENES.map((sc, i) => {
    const bonus = sp.sceneMisses[i] === 0 ? 100 : 0;
    return `
            <div class="sp-bd-row">
              <span class="sp-bd-row__label">${sc.emoji} ${sc.title}</span>
              <span class="sp-bd-row__val green">
                +${sp.sceneHazards[i] * 100 + bonus}
                ${bonus > 0 ? ' 🌟' : ''}
              </span>
            </div>
          `;
  }).join('')}
        <div class="sp-bd-row" style="border-top:1px solid var(--color-border); margin-top:4px; padding-top:10px;">
          <span class="sp-bd-row__label" style="font-weight:700; color:var(--color-text-primary);">總分 Final Score</span>
          <span class="sp-bd-row__val green" style="font-size:1.1rem;">${sp.totalScore}</span>
        </div>
      </div>

      <div class="sp-final__actions">
        <button class="sp-final__retry" id="spRetryBtn">再玩一次 RETRY</button>
        <a href="#game" class="sp-final__next">繼續 → 食安知識測驗</a>
      </div>
    </div>
  `;

  document.getElementById('spRetryBtn').addEventListener('click', initSpotGame);
}

/* ================================================================
   9. INIT
   ================================================================ */

function initSpotGame() {
  sp = {
    sceneIdx: 0,
    foundHazards: new Set(),
    misses: 0,
    totalScore: 0,
    sceneHazards: [0, 0, 0],
    sceneMisses: [0, 0, 0],
  };
  renderScene(0);
}

/* ================================================================
   10. BOOT
   ================================================================ */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpotGame);
} else {
  initSpotGame();
}
