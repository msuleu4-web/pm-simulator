import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultPanel } from '../app/components/ResultPanel';

const mockDecisions: import('../lib/types').DecisionLog[] = [];

describe('ResultPanel', () => {
  it('calls onSelectTag when tag button clicked', async () => {
    const user = userEvent.setup();
    const onSelectTag = vi.fn();
    render(
      React.createElement(ResultPanel, {
        quality: 80,
        cost: 80,
        schedule: 80,
        stakeholder: 80,
        morale: 80,
        members: [],
        decisions: mockDecisions,
        onSelectTag,
      })
    );
    // click the first PMBOK label in the profile
    const button = await screen.findByText('スコープ管理');
    await user.click(button);
    expect(onSelectTag).toHaveBeenCalled();
  });
});
