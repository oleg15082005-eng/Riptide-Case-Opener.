
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InventoryItem, Skin, Rarity, SkinCondition } from '../types';
import { ALL_SKINS, CONDITION_MULTIPLIERS } from '../constants';

interface UpgradeProps {
    inventory: InventoryItem[];
    onUpgradeConfirm: (userItem: InventoryItem, targetSkin: Skin, success: boolean) => void;
}

const Upgrade: React.FC<UpgradeProps> = ({ inventory, onUpgradeConfirm }) => {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [targetSkin, setTargetSkin] = useState<Skin | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<'WIN' | 'LOSS' | null>(null);
    const [filterRarity, setFilterRarity] = useState<Rarity | 'ALL'>('ALL');

    // Filter logic
    const availableItems = inventory.filter(i => !i.isLocked && i.isSellable);
    
    const targetPool = ALL_SKINS.filter(s => {
        if (s.rarity === Rarity.LEGENDARY && s.id === 'question_mark') return false; 
        if (filterRarity !== 'ALL' && s.rarity !== filterRarity) return false;
        if (selectedItem && s.price < selectedItem.price) return false; 
        return true;
    }).sort((a, b) => a.price - b.price);

    const calculateChance = () => {
        if (!selectedItem || !targetSkin) return 0;
        let chance = (selectedItem.price / targetSkin.price) * 100;
        if (chance > 95) chance = 95; 
        if (chance < 1) chance = 1;   
        return chance;
    };

    const chance = calculateChance();
    
    const handleUpgrade = () => {
        if (!selectedItem || !targetSkin || isRolling) return;
        setIsRolling(true);
        setResult(null);

        const roll = Math.random() * 100;
        const isWin = roll <= chance;
        
        const winSectorDeg = (chance / 100) * 360;
        const fullSpins = 360 * 10; 

        let finalAngle;
        if (isWin) {
            // Target: 0 to winSectorDeg
            finalAngle = Math.random() * (winSectorDeg - 4) + 2; 
        } else {
            // Target: winSectorDeg to 360
            finalAngle = Math.random() * (360 - winSectorDeg - 4) + winSectorDeg + 2;
        }

        const totalRotation = fullSpins + finalAngle;
        setRotation(totalRotation);

        setTimeout(() => {
            setIsRolling(false);
            setResult(isWin ? 'WIN' : 'LOSS');
            onUpgradeConfirm(selectedItem, targetSkin, isWin);
            setSelectedItem(null);
            setRotation(0); 
        }, 5500);
    };

    // SVG Config
    const radius = 50;
    const center = 50;
    
    const getCoordinatesForPercent = (percent: number) => {
        const x = center + radius * Math.cos(2 * Math.PI * percent);
        const y = center + radius * Math.sin(2 * Math.PI * percent);
        return [x, y];
    };
    
    const percentage = chance / 100;
    const [startX, startY] = getCoordinatesForPercent(-0.25); // Top
    const [endX, endY] = getCoordinatesForPercent(percentage - 0.25);
    const largeArcFlag = percentage > 0.5 ? 1 : 0;

    const pathData = `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

    return (
        <div className="max-w-[1600px] mx-auto py-8 px-4 h-[calc(100vh-140px)] flex flex-col">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Апгрейд</h1>
                    <p className="text-slate-500 font-medium text-xs">Улучшенная система визуализации. Рискните всем.</p>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                
                {/* LEFT: Inventory */}
                <div className="w-full lg:w-1/4 bg-[#0b1221] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-slate-800 bg-[#020617]">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Исходный материал</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {availableItems.length === 0 && <p className="text-center text-slate-600 text-xs mt-10">Нет предметов</p>}
                        {availableItems.map(item => (
                            <div 
                                key={item.instanceId}
                                onClick={() => !isRolling && setSelectedItem(item)}
                                className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all ${
                                    selectedItem?.instanceId === item.instanceId 
                                        ? 'bg-blue-600/20 border-blue-500 shadow-[inset_0_0_10px_rgba(37,99,235,0.2)]' 
                                        : 'bg-[#0f172a] border-slate-800 hover:border-slate-600'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-900 border ${
                                    item.rarity === Rarity.LEGENDARY ? 'border-yellow-600' : 
                                    item.rarity === Rarity.MYTHIC ? 'border-red-600' : 
                                    item.rarity === Rarity.ULTRA ? 'border-pink-500' :
                                    item.rarity === Rarity.EPIC ? 'border-purple-600' : 
                                    item.rarity === Rarity.RARE ? 'border-blue-600' : 'border-slate-600'
                                }`}>
                                    <img src={item.image} className="w-8 h-8 object-contain" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase truncate">{item.weapon}</p>
                                    <p className="text-[10px] font-black text-white uppercase truncate">{item.name}</p>
                                </div>
                                <div className="text-[10px] font-mono font-bold text-slate-400">
                                    ${item.price.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CENTER: The Machine */}
                <div className="flex-1 bg-[#020617] border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                     {/* Dynamic Background */}
                     <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617] transition-opacity duration-1000 ${isRolling ? 'opacity-100 animate-pulse' : 'opacity-20'}`}></div>
                     <div className="absolute inset-0 market-grid opacity-30 pointer-events-none"></div>
                     
                     {/* Items Display */}
                     <div className="flex items-center gap-12 mb-12 z-10 w-full justify-center">
                        {/* User Item */}
                        <div className="flex flex-col items-center gap-3">
                             <div className={`w-28 h-28 rounded-3xl border-2 flex items-center justify-center bg-[#0b1221] shadow-2xl relative ${selectedItem ? 'border-blue-500 shadow-blue-900/20' : 'border-slate-800 border-dashed'}`}>
                                {selectedItem && <img src={selectedItem.image} className="w-24 h-24 object-contain drop-shadow-xl" />}
                                {isRolling && <div className="absolute inset-0 border-2 border-blue-500 rounded-3xl animate-ping opacity-20"></div>}
                             </div>
                             {selectedItem ? (
                                 <div className="text-center">
                                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{selectedItem.weapon}</p>
                                     <p className="text-xs font-black text-white mt-0.5">${selectedItem.price.toFixed(2)}</p>
                                 </div>
                             ) : <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">ВХОД</p>}
                        </div>

                        {/* Animated Arrow */}
                        <div className={`text-slate-600 transition-colors duration-500 ${isRolling ? 'text-white drop-shadow-[0_0_10px_white]' : ''}`}>
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </div>

                        {/* Target Item */}
                        <div className="flex flex-col items-center gap-3">
                             <div className={`w-28 h-28 rounded-3xl border-2 flex items-center justify-center bg-[#0b1221] shadow-2xl relative ${targetSkin ? 'border-green-500 shadow-green-900/20' : 'border-slate-800 border-dashed'}`}>
                                {targetSkin && <img src={targetSkin.image} className="w-24 h-24 object-contain drop-shadow-xl" />}
                                {isRolling && <div className="absolute inset-0 border-2 border-green-500 rounded-3xl animate-ping opacity-20" style={{ animationDelay: '0.2s' }}></div>}
                             </div>
                             {targetSkin ? (
                                 <div className="text-center">
                                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{targetSkin.weapon}</p>
                                     <p className="text-xs font-black text-green-400 mt-0.5">${targetSkin.price.toFixed(2)}</p>
                                 </div>
                             ) : <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">ВЫХОД</p>}
                        </div>
                     </div>

                     {/* THE PIE CHART CIRCLE */}
                     <motion.div 
                        className="relative w-80 h-80 flex items-center justify-center mb-8"
                        animate={isRolling ? { scale: [1, 1.02, 1], filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity }}
                     >
                         
                         {/* Ring Glow */}
                         {chance > 0 && <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 transition-all duration-500 ${chance > 50 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>}

                         {/* Static Pie Chart Background */}
                         <div className="w-full h-full rounded-full bg-slate-900 border-[6px] border-slate-800 relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">
                             {/* Base Gray (Loss) */}
                             <div className="absolute inset-0 bg-[#1e293b]"></div>
                             
                             {/* Green Slice (Win) */}
                             <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform transition-all duration-500">
                                 {chance < 100 && chance > 0 && (
                                     <path d={pathData} fill="#22c55e" className="drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                                 )}
                                 {chance >= 100 && <circle cx="50" cy="50" r="50" fill="#22c55e" />}
                             </svg>

                             {/* Inner Grid Decoration */}
                             <div className="absolute inset-0 border-[40px] border-transparent rounded-full" style={{ backgroundImage: 'radial-gradient(transparent 65%, #020617 66%)' }}></div>
                         </div>

                         {/* Spinning Needle Container */}
                         <motion.div 
                            className="absolute inset-0 z-20"
                            animate={{ rotate: rotation }}
                            initial={{ rotate: 0 }}
                            transition={{ duration: 5, ease: [0.2, 0, 0, 1] }} 
                         >
                             {/* The Needle Graphic */}
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1/2 origin-bottom flex flex-col justify-start pt-1">
                                 <div className="w-6 h-8 bg-white shadow-[0_0_20px_white] [clip-path:polygon(50%_100%,0%_0%,100%_0%)]"></div>
                             </div>
                         </motion.div>

                         {/* Center Hub */}
                         <div className="absolute z-30 w-28 h-28 bg-[#0f172a] rounded-full border-[6px] border-slate-700 flex flex-col items-center justify-center shadow-2xl">
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">ШАНС</p>
                             <p className={`text-3xl font-mono font-black ${chance > 50 ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'text-yellow-400'}`}>
                                 {chance.toFixed(2)}%
                             </p>
                         </div>
                     </motion.div>
                    
                    {/* Action Button */}
                    <button 
                        onClick={handleUpgrade}
                        disabled={!selectedItem || !targetSkin || isRolling}
                        className={`w-72 py-5 rounded-2xl font-black text-xl uppercase tracking-[0.2em] transition-all relative overflow-hidden group ${
                            isRolling ? 'bg-slate-800 text-slate-500 cursor-wait' :
                            (!selectedItem || !targetSkin) ? 'bg-slate-800 text-slate-600 cursor-not-allowed' :
                            'bg-white text-black hover:bg-green-400 shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95'
                        }`}
                    >
                        <span className="relative z-10">{isRolling ? 'СИНХРОНИЗАЦИЯ...' : 'ЗАПУСТИТЬ'}</span>
                        {!isRolling && selectedItem && targetSkin && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>}
                    </button>
                    
                    {/* RESULT MODAL */}
                    <AnimatePresence>
                        {result && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center flex-col"
                            >
                                {/* Burst Effect for Win */}
                                {result === 'WIN' && (
                                    <motion.div 
                                        initial={{ scale: 0 }} 
                                        animate={{ scale: [0, 1.5, 2], opacity: [1, 0] }}
                                        transition={{ duration: 0.8 }}
                                        className="absolute w-[600px] h-[600px] rounded-full bg-green-500 blur-[100px]"
                                    ></motion.div>
                                )}

                                <motion.div
                                    initial={{ scale: 0.5, y: 50 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="relative z-10 text-center"
                                >
                                    <h2 className={`text-8xl font-black uppercase italic tracking-tighter mb-6 ${result === 'WIN' ? 'text-transparent bg-clip-text bg-gradient-to-b from-white to-green-400 drop-shadow-[0_0_30px_rgba(74,222,128,0.8)]' : 'text-slate-800'}`}>
                                        {result === 'WIN' ? 'УСПЕХ' : 'ПРОВАЛ'}
                                    </h2>
                                    
                                    {result === 'WIN' ? (
                                        <div className="flex flex-col items-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-green-500 blur-[60px] opacity-40"></div>
                                                <img src={targetSkin?.image} className="w-64 h-64 object-contain relative z-10 drop-shadow-2xl" />
                                            </div>
                                            <p className="text-white font-bold uppercase tracking-widest mt-4 text-sm">{targetSkin?.name}</p>
                                        </div>
                                    ) : (
                                        <div className="text-slate-600 font-mono text-xs uppercase tracking-widest mt-4">
                                            ПРЕДМЕТ УНИЧТОЖЕН
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => setResult(null)}
                                        className="mt-12 bg-slate-800 hover:bg-white hover:text-black text-white font-black px-10 py-4 rounded-xl uppercase tracking-widest transition-all"
                                    >
                                        ПРОДОЛЖИТЬ
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* RIGHT: Target Selection */}
                <div className="w-full lg:w-1/4 bg-[#0b1221] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-slate-800 bg-[#020617] flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Цель</h3>
                        <select 
                            value={filterRarity} 
                            onChange={(e) => setFilterRarity(e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 text-[10px] text-white p-1 rounded uppercase font-bold outline-none cursor-pointer hover:border-slate-500"
                        >
                            <option value="ALL">Все</option>
                            <option value={Rarity.RARE}>Редкое</option>
                            <option value={Rarity.EPIC}>Эпическое</option>
                            <option value={Rarity.ULTRA}>Ультра</option>
                            <option value={Rarity.MYTHIC}>Мифическое</option>
                        </select>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                         {targetPool.map(skin => (
                            <div 
                                key={skin.id}
                                onClick={() => !isRolling && setTargetSkin(skin)}
                                className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all ${
                                    targetSkin?.id === skin.id 
                                        ? 'bg-green-600/20 border-green-500 shadow-[inset_0_0_10px_rgba(34,197,94,0.2)]' 
                                        : 'bg-[#0f172a] border-slate-800 hover:border-slate-600'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-900 border ${
                                    skin.rarity === Rarity.LEGENDARY ? 'border-yellow-600' : 
                                    skin.rarity === Rarity.MYTHIC ? 'border-red-600' : 
                                    skin.rarity === Rarity.ULTRA ? 'border-pink-500' :
                                    skin.rarity === Rarity.EPIC ? 'border-purple-600' : 
                                    skin.rarity === Rarity.RARE ? 'border-blue-600' : 'border-slate-600'
                                }`}>
                                    <img src={skin.image} className="w-8 h-8 object-contain" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase truncate">{skin.weapon}</p>
                                    <p className="text-[10px] font-black text-white uppercase truncate">{skin.name}</p>
                                </div>
                                <div className="text-[10px] font-mono font-bold text-slate-400">
                                    ${skin.price.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Upgrade;
