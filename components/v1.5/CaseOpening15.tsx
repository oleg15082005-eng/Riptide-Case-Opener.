import React, { useState, useEffect } from 'react';
import { Case, Skin, SkinCondition, Rarity, InventoryItem } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import SkinCard15 from './SkinCard15';

interface CaseOpening15Props {
  targetCase: Case;
  onClose: () => void;
  onWin: (skin: Skin, sourceCase: Case, condition: SkinCondition, statTrak?: number, priceMultiplier?: number) => void;
}

const CaseOpening15: React.FC<CaseOpening15Props> = ({ targetCase, onClose, onWin }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [winner, setWinner] = useState<InventoryItem | null>(null);
  const [rouletteItems, setRouletteItems] = useState<InventoryItem[]>([]);
  const [reelOffset, setReelOffset] = useState(0);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Shift') setIsShiftPressed(true); };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.key === 'Shift') setIsShiftPressed(false); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, []);

  const rollSkin = (): Skin => {
    const rand = Math.random();
    let rarity = Rarity.CONSUMER;
    
    if (targetCase.id === 'gamma-case') {
        if (rand > 0.9974) rarity = Rarity.LEGENDARY;
        else if (rand > 0.9914) rarity = Rarity.MYTHIC;
        else if (rand > 0.9594) rarity = Rarity.ULTRA;
        else if (rand > 0.7994) rarity = Rarity.EPIC;
        else rarity = Rarity.RARE;
    } else {
        if (rand > 0.8) rarity = Rarity.RARE;
        else rarity = Rarity.CONSUMER;
    }
    
    const pool = targetCase.skins.filter(s => s.rarity === rarity);
    return pool[Math.floor(Math.random() * pool.length)] || targetCase.skins[0];
  };

  const rollCondition = (): SkinCondition => {
    const rand = Math.random();
    if (rand > 0.90) return 'FACTORY_NEW';
    if (rand > 0.75) return 'MINIMAL_WEAR';
    if (rand > 0.40) return 'FIELD_TESTED';
    if (rand > 0.20) return 'WELL_WORN';
    return 'BATTLE_SCARRED';
  };

  const rollStatTrak = (rarity: Rarity): number | undefined => {
    const rand = Math.random();
    let chance = 0;
    if (rarity === Rarity.RARE) chance = 0.10;
    else if (rarity === Rarity.EPIC) chance = 0.08;
    else if (rarity === Rarity.ULTRA) chance = 0.06;
    else if (rarity === Rarity.MYTHIC) chance = 0.04;

    if (rand < chance) {
        return Math.floor(Math.random() * 1000);
    }
    return undefined;
  };

  const generateDisplayItem = (skin: Skin): InventoryItem => {
      const condition = rollCondition();
      const statTrak = rollStatTrak(skin.rarity);
      return {
          ...skin,
          condition,
          statTrak,
          instanceId: `temp-${Math.random()}`,
          acquiredAt: Date.now(),
          isSellable: true,
          isLocked: false
      };
  };

  const startOpening = () => {
    if (isOpening) return;
    setIsOpening(true);
    setWinner(null);
    setReelOffset(0);

    const winningSkin = rollSkin();
    const winningItem = generateDisplayItem(winningSkin);

    const items: InventoryItem[] = [];
    for (let i = 0; i < 60; i++) {
      items.push(generateDisplayItem(rollSkin()));
    }
    items[50] = winningItem;

    setRouletteItems(items);
    
    // Calculate offset: each item is 220px wide (200 + 20 margin), we want to land on index 50
    const itemWidth = 220;
    const offset = (50 * itemWidth) + (itemWidth / 2);
    
    setTimeout(() => {
      setReelOffset(offset);
    }, 50);

    setTimeout(() => {
      setWinner(winningItem);
      
      let priceMult = 1;
      if (winningItem.statTrak !== undefined) {
          if (winningItem.statTrak === 999) priceMult = 25;
          else if (winningItem.statTrak % 111 === 0 && winningItem.statTrak > 0) priceMult = 10;
          else if (winningItem.statTrak >= 100) priceMult = 3;
          else if (winningItem.statTrak >= 10) priceMult = 2;
          else priceMult = 1.5;
      }
      
      onWin(winningSkin, targetCase, winningItem.condition, winningItem.statTrak, priceMult);
    }, 6500);
  };

  const handlePlayAgain = () => {
    setIsOpening(false);
    setWinner(null);
    setReelOffset(0);
    setTimeout(() => {
      startOpening();
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col md:flex-row text-slate-50 font-mono overflow-hidden">
       {/* Left Side: Play Area */}
       <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-blue-900/50 p-6 md:p-10 flex flex-col items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-slate-950 pointer-events-none"></div>
          
          <button 
            onClick={onClose} 
            className="absolute top-6 left-6 text-blue-500 hover:text-blue-400 flex items-center gap-2 font-bold tracking-widest uppercase z-20 bg-slate-900/50 px-4 py-2 rounded-lg border border-blue-900/50 backdrop-blur-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            НАЗАД
          </button>
          
          {!isOpening ? (
              <div className="flex flex-col items-center relative z-10">
                  <motion.img 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={targetCase.image} 
                      className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-10 hover:scale-105 transition-transform duration-500" 
                  />
                  <button 
                      onClick={startOpening} 
                      className="bg-blue-600 hover:bg-blue-500 text-white font-black text-3xl md:text-5xl px-16 md:px-24 py-6 md:py-8 rounded-2xl border-b-8 border-blue-800 uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_rgba(59,130,246,0.8)] transition-all active:translate-y-2 active:border-b-0"
                  >
                      ИГРАТЬ
                  </button>
              </div>
          ) : (
              <div className="w-full relative h-80 bg-slate-950 border-y-4 border-blue-600 overflow-hidden flex items-center shadow-[inset_0_0_100px_rgba(0,0,0,1)]">
                  {/* Center Marker */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white z-30 shadow-[0_0_20px_white]"></div>
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-8 h-8 bg-blue-500 rotate-45 -mt-4 z-40 border-2 border-white"></div>
                  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-8 h-8 bg-blue-500 rotate-45 -mb-4 z-40 border-2 border-white"></div>

                  <motion.div
                      initial={{ x: 0 }}
                      animate={{ x: -reelOffset + (window.innerWidth / (window.innerWidth < 768 ? 2 : 4)) }}
                      transition={{ duration: 6, ease: [0.15, 0, 0.05, 1] }}
                      className="flex items-center absolute"
                  >
                      {rouletteItems.map((skin, idx) => (
                          <div key={idx} className="w-[200px] mx-[10px] flex-shrink-0">
                              <SkinCard15 skin={skin} showWiki={false} />
                          </div>
                      ))}
                  </motion.div>
              </div>
          )}

          {winner && (
              <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-50"
              >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)]"></div>
                  <h2 className="text-5xl md:text-7xl font-black text-blue-400 uppercase tracking-widest mb-12 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">ВЫИГРЫШ</h2>
                  <div className="w-64 h-80 md:w-80 md:h-96 mb-8">
                     <SkinCard15 skin={winner} showWiki={false} />
                  </div>
                  
                  <div className="flex gap-4 mt-12 relative z-10">
                      <button 
                          onClick={() => { setIsOpening(false); setWinner(null); }} 
                          className="bg-slate-900 border border-blue-500/50 text-blue-400 px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
                      >
                          В ИНВЕНТАРЬ
                      </button>
                      <button 
                          onClick={handlePlayAgain} 
                          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
                      >
                          ЕЩЕ РАЗ
                      </button>
                  </div>
              </motion.div>
          )}
       </div>

       {/* Right Side: Showcase & Wiki */}
       <div className="w-full md:w-1/2 h-1/2 md:h-full bg-slate-950 p-6 md:p-10 overflow-y-auto custom-scrollbar relative">
          <div className="sticky top-0 bg-slate-950/90 backdrop-blur-md z-20 pb-4 mb-8 border-b border-blue-900/50 flex justify-between items-end pt-4">
              <div>
                  <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 uppercase tracking-widest italic">ВИТРИНА</h2>
                  <p className="text-slate-400 text-sm mt-1 font-bold">{targetCase.name}</p>
              </div>
              <div className="bg-slate-900/80 border border-blue-900/50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-inner">
                  <div className={`w-2 h-2 rounded-full ${isShiftPressed ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-blue-500 animate-ping'}`}></div>
                  <p className={`text-xs font-bold ${isShiftPressed ? 'text-green-400' : 'text-blue-400'}`}>Удерживайте SHIFT для WIKI</p>
              </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pb-20">
              {targetCase.skins.map(skin => (
                  <SkinCard15 key={skin.id} skin={skin} showWiki={isShiftPressed} />
              ))}
          </div>
       </div>
    </div>
  );
};

export default CaseOpening15;
