import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();
const mockDispatch = jest.fn();
let mockPathname = '/home/feed';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: mockPathname }),
  useHistory: () => ({ push: mockPush }),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

jest.mock('react-oauth2-code-pkce', () => {
  const { createContext } = require('react');
  return { AuthContext: createContext({ logOut: jest.fn(), login: jest.fn() }) };
});

jest.mock('../../../AntdProvider', () => ({
  useModeContext: () => ({ isDarkMode: false, setIsDarkMode: jest.fn() }),
}));

// Stub child components
jest.mock('../../../Home/ChangeWallet', () => () => <div data-testid="change-wallet" />);
jest.mock('../../../UserMenu', () => () => <div data-testid="user-menu" />);

// Stub antd Dropdown. There are now two dropdowns (the network switcher and the
// user menu), so distinguish them by their menu items and only surface the
// profile/logout actions for the user menu.
jest.mock('antd/es/dropdown', () => ({ children, menu }) => {
  const keys = (menu?.items || []).map((item) => item.key);
  const isUserMenu = keys.includes('profile');
  return (
    <div data-testid={isUserMenu ? 'user-dropdown' : 'network-dropdown'}>
      {children}
      {isUserMenu && (
        <>
          <button type="button" onClick={() => menu.onClick({ key: 'logout' })}>Logout</button>
          <button type="button" onClick={() => menu.onClick({ key: 'profile' })}>Profile</button>
        </>
      )}
    </div>
  );
});

import { useSelector } from 'react-redux';
import DesktopHeader from '../index';

describe('DesktopHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/home/feed';
  });

  describe('page title resolution', () => {
    it('shows Dashboard title on /home/feed', () => {
      useSelector.mockReturnValue(null);
      render(<DesktopHeader />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome back to the Republic')).toBeInTheDocument();
    });

    it('shows Wallet title on /home/wallet/overview', () => {
      mockPathname = '/home/wallet/overview';
      useSelector.mockReturnValue(null);
      render(<DesktopHeader />);
      expect(screen.getByText('Wallet')).toBeInTheDocument();
      expect(screen.getByText('Your assets, staking & transfers')).toBeInTheDocument();
    });

    it('shows Voting title on /home/voting/referendum', () => {
      mockPathname = '/home/voting/referendum';
      useSelector.mockReturnValue(null);
      render(<DesktopHeader />);
      expect(screen.getByText('Voting')).toBeInTheDocument();
    });

    it('shows Congress title on /home/congress', () => {
      mockPathname = '/home/congress';
      useSelector.mockReturnValue(null);
      render(<DesktopHeader />);
      expect(screen.getByText('Congress')).toBeInTheDocument();
    });

    it('shows Senate title on /home/senate', () => {
      mockPathname = '/home/senate';
      useSelector.mockReturnValue(null);
      render(<DesktopHeader />);
      expect(screen.getByText('Senate')).toBeInTheDocument();
    });

    it('shows Staking title on /home/staking', () => {
      mockPathname = '/home/staking';
      useSelector.mockReturnValue(null);
      render(<DesktopHeader />);
      expect(screen.getByText('Staking')).toBeInTheDocument();
    });

    it('falls back to "Liberland" for unknown paths', () => {
      mockPathname = '/unknown/path';
      useSelector.mockReturnValue(null);
      render(<DesktopHeader />);
      expect(screen.getByText('Liberland')).toBeInTheDocument();
      expect(screen.getByText('Republic Ledger')).toBeInTheDocument();
    });
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      useSelector.mockReturnValue(null);
    });

    it('renders UserMenu (login button) fallback', () => {
      render(<DesktopHeader />);
      expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    });

    it('does not render a citizen avatar', () => {
      render(<DesktopHeader />);
      expect(screen.queryByText('CITIZEN')).not.toBeInTheDocument();
    });
  });

  describe('when a named citizen is logged in', () => {
    beforeEach(() => {
      // useSelector call order in DesktopHeader: selectUser, selectUserGivenName, selectUserFamilyName
      let callCount = 0;
      useSelector.mockImplementation(() => {
        callCount += 1;
        if (callCount === 1) return { blockchainAddress: '5Abc' }; // selectUser
        if (callCount === 2) return 'Ada';                         // selectUserGivenName
        if (callCount === 3) return 'Lovelace';                    // selectUserFamilyName
        callCount = 0;
        return null;
      });
    });

    it('shows the citizen display name', () => {
      render(<DesktopHeader />);
      expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    });

    it('shows the CITIZEN badge', () => {
      render(<DesktopHeader />);
      expect(screen.getByText('CITIZEN')).toBeInTheDocument();
    });

    it('shows initials derived from name', () => {
      render(<DesktopHeader />);
      expect(screen.getByText('AL')).toBeInTheDocument();
    });

    it('does NOT render UserMenu when named user is logged in', () => {
      render(<DesktopHeader />);
      expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument();
    });

    it('renders the dropdown with profile and logout options', () => {
      render(<DesktopHeader />);
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });

    it('navigates to profile on Profile dropdown click', async () => {
      const user = userEvent.setup();
      render(<DesktopHeader />);
      await user.click(screen.getByRole('button', { name: 'Profile' }));
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/profile'));
    });
  });

  describe('common elements', () => {
    beforeEach(() => {
      useSelector.mockReturnValue(null);
    });

    it('renders ChangeWallet component', () => {
      render(<DesktopHeader />);
      expect(screen.getByTestId('change-wallet')).toBeInTheDocument();
    });

    it('renders the Mainnet network badge', () => {
      render(<DesktopHeader />);
      expect(screen.getByText('Mainnet')).toBeInTheDocument();
    });

    it('renders the theme toggle button', () => {
      render(<DesktopHeader />);
      expect(screen.getByRole('button', { name: /dark mode/i })).toBeInTheDocument();
    });
  });
});
