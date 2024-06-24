import React from 'react';
import PropTypes from 'prop-types';

import Card from '../../Card';

import styles from './styles.module.scss';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';

function WalletOverview({
  balances, liquidMerits, showStaked,
}) {
  const overviewInfo = [];
  if (showStaked) {
    overviewInfo.push(...[
      {
        amount: formatMerits(balances.liberstake.amount),
        title: 'PolitiPooled',
        currency: 'LLM',
      },
      {
        amount: formatDollars(balances.polkastake.amount),
        title: 'Validator Staked',
        currency: 'LLD',
      },
    ]);
  }
  overviewInfo.push(...[
    {
      amount: formatMerits(liquidMerits),
      title: 'Liquid',
      currency: 'LLM',
    },
    {
      amount: formatDollars(balances.liquidAmount.amount),
      title: 'Liquid',
      currency: 'LLD',
    },
  ]);

  return (
    <Card className={styles.overviewWrapper} title="Overview">
      <div className={styles.overViewCard}>
        {
          overviewInfo.map((cardInfo, index) => (
            <div
              className={styles.cardInfo}
              // eslint-disable-next-line react/no-array-index-key
              key={cardInfo + index}
            >
              <p className={styles.cardInfoAmount}>
                {cardInfo.amount}
              </p>
              <p className={styles.cardInfoTitle}>
                {cardInfo.title}
                {' '}
                {cardInfo.currency}
              </p>
            </div>
          ))
        }
      </div>
    </Card>
  );
}
WalletOverview.defaultProps = {
  totalBalance: '0x0',
  balances: {},
  liquidMerits: 0,
  showStaked: true,
};

WalletOverview.propTypes = {
  // eslint-disable-next-line
  totalBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showStaked: PropTypes.bool,
  balances: PropTypes.shape({
    liquidAmount: PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      amount: PropTypes.object,
    }),
    liberstake: PropTypes.shape({
      amount: PropTypes.number,
    }),
    polkastake: PropTypes.shape({
      amount: PropTypes.number,
    }),
    liquidMerits: PropTypes.shape({
      amount: PropTypes.string,
    }),
  }),
  liquidMerits: PropTypes.string,
};

export default WalletOverview;
