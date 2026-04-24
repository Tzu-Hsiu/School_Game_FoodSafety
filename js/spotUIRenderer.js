/**
 * spotUIRenderer.js — Handles DOM updates, rendering, and animations for Spot the Hazard
 */

'use strict';

window.spotUIRenderer = {
  mountId: 'spotMount',

  getMount() {
    return document.getElementById(this.mountId);
  },

  renderMainMenu() {
    const mount = this.getMount();
    if (!mount) return;

    const player = window.spotGameState.player;

    mount.innerHTML = `
      <div class="sp-menu fade-in">
        <div class="sp-menu-header">
          <div class="sp-player-stats">
            <span class="sp-level-badge">LV.${player.level}</span>
            <div class="sp-xp-bar">
              <div class="sp-xp-fill" style="width: ${(player.xp / (player.level * 200)) * 100}%"></div>
            </div>
          </div>
          <h2>選擇遊戲模式</h2>
        </div>
        
        <div class="sp-mode-cards">
          <div class="sp-mode-card" data-mode="classic">
            <h3>🛡️ 經典模式</h3>
            <p>循序漸進，不限時間。適合初學者認識各種食安危機。</p>
            <button class="sp-btn sp-btn-primary" onclick="window.spotgame.startGame('classic')">開始經典</button>
          </div>
          
          <div class="sp-mode-card" data-mode="challenge">
            <h3>⏱️ 挑戰模式</h3>
            <p>嚴格限時！考驗你的眼力和反應速度。誤判會扣除時間！</p>
            <button class="sp-btn sp-btn-warning" onclick="window.spotgame.startGame('challenge')">限時挑戰</button>
          </div>

          <div class="sp-mode-card" data-mode="endless">
            <h3>♾️ 無盡模式</h3>
            <p>源源不絕的關卡，直到你放棄為止。看看你能撐多久！</p>
            <button class="sp-btn sp-btn-purple" onclick="window.spotgame.startGame('endless')">無盡挑戰</button>
          </div>
        </div>
      </div>
    `;
  },

  renderScene(sceneData) {
    const mount = this.getMount();
    if (!mount) return;

    const { scene, variant, variantIdx } = sceneData;
    const state = window.spotGameState.run;

    mount.innerHTML = `
      ${this._buildHUD(scene, variant, state)}
      <div class="sp-body" id="spBody">
        ${this._buildSceneHeader(scene)}
        
        <div class="sp-image-container" id="spImgContainer">
          <img src="${variant.image}" alt="Scene Image" class="sp-main-img" draggable="false" />
          
          <div class="sp-hotspots" id="spHotspots">
            ${variant.hotspots.map(h => `
              <div class="sp-hotspot" data-hid="${h.id}" 
                   style="left: ${h.x}%; top: ${h.y}%; width: ${h.r * 2}%; height: ${h.r * 2}%; transform: translate(-50%, -50%);">
              </div>
            `).join('')}
          </div>

          <div class="sp-miss-feedbacks" id="spMissContainer"></div>
          <div class="sp-hint-overlay" id="spHintOverlay"></div>
        </div>

        <div class="sp-explanation-panel" id="spExplainPanel">
          <div class="sp-exp-placeholder">點擊畫面中找出有食安問題的地方！</div>
        </div>

        <div class="sp-overlay" id="spOverlay"></div>
      </div>
    `;
  },

  _buildHUD(scene, variant, state) {
    const timeDisplay = state.mode === 'challenge' 
      ? `<div class="sp-hud__timer" id="spTimer">⏳ ${state.timeRemaining}s</div>` 
      : '';

    const livesDisplay = state.mode === 'challenge'
      ? `<div class="sp-hud__lives">❤️ x<span id="spLivesNum">${state.lives}</span></div>`
      : '';

    return `
      <div class="sp-hud" id="spHud">
        <div class="sp-hud__left">
          ${timeDisplay}
          ${livesDisplay}
          <div class="sp-hud__scene">
            ${scene.emoji} ${scene.title}
          </div>
        </div>
        <div class="sp-hud__center">
          找到 <strong id="spFoundNum">${state.foundHazards.size}</strong> / ${variant.hazardCount}
        </div>
        <div class="sp-hud__right">
          <div class="sp-hud__score">分數: <span id="spScoreText">${state.totalScore}</span></div>
          <div class="sp-combo" id="spComboText" style="opacity: ${state.combo > 1 ? 1 : 0}">
            Combo x${state.combo} 🔥
          </div>
          <button class="sp-btn-hint" id="spHintBtn" ${state.hintsRemaining <= 0 ? 'disabled' : ''}>
            💡 提示 (${state.hintsRemaining})
          </button>
        </div>
      </div>
    `;
  },

  _buildSceneHeader(scene) {
    const diffColor = scene.difficulty === 'hard' ? 'var(--color-alert-red)' : 
                      scene.difficulty === 'medium' ? 'var(--color-warning)' : 'var(--color-neon-green)';

    return `
      <div class="sp-scene-header">
        <div class="sp-scene-meta">
          <span class="sp-scene-emoji">${scene.emoji}</span>
          <div>
            <div class="sp-scene-title">${scene.title} <span style="font-size:0.6em; color:${diffColor}; border:1px solid ${diffColor}; padding:2px 4px; border-radius:4px; margin-left:8px; vertical-align:middle;">${scene.difficulty.toUpperCase()}</span></div>
            <div class="sp-scene-subtitle">${scene.subtitle}</div>
          </div>
        </div>
        <p class="sp-scene-context">${scene.context}</p>
      </div>
    `;
  },

  updateHUD() {
    const state = window.spotGameState.run;
    
    const foundEl = document.getElementById('spFoundNum');
    if (foundEl) foundEl.textContent = state.foundHazards.size;

    const scoreEl = document.getElementById('spScoreText');
    if (scoreEl) scoreEl.textContent = state.totalScore;

    const comboEl = document.getElementById('spComboText');
    if (comboEl) {
      if (state.combo > 1) {
        comboEl.textContent = `Combo x${state.combo} 🔥`;
        comboEl.style.opacity = 1;
        comboEl.classList.remove('pop');
        void comboEl.offsetWidth; // trigger reflow
        comboEl.classList.add('pop');
      } else {
        comboEl.style.opacity = 0;
      }
    }

    const hintBtn = document.getElementById('spHintBtn');
    if (hintBtn) {
      hintBtn.innerHTML = `💡 提示 (${state.hintsRemaining})`;
      hintBtn.disabled = state.hintsRemaining <= 0;
    }

    const timerEl = document.getElementById('spTimer');
    if (timerEl) {
      timerEl.textContent = `⏳ ${state.timeRemaining}s`;
      if (state.timeRemaining <= 10) timerEl.classList.add('danger');
      else timerEl.classList.remove('danger');
    }

    const livesEl = document.getElementById('spLivesNum');
    if (livesEl) livesEl.textContent = state.lives;
  },

  showMissFeedback(x, y) {
    const container = document.getElementById('spMissContainer');
    if (!container) return;
    
    const cross = document.createElement('div');
    cross.className = 'sp-miss-cross';
    cross.style.left = x + 'px';
    cross.style.top = y + 'px';
    container.appendChild(cross);

    const imgCont = document.getElementById('spImgContainer');
    imgCont.classList.add('shake');

    setTimeout(() => {
      cross.remove();
      imgCont.classList.remove('shake');
    }, 500);

    const panel = document.getElementById('spExplainPanel');
    if (panel) {
      panel.innerHTML = `<div class="sp-exp-miss">❌ 這裡沒有問題，再找找看！ (Combo 中斷)</div>`;
    }
  },

  showExplanation(hotspotData, combo) {
    const panel = document.getElementById('spExplainPanel');
    if (!panel) return;

    const comboHtml = combo > 1 ? `<span class="sp-combo-badge">Combo x${combo}</span>` : '';
    const sevColor = hotspotData.severity === 'high' ? 'var(--color-alert-red)' :
                     hotspotData.severity === 'medium' ? 'var(--color-warning)' : 'var(--color-neon-green)';

    panel.innerHTML = `
      <div class="sp-exp-card slide-up" style="border-left: 4px solid ${sevColor};">
        <div class="sp-exp-header">
          <div>
            <span class="sp-badge">${hotspotData.badge}</span>
            <span class="sp-exp-name">${hotspotData.name}</span>
            ${comboHtml}
          </div>
          <span style="font-size:0.7em; color:var(--color-text-muted);">嚴重度: <span style="color:${sevColor}">${hotspotData.severity.toUpperCase()}</span></span>
        </div>
        <div class="sp-exp-detail">${hotspotData.detail}</div>
        <div class="sp-verdict" style="color:${sevColor}">${hotspotData.verdict}</div>
        <div class="sp-explain">${hotspotData.explain}</div>
        ${hotspotData.realCase ? `<div class="sp-realcase"><strong>📰 真實案例：</strong>${hotspotData.realCase}</div>` : ''}
        ${hotspotData.tip ? `<div class="sp-tip"><strong>💡 防護建議：</strong>${hotspotData.tip}</div>` : ''}
      </div>
    `;
  },

  showHintArea(hotspot) {
    const overlay = document.getElementById('spHintOverlay');
    if (!overlay) return;

    // Show a pulsing circle around the general area
    overlay.innerHTML = `
      <div class="sp-hint-circle pulse" 
           style="left: ${hotspot.x}%; top: ${hotspot.y}%; width: ${hotspot.r * 3}%; height: ${hotspot.r * 3}%; transform: translate(-50%, -50%);">
      </div>
    `;

    setTimeout(() => {
      overlay.innerHTML = '';
    }, 2000);
  },

  showSceneOverlay(sceneData, onNext) {
    const overlay = document.getElementById('spOverlay');
    if (!overlay) return;

    const { scene, variant } = sceneData;
    const state = window.spotGameState.run;
    const isClean = state.misses === 0;

    overlay.innerHTML = `
      <div class="sp-overlay__emoji">${isClean ? '🏅' : '✅'}</div>
      <div class="sp-overlay__title">
        場景通過！
        <span class="ol-sub">${scene.title}</span>
      </div>
      <div class="sp-overlay__stats">
        <div class="sp-stat">
          <div class="sp-stat__num green">${state.foundHazards.size}/${variant.hazardCount}</div>
          <div class="sp-stat__label">找到問題</div>
        </div>
        <div class="sp-stat">
          <div class="sp-stat__num ${isClean ? 'green' : 'red'}">${state.misses}</div>
          <div class="sp-stat__label">誤判次數</div>
        </div>
        <div class="sp-stat">
          <div class="sp-stat__num green">${state.maxCombo}</div>
          <div class="sp-stat__label">最大 Combo</div>
        </div>
      </div>
      <p class="sp-overlay__tip">${scene.completeTip}</p>
      <button class="sp-overlay__btn" id="spNextBtn">繼續 →</button>
    `;

    overlay.classList.add('is-visible');

    document.getElementById('spNextBtn').addEventListener('click', () => {
      overlay.classList.remove('is-visible');
      onNext();
    });
  },

  showFinalResults(onRetry) {
    const mount = this.getMount();
    if (!mount) return;

    const state = window.spotGameState.run;
    const history = state.history;
    
    let totalHazards = 0;
    let foundHazards = 0;
    let totalMisses = 0;
    let totalStars = 0;

    history.forEach(h => {
      totalHazards += h.totalHazards;
      foundHazards += h.hazardsFound;
      totalMisses += h.misses;
      totalStars += h.stars;
    });

    const pct = totalHazards > 0 ? Math.round((foundHazards / (foundHazards + totalMisses)) * 100) : 0;

    mount.innerHTML = `
      <div class="sp-final is-visible" id="spFinal">
        <div class="sp-final__grade">${pct >= 80 ? '🏆' : pct >= 60 ? '🥇' : '📋'}</div>
        <div class="sp-final__title">
          ${state.mode === 'endless' ? '生存結束' : '遊戲結算'}
          <span class="ft-sub">Mode: ${state.mode.toUpperCase()}</span>
        </div>

        <div class="sp-final__row">
          <div class="sp-stat">
            <div class="sp-stat__num green">${state.totalScore}</div>
            <div class="sp-stat__label">Total Score</div>
          </div>
          <div class="sp-stat">
            <div class="sp-stat__num green">${foundHazards}/${totalHazards}</div>
            <div class="sp-stat__label">Hazards Found</div>
          </div>
          <div class="sp-stat">
            <div class="sp-stat__num ${totalMisses === 0 ? 'green' : 'red'}">${totalMisses}</div>
            <div class="sp-stat__label">Total Misses</div>
          </div>
          <div class="sp-stat">
            <div class="sp-stat__num" style="color:var(--color-warning);">⭐ ${totalStars}</div>
            <div class="sp-stat__label">Stars Earned</div>
          </div>
        </div>

        <div class="sp-final__actions" style="margin-top: 30px;">
          <button class="sp-final__retry" id="spRetryBtn">回到主選單</button>
        </div>
      </div>
    `;

    document.getElementById('spRetryBtn').addEventListener('click', onRetry);
  }
};
