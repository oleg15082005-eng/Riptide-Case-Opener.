
import React from 'react';
import { Skin, Rarity, InventoryItem } from '../types';

interface SkinCardProps {
  skin: Skin | InventoryItem;
  showPrice?: boolean;
  className?: string;
  onClick?: () => void;
  actionButton?: React.ReactNode;
  minimal?: boolean;
}

const SkinCard: React.FC<SkinCardProps> = ({ skin, showPrice = true, className = '', onClick, actionButton, minimal = false }) => {
  const isRare = skin.rarity === Rarity.RARE;         // Синее
  const isConsumer = skin.rarity === Rarity.CONSUMER; // Серое
  const isEpic = skin.rarity === Rarity.EPIC;         // Фиолетовое
  const isUltra = skin.rarity === Rarity.ULTRA;       // Розовое
  const isMythic = skin.rarity === Rarity.MYTHIC;     // Красное
  const isGray = skin.rarity === Rarity.GRAY;         // БП
  const isLegendary = skin.rarity === Rarity.LEGENDARY; // Золотое
  
  const item = skin as InventoryItem;
  const itemCondition = item.condition;
  const statTrakCount = item.statTrak;

  // Базовые стили
  let containerStyle = 'bg-[#0f172a] border-slate-800';
  let imageEffect = '';
  let glowStyle = '';
  let badge = null;
  let borderColor = '#334155';
  let rarityName = '';
  let textColor = 'text-slate-400';

  // Логика стилей по редкости
  if (isLegendary) {
    // ЗОЛОТОЕ (НОЖ)
    containerStyle = 'bg-gradient-to-br from-yellow-900/40 via-black to-yellow-900/20 border-yellow-500/60 shadow-[0_0_25px_rgba(234,179,8,0.2)] bg-[length:200%_200%] animate-[pulse_4s_ease-in-out_infinite]';
    glowStyle = 'bg-yellow-500 animate-pulse opacity-40';
    imageEffect = 'drop-shadow-[0_0_25px_rgba(234,179,8,0.6)] brightness-110';
    borderColor = '#eab308';
    rarityName = '★ LEGENDARY';
    textColor = 'text-yellow-400';
    badge = (
        <div className="absolute top-2 right-2 bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest z-20 shadow-[0_0_10px_rgba(234,179,8,0.4)] backdrop-blur-md">
            ELITE
        </div>
    );
  } else if (isMythic) { 
    // КРАСНОЕ (ТАЙНОЕ)
    containerStyle = 'bg-gradient-to-br from-red-900/30 via-[#0f0505] to-red-900/10 border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.15)]';
    glowStyle = 'bg-red-600 opacity-30';
    imageEffect = 'drop-shadow-[0_10px_25px_rgba(220,38,38,0.4)] brightness-110';
    borderColor = '#dc2626';
    rarityName = 'MYTHIC';
    textColor = 'text-red-500';
  } else if (isUltra) { 
    // РОЗОВОЕ (ЗАСЕКРЕЧЕННОЕ)
    containerStyle = 'bg-gradient-to-br from-pink-900/30 via-[#0f050f] to-pink-900/10 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]';
    glowStyle = 'bg-pink-500 opacity-25';
    imageEffect = 'drop-shadow-[0_10px_20px_rgba(236,72,153,0.3)] brightness-105';
    borderColor = '#ec4899';
    rarityName = 'LEGENDARY'; // In CS terms usually Classified, using provided naming
    textColor = 'text-pink-400';
  } else if (isEpic) { 
    // ФИОЛЕТОВОЕ (ЗАПРЕЩЕННОЕ)
    containerStyle = 'bg-gradient-to-br from-purple-900/30 via-[#0a050f] to-purple-900/10 border-purple-600/50 shadow-[0_0_15px_rgba(147,51,234,0.15)]';
    glowStyle = 'bg-purple-600 opacity-20';
    imageEffect = 'drop-shadow-[0_10px_20px_rgba(147,51,234,0.3)]';
    borderColor = '#9333ea';
    rarityName = 'EPIC';
    textColor = 'text-purple-400';
  } else if (isRare) { 
    // СИНЕЕ (АРМЕЙСКОЕ)
    containerStyle = 'bg-gradient-to-b from-blue-900/20 to-[#020617] border-blue-500/30 shadow-[0_0_10px_rgba(30,58,138,0.1)]';
    glowStyle = 'bg-blue-600 opacity-15';
    imageEffect = 'drop-shadow-[0_5px_15px_rgba(37,99,235,0.2)]';
    borderColor = '#2563eb';
    rarityName = 'RARE';
    textColor = 'text-blue-400';
  } else { 
    // СЕРОЕ
    containerStyle = 'bg-gradient-to-b from-[#1e293b]/20 to-[#0f172a] border-slate-700/50';
    glowStyle = 'bg-slate-500 opacity-5';
    imageEffect = 'grayscale opacity-80';
    borderColor = '#64748b';
    rarityName = 'CONSUMER';
    textColor = 'text-slate-500';
  }

  // Float Bar Config
  let arrowPosition = '50%'; 
  let conditionColor = 'text-yellow-500';
  let conditionLabel = 'FT'; 

  if (itemCondition === 'FACTORY_NEW') {
      arrowPosition = '90%';
      conditionColor = 'text-green-500';
      conditionLabel = 'FN';
  } else if (itemCondition === 'BATTLE_SCARRED') {
      arrowPosition = '10%';
      conditionColor = 'text-red-500';
      conditionLabel = 'BS';
  }

  return (
    <div 
      onClick={onClick}
      className={`relative group flex flex-col justify-between rounded-2xl overflow-hidden transition-all duration-300 border backdrop-blur-md ${containerStyle} ${className} hover:-translate-y-1 hover:shadow-2xl`}
      style={{
        borderColor: className ? undefined : borderColor + '60' // Add transparency to border hex
      }}
    >
        {/* --- STATTRAK BADGE --- */}
        {statTrakCount !== undefined && (
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-[#1c140d]/90 border border-orange-500/50 px-2 py-0.5 rounded-md z-20 shadow-[0_0_10px_rgba(234,88,12,0.3)] backdrop-blur-md">
                <span className="text-[8px] font-black text-orange-500 uppercase tracking-wider">StatTrak™</span>
                <div className="bg-[#2a1a10] border border-orange-900/50 px-1.5 rounded text-[9px] font-mono text-orange-400 shadow-inner">
                    {statTrakCount.toString().padStart(6, '0')}
                </div>
            </div>
        )}

        {/* --- SHINE EFFECT FOR HIGH RARITY --- */}
        {(isLegendary || isMythic || isUltra) && (
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        )}

        {/* --- FLOAT BAR --- */}
        {itemCondition && itemCondition !== 'NO_WEAR' && !minimal && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-950 z-30">
                <div className="w-full h-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 opacity-60"></div>
                <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_4px_white]"
                    style={{ left: arrowPosition }}
                ></div>
            </div>
        )}

        {/* --- AMBIENT GLOW --- */}
        <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 blur-[50px] rounded-full pointer-events-none transition-all duration-500 group-hover:scale-125 ${glowStyle}`}
        ></div>

        {badge}

        {/* --- IMAGE --- */}
        <div className={`relative z-10 w-full flex items-center justify-center ${minimal ? 'h-24 p-2' : 'h-40 p-4'}`}>
            <img 
                src={skin.image} 
                alt={skin.name} 
                className={`max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2 will-change-transform ${imageEffect}`}
            />
        </div>
      
        {/* --- INFO --- */}
        <div className="relative z-10 w-full px-4 pb-3 mt-auto bg-gradient-to-t from-black/80 to-transparent pt-4">
            <div className="flex flex-col items-start">
                <div className="flex justify-between w-full items-center mb-0.5">
                     <p 
                        className={`text-[8px] font-black uppercase tracking-widest truncate ${statTrakCount !== undefined ? 'text-orange-500' : textColor}`}
                     >
                        {statTrakCount !== undefined ? 'StatTrak™ ' : ''}{skin.weapon}
                    </p>
                    {itemCondition && itemCondition !== 'NO_WEAR' && !minimal && (
                        <span className={`text-[8px] font-black ${conditionColor}`}>
                            {conditionLabel}
                        </span>
                    )}
                </div>
               
                <h3 className={`font-black uppercase italic text-white leading-tight truncate w-full ${minimal ? 'text-[10px]' : 'text-sm'}`} title={skin.name}>
                    {skin.name}
                </h3>
            </div>
            
            {showPrice && !minimal && (
                <div className="mt-2 flex items-center justify-between w-full border-t border-white/5 pt-2">
                    {skin.price > 0 ? (
                        <p className={`font-mono font-bold text-sm tracking-tighter text-white drop-shadow-md`}>
                            ${skin.price.toFixed(2)}
                        </p>
                    ) : (
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                            N/A
                        </p>
                    )}
                    {/* Rarity Dot */}
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_5px] ${isLegendary ? 'bg-yellow-500 shadow-yellow-500' : isMythic ? 'bg-red-500 shadow-red-500' : isUltra ? 'bg-pink-500 shadow-pink-500' : isEpic ? 'bg-purple-500 shadow-purple-500' : isRare ? 'bg-blue-500 shadow-blue-500' : 'bg-slate-500'}`}></div>
                </div>
            )}
        </div>

        {actionButton && (
            <div className="w-full relative z-20 px-3 pb-3" onClick={e => e.stopPropagation()}>
                {actionButton}
            </div>
        )}
    </div>
  );
};

export default SkinCard;
