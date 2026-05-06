
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Case, Skin, Rarity } from '../types';
import { RIPTIDE_CASE, GAMMA_CASE } from '../constants';

interface BattlesProps {
    onBattleComplete: (winnerItems: Skin[], totalValue: number) => void;
    balance: number;
    setBalance: (val: number) => void;
    setIsBattleActive: (isActive: boolean) => void;
}

// --- CONSTANTS FOR ROULETTE ---
const CARD_WIDTH = 112; 
const GAP = 8; 
const CARD_FULL_WIDTH = CARD_WIDTH + GAP;
const WIN_INDEX = 30; 

interface BattleRouletteProps {
    targetSkin: Skin | null;
    isRolling: boolean;
    caseSource: Case;
}

const BattleRoulette: React.FC<BattleRouletteProps> = ({ 
    targetSkin, 
    isRolling, 
    caseSource 
}) => {
    const [items, setItems] = useState<Skin[]>([]);
    const [offset, setOffset] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (targetSkin && isRolling) {
            const newItems: Skin[] = [];
            for (let i = 0; i < WIN_INDEX + 15; i++) {
                if (i === WIN_INDEX) {
                    newItems.push(targetSkin);
                } else {
                    const randomSkin = caseSource.skins[Math.floor(Math.random() * caseSource.skins.length)];
                    newItems.push(randomSkin);
                }
            }
            setItems(newItems);

            const stripPosition = WIN_INDEX * CARD_FULL_WIDTH;
            const centerCardCorrection = CARD_WIDTH / 2;
            const jitter = (Math.random() - 0.5) * (CARD_WIDTH * 0.1);
            setOffset(stripPosition + centerCardCorrection + jitter);
        } else if (!isRolling && !targetSkin) {
            setOffset(0);
            if (caseSource && caseSource.skins.length >= 5) {
                setItems([caseSource.skins[0], caseSource.skins[1], caseSource.skins[2], caseSource.skins[3], caseSource.skins[4]]);
            }
        }
    }, [targetSkin, isRolling, caseSource]);

    return (
        <div ref={containerRef} className="relative w-full h-40 bg-[#050a14] rounded-xl overflow-hidden border-y-2 border-slate-800 shadow-[inset_0_0_20px_black] mb-4">
            {/* Scanner Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[4px] bg-yellow-500 z-30 shadow-[0_0_20px_rgba(234,179,8,1)] -translate-x-1/2 border-x border-yellow-300"></div>
            
            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617] z-20 pointer-events-none"></div>

            <div className="absolute top-0 bottom-0 left-1/2 flex items-center h-full will-change-transform" style={{ paddingLeft: -CARD_WIDTH/2 }}>
                <motion.div
                    className="flex gap-2"
                    initial={{ x: 0 }}
                    animate={{ x: isRolling ? -offset : 0 }}
                    transition={{ 
                        duration: isRolling ? 4 : 0, 
                        ease: [0.15, 0, 0.10, 1]
                    }}
                >
                    {items.map((skin, idx) => (
                        <div 
                            key={`${idx}`} 
                            className={`flex-shrink-0 relative flex flex-col items-center justify-center bg-[#0f172a] border rounded-lg p-2 overflow-hidden ${
                                skin.rarity === Rarity.LEGENDARY ? 'border-yellow-500 bg-yellow-900/10' :
                                skin.rarity === Rarity.MYTHIC ? 'border-red-600 bg-red-900/10' :
                                skin.rarity === Rarity.ULTRA ? 'border-pink-500' :
                                skin.rarity === Rarity.EPIC ? 'border-purple-500' :
                                skin.rarity === Rarity.RARE ? 'border-blue-600' : 'border-slate-800'
                            }`}
                            style={{ width: `${CARD_WIDTH}px`, height: '112px' }}
                        >
                             <img src={skin.image} className="w-full h-20 object-contain relative z-10" />
                             <div className={`absolute bottom-0 inset-x-0 h-1 z-10 ${
                                skin.rarity === Rarity.LEGENDARY ? 'bg-yellow-500 shadow-[0_0_10px_gold]' :
                                skin.rarity === Rarity.MYTHIC ? 'bg-red-600 shadow-[0_0_10px_red]' :
                                skin.rarity === Rarity.RARE ? 'bg-blue-600' : 'bg-slate-700'
                            }`}></div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

const Battles: React.FC<BattlesProps> = ({ onBattleComplete, balance, setBalance, setIsBattleActive }) => {
    const [step, setStep] = useState<'SETUP' | 'VS_ANIMATION' | 'BATTLE' | 'RESULT'>('SETUP');
    const [selectedCase, setSelectedCase] = useState<Case>(RIPTIDE_CASE);
    const [botCount, setBotCount] = useState(1);
    const [roundCount, setRoundCount] = useState(3);
    
    // Battle State
    const [currentRound, setCurrentRound] = useState(0);
    const [activeRoundTargets, setActiveRoundTargets] = useState<(Skin | null)[]>([null, null, null]); 
    const [history, setHistory] = useState<{player: Skin[], bot1: Skin[], bot2: Skin[]}>({ player: [], bot1: [], bot2: [] });
    const [isRolling, setIsRolling] = useState(false);
    
    // Totals
    const playerTotal = history.player.reduce((acc, s) => acc + s.price, 0);
    const bot1Total = history.bot1.reduce((acc, s) => acc + s.price, 0);
    const bot2Total = history.bot2.reduce((acc, s) => acc + s.price, 0);
    
    const COST = selectedCase.price * roundCount;
    const botNames = ['CyberViper', 'DropMaster_X'];

    const getRandomSkin = (c: Case) => {
        const roll = Math.random() * 100;
        if (c.id === 'gamma-case') {
             let pool: Skin[] = [];
             if (roll < 0.5) return c.skins.find(s => s.rarity === Rarity.LEGENDARY) || c.skins[0];
             else if (roll < 2.0) pool = c.skins.filter(s => s.rarity === Rarity.MYTHIC);
             else if (roll < 5.0) pool = c.skins.filter(s => s.rarity === Rarity.ULTRA);
             else if (roll < 15.0) pool = c.skins.filter(s => s.rarity === Rarity.EPIC);
             else pool = c.skins.filter(s => s.rarity === Rarity.RARE);
             
             if (pool.length === 0) return c.skins[0];
             return pool[Math.floor(Math.random() * pool.length)];
        } else {
             if (roll < 20) {
                 const rares = c.skins.filter(s => s.rarity === Rarity.RARE);
                 return rares[Math.floor(Math.random() * rares.length)];
             } else {
                 const consumers = c.skins.filter(s => s.rarity === Rarity.CONSUMER);
                 return consumers[Math.floor(Math.random() * consumers.length)];
             }
        }
    };

    const startBattle = () => {
        if (balance < COST) {
            alert("Недостаточно средств!");
            return;
        }
        setBalance(balance - COST);
        setIsBattleActive(true); // LOCK NAV
        setStep('VS_ANIMATION');
        
        // Start VS Animation Sequence
        setTimeout(() => {
            setStep('BATTLE');
            setCurrentRound(1);
            setHistory({ player: [], bot1: [], bot2: [] });
            processRound(1);
        }, 3000);
    };

    const processRound = (round: number) => {
        const pDrop = getRandomSkin(selectedCase);
        const b1Drop = getRandomSkin(selectedCase);
        const b2Drop = botCount === 2 ? getRandomSkin(selectedCase) : null;

        setActiveRoundTargets([pDrop, b1Drop, b2Drop]);
        setIsRolling(true);

        setTimeout(() => {
            setIsRolling(false);
            
            setHistory(prev => ({
                player: [pDrop, ...prev.player],
                bot1: [b1Drop, ...prev.bot1],
                bot2: b2Drop ? [b2Drop, ...prev.bot2] : prev.bot2
            }));

            if (round < roundCount) {
                setTimeout(() => {
                    setCurrentRound(r => r + 1);
                    processRound(round + 1);
                }, 2000);
            } else {
                setTimeout(() => finishBattle(), 1000);
            }
        }, 4500); 
    };

    const finishBattle = () => {
        setStep('RESULT');
    };

    const handleExit = () => {
        let winner = 'player';
        let maxScore = playerTotal;
        
        if (bot1Total > maxScore) { winner = 'bot1'; maxScore = bot1Total; }
        if (botCount === 2 && bot2Total > maxScore) { winner = 'bot2'; maxScore = bot2Total; }

        if (winner === 'player') {
            const allItems = [...history.player, ...history.bot1, ...history.bot2];
            onBattleComplete(allItems, maxScore);
        }
        
        setActiveRoundTargets([null, null, null]);
        setHistory({ player: [], bot1: [], bot2: [] });
        setIsBattleActive(false); // UNLOCK NAV
        setStep('SETUP');
    };

    const renderColumn = (playerType: 'PLAYER' | 'BOT1' | 'BOT2') => {
        const isMe = playerType === 'PLAYER';
        const name = isMe ? 'ВЫ' : (playerType === 'BOT1' ? botNames[0] : botNames[1]);
        const total = isMe ? playerTotal : (playerType === 'BOT1' ? bot1Total : bot2Total);
        const drops = isMe ? history.player : (playerType === 'BOT1' ? history.bot1 : history.bot2);
        
        const target = activeRoundTargets[isMe ? 0 : (playerType === 'BOT1' ? 1 : 2)];
        
        const maxTotal = Math.max(playerTotal, bot1Total, bot2Total);
        const isWinning = step === 'RESULT' && total > 0 && total === maxTotal;

        const baseBorder = isMe ? 'border-blue-500' : (playerType === 'BOT1' ? 'border-red-500' : 'border-orange-500');
        const borderColor = isWinning ? 'border-yellow-500' : (!isRolling && target ? baseBorder : 'border-slate-800');
        const shadowClass = isWinning ? 'shadow-[0_0_60px_rgba(234,179,8,0.4)]' : 'shadow-2xl';
        const bgClass = isWinning ? 'bg-gradient-to-b from-yellow-900/20 to-[#0b1221]' : 'bg-[#0b1221]';

        return (
            <div className={`flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 border-2 ${borderColor} ${shadowClass} ${bgClass} ${isWinning ? 'scale-105 z-10' : 'scale-100'}`}>
                {/* Header */}
                <div className="bg-[#020617]/80 p-4 flex justify-between items-center border-b border-slate-800 relative">
                    {isWinning && (
                        <div className="absolute top-0 right-0 p-2 animate-bounce">
                             <span className="text-2xl filter drop-shadow-[0_0_5px_gold]">👑</span>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg ${isWinning ? 'border-yellow-500 bg-yellow-900/20' : 'border-slate-700 bg-slate-800'}`}>
                            <span className={`font-bold text-xs ${isWinning ? 'text-yellow-500' : 'text-slate-400'}`}>{name[0]}</span>
                        </div>
                        <div>
                            <div className={`font-black uppercase italic tracking-wider ${isWinning ? 'text-yellow-500' : 'text-white'}`}>{name}</div>
                            {isMe && <div className="text-[9px] text-green-500 uppercase font-bold">ОНЛАЙН</div>}
                        </div>
                    </div>
                    <div className={`text-xl font-mono font-black ${isWinning ? 'text-yellow-400 drop-shadow-[0_0_10px_gold]' : 'text-slate-500'}`}>
                        ${total.toFixed(2)}
                    </div>
                </div>

                <div className="p-4 bg-slate-900/30 border-b border-slate-800">
                    <BattleRoulette 
                        key={currentRound} 
                        targetSkin={target} 
                        isRolling={isRolling} 
                        caseSource={selectedCase} 
                    />
                    
                    <div className="h-16 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {target && !isRolling && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }} 
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center"
                                >
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">{target.weapon}</div>
                                    <div className={`text-sm font-black uppercase italic ${
                                        target.rarity === Rarity.LEGENDARY ? 'text-yellow-500 drop-shadow-[0_0_10px_gold]' : 
                                        target.rarity === Rarity.MYTHIC ? 'text-red-500 drop-shadow-[0_0_10px_red]' : 
                                        target.rarity === Rarity.ULTRA ? 'text-pink-500' : 'text-white'
                                    }`}>
                                        {target.name}
                                    </div>
                                    <div className="text-green-500 font-mono text-xs font-bold mt-1">+${target.price.toFixed(2)}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex-1 p-2 overflow-y-auto space-y-1 custom-scrollbar max-h-[350px]">
                    <AnimatePresence initial={false}>
                        {drops.map((skin, idx) => (
                            <motion.div 
                                key={`${skin.id}-${idx}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${
                                    skin.rarity === Rarity.LEGENDARY ? 'bg-yellow-900/10 border-yellow-700/50' :
                                    skin.rarity === Rarity.MYTHIC ? 'bg-red-900/10 border-red-700/50' : 
                                    'bg-[#020617] border-slate-800/50'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-900/50 border ${
                                    skin.rarity === Rarity.LEGENDARY ? 'border-yellow-600' : 
                                    skin.rarity === Rarity.MYTHIC ? 'border-red-600' : 
                                    'border-slate-700'
                                }`}>
                                    <img src={skin.image} className="w-8 h-8 object-contain" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[8px] text-slate-500 font-bold uppercase truncate">{skin.weapon}</p>
                                    <p className={`text-[9px] font-black uppercase italic truncate ${
                                        skin.rarity === Rarity.LEGENDARY ? 'text-yellow-500' :
                                        skin.rarity === Rarity.MYTHIC ? 'text-red-500' : 'text-white'
                                    }`}>{skin.name}</p>
                                </div>
                                <div className="text-[10px] font-mono font-bold text-slate-400">
                                    ${skin.price.toFixed(2)}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        );
    };

    if (step === 'VS_ANIMATION') {
        return (
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
                <div className="flex gap-20 items-center">
                    <motion.div 
                        initial={{ x: -1000, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="text-center"
                    >
                        <div className="w-32 h-32 rounded-full border-4 border-blue-500 bg-slate-900 flex items-center justify-center mb-4 shadow-[0_0_50px_blue]">
                            <span className="text-4xl font-black text-blue-500">ВЫ</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-9xl font-black italic text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] z-10"
                    >
                        VS
                    </motion.div>

                    <motion.div 
                        initial={{ x: 1000, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="text-center"
                    >
                        <div className="w-32 h-32 rounded-full border-4 border-red-500 bg-slate-900 flex items-center justify-center mb-4 shadow-[0_0_50px_red]">
                            <span className="text-4xl font-black text-red-500">BOT</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (step === 'SETUP') {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white mb-2 text-center drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">Battle Arena</h1>
                <p className="text-center text-slate-500 font-bold uppercase tracking-widest text-xs mb-10">Сразитесь за весь куш</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                     <div className="bg-[#0b1221] border border-slate-800 p-8 rounded-[30px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-colors"></div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Выберите Кейс</h3>
                        <div className="space-y-4 relative z-10">
                            {[RIPTIDE_CASE, GAMMA_CASE].map(c => (
                                <div 
                                    key={c.id} 
                                    onClick={() => setSelectedCase(c)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${selectedCase.id === c.id ? 'border-blue-500 bg-blue-600/10 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'border-slate-800 hover:border-slate-600 bg-slate-900/50'}`}
                                >
                                    <div className="w-16 h-16 bg-slate-950 rounded-xl p-1 flex items-center justify-center border border-slate-800">
                                         <img src={c.image} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black uppercase italic text-lg">{c.name}</p>
                                        <p className="text-green-400 font-mono font-bold text-sm drop-shadow-md">${c.price}</p>
                                    </div>
                                    {selectedCase.id === c.id && (
                                        <div className="ml-auto w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                     </div>

                     <div className="bg-[#0b1221] border border-slate-800 p-8 rounded-[30px] shadow-2xl flex flex-col justify-between relative overflow-hidden">
                         <div className="absolute bottom-0 left-0 p-32 bg-red-600/5 blur-[80px] rounded-full"></div>
                         <div className="relative z-10">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Конфигурация</h3>
                            
                            <div className="mb-8">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-3">Количество Игроков</p>
                                <div className="flex gap-3 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
                                    <button onClick={() => setBotCount(1)} className={`flex-1 py-3 rounded-lg font-black text-xs uppercase transition-all ${botCount === 1 ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>1 на 1</button>
                                    <button onClick={() => setBotCount(2)} className={`flex-1 py-3 rounded-lg font-black text-xs uppercase transition-all ${botCount === 2 ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>1 на 2</button>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-3">Количество Раундов</p>
                                <div className="flex gap-2">
                                    {[1, 3, 5, 10].map(r => (
                                        <button key={r} onClick={() => setRoundCount(r)} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase border transition-all ${roundCount === r ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'}`}>{r}</button>
                                    ))}
                                </div>
                            </div>
                         </div>

                         <div className="relative z-10">
                             <div className="flex justify-between items-end mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                 <div>
                                     <p className="text-slate-500 font-bold uppercase text-[9px] mb-1">Итоговая стоимость</p>
                                     <p className="text-xs text-slate-400 font-medium">Спишется с баланса</p>
                                 </div>
                                 <span className="text-3xl font-mono font-black text-white tracking-tighter">${COST.toFixed(2)}</span>
                             </div>
                             <button 
                                onClick={startBattle}
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-5 rounded-2xl font-black text-xl uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(220,38,38,0.4)] transition-all active:scale-95 border-t border-white/20"
                            >
                                НАЧАТЬ БИТВУ
                            </button>
                         </div>
                     </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 h-[calc(100vh-140px)] flex flex-col animate-in fade-in zoom-in duration-300">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">АРЕНА</h1>
                    <p className="text-slate-500 font-medium text-xs">РАУНД {currentRound} / {roundCount}</p>
                </div>
                {step === 'RESULT' && (
                    <button 
                        onClick={handleExit}
                        className="bg-green-600 hover:bg-green-500 text-white font-black px-8 py-3 rounded-xl uppercase tracking-widest shadow-lg shadow-green-900/50 animate-bounce"
                    >
                        ЗАБРАТЬ ВЫИГРЫШ
                    </button>
                )}
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-0">
                {renderColumn('PLAYER')}
                {renderColumn('BOT1')}
                {botCount === 2 && renderColumn('BOT2')}
            </div>
        </div>
    );
};

export default Battles;
