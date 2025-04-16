export default class Preloader extends Phaser.Scene {
    constructor() {
      super('Preloader');
    }
    
    preload() {
      // Load assets (replace with your actual assets later)
      // Example: this.load.image('player', 'assets/sprites/player.png');
      // For now, we can leave it empty or load minimal assets.
    }
    
    create() {
      // Once assets are loaded, start the Tutorial scene.
      this.scene.start('TutorialScene');
    }
  }
  