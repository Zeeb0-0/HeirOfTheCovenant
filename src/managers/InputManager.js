export default class InputManager {
  constructor(scene, settingsManager) {
    this.scene = scene;
    this.sm    = settingsManager;
    this._createBindings();
    // Rebind if settings change
    this.sm.on('changed', key => {
      if (['moveUp','moveDown','moveLeft','moveRight','attack'].includes(key)) {
        this._createBindings();
      }
    });
  }

  _createBindings() {
    // Clear existing
    if (this.keys) {
      Object.values(this.keys).forEach(k => k.destroy && k.destroy());
    }
    this.keys = {};
    this.mouseBindings = {};

    // Helper to decide if a setting refers to mouse or keyboard
    const bind = (action, name) => {
      if (name.startsWith('Mouse')) {
        // e.g. "Mouse0", "Mouse1"
        const btn = parseInt(name.slice(5), 10);
        this.mouseBindings[action] = btn;
      } else {
        // Keyboard key
        this.keys[action] = this.scene.input.keyboard.addKey(name);
      }
    };

    const s = this.sm;
    bind('up',     s.get('moveUp'));
    bind('down',   s.get('moveDown'));
    bind('left',   s.get('moveLeft'));
    bind('right',  s.get('moveRight'));
    bind('attack', s.get('attack'));
    // Always have shift for run
    this.keys.shift = this.scene.input.keyboard.addKey('SHIFT');
    // Always have ESC
    this.keys.esc = this.scene.input.keyboard.addKey('ESC');
  }

  isDown(action) {
    // Check keyboard
    if (this.keys[action]) return this.keys[action].isDown;
    // Check mouse
    if (this.mouseBindings[action] !== undefined) {
      const mask = 1 << this.mouseBindings[action];
      return (this.scene.input.activePointer.buttons & mask) !== 0;
    }
    return false;
  }
}
