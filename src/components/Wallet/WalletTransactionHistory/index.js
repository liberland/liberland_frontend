/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */ // remove after refactoring history back in
import React from 'react';
import { useSelector } from 'react-redux';
import { BN, BN_ZERO } from '@polkadot/util';
import Button from '../../Button/Button';
import Card from '../../Card';

import { ReactComponent as CheckIcon } from '../../../assets/icons/green-check.svg';
import { ReactComponent as RefundIcon } from '../../../assets/icons/refund.svg';
import { ReactComponent as FailedIcon } from '../../../assets/icons/failed.svg';
import styles from './styles.module.scss';
import Status from '../../Status';
import { formatMeritTransaction, formatDollarTransaction } from '../../../utils/walletHelpers';

import { blockchainSelectors } from '../../../redux/selectors';

const paymentTypeIcons = {
  failure: <FailedIcon />,
  success: <CheckIcon />,
  refund: <RefundIcon />,
};

function WalletTransactionHistory({ transactionHistory, bottomButtonOnclick }) {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector).toString();

  transactionHistory.sort((a, b) => new BN(b.block.number).sub(new BN(a.block.number)));
  return (
    <Card title="Transaction History" className={styles.cardWrapper}>
      <div className={styles.transactionHistoryCard}>
        <div className={styles.transactionHistoryCardHeader}>
          <span>PAYMENT NUMBER</span>
          <span>AMOUNT</span>
          <span>STATUS</span>
        </div>

        {transactionHistory.map((transactionHistoryInfo) => {
          const value = transactionHistoryInfo.fromId === walletAddress
            ? `-${transactionHistoryInfo.value}`
            : transactionHistoryInfo.value;
          const isAmountPositive = new BN(value).gt(BN_ZERO);

          return (
            <div className={styles.transactionHistoryCardMain} key={transactionHistoryInfo.id}>
              <div className={styles.paymentNumber}>
                <div className={styles.paymentNumberIcon}>
                  {paymentTypeIcons.success}
                </div>
                <div className={styles.paymentFrom}>
                  {
                    isAmountPositive
                      ? (
                        <p>
                          Payment from
                          {' '}
                          <span>
                            {transactionHistoryInfo.fromId}
                          </span>
                        </p>
                      )
                      : (
                        <p>
                          Payment to
                          {' '}
                          <span>
                            {transactionHistoryInfo.toId}
                          </span>
                        </p>

                      )
                  }
                  <p className={styles.paymentFromDate}>{transactionHistoryInfo.block.timestamp}</p>
                </div>
              </div>
              <div className={styles.transactionHistoryAmount}>
                {transactionHistoryInfo.asset === 'LLM'
                  ? formatMeritTransaction(value)
                  : formatDollarTransaction(value)}
              </div>
              <div>
                <Status
                  status="success"
                  completed
                  declined={false}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
export default WalletTransactionHistory;
