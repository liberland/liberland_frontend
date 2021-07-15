import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import prettyNumber from '../../../utils/prettyNumber';

import { ReactComponent as ArrowYellowUpIcon } from '../../../assets/icons/arrow-yellow-up.svg';
import { ReactComponent as ArrowYellowDownIcon } from '../../../assets/icons/arrow-yellow-down.svg';
import { ReactComponent as ArrowRedDownIcon } from '../../../assets/icons/arrow-red-down.svg';
import { ReactComponent as ArrowRedUpIcon } from '../../../assets/icons/arrow-red-up.svg';
import { ReactComponent as ArrowBlueDownIcon } from '../../../assets/icons/arrow-blue-down.svg';
import { ReactComponent as ArrowBlueUpIcon } from '../../../assets/icons/arrow-blue-up.svg';
import Card from '../../Card';

import styles from './styles.module.scss';

const WalletOverview = ({
  totalBalance, liberstake, polkastake, liquidMerits,
}) => {
  const overviewInfo = [
    {
      amount: prettyNumber(liberstake),
      title: 'Liberstake',
      diff: 2.4,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (2.4 > 0 ? <ArrowYellowUpIcon /> : <ArrowYellowDownIcon />),
    },
    {
      amount: prettyNumber(polkastake),
      title: 'Polkastake',
      diff: 2.4,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (2.4 > 0 ? <ArrowRedUpIcon /> : <ArrowRedDownIcon />),
    },
    {
      amount: prettyNumber(liquidMerits),
      title: 'Liquid Merits',
      diff: -0.4,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (-0.4 > 0 ? <ArrowBlueUpIcon /> : <ArrowBlueDownIcon />),
    },
    {
      amount: prettyNumber(totalBalance),
      title: 'Total',
      diff: -0.6,
      // eslint-disable-next-line no-constant-condition
      getIcon: () => (-0.6 > 0 ? <ArrowRedUpIcon /> : <ArrowRedDownIcon />),
    },
  ];

  return (
    <Card className={styles.overviewWrapper} title="Overview">
      <div className={styles.overViewCard}>
        {
          overviewInfo.map((cardInfo) => {
            const isDiffPositive = cardInfo.diff > 0;

            return (
              <div className={styles.cardInfo} key={cardInfo.title}>
                <div className={styles.cardInfoIcon}>{cardInfo.getIcon()}</div>
                <div className={styles.cardInfoAmountWrapper}>
                  <p className={styles.cardInfoAmount}>
                    {cardInfo.amount}
                    <span> LLM</span>
                  </p>
                  <p className={cx(styles.cardInfoAmountDiff, {
                    [styles.cardInfoAmountDiffRed]: !isDiffPositive,
                    [styles.cardInfoAmountDiffGreen]: isDiffPositive,
                  })}
                  >
                    {`${isDiffPositive ? `+${cardInfo.diff}% ` : `${cardInfo.diff}% `} `}
                    {isDiffPositive ? (
                      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6L5.5 1L10 6M5.5 11V1.71429" stroke="#38CB89" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 6L5.5 11L1 6M5.5 1L5.5 10.2857" stroke="#FF5630" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </p>
                </div>
                <p className={styles.cardInfoTitle}>{cardInfo.title}</p>
              </div>
            );
          })
        }
      </div>
    </Card>
  );
};
WalletOverview.defaultProps = {
  totalBalance: 0,
  liberstake: 0,
  polkastake: 0,
  liquidMerits: 0,
};

WalletOverview.propTypes = {
  totalBalance: PropTypes.number,
  liberstake: PropTypes.number,
  polkastake: PropTypes.number,
  liquidMerits: PropTypes.number,
};

export default WalletOverview;
