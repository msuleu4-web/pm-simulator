'use client';

import { useEffect, useMemo, useState } from 'react';
import { allPhases, useGameState, getPhasesForDifficulty } from '../lib/useGameReducer';
import { difficultyConfigs, projectThemes } from '../lib/difficultyConfig';
import type { Difficulty } from '../lib/types';
import { LoginPage } from './components/LoginPage';
import { PhaseStepper } from './components/PhaseStepper';
import { GanttChart } from './components/GanttChart';
import { IssueTracker } from './components/IssueTracker';
import { GlossaryPanel } from './components/GlossaryPanel';
import { LearningLogPanel } from './components/LearningLogPanel';
import { ProjectEvaluationPanel } from './components/ProjectEvaluationPanel';
import { ScenarioCard } from './components/ScenarioCard';
import { TaskAssignmentPanel } from './components/TaskAssignmentPanel';
import { TeamCarePanel } from './components/TeamCarePanel';
import { ProgressRealityPanel } from './components/ProgressRealityPanel';
import { DashboardHeroPanel } from './components/DashboardHeroPanel';
import { GrowthTrendPanel } from './components/GrowthTrendPanel';
import { AbilityRadarPanel } from './components/AbilityRadarPanel';
import { NextActionPanel } from './components/NextActionPanel';
import { RoadmapPanel } from './components/RoadmapPanel';
import { CompactTeamSummary } from './components/CompactTeamSummary';
import { DifficultySelect } from './components/DifficultySelect';
import TermModal from './components/TermModal';
import { RandomEventCard } from './components/RandomEventCard';
import { pmBokDefinitions } from '../lib/pmBokDefinitions';
import ProgressPanel from './components/ProgressPanel';
import QuizSummaryPanel from './components/QuizSummaryPanel';
import LearningActivityPanel from './components/LearningActivityPanel';
import { LearningProgressProvider, useLearningProgress } from '../lib/useLearningProgress';

const difficultyBadgeColor: Record<Difficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  normal: 'bg-blue-100 text-blue-700',
  hard: 'bg-orange-100 text-orange-700',
  ultra: 'bg-violet-100 text-violet-700',
  'maint-easy': 'bg-teal-100 text-teal-700',
  'maint-hard': 'bg-teal-200 text-teal-800',
};

