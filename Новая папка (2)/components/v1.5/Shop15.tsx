import React from 'react';
import { Case } from '../../types';
import { RIPTIDE_CASE, GAMMA_CASE } from '../../constants';
import { motion } from 'framer-motion';

interface Shop15Props {
  onOpenCase: (targetCase: Case) => void;
}

const Shop15: React.FC<Shop15Props> = ({ onOpenCase }) => {
  // Force prices to 0 for v1.5
  const cases: Case[] = [
    { ...RIPTIDE_CASE, price: 0 },
    { ...GAMMA_CASE, price: 0 }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 pb-32">
      <div className="flex justify-between items-end mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-tight">
            ТОРГОВАЯ ПЛОЩАДКА
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            v1.5 СИСТЕМА ДИСТРИБУЦИИ
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-xs font-mono text-slate-300 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 shadow-inner">
            ДОСТУПНО КЕЙСОВ: <span className="text-blue-400 font-bold">{cases.length}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cases.map((c, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={c.id} 
            onClick={() => onOpenCase(c)} 
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 cursor-pointer hover:bg-slate-800/60 hover:border-blue-500/50 transition-all duration-300 group flex flex-col sm:flex-row items-center sm:items-stretch gap-6 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-colors pointer-events-none"></div>

            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl flex items-center justify-center p-4 border border-slate-700/50 group-hover:border-blue-500/40 transition-all duration-300 shrink-0 relative z-10 shadow-inner">
                <img 
                    src={c.image} 
                    className="w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500" 
                    alt={c.name}
                />
            </div>
            
            <div className="flex-1 flex flex-col w-full relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-black text-slate-100 group-hover:text-blue-400 transition-colors uppercase italic tracking-wide">{c.name}</h2>
                    <span className="text-xs font-mono font-black text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(74,222,128,0.1)]">БЕСПЛАТНО</span>
                </div>
                
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  Эксклюзивный контейнер. Содержит {c.skins.length} уникальных предметов различной редкости, включая шанс на получение особо редкого предмета.
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-1.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-slate-900 shadow-sm"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-purple-500 border border-slate-900 shadow-sm"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-pink-500 border border-slate-900 shadow-sm"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-slate-900 shadow-sm"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 border border-slate-900 shadow-sm"></div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">Дроп-Пул</span>
                    </div>
                    <button className="text-xs uppercase tracking-widest font-black bg-blue-600/10 border border-blue-500/30 text-blue-400 px-6 py-2.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300">
                        ОТКРЫТЬ
                    </button>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Shop15;
