import { useEffect, useReducer } from 'react';
import type { GameAction, GameState, TeamMember, Task, Effect, Difficulty } from './types';
import { phases } from './gameData';
import { ultraPhases } from './ultraPhases';
import { randomEvents } from './randomEvents';
import { difficultyConfigs, projectThemes } from './difficultyConfig';

export const allPhases = [...phases, ...ultraPhases];

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const computeSkillMultiplier = (skillLevel: number) => Math.max(0.8, 1.4 - skillLevel * 0.12);

const computeMemberUtilization = (member: TeamMember, tasks: Task[]) => {
  const assignedTasks = tasks.filter((task) => task.assignedMembers.includes(member.id));
  const rawManMonths = assignedTasks.reduce((sum, task) => {
    const share = Math.max(task.assignedMembers.length, 1);
    const effective = (task.requiredManMonths / share) * computeSkillMultiplier(member.skillLevel);
    return sum + effective;
  }, 0);
  return Math.min(150, Math.round(rawManMonths * 100));
};

const normalizeState = (state: GameState): GameState => ({
  ...state,
  members: state.members.map((member) => ({
    ...member,
    utilization: computeMemberUtilization(member, state.tasks),
  })),
});

const applyMemberEffects = (members: TeamMember[], effect: Effect): TeamMember[] =>
  members.map((member) => {
    const motivationDelta =
      Math.round(effect.morale * (effect.morale > 0 ? 0.4 : 0.5)) +
      (effect.cost < -8 ? -2 : 0);
    const conditionDelta = effect.schedule < -4 ? -3 : effect.schedule < -2 ? -1 : 0;
    const newMotivation = clamp(member.motivation + motivationDelta);
    const newCondition = clamp(member.condition + conditionDelta);
    const newSiloed = member.isSiloed
      ? !(newCondition >= 65 && newMotivation >= 60)
      : newCondition < 38 && newMotivation < 42;
    return { ...member, condition: newCondition, motivation: newMotivation, isSiloed: newSiloed };
  });

const scaleEffect = (effect: Effect, difficulty: Difficulty): Effect => {
  const m = difficultyConfigs[difficulty].effectMultiplier;
  return {
    quality: effect.quality < 0 ? Math.round(effect.quality * m) : effect.quality,
    cost: effect.cost < 0 ? Math.round(effect.cost * m) : effect.cost,
    schedule: effect.schedule < 0 ? Math.round(effect.schedule * m) : effect.schedule,
    stakeholder: effect.stakeholder < 0 ? Math.round(effect.stakeholder * m) : effect.stakeholder,
    morale: effect.morale < 0 ? Math.round(effect.morale * m) : effect.morale,
  };
};

const initialMembers: TeamMember[] = [
  { id: 'm1', name: '田中 誠', affiliation: '自社プロパー', role: 'PL', skillLevel: 5, experienceYears: 12, specialty: '要件定義', weakness: '詳細設計', costPerMonth: 140, utilization: 0, condition: 88, motivation: 92, isSiloed: false, reportedProgress: 50, actualProgress: 45 },
  { id: 'm2', name: '鈴木 美咲', affiliation: '自社プロパー', role: 'SE', skillLevel: 4, experienceYears: 7, specialty: '設計', weakness: 'テスト', costPerMonth: 110, utilization: 0, condition: 82, motivation: 76, isSiloed: false, reportedProgress: 40, actualProgress: 35 },
  { id: 'm3', name: '遠藤 翔', affiliation: '協力会社A', role: 'PG', skillLevel: 3, experienceYears: 4, specialty: '実装', weakness: '顧客対応', costPerMonth: 95, utilization: 0, condition: 74, motivation: 68, isSiloed: true, reportedProgress: 55, actualProgress: 40 },
  { id: 'm4', name: '高橋 奈緒', affiliation: 'SES（客先常駐）', role: 'テスター', skillLevel: 2, experienceYears: 2, specialty: '検証', weakness: '設計理解', costPerMonth: 85, utilization: 0, condition: 66, motivation: 62, isSiloed: false, reportedProgress: 30, actualProgress: 28 },
];

