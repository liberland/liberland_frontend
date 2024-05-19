import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import walletStyles from '../../Wallet/styles.module.scss';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import Button from '../../Button/Button';
import { ReactComponent as GraphIcon } from '../../../assets/icons/graph.svg';
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg';
import stylesPage from '../../../utils/pagesBase.module.scss';
import styles from './styles.module.scss';
import { congressActions, officesActions } from '../../../redux/actions';
import WalletOverview from '../../Wallet/WalletOverview';
import AssetOverview from './AssetOverview';
import { congressSelectors, officesSelectors } from '../../../redux/selectors';
import SpendLLDModal from '../../Modals/SpendLLDModal';
import SpendLLMModal from '../../Modals/SpendLLMModal';
import SpendPolitipoolLLMModal from '../../Modals/SpendPolitipoolLLMModal';

export default function Wallet() {
  const dispatch = useDispatch();

  const balances = useSelector(congressSelectors.balances);
  const pallets = useSelector(officesSelectors.selectorPallets);
  const totalBalance = useSelector(congressSelectors.totalBalance);
  const liquidMerits = useSelector(congressSelectors.liquidMeritsBalance);
  const congresAccountAddress = useSelector(congressSelectors.walletAddress);
  const additionalAssets = useSelector(congressSelectors.additionalAssets);

  const [isModalOpenLLDSpend, setIsModalOpenLLDSpend] = useState(false);
  const [isModalOpenLLMSpend, setIsModalOpenLLMSpend] = useState(false);
  const [isModalOpenPolitipoolLLMSpend, setIsModalOpenPolitipoolLLMSpend] = useState(false);

  useEffect(() => {
    dispatch(officesActions.getPalletIds.call());
  }, [dispatch]);

  useEffect(() => {
    dispatch(congressActions.getWallet.call());
  }, [dispatch, pallets]);

  useEffect(() => {
    dispatch(congressActions.getAdditionalAssets.call());
  }, [dispatch, congresAccountAddress]);

  if (!congresAccountAddress) return null;

  const toggleModalLLDSpendOpen = () => setIsModalOpenLLDSpend(!isModalOpenLLDSpend);
  const toggleModalLLMSpendOpen = () => setIsModalOpenLLMSpend(!isModalOpenLLMSpend);
  const toggleModalPolitipoolLLMSpendOpen = () => setIsModalOpenPolitipoolLLMSpend(!isModalOpenPolitipoolLLMSpend);

  return (
    <div>
      <div
        className={cx(stylesPage.menuAddressWrapper, styles.walletMenuWrapper)}
      >
        <div className={walletStyles.walletAddressLineWrapper}>
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
          <Button small secondary className={walletStyles.button} onClick={toggleModalPolitipoolLLMSpendOpen}>
            <div className={walletStyles.icon}>
              <GraphIcon />
            </div>
            SPEND POLITIPOOLED LLM
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
        </div>
      </div>

      <WalletOverview
        totalBalance={totalBalance}
        balances={balances}
        liquidMerits={liquidMerits}
      />
      <AssetOverview
        additionalAssets={additionalAssets}
      />
      {isModalOpenLLDSpend && <SpendLLDModal closeModal={toggleModalLLDSpendOpen} />}
      {isModalOpenLLMSpend && <SpendLLMModal closeModal={toggleModalLLMSpendOpen} />}
      {isModalOpenPolitipoolLLMSpend && <SpendPolitipoolLLMModal closeModal={toggleModalPolitipoolLLMSpendOpen} />}
    </div>
  );
}
