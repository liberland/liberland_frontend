import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Dropdown from 'antd/es/dropdown';
import uniqBy from 'lodash/uniqBy';
import { formatAssets, formatDollars, formatMerits } from '../../../utils/walletHelpers';
import { isCompanyConnected } from '../../../utils/asset';
import CurrencyIcon from '../../CurrencyIcon';
import HistoryCopyIconWithAddress from '../HistoryCopyIconWithAddress';
import SendLLDModal from '../../Modals/SendLLDModal';
import RequestLLDModal from '../../Modals/RequestLLDModal';
import SendLLMModalWrapper from '../../Modals/SendLLMModal';
import UnpoolLLMModalWrapper from '../../Modals/UnpoolModal';
import PolitipoolLLMModalWrapper from '../../Modals/PolitipoolModal';
import SendAssetModal from '../../Modals/SendAssetModal';
import GetLLDWrapper from '../../GetLLDWrapper';
import Button from '../../Button/Button';
import router from '../../../router';
import styles from './styles.module.scss';

/*
 * The Wallet, as the Liberland State design language draws it.
 *
 * The design lays the screen out as three flat sections rather than the
 * Ledger's collapsible cards: one balance banner split between the two native
 * currencies, then Assets, then Recent transfers — both as bare grids on the
 * page.
 *
 * Every figure and every action here comes from the same selectors and the
 * same modal components the Ledger screen uses; only the arrangement differs.
 * Nothing is mocked, and a figure that has not loaded shows an em dash rather
 * than a zero that would read as a real balance.
 */

const DASH = '—';

function Banner({
  eyebrow, amount, unit, note, actions,
}) {
  return (
    <div className={styles.bannerCell}>
      <div className={styles.eyebrow}>{eyebrow}</div>
      <div className={styles.amountRow}>
        <span className={styles.amount}>{amount}</span>
        <span className={styles.unit}>{unit}</span>
      </div>
      <div className={styles.note}>{note}</div>
      <div className={styles.actions}>{actions}</div>
    </div>
  );
}

Banner.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  amount: PropTypes.node.isRequired,
  unit: PropTypes.string.isRequired,
  note: PropTypes.node,
  actions: PropTypes.node,
};

