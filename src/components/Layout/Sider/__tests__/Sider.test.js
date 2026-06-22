import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();
let mockPathname = '/home/feed';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: mockPathname }),
  useHistory: () => ({ push: mockPush }),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => 42000),
}));

jest.mock('usehooks-ts', () => ({
  useMediaQuery: jest.fn(() => true), // desktop by default
}));

import { useMediaQuery } from 'usehooks-ts';
import Sider from '../index';

describe('Sider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/home/feed';
    useMediaQuery.mockReturnValue(true);
  });

  it('renders nothing on mobile', () => {
    useMediaQuery.mockReturnValue(false);
    const { container } = render(<Sider />);
    expect(container.firstChild).toBeNull();
  });

  it('renders on desktop', () => {
    render(<Sider />);
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('shows brand name "Liberland"', () => {
    render(<Sider />);
    expect(screen.getByText('Liberland')).toBeInTheDocument();
  });

  it('shows "Republic Ledger" subtitle', () => {
    render(<Sider />);
    expect(screen.getByText('Republic Ledger')).toBeInTheDocument();
  });

  it('renders all section headers', () => {
    render(<Sider />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Citizen')).toBeInTheDocument();
    expect(screen.getByText('Governance')).toBeInTheDocument();
    expect(screen.getByText('Economy & State')).toBeInTheDocument();
  });

  it('renders all 13 navigation items', () => {
    render(<Sider />);
    const expectedItems = [
      'Dashboard', 'Wallet',
      'Identity & Docs', 'Contracts', 'NFTs', 'Profile',
      'Voting', 'Legislation', 'Congress', 'Senate',
      'Staking', 'Registries', 'Offices', 'Companies',
    ];
    expectedItems.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('displays the live block height', () => {
    render(<Sider />);
    expect(screen.getByText('#42,000')).toBeInTheDocument();
  });

  it('shows "Mainnet synced" network label', () => {
    render(<Sider />);
    expect(screen.getByText('Mainnet synced')).toBeInTheDocument();
  });

  it('marks Dashboard as active on /home/feed', () => {
    mockPathname = '/home/feed';
    render(<Sider />);
    const dashboardBtn = screen.getByRole('button', { name: /dashboard/i });
    expect(dashboardBtn).toHaveAttribute('aria-current', 'page');
  });

  it('marks Dashboard as active on /home (index route)', () => {
    mockPathname = '/home';
    render(<Sider />);
    const dashboardBtn = screen.getByRole('button', { name: /dashboard/i });
    expect(dashboardBtn).toHaveAttribute('aria-current', 'page');
  });

  it('marks Wallet as active on /home/wallet/overview', () => {
    mockPathname = '/home/wallet/overview';
    render(<Sider />);
    const walletBtn = screen.getByRole('button', { name: /^wallet$/i });
    expect(walletBtn).toHaveAttribute('aria-current', 'page');
  });

  it('marks Voting as active on /home/voting/referendum', () => {
    mockPathname = '/home/voting/referendum';
    render(<Sider />);
    const votingBtn = screen.getByRole('button', { name: /^voting$/i });
    expect(votingBtn).toHaveAttribute('aria-current', 'page');
  });

  it('navigates when a nav item is clicked', async () => {
    const user = userEvent.setup();
    render(<Sider />);
    await user.click(screen.getByRole('button', { name: /^staking$/i }));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/staking'));
  });

  it('navigates to congress on Congress click', async () => {
    const user = userEvent.setup();
    render(<Sider />);
    await user.click(screen.getByRole('button', { name: /^congress$/i }));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/congress'));
  });

  it('navigates to profile on Profile click', async () => {
    const user = userEvent.setup();
    render(<Sider />);
    await user.click(screen.getByRole('button', { name: /^profile$/i }));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/profile'));
  });

  it('does not mark Dashboard active on /home/wallet', () => {
    mockPathname = '/home/wallet';
    render(<Sider />);
    const dashboardBtn = screen.getByRole('button', { name: /dashboard/i });
    expect(dashboardBtn).not.toHaveAttribute('aria-current', 'page');
  });
});
