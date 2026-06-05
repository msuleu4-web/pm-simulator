'use client';

import { useState, useEffect, useRef } from 'react';
import type { Game } from 'phaser';

type Difficulty = 'easy' | 'normal' | 'hard';

const DIFF_CONFIG: Record<Difficulty, {
  label: string; sub: string; color: string; border: string; bg: string;
  choices: string; events: string; effect: string;
}> = {
  easy:   { label: 'イージー',  sub: '3択 / ランダムイベントなし / 効果65%',  color: '#44cc88', border: '#1a7a44', bg: '#0a2018', choices: '3択', events: 'なし',     effect: '×0.65' },
  normal: { label: 'ノーマル',  sub: '4択 / 25%でランダムイベント / 効果100%', color: '#4a90d9', border: '#1a4a7a', bg: '#0d1a2e', choices: '4択', events: '25%',    effect: '×1.0'  },
  hard:   { label: 'ハード',    sub: '5択 / 50%でランダムイベント / 効果150%', color: '#e05050', border: '#7a1a1a', bg: '#2a0808', choices: '5択', events: '50%',    effect: '×1.5'  },
};

// ── Title screen (React) ──────────────────────────────────────

function TitleScreen({ onStart }: { onStart: (name: string, difficulty: Difficulty) => void }) {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  const dc = DIFF_CONFIG[difficulty];

  return (
    <main
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d1a2e 0%, #1a2e4a 60%, #0a2a1a 100%)',
        fontFamily: 'monospace', padding: '24px',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ color: '#4a90d9', fontSize: 12, letterSpacing: '0.3em', marginBottom: 10 }}>SIer現場教育RPG</p>
        <h1 style={{ color: '#e0eeff', fontSize: 30, fontWeight: 900, lineHeight: 1.3, marginBottom: 10 }}>
          配属先は、現場。
        </h1>
        <p style={{ color: '#7a9abc', fontSize: 13, maxWidth: 420, lineHeight: 1.8 }}>
          あなたは新人SE1年目。地方銀行の勘定系サブシステム刷新プロジェクトへ配属された。<br />
          QCDを守り、信頼を積み上げ、炎上を乗り越えろ。
        </p>
      </div>

      {/* Difficulty selection */}
      <div style={{ width: '100%', maxWidth: 520, marginBottom: 28 }}>
        <p style={{ color: '#778899', fontSize: 12, textAlign: 'center', marginBottom: 14, letterSpacing: '0.2em' }}>
          難易度を選択
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {(Object.keys(DIFF_CONFIG) as Difficulty[]).map((d) => {
            const cfg = DIFF_CONFIG[d];
            const sel = d === difficulty;
            return (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  flex: 1, padding: '14px 8px', borderRadius: 12, cursor: 'pointer',
                  border: `2px solid ${sel ? cfg.color : '#2a3a4a'}`,
                  background: sel ? cfg.bg : '#0a131f',
                  color: sel ? cfg.color : '#445566',
                  fontWeight: sel ? 900 : 400,
                  fontFamily: 'monospace',
                  transition: 'all 0.15s',
                  outline: 'none',
                }}
              >
                <div style={{ fontSize: 15, marginBottom: 6 }}>{cfg.label}</div>
                <div style={{ fontSize: 10, color: sel ? '#aabbcc' : '#334455', lineHeight: 1.8 }}>
                  <div>選択肢：{cfg.choices}</div>
                  <div>イベント：{cfg.events}</div>
                  <div>効果：{cfg.effect}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{
          marginTop: 10, padding: '8px 14px', borderRadius: 8,
          background: '#0d1a2e', border: `1px solid ${dc.border}`,
          color: dc.color, fontSize: 11, textAlign: 'center',
        }}>
          {dc.sub}
        </div>
      </div>

      {/* Name input */}
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <label style={{ color: '#aabbcc', fontSize: 13, display: 'block', marginBottom: 8 }}>
          プレイヤー名を入力してください
        </label>
        <input
          type="text" maxLength={12} placeholder="例：田中一郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onStart(name || '新人SE', difficulty); }}
          style={{
            width: '100%', padding: '10px 16px', fontSize: 16,
            borderRadius: 8, border: '2px solid #2a5a7c',
            background: '#0d1f33', color: '#e0eeff',
            textAlign: 'center', outline: 'none', boxSizing: 'border-box',
          }}
          autoFocus
        />

        <button
          onClick={() => onStart(name || '新人SE', difficulty)}
          style={{
            marginTop: 16, width: '100%', padding: '13px',
            fontSize: 16, fontWeight: 700, borderRadius: 8, border: 'none',
            background: `linear-gradient(90deg, ${dc.border}, ${dc.color}33)`,
            borderTop: `2px solid ${dc.color}`,
            color: '#ffffff', cursor: 'pointer', letterSpacing: '0.05em',
          }}
        >
          {DIFF_CONFIG[difficulty].label}でゲームスタート →
        </button>
      </div>

      <div style={{ marginTop: 28, color: '#334455', fontSize: 11, textAlign: 'center', lineHeight: 1.8 }}>
        矢印キー / WASD：移動　Zキー / Enter：決定　スマホ：画面下パッド
      </div>

      <div style={{ marginTop: 16 }}>
        <a href="/" style={{ color: '#3a6a8a', fontSize: 11, textDecoration: 'none', borderBottom: '1px solid #3a6a8a' }}>
          ← PMシミュレーターに戻る
        </a>
      </div>
    </main>
  );
}

// ── Phaser canvas wrapper ─────────────────────────────────────

function GameCanvas({ playerName, difficulty }: { playerName: string; difficulty: Difficulty }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    const init = async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore -- webpack resolves .ts without extension; NodeNext tsc requires .js but that breaks webpack
      const { createGame } = await import('../../src/game/PhaserGame');
      // @ts-ignore
      const { gameState } = await import('../../src/game/state/gameState');
      gameState.difficulty = difficulty;
      if (!cancelled && containerRef.current && !gameRef.current) {
        gameRef.current = createGame(containerRef.current, playerName);
      }
    };

    init().catch(console.error);

    return () => {
      cancelled = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  // playerName only changes when the game starts fresh — intentionally omitted from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#050d18',
      }}
    >
      <div ref={containerRef} style={{ width: '100%', maxWidth: 800 }} />
      <p
        style={{
          color: '#334455',
          fontSize: 11,
          marginTop: 8,
          fontFamily: 'monospace',
          textAlign: 'center',
        }}
      >
        矢印キー/WASD：移動　Zキー/Enter：決定　タッチ：画面下パッド
      </p>
    </main>
  );
}

// ── Page entry point ──────────────────────────────────────────

export default function GamePage() {
  const [phase, setPhase] = useState<'title' | 'playing'>('title');
  const [playerName, setPlayerName] = useState('新人SE');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  if (phase === 'title') {
    return (
      <TitleScreen
        onStart={(name, diff) => {
          setPlayerName(name || '新人SE');
          setDifficulty(diff);
          setPhase('playing');
        }}
      />
    );
  }

  return <GameCanvas playerName={playerName} difficulty={difficulty} />;
}
