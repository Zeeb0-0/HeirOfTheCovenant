// src/scenes/MainScene.js

import BaseScene           from './BaseScene.js';
import AssetPaths          from '../config/AssetPaths.js';
import AnimationManager    from '../managers/AnimationManager.js';
import HealthManager       from '../managers/HealthManager.js';
import UIManager           from '../managers/UIManager.js';
import AnimationController from '../managers/AnimationController.js';

export default class MainScene extends BaseScene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // 1) Load all character spritesheets (player, NPCs, mobs)
    Object.entries(AssetPaths.sprites).forEach(([key, cfg]) => {
      this.load.spritesheet(key, cfg.path, {
        frameWidth:  cfg.frameWidth,
        frameHeight: cfg.frameHeight
      });
    });

    // 2) Load UI spritesheet for health bar
    const uiCfg = AssetPaths.ui.lifeHealing;
    this.load.spritesheet('lifeHealing', uiCfg.path, {
      frameWidth:  uiCfg.frameWidth,
      frameHeight: uiCfg.frameHeight
    });
  }

  create() {
    super.init();  // SettingsManager, InputManager, audio volume

    // -- 1) Animations --
    this.animationManager = new AnimationManager(this);
    // Only create player & UI animations to avoid missing-texture errors:
    this.animationManager.createPlayerAnimations();
    this.animationManager.createUIAnimations();

    // -- 2) Health system --
    this.healthManager = new HealthManager(100);

    // -- 3) UI system (health bar, death modal) --
    this.uiManager = new UIManager(this, this.healthManager);

    // -- 4) World & camera bounds (placeholder) --
    const cam    = this.cameras.main;
    const worldW = cam.width  * 2;
    const worldH = cam.height * 2;
    this.physics.world.setBounds(0, 0, worldW, worldH);
    cam.setBounds(0, 0, worldW, worldH);

    // -- 5) Player sprite setup --
    this.player = this.physics.add
      .sprite(worldW / 2, worldH / 2, 'idleDown')
      .setScale(2)
      .setCollideWorldBounds(true);
    this.player.facing = 'down';

    // -- 6) Animation controller listens for attack, damage, death, respawn --
    this.animationController = new AnimationController(
      this,
      this.player,
      this.healthManager
    );

    // -- 7) Camera follows player with smoothing --
    cam.startFollow(this.player, true, 0.08, 0.08);

    // -- 8) Movement speeds --
    this.walkSpeed = 150;
    this.runSpeed  = 250;

    // -- 9) Attack input --
    // Try to get the remapped Attack key; fall back to SPACE if undefined.
    let atkKey = this.inputMgr.getKey('attack');
    if (!atkKey) {
      atkKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    atkKey.on('down', () => {
      if (this.healthManager.hp > 0) {
        this.events.emit('playerAttack');
      }
    });

    // -- 10) Testing hotkeys --
    this.input.keyboard.on('keydown-H', () => this.healthManager.takeDamage(20));
    this.input.keyboard.on('keydown-J', () => this.healthManager.heal(15));
    this.input.keyboard.on('keydown-K', () => this.healthManager.takeDamage(9999));
  }

  update() {
    // 1) If dead, block movement
    if (this.healthManager.hp === 0) {
      this.player.setVelocity(0, 0);
      return;
    }

    // 2) Cancel one-shot animations on movement
    const anim = this.player.anims.currentAnim;
    if (anim && !anim.loop && this.inputMgr.anyMovement()) {
      this.player.anims.stop();
    }

    // 3) Movement & run/walk
    const im      = this.inputMgr;
    const running = im.isDown('shift');
    const speed   = running ? this.runSpeed : this.walkSpeed;
    let vx = 0, vy = 0, key = '';

    if (im.isDown('left')) {
      vx = -speed; this.player.setFlipX(true);  this.player.facing = 'side';
      key = running ? 'runSide' : 'walkSide';
    } else if (im.isDown('right')) {
      vx = speed;  this.player.setFlipX(false); this.player.facing = 'side';
      key = running ? 'runSide' : 'walkSide';
    }
    if (im.isDown('up')) {
      vy = -speed; this.player.facing = 'up';
      key = running ? 'runUp' : 'walkUp';
    } else if (im.isDown('down')) {
      vy = speed;  this.player.facing = 'down';
      key = running ? 'runDown' : 'walkDown';
    }

    this.player.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      this.player.anims.play(key, true);
    } else {
      // Idle fallback
      const idleKey =
        'idle' +
        this.player.facing.charAt(0).toUpperCase() +
        this.player.facing.slice(1);
      this.player.anims.play(idleKey, true);
    }
  }
}
