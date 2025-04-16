export default class TutorialScene extends Phaser.Scene {
    constructor() {
      super('TutorialScene');
    }
    
    create() {
      // Display tutorial text on the screen
      this.add.text(100, 100, 'Welcome, traveler! Use the arrow keys to move.\n(Click or tap to continue...)', {
        font: '24px Arial',
        fill: '#ffffff'
      });
  
      // Listen for pointer input (mouse or touch) to proceed
      this.input.once('pointerdown', () => {
        // You could trigger an NPC dialogue here using your DialogueBox (see below)
        // For now, we’ll just continue to the MainScene.
        this.scene.start('MainScene');
      });
    }
  }
  