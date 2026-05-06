
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Case, Skin, Rarity, SkinCondition, BPReward } from '../types';
import { SPECIAL_ITEM_QUESTION_MARK, GAMMA_KNIVES } from '../constants';
import SkinCard from './SkinCard';

interface CaseOpeningModalProps {
  targetCase: Case;
  onClose: () => void;
  onWin: (skin: Skin, sourceCase: Case, condition: SkinCondition, statTrak?: number, priceMultiplier?: number) => void;
  onTryOpen: (price: number) => boolean;
  availableDiscounts?: BPReward[];
  onConsumeDiscounts?: (levels: number[]) => void;
  premiumBoosts?: number;
  onConsumeBoost?: () => void;
}

const CaseOpeningModal: React.FC<CaseOpeningModalProps> = ({ targetCase, onClose, onWin, onTryOpen, availableDiscounts = [], onConsumeDiscounts, premiumBoosts = 0, onConsumeBoost }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [winner, setWinner] = useState<Skin | null>(null);
  const [winCondition, setWinCondition] = useState<SkinCondition>('FIELD_TESTED');
  const [winStatTrak, setWinStatTrak] = useState<number | undefined>(undefined);
  const [winPriceMult, setWinPriceMult] = useState<number>(1);
  const [rouletteItems, setRouletteItems] = useState<Skin[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [reelOffset, setReelOffset] = useState(0);
  const [useBoost, setUseBoost] = useState(false);

  // Discount Logic
  const [activeDiscountLevels, setActiveDiscountLevels] = useState<number[]>([]);

  const CARD_WIDTH = 220; 
  const CARD_MARGIN = 4;
  const CARD_FULL_WIDTH = CARD_WIDTH + CARD_MARGIN;
  const WINNING_INDEX = 40; 
  const SPIN_DURATION = 9; 

  // Calculate Stacking Discount
  const totalDiscountPercent = availableDiscounts
      .filter(d => activeDiscountLevels.includes(d.level))
      .reduce((sum, d) => sum + (d.amount || 0), 0);
  
  // Cap at 100%
  const effectiveDiscount = Math.min(100, totalDiscountPercent);

  // Calculate price
  const finalPrice = targetCase.price > 0 && effectiveDiscount > 0
      ? targetCase.price * (1 - effectiveDiscount / 100)
      : targetCase.price;

  const toggleDiscount = (level: number) => {
      if (isOpening) return;
      if (activeDiscountLevels.includes(level)) {
          setActiveDiscountLevels(prev => prev.filter(l => l !== level));
      } else {
          setActiveDiscountLevels(prev => [...prev, level]);
      }
  };

  // --- ODDS CONFIG ---
  const getOdds = (caseId: string) => {
      if (caseId === 'gamma-case') {
          return [
              { label: 'Редкое (Синее)', percent: '85.0%', color: 'text-blue-500' },
              { label: 'Эпическое (Фиолетовое)', percent: '10.0%', color: 'text-purple-500' },
              { label: 'Ультра (Розовое)', percent: '3.0%', color: 'text-pink-500' },
              { label: 'Мифическое (Красное)', percent: '1.5%', color: 'text-red-500' },
              { label: 'Золотое (Нож)', percent: '0.5%', color: 'text-yellow-500' },
          ];
      } else {
          // Riptide
          return [
              { label: 'Ширпотреб (Серое)', percent: '80.0%', color: 'text-slate-400' },
              { label: 'Редкое (Синее)', percent: '20.0%', color: 'text-blue-500' },
          ];
      }
  };

  // Взвешенный рандом для рулетки
  const getRandomSkinForCase = (c: Case) => {
    // Если кейс имеет особые правила (Gamma)
    if (c.id === 'gamma-case') {
        const roll = Math.random() * 100;
        let pool: Skin[] = [];
        if (roll < 0.5) { // Legendary (Gold)
             return SPECIAL_ITEM_QUESTION_MARK;
        } else if (roll < 2.0) { // Mythic (Red)
             pool = c.skins.filter(s => s.rarity === Rarity.MYTHIC);
        } else if (roll < 5.0) { // Ultra (Pink)
             pool = c.skins.filter(s => s.rarity === Rarity.ULTRA);
        } else if (roll < 15.0) { // Epic (Purple)
             pool = c.skins.filter(s => s.rarity === Rarity.EPIC);
        } else { // Rare (Blue)
             pool = c.skins.filter(s => s.rarity === Rarity.RARE);
        }
        
        if (pool.length === 0) return c.skins[0]; // Fallback
        return pool[Math.floor(Math.random() * pool.length)];

    } else {
        // Старый кейс (Riptide)
        const roll = Math.random() * 100;
        if (roll < 20) {
            const rares = c.skins.filter(s => s.rarity === Rarity.RARE);
            return rares[Math.floor(Math.random() * rares.length)];
        } else {
            const consumers = c.skins.filter(s => s.rarity === Rarity.CONSUMER);
            return consumers[Math.floor(Math.random() * consumers.length)];
        }
    }
  };

  const determineCondition = (rarity: Rarity): SkinCondition => {
      if (rarity === Rarity.LEGENDARY) return 'NO_WEAR'; // Ножи всегда идеал
      
      const roll = Math.random();
      if (roll > 0.7) return 'FACTORY_NEW'; 
      if (roll < 0.3) return 'BATTLE_SCARRED'; 
      return 'FIELD_TESTED'; 
  };

  const calculateStatTrak = (skin: Skin) => {
      // Logic: Only Rare to Mythic. Decreasing Chance 10% -> 4%.
      // 0-9: 1.5x
      // 10-99: 2x
      // 100-998: 3x
      // 111, 222 etc: 10x
      // 999: 25x (Chance 0.5%)

      if (skin.rarity === Rarity.LEGENDARY || skin.rarity === Rarity.CONSUMER || skin.rarity === Rarity.GRAY) {
          return { kills: undefined, mult: 1 };
      }

      let chance = 0;
      if (skin.rarity === Rarity.RARE) chance = 0.10;
      else if (skin.rarity === Rarity.EPIC) chance = 0.08;
      else if (skin.rarity === Rarity.ULTRA) chance = 0.06;
      else if (skin.rarity === Rarity.MYTHIC) chance = 0.04;

      if (Math.random() > chance) return { kills: undefined, mult: 1 };

      // Determine Kills
      let kills = 0;
      const isJackpot = Math.random() < 0.005; // 0.5% for 999
      if (isJackpot) kills = 999;
      else kills = Math.floor(Math.random() * 999); // 0-998

      // Determine Multiplier
      let mult = 1.5; // Base StatTrak bonus
      
      const isRepeating = kills > 10 && kills.toString().split('').every(char => char === kills.toString()[0]); // 11, 111, 222 etc.

      if (kills === 999) {
          mult = 25;
      } else if (isRepeating) {
          mult = 10;
      } else if (kills >= 100) {
          mult = 3;
      } else if (kills >= 10) {
          mult = 2;
      }

      return { kills, mult };
  };

  const startOpening = () => {
    if (isOpening) return;
    if (!onTryOpen(finalPrice)) return;

    // CONSUME DISCOUNTS IF USED
    if (activeDiscountLevels.length > 0 && onConsumeDiscounts && targetCase.price > 0) {
        onConsumeDiscounts(activeDiscountLevels);
        setActiveDiscountLevels([]); // Clear local selection immediately
    }

    if (useBoost && onConsumeBoost) {
        onConsumeBoost();
    }

    const winningSkin = getRandomSkinForCase(targetCase);
    const condition = determineCondition(winningSkin.rarity);
    const { kills, mult } = calculateStatTrak(winningSkin);
    
    const items: Skin[] = [];
    for (let i = 0; i < WINNING_INDEX + 10; i++) {
      items.push(getRandomSkinForCase(targetCase));
    }
    items[WINNING_INDEX] = winningSkin;

    const randomShift = (Math.random() - 0.5) * (CARD_WIDTH * 0.75); 
    const winningCenterPos = (WINNING_INDEX * CARD_FULL_WIDTH) + (CARD_WIDTH / 2);
    const finalPos = winningCenterPos + randomShift;

    setRouletteItems(items);
    setWinner(winningSkin);
    setWinCondition(condition);
    setWinStatTrak(kills);
    setWinPriceMult(mult);

    setReelOffset(finalPos);
    
    setShowPreview(false);
    setIsOpening(true);

    setTimeout(() => {
      // Логика "Золотого предмета"
      let finalWinner = winningSkin;
      if (winningSkin.id === 'question_mark' && targetCase.specialItems) {
          // Подменяем вопрос на реальный нож
          finalWinner = targetCase.specialItems[Math.floor(Math.random() * targetCase.specialItems.length)];
          setWinner(finalWinner);
      }
      
      setAnimationFinished(true);
      onWin(finalWinner, targetCase, condition, kills, mult);
      
      // Apply boost if used and rarity is high enough
      if (useBoost && (finalWinner.rarity === Rarity.ULTRA || finalWinner.rarity === Rarity.MYTHIC || finalWinner.rarity === Rarity.LEGENDARY)) {
          // Give a second copy
          setTimeout(() => {
              onWin(finalWinner, targetCase, condition, kills, mult);
          }, 500);
      }
      
    }, SPIN_DURATION * 1000 + 500); 
  };

  const handleReset = () => {
    setIsOpening(false);
    setAnimationFinished(false);
    setShowPreview(true);
    setWinner(null);
    setRouletteItems([]);
    setReelOffset(0);
    setWinStatTrak(undefined);
    setWinPriceMult(1);
    setUseBoost(false);
  };

  // Helper colors
  const getRarityColor = (r: Rarity) => {
      switch(r) {
          case Rarity.LEGENDARY: return 'bg-[#000] border-yellow-500';
          case Rarity.MYTHIC: return 'bg-[#1a0505] border-red-600';
          case Rarity.ULTRA: return 'bg-[#1a0515] border-pink-500';
          case Rarity.EPIC: return 'bg-[#0f051a] border-purple-600';
          case Rarity.RARE: return 'bg-[#050f1a] border-blue-600';
          case Rarity.CONSUMER: return 'bg-[#0f172a] border-slate-700'; // Gray
          default: return 'bg-slate-900 border-slate-800';
      }
  };

  const getBottomBarColor = (r: Rarity) => {
       switch(r) {
          case Rarity.LEGENDARY: return 'bg-yellow-500 shadow-[0_0_15px_gold]';
          case Rarity.MYTHIC: return 'bg-red-600 shadow-[0_0_15px_red]';
          case Rarity.ULTRA: return 'bg-pink-500 shadow-[0_0_15px_magenta]';
          case Rarity.EPIC: return 'bg-purple-600 shadow-[0_0_15px_purple]';
          case Rarity.RARE: return 'bg-blue-600 shadow-[0_0_15px_blue]';
          case Rarity.CONSUMER: return 'bg-slate-500';
          default: return 'bg-slate-600';
      }
  };

  const getRarityLabel = (r: Rarity) => {
      switch(r) {
          case Rarity.LEGENDARY: return 'ЛЕГЕНДАРНОЕ';
          case Rarity.MYTHIC: return 'ТАЙНОЕ';
          case Rarity.ULTRA: return 'ЗАСЕКРЕЧЕННОЕ';
          case Rarity.EPIC: return 'ЗАПРЕЩЕННОЕ';
          case Rarity.RARE: return 'АРМЕЙСКОЕ';
          case Rarity.CONSUMER: return 'ШИРПОТРЕБ';
          case Rarity.GRAY: return 'ОБЫЧНОЕ';
          default: return r;
      }
  };

  // Render Logic for Modal Layout
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/95 backdrop-blur-xl p-4 md:p-10">
      <div className="w-full max-w-[1400px] h-[85vh] relative flex bg-[#0f172a] border border-slate-800 rounded-[30px] shadow-2xl overflow-hidden">
        
        {/* CLOSE BUTTON */}
        {!isOpening && (
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-50 bg-slate-800/50 hover:bg-slate-700 p-2 rounded-full text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        )}

        {/* --- LEFT SIDE: CASE ACTION AREA --- */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-8 border-r border-slate-800/50">
            <div className="absolute top-10 left-10 z-20">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                    {targetCase.name}
                </h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Официальный дроп</p>
            </div>

            {/* DISCOUNT COUPON INVENTORY */}
            {availableDiscounts.length > 0 && !isOpening && (
                <div className="absolute top-32 left-10 z-30 w-56 animate-in fade-in slide-in-from-left-4 duration-700">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Мои Купоны
                    </p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {availableDiscounts.map(discount => {
                            const isActive = activeDiscountLevels.includes(discount.level);
                            return (
                                <div 
                                    key={discount.level}
                                    onClick={() => targetCase.price > 0 && toggleDiscount(discount.level)}
                                    className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 group overflow-hidden ${
                                        isActive 
                                            ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                                            : targetCase.price === 0 ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed' : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                                    }`}
                                >
                                    {/* Shine effect on active */}
                                    {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>}
                                    
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <p className={`text-lg font-black italic ${isActive ? 'text-white' : 'text-slate-500'}`}>-{discount.amount}%</p>
                                            <p className="text-[8px] font-bold uppercase text-slate-500">Уровень БП {discount.level}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'bg-blue-500 border-blue-500' : 'border-slate-700'}`}>
                                            {isActive && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {totalDiscountPercent > 0 && targetCase.price > 0 && (
                        <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-green-500/30 backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">СУММА СКИДКИ</span>
                                <span className="text-sm font-black text-green-400">-{effectiveDiscount}%</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showPreview ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="relative group cursor-pointer" onClick={startOpening}>
                        <div className="absolute inset-0 bg-blue-600 blur-[120px] opacity-20 group-hover:opacity-40 transition-duration-700"></div>
                        <img 
                            src={targetCase.image} 
                            alt="Case" 
                            className="w-[400px] h-[400px] object-contain relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    
                    <button 
                        onClick={startOpening}
                        className="mt-12 bg-white text-slate-950 font-black text-xl px-24 py-6 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all active:scale-95 uppercase tracking-widest hover:bg-blue-50 relative z-20"
                    >
                        {targetCase.price === 0 ? (
                            'ОТКРЫТЬ БЕСПЛАТНО'
                        ) : (
                            effectiveDiscount > 0 ? (
                                <div className="flex flex-col items-center leading-none">
                                    <span className="text-xs line-through opacity-40 font-bold text-slate-500 mb-1">${targetCase.price.toFixed(2)}</span>
                                    <span>ОТКРЫТЬ ЗА ${finalPrice.toFixed(2)}</span>
                                </div>
                            ) : (
                                `ОТКРЫТЬ ЗА $${targetCase.price}`
                            )
                        )}
                    </button>

                    {targetCase.id === 'premium-case' && premiumBoosts > 0 && (
                        <div className="mt-6 flex items-center gap-3 bg-slate-900/80 border border-yellow-500/50 p-4 rounded-xl relative z-20">
                            <input 
                                type="checkbox" 
                                id="boostToggle" 
                                checked={useBoost} 
                                onChange={(e) => setUseBoost(e.target.checked)}
                                className="w-5 h-5 accent-yellow-500 cursor-pointer"
                            />
                            <label htmlFor="boostToggle" className="cursor-pointer flex flex-col">
                                <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Использовать Boost Билет</span>
                                <span className="text-slate-400 text-[10px]">Удваивает дроп (Розовое, Красное, Нож). Доступно: {premiumBoosts}</span>
                            </label>
                        </div>
                    )}
                </div>
            ) : (
                /* ROULETTE VIEW */
                <div className="w-full relative flex flex-col items-center justify-center h-full">
                     <div className="w-full h-[280px] bg-[#020617] border-y border-slate-800/50 relative overflow-hidden flex items-center mb-10 shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
                        {/* Background & Mask */}
                        <div className="absolute inset-0 market-grid opacity-20"></div>
                        <div className="absolute left-0 top-0 bottom-0 w-[150px] bg-gradient-to-r from-[#020617] to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-[150px] bg-gradient-to-l from-[#020617] to-transparent z-20 pointer-events-none"></div>

                        {/* Needle */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-yellow-500 z-30 shadow-[0_0_20px_#eab308]"></div>

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

        {/* --- RIGHT SIDE: CONTENTS PANEL --- */}
        <div className="w-[350px] bg-[#0b1120] border-l border-slate-800 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-800">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Содержимое кейса</h3>
                
                {/* ODDS TABLE */}
                <div className="space-y-2 mb-6">
                    {getOdds(targetCase.id).map((odd, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] font-bold uppercase">
                            <span className={odd.color}>{odd.label}</span>
                            <span className="text-white bg-slate-800 px-2 py-0.5 rounded">{odd.percent}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* SCROLLABLE SKINS LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {targetCase.specialItems && (
                     <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-700/30 rounded-xl group hover:bg-yellow-900/30 transition-colors">
                        <div className="w-12 h-12 flex items-center justify-center bg-black border border-yellow-600 rounded-lg shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                            <span className="text-yellow-500 font-black text-xl">?</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Чрезвычайно Редкое</p>
                            <p className="text-xs font-bold text-white uppercase">Особый Предмет</p>
                        </div>
                    </div>
                )}
                
                {targetCase.skins.map((skin) => (
                     <div key={skin.id} className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-xl transition-colors group">
                        <div className={`w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-lg border bg-slate-900 ${
                            skin.rarity === Rarity.MYTHIC ? 'border-red-600/50' :
                            skin.rarity === Rarity.ULTRA ? 'border-pink-500/50' :
                            skin.rarity === Rarity.EPIC ? 'border-purple-600/50' :
                            skin.rarity === Rarity.RARE ? 'border-blue-600/50' : 'border-slate-600/50'
                        }`}>
                            <img src={skin.image} className="max-w-full max-h-full p-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-bold text-slate-500 uppercase truncate">{skin.weapon}</p>
                            <p className={`text-xs font-black uppercase italic truncate ${
                                 skin.rarity === Rarity.MYTHIC ? 'text-red-400' :
                                 skin.rarity === Rarity.ULTRA ? 'text-pink-400' :
                                 skin.rarity === Rarity.EPIC ? 'text-purple-400' :
                                 skin.rarity === Rarity.RARE ? 'text-blue-400' : 'text-slate-300'
                            }`}>{skin.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* WINNER OVERLAY */}
        <AnimatePresence>
            {animationFinished && winner && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
                >
                    <div className="bg-[#0f172a] border border-slate-700 w-[400px] rounded-[32px] p-2 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-20">
                            НОВЫЙ ПРЕДМЕТ
                        </div>

                        <div className="bg-[#020617] rounded-[24px] p-8 flex flex-col items-center relative overflow-hidden h-full">
                            {/* Glow */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 blur-[90px] rounded-full opacity-30 pointer-events-none ${winner.rarity === Rarity.LEGENDARY ? 'bg-yellow-600' : winner.rarity === Rarity.MYTHIC ? 'bg-red-600' : winner.rarity === Rarity.ULTRA ? 'bg-pink-600' : winner.rarity === Rarity.EPIC ? 'bg-purple-600' : 'bg-blue-600'}`}></div>

                            {/* Condition & StatTrak Tags */}
                            <div className="flex gap-2 mb-6 relative z-10 flex-wrap justify-center">
                                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-slate-800 text-slate-300`}>
                                    {getRarityLabel(winner.rarity)}
                                </div>
                                {winCondition !== 'NO_WEAR' && (
                                    <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 ${
                                        winCondition === 'FACTORY_NEW' ? 'bg-green-900/30 text-green-400' : 
                                        winCondition === 'BATTLE_SCARRED' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'
                                    }`}>
                                        {winCondition.replace('_', ' ')}
                                    </div>
                                )}
                                {winCondition === 'NO_WEAR' && (
                                        <div className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-yellow-900/30 bg-yellow-900/10 text-yellow-400">
                                        ★ РЕДКОЕ
                                        </div>
                                )}
                                {winStatTrak !== undefined && (
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-500 bg-orange-900/20 text-orange-500 flex items-center gap-1 shadow-[0_0_15px_rgba(234,88,12,0.4)]"
                                    >
                                        StatTrak™ {winStatTrak.toString().padStart(6, '0')}
                                    </motion.div>
                                )}
                            </div>

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
                                <div className="mt-2 flex items-center justify-center gap-2">
                                    <p className="text-slate-400 font-mono text-sm opacity-60">Базовая: ${winner.price.toFixed(2)}</p>
                                    {winPriceMult > 1 && (
                                        <span className="text-green-500 text-xs font-black bg-green-900/20 px-2 py-0.5 rounded border border-green-500/30">x{winPriceMult} СТОИМОСТЬ</span>
                                    )}
                                </div>
                                {useBoost && (winner.rarity === Rarity.ULTRA || winner.rarity === Rarity.MYTHIC || winner.rarity === Rarity.LEGENDARY) && (
                                    <div className="mt-4 inline-block bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                                        BOOST АКТИВЕН: ВЫ ПОЛУЧИЛИ 2 КОПИИ!
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 w-full z-10">
                                <button 
                                    onClick={handleReset}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors"
                                >
                                    ЕЩЕ РАЗ
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="flex-1 bg-white hover:bg-blue-50 text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                >
                                    В ИНВЕНТАРЬ
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

export default CaseOpeningModal;
