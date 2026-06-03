import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TermModal from '../app/components/TermModal';
import { LearningProgressProvider } from '../lib/useLearningProgress';

describe('Learning progress integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('marks term as learned when clicking button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      React.createElement(LearningProgressProvider, null,
        React.createElement(TermModal, { term: 'スコープ管理', description: 'desc', onClose })
      )
    );

    // show answer first
    const ansBtn = await screen.findByRole('button', { name: /解答を見る/ });
    await user.click(ansBtn);

    const learnBtn = await screen.findByRole('button', { name: /^理解した$/ });
    await user.click(learnBtn);

    expect(await screen.findByText(/学習済み/)).toBeInTheDocument();

    const raw = window.localStorage.getItem('pm-learning-progress');
    expect(raw).toBeTruthy();
    const data = JSON.parse(raw || '{}');
    expect(data['スコープ管理']).toBeTruthy();
  });
});
