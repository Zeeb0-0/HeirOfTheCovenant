// (Removed `import 'phaser';` — Phaser is provided by the CDN in index.html)

// Import only your scenes and managers
import TitleScene from './scenes/TitleScene.js';
import MainScene  from './scenes/MainScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#222222',
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [ TitleScene, MainScene ]
};

window.game = new Phaser.Game(config);
