
import React, { useState, useEffect } from 'react';
import { InventoryItem, Rarity } from '../types';

interface DecryptionModalProps {
  item: InventoryItem;
  onClose: () => void;
  onComplete: (price: number) => void;
}

const DecryptionModal: React.FC<DecryptionModalProps> = ({ item, onClose, onComplete }) => {
  const [phase, setPhase] = useState<'INIT' | 'ANALYZING' | 'CRACKING' | 'RESULT'>('INIT');
  const [displayPrice, setDisplayPrice] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [knifeColor, setKnifeColor] = useState<'RED' | 'YELLOW' | 'GREEN' | 'GRAY'>('GRAY');
  
  // Определяем финальную цену заранее
  const [finalPrice] = useState(() => {
      if (item.rarity === Rarity.LEGENDARY) {
          // Нож: $1000 - $3000
          return 1000 + Math.random() * 2000;
      } else {
          // Обычная коллекция: $50 - $200
          return 50 + Math.random() * 150;
      }
  });

  const isKnife = item.rarity === Rarity.LEGENDARY;

  const addLog = (text: string) => {
      setLog(prev => [...prev.slice(-4), text]);
  };

  useEffect(() => {
    // START SEQUENCE
    setTimeout(() => setPhase('ANALYZING'), 500);
  }, []);

  useEffect(() => {
      if (phase === 'ANALYZING') {
          addLog("Подключение к протоколу 'RIPTIDE'...");
          setTimeout(() => addLog("Проверка хеш-суммы предмета..."), 800);
          setTimeout(() => addLog("Обнаружен зашифрованный слой..."), 1600);
          setTimeout(() => setPhase('CRACKING'), 2500);
      }

      if (phase === 'CRACKING') {
          // Анимация цифр
          const interval = setInterval(() => {
              if (isKnife) {
                  // Для ножа показываем большие скачки
                  setDisplayPrice(Math.random() * 3000);
              } else {
                  setDisplayPrice(Math.random() * 300);
              }
          }, 50);

          if (isKnife) {
              // Логика цветов для ножа
              addLog("Анализ спектра редкости...");
              
              // Эмуляция перебора цветов
              setTimeout(() => setKnifeColor('RED'), 500);
              setTimeout(() => setKnifeColor('YELLOW'), 1200);
              setTimeout(() => setKnifeColor('RED'), 1900);
              
              // Финальный цвет
              setTimeout(() => {
                  if (finalPrice >= 2800) setKnifeColor('GREEN');
                  else if (finalPrice >= 1500) setKnifeColor('YELLOW');
                  else setKnifeColor('RED');
              }, 2800);

              // Завершение
              setTimeout(() => {
                  clearInterval(interval);
                  setDisplayPrice(finalPrice);
                  setPhase('RESULT');
                  onComplete(finalPrice);
              }, 4000);

          } else {
              // Логика для обычного предмета
              addLog("Деобфускация стоимости...");
              setTimeout(() => {
                  clearInterval(interval);
                  setDisplayPrice(finalPrice);
                  setPhase('RESULT');
                  onComplete(finalPrice);
              }, 3000);
          }

          return () => clearInterval(interval);
      }
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="w-full max-w-lg bg-[#050a14] border border-green-500/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.1)]">
        
        {/* Background Grid Animation */}
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] opacity-5 pointer-events-none mix-blend-screen bg-cover"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-transparent to-[#050a14]"></div>

        <h2 className="text-2xl font-black text-green-500 uppercase tracking-widest text-center mb-8 animate-pulse">
            {phase === 'RESULT' ? 'РАСШИФРОВКА ЗАВЕРШЕНА' : 'ПРОТОКОЛ ДЕШИФРОВКИ v2.0'}
        </h2>

        <div className="flex flex-col items-center mb-8 relative">
             {/* Item Image */}
             <div className="relative w-48 h-48 flex items-center justify-center mb-4">
                 {/* Color Aura for Knife */}
                 {isKnife && phase !== 'INIT' && (
                     <div className={`absolute inset-0 blur-[60px] transition-colors duration-500 ${
                         knifeColor === 'RED' ? 'bg-red-600/60' : 
                         knifeColor === 'YELLOW' ? 'bg-yellow-500/60' : 
                         knifeColor === 'GREEN' ? 'bg-green-500/80' : 'bg-slate-700/20'
                     }`}></div>
                 )}
                 {/* Glitch Effect on Analyzing */}
                 <img 
                    src={item.image} 
                    className={`relative z-10 w-full h-full object-contain drop-shadow-2xl transition-all duration-300 ${
                        phase === 'ANALYZING' ? 'blur-sm grayscale opacity-50 scale-95' : 'blur-0 grayscale-0 opacity-100 scale-100'
                    }`}
                 />
                 {phase === 'ANALYZING' && (
                     <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-green-500 font-mono text-4xl font-bold animate-ping">?</span>
                     </div>
                 )}
             </div>

             <div className="text-center z-10">
                 <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">{item.weapon}</p>
                 <p className="text-white text-xl font-black italic uppercase">{item.name}</p>
             </div>
        </div>

        {/* Matrix Console */}
        <div className="bg-black/50 border border-green-500/20 rounded-xl p-4 mb-6 font-mono text-[10px] h-24 overflow-hidden flex flex-col justify-end">
            {log.map((line, i) => (
                <p key={i} className="text-green-400/80">&gt; {line}</p>
            ))}
            {phase === 'CRACKING' && <p className="text-green-500 animate-pulse">&gt; _</p>}
        </div>

        {/* Price Display */}
        <div className="text-center mb-8">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">ОЦЕНОЧНАЯ СТОИМОСТЬ</p>
            <div className={`text-4xl font-mono font-black tracking-tighter transition-colors ${
                phase === 'RESULT' ? (isKnife && finalPrice > 2500 ? 'text-green-400 drop-shadow-[0_0_15px_#4ade80]' : 'text-white') : 'text-slate-600'
            }`}>
                ${displayPrice.toFixed(2)}
            </div>
            {phase === 'RESULT' && isKnife && finalPrice > 2500 && (
                <p className="text-green-500 text-[10px] font-black uppercase tracking-[0.5em] mt-2 animate-bounce">!!! JACKPOT !!!</p>
            )}
        </div>

        {phase === 'RESULT' ? (
             <button 
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)]"
            >
                ПРИНЯТЬ И ВЫСТАВИТЬ
            </button>
        ) : (
            <div className="w-full bg-slate-900/50 border border-slate-800 h-12 rounded-xl flex items-center justify-center">
                 <div className="flex gap-1">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default DecryptionModal;
