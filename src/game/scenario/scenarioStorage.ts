import type { ScenarioState } from './types';
import { createInitialScenarioState } from './scenarioState';

const STORAGE_KEY = 'sier-dojo-scenario-state-v1';

export function loadScenarioState(): ScenarioState {
  if (typeof window === 'undefined') return createInitialScenarioState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialScenarioState();
    return JSON.parse(raw) as ScenarioState;
  } catch {
    return createInitialScenarioState();
  }
}

export function saveScenarioState(state: ScenarioState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* storage unavailable */ }
}

export function clearScenarioState(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch { /* storage unavailable */ }
}
