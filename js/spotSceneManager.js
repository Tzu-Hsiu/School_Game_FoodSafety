/**
 * spotSceneManager.js — Handles scene loading, category filtering, and randomization
 */

'use strict';

window.spotSceneManager = {
  queue: [],
  
  // Prepare a sequence of scenes based on the game mode
  prepareQueue(mode) {
    const allScenes = window.SPOT_SCENES;
    this.queue = [];

    if (mode === 'classic') {
      // Classic: 3 random scenes from different categories
      const shuffled = [...allScenes].sort(() => 0.5 - Math.random());
      this.queue = shuffled.slice(0, 3);
    } 
    else if (mode === 'challenge') {
      // Challenge: 5 random scenes, mixed difficulties
      const shuffled = [...allScenes].sort(() => 0.5 - Math.random());
      this.queue = shuffled.slice(0, 5);
    }
    else if (mode === 'endless') {
      // Endless: Infinite queue (we just re-fill or pick randomly on the fly)
      // We'll handle this by returning a random scene each time
    }
  },

  getNextScene() {
    const state = window.spotGameState.run;
    
    if (state.mode === 'endless') {
      const allScenes = window.SPOT_SCENES;
      const randomScene = allScenes[Math.floor(Math.random() * allScenes.length)];
      return this._prepareSceneData(randomScene);
    }

    if (this.queue.length === 0) {
      return null; // Queue empty, game over
    }

    const scene = this.queue.shift();
    return this._prepareSceneData(scene);
  },

  _prepareSceneData(scene) {
    // Pick a random variant if multiple exist
    const variantIdx = Math.floor(Math.random() * scene.variants.length);
    const variant = scene.variants[variantIdx];

    // Optionally shuffle hotspot order so they aren't always discovered in same order
    const hotspots = [...variant.hotspots].sort(() => 0.5 - Math.random());

    return {
      scene,
      variant: {
        ...variant,
        hotspots
      },
      variantIdx
    };
  }
};
