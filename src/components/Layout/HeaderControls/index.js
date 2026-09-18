/* eslint-disable max-len */
import React from 'react';
import Dropdown from 'antd/es/dropdown';
import { useModeContext } from '../../AntdProvider';
import {
  NETWORKS, getSelectedNetwork, setSelectedNetwork,
} from '../../../utils/networkHelpers';
import styles from './styles.module.scss';

/*
 * Header controls shared by both design languages. Extracted so the Ledger
 * header and the State top bar cannot drift apart, and so the automation and
 * accessibility hooks exist in exactly one place.
 */

export function NetworkSwitcher() {
  const current = getSelectedNetwork();
  const dotClass = current === 'testnet'
    ? `${styles.networkDot} ${styles.networkDotTestnet}`
    : styles.networkDot;
  const items = Object.values(NETWORKS).map((n) => ({ key: n.key, label: n.label }));
  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: [current],
        onClick: ({ key }) => { if (key !== current) setSelectedNetwork(key); },
      }}
      trigger={['click']}
    >
      <button
        type="button"
        className={styles.networkBadge}
        aria-haspopup="menu"
        aria-label={`Network: ${NETWORKS[current].label}. Change network`}
        data-testid="network-switcher"
        data-network={current}
      >
        <span className={dotClass} />
        {NETWORKS[current].label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </Dropdown>
  );
}

export function ThemeToggle() {
  const { isDarkMode, setIsDarkMode } = useModeContext();
  return (
    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => setIsDarkMode(!isDarkMode)}
      data-testid="theme-toggle"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
    >
      {isDarkMode ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
