import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Capybara from './Capybara';

interface FunnySituationProps {
  enemyId: string;
  onDone: () => void;
  isGameOver?: boolean;
}

export default function FunnySituation({ enemyId, onDone, isGameOver = false }: FunnySituationProps) {
  const doneRef = useRef(false);

  const handleDone = () => {
    if (!doneRef.current) {
      doneRef.current = true;
      onDone();
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      handleDone();
    }, isGameOver ? 6000 : 4500); // Wait longer if game over
    return () => clearTimeout(t);
  }, [isGameOver]);

  // Different animations depending on the enemy context
  let situationProps = { text: "Oh não!", extraEmoji: "", bg: "bg-red-500", animation: {} };

  if (enemyId === 'fall') {
    situationProps = {
      text: "Cacau caiu no buraco!",
      extraEmoji: "🕳️",
      bg: "bg-blue-600",
      animation: { rotate: 1080, scale: [1, 0.2], y: [0, 500] }
    };
  } else if (enemyId === 'espinho') {
    situationProps = {
      text: "Cacau beijou o Ouriço!",
      extraEmoji: "🦔",
      bg: "bg-rose-600",
      animation: { y: [0, -400], scale: [1, 1.2, 1], rotate: [0, 180, 360], transition: { duration: 0.8 } }
    };
  } else if (enemyId === 'crocodilo') {
    situationProps = {
      text: "Cacau escorregou na lama!",
      extraEmoji: "💩", 
      bg: "bg-amber-800",
      animation: { rotate: 720, scale: [1, 1.5, 0.8, 1], y: [0, -200, 200, 0] }
    };
  } else if (enemyId === 'leao') {
    situationProps = {
      text: "O Leão fez cócegas nela!",
      extraEmoji: "😂",
      bg: "bg-yellow-500",
      animation: { x: [-30, 30, -30, 30, -30, 30, 0], rotate: [-15, 15, -15, 15, 0] }
    };
  } else if (enemyId === 'onca') {
    situationProps = {
      text: "Ela levou um susto da Onça!",
      extraEmoji: "😱",
      bg: "bg-green-800",
      animation: { y: [0, -400], rotate: 360, transition: { duration: 0.6 } }
    };
  } else if (enemyId === 'dragao') {
    situationProps = {
      text: "Ela gargalhou com o espirro do Dragão!",
      extraEmoji: "🤧",
      bg: "bg-orange-600",
      animation: { scale: [1, 1.4, 0.9, 1.1, 1], rotate: [-20, 20, -20, 20, 0] }
    };
  } else if (enemyId === 'sombra') {
    situationProps = {
      text: "A Sombra fez careta para ela!",
      extraEmoji: "🤪",
      bg: "bg-indigo-950",
      animation: { scale: [1, 0.5, 1.5, 1], rotateY: [0, 360, 720] }
    };
  } else {
    situationProps = {
      text: "Cacau tropeçou e rolou!",
      extraEmoji: "💫",
      bg: "bg-purple-600",
      animation: { rotate: 1080, x: [0, 400] }
    };
  }

  return (
    <div 
      className={`absolute inset-0 ${situationProps.bg} z-50 flex flex-col items-center justify-center p-8 cursor-pointer select-none`}
      onClick={handleDone}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-white text-7xl font-black mb-8 text-center drop-shadow-[8px_8px_0px_rgba(0,0,0,0.5)] uppercase rotate-2"
        style={{ WebkitTextStroke: '2px black' }}
      >
        {isGameOver ? "FIM DE JOGO!" : "Errouuu!"}
        <div className="text-4xl mt-6 font-black text-white/90 lowercase -rotate-3" style={{ WebkitTextStroke: '1px black' }}>
          {isGameOver ? "Suas vidas acabaram..." : situationProps.text}
        </div>
      </motion.div>

      <motion.div
        animate={situationProps.animation as any}
        transition={{ duration: 1.5 }}
        className="flex items-center gap-4 ml-8 bg-black/20 p-6 rounded-full border-[6px] border-black shadow-[12px_12px_0px_#000]"
      >
        <Capybara size={120} />
        <span className="text-[100px] drop-shadow-[4px_4px_0_#000]">{situationProps.extraEmoji}</span>
      </motion.div>
      
      <button 
        className="absolute bottom-8 text-white font-black text-2xl uppercase tracking-widest bg-black px-8 py-4 rounded-xl -rotate-2 hover:scale-105 active:scale-95 transition-transform"
        onClick={(e) => { e.stopPropagation(); handleDone(); }}
      >
        {isGameOver ? "Recomeçar fase" : "Tente novamente!"}
      </button>
    </div>
  );
}
