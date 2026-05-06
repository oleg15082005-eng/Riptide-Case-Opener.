
import React from 'react';
import { RIPTIDE_CASE, GAMMA_CASE, PREMIUM_CASE } from '../constants';
import { Case, Rarity } from '../types';

interface ShopProps {
  onOpenCase: (targetCase: Case) => void;
}

const Shop: React.FC<ShopProps> = ({ onOpenCase }) => {
  const cases = [RIPTIDE_CASE, GAMMA_CASE, PREMIUM_CASE];

  // Helper to find the most expensive item in a case to display as Jackpot
  const getJackpot = (c: Case) => {
      let maxPrice = 0;
      c.skins.forEach(s => { if (s.price > maxPrice) maxPrice = s.price; });
      if (c.specialItems) {
          c.specialItems.forEach(s => { if (s.price > maxPrice) maxPrice = s.price; });
      }
      return maxPrice;
  };

  // Helper to get top items for preview
  const getTopItems = (c: Case) => {
      const all = [...c.skins];
      if (c.specialItems) all.push(...c.specialItems);
      // Sort by price to show best items
      return all.sort((a, b) => b.price - a.price).slice(0, 4);
  };

  // Explicit Styles map to avoid dynamic tailwind class issues
  const getThemeStyles = (isPremium: boolean) => {
      if (isPremium) {
          return {
              border: 'border-yellow-500/20 hover:border-yellow-500/50',
              shadow: 'shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:shadow-yellow-900/20',
              bgOrb: 'bg-yellow-600/10 group-hover:bg-yellow-600/20',
              badge: 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400',
              jackpot: 'text-yellow-400',
              glow: 'bg-yellow-500',
              button: 'bg-white text-black hover:bg-yellow-400 shadow-yellow-900/20'
          };
      }
      return {
          border: 'border-blue-500/20 hover:border-blue-500/50',
          shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-blue-900/20',
          bgOrb: 'bg-blue-600/10 group-hover:bg-blue-600/20',
          badge: 'bg-blue-900/20 border-blue-500/30 text-blue-400',
          jackpot: 'text-blue-400',
          glow: 'bg-blue-500',
          button: 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20'
      };
  };

  // Helper for Rarity Styling
  const getRarityStyles = (rarity: Rarity) => {
      switch (rarity) {
          case Rarity.LEGENDARY: return { border: 'border-yellow-500', shadow: 'shadow-[0_0_10px_rgba(234,179,8,0.4)]', bg: 'bg-yellow-500' };
          case Rarity.MYTHIC: return { border: 'border-red-600', shadow: 'shadow-[0_0_10px_rgba(220,38,38,0.4)]', bg: 'bg-red-600' };
          case Rarity.ULTRA: return { border: 'border-pink-500', shadow: 'shadow-[0_0_10px_rgba(236,72,153,0.4)]', bg: 'bg-pink-500' };
          case Rarity.EPIC: return { border: 'border-purple-600', shadow: 'shadow-[0_0_10px_rgba(147,51,234,0.4)]', bg: 'bg-purple-600' };
          case Rarity.RARE: return { border: 'border-blue-600', shadow: 'shadow-[0_0_10px_rgba(37,99,235,0.4)]', bg: 'bg-blue-600' };
          case Rarity.COMMON: return { border: 'border-blue-400', shadow: 'shadow-[0_0_10px_rgba(96,165,250,0.4)]', bg: 'bg-blue-400' };
          default: return { border: 'border-slate-600', shadow: 'shadow-none', bg: 'bg-slate-500' };
      }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 pb-32">
      <header className="mb-16 relative">
        <div className="absolute left-0 top-0 w-20 h-20 bg-blue-500 blur-[80px] opacity-20"></div>
        <div className="flex items-center gap-3 mb-3">
            <span className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></span>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">ДОСТУП РАЗРЕШЕН</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white drop-shadow-2xl">
            ПОСТАВКИ <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">ДРОПА</span>
        </h1>
        <p className="text-slate-400 font-medium mt-4 max-w-xl text-sm leading-relaxed border-l-2 border-slate-800 pl-4">
            Приобретайте сертифицированные контейнеры. Каждый кейс содержит уникальные скины, готовые к использованию в битвах или контрактах.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {cases.map((c) => {
            const jackpot = getJackpot(c);
            const topItems = getTopItems(c);
            const isPremium = c.price > 0;
            const theme = getThemeStyles(isPremium);

            return (
                <div 
                  key={c.id}
                  onClick={() => onOpenCase(c)}
                  className={`relative group bg-[#0b1221] border ${theme.border} rounded-[36px] p-1 cursor-pointer transition-all duration-500 hover:-translate-y-3 ${theme.shadow} hover:shadow-2xl`}
                >
                  {/* Inner Content Wrapper */}
                  <div className="bg-[#020617] rounded-[32px] p-6 h-full flex flex-col relative overflow-hidden">
                      
                      {/* Background Effects */}
                      <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full transition-colors ${theme.bgOrb}`}></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

                      {/* Header Badge */}
                      <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className={`border px-3 py-1 rounded-full backdrop-blur-md ${theme.badge}`}>
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                  {isPremium ? 'ПРЕМИУМ КОЛЛЕКЦИЯ' : 'СТАНДАРТНЫЙ ВЫПУСК'}
                              </span>
                          </div>
                          {jackpot > 0 && (
                              <div className="text-right">
                                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">МАКС ДЖЕКПОТ</p>
                                  <p className={`text-sm font-black font-mono ${theme.jackpot}`}>${jackpot.toLocaleString()}</p>
                              </div>
                          )}
                      </div>

                      {/* Case Image Area */}
                      <div className="relative h-56 flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500">
                          {/* Glow behind case */}
                          <div className={`absolute inset-0 blur-[70px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 ${theme.glow}`}></div>
                          
                          <img 
                            src={c.image} 
                            alt={c.name} 
                            className="w-48 h-48 object-contain relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] animate-[float_6s_ease-in-out_infinite]" 
                          />
                      </div>
                      
                      {/* Case Info */}
                      <div className="mb-6 text-center relative z-10">
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                              {c.name}
                          </h3>
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{c.skins.length} предметов</p>
                      </div>

                      {/* Top Loot Preview */}
                      <div className="mb-8">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 text-center">ЛУЧШИЙ ДРОП</p>
                          <div className="flex justify-center gap-2">
                              {topItems.map((item) => {
                                  const styles = getRarityStyles(item.rarity);
                                  return (
                                    <div key={item.id} className={`w-10 h-10 rounded-lg border bg-slate-900 flex items-center justify-center relative group/item overflow-visible ${styles.border} ${styles.shadow}`}>
                                        <div className={`absolute inset-0 opacity-20 ${styles.bg}`}></div>
                                        <img src={item.image} className="w-8 h-8 object-contain relative z-10" />
                                        
                                        {/* Improved Tooltip */}
                                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-[#0f172a] border border-slate-700 text-white px-3 py-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl flex flex-col items-center">
                                            <span className="text-[9px] font-black uppercase text-slate-400 mb-0.5">{item.weapon}</span>
                                            <span className="text-[10px] font-black uppercase italic">{item.name}</span>
                                            <span className="text-[9px] font-mono text-green-400 mt-1">${item.price.toFixed(2)}</span>
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-700"></div>
                                        </div>
                                    </div>
                                  );
                              })}
                          </div>
                      </div>
                      
                      {/* Footer Actions */}
                      <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between gap-4 relative z-10">
                          <div>
                              <p className="text-[9px] font-bold text-slate-500 uppercase">Цена</p>
                              <p className={`text-2xl font-black font-mono tracking-tighter ${c.price === 0 ? 'text-green-400' : 'text-white'}`}>
                                  {c.price === 0 ? 'БЕСПЛАТНО' : `$${c.price}`}
                              </p>
                          </div>
                          <button className={`h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center gap-2 ${theme.button}`}>
                              <span>ОТКРЫТЬ</span>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </button>
                      </div>

                  </div>
                </div>
            );
        })}
      </div>

      <style>{`
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Shop;
