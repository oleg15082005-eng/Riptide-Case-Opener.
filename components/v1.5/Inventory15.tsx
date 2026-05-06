import React from 'react';
import { InventoryItem } from '../../types';
import SkinCard15 from './SkinCard15';

interface Inventory15Props {
  items: InventoryItem[];
}

const Inventory15: React.FC<Inventory15Props> = ({ items }) => {
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 pb-32">
      <div className="flex justify-between items-end mb-12 border-b-2 border-red-900/50 pb-6">
          <div>
              <h1 className="text-5xl md:text-7xl font-black text-red-500 uppercase italic tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                СХРОН v1.5
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-red-400/70 font-mono">
                  ПРЕДМЕТОВ: {items.length}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                <p className="text-green-400/80 font-mono font-bold">
                  СТОИМОСТЬ: ${totalValue.toFixed(2)}
                </p>
              </div>
          </div>
          <div className="hidden md:flex gap-4">
              <button className="bg-red-950/50 border border-red-500/30 text-red-400 px-6 py-2 rounded-xl font-bold uppercase hover:bg-red-900/50 transition-colors">
                  Фильтры
              </button>
              <button className="bg-red-950/50 border border-red-500/30 text-red-400 px-6 py-2 rounded-xl font-bold uppercase hover:bg-red-900/50 transition-colors">
                  Сортировка
              </button>
          </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map(item => (
          <SkinCard15 key={item.instanceId} skin={item} showWiki={false} />
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-32 border-2 border-dashed border-red-900/50 rounded-3xl bg-red-950/10">
            <svg className="w-24 h-24 text-red-900/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            <h2 className="text-3xl font-black text-red-500/50 uppercase tracking-widest">Схрон пуст</h2>
            <p className="text-red-400/40 mt-2 font-mono">Откройте кейсы в магазине v1.5</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory15;
