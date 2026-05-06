
import React, { useState, useEffect, useRef } from 'react';
import { HistoryEntry, InventoryItem, MarketListing, Rarity, Badge, Frame } from '../types';
import SkinCard from './SkinCard';

interface ProfileModalProps {
  onClose: () => void;
  history: HistoryEntry[];
  inventory: InventoryItem[];
  xp: number;
  balance: number;
  marketListings?: MarketListing[];
  claimedLevels?: number[];
  onImportData?: (data: any) => void;
  accessKey: string; 
  username: string;
  setUsername: (name: string) => void;
  badges: Badge[];
  equippedBadge: Badge | null;
  onEquipBadge: (badge: Badge) => void;
  frames?: Frame[];
  equippedFrame?: Frame | null;
  onEquipFrame?: (frame: Frame) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ 
    onClose, history, inventory, xp, balance, 
    marketListings = [], claimedLevels = [], onImportData, accessKey,
    username, setUsername, badges, equippedBadge, onEquipBadge,
    frames = [], equippedFrame = null, onEquipFrame
}) => {
  const [activeTab, setActiveTab] = useState<'STATS' | 'DATA' | 'MERITS'>('STATS');
  const [importString, setImportString] = useState('');
  const [liveExportString, setLiveExportString] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);
  const [isBadgeSelectorOpen, setIsBadgeSelectorOpen] = useState(false);

  const totalOpens = history.length;
  
  const topItems = [...inventory].sort((a, b) => b.price - a.price).slice(0, 4);

  useEffect(() => {
    const data = {
        inventory, history, xp, balance, marketListings, claimedLevels, username, timestamp: Date.now()
    };
    try {
        const jsonStr = JSON.stringify(data);
        const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
        setLiveExportString(encoded);
    } catch(e) {
        console.error("Error generating export string");
    }
  }, [inventory, history, xp, balance, marketListings, claimedLevels, username]);

  const rarityStats = {
    [Rarity.COMMON]: history.filter(h => h.skinRarity === Rarity.COMMON).length,
    [Rarity.CONSUMER]: history.filter(h => h.skinRarity === Rarity.CONSUMER).length,
    [Rarity.RARE]: history.filter(h => h.skinRarity === Rarity.RARE).length,
    [Rarity.GRAY]: history.filter(h => h.skinRarity === Rarity.GRAY).length,
    [Rarity.LEGENDARY]: history.filter(h => h.skinRarity === Rarity.LEGENDARY).length,
    [Rarity.EPIC]: history.filter(h => h.skinRarity === Rarity.EPIC).length,
    [Rarity.ULTRA]: history.filter(h => h.skinRarity === Rarity.ULTRA).length,
    [Rarity.MYTHIC]: history.filter(h => h.skinRarity === Rarity.MYTHIC).length,
  };

  const caseStats: Record<string, { count: number, name: string }> = {};
  history.forEach(h => {
    if (!caseStats[h.caseId]) {
      caseStats[h.caseId] = { count: 0, name: h.caseName };
    }
    caseStats[h.caseId].count++;
  });

  const inventoryValue = inventory.reduce((sum, item) => sum + item.price, 0);

  const getBarWidth = (val: number, max: number) => {
    if (max === 0) return '0%';
    return `${(val / max) * 100}%`;
  };

  const handleManualImport = () => {
      if (!importString) return;
      try {
          const decoded = decodeURIComponent(escape(atob(importString)));
          const data = JSON.parse(decoded);
          if (onImportData) onImportData(data);
          alert("Данные успешно загружены вручную.");
      } catch (e) {
          alert("Неверный формат кода.");
      }
  };

  const saveName = () => {
      setUsername(tempName);
      setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-5xl rounded-[30px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-auto">
        
        {/* Left Column: ID CARD Design */}
        <div className="w-full md:w-1/3 bg-[#020617] p-8 border-r border-slate-800 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="mb-8">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">КАРТА ДОСТУПА</h2>
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">ОПЕРАТИВНИК</p>
            </div>
            
            <div className="flex flex-col items-center mb-10">
                <div className="w-32 h-32 rounded-2xl bg-slate-900 border border-slate-700 p-1 mb-6 relative group flex items-center justify-center">
                     <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                     {equippedFrame && (
                         <div className="absolute inset-[-16px] z-20 pointer-events-none">
                             <img src={equippedFrame.image} alt="Frame" className="w-full h-full object-contain animate-[spin_10s_linear_infinite]" />
                         </div>
                     )}
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${xp}`} alt="Avatar" className="w-full h-full rounded-xl bg-slate-950 relative z-10" />
                </div>
                
                <div className="w-full space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">ИМЯ</span>
                        {isEditingName ? (
                            <div className="flex gap-2">
                                <input 
                                    autoFocus
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onBlur={saveName}
                                    onKeyDown={(e) => e.key === 'Enter' && saveName()}
                                    className="bg-slate-900 border border-slate-700 text-xs text-white px-2 py-1 rounded w-32 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsEditingName(true)}>
                                <span className="font-mono text-xs text-white group-hover:text-blue-400 transition-colors">{username}</span>
                                <svg className="w-3 h-3 text-slate-600 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">ID</span>
                        <span className="font-mono text-xs text-white">OP-{accessKey.slice(-6)}</span>
                    </div>
                     <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-[9px] font-bold text-slate-500 uppercase">СТАТУС</span>
                        <span className="font-mono text-xs text-green-500">ACTIVE</span>
                    </div>
                    {equippedBadge && (
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">ЗНАЧОК</span>
                            <div className="flex items-center gap-2">
                                <img src={equippedBadge.image} className="w-4 h-4 object-contain" />
                                <span className="font-mono text-[10px] text-yellow-500 uppercase">{equippedBadge.name}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider mb-1">СТОИМОСТЬ</p>
                    <p className="text-sm font-mono font-bold text-white">${(balance + inventoryValue).toFixed(0)}</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider mb-1">ПРЕДМЕТОВ</p>
                    <p className="text-sm font-mono font-bold text-white">{inventory.length}</p>
                </div>
            </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0b1221]">
            <div className="flex items-center justify-between p-8 pb-0">
                <div className="flex gap-6">
                    <button onClick={() => setActiveTab('STATS')} className={`text-sm font-black uppercase tracking-widest transition-colors pb-2 border-b-2 ${activeTab === 'STATS' ? 'text-white border-blue-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}>Статистика</button>
                    <button onClick={() => setActiveTab('MERITS')} className={`text-sm font-black uppercase tracking-widest transition-colors pb-2 border-b-2 ${activeTab === 'MERITS' ? 'text-white border-blue-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}>Заслуги</button>
                    <button onClick={() => setActiveTab('DATA')} className={`text-sm font-black uppercase tracking-widest transition-colors pb-2 border-b-2 ${activeTab === 'DATA' ? 'text-white border-blue-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}>Данные</button>
                </div>
                <button onClick={onClose} className="w-8 h-8 hover:bg-slate-800 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                {activeTab === 'STATS' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-300">
                        
                        {/* FAVORITES SECTION */}
                        <div className="md:col-span-2 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-yellow-500">★</span> ЛУЧШИЕ ПРЕДМЕТЫ В ИНВЕНТАРЕ
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {topItems.length > 0 ? topItems.map((item, idx) => (
                                    <SkinCard key={idx} skin={item} minimal={true} />
                                )) : (
                                    <p className="text-xs text-slate-600 col-span-4 text-center py-4">Инвентарь пуст</p>
                                )}
                            </div>
                        </div>

                         <div className="space-y-6">
                            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">История Кейсов</h4>
                                <div className="space-y-3">
                                    {Object.keys(caseStats).length === 0 ? (
                                        <p className="text-xs text-slate-600 italic">Нет данных</p>
                                    ) : (
                                        Object.entries(caseStats).map(([id, data]) => (
                                            <div key={id} className="group">
                                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase">
                                                    <span>{data.name}</span>
                                                    <span>{data.count}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-blue-600 rounded-full" 
                                                        style={{ width: getBarWidth(data.count, totalOpens) }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 h-full">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Анализ Удачи</h4>
                                <div className="space-y-6">
                                    {[
                                        { label: 'Ширпотреб', count: rarityStats[Rarity.CONSUMER], color: 'bg-slate-600' },
                                        { label: 'Обычное (Синее)', count: rarityStats[Rarity.RARE] + rarityStats[Rarity.COMMON], color: 'bg-blue-600' },
                                        { label: 'Эпическое (Фиолетовое)', count: rarityStats[Rarity.EPIC], color: 'bg-purple-600' },
                                        { label: 'Ультра (Розовое)', count: rarityStats[Rarity.ULTRA], color: 'bg-pink-500' },
                                        { label: 'Мифическое (Красное)', count: rarityStats[Rarity.MYTHIC], color: 'bg-red-600' },
                                        { label: 'Золотое', count: rarityStats[Rarity.LEGENDARY], color: 'bg-yellow-500' },
                                    ].map((stat) => (
                                        <div key={stat.label}>
                                            <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">
                                                <span>{stat.label}</span>
                                                <span>{stat.count}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${stat.color} transition-all duration-1000 ease-out`} 
                                                    style={{ width: getBarWidth(stat.count, totalOpens) }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'MERITS' && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800 relative min-h-[300px] flex flex-col items-center justify-center">
                            <h4 className="absolute top-6 left-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Полка Наград</h4>
                            
                            {/* Shelf */}
                            <div className="w-full max-w-lg relative mt-10">
                                <div className="h-2 bg-slate-700 rounded-full w-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-10"></div>
                                <div className="absolute top-2 left-4 right-4 h-4 bg-black/20 blur-md transform skew-x-12"></div>
                                
                                {/* Displayed Badge */}
                                {equippedBadge ? (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer" onClick={() => setIsBadgeSelectorOpen(!isBadgeSelectorOpen)}>
                                        <div className="relative">
                                            <div className={`absolute inset-0 blur-xl opacity-50 ${equippedBadge.rarity === Rarity.MYTHIC ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                            <img src={equippedBadge.image} className="w-24 h-24 object-contain relative z-10 drop-shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-300" />
                                        </div>
                                        <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-black uppercase text-xs tracking-widest">{equippedBadge.name}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-600 text-xs font-bold uppercase tracking-widest">
                                        Пусто
                                    </div>
                                )}
                            </div>

                            {/* Add Button */}
                            <button 
                                onClick={() => setIsBadgeSelectorOpen(!isBadgeSelectorOpen)}
                                className="mt-12 w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-white hover:bg-slate-800 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>

                            {/* Badge Selector Popover */}
                            {isBadgeSelectorOpen && (
                                <div className="absolute bottom-20 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl z-20 w-64">
                                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Выберите Значок</h5>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {badges.map(badge => (
                                            <button 
                                                key={badge.id} 
                                                onClick={() => { onEquipBadge(badge); setIsBadgeSelectorOpen(false); }}
                                                className={`p-2 rounded-lg border ${equippedBadge?.id === badge.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'} flex items-center justify-center transition-all`}
                                            >
                                                <img src={badge.image} className="w-8 h-8 object-contain" />
                                            </button>
                                        ))}
                                        {badges.length === 0 && <p className="col-span-3 text-[10px] text-slate-600 text-center py-2">Нет доступных значков</p>}
                                    </div>

                                    {frames.length > 0 && (
                                        <>
                                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 border-t border-slate-800 pt-3">Выберите Рамку</h5>
                                            <div className="grid grid-cols-3 gap-2">
                                                {frames.map(frame => (
                                                    <button 
                                                        key={frame.id} 
                                                        onClick={() => { onEquipFrame && onEquipFrame(frame); setIsBadgeSelectorOpen(false); }}
                                                        className={`p-2 rounded-lg border ${equippedFrame?.id === frame.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-500'} flex items-center justify-center transition-all`}
                                                    >
                                                        <img src={frame.image} className="w-8 h-8 object-contain" />
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'DATA' && (
                    <div className="animate-in slide-in-from-right-4 duration-300 max-w-2xl space-y-6">
                         <div className="border border-slate-800 rounded-3xl p-6 bg-slate-900/50">
                            <h4 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-4">Резервное копирование (Offline)</h4>
                            <p className="text-slate-500 text-xs mb-6">Сохраните этот код, чтобы восстановить прогресс на другом устройстве.</p>
                            
                            <div className="flex gap-4">
                                <button onClick={() => { navigator.clipboard.writeText(liveExportString); alert("Код скопирован!"); }} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20">СКОПИРОВАТЬ КОД СОХРАНЕНИЯ</button>
                            </div>

                            <div className="mt-8 border-t border-slate-800 pt-8">
                                <p className="text-slate-500 text-xs font-bold uppercase mb-2">Восстановление</p>
                                <div className="flex relative h-12">
                                     <input type="text" value={importString} onChange={(e) => setImportString(e.target.value)} placeholder="Вставьте код сюда..." className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl px-4 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-slate-600" />
                                    <button onClick={handleManualImport} className="absolute right-1 top-1 bottom-1 bg-slate-800 hover:bg-white hover:text-black text-white px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors">ЗАГРУЗИТЬ</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
