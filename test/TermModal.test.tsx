import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TermModal from '../app/components/TermModal';
import { LearningProgressProvider } from '../lib/useLearningProgress';

function renderWithProvider(element: React.ReactElement) {
  return render(React.createElement(LearningProgressProvider, null, element));
}

describe('TermModal', () => {
  it('calls onClose when Escape key pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProvider(React.createElement(TermModal, { term: 'スコープ管理', description: 'desc', onClose }));
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows example answer when button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProvider(React.createElement(TermModal, { term: 'スコープ管理', description: 'desc', onClose }));
    const btn = await screen.findByRole('button', { name: /解答を見る/ });
    await user.click(btn);
    expect(screen.getByText(/要求の目的・価値/)).toBeInTheDocument();
  });
});
