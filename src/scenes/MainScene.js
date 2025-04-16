// src/scenes/MainScene.js
export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }
  
  preload() {
    // Load your player spritesheets as previously defined.
    // (Assuming same assets as before for idle, walk, and run animations.)
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
    // First, update our key bindings using the current global settings.
    this.updateKeyBindings();

    // Create animations for all states using a helper function.
    const createAnim = (animKey, frameCount, frameRate = 8) => {
      this.anims.create({
        key: animKey,
        frames: this.anims.generateFrameNumbers(animKey, { start: 0, end: frameCount - 1 }),
        frameRate: frameRate,
        repeat: -1,
      });
    };

    // Idle animations (4 frames)
    createAnim('idleDown', 4);
    createAnim('idleUp', 4);
    createAnim('idleSide', 4);

    // Walking animations (6 frames)
    createAnim('walkDown', 6);
    createAnim('walkUp', 6);
    createAnim('walkSide', 6);

    // Running animations (6 frames, faster)
    createAnim('runDown', 6, 12);
    createAnim('runUp', 6, 12);
    createAnim('runSide', 6, 12);

    // Create player sprite at center of the game.
    this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'idleDown');
    
    // Increase player sprite size for better visibility.
    this.player.setScale(2);
    
    // Keep the player within game bounds.
    this.player.setCollideWorldBounds(true);
    
    // Track the player's current facing direction.
    this.player.facing = 'down';
    
    // Play the initial idle animation.
    this.player.anims.play('idleDown');

    // Define speed for walking and running.
    this.walkSpeed = 150;
    this.runSpeed = 250;
  }
  
  // Helper: Update key bindings by reading current values from window.gameSettings.
  updateKeyBindings() {
    // Remove any previously defined keys if they exist to avoid duplicates.
    if (this.keys) {
      this.input.keyboard.removeKey(this.keys.up);
      this.input.keyboard.removeKey(this.keys.down);
      this.input.keyboard.removeKey(this.keys.left);
      this.input.keyboard.removeKey(this.keys.right);
    }
    // Define keys based on global settings.
    // The global settings values should be strings like 'W' or 'ARROWUP'.
    this.keys = this.input.keyboard.addKeys({
      up: window.gameSettings.moveUp.toUpperCase(),
      down: window.gameSettings.moveDown.toUpperCase(),
      left: window.gameSettings.moveLeft.toUpperCase(),
      right: window.gameSettings.moveRight.toUpperCase(),
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });
  }
  
  update() {
    // Check the current keybinds for movement.
    // Use the keys defined in this.keys which were created in updateKeyBindings().
    const { up, down, left, right, shift } = this.keys;
    const isRunning = shift.isDown;
    const speed = isRunning ? this.runSpeed : this.walkSpeed;
    
    // Reset velocity.
    this.player.setVelocity(0);
    let velocityX = 0;
    let velocityY = 0;
    let animKey = '';

    // Horizontal movement based on keybind remapping.
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

    // Vertical movement based on keybind remapping.
    if (up.isDown) {
      velocityY = -speed;
      this.player.facing = 'up';
      animKey = isRunning ? 'runUp' : 'walkUp';
    } else if (down.isDown) {
      velocityY = speed;
      this.player.facing = 'down';
      animKey = isRunning ? 'runDown' : 'walkDown';
    }
    
    // Apply calculated velocities to the player sprite.
    this.player.setVelocity(velocityX, velocityY);
    
    // Choose the proper animation based on movement, or idle if no keys are pressed.
    if (up.isDown || down.isDown || left.isDown || right.isDown) {
      if (animKey !== '') {
        this.player.anims.play(animKey, true);
      }
    } else {
      // When idle, choose the idle animation based on the last facing direction.
      const idleKey = 'idle' + this.player.facing.charAt(0).toUpperCase() + this.player.facing.slice(1);
      this.player.anims.play(idleKey, true);
    }
  }
}
