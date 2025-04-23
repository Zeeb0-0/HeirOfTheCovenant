// src/scenes/PreloaderScene.js
export default class PreloaderScene extends Phaser.Scene {
  constructor(){ super('Preloader'); }
  preload(){
    // e.g. this.load.audio('bgm', AssetPaths.audio.bgm);
  }
  create(){ this.scene.start('TitleScene'); }
}
