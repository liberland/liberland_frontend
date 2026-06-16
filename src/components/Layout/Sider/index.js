import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import { blockchainSelectors } from '../../../redux/selectors';
import router from '../../../router';
import styles from './styles.module.scss';

const StateSeal = () => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="var(--gold-tint)" stroke="var(--gold)" strokeWidth="1.4" />
    <circle cx="20" cy="22.5" r="6.2" fill="none" stroke="var(--gold)" strokeWidth="1.6" />
    <path d="M20 16.3V11M20 16.3l3.4-3.1M20 16.3l-3.4-3.1M26 22.5h4.6M14 22.5H9.4M24.2 18.3l3-2.6M15.8 18.3l-3-2.6" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 28.5q9 -5 18 0" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </svg>
);

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { key: 'feed', route: router.home.feed, label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg> },
      { key: 'wallet', route: router.wallet.overView, label: 'Wallet', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="6" width="19" height="13" rx="2.5"/><path d="M16 12.5h2.5"/><path d="M2.5 9.5h13a2 2 0 0 1 2 2"/></svg> },
    ],
  },
  {
    label: 'Citizen',
    items: [
      { key: 'documents', route: router.home.documents, label: 'Identity & Docs', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><circle cx="8" cy="11" r="2.3"/><path d="M4.8 16.2c.5-1.7 1.8-2.6 3.2-2.6s2.7.9 3.2 2.6"/><path d="M14.5 9.5h4M14.5 12.5h4M14.5 15.5h2.5"/></svg> },
      { key: 'contracts', route: router.contracts.overview, label: 'Contracts', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8Z"/><path d="M14 2.5V8h5.5M8 13h8M8 16.5h5"/></svg> },
      { key: 'nfts', route: router.nfts.overview, label: 'NFTs', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
      { key: 'profile', route: router.home.profile, label: 'Profile', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
    ],
  },
  {
    label: 'Governance',
    items: [
      { key: 'voting', route: router.voting.referendum, label: 'Voting', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.5 11 14.5 15.5 10M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg> },
      { key: 'legislation', route: router.legislation.constitution, label: 'Legislation', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4.5h11a2 2 0 0 1 2 2V21l-3-2-3 2-3-2-3 2V6.5a2 2 0 0 1 2-2Z"/><path d="M8.5 9h6M8.5 12.5h6M8.5 16h3"/></svg> },
      { key: 'congress', route: router.home.congress, label: 'Congress', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M12 3 4 8h16L12 3Z"/></svg> },
      { key: 'senate', route: router.home.senate, label: 'Senate', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M7 7h10M5 7l-2.5 6a3 3 0 0 0 5 0L5 7ZM19 7l-2.5 6a3 3 0 0 0 5 0L19 7ZM8 21h8"/></svg> },
    ],
  },
  {
    label: 'Economy & State',
    items: [
      { key: 'staking', route: router.home.staking, label: 'Staking', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6"/></svg> },
      { key: 'registries', route: router.home.registries, label: 'Registries', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V7l8-4 8 4v14M4 21h16M9 21v-5h6v5M8 10h.01M16 10h.01"/></svg> },
      { key: 'offices', route: router.home.offices, label: 'Offices', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v4M10 14h4"/></svg> },
      { key: 'companies', route: router.home.companies, label: 'Companies', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM9 22V12h6v10"/></svg> },
    ],
  },
];

function NavItem({ item, isActive, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={styles.navIcon}>{item.icon}</span>
      <span className={styles.navLabel}>{item.label}</span>
    </button>
  );
}

function Sider() {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 768px)');
  const { pathname } = useLocation();
  const history = useHistory();
  const blockNumber = useSelector(blockchainSelectors.blockNumber);

  if (!isBiggerThanSmallScreen) return null;

  const isActive = (item) => {
    if (item.key === 'feed') {
      return pathname === router.home.feed || pathname === router.home.index;
    }
    return pathname.startsWith(item.route);
  };

  return (
    <aside className={styles.sider}>
      <div className={styles.topAccent} />
      <div className={styles.brand}>
        <StateSeal />
        <div className={styles.brandText}>
          <div className={styles.brandName}>Liberland</div>
          <div className={styles.brandSub}>Republic Ledger</div>
        </div>
      </div>
      <nav className={styles.nav}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className={styles.navSection}>
            <div className={styles.sectionLabel}>{section.label}</div>
            {section.items.map((item) => (
              <NavItem
                key={item.key}
                item={item}
                isActive={isActive(item)}
                onClick={() => history.push(item.route)}
              />
            ))}
          </div>
        ))}
      </nav>
      <div className={styles.footer}>
        <span className={styles.networkDot} aria-hidden="true" />
        <span className={styles.networkLabel}>Mainnet synced</span>
        {blockNumber != null && (
          <span className={styles.blockHeight}>#{Number(blockNumber).toLocaleString()}</span>
        )}
      </div>
    </aside>
  );
}

export default Sider;
