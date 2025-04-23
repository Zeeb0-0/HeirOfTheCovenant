export default class UIButton extends Phaser.GameObjects.Text {
  constructor(scene, x, y, label, callback, style = {}) {
    const base = {
      fontFamily:    '"IM Fell English", serif',
      fontSize:      '32px',
      fill:          '#ffffff',
      backgroundColor:'#333333',
      padding:       { x:20, y:10 }
    };
    super(scene, x, y, label, { ...base, ...style, backgroundColor: style.backgroundColor || base.backgroundColor });
    this.setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', callback)
      .on('pointerover',  () => { this.setScale(this._baseScale * 1.1); this.setStyle({ fill: '#ffff00' }); })
      .on('pointerout',   () => { this.setScale(this._baseScale);      this.setStyle({ fill: '#ffffff' }); });
    this._baseScale = 1;
    this.setScale(this._baseScale);
    scene.add.existing(this);
  }
}
