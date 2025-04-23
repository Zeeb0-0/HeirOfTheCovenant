// Uses global Phaser via CDN; extends Phaser.Events.EventEmitter
export default class SettingsManager extends window.Phaser.Events.EventEmitter {
  constructor() {
    super();
    let loaded;
    try {
      loaded = JSON.parse(localStorage.getItem('gameSettings'));
    } catch {
      loaded = null;
    }
    this.settings = (loaded && typeof loaded === 'object') ? loaded : {
      moveUp: 'W',
      moveDown: 'S',
      moveLeft: 'A',
      moveRight: 'D',
      attack: 'SPACE',
      volume: 50
    };
    // Clamp volume to [0,100]
    let v = parseFloat(this.settings.volume);
    if (!isFinite(v) || v < 0 || v > 100) v = 50;
    this.settings.volume = v;
  }

  get(key) {
    return this.settings[key];
  }

  set(key, value) {
    this.settings[key] = value;
    localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    this.emit('changed', key, value);
  }
}
