export default class Boot extends Phaser.Scene {
    constructor() {
      super('Boot');
    }
    
    preload() {
      // (Optional) preload assets needed for the preloader itself if any
    }
    
    create() {
      // Once ready, start the Preloader scene.
      this.scene.start('Preloader');
    }
  }
  