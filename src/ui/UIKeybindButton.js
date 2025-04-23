export default class UIKeybindButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, action, settingsManager) {
      super(scene, x, y, `${action}: [${settingsManager.get(action)}]`, {
        fontFamily: '"IM Fell English", serif',
        fontSize: '24px',
        fill: '#ffffff',
        backgroundColor: '#444444',
        padding: { x:15, y:8 }
      });
      this.action = action;
      this.sm = settingsManager;
      this.setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this._remap());
      scene.add.existing(this);
    }
    _remap() {
      this.setText(`${this.action}: Press key...`);
      this.scene.input.keyboard.once('keydown', event => {
        const key = event.key.toUpperCase();
        this.sm.set(this.action, key);
        this.setText(`${this.action}: [${key}]`);
      });
    }
  }
  