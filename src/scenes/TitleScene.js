// src/scenes/TitleScene.js
import UIButton from '../ui/UIButton.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Display the game title.
    this.add.text(centerX, 80, 'Heir of the Covenant', {
      fontFamily: '"IM Fell English", serif',
      fontSize: '48px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Define menu buttons (Exit removed).
    const btnConfigs = [
      { label: 'Start Journey', y: centerY - 40, callback: () => this.openStartConfirmation() },
      { label: 'Continue Journey', y: centerY + 10, callback: () => this.continueJourney() },
      { label: 'Settings', y: centerY + 60, callback: () => this.openSettings() },
    ];

    this.buttonsGroup = this.add.group();
    btnConfigs.forEach((cfg) => {
      const btn = new UIButton(this, centerX, cfg.y, cfg.label, cfg.callback);
      // Disable "Continue Journey" if no saved game exists.
      if (cfg.label === 'Continue Journey' && !this.hasSavedGame()) {
        btn.setAlpha(0.5);
        btn.disableInteractive();
      }
      this.buttonsGroup.add(btn);
    });

    // Create modal overlays (hidden by default)
    this.createStartConfirmationModal();
    this.createSettingsOverlay();
    this.createKeybindOverlay();
  }

  // Checks for saved game data in localStorage.
  hasSavedGame() {
    return localStorage.getItem('gameSaved') !== null;
  }

  // ------------- Start Confirmation Modal ------------- //
  createStartConfirmationModal() {
    this.startModal = this.add.container(0, 0).setVisible(false);
    
    const modalBg = this.add.rectangle(
      this.cameras.main.centerX, this.cameras.main.centerY,
      this.cameras.main.width, this.cameras.main.height,
      0x000000, 0.5
    );
    const dialogBox = this.add.rectangle(
      this.cameras.main.centerX, this.cameras.main.centerY,
      400, 200, 0x222222, 1
    );
    const dialogText = this.add.text(
      this.cameras.main.centerX, this.cameras.main.centerY - 40,
      'Are you sure you want to start a new journey?',
      { fontFamily: '"IM Fell English", serif', fontSize: '20px', fill: '#ffffff', wordWrap: { width: 360 } }
    ).setOrigin(0.5);

    const yesBtn = new UIButton(this, this.cameras.main.centerX - 60, this.cameras.main.centerY + 40, 'YES', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        localStorage.removeItem('gameSaved'); // Clear saved data
        this.startModal.setVisible(false);
        this.scene.start('MainScene');
      });
    }, { backgroundColor: '#00aa00', fontSize: '24px' });

    const noBtn = new UIButton(this, this.cameras.main.centerX + 60, this.cameras.main.centerY + 40, 'NO', () => {
      this.startModal.setVisible(false);
    }, { backgroundColor: '#aa0000', fontSize: '24px' });

    this.startModal.add([modalBg, dialogBox, dialogText, yesBtn, noBtn]);
  }

  openStartConfirmation() {
    this.startModal.setVisible(true);
  }

  continueJourney() {
    if (this.hasSavedGame()) {
      this.scene.start('MainScene');
    } else {
      alert('No saved journey found.');
    }
  }

  // ------------- Settings Overlay (General Settings) ------------- //
  createSettingsOverlay() {
    this.settingsOverlay = this.add.container(0, 0).setVisible(false);
    
    // Full-screen overlay background.
    const overlayBg = this.add.rectangle(
      this.cameras.main.centerX, this.cameras.main.centerY,
      this.cameras.main.width, this.cameras.main.height,
      0x000000, 0.5
    );
    
    // Settings dialog box.
    const settingsBox = this.add.rectangle(
      this.cameras.main.centerX, this.cameras.main.centerY,
      500, 250, 0x333333, 1
    );
    
    const settingsTitle = this.add.text(
      this.cameras.main.centerX, this.cameras.main.centerY - 100,
      'Settings', { fontFamily: '"IM Fell English", serif', fontSize: '36px', fill: '#ffffff' }
    ).setOrigin(0.5);
    
    // Volume settings.
    const volumeLabel = this.add.text(
      this.cameras.main.centerX - 200, this.cameras.main.centerY - 30,
      'Sound Volume:', { fontFamily: '"IM Fell English", serif', fontSize: '24px', fill: '#ffffff' }
    ).setOrigin(0, 0.5);
    
    const sliderWidth = 300;
    const sliderX = this.cameras.main.centerX - sliderWidth / 2;
    const sliderY = this.cameras.main.centerY - 30;
    const sliderTrack = this.add.rectangle(
      sliderX + sliderWidth / 2, sliderY, sliderWidth, 10, 0x888888, 1
    );
    const knob = this.add.circle(sliderX, sliderY, 15, 0xffffff);
    knob.setInteractive({ draggable: true, useHandCursor: true });
    let currentVolume = 50;
    knob.on('drag', (pointer, dragX) => {
      const clampedX = Phaser.Math.Clamp(dragX, sliderX, sliderX + sliderWidth);
      knob.x = clampedX;
      currentVolume = Math.round(((clampedX - sliderX) / sliderWidth) * 100);
      console.log('Volume:', currentVolume + '%');
      // Optionally, update audio volume in your game here.
    });

    // Button to open the Keybind Settings overlay, to avoid cluttering these general settings.
    const keybindSettingsBtn = new UIButton(this, this.cameras.main.centerX, this.cameras.main.centerY + 40, 'Keybind Settings', () => {
      this.settingsOverlay.setVisible(false);
      this.openKeybindOverlay();
    }, { backgroundColor: '#444444', fontSize: '24px' });

    // Close button for settings overlay.
    const settingsCloseBtn = new UIButton(this, this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Close', () => {
      this.settingsOverlay.setVisible(false);
    }, { backgroundColor: '#555555', fontSize: '24px' });

    this.settingsOverlay.add([overlayBg, settingsBox, settingsTitle, volumeLabel, sliderTrack, knob, keybindSettingsBtn, settingsCloseBtn]);
  }

  openSettings() {
    this.settingsOverlay.setVisible(true);
  }

  // ------------- Keybind Overlay (Dedicated Remapping Panel) ------------- //
  createKeybindOverlay() {
    this.keybindOverlay = this.add.container(0, 0).setVisible(false);
    
    // Full-screen background.
    const overlayBg = this.add.rectangle(
      this.cameras.main.centerX, this.cameras.main.centerY,
      this.cameras.main.width, this.cameras.main.height,
      0x000000, 0.5
    );
    
    // Keybind dialog box.
    const keybindBox = this.add.rectangle(
      this.cameras.main.centerX, this.cameras.main.centerY,
      500, 300, 0x333333, 1
    );
    
    const keybindTitle = this.add.text(
      this.cameras.main.centerX, this.cameras.main.centerY - 120,
      'Keybind Settings', { fontFamily: '"IM Fell English", serif', fontSize: '36px', fill: '#ffffff' }
    ).setOrigin(0.5);
    
    // Create a container to hold keybind buttons.
    const keybindGroup = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY - 40);
    const keybindActions = [
      { action: 'Move Up', settingKey: 'moveUp' },
      { action: 'Move Down', settingKey: 'moveDown' },
      { action: 'Move Left', settingKey: 'moveLeft' },
      { action: 'Move Right', settingKey: 'moveRight' },
      { action: 'Attack', settingKey: 'attack' },
    ];
    const spacing = 40;
    keybindActions.forEach((item, index) => {
      const displayText = `${item.action}: [${window.gameSettings[item.settingKey]}]`;
      const btn = new UIButton(this, 0, index * spacing, displayText, () => {
        // Temporarily prompt the user to press a key for remapping.
        btn.setText(`${item.action}: Press key...`);
        this.input.keyboard.once('keydown', (event) => {
          // Update global settings and persist to localStorage.
          window.gameSettings[item.settingKey] = event.key.toUpperCase();
          localStorage.setItem('gameSettings', JSON.stringify(window.gameSettings));
          btn.setText(`${item.action}: [${window.gameSettings[item.settingKey]}]`);
          console.log(`${item.action} remapped to ${window.gameSettings[item.settingKey]}`);
        });
      }, { fontSize: '24px', backgroundColor: '#444444' });
      keybindGroup.add(btn);
    });

    const keybindCloseBtn = new UIButton(this, this.cameras.main.centerX, this.cameras.main.centerY + 120, 'Close', () => {
      this.keybindOverlay.setVisible(false);
      this.settingsOverlay.setVisible(true); // Return to general settings.
    }, { backgroundColor: '#555555', fontSize: '24px' });
    
    this.keybindOverlay.add([overlayBg, keybindBox, keybindTitle, keybindGroup, keybindCloseBtn]);
  }

  openKeybindOverlay() {
    this.keybindOverlay.setVisible(true);
  }

  update() {
    // No continuous update logic is required for the TitleScene.
  }
}
