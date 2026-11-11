import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Timer, Pause, Play, Home } from 'lucide-react';
import { Level } from '../data/levels';
import Capybara from './Capybara';
import { sfx } from '../lib/sounds';
import WeatherSystem, { WeatherType, WeatherQuality } from './WeatherSystem';

interface PlatformerProps {
  level: Level;
  lives: number;
  totalBroccolis: number;
  isPaused: boolean;
  showPauseOverlay: boolean;
  levelTime: number;
  gameTime: number;
  key?: string;
  onReachEnemy: () => void;
  onLevelComplete: () => void;
  onFall: (cause?: string) => void;
  onCollectBroccoli: () => void;
  onEnterPortal?: (targetLevelId: string) => void;
  onTogglePause: () => void;
  onBackToMenu: () => void;
  enemyDefeated: boolean;
  resolveEncounter: boolean;
  isResetting: boolean;
}

const GRAVITY = 0.6;
const JUMP_FORCE = -15; // Increased slightly to handle gaps
const SPEED = 7; // Faster walking!

interface StoneItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isPickedUp: boolean;
}

function generateLevelStones(lvl: Level): StoneItem[] {
  const list: StoneItem[] = [];
  const pits = lvl.pits || [];
  
  // Calculate ground segments (excluding pits)
  const segments: { start: number; end: number }[] = [];
  let curX = 0;
  for (const p of pits) {
    if (p.start > curX) {
      segments.push({ start: curX, end: p.start });
    }
    curX = p.start + p.w;
  }
  if (curX < lvl.worldWidth + 1000) {
    segments.push({ start: curX, end: lvl.worldWidth + 1000 });
  }

  let stoneCounter = 1;
  // 1. Spawning on solid ground areas
  for (const seg of segments) {
    // Avoid spawning near start (x < 250) or too close to borders
    const startX = seg.start === 0 ? 350 : seg.start + 60;
    const endX = Math.min(seg.end - 60, lvl.worldWidth - 100);
    for (let sx = startX; sx < endX; sx += 700) {
      list.push({
        id: `stone-${lvl.id}-${stoneCounter++}`,
        x: sx,
        y: lvl.floorY - 24, // stone is 24x24 on floor
        w: 24,
        h: 24,
        isPickedUp: false
      });
    }
  }

  // 2. Spawning on platform centers
  const platforms = lvl.platforms || [];
  for (const plat of platforms) {
    if (plat.w >= 100 && plat.x < lvl.worldWidth - 100) {
      list.push({
        id: `stone-${lvl.id}-${stoneCounter++}`,
        x: Math.round(plat.x + plat.w / 2 - 12),
        y: plat.y - 24,
        w: 24,
        h: 24,
        isPickedUp: false
      });
    }
  }

  return list;
}

