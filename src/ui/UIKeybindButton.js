export default class UIKeybindButton extends Phaser.GameObjects.Text {
  constructor(scene, x, y, action, settingsManager) {
    super(scene, x, y, `${action}: [${settingsManager.get(action)}]`, {
      fontFamily:    '"IM Fell English", serif',
      fontSize:      '24px',
      fill:          '#ffffff',
      backgroundColor:'#444444',
      padding:       { x:15,y:8 }
    });
    this.action = action;
    this.sm     = settingsManager;
    this.setOrigin(0.5)
      .setInteractive({ useHandCursor:true })
      .on('pointerdown', () => this._beginRemap());
    scene.add.existing(this);
  }

  _beginRemap() {
    const prev = this.sm.get(this.action);
    this.setText(`${this.action}: Press key/mouse (Esc to cancel)`);

    // Handlers
    const onKey = event => {
      if (event.key === 'Escape') {
        this.setText(`${this.action}: [${prev}]`);
      } else {
        const key = event.key.toUpperCase();
        this.sm.set(this.action, key);
        this.setText(`${this.action}: [${key}]`);
      }
      cleanup();
    };
    const onClick = pointer => {
      const btn = pointer.button;           // 0=left,1=middle,2=right...
      const btnName = 'Mouse' + btn;        // e.g. "Mouse0"
      this.sm.set(this.action, btnName);
      this.setText(`${this.action}: [${btnName}]`);
      cleanup();
    };

    const cleanup = () => {
      this.scene.input.keyboard.off('keydown', onKey);
      this.scene.input.off('pointerdown', onClick);
    };

    // Listen for next input
    this.scene.input.keyboard.on('keydown', onKey);
    this.scene.input.on('pointerdown', onClick);
  }
}
