import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScenarioCard } from '../app/components/ScenarioCard';

const mockScenario = {
  id: 's1',
  title: 'テストシナリオ',
  description: '説明',
  docs: [],
  choices: [
    { id: 'c1', label: 'A', summary: 'sum', effects: { quality: 0, cost: 0, schedule: 0, stakeholder: 0, morale: 0 }, explanation: '', pmBokTags: ['スコープ管理'] },
    { id: 'c2', label: 'B', summary: 'sum', effects: { quality: 0, cost: 0, schedule: 0, stakeholder: 0, morale: 0 }, explanation: '', pmBokTags: ['品質管理'] },
  ],
};

describe('ScenarioCard', () => {
  it('renders choices and highlights when selectedTag matches', () => {
    render(React.createElement(ScenarioCard, { scenario: mockScenario as any, onSelectChoice: () => {}, selectedTag: 'スコープ管理' }));
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    // Highlighted choice shows related text
    expect(screen.getByText(/この選択肢には/)).toBeInTheDocument();
  });
});
