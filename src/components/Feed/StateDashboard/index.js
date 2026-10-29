import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  blockchainSelectors, userSelectors, walletSelectors,
} from '../../../redux/selectors';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';
import { getSelectedNetwork, NETWORKS } from '../../../utils/networkHelpers';
import router from '../../../router';
import StatStrip, { DASH } from '../../StateUI/StatStrip';
import PendingTasks from '../../PendingTasks';
import RepublicLive from '../../RepublicLive';
import Guides from '../../Guides';
import styles from './styles.module.scss';

/*
 * The Liberland State dashboard — "State of the chain".
 *
 * Reproduces the design language's landing screen: an eyebrow and Playfair
 * headline, a four-column statement strip, the outstanding votes, and the
 * dispatch column. Values come from the same store the rest of the app reads,
 * so nothing here is decorative data: a figure that has not loaded shows an em
 * dash rather than an invented number.
 */

function StateDashboard({ pending, live }) {
  const history = useHistory();
  const user = useSelector(userSelectors.selectUser);
  const balances = useSelector(walletSelectors.selectorBalances);
  const liquidMerits = useSelector(walletSelectors.selectorLiquidMeritsBalance);
  const blockNumber = useSelector(blockchainSelectors.blockNumber);
  const network = NETWORKS[getSelectedNetwork()];

  const blockLabel = blockNumber != null ? `#${Number(blockNumber).toLocaleString()}` : '—';
  const spendable = balances?.liquidAmount?.amount;
  const pooled = balances?.liberstake?.amount;

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <div className={styles.eyebrow}>Citizen dashboard</div>
          <h1 className={styles.title}>State of the chain</h1>
        </div>
        <div className={styles.headMeta}>
          <div>{`${network.label} · Block ${blockLabel}`}</div>
          <div>{user ? 'Session active' : 'Not signed in'}</div>
        </div>
      </header>

      <StatStrip
        stats={[
          {
            key: 'spendable',
            label: 'Spendable',
            value: spendable != null ? formatDollars(spendable) : DASH,
            unit: 'LLD',
            note: 'Liquid balance',
          },
          {
            key: 'power',
            label: 'Political power',
            value: liquidMerits != null ? formatMerits(liquidMerits) : DASH,
            unit: 'LLM',
            note: pooled != null ? `${formatMerits(pooled)} politipooled` : 'Politipooled merits',
          },
          {
            key: 'yield',
            label: 'Staking yield',
            value: live?.stakerApy ?? undefined,
            note: 'From last week’s payouts',
          },
          {
            key: 'citizenship',
            label: 'Citizenship',
            value: user ? 'Active' : undefined,
            note: user ? 'Citizen of Liberland' : 'Sign in to verify',
          },
        ]}
      />

      <div className={styles.columns}>
        <section className={styles.col}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Awaiting you</h2>
            {pending?.tasks?.length > 0 && (
              <span className={styles.sectionCount}>{pending.tasks.length}</span>
            )}
          </div>
          <div className={styles.panel}>
            <PendingTasks
              tasks={pending?.tasks}
              isLoading={pending?.isLoading}
              isSignedIn={pending?.isSignedIn}
              limit={6}
            />
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => history.push(router.voting.referendum)}
                data-testid="state-go-voting"
              >
                Open referenda
              </button>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => history.push(router.congress.motions)}
                data-testid="state-go-motions"
              >
                Congress motions
              </button>
            </div>
          </div>
        </section>

        <section className={styles.col}>
          <h2 className={styles.sectionTitle}>The republic, live</h2>
          <RepublicLive {...live} />
          <Guides />
        </section>
      </div>
    </div>
  );
}

StateDashboard.propTypes = {
  pending: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    tasks: PropTypes.array,
    isLoading: PropTypes.bool,
    isSignedIn: PropTypes.bool,
  }),
  // eslint-disable-next-line react/forbid-prop-types
  live: PropTypes.object,
};

export default StateDashboard;
