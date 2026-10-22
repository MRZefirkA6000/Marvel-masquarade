/**
 * Midnight Rivals - Core Gameplay & System Engine
 * Mashing up Marvel Rivals with Vampire: The Masquerade - Bloodlines
 */

export interface Hero {
  id: string;
  name: string;
  alias: string;
  role: string;
  baseHealth: number;
  maxHealth: number;
  bloodPool: number;
  maxBloodPool: number;
  passiveName: string;
  passiveDesc: string;
  abilities: Ability[];
  ultimate: Ability;
  tpCamDistance: number;
  colorAccent: string;
  bgGradient: string;
  avatarIcon: string;
  rivalsVoiceBank: string;
}

export interface Ability {
  id: string;
  name: string;
  keybind: string;
  disciplineEquivalent: string;
  bloodCost: number;
  cooldownSec: number;
  activeDurationSec?: number;
  description: string;
  sfx: string;
}

export interface GameState {
  heroes: Hero[];
  activeHeroIndex: number;
  cameraMode: 'third_person' | 'first_person';
  cameraDistance: number;
  shoulderOffset: number;
  currentHealth: number;
  currentBlood: number;
  masqueradeViolations: number;
  cooldowns: Record<string, number>; // abilityId -> seconds remaining
  activeBuffs: Array<{ id: string; name: string; durationSec: number; description: string }>;
  combatLog: Array<{ id: string; timestamp: number; text: string; type: 'swap' | 'cast' | 'sfx' | 'cam' }>;
}

export const INITIAL_HEROES: Hero[] = [
  {
    id: 'emma_frost',
    name: 'Emma Frost',
    alias: 'The White Queen',
    role: 'Vanguard / Mentalist',
    baseHealth: 150,
    maxHealth: 150,
    bloodPool: 15,
    maxBloodPool: 15,
    passiveName: 'Diamond Hardness',
    passiveDesc: 'Passively shrugs off 20% ballistic and blunt damage; immunity to psychological frenzy.',
    tpCamDistance: 90,
    colorAccent: '#e0f2fe',
    bgGradient: 'from-sky-900/60 to-indigo-950/80',
    avatarIcon: '💎',
    rivalsVoiceBank: 'MarvelRivals/Audio/EmmaFrost',
    abilities: [
      {
        id: 'diamond_form',
        name: 'Diamond Transformation',
        keybind: 'Q',
        disciplineEquivalent: 'Fortitude 5',
        bloodCost: 2,
        cooldownSec: 12,
        activeDurationSec: 8,
        description: 'Hardens skin into organic diamond: grants +80% damage reduction and 2.5x brawling impact.',
        sfx: 'SFX_Emma_Diamond_Activate.wav',
      },
      {
        id: 'psychic_blast',
        name: 'Telepathic Shockwave',
        keybind: 'E',
        disciplineEquivalent: 'Dementation 4',
        bloodCost: 2,
        cooldownSec: 8,
        description: 'Projects a mental shockwave that disorients and stuns hostile kindred and mortals for 5 seconds.',
        sfx: 'SFX_Emma_Psychic_Pulse.wav',
      },
    ],
    ultimate: {
      id: 'mind_wipe',
      name: 'Cerebro Override',
      keybind: 'Z',
      disciplineEquivalent: 'Dominate 5',
      bloodCost: 4,
      cooldownSec: 30,
      activeDurationSec: 10,
      description: 'Forces all hostiles in a 15m radius to turn their weapons on one another and wipes Masquerade suspicion.',
      sfx: 'SFX_Emma_Ult_MindBurst.wav',
    },
  },
  {
    id: 'black_cat',
    name: 'Black Cat',
    alias: 'Felicia Hardy',
    role: 'Duelist / Infiltrator',
    baseHealth: 110,
    maxHealth: 110,
    bloodPool: 12,
    maxBloodPool: 12,
    passiveName: 'Nine Lives Fortune',
    passiveDesc: 'Passively gains +35% dodge evasion and silent lockpicking expertise.',
    tpCamDistance: 85,
    colorAccent: '#f43f5e',
    bgGradient: 'from-rose-950/60 to-neutral-950/80',
    avatarIcon: '🐾',
    rivalsVoiceBank: 'MarvelRivals/Audio/BlackCat',
    abilities: [
      {
        id: 'grapple_leap',
        name: 'Whip Line & Acrobatics',
        keybind: 'Q',
        disciplineEquivalent: 'Celerity 4',
        bloodCost: 1,
        cooldownSec: 6,
        description: 'Fires grappling cable to scale rooftops or zip behind foes with hyper-velocity and 100% dodge.',
        sfx: 'SFX_BlackCat_Hook_Zip.wav',
      },
      {
        id: 'shadow_claws',
        name: 'Vicious Claws Flurry',
        keybind: 'E',
        disciplineEquivalent: 'Protean 2',
        bloodCost: 1,
        cooldownSec: 4,
        description: 'Lightning-fast multi-claw swipe dealing deep bleeding damage and siphoning vitae over 4 seconds.',
        sfx: 'SFX_BlackCat_Claw_Slash.wav',
      },
    ],
    ultimate: {
      id: 'bad_luck_curse',
      name: 'Jinx Aura',
      keybind: 'Z',
      disciplineEquivalent: 'Thaumaturgy 4',
      bloodCost: 3,
      cooldownSec: 25,
      activeDurationSec: 8,
      description: 'Casts bad luck field causing enemy firearms to jam and misfire, granting guaranteed critical strikes.',
      sfx: 'SFX_BlackCat_Ult_Jinx.wav',
    },
  },
  {
    id: 'invisible_woman',
    name: 'Invisible Woman',
    alias: 'Susan Storm',
    role: 'Strategist / Protector',
    baseHealth: 120,
    maxHealth: 120,
    bloodPool: 14,
    maxBloodPool: 14,
    passiveName: 'Refractive Shroud',
    passiveDesc: 'Crouching triggers auto-refraction, making footstep audio silent and reducing enemy vision cone.',
    tpCamDistance: 92,
    colorAccent: '#38bdf8',
    bgGradient: 'from-cyan-950/60 to-blue-950/80',
    avatarIcon: '🛡️',
    rivalsVoiceBank: 'MarvelRivals/Audio/InvisibleWoman',
    abilities: [
      {
        id: 'psionic_stealth',
        name: 'Refractive Invisibility',
        keybind: 'Q',
        disciplineEquivalent: 'Obfuscate 5',
        bloodCost: 2,
        cooldownSec: 10,
        activeDurationSec: 8,
        description: 'Renders Sue completely invisible while moving or interacting, breaking aggro instantly.',
        sfx: 'SFX_InvisibleWoman_Vanish.wav',
      },
      {
        id: 'force_barrier',
        name: 'Psionic Force Shield',
        keybind: 'E',
        disciplineEquivalent: 'Thaumaturgy Blood Shield',
        bloodCost: 2,
        cooldownSec: 14,
        activeDurationSec: 6,
        description: 'Projects a spherical energy barrier that deflects all ballistic bullets, fire, and supernatural bolts.',
        sfx: 'SFX_InvisibleWoman_Shield_Loop.wav',
      },
    ],
    ultimate: {
      id: 'kinetic_implosion',
      name: 'Force Wave Detonation',
      keybind: 'Z',
      disciplineEquivalent: 'Potence 5',
      bloodCost: 4,
      cooldownSec: 30,
      description: 'Expands a massive kinetic shockwave knocking enemies violently into walls, causing structural concussions.',
      sfx: 'SFX_InvisibleWoman_Ult_Detonate.wav',
    },
  },
];

