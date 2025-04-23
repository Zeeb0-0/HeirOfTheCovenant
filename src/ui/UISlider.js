export default class UISlider extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, initial = 50, onChange) {
    super(scene, x, y);
    this.track = scene.add.rectangle(0, 0, width, 10, 0x888888);
    this.knob  = scene.add.circle(0, 0, 15, 0xffffff).setInteractive({ draggable: true });
    this.onChange = onChange;
    this.width    = width;
    // Drag handler
    this.knob.on('drag', (pointer, dragX) => {
      const half = width / 2;
      this.knob.x = Phaser.Math.Clamp(dragX, -half, half);
      const val = Math.round(((this.knob.x + half) / width) * 100);
      this.onChange && this.onChange(val);
    });
    this.set(initial);
    this.add([ this.track, this.knob ]);
    scene.add.existing(this);
  }
  set(value) {
    const half = this.width / 2;
    this.knob.x = Phaser.Math.Clamp((value / 100) * this.width - half, -half, half);
  }
}
