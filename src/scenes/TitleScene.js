import BaseScene       from './BaseScene.js';
import SettingsPanel   from '../ui/SettingsPanel.js';
import UIButton        from '../ui/UIButton.js';
import UIModal         from '../ui/UIModal.js';
import UIKeybindButton from '../ui/UIKeybindButton.js';

export default class TitleScene extends BaseScene {
  constructor() { super('TitleScene'); }

  create() {
    super.init();

    const cam = this.cameras.main;
    const cx  = cam.centerX;
    const cy  = cam.centerY;

    // Title
    this.add.text(cx, 80, 'Heir of the Covenant', {
      font: '48px "IM Fell English"',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Main menu items
    const items = [
      { label:'Start Journey',    cb:() => this.openStartConfirmation() },
      { label:'Continue Journey', cb:() => this.continueJourney(), disable: !this.hasSavedGame() },
      { label:'Settings',         cb:() => this.settingsPanel.show() }
    ];
    // Vertical spacing = 12% of screen height
    const spacing = cam.height * 0.12;
    // Center block start Y
    const startY  = cy - spacing;
    items.forEach((it,i) => {
      const y = startY + i*spacing;
      const btn = new UIButton(this, cx, y, it.label, it.cb);
      if (it.disable) btn.setAlpha(0.5).disableInteractive();
    });

    // Build the Start confirmation modal
    this.createStartConfirmationModal();

    // Settings panel (general)
    this.settingsPanel = new SettingsPanel(this, this.settings);

    // Keybind overlay
    this.createKeybindOverlay();
  }

  hasSavedGame() {
    return localStorage.getItem('gameSaved') !== null;
  }

  // --- Start Confirmation --- //
  createStartConfirmationModal() {
    this.startModal = new UIModal(this, this.cameras.main.width, this.cameras.main.height);
    const cam = this.cameras.main;
    const cx  = cam.centerX, cy = cam.centerY;

    // Prompt text
    const text = this.add.text(cx, cy-40, 'Are you sure you want to start a new journey?', {
      font:'20px "IM Fell English"', fill:'#ffffff', wordWrap:{ width:360 }
    }).setOrigin(0.5);

    const yes = new UIButton(this, cx-60, cy+40, 'YES', ()=> {
      this.cameras.main.fadeOut(500,0,0,0);
      this.cameras.main.once('camerafadeoutcomplete', ()=> {
        localStorage.removeItem('gameSaved');
        this.startModal.hide();
        this.scene.start('MainScene');
      });
    },{ fontSize:'24px', backgroundColor:'#00aa00' });

    const no  = new UIButton(this, cx+60, cy+40, 'NO', () => {
      this.startModal.hide();
    },{ fontSize:'24px', backgroundColor:'#aa0000' });

    this.startModal.add([ text, yes, no ]);
  }

  openStartConfirmation() {
    this.startModal.show();
  }

  continueJourney() {
    if (this.hasSavedGame()) this.scene.start('MainScene');
    else alert('No saved journey found.');
  }

  // --- Keybind Overlay --- //
  createKeybindOverlay() {
    this.keybindOverlay = new UIModal(this, this.cameras.main.width, this.cameras.main.height);
    const cam   = this.cameras.main;
    const cx    = cam.centerX;
    const cy    = cam.centerY;
    const boxW  = cam.width * 0.8;
    const boxH  = cam.height * 0.6;
    // Adjust the UIModal's box to match computed size
    this.keybindOverlay.box.setSize(boxW, boxH).setPosition(cx, cy);

    // Padding and dynamic vertical layout
    const pad    = 40;
    const innerH = boxH - pad*2;
    const startY = cy - innerH/2;
    const actions= ['moveUp','moveDown','moveLeft','moveRight','attack'];
    // Title row + one row per action + close row => rows = actions.length + 2
    const rows   = actions.length + 2;
    const gap    = innerH / (rows - 1);

    // Title
    const title = this.add.text(cx, startY, 'Keybind Settings', {
      font:'36px "IM Fell English"', fill:'#ffffff'
    }).setOrigin(0.5);
    this.keybindOverlay.add(title);

    // One button per action
    actions.forEach((act,i) => {
      const y = startY + gap*(i+1);
      const label = `${act.replace(/([A-Z])/g,' $1')}: [${this.settings.get(act)}]`;
      const btn = new UIKeybindButton(this, cx, y, act, this.settings);
      this.keybindOverlay.add(btn);
    });

    // Close button at bottom
    const closeY = startY + gap*(actions.length+1);
    const close  = new UIButton(this, cx, closeY, 'Close', ()=> {
      this.keybindOverlay.hide();
      this.settingsPanel.show();
    },{ backgroundColor:'#555555', fontSize:'24px' });
    this.keybindOverlay.add(close);
  }

  openKeybindOverlay() {
    this.settingsPanel.hide();
    this.keybindOverlay.show();
  }
}
