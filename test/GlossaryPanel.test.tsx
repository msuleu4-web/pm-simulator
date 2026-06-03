import React from 'react';
import { render, screen } from '@testing-library/react';
import { GlossaryPanel } from '../app/components/GlossaryPanel';
import { pmBokDefinitions } from '../lib/pmBokDefinitions';

describe('GlossaryPanel', () => {
  it('renders all PMBOK terms', () => {
    render(React.createElement(GlossaryPanel, { activeTags: [], tagUsage: {} }));
    Object.keys(pmBokDefinitions).forEach((term) => {
      expect(screen.getByText(term)).toBeInTheDocument();
    });
  });

  it('shows active badge for active tags', () => {
    const active = Object.keys(pmBokDefinitions)[0];
    render(React.createElement(GlossaryPanel, { activeTags: [active], tagUsage: {} }));
    expect(screen.getByText('このフェーズで登場')).toBeInTheDocument();
  });
});
