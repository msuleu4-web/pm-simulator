import React, { useEffect, useRef, useState } from 'react';
import { pmBokExamples } from '../../lib/pmBokExamples';
import useLearningProgress from '../../lib/useLearningProgress';

export function TermModal({
  term,
  description,
  onClose,
}: {
  term: string;
  description?: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFocusable = useRef<HTMLElement | null>(null);
  const lastFocusable = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevActive = document.activeElement as HTMLElement | null;
    document.addEventListener('keydown', onKey);
    // focus the dialog for accessibility
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      prevActive?.focus();
    };
  }, [onClose]);

  // setup simple focus trap
  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    const focusables = node.querySelectorAll<HTMLElement>('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (focusables.length > 0) {
      firstFocusable.current = focusables[0];
      lastFocusable.current = focusables[focusables.length - 1];
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const active = document.activeElement as HTMLElement;
        if (e.shiftKey) {
          if (active === firstFocusable.current) {
            e.preventDefault();
            lastFocusable.current?.focus();
          }
        } else {
          if (active === lastFocusable.current) {
            e.preventDefault();
            firstFocusable.current?.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const { isLearned, markLearned, unmarkLearned, setScore, getScore } = useLearningProgress();
  const currentScore = getScore(term);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="document"
        aria-labelledby="term-title"
        className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="term-title" className="text-lg font-semibold text-slate-900">{term}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            閉じる
          </button>
        </div>
        <div className="mt-4 text-sm text-slate-700">
          <p className="font-semibold">学習ヒント</p>
          <ul className="mt-2 list-disc pl-5">
            <li>この領域を意識した具体的な行動を書き出してみましょう。</li>
            <li>過去の判断で関連する場面を振り返り、改善点をメモしましょう。</li>
          </ul>

          {pmBokExamples[term] && (
            <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold">例題</p>
              <p className="mt-2 text-sm text-slate-700">{pmBokExamples[term].question}</p>
              <QuizAnswer
                term={term}
                answer={pmBokExamples[term].answer}
                onSelfAssess={(score: number) => {
                  setScore(term, score);
                  if (score > 0) markLearned(term);
                }}
              />
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => (isLearned(term) ? unmarkLearned(term) : markLearned(term))}
                    className={`rounded-md px-3 py-1 text-sm font-medium ${isLearned(term) ? 'bg-slate-200 text-slate-800' : 'bg-brand-600 text-white'}`}
                  >
                    {isLearned(term) ? '理解済みを解除' : '理解した'}
                  </button>
                  {isLearned(term) && <span className="text-sm text-slate-600">学習済み</span>}
                </div>
                {currentScore && (
                  <div className="rounded-2xl bg-white p-3 text-sm text-slate-700 shadow-sm">
                    <p className="font-semibold text-slate-900">自己評価</p>
                    <p className="mt-1">スコア: {currentScore.score * 100}%</p>
                    <p className="text-xs text-slate-500">最終更新: {new Date(currentScore.at).toLocaleString('ja-JP')}</p>
                    <p className="text-xs text-slate-500">試行回数: {currentScore.attempts}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TermModal;

function QuizAnswer({ term, answer, onSelfAssess }: { term: string; answer: string; onSelfAssess?: (score: number) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="rounded-md bg-brand-600 px-3 py-1 text-sm font-medium text-white"
      >
        {visible ? '解答を隠す' : '解答を見る'}
      </button>
      {visible && (
        <div>
          <p className="mt-2 text-sm text-slate-700">{answer}</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => onSelfAssess?.(1)}
              className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white"
            >
              これで理解した
            </button>
            <button
              type="button"
              onClick={() => onSelfAssess?.(0)}
              className="rounded-md bg-slate-200 px-3 py-1 text-sm font-medium text-slate-800"
            >
              まだ理解していない
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

