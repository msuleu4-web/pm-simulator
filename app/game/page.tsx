'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Game } from 'phaser';
import { CHAPTERS, getClearedChapters, isChapterUnlocked, getEarnedTitles, getModeChapterId, ENDINGS } from '../../src/game/chapters';
import { DIFFICULTY_CONFIG, getDifficulty, saveDifficulty, type Difficulty as SierDifficulty } from '../../src/game/difficulty';

const JP_FONT = '"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic","Meiryo",Arial,sans-serif';

const IMPLEMENTED_SCENES = new Set([
  'Chapter1Scene', 'Chapter2Scene', 'Chapter3Scene', 'Chapter4Scene', 'Chapter5Scene', 'Chapter6Scene', 'Chapter7Scene',
  'EasyChapter1Scene', 'EasyChapter2Scene', 'EasyChapter3Scene', 'EasyChapter4Scene', 'EasyChapter5Scene', 'EasyChapter6Scene', 'EasyChapter7Scene',
]);

// ── SIer道場 title screen (Phaser) ─────────────────────────────

function SierTitleCanvas({ onStart }: { onStart: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;

    const init = async () => {
      // @ts-ignore
      const { createGame } = await import('../../src/game/PhaserGame');
      if (!cancelled && containerRef.current && !gameRef.current) {
        gameRef.current = createGame(containerRef.current, 'TitleScene');
      }
    };

    init().catch(console.error);

    const onTitleStart = () => onStart();
    window.addEventListener('sier-title-start', onTitleStart);

    return () => {
      cancelled = true;
      window.removeEventListener('sier-title-start', onTitleStart);
      if (gameRef.current) { gameRef.current.destroy(true); gameRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ position: 'fixed', inset: 0, background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </main>
  );
}

// ── Difficulty picker (SIer道場) ───────────────────────────────

const SIER_DIFF_STYLE: Record<SierDifficulty, { color: string; border: string; bg: string }> = {
  easy:   { color: '#44cc88', border: '#1a7a44', bg: '#0a2018' },
  normal: { color: '#4a90d9', border: '#1a4a7a', bg: '#0d1a2e' },
  hard:   { color: '#e05050', border: '#7a1a1a', bg: '#2a0808' },
};

function DifficultyPicker({ value, onChange }: { value: SierDifficulty; onChange: (d: SierDifficulty) => void }) {
  return (
    <div style={{ width: '100%', maxWidth: 480, marginBottom: 20 }}>
      <p style={{ color: '#778899', fontSize: 12, textAlign: 'center', marginBottom: 10, letterSpacing: '0.2em', fontFamily: JP_FONT }}>
        難易度設定
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        {(Object.keys(DIFFICULTY_CONFIG) as SierDifficulty[]).map((d) => {
          const cfg = DIFFICULTY_CONFIG[d];
          const style = SIER_DIFF_STYLE[d];
          const sel = d === value;
          return (
            <button
              key={d}
              onClick={() => onChange(d)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                border: `2px solid ${sel ? style.color : '#2a3a4a'}`,
                background: sel ? style.bg : '#0a131f',
                color: sel ? style.color : '#556677',
                fontWeight: sel ? 900 : 400,
                fontFamily: 'monospace',
                transition: 'all 0.15s',
                outline: 'none',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 13, marginBottom: 4, fontFamily: JP_FONT }}>{cfg.label}</div>
              <div style={{ fontSize: 9, color: sel ? '#aabbcc' : '#334455', lineHeight: 1.5, fontFamily: JP_FONT }}>
                {cfg.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Chapter select (オフィス編) ────────────────────────────────

function ChapterSelect({ onPlay }: { onPlay: (sceneName: string) => void }) {
  const router = useRouter();
  const [cleared, setCleared] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<SierDifficulty>('normal');
  const [earnedTitles, setEarnedTitles] = useState<string[]>([]);

  useEffect(() => {
    setCleared(getClearedChapters());
    setDifficulty(getDifficulty());
    setEarnedTitles(getEarnedTitles());
  }, []);

  const handleDifficultyChange = (d: SierDifficulty) => {
    setDifficulty(d);
    saveDifficulty(d);
  };

  return (
    <main
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d1a2e 0%, #1a2e4a 60%, #0a2a1a 100%)',
        fontFamily: 'monospace', padding: '24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <p style={{ color: '#4a90d9', fontSize: 12, letterSpacing: '0.3em', marginBottom: 10 }}>OFFICE EDITION</p>
        <h1 style={{ color: '#e0eeff', fontSize: 24, fontWeight: 900 }}>チャプターを選択</h1>
      </div>

      {earnedTitles.length > 0 && (
        <div style={{
          width: '100%', maxWidth: 480, marginBottom: 18, padding: '12px 16px',
          borderRadius: 10, border: '1px solid #3a4a5a', background: '#0d1622',
        }}>
          <p style={{ color: '#88aacc', fontSize: 11, letterSpacing: '0.1em', marginBottom: 8, fontFamily: JP_FONT }}>
            獲得した称号
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {earnedTitles.map((title) => {
              const ending = Object.values(ENDINGS).find((e) => e.title === title);
              const color = ending?.color ?? '#cccccc';
              return (
                <span
                  key={title}
                  style={{
                    color, fontSize: 12, fontWeight: 700, fontFamily: JP_FONT,
                    border: `1px solid ${color}`, borderRadius: 6, padding: '4px 10px',
                  }}
                >
                  🏆 {title}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <DifficultyPicker value={difficulty} onChange={handleDifficultyChange} />

      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CHAPTERS.map((ch, i) => {
          const isCleared = cleared.includes(getModeChapterId(ch.id, difficulty));
          const unlocked = isChapterUnlocked(i, cleared, difficulty);
          const sceneName = difficulty === 'easy' ? ch.easySceneName : ch.sceneName;
          const title = difficulty === 'easy' ? ch.easyTitle : ch.title;
          const description = difficulty === 'easy' ? ch.easyDescription : ch.description;
          const playable = unlocked && IMPLEMENTED_SCENES.has(sceneName);
          return (
            <div
              key={ch.id}
              style={{
                padding: '14px 16px', borderRadius: 10,
                border: `2px solid ${isCleared ? '#2a8a50' : unlocked ? '#2a5a7c' : '#2a3a4a'}`,
                background: unlocked ? '#0d1f33' : '#0a131f',
                opacity: unlocked ? 1 : 0.5,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: unlocked ? '#e0eeff' : '#556677', fontSize: 14, fontWeight: 700, fontFamily: JP_FONT }}>
                  {title}
                </span>
                {isCleared && <span style={{ color: '#4caf80', fontSize: 11 }}>✅ クリア済み</span>}
                {!unlocked && <span style={{ color: '#556677', fontSize: 11 }}>🔒 ロック中</span>}
              </div>
              <p style={{ color: '#7a9abc', fontSize: 12, lineHeight: 1.6, marginBottom: 10, fontFamily: JP_FONT }}>
                {description}
              </p>
              <button
                disabled={!playable}
                onClick={() => playable && onPlay(sceneName)}
                style={{
                  width: '100%', padding: '8px', borderRadius: 6, border: 'none',
                  background: playable ? '#1a4a2a' : '#1a2230',
                  color: playable ? '#88ff99' : '#445566',
                  fontSize: 12, fontWeight: 700,
                  cursor: playable ? 'pointer' : 'default',
                  fontFamily: 'monospace',
                }}
              >
                {playable ? 'プレイ →' : unlocked ? '近日公開' : 'ロック中'}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => router.push('/')}
        style={{
          marginTop: 24, background: 'none', border: 'none',
          color: '#3a6a8a', fontSize: 12, cursor: 'pointer',
          borderBottom: '1px solid #3a6a8a', fontFamily: 'monospace',
        }}
      >
        ← ホームに戻る
      </button>
    </main>
  );
}

// ── Chapter canvas (Chapter1Scene 等) ─────────────────────────

function ChapterCanvas({ sceneName, onDone, onChapterCleared }: { sceneName: string; onDone: () => void; onChapterCleared: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
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
      // @ts-ignore
      const { createGame } = await import('../../src/game/PhaserGame');
      if (!cancelled && containerRef.current && !gameRef.current) {
        gameRef.current = createGame(containerRef.current, sceneName);
      }
    };

    init().catch(console.error);

    const onCleared = () => onChapterCleared();
    const onShowDocImage = (e: Event) => {
      setDocImage((e as CustomEvent<{ path: string; label: string }>).detail);
    };
    // Z-key close path: Phaser dispatches this event, React must also clear docImage
    const onDocImageClosed = () => { setDocImage(null); };
    window.addEventListener('sier-chapter-cleared', onCleared);
    window.addEventListener('sier-show-doc-image', onShowDocImage);
    window.addEventListener('sier-doc-image-closed', onDocImageClosed);

    return () => {
      cancelled = true;
      window.removeEventListener('sier-chapter-cleared', onCleared);
      window.removeEventListener('sier-show-doc-image', onShowDocImage);
      window.removeEventListener('sier-doc-image-closed', onDocImageClosed);
      if (gameRef.current) { gameRef.current.destroy(true); gameRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ position: 'fixed', inset: 0, background: '#050d18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <button
        onClick={onDone}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: '#1a2e4a', border: '1px solid #2a5a7c',
          color: '#aabbcc', fontSize: 12, borderRadius: 6,
          padding: '6px 12px', cursor: 'pointer', fontFamily: 'monospace',
          zIndex: 100,
        }}
      >
        ← 戻る
      </button>

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
    </main>
  );
}

// ── Page entry point ──────────────────────────────────────────

export default function GamePage() {
  const [phase, setPhase] = useState<'sier-title' | 'chapters' | 'office'>('sier-title');
  const [activeScene, setActiveScene] = useState('Chapter1Scene');

  if (phase === 'sier-title') {
    return <SierTitleCanvas onStart={() => setPhase('chapters')} />;
  }

  if (phase === 'chapters') {
    return (
      <ChapterSelect
        onPlay={(sceneName) => { setActiveScene(sceneName); setPhase('office'); }}
      />
    );
  }

  return (
    <ChapterCanvas
      sceneName={activeScene}
      onDone={() => setPhase('chapters')}
      onChapterCleared={() => setPhase('chapters')}
    />
  );
}
