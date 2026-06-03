import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TermModal from '../app/components/TermModal';
import { LearningProgressProvider } from '../lib/useLearningProgress';

describe('Quiz result persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('stores quiz result when self-assessed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      React.createElement(LearningProgressProvider, null,
        React.createElement(TermModal, { term: 'スコープ管理', description: 'desc', onClose })
      )
    );

    const viewBtn = await screen.findByRole('button', { name: /解答を見る/ });
    await user.click(viewBtn);

    const assessBtn = await screen.findByRole('button', { name: /これで理解した/ });
    await user.click(assessBtn);

    const raw = window.localStorage.getItem('pm-quiz-results');
    expect(raw).toBeTruthy();
    const data = JSON.parse(raw || '{}');
    expect(data['スコープ管理']).toBeTruthy();
    expect(data['スコープ管理'].score).toBe(1);
  });
});
