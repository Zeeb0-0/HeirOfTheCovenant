// src/scenes/MainScene.js

import BaseScene        from './BaseScene.js';
import AssetPaths       from '../config/AssetPaths.js';
import AnimationManager from '../managers/AnimationManager.js';

export default class MainScene extends BaseScene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Preload every spritesheet defined in AssetPaths.sprites
    // so that AnimationManager can register them later.
    const frameConfig = { frameWidth: 64, frameHeight: 64 };
    for (const [key, path] of Object.entries(AssetPaths.sprites)) {
      this.load.spritesheet(key, path, frameConfig);
    }
  }

  create() {
    super.init();  // Initialize SettingsManager & InputManager

    // Initialize and register ALL animations (player, NPCs, mobs)
    this.animationManager = new AnimationManager(this);
    this.animationManager.createAllAnimations();

    // Placeholder world bounds: twice the viewport in each direction
    // Replace these with your tilemap dimensions once your map is ready.
    const cam     = this.cameras.main;
    const worldW  = cam.width  * 2;
    const worldH  = cam.height * 2;
    this.physics.world.setBounds(0, 0, worldW, worldH);
    cam.setBounds(0, 0, worldW, worldH);

    // ---- PLAYER SETUP ----
    // Create the player sprite in the center of the world.
    this.player = this.physics.add
      .sprite(worldW / 2, worldH / 2, 'idleDown')
      .setScale(2)                // Make the sprite larger for visibility
      .setCollideWorldBounds(true);

    // Track state flags
    this.player.facing    = 'down';  // 'down' | 'up' | 'side'
    this.isAttacking      = false;   // true while performing a pierce animation
    this.isDead           = false;   // true after death animation

    // Start with the idle-down animation
    this.player.anims.play('idleDown');

    // ---- CAMERA ----
    // Have the camera follow the player with a slight lerp
    cam.startFollow(this.player, true, 0.08, 0.08);

    // ---- MOVEMENT SPEEDS ----
    this.walkSpeed = 150;
    this.runSpeed  = 250;

    // ---- INPUT: ATTACK ----
    // Attack key triggers ONLY the sword-pierce animation.
    const attackKey = this.inputMgr.keys.attack;
    attackKey.on('down', () => {
      if (this.isDead || this.isAttacking) return;
      this.isAttacking = true;
      this._playOnce('pierce');
    });

    // ---- TEST: DEATH ON 'K' ----
    this.input.keyboard.on('keydown-K', () => {
      if (!this.isDead) {
        this._die();
      }
    });

    // ---- DEATH / RESPAWN UI ----
    // Build and hide the "You Died" modal for respawn
    this._createDeathModal();
  }

  update() {
    // If dead, ignore all input
    if (this.isDead) return;

    // If currently attacking, allow movement input to cancel it
    if (this.isAttacking) {
      const im = this.inputMgr;
      if (
        im.isDown('left')  || im.isDown('right') ||
        im.isDown('up')    || im.isDown('down')
      ) {
        // Cancel the attack and resume idle
        this.isAttacking = false;
        this._resumeIdle();
      }
      return;  // Skip movement/animation logic while attack is active
    }

    // ---- MOVEMENT & RUN/WALK ----
    const im       = this.inputMgr;
    const running  = im.isDown('shift');
    const speed    = running ? this.runSpeed : this.walkSpeed;
    let vx = 0, vy = 0, animKey = '';

    // Horizontal movement
    if (im.isDown('left')) {
      vx = -speed;
      this.player.setFlipX(true);
      this.player.facing = 'side';
      animKey = running ? 'runSide' : 'walkSide';
    } else if (im.isDown('right')) {
      vx = speed;
      this.player.setFlipX(false);
      this.player.facing = 'side';
      animKey = running ? 'runSide' : 'walkSide';
    }

    // Vertical movement
    if (im.isDown('up')) {
      vy = -speed;
      this.player.facing = 'up';
      animKey = running ? 'runUp' : 'walkUp';
    } else if (im.isDown('down')) {
      vy = speed;
      this.player.facing = 'down';
      animKey = running ? 'runDown' : 'walkDown';
    }

    // Apply velocity
    this.player.setVelocity(vx, vy);

    // Play the relevant animation
    if (vx !== 0 || vy !== 0) {
      this.player.anims.play(animKey, true);
    } else {
      // No input: revert to idle animation
      this._resumeIdle();
    }
  }

  // ---- HELPER: PLAY ONE-SHOT ANIMATION ----
  _playOnce(baseKey) {
    const dir = this.player.facing;
    const fullKey = baseKey + dir.charAt(0).toUpperCase() + dir.slice(1);
    this.player.anims.play(fullKey);
    this.player.once('animationcomplete', () => {
      this.isAttacking = false;
      this._resumeIdle();
    });
  }

  // ---- HELPER: RESUME IDLE ----
  _resumeIdle() {
    const key = 'idle' + this.player.facing.charAt(0).toUpperCase() + this.player.facing.slice(1);
    this.player.anims.play(key, true);
  }

  // ---- DEATH HANDLING ----
  _die() {
    this.isDead = true;
    // Log analytics event
    window.analytics.logEvent('player_died', { timestamp: Date.now() });

    // Play the death animation once
    const dir = this.player.facing;
    const key = 'death' + dir.charAt(0).toUpperCase() + dir.slice(1);
    this.player.setVelocity(0);
    this.player.anims.play(key);
    this.player.once('animationcomplete', () => {
      // Show the death/resurrect modal
      this.deathModal.setVisible(true);
    });
  }

  // ---- DEATH MODAL / RESPAWN ----
  _createDeathModal() {
    const cam = this.cameras.main;
    // Container to hold all UI elements
    this.deathModal = this.add.container(0, 0).setVisible(false);

    // Semi-transparent full-screen backdrop
    const bg = this.add.rectangle(cam.centerX, cam.centerY, cam.width, cam.height, 0x000000, 0.7);

    // Centered dialog box
    const boxW = cam.width * 0.6;
    const boxH = cam.height * 0.4;
    const box  = this.add.rectangle(cam.centerX, cam.centerY, boxW, boxH, 0x222222);

    // "You Died" text
    const txt = this.add.text(cam.centerX, cam.centerY - 40, 'You Died', {
      font: '40px "IM Fell English"',
      fill: '#ff4444'
    }).setOrigin(0.5);

    // Respawn button
    const btn = this.add.text(cam.centerX, cam.centerY + 40, 'Respawn', {
      fontFamily: '"IM Fell English", serif',
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#004400',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this._respawn());

    // Add all to container
    this.deathModal.add([bg, box, txt, btn]);
  }

  // ---- HELPER: RESPAWN PLAYER ----
  _respawn() {
    window.analytics.logEvent('player_respawn', { timestamp: Date.now() });
    this.deathModal.setVisible(false);
    this.isDead = false;
    // Reset position to center of world (or use a saved checkpoint)
    const cam = this.cameras.main;
    this.player.setPosition(cam.centerX, cam.centerY);
    this._resumeIdle();
  }
}
