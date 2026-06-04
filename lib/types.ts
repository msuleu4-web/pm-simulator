export type DocReference = {
  type: '課題管理表' | 'メール' | '議事録' | 'リスク管理表';
  title: string;
  content: string;
};

export type Effect = {
  quality: number;
  cost: number;
  schedule: number;
  stakeholder: number;
  morale: number;
};

export type Choice = {
  id: string;
  label: string;
  summary: string;
  effects: Effect;
  explanation: string;
  pmBokTags: string[];
  consequence?: string;
  flag?: string;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  pmTip?: string;
  clientChat?: boolean;
  docs: DocReference[];
  choices: Choice[];
};

export type Phase = {
  id: string;
  label: string;
  description: string;
  scenarios: Scenario[];
};

export type MemberAffiliation = '自社プロパー' | '協力会社A' | '協力会社B' | '協力会社C' | 'SES（客先常駐）' | 'オフショア';
export type MemberRole = 'PL' | 'SE' | 'PG' | 'テスター' | 'インフラ' | 'DBA' | 'デザイナー' | 'QA' | 'アナリスト' | 'PM';

export type TeamMember = {
  id: string;
  name: string;
  affiliation: MemberAffiliation;
  role: MemberRole;
  skillLevel: number;
  experienceYears: number;
  specialty: string;
  weakness: string;
  costPerMonth: number;
  utilization: number;
  condition: number;
  motivation: number;
  isSiloed: boolean;
  reportedProgress: number;
  actualProgress: number;
};

export type Task = {
  id: string;
  title: string;
  phaseId: string;
  requiredManMonths: number;
  bufferFactor: number;
  assignedMembers: string[];
  isCritical: boolean;
};

export type DecisionLog = {
  phaseId: string;
  scenarioId: string;
  choiceId: string;
  choiceLabel: string;
  timestamp: string;
  pmBokTags: string[];
  explanation: string;
  effects: Effect;
  isEvent?: boolean;
};

export type RandomEventChoice = {
  id: string;
  label: string;
  summary: string;
  effects: Effect;
  explanation: string;
  pmBokTags: string[];
};

export type RandomEventSeverity = 'medium' | 'high' | 'critical';

export type RandomEvent = {
  id: string;
  title: string;
  description: string;
  severity: RandomEventSeverity;
  phaseIds: string[];
  excludeDifficulties?: Difficulty[];
  choices: RandomEventChoice[];
};

export type Difficulty = 'easy' | 'normal' | 'hard' | 'ultra' | 'maint-easy' | 'maint-hard' | 'pmo-support' | 'pmo-control' | 'pmo-directive' | 'ops-easy' | 'ops-normal' | 'ops-hard';

export type ProjectCategory = '新規開発' | '保守運用' | '移行・刷新' | 'PMO';

export type ProjectTheme = {
  id: string;
  title: string;
  client: string;
  description: string;
  category?: ProjectCategory;
  statModifiers: Partial<Pick<GameState, 'quality' | 'cost' | 'schedule' | 'stakeholder' | 'morale'>>;
};

export type QuitEvent = {
  name: string;
  role: string;
  affiliation: string;
  reason: string;
  condition: number;
  motivation: number;
};

export type ClientMeetingRequest = {
  reason: string;
  urgency: 'normal' | 'urgent';
};

export type GameState = {
  phaseIndex: number;
  scenarioIndex: number;
  quality: number;
  cost: number;
  schedule: number;
  stakeholder: number;
  morale: number;
  decisions: DecisionLog[];
  phaseFlags: Record<string, string>;
  members: TeamMember[];
  tasks: Task[];
  bufferFactor: number;
  pmMental: number;
  pendingEvent: RandomEvent | null;
  triggeredEventIds: string[];
  lastQuitEvent: QuitEvent | null;
  pendingClientMeeting: ClientMeetingRequest | null;
  clientMeetingTriggeredPhaseIdx: number;
  difficulty: Difficulty;
  projectThemeId: string;
  gameStarted: boolean;
};

export type GameAction =
  | { type: 'startGame'; difficulty: Difficulty; projectThemeId: string }
  | { type: 'selectChoice'; phaseId: string; scenarioId: string; choice: Choice }
  | { type: 'resolveEvent'; choiceId: string }
  | { type: 'assignMember'; taskId: string; memberId: string }
  | { type: 'performOneOnOne'; memberId: string }
  | { type: 'verifyMemberProgress'; memberId: string }
  | { type: 'hireTeamMember'; memberId: string; phaseId: string }
  | { type: 'clearQuitEvent' }
  | { type: 'acceptClientMeeting' }
  | { type: 'dismissClientMeeting' }
  | { type: 'setBufferFactor'; bufferFactor: number }
  | { type: 'nextPhase' }
  | { type: 'reset' }
  | { type: 'load'; state: GameState };
