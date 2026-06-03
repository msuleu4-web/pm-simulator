'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { GameState } from '../../lib/types';

const MAX_TURNS = 7;
const WARN_TURNS = 5;

type Msg = { role: 'user' | 'assistant'; content: string };

export function ClientChatModal({
  scenarioTitle,
  scenarioDescription,
  phaseLabel,
  clientName,
  clientDescription,
  state,
  onClose,
}: {
  scenarioTitle: string;
  scenarioDescription: string;
  phaseLabel: string;
  clientName: string;
  clientDescription: string;
  state: Pick<GameState, 'quality' | 'cost' | 'schedule' | 'stakeholder' | 'morale'>;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [turnCount, setTurnCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchReply = async (msgs: Msg[], turn: number): Promise<string> => {
    try {
      const res = await fetch('/api/chat-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle,
          scenarioDescription,
          clientName,
          clientDescription,
          phaseLabel,
          kpiSummary: state,
          messages: msgs,
          turnCount: turn,
          maxTurns: MAX_TURNS,
        }),
      });
      const data: { content: string } = await res.json();
      return data.content;
    } catch {
      return '...';
    }
  };

  useEffect(() => {
    setIsTyping(true);
    fetchReply([], 0).then((content) => {
      setMessages([{ role: 'assistant', content }]);
      setTurnCount(1);
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping || turnCount >= MAX_TURNS) return;
    setInput('');
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setIsTyping(true);
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);
    const reply = await fetchReply(next, newTurn);
    setMessages([...next, { role: 'assistant', content: reply }]);
    setTurnCount(newTurn + 1);
    setIsTyping(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const isMaxReached = turnCount >= MAX_TURNS;
  const isWarnPhase = turnCount >= WARN_TURNS && !isMaxReached;
  const initial = clientName.slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex h-[620px] w-full max-w-lg flex-col rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
              {initial}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{clientName}</p>
              <p className="text-xs text-slate-500">クライアント · {phaseLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isMaxReached ? 'bg-red-100 text-red-700' : isWarnPhase ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
              {isMaxReached ? '時間切れ' : `残り ${MAX_TURNS - turnCount} ターン`}
            </span>
            <button type="button" onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:text-slate-600">✕</button>
          </div>
        </div>

        {/* Scenario context */}
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">
          <p className="text-xs text-slate-500">📋 <span className="font-semibold text-slate-700">{scenarioTitle}</span></p>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {initial}
                </div>
              )}
              <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                msg.role === 'user'
                  ? 'rounded-br-sm bg-brand-600 text-white'
                  : 'rounded-bl-sm bg-slate-100 text-slate-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">{initial}</div>
              <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}

          {isWarnPhase && !isTyping && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
              ⏰ 会議時間があと少しです。そろそろ結論を出しましょう。
            </div>
          )}

          {isMaxReached && !isTyping && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700">
              会議時間が終了しました。得た情報をもとに判断してください。
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="space-y-2 border-t border-slate-100 px-4 py-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={isMaxReached ? '会議終了 — 判断してください' : 'クライアントへのメッセージ… (Enter で送信)'}
              disabled={isTyping || isMaxReached}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-200 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isTyping || !input.trim() || isMaxReached}
              className="rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-40"
            >
              送信
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            会議を終了して判断する →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
