/**
 * spotGameState.js — Game State Management for Spot the Hazard
 * Handles score, combo, progression, and current run data.
 */

'use strict';

window.spotGameState = {
  // Global player progression (could be saved to localStorage)
  player: {
    level: 1,
    xp: 0,
    totalStars: 0,
    unlockedCategories: ['school', 'kitchen', 'night_market', 'supermarket', 'restaurant'] // Unlock all for now
  },

  // Current Game Run
  run: {
    mode: 'classic', // 'classic', 'challenge', 'endless'
    scenesPlayed: 0,
    totalScore: 0,
    combo: 0,
    maxCombo: 0,
    lives: 3, // Used in some modes
    hintsRemaining: 3,
    
    // Tracking current scene
    currentSceneId: null,
    currentVariantIdx: 0,
    foundHazards: new Set(),
    misses: 0,
    timeRemaining: 0,
    timerInterval: null,

    // Statistics for final summary
    history: [] // { sceneId, hazardsFound, totalHazards, misses, score, stars }
  },

  initRun(mode = 'classic') {
    this.run.mode = mode;
    this.run.scenesPlayed = 0;
    this.run.totalScore = 0;
    this.run.combo = 0;
    this.run.maxCombo = 0;
    this.run.lives = mode === 'challenge' ? 3 : 99;
    this.run.hintsRemaining = mode === 'classic' ? 5 : 3;
    this.run.history = [];
    this.resetSceneState();
  },

  resetSceneState() {
    this.run.foundHazards = new Set();
    this.run.misses = 0;
    this.clearTimer();
  },

  addScore(basePoints) {
    const comboMultiplier = 1 + (this.run.combo * 0.1); // +10% per combo
    const finalPoints = Math.floor(basePoints * comboMultiplier);
    this.run.totalScore += finalPoints;
    return finalPoints;
  },

  incrementCombo() {
    this.run.combo++;
    if (this.run.combo > this.run.maxCombo) {
      this.run.maxCombo = this.run.combo;
    }
  },

  breakCombo() {
    this.run.combo = 0;
  },

  addMiss() {
    this.run.misses++;
    this.breakCombo();
    if (this.run.mode === 'challenge') {
      this.run.timeRemaining = Math.max(0, this.run.timeRemaining - 5); // 5 sec penalty
    }
  },

  useHint(hotspots) {
    if (this.run.hintsRemaining <= 0) return null;
    
    // Find an unfound hotspot
    const remaining = hotspots.filter(h => !this.run.foundHazards.has(h.id));
    if (remaining.length === 0) return null;

    this.run.hintsRemaining--;
    const target = remaining[Math.floor(Math.random() * remaining.length)];
    return target; // Returns the target to highlight
  },

  saveSceneHistory(scene, variant) {
    const isClean = this.run.misses === 0;
    const allFound = this.run.foundHazards.size === variant.hazardCount;
    
    let stars = 0;
    if (allFound) {
      stars = 1;
      if (this.run.misses <= 2) stars = 2;
      if (this.run.misses === 0) stars = 3;
    }

    this.run.history.push({
      sceneTitle: scene.title,
      emoji: scene.emoji,
      hazardsFound: this.run.foundHazards.size,
      totalHazards: variant.hazardCount,
      misses: this.run.misses,
      stars: stars
    });

    // Add XP
    this.addXP(stars * 50);
  },

  addXP(amount) {
    this.player.xp += amount;
    const xpNeeded = this.player.level * 200;
    if (this.player.xp >= xpNeeded) {
      this.player.level++;
      this.player.xp -= xpNeeded;
      // Level up event can be handled by UI
    }
    this.savePlayerState();
  },

  savePlayerState() {
    localStorage.setItem('spotPlayerState', JSON.stringify(this.player));
  },

  loadPlayerState() {
    const saved = localStorage.getItem('spotPlayerState');
    if (saved) {
      this.player = { ...this.player, ...JSON.parse(saved) };
    }
  },

  startTimer(seconds, onTick, onTimeout) {
    this.clearTimer();
    this.run.timeRemaining = seconds;
    this.run.timerInterval = setInterval(() => {
      this.run.timeRemaining--;
      if (onTick) onTick(this.run.timeRemaining);
      if (this.run.timeRemaining <= 0) {
        this.clearTimer();
        if (onTimeout) onTimeout();
      }
    }, 1000);
  },

  clearTimer() {
    if (this.run.timerInterval) {
      clearInterval(this.run.timerInterval);
      this.run.timerInterval = null;
    }
  }
};

// Initialize
window.spotGameState.loadPlayerState();
