import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Trophy, RotateCcw } from 'lucide-react';
import Capybara from './Capybara';
import { GameRecord } from '../App';

export default function StartScreen({ onStart, records, onResetProgress }: { onStart: () => void, records: Record<string, GameRecord>, onResetProgress: () => void }) {
  const [showRecords, setShowRecords] = useState(false);

  return (
    <div className="absolute inset-0 bg-linear-to-b from-sky-300 to-green-300 flex flex-col items-center justify-center p-4 sm:p-8 text-center text-white pattern-wavy overflow-hidden">
      
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
        className="mb-8 rotate-1 max-w-[90vw]"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-2 py-2 drop-shadow-[8px_8px_0_#000] text-yellow-300 uppercase tracking-widest break-words leading-tight" style={{ WebkitTextStroke: '4px black', lineHeight: '1.2' }}>
          Super<br/>Capivara
        </h1>
        <p className="text-3xl sm:text-4xl font-black drop-shadow-[4px_4px_0_#000] text-white -rotate-2 flex items-center justify-center gap-3 flex-wrap" style={{ WebkitTextStroke: '2px black' }}>
          🦄 🐱 🧽 Especial para Heloísa 🧽 🐱 🦄
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-10 mb-8 w-full max-w-5xl">
        {/* Left: Instructions */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="font-black text-xl lg:text-2xl text-black bg-white/90 px-6 py-4 rounded-3xl border-[6px] border-black shadow-[8px_8px_0_#000] rotate-2 flex flex-col items-center justify-center gap-2 w-full sm:w-64 h-48 lg:h-56"
        >
          <span className="leading-tight">Controles:</span>
          <div className="flex flex-col items-center gap-1 text-2xl lg:text-3xl">
            <div className="flex gap-1">
              <span className="bg-gray-200 text-xs border-2 border-black px-1.5 py-0.5 rounded-lg font-black leading-none">A/S/D</span>
              <span className="bg-gray-200 text-xs border-2 border-black px-1.5 py-0.5 rounded-lg font-black leading-none">Setas</span>
            </div>
          </div>
          <p className="text-xs lg:text-sm text-center font-bold leading-tight">
             Mover: Setas / A e D<br/>
             Escada: Seta Cima/Baixo ou W e S<br/>
             Abaixar: Seta Baixo / S<br/>
             Pular: Espaço ou W<br/>
             Atirar: X, C ou F
          </p>
        </motion.div>

        {/* Center: Capybara and Extras */}
        <div className="flex flex-col gap-4 items-center">
            <motion.div
            animate={{ y: [0, -20, 0], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="select-none drop-shadow-[12px_12px_0_#000] z-10 shrink-0 hidden sm:block"
            >
            <Capybara size={160} />
            </motion.div>

            <div className="flex gap-4">
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRecords(true)}
                    className="bg-orange-400 border-[4px] border-black p-3 rounded-2xl shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-all"
                >
                    <Trophy className="w-8 h-8 fill-current" />
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onResetProgress}
                    className="bg-white border-[4px] border-black p-3 rounded-2xl shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] transition-all text-red-500"
                    title="Resetar Progresso"
                >
                    <RotateCcw className="w-8 h-8" />
                </motion.button>
            </div>
        </div>

        {/* Right: Play Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="group relative bg-yellow-400 text-black border-[6px] border-black rounded-3xl px-6 py-6 text-3xl lg:text-5xl font-black shadow-[8px_8px_0_#000] sm:shadow-[12px_12px_0_#000] hover:bg-yellow-300 hover:shadow-[4px_4px_0_#000] sm:hover:shadow-[6px_6px_0_#000] hover:translate-y-2 transition-all flex flex-col items-center justify-center gap-2 active:shadow-[0px_0px_0_#000] active:translate-y-4 -rotate-2 w-full sm:w-64 h-48 lg:h-56 shrink-0"
        >
          <span>JOGAR!</span>
          <Play className="w-10 h-10 lg:w-12 lg:h-12 fill-current" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showRecords && (
          <div className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ scale: 0, rotate: 10 }}
               animate={{ scale: 1, rotate: 0 }}
               exit={{ scale: 0, rotate: -10 }}
               className="bg-white border-[8px] border-black p-8 rounded-[40px] shadow-[15px_15px_0_#000] text-black w-full max-w-2xl max-h-[90vh] overflow-y-auto"
             >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-5xl font-black uppercase italic" style={{ WebkitTextStroke: '2px black', color: '#fbbf24' }}>Recordes</h2>
                    <button onClick={() => setShowRecords(false)} className="text-4xl font-black hover:scale-110 transition-transform">X</button>
                </div>

                <div className="space-y-4 text-left">
                    <div className="bg-sky-100 p-4 rounded-2xl border-[4px] border-black flex justify-between items-center rotate-1">
                        <span className="font-black text-2xl uppercase">Jogo Completo</span>
                        <div className="text-right">
                            <div className="font-bold text-sky-600">{records['TOTAL']?.name || '---'}</div>
                            <div className="font-black text-3xl">{records['TOTAL'] ? (records['TOTAL'].time / 1000).toFixed(2) + 's' : '--:--'}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(records).filter(([id]) => id !== 'TOTAL').map(([id, rec]) => (
                            <div key={id} className="bg-gray-50 p-3 rounded-xl border-[2px] border-black flex justify-between items-center">
                                <div className="font-bold uppercase text-xs text-gray-500">{id}</div>
                                <div className="text-right">
                                    <div className="font-bold text-sm">{rec.name}</div>
                                    <div className="font-black">{(rec.time / 1000).toFixed(2)}s</div>
                                </div>
                            </div>
                        ))}
                        {Object.keys(records).length <= 1 && (
                            <p className="col-span-full py-8 text-center font-bold text-gray-400 italic">Jogue para bater recordes!</p>
                        )}
                    </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
