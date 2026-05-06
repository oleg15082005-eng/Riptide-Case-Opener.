
import React, { useState } from 'react';
import { Skin, MarketListing, Rarity } from '../types';
import { ALL_SKINS } from '../constants';
import SkinCard from './SkinCard';

interface MarketProps {
  listings: MarketListing[];
  onBuySkin: (skin: Skin) => void;
  onRemoveListing: (listing: MarketListing) => void;
  balance: number;
}

const Market: React.FC<MarketProps> = ({ listings, onBuySkin, onRemoveListing, balance }) => {
  const [activeTab, setActiveTab] = useState<'EXCHANGE' | 'MY_LISTINGS'>('EXCHANGE');
  
  // Filters
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [filterRarity, setFilterRarity] = useState<Rarity | 'ALL'>('ALL');

  // Logic for Exchange Tab (Buying new skins)
  const filteredSkins = ALL_SKINS.filter(skin => {
      const matchesSearch = skin.name.toLowerCase().includes(search.toLowerCase()) || skin.weapon.toLowerCase().includes(search.toLowerCase());
      const matchesRarity = filterRarity === 'ALL' || skin.rarity === filterRarity;
      // Exclude special hidden items
      if (skin.rarity === Rarity.LEGENDARY && skin.id === 'question_mark') return false; 
      return matchesSearch && matchesRarity;
  }).sort((a, b) => {
      if (sortOrder === 'ASC') return a.price - b.price;
      return b.price - a.price;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <header className="mb-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
            <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Прямой поток рынка</span>
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Биржа Скинов</h1>
            </div>
            
            <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <button 
                onClick={() => setActiveTab('EXCHANGE')}
                className={`px-10 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'EXCHANGE' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
                БИРЖА
            </button>
            <button 
                onClick={() => setActiveTab('MY_LISTINGS')}
                className={`px-10 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'MY_LISTINGS' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
                ВАШИ ОРДЕРА ({listings.length})
            </button>
            </div>
        </div>

        {/* FILTERS TOOLBAR */}
        {activeTab === 'EXCHANGE' && (
            <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                <div className="flex-1 relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                        type="text" 
                        placeholder="Поиск по названию..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-blue-500 transition-colors uppercase"
                    />
                </div>
                <div className="w-full md:w-48">
                    <select 
                        value={filterRarity} 
                        onChange={(e) => setFilterRarity(e.target.value as any)}
                        className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-blue-500 transition-colors uppercase appearance-none"
                    >
                        <option value="ALL">Все Редкости</option>
                        <option value={Rarity.CONSUMER}>Consumer</option>
                        <option value={Rarity.RARE}>Rare</option>
                        <option value={Rarity.EPIC}>Epic</option>
                        <option value={Rarity.ULTRA}>Ultra</option>
                        <option value={Rarity.MYTHIC}>Mythic</option>
                        <option value={Rarity.LEGENDARY}>Legendary</option>
                    </select>
                </div>
                <div className="w-full md:w-48">
                    <select 
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-blue-500 transition-colors uppercase appearance-none"
                    >
                        <option value="DESC">Сначала Дорогие</option>
                        <option value="ASC">Сначала Дешевые</option>
                    </select>
                </div>
            </div>
        )}
      </header>

      {activeTab === 'EXCHANGE' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Charts & Market Info */}
            <div className="lg:col-span-3 space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl sticky top-28">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-widest">Индексы Рынка</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[9px] text-slate-500 uppercase font-bold">Индекс Riptide</p>
                                <p className="text-xl font-mono text-white">1,402.50</p>
                            </div>
                            <span className="text-[10px] font-mono text-green-500 font-bold">+2.4% ↑</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[9px] text-slate-500 uppercase font-bold">Объем 24ч</p>
                                <p className="text-xl font-mono text-white">$4.1M</p>
                            </div>
                        </div>
                    </div>
                    {/* Fake Chart Placeholder */}
                    <div className="mt-8 flex items-end gap-1 h-12 w-full">
                        {[40, 70, 50, 90, 60, 80, 100, 70, 60, 90].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-600/30 rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Trading Floor */}
            <div className="lg:col-span-9">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSkins.map((skin) => (
                        <SkinCard 
                            key={skin.id} 
                            skin={skin} 
                            actionButton={
                                <button 
                                  onClick={() => onBuySkin(skin)}
                                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                >
                                КУПИТЬ ЛОТ
                                </button>
                            }
                        />
                    ))}
                    {filteredSkins.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-500 font-bold uppercase tracking-widest">
                            По вашему запросу ничего не найдено
                        </div>
                    )}
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-slate-900/30 rounded-3xl border border-slate-800/50 p-8 min-h-[500px]">
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 opacity-30">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-500 font-black text-xl uppercase tracking-tighter">Нет активных лотов</p>
              <p className="text-slate-600 mt-2 text-xs uppercase tracking-widest font-bold">Выставьте предметы из инвентаря на биржу.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.instanceId} className="relative bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col gap-5 shadow-2xl group transition-all hover:border-slate-500">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-slate-950 rounded-xl p-2 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform">
                        <img src={listing.image} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{listing.weapon}</h4>
                      <h3 className="text-md font-black text-white uppercase italic leading-tight">{listing.name}</h3>
                      <div className="flex items-center gap-2">
                         <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase ${listing.rarity === 'RARE' ? 'bg-blue-600 text-white' : 'bg-slate-600 text-slate-300'}`}>{listing.rarity === 'RARE' ? 'Редкое' : 'Обычное'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                        <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Ваша цена</span>
                        <span className="text-md font-mono font-black text-green-500 tracking-tighter">${listing.listedPrice.toFixed(2)}</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                        <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Вероятность продажи</span>
                        <div className="flex items-center gap-2">
                            <span className="text-md font-mono font-black text-blue-400">
                                {Math.min(100, Math.round((listing.price / listing.listedPrice) * 100))}%
                            </span>
                        </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onRemoveListing(listing)}
                    className="w-full bg-slate-800 hover:bg-red-900/40 hover:text-red-400 text-slate-500 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-inner"
                  >
                    ОТМЕНИТЬ ОРДЕР
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Market;
