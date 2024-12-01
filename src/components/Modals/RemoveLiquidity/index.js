import React, { useEffect, useState } from 'react';
import PropsTypes from 'prop-types';
import Slider from 'antd/es/slider';
import { BN, BN_HUNDRED, BN_MILLION } from '@polkadot/util';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import useNotification from 'antd/es/notification/useNotification';
import ModalRoot from '../ModalRoot';
import stylesModal from '../styles.module.scss';
import Button from '../../Button/Button';
import MinusIcon from '../../../assets/icons/minus.svg';
import { calculatePooled, getDecimalsForAsset } from '../../../utils/dexFormatter';
import { AssetsPropTypes, ReservedAssetPropTypes } from '../../Wallet/Exchange/proptypes';
import styles from './styles.module.scss';
import { dexActions } from '../../../redux/actions';
import { blockchainSelectors, dexSelectors } from '../../../redux/selectors';
import { calculateAmountMin, formatAssets } from '../../../utils/walletHelpers';

function RemoveLiquidityModal({
  closeModal,
  assets,
  reserved,
  lpTokensBalance,
  liquidity,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
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

  const calculateAssetToBurn = React.useCallback((numberValue) => {
    const tokensToBurn = new BN(lpTokensBalance).mul(new BN(numberValue)).div(BN_HUNDRED);
    setTokensToBurnState(tokensToBurn);
    const fee = new BN(withdrawalFee);
    const calculatedAmount1 = calculatePooled(tokensToBurn, liquidity, reserved.asset1);
    const calculatedAmount2 = calculatePooled(tokensToBurn, liquidity, reserved.asset2);
    const asset1Data = calculatedAmount1.sub(calculatedAmount1.mul(fee).div(BN_MILLION));
    const asset2Data = calculatedAmount2.sub(calculatedAmount2.mul(fee).div(BN_MILLION));
    return { asset1Data, asset2Data };
  }, [liquidity, lpTokensBalance, reserved.asset1, reserved.asset2, withdrawalFee]);
  const [api, handle] = useNotification();

  const onSubmit = async () => {
    setLoading(true);
    try {
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
      api.success({
        message: 'Liquidity removed!',
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      form.setFields([
        {
          name: 'lpTokenBurn',
          errors: ['Something went wrong'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const lpTokenBurn = Form.useWatch('lpTokenBurn', form);

  const isPercentZero = percentBurnTokens === 0;

  useEffect(() => {
    dispatch(dexActions.getWithdrawalFee.call());
  }, [dispatch]);

  useEffect(() => {
    if (lpTokenBurn) {
      setPercentBurnTokens(lpTokenBurn);
      const { asset1Data, asset2Data } = calculateAssetToBurn(lpTokenBurn);
      setAsset1Amount(asset1Data);
      setAsset2Amount(asset2Data);
    }
  }, [calculateAssetToBurn, lpTokenBurn]);

  return (
    <Form
      className={stylesModal.getCitizenshipModal}
      onFinish={onSubmit}
      form={form}
      layout="vertical"
    >
      {handle}
      <Form.Item
        name="lpTokenBurn"
        label="Remove liquidity for pair"
        initialValue={0}
        rules={[
          { required: true, message: 'Enter a value' },
          { type: 'number' },
        ]}
      >
        <Slider
          min={1}
          max={100}
          marks={{
            25: '25%',
            50: '50%',
            75: '75%',
            100: '100%',
          }}
        />
      </Form.Item>

      <div className={styles.pooledAssetsToBurn}>
        <div className={styles.assetToBurn}>
          <span>
            Pooled
            {' '}
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
            {' '}
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

      <Flex gap="15px" wrap>
        <Button onClick={closeModal} disabled={loading}>
          Cancel
        </Button>
        <Button disabled={isPercentZero || loading} primary type="submit">
          {isPercentZero && 'Enter a percentage'}
          {loading && 'Loading...'}
          {!loading && !isPercentZero && 'Remove liquidity'}
        </Button>
      </Flex>
    </Form>
  );
}

RemoveLiquidityModal.propTypes = {
  closeModal: PropsTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
  reserved: ReservedAssetPropTypes,
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
  const [show, setShow] = React.useState();
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
  reserved: ReservedAssetPropTypes,
  // eslint-disable-next-line react/forbid-prop-types
  lpTokensBalance: PropsTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  liquidity: PropsTypes.object.isRequired,
};

export default RemoveLiquidityModalWrapper;
