import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skin, Rarity } from '../types';

interface BoxOpeningModalProps {
    onClose: () => void;
    onComplete: (skin: Skin) => void;
    lootTable: Record<Rarity, Skin[]>;
}

const BoxOpeningModal: React.FC<BoxOpeningModalProps> = ({ onClose, onComplete, lootTable }) => {
    const [progress, setProgress] = useState(0);
    const [isHacking, setIsHacking] = useState(false);
    const [hackStage, setHackStage] = useState(0); // 0: Idle, 1: Hacking, 2: Success/Reveal
    const [revealedItem, setRevealedItem] = useState<Skin | null>(null);

    // Zones for clicking
    const zones = [
        { id: 1, x: '10%', y: '20%', w: '30%', h: '15%' },
        { id: 2, x: '60%', y: '30%', w: '25%', h: '20%' },
        { id: 3, x: '20%', y: '60%', w: '40%', h: '10%' },
        { id: 4, x: '70%', y: '70%', w: '20%', h: '15%' },
    ];

    const [activeZone, setActiveZone] = useState<number | null>(null);

    useEffect(() => {
        if (isHacking && progress < 100) {
            const timer = setInterval(() => {
                setProgress(prev => Math.min(100, prev + 1.5));
            }, 20);
            return () => clearInterval(timer);
        } else if (progress >= 100 && hackStage === 1) {
            handleSuccess();
        }
    }, [isHacking, progress, hackStage]);

    const handleZoneClick = (id: number) => {
        if (hackStage !== 0) return;
        setActiveZone(id);
        setIsHacking(true);
        setHackStage(1);
    };

    const handleSuccess = () => {
        setHackStage(2);
        
        // Determine reward
        const rand = Math.random();
        let rarity = Rarity.EPIC;
        if (rand > 0.90) rarity = Rarity.MYTHIC; // 10%
        else if (rand > 0.70) rarity = Rarity.ULTRA; // 20%
        // else 70% EPIC

        const pool = (lootTable && lootTable[rarity]) || [];
        const item = pool[Math.floor(Math.random() * pool.length)];
        
        setTimeout(() => {
            setRevealedItem(item);
        }, 1500); // Delay for explosion animation
    };

    const handleClaim = () => {
        if (revealedItem) {
            onComplete(revealedItem);
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

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05]" style={{ backgroundSize: '40px 40px' }}></div>

            {hackStage < 2 && (
                <div className="relative w-full h-full max-w-4xl max-h-[80vh] border-2 border-green-500/30 rounded-3xl bg-slate-900/80 backdrop-blur-md p-8 m-4 shadow-[0_0_100px_rgba(34,197,94,0.1)]">
                    <h2 className="text-3xl font-black text-green-500 uppercase tracking-widest text-center mb-8 glitch-text">
                        {hackStage === 0 ? "ВЫБЕРИТЕ ЗОНУ ВЗЛОМА" : "ВЗЛОМ ПРОТОКОЛА..."}
                    </h2>

                    {/* Progress Bar */}
                    {hackStage === 1 && (
                        <div className="absolute top-24 left-8 right-8 h-4 bg-slate-800 rounded-full overflow-hidden border border-green-900">
                            <motion.div 
                                className="h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {/* Zones */}
                    <div className="relative w-full h-[60vh] border border-slate-700/50 rounded-xl bg-slate-950/50 overflow-hidden">
                        {zones.map(zone => (
                            <motion.button
                                key={zone.id}
                                onClick={() => handleZoneClick(zone.id)}
                                className={`absolute border-2 ${activeZone === zone.id ? 'border-green-400 bg-green-500/20' : 'border-green-800/50 hover:border-green-500 hover:bg-green-500/10'} transition-all group`}
                                style={{ left: zone.x, top: zone.y, width: zone.w, height: zone.h }}
                                disabled={hackStage !== 0}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="absolute top-2 left-2 text-[10px] font-mono text-green-500/70 group-hover:text-green-400">ЗОНА-{zone.id}</div>
                                {activeZone === zone.id && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-[1px] bg-green-500 animate-scan-y"></div>
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Explosion / Reveal Animation */}
            {hackStage === 2 && !revealedItem && (
                <div className="absolute inset-0 flex items-center justify-center bg-white animate-flash-bang">
                    {/* This div flashes white then fades to reveal item */}
                </div>
            )}

            {/* Item Reveal */}
            {revealedItem && (
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <div className="relative">
                        <div className={`absolute inset-0 blur-[100px] opacity-50 ${
                            revealedItem.rarity === Rarity.MYTHIC ? 'bg-red-600' :
                            revealedItem.rarity === Rarity.ULTRA ? 'bg-pink-600' : 'bg-purple-600'
                        }`}></div>
                        
                        <motion.img 
                            src={revealedItem.image} 
                            alt={revealedItem.name}
                            className="w-64 h-64 object-contain relative z-10 drop-shadow-2xl"
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="text-center mt-8 space-y-2">
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`text-sm font-black uppercase tracking-[0.3em] ${
                                revealedItem.rarity === Rarity.MYTHIC ? 'text-red-500' :
                                revealedItem.rarity === Rarity.ULTRA ? 'text-pink-500' : 'text-purple-500'
                            }`}
                        >
                            {getRarityLabel(revealedItem.rarity)}
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-black text-white uppercase italic"
                        >
                            {revealedItem.name}
                        </motion.h2>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            onClick={handleClaim}
                            className="mt-8 px-12 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            ЗАБРАТЬ
                        </motion.button>
                    </div>
                </motion.div>
            )}

            <style>{`
                @keyframes scan-y {
                    0% { transform: translateY(-50px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(50px); opacity: 0; }
                }
                .animate-scan-y {
                    animation: scan-y 2s linear infinite;
                }
                @keyframes flash-bang {
                    0% { opacity: 1; background: white; }
                    100% { opacity: 0; background: transparent; pointer-events: none; }
                }
                .animate-flash-bang {
                    animation: flash-bang 1.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default BoxOpeningModal;
