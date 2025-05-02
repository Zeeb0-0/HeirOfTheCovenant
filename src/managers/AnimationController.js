// src/managers/AnimationController.js

/**
 * AnimationController
 * -------------------
 * Listens for game & HealthManager events, then plays the
 * appropriate player animation.
 */
export default class AnimationController {
    /**
     * @param {Phaser.Scene} scene
     * @param {Phaser.Physics.Arcade.Sprite} player
     * @param {HealthManager} healthManager
     */
    constructor(scene, player, healthManager) {
      this.scene  = scene;
      this.player = player;
      this.hm     = healthManager;
  
      // Attack event (fired by MainScene)
      scene.events.on('playerAttack', this.onAttack, this);
  
      // Damage event
      this.hm.on('changed', hp => {
        if (hp > 0 && !this.player.anims.currentAnim.key.startsWith('pierce')) {
          this.onHit();
        }
      });
  
      // Death & respawn
      this.hm.on('died',      this.onDeath,   this);
      this.hm.on('respawned', this.onRespawn, this);
    }
  
    onAttack() {
      const dir = this._dir();
      this.player.anims.play('pierce' + dir);
    }
  
    onHit() {
      const dir = this._dir();
      this.player.anims.play('hit' + dir);
    }
  
    onDeath() {
      const dir = this._dir();
      this.player.anims.play('death' + dir);
    }
  
    onRespawn() {
      const dir = this._dir();
      this.player.anims.play('idle' + dir, true);
    }
  
    /** Helper: returns 'Down', 'Up', or 'Side' based on facing. */
    _dir() {
      const f = this.player.facing;
      return f.charAt(0).toUpperCase() + f.slice(1);
    }
  }
  