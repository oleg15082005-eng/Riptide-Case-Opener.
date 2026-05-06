
import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, Case, Skin, InventoryItem, MarketListing, BPReward, Rarity, HistoryEntry, SkinCondition, Badge, Frame } from './types';
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

const NotificationToast = ({ message, visible }: { message: string, visible: boolean }) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, x: 0 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-32 md:bottom-28 right-4 md:right-10 z-[60] bg-slate-900/90 backdrop-blur-md border border-green-500/50 pl-4 pr-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 max-w-sm"
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
};

const AutoSaveIndicator = ({ saving }: { saving: boolean }) => {
    return (
        <div className={`fixed bottom-24 right-6 z-[50] flex items-center gap-3 transition-opacity duration-500 ${saving ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Автосохранение...</span>
        </div>
    );
};

const ChoiceModal = ({ options, onSelect }: { options: Skin[], onSelect: (skin: Skin) => void }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <div className="max-w-4xl w-full">
                <h2 className="text-3xl font-black text-white text-center uppercase italic mb-2">Выберите Награду</h2>
                <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs mb-10">Элитный предмет (Не для продажи)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {options.map(skin => (
                        <div 
                            key={skin.id} 
                            onClick={() => onSelect(skin)}
                            className="bg-slate-900 border border-yellow-500/30 hover:border-yellow-500 rounded-3xl p-8 cursor-pointer group transition-all hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(234,179,8,0.2)]"
                        >
                            <div className="relative h-48 flex items-center justify-center mb-6">
                                <div className="absolute inset-0 bg-yellow-500 blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
                                <img src={skin.image} className="max-w-full max-h-full object-contain relative z-10 drop-shadow-2xl" />
                            </div>
                            <div className="text-center">
                                <p className="text-yellow-500 font-black uppercase text-xs tracking-widest mb-1">Легендарное</p>
                                <h3 className="text-2xl font-black text-white italic uppercase">{skin.name}</h3>
                                <p className="text-slate-500 font-bold text-xs mt-1">{skin.weapon}</p>
                            </div>
                            <button className="w-full mt-8 bg-yellow-600 hover:bg-yellow-500 text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-colors">
                                ВЫБРАТЬ ЭТОТ
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SellModal = ({ item, onClose, onConfirm }: { item: InventoryItem, onClose: () => void, onConfirm: (price: number) => void }) => {
  const [price, setPrice] = useState(item.price.toFixed(2));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-black text-white uppercase italic mb-6 text-center">Продажа предмета</h3>
        
        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl mb-6 border border-slate-800">
          <img src={item.image} alt="" className="w-20 h-20 object-contain" />
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">{item.weapon}</div>
            <div className="text-sm font-black text-white uppercase italic">{item.name}</div>
            {item.isSellable ? (
                <div className="text-[10px] text-green-500 mt-1">Рынок: ${item.price.toFixed(2)}</div>
            ) : (
                <div className="text-[10px] text-red-500 mt-1">Не продается</div>
            )}
          </div>
        </div>

        {item.isSellable ? (
            <>
                <div className="mb-6">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Ваша цена ($)</label>
                <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 text-white font-mono text-xl p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    step="0.01"
                />
                </div>

                <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 bg-slate-800 text-slate-400 font-bold py-4 rounded-xl hover:bg-slate-700 transition-colors uppercase text-xs tracking-widest">
                    Отмена
                </button>
                <button 
                    onClick={() => {
                    const val = parseFloat(price);
                    if (val > 0) onConfirm(val);
                    }} 
                    className="flex-1 bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-500 transition-colors uppercase text-xs tracking-widest shadow-lg shadow-green-900/20"
                >
                    Выставить
                </button>
                </div>
            </>
        ) : (
            <div className="text-center">
                 <p className="text-red-400 font-bold text-sm mb-6">Этот предмет является коллекционным и не подлежит продаже на бирже.</p>
                 <button onClick={onClose} className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl uppercase text-xs tracking-widest">
                    Закрыть
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('HOME'); 
  const [appVersion, setAppVersion] = useState<'1.0' | '1.5'>('1.0');
  const [showVersionWarning, setShowVersionWarning] = useState(false);
  const [openingCase15, setOpeningCase15] = useState<Case | null>(null);

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventory15, setInventory15] = useState<InventoryItem[]>([]);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
  const [openingCase, setOpeningCase] = useState<Case | null>(null);
  const [balance, setBalance] = useState<number>(500); 
  const [sellingItem, setSellingItem] = useState<InventoryItem | null>(null);
  const [notification, setNotification] = useState<{message: string, visible: boolean}>({ message: '', visible: false });
  
  const [xp, setXp] = useState<number>(0);
  const [claimedLevels, setClaimedLevels] = useState<number[]>([]);
  const [consumedDiscountLevels, setConsumedDiscountLevels] = useState<number[]>([]);
  const [username, setUsername] = useState<string>('Player');
  
  // Season 4 State
  const [premiumBoosts, setPremiumBoosts] = useState<number>(0);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [equippedFrame, setEquippedFrame] = useState<Frame | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [equippedBadge, setEquippedBadge] = useState<Badge | null>(null);
  const [openingBoxItem, setOpeningBoxItem] = useState<InventoryItem | null>(null);
  const [openingCapsuleItem, setOpeningCapsuleItem] = useState<InventoryItem | null>(null);

  const [choiceModalOpen, setChoiceModalOpen] = useState<{open: boolean, level: number, options: Skin[]}>({ open: false, level: 0, options: [] });
  
  const [decryptingItem, setDecryptingItem] = useState<InventoryItem | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Battle State Lock
  const [isBattleActive, setIsBattleActive] = useState(false);
  
  const [accessKey] = useState(() => {
    const existing = localStorage.getItem('RIPTIDE_ACCESS_KEY');
    if (existing) return existing;
    const newKey = 'RPT-' + Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    localStorage.setItem('RIPTIDE_ACCESS_KEY', newKey);
    return newKey;
  });

  const isSeason1Complete = claimedLevels.includes(21);

  // --- XP SYSTEM ---
  const calculateXpGain = (rarity: Rarity): number => {
    switch (rarity) {
        case Rarity.LEGENDARY: return 5000;
        case Rarity.MYTHIC: return 1000;
        case Rarity.ULTRA: return 400;
        case Rarity.EPIC: return 150;
        case Rarity.RARE: return 50;
        case Rarity.CONSUMER: return 20;
        default: return 10;
    }
  };

  useEffect(() => {
    try {
        const masterDataString = localStorage.getItem('RIPTIDE_MASTER_DATA');
        if (masterDataString) {
            const data = JSON.parse(masterDataString);
            loadStateFromData(data);
        }
    } catch (e) {
        console.error("Critical Load Error:", e);
    } finally {
        setIsLoaded(true);
    }
  }, []); 

  const loadStateFromData = (data: any) => {
    const migratedInventory = data.inventory ? data.inventory.map((item: any) => ({
        ...item,
        condition: item.condition || 'FIELD_TESTED',
        isLocked: item.isLocked || false // default to false
    })) : [];

    setInventory(migratedInventory);
    if (data.marketListings) setMarketListings(data.marketListings);
    if (typeof data.balance === 'number') setBalance(data.balance);
    
    // Season 4 Migration Logic
    if (data.currentSeason === 4 && data.season4MigrationComplete) {
        if (typeof data.xp === 'number') setXp(data.xp);
        if (data.claimedLevels) setClaimedLevels(data.claimedLevels);
        if (typeof data.premiumBoosts === 'number') setPremiumBoosts(data.premiumBoosts);
        if (data.frames) setFrames(data.frames);
        if (data.equippedFrame) setEquippedFrame(data.equippedFrame);
    } else {
        // Reset for new season (force migration)
        console.log("Migrating to Season 4...");
        setXp(0);
        setClaimedLevels([]);
        setConsumedDiscountLevels([]); // Reset consumed discounts
        setPremiumBoosts(0);
    }

    if (data.history) setHistory(data.history);
    if (data.consumedDiscountLevels) setConsumedDiscountLevels(data.consumedDiscountLevels);
    if (data.username) setUsername(data.username);
    if (data.badges) setBadges(data.badges);
    if (data.equippedBadge) setEquippedBadge(data.equippedBadge);
    if (typeof data.premiumBoosts === 'number') setPremiumBoosts(data.premiumBoosts);
    if (data.frames) setFrames(data.frames);
    if (data.equippedFrame) setEquippedFrame(data.equippedFrame);
  };

  useEffect(() => {
    if (!isLoaded) return; 
    setIsSaving(true);
    const saveData = { 
        version: 1, 
        currentSeason: 4, // Mark as Season 4 data
        season4MigrationComplete: true, // Flag to indicate successful migration
        timestamp: Date.now(), 
        inventory, 
        balance, 
        xp, 
        claimedLevels, 
        history, 
        marketListings, 
        consumedDiscountLevels, 
        username, 
        badges, 
        equippedBadge,
        premiumBoosts,
        frames,
        equippedFrame
    };
    const json = JSON.stringify(saveData);
    localStorage.setItem('RIPTIDE_MASTER_DATA', json);
    localStorage.setItem(accessKey, json);
    const timer = setTimeout(() => setIsSaving(false), 800);
    return () => clearTimeout(timer);
  }, [inventory, marketListings, balance, xp, claimedLevels, history, isLoaded, accessKey, consumedDiscountLevels, username, badges, equippedBadge]);

  useEffect(() => {
      const handleStorageChange = (e: StorageEvent) => {
          if (e.key === accessKey && e.newValue) {
              try {
                  const data = JSON.parse(e.newValue);
                  loadStateFromData(data);
                  showNotification('Данные обновлены извне');
              } catch (err) { }
          }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
  }, [accessKey]);

  const handleImportData = (data: any) => {
      if (!data) return;
      try {
          loadStateFromData(data);
          showNotification('Данные успешно восстановлены!');
          setIsProfileOpen(false);
      } catch (e) {
          alert('Ошибка при чтении файла сохранения.');
      }
  };

  const showNotification = (msg: string) => {
      setNotification({ message: msg, visible: true });
      setTimeout(() => {
          setNotification(prev => ({ ...prev, visible: false }));
      }, 4000);
  };

  useEffect(() => {
    const botInterval = setInterval(() => {
      if (marketListings.length === 0) return;
      setMarketListings(prev => {
        const next = [...prev];
        let sold = false;
        let info = { name: '', price: 0 };
        for (let i = next.length - 1; i >= 0; i--) {
          const listing = next[i];
          if (Math.random() < (listing.price / listing.listedPrice) * 0.2) {
            info = { name: listing.name, price: listing.listedPrice };
            next.splice(i, 1);
            sold = true;
            break;
          }
        }
        if (sold) {
            setBalance(b => b + info.price);
            showNotification(`Ваш лот ${info.name} куплен за $${info.price.toFixed(2)}`);
            return next;
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(botInterval);
  }, [marketListings]);

  // Case Opening XP Logic
  const handleWin = (skin: Skin, sourceCase: Case, condition: SkinCondition, statTrak?: number, priceMultiplier: number = 1) => {
    const conditionMult = CONDITION_MULTIPLIERS[condition];
    const finalPrice = skin.price * conditionMult * priceMultiplier;
    
    const newItem: InventoryItem = {
      ...skin, price: finalPrice, condition: condition,
      instanceId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      acquiredAt: Date.now(), isSellable: true, isLocked: false,
      statTrak: statTrak
    };
    setInventory(prev => [newItem, ...prev]);

    const historyEntry: HistoryEntry = {
        id: `h-${Date.now()}`, caseId: sourceCase.id, caseName: sourceCase.name,
        skinName: skin.name, skinRarity: skin.rarity, skinImage: skin.image, timestamp: Date.now(), price: finalPrice
    };
    setHistory(prev => [historyEntry, ...prev]);

    const xpGain = Math.round(calculateXpGain(skin.rarity) * conditionMult);
    setXp(prev => prev + xpGain);
  };

  const handleWin15 = (skin: Skin, sourceCase: Case, condition: SkinCondition, statTrak?: number, priceMultiplier: number = 1) => {
    const conditionMult = CONDITION_MULTIPLIERS[condition] || 1;
    const finalPrice = skin.price * conditionMult * priceMultiplier;
    
    const newItem: InventoryItem = {
      ...skin, price: finalPrice, condition: condition,
      instanceId: `v15-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      acquiredAt: Date.now(), isSellable: true, isLocked: false,
      statTrak: statTrak
    };
    setInventory15(prev => [newItem, ...prev]);
  };

  const handleClaimBP = (level: number) => {
    const reward = (SEASON_4_LEVELS || []).find(r => r.level === level);
    if (!reward || claimedLevels.includes(level) || xp < level * XP_PER_LEVEL) return;
    
    // Process reward
    if (reward.type === 'MONEY') {
        setBalance(prev => prev + (reward.amount || 0));
        showNotification(`Награда: $${reward.amount}`);
    } else if (reward.type === 'SKIN' && reward.skin) {
        const newItem: InventoryItem = { ...reward.skin, condition: 'FACTORY_NEW', instanceId: `bp-${level}-${Date.now()}`, acquiredAt: Date.now(), isSellable: false, isLocked: false };
        setInventory(prev => [newItem, ...prev]);
        showNotification(`Награда: ${reward.skin.name}`);
    } else if (reward.type === 'CHOICE' && reward.options) {
        setChoiceModalOpen({ open: true, level, options: reward.options });
        return; // Early return because choice needs modal selection
    } else if (reward.type === 'DISCOUNT') {
        showNotification(`Получен купон скидки: ${reward.amount}%`);
    } else if (reward.type === 'ITEM' && reward.skin) {
         const newItem: InventoryItem = { ...reward.skin, condition: 'FACTORY_NEW', instanceId: `bp-item-${level}-${Date.now()}`, acquiredAt: Date.now(), isSellable: false, isLocked: false };
         setInventory(prev => [newItem, ...prev]);
         showNotification(`Награда: ${reward.skin.name}`);
    } else if (reward.type === 'BOX' && reward.skin) {
        const newItem: InventoryItem = { 
            ...reward.skin, 
            condition: 'FACTORY_NEW', 
            instanceId: `bp-box-${level}-${Date.now()}`, 
            acquiredAt: Date.now(), 
            isSellable: false, 
            isLocked: false,
            isBox: true
        };
        setInventory(prev => [newItem, ...prev]);
        showNotification(`Награда: ${reward.skin.name}`);
    } else if (reward.type === 'BADGE' && reward.badge) {
        setBadges(prev => [...prev, reward.badge!]);
        showNotification(`Награда: Медаль "${reward.badge.name}"`);
    } else if (reward.type === 'BOOST_CARD') {
        setPremiumBoosts(prev => prev + 1);
        showNotification(`Получен Boost Билет!`);
    } else if (reward.type === 'CAPSULE' && reward.skin) {
        const newItem: InventoryItem = { 
            ...reward.skin, 
            condition: 'FACTORY_NEW', 
            instanceId: `bp-capsule-${level}-${Date.now()}`, 
            acquiredAt: Date.now(), 
            isSellable: false, 
            isLocked: false,
            isCapsule: true
        };
        setInventory(prev => [newItem, ...prev]);
        showNotification(`Получена: ${reward.skin.name}`);
    } else if (reward.type === 'FRAME' && reward.frame) {
        setFrames(prev => [...prev, reward.frame!]);
        showNotification(`Получена рамка: ${reward.frame.name}`);
    }

    setClaimedLevels(prev => [...prev, level]);
  };

  const handleChoiceSelect = (skin: Skin) => {
      const newItem: InventoryItem = { ...skin, condition: 'FACTORY_NEW', instanceId: `bp-elite-${Date.now()}`, acquiredAt: Date.now(), isSellable: false, isLocked: false };
      setInventory(prev => [newItem, ...prev]);
      setClaimedLevels(prev => [...prev, choiceModalOpen.level]);
      setChoiceModalOpen({ ...choiceModalOpen, open: false });
      showNotification(`Элитная награда: ${skin.name}`);
  };

  const handleDecryptRequest = (item: InventoryItem) => setDecryptingItem(item);
  const handleDecryptionComplete = (price: number) => {
      if (!decryptingItem) return;
      setInventory(prev => prev.map(item => item.instanceId === decryptingItem.instanceId ? { ...item, price: price, isSellable: true, isDecrypted: true } : item));
      setDecryptingItem(null);
      showNotification('Протокол завершен. Предмет доступен для продажи.');
  };

  // Crafting XP Logic
  const handleCraft = (ingredients: InventoryItem[], result: Skin, condition: SkinCondition) => {
      const idsToRemove = ingredients.map(i => i.instanceId);
      setInventory(prev => prev.filter(i => !idsToRemove.includes(i.instanceId)));
      const multiplier = CONDITION_MULTIPLIERS[condition];
      const newItem: InventoryItem = { ...result, price: result.price * multiplier, condition: condition, instanceId: `craft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, acquiredAt: Date.now(), isSellable: true, isLocked: false };
      setInventory(prev => [newItem, ...prev]);
      
      const xpGain = calculateXpGain(result.rarity);
      setXp(prev => prev + xpGain);
      showNotification(`Контракт выполнен! +${xpGain} XP`);
  };

  // Battles XP Logic
  const handleBattleComplete = (winnerItems: Skin[], totalValue: number) => {
      const newItems: InventoryItem[] = winnerItems.map(s => ({ ...s, instanceId: `battle-${Date.now()}-${Math.random().toString(36).substr(2,5)}`, acquiredAt: Date.now(), isSellable: true, condition: 'FIELD_TESTED', isLocked: false }));
      setInventory(prev => [...newItems, ...prev]);
      
      const totalXpGain = winnerItems.reduce((acc, item) => acc + calculateXpGain(item.rarity), 0);
      setXp(prev => prev + totalXpGain);
      
      showNotification(`Победа в битве! Получено: ${newItems.length} предм. (+${totalXpGain} XP)`);
  };

  // Upgrade XP Logic
  const handleUpgradeConfirm = (userItem: InventoryItem, targetSkin: Skin, success: boolean) => {
      setInventory(prev => prev.filter(i => i.instanceId !== userItem.instanceId)); // Remove old item
      
      if (success) {
          const newItem: InventoryItem = {
              ...targetSkin,
              price: targetSkin.price, // Factory new price usually, or base price
              condition: 'FACTORY_NEW',
              instanceId: `upgrade-${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
              acquiredAt: Date.now(),
              isSellable: true,
              isLocked: false
          };
          setInventory(prev => [newItem, ...prev]);
          
          const xpGain = calculateXpGain(targetSkin.rarity);
          setXp(prev => prev + xpGain);
          showNotification(`Апгрейд успешен! Получен ${targetSkin.name} (+${xpGain} XP)`);
      } else {
          showNotification(`Апгрейд провален. Предмет уничтожен.`);
      }
  };

  const handleToggleLock = (item: InventoryItem) => {
      setInventory(prev => prev.map(i => i.instanceId === item.instanceId ? { ...i, isLocked: !i.isLocked } : i));
  };
  
  const handleUseTicket = (item: InventoryItem) => {
      setInventory(prev => prev.filter(i => i.instanceId !== item.instanceId));
      const knife = GAMMA_KNIVES[Math.floor(Math.random() * GAMMA_KNIVES.length)];
      const newItem: InventoryItem = { ...knife, condition: 'FACTORY_NEW', instanceId: `ticket-reward-${Date.now()}`, acquiredAt: Date.now(), isSellable: true, isLocked: false };
      setInventory(prev => [newItem, ...prev]);
      const xpGain = calculateXpGain(Rarity.LEGENDARY);
      setXp(prev => prev + xpGain);
      alert(`ВЫИГРЫШ: ${knife.name}`);
      showNotification(`Билет использован! Получен ${knife.name} (+${xpGain} XP)`);
  };

  const handleOpenBox = (item: InventoryItem) => {
      setOpeningBoxItem(item);
  };

  const handleBoxWin = (skin: Skin) => {
      if (!openingBoxItem) return;
      
      // Remove box
      setInventory(prev => prev.filter(i => i.instanceId !== openingBoxItem.instanceId));
      
      // Add reward
      const newItem: InventoryItem = { 
          ...skin, 
          condition: 'FACTORY_NEW', 
          instanceId: `box-reward-${Date.now()}`, 
          acquiredAt: Date.now(), 
          isSellable: true, 
          isLocked: false 
      };
      setInventory(prev => [newItem, ...prev]);
      
      const xpGain = calculateXpGain(skin.rarity);
      setXp(prev => prev + xpGain);
      
      setOpeningBoxItem(null);
      showNotification(`Взлом успешен! Получен ${skin.name}`);
  };

  const handleOpenCapsule = (item: InventoryItem) => {
      setOpeningCapsuleItem(item);
  };

  const handleCapsuleWin = (amount: number) => {
      if (!openingCapsuleItem) return;
      
      // Remove capsule
      setInventory(prev => prev.filter(i => i.instanceId !== openingCapsuleItem.instanceId));
      
      // Add money
      setBalance(prev => prev + amount);
      setOpeningCapsuleItem(null);
      showNotification(`Капсула открыта! Получено $${amount.toFixed(2)}`);
  };

  const handleOpenCaseRequest = (targetCase: Case) => setOpeningCase(targetCase);
  const handleTryOpenCase = (price: number): boolean => {
    if (balance >= price) { 
        setBalance(prev => prev - price); 
        return true; 
    } 
    else { alert("Недостаточно средств!"); return false; }
  };
  const initiateSell = (item: InventoryItem) => setSellingItem(item);
  const confirmSell = (price: number) => {
    if (!sellingItem || !sellingItem.isSellable) return;
    const newListing: MarketListing = { ...sellingItem, listedPrice: price };
    setInventory(prev => prev.filter(i => i.instanceId !== sellingItem.instanceId));
    setMarketListings(prev => [...prev, newListing]);
    setSellingItem(null);
    showNotification(`Лот выставлен за $${price.toFixed(2)}`);
  };
  const handleBuySkin = (skin: Skin) => {
    if (balance >= skin.price) {
      setBalance(prev => prev - skin.price);
      const newItem: InventoryItem = { ...skin, condition: 'FIELD_TESTED', instanceId: `buy-${Date.now()}`, acquiredAt: Date.now(), isSellable: true, isLocked: false };
      setInventory(prev => [newItem, ...prev]);
      showNotification(`Куплен ${skin.name}`);
    } else { alert("Мало денег."); }
  };
  const handleRemoveListing = (listing: MarketListing) => {
    setMarketListings(prev => prev.filter(l => l.instanceId !== listing.instanceId));
    setInventory(prev => [{ ...listing }, ...prev]);
  };

  // Consolidated Navigation Items
  const navItems = [
      { id: 'HOME', label: 'ГЛАВНАЯ', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
      { id: 'SHOP', label: 'МАГАЗИН', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> },
      { id: 'INVENTORY', label: 'ИНВЕНТАРЬ', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /> },
      { id: 'UPGRADE', label: 'АПГРЕЙД', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
      { id: 'BATTLES', label: 'БИТВЫ', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /> },
      { id: 'CRAFTING', label: 'КОНТРАКТ', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /> },
      { id: 'MARKET', label: 'БИРЖА', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /> },
  ];

  const displayedNavItems = appVersion === '1.5' 
      ? navItems.filter(t => t.id === 'SHOP' || t.id === 'INVENTORY')
      : navItems;
  
  // Calculate Claimed Discounts for Modal, EXCLUDING consumed ones
  const claimedDiscounts = (SEASON_3_LEVELS || []).filter(r => 
      r.type === 'DISCOUNT' && 
      claimedLevels.includes(r.level) &&
      !consumedDiscountLevels.includes(r.level)
  );

  const handleConsumeDiscounts = (levels: number[]) => {
      setConsumedDiscountLevels(prev => [...prev, ...levels]);
  };

  const handleChangeView = (view: ViewType) => {
      if (isBattleActive) {
          alert("Нельзя покинуть битву до ее завершения!");
          return;
      }
      setActiveView(view);
  };

  return (
    <div className="min-h-screen pb-44 text-slate-200 bg-[#020617] selection:bg-blue-500 selection:text-white font-inter">
      <NotificationToast message={notification.message} visible={notification.visible} />
      <AutoSaveIndicator saving={isSaving} />

      {choiceModalOpen.open && <ChoiceModal options={choiceModalOpen.options} onSelect={handleChoiceSelect} />}
      {decryptingItem && <DecryptionModal item={decryptingItem} onClose={() => setDecryptingItem(null)} onComplete={handleDecryptionComplete} />}
      {openingBoxItem && <BoxOpeningModal onClose={() => setOpeningBoxItem(null)} onComplete={handleBoxWin} lootTable={CYBER_BOX_LOOT} />}
      {openingCapsuleItem && <CapsuleOpeningModal onClose={() => setOpeningCapsuleItem(null)} onWin={handleCapsuleWin} />}
      
      {isProfileOpen && <ProfileModal 
            onClose={() => setIsProfileOpen(false)} 
            history={history} 
            inventory={inventory} 
            xp={xp} 
            balance={balance} 
            onImportData={handleImportData} 
            marketListings={marketListings} 
            claimedLevels={claimedLevels} 
            accessKey={accessKey}
            username={username}
            setUsername={setUsername}
            badges={badges}
            equippedBadge={equippedBadge}
            onEquipBadge={setEquippedBadge}
            frames={frames}
            equippedFrame={equippedFrame}
            onEquipFrame={setEquippedFrame}
        />}

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 cursor-pointer group p-1 pr-4 rounded-xl hover:bg-slate-800/50 transition-colors" onClick={() => setIsProfileOpen(true)}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px] shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all relative flex items-center justify-center">
            {equippedFrame && (
                <div className="absolute inset-[-6px] z-20 pointer-events-none">
                    <img src={equippedFrame.image} alt="Frame" className="w-full h-full object-contain animate-[spin_10s_linear_infinite]" />
                </div>
            )}
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${xp}`} className="w-full h-full rounded-full bg-slate-950 relative z-10" alt="Profile" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-black uppercase tracking-tighter text-white italic group-hover:text-blue-400 transition-colors">{username}</h1>
                {equippedBadge && (
                    <img src={equippedBadge.image} className="w-5 h-5 object-contain drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]" title={equippedBadge.name} />
                )}
            </div>
            <p className="text-slate-500 font-bold text-slate-500 uppercase tracking-widest leading-none">ПРОФИЛЬ ИГРОКА</p>
          </div>
        </div>

        <div className="hidden md:flex bg-slate-900 rounded-full p-1 border border-slate-700">
            <button onClick={() => setAppVersion('1.0')} className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${appVersion === '1.0' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>v1.0</button>
            <button onClick={() => setShowVersionWarning(true)} className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${appVersion === '1.5' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>v1.5</button>
        </div>

        {appVersion === '1.0' ? (
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-full px-6 py-2 flex items-center gap-6">
                <div className="flex flex-col text-right">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Баланс</span>
                    <span className="text-lg font-mono font-black text-green-400 tracking-tight">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        ) : (
            <div className="bg-red-950/80 border border-red-500/50 rounded-xl px-6 py-2 flex items-center gap-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <div className="flex flex-col text-right">
                    <span className="text-[9px] font-black text-red-400/80 uppercase tracking-widest">КРЕДИТЫ v1.5</span>
                    <span className="text-xl font-mono font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        )}
      </div>

      <main className="pt-28">
        {appVersion === '1.0' ? (
          <>
            {activeView === 'HOME' && <HomeS4 xp={xp} claimedLevels={claimedLevels} onClaim={handleClaimBP} rewards={SEASON_4_LEVELS} />}
            {activeView === 'SHOP' && <Shop onOpenCase={handleOpenCaseRequest} />}
            {activeView === 'INVENTORY' && <Inventory items={inventory} onSellRequest={initiateSell} onDecryptRequest={handleDecryptRequest} onToggleLock={handleToggleLock} onUseTicket={handleUseTicket} onOpenBox={handleOpenBox} onOpenCapsule={handleOpenCapsule} season1Complete={isSeason1Complete} />}
            {activeView === 'MARKET' && <Market listings={marketListings} onBuySkin={handleBuySkin} onRemoveListing={handleRemoveListing} balance={balance} />}
            {activeView === 'CRAFTING' && <Crafting inventory={inventory} onCraft={handleCraft} />}
            {activeView === 'UPGRADE' && <Upgrade inventory={inventory} onUpgradeConfirm={handleUpgradeConfirm} />}
            {activeView === 'BATTLES' && <Battles onBattleComplete={handleBattleComplete} balance={balance} setBalance={setBalance} setIsBattleActive={setIsBattleActive} />}
          </>
        ) : (
          <>
             {activeView === 'SHOP' && <Shop15 onOpenCase={setOpeningCase15} />}
             {activeView === 'INVENTORY' && <Inventory15 items={inventory15} />}
             {activeView !== 'SHOP' && activeView !== 'INVENTORY' && (
                 <div className="flex flex-col items-center justify-center py-32">
                     <h2 className="text-4xl font-black text-red-500 uppercase tracking-widest mb-4">В РАЗРАБОТКЕ</h2>
                     <p className="text-red-400/60 font-mono">Этот модуль еще не перенесен на движок v1.5</p>
                     <button onClick={() => setAppVersion('1.0')} className="mt-8 bg-red-900/50 text-red-400 px-6 py-2 rounded-xl font-bold uppercase hover:bg-red-800/50 transition-colors">
                         Вернуться в v1.0
                     </button>
                 </div>
             )}
          </>
        )}
      </main>

      {/* FIXED BOTTOM NAVIGATION PANEL */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
        <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            {displayedNavItems.map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => handleChangeView(tab.id as ViewType)}
                    className={`relative rounded-xl flex flex-col items-center justify-center transition-all duration-300 w-14 h-14
                        ${activeView === tab.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 -translate-y-2' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }
                    `}
                    title={tab.label}
                >
                    <svg className="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {tab.icon}
                    </svg>
                    {/* Tiny Indicator Dot for Active */}
                    {activeView === tab.id && (
                        <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-blue-400"></span>
                    )}
                </button>
            ))}
        </div>
      </nav>

      {openingCase && <CaseOpeningModal targetCase={openingCase} onClose={() => setOpeningCase(null)} onWin={handleWin} onTryOpen={handleTryOpenCase} availableDiscounts={claimedDiscounts} onConsumeDiscounts={handleConsumeDiscounts} premiumBoosts={premiumBoosts} onConsumeBoost={() => setPremiumBoosts(prev => Math.max(0, prev - 1))} />}
      {openingCase15 && <CaseOpening15 targetCase={openingCase15} onClose={() => setOpeningCase15(null)} onWin={handleWin15} />}
      {sellingItem && <SellModal item={sellingItem} onClose={() => setSellingItem(null)} onConfirm={confirmSell} />}

      {/* Version Warning Modal */}
      <AnimatePresence>
        {showVersionWarning && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-red-950/40 border border-red-500/50 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)]"></div>
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4 relative z-10">ТЕСТОВАЯ ВЕРСИЯ v1.5</h2>
                    <p className="text-red-400/80 font-mono text-sm mb-8 relative z-10">
                        Вы переходите в экспериментальную версию движка RIPTIDE.OS. 
                        Здесь тестируется новый интерфейс магазина и схрона. 
                        Некоторые функции могут быть недоступны.
                    </p>
                    <div className="flex gap-4 relative z-10">
                        <button onClick={() => setShowVersionWarning(false)} className="flex-1 bg-black/50 border border-red-900/50 text-red-500 font-bold py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-black transition-colors">
                            Отмена
                        </button>
                        <button onClick={() => { setAppVersion('1.5'); setShowVersionWarning(false); }} className="flex-1 bg-red-600 text-white font-black py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-red-500 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                            Продолжить
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
