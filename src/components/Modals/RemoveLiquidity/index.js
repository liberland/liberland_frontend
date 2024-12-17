import React, { useEffect, useState } from 'react';
import PropsTypes from 'prop-types';
import { BN, BN_HUNDRED, BN_MILLION } from '@polkadot/util';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import ModalRoot from '../ModalRoot';
import stylesModal from '../styles.module.scss';
import Button from '../../Button/Button';
import MinusIcon from '../../../assets/icons/minus.svg';
import { calculatePooled, getDecimalsForAsset } from '../../../utils/dexFormatter';
import { AssetsPropTypes, ReservedAssetPropTypes } from '../../Wallet/Exchange/proptypes';
import ProgressBar from '../../InputComponents/ProgressBar';
import styles from './styles.module.scss';
import { dexActions } from '../../../redux/actions';
import { blockchainSelectors, dexSelectors } from '../../../redux/selectors';
import { calculateAmountMin, formatAssets } from '../../../utils/walletHelpers';

const listPercent = [25, 50, 75, 100];

function RemoveLiquidityModal({
  closeModal,
  assets,
  reserved,
  lpTokensBalance,
  liquidity,
}) {
  const {
    handleSubmit,
    register,
  } = useForm({
    mode: 'onChange',
  });
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const withdrawalFee = useSelector(dexSelectors.selectorWithdrawalFee);
  const {
    asset1,
    asset2,
    assetData1,
    assetData2,
    asset1ToShow,
    asset2ToShow,
  } = assets;
  const [asset1Amount, setAsset1Amount] = useState(0);
  const [asset2Amount, setAsset2Amount] = useState(0);
  const [percentBurnTokens, setPercentBurnTokens] = useState(0);
  const [tokensToBurnState, setTokensToBurnState] = useState(null);
  const decimals1 = getDecimalsForAsset(asset1, assetData1?.decimals);
  const decimals2 = getDecimalsForAsset(asset2, assetData2?.decimals);

  const calculateAssetToBurn = (numberValue) => {
    const tokensToBurn = new BN(lpTokensBalance).mul(new BN(numberValue)).div(BN_HUNDRED);
    setTokensToBurnState(tokensToBurn);
    const fee = new BN(withdrawalFee);
    const calculatedAmount1 = calculatePooled(tokensToBurn, liquidity, reserved.asset1);
    const calculatedAmount2 = calculatePooled(tokensToBurn, liquidity, reserved.asset2);
    const asset1Data = calculatedAmount1.sub(calculatedAmount1.mul(fee).div(BN_MILLION));
    const asset2Data = calculatedAmount2.sub(calculatedAmount2.mul(fee).div(BN_MILLION));
    return { asset1Data, asset2Data };
  };

  const onSubmit = async () => {
    const amount1MinReceive = calculateAmountMin(asset1Amount);
    const amount2MinReceive = calculateAmountMin(asset2Amount);
    const withdrawTo = userWalletAddress;
    dispatch(dexActions.removeLiquidity.call(
      {
        asset1,
        asset2,
        lpTokenBurn: tokensToBurnState,
        amount1MinReceive,
        amount2MinReceive,
        userWalletAddress,
        withdrawTo,
      },
    ));
    closeModal();
  };

  const handleChangeRange = async (e) => {
    const numberValue = Number(e?.target?.value || e);
    setPercentBurnTokens(numberValue);

    const { asset1Data, asset2Data } = calculateAssetToBurn(numberValue);
    setAsset1Amount(asset1Data);
    setAsset2Amount(asset2Data);
  };

  const isPercentZero = percentBurnTokens === 0;

  useEffect(() => {
    dispatch(dexActions.getWithdrawalFee.call());
  }, [dispatch]);

  return (
    <form
      className={stylesModal.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className={stylesModal.h3}>
        REMOVE LIQUIDITY FOR PAIR
        {' '}
        {asset1ToShow}
        {' - '}
        {asset2ToShow}
      </h3>

      <div className={styles.percentBurnTokens}>
        <div className={styles.percentList}>
          <span className={styles.percentShow}>
            {percentBurnTokens}
            %
          </span>
          <div className={styles.percentButtons}>
            {listPercent.map((item, index) => (
              <Button
                // eslint-disable-next-line react/no-array-index-key
                key={item + index}
                className={styles.buttonStyle}
                onClick={() => handleChangeRange(item)}
                type="button"
                primary
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
        <ProgressBar
          value={percentBurnTokens}
          handleChange={handleChangeRange}
          register={register}
          name="lpTokenBurn"
        />
      </div>

      <div className={styles.pooledAssetsToBurn}>
        <div className={styles.assetToBurn}>
          <span>
            Pooled
          </span>
          <span>
            {formatAssets(
              asset1Amount,
              decimals1,
              { symbol: asset1ToShow, withAll: true },
            )}
          </span>
        </div>
        <div className={styles.assetToBurn}>
          <span>
            Pooled
          </span>
          <span>
            {formatAssets(
              asset2Amount,
              decimals2,
              { symbol: asset2ToShow, withAll: true },
            )}
          </span>
        </div>
      </div>

      <div className={stylesModal.buttonWrapper}>
        <Button medium onClick={closeModal}>
          Cancel
        </Button>
        <Button disabled={isPercentZero} primary medium type="submit">
          {isPercentZero ? 'Enter a percent' : 'Remove Liquidity'}
        </Button>
      </div>
    </form>
  );
}

RemoveLiquidityModal.propTypes = {
  closeModal: PropsTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
  reserved: ReservedAssetPropTypes.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  lpTokensBalance: PropsTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  liquidity: PropsTypes.object.isRequired,
};

function RemoveLiquidityModalWrapper({
  assets,
  reserved,
  lpTokensBalance,
  liquidity,
}) {
  const [show, setShow] = useState();
  return (
    <>
      <Button onClick={() => setShow(true)}>
        Remove Liquidity
        <img src={MinusIcon} className={styles.backIcon} alt="button icon" />
      </Button>
      {show && (
        <ModalRoot>
          <RemoveLiquidityModal
            assets={assets}
            closeModal={() => setShow(false)}
            liquidity={liquidity}
            lpTokensBalance={lpTokensBalance}
            reserved={reserved}
          />
        </ModalRoot>
      )}
    </>
  );
}

RemoveLiquidityModalWrapper.propTypes = {
  assets: AssetsPropTypes.isRequired,
  reserved: ReservedAssetPropTypes.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  lpTokensBalance: PropsTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  liquidity: PropsTypes.object.isRequired,
};

export default RemoveLiquidityModalWrapper;
