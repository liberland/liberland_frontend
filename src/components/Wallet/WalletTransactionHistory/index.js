/* eslint-disable react/prop-types */
import React from 'react';
import Button from '../../Button/Button';
import Card from '../../Card';

import { ReactComponent as CheckIcon } from '../../../assets/icons/green-check.svg';
import { ReactComponent as RefundIcon } from '../../../assets/icons/refund.svg';
import { ReactComponent as FailedIcon } from '../../../assets/icons/failed.svg';
import styles from './styles.module.scss';
import Status from '../../Status';
import {formatMeritTransaction} from "../../../utils/walletHelpers";

const paymentTypeIcons = {
  failure: <FailedIcon />,
  success: <CheckIcon />,
  refund: <RefundIcon />,
};

const WalletTransactionHistory = ({ transactionHistory, textForBtn, bottomButtonOnclick }) => {

  return (
  <Card title="Transaction History" className={styles.cardWrapper}>
    <div className={styles.transactionHistoryCard}>
      <div className={styles.transactionHistoryCardHeader}>
        <span>PAYMENT NUMBER</span>
        <span>AMOUNT</span>
        <span>STATUS</span>
      </div>

      {transactionHistory.map((transactionHistoryInfo) => {
        const isAmountPositive = transactionHistoryInfo.amount > 0;
        return (
          <div className={styles.transactionHistoryCardMain} key={transactionHistoryInfo.id}>
            <div className={styles.paymentNumber}>
              <div className={styles.paymentNumberIcon}>
                {paymentTypeIcons[transactionHistoryInfo.status]}
              </div>
              <div className={styles.paymentFrom}>
                {
                    isAmountPositive
                      ? (
                        <p>
                          Payment from
                          {' '}
                          <span>
                            {transactionHistoryInfo.account_from}
                          </span>
                        </p>
                      )
                      : (
                        <p>
                          Payment to
                          {' '}
                          <span>
                            {transactionHistoryInfo.account_to}
                          </span>
                        </p>

                      )
                  }
                <p className={styles.paymentFromDate}>{transactionHistoryInfo.date}</p>
              </div>
            </div>
            <div className={styles.transactionHistoryAmount}>
              {isAmountPositive ? '+' : ''}
              {formatMeritTransaction(transactionHistoryInfo.amount)}
            </div>
            <div>
              <Status
                status={transactionHistoryInfo.status}
                completed={transactionHistoryInfo.status === 'success'}
                declined={transactionHistoryInfo.status === 'failure'}
              />
            </div>
          </div>
        );
      })}

      <Button onClick={bottomButtonOnclick}>
        {textForBtn}
        {' '}
        &gt;
      </Button>
    </div>
  </Card>
)};
export default WalletTransactionHistory;
