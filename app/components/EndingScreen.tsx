'use client';

import { useEffect, useState } from 'react';
import type { GameState } from '../../lib/types';
import { determineEnding, computeAverageScore, type EndingId } from '../../lib/endings';

const endingVisuals: Record<EndingId, {
  bg: string;
  cardBg: string;
  border: string;
  titleColor: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  btnBorder: string;
  btnText: string;
}> = {
  legendary_pm: {
    bg: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 60%, #fde68a 100%)',
    cardBg: 'rgba(255,255,255,0.92)',
    border: '#fbbf24',
    titleColor: '#78350f',
    badgeBg: '#fbbf24',
    badgeText: '#78350f',
    glowColor: 'rgba(251,191,36,0.5)',
    btnBorder: '#f59e0b',
    btnText: '#92400e',
  },
  team_hero: {
    bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 60%, #6ee7b7 100%)',
    cardBg: 'rgba(255,255,255,0.92)',
    border: '#34d399',
    titleColor: '#065f46',
    badgeBg: '#34d399',
    badgeText: '#065f46',
    glowColor: 'rgba(52,211,153,0.45)',
    btnBorder: '#10b981',
    btnText: '#065f46',
  },
  schedule_master: {
    bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 60%, #93c5fd 100%)',
    cardBg: 'rgba(255,255,255,0.92)',
    border: '#60a5fa',
    titleColor: '#1e3a8a',
    badgeBg: '#3b82f6',
    badgeText: '#ffffff',
    glowColor: 'rgba(96,165,250,0.45)',
    btnBorder: '#3b82f6',
    btnText: '#1e40af',
  },
  quality_craftsman: {
    bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 60%, #c4b5fd 100%)',
    cardBg: 'rgba(255,255,255,0.92)',
    border: '#a78bfa',
    titleColor: '#3b0764',
    badgeBg: '#8b5cf6',
    badgeText: '#ffffff',
    glowColor: 'rgba(167,139,250,0.45)',
    btnBorder: '#8b5cf6',
    btnText: '#4c1d95',
  },
  comeback: {
    bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 60%, #fdba74 100%)',
    cardBg: 'rgba(255,255,255,0.92)',
    border: '#fb923c',
    titleColor: '#7c2d12',
    badgeBg: '#f97316',
    badgeText: '#ffffff',
    glowColor: 'rgba(251,146,60,0.45)',
    btnBorder: '#f97316',
    btnText: '#9a3412',
  },
  project_fire: {
    bg: 'linear-gradient(135deg, #1c0404 0%, #450a0a 50%, #7f1d1d 100%)',
    cardBg: 'rgba(30,10,10,0.92)',
    border: '#ef4444',
    titleColor: '#fca5a5',
    badgeBg: '#dc2626',
    badgeText: '#ffffff',
    glowColor: 'rgba(239,68,68,0.6)',
    btnBorder: '#ef4444',
    btnText: '#fca5a5',
  },
  team_collapse: {
    bg: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)',
    cardBg: 'rgba(17,24,39,0.93)',
    border: '#6b7280',
    titleColor: '#d1d5db',
    badgeBg: '#4b5563',
    badgeText: '#f3f4f6',
    glowColor: 'rgba(107,114,128,0.4)',
    btnBorder: '#6b7280',
    btnText: '#d1d5db',
  },
  budget_overrun: {
    bg: 'linear-gradient(135deg, #1a0000 0%, #450a0a 50%, #881337 100%)',
    cardBg: 'rgba(26,0,0,0.93)',
    border: '#f43f5e',
    titleColor: '#fda4af',
    badgeBg: '#e11d48',
    badgeText: '#ffffff',
    glowColor: 'rgba(244,63,94,0.5)',
    btnBorder: '#f43f5e',
    btnText: '#fda4af',
  },
  schedule_disaster: {
    bg: 'linear-gradient(135deg, #1c0a00 0%, #431407 50%, #7c2d12 100%)',
    cardBg: 'rgba(28,10,0,0.93)',
    border: '#f97316',
    titleColor: '#fdba74',
    badgeBg: '#ea580c',
    badgeText: '#ffffff',
    glowColor: 'rgba(249,115,22,0.5)',
    btnBorder: '#f97316',
    btnText: '#fdba74',
  },
  stakeholder_betrayal: {
    bg: 'linear-gradient(135deg, #0d0018 0%, #2e1065 50%, #4c1d95 100%)',
    cardBg: 'rgba(13,0,24,0.93)',
    border: '#a855f7',
    titleColor: '#d8b4fe',
    badgeBg: '#7c3aed',
    badgeText: '#ffffff',
    glowColor: 'rgba(168,85,247,0.5)',
    btnBorder: '#a855f7',
    btnText: '#d8b4fe',
  },
};

