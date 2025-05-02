// src/config/AssetPaths.js

export default {
  sprites: {
    // === PLAYER (64×64 frames) ===
    idleDown:   { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Idle_Base/Idle_Down-Sheet.png',    frameWidth:64, frameHeight:64 },
    idleUp:     { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Idle_Base/Idle_Up-Sheet.png',      frameWidth:64, frameHeight:64 },
    idleSide:   { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Idle_Base/Idle_Side-Sheet.png',    frameWidth:64, frameHeight:64 },
    walkDown:   { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Walk_Base/Walk_Down-Sheet.png',    frameWidth:64, frameHeight:64 },
    walkUp:     { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Walk_Base/Walk_Up-Sheet.png',      frameWidth:64, frameHeight:64 },
    walkSide:   { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Walk_Base/Walk_Side-Sheet.png',    frameWidth:64, frameHeight:64 },
    runDown:    { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Run_Base/Run_Down-Sheet.png',      frameWidth:64, frameHeight:64 },
    runUp:      { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Run_Base/Run_Up-Sheet.png',        frameWidth:64, frameHeight:64 },
    runSide:    { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Run_Base/Run_Side-Sheet.png',      frameWidth:64, frameHeight:64 },
    hitDown:    { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Hit_Base/Hit_Down-Sheet.png',      frameWidth:64, frameHeight:64 },
    hitUp:      { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Hit_Base/Hit_Up-Sheet.png',        frameWidth:64, frameHeight:64 },
    hitSide:    { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Hit_Base/Hit_Side-Sheet.png',      frameWidth:64, frameHeight:64 },
    pierceDown: { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Pierce_Base/Pierce_Down-Sheet.png', frameWidth:64, frameHeight:64 },
    pierceUp:   { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Pierce_Base/Pierce_Up-Sheet.png',   frameWidth:64, frameHeight:64 },
    pierceSide: { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Pierce_Base/Pierce_Side-Sheet.png', frameWidth:64, frameHeight:64 },
    deathDown:  { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Death_Base/Death_Down-Sheet.png',    frameWidth:64, frameHeight:64 },
    deathUp:    { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Death_Base/Death_Up-Sheet.png',      frameWidth:64, frameHeight:64 },
    deathSide:  { path: 'assets/sprites/Entities/Characters/Body_A/Animations/Death_Base/Death_Side-Sheet.png',    frameWidth:64, frameHeight:64 },

    // === NPCs: adjust frame sizes if different! ===
    knightIdle:   { path: "assets/sprites/Entities/Npcs/Knight/Idle/Idle-Sheet.png",    frameWidth:64, frameHeight:64 },
    knightRun:    { path: "assets/sprites/Entities/Npcs/Knight/Run/Run-Sheet.png",      frameWidth:64, frameHeight:64 },
    knightDeath:  { path: "assets/sprites/Entities/Npcs/Knight/Death/Death-Sheet.png", frameWidth:64, frameHeight:64 },

    rogueIdle:    { path: "assets/sprites/Entities/Npcs/Rogue/Idle/Idle-Sheet.png",     frameWidth:64, frameHeight:64 },
    rogueRun:     { path: "assets/sprites/Entities/Npcs/Rogue/Run/Run-Sheet.png",       frameWidth:64, frameHeight:64 },
    rogueDeath:   { path: "assets/sprites/Entities/Npcs/Rogue/Death/Death-Sheet.png",  frameWidth:64, frameHeight:64 },

    mageIdle:     { path: "assets/sprites/Entities/Npcs/Wizard/Idle/Idle-Sheet.png",    frameWidth:64, frameHeight:64 },
    mageRun:      { path: "assets/sprites/Entities/Npcs/Wizard/Run/Run-Sheet.png",      frameWidth:64, frameHeight:64 },
    mageDeath:    { path: "assets/sprites/Entities/Npcs/Wizard/Death/Death-Sheet.png",  frameWidth:64, frameHeight:64 },

    // === Mobs: same approach, adjust per actual size ===
    orcIdle:         { path: "assets/sprites/Entities/Mobs/Orc Crew/Orc/Idle/Idle-Sheet.png",             frameWidth:64, frameHeight:64 },
    orcRun:          { path: "assets/sprites/Entities/Mobs/Orc Crew/Orc/Run/Run-Sheet.png",               frameWidth:64, frameHeight:64 },
    orcDeath:        { path: "assets/sprites/Entities/Mobs/Orc Crew/Orc/Death/Death-Sheet.png",           frameWidth:64, frameHeight:64 },
    orcRogueIdle:    { path: "assets/sprites/Entities/Mobs/Orc Crew/Orc - Rogue/Idle/Idle-Sheet.png",      frameWidth:64, frameHeight:64 },
    orcRogueRun:     { path: "assets/sprites/Entities/Mobs/Orc Crew/Orc - Rogue/Run/Run-Sheet.png",        frameWidth:64, frameHeight:64 },
    orcRogueDeath:   { path: "assets/sprites/Entities/Mobs/Orc Crew/Orc - Rogue/Death/Death-Sheet.png",    frameWidth:64, frameHeight:64 },
    // … repeat for shaman & warrior …

    // === Skeleton Crew similarly …
    skeletonBaseIdle:   { path:"assets/sprites/Entities/Mobs/Skeleton Crew/Skeleton - Base/Idle/Idle-Sheet.png",  frameWidth:64, frameHeight:64 },
    skeletonBaseRun:    { path:"assets/sprites/Entities/Mobs/Skeleton Crew/Skeleton - Base/Run/Run-Sheet.png",   frameWidth:64, frameHeight:64 },
    skeletonBaseDeath:  { path:"assets/sprites/Entities/Mobs/Skeleton Crew/Skeleton - Base/Death/Death-Sheet.png", frameWidth:64, frameHeight:64 },
    // … and so on …
  },

  ui: {
    // Health Bar UI (use only 9 frames: 0–8)
    lifeHealing: { path:'assets/ui/HealthRegeneration/LifeHealing-Sheet.png', frameWidth:64, frameHeight:16 }
  },

  audio: {
    bgm: 'assets/audio/bgm.mp3'
  }
};