function Section({ title, aside, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  aside: PropTypes.node,
  children: PropTypes.node,
};

const PAGE = 8;

function StateWalletOverview({
  balances,
  liquidMerits,
  additionalAssets,
  transactionHistory,
  historyFetchFailed,
  userIsMember,
  isCongress,
}) {
  const history = useHistory();
  const [filterBy, setFilterBy] = useState('');
  const [shown, setShown] = useState(PAGE);

  const liquidLld = balances?.liquidAmount?.amount;
  const stakedLld = balances?.polkastake?.amount;
  const pooledLlm = balances?.liberstake?.amount;

  const assetRows = useMemo(() => {
    const native = [
      {
        key: 'LLD',
        symbol: 'LLD',
        name: 'Liberland Dollar',
        klass: 'Native',
        balance: liquidLld != null ? formatDollars(liquidLld) : DASH,
      },
      {
        key: 'LLM',
        symbol: 'LLM',
        name: 'Liberland Merit',
        klass: 'Political',
        balance: liquidMerits != null ? formatMerits(liquidMerits) : DASH,
      },
    ];
    const extra = (additionalAssets || [])
      .filter((asset) => asset?.balance?.balance > 0)
      .map((asset) => {
        const connected = isCompanyConnected(asset);
        return {
          key: asset.metadata.symbol + asset.metadata.name,
          symbol: asset.metadata.symbol,
          name: asset.metadata.name,
          klass: connected ? 'Company stock' : 'Asset',
          balance: formatAssets(asset.balance?.balance || '0', asset.metadata.decimals, { withAll: true }),
          logo: connected ? asset.company.logoURL : undefined,
          asset,
        };
      });
    return native.concat(extra);
  }, [additionalAssets, liquidLld, liquidMerits]);

  const transfers = useMemo(
    () => (historyFetchFailed ? [] : (transactionHistory || []))
      .filter(({ typeText }) => !filterBy || typeText === filterBy),
    [transactionHistory, historyFetchFailed, filterBy],
  );

  const filterMenu = (
    <Dropdown
      trigger={['click']}
      arrow={false}
      menu={{
        items: [{ key: '', label: 'All transaction types' }].concat(
          uniqBy(transactionHistory || [], ({ typeText }) => typeText)
            .map(({ typeText }) => ({ key: typeText, label: typeText })),
        ),
        onClick: ({ key }) => { setFilterBy(key); setShown(PAGE); },
      }}
    >
      <Button small data-testid="transfer-filter">
        {filterBy || 'All transaction types'}
      </Button>
    </Dropdown>
  );

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <Banner
          eyebrow="Liberland dollar"
          amount={liquidLld != null ? formatDollars(liquidLld, false, 2) : DASH}
          unit="LLD"
          note={stakedLld != null
            ? `Liquid. ${formatDollars(stakedLld, false, 2)} staked with validators.`
            : 'Liquid balance.'}
          actions={isCongress ? null : (
            <>
              <GetLLDWrapper>
                <SendLLDModal />
              </GetLLDWrapper>
              <RequestLLDModal />
              <Button onClick={() => history.push(router.staking.overview)}>Stake</Button>
              <Button onClick={() => history.push(router.wallet.bridge)}>Bridge</Button>
            </>
          )}
        />
        <Banner
          eyebrow="Liberland merit"
          amount={liquidMerits != null ? formatMerits(liquidMerits, false, 2) : DASH}
          unit="LLM"
          note={pooledLlm != null
            ? `Political power. ${formatMerits(pooledLlm, false, 2)} politipooled.`
            : 'Political power.'}
          actions={isCongress ? null : (
            <>
              <PolitipoolLLMModalWrapper />
              <UnpoolLLMModalWrapper />
              <SendLLMModalWrapper />
            </>
          )}
        />
      </div>

      <Section title="Assets">
        <table className={styles.grid}>
          <thead>
            <tr>
              <th>Asset</th>
              <th className={styles.klassHead}>Class</th>
              <th className={styles.numeric}>Balance</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {assetRows.map((row) => (
              <tr key={row.key}>
                <td>
                  <span className={styles.assetName}>
                    <CurrencyIcon size={20} symbol={row.symbol} logo={row.logo} />
                    {row.name}
                  </span>
                  <span className={styles.klassInline}>{row.klass}</span>
                </td>
                <td className={styles.klass}>{row.klass}</td>
                <td className={`${styles.numeric} ${styles.mono}`}>{row.balance}</td>
                <td className={styles.rowAction}>
                  {row.asset && (!isCongress || userIsMember) ? (
                    <SendAssetModal assetData={row.asset} />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Recent transfers" aside={filterMenu}>
        {transfers.length ? (
          <>
            <ul className={styles.transfers}>
              {transfers.slice(0, shown).map((tx) => (
                <li key={`${tx.userId}-${tx.dateTransactionHistory}-${tx.asset}`} className={styles.transfer}>
                  <span className={styles.kind}>{tx.typeText}</span>
                  <span className={styles.party}>
                    <HistoryCopyIconWithAddress address={tx.userId} />
                  </span>
                  <span className={`${styles.numeric} ${styles.mono} ${styles.txAmount}`}>
                    {tx.asset}
                    {' '}
                    {tx.currency}
                  </span>
                  <span className={styles.when}>{tx.dateTransactionHistory}</span>
                </li>
              ))}
            </ul>
            {transfers.length > shown && (
              <Button
                className={styles.more}
                onClick={() => setShown((count) => count + PAGE)}
                data-testid="transfers-show-more"
              >
                {`Show ${Math.min(PAGE, transfers.length - shown)} more`}
              </Button>
            )}
          </>
        ) : (
          <p className={styles.empty}>
            {historyFetchFailed
              ? 'Transaction history could not be loaded.'
              : 'No transfers on this account yet.'}
          </p>
        )}
      </Section>
    </div>
  );
}

StateWalletOverview.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  balances: PropTypes.object,
  liquidMerits: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  additionalAssets: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  transactionHistory: PropTypes.array,
  historyFetchFailed: PropTypes.bool,
  userIsMember: PropTypes.bool,
  isCongress: PropTypes.bool,
};

export default StateWalletOverview;
