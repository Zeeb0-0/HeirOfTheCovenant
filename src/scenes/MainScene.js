// src/scenes/MainScene.js

import BaseScene  from './BaseScene.js';
import AssetPaths from '../config/AssetPaths.js';

export default class MainScene extends BaseScene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // (Same as before: load spritesheets for movement, hit, pierce, death)
    const frames = { frameWidth: 64, frameHeight: 64 };
    for (const [key, path] of Object.entries(AssetPaths.sprites)) {
      this.load.spritesheet(key, path, frames);
    }
    const base = 'assets/sprites/Entities/Characters/Body_A/Animations';
    this.load.spritesheet('hitDown',   `${base}/Hit_Base/Hit_Down-Sheet.png`,   frames);
    this.load.spritesheet('hitUp',     `${base}/Hit_Base/Hit_Up-Sheet.png`,     frames);
    this.load.spritesheet('hitSide',   `${base}/Hit_Base/Hit_Side-Sheet.png`,   frames);
    this.load.spritesheet('pierceDown',`${base}/Pierce_Base/Pierce_Down-Sheet.png`,frames);
    this.load.spritesheet('pierceUp',  `${base}/Pierce_Base/Pierce_Up-Sheet.png`,  frames);
    this.load.spritesheet('pierceSide',`${base}/Pierce_Base/Pierce_Side-Sheet.png`,frames);
    this.load.spritesheet('deathDown', `${base}/Death_Base/Death_Down-Sheet.png`,  frames);
    this.load.spritesheet('deathUp',   `${base}/Death_Base/Death_Up-Sheet.png`,    frames);
    this.load.spritesheet('deathSide', `${base}/Death_Base/Death_Side-Sheet.png`,  frames);
  }

  create() {
    super.init();

    // Ensure analytics stub
    if (!window.analytics) window.analytics = { logEvent: (e,d)=>console.log('[Analytics]',e,d) };

    const cam = this.cameras.main;
    const worldW = cam.width * 2, worldH = cam.height * 2;
    this.physics.world.setBounds(0,0,worldW,worldH);
    cam.setBounds(0,0,worldW,worldH);

    // Create animations (idle, walk, run, hit, pierce, death) with repeat false for actions
    const makeAnim = (key,count,fps=8,loop=true) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(key, {start:0,end:count-1}),
        frameRate: fps,
        repeat: loop ? -1 : 0
      });
    };
    // Idle, Walk, Run
    makeAnim('idleDown',4);
    makeAnim('idleUp',4);
    makeAnim('idleSide',4);
    makeAnim('walkDown',6); makeAnim('walkUp',6); makeAnim('walkSide',6);
    makeAnim('runDown',6,12); makeAnim('runUp',6,12); makeAnim('runSide',6,12);
    // Hit (for damage)
    makeAnim('hitDown',4,8,false);
    makeAnim('hitUp',4,8,false);
    makeAnim('hitSide',4,8,false);
    // Pierce (player attack)
    makeAnim('pierceDown',8,12,false);
    makeAnim('pierceUp',8,12,false);
    makeAnim('pierceSide',8,12,false);
    // Death
    makeAnim('deathDown',8,6,false);
    makeAnim('deathUp',8,6,false);
    makeAnim('deathSide',8,6,false);

    // Player
    this.player = this.physics.add.sprite(worldW/2, worldH/2, 'idleDown')
      .setScale(2)
      .setCollideWorldBounds(true);
    this.player.facing = 'down';
    this.player.anims.play('idleDown');
    this.isAttacking = false;
    this.isDead      = false;

    cam.startFollow(this.player, true, 0.08, 0.08);
    this.walkSpeed = 150;
    this.runSpeed  = 250;

    // Attack key now only does sword pierce
    const atk = this.inputMgr.keys.attack;
    atk.on('down', () => {
      if (this.isDead || this.isAttacking) return;
      this.isAttacking = true;
      this._playOnce('pierce');
    });

    // Death test on K
    this.input.keyboard.on('keydown-K', () => {
      if (!this.isDead) this._die();
    });

    // Build death modal (a plain container)
    this._createDeathModal();
  }

  update() {
    if (this.isDead) return;

    // Cancel attack if movement keys pressed
    if (this.isAttacking) {
      if (
        this.inputMgr.isDown('left') || this.inputMgr.isDown('right') ||
        this.inputMgr.isDown('up')   || this.inputMgr.isDown('down')
      ) {
        this.isAttacking = false;
        this._resumeIdle();
      }
      return;
    }

    // Movement
    const im = this.inputMgr;
    const running = im.isDown('shift');
    const speed = running ? this.runSpeed : this.walkSpeed;
    let vx=0, vy=0, anim='';

    if (im.isDown('left')) {
      vx = -speed; this.player.setFlipX(true); this.player.facing='side';
      anim = running ? 'runSide':'walkSide';
    } else if (im.isDown('right')) {
      vx = speed; this.player.setFlipX(false); this.player.facing='side';
      anim = running ? 'runSide':'walkSide';
    }
    if (im.isDown('up')) {
      vy = -speed; this.player.facing='up';
      anim = running ? 'runUp':'walkUp';
    } else if (im.isDown('down')) {
      vy = speed; this.player.facing='down';
      anim = running ? 'runDown':'walkDown';
    }

    this.player.setVelocity(vx, vy);

    if (vx||vy) {
      this.player.anims.play(anim, true);
    } else {
      this._resumeIdle();
    }
  }

  // Helper to play non-looping animations
  _playOnce(base) {
    const dir = this.player.facing;
    const key = base + dir.charAt(0).toUpperCase() + dir.slice(1);
    this.player.anims.play(key);
    this.player.once('animationcomplete', () => {
      this.isAttacking = false;
      this._resumeIdle();
    });
  }

  // Handle death
  _die() {
    this.isDead = true;
    window.analytics.logEvent('player_died', { time:Date.now() });
    const dir = this.player.facing;
    const key = 'death' + dir.charAt(0).toUpperCase() + dir.slice(1);
    this.player.setVelocity(0);
    this.player.anims.play(key);
    this.player.once('animationcomplete', () => {
      // show the modal via setVisible
      this.deathModal.setVisible(true);
    });
  }

  _resumeIdle() {
    const key = 'idle' + this.player.facing.charAt(0).toUpperCase() + this.player.facing.slice(1);
    this.player.anims.play(key, true);
  }

  // Create a simple "You Died" UI container
  _createDeathModal() {
    const cam = this.cameras.main;
    // Container
    this.deathModal = this.add.container(0,0).setVisible(false);

    // Backdrop
    const bg = this.add.rectangle(cam.centerX, cam.centerY, cam.width, cam.height, 0x000000, 0.7);
    // Box
    const boxW = cam.width * 0.6, boxH = cam.height * 0.4;
    const box  = this.add.rectangle(cam.centerX, cam.centerY, boxW, boxH, 0x222222);
    // Text
    const text= this.add.text(cam.centerX, cam.centerY-40, 'You Died', {
      font:'40px "IM Fell English"', fill:'#ff4444'
    }).setOrigin(0.5);
    // Respawn button
    const btn = this.add.text(cam.centerX, cam.centerY+40, 'Respawn', {
      fontFamily:'"IM Fell English", serif',
      fontSize:'32px',
      fill:'#ffffff',
      backgroundColor:'#004400',
      padding:{ x:20, y:10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor:true })
    .on('pointerdown', () => this._respawn());

    this.deathModal.add([ bg, box, text, btn ]);
  }

  _respawn() {
    window.analytics.logEvent('player_respawn', { time:Date.now() });
    this.deathModal.setVisible(false);
    this.isDead = false;
    // Reset position to center
    const cam = this.cameras.main;
    this.player.setPosition(cam.centerX, cam.centerY);
    this._resumeIdle();
  }
}
