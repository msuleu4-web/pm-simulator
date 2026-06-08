import { useEffect, useReducer } from 'react';
import type { GameAction, GameState, TeamMember, Task, Effect, Difficulty, Phase, PhaseOverride } from './types';
import { phases } from './gameData';
import { ultraPhases } from './ultraPhases';
import { randomEvents } from './randomEvents';
import { pmoRandomEvents } from './pmoRandomEvents';
import { difficultyConfigs, projectThemes } from './difficultyConfig';
import { allTeamMembers } from './teamMembers';
import { pmoPhases } from './pmoPhases';
import { memberPhases } from './memberPhases';
import { memberRandomEvents } from './memberRandomEvents';
import { calculateFit, hiringCostKpi } from './hireUtils';

export const allPhases = [...phases, ...ultraPhases];

function applyPhaseOverrides(basePhases: Phase[], overrides: PhaseOverride[]): Phase[] {
  return basePhases.map((phase) => {
    const phaseOverride = overrides.find((o) => o.phaseId === phase.id);
    if (!phaseOverride) return phase;
    return {
      ...phase,
      ...(phaseOverride.label && { label: phaseOverride.label }),
      ...(phaseOverride.description && { description: phaseOverride.description }),
      scenarios: phase.scenarios.map((scenario) => {
        const so = phaseOverride.scenarios?.[scenario.id];
        if (!so) return scenario;
        return {
          ...scenario,
          ...(so.title && { title: so.title }),
          ...(so.description && { description: so.description }),
          ...(so.pmTip && { pmTip: so.pmTip }),
          ...(so.docs && { docs: so.docs }),
          ...(so.learningImage && { learningImage: so.learningImage }),
        };
      }),
    };
  });
}

export const getPhasesForDifficulty = (difficulty: string, projectThemeId?: string) => {
  const config = difficultyConfigs[difficulty as Difficulty];
  let base: Phase[];
  if (config?.usePmoPhases) base = pmoPhases.slice(0, config.phaseCount);
  else if (config?.useMemberPhases) base = memberPhases.slice(0, config.phaseCount);
  else if (config?.useMaintPhases) base = ultraPhases.slice(0, config.phaseCount);
  else base = allPhases.slice(0, (config?.phaseCount ?? 5));

  if (!projectThemeId) return base;
  const theme = projectThemes[difficulty as Difficulty]?.find((t) => t.id === projectThemeId);
  if (!theme?.overrides) return base;
  return applyPhaseOverrides(base, theme.overrides);
};

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

const applyCascadeEffects = (state: GameState, difficulty: Difficulty): GameState => {
  const m = Math.min(difficultyConfigs[difficulty].effectMultiplier, 1.6);
  let qDelta = 0, stDelta = 0, mDelta = 0;

  if (state.morale < 50) { qDelta -= Math.round(1 * m); mDelta -= Math.round(1 * m); }
  if (state.morale < 35) { qDelta -= Math.round(2 * m); mDelta -= Math.round(1 * m); }

  const schedNorm = state.schedule + 50;
  if (schedNorm < 35) { stDelta -= Math.round(2 * m); }
  if (schedNorm < 20) { stDelta -= Math.round(3 * m); mDelta -= Math.round(2 * m); }

  if (state.cost < 55) { mDelta -= Math.round(2 * m); }
  if (state.cost < 35) { mDelta -= Math.round(2 * m); qDelta -= Math.round(1 * m); }

  if (state.quality < 55) { stDelta -= Math.round(2 * m); }

  return {
    ...state,
    quality: clamp(state.quality + qDelta),
    stakeholder: clamp(state.stakeholder + stDelta),
    morale: clamp(state.morale + mDelta),
  };
};

const checkMemberQuit = (state: GameState): GameState => {
  if (state.members.length <= 1) return state;

  const candidates = state.members.filter(member => {
    const stress = (100 - member.condition) + (100 - member.motivation);
    return stress >= 90;
  });

  if (candidates.length === 0) return state;

  const sorted = [...candidates].sort(
    (a, b) => (100 - b.condition + 100 - b.motivation) - (100 - a.condition + 100 - a.motivation)
  );
  const quitter = sorted[0];
  const stress = (100 - quitter.condition) + (100 - quitter.motivation);

  const chance = stress < 110 ? 0.07 : stress < 130 ? 0.16 : stress < 150 ? 0.28 : 0.42;
  if (Math.random() >= chance) return state;

  const reason =
    quitter.condition < 25
      ? 'コンディションが限界を超え、体調不良で離脱'
      : quitter.motivation < 25
      ? 'モチベーションが完全に失われ、退職を決意'
      : quitter.isSiloed
      ? 'チームからの長期孤立が限界となり突然の退職届'
      : '過労と継続的なストレスに耐えられず退職';

  return {
    ...state,
    members: state.members.filter(m => m.id !== quitter.id),
    morale: clamp(state.morale - 10),   // チーム士気に打撃
    quality: clamp(state.quality - 5),  // 知識流出で品質低下
    lastQuitEvent: {
      name: quitter.name,
      role: quitter.role,
      affiliation: quitter.affiliation,
      reason,
      condition: quitter.condition,
      motivation: quitter.motivation,
    },
  };
};

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

