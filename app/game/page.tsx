'use client';

import { useState, useEffect, useRef } from 'react';
import type { Game } from 'phaser';

// ── Title screen (React) ──────────────────────────────────────

function TitleScreen({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState('');

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d1a2e 0%, #1a2e4a 60%, #0a2a1a 100%)',
        fontFamily: 'monospace',
        padding: '24px',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{ color: '#4a90d9', fontSize: 13, letterSpacing: '0.3em', marginBottom: 12 }}>
          SIer現場教育RPG
        </p>
        <h1
          style={{
            color: '#e0eeff',
            fontSize: 32,
            fontWeight: 900,
            lineHeight: 1.3,
            marginBottom: 10,
          }}
        >
          配属先は、現場。
        </h1>
        <p style={{ color: '#7a9abc', fontSize: 14, maxWidth: 440, lineHeight: 1.8 }}>
          あなたは新人SE1年目。<br />
          地方銀行の勘定系サブシステム刷新プロジェクトへ配属された。<br />
          QCDを守り、信頼を積み上げ、炎上を乗り越えろ。
        </p>
      </div>

      {/* Feature badges */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
        {['7章構成', 'ウォーターフォール体験', 'QCD管理', '多重下請け', '用語解説付き'].map((t) => (
          <span
            key={t}
            style={{
              background: '#1a3a5c',
              color: '#88aacccc',
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 20,
              border: '1px solid #2a5a7c',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Name input */}
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <label style={{ color: '#aabbcc', fontSize: 13, display: 'block', marginBottom: 8 }}>
          プレイヤー名を入力してください
        </label>
        <input
          type="text"
          maxLength={12}
          placeholder="例：田中一郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onStart(name || '新人SE'); }}
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: 16,
            borderRadius: 8,
            border: '2px solid #2a5a7c',
            background: '#0d1f33',
            color: '#e0eeff',
            textAlign: 'center',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          autoFocus
        />

        <button
          onClick={() => onStart(name || '新人SE')}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '12px',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(90deg, #2c5f8a, #1a4a6a)',
            color: '#ffffff',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.opacity = '0.85'; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.opacity = '1'; }}
        >
          ゲームスタート →
        </button>
      </div>

      {/* Controls hint */}
      <div style={{ marginTop: 40, color: '#445566', fontSize: 11, textAlign: 'center', lineHeight: 1.8 }}>
        操作：矢印キー / WASD で移動　｜　Zキー / Enterキー で決定<br />
        スマートフォン：画面下のバーチャルパッドで操作
      </div>

      {/* Navigation back */}
      <div style={{ marginTop: 24 }}>
        <a
          href="/"
          style={{
            color: '#3a6a8a',
            fontSize: 12,
            textDecoration: 'none',
            borderBottom: '1px solid #3a6a8a',
          }}
        >
          ← PMシミュレーターに戻る
        </a>
      </div>
    </main>
  );
}

// ── Phaser canvas wrapper ─────────────────────────────────────

function GameCanvas({ playerName }: { playerName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    const init = async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore -- webpack resolves .ts without extension; NodeNext tsc requires .js but that breaks webpack
      const { createGame } = await import('../../src/game/PhaserGame');
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

  if (phase === 'title') {
    return (
      <TitleScreen
        onStart={(name) => {
          setPlayerName(name || '新人SE');
          setPhase('playing');
        }}
      />
    );
  }

  return <GameCanvas playerName={playerName} />;
}
