// src/scenes/Preloader.js
export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }
  
  preload() {
    // Load any assets that are essential for early gameplay. For now, we can leave it as a placeholder.
    // e.g., this.load.image('background', 'assets/background.png');
  }
  
  create() {
    // Once preload finishes, launch the main (or tutorial) scene.
    this.scene.start('TutorialScene');
  }
}
