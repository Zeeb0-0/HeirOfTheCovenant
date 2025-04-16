// Import scenes
import BootScene from './scenes/Boot.js';
import PreloaderScene from './scenes/Preloader.js';
import TutorialScene from './scenes/TutorialScene.js';
import MainScene from './scenes/MainScene.js';

// Game configuration object
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#222222',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false, // Set true during development
    },
  },
  scene: [BootScene, PreloaderScene, TutorialScene, MainScene],
};

// Create the game instance
const game = new Phaser.Game(config);