export function createInitialGameState(): GameState {
  const activeHero = INITIAL_HEROES[0];
  return {
    heroes: INITIAL_HEROES,
    activeHeroIndex: 0,
    cameraMode: 'third_person',
    cameraDistance: activeHero.tpCamDistance,
    shoulderOffset: 22,
    currentHealth: activeHero.baseHealth,
    currentBlood: activeHero.bloodPool,
    masqueradeViolations: 0,
    cooldowns: {},
    activeBuffs: [],
    combatLog: [
      {
        id: 'init-1',
        timestamp: Date.now(),
        text: 'Midnight Rivals engine initialized in Vampire: The Masquerade - Bloodlines',
        type: 'cam',
      },
      {
        id: 'init-2',
        timestamp: Date.now() + 1,
        text: `Active Champion: ${activeHero.name} (Third-Person Over-the-Shoulder View engaged)`,
        type: 'swap',
      },
    ],
  };
}

export function switchHero(state: GameState, targetIndex: number): GameState {
  if (targetIndex < 0 || targetIndex >= state.heroes.length || targetIndex === state.activeHeroIndex) {
    return state;
  }

  const nextHero = state.heroes[targetIndex];
  const prevHero = state.heroes[state.activeHeroIndex];

  // Retain proportional health or adjust to new base
  const healthRatio = state.currentHealth / prevHero.maxHealth;
  const newHealth = Math.round(healthRatio * nextHero.maxHealth);
  const newBlood = Math.min(state.currentBlood, nextHero.maxBloodPool);

  const newLogEntry = {
    id: `swap-${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
    text: `Swapped hero from ${prevHero.name} to ${nextHero.name}. Camera calibrated to ${nextHero.tpCamDistance} units.`,
    type: 'swap' as const,
  };

  return {
    ...state,
    activeHeroIndex: targetIndex,
    cameraDistance: state.cameraMode === 'third_person' ? nextHero.tpCamDistance : 0,
    currentHealth: Math.max(1, newHealth),
    currentBlood: newBlood,
    combatLog: [newLogEntry, ...state.combatLog].slice(0, 50),
  };
}

export function toggleCameraMode(state: GameState): GameState {
  const newMode = state.cameraMode === 'third_person' ? 'first_person' : 'third_person';
  const currentHero = state.heroes[state.activeHeroIndex];
  const newDistance = newMode === 'third_person' ? currentHero.tpCamDistance : 0;

  const newLogEntry = {
    id: `cam-${Date.now()}`,
    timestamp: Date.now(),
    text: `Camera mode toggled to: ${newMode === 'third_person' ? 'Third-Person (Over-the-shoulder)' : 'First-Person'}`,
    type: 'cam' as const,
  };

  return {
    ...state,
    cameraMode: newMode,
    cameraDistance: newDistance,
    combatLog: [newLogEntry, ...state.combatLog].slice(0, 50),
  };
}

export function castAbility(state: GameState, abilityId: string): { state: GameState; success: boolean; reason?: string } {
  const activeHero = state.heroes[state.activeHeroIndex];
  const allAbilities = [...activeHero.abilities, activeHero.ultimate];
  const ability = allAbilities.find((a) => a.id === abilityId);

  if (!ability) {
    return { state, success: false, reason: 'Ability not found on current hero' };
  }

  if ((state.cooldowns[abilityId] || 0) > 0) {
    return { state, success: false, reason: `Ability on cooldown (${state.cooldowns[abilityId]}s remaining)` };
  }

  if (state.currentBlood < ability.bloodCost) {
    return { state, success: false, reason: `Insufficient Blood points (needs ${ability.bloodCost}, has ${state.currentBlood})` };
  }

  const nextCooldowns = { ...state.cooldowns, [abilityId]: ability.cooldownSec };
  const nextBlood = state.currentBlood - ability.bloodCost;

  let nextBuffs = [...state.activeBuffs];
  if (ability.activeDurationSec) {
    nextBuffs = nextBuffs.filter((b) => b.id !== abilityId);
    nextBuffs.push({
      id: abilityId,
      name: ability.name,
      durationSec: ability.activeDurationSec,
      description: ability.description,
    });
  }

  const logEntry = {
    id: `cast-${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
    text: `${activeHero.name} cast [${ability.name}] (${ability.disciplineEquivalent})! Consumed ${ability.bloodCost} Blood.`,
    type: 'cast' as const,
  };

  const sfxLogEntry = {
    id: `sfx-${Date.now()}-${Math.random()}`,
    timestamp: Date.now() + 1,
    text: `Triggered companion audio: {game:marvel-rivals}/${activeHero.rivalsVoiceBank}/${ability.sfx}`,
    type: 'sfx' as const,
  };

  const newState: GameState = {
    ...state,
    currentBlood: nextBlood,
    cooldowns: nextCooldowns,
    activeBuffs: nextBuffs,
    combatLog: [sfxLogEntry, logEntry, ...state.combatLog].slice(0, 50),
  };

  return { state: newState, success: true };
}

export function tickCooldowns(state: GameState, elapsedSec: number = 1): GameState {
  const nextCooldowns: Record<string, number> = {};
  for (const [id, sec] of Object.entries(state.cooldowns)) {
    const remaining = Math.max(0, sec - elapsedSec);
    if (remaining > 0) {
      nextCooldowns[id] = remaining;
    }
  }

  const nextBuffs = state.activeBuffs
    .map((b) => ({ ...b, durationSec: b.durationSec - elapsedSec }))
    .filter((b) => b.durationSec > 0);

  return {
    ...state,
    cooldowns: nextCooldowns,
    activeBuffs: nextBuffs,
  };
}

export function feedBlood(state: GameState, amount: number = 4): GameState {
  const currentHero = state.heroes[state.activeHeroIndex];
  const newBlood = Math.min(currentHero.maxBloodPool, state.currentBlood + amount);
  return {
    ...state,
    currentBlood: newBlood,
    combatLog: [
      {
        id: `feed-${Date.now()}`,
        timestamp: Date.now(),
        text: `Fed from blood pack/prey: +${amount} Blood points restored.`,
        type: 'cast' as const,
      },
      ...state.combatLog,
    ].slice(0, 50),
  };
}
