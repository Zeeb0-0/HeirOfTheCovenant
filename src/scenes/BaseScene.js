// src/scenes/BaseScene.js

import SettingsManager from '../managers/SettingsManager.js';
import InputManager   from '../managers/InputManager.js';

export default class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  init() {
    // Initialize (or reuse) the settings and input managers
    this.settings = this.settings || new SettingsManager();
    this.inputMgr = this.inputMgr || new InputManager(this, this.settings);

    // Listen for any volume changes and apply safely
    this.settings.on('changed', (key, value) => {
      if (key === 'volume') {
        const num = parseFloat(value);
        if (isFinite(num)) {
          this.sound.volume = Phaser.Math.Clamp(num / 100, 0, 1);
        }
      }
    });

    // On init, set the current volume once
    {
      const initial = parseFloat(this.settings.get('volume'));
      const vol = isFinite(initial) ? initial : 50;
      this.sound.volume = Phaser.Math.Clamp(vol / 100, 0, 1);
    }
  }

  // Helper to fade out then start another scene
  fadeToScene(key, duration = 500) {
    this.cameras.main.fadeOut(duration, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(key);
    });
  }
}
