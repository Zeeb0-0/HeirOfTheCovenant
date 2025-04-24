// src/managers/AnimationManager.js

/**
 * AnimationManager
 * ----------------
 * Centralizes creation of all animations (player, NPCs, mobs).
 * Call createAllAnimations() in your scene once all relevant spritesheets
 * have been preloaded.
 */
export default class AnimationManager {
  /**
   * @param {Phaser.Scene} scene  - The scene on which to register animations.
   */
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Helper to register a single spritesheet animation.
   *
   * @param {string} key         - Animation key, matching loaded spritesheet key.
   * @param {number} frameCount  - Number of frames in the sheet.
   * @param {number} frameRate   - Frames per second to play the animation.
   * @param {boolean} loop       - Whether the animation should loop (true => repeat=-1).
   */
  _create(key, frameCount, frameRate = 8, loop = true) {
    this.scene.anims.create({
      key,
      frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: frameCount - 1 }),
      frameRate,
      repeat: loop ? -1 : 0
    });
  }

  /**
   * Registers all player animations (Idle, Walk, Run, Hit, Pierce, Death)
   * in three “facings”: Down, Up, Side.
   */
  createPlayerAnimations() {
    // Idle animations: 4 frames, looping
    this._create('idleDown',  4, 8,  true);
    this._create('idleUp',    4, 8,  true);
    this._create('idleSide',  4, 8,  true);

    // Walk animations: 6 frames, looping
    this._create('walkDown',  6, 8,  true);
    this._create('walkUp',    6, 8,  true);
    this._create('walkSide',  6, 8,  true);

    // Run animations: 6 frames @12fps, looping
    this._create('runDown',   6, 12, true);
    this._create('runUp',     6, 12, true);
    this._create('runSide',   6, 12, true);

    // Unarmed Hit: 4 frames @8fps, non-looping
    this._create('hitDown',   4, 8,  false);
    this._create('hitUp',     4, 8,  false);
    this._create('hitSide',   4, 8,  false);

    // Sword Pierce: 8 frames @12fps, non-looping
    this._create('pierceDown',8, 12, false);
    this._create('pierceUp',   8, 12, false);
    this._create('pierceSide', 8, 12, false);

    // Death: 8 frames @6fps, non-looping
    this._create('deathDown',  8, 6,  false);
    this._create('deathUp',    8, 6,  false);
    this._create('deathSide',  8, 6,  false);
  }

  /**
   * Registers NPC animations for neutral/friendly characters:
   * Knight, Rogue, Mage — each has Idle (4), Run (6), Death (6).
   */
  createNpcAnimations() {
    const npcs = [
      { prefix: 'knight', idle: 4, run: 6, death: 6 },
      { prefix: 'rogue',  idle: 4, run: 6, death: 6 },
      { prefix: 'mage',   idle: 4, run: 6, death: 6 }
    ];

    npcs.forEach(npc => {
      const { prefix, idle, run, death } = npc;
      // Idle: looping
      this._create(`${prefix}Idle`,  idle, 8,  true);
      // Run: looping
      this._create(`${prefix}Run`,   run,  8,  true);
      // Death: non-looping
      this._create(`${prefix}Death`, death, 8, false);
    });
  }

  /**
   * Registers Mob animations for hostile creatures:
   * - Orc variants: base, rogue, shaman, warrior
   * - Skeleton variants: base, mage, rogue, warrior
   * Each has Idle (4), Run (6), Death (6).
   */
  createMobAnimations() {
    // Define each mob category and its folder prefix
    const mobs = [
      { prefix: 'orcIdle',        frameCount: 4 }, // base orc Idle
      { prefix: 'orcRun',         frameCount: 6 },
      { prefix: 'orcDeath',       frameCount: 6 },
      { prefix: 'orcRogueIdle',   frameCount: 4 },
      { prefix: 'orcRogueRun',    frameCount: 6 },
      { prefix: 'orcRogueDeath',  frameCount: 6 },
      { prefix: 'orcShamanIdle',  frameCount: 4 },
      { prefix: 'orcShamanRun',   frameCount: 6 },
      { prefix: 'orcShamanDeath', frameCount: 6 },
      { prefix: 'orcWarriorIdle', frameCount: 4 },
      { prefix: 'orcWarriorRun',  frameCount: 6 },
      { prefix: 'orcWarriorDeath',frameCount: 6 },

      { prefix: 'skeletonBaseIdle',   frameCount: 4 },
      { prefix: 'skeletonBaseRun',    frameCount: 6 },
      { prefix: 'skeletonBaseDeath',  frameCount: 6 },
      { prefix: 'skeletonMageIdle',   frameCount: 4 },
      { prefix: 'skeletonMageRun',    frameCount: 6 },
      { prefix: 'skeletonMageDeath',  frameCount: 6 },
      { prefix: 'skeletonRogueIdle',  frameCount: 4 },
      { prefix: 'skeletonRogueRun',   frameCount: 6 },
      { prefix: 'skeletonRogueDeath', frameCount: 6 },
      { prefix: 'skeletonWarriorIdle',  frameCount: 4 },
      { prefix: 'skeletonWarriorRun',   frameCount: 6 },
      { prefix: 'skeletonWarriorDeath', frameCount: 6 }
    ];

    mobs.forEach(mob => {
      const { prefix, frameCount } = mob;
      // Determine loop: only Death is non-looping
      const loop = !prefix.toLowerCase().includes('death');
      // Default frameRate 8 fps
      this._create(prefix, frameCount, 8, loop);
    });
  }

  /**
   * Convenience method to register EVERY animation in the game:
   * Players, NPCs, and Mobs.
   */
  createAllAnimations() {
    this.createPlayerAnimations();
    this.createNpcAnimations();
    this.createMobAnimations();
    // In future, you might also call:
    // this.createEnvironmentAnimations();
    // this.createUIAnimations();
  }
}
