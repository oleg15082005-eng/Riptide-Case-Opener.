
import { Rarity, Skin, Case, BPReward, Badge } from './types';

export const XP_PER_LEVEL = 150; 

// Множители состояния
export const CONDITION_MULTIPLIERS = {
  FACTORY_NEW: 1.2,    
  FIELD_TESTED: 1.0,   
  BATTLE_SCARRED: 0.8, 
  NO_WEAR: 1.5         
};

// --- RIPTIDE CASE SKINS (FREE CASE) ---
export const RIPTIDE_COMMON: Skin[] = [
  { id: 'c1', weapon: 'USP-S', name: 'Ticket to Hell', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FBRw7OfJYTh9_9S5hpS0hPb6N4Tck29Y_cg_3OyTooitiwLhqEVkZWGnJteVIQQ4MFGB_lW7yOrt0ZG4v5jIyXZguT5iuyjLBoEOtg/260fx194f/image.png', rarity: Rarity.CONSUMER, price: 0.15 },
  { id: 'c2', weapon: 'Glock-18', name: 'Snack Attack', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou7uifDhz3MzbZTJQ4dqkm46fqPv9NLPF2G8HuZIj27CS9Ir23lfir0BrNzz0d4bAJwI5aVjWq1boyenuh5-1u5XXiSw0oEUjxkQ/260fx194f/image.png', rarity: Rarity.CONSUMER, price: 0.22 },
  { id: 'c3', weapon: 'XM1014', name: 'Watchdog', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhz3MzbcDNG09GzkImemrnxNumHxjgB7ZFwjLCX9t-l2Q3srxE5Y2qlcYLDIVA5M1yB-FXtxbrmm9bi6wCpJN0_/260fx194f/image.png', rarity: Rarity.CONSUMER, price: 0.10 },
  { id: 'c4', weapon: 'MP7', name: 'Cirrus', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopbmkOVUw7ODHTi1P7-O7kYSCgvq6YerUwjoEvpQli7jF9tn22gW2-0ptaz-mJobDcFc6Mg7Tq1C_yO_qjIj84sqdG42CZQ/260fx194f/image.png', rarity: Rarity.CONSUMER, price: 0.12 },
  { id: 'c5', weapon: 'FAMAS', name: 'Mecha Industries', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpos7asPwJfwPz3YTBB09GzkImemrmla-3SxjhTscQhi7jDrYqn31Dh-0BqZm73JdLDc1Q_Y13Q-Fi9yefqm9bi68eOluDW/260fx194f/image.png', rarity: Rarity.CONSUMER, price: 0.35 },
  { id: 'c6', weapon: 'MP9', name: 'Food Chain', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposem2LFZf2-r3dThR6c6iq4iOluHtfeyBwjkDupUoiLGQo47zjQPn-hFqNWnzIYCddQQ2MFjXrlS4xbzvgpOi_MOeheBReWU/260fx194f/image.png', rarity: Rarity.CONSUMER, price: 0.45 },
  { id: 'c7', weapon: 'MAG-7', name: 'BI83 Spectrum', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopL-zJAt21uH3di59_oSJhpWYg_z9Pbzum25V4dB8xLqU94qnjAy1_ktpZzv0J9fHI1RvYw7T_1nqk-y-hsC0uJ2bynZgvik8pSGK6koWfaY/260fx194f/image.png', rarity: Rarity.CONSUMER, price: 0.18 },
  { id: 'c8', weapon: 'Dual Berettas', name: 'Tread', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH7du6kb-ImOX9Pa_Zn2pf18h0juDU-MKi31DhrkJlMj_6dYSWIFI9YArQ_VC4xOnng8Xu7pTOyHAw6SEj4CzYgVXp1vSkuHuJ/260fx194f/image.png', rarity: Rarity.CONSUMER, price: 0.14 },
  { id: 'c9', weapon: 'G3SG1', name: 'Digital Mesh', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH7du6kb-Zkuf4OrjQqWZU7Mxkh6eRodnxjgSw8xA9YTihLYfEcg87Z12B_lboxOfuh5bp75TOyXFi7iR2-z-DyP0i_j6t/260fx194f/image.png', rarity: Rarity.CONSUMER, price: 0.11 }
];

export const RIPTIDE_RARE: Skin[] = [
  { id: 'r1', weapon: 'AK-47', name: 'Leet Museo', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FBRw7P7NYjV9-N24q4yCkP_gfe3VxDlXvJ0j2LnDrdrz3ADj_Es5YGvzcNeXcFBqZFnX-VjskOa8hpWi_MOe6ZWlJUE/260fx194f/image.png', rarity: Rarity.RARE, price: 9.50 },
  { id: 'r2', weapon: 'Desert Eagle', name: 'Ocean Drive', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FBRw7OfJYTh94863moeOqPrxN7LEmyVSuMQmi7mV8Imt0ASx80Jla2CncYTAcVRtMlrY_1K8w-67hJK96cnN1zI97WnrOi_R/260fx194f/image.png', rarity: Rarity.RARE, price: 8.75 },
  { id: 'r3', weapon: 'M4A4', name: 'Spider Lily', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW09--m5CbkuXLNLPehX9u4MBwnPCPpNihiw3l-xVqYD36Jo_AdwRoaAvX_Va6wea8hpfvtM_JmCQ37HUr4WGdwUI5DPQCog/260fx194f/image.png', rarity: Rarity.RARE, price: 5.20 },
  { id: 'r4', weapon: 'MAC-10', name: 'Toybox', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbupIgthwczLZAJF7dC_mL-PkuTgIbTIk3lu4MBwnPCPotSh3ALgrkFlZD_wco6degA4aQnSrAO4left15O0tZjLwXY17CRw4GGdwUJLE0XMbg/260fx194f/image.png', rarity: Rarity.RARE, price: 4.10 }
];

// --- GAMMA OPERATION SKINS ($500 Case) ---

// 1. Rare (Синие) -> Target $45+
const GAMMA_RARE: Skin[] = [
    { id: 'g_r_n1', weapon: 'SSG 08', name: 'Mainframe 001', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ08-mq42OhP_LILrXk39I-sB1teHE9Jrsxlfg_EFkMGn3J4fEJA5sMlHX_1e6yO-705K9vZ_KwSRns3Yq5SrczRKpwUYbCemFzf4/260fx194f/image.png', rarity: Rarity.RARE, price: 45.00 },
    { id: 'g_r_n2', weapon: 'UMP-45', name: 'Mechanism', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH_9mkgL-OlvD4NoTSmXlD58F0hNbM8Ij8nVn6-hBoZm2iLYaWcFc9Nw3Urwe5wenthcPq75vImCdi7nV043yMnRTjiQYMMLLWzZk_8g/260fx194f/image.png', rarity: Rarity.RARE, price: 48.00 },
    { id: 'g_r_n3', weapon: 'PP-Bizon', name: 'Runic', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgporrf0e1Y07OvFIG0TuOO_hoWRgvr9DLbUkmJE5Ysl2eqY8Yj3i1Lm_0NkYWzzJoWddwFqYFjX-QLsxbvrgMK_vcjJzHBrpGB8ss8AtUhk/260fx194f/image.png', rarity: Rarity.RARE, price: 42.50 },
    { id: 'g_r_n4', weapon: 'Five-SeveN', name: 'Scrawl', image: 'https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1c4_2tY5t5MvGaAFiX0-tzvt5lRi67gVNw5TjSy4mseXqXagEpW8FyQu5cu0Hpw4ayNLjntFeNgoJEnyWqjCNN8G81tF3dwatE/260fx194f/image.png', rarity: Rarity.RARE, price: 46.00 },
    { id: 'g_r_n5', weapon: 'P250', name: 'Cyber Shell', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhoyszadDl95Nmuq42Ok_7hPvXVk29V7pVy076Yotqs2QTj_hZkNmqncYeQdVc8Ml6E-1e5xL3qg8C_ot2XnsaNNf5G/260fx194f/image.png', rarity: Rarity.RARE, price: 50.00 },
    // New items from prompt
    { id: 'g_r_n6', weapon: 'Sawed-Off', name: 'Apocalypto', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotaDyfgZfwOP3YTxO4eO4nYeDg8j5Nr_Yg2YfsMEoju-V842kigHgrkQ-MmulIYDDJg5tYw7XqFbrl7i8g5e-6J6fyWwj5He9Yh_8FQ/260fx194f/image.png', rarity: Rarity.RARE, price: 44.00 },
    { id: 'g_r_n7', weapon: 'P90', name: 'Chopper', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo7e1f1Jf0vL3dzFD4dmlq4yCkP_gfbmIkG5V7pEmj7jDp9ikjgOx_URkZWD3dYWQdABoNQqE-1fow-3q1sKi_MOeDCV--_I/260fx194f/image.png', rarity: Rarity.RARE, price: 47.00 },
    { id: 'g_r_n8', weapon: 'SG 553', name: 'Aerial', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopL-zJAt21uH3cDx96tC3mYWYqPv9NLPF2GhUvMFz3OqU99jz0Vfg-BJpNm73JtPBJlM-Ml7Q_QW8xe2918Pu7czXiSw06_FuxCQ/260fx194f/image.png', rarity: Rarity.RARE, price: 43.00 },
];

// 2. Epic (Фиолетовые) -> Target $250+
const GAMMA_EPIC: Skin[] = [
    { id: 'g_e_n1', weapon: 'M4A4', name: 'Cyber Security', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j3KqnUjlRc7cF4n-SPrY6l3FDm-0FoMWHzcdTAJAU9Yw7U-gLvwbjmhsDqvMvJnCBl7CQntGGdwUI5Ca2EpQ/260fx194f/image.png', rarity: Rarity.EPIC, price: 255.00 },
    { id: 'g_e_n2', weapon: 'USP-S', name: 'Monster Mashup', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0mvLwOq7c2G5UvsMo377D89in3wO3-UM_Nm30JYaccAI3YQ7XqVTtwuu9hMS-vJjXiSw0Waxutb0/260fx194f/image.png', rarity: Rarity.EPIC, price: 265.00 },
    { id: 'g_e_n3', weapon: 'Glock-18', name: 'Vogue', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFAZh7PXJdTh94czhq42Ok_7hPvWDwzoJvZUliOzCoIisiQbkqUs_Ymn2cNedJFI8M16Erli3wLy-gsW9ot2XnqGaAllC/260fx194f/image.png', rarity: Rarity.EPIC, price: 240.00 },
    { id: 'g_e_n4', weapon: 'MAC-10', name: 'Disco Tech', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJegJB49C5mpnbxsjmNr_um25V4dB8xLyZp9mn0VDj_kZrN2r6cNfAI1A9YF3W-1nqk-3v1pa16sjBnHRhuSc8pSGK-cgN6mU/260fx194f/image.png', rarity: Rarity.EPIC, price: 280.00 },
    { id: 'g_e_n5', weapon: 'M4A1-S', name: 'Decimator', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJS5NO0m5O0mvLwOq7c2G5UvsMo377D89in3wO3-UM_Nm30JYaccAI3YQ7XqVTtwuu9hMS-vJjXiSw0Waxutb0/260fx194f/image.png', rarity: Rarity.EPIC, price: 260.00 },
    { id: 'g_e_n6', weapon: 'FAMAS', name: 'Roll Cage', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08u_mpSOhcjnI7TDglRZ7cRnk6fE8I6t3gXi_hY_Nz_ydoWddAJtNAvR-1LrkOy-0JG-usvJwCBmvXEr-z-DyOfuEueN/260fx194f/image.png', rarity: Rarity.EPIC, price: 250.00 },
    // New items
    { id: 'g_e_n7', weapon: 'P250', name: 'X-Ray', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLJTjtO7dGzh7-HnvD8J_XSwGkG65d1juqZp4rz3VLhrhc_azqhJtORdgM4YFvR-1C5wry5gpHqot2XnpVn5DmP/260fx194f/image.png', rarity: Rarity.EPIC, price: 245.00 },
    { id: 'g_e_n8', weapon: 'Galil AR', name: 'Stone Cold', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FABz7OORIQJE-dC6q5SDhfjgJ7fUqWZU7Mxkh6eWodqki1DkqUJqMmimJ9SWI1JsMlCCqVO7l73ugsfo6MycnHZkvnYj-z-DyMC3HPoJ/260fx194f/image.png', rarity: Rarity.EPIC, price: 255.00 },
];

// 3. Ultra (Розовые) -> Target $1600+
const GAMMA_ULTRA: Skin[] = [
    { id: 'g_u_n1', weapon: 'AWP', name: 'Chromatic Aberration', image: 'https://community.cloudflare.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_DVL0PutbZtuL_GfC2OvzedxuPUnS3u3wR8lsTzTn4qqcXuXOlQmCpUiQOdYtUG_ltXgP-u04wWL3Y9NnjK-0H2dw8uldQ/260fx194f/image.png', rarity: Rarity.ULTRA, price: 1650.00 },
    { id: 'g_u_n2', weapon: 'AK-47', name: 'Neon Rider', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhh2KefTil97smlq4yCkP_gfb6IxD8H65dwiLyQod_w2QC1rUdpYGrzJdPBdwI2ZV7W_QS4xr_rh8Ci_MOesG2ZcCw/260fx194f/image.png', rarity: Rarity.ULTRA, price: 1700.00 },
    { id: 'g_u_n3', weapon: 'MP9', name: 'Wild Lily', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV08y5nY6fqPP9ILrDhGpI18h0juDU-MKt2wHs-kduYj3ycNWTJlI8ZgqE81S_kr-7gZHttZTJmCZk6CZwsH-OgVXp1vQ2jVgn/260fx194f/image.png', rarity: Rarity.ULTRA, price: 1580.00 },
    { id: 'g_u_n4', weapon: 'USP-S', name: 'Target Acquired', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09izh4-HluPxDKjBl2hU1810i__Yu9SsjQC1_BI_Ym_ydYfDJA4-Nw3S_AW4x-271Ja8uMycznFluXRzsCvD30vgz57zwrA/260fx194f/image.png', rarity: Rarity.ULTRA, price: 1620.00 },
    // New
    { id: 'g_u_n5', weapon: 'Glock-18', name: 'Wasteland Rebel', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJenAWu-OmnIGFg_j5DL_YhXlE-NF-mNbM8Ij8nVn6rRBlZW-nJtWVdVQ8MgnV_Fbsk-66hpa5vZWaynEyviMgsCnbmEayhwYMMLK9OqMrnQ/260fx194f/image.png', rarity: Rarity.ULTRA, price: 1590.00 },
    { id: 'g_u_n6', weapon: 'SCAR-20', name: 'Bloodsport', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FABz7PLfYQJG6d2inL-GkvP9JraflGlSuMFw2LnF9N6t0Fa1_BE4YGygdY7HcgI8NA7X_lPqwOa615C5v4OJlyWpC_Ptrg/260fx194f/image.png', rarity: Rarity.ULTRA, price: 1610.00 },
    { id: 'g_u_n7', weapon: 'M4A1-S', name: 'Mecha Industries', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFAR17P7YJgJE6d2kq42Ok_7hPvWAkDNV65ch3OjF84-miQHgqEE6a2H6JYHBIAE2NVGErli8xOrojce8ot2XnlLVpWJ4/260fx194f/image.png', rarity: Rarity.ULTRA, price: 1640.00 },
];

// 4. Mythic (Красные) -> Target $9500+
const GAMMA_MYTHIC: Skin[] = [
    { id: 'g_m_n1', weapon: 'AWP', name: 'Fade', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV08-jhIWZlP_1IbzUklRc7cF4n-SPrNuh3FXjrhBkNW70Io7AdgY_YlzXr1Xvw-a71Je07cifzXdluiYj5mGdwULUSdU1BA/260fx194f/image.png', rarity: Rarity.MYTHIC, price: 9500.00 },
    { id: 'g_m_n2', weapon: 'M4A1-S', name: 'Welcome to the Jungle', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PDdTjlH7duJhJKCmePnJ6nUl2Zu5cB1g_zMu9mliwbm-hE6MjyiINORcAVsMFDV_li_yeq8h8TvuZ_IyCYx7HJ343vD30vgwZLZMlg/260fx194f/image.png', rarity: Rarity.MYTHIC, price: 10000.00 },
    { id: 'g_m_n3', weapon: 'AK-47', name: 'X-Ray', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJegJM6dO4q5KCk_LmDLPUl31IpsN12bqUpdT32wThrks4azuhdoKUcgVqaV7S-FC7l-nohZ64vZidwHF9-n51X9k2xQQ/260fx194f/image.png', rarity: Rarity.MYTHIC, price: 8800.00 },
    { id: 'g_m_n4', weapon: 'AWP', name: 'Containment Breach', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09K_k4ifgP7nO4Tck29Y_cg_j-2Vpd33iVXtr0JtZTqlJ4HEdQZoZgyE_li3kuzp1JC56JzIzyZivz5iuygpDNgoWw/260fx194f/image.png', rarity: Rarity.MYTHIC, price: 9200.00 },
    // New
    { id: 'g_m_n5', weapon: 'Glock-18', name: 'Bullet Queen', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PTbTjlH7du6kb-KkPDmNqjCmXlu4MBwnPCPpYms3ADn_xFpYjyiJYKTe1RtM1zX8gO7lb_mh56-6JWanHNhvCJ2tGGdwULMbYUs6w/260fx194f/image.png', rarity: Rarity.MYTHIC, price: 8900.00 },
    { id: 'g_m_n6', weapon: 'M4A1-S', name: 'Player Two', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJegJK6d2yq5ODmOPLO7TdmVRc7cF4n-SPpomt0Vbm-kFkZ2rzJYbDJ1I4aAuF8we4xL_n0JPqtc6fy3Ix7HZ3sWGdwUJh7QFlnQ/260fx194f/image.png', rarity: Rarity.MYTHIC, price: 9100.00 },
];

// 5. Knives (Золотые) -> Target $80,000+
export const GAMMA_KNIVES: Skin[] = [
    { id: 'g_k_n1', weapon: 'Butterfly', name: 'Gamma Doppler', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4iSqODxMajummJW4NE_2buV89qmjgTgrkc6YTigJYTBcFc8aFDX-Ae6x7vmhZXpuJ7ByyNn7D5iuyilkvVMeQ/260fx194f/image.png', rarity: Rarity.LEGENDARY, price: 95000.00 },
    { id: 'g_k_n2', weapon: 'Karambit', name: 'Gamma Doppler', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwPjNfThW49KJlY20k_jkI7fUhFRB4MRij73--YXygED6_kBlYW2icIDGcwFtYlrR-wLolerogpC76ZvLmCdnvnEi43eInxC30AYMMLI3bmEjRg/260fx194f/image.png', rarity: Rarity.LEGENDARY, price: 82000.00 },
    { id: 'g_k_n3', weapon: 'M9 Bayonet', name: 'Gamma Doppler', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfxPrMfipP7dezhr-YmMjkJqnBmm5u5cB1g_zMu9ym2QLj-UZpN2r6LYaXc1A_NA6Erla8xrvr1MPu6p3LnXZr7iR37XvD30vgzfHPo1k/260fx194f/image.png', rarity: Rarity.LEGENDARY, price: 88500.00 },
    { id: 'g_k_n4', weapon: 'Skeleton', name: 'Gamma Doppler', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3ObcdTJN_uO3mb-GluX2P77ukGpV7fp9g-7J4cKg3QCx-kY_amimd4DGcVA_Mw3Y_gC-w7vtgpS_7s-fzHtm6CUnsXjYgVXp1n3Y8pC4/260fx194f/image.png', rarity: Rarity.LEGENDARY, price: 78000.00 },
    { id: 'g_k_n5', weapon: 'Nomad', name: 'Gamma Doppler', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GaqPX4Jr7VqWZU7Mxkh6eUp970jASy_kpsMGGictTBIFQ-MwvS_ADtwOntjcPu6c_BnXUwuyQk-z-DyAsI0KoE/260fx194f/image.png', rarity: Rarity.LEGENDARY, price: 65000.00 },
    { id: 'g_k_n6', weapon: 'Survival', name: 'Gamma Doppler', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJk5O0nPbmMrbul35F59FjhefI9rP4jVC9vh5yMTinJdCSc1JrZwvYq1S6xu_t0Z-16pvOmnY1syEg5XzVzkCzgxkYO_sv26JSMSS8Jw/260fx194f/image.png', rarity: Rarity.LEGENDARY, price: 58000.00 },
    { id: 'g_k_n7', weapon: 'Paracord', name: 'Gamma Doppler', image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-Khsj2P67UklRc7cF4n-SP99Sh0ALj_kJtNmqicobEdlI2MFrV_1W9wO_qjMS8tZmYwXVg73Qk4GGdwUK0eOoDlA/260fx194f/image.png', rarity: Rarity.LEGENDARY, price: 72000.00 },
];

export const SPECIAL_ITEM_QUESTION_MARK: Skin = {
    id: 'question_mark',
    weapon: 'Special Item',
    name: 'Rare Special Item',
    image: 'https://wiki.cs.money/images/items/question-mark.png', 
    rarity: Rarity.LEGENDARY,
    price: 0
};

export const GAMMA_CASE: Case = {
    id: 'gamma-case',
    name: 'Gamma Operation',
    image: 'https://pub-5f12f7508ff04ae5925853dee0438460.r2.dev/data/csgo/resource/flash/econ/weapon_cases/crate_community_32.png',
    price: 500,
    skins: [...GAMMA_RARE, ...GAMMA_EPIC, ...GAMMA_ULTRA, ...GAMMA_MYTHIC],
    specialItems: GAMMA_KNIVES
};

export const RIPTIDE_CASE: Case = {
    id: 'riptide-case',
    name: 'Operation Riptide',
    image: 'https://wiki.cs.money/images/cases/operation-riptide-case.png',
    price: 0,
    skins: [...RIPTIDE_COMMON, ...RIPTIDE_RARE]
};

export const ALL_SKINS = [...RIPTIDE_COMMON, ...RIPTIDE_RARE, ...GAMMA_RARE, ...GAMMA_EPIC, ...GAMMA_ULTRA, ...GAMMA_MYTHIC, ...GAMMA_KNIVES];

// --- GOLDEN TICKET ITEM ---
const GOLDEN_TICKET: Skin = {
    id: 'golden_ticket',
    weapon: 'Utility',
    name: 'Golden Ticket',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopamie19f0Ob3Yi5FvISJmoWIn-X7Prruwm4GupN03-2T9oiijgDnqBc5Z27wI9fGJ1RsZQuE-1G5xO_n0JK6u8yfznZlviYm7C3flha3n1gSOQxJ-_eW/260fx194f/image.png', // Using a pass image as placeholder
    rarity: Rarity.LEGENDARY,
    price: 0 // Cannot sell
};

// --- SEASON 3: CYBER HORIZON ---
export const CYBER_BOX: Skin = {
    id: 'cyber_box',
    weapon: 'Container',
    name: 'Cyber Box',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6r8FBRw7OfJYTh96NOih7-FnvD8J_WDwzoG6pZ0273F8Yyk2lLl8kM4Y2n7Io6WclQ9MwvR-lO_xr_v18O5ot2Xnk24r0zI/260fx194f/image.png', // Placeholder box image
    rarity: Rarity.MYTHIC,
    price: 0
};

export const CYBER_MEDAL: Badge = {
    id: 'cyber_medal_s3',
    name: 'Cyber Horizon Elite',
    image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDZiNmQ0O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzYjgyZjY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGZpbHRlciBpZD0iZ2xvdyI+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjIuNSIgcmVzdWx0PSJjb2xvcmVkQmx1ciIvPgogICAgICA8ZmVNZXJnZT4KICAgICAgICA8ZmVNZXJnZU5vZGUgaW49ImNvbG9yZWRCbHVyIi8+CiAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJTb3VyY2VHcmFwaGljIi8+CiAgICAgIDwvZmVNZXJnZT4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8cGF0aCBkPSJNIDUwIDUgTCA2MyAzNSBMIDk1IDM1IEwgNzAgNTUgTCA4MCA4NSBMIDUwIDcwIEwgMjAgODUgTCAzMCA1NSBMIDUgMzUgTCAzNyAzNSBaIiBmaWxsPSJ1cmwoI2dyYWQxKSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIGZpbHRlcj0idXJsKCNnbG93KSIgLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxNSIgZmlsbD0iIzFlMjkzYiIgc3Ryb2tlPSIjMDZiNmQ0IiBzdHJva2Utd2lkdGg9IjIiIC8+CiAgPHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5TMzwvdGV4dD4KPC9zdmc+',
    rarity: Rarity.MYTHIC
};

export const SEASON_3_LEVELS: BPReward[] = [
  { level: 1, type: 'DISCOUNT', amount: 5, isClaimed: false },
  { level: 2, type: 'DISCOUNT', amount: 5, isClaimed: false },
  { level: 3, type: 'DISCOUNT', amount: 5, isClaimed: false },
  { level: 4, type: 'MONEY', amount: 35.00, isClaimed: false },
  { level: 5, type: 'MONEY', amount: 40.00, isClaimed: false },
  { level: 6, type: 'MONEY', amount: 45.00, isClaimed: false },
  { level: 7, type: 'BOX', skin: CYBER_BOX, isClaimed: false },
  { level: 8, type: 'BOX', skin: CYBER_BOX, isClaimed: false },
  { level: 9, type: 'BOX', skin: CYBER_BOX, isClaimed: false },
  { level: 10, type: 'BADGE', badge: CYBER_MEDAL, isClaimed: false },
];

export const CYBER_BOX_LOOT = {
    [Rarity.EPIC]: GAMMA_EPIC, // 70%
    [Rarity.ULTRA]: GAMMA_ULTRA, // 20%
    [Rarity.MYTHIC]: GAMMA_MYTHIC // 10%
};

// --- SEASON 4: SPRING/SUMMER ---

export const PREMIUM_CASE: Case = {
    id: 'premium-case',
    name: 'Premium Collection',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhz2v_Nfz5H_uO1gb-Gw_alIITfn2xZ_MhwmjzF_430jQWxr0s5Z2ild4_GdwQ9ZwqG_1HqwO3q1sO8u8-YwXo3vSg8pSGK2yK92A/260fx194f/image.png',
    price: 1000,
    skins: [...GAMMA_EPIC, ...GAMMA_ULTRA, ...GAMMA_MYTHIC],
    specialItems: GAMMA_KNIVES
};

export const SPRING_CAPSULE: Skin = {
    id: 'spring_capsule',
    weapon: 'Container',
    name: 'Spring Capsule',
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovrG1eVcwg8zLZAJA18u_mYWPnuL5Ye2HxjIFsJ0i3-rHrI-g3gDsr0FvZW7xJoHEJ1Q6ZlqFq1W5yOm70cW5tZ_NmHExuyk8pSGK8XFp20Q/260fx194f/image.png',
    rarity: Rarity.MYTHIC,
    price: 0
};

export const SPRING_FRAME = {
    id: 'spring_frame',
    name: 'Spring Bloom',
    cssClass: 'spring-frame-anim'
};

export const SEASON_4_LEVELS: BPReward[] = [
  { level: 1, type: 'BOOST_CARD', isClaimed: false },
  { level: 2, type: 'BOOST_CARD', isClaimed: false },
  { level: 3, type: 'BOOST_CARD', isClaimed: false },
  { level: 4, type: 'BOOST_CARD', isClaimed: false },
  { level: 5, type: 'BOOST_CARD', isClaimed: false },
  { level: 6, type: 'CAPSULE', skin: SPRING_CAPSULE, isClaimed: false },
  { level: 7, type: 'CAPSULE', skin: SPRING_CAPSULE, isClaimed: false },
  { level: 8, type: 'CAPSULE', skin: SPRING_CAPSULE, isClaimed: false },
  { level: 9, type: 'CAPSULE', skin: SPRING_CAPSULE, isClaimed: false },
  { level: 10, type: 'FRAME', frame: SPRING_FRAME, isClaimed: false },
];

