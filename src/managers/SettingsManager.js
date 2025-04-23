// src/managers/SettingsManager.js

// We no longer import Phaser as a module — Phaser is provided globally via CDN.

export default class SettingsManager extends window.Phaser.Events.EventEmitter {
  constructor() {
    super();

    // Load saved settings or fall back to defaults
    let loaded;
    try {
      loaded = JSON.parse(localStorage.getItem('gameSettings'));
    } catch (err) {
      loaded = null;
    }

    this.settings = loaded && typeof loaded === 'object'
      ? loaded
      : {
          moveUp:    'W',
          moveDown:  'S',
          moveLeft:  'A',
          moveRight: 'D',
          attack:    'SPACE',
          volume:     50
        };

    // Clamp and coerce volume into a safe finite range [0–100]
    let v = parseFloat(this.settings.volume);
    if (!isFinite(v) || v < 0 || v > 100) {
      v = 50;
    }
    this.settings.volume = v;
  }

  get(key) {
    return this.settings[key];
  }

  set(key, value) {
    // Update in-memory
    this.settings[key] = value;
    // Persist
    localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    // Emit change event
    this.emit('changed', key, value);
  }
}
