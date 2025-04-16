// src/scenes/MainScene.js
export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }
  
  preload() {
    // Load the spritesheets. Adjust these paths as needed.
    const basePath = 'assets/sprites/Entities/Characters/Body_A/Animations';
    
    // Idle animations (4 frames each)
    this.load.spritesheet('idleDown', `${basePath}/Idle_Base/Idle_Down-Sheet.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('idleUp', `${basePath}/Idle_Base/Idle_Up-Sheet.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('idleSide', `${basePath}/Idle_Base/Idle_Side-Sheet.png`, { frameWidth: 64, frameHeight: 64 });
    
    // Walking animations (6 frames each)
    this.load.spritesheet('walkDown', `${basePath}/Walk_Base/Walk_Down-Sheet.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('walkUp', `${basePath}/Walk_Base/Walk_Up-Sheet.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('walkSide', `${basePath}/Walk_Base/Walk_Side-Sheet.png`, { frameWidth: 64, frameHeight: 64 });
    
    // Running animations (6 frames each)
    this.load.spritesheet('runDown', `${basePath}/Run_Base/Run_Down-Sheet.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('runUp', `${basePath}/Run_Base/Run_Up-Sheet.png`, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('runSide', `${basePath}/Run_Base/Run_Side-Sheet.png`, { frameWidth: 64, frameHeight: 64 });
  }
  
  create() {
    // Helper function to create animations for a given key and frame count.
    const createAnim = (animKey, frameCount, frameRate = 8) => {
      this.anims.create({
        key: animKey,
        frames: this.anims.generateFrameNumbers(animKey, { start: 0, end: frameCount - 1 }),
        frameRate: frameRate,
        repeat: -1,
      });
    };
    
    // Create animations for each state. Idle animations use 4 frames.
    createAnim('idleDown', 4);
    createAnim('idleUp', 4);
    createAnim('idleSide', 4);
    
    // Walking animations use 6 frames.
    createAnim('walkDown', 6);
    createAnim('walkUp', 6);
    createAnim('walkSide', 6);
    
    // Running animations use 6 frames, with a faster frame rate.
    createAnim('runDown', 6, 12);
    createAnim('runUp', 6, 12);
    createAnim('runSide', 6, 12);
    
    // Create player sprite at center of game.
    // Set starting texture as idleDown
    this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'idleDown');
    
    // Increase the size of the player sprite for better visibility (scale factor, e.g., 2x)
    this.player.setScale(2);
    
    // Ensure the player stays within game bounds.
    this.player.setCollideWorldBounds(true);
    
    // Custom property to track current facing direction.
    this.player.facing = 'down';
    
    // Start with the idleDown animation.
    this.player.anims.play('idleDown');
    
    // Set up keyboard input using WASD and Shift for running.
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });
    
    // Define speed values for walking and running.
    this.walkSpeed = 150;
    this.runSpeed = 250;
  }
  
  update() {
    // Calculate velocity based on key inputs.
    const { up, down, left, right, shift } = this.keys;
    const isRunning = shift.isDown;
    const speed = isRunning ? this.runSpeed : this.walkSpeed;
    
    // Reset velocity at the start of each frame.
    this.player.setVelocity(0);
    
    let velocityX = 0;
    let velocityY = 0;
    let animKey = ''; // This will determine which animation to play.
    
    // Horizontal input: left or right.
    if (left.isDown) {
      velocityX = -speed;
      this.player.setFlipX(true); // Face left.
      this.player.facing = 'side';
      animKey = isRunning ? 'runSide' : 'walkSide';
    } else if (right.isDown) {
      velocityX = speed;
      this.player.setFlipX(false); // Face right.
      this.player.facing = 'side';
      animKey = isRunning ? 'runSide' : 'walkSide';
    }
    
    // Vertical input: up or down.
    if (up.isDown) {
      velocityY = -speed;
      this.player.facing = 'up';
      animKey = isRunning ? 'runUp' : 'walkUp';
    } else if (down.isDown) {
      velocityY = speed;
      this.player.facing = 'down';
      animKey = isRunning ? 'runDown' : 'walkDown';
    }
    
    // Set the calculated velocity.
    this.player.setVelocity(velocityX, velocityY);
    
    // Determine which animation to play:
    // If any movement keys are pressed, play the appropriate walk/run animation. Otherwise, revert to the idle animation corresponding to the last facing direction.
    if (up.isDown || down.isDown || left.isDown || right.isDown) {
      if (animKey !== '') {this.player.anims.play(animKey, true);}
    } else {      
    // Compose the idle animation key from the current facing direction.\n
      const idleKey = 'idle' + this.player.facing.charAt(0).toUpperCase() + this.player.facing.slice(1);
      this.player.anims.play(idleKey, true);
    }
  }
}