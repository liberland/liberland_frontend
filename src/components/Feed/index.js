/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useModeContext } from '../AntdProvider';
import StateDashboard from './StateDashboard';
import PendingTasks from '../PendingTasks';
import RepublicLive from '../RepublicLive';
import Guides from '../Guides';
import usePendingTasks from '../../hooks/usePendingTasks';
import useRepublicLive from '../../hooks/useRepublicLive';
import { userSelectors } from '../../redux/selectors';
import router from '../../router';
import styles from './styles.module.scss';

const TREND_CLASS = {
  green: styles.trendGreen,
  gold: styles.trendGold,
};

function StatCard({
  label, value, unit, trend, trendColor, onClick,
}) {
  return (
    <button type="button" className={styles.statCard} onClick={onClick}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>
        {value}
        {unit && (
        <span className={styles.statUnit}>
          {' '}
          {unit}
        </span>
        )}
      </div>
      {trend && (
        <div className={`${styles.statTrend} ${TREND_CLASS[trendColor] || styles.trendRed}`}>
          {trend}
        </div>
      )}
    </button>
  );
}

StatCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.node,
  unit: PropTypes.string,
  trend: PropTypes.node,
  trendColor: PropTypes.string,
  onClick: PropTypes.func,
};

function IdentityBanner({
  name, initials, isCitizen, onViewPassport,
}) {
  return (
    <section className={styles.banner}>
      <svg
        width="260"
        height="260"
        viewBox="0 0 40 40"
        fill="none"
        className={styles.bannerSeal}
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="19" fill="none" stroke="#E6BA56" strokeWidth="1" />
        <circle cx="20" cy="22.5" r="6.2" fill="none" stroke="#E6BA56" strokeWidth="1.2" />
        <path d="M20 16.3V11M20 16.3l3.4-3.1M20 16.3l-3.4-3.1M26 22.5h4.6M14 22.5H9.4M24.2 18.3l3-2.6M15.8 18.3l-3-2.6" stroke="#E6BA56" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M11 28.5q9 -5 18 0" stroke="#E6BA56" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
      <div className={styles.bannerContent}>
        <div className={styles.bannerAvatar}>{initials || '?'}</div>
        <div className={styles.bannerInfo}>
          <div className={styles.bannerRole}>
            {isCitizen ? 'Citizen of Liberland' : 'Liberland dApp'}
          </div>
          <div className={styles.bannerName}>{name || 'Welcome'}</div>
          {isCitizen && (
            <div className={styles.bannerMeta}>
              <span className={styles.bannerVerified}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                eID Verified
              </span>
            </div>
          )}
        </div>
        {isCitizen && (
          <button type="button" className={styles.bannerAction} onClick={onViewPassport}>
            View passport
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

IdentityBanner.propTypes = {
  name: PropTypes.string,
  initials: PropTypes.string,
  isCitizen: PropTypes.bool,
  onViewPassport: PropTypes.func,
};

function Feed() {
  const history = useHistory();
  const { isStateDesign } = useModeContext();
  const user = useSelector(userSelectors.selectUser);
  const pending = usePendingTasks();
  const live = useRepublicLive();
  const givenName = useSelector(userSelectors.selectUserGivenName);
  const familyName = useSelector(userSelectors.selectUserFamilyName);

  const displayName = givenName
    ? `${givenName}${familyName ? ` ${familyName}` : ''}`
    : null;
  const initialsOf = () => {
    if (givenName && familyName) return `${givenName[0]}${familyName[0]}`.toUpperCase();
    if (givenName) return givenName.slice(0, 2).toUpperCase();
    return null;
  };
  const initials = initialsOf();

  // The State language specifies its own landing screen.
  if (isStateDesign) {
    return <StateDashboard pending={pending} live={live} />;
  }

  return (
    <div className={styles.page}>
      <IdentityBanner
        name={displayName}
        initials={initials}
        isCitizen={!!user}
        onViewPassport={() => history.push(router.home.documents)}
      />

      <section className={styles.newsSection}>
        <div className={styles.tasksHeader}>
          <h2 className={styles.newsSectionTitle}>Needs your attention</h2>
          {pending.tasks.length > 0 && (
            <span className={styles.taskCount}>{pending.tasks.length}</span>
          )}
        </div>
        <PendingTasks
          tasks={pending.tasks}
          isLoading={pending.isLoading}
          isSignedIn={pending.isSignedIn}
          limit={6}
        />
      </section>

      <div className={styles.statsGrid}>
        <StatCard
          label="Wallet"
          value="—"
          unit="LLD"
          trend="View balance →"
          trendColor="gold"
          onClick={() => history.push(router.wallet.overView)}
        />
        <StatCard
          label="Open referenda"
          value={live.openReferenda != null ? String(live.openReferenda) : '—'}
          trend="Cast your vote →"
          trendColor="red"
          onClick={() => history.push(router.voting.referendum)}
        />
        <StatCard
          label="Staking"
          value={live.stakerApy || '—'}
          trend="View validators →"
          trendColor="green"
          onClick={() => history.push(router.home.staking)}
        />
        <StatCard
          label="Congress"
          value="—"
          trend="Active motions →"
          trendColor="gold"
          onClick={() => history.push(router.home.congress)}
        />
      </div>

      <div className={styles.newsSection}>
        <div className={styles.newsSectionHeader}>
          <h2 className={styles.newsSectionTitle}>The republic, live</h2>
        </div>
        <RepublicLive {...live} layout="wide" />
        <Guides />
      </div>
    </div>
  );
}

export default Feed;
