/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */ // remove after refactoring history back in
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { BN, BN_ZERO } from '@polkadot/util';
import { useMediaQuery } from 'usehooks-ts';
import cx from 'classnames';
import Card from '../../Card';
import formatDate from '../../../utils/formatDate';
import paymentIcon from '../../../assets/icons/RedArrowCicrle.svg';
import reciveIcon from '../../../assets/icons/GreenArrowCircle.svg';

import styles from './styles.module.scss';
import stylesPage from '../../../utils/pagesBase.module.scss';
import Status from '../../Status';
import { formatMeritTransaction, formatDollarTransaction, formatAssetTransaction } from '../../../utils/walletHelpers';

import { blockchainSelectors } from '../../../redux/selectors';
import truncate from '../../../utils/truncate';
import { ReactComponent as CopyIcon } from '../../../assets/icons/copy.svg';
import NotificationPortal from '../../NotificationPortal';

function WalletTransactionHistory({ failure, transactionHistory }) {
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector).toString();
  const notificationRef = useRef();
  const isLarge = useMediaQuery('(min-width: 62em)');
  const isTabletHigher = useMediaQuery('(min-width: 1025px)');
  const isBigScreen = useMediaQuery('(min-width: 1520px)');

  const handleCopyClick = (address) => {
    navigator.clipboard.writeText(address);
    notificationRef.current.addSuccess({ text: 'Address was copied' });
  };

  return (
    <Card title="Transaction History" className={styles.cardWrapper}>
      <NotificationPortal ref={notificationRef} />
      <div className={stylesPage.transactionHistoryCard}>
        <div className={cx(stylesPage.transactionHistoryCardHeaderMobile, stylesPage.transactionHistoryCardHeader)}>
          <span>ADDRESS / TIME</span>
          <span>AMOUNT / STATUS</span>
        </div>
        <div className={cx(
          stylesPage.transactionHistoryCardHeaderDesktop,
          stylesPage.transactionHistoryCardHeader,
          styles.gridList,
        )}
        >
          <span>TYPE</span>
          <span>PAYMENT NUMBER</span>
          <span>DATE & TIME</span>
          <span>AMOUNT</span>
          <span>STATUS</span>
        </div>
        {
          failure ? 'Failed to fetch transaction history'
            : transactionHistory.map((transactionHistoryInfo) => {
              const value = transactionHistoryInfo.fromId === walletAddress
                ? `-${transactionHistoryInfo.value}`
                : transactionHistoryInfo.value;
              const isStakingTransaction = 'userId' in transactionHistoryInfo;
              const isAmountPositive = isStakingTransaction ? transactionHistoryInfo?.isPositive
                : new BN(value).gt(BN_ZERO);
              const imgAlt = isAmountPositive ? 'reviceIcon' : 'paymentIcon';
              const dateTransacionHistory = formatDate(new Date(transactionHistoryInfo.block.timestamp), true);

              const fromToId = isAmountPositive ? transactionHistoryInfo.fromId : transactionHistoryInfo.toId;
              const userId = isStakingTransaction ? transactionHistoryInfo.userId : fromToId;

              const typeTextFromToId = isAmountPositive ? 'from' : 'to';
              const typeText = isStakingTransaction ? transactionHistoryInfo.stakingActionText : typeTextFromToId;
              const iconType = isAmountPositive ? reciveIcon : paymentIcon;
              const configFormat = {
                isSymbolFirst: true,
              };
              const assetLldLLm = transactionHistoryInfo.asset === 'LLM'
                ? formatMeritTransaction(value, configFormat)
                : formatDollarTransaction(value, configFormat);
              const asset = (transactionHistoryInfo.asset === 'LLM'
            || transactionHistoryInfo.asset === 'LLD') ? assetLldLLm
                : formatAssetTransaction(
                  value,
                  transactionHistoryInfo.asset,
                  transactionHistoryInfo.decimals,
                  {
                    isSymbolFirst: true,
                    isAsset: true,
                  },
                );
              return (
                <div
                  className={
                  cx(stylesPage.transactionHistoryCardMain, styles.transactionHistoryCardMain, styles.gridList)
                }
                  key={transactionHistoryInfo.id}
                >
                  {isTabletHigher
                    ? (
                      <TransacionHistoryDesktop
                        handleCopyClick={handleCopyClick}
                        value={asset}
                        isBigScreen={isBigScreen}
                        dateTransacionHistory={dateTransacionHistory}
                        userId={userId}
                        imgAlt={imgAlt}
                        typeText={typeText}
                        iconType={iconType}
                      />
                    )
                    : (
                      <TransacionHistoryMobile
                        handleCopyClick={handleCopyClick}
                        value={asset}
                        isLarge={isLarge}
                        dateTransacionHistory={dateTransacionHistory}
                        userId={userId}
                        imgAlt={imgAlt}
                        typeText={typeText}
                        iconType={iconType}
                      />
                    )}
                </div>
              );
            })
        }
      </div>
    </Card>
  );
}

function TransacionHistoryDesktop({
  iconType,
  imgAlt,
  typeText,
  userId,
  handleCopyClick,
  isBigScreen,
  dateTransacionHistory,
  value,
}) {
  return (
    <>
      <div className={styles.paymentNumber}>
        <div className={styles.paymentNumberIcon}>
          <img src={iconType} alt={imgAlt} />
          <span className={styles.desktopTekst}>
            {typeText}
          </span>
        </div>
      </div>
      <p className={styles.bold}>
        <span className={styles.icon}>
          <CopyIcon
            className={styles.copyIcon}
            name="walletAddress"
            onClick={() => handleCopyClick(userId)}
          />
          {isBigScreen ? userId : truncate(userId, 13)}
        </span>
      </p>
      <p className={styles.paymentFromDate}>{dateTransacionHistory}</p>
      <span className={styles.bold}>
        {value}
      </span>
      <div className={styles.status}>
        <Status
          status="success"
          completed
          declined={false}
        />
      </div>

    </>
  );
}

function TransacionHistoryMobile({
  typeText,
  handleCopyClick,
  value,
  isLarge,
  dateTransacionHistory,
  userId,
  imgAlt,
  iconType,
}) {
  return (
    <>
      <div className={styles.paymentNumber}>
        <div className={styles.paymentNumberIcon}>
          <img src={iconType} alt={imgAlt} />
        </div>
        <div className={styles.paymentFrom}>
          <p>
            {typeText}
            {' '}
            <span>
              <CopyIcon
                className={styles.copyIcon}
                name="walletAddress"
                onClick={() => handleCopyClick(userId)}
              />
              {isLarge ? userId : truncate(userId, 13)}
            </span>
          </p>

          <p className={styles.paymentFromDate}>{dateTransacionHistory}</p>
        </div>
      </div>
      <div className={styles.transactionHistoryAmount}>
        <span>
          {value}
        </span>
        <Status
          status="success"
          completed
          declined={false}
        />
      </div>
    </>

  );
}

export default WalletTransactionHistory;
