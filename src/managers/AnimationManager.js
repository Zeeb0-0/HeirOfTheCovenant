// src/managers/AnimationManager.js

/**
 * AnimationManager
 * ----------------
 * Centralizes creation of all animations (characters, NPCs, mobs) and now UI.
 */
export default class AnimationManager {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Low-level helper to register one spritesheet animation.
   * @param {string} key        - Animation key matching the loaded spritesheet.
   * @param {number} frameCount - Number of frames to include (0 .. frameCount-1).
   * @param {number} frameRate  - Playback speed in FPS.
   * @param {boolean} loop      - Loop indefinitely if true, otherwise play once.
   */
  _create(key, frameCount, frameRate = 8, loop = true) {
    this.scene.anims.create({
      key,
      frames: this.scene.anims.generateFrameNumbers(key, {
        start: 0,
        end: frameCount - 1
      }),
      frameRate,
      repeat: loop ? -1 : 0
    });
  }

  /** Player animations: Idle, Walk, Run, Hit, Pierce, Death (Down/Up/Side) */
  createPlayerAnimations() {
    // Idle (4f, loop)
    this._create('idleDown', 4, 8, true);
    this._create('idleUp',   4, 8, true);
    this._create('idleSide', 4, 8, true);

    // Walk (6f, loop)
    this._create('walkDown', 6, 8, true);
    this._create('walkUp',   6, 8, true);
    this._create('walkSide', 6, 8, true);

    // Run (6f @12fps, loop)
    this._create('runDown',  6, 12, true);
    this._create('runUp',    6, 12, true);
    this._create('runSide',  6, 12, true);

    // Hit (4f @8fps, one-shot)
    this._create('hitDown',  4, 8, false);
    this._create('hitUp',    4, 8, false);
    this._create('hitSide',  4, 8, false);

    // Pierce (8f @12fps, one-shot)
    this._create('pierceDown', 8, 12, false);
    this._create('pierceUp',   8, 12, false);
    this._create('pierceSide', 8, 12, false);

    // Death (8f @6fps, one-shot)
    this._create('deathDown',  8, 6, false);
    this._create('deathUp',    8, 6, false);
    this._create('deathSide',  8, 6, false);
  }

  /** NPC animations: Knight, Rogue, Mage (Idle 4f, Run 6f, Death 6f) */
  createNpcAnimations() {
    const npcs = [
      { prefix: 'knight', idle: 4, run: 6, death: 6 },
      { prefix: 'rogue',  idle: 4, run: 6, death: 6 },
      { prefix: 'mage',   idle: 4, run: 6, death: 6 }
    ];
    npcs.forEach(n => {
      this._create(`${n.prefix}Idle`,  n.idle,  8, true);
      this._create(`${n.prefix}Run`,   n.run,   8, true);
      this._create(`${n.prefix}Death`, n.death, 8, false);
    });
  }

  /** Mob animations: various Orc & Skeleton variants (Idle 4f, Run 6f, Death 6f) */
  createMobAnimations() {
    const mobs = [
      // Orc Crew
      { key: 'orcIdle',        f: 4 },
      { key: 'orcRun',         f: 6 },
      { key: 'orcDeath',       f: 6 },
      { key: 'orcRogueIdle',   f: 4 },
      { key: 'orcRogueRun',    f: 6 },
      { key: 'orcRogueDeath',  f: 6 },
      { key: 'orcShamanIdle',  f: 4 },
      { key: 'orcShamanRun',   f: 6 },
      { key: 'orcShamanDeath', f: 6 },
      { key: 'orcWarriorIdle', f: 4 },
      { key: 'orcWarriorRun',  f: 6 },
      { key: 'orcWarriorDeath',f: 6 },

      // Skeleton Crew
      { key: 'skeletonBaseIdle',   f: 4 },
      { key: 'skeletonBaseRun',    f: 6 },
      { key: 'skeletonBaseDeath',  f: 6 },
      { key: 'skeletonMageIdle',   f: 4 },
      { key: 'skeletonMageRun',    f: 6 },
      { key: 'skeletonMageDeath',  f: 6 },
      { key: 'skeletonRogueIdle',  f: 4 },
      { key: 'skeletonRogueRun',   f: 6 },
      { key: 'skeletonRogueDeath', f: 6 },
      { key: 'skeletonWarriorIdle',f: 4 },
      { key: 'skeletonWarriorRun', f: 6 },
      { key: 'skeletonWarriorDeath',f:6 }
    ];

    mobs.forEach(mob => {
      // Death frames (keys containing 'Death') are one-shot.
      const loop = !mob.key.toLowerCase().includes('death');
      this._create(mob.key, mob.f, 8, loop);
    });
  }

  /**
   * UI animations:
   * - lifeHealing: health bar frames 0–8 represent 0%–100% health.
   *   We register only 9 frames here and never loop.
   */
  createUIAnimations() {
    this._create('lifeHealing', 9, 0, false);
  }

  /**
   * Registers all animations in one go:
   * player, NPCs, mobs, and UI elements.
   */
  createAllAnimations() {
    this.createPlayerAnimations();
    this.createNpcAnimations();
    this.createMobAnimations();
    this.createUIAnimations();
  }
}