const maintenanceTasks: Task[] = [
  { id: 't1', title: '運用体制・オンコール整備', phaseId: 'operations', requiredManMonths: 1.0, bufferFactor: 1.3, assignedMembers: ['m1', 'm2'], isCritical: true },
  { id: 't2', title: '機能改善・バグ修正バックログ', phaseId: 'expansion', requiredManMonths: 1.5, bufferFactor: 1.2, assignedMembers: ['m2', 'm3'], isCritical: true },
  { id: 't3', title: '組織変革・体制移行対応', phaseId: 'organizational-change', requiredManMonths: 1.2, bufferFactor: 1.4, assignedMembers: ['m1', 'm3'], isCritical: false },
  { id: 't4', title: 'レガシー刷新計画・実施', phaseId: 'legacy-renewal', requiredManMonths: 2.0, bufferFactor: 1.5, assignedMembers: ['m3', 'm4'], isCritical: true },
  { id: 't5', title: '終息処理・引き継ぎドキュメント', phaseId: 'project-closure', requiredManMonths: 0.8, bufferFactor: 1.2, assignedMembers: ['m1', 'm2'], isCritical: false },
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
  lastQuitEvent: null,
  pendingClientMeeting: null,
  clientMeetingTriggeredPhaseIdx: -1,
  difficulty: 'normal',
  projectThemeId: 'retail-inventory',
  gameStarted: false,
});

