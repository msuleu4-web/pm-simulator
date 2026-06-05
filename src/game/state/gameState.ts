export type QCDKey = 'quality' | 'cost' | 'delivery' | 'trust';
export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export const DIFFICULTY_MULTIPLIER: Record<DifficultyLevel, number> = {
  easy:   0.65,
  normal: 1.0,
  hard:   1.5,
};

export interface ScoreEffects {
  quality?: number;
  cost?: number;
  delivery?: number;
  trust?: number;
}

export interface GameStateType {
  playerName: string;
  quality: number;
  cost: number;
  delivery: number;
  trust: number;
  currentChapter: number;
  completedEvents: Set<string>;
  flags: Record<string, string>;
  difficulty: DifficultyLevel;
  triggeredRandomEvents: Set<string>;
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

const state: GameStateType = {
  playerName: '新人SE',
  quality: 50,
  cost: 50,
  delivery: 50,
  trust: 50,
  currentChapter: 1,
  completedEvents: new Set(),
  flags: {},
  difficulty: 'normal',
  triggeredRandomEvents: new Set(),
};

export const gameState = {
  get playerName() { return state.playerName; },
  set playerName(v: string) { state.playerName = v; },

  get quality() { return state.quality; },
  get cost() { return state.cost; },
  get delivery() { return state.delivery; },
  get trust() { return state.trust; },

  get currentChapter() { return state.currentChapter; },
  set currentChapter(v: number) { state.currentChapter = v; },

  get completedEvents() { return state.completedEvents; },
  get flags() { return state.flags; },

  get difficulty() { return state.difficulty; },
  set difficulty(v: DifficultyLevel) { state.difficulty = v; },

  get triggeredRandomEvents() { return state.triggeredRandomEvents; },

  applyEffects(effects: ScoreEffects | null | undefined) {
    if (!effects) return;
    if (effects.quality  !== undefined && !Number.isNaN(effects.quality))  state.quality  = clamp(state.quality  + effects.quality);
    if (effects.cost     !== undefined && !Number.isNaN(effects.cost))     state.cost     = clamp(state.cost     + effects.cost);
    if (effects.delivery !== undefined && !Number.isNaN(effects.delivery)) state.delivery = clamp(state.delivery + effects.delivery);
    if (effects.trust    !== undefined && !Number.isNaN(effects.trust))    state.trust    = clamp(state.trust    + effects.trust);
  },

  markComplete(eventId: string) {
    state.completedEvents.add(eventId);
  },

  setFlag(key: string, value: string) {
    state.flags[key] = value;
  },

  getFlag(key: string): string {
    return state.flags[key] ?? '';
  },

  getTotalScore(): number {
    return state.quality + state.cost + state.delivery + state.trust;
  },

  reset() {
    state.playerName = '新人SE';
    state.quality = 50;
    state.cost = 50;
    state.delivery = 50;
    state.trust = 50;
    state.currentChapter = 1;
    state.completedEvents.clear();
    state.flags = {};
    state.difficulty = 'normal';
    state.triggeredRandomEvents.clear();
  },
};
