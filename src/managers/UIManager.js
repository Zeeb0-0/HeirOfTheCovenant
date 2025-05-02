// src/managers/UIManager.js

/**
 * UIManager
 * ---------
 * - Renders and updates the health bar (0–8 frames).
 * - Shows a "You Died" modal on death and respawn button.
 * - Plays a one‐shot heal effect when healed.
 */
export default class UIManager {
    /**
     * @param {Phaser.Scene} scene
     * @param {HealthManager} healthManager
     */
    constructor(scene, healthManager) {
      this.scene = scene;
      this.hm    = healthManager;
  
      const cam = scene.cameras.main;
  
      // --- Health Bar (camera‐fixed) ---
      this.healthBar = scene.add
        .sprite(10, 10, 'lifeHealing', 8)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setScale(2);
  
      // Update whenever HP changes
      this.hm.on('changed', this.updateHealthBar, this);
  
      // --- Death Modal ---
      this.deathModal = scene.add.container(0, 0).setVisible(false);
      const bg = scene.add.rectangle(cam.centerX, cam.centerY, cam.width, cam.height, 0x000000, 0.7);
      const box = scene.add.rectangle(cam.centerX, cam.centerY, cam.width * 0.6, cam.height * 0.4, 0x222222);
      const text = scene.add
        .text(cam.centerX, cam.centerY - 40, 'You Died', {
          font: '40px "IM Fell English"', fill: '#ff4444'
        })
        .setOrigin(0.5);
      const btn = scene.add
        .text(cam.centerX, cam.centerY + 40, 'Respawn', {
          fontFamily: '"IM Fell English", serif',
          fontSize: '32px',
          fill: '#ffffff',
          backgroundColor: '#004400',
          padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.hm.respawn());
      this.deathModal.add([bg, box, text, btn]);
  
      // Show/hide modal on death/respawn
      this.hm.on('died',      () => this.deathModal.setVisible(true), this);
      this.hm.on('respawned', () => this.deathModal.setVisible(false), this);
  
      // Heal effect
      this.hm.on('healed', this.playHealEffect, this);
  
      // Reposition on resize
      scene.scale.on('resize', this.onResize, this);
    }
  
    /** Update the health bar to frame 0–8 based on current HP. */
    updateHealthBar(hp) {
      const frame = Math.round((hp / this.hm.maxHp) * 8);
      this.healthBar.setFrame(frame);
    }
  
    /** Play a one-shot regen effect next to the health bar. */
    playHealEffect(amount) {
      const fx = this.scene.add
        .sprite(
          this.healthBar.x + this.healthBar.displayWidth + 5,
          this.healthBar.y + this.healthBar.displayHeight / 2,
          'lifeHealing',
          0
        )
        .setScrollFactor(0)
        .setScale(2)
        .play('lifeHealing');
      fx.once('animationcomplete', () => fx.destroy());
    }
  
    /**
     * Reposition UI on resize: keeps health bar at top-left,
     * ensures modal covers the screen.
     */
    onResize() {
      const cam = this.scene.cameras.main;
      this.healthBar.setPosition(10, 10);
      this.deathModal.list.forEach(go => {
        go.setPosition(cam.centerX, cam.centerY + (go.y - cam.centerY));
      });
    }
  }
  