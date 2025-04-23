export default class UIModal extends Phaser.GameObjects.Container {
  constructor(scene, fullW, fullH) {
    super(scene, 0, 0);
    const cx = scene.cameras.main.centerX;
    const cy = scene.cameras.main.centerY;
    // full-screen backdrop
    this.bg  = scene.add.rectangle(cx, cy, fullW, fullH, 0x000000, 0.5).setScrollFactor(0);
    // centered box (80% × 60%)
    this.box = scene.add.rectangle(cx, cy, fullW * 0.8, fullH * 0.6, 0x222222, 1).setScrollFactor(0);
    this.add([ this.bg, this.box ]);
    scene.add.existing(this);
    this.setVisible(false);
  }
  show() { this.setVisible(true); }
  hide() { this.setVisible(false); }
}
