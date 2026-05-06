
import React, { useRef, useEffect, useState } from 'react';
import { BPReward } from '../types';
import { XP_PER_LEVEL, SEASON_3_LEVELS } from '../constants';

interface HomeProps {
  xp: number;
  claimedLevels: number[];
  onClaim: (level: number) => void;
  rewards: BPReward[];
}

const Home: React.FC<HomeProps> = ({ xp, claimedLevels, onClaim, rewards }) => {
  const [activeTab, setActiveTab] = useState<'CURRENT' | 'ARCHIVE'>('CURRENT'); 
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // XP Calculation
  const currentLevel = Math.floor(xp / XP_PER_LEVEL);
  const nextLevelXp = (currentLevel + 1) * XP_PER_LEVEL;
  const progressPercent = Math.min(100, Math.max(0, ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100));

  // Archive Data
  const season1Progress = 100; // Legacy completed
  const season2Progress = 100; // Season 2 completed
  const season3Progress = Math.min(100, (currentLevel / 10) * 100);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel);
    return () => el.removeEventListener('wheel', onWheel);
  }, [activeTab]);

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-6">
      
      {/* Tab Navigation */}
      <div className="flex gap-8 mb-10 border-b border-slate-800 pb-1">
          <button 
            onClick={() => setActiveTab('CURRENT')}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'CURRENT' ? 'text-white border-b-2 border-blue-500' : 'text-slate-600 hover:text-slate-400'}`}
          >
            Текущий Сезон
          </button>
          <button 
            onClick={() => setActiveTab('ARCHIVE')}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'ARCHIVE' ? 'text-white border-b-2 border-yellow-500' : 'text-slate-600 hover:text-slate-400'}`}
          >
            Архив Пропусков
          </button>
      </div>

      {activeTab === 'CURRENT' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
             {/* SEASON 3 HEADER */}
             <div className="relative rounded-[40px] overflow-hidden border border-cyan-900/50 bg-[#020617] shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
                {/* Background Art */}
                <div className="absolute inset-0 bg-[url('https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV08-jhIWZlP_1IbzUklRc7cF4n-SPrNuh3FXjrhBkNW70Io7AdgY_YlzXr1Xvw-a71Je07cifzXdluiYj5mGdwULUSdU1BA/260fx194f/image.png')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-1000 blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/90 to-transparent"></div>
                
                <div className="relative z-10 max-w-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">LIVE</span>
                        <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Сезон 3</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black uppercase italic text-white leading-none tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                        CYBER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">HORIZON</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                        Взломайте систему и получите доступ к элитным наградам. Новые кибер-кейсы и эксклюзивные медали ждут вас.
                    </p>
                    
                    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyan-900/20 flex items-center justify-center border border-cyan-500/30">
                            <span className="text-cyan-400 font-black text-lg">{currentLevel}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-2">
                                <span>Прогресс уровня</span>
                                <span>{progressPercent.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 hidden md:block">
                     <div className="w-64 h-64 relative">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full animate-pulse"></div>
                        <img src="https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FBRw7OfJYTh96NOih7-FnvD8J_WDwzoG6pZ0273F8Yyk2lLl8kM4Y2n7Io6WclQ9MwvR-lO_xr_v18O5ot2Xnk24r0zI/260fx194f/image.png" className="w-full h-full object-contain drop-shadow-2xl animate-float" />
                     </div>
                </div>
            </div>

            {/* REWARDS TRACK */}
            <div className="overflow-x-auto custom-scrollbar pb-8" ref={scrollRef}>
                <div className="flex gap-4 min-w-max px-4">
                    {(SEASON_3_LEVELS || []).map((reward) => {
                        const isUnlocked = currentLevel >= reward.level;
                        const isClaimed = claimedLevels.includes(reward.level);
                        const isNext = currentLevel + 1 === reward.level;

                        return (
                            <div key={reward.level} className={`relative group w-40 flex flex-col ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}>
                                <div className="text-center mb-4">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isUnlocked ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                                        LVL {reward.level}
                                    </span>
                                </div>
                                
                                <div className={`
                                    relative aspect-[3/4] rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300
                                    ${isUnlocked 
                                        ? isClaimed 
                                            ? 'bg-slate-900/50 border-slate-700 grayscale' 
                                            : 'bg-cyan-900/10 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)] scale-105' 
                                        : 'bg-slate-950 border-slate-800'
                                    }
                                `}>
                                    {/* Reward Icon */}
                                    <div className="flex-1 flex items-center justify-center">
                                        {reward.type === 'MONEY' && <span className="text-4xl drop-shadow-lg">💵</span>}
                                        {reward.type === 'DISCOUNT' && <span className="text-3xl font-black text-cyan-400 drop-shadow-lg">-{reward.amount}%</span>}
                                        {reward.type === 'BOX' && reward.skin && <img src={reward.skin.image} className="w-24 h-24 object-contain drop-shadow-2xl" />}
                                        {reward.type === 'BADGE' && reward.badge && <img src={reward.badge.image} className="w-20 h-20 object-contain drop-shadow-2xl" />}
                                    </div>

                                    {/* Label */}
                                    <div className="mt-4 text-center">
                                        <p className={`text-[9px] font-black uppercase tracking-widest ${isUnlocked ? 'text-cyan-200' : 'text-slate-600'}`}>
                                            {reward.type === 'MONEY' && `$${reward.amount}`}
                                            {reward.type === 'DISCOUNT' && 'СКИДКА'}
                                            {reward.type === 'BOX' && 'CYBER BOX'}
                                            {reward.type === 'BADGE' && 'MEDAL'}
                                        </p>
                                    </div>

                                    {/* Claim Button Overlay */}
                                    {isUnlocked && !isClaimed && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                            <button 
                                                onClick={() => onClaim(reward.level)}
                                                className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[10px] uppercase tracking-widest py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all"
                                            >
                                                ЗАБРАТЬ
                                            </button>
                                        </div>
                                    )}

                                    {/* Claimed Checkmark */}
                                    {isClaimed && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'ARCHIVE' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-12">
               
               {/* SEASON 2 (JUST FINISHED) */}
               <div className="bg-[#0f0a02] border border-yellow-900/30 rounded-[32px] overflow-hidden relative opacity-75 hover:opacity-100 transition-opacity">
                    <div className="absolute top-0 right-0 p-32 bg-yellow-600/5 blur-[80px] rounded-full pointer-events-none"></div>
                    
                    <div className="p-8 border-b border-yellow-900/20 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-red-500 font-black text-[10px] uppercase tracking-widest bg-red-900/20 px-2 py-1 rounded border border-red-900/50">ЗАВЕРШЕН</span>
                                <span className="text-yellow-500 font-black text-[10px] uppercase tracking-widest">Сезон 2</span>
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Golden Rain</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase mt-1">Ваш результат: Уровень 10 (MAX)</p>
                        </div>
                        <div className="w-full md:w-64">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-2">
                                <span>Прогресс сезона</span>
                                <span>100%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                <div className="h-full bg-yellow-500" style={{ width: `100%` }}></div>
                            </div>
                        </div>
                    </div>
               </div>

               {/* SEASON 1 (ARCHIVED) */}
               <div className="bg-[#0b1221] border border-blue-900/30 rounded-[32px] overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                    <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800">
                                <img src="https://wiki.cs.money/images/cases/operation-riptide-case.png" className="w-16 h-16 object-contain opacity-50" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Сезон 1</span>
                                </div>
                                <h2 className="text-3xl font-black text-slate-300 uppercase italic tracking-tighter">Operation Riptide</h2>
                                <p className="text-blue-500 text-xs font-bold uppercase mt-1">Статус: Завершен (100%)</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className="w-2 h-8 bg-blue-900/50 rounded-full"></div>
                            ))}
                        </div>
                    </div>
               </div>

          </div>
      )}
    </div>
  );
};

export default Home;
