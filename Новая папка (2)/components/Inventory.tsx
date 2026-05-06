
import React from 'react';
import { InventoryItem, Rarity } from '../types';
import SkinCard from './SkinCard';

interface InventoryProps {
  items: InventoryItem[];
  onSellRequest: (item: InventoryItem) => void;
  onDecryptRequest: (item: InventoryItem) => void; 
  onToggleLock: (item: InventoryItem) => void; 
  onUseTicket?: (item: InventoryItem) => void; // New prop
  onOpenBox?: (item: InventoryItem) => void; // New prop for boxes
  onOpenCapsule?: (item: InventoryItem) => void; // New prop for capsules
  season1Complete: boolean; 
}

const Inventory: React.FC<InventoryProps> = ({ items, onSellRequest, onDecryptRequest, onToggleLock, onUseTicket, onOpenBox, onOpenCapsule, season1Complete }) => {
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-[1600px] mx-auto py-12 px-6">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-800/50">
        <div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white mb-2">Хранилище</h1>
          <p className="text-slate-500 text-sm font-medium">
            Управление активами. Используйте "Замок" для защиты от случайной продажи.
          </p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl shadow-xl flex items-center gap-6">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Количество</p>
            <p className="text-2xl font-black text-white">{items.length}</p>
          </div>
          <div className="w-px h-10 bg-slate-800"></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Оценка</p>
            <p className="text-2xl font-mono font-black text-green-500">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 text-center border-2 border-dashed border-slate-800 rounded-[40px] bg-slate-900/10">
          <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-inner">
             <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <h3 className="text-2xl font-black text-slate-700 uppercase italic">Пусто</h3>
          <p className="text-slate-600 mt-2 font-bold uppercase tracking-widest text-xs">Ваша коллекция ожидает пополнения.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {items.map((item) => {
            // Logic for Action Button
            let actionButton = null;

            if (item.isCapsule && onOpenCapsule) {
                 actionButton = (
                     <button 
                         onClick={() => onOpenCapsule(item)}
                         className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse"
                     >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                         ОТКРЫТЬ КАПСУЛУ
                     </button>
                 );
            } else if (item.isBox && onOpenBox) {
                 actionButton = (
                     <button 
                         onClick={() => onOpenBox(item)}
                         className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded-xl text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(147,51,234,0.5)] animate-pulse"
                     >
                         ВЗЛОМАТЬ
                     </button>
                 );
            } else if (item.id === 'golden_ticket' && onUseTicket) {
                actionButton = (
                     <button 
                         onClick={() => onUseTicket(item)}
                         className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-black py-3 rounded-xl text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_gold] animate-pulse"
                     >
                         ИСПОЛЬЗОВАТЬ
                     </button>
                 );
            } else if (item.isLocked) {
                 actionButton = (
                     <button 
                         onClick={() => onToggleLock(item)}
                         className="w-full bg-slate-800 text-slate-500 font-bold py-3 rounded-xl text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all"
                     >
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                         ЗАКРЫТО
                     </button>
                 );
            } else if (item.isSellable) {
                actionButton = (
                    <div className="flex gap-2">
                        <button 
                        onClick={() => onSellRequest(item)}
                        className="flex-1 bg-slate-950 hover:bg-white hover:text-black border border-slate-800 text-slate-400 font-black py-3 rounded-xl text-[9px] uppercase tracking-widest transition-all"
                        >
                        ПРОДАТЬ
                        </button>
                        <button
                            onClick={() => onToggleLock(item)}
                            className="w-10 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-xl hover:text-white text-slate-500"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                );
            } else if (season1Complete && !item.isSellable && (item.rarity === Rarity.GRAY || item.rarity === Rarity.LEGENDARY)) {
                actionButton = (
                    <button 
                        onClick={() => onDecryptRequest(item)}
                        className="w-full bg-slate-900 hover:bg-green-600 hover:text-white border border-green-900/50 text-green-500 font-black py-3 rounded-xl text-[9px] uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                    >
                        РАСШИФРОВАТЬ
                    </button>
                );
            }

            return (
                <div key={item.instanceId} className="relative">
                    {item.isLocked && (
                        <div className="absolute top-2 right-2 z-30 text-slate-500 bg-black/50 p-1 rounded-full backdrop-blur-md">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                    )}
                    <SkinCard 
                    skin={item} 
                    actionButton={actionButton}
                    />
                </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inventory;
