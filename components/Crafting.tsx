
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InventoryItem, Rarity, Skin, SkinCondition } from '../types';
import { ALL_SKINS } from '../constants';

interface CraftingProps {
    inventory: InventoryItem[];
    onCraft: (ingredients: InventoryItem[], result: Skin, condition: SkinCondition) => void;
}

const Crafting: React.FC<CraftingProps> = ({ inventory, onCraft }) => {
    const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [resultSkin, setResultSkin] = useState<Skin | null>(null);
    const [criticalSuccess, setCriticalSuccess] = useState(false);
    
    // Slots for crafting
    const slots = [0, 1, 2, 3, 4];

    // Filter logic for selectable items
    const availableItems = inventory.filter(i => !selectedItems.find(s => s.instanceId === i.instanceId) && !i.isLocked);

    // Stats
    const inputTotal = selectedItems.reduce((acc, i) => acc + i.price, 0);

    // Quality Analysis Logic
    const getConditionScore = (condition: SkinCondition) => {
        if (condition === 'FACTORY_NEW' || condition === 'NO_WEAR') return 3;
        if (condition === 'FIELD_TESTED') return 2;
        return 1; // BATTLE_SCARRED
    };

    const avgQualityScore = selectedItems.length > 0 
        ? selectedItems.reduce((acc, i) => acc + getConditionScore(i.condition), 0) / selectedItems.length
        : 0;

    let critChance = 0.1; // Base 10%
    let qualityColor = 'bg-blue-600';
    let qualityLabel = 'NORMAL';

    if (avgQualityScore < 1.5) { 
        critChance = 0; // Mostly Battle Scarred -> 0%
        qualityColor = 'bg-red-600';
        qualityLabel = 'НИЗКОЕ (0% КРИТ)';
    } else if (avgQualityScore < 2.5) {
        critChance = 0.05; // Mostly Field Tested -> 5%
        qualityColor = 'bg-yellow-500';
        qualityLabel = 'СРЕДНЕЕ (5% КРИТ)';
    } else {
        critChance = 0.15; // Mostly Factory New -> 15% (Bonus)
        qualityColor = 'bg-green-500';
        qualityLabel = 'ВЫСОКОЕ (15% КРИТ)';
    }
    
    if (selectedItems.length === 0) {
        critChance = 0;
        qualityColor = 'bg-slate-700';
        qualityLabel = 'ОЖИДАНИЕ...';
    }

    const handleSelect = (item: InventoryItem) => {
        if (selectedItems.length >= 5) return;
        
        // Validation: Must be same rarity as first selected item
        if (selectedItems.length > 0 && selectedItems[0].rarity !== item.rarity) {
            alert("Все предметы должны быть одной редкости!");
            return;
        }
        
        if (item.rarity === Rarity.MYTHIC || item.rarity === Rarity.LEGENDARY) {
             alert("Красные и Золотые предметы нельзя использовать в контракте.");
             return;
        }

        setSelectedItems([...selectedItems, item]);
    };

    const handleDeselect = (instanceId: string) => {
        setSelectedItems(selectedItems.filter(i => i.instanceId !== instanceId));
    };

    const executeCraft = () => {
        if (selectedItems.length !== 5) return;
        setIsAnimating(true);

        const inputRarity = selectedItems[0].rarity;
        let outputRarity = Rarity.RARE;
        let isCrit = false;

        // Logic with Condition Modifier
        const roll = Math.random();
        
        // Determine Output Rarity Base
        let nextRarity = Rarity.RARE;
        let critRarity = Rarity.EPIC;

        if (inputRarity === Rarity.CONSUMER) { nextRarity = Rarity.RARE; critRarity = Rarity.EPIC; }
        else if (inputRarity === Rarity.RARE) { nextRarity = Rarity.EPIC; critRarity = Rarity.ULTRA; }
        else if (inputRarity === Rarity.EPIC) { nextRarity = Rarity.ULTRA; critRarity = Rarity.MYTHIC; }
        else if (inputRarity === Rarity.ULTRA) { nextRarity = Rarity.MYTHIC; critRarity = Rarity.LEGENDARY; }

        if (roll < critChance) {
            outputRarity = critRarity;
            isCrit = true;
        } else {
            outputRarity = nextRarity;
        }

        const pool = ALL_SKINS.filter(s => s.rarity === outputRarity);
        const result = pool[Math.floor(Math.random() * pool.length)];
        
        setTimeout(() => {
            setResultSkin(result);
            setCriticalSuccess(isCrit);
            onCraft(selectedItems, result, 'FACTORY_NEW');
            setSelectedItems([]);
        }, 3500); 
    };

    const resetCraft = () => {
        setIsAnimating(false);
        setResultSkin(null);
        setCriticalSuccess(false);
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <header className="mb-10">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Контракт Обмена</h1>
                <p className="text-slate-500 font-medium">Обменяйте 5 предметов. Качество скинов влияет на шанс крита.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* --- CONTRACT UI --- */}
                <div className="flex-1 flex flex-col">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                         {/* Background Grid */}
                         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                         {/* Slots */}
                         <div className="flex justify-center gap-4 mb-8 relative z-10 flex-wrap">
                            {slots.map((idx) => {
                                const item = selectedItems[idx];
                                return (
                                    <div 
                                        key={idx} 
                                        onClick={() => item && !isAnimating && handleDeselect(item.instanceId)}
                                        className={`w-24 h-32 rounded-xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all ${item ? 'border-green-500 bg-[#020617] cursor-pointer hover:border-red-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border-slate-800 border-dashed bg-slate-900/30'}`}
                                    >
                                        {item ? (
                                            <>
                                                <img src={item.image} className="w-20 h-20 object-contain relative z-10" />
                                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${item.rarity === 'RARE' ? 'blue' : item.rarity === 'EPIC' ? 'purple' : 'gray'}-500`}></div>
                                            </>
                                        ) : (
                                            <span className="text-slate-700 font-black text-2xl opacity-50">{idx + 1}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* QUALITY ANALYZER */}
                        <div className="w-full max-w-md bg-slate-950 rounded-xl p-4 border border-slate-800 mb-8 relative z-10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Анализатор Качества</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${qualityColor} text-white`}>{qualityLabel}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${qualityColor} transition-all duration-500`} style={{ width: `${(avgQualityScore / 3) * 100}%` }}></div>
                            </div>
                            <p className="text-[9px] text-slate-600 mt-2 font-bold uppercase">
                                Используйте скины качества Factory New, чтобы повысить шанс критического успеха.
                            </p>
                        </div>

                        {/* Middle Info */}
                        <div className="mb-8 text-center relative z-10">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">СУММА КОНТРАКТА</p>
                            <p className="text-2xl font-mono font-black text-white">${inputTotal.toFixed(2)}</p>
                        </div>

                        {/* Action Button */}
                        <div className="relative z-10">
                            <button 
                                disabled={selectedItems.length !== 5 || isAnimating}
                                onClick={executeCraft}
                                className={`px-20 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all ${
                                    selectedItems.length === 5 
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] transform hover:scale-105'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                            >
                                ПОДПИСАТЬ
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- INVENTORY PICKER --- */}
                <div className="w-full lg:w-[400px] bg-slate-900/50 border-l border-slate-800 p-6 h-[600px] flex flex-col">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Ваши предметы</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {availableItems.filter(i => (i.rarity !== Rarity.MYTHIC && i.rarity !== Rarity.LEGENDARY && i.rarity !== Rarity.GRAY)).length === 0 && (
                            <p className="text-center text-slate-600 text-xs py-10">Нет подходящих предметов</p>
                        )}
                        {availableItems
                            .filter(i => (i.rarity !== Rarity.MYTHIC && i.rarity !== Rarity.LEGENDARY && i.rarity !== Rarity.GRAY))
                            .map(item => (
                            <div 
                                key={item.instanceId}
                                onClick={() => !isAnimating && handleSelect(item)}
                                className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer hover:bg-slate-800 transition-colors ${
                                    selectedItems.length > 0 && item.rarity !== selectedItems[0].rarity 
                                        ? 'opacity-30 pointer-events-none border-slate-800' 
                                        : `bg-[#020617] border-slate-700 hover:border-slate-500`
                                }`}
                            >
                                <div className={`w-12 h-12 flex items-center justify-center rounded-lg border bg-slate-900 ${
                                    item.rarity === Rarity.ULTRA ? 'border-pink-500' :
                                    item.rarity === Rarity.EPIC ? 'border-purple-600' :
                                    item.rarity === Rarity.RARE ? 'border-blue-600' : 'border-slate-600'
                                }`}>
                                     <img src={item.image} className="w-10 h-10 object-contain" />
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-[9px] font-bold uppercase truncate ${
                                         item.rarity === Rarity.ULTRA ? 'text-pink-500' :
                                         item.rarity === Rarity.EPIC ? 'text-purple-500' :
                                         item.rarity === Rarity.RARE ? 'text-blue-500' : 'text-slate-500'
                                    }`}>{item.weapon}</p>
                                    <p className="text-xs font-black text-white uppercase italic truncate w-32">{item.name}</p>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className="text-[10px] font-mono font-bold text-slate-400">${item.price.toFixed(2)}</p>
                                    <p className={`text-[8px] font-bold ${
                                        item.condition === 'FACTORY_NEW' ? 'text-green-500' :
                                        item.condition === 'BATTLE_SCARRED' ? 'text-red-500' : 'text-yellow-500'
                                    }`}>{item.condition === 'FACTORY_NEW' ? 'FN' : item.condition === 'BATTLE_SCARRED' ? 'BS' : 'FT'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- ANIMATION OVERLAY --- */}
            <AnimatePresence>
                {isAnimating && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
                    >
                        {!resultSkin ? (
                            <div className="relative">
                                {/* Implosion Animation */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div 
                                        animate={{ scale: [1.5, 0], opacity: [0, 1, 0], rotate: 180 }}
                                        transition={{ duration: 3, ease: "easeInOut" }}
                                        className="w-96 h-96 rounded-full border-4 border-blue-500 shadow-[0_0_100px_blue]"
                                    ></motion.div>
                                    <motion.div 
                                        animate={{ scale: [2, 0], opacity: [0, 1, 0] }}
                                        transition={{ duration: 3.2, ease: "easeIn" }}
                                        className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl"
                                    ></motion.div>
                                </div>
                                <motion.p 
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2.5, times: [0, 0.5, 1] }}
                                    className="text-blue-400 font-mono font-bold tracking-[0.5em] text-2xl relative z-10"
                                >
                                    FUSION DETECTED
                                </motion.p>
                            </div>
                        ) : (
                            // RESULT REVEAL
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center"
                            >
                                {/* Glow behind item */}
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[100px] rounded-full pointer-events-none opacity-50 ${
                                    resultSkin.rarity === Rarity.LEGENDARY ? 'bg-yellow-600' :
                                    resultSkin.rarity === Rarity.MYTHIC ? 'bg-red-600' :
                                    resultSkin.rarity === Rarity.ULTRA ? 'bg-pink-600' :
                                    resultSkin.rarity === Rarity.EPIC ? 'bg-purple-600' : 'bg-blue-600'
                                }`}></div>

                                <motion.div 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="relative z-10"
                                >
                                    {criticalSuccess && (
                                        <div className="absolute -top-12 left-0 right-0 text-center">
                                            <span className="bg-yellow-500 text-black font-black px-4 py-1 rounded text-xs uppercase tracking-widest shadow-[0_0_20px_gold] animate-bounce">
                                                CRITICAL UPGRADE!
                                            </span>
                                        </div>
                                    )}
                                    <img src={resultSkin.image} className="w-80 h-80 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
                                </motion.div>

                                <div className="text-center mt-8 relative z-10">
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">{resultSkin.weapon}</p>
                                    <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">{resultSkin.name}</h2>
                                    
                                    <div className="flex items-center justify-center gap-6 mb-8">
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-500 uppercase">Вложено</p>
                                            <p className="font-mono text-slate-400 decoration-slate-600 line-through">${inputTotal.toFixed(2)}</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-700"></div>
                                        <div className="text-left">
                                            <p className="text-[9px] text-slate-500 uppercase">Получено</p>
                                            <p className="font-mono text-green-500 text-2xl font-black">${resultSkin.price.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={resetCraft}
                                        className="bg-white hover:bg-slate-200 text-black font-black px-12 py-4 rounded-xl text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
                                    >
                                        ЗАБРАТЬ
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Crafting;
