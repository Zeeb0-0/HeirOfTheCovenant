// src/main.js

// Attempt to load saved game settings from localStorage; if none, use defaults.
if (localStorage.getItem('gameSettings')) {
  window.gameSettings = JSON.parse(localStorage.getItem('gameSettings'));
} else {
  window.gameSettings = {
    moveUp: 'W',
    moveDown: 'S',
    moveLeft: 'A',
    moveRight: 'D',
    attack: 'SPACE'
  };
}

import TitleScene from './scenes/TitleScene.js';
// Optionally, import other scenes as needed; here we'll transition to MainScene later.
import MainScene from './scenes/MainScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,    // Designed game width
  height: 600,   // Designed game height
  parent: 'game-container', // The div defined in index.html
  backgroundColor: '#222222',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,      // Ensures full screen fill
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [TitleScene, MainScene],
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
  console.log("Window resized:", window.innerWidth, window.innerHeight);
});