interface Props {
  state: GameState;
  onPlayAgain: () => void;
  onBackToEvaluation: () => void;
}

export function EndingScreen({ state, onPlayAgain, onBackToEvaluation }: Props) {
  const [visible, setVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  const ending = determineEnding(state);
  const averageScore = computeAverageScore(state);
  const v = endingVisuals[ending.id];
  const isPositive = ending.type === 'positive';

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80);
    const t2 = setTimeout(() => setCardVisible(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8"
      style={{
        background: v.bg,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    >
      <style>{`
        @keyframes ending-float {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes ending-flicker {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          33% { transform: scale(1.15) rotate(5deg); opacity: 1; }
          66% { transform: scale(0.95) rotate(-5deg); opacity: 0.6; }
        }
        @keyframes ending-card-in {
          from { transform: scale(0.85) translateY(24px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes ending-particle {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { opacity: 1; }
          100% { transform: translateY(-60px) scale(0.6); opacity: 0; }
        }
        @keyframes ending-glow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>

      {/* Background particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {ending.particles.map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl select-none"
            style={{
              left: `${8 + (i * 13) % 84}%`,
              top: `${10 + (i * 17) % 75}%`,
              animation: `ending-particle ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.45}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl p-8 shadow-2xl text-center"
        style={{
          background: v.cardBg,
          border: `2px solid ${v.border}`,
          backdropFilter: 'blur(12px)',
          animation: cardVisible ? 'ending-card-in 0.55s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
          opacity: cardVisible ? 1 : 0,
        }}
      >
        {/* Type badge */}
        <span
          className="inline-block rounded-full px-4 py-1 text-xs font-black tracking-widest"
          style={{ background: v.badgeBg, color: v.badgeText }}
        >
          {isPositive ? '✨ GOOD ENDING' : '☠ BAD ENDING'}
        </span>

        {/* Illustration */}
        <div className="relative mx-auto my-8 flex h-40 w-40 items-center justify-center">
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: v.glowColor,
              filter: 'blur(28px)',
              animation: 'ending-glow-pulse 2.5s ease-in-out infinite',
            }}
          />
          {/* Main emoji */}
          <span
            className="relative select-none"
            style={{
              fontSize: '7rem',
              lineHeight: 1,
              animation: isPositive
                ? 'ending-float 3.5s ease-in-out infinite'
                : 'ending-flicker 2s ease-in-out infinite',
            }}
          >
            {ending.mainEmoji}
          </span>
        </div>

        {/* Subtitle */}
        <p
          className="text-[0.65rem] font-black tracking-[0.35em]"
          style={{ color: v.border }}
        >
          {ending.subtitle}
        </p>

        {/* Title */}
        <h2
          className="mt-2 text-xl font-black leading-tight"
          style={{ color: v.titleColor }}
        >
          {ending.title}
        </h2>

        {/* Score chip */}
        <div
          className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: isPositive ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${v.border}`,
          }}
        >
          <span className="text-xs" style={{ color: v.titleColor, opacity: 0.7 }}>最終スコア</span>
          <span className="text-xl font-black" style={{ color: v.titleColor }}>{averageScore}</span>
          <span className="text-xs" style={{ color: v.titleColor, opacity: 0.7 }}>/ 100</span>
        </div>

        {/* Description */}
        <p
          className="mt-5 text-sm leading-7"
          style={{ color: isPositive ? '#374151' : '#d1d5db' }}
        >
          {ending.description}
        </p>

        {/* Flavor quote */}
        <div
          className="mt-5 rounded-2xl px-5 py-4"
          style={{
            background: isPositive ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${v.border}`,
          }}
        >
          <p
            className="text-xs italic leading-6"
            style={{ color: isPositive ? '#6b7280' : '#9ca3af' }}
          >
            {ending.flavor}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onPlayAgain}
            className="rounded-2xl px-6 py-3 text-sm font-black text-white transition hover:opacity-90 active:scale-95"
            style={{ background: v.badgeBg }}
          >
            もう一度プレイ
          </button>
          <button
            type="button"
            onClick={onBackToEvaluation}
            className="rounded-2xl px-6 py-3 text-sm font-bold transition hover:opacity-80 active:scale-95"
            style={{
              border: `2px solid ${v.btnBorder}`,
              color: v.btnText,
              background: 'transparent',
            }}
          >
            評価に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