export default function Platformer({ 
  level, 
  lives,
  totalBroccolis,
  isPaused, 
  showPauseOverlay,
  levelTime,
  gameTime,
  onReachEnemy, 
  onLevelComplete, 
  onFall,
  onCollectBroccoli,
  onEnterPortal,
  onTogglePause,
  onBackToMenu,
  enemyDefeated,
  isResetting
}: PlatformerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerW = 1000;
  const containerH = 562;
  
  const [player, setPlayer] = useState({ 
    x: 100, 
    y: level.floorY - 64, 
    vx: 0, 
    vy: 0,
    isGrounded: true,
    facingRight: true,
    hasTouchedEnemy: false,
    currentPlatformIndex: null as number | null,
    isCollecting: false,
    isClimbing: false,
    isCrouching: false
  });

  const keys = useRef<{ [key: string]: boolean }>({});
  const requestRef = useRef<number>(0);
  
  // Use refs for closures to avoid stale state in requestAnimationFrame
  const isPausedRef = useRef(isPaused);
  const enemyDefeatedRef = useRef(enemyDefeated);
  const playerRef = useRef(player);
  const levelCompleteTriggered = useRef(false);

  // mutable state for enemies and items
  const activeEnemies = useRef(level.enemies?.map(e => ({ ...e, currentX: e.x, currentY: e.y, dir: 1, isDead: false })) || []);
  const collectedBroccolis = useRef<Set<string>>(new Set());
  const collectedTangerines = useRef<Set<string>>(new Set());
  const collectedApples = useRef<Set<string>>(new Set());
  const collectedBananas = useRef<Set<string>>(new Set());
  const deadSpikes = useRef<Set<number>>(new Set());
  const [isInvincible, setIsInvincible] = useState(false);
  const isInvincibleRef = useRef(false);
  const invincibilityTimerRef = useRef<number | null>(null);
  
  const lastPlatformIndex = useRef<number | null>(null);
  const bouncingPlatforms = useRef<{ [key: number]: number }>({});
  const collectingStartTimeRef = useRef<number>(0);
  
  const [hasSuperJump, setHasSuperJump] = useState(false);
  const hasSuperJumpRef = useRef(false);
  const superJumpTimerRef = useRef<number | null>(null);
  
  const [hasExtraSpeed, setHasExtraSpeed] = useState(false);
  const hasExtraSpeedRef = useRef(false);
  const extraSpeedTimerRef = useRef<number | null>(null);

  // Stone collecting & throwing mechanics state and refs
  const [stonesCount, setStonesCount] = useState(3);
  const playerStonesCount = useRef(3);
  
  const [stonesList, setStonesList] = useState<StoneItem[]>([]);
  const levelStones = useRef<StoneItem[]>([]);
  
  const [projectilesList, setProjectilesList] = useState<any[]>([]);
  const thrownProjectiles = useRef<{ id: string; x: number; y: number; vx: number; vy: number; w: number; h: number; rotation: number }[]>([]);
  
  const lastThrowTime = useRef(0);

  // Boss battle states and refs
  const [bossHp, setBossHp] = useState(3);
  const bossHpRef = useRef(3);
  const [bossHitFlash, setBossHitFlash] = useState(false);
  const [showBossHint, setShowBossHint] = useState(false);
  const bossHintTimeoutRef = useRef<number | null>(null);

  const [bossProjsList, setBossProjsList] = useState<any[]>([]);
  const activeBossProjectiles = useRef<any[]>([]);
  const lastBossShotTime = useRef(0);
  const fallCauseRef = useRef('espinho');

  // Weather System State & Per-Level Type Mapping
  const [weatherQuality, setWeatherQuality] = useState<WeatherQuality>(() => {
    const saved = localStorage.getItem('capybara_weather_quality');
    if (saved === 'high' || saved === 'low' || saved === 'off') return saved as WeatherQuality;
    return 'high';
  });

  const weatherType: WeatherType = useMemo(() => {
    if (level.scenery === 'lake' || level.id === 'level_1') return 'rain';
    if (level.scenery === 'savanna' || level.id === 'level_2') return 'dust';
    if (level.scenery === 'jungle' || level.id === 'level_3') return 'mist';
    if (level.scenery === 'volcano' || level.id === 'level_4') return 'embers';
    if (level.scenery === 'dark' || level.id === 'secret_1') return 'snow';
    return 'rain';
  }, [level.scenery, level.id]);

  const handleSetWeatherQuality = (newQuality: WeatherQuality) => {
    setWeatherQuality(newQuality);
    localStorage.setItem('capybara_weather_quality', newQuality);
    sfx.playJump();
  };

  const weatherLabels: Record<WeatherType, { name: string; emoji: string }> = {
    rain: { name: 'Chuva Tropical', emoji: '🌧️' },
    dust: { name: 'Brisa da Savana', emoji: '🌾' },
    mist: { name: 'Névoa da Floresta', emoji: '🌫️' },
    embers: { name: 'Brasas Vulcânicas', emoji: '🔥' },
    snow: { name: 'Neve Espectral', emoji: '❄️' },
    none: { name: 'Sem Clima', emoji: '☀️' },
  };

  const triggerBossHint = () => {
    if (showBossHint) return;
    setShowBossHint(true);
    if (bossHintTimeoutRef.current) clearTimeout(bossHintTimeoutRef.current);
    bossHintTimeoutRef.current = setTimeout(() => {
      setShowBossHint(false);
    }, 2800) as unknown as number;
  };

  const throwStone = () => {
    if (isPausedRef.current) return;
    const now = Date.now();
    if (now - lastThrowTime.current < 300) return; // limit fire rate (300ms)
    
    if (playerStonesCount.current <= 0) {
      return;
    }
    
    lastThrowTime.current = now;
    playerStonesCount.current -= 1;
    setStonesCount(playerStonesCount.current);
    
    // Play throw sound
    sfx.playJump();
    
    const facingRight = playerRef.current.facingRight;
    const isCr = playerRef.current.isCrouching || false;
    const px = playerRef.current.x + (facingRight ? 45 : -10);
    const py = playerRef.current.y + (isCr ? 32 : 20);
    
    const newProj = {
      id: `proj-${Date.now()}-${Math.random()}`,
      x: px,
      y: py,
      vx: facingRight ? 13 : -13,
      vy: isCr ? -1.5 : -5.5, // flatter, lower trajectory if crouching
      w: 24,
      h: 24,
      rotation: 0
    };
    
    thrownProjectiles.current.push(newProj);
    setProjectilesList([...thrownProjectiles.current]);
  };

  // Reset local state when level changes
  useEffect(() => {
    activeEnemies.current = level.enemies?.map(e => ({ ...e, currentX: e.x, currentY: e.y, dir: 1, isDead: false })) || [];
    collectedBroccolis.current = new Set();
    collectedTangerines.current = new Set();
    collectedApples.current = new Set();
    collectedBananas.current = new Set();
    deadSpikes.current = new Set();
    levelCompleteTriggered.current = false;
    
    // Clear invincible
    setIsInvincible(false);
    isInvincibleRef.current = false;
    if (invincibilityTimerRef.current) {
      clearTimeout(invincibilityTimerRef.current);
    }
    
    // Clear super jump
    setHasSuperJump(false);
    hasSuperJumpRef.current = false;
    if (superJumpTimerRef.current) {
      clearTimeout(superJumpTimerRef.current);
    }
    
    // Clear extra speed
    setHasExtraSpeed(false);
    hasExtraSpeedRef.current = false;
    if (extraSpeedTimerRef.current) {
      clearTimeout(extraSpeedTimerRef.current);
    }
    sfx.stopInvincibleMusic();

    // Initialize level stones and active projectiles
    const generatedStones = generateLevelStones(level);
    levelStones.current = generatedStones;
    setStonesList(generatedStones);

    thrownProjectiles.current = [];
    setProjectilesList([]);

    playerStonesCount.current = Math.max(playerStonesCount.current, 3);
    setStonesCount(playerStonesCount.current);

    // Reset boss values
    setBossHp(3);
    bossHpRef.current = 3;
    setBossHitFlash(false);
    setShowBossHint(false);
    activeBossProjectiles.current = [];
    setBossProjsList([]);
    lastBossShotTime.current = 0;
    fallCauseRef.current = 'espinho';
    if (bossHintTimeoutRef.current) {
      clearTimeout(bossHintTimeoutRef.current);
    }
  }, [level.id]);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (!isPaused) {
      keys.current = {}; // Clear keys on unpause so they don't get stuck
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.focus();
        }
      }, 50);
    }
  }, [isPaused]);

  useEffect(() => {
    enemyDefeatedRef.current = enemyDefeated;
  }, [enemyDefeated]);

  useEffect(() => {
    // This empty space used to contain a buggy useEffect syncing player state!
  }, [player]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyX' || e.code === 'KeyC' || e.code === 'KeyF' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        throwStone();
      }
      keys.current[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    
    // Regain focus when returning/starting Platformer
    window.focus();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (bossHintTimeoutRef.current) clearTimeout(bossHintTimeoutRef.current);
    };
  }, []);

  const update = () => {
    if (isPausedRef.current) {
       requestRef.current = requestAnimationFrame(update);
       return;
    }

    let { x, y, vx, vy, isGrounded, facingRight, hasTouchedEnemy, currentPlatformIndex, isClimbing = false, isCrouching = false } = playerRef.current;
    
    const isCollecting = Date.now() - collectingStartTimeRef.current < 400;

    const pw = 64;
    const ph = 64;

    // We check ladder collision based on standing height
    const overlappingLadder = level.ladders?.find(l => 
      x + pw/2 > l.x && x + pw/2 < l.x + l.w &&
      y + ph > l.y && y < l.y + l.h
    );

    // Enter / Exit climbing conditions
    if (overlappingLadder) {
      if (keys.current['ArrowUp'] || keys.current['KeyW'] || keys.current['ArrowDown'] || keys.current['KeyS']) {
        if (!isClimbing) {
          isClimbing = true;
          isGrounded = false;
        }
      }
    } else {
      isClimbing = false;
    }

    if (isClimbing && keys.current['Space']) {
      isClimbing = false;
      vy = JUMP_FORCE * 0.85; // Mini-jump off ladder
      isGrounded = false;
      sfx.playJump();
    }

    // Entering/exiting crouching state
    // Crouching is possible if grounded and NOT climbing
    if (isGrounded && !isClimbing && (keys.current['ArrowDown'] || keys.current['KeyS'])) {
      isCrouching = true;
    } else {
      isCrouching = false;
    }

    // Portal / Puddle check
    if (keys.current['ArrowDown'] || keys.current['KeyS']) {
      if (level.puddles && onEnterPortal) {
        const p = level.puddles.find(pud => 
          x + pw/2 > pud.x && x + pw/2 < pud.x + pud.w &&
          y + ph >= pud.y - 12 && y + ph <= pud.y + pud.h + 12
        );
        if (p) {
          onEnterPortal(p.targetLevelId);
          keys.current['ArrowDown'] = false;
          keys.current['KeyS'] = false;
          return;
        }
      }
    }

    if (isClimbing) {
      vy = 0;
      if (keys.current['ArrowUp'] || keys.current['KeyW']) {
        vy = -4.5;
        // Snap smoothly to the visual center of the ladder for a fluid movement
        if (overlappingLadder) {
          const ladderCenterX = overlappingLadder.x + overlappingLadder.w / 2 - pw / 2;
          x = x + (ladderCenterX - x) * 0.22;
        }
      } else if (keys.current['ArrowDown'] || keys.current['KeyS']) {
        vy = 4.5;
        if (overlappingLadder) {
          const ladderCenterX = overlappingLadder.x + overlappingLadder.w / 2 - pw / 2;
          x = x + (ladderCenterX - x) * 0.22;
        }
      }
    } else {
      vy += GRAVITY;
    }

    const currentSpeed = hasExtraSpeedRef.current ? SPEED * 1.5 : SPEED;
    if (keys.current['ArrowLeft'] || keys.current['KeyA']) {
      vx = -currentSpeed;
      facingRight = false;
    } else if (keys.current['ArrowRight'] || keys.current['KeyD']) {
      vx = currentSpeed;
      facingRight = true;
    } else {
      vx = 0;
    }

    if (isClimbing) {
      vx = vx * 0.5; // Walk slowly horizontally when climbing/aligning
    }
    if (isCrouching) {
      vx = vx * 0.45; // Move slower when crouching
    }

    if ((keys.current['Space'] || keys.current['KeyW']) && isGrounded && !isClimbing) {
      vy = hasSuperJumpRef.current ? JUMP_FORCE * 1.3 : JUMP_FORCE;
      isGrounded = false;
      sfx.playJump();
    }

    let nextX = x + vx;
    let nextY = y + vy;

    // Bounds check left
    if (nextX < 0) nextX = 0;

    // Check interaction with enemy (Blocker)
    if (!enemyDefeatedRef.current) {
      if (nextX + pw > level.enemyPos.x) {
        nextX = level.enemyPos.x - pw; // Block from moving past enemy
        if (bossHpRef.current > 0) {
          // Boss is active. Help/Hint Heloísa that she needs to hit it first!
          if (keys.current['ArrowRight'] || keys.current['KeyD']) {
            vx = -2.5; // push back slightly
          }
          triggerBossHint();
        } else {
          // Boss shield is broken! Launch Riddle and stop player
          if (!hasTouchedEnemy) {
            playerRef.current.hasTouchedEnemy = true;
            hasTouchedEnemy = true; 
            sfx.playReachEnemy();
            onReachEnemy();
            const nextState = { x: nextX, y: nextY, vx, vy, isGrounded, facingRight, hasTouchedEnemy, currentPlatformIndex, isCollecting, isClimbing, isCrouching };
            playerRef.current = nextState;
            setPlayer(nextState);
            requestRef.current = requestAnimationFrame(update);
            return; 
          }
        }
      }
    } else if (nextX + pw > level.worldWidth) {
      // Reached the end!
      if (!levelCompleteTriggered.current) {
        levelCompleteTriggered.current = true;
        onLevelComplete();
      }
      nextX = level.worldWidth - pw;
    }

    // Prevent clipping into pit walls when below floor
    if (y + ph > level.floorY + 5) {
      for (const pit of level.pits) {
        if (x + pw / 2 >= pit.start && x + pw / 2 <= pit.start + pit.w) {
          if (nextX + 16 < pit.start) {
             nextX = pit.start - 16;
          } else if (nextX + pw - 16 > pit.start + pit.w) {
             nextX = pit.start + pit.w - pw + 16;
          }
          break;
        }
      }
    }

    // Platforms collision (falling onto them)
    // Only collide if we are falling down
    currentPlatformIndex = null;
    if (vy > 0) {
      for (let i = 0; i < level.platforms.length; i++) {
        const p = level.platforms[i];
        if (nextX + pw > p.x && nextX < p.x + p.w) {
          // If previous Y was above platform (or slightly below), and next Y is below platform top
          if (y + ph <= p.y + 35 && nextY + ph >= p.y + 20) {
            nextY = p.y - ph + 24;
            vy = 0;
            isGrounded = true;
            currentPlatformIndex = i;
          }
        }
      }
    }

    // Pit logic (Floor gaps)
    let inPit = false;
    // Check if the horizontally-centered point of player is within a pit
    // A player falls into the pit ONLY if both feet are inside the pit gap
    for (const pit of level.pits) {
      if (nextX + 28 > pit.start && nextX + pw - 28 < pit.start + pit.w) {
        inPit = true;
        break;
      }
    }

    // Spikes collision
    let hitSpike = false;
    for (let i = 0; i < level.spikes.length; i++) {
      if (deadSpikes.current.has(i)) continue;
      const spike = level.spikes[i];
      // relaxed collision box
      if (nextX + pw - 20 > spike.x && nextX + 20 < spike.x + spike.w && 
          nextY + ph > spike.y && nextY + 20 < spike.y + spike.h) {
        if (!isInvincibleRef.current) {
          hitSpike = true;
          fallCauseRef.current = 'espinho';
          break;
        } else {
          deadSpikes.current.add(i);
          sfx.playStomp();
        }
      }
    }

    // Update moving enemies and check collision
    if (!hasTouchedEnemy && !isPausedRef.current) {
      activeEnemies.current.forEach(e => {
        if (e.isDead) return;
        
        if (e.type === 'spider') {
          e.currentY += e.speed * e.dir;
          if (e.currentY > e.y + e.patrolRange) {
            e.currentY = e.y + e.patrolRange;
            e.dir = -1;
          } else if (e.currentY < e.y) {
            e.currentY = e.y;
            e.dir = 1;
          }
        } else {
          e.currentX += e.speed * e.dir;
          if (e.currentX > e.x + e.patrolRange) {
            e.currentX = e.x + e.patrolRange;
            e.dir = -1;
          } else if (e.currentX < e.x) {
            e.currentX = e.x;
            e.dir = 1;
          }
        }
        
        // Player collision with moving enemy
        if (nextX + pw - 20 > e.currentX && nextX + 20 < e.currentX + e.w &&
            nextY + ph > e.currentY && nextY + 20 < e.currentY + e.h) {
          
          if (isInvincibleRef.current) {
               e.isDead = true;
               sfx.playStomp();
          } else {
            // Check if stomping (player is moving down, and bottom of player is above or near the top of enemy)
            // Vertical stomping doesn't work well for vertical enemies
            if (e.type !== 'spider' && vy > 0 && y + ph - 30 <= e.y) {
              e.isDead = true;
              sfx.playStomp(); // Stomp sound
              vy = -18; // Bounce off the enemy
              nextY = e.y - ph; // Snap to top of enemy
              isGrounded = false;
            } else {
              hitSpike = true; // treat as spike hit
              fallCauseRef.current = 'espinho';
            }
          }
        }
      });
    }

    // Collect broccolis
    if (!hasTouchedEnemy && !isPausedRef.current && level.broccolis) {
      level.broccolis.forEach(b => {
        if (!collectedBroccolis.current.has(b.id)) {
          // relaxed collision hit box for broccoli
          if (nextX + pw > b.x && nextX < b.x + b.w &&
              nextY + ph > b.y && nextY < b.y + b.h) {
            collectedBroccolis.current.add(b.id);
            collectingStartTimeRef.current = Date.now();
            onCollectBroccoli();
          }
        }
      });
    }

    // Collect tangerines
    if (!hasTouchedEnemy && !isPausedRef.current && level.tangerines) {
      level.tangerines.forEach(t => {
        if (!collectedTangerines.current.has(t.id)) {
          if (nextX + pw > t.x && nextX < t.x + t.w &&
              nextY + ph > t.y && nextY < t.y + t.h) {
            collectedTangerines.current.add(t.id);
            collectingStartTimeRef.current = Date.now();
            setIsInvincible(true);
            isInvincibleRef.current = true;
            sfx.playInvincibleMusic();
            
            if (invincibilityTimerRef.current) {
              clearTimeout(invincibilityTimerRef.current);
            }
            invincibilityTimerRef.current = window.setTimeout(() => {
              setIsInvincible(false);
              isInvincibleRef.current = false;
              sfx.stopInvincibleMusic();
            }, 10000);
          }
        }
      });
    }

    // Collect apples (super jump)
    if (!hasTouchedEnemy && !isPausedRef.current && level.apples) {
      level.apples.forEach(a => {
        if (!collectedApples.current.has(a.id)) {
          if (nextX + pw > a.x && nextX < a.x + a.w &&
              nextY + ph > a.y && nextY < a.y + a.h) {
            collectedApples.current.add(a.id);
            collectingStartTimeRef.current = Date.now();
            setHasSuperJump(true);
            hasSuperJumpRef.current = true;
            sfx.playPowerup();
            
            if (superJumpTimerRef.current) {
              clearTimeout(superJumpTimerRef.current);
            }
            superJumpTimerRef.current = window.setTimeout(() => {
              setHasSuperJump(false);
              hasSuperJumpRef.current = false;
            }, 10000);
          }
        }
      });
    }

    // Collect bananas (extra speed)
    if (!hasTouchedEnemy && !isPausedRef.current && level.bananas) {
      level.bananas.forEach(b => {
        if (!collectedBananas.current.has(b.id)) {
          if (nextX + pw > b.x && nextX < b.x + b.w &&
              nextY + ph > b.y && nextY < b.y + b.h) {
            collectedBananas.current.add(b.id);
            collectingStartTimeRef.current = Date.now();
            setHasExtraSpeed(true);
            hasExtraSpeedRef.current = true;
            sfx.playPowerup();
            
            if (extraSpeedTimerRef.current) {
              clearTimeout(extraSpeedTimerRef.current);
            }
            extraSpeedTimerRef.current = window.setTimeout(() => {
              setHasExtraSpeed(false);
              hasExtraSpeedRef.current = false;
            }, 10000);
          }
        }
      });
    }

    // Collect level stones from ground
    levelStones.current.forEach(stone => {
      if (!stone.isPickedUp) {
        if (nextX + pw > stone.x && nextX < stone.x + stone.w &&
            nextY + ph > stone.y && nextY < stone.y + stone.h) {
          if (playerStonesCount.current < 5) {
            stone.isPickedUp = true;
            playerStonesCount.current += 1;
            setStonesCount(playerStonesCount.current);
            setStonesList([...levelStones.current]);
            sfx.playCollectBroccoli();
          }
        }
      }
    });

    // Update flying projectiles positions & check for hits on regular enemies
    const updatedProjectiles: typeof thrownProjectiles.current = [];
    thrownProjectiles.current.forEach(proj => {
      proj.x += proj.vx;
      proj.vy += 0.45; // gravity arc
      proj.y += proj.vy;
      proj.rotation = (proj.rotation + (proj.vx > 0 ? 12 : -12)) % 360;
      
      let isDestroyed = false;
      
      // destroy if hitting ground or going out of boundaries
      if (proj.y >= level.floorY + 20 || proj.x < 0 || proj.x > level.worldWidth) {
        isDestroyed = true;
      }
      
      // destroy if hitting standard platform from top
      if (!isDestroyed) {
        for (const plat of level.platforms) {
          if (proj.x + proj.w > plat.x && proj.x < plat.x + plat.w &&
              proj.y + proj.h >= plat.y && proj.y < plat.y + 12) {
            isDestroyed = true;
            break;
          }
        }
      }
      
      // defeat hit regular enemies
      if (!isDestroyed) {
        for (const enemy of activeEnemies.current) {
          if (!enemy.isDead) {
            if (proj.x + proj.w > enemy.currentX && proj.x < enemy.currentX + enemy.w &&
                proj.y + proj.h > enemy.currentY && proj.y < enemy.currentY + enemy.h) {
              enemy.isDead = true;
              isDestroyed = true;
              sfx.playStomp();
              break;
            }
          }
        }
      }
      
      // Check collision with the Level Boss (Chefão)
      if (!isDestroyed && !enemyDefeatedRef.current && bossHpRef.current > 0) {
        const bossX = level.enemyPos.x;
        const bossY = level.enemyPos.y - 40;
        const bossW = level.enemyPos.w;
        const bossH = level.enemyPos.h;

        if (proj.x + proj.w > bossX && proj.x < bossX + bossW &&
            proj.y + proj.h > bossY && proj.y < bossY + bossH) {
          isDestroyed = true;
          
          const nextHp = Math.max(0, bossHpRef.current - 1);
          bossHpRef.current = nextHp;
          setBossHp(nextHp);
          
          setBossHitFlash(true);
          setTimeout(() => setBossHitFlash(false), 200);
          
          sfx.playStomp();
          
          if (nextHp === 0) {
            sfx.playPowerup(); // play reward sound on shield broken!
          }
        }
      }
      
      if (!isDestroyed) {
        updatedProjectiles.push(proj);
      }
    });
    thrownProjectiles.current = updatedProjectiles;
    setProjectilesList([...updatedProjectiles]);

    // Spawning Boss Projectiles (Themed Attacks)
    const isPlayerNearBoss = level.enemyPos && (Math.abs(x - level.enemyPos.x) < 850);
    if (isPlayerNearBoss && bossHpRef.current > 0 && !isPausedRef.current && !playerRef.current.hasTouchedEnemy) {
      if (Date.now() - lastBossShotTime.current > 1900) {
        lastBossShotTime.current = Date.now();
        
        let bossProjEmoji = '🥿';
        if (level.id === 'level1') bossProjEmoji = Math.random() > 0.5 ? '🥿' : '🧦';
        else if (level.id === 'level2') bossProjEmoji = Math.random() > 0.5 ? '🥕' : '🍅';
        else if (level.id === 'level3') bossProjEmoji = Math.random() > 0.5 ? '🖍️' : '🎨';
        else if (level.id === 'level4') bossProjEmoji = Math.random() > 0.5 ? '🤧' : '🧻';
        else if (level.id === 'level5') bossProjEmoji = Math.random() > 0.5 ? '👻' : '👾';

        activeBossProjectiles.current.push({
          id: `bproj-${Date.now()}-${Math.random()}`,
          x: level.enemyPos.x,
          y: level.enemyPos.y - 15,
          vx: -5.0 - Math.random() * 2.5,
          vy: -6.0 - Math.random() * 2.5,
          w: 42,
          h: 42,
          rotation: 0,
          emoji: bossProjEmoji
        });
        sfx.playJump(); // play standard toss key sound
      }
    }

    // Updating active boss projectiles
    const updatedBossProjectiles: any[] = [];
    activeBossProjectiles.current.forEach(bproj => {
      bproj.x += bproj.vx;
      bproj.vy += 0.28; // gravity arc
      bproj.y += bproj.vy;
      bproj.rotation = (bproj.rotation + (bproj.vx > 0 ? 8 : -8)) % 360;

      let isBProjDestroyed = false;

      // Destroy if hitting floor or going out of bounds
      if (bproj.y >= level.floorY + 20 || bproj.x < 0 || bproj.x > level.worldWidth) {
        isBProjDestroyed = true;
      }

      // Check collision with player
      if (!isBProjDestroyed && !isInvincibleRef.current) {
        const pWidth = 64;
        const pHeight = isCrouching ? 38 : 64;
        const pX = x;
        const pY = isCrouching ? y + 26 : y;

        if (bproj.x + bproj.w - 10 > pX && bproj.x + 10 < pX + pWidth &&
            bproj.y + bproj.h - 10 > pY && bproj.y + 10 < pY + pHeight) {
          isBProjDestroyed = true;
          hitSpike = true;
          
          if (level.id === 'level1') {
            fallCauseRef.current = 'crocodilo';
          } else if (level.id === 'level2') {
            fallCauseRef.current = 'leao';
          } else if (level.id === 'level3') {
            fallCauseRef.current = 'onca';
          } else if (level.id === 'level4') {
            fallCauseRef.current = 'dragao';
          } else {
            fallCauseRef.current = 'sombra';
          }
        }
      }

      if (!isBProjDestroyed) {
        updatedBossProjectiles.push(bproj);
      }
    });
    activeBossProjectiles.current = updatedBossProjectiles;
    setBossProjsList([...updatedBossProjectiles]);

    if (hitSpike && !hasTouchedEnemy) {
      playerRef.current.hasTouchedEnemy = true;
      hasTouchedEnemy = true;
      sfx.playHit();
      onFall(fallCauseRef.current);
      const nextState = { x: nextX, y: nextY, vx, vy, isGrounded, facingRight, hasTouchedEnemy, currentPlatformIndex, isCollecting, isClimbing, isCrouching };
      playerRef.current = nextState;
      setPlayer(nextState);
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    if (!inPit && nextY + ph > level.floorY && vy > 0) {
      // Landed on solid ground (only if we were above it!)
      if (y + ph <= level.floorY + 20) {
        nextY = level.floorY - ph;
        vy = 0;
        isGrounded = true;
      }
    } else if (nextY + ph < level.floorY && !isGrounded) {
       // Regular mid-air
       isGrounded = false;
    } else if (inPit && nextY + ph > level.floorY) {
       // Failing into a pit! 
       isGrounded = false;
    }

    if (isGrounded && !playerRef.current.isGrounded) {
      sfx.playLand();
    }

    // Death check
    if (nextY > level.floorY + 250) {
      if (!hasTouchedEnemy) {
        playerRef.current.hasTouchedEnemy = true;
        hasTouchedEnemy = true;
        sfx.playFall();
        onFall('fall');
      }
      nextY = level.floorY + 250; // Clamp so it doesn't fall forever
      vy = 0;
      vx = 0;
      const nextState = { x: nextX, y: nextY, vx, vy, isGrounded, facingRight, hasTouchedEnemy, currentPlatformIndex, isCollecting, isClimbing, isCrouching };
      playerRef.current = nextState;
      setPlayer(nextState);
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    if (currentPlatformIndex !== null && currentPlatformIndex !== lastPlatformIndex.current) {
      bouncingPlatforms.current[currentPlatformIndex] = Date.now();
    }
    lastPlatformIndex.current = currentPlatformIndex;

    const nextStateFinal = { x: nextX, y: nextY, vx, vy, isGrounded, facingRight, hasTouchedEnemy, currentPlatformIndex, isCollecting, isClimbing, isCrouching };
    playerRef.current = nextStateFinal;
    setPlayer(nextStateFinal);
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    // Reset trigger when level mounts
    levelCompleteTriggered.current = false;
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [level]); 

  // Reset player when changing levels
  useEffect(() => {
    setPlayer(p => {
      const next = {
        ...p,
        x: 100,
        y: level.floorY - 64,
        vx: 0,
        vy: 0,
        isGrounded: true,
        hasTouchedEnemy: false,
        facingRight: true,
        isClimbing: false,
        isCrouching: false
      };
      playerRef.current = next;
      return next;
    });
  }, [level.id]);

  useEffect(() => {
    if (isResetting) {
      // Re-activate stones in level and clean flying projectiles
      levelStones.current.forEach(s => s.isPickedUp = false);
      setStonesList([...levelStones.current]);
      
      thrownProjectiles.current = [];
      setProjectilesList([]);
      
      // Assure at least 3 stones are refilled on death retry
      playerStonesCount.current = Math.max(playerStonesCount.current, 3);
      setStonesCount(playerStonesCount.current);

      setPlayer(p => {
        let safeX = Math.max(100, p.x - 300); // Start looking for a safe spot behind death position
        
        const isSafe = (testLeft: number) => {
          const margin = 30; // Extra space so we don't spawn exactly on an edge
          const paddingLeft = testLeft - margin;
          const paddingRight = testLeft + 64 + margin;

          // Check if it overlaps any pit
          for (const pit of level.pits) {
            if (paddingRight > pit.start && paddingLeft < pit.start + pit.w) {
              return false;
            }
          }
          // Check if it overlaps any spike
          for (const spike of level.spikes) {
            if (paddingRight > spike.x && paddingLeft < spike.x + spike.w) {
              return false;
            }
          }
          return true;
        };

        // Move backwards until we find a safe spot on the ground
        while (safeX > 100 && !isSafe(safeX)) {
          safeX -= 10;
        }
        if (safeX < 100) safeX = 100;

        const next = {
          ...p,
          hasTouchedEnemy: false,
          y: level.floorY - 64, // Span directly on floor safely
          isGrounded: true,
          vy: 0,
          vx: 0,
          x: safeX,
          isClimbing: false,
          isCrouching: false
        };
        playerRef.current = next;
        return next;
      });
    }
  }, [isResetting, level]);

  useEffect(() => {
    if (enemyDefeated) {
      setPlayer(p => {
        const next = { ...p, hasTouchedEnemy: true };
        playerRef.current = next;
        return next;
      }); 
    }
  }, [enemyDefeated]);


  const cameraX = Math.max(0, Math.min(player.x - containerW / 2 + 32, level.worldWidth - containerW));

  // Compute solid floor segments by subtracting pits
  const floorSegments = [];
  let currentX = 0;
  for (const pit of level.pits) {
    if (pit.start > currentX) {
      floorSegments.push({ x: currentX, w: pit.start - currentX });
    }
    currentX = pit.start + pit.w;
  }
  if (currentX < level.worldWidth + 1000) { 
    floorSegments.push({ x: currentX, w: level.worldWidth + 1000 - currentX });
  }

  let playerVisualY = player.y;
  if (player.currentPlatformIndex !== null) {
    const bTime = bouncingPlatforms.current[player.currentPlatformIndex];
    if (bTime) {
      const pTime = (Date.now() - bTime) / 300;
      if (pTime < 1) {
        playerVisualY += Math.sin(pTime * Math.PI) * 12;
      }
    }
  }

  const staticScenery = useMemo(() => {
    return (
      <>
        {/* Nuvens estilo Cartoon */}
        {Array.from({ length: Math.ceil(level.worldWidth / 600) }).map((_, i) => (
          <div 
            key={`cloud-${i}`} 
            className={`absolute opacity-80 ${['text-6xl', 'text-8xl', 'text-7xl', 'text-9xl'][i % 4]}`} 
            style={{ 
              top: `${20 + (i * 37) % 100}px`, 
              left: `${i * 600 + (i % 2 === 0 ? 0 : 200)}px`, 
              filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.2))' 
            }}
          >
            ☁️
          </div>
        ))}
        
        {/* Floor Segments replacing continuous floor */}
        {floorSegments.map((seg, i) => (
          <div 
             key={`floor-${i}`}
             className={`absolute bottom-0 h-full ${level.groundColor} border-t-[8px] border-black`}
             style={{ left: seg.x, width: seg.w, top: level.floorY }}
          >
             {/* Inner top grass decoration */}
             <div className="w-full h-8 bg-lime-400 border-b-[8px] border-black" />
          </div>
        ))}

        {/* Puddles (Poças d'água) */}
        {level.puddles?.map((pud) => (
          <div 
            key={pud.id}
            className="absolute rounded-[100%] bg-blue-500 opacity-70 border-[4px] border-blue-700 blur-[1px]"
            style={{ 
              left: pud.x, 
              top: pud.y, 
              width: pud.w, 
              height: pud.h,
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
            }}
          />
        ))}
      </>
    );
  }, [level.worldWidth, level.floorY, level.groundColor, level.puddles]);

  return (
    <div ref={containerRef} tabIndex={0} className={`absolute inset-0 bg-linear-to-b ${level.colorPrimary} ${level.colorSecondary} overflow-hidden outline-none`}>
      
        <div 
           className="relative h-full"
           style={{
             transform: `translateX(${-cameraX}px)`,
             width: `${level.worldWidth}px`
           }}
        >
          {staticScenery}
          
          {enemyDefeated && (
             <div 
               className="absolute flex flex-col items-center" 
               style={{ left: level.worldWidth - 150, top: level.floorY - 180 }}
             >
               <div className="text-8xl drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-bounce">➡️</div>
               <div className="text-2xl font-black text-white bg-slate-800 rounded-xl px-4 py-2 mt-4 border-[4px] border-black shadow-[6px_6px_0px_#000] -rotate-2">SAÍDA</div>
             </div>
          )}

          {/* Platforms (Vitória-Régia) */}
          {level.platforms.map((p, i) => {
            let bounceY = 0;
            let bounceScale = 1;
            const bTime = bouncingPlatforms.current[i];
            if (bTime) {
               const pTime = (Date.now() - bTime) / 300;
               if (pTime < 1) {
                  bounceY = Math.sin(pTime * Math.PI) * 12;
                  bounceScale = 1 - Math.sin(pTime * Math.PI) * 0.15;
               }
            }
            const rotation = i % 2 === 0 ? '-2deg' : '2deg';
            return (
              <div 
                key={i} 
                className="absolute bg-green-500 border-[6px] border-green-800 rounded-[50%] shadow-[6px_6px_0px_rgba(0,0,0,0.5)] overflow-hidden"
                style={{ 
                  left: p.x, top: p.y, width: p.w, height: p.h, 
                  transform: `translateY(${bounceY}px) scaleY(${bounceScale}) rotate(${rotation})` 
                }}
              >
                <div className="absolute right-0 top-0 w-1/4 h-full bg-[#38bdf8]" style={{ borderRadius: '40% 0 0 40%', transform: 'translate(50%, 0)' }}></div>
                <div className="absolute left-1/4 top-1/4 w-1/2 h-1/2 rounded-full border-2 border-green-700 opacity-50"></div>
              </div>
            );
          })}



          {/* Ladders */}
          {level.ladders?.map((l, i) => (
            <div 
              key={`ladder-${i}`}
              className="absolute flex flex-col justify-between overflow-hidden pointer-events-none"
              style={{ left: l.x, top: l.y, width: l.w, height: l.h, zIndex: 10 }}
            >
              <div className="absolute inset-y-0 left-2 w-1.5 bg-orange-950/40 rounded-full"></div>
              <div className="absolute inset-y-0 right-2 w-1.5 bg-orange-950/40 rounded-full"></div>
              {Array.from({ length: Math.ceil(l.h / 30) }).map((_, j) => (
                <div key={j} className="h-[6px] w-full bg-orange-900 border-b-2 border-orange-950 shadow-[0_2px_0_rgba(0,0,0,0.3)]"></div>
              ))}
            </div>
          ))}

          {/* Spikes */}
          {level.spikes.map((s, i) => {
            if (deadSpikes.current.has(i)) return null;
            const hazardEmoji = level.scenery === 'lake' ? '🐸' : level.scenery === 'savanna' ? '🌵' : level.scenery === 'jungle' ? '🐍' : '🦇';
            const isSavanna = level.scenery === 'savanna';
            return (
            <div 
              key={`spike-${i}`}
              className="absolute flex items-end justify-center drop-shadow-[4px_4px_0_#000] overflow-hidden"
              style={{ left: s.x, top: s.y, width: s.w, height: s.h }}
            >
              <div 
                className="text-[40px] leading-none whitespace-nowrap tracking-tighter animate-bounce" 
                style={{ 
                  animationDuration: '2s', 
                  animationDelay: `${i * 0.2}s`,
                  filter: isSavanna ? 'saturate(2.5) brightness(0.5) hue-rotate(5deg)' : undefined
                }}
              >
                {Array.from({ length: Math.max(1, Math.ceil(s.w / 40)) }).map((_, j) => hazardEmoji).join('')}
              </div>
            </div>
            );
          })}

          {/* Broccolis */}
          {level.broccolis?.map((b, i) => {
            if (collectedBroccolis.current.has(b.id)) return null;
            return (
              <div 
                key={`broccoli-${b.id}`}
                className="absolute flex items-center justify-center drop-shadow-[4px_4px_0_#000]"
                style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
              >
                <div className="text-[36px] animate-pulse">🥦</div>
              </div>
            );
          })}

          {/* Tangerines */}
          {level.tangerines?.map((t, i) => {
            if (collectedTangerines.current.has(t.id)) return null;
            return (
              <div 
                key={`tangerine-${t.id}`}
                className="absolute flex items-center justify-center drop-shadow-[4px_4px_0_#000]"
                style={{ left: t.x, top: t.y, width: t.w, height: t.h }}
              >
                <div className="text-[40px] animate-bounce" style={{ animationDuration: '0.6s' }}>🍊</div>
              </div>
            );
          })}

          {/* Apples (Super Jump) */}
          {level.apples?.map((a, i) => {
            if (collectedApples.current.has(a.id)) return null;
            return (
              <div 
                key={`apple-${a.id}`}
                className="absolute flex items-center justify-center drop-shadow-[4px_4px_0_#000]"
                style={{ left: a.x, top: a.y, width: a.w, height: a.h }}
              >
                <div className="text-[40px] animate-bounce" style={{ animationDuration: '0.5s' }}>🍎</div>
              </div>
            );
          })}

          {/* Bananas (Extra Speed) */}
          {level.bananas?.map((b, i) => {
            if (collectedBananas.current.has(b.id)) return null;
            return (
              <div 
                key={`banana-${b.id}`}
                className="absolute flex items-center justify-center drop-shadow-[4px_4px_0_#000]"
                style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
              >
                <div className="text-[40px] animate-bounce" style={{ animationDuration: '0.4s' }}>🍌</div>
              </div>
            );
          })}

          {/* Moving Enemies */}
          {activeEnemies.current.map((e, i) => {
            if (e.isDead) return null;
            const enemyEmoji = e.type === 'crab' ? '🦀' : e.type === 'hyena' ? '🐺' : e.type === 'snake' ? '🐍' : e.type === 'spider' ? '🕷️' : '🦇';
            return (
              <div 
                key={`enemy-${e.id}`}
                className="absolute flex items-center justify-center drop-shadow-[6px_6px_0_#000]"
                style={{ 
                  left: e.currentX, 
                  top: e.currentY, 
                  width: e.w, 
                  height: e.h,
                  transform: e.type === 'spider' ? undefined : `scaleX(${e.dir === -1 ? -1 : 1})`,
                  zIndex: 20
                }}
              >
                <div className={`text-[48px] ${e.type === 'spider' ? 'animate-pulse' : 'animate-bounce'}`} style={{ animationDuration: '0.8s' }}>{enemyEmoji}</div>
              </div>
            );
          })}

          {/* Level Stones to Collect */}
          {stonesList.map((stone) => {
            if (stone.isPickedUp) return null;
            return (
              <div 
                key={stone.id}
                className="absolute flex items-center justify-center text-2xl select-none filter drop-shadow-[2px_2px_0_#000] animate-bounce"
                style={{ 
                  left: stone.x, 
                  top: stone.y, 
                  width: stone.w, 
                  height: stone.h,
                  animationDuration: '1.5s',
                  zIndex: 20
                }}
              >
                🪨
              </div>
            );
          })}

          {/* Flying Projectiles thrown by the Capybara */}
          {projectilesList.map((p) => (
            <div 
              key={p.id}
              className="absolute flex items-center justify-center text-3xl select-none filter drop-shadow-[3px_3px_0_#000] pointer-events-none"
              style={{ 
                left: p.x, 
                top: p.y, 
                width: p.w, 
                height: p.h,
                transform: `rotate(${p.rotation}deg)`,
                zIndex: 40
              }}
            >
              🪨
            </div>
          ))}

          {/* Flying Projectiles thrown by the Boss (Chefão) */}
          {bossProjsList.map((bp) => (
            <div 
              key={bp.id}
              className="absolute flex items-center justify-center text-4xl select-none filter drop-shadow-[4px_4px_0_#000] pointer-events-none animate-pulse"
              style={{ 
                left: bp.x, 
                top: bp.y, 
                width: bp.w, 
                height: bp.h,
                transform: `rotate(${bp.rotation}deg)`,
                zIndex: 45
              }}
            >
              {bp.emoji}
            </div>
          ))}

          {/* Enemy */}
          {!enemyDefeated && (
            <div 
              className={`absolute text-[120px] leading-none flex items-center justify-center drop-shadow-[6px_6px_0px_#000] ${
                bossHp === 0 ? 'animate-spin' : 'animate-bounce'
              }`}
              style={{ 
                left: level.enemyPos.x, 
                top: level.enemyPos.y - 40, // Adjust a bit for visual
                width: level.enemyPos.w, 
                height: level.enemyPos.h,
                filter: bossHitFlash ? 'brightness(1.55) sepia(1) hue-rotate(-60deg) saturate(6)' : 'none',
                transition: 'filter 0.08s ease',
                animationDuration: bossHp === 0 ? '8s' : '2s'
              }}
            >
              {level.enemyImage}
              
              {/* Magic shield around active boss */}
              {bossHp > 0 && (
                <div 
                  className="absolute inset-0 rounded-full border-[8px] border-cyan-400 bg-cyan-300/20 animate-pulse pointer-events-none scale-125 select-none"
                  style={{
                    boxShadow: '0 0 25px rgba(34,211,238,0.5), inset 0 0 25px rgba(34,211,238,0.5)',
                    filter: 'hue-rotate(15deg)'
                  }}
                />
              )}

              {/* Status accessory above Boss */}
              {bossHp === 0 ? (
                <div className="absolute -top-16 text-6xl rotate-12 bg-white rounded-full h-20 w-20 flex items-center justify-center border-[4px] border-black shadow-[4px_4px_0_#000] animate-spin z-50" style={{ animationDuration: '4s' }}>😵‍💫</div>
              ) : (
                <div className="absolute -top-16 text-6xl animate-pulse -rotate-12 bg-white rounded-full h-20 w-20 flex items-center justify-center border-[4px] border-black shadow-[4px_4px_0_#000]">❓</div>
              )}
              
              {/* Scenery Boss Health Bar - Attached directly to Boss in game world */}
              {bossHp > 0 && (
                <div className="absolute -top-30 left-1/2 transform -translate-x-1/2 bg-black/90 px-3.5 py-1.5 rounded-2xl border-[3px] border-amber-400 shadow-[4px_4px_0_#000] flex flex-col items-center gap-1 z-50 whitespace-nowrap pointer-events-none select-none">
                  <div className="flex items-center justify-between w-full gap-2 text-[11px] font-black text-amber-300 uppercase tracking-wider leading-none">
                    <span>🛡️ {level.enemyName}</span>
                    <span className="text-white/90 text-[10px]">{bossHp}/3 HP</span>
                  </div>
                  <div className="flex gap-1 items-center justify-center">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-xl filter drop-shadow-[2px_2px_0_#000] transition-transform duration-200 ${
                          i < bossHp ? (bossHp === 1 ? 'scale-110 animate-pulse' : 'scale-100') : 'opacity-25 grayscale scale-90'
                        }`}
                      >
                        ❤️
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hint Bubble instructing to throw stones */}
              {showBossHint && bossHp > 0 && (
                <div className="absolute -top-46 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-black text-xs font-black px-3.5 py-1.5 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] whitespace-nowrap animate-bounce z-50 text-center leading-tight">
                  ME ACERTE COM PEDRAS!<br/>
                  <span className="text-[10px] text-gray-700 font-bold">(Teclas X, C ou F) 🪨</span>
                </div>
              )}

              {/* Victory prompt advising player to approach and trigger Riddle */}
              {bossHp === 0 && (
                <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 bg-green-400 text-black text-xs font-black px-4 py-2 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] whitespace-nowrap animate-bounce z-50 text-center leading-tight">
                  UAU! ME VENCEU! 👏<br/>
                  <span className="text-[10px] text-zinc-800 font-bold">Toque em mim para conversar! 💞</span>
                </div>
              )}
            </div>
          )}

          {enemyDefeated && (
            <div 
            className="absolute text-[120px] leading-none flex items-center justify-center opacity-70 drop-shadow-[6px_6px_0px_#000]"
            style={{ 
              left: level.enemyPos.x + 100, 
              top: level.enemyPos.y - 40, 
              width: level.enemyPos.w, 
              height: level.enemyPos.h,
              transform: 'scaleX(-1)' // facing away
            }}
          >
            {level.enemyImage}
            <div className="absolute -top-16 text-6xl -rotate-12 bg-white rounded-full h-20 w-20 flex items-center justify-center border-[4px] border-black shadow-[4px_4px_0_#000]">💤</div>
          </div>
          )}

          {/* Player */}
          <div 
             className={`absolute flex items-center justify-center transition-transform duration-75 
             ${isInvincible ? 'drop-shadow-[0_0_20px_rgba(255,165,0,1)]' : ''} 
             ${hasSuperJump ? 'drop-shadow-[0_0_20px_rgba(255,0,0,1)]' : ''} 
             ${hasExtraSpeed ? 'drop-shadow-[0_0_20px_rgba(255,255,0,1)]' : ''}`}
             style={{ 
               left: player.x, 
               top: playerVisualY, 
               width: 64, 
               height: 64,
               transform: `scaleX(${player.facingRight ? 1 : -1})`
             }}
          >
             <div className={(isInvincible || hasSuperJump || hasExtraSpeed) ? 'animate-pulse' : ''}>
                <Capybara 
                  size={84} 
                  state={
                    player.hasTouchedEnemy ? 'attacking' : 
                    player.isCollecting ? 'collecting' : 
                    player.isClimbing ? 'climbing' : 
                    player.isCrouching ? 'crouching' : 
                    (!player.isGrounded ? 'jumping' : 
                    (Math.abs(player.vx) > 0 ? 'running' : 'idle'))
                  } 
                />
             </div>
          </div>
        </div>

      {/* Atmospheric Weather Particle System */}
      <WeatherSystem
        weatherType={weatherType}
        quality={weatherQuality}
        cameraX={cameraX}
        floorY={level.floorY}
        isPaused={isPaused}
      />

      {/* Top UI Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-[70] pointer-events-none">
        {/* Left: Controls */}
        <div className="flex gap-3 pointer-events-auto">
          <button 
            onClick={onBackToMenu}
            className="bg-white p-3 rounded-2xl border-[4px] border-black shadow-[4px_4px_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_#000] transition-all cursor-pointer"
            title="Voltar ao Início"
          >
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={onTogglePause}
            className="bg-yellow-400 p-3 rounded-2xl border-[4px] border-black shadow-[4px_4px_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_#000] transition-all cursor-pointer"
            title={isPaused ? "Retomar" : "Pausar"}
          >
            {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
          </button>
        </div>

        {/* Center: Timers */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="bg-white/90 px-4 py-2 rounded-2xl font-black text-xl text-slate-800 border-[4px] border-black shadow-[4px_4px_0_#000] flex gap-2 items-center rotate-1">
            <Timer className="w-5 h-5" />
            <span>Fase: {(levelTime / 1000).toFixed(1)}s</span>
          </div>
          <div className="bg-sky-100/90 px-3 py-1 rounded-xl font-black text-sm text-sky-800 border-[2px] border-black shadow-[2px_2px_0_#000] flex gap-2 items-center -rotate-1">
            <Timer className="w-4 h-4" />
            <span>Total: {(gameTime / 1000).toFixed(1)}s</span>
          </div>
        </div>

        {/* Right: Health and Items */}
        <div className="flex flex-col items-end gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl font-black text-xl text-red-500 border-[4px] border-black shadow-[4px_4px_0_#000] rotate-1 w-fit flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
               <span key={i} className={i < lives ? 'opacity-100' : 'opacity-30 grayscale'}>❤️</span>
            ))}
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl font-black text-2xl text-slate-800 border-[4px] border-black shadow-[4px_4px_0_#000] -rotate-2 w-fit flex gap-2 items-center text-nowrap">
             <span>🥦</span>
             <span>{totalBroccolis}</span>
          </div>
          <div className="bg-amber-100 px-4 py-2 rounded-2xl font-black text-2xl text-amber-900 border-[4px] border-black shadow-[4px_4px_0_#000] rotate-1 w-fit flex gap-2 items-center text-nowrap">
             <span>🪨</span>
             <span>{stonesCount} / 5</span>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {showPauseOverlay && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[60] flex items-center justify-center pointer-events-auto">
           <motion.div 
             initial={{ scale: 0 }} 
             animate={{ scale: 1 }}
             className="bg-white border-[8px] border-black p-8 rounded-[40px] shadow-[15px_15px_0_#000] flex flex-col items-center gap-5 max-w-[440px] w-full"
           >
              <h3 className="text-5xl font-black uppercase italic" style={{ WebkitTextStroke: '2px black', color: '#fbbf24' }}>Pausado</h3>
              
              {/* Weather Quality Settings Box */}
              <div className="w-full bg-slate-100 border-[4px] border-black rounded-2xl p-4 flex flex-col gap-2.5 shadow-[4px_4px_0_#000]">
                <div className="flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span className="text-base">{weatherLabels[weatherType]?.emoji || '🌤️'}</span>
                    <span>{weatherLabels[weatherType]?.name || 'Clima Atual'}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold">Efeitos</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSetWeatherQuality('high')}
                    className={`py-2 px-2.5 rounded-xl border-[3px] border-black font-black text-xs transition-transform flex items-center justify-center gap-1 shadow-[3px_3px_0_#000] ${
                      weatherQuality === 'high'
                        ? 'bg-amber-400 text-black scale-102 ring-2 ring-amber-500'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>✨</span> ALTO
                  </button>
                  <button
                    onClick={() => handleSetWeatherQuality('low')}
                    className={`py-2 px-2.5 rounded-xl border-[3px] border-black font-black text-xs transition-transform flex items-center justify-center gap-1 shadow-[3px_3px_0_#000] ${
                      weatherQuality === 'low'
                        ? 'bg-amber-400 text-black scale-102 ring-2 ring-amber-500'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🍃</span> BAIXO
                  </button>
                  <button
                    onClick={() => handleSetWeatherQuality('off')}
                    className={`py-2 px-2.5 rounded-xl border-[3px] border-black font-black text-xs transition-transform flex items-center justify-center gap-1 shadow-[3px_3px_0_#000] ${
                      weatherQuality === 'off'
                        ? 'bg-rose-400 text-black scale-102 ring-2 ring-rose-500'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>❌</span> DESL.
                  </button>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={onTogglePause}
                  className="w-full bg-green-400 border-[6px] border-black py-3.5 rounded-2xl text-2xl font-black shadow-[6px_6px_0_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform flex items-center justify-center gap-3"
                >
                  <Play className="w-8 h-8 fill-current" /> CONTINUAR
                </button>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}
