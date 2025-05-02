// src/managers/HealthManager.js

/**
 * HealthManager
 * -------------
 * Tracks player's HP, clamps between 0 and maxHp, and emits events:
 *  • 'changed'  (new HP)
 *  • 'died'     (when HP reaches 0)
 *  • 'healed'   (amount healed)
 *  • 'respawned' (when HP reset to max)
 */
export default class HealthManager extends window.Phaser.Events.EventEmitter {
    /**
     * @param {number} maxHp  - Maximum health.
     */
    constructor(maxHp) {
      super();
      this.maxHp = maxHp;
      this.hp    = maxHp;
    }
  
    /**
     * Inflict damage. Emits 'changed' and, if hp==0, 'died'.
     * @param {number} amount
     */
    takeDamage(amount) {
      this.hp = window.Phaser.Math.Clamp(this.hp - amount, 0, this.maxHp);
      this.emit('changed', this.hp);
      if (this.hp === 0) {
        this.emit('died');
      }
    }
  
    /**
     * Heal. Emits 'healed' (actual amount) and 'changed'.
     * @param {number} amount
     */
    heal(amount) {
      const old = this.hp;
      this.hp = window.Phaser.Math.Clamp(this.hp + amount, 0, this.maxHp);
      const healed = this.hp - old;
      if (healed > 0) {
        this.emit('healed', healed);
        this.emit('changed', this.hp);
      }
    }
  
    /**
     * Reset to full health. Emits 'respawned' and 'changed'.
     */
    respawn() {
      this.hp = this.maxHp;
      this.emit('respawned');
      this.emit('changed', this.hp);
    }
  }
  