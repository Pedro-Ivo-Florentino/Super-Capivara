import { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw } from 'lucide-react';
import Capybara from './Capybara';

export default function VictoryScreen({ onRestart, gameTime }: { onRestart: () => void, gameTime: number }) {
  useEffect(() => {
    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#38bdf8', '#fbbf24', '#4ade80', '#f472b6']
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#38bdf8', '#fbbf24', '#4ade80', '#f472b6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="absolute inset-0 bg-yellow-300 z-50 flex flex-col items-center justify-center p-8 text-black border-[8px] border-black overflow-y-auto">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 4 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="mb-4"
      >
        <Trophy className="w-48 h-48 text-orange-400 drop-shadow-[12px_12px_0_rgba(0,0,0,1)]" strokeWidth="3" />
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-7xl font-black mb-2 text-center uppercase -rotate-2"
        style={{ WebkitTextStroke: '3px black', color: 'white', textShadow: '8px 8px 0px black' }}
      >
        Você Venceu!
      </motion.h1>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-black text-center mb-6 bg-white px-8 py-4 border-[6px] border-black shadow-[8px_8px_0_#000] rotate-1"
      >
        <div className="text-4xl mb-2">Parabéns, Heloísa!! 🦄 🐱 </div>
        <div className="text-sky-600">Tempo Total: <span className="text-4xl font-black">{(gameTime / 1000).toFixed(2)}s</span></div>
      </motion.div>

      <motion.div
         animate={{ y: [0, -30, 0] }}
         transition={{ repeat: Infinity, duration: 2 }}
         className="flex items-center gap-4 text-[80px] mb-8 drop-shadow-[8px_8px_0_#000]"
      >
        <Capybara size={100} /> 🐊 🦁 🐆 🐉
      </motion.div>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1, rotate: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="bg-white text-black rounded-3xl px-8 py-4 text-3xl font-black shadow-[12px_12px_0_#000] border-[6px] border-black hover:bg-black hover:text-white hover:shadow-[6px_6px_0_#000] hover:translate-y-2 transition-all flex items-center gap-4 active:shadow-none active:translate-y-4"
      >
        <RotateCcw className="w-8 h-8" />
        JOGAR DE NOVO
      </motion.button>
    </div>
  );
}
