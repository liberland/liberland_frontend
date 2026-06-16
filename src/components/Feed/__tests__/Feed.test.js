import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock react-redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

// Mock react-router-dom
const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({ push: mockPush }),
}));

// Mock markdown-to-jsx
jest.mock('markdown-to-jsx', () => ({ children }) => <div>{children}</div>);

import { useSelector } from 'react-redux';
import Feed from '../index';

describe('Feed (Dashboard)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when no user is logged in', () => {
    beforeEach(() => {
      useSelector.mockReturnValue(null);
    });

    it('renders without crashing', () => {
      render(<Feed />);
    });

    it('shows "Liberland dApp" role label (not citizen)', () => {
      render(<Feed />);
      expect(screen.getByText('Liberland dApp')).toBeInTheDocument();
    });

    it('shows "Welcome" as the display name fallback', () => {
      render(<Feed />);
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });

    it('does not show the View passport button when not a citizen', () => {
      render(<Feed />);
      expect(screen.queryByText('View passport')).not.toBeInTheDocument();
    });

    it('renders all 4 stat cards', () => {
      render(<Feed />);
      expect(screen.getByText('Wallet')).toBeInTheDocument();
      expect(screen.getByText('Open referenda')).toBeInTheDocument();
      // "Staking" appears in both a stat card label and a news tag
      expect(screen.getAllByText('Staking').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Congress')).toBeInTheDocument();
    });

    it('renders stat card trend labels', () => {
      render(<Feed />);
      expect(screen.getByText('View balance →')).toBeInTheDocument();
      expect(screen.getByText('Cast your vote →')).toBeInTheDocument();
      expect(screen.getByText('View validators →')).toBeInTheDocument();
      expect(screen.getByText('Active motions →')).toBeInTheDocument();
    });

    it('renders the Republic updates heading', () => {
      render(<Feed />);
      expect(screen.getByText('Republic updates')).toBeInTheDocument();
    });

    it('renders all 4 news card titles', () => {
      render(<Feed />);
      expect(screen.getByText('Welcome to Liberland blockchain')).toBeInTheDocument();
      expect(screen.getByText('How to get LLD?')).toBeInTheDocument();
      expect(screen.getByText('LLD Staking guide')).toBeInTheDocument();
      expect(screen.getByText('Liberland Merits — LLM')).toBeInTheDocument();
    });

    it('renders news card tags', () => {
      render(<Feed />);
      expect(screen.getByText('General')).toBeInTheDocument();
      expect(screen.getByText('Blockchain')).toBeInTheDocument();
      // "Staking" tag shares text with the Staking stat card label
      expect(screen.getAllByText('Staking').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('LLM')).toBeInTheDocument();
    });
  });

  describe('when a named citizen is logged in', () => {
    beforeEach(() => {
      useSelector.mockImplementation((selector) => {
        const name = selector.toString();
        if (name.includes('GivenName') || name.includes('givenName')) return 'Ada';
        if (name.includes('FamilyName') || name.includes('familyName')) return 'Lovelace';
        return { blockchainAddress: '5Abc...' };
      });
    });

    it('shows "Citizen of Liberland" role label', () => {
      // user is truthy
      useSelector.mockImplementation((selector) => {
        const fn = selector.toString();
        if (fn.includes('givenName') || fn.includes('GivenName')) return 'Ada';
        if (fn.includes('familyName') || fn.includes('FamilyName')) return 'Lovelace';
        return { blockchainAddress: '5Abc...' };
      });
      render(<Feed />);
      expect(screen.getByText('Citizen of Liberland')).toBeInTheDocument();
    });

    it('shows View passport button for citizens', () => {
      useSelector.mockImplementation((selector) => {
        const fn = selector.toString();
        if (fn.includes('givenName') || fn.includes('GivenName')) return 'Ada';
        if (fn.includes('familyName') || fn.includes('FamilyName')) return 'Lovelace';
        return { blockchainAddress: '5Abc' };
      });
      render(<Feed />);
      expect(screen.getByText('View passport')).toBeInTheDocument();
    });
  });

  describe('stat card navigation', () => {
    beforeEach(() => {
      useSelector.mockReturnValue(null);
    });

    it('navigates to wallet on Wallet card click', async () => {
      const user = userEvent.setup();
      render(<Feed />);
      await user.click(screen.getByRole('button', { name: /wallet/i }));
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/wallet'));
    });

    it('navigates to referendum on referenda card click', async () => {
      const user = userEvent.setup();
      render(<Feed />);
      await user.click(screen.getByRole('button', { name: /open referenda/i }));
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/referendum'));
    });

    it('navigates to staking on Staking card click', async () => {
      const user = userEvent.setup();
      render(<Feed />);
      await user.click(screen.getByRole('button', { name: /staking/i }));
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/staking'));
    });

    it('navigates to congress on Congress card click', async () => {
      const user = userEvent.setup();
      render(<Feed />);
      await user.click(screen.getByRole('button', { name: /congress/i }));
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/congress'));
    });
  });
});
