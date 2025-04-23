// src/scenes/TutorialScene.js
import BaseScene from './BaseScene.js';
export default class TutorialScene extends BaseScene {
  constructor(){ super('TutorialScene'); }
  create(){
    super.init();
    this.add.text(100,100,'Tutorial: Use your keys to move.','16px Arial').setInteractive()
      .on('pointerdown',()=>this.scene.start('MainScene'));
  }
}
