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
  docs: DocReference[];
  choices: Choice[];
};

export type Phase = {
  id: string;
  label: string;
  description: string;
  scenarios: Scenario[];
};

export type MemberAffiliation = '自社プロパー' | '協力会社A' | '協力会社B' | 'SES（客先常駐）';
export type MemberRole = 'PL' | 'SE' | 'PG' | 'テスター';

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
  choices: RandomEventChoice[];
};

export type Difficulty = 'easy' | 'normal' | 'hard' | 'ultra';

export type ProjectTheme = {
  id: string;
  title: string;
  client: string;
  description: string;
  statModifiers: Partial<Pick<GameState, 'quality' | 'cost' | 'schedule' | 'stakeholder' | 'morale'>>;
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
  | { type: 'setBufferFactor'; bufferFactor: number }
  | { type: 'nextPhase' }
  | { type: 'reset' }
  | { type: 'load'; state: GameState };