const initialTasks: Task[] = [
  { id: 't1', title: '要件整理と合意形成', phaseId: 'requirements', requiredManMonths: 1.2, bufferFactor: 1.3, assignedMembers: ['m1', 'm2'], isCritical: true },
  { id: 't2', title: '設計レビューと仕様確定', phaseId: 'basicDesign', requiredManMonths: 1.8, bufferFactor: 1.2, assignedMembers: ['m2', 'm3'], isCritical: true },
  { id: 't3', title: '実装と単体検証', phaseId: 'detailedDesign', requiredManMonths: 2.4, bufferFactor: 1.4, assignedMembers: ['m3', 'm4'], isCritical: true },
  { id: 't4', title: '総合テスト準備', phaseId: 'testing', requiredManMonths: 1.5, bufferFactor: 1.2, assignedMembers: ['m4'], isCritical: false },
  { id: 't5', title: 'リリース調整とドキュメント', phaseId: 'release', requiredManMonths: 1.1, bufferFactor: 1.3, assignedMembers: ['m1', 'm4'], isCritical: false },
];

const initialState: GameState = normalizeState({
  phaseIndex: 0,
  scenarioIndex: 0,
  quality: 80,
  cost: 100,
  schedule: 60,
  stakeholder: 75,
  morale: 80,
  decisions: [],
  phaseFlags: {},
  members: initialMembers,
  tasks: initialTasks,
  bufferFactor: 1.3,
  pmMental: 80,
  pendingEvent: null,
  triggeredEventIds: [],
  difficulty: 'normal',
  projectThemeId: 'retail-inventory',
  gameStarted: false,
});

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'startGame': {
      const config = difficultyConfigs[action.difficulty];
      const theme = projectThemes[action.difficulty].find((t) => t.id === action.projectThemeId);
      const mods = theme?.statModifiers ?? {};
      return normalizeState({
        ...initialState,
        difficulty: action.difficulty,
        projectThemeId: action.projectThemeId,
        gameStarted: true,
        quality: clamp((config.initialStats.quality) + (mods.quality ?? 0)),
        cost: clamp((config.initialStats.cost) + (mods.cost ?? 0)),
        schedule: clamp((config.initialStats.schedule) + (mods.schedule ?? 0), -100, 100),
        stakeholder: clamp((config.initialStats.stakeholder) + (mods.stakeholder ?? 0)),
        morale: clamp((config.initialStats.morale) + (mods.morale ?? 0)),
        pmMental: config.initialStats.pmMental,
      });
    }
    case 'selectChoice': {
      const config = difficultyConfigs[state.difficulty];
      const rawEffect = action.choice.effects;
      const effect = scaleEffect(rawEffect, state.difficulty);
      const nextScenarioIndex = state.scenarioIndex + 1;
      const currentPhase = allPhases[state.phaseIndex];
      const scenarioLimit = config.scenariosPerPhase;
      const willFinishPhase = nextScenarioIndex >= Math.min(currentPhase.scenarios.length, scenarioLimit);

      const baseNext: GameState = normalizeState({
        ...state,
        scenarioIndex: nextScenarioIndex,
        quality: clamp(state.quality + effect.quality),
        cost: clamp(state.cost + effect.cost),
        schedule: clamp(state.schedule + effect.schedule, -100, 100),
        stakeholder: clamp(state.stakeholder + effect.stakeholder),
        morale: clamp(state.morale + effect.morale),
        members: applyMemberEffects(state.members, effect),
        decisions: [
          ...state.decisions,
          {
            phaseId: action.phaseId,
            scenarioId: action.scenarioId,
            choiceId: action.choice.id,
            choiceLabel: action.choice.label,
            timestamp: new Date().toISOString(),
            pmBokTags: action.choice.pmBokTags,
            explanation: action.choice.explanation,
            effects: effect,
          },
        ],
        phaseFlags: action.choice.flag
          ? { ...state.phaseFlags, [action.choice.flag]: 'true' }
          : state.phaseFlags,
      });

      if (!willFinishPhase && state.pendingEvent === null && Math.random() < config.eventProbability) {
        const phaseId = currentPhase.id;
        const available = randomEvents.filter(
          (e) => (e.phaseIds.includes('all') || e.phaseIds.includes(phaseId)) &&
            !state.triggeredEventIds.includes(e.id)
        );
        if (available.length > 0) {
          const event = available[Math.floor(Math.random() * available.length)];
          return { ...baseNext, pendingEvent: event, triggeredEventIds: [...state.triggeredEventIds, event.id] };
        }
      }
      return baseNext;
    }
    case 'resolveEvent': {
      if (!state.pendingEvent) return state;
      const event = state.pendingEvent;
      const choice = event.choices.find((c) => c.id === action.choiceId);
      if (!choice) return state;
      const effect = scaleEffect(choice.effects, state.difficulty);
      return normalizeState({
        ...state,
        pendingEvent: null,
        quality: clamp(state.quality + effect.quality),
        cost: clamp(state.cost + effect.cost),
        schedule: clamp(state.schedule + effect.schedule, -100, 100),
        stakeholder: clamp(state.stakeholder + effect.stakeholder),
        morale: clamp(state.morale + effect.morale),
        members: applyMemberEffects(state.members, effect),
        decisions: [
          ...state.decisions,
          {
            phaseId: allPhases[state.phaseIndex].id,
            scenarioId: event.id,
            choiceId: choice.id,
            choiceLabel: choice.label,
            timestamp: new Date().toISOString(),
            pmBokTags: choice.pmBokTags,
            explanation: choice.explanation,
            effects: effect,
            isEvent: true,
          },
        ],
      });
    }
    case 'assignMember': {
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.taskId
          ? { ...task, assignedMembers: task.assignedMembers.includes(action.memberId) ? task.assignedMembers : [...task.assignedMembers, action.memberId] }
          : task
      );
      return normalizeState({ ...state, tasks: updatedTasks });
    }
    case 'performOneOnOne': {
      const updatedMembers = state.members.map((member) =>
        member.id === action.memberId
          ? { ...member, condition: Math.min(100, member.condition + 10), motivation: Math.min(100, member.motivation + 12) }
          : member
      );
      return normalizeState({ ...state, members: updatedMembers, pmMental: clamp(state.pmMental - 6) });
    }
    case 'verifyMemberProgress': {
      const updatedMembers = state.members.map((member) =>
        member.id === action.memberId
          ? { ...member, reportedProgress: Math.min(100, Math.max(member.actualProgress, member.reportedProgress)) }
          : member
      );
      return normalizeState({ ...state, members: updatedMembers, pmMental: clamp(state.pmMental - 4) });
    }
    case 'setBufferFactor':
      return normalizeState({ ...state, bufferFactor: Math.min(2, Math.max(1, action.bufferFactor)) });
    case 'nextPhase': {
      const config = difficultyConfigs[state.difficulty];
      if (state.phaseIndex >= config.phaseCount - 1) return state;
      return { ...state, phaseIndex: state.phaseIndex + 1, scenarioIndex: 0 };
    }
    case 'load':
      return normalizeState({
        ...initialState,
        ...action.state,
        members: action.state.members ?? initialState.members,
        tasks: action.state.tasks ?? initialState.tasks,
        bufferFactor: action.state.bufferFactor ?? initialState.bufferFactor,
        pmMental: action.state.pmMental ?? initialState.pmMental,
        pendingEvent: action.state.pendingEvent ?? null,
        triggeredEventIds: action.state.triggeredEventIds ?? [],
        difficulty: action.state.difficulty ?? 'normal',
        projectThemeId: action.state.projectThemeId ?? 'retail-inventory',
        // 기존 세이브(gameStarted 미존재)는 결정이 있으면 진행 중으로 복원
        gameStarted: action.state.gameStarted ?? (action.state.decisions?.length > 0),
      });
    case 'reset':
      return { ...initialState, gameStarted: false };
    default:
      return state;
  }
};

export const useGameState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const json = window.localStorage.getItem('pm-sim-state');
    if (json) {
      try {
        const parsed = JSON.parse(json) as GameState;
        dispatch({ type: 'load', state: parsed });
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('pm-sim-state', JSON.stringify(state));
  }, [state]);

  return { state, dispatch } as const;
};
