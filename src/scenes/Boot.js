// src/scenes/Boot.js
export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }
  
  preload() {
    // Optionally load any assets for the preloader here, if needed.
  }
  
  create() {
    // Start the preloader scene once Boot is finished.
    this.scene.start('Preloader');
  }
}
