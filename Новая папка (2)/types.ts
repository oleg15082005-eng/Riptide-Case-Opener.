
export enum Rarity {
  CONSUMER = 'CONSUMER', // Серое (Ширпотреб) - для бесплатного кейса
  COMMON = 'COMMON',     // Синее (Базовое для платного) - оставим алиас для RARE если нужно, или просто используем RARE
  RARE = 'RARE',         // Синее (Промышленное/Армейское)
  EPIC = 'EPIC',         // Фиолетовое (Запрещенное)
  ULTRA = 'ULTRA',       // Розовое (Засекреченное)
  MYTHIC = 'MYTHIC',     // Красное (Тайное)
  GRAY = 'GRAY',         // Коллекционное (БП)
  LEGENDARY = 'LEGENDARY' // Золотое (Ножи/Вопрос)
}

export type SkinCondition = 'FACTORY_NEW' | 'MINIMAL_WEAR' | 'FIELD_TESTED' | 'WELL_WORN' | 'BATTLE_SCARRED' | 'NO_WEAR';

export interface Skin {
  id: string;
  name: string;
  weapon: string;
  image: string;
  rarity: Rarity;
  price: number;
}

export interface Case {
  id: string;
  name: string;
  image: string;
  price: number;
  skins: Skin[];
  specialItems?: Skin[]; // Для ножей, которые скрыты за вопросом
}

export interface Badge {
  id: string;
  name: string;
  image: string;
  rarity: Rarity;
}

export interface Frame {
  id: string;
  name: string;
  cssClass: string; // CSS class for the animation/styling
}

export interface InventoryItem extends Skin {
  instanceId: string;
  acquiredAt: number;
  isSellable: boolean;
  condition: SkinCondition; // Новое поле состояния
  isDecrypted?: boolean; // Флаг: был ли предмет расшифрован (для БП наград)
  isLocked?: boolean; // Флаг блокировки от продажи/крафта
  statTrak?: number; // Счетчик убийств (если есть)
  isBox?: boolean; // Флаг для коробок 3 сезона
  isCapsule?: boolean; // Флаг для капсул 4 сезона
}

export interface MarketListing extends InventoryItem {
  listedPrice: number;
}

export type ViewType = 'HOME' | 'SHOP' | 'INVENTORY' | 'MARKET' | 'CRAFTING' | 'BATTLES' | 'UPGRADE';

export interface BPReward {
  level: number;
  type: 'MONEY' | 'SKIN' | 'CHOICE' | 'DISCOUNT' | 'ITEM' | 'BOX' | 'BADGE' | 'BOOST_CARD' | 'CAPSULE' | 'FRAME'; 
  amount?: number;
  skin?: Skin;
  options?: Skin[];
  badge?: Badge;
  frame?: Frame;
  isClaimed: boolean;
}

export interface HistoryEntry {
  id: string;
  caseId: string;
  caseName: string;
  skinName: string;
  skinRarity: Rarity;
  skinImage?: string; // Added for profile display
  timestamp: number;
  price?: number; // Added for sorting best drops
}
