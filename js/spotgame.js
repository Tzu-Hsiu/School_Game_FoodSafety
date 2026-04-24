/**
 * spotgame.js — "Spot the Hazard" game engine (Main Controller)
 * Connects the state, scene manager, and UI renderer.
 */

'use strict';

window.spotgame = {
  currentSceneData: null,

  init() {
    // Show main menu on load
    window.spotUIRenderer.renderMainMenu();
  },

  startGame(mode) {
    window.spotGameState.initRun(mode);
    window.spotSceneManager.prepareQueue(mode);
    this.nextScene();
  },

  nextScene() {
    const sceneData = window.spotSceneManager.getNextScene();
    
    if (!sceneData) {
      this.endGame();
      return;
    }

    this.currentSceneData = sceneData;
    window.spotGameState.resetSceneState();
    
    // Start timer for challenge mode
    if (window.spotGameState.run.mode === 'challenge') {
      window.spotGameState.startTimer(
        sceneData.scene.timeLimit || 30,
        (time) => window.spotUIRenderer.updateHUD(),
        () => this.handleTimeout()
      );
    }

    window.spotUIRenderer.renderScene(sceneData);
    this.bindEvents();
  },

  bindEvents() {
    const imgCont = document.getElementById('spImgContainer');
    if (imgCont) {
      imgCont.addEventListener('click', (e) => this.handleImageClick(e));
    }

    const hintBtn = document.getElementById('spHintBtn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.handleHintClick());
    }
  },

  handleImageClick(e) {
    if (!this.currentSceneData) return;

    const { scene, variant } = this.currentSceneData;
    const state = window.spotGameState.run;
    const hotspotEl = e.target.closest('.sp-hotspot');

    if (hotspotEl) {
      const hid = parseInt(hotspotEl.dataset.hid, 10);

      if (state.foundHazards.has(hid)) {
        // Already found, just show explanation again
        window.spotUIRenderer.showExplanation(variant.hotspots.find(h => h.id === hid), 0);
        return;
      }

      // ── Correct! ──────────────────────────────────────
      hotspotEl.classList.add('is-found');
      state.foundHazards.add(hid);
      
      window.spotGameState.incrementCombo();
      const points = window.spotGameState.addScore(100);
      
      window.spotUIRenderer.updateHUD();
      window.spotUIRenderer.showExplanation(variant.hotspots.find(h => h.id === hid), state.combo);
      
      this.checkSceneComplete();

    } else {
      // ── Wrong click ───────────────────────────────────
      window.spotGameState.addMiss();
      window.spotUIRenderer.updateHUD();

      // Show miss feedback at click location relative to container
      const rect = document.getElementById('spImgContainer').getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      window.spotUIRenderer.showMissFeedback(x, y);

      if (state.mode === 'challenge' && state.timeRemaining <= 0) {
        this.handleTimeout();
      }
    }
  },

  handleHintClick() {
    if (!this.currentSceneData) return;
    const target = window.spotGameState.useHint(this.currentSceneData.variant.hotspots);
    if (target) {
      window.spotUIRenderer.showHintArea(target);
      window.spotUIRenderer.updateHUD();
    }
  },

  checkSceneComplete() {
    const { variant } = this.currentSceneData;
    const state = window.spotGameState.run;

    if (state.foundHazards.size >= variant.hazardCount) {
      window.spotGameState.clearTimer();
      window.spotGameState.saveSceneHistory(this.currentSceneData.scene, variant);

      // Add clear bonus
      const clearBonus = state.misses === 0 ? 100 : 0;
      window.spotGameState.addScore(clearBonus);
      
      setTimeout(() => {
        window.spotUIRenderer.showSceneOverlay(this.currentSceneData, () => this.nextScene());
      }, 1200);
    }
  },

  handleTimeout() {
    window.spotGameState.clearTimer();
    const state = window.spotGameState.run;
    state.lives--;
    
    if (state.lives <= 0) {
      this.endGame();
    } else {
      // Force end scene and move to next
      window.spotGameState.saveSceneHistory(this.currentSceneData.scene, this.currentSceneData.variant);
      window.spotUIRenderer.showSceneOverlay(this.currentSceneData, () => this.nextScene());
    }
  },

  endGame() {
    window.spotGameState.clearTimer();
    window.spotUIRenderer.showFinalResults(() => this.init());
  }
};

/* ================================================================
   BOOT
   ================================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.spotgame.init());
} else {
  window.spotgame.init();
}
