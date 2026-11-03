import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock react-redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  // The dashboard now asks the chain what is waiting for the citizen, so it
  // dispatches. Nothing in these tests asserts on the dispatches themselves.
  useDispatch: () => jest.fn(),
}));

// Mock react-router-dom
const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({ push: mockPush }),
}));

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
      // "Staking" and "Congress" are also guide links below the fold
      expect(screen.getAllByText('Staking').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Congress').length).toBeGreaterThanOrEqual(1);
    });

    it('renders stat card trend labels', () => {
      render(<Feed />);
      expect(screen.getByText('View balance →')).toBeInTheDocument();
      expect(screen.getByText('Cast your vote →')).toBeInTheDocument();
      expect(screen.getByText('View validators →')).toBeInTheDocument();
      expect(screen.getByText('Active motions →')).toBeInTheDocument();
    });

    it('renders the live section heading', () => {
      render(<Feed />);
      expect(screen.getByText('The republic, live')).toBeInTheDocument();
    });

    it('renders the three live blocks', () => {
      render(<Feed />);
      expect(screen.getByText('Coming into force')).toBeInTheDocument();
      expect(screen.getByText('Where the money went')).toBeInTheDocument();
      expect(screen.getByText('The republic in figures')).toBeInTheDocument();
    });

    it('says it is still reading rather than claiming the chain is empty', () => {
      render(<Feed />);
      expect(screen.getByText('Reading the agenda…')).toBeInTheDocument();
    });

    it('keeps the guides one click away', () => {
      render(<Feed />);
      expect(screen.getByText('Guides')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
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
