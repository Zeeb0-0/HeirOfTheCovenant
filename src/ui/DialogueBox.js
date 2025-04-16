export default class DialogueBox {
    constructor(scene, x, y, width, height, message = '') {
      this.scene = scene;
      // Create a semi-transparent background
      this.background = scene.add.graphics();
      this.background.fillStyle(0x000000, 0.8);
      this.background.fillRect(x, y, width, height);
      
      // Display the message text
      this.text = scene.add.text(x + 10, y + 10, message, {
        font: '16px Arial',
        fill: '#ffffff',
        wordWrap: { width: width - 20 }
      });
    }
    
    setText(newMessage) {
      this.text.setText(newMessage);
    }
    
    destroy() {
      this.background.destroy();
      this.text.destroy();
    }
  }
  