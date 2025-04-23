import SettingsManager from '../managers/SettingsManager.js';
import InputManager    from '../managers/InputManager.js';

export default class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  init() {
    this.settings = this.settings || new SettingsManager();
    this.inputMgr = this.inputMgr || new InputManager(this, this.settings);

    // Bind volume setting to Phaser's sound system
    this.settings.on('changed', (k, v) => {
      if (k === 'volume') {
        const num = parseFloat(v);
        if (isFinite(num)) this.sound.volume = Phaser.Math.Clamp(num/100, 0, 1);
      }
    });
    // Apply initial volume
    {
      const vol = parseFloat(this.settings.get('volume'));
      this.sound.volume = Phaser.Math.Clamp(isFinite(vol)?vol:50 / 100, 0, 1);
    }
  }

  fadeToScene(key, duration = 500) {
    this.cameras.main.fadeOut(duration,0,0,0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(key));
  }
}
