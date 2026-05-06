import React, { useState, useEffect } from 'react';
import { ViewType, Case, Skin, InventoryItem, MarketListing, Rarity, HistoryEntry, SkinCondition, Badge, Frame } from './types';
import { XP_PER_LEVEL, CONDITION_MULTIPLIERS, GAMMA_KNIVES, SEASON_3_LEVELS, SEASON_4_LEVELS, CYBER_BOX_LOOT } from './constants';
import Shop from './components/Shop';
import Inventory from './components/Inventory';
import Market from './components/Market';
import HomeS4 from './components/season4/HomeS4';
import CaseOpeningModal from './components/CaseOpeningModal';
import ProfileModal from './components/ProfileModal';
import DecryptionModal from './components/DecryptionModal'; 
import Crafting from './components/Crafting'; 
import Battles from './components/Battles'; 
import Upgrade from './components/Upgrade'; 
import BoxOpeningModal from './components/BoxOpeningModal';
import CapsuleOpeningModal from './components/season4/CapsuleOpeningModal';
import { AnimatePresence, motion } from 'framer-motion';

import Shop15 from './components/v1.5/Shop15';
import Inventory15 from './components/v1.5/Inventory15';
import CaseOpening15 from './components/v1.5/CaseOpening15';

// --- Components ---

