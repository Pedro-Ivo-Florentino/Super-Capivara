import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import StartScreen from './components/StartScreen';
import Platformer from './components/Platformer';
import RiddleModal from './components/RiddleModal';
import FunnySituation from './components/FunnySituation';
import VictoryScreen from './components/VictoryScreen';
import LevelTransition from './components/LevelTransition';
import levels from './data/levels';
import { Riddle } from './data/levels';
import { allRiddlesMap } from './data/riddles';
import { sfx } from './lib/sounds';

export type GameState = 'START' | 'PLAYING' | 'RIDDLE' | 'FUNNY' | 'VICTORY' | 'LEVEL_TRANSITION' | 'GET_NAME';

export interface GameRecord {
  name: string;
  time: number;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [funnySituationId, setFunnySituationId] = useState('');
  const [isEnemyDefeated, setIsEnemyDefeated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [askedRiddles, setAskedRiddles] = useState<Record<string, number[]>>({});
  const [currentRiddle, setCurrentRiddle] = useState<Riddle | null>(null);
  const [lives, setLives] = useState(5);
  const [totalBroccolis, setTotalBroccolis] = useState(0);
  const [restartLevelCount, setRestartLevelCount] = useState(0);
  const [portalReturnIndex, setPortalReturnIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Timer states
  const [levelTime, setLevelTime] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [lastTick, setLastTick] = useState(0);
  const [records, setRecords] = useState<Record<string, GameRecord>>( {});
  const [pendingRecordId, setPendingRecordId] = useState<string | null>(null);
  const [pendingRecordTime, setPendingRecordTime] = useState(0);

  useEffect(() => {
    // Load progress and records
    const saved = localStorage.getItem('capybara_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        let loadedLevelIndex = data.level || 0;
        // Self-healing: if loaded progress starts on a secret level, reset it to level 1 (index 0)
        if (levels[loadedLevelIndex] && levels[loadedLevelIndex].id.startsWith("secret_")) {
          loadedLevelIndex = 0;
        }
        setCurrentLevelIndex(loadedLevelIndex);
        setTotalBroccolis(data.broccolis || 0);
        setLives(data.lives || 5);
        setGameTime(data.gameTime || 0);
      } catch (e) {
        console.error('Failed to load progress', e);
      }
    }
    const savedRecords = localStorage.getItem('capybara_records');
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        console.error('Failed to load records', e);
      }
    }
    setGameState('START');
  }, []);

  const saveProgress = async (newLevel: number, newBroccolis: number, newLives: number, newGameTime: number) => {
    let levelToSave = newLevel;
    // If saving in a secret level, save the return portal level or fallback to 0
    if (levels[newLevel] && levels[newLevel].id.startsWith("secret_")) {
      levelToSave = portalReturnIndex !== null ? portalReturnIndex : 0;
    }
    const data = { level: levelToSave, broccolis: newBroccolis, lives: newLives, gameTime: newGameTime };
    localStorage.setItem('capybara_progress', JSON.stringify(data));
  };

  const saveRecord = (id: string, name: string, time: number) => {
    const newRecords = { ...records, [id]: { name, time } };
    setRecords(newRecords);
    localStorage.setItem('capybara_records', JSON.stringify(newRecords));
  };

  useEffect(() => {
    let interval: any;
    if (gameState === 'PLAYING' && !isPaused) {
      if (lastTick === 0) setLastTick(Date.now());
      interval = setInterval(() => {
        const now = Date.now();
        const delta = now - lastTick;
        if (delta > 0 && delta < 1000) { // drift protection
          setLevelTime(prev => prev + delta);
          setGameTime(prev => prev + delta);
        }
        setLastTick(now);
      }, 100);
    } else {
      setLastTick(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameState, isPaused, lastTick]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const scaleW = width / 1000;
        const scaleH = height / 562;
        setScale(Math.min(scaleW, scaleH));
        
        // Regain focus after resizing/maximizing so keyboard still works 
        // without needing an extra click.
        window.focus();
        if (containerRef.current) containerRef.current.focus();
        if (document.activeElement instanceof HTMLElement && document.activeElement !== containerRef.current) {
          document.activeElement.blur(); // Blur any focused buttons so arrow keys don't trigger them
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  const handleEnterPortal = (targetLevelId: string) => {
    sfx.playPowerup(); 
    if (targetLevelId === 'return') {
      if (portalReturnIndex !== null) {
        setCurrentLevelIndex(portalReturnIndex);
        setPortalReturnIndex(null);
        setGameState('PLAYING');
      }
    } else {
      const targetIndex = levels.findIndex(l => l.id === targetLevelId);
      if (targetIndex !== -1) {
        setPortalReturnIndex(currentLevelIndex);
        setCurrentLevelIndex(targetIndex);
        setGameState('PLAYING');
      }
    }
  };

  const currentLevel = levels[currentLevelIndex];

  const handleStart = () => {
    sfx.init();
    sfx.playJump();
    setIsEnemyDefeated(false);
    setIsPaused(false);
    setLevelTime(0);
    setGameState('PLAYING');
    setTimeout(() => {
      window.focus();
    }, 100);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleBackToMenu = () => {
    saveProgress(currentLevelIndex, totalBroccolis, lives, gameTime);
    setGameState('START');
  };

  const checkRecord = (id: string, time: number) => {
    const existing = records[id];
    if (!existing || time < existing.time) {
      setPendingRecordId(id);
      setPendingRecordTime(time);
      setGameState('GET_NAME');
      return true;
    }
    return false;
  };

  const handleNameSubmit = (name: string) => {
    if (pendingRecordId) {
      saveRecord(pendingRecordId, name, pendingRecordTime);
      setPendingRecordId(null);
      
      if (pendingRecordId === 'TOTAL') {
        setGameState('VICTORY');
      } else {
        proceedToNextLevel();
      }
    }
  };

  const proceedToNextLevel = () => {
    if (currentLevelIndex + 1 < levels.length - 1) {
      const nextIndex = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIndex);
      setIsEnemyDefeated(false);
      setLevelTime(0);
      saveProgress(nextIndex, totalBroccolis, lives, gameTime);
      setGameState('PLAYING');
    } else {
      const isTotalRecord = checkRecord('TOTAL', gameTime);
      if (!isTotalRecord) {
        setGameState('VICTORY');
      }
    }
  };

  const handleCollectBroccoli = () => {
    sfx.playCollectBroccoli();
    setTotalBroccolis(prev => {
      const next = prev + 1;
      if (next > 0 && next % 50 === 0) {
        setLives(l => l + 1);
        sfx.playCorrect(); // 1-up sound
      }
      return next;
    });
  };

  const handleReachEnemy = () => {
    const enemyId = currentLevel.enemyId;
    const allReds = allRiddlesMap[enemyId] || [currentLevel.riddle];
    const askedIndexes = askedRiddles[enemyId] || [];

    let availableIndexes = allReds.map((_, i) => i).filter(i => !askedIndexes.includes(i));
    
    if (availableIndexes.length === 0) {
      availableIndexes = allReds.map((_, i) => i);
      setAskedRiddles(prev => ({ ...prev, [enemyId]: [] })); 
    }

    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    
    setAskedRiddles(prev => ({
      ...prev,
      [enemyId]: [...(prev[enemyId] || []), randomIndex]
    }));

    setCurrentRiddle(allReds[randomIndex]);
    setGameState('RIDDLE');
  };

  const handleLevelComplete = () => {
    if (portalReturnIndex !== null) {
      setCurrentLevelIndex(portalReturnIndex);
      setPortalReturnIndex(null);
      setIsEnemyDefeated(false);
      setTimeout(() => setGameState('PLAYING'), 100);
      return;
    }

    if (currentLevel.id.startsWith("secret_")) {
      setCurrentLevelIndex(0); // Safely return back to Level 1
      setPortalReturnIndex(null);
      setIsEnemyDefeated(false);
      setTimeout(() => setGameState('PLAYING'), 100);
      return;
    }

    const isRecord = checkRecord(currentLevel.id, levelTime);
    if (!isRecord) {
      proceedToNextLevel();
    }
  };

  const handleFall = (cause = 'fall') => {
    // Platformer handles the fall SFX
    setLives(prev => {
      const next = prev - 1;
      saveProgress(currentLevelIndex, totalBroccolis, next, gameTime);
      return next;
    });
    setFunnySituationId(cause);
    setGameState('FUNNY');
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      sfx.playCorrect();
      setFunnySituationId('');
      setIsEnemyDefeated(true);
      // Automatically end the level successfully when riddle is answered!
      setGameState('LEVEL_TRANSITION');
    } else {
      sfx.playWrong();
      setLives(prev => prev - 1);
      setFunnySituationId(currentLevel.enemyId);
      setGameState('FUNNY');
    }
  };

  const handleFunnyDone = () => {
    if (lives <= 0) {
      setLives(5);
      setGameTime(0); // Reset game time on game over? Or keep it? Usually reset.
      saveProgress(currentLevelIndex, totalBroccolis, 5, 0);
      setRestartLevelCount(c => c + 1);
      setLevelTime(0);
      setGameState('PLAYING');
    } else {
      setGameState('PLAYING');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#38bdf8] p-2 lg:p-6 font-sans overflow-hidden pattern-dots">
      
      {/* Outer flexible container that measures available space */}
      <div ref={containerRef} tabIndex={0} autoFocus className="w-full h-full relative focus:outline-none">
        {/* Inner container scales perfectly to fit the outer container */}
        <div 
          className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden absolute border-[4px] lg:border-[8px] border-black shadow-[8px_8px_0px_#000] lg:shadow-[16px_16px_0px_rgba(0,0,0,1)] flex flex-col"
          style={{ 
            width: 1000,
            height: 562,
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {gameState === 'START' && (
          <StartScreen onStart={handleStart} records={records} onResetProgress={() => {
            localStorage.removeItem('capybara_progress');
            window.location.reload();
          }} />
        )}

        {(gameState === 'PLAYING' || gameState === 'RIDDLE' || gameState === 'FUNNY' || gameState === 'LEVEL_TRANSITION' || gameState === 'GET_NAME') && (
          <Platformer 
            key={`level-${currentLevel.id}-${restartLevelCount}`}
            level={currentLevel} 
            lives={lives}
            totalBroccolis={totalBroccolis}
            isPaused={gameState !== 'PLAYING' || isPaused}
            showPauseOverlay={isPaused}
            levelTime={levelTime}
            gameTime={gameTime}
            onReachEnemy={handleReachEnemy}
            onLevelComplete={handleLevelComplete}
            onFall={handleFall}
            onCollectBroccoli={handleCollectBroccoli}
            onEnterPortal={handleEnterPortal}
            onTogglePause={handlePauseToggle}
            onBackToMenu={handleBackToMenu}
            enemyDefeated={isEnemyDefeated} 
            resolveEncounter={gameState === 'PLAYING'}
            isResetting={gameState === 'FUNNY'}
          />
        )}

        {gameState === 'RIDDLE' && currentRiddle && (
          <RiddleModal 
            riddle={currentRiddle} 
            enemyName={currentLevel.enemyName}
            enemyImage={currentLevel.enemyImage}
            onSubmit={handleAnswerSubmit} 
          />
        )}

        {gameState === 'FUNNY' && (
          <FunnySituation 
            enemyId={funnySituationId} 
            onDone={handleFunnyDone} 
            isGameOver={lives <= 0}
          />
        )}

        {gameState === 'LEVEL_TRANSITION' && (
          <LevelTransition 
            levelName={currentLevel.name}
            onNext={handleLevelComplete}
          />
        )}

        {gameState === 'VICTORY' && (
          <VictoryScreen onRestart={() => {
            setGameTime(0);
            setCurrentLevelIndex(0);
            saveProgress(0, totalBroccolis, 5, 0);
            handleStart();
          }} gameTime={gameTime} />
        )}

        {gameState === 'GET_NAME' && (
          <div className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="bg-yellow-400 border-[8px] border-black p-8 rounded-3xl shadow-[12px_12px_0_#000] text-center max-w-md w-full"
             >
                <h2 className="text-5xl font-black mb-4 uppercase italic" style={{ WebkitTextStroke: '2px black' }}>Novo Recorde!</h2>
                <p className="text-2xl font-bold mb-6">Você completou em {(pendingRecordTime / 1000).toFixed(2)}s!</p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
                  handleNameSubmit(name || 'Anônimo');
                }}>
                  <input 
                    name="name"
                    autoFocus
                    placeholder="Seu nome..." 
                    className="w-full bg-white border-[4px] border-black p-4 text-2xl font-black mb-6 rounded-xl outline-none focus:ring-4 ring-sky-400"
                  />
                  <button className="bg-white border-[4px] border-black px-8 py-3 text-3xl font-black rounded-2xl shadow-[6px_6px_0_#000] hover:-translate-y-1 active:translate-y-1 transition-transform">
                    SALVAR
                  </button>
                </form>
             </motion.div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
