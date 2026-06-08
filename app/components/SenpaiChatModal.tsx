'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { GameState } from '../../lib/types';

const MAX_TURNS = 20;
const STORAGE_KEY_PREFIX = 'sier-dojo-daily-';

function getStorageKey(): string {
  const username = typeof window !== 'undefined'
    ? (localStorage.getItem('pm-sim-username') ?? 'guest')
    : 'guest';
  return STORAGE_KEY_PREFIX + username;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function loadUsedTurns(): number {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return 0;
    const { date, count } = JSON.parse(raw) as { date: string; count: number };
    if (date !== todayStr()) return 0; // 날짜 바뀌면 리셋
    return count;
  } catch {
    return 0;
  }
}

function saveUsedTurns(n: number) {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify({ date: todayStr(), count: n }));
  } catch { /* noop */ }
}

type Msg = { role: 'user' | 'assistant'; content: string };

export function SenpaiChatModal({
  state,
  phaseLabel,
  difficulty,
  onClose,
}: {
  state: Pick<GameState, 'quality' | 'cost' | 'schedule' | 'stakeholder' | 'morale' | 'pmMental'>;
  phaseLabel: string;
  difficulty: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [usedTurns, setUsedTurns] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const used = loadUsedTurns();
    setUsedTurns(used);
    setTimeout(() => inputRef.current?.focus(), 100);

    const remaining = MAX_TURNS - used;
    const openingLine = remaining <= 0
      ? '今月の相談枠、もう使い切ったな。また来月来い。'
      : `なんか詰まってるか。聞きたいことあるなら言え。あと${remaining}回答えられる。`;
    setMessages([{ role: 'assistant', content: openingLine }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchReply = async (msgs: Msg[]): Promise<string> => {
    try {
      const res = await fetch('/api/chat-senpai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: msgs,
          gameContext: {
            phaseLabel,
            difficulty,
            quality: state.quality,
            cost: state.cost,
            schedule: state.schedule,
            stakeholder: state.stakeholder,
            morale: state.morale,
            pmMental: state.pmMental,
          },
        }),
      });
      const data: { content: string } = await res.json();
      return data.content;
    } catch {
      return 'ネットワークエラー。回線確認しろ。';
    }
  };

  const isLimitReached = usedTurns >= MAX_TURNS;
  const remaining = Math.max(0, MAX_TURNS - usedTurns);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping || isLimitReached) return;
    setInput('');
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setIsTyping(true);

    const newUsed = usedTurns + 1;
    setUsedTurns(newUsed);
    saveUsedTurns(newUsed);

    const reply = await fetchReply(next);
    setMessages([...next, { role: 'assistant', content: reply }]);
    setIsTyping(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const isWarn = remaining <= 5 && remaining > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex h-[600px] w-full max-w-lg flex-col rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: '#0f1923', border: '1.5px solid #1e3a52' }}
      >
        {/* Header */}
        <div style={{ background: '#111f2e', borderBottom: '1px solid #1a3347' }}
          className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
              style={{ background: '#1a3350', border: '1.5px solid #2a5a7c' }}>
              👨‍💻
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#c8dff0' }}>先輩エンジニア</p>
              <p className="text-xs" style={{ color: '#4a7a9b' }}>SIer道場 · 何でも聞いていい</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={
                isLimitReached
                  ? { background: '#3a1010', color: '#ff8888' }
                  : isWarn
                  ? { background: '#3a2a00', color: '#ffcc44' }
                  : { background: '#0a1a2a', color: '#4a8aaa' }
              }
            >
              {isLimitReached ? '上限到達' : `残り ${remaining} 回`}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 transition"
              style={{ color: '#4a7a9b' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Context bar */}
        <div className="px-5 py-2 text-xs flex gap-3 flex-wrap"
          style={{ background: '#0a1520', borderBottom: '1px solid #1a3347', color: '#3a6a8a' }}>
          <span>フェーズ: <span style={{ color: '#5a9abf' }}>{phaseLabel}</span></span>
          <span>品質 {state.quality}</span>
          <span>コスト {state.cost}</span>
          <span>モラール {state.morale}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          style={{ fontFamily: 'monospace, "Hiragino Sans", sans-serif' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm"
                  style={{ background: '#1a3350', border: '1px solid #2a5a7c' }}>
                  👨‍💻
                </div>
              )}
              <div
                className="max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-6"
                style={msg.role === 'user'
                  ? { background: '#1a4a6a', color: '#c8e8ff', borderRadius: '14px 14px 4px 14px', border: '1px solid #2a6a9a' }
                  : { background: '#111f2e', color: '#b8d4e8', borderRadius: '14px 14px 14px 4px', border: '1px solid #1a3347' }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm"
                style={{ background: '#1a3350', border: '1px solid #2a5a7c' }}>
                👨‍💻
              </div>
              <div className="rounded-2xl px-4 py-3" style={{ background: '#111f2e', border: '1px solid #1a3347' }}>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full [animation-delay:0ms]" style={{ background: '#3a6a8a' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full [animation-delay:150ms]" style={{ background: '#3a6a8a' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full [animation-delay:300ms]" style={{ background: '#3a6a8a' }} />
                </span>
              </div>
            </div>
          )}

          {isLimitReached && !isTyping && (
            <div className="rounded-2xl px-4 py-3 text-center text-xs"
              style={{ background: '#1a0a0a', border: '1px solid #4a1a1a', color: '#cc6666' }}>
              相談枠が尽きた。また来い。
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {isLimitReached ? (
          <div className="px-4 py-4 text-center" style={{ borderTop: '1px solid #1a3347', background: '#0a1520' }}>
            <p className="text-xs mb-3" style={{ color: '#4a6a7a' }}>アカウントの相談枠（{MAX_TURNS}回）を使い切りました</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-6 py-2.5 text-sm font-bold"
              style={{ background: '#1a2a3a', color: '#5a8aaa', border: '1px solid #1e3a52' }}
            >
              閉じる
            </button>
          </div>
        ) : (
          <div className="px-4 py-3 flex gap-2" style={{ borderTop: '1px solid #1a3347', background: '#0a1520' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="先輩に聞く… (Enter で送信)"
              disabled={isTyping}
              className="flex-1 rounded-2xl px-4 py-2.5 text-sm outline-none transition disabled:opacity-50"
              style={{ background: '#0f1923', border: '1px solid #1e3a52', color: '#c8e0f0', fontFamily: 'monospace' }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="rounded-2xl px-4 py-2.5 text-sm font-bold transition disabled:opacity-40"
              style={{ background: '#1a4a6a', color: '#88ccee', border: '1px solid #2a6a9a' }}
            >
              送信
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