const NotificationToast = ({ message, visible }: { message: string, visible: boolean }) => (
    <AnimatePresence>
        {visible && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-32 right-4 md:right-10 z-[60] bg-slate-900/90 backdrop-blur-md border border-green-500/50 pl-4 pr-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm"
            >
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-green-400 font-black text-xs uppercase tracking-widest mb-0.5">Система</h4>
                    <p className="text-white text-sm font-bold leading-tight">{message}</p>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

const AutoSaveIndicator = ({ saving }: { saving: boolean }) => (
    <div className={`fixed bottom-24 right-6 z-[50] flex items-center gap-3 transition-opacity duration-500 ${saving ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Автосохранение...</span>
    </div>
);

const ChoiceModal = ({ options, onSelect }: { options: Skin[], onSelect: (skin: Skin) => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
        <div className="max-w-4xl w-full">
            <h2 className="text-3xl font-black text-white text-center uppercase italic mb-2">Выберите Награду</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {options.map(skin => (
                    <div key={skin.id} onClick={() => onSelect(skin)} className="bg-slate-900 border border-yellow-500/30 hover:border-yellow-500 rounded-3xl p-8 cursor-pointer group transition-all hover:-translate-y-2">
                        <div className="relative h-48 flex items-center justify-center mb-6">
                            <img src={skin.image} className="max-w-full max-h-full object-contain relative z-10 drop-shadow-2xl" alt={skin.name} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-white italic uppercase">{skin.name}</h3>
                            <button className="w-full mt-8 bg-yellow-600 hover:bg-yellow-500 text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-colors">ВЫБРАТЬ</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<ViewType>('HOME'); 
    const [appVersion, setAppVersion] = useState<'1.0' | '1.5'>('1.0');
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [inventory15, setInventory15] = useState<InventoryItem[]>([]);
    const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
    const [openingCase, setOpeningCase] = useState<Case | null>(null);
    const [balance, setBalance] = useState<number>(500); 
    const [notification, setNotification] = useState({ message: '', visible: false });
    const [xp, setXp] = useState<number>(0);
    const [claimedLevels, setClaimedLevels] = useState<number[]>([]);
    const [username, setUsername] = useState<string>('Player');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Season 4 State
    const [premiumBoosts, setPremiumBoosts] = useState<number>(0);
    const [frames, setFrames] = useState<Frame[]>([]);
    const [equippedFrame, setEquippedFrame] = useState<Frame | null>(null);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [equippedBadge, setEquippedBadge] = useState<Badge | null>(null);
    const [openingBoxItem, setOpeningBoxItem] = useState<InventoryItem | null>(null);
    const [openingCapsuleItem, setOpeningCapsuleItem] = useState<InventoryItem | null>(null);
    const [choiceModalOpen, setChoiceModalOpen] = useState({ open: false, level: 0, options: [] as Skin[] });
    const [decryptingItem, setDecryptingItem] = useState<InventoryItem | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    const [accessKey] = useState(() => {
        const existing = localStorage.getItem('RIPTIDE_ACCESS_KEY');
        if (existing) return existing;
        const newKey = `RPT-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        localStorage.setItem('RIPTIDE_ACCESS_KEY', newKey);
        return newKey;
    });

    const calculateXpGain = (rarity: Rarity): number => {
        const xpMap = { [Rarity.LEGENDARY]: 5000, [Rarity.MYTHIC]: 1000, [Rarity.ULTRA]: 400, [Rarity.EPIC]: 150, [Rarity.RARE]: 50, [Rarity.CONSUMER]: 20 };
        return xpMap[rarity] || 10;
    };

    const showNotification = (msg: string) => {
        setNotification({ message: msg, visible: true });
        setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000);
    };

    useEffect(() => {
        const saved = localStorage.getItem('RIPTIDE_MASTER_DATA');
        if (saved) {
            const data = JSON.parse(saved);
            setInventory(data.inventory || []);
            setBalance(data.balance || 500);
            setXp(data.xp || 0);
            setClaimedLevels(data.claimedLevels || []);
            setUsername(data.username || 'Player');
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        setIsSaving(true);
        const data = { inventory, balance, xp, claimedLevels, username, history, marketListings, badges, frames };
        localStorage.setItem('RIPTIDE_MASTER_DATA', JSON.stringify(data));
        const timer = setTimeout(() => setIsSaving(false), 800);
        return () => clearTimeout(timer);
    }, [inventory, balance, xp, claimedLevels, username, isLoaded]);

    const handleWin = (skin: Skin, sourceCase: Case, condition: SkinCondition) => {
        const newItem: InventoryItem = {
            ...skin, price: skin.price * CONDITION_MULTIPLIERS[condition], condition,
            instanceId: `item-${Date.now()}`, acquiredAt: Date.now(), isSellable: true, isLocked: false
        };
        setInventory(prev => [newItem, ...prev]);
        setXp(prev => prev + calculateXpGain(skin.rarity));
    };

    const navItems = [
        { id: 'HOME', label: 'ГЛАВНАЯ' },
        { id: 'SHOP', label: 'МАГАЗИН' },
        { id: 'INVENTORY', label: 'ИНВЕНТАРЬ' },
        { id: 'UPGRADE', label: 'АПГРЕЙД' },
        { id: 'BATTLES', label: 'БИТВЫ' },
        { id: 'CRAFTING', label: 'КОНТРАКТ' },
        { id: 'MARKET', label: 'БИРЖА' },
    ];

    return (
        <div className="min-h-screen pb-44 text-slate-200 bg-[#020617] font-inter">
            <NotificationToast message={notification.message} visible={notification.visible} />
            <AutoSaveIndicator saving={isSaving} />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800 p-4 flex justify-between">
                <div onClick={() => setIsProfileOpen(true)} className="cursor-pointer font-black text-xl tracking-tighter">
                    {username.toUpperCase()} <span className="text-blue-500">LVL {Math.floor(xp / XP_PER_LEVEL)}</span>
                </div>
                <div className="text-green-400 font-mono font-bold">${balance.toFixed(2)}</div>
            </header>

            {/* Main Content */}
            <main className="pt-24 px-4">
                {activeView === 'HOME' && <HomeS4 xp={xp} claimedLevels={claimedLevels} onClaim={setClaimedLevels} />}
                {activeView === 'SHOP' && <Shop balance={balance} onOpenCase={setOpeningCase} />}
                {activeView === 'INVENTORY' && <Inventory items={inventory} onSell={(item) => {}} />}
                {activeView === 'MARKET' && <Market listings={marketListings} onBuy={() => {}} />}
                {activeView === 'UPGRADE' && <Upgrade inventory={inventory} onComplete={() => {}} />}
                {activeView === 'BATTLES' && <Battles inventory={inventory} onComplete={() => {}} />}
                {activeView === 'CRAFTING' && <Crafting inventory={inventory} onCraft={() => {}} />}
            </main>

            {/* Modals */}
            {openingCase && <CaseOpeningModal caseData={openingCase} onClose={() => setOpeningCase(null)} onWin={handleWin} />}
            {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} username={username} setUsername={setUsername} xp={xp} balance={balance} inventory={inventory} history={history} />}

            {/* Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[#020617]/90 backdrop-blur-md border-t border-slate-800 p-4 flex justify-around">
                {navItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => setActiveView(item.id as ViewType)}
                        className={`text-[10px] font-bold ${activeView === item.id ? 'text-blue-500' : 'text-slate-500'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default App;