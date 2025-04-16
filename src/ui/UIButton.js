// src/ui/UIButton.js
export default class UIButton extends Phaser.GameObjects.Text {
    /**
     * Creates a new UIButton.
     * @param {Phaser.Scene} scene - The scene that this button belongs to.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {string} label - The text to display.
     * @param {function} callback - The function to call on pointer down.
     * @param {object} [style] - Optional style overrides.
     */
    constructor(scene, x, y, label, callback, style = {}) {
      // Define default style
      const defaultStyle = {
        fontFamily: '"IM Fell English", serif',
        fontSize: '32px',
        fill: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 20, y: 10 }
      };
      super(scene, x, y, label, Object.assign({}, defaultStyle, style));
      
      this.setOrigin(0.5);
      // Set interactivity with hand cursor and add event listeners.
      this.setInteractive({ useHandCursor: true });
      this.on('pointerdown', callback);
      this.on('pointerover', () => this.setStyle({ fill: '#ffff00' }));
      this.on('pointerout', () => this.setStyle({ fill: '#ffffff' }));
      
      // Add the button to the current scene.
      scene.add.existing(this);
    }
  }
  