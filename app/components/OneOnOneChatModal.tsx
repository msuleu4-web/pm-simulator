'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { TeamMember } from '../../lib/types';

type Msg = { role: 'user' | 'assistant'; content: string };

const conditionStyle = (v: number) =>
  v >= 85 ? { label: '元気', color: 'bg-emerald-100 text-emerald-700' } :
  v >= 70 ? { label: '注意', color: 'bg-amber-100 text-amber-700' } :
  v >= 50 ? { label: '疲労', color: 'bg-orange-100 text-orange-700' } :
  { label: '危険', color: 'bg-red-100 text-red-700' };

export function OneOnOneChatModal({
  member,
  phaseLabel,
  onComplete,
  onClose,
}: {
  member: TeamMember;
  phaseLabel: string;
  onComplete: () => void;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchReply = async (msgs: Msg[], isInitial = false): Promise<string> => {
    try {
      const res = await fetch('/api/chat-1on1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member: {
            name: member.name,
            role: member.role,
            affiliation: member.affiliation,
            specialty: member.specialty,
            weakness: member.weakness,
            condition: member.condition,
            motivation: member.motivation,
            isSiloed: member.isSiloed,
            utilization: member.utilization,
          },
          messages: msgs,
          phaseLabel,
          isInitial,
        }),
      });
      const data: { content: string } = await res.json();
      return data.content;
    } catch {
      return '...';
    }
  };

  // First message from member
  useEffect(() => {
    setIsTyping(true);
    fetchReply([], true).then((content) => {
      setMessages([{ role: 'assistant', content }]);
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setIsTyping(true);
    const reply = await fetchReply(next);
    setMessages([...next, { role: 'assistant', content: reply }]);
    setIsTyping(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const cond = conditionStyle(member.condition);
  const initial = member.name[0] ?? '?';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex h-[600px] w-full max-w-lg flex-col rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {initial}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{member.name}</p>
              <p className="text-xs text-slate-500">{member.role} · {member.affiliation}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cond.color}`}>{cond.label}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                  {initial}
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                  msg.role === 'user'
                    ? 'rounded-br-sm bg-brand-600 text-white'
                    : 'rounded-bl-sm bg-slate-100 text-slate-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {initial}
              </div>
              <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="space-y-2 border-t border-slate-100 px-4 py-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder="メッセージを入力… (Enter で送信)"
              disabled={isTyping}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
            >
              送信
            </button>
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="w-full rounded-2xl bg-emerald-600 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            1on1を完了する ✓
          </button>
        </div>
      </motion.div>
    </div>
  );
}
