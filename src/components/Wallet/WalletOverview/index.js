import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as ArrowYellowUpIcon } from '../../../assets/icons/arrow-yellow-up.svg';
import { ReactComponent as ArrowYellowDownIcon } from '../../../assets/icons/arrow-yellow-down.svg';
import { ReactComponent as ArrowRedDownIcon } from '../../../assets/icons/arrow-red-down.svg';
import { ReactComponent as ArrowRedUpIcon } from '../../../assets/icons/arrow-red-up.svg';
import { ReactComponent as ArrowBlueDownIcon } from '../../../assets/icons/arrow-blue-down.svg';
import { ReactComponent as ArrowBlueUpIcon } from '../../../assets/icons/arrow-blue-up.svg';
import Card from '../../Card';

import styles from './styles.module.scss';
import { formatDollars, formatMerits } from '../../../utils/walletHelpers';

function WalletOverview({
  balances, liquidMerits,
}) {
  const overviewInfo = [
    {
      amount: formatMerits(balances.liberstake.amount),
      title: 'PolitiPooled',
      diff: 2.4,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (2.4 > 0 ? <ArrowYellowUpIcon /> : <ArrowYellowDownIcon />),
      currency: 'LLM',
    },
    {
      amount: formatDollars(balances.polkastake.amount),
      title: 'Validator Staked',
      diff: 2.4,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (2.4 > 0 ? <ArrowRedUpIcon /> : <ArrowRedDownIcon />),
      currency: 'LLD',
    },
    {
      amount: formatMerits(liquidMerits),
      title: 'Liquid',
      diff: -0.4,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (-0.4 > 0 ? <ArrowBlueUpIcon /> : <ArrowBlueDownIcon />),
      currency: 'LLM',
    },
    {
      amount: formatDollars(balances.liquidAmount.amount),
      title: 'Liquid',
      diff: -0.6,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (-0.6 > 0 ? <ArrowRedUpIcon /> : <ArrowRedDownIcon />),
      currency: 'LLD',
    },
  ];

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
};

WalletOverview.propTypes = {
  // eslint-disable-next-line
  totalBalance: PropTypes.string,
  balances: PropTypes.shape({
    free: PropTypes.shape({
      amount: PropTypes.string,
    }),
    liberstake: PropTypes.shape({
      amount: PropTypes.string,
    }),
    polkastake: PropTypes.shape({
      amount: PropTypes.number,
    }),
    liquidMerits: PropTypes.shape({
      amount: PropTypes.number,
    }),
  }),
  liquidMerits: PropTypes.number,
};

export default WalletOverview;
