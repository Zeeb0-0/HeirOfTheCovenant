// src/main.js

// We removed the import for Phaser since it's loaded via CDN as a global.
// Import our game scenes
import BootScene from './scenes/Boot.js';
import PreloaderScene from './scenes/Preloader.js';
import TutorialScene from './scenes/TutorialScene.js';
import MainScene from './scenes/MainScene.js';

// Game configuration object
const config = {
  type: Phaser.AUTO,
  // These dimensions define the design resolution
  width: 800,
  height: 600,
  parent: 'game-container', // This attaches the canvas to the div with id "game-container"
  backgroundColor: '#222222',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  // Scale Manager settings to ensure responsive scaling
  scale: {
    mode: Phaser.Scale.FIT, // The canvas scales to fit the parent element while preserving aspect ratio.
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center the canvas horizontally and vertically.
    width: 800,
    height: 600
  },
  scene: [ BootScene, PreloaderScene, TutorialScene, MainScene ]
};

// Create a new Phaser game instance
const game = new Phaser.Game(config);

// Optional: Listen for window resize events for any extra handling if needed.
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
