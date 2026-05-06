import React from 'react';
import { Skin, Rarity, InventoryItem } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SkinCard15Props {
  skin: Skin | InventoryItem;
  onClick?: () => void;
  showWiki?: boolean;
}

const SkinCard15: React.FC<SkinCard15Props> = ({ skin, onClick, showWiki = false }) => {
  const item = skin as InventoryItem;
  const condition = item.condition;
  const statTrak = item.statTrak;

  const getRarityTheme = (r: Rarity) => {
    switch(r) {
      case Rarity.LEGENDARY: return { color: '#fbbf24', bg: 'from-yellow-900/40 to-black', border: 'border-yellow-500/50', shadow: 'shadow-yellow-500/30', text: 'text-yellow-400', label: 'ЛЕГЕНДАРНОЕ' };
      case Rarity.MYTHIC: return { color: '#ef4444', bg: 'from-red-900/40 to-black', border: 'border-red-500/50', shadow: 'shadow-red-500/30', text: 'text-red-400', label: 'ТАЙНОЕ' };
      case Rarity.ULTRA: return { color: '#ec4899', bg: 'from-pink-900/40 to-black', border: 'border-pink-500/50', shadow: 'shadow-pink-500/30', text: 'text-pink-400', label: 'ЗАСЕКРЕЧЕННОЕ' };
      case Rarity.EPIC: return { color: '#a855f7', bg: 'from-purple-900/40 to-black', border: 'border-purple-500/50', shadow: 'shadow-purple-500/30', text: 'text-purple-400', label: 'ЗАПРЕЩЕННОЕ' };
      case Rarity.RARE: return { color: '#3b82f6', bg: 'from-blue-900/40 to-black', border: 'border-blue-500/50', shadow: 'shadow-blue-500/30', text: 'text-blue-400', label: 'АРМЕЙСКОЕ' };
      case Rarity.CONSUMER: return { color: '#94a3b8', bg: 'from-slate-800/40 to-black', border: 'border-slate-500/50', shadow: 'shadow-slate-500/30', text: 'text-slate-400', label: 'ШИРПОТРЕБ' };
      default: return { color: '#64748b', bg: 'from-gray-800/40 to-black', border: 'border-gray-500/50', shadow: 'shadow-gray-500/30', text: 'text-gray-400', label: 'ОБЫЧНОЕ' };
    }
  };

  const theme = getRarityTheme(skin.rarity);

  // Fake stats for Wiki
  const wearPercent = condition === 'FACTORY_NEW' ? 5 : condition === 'MINIMAL_WEAR' ? 12 : condition === 'FIELD_TESTED' ? 25 : condition === 'WELL_WORN' ? 60 : 85;
  const patternSeed = Math.floor(Math.random() * 1000);

  return (
    <div 
      onClick={onClick}
      className={`relative group w-full aspect-[3/4] bg-gradient-to-br ${theme.bg} border ${theme.border} rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
      style={{ boxShadow: `0 0 15px ${theme.color}20` }}
    >
      {/* Tech Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      {/* Animated Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none z-20"></div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-10">
        <div className="flex flex-col">
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${theme.text} drop-shadow-md`}>
            {theme.label}
          </span>
          <span className="text-[10px] text-white/70 font-mono mt-0.5">{skin.weapon}</span>
        </div>
        {statTrak !== undefined && (
          <div className="bg-orange-500/20 border border-orange-500/50 px-1.5 py-0.5 rounded text-[8px] font-mono text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
            ST™ {statTrak}
          </div>
        )}
      </div>

      {/* Image Container */}
      <div className="absolute inset-0 flex items-center justify-center p-6 mt-4">
        <div className="absolute w-32 h-32 rounded-full blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" style={{ backgroundColor: theme.color }}></div>
        <motion.img 
          src={skin.image} 
          alt={skin.name}
          className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
          style={{ filter: `drop-shadow(0 0 10px ${theme.color}40)` }}
        />
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 z-10">
        <h3 className="text-sm font-black text-white uppercase italic truncate drop-shadow-md">{skin.name}</h3>
        <div className="flex justify-between items-end mt-1">
          <span className="text-xs font-mono font-bold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]">
            ${skin.price.toFixed(2)}
          </span>
          {condition && condition !== 'NO_WEAR' && (
            <span className="text-[9px] font-bold text-white/50 uppercase bg-white/10 px-1.5 py-0.5 rounded">
              {condition.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Wiki Overlay (SHIFT) */}
      <AnimatePresence>
        {showWiki && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 z-30 bg-black/80 p-4 flex flex-col justify-center border-t-2"
            style={{ borderTopColor: theme.color }}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                <svg className={`w-4 h-4 ${theme.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">WIKI ДАННЫЕ</span>
              </div>
              
              <div>
                <div className="flex justify-between text-[9px] text-white/60 mb-1 uppercase font-bold">
                  <span>Износ (Wear)</span>
                  <span>{wearPercent}%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${wearPercent}%`, backgroundColor: theme.color }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="text-[9px] text-white/50 uppercase">Паттерн</span>
                <span className="text-[10px] font-mono text-white">#{patternSeed}</span>
              </div>

              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="text-[9px] text-white/50 uppercase">Баз. Цена</span>
                <span className="text-[10px] font-mono text-white">${skin.price.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[9px] text-white/50 uppercase">Коллекция</span>
                <span className={`text-[9px] font-bold uppercase ${theme.text}`}>v1.5 TEST</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkinCard15;
