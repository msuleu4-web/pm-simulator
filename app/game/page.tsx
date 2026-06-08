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

// ── Reflection Chat (AI) ──────────────────────────────────────

type ChatMsg = { role: 'user' | 'assistant'; content: string };
type ReflectCtx = {
  playerName: string; endingType: string;
  quality: number; cost: number; delivery: number; trust: number; total: number;
};

const MAX_TURNS = 7;

function ReflectionChat({ ctx, onClose }: { ctx: ReflectCtx; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  // turnNumber = number of AI messages so far + 1 (next AI turn)
  const turnRef = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  // First turn: AI speaks first (client gives initial comment/criticism)
  useEffect(() => {
    sendToAI([], ctx, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendToAI(msgs: ChatMsg[], context: ReflectCtx, turn: number) {
    setLoading(true);
    try {
      const res = await fetch('/api/game-reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, turnNumber: turn, context }),
      });
      const data = await res.json() as { reply: string; finished: boolean };
      const newMsgs: ChatMsg[] = [...msgs, { role: 'assistant', content: data.reply }];
      setMessages(newMsgs);
      if (data.finished) setFinished(true);
      turnRef.current = turn + 1;
    } catch {
      setMessages([...msgs, { role: 'assistant', content: '（通信エラーが発生しました）' }]);
    }
    setLoading(false);
  }

  async function handleSend() {
    if (!input.trim() || loading || finished) return;
    const newMsgs: ChatMsg[] = [...messages, { role: 'user', content: input.trim() }];
    setMessages(newMsgs);
    setInput('');
    await sendToAI(newMsgs, ctx, turnRef.current);
  }

  const F = 'monospace, "Hiragino Sans", sans-serif';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 560, background: '#0d1a2e',
        borderRadius: 16, border: '2px solid #2a5a7c',
        display: 'flex', flexDirection: 'column', maxHeight: '85vh',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
      }}>
        {/* Header */}
        <div style={{ background: '#1a2e4a', borderRadius: '14px 14px 0 0', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#88aacc', fontSize: 10, letterSpacing: '0.2em', margin: 0 }}>AI振り返りセッション</p>
            <p style={{ color: '#e0eeff', fontSize: 14, fontWeight: 700, margin: '2px 0 0', fontFamily: F }}>
              佐々木部長（〇〇銀行）と振り返り
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!finished && (
              <span style={{ color: '#557799', fontSize: 11, fontFamily: F }}>
                {Math.min(turnRef.current - 1, MAX_TURNS)} / {MAX_TURNS}ターン
              </span>
            )}
            {finished && (
              <span style={{ color: '#4caf50', fontSize: 11, fontFamily: F, fontWeight: 700 }}>
                セッション終了
              </span>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#88aacc', fontSize: 20, cursor: 'pointer' }}>✕</button>
          </div>
        </div>

        {/* Score badge */}
        <div style={{ background: '#0a1520', padding: '8px 18px', display: 'flex', gap: 12, fontSize: 11, color: '#6688aa', fontFamily: F }}>
          <span>品質 {ctx.quality}</span><span>コスト {ctx.cost}</span>
          <span>納期 {ctx.delivery}</span><span>信頼度 {ctx.trust}</span>
          <span style={{ color: '#ffdd88' }}>合計 {ctx.total}/400　END {ctx.endingType}</span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a3a5c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginRight: 8, flexShrink: 0 }}>👔</div>
              )}
              <div style={{
                maxWidth: '78%', padding: '9px 13px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: m.role === 'user' ? '#2c5f8a' : '#1a2e3a',
                color: '#e0eeff', fontSize: 13, lineHeight: 1.7, fontFamily: F,
                border: `1px solid ${m.role === 'user' ? '#3a7ab0' : '#243a4a'}`,
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a3a5c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>👔</div>
              <div style={{ color: '#557799', fontSize: 12, fontFamily: F }}>入力中…</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {finished ? (
          <div style={{ padding: '14px 18px', borderTop: '1px solid #1a3a5c', textAlign: 'center' }}>
            <p style={{ color: '#4caf50', fontSize: 13, fontFamily: F, margin: 0 }}>
              振り返りセッションが終了しました。お疲れ様でした！
            </p>
            <button onClick={onClose} style={{
              marginTop: 10, background: '#1a4a2a', border: '1px solid #4caf50',
              borderRadius: 8, color: '#88ff99', padding: '8px 24px',
              fontSize: 13, fontFamily: F, cursor: 'pointer', fontWeight: 700,
            }}>
              閉じる
            </button>
          </div>
        ) : (
          <div style={{ padding: '10px 14px', borderTop: '1px solid #1a3a5c', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="感想・質問を入力…"
              disabled={loading}
              style={{
                flex: 1, background: '#0a1520', border: '1px solid #2a5a7c',
                borderRadius: 8, padding: '8px 12px', color: '#e0eeff',
                fontSize: 13, outline: 'none', fontFamily: F,
                opacity: loading ? 0.6 : 1,
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? '#1a3a5c' : '#2c5f8a',
                border: 'none', borderRadius: 8, color: '#fff',
                padding: '8px 16px', cursor: loading || !input.trim() ? 'default' : 'pointer',
                fontSize: 13, fontFamily: F, fontWeight: 700,
              }}
            >
              送信
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Phaser canvas wrapper ─────────────────────────────────────

function GameCanvas({ playerName, difficulty }: { playerName: string; difficulty: Difficulty }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [reflectCtx, setReflectCtx] = useState<ReflectCtx | null>(null);
  const [docImage, setDocImage] = useState<{ path: string; label: string } | null>(null);

  const closeDocImage = () => {
    setDocImage(null);
    // Notify Phaser to resume the scene (Z-key path already fired this event,
    // but a second dispatch is harmless since the { once: true } listener is gone)
    window.dispatchEvent(new CustomEvent('sier-doc-image-closed'));
  };

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

    const onReflect = (e: Event) => {
      setReflectCtx((e as CustomEvent<ReflectCtx>).detail);
    };
    const onShowDocImage = (e: Event) => {
      setDocImage((e as CustomEvent<{ path: string; label: string }>).detail);
    };
    // Z-key close path: Phaser dispatches this event, React must also clear docImage
    const onDocImageClosed = () => { setDocImage(null); };
    window.addEventListener('sier-open-reflection', onReflect);
    window.addEventListener('sier-show-doc-image', onShowDocImage);
    window.addEventListener('sier-doc-image-closed', onDocImageClosed);

    return () => {
      cancelled = true;
      window.removeEventListener('sier-open-reflection', onReflect);
      window.removeEventListener('sier-show-doc-image', onShowDocImage);
      window.removeEventListener('sier-doc-image-closed', onDocImageClosed);
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
        position: 'fixed',
        inset: 0,
        background: '#050d18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />
      {reflectCtx && (
        <ReflectionChat ctx={reflectCtx} onClose={() => setReflectCtx(null)} />
      )}

      {docImage && (
        <div
          onClick={closeDocImage}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.93)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '16px 16px 8px',
            cursor: 'zoom-out',
          }}
        >
          <p style={{
            color: '#C8A040', fontSize: 12, fontFamily: 'monospace',
            marginBottom: 10, letterSpacing: '0.05em', textAlign: 'center',
          }}>
            📄 {docImage.label}
          </p>
          <img
            src={docImage.path}
            alt={docImage.label}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 80px)',
              objectFit: 'contain',
              borderRadius: 6,
              border: '2px solid #C8A040',
              boxShadow: '0 4px 32px rgba(0,0,0,0.8)',
            }}
          />
          <p style={{
            color: '#556677', fontSize: 11, fontFamily: 'monospace',
            marginTop: 10, textAlign: 'center',
          }}>
            タップ / クリックで閉じる　|　Zキーでも閉じる
          </p>
        </div>
      )}
      <p
        style={{
          position: 'absolute',
          bottom: 6,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#334455',
          fontSize: 11,
          fontFamily: 'monospace',
          pointerEvents: 'none',
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
