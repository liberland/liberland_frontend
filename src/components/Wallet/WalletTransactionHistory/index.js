/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */ // remove after refactoring history back in
import React, {useRef} from 'react';
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
import truncate from '../../../utils/truncate';
import {useMediaQuery} from "usehooks-ts";
import {ReactComponent as CopyIcon} from "../../../assets/icons/copy.svg";
import NotificationPortal from "../../NotificationPortal";

const paymentTypeIcons = {
  failure: <FailedIcon />,
  success: <CheckIcon />,
  refund: <RefundIcon />,
};

function WalletTransactionHistory({ failure, transactionHistory, bottomButtonOnclick }) {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector).toString();
  const notificationRef = useRef();
  const isLarge = useMediaQuery('(min-width: 62em)');

  const handleCopyClick = (address) => {
    console.log('copying')
    navigator.clipboard.writeText(address);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  transactionHistory.sort((a, b) => new BN(b.block.number).sub(new BN(a.block.number)));
  return (
    <Card title="Transaction History" className={styles.cardWrapper}>
      <NotificationPortal ref={notificationRef} />
      <div className={styles.transactionHistoryCard}>
        <div className={styles.transactionHistoryCardHeader}>
          <span>PAYMENT NUMBER</span>
          <span>AMOUNT</span>
          <span>STATUS</span>
        </div>
        {
          failure ? 'Failed to fetch transaction history'
            : transactionHistory.map((transactionHistoryInfo) => {
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
                            From
                            {' '}
                            <span>
                              <CopyIcon className={styles.copyIcon} name="walletAddress" onClick={(e) => handleCopyClick(transactionHistoryInfo.fromId)} />
                              {isLarge ? transactionHistoryInfo.fromId : truncate(transactionHistoryInfo.fromId, 13)}
                            </span>
                          </p>
                        )
                        : (
                          <p>
                            To
                            {' '}
                            <span>
                              <CopyIcon className={styles.copyIcon} name="walletAddress" onClick={(e) => handleCopyClick(transactionHistoryInfo.toId)} />
                              {isLarge ? transactionHistoryInfo.toId : truncate(transactionHistoryInfo.toId, 13)}
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
            })
        }
      </div>
    </Card>
  );
}
export default WalletTransactionHistory;
