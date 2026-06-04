'use client';

import type { ClientMeetingRequest } from '../../lib/types';

export function ClientMeetingBanner({
  meeting,
  onAccept,
  onDismiss,
}: {
  meeting: ClientMeetingRequest;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const isUrgent = meeting.urgency === 'urgent';

  return (
    <div className={`rounded-2xl border px-5 py-4 ${isUrgent ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{isUrgent ? '🚨' : '📩'}</span>
        <div className="flex-1">
          <p className={`font-bold ${isUrgent ? 'text-red-800' : 'text-amber-800'}`}>
            クライアントから面談要請
          </p>
          <p className={`mt-1 text-sm ${isUrgent ? 'text-red-700' : 'text-amber-700'}`}>
            {meeting.reason}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onAccept}
              className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition ${isUrgent ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'}`}
            >
              面談を受ける
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              今は見送る（信頼 -8）
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
