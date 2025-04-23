// src/scenes/MainScene.js

import BaseScene  from './BaseScene.js';
import AssetPaths from '../config/AssetPaths.js';

export default class MainScene extends BaseScene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Load all your character spritesheets
    const frames = { frameWidth: 64, frameHeight: 64 };
    for (const [key, path] of Object.entries(AssetPaths.sprites)) {
      this.load.spritesheet(key, path, frames);
    }

    // // Later: load your tilemap JSON & tileset image
    // this.load.tilemapTiledJSON('worldMap', 'assets/maps/yourmap.json');
    // this.load.image('tiles', 'assets/tilesets/yourTileset.png');
  }

  create() {
    super.init(); // sets up SettingsManager & InputManager

    const cam = this.cameras.main;

    // --- WORLD BOUNDS (placeholder) ---
    // For now, create an empty world twice the viewport size
    const worldWidth  = cam.width * 2;
    const worldHeight = cam.height * 2;
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    cam.setBounds(0, 0, worldWidth, worldHeight);

    // // Later: if using a tilemap, uncomment and replace bounds with map dimensions
    // const map = this.make.tilemap({ key: 'worldMap' });
    // const tileset = map.addTilesetImage('YourTilesetName', 'tiles');
    // map.createLayer('Ground', tileset, 0, 0);
    // const walls = map.createLayer('Collision', tileset, 0, 0);
    // walls.setCollisionByProperty({ collides: true });
    // this.physics.add.collider(this.player, walls);
    // cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // --- ANIMATIONS SETUP ---
    const makeAnim = (key, framesCount, fps = 8) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(key, { start: 0, end: framesCount - 1 }),
        frameRate: fps,
        repeat: -1
      });
    };

    makeAnim('idleDown',  4);
    makeAnim('idleUp',    4);
    makeAnim('idleSide',  4);

    makeAnim('walkDown',  6);
    makeAnim('walkUp',    6);
    makeAnim('walkSide',  6);

    makeAnim('runDown',   6, 12);
    makeAnim('runUp',     6, 12);
    makeAnim('runSide',   6, 12);

    // --- PLAYER CREATION ---
    this.player = this.physics.add
      .sprite(worldWidth / 2, worldHeight / 2, 'idleDown')
      .setScale(2)
      .setCollideWorldBounds(true);

    this.player.facing = 'down';
    this.player.anims.play('idleDown');

    // Camera follows the player with a little lag (lerp)
    cam.startFollow(this.player, true, 0.08, 0.08);

    // Movement speeds
    this.walkSpeed = 150;
    this.runSpeed  = 250;
  }

  update() {
    // Use your InputManager remapped keys
    const im    = this.inputMgr;
    const isRun = im.isDown('shift');
    const speed = isRun ? this.runSpeed : this.walkSpeed;

    let vx = 0, vy = 0, animKey = '';

    // Horizontal
    if (im.isDown('left')) {
      vx = -speed;
      this.player.setFlipX(true);
      this.player.facing = 'side';
      animKey = isRun ? 'runSide'  : 'walkSide';
    } else if (im.isDown('right')) {
      vx = speed;
      this.player.setFlipX(false);
      this.player.facing = 'side';
      animKey = isRun ? 'runSide'  : 'walkSide';
    }

    // Vertical
    if (im.isDown('up')) {
      vy = -speed;
      this.player.facing = 'up';
      animKey = isRun ? 'runUp'    : 'walkUp';
    } else if (im.isDown('down')) {
      vy = speed;
      this.player.facing = 'down';
      animKey = isRun ? 'runDown'  : 'walkDown';
    }

    // Apply velocity
    this.player.setVelocity(vx, vy);

    // Play animation or idle
    if (vx !== 0 || vy !== 0) {
      this.player.anims.play(animKey, true);
    } else {
      const idle = 'idle' + this.player.facing.charAt(0).toUpperCase() + this.player.facing.slice(1);
      this.player.anims.play(idle, true);
    }
  }
}
