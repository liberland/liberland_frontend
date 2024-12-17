import React, { useState } from 'react';
import cx from 'classnames';
import { BN } from '@polkadot/util';
import PropTypes from 'prop-types';
import walletStyles from '../../Wallet/styles.module.scss';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import Button from '../../Button/Button';
import { ReactComponent as GraphIcon } from '../../../assets/icons/graph.svg';
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg';
import stylesPage from '../../../utils/pagesBase.module.scss';
import styles from './styles.module.scss';
import AssetOverview from '../../Wallet/AssetOverview';
import SpendModalWrapper from '../../Modals/SpendModal';
import { valueToBN } from '../../../utils/walletHelpers';
import BalanceOverview from '../../Wallet/BalanceOverview';

export default function WalletCongresSenateWrapper({
  totalBalance,
  congresAccountAddress,
  liquidMerits,
  additionalAssets,
  onSendFunctions,
  balances,
  officeType,
  userIsMember,
}) {
  const { LLD, LLM, LLMPolitipool } = onSendFunctions;
  const balanceLLD = new BN(balances?.liquidAmount?.amount ?? 0);
  const balanceLLM = valueToBN(balances?.liquidMerits?.amount ?? 0);

  const [isModalOpenLLDSpend, setIsModalOpenLLDSpend] = useState(false);
  const [isModalOpenLLMSpend, setIsModalOpenLLMSpend] = useState(false);
  const [isModalOpenPolitipoolLLMSpend, setIsModalOpenPolitipoolLLMSpend] = useState(false);

  if (!congresAccountAddress) return null;

  const toggleModalLLDSpendOpen = () => setIsModalOpenLLDSpend(!isModalOpenLLDSpend);
  const toggleModalLLMSpendOpen = () => setIsModalOpenLLMSpend(!isModalOpenLLMSpend);
  const toggleModalPolitipoolLLMSpendOpen = () => setIsModalOpenPolitipoolLLMSpend(!isModalOpenPolitipoolLLMSpend);

  return (
    <>
      <div
        className={cx(stylesPage.menuAddressWrapper, styles.walletMenuWrapper)}
      >
        <div className={cx(walletStyles.walletAddressLineWrapper, styles.walletAddressWrapper)}>
          <div className={walletStyles.navWallet}>
            <div className={walletStyles.addressesWrapper}>
              <div className={walletStyles.singleAddressWrapper}>
                <span className={walletStyles.addressTitle}>
                  Wallet address
                  {' '}
                </span>
                <span className={walletStyles.address}>
                  <CopyIconWithAddress address={congresAccountAddress} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cx(
            walletStyles.buttonsWrapper,
            styles.walletButtonsWrapper,
          )}
        >
          {userIsMember && (
          <>
            <Button small primary className={walletStyles.button} onClick={toggleModalPolitipoolLLMSpendOpen}>
              <div className={walletStyles.icon}>
                <GraphIcon />
              </div>
              SPEND LLM (POLITIPOOL)
            </Button>
            <Button small primary className={walletStyles.button} onClick={toggleModalLLMSpendOpen}>
              <div className={walletStyles.icon}>
                <UploadIcon />
              </div>
              SPEND LLM
            </Button>
            <Button small primary className={walletStyles.button} onClick={toggleModalLLDSpendOpen}>
              <div className={walletStyles.icon}>
                <UploadIcon />
              </div>
              SPEND LLD
            </Button>
          </>
          )}
        </div>
      </div>

      <BalanceOverview
        totalBalance={totalBalance}
        balances={balances}
        liquidMerits={liquidMerits}
        showStaked={false}
      />
      <AssetOverview
        additionalAssets={additionalAssets}
        isRemarkNeeded
        officeType={officeType}
        userIsMember={userIsMember}
      />
      {isModalOpenLLDSpend && (
      <SpendModalWrapper
        officeType={officeType}
        closeModal={toggleModalLLDSpendOpen}
        onSend={LLD}
        spendData={{
          name: 'LLD',
        }}
        balance={balanceLLD}
      />
      )}
      {isModalOpenLLMSpend
      && (
      <SpendModalWrapper
        officeType={officeType}
        closeModal={toggleModalLLMSpendOpen}
        onSend={LLM}
        spendData={{
          name: 'LLM',
        }}
        balance={balanceLLM}
      />
      )}
      {isModalOpenPolitipoolLLMSpend && (
      <SpendModalWrapper
        officeType={officeType}
        closeModal={toggleModalPolitipoolLLMSpendOpen}
        spendData={{
          name: 'LLM to politipool',
          title: 'Spend LLM to politipool',
          description: 'You are going to create LLM spend proposal that will transfer LLM to recipients politipool',
          subtitle: "Spend LLM to address's politipool",
        }}
        onSend={LLMPolitipool}
        balance={balanceLLM}
      />
      )}
    </>
  );
}

WalletCongresSenateWrapper.propTypes = {
  officeType: PropTypes.string.isRequired,
  totalBalance: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]).isRequired,
  congresAccountAddress: PropTypes.string.isRequired,
  liquidMerits: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  additionalAssets: PropTypes.array.isRequired,
  onSendFunctions: PropTypes.shape({
    LLD: PropTypes.func.isRequired,
    LLM: PropTypes.func.isRequired,
    LLMPolitipool: PropTypes.func.isRequired,
  }).isRequired,
  balances: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    liquidAmount: PropTypes.shape({ amount: PropTypes.object.isRequired }),
    liquidMerits: PropTypes.shape({ amount: PropTypes.string.isRequired }),
  }).isRequired,
  userIsMember: PropTypes.bool.isRequired,
};
