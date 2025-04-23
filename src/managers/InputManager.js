// src/managers/InputManager.js
export default class InputManager {
    constructor(scene, settingsManager) {
      this.scene = scene;
      this.settings = settingsManager;
      this.binds = {};
      this._createKeys();
      this.settings.on('changed', (key) => {
        if (['moveUp','moveDown','moveLeft','moveRight','attack'].includes(key)) {
          this._createKeys();
        }
      });
    }
  
    _createKeys() {
      const sm = this.settings;
      if (this.keys) this.scene.input.keyboard.removeKey(Object.values(this.keys));
      this.keys = this.scene.input.keyboard.addKeys({
        up: sm.get('moveUp'),
        down: sm.get('moveDown'),
        left: sm.get('moveLeft'),
        right: sm.get('moveRight'),
        attack: sm.get('attack'),
        shift: 'SHIFT'
      });
    }
  
    isDown(action) {
      return this.keys[action]?.isDown;
    }
  }
  