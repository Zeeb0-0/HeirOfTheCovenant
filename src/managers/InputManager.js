// src/managers/InputManager.js

export default class InputManager {
  constructor(scene, settingsManager) {
    this.scene = scene;
    this.sm    = settingsManager;
    this._createKeys();
    this.sm.on('changed', key => {
      if (['moveUp','moveDown','moveLeft','moveRight','attack'].includes(key)) {
        this._createKeys();
      }
    });
  }

  _createKeys() {
    // Clean up old keys
    if (this.keys) {
      this.scene.input.keyboard.removeKey(Object.values(this.keys));
    }
    // Map actions to whatever the player set in settings
    this.keys = this.scene.input.keyboard.addKeys({
      up:     this.sm.get('moveUp'),
      down:   this.sm.get('moveDown'),
      left:   this.sm.get('moveLeft'),
      right:  this.sm.get('moveRight'),
      attack: this.sm.get('attack'),
      shift:  'SHIFT'
    });
  }

  /** Check if an action is currently pressed. */
  isDown(action) {
    return this.keys[action]?.isDown;
  }

  /** Get the Phaser Key object for low‐level listeners. */
  getKey(action) {
    return this.keys[action];
  }

  /** Convenience: any movement key pressed? */
  anyMovement() {
    return this.isDown('up') || this.isDown('down') || this.isDown('left') || this.isDown('right');
  }
}
