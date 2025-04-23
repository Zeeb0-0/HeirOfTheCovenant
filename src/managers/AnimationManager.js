// src/managers/AnimationManager.js

export default class AnimationManager {
    // Define all animation categories and their properties
    static categories = [
      { name: 'idle',   frames: 4, fps: 8,  loop: true  },
      { name: 'walk',   frames: 6, fps: 8,  loop: true  },
      { name: 'run',    frames: 6, fps: 12, loop: true  },
      { name: 'pierce', frames: 8, fps: 12, loop: false },
      { name: 'death',  frames: 8, fps: 6,  loop: false },
      { name: 'hit',    frames: 4, fps: 8,  loop: false }
    ];
    static directions = ['Down','Up','Side'];
  
    /**
     * Preload all character animations under the given basePath.
     * @param {Phaser.Scene} scene
     * @param {string} basePath
     */
    static preload(scene, basePath = 'assets/sprites/Entities/Characters/Body_A/Animations') {
      this.categories.forEach(cat => {
        const capName = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
        this.directions.forEach(dir => {
          const key  = `${cat.name}${dir}`;
          const path = `${basePath}/${capName}_Base/${capName}_${dir}-Sheet.png`;
          scene.load.spritesheet(key, path, { frameWidth: 64, frameHeight: 64 });
        });
      });
    }
  
    /**
     * Create all the animations in Phaser's Animation Manager.
     * @param {Phaser.Scene} scene
     */
    static create(scene) {
      this.categories.forEach(cat => {
        this.directions.forEach(dir => {
          const key = `${cat.name}${dir}`;
          if (scene.anims.exists(key)) return; // avoid duplicates
          scene.anims.create({
            key,
            frames: scene.anims.generateFrameNumbers(key, { start: 0, end: cat.frames - 1 }),
            frameRate: cat.fps,
            repeat: cat.loop ? -1 : 0
          });
        });
      });
    }
  }
  