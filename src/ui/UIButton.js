// src/ui/UIButton.js
export default class UIButton extends Phaser.GameObjects.Text {
  constructor(scene, x, y, label, callback, style = {}) {
    const baseStyle = {
      fontFamily: '"IM Fell English", serif',
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    };
    super(scene, x, y, label, { ...baseStyle, ...style, backgroundColor: style.backgroundColor || baseStyle.backgroundColor });
    this.setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', callback)
      .on('pointerover', () => {
        // Grow to 110% on hover
        this.setScale(this._baseScale * 1.1);
        this.setStyle({ fill: '#ffff00' });
      })
      .on('pointerout', () => {
        // Restore original scale
        this.setScale(this._baseScale);
        this.setStyle({ fill: '#ffffff' });
      });

    // Store base scale for hover logic
    this._baseScale = 1;
    this.setScale(this._baseScale);

    scene.add.existing(this);
  }
}
