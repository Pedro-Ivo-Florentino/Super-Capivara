import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Riddle } from '../data/levels';
import { HelpCircle } from 'lucide-react';

interface RiddleModalProps {
  riddle: Riddle;
  enemyName: string;
  enemyImage: string;
  onSubmit: (isCorrect: boolean) => void;
}

export default function RiddleModal({ riddle, enemyName, enemyImage, onSubmit }: RiddleModalProps) {
  const letters = ['A', 'B', 'C'];

  // Add Keyboard shortcuts (A, B, C or 1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === '1' || key === 'Q' || key === 'A') {
        if (riddle.options[0]) onSubmit(0 === riddle.answerIndex);
      } else if (key === '2' || key === 'W' || key === 'B') {
        if (riddle.options[1]) onSubmit(1 === riddle.answerIndex);
      } else if (key === '3' || key === 'E' || key === 'C') {
        if (riddle.options[2]) onSubmit(2 === riddle.answerIndex);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [riddle, onSubmit]);

  return (
    <div 
      className="absolute inset-0 bg-black/70 backdrop-blur-md z-[150] flex items-center justify-center p-4 md:p-8 overscroll-none"
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        className="bg-white rounded-3xl p-5 md:p-8 pt-12 md:pt-16 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-[12px_12px_0_#000] relative border-[6px] md:border-[8px] border-black flex flex-col mx-auto my-auto scrollbar-thin scrollbar-thumb-amber-300"
      >
        {/* Floating Enemy Head */}
        <div className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 bg-amber-200 rounded-full w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-[50px] md:text-[70px] shadow-[6px_6px_0_#000] border-[5px] md:border-[6px] border-black z-10 animate-bounce" style={{ animationDuration: '2s' }}>
          {enemyImage}
        </div>
        
        <div className="mt-6 text-center flex-1 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-black text-black mb-1 uppercase tracking-widest drop-shadow-[2px_2px_0_#cbd5e1] -rotate-1 shrink-0">
            O {enemyName} quer brincar!
          </h2>
          <p className="text-base md:text-lg text-slate-600 mb-4 font-black uppercase shrink-0">Resolva a charada para passar:</p>
          
          <div className="bg-orange-50 rounded-2xl p-4 md:p-6 mb-6 border-[4px] md:border-[6px] border-black shadow-[4px_4px_0_#000] rotate-1 shrink-0 w-full">
            <HelpCircle className="w-8 h-8 text-orange-500 mx-auto mb-2 shrink-0 animate-pulse" />
            <p className="text-xl md:text-2xl font-black text-black leading-tight">
              "{riddle.question}"
            </p>
          </div>

          <div className="grid gap-3 w-full grid-cols-1 md:grid-cols-3 pb-2">
            {riddle.options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.04, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSubmit(idx === riddle.answerIndex)}
                className="bg-sky-400 text-black rounded-2xl p-4 text-lg md:text-xl font-black shadow-[6px_6px_0_#000] hover:bg-sky-300 hover:shadow-[3px_3px_0_#000] hover:translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2 border-[5px] border-black active:shadow-none active:translate-y-2 text-center min-h-[100px]"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center font-black border-[3px] border-black shadow-[1px_1px_0_#000]">
                    {letters[idx]}
                  </div>
                  <span className="text-[11px] bg-black text-white px-1.5 py-0.5 rounded font-mono border border-gray-600 shadow-[1px_1px_0_#fff] uppercase">
                    TECLA {idx + 1}
                  </span>
                </div>
                <span className="leading-tight text-center">{opt}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
