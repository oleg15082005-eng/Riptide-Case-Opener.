import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skin, Rarity } from '../../types';
import { ALL_SKINS } from '../../constants';
import SkinCard from '../SkinCard';

interface CapsuleOpeningModalProps {
  onClose: () => void;
  onWin: (amount: number) => void;
}

const CapsuleOpeningModal: React.FC<CapsuleOpeningModalProps> = ({ onClose, onWin }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [winner, setWinner] = useState<Skin | null>(null);
  const [rouletteItems, setRouletteItems] = useState<Skin[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [reelOffset, setReelOffset] = useState(0);

  const CARD_WIDTH = 220; 
  const CARD_MARGIN = 4;
  const CARD_FULL_WIDTH = CARD_WIDTH + CARD_MARGIN;
  const WINNING_INDEX = 40; 
  const SPIN_DURATION = 8; 

  // Filter pool: only Pink, Red, Gold
  const pool = ALL_SKINS.filter(s => s.rarity === Rarity.ULTRA || s.rarity === Rarity.MYTHIC || s.rarity === Rarity.LEGENDARY);

  const getRandomSkin = () => {
      // Weighted random
      const roll = Math.random() * 100;
      let targetRarity = Rarity.ULTRA;
      if (roll < 5) targetRarity = Rarity.LEGENDARY;
      else if (roll < 25) targetRarity = Rarity.MYTHIC;
      
      const filtered = pool.filter(s => s.rarity === targetRarity);
      if (filtered.length === 0) return pool[Math.floor(Math.random() * pool.length)];
      return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const startOpening = () => {
    if (isOpening) return;

    const winningSkin = getRandomSkin();
    
    const items: Skin[] = [];
    for (let i = 0; i < WINNING_INDEX + 10; i++) {
      items.push(getRandomSkin());
    }
    items[WINNING_INDEX] = winningSkin;

    const randomShift = (Math.random() - 0.5) * (CARD_WIDTH * 0.75); 
    const winningCenterPos = (WINNING_INDEX * CARD_FULL_WIDTH) + (CARD_WIDTH / 2);
    const finalPos = winningCenterPos + randomShift;

    setRouletteItems(items);
    setWinner(winningSkin);
    setReelOffset(finalPos);
    
    setShowPreview(false);
    setIsOpening(true);

    setTimeout(() => {
      setAnimationFinished(true);
      onWin(winningSkin.price);
    }, SPIN_DURATION * 1000 + 500); 
  };

  // Helper colors
  const getRarityColor = (r: Rarity) => {
      switch(r) {
          case Rarity.LEGENDARY: return 'bg-[#000] border-yellow-500';
          case Rarity.MYTHIC: return 'bg-[#1a0505] border-red-600';
          case Rarity.ULTRA: return 'bg-[#1a0515] border-pink-500';
          default: return 'bg-slate-900 border-slate-800';
      }
  };

  const getBottomBarColor = (r: Rarity) => {
       switch(r) {
          case Rarity.LEGENDARY: return 'bg-yellow-500 shadow-[0_0_15px_gold]';
          case Rarity.MYTHIC: return 'bg-red-600 shadow-[0_0_15px_red]';
          case Rarity.ULTRA: return 'bg-pink-500 shadow-[0_0_15px_magenta]';
          default: return 'bg-slate-600';
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/95 backdrop-blur-xl p-4 md:p-10">
      <div className="w-full max-w-[1200px] h-[80vh] relative flex flex-col bg-[#0f172a] border border-emerald-500/30 rounded-[30px] shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden">
        
        {/* CLOSE BUTTON */}
        {!isOpening && (
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-50 bg-slate-800/50 hover:bg-slate-700 p-2 rounded-full text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        )}

        <div className="flex-1 relative flex flex-col items-center justify-center p-8">
            <div className="absolute top-10 left-10 z-20">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    ВЕСЕННЯЯ КАПСУЛА
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Гарантированный редкий дроп</p>
            </div>

            {showPreview ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="relative group cursor-pointer" onClick={startOpening}>
                        <div className="absolute inset-0 bg-emerald-500 blur-[120px] opacity-20 group-hover:opacity-40 transition-duration-700"></div>
                        <div className="w-64 h-64 bg-emerald-900/30 rounded-full border-4 border-emerald-500/50 flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform duration-500">
                            <span className="text-6xl">🌸</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={startOpening}
                        className="mt-12 bg-gradient-to-r from-emerald-500 to-green-400 text-white font-black text-xl px-24 py-6 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.4)] transition-all active:scale-95 uppercase tracking-widest hover:shadow-[0_0_70px_rgba(16,185,129,0.6)] relative z-20"
                    >
                        ОТКРЫТЬ КАПСУЛУ
                    </button>
                </div>
            ) : (
                /* ROULETTE VIEW */
                <div className="w-full relative flex flex-col items-center justify-center h-full">
                     <div className="w-full h-[280px] bg-[#020617] border-y border-emerald-900/50 relative overflow-hidden flex items-center mb-10 shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
                        {/* Background & Mask */}
                        <div className="absolute left-0 top-0 bottom-0 w-[150px] bg-gradient-to-r from-[#020617] to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-[150px] bg-gradient-to-l from-[#020617] to-transparent z-20 pointer-events-none"></div>

                        {/* Needle */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-emerald-400 z-30 shadow-[0_0_20px_#34d399]"></div>

                        <motion.div
                            initial={{ x: 0 }}
                            animate={{ x: -reelOffset }}
                            transition={{ 
                                duration: SPIN_DURATION, 
                                ease: [0.15, 0, 0.05, 1] 
                            }}
                            className="flex items-center absolute left-1/2"
                            style={{ paddingLeft: 0 }} 
                        >
                            {rouletteItems.map((skin, idx) => {
                                const cardStyle = getRarityColor(skin.rarity);
                                const barStyle = getBottomBarColor(skin.rarity);

                                return (
                                    <div 
                                        key={idx}
                                        className="flex-shrink-0 relative flex flex-col items-center justify-center"
                                        style={{ 
                                            width: `${CARD_WIDTH}px`, 
                                            height: '200px',
                                            marginRight: `${CARD_MARGIN}px`,
                                            opacity: animationFinished && idx !== WINNING_INDEX ? 0.2 : 1,
                                            filter: animationFinished && idx !== WINNING_INDEX ? 'blur(2px)' : 'none',
                                            transition: 'opacity 0.5s, filter 0.5s'
                                        }}
                                    >
                                        <div className={`w-[90%] h-full rounded-xl border flex flex-col items-center justify-center relative overflow-hidden ${cardStyle}`}>
                                            <img src={skin.image} alt="" className="w-32 h-32 object-contain relative z-10 drop-shadow-xl" />
                                            <div className="absolute bottom-4 left-0 right-0 text-center z-10 px-2">
                                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{skin.weapon}</div>
                                                <div className="text-[11px] font-black text-white uppercase italic truncate">{skin.name}</div>
                                            </div>
                                            <div className={`absolute bottom-0 left-0 right-0 h-1 ${barStyle}`}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            )}
        </div>

        {/* WINNER OVERLAY */}
        <AnimatePresence>
            {animationFinished && winner && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
                >
                    <div className="bg-[#0f172a] border border-emerald-500/50 w-[400px] rounded-[32px] p-2 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20">
                            ВЫПАЛО
                        </div>

                        <div className="bg-[#020617] rounded-[24px] p-8 flex flex-col items-center relative overflow-hidden h-full">
                            {/* Glow */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 blur-[90px] rounded-full opacity-30 pointer-events-none bg-emerald-600`}></div>

                            <motion.img 
                                initial={{ scale: 0.5, rotate: -5 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 12 }}
                                src={winner.image} 
                                className="w-72 h-56 object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)] z-10 mb-6"
                            />

                            <div className="text-center mb-10 z-10">
                                <h3 className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mb-2">{winner.weapon}</h3>
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{winner.name}</h2>
                                <div className="mt-4 inline-block bg-emerald-500/20 border border-emerald-500 text-emerald-400 px-6 py-2 rounded-xl text-lg font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    + ${winner.price.toFixed(2)}
                                </div>
                                <p className="text-xs text-slate-400 mt-3">Скин конвертирован в баланс</p>
                            </div>

                            <div className="flex gap-4 w-full z-10">
                                <button 
                                    onClick={onClose}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                >
                                    ЗАБРАТЬ ДЕНЬГИ
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default CapsuleOpeningModal;
