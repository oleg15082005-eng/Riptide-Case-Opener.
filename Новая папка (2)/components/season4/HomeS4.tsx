import React from 'react';
import { BPReward } from '../../types';
import { XP_PER_LEVEL } from '../../constants';
import { motion } from 'framer-motion';

interface HomeS4Props {
  xp: number;
  claimedLevels: number[];
  onClaim: (level: number) => void;
  rewards: BPReward[];
}

const HomeS4: React.FC<HomeS4Props> = ({ xp, claimedLevels, onClaim, rewards }) => {
  const currentLevel = Math.floor(xp / XP_PER_LEVEL) + 1;
  const progressToNext = (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 pb-32">
      <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-500/30 rounded-3xl p-8 mb-12 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-yellow-200 tracking-tight mb-2 drop-shadow-lg">
              СЕЗОН 4: ВЕСЕННИЙ ЦВЕТ
            </h1>
            <p className="text-emerald-200/80 font-medium text-lg">
              Эксклюзивные награды, бусты и капсулы.
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md border border-emerald-500/30 p-6 rounded-2xl text-center min-w-[200px] shadow-inner">
            <p className="text-emerald-400/80 text-sm font-bold uppercase tracking-widest mb-1">Уровень</p>
            <p className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">{currentLevel}</p>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                className="bg-gradient-to-r from-green-400 to-emerald-300 h-full rounded-full"
              />
            </div>
            <p className="text-xs text-emerald-500/60 mt-2 font-mono">{xp} / {currentLevel * XP_PER_LEVEL} XP</p>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Winding path background */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500/20 via-emerald-500/20 to-yellow-500/20 -translate-x-1/2 z-0 hidden md:block"></div>

        <div className="space-y-6 relative z-10">
          {rewards.map((reward, index) => {
            const isUnlocked = xp >= reward.level * XP_PER_LEVEL;
            const isClaimed = claimedLevels.includes(reward.level);
            const isEven = index % 2 === 0;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={reward.level}
                className={`flex flex-col md:flex-row items-center gap-6 ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-1/2"></div>
                
                {/* Center Node */}
                <div className="hidden md:flex w-12 h-12 rounded-full bg-slate-900 border-4 border-slate-800 items-center justify-center z-10 relative">
                  {isClaimed ? (
                    <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"></div>
                  ) : isUnlocked ? (
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_15px_#facc15]"></div>
                  ) : (
                    <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
                  )}
                </div>

                {/* Card */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className={`
                    p-6 rounded-2xl border backdrop-blur-md transition-all duration-300
                    ${isClaimed ? 'bg-emerald-900/20 border-emerald-500/30 opacity-70' : 
                      isUnlocked ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-yellow-500/50 shadow-[0_0_30px_rgba(250,204,21,0.15)] hover:shadow-[0_0_40px_rgba(250,204,21,0.25)] hover:-translate-y-1' : 
                      'bg-slate-900/50 border-slate-800/50 opacity-50 grayscale'}
                  `}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Уровень {reward.level}</span>
                      {isClaimed ? (
                         <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">ПОЛУЧЕНО</span>
                      ) : isUnlocked ? (
                         <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full animate-pulse">ДОСТУПНО</span>
                      ) : (
                         <span className="text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full">ЗАКРЫТО</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl bg-slate-950 flex items-center justify-center p-2 border border-slate-800 shadow-inner">
                        {reward.type === 'BOOST_CARD' && (
                          <div className="text-3xl">🎟️</div>
                        )}
                        {reward.type === 'CAPSULE' && reward.skin && (
                          <img src={reward.skin.image} alt={reward.skin.name} className="w-full h-full object-contain drop-shadow-md" />
                        )}
                        {reward.type === 'FRAME' && (
                          <div className="text-3xl">{isClaimed ? '🌸' : '❓'}</div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-100">
                          {reward.type === 'BOOST_CARD' && 'Boost Билет (x2 Дроп)'}
                          {reward.type === 'CAPSULE' && reward.skin?.name}
                          {reward.type === 'FRAME' && (isClaimed ? 'Анимированная Рамка' : 'Секретная Награда')}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {reward.type === 'BOOST_CARD' && 'Удваивает дроп розового, красного или ножа в Premium Collection.'}
                          {reward.type === 'CAPSULE' && 'Капсула с рулеткой на деньги (только редкие скины).'}
                          {reward.type === 'FRAME' && (isClaimed ? 'Эксклюзивная весенняя рамка для профиля.' : 'Достигните 10 уровня, чтобы узнать.')}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => isUnlocked && !isClaimed && onClaim(reward.level)}
                      disabled={!isUnlocked || isClaimed}
                      className={`w-full py-3 rounded-xl font-black uppercase tracking-widest transition-all duration-300
                        ${isClaimed ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 
                          isUnlocked ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] active:scale-[0.98]' : 
                          'bg-slate-800 text-slate-600 cursor-not-allowed'}
                      `}
                    >
                      {isClaimed ? 'Забрано' : isUnlocked ? 'Забрать' : `Нужно ${reward.level * XP_PER_LEVEL} XP`}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeS4;