const tryTriggerClientMeeting = (state: GameState, prevStakeholder: number): GameState => {
  if (state.pendingClientMeeting !== null) return state;
  if (state.difficulty.startsWith('pmo')) return state;
  if (state.difficulty.startsWith('ops')) return state;
  if (state.clientMeetingTriggeredPhaseIdx === state.phaseIndex) return state;

  const drop = prevStakeholder - state.stakeholder;
  const isLow = state.stakeholder < 35;
  const isSharpDrop = drop >= 15 && state.stakeholder < 55;

  if (!isLow && !isSharpDrop) return state;

  const urgency = state.stakeholder < 25 ? 'urgent' : 'normal';
  const reason = urgency === 'urgent'
    ? '「このままでは契約の継続を検討せざるを得ません」と強い懸念が届いています。'
    : '「プロジェクトの現状について直接確認したい」と面談要請が届いています。';

  return {
    ...state,
    pendingClientMeeting: { reason, urgency },
    clientMeetingTriggeredPhaseIdx: state.phaseIndex,
  };
};

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'startGame': {
      const config = difficultyConfigs[action.difficulty];
      const theme = projectThemes[action.difficulty].find((t) => t.id === action.projectThemeId);
      const mods = theme?.statModifiers ?? {};
      const teamMembers = allTeamMembers.slice(0, config.teamSize);
      const tasks = config.useMaintPhases ? maintenanceTasks : initialTasks;
      return normalizeState({
        ...initialState,
        difficulty: action.difficulty,
        projectThemeId: action.projectThemeId,
        gameStarted: true,
        members: teamMembers,
        tasks,
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
      const activePhaseList = getPhasesForDifficulty(state.difficulty, state.projectThemeId);
      const rawEffect = action.choice.effects;
      const effect = scaleEffect(rawEffect, state.difficulty);
      const nextScenarioIndex = state.scenarioIndex + 1;
      const currentPhase = activePhaseList[state.phaseIndex];
      const scenarioLimit = config.scenariosPerPhase;
      const willFinishPhase = nextScenarioIndex >= Math.min(currentPhase.scenarios.length, scenarioLimit);

      const last2 = state.decisions.slice(-2);
      const consecutiveBad = last2.length === 2 &&
        last2.every(d => d.effects.quality + d.effects.cost + d.effects.schedule + d.effects.stakeholder + d.effects.morale < -3);
      const thisChoiceBad = effect.quality + effect.cost + effect.schedule + effect.stakeholder + effect.morale < -3;
      const penaltyMorale = consecutiveBad && thisChoiceBad ? clamp(-Math.round(6 * config.effectMultiplier), -30, 0) : 0;
      const penaltyPmMental = consecutiveBad && thisChoiceBad ? -5 : 0;

      const afterChoice: GameState = normalizeState({
        ...state,
        scenarioIndex: nextScenarioIndex,
        quality: clamp(state.quality + effect.quality),
        cost: clamp(state.cost + effect.cost),
        schedule: clamp(state.schedule + effect.schedule, -100, 100),
        stakeholder: clamp(state.stakeholder + effect.stakeholder),
        morale: clamp(state.morale + effect.morale + penaltyMorale),
        pmMental: clamp(state.pmMental + penaltyPmMental),
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

      const cascaded = applyCascadeEffects(afterChoice, state.difficulty);
      const baseNext: GameState = { ...afterChoice, quality: cascaded.quality, stakeholder: cascaded.stakeholder, morale: cascaded.morale };

      if (!willFinishPhase && state.pendingEvent === null && Math.random() < config.eventProbability) {
        const phaseId = currentPhase.id;
        const isPmo = state.difficulty.startsWith('pmo');
        const isOps = state.difficulty.startsWith('ops');
        const eventPool = isPmo ? pmoRandomEvents : isOps ? memberRandomEvents : randomEvents;
        const available = eventPool.filter(
          (e) => (e.phaseIds.includes('all') || e.phaseIds.includes(phaseId)) &&
            !state.triggeredEventIds.includes(e.id) &&
            !(e.excludeDifficulties?.includes(state.difficulty))
        );
        if (available.length > 0) {
          const event = available[Math.floor(Math.random() * available.length)];
          return checkMemberQuit({ ...baseNext, pendingEvent: event, triggeredEventIds: [...state.triggeredEventIds, event.id] });
        }
      }
      const withQuit = checkMemberQuit({ ...baseNext, lastQuitEvent: null });
      return tryTriggerClientMeeting(withQuit, state.stakeholder);
    }
    case 'resolveEvent': {
      if (!state.pendingEvent) return state;
      const event = state.pendingEvent;
      const choice = event.choices.find((c) => c.id === action.choiceId);
      if (!choice) return state;
      const effect = scaleEffect(choice.effects, state.difficulty);
      const resolvePhases = getPhasesForDifficulty(state.difficulty, state.projectThemeId);
      const afterEvent = normalizeState({
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
            phaseId: (resolvePhases[state.phaseIndex] ?? resolvePhases[0]).id,
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
      const cascadedEvent = applyCascadeEffects(afterEvent, state.difficulty);
      const resolvedState = { ...afterEvent, quality: cascadedEvent.quality, stakeholder: cascadedEvent.stakeholder, morale: cascadedEvent.morale, lastQuitEvent: null };
      const withQuitEvent = checkMemberQuit(resolvedState);
      return tryTriggerClientMeeting(withQuitEvent, state.stakeholder);
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
          ? { ...member, reportedProgress: member.actualProgress }  // 実態を露わにする
          : member
      );
      return normalizeState({ ...state, members: updatedMembers, pmMental: clamp(state.pmMental - 4) });
    }
    case 'hireTeamMember': {
      const candidate = allTeamMembers.find(m => m.id === action.memberId);
      if (!candidate) return state;
      if (state.members.find(m => m.id === action.memberId)) return state;
      const cost = hiringCostKpi(candidate);
      if (state.cost < cost) return state;
      const fit = calculateFit(candidate, state.members, action.phaseId);
      return normalizeState({
        ...state,
        members: [...state.members, { ...candidate, utilization: 0 }],
        cost: clamp(state.cost - cost),
        quality: clamp(state.quality + fit.qualityDelta),
        morale: clamp(state.morale + fit.moraleDelta),
      });
    }
    case 'clearQuitEvent':
      return { ...state, lastQuitEvent: null };
    case 'acceptClientMeeting':
      return { ...state, pendingClientMeeting: null };
    case 'dismissClientMeeting':
      return { ...state, pendingClientMeeting: null, stakeholder: clamp(state.stakeholder - 8) };
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
        lastQuitEvent: action.state.lastQuitEvent ?? null,
        pendingClientMeeting: action.state.pendingClientMeeting ?? null,
        clientMeetingTriggeredPhaseIdx: action.state.clientMeetingTriggeredPhaseIdx ?? -1,
        difficulty: action.state.difficulty ?? 'normal',
        projectThemeId: action.state.projectThemeId ?? 'retail-inventory',
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
