import React from 'react';
import { render, screen } from '@testing-library/react';
import LearningActivityPanel from '../app/components/LearningActivityPanel';

describe('LearningActivityPanel', () => {
  it('renders activity timeline and review suggestions', () => {
    render(
      React.createElement(LearningActivityPanel, {
        progress: {
          'スコープ管理': { learnedAt: '2026-06-01T09:00:00.000Z' },
          'リスク管理': { learnedAt: '2026-06-03T09:00:00.000Z' },
        },
        scores: {
          'スコープ管理': { score: 0.4, at: '2026-06-03T09:00:00.000Z', attempts: 2 },
          '品質管理': { score: 0.8, at: '2026-06-02T09:00:00.000Z', attempts: 1 },
        },
      })
    );

    expect(screen.getByText(/学習アクティビティ/)).toBeInTheDocument();
    expect(screen.getAllByText(/復習候補/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('スコープ管理')).toBeInTheDocument();
    expect(screen.queryByText('品質管理')).not.toBeInTheDocument();
  });
});
