import UIModal   from './UIModal.js';
import UISlider  from './UISlider.js';
import UIButton  from './UIButton.js';

export default class SettingsPanel {
  constructor(scene, settingsManager) {
    this.scene = scene;
    this.sm    = settingsManager;

    // Create modal with full-screen backdrop + box
    const cam   = scene.cameras.main;
    this.modal  = new UIModal(scene, cam.width, cam.height);
    const boxW   = cam.width * 0.8;
    const boxH   = cam.height * 0.6;
    const cx     = cam.centerX;
    const cy     = cam.centerY;

    // Compute inner region with padding
    const pad    = 40;
    const innerW = boxW - pad * 2;
    const innerH = boxH - pad * 2;
    const topY   = cy - innerH/2;
    // We'll lay out 4 rows: title, volume, keybind button, close
    const rows   = 4;
    const gap    = innerH / (rows - 1);

    // Title
    const title = scene.add.text(cx, topY, 'Settings', {
      fontFamily: '"IM Fell English", serif',
      fontSize:   '36px',
      fill:       '#ffffff'
    }).setOrigin(0.5);
    this.modal.add(title);

    // Volume row
    const volY = topY + gap;
    const volLbl = scene.add.text(cx - innerW/2, volY, 'Volume:', {
      fontFamily: '"IM Fell English", serif',
      fontSize:   '24px',
      fill:       '#ffffff'
    }).setOrigin(0, 0.5);
    const slider = new UISlider(
      scene, cx + innerW/4, volY, innerW/2,
      this.sm.get('volume'),
      v => this.sm.set('volume', v)
    );
    this.modal.add([volLbl, slider]);

    // Keybind Settings button
    const kbY = topY + gap * 2;
    const kbBtn = new UIButton(
      scene, cx, kbY, 'Keybind Settings',
      () => {
        this.modal.hide();
        scene.openKeybindOverlay();
      },
      { fontSize:'24px' }
    );
    this.modal.add(kbBtn);

    // Close button
    const closeY = topY + gap * 3;
    const closeBtn = new UIButton(
      scene, cx, closeY, 'Close',
      () => this.modal.hide(),
      { backgroundColor:'#555555', fontSize:'24px' }
    );
    this.modal.add(closeBtn);
  }

  show() { this.modal.show(); }
  hide() { this.modal.hide(); }
}
