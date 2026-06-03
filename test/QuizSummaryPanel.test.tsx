import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizSummaryPanel from '../app/components/QuizSummaryPanel';

describe('QuizSummaryPanel', () => {
  it('renders summary values correctly', () => {
    render(
      React.createElement(QuizSummaryPanel, {
        scores: {
          'スコープ管理': { score: 1, at: '2026-06-02T12:00:00.000Z', attempts: 1 },
          'リスク管理': { score: 0, at: '2026-06-02T12:15:00.000Z', attempts: 2 },
        },
      })
    );

    expect(screen.getByText(/評価済み用語/)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
    expect(screen.getByText(/総試行回数/)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
