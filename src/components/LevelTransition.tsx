import { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import Capybara from './Capybara';

export default function LevelTransition({ levelName, onNext }: { levelName: string, onNext: () => void }) {
  useEffect(() => {
    // Explosão de confetes e festa!
    const fireConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#4ade80', '#f472b6']
      });
    };

    fireConfetti();
    
    const t1 = setTimeout(fireConfetti, 500);
    const t2 = setTimeout(fireConfetti, 1000);
    const t3 = setTimeout(fireConfetti, 1500);

    const t = setTimeout(() => {
      onNext();
    }, 3500); // Transitions after 3.5s
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t);
    };
  }, [onNext]);

  return (
    <div className="absolute inset-0 bg-lime-400 z-[90] flex flex-col items-center justify-center p-8 overflow-hidden border-[8px] border-black">
      
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '32px 32px' }} />

      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.6 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="bg-white px-8 py-3 border-[6px] border-black rounded-3xl shadow-[12px_12px_0_#000] -rotate-3 mb-6 text-center">
          <h1 className="text-7xl font-black text-black uppercase drop-shadow-[4px_4px_0_#38bdf8]">
            IRADOOO!
          </h1>
        </div>

        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="flex items-center justify-center w-48 h-48 bg-fuchsia-400 rounded-full border-[8px] border-black shadow-[16px_16px_0_#000]"
        >
          <Capybara size={160} />
        </motion.div>

        <h2 className="text-4xl font-black mt-8 text-black bg-white px-8 py-4 border-[6px] border-black shadow-[8px_8px_0_#000] rotate-2 text-center">
          Passou do: {levelName}!
        </h2>
      </motion.div>
    </div>
  );
}
