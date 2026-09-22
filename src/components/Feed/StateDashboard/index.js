import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import {
  blockchainSelectors, userSelectors, walletSelectors,
} from '../../../redux/selectors';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';
import { getSelectedNetwork, NETWORKS } from '../../../utils/networkHelpers';
import router from '../../../router';
import StatStrip, { DASH } from '../../StateUI/StatStrip';
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

function StateDashboard({ news }) {
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
            unit: 'APY',
            note: 'Bonded LLD',
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
          <h2 className={styles.sectionTitle}>Awaiting your vote</h2>
          <div className={styles.panel}>
            <p className={styles.panelBody}>
              Referenda and congressional motions open for your vote are listed in
              the assembly.
            </p>
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
          <h2 className={styles.sectionTitle}>Dispatch</h2>
          <div className={styles.dispatch}>
            {news.map((item) => (
              <article key={item.title} className={styles.dispatchItem}>
                <div className={styles.dispatchMeta}>
                  <span className={styles.tag}>{`#${item.tag}`}</span>
                  <span className={styles.dispatchDate}>{item.date}</span>
                  <span className={styles.dispatchAuthor}>{item.author}</span>
                </div>
                <h3 className={styles.dispatchTitle}>{item.title}</h3>
                <div className={styles.dispatchBody}>
                  <Markdown>{item.text}</Markdown>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

StateDashboard.propTypes = {
  news: PropTypes.arrayOf(PropTypes.shape({
    tag: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    author: PropTypes.string,
    text: PropTypes.string,
  })).isRequired,
};

export default StateDashboard;