function HomeContent() {
  const { state, dispatch } = useGameState();
  const config = difficultyConfigs[state.difficulty];
  const activePhases = getPhasesForDifficulty(state.difficulty);
  const currentPhase = activePhases[state.phaseIndex] ?? activePhases[0];
  const scenarioLimit = config.scenariosPerPhase;
  const activeScenarios = currentPhase.scenarios.slice(0, scenarioLimit);
  const hasFinishedPhase = state.scenarioIndex >= activeScenarios.length;
  const hasMorePhase = state.phaseIndex < config.phaseCount - 1;
  const scenario = activeScenarios[state.scenarioIndex] ?? activeScenarios[0];
  const projectTheme = projectThemes[state.difficulty].find((t) => t.id === state.projectThemeId);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<{ label: string; explanation: string; pmBokTags: string[] } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [ultraUnlocked, setUltraUnlocked] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('pm-sim-ultra-unlocked') === 'true' : false
  );
  const learning = useLearningProgress();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('pm-sim-username') ?? '');
  }, []);

  function handleLogout() {
    localStorage.removeItem('pm-sim-auth');
    localStorage.removeItem('pm-sim-username');
    window.location.reload();
  }

  // Check Ultra unlock after Hard mode completion
  const isGameComplete = hasFinishedPhase && !hasMorePhase;
  useEffect(() => {
    if (isGameComplete && state.difficulty === 'hard' && !ultraUnlocked) {
      const avgScore = Math.round(
        (state.quality + state.cost + Math.max(0, state.schedule + 50) + state.stakeholder + state.morale) / 5
      );
      if (avgScore >= 75) {
        localStorage.setItem('pm-sim-ultra-unlocked', 'true');
        setUltraUnlocked(true);
      }
    }
  }, [isGameComplete, state.difficulty, ultraUnlocked, state.quality, state.cost, state.schedule, state.stakeholder, state.morale]);

  const summaryItems = useMemo(
    () => state.decisions.map((decision) => ({
      ...decision,
      phaseLabel: activePhases.find((phase) => phase.id === decision.phaseId)?.label ??
        allPhases.find((phase) => phase.id === decision.phaseId)?.label ?? '',
    })),
    [state.decisions, activePhases]
  );

  const decisionTagCounts = useMemo(() => {
    return state.decisions.reduce((tally, decision) => {
      decision.pmBokTags.forEach((tag) => { tally[tag] = (tally[tag] ?? 0) + 1; });
      return tally;
    }, {} as Record<string, number>);
  }, [state.decisions]);

  const currentScenarioTags = useMemo(() => {
    const s = activeScenarios[state.scenarioIndex] ?? activeScenarios[0];
    return new Set(s.choices.flatMap((choice) => choice.pmBokTags));
  }, [activeScenarios, state.scenarioIndex]);

  // 炎上レベル: KPIが悪いほどスノーボール警告
  const enjoLevel = useMemo(() => {
    const kpis = [state.quality, state.cost, Math.max(0, state.schedule + 50), state.stakeholder, state.morale];
    const inCrisis = kpis.filter(v => v < 50).length;
    const inSevere = kpis.filter(v => v < 35).length;
    if (inSevere >= 2 || state.pmMental < 25) return 3;
    if (inCrisis >= 3) return 2;
    if (inCrisis >= 1) return 1;
    return 0;
  }, [state.quality, state.cost, state.schedule, state.stakeholder, state.morale, state.pmMental]);

  const xp = Math.min(2400, state.decisions.length * 20 + state.morale * 3 + state.pmMental * 2);
  const level = Math.max(1, Math.min(20, Math.floor(xp / 120) + 1));
  const streak = Math.max(1, Math.min(28, state.phaseIndex * 3 + state.decisions.length + 1));
  const nextAction = hasFinishedPhase
    ? hasMorePhase ? '次フェーズの戦略を確認し、PM判断の視点を整理しましょう。' : '最終リザルトをもとに次回の学習重点と改善ポイントをまとめましょう。'
    : 'チームコンディションと進捗の差を確認し、次の意思決定に備えましょう。';
  const nextActions = [
    state.bufferFactor >= 0.9 ? 'バッファを維持して手戻りリスクを低減' : '必要ならバッファを増やし余裕を確保',
    state.members.some((m) => m.utilization >= 85) ? '負荷の高いメンバーに1on1を実施' : 'メンバーの進捗報告を再確認',
    state.members.some((m) => m.reportedProgress - m.actualProgress >= 15) ? '進捗実態の差を解消するため裏取りを実施' : 'ステークホルダーと合意形成を強化する',
  ];
  const roadmapItems = [
    { title: '見積もりとバッファ設計', subtitle: '変化に強い計画を作るため、余裕を先に確保します。', badge: '必須' },
    { title: 'チームケアの優先度設定', subtitle: '疲弊メンバーを早めにケアして後半戦の安定化を図ります。', badge: '優先' },
    { title: '進捗の実態確認', subtitle: '自己申告と実際の差を埋めて信頼できる報告を作ります。', badge: '推奨' },
  ];
  const growthValues = [
    Math.min(100, state.quality),
    Math.min(100, state.cost),
    Math.min(100, Math.max(0, state.schedule + 50)),
    Math.min(100, state.stakeholder),
    Math.min(100, state.morale),
  ];

  // Show difficulty select if game not started
  if (!state.gameStarted) {
    return (
      <DifficultySelect
        ultraUnlocked={ultraUnlocked}
        onStart={(difficulty: Difficulty, projectThemeId: string) => {
          dispatch({ type: 'startGame', difficulty, projectThemeId });
          setLastFeedback(null);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">PMシミュレーター</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${difficultyBadgeColor[state.difficulty]}`}>
                  {config.label} · {config.weeks}週
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">{projectTheme?.title ?? 'プロジェクト'}</h1>
              <p className="mt-1 text-sm text-slate-500">{projectTheme?.client}</p>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">{projectTheme?.description}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
              {loggedInUser && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">{loggedInUser}</span>
                  <button type="button" onClick={handleLogout} className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-700">ログアウト</button>
                </div>
              )}
              {confirmReset ? (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2">
                  <span className="text-xs font-semibold text-red-700">リセットしますか？</span>
                  <button type="button" onClick={() => { dispatch({ type: 'reset' }); setLastFeedback(null); setConfirmReset(false); }} className="rounded-xl bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700 transition">はい</button>
                  <button type="button" onClick={() => setConfirmReset(false)} className="rounded-xl bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300 transition">いいえ</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmReset(true)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-red-300 hover:text-red-600">↺ リセット</button>
              )}
            </div>
          </div>
        </header>

        {/* Ultra unlock banner */}
        {isGameComplete && state.difficulty === 'hard' && ultraUnlocked && (
          <div className="rounded-2xl border border-violet-300 bg-violet-50 px-5 py-4">
            <p className="text-sm font-bold text-violet-800">🎉 ウルトラモード解放！</p>
            <p className="mt-1 text-xs text-violet-700">ハードモードをスコア75以上でクリアしました。200週の超長期プロジェクトに挑戦できます。</p>
          </div>
        )}

        {enjoLevel >= 2 && (
          <div className={`rounded-2xl border px-5 py-4 ${enjoLevel === 3 ? 'border-red-500 bg-red-50' : 'border-orange-400 bg-orange-50'}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{enjoLevel === 3 ? '🔥' : '⚠️'}</span>
              <div>
                <p className={`font-bold ${enjoLevel === 3 ? 'text-red-800' : 'text-orange-800'}`}>
                  {enjoLevel === 3 ? '炎上中 ── プロジェクトが崩壊寸前です' : '赤信号 ── 複数のKPIが危険水域に入っています'}
                </p>
                <p className={`mt-0.5 text-sm ${enjoLevel === 3 ? 'text-red-700' : 'text-orange-700'}`}>
                  {enjoLevel === 3
                    ? '悪い判断が連鎖してKPIが雪だるま式に悪化しています。今すぐ立て直しの判断を。'
                    : 'このまま放置すると炎上案件になります。チームの状態とKPIを確認してください。'}
                </p>
              </div>
            </div>
          </div>
        )}

        <DashboardHeroPanel state={state} xp={xp} level={level} streak={streak} nextAction={nextAction} />

        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.95fr]">
          <div className="space-y-6">
            {state.pendingEvent ? (
              <RandomEventCard event={state.pendingEvent} onResolve={(choiceId) => dispatch({ type: 'resolveEvent', choiceId })} />
            ) : hasFinishedPhase ? (
              <div className="space-y-6">
                <div className="rounded-3xl border border-brand-200 bg-brand-50/70 p-6 shadow-soft">
                  <h2 className="text-xl font-semibold text-brand-900">{currentPhase.label} フェーズ完了</h2>
                  <p className="mt-3 text-slate-700">
                    {hasMorePhase
                      ? 'このフェーズは完了しました。次のフェーズへ進み、PM判断の精度を高めてください。'
                      : 'プロジェクト完了です。WBS進行と成果をもとに最終評価を確認しましょう。'}
                  </p>
                  {hasMorePhase && (
                    <button type="button" onClick={() => dispatch({ type: 'nextPhase' })} className="mt-6 inline-flex items-center justify-center rounded-3xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
                      次のフェーズへ進む
                    </button>
                  )}
                </div>
                {!hasMorePhase && <ProjectEvaluationPanel state={state} />}
              </div>
            ) : (
              <div className="space-y-6">
                {selectedTag && (
                  <div className="rounded-3xl border border-brand-200 bg-brand-50/70 p-4 text-sm text-brand-900">
                    選択中の用語: <span className="font-semibold">{selectedTag}</span>。関連する選択肢を強調表示しています。
                  </div>
                )}
                {lastFeedback && (
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-sky-600">前回の判断</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{lastFeedback.label}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{lastFeedback.explanation}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {lastFeedback.pmBokTags.map((tag) => (
                            <span key={tag} className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={() => setLastFeedback(null)} className="mt-0.5 rounded-full p-1 text-slate-400 hover:text-slate-600" aria-label="閉じる">✕</button>
                    </div>
                  </div>
                )}
                <ScenarioCard
                  scenario={scenario}
                  onSelectChoice={(choice) => {
                    setLastFeedback({ label: choice.label, explanation: choice.explanation, pmBokTags: choice.pmBokTags });
                    dispatch({ type: 'selectChoice', phaseId: currentPhase.id, scenarioId: scenario.id, choice });
                  }}
                  selectedTag={selectedTag ?? undefined}
                  clientInfo={projectTheme ? { name: projectTheme.client, description: projectTheme.description } : undefined}
                  kpiState={{ quality: state.quality, cost: state.cost, schedule: state.schedule, stakeholder: state.stakeholder, morale: state.morale }}
                  phaseLabel={currentPhase.label}
                />
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <GrowthTrendPanel values={growthValues} />
              <AbilityRadarPanel state={state} />
            </div>
          </div>

          <aside className="space-y-6">
            <CompactTeamSummary members={state.members} />
            <NextActionPanel actions={nextActions} />
            <RoadmapPanel items={roadmapItems} />
          </aside>
        </div>

        <details className="group rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-soft transition hover:shadow-lg group-open:border-brand-300">
          <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-slate-900 transition hover:text-brand-700">
            詳細インサイトを展開
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">すべての機能</span>
          </summary>
          <div className="mt-5 space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
              <TaskAssignmentPanel tasks={state.tasks} members={state.members} currentPhaseId={currentPhase.id} dispatch={dispatch} />
              <div className="space-y-6">
                <TeamCarePanel members={state.members} dispatch={dispatch} currentPhaseLabel={currentPhase.label} />
                <ProgressRealityPanel members={state.members} dispatch={dispatch} />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
              <PhaseStepper phases={activePhases} currentIndex={state.phaseIndex} />
              <GanttChart phases={activePhases} currentPhaseId={currentPhase.id} criticalPhaseIds={state.tasks.filter((t) => t.isCritical).map((t) => t.phaseId)} />
            </div>

            <IssueTracker phaseId={currentPhase.id} />

            <GlossaryPanel
              activeTags={[...currentScenarioTags]}
              tagUsage={decisionTagCounts}
              selectedTag={selectedTag}
              onSelectTag={(tag) => setSelectedTag(tag === selectedTag ? null : tag)}
            />

            {summaryItems.length > 0 && (
              <LearningLogPanel items={summaryItems} />
            )}

            <div className="grid gap-6 lg:grid-cols-3">
              <ProgressPanel count={learning.count} />
              <QuizSummaryPanel scores={learning.scores} />
              <LearningActivityPanel progress={learning.progress} scores={learning.scores} />
            </div>

            {selectedTag && (
              <TermModal term={selectedTag} description={pmBokDefinitions[selectedTag]} onClose={() => setSelectedTag(null)} />
            )}
          </div>
        </details>
      </div>
    </main>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(localStorage.getItem('pm-sim-auth') === 'true');
  }, []);

  if (authed === null) return null;
  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;
  return <>{children}</>;
}

export default function HomePage() {
  return (
    <AuthGate>
      <LearningProgressProvider>
        <HomeContent />
      </LearningProgressProvider>
    </AuthGate>
  );
}

