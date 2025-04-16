export default class MainScene extends Phaser.Scene {
    constructor() {
      super('MainScene');
    }
    
    create() {
      // Placeholder text for the main scene
      this.add.text(100, 100, 'Main Game Scene\nHere your adventure begins...', {
        font: '24px Arial',
        fill: '#ffffff'
      });
    }
  }
  