import React, { useState, useEffect } from 'react';
import PropsTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import cx from 'classnames';
import Title from 'antd/es/typography/Title';
import InputNumber from 'antd/es/input-number';
import Checkbox from 'antd/es/checkbox';
import { BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import styles from './styles.module.scss';
import Button from '../Button/Button';
import { dexActions, walletActions } from '../../redux/actions';
import { blockchainSelectors, walletSelectors } from '../../redux/selectors';
import PlusIcon from '../../assets/icons/plus-dark.svg';
import {
  convertLiquidityData, convertToEnumDex, getDecimalsForAsset,
} from '../../utils/dexFormatter';
import { AssetsPropTypes } from '../Wallet/Exchange/proptypes';
import { formatAssets, parseAssets, sanitizeValue } from '../../utils/walletHelpers';
import { getSwapPriceExactTokensForTokens, getSwapPriceTokensForExactTokens } from '../../api/nodeRpcCall';

function AddLiquidityModal({
  closeModal, assets, isReservedDataEmpty,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const assetsBalance = useSelector(walletSelectors.selectorAssetsBalance);
  const [loading, setLoading] = useState();
  const [form] = Form.useForm();
  const [asset1Focused, setAsset1Focused] = useState();
  const [asset2Focused, setAsset2Focused] = useState();

  const {
    asset1,
    asset2,
    assetData1,
    assetData2,
    asset1ToShow,
    asset2ToShow,
  } = assets;

  const decimals1 = getDecimalsForAsset(asset1, assetData1?.decimals);
  const decimals2 = getDecimalsForAsset(asset2, assetData2?.decimals);

  const onSubmit = async ({
    amount1Desired, amount2Desired, minAmountPercent,
  }) => {
    setLoading(true);
    try {
      const {
        amount1, amount2, amount1Min, amount2Min,
      } = convertLiquidityData(
        amount1Desired,
        amount2Desired,
        decimals1,
        decimals2,
        minAmountPercent,
      );
      const mintTo = walletAddress;
      dispatch(dexActions.addLiquidity.call({
        amount1Desired: amount1,
        amount1Min,
        amount2Desired: amount2,
        amount2Min,
        asset1,
        asset2,
        walletAddress,
        mintTo,
      }));
      closeModal();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setLoading(false);
    }
  };

  const validate = (v, assetBalance, decimals, asset) => {
    const isAsset1 = asset === asset1;
    if ((v.split('.')[1]?.length || 0) > decimals) {
      return `${isAsset1 ? asset1ToShow : asset2ToShow} don't have this amount of decimals`;
    }
    const inputBN = parseAssets(v, decimals);
    if (Number.isNaN(Number(inputBN))) {
      return 'Not a valid number';
    }

    const assetBN = new BN(assetBalance);
    if (inputBN.gt(assetBN)) {
      return 'Input greater than balance';
    }
    return undefined;
  };
  const { enum1, enum2 } = convertToEnumDex(asset1, asset2);

  const handleChangeInput = React.useCallback(async (value, isAsset1) => {
    if (!value || value === 0
      || (value.split('.')[1]?.length || 0) > (isAsset1 ? decimals1 : decimals2)) {
      return;
    }

    if (isReservedDataEmpty) {
      form.setFieldValue(isAsset1 ? 'amount1Desired' : 'amount2Desired', value);
      return;
    }

    const amount = parseAssets(
      value,
      isAsset1 ? decimals1 : decimals2,
    );
    const getSwapPrice = isAsset1 ? getSwapPriceExactTokensForTokens : getSwapPriceTokensForExactTokens;

    const tradeData = await getSwapPrice(enum1, enum2, amount);

    const decimalsOut = isAsset1 ? decimals2 : decimals1;
    const formatedValue = formatAssets(tradeData, decimalsOut);
    const sanitizedValue = sanitizeValue(formatedValue.toString());
    if (isAsset1) {
      form.setFieldValue('amount2Desired', sanitizedValue);
    } else {
      form.setFieldValue('amount1Desired', sanitizedValue);
    }
    form.validateFields();
  }, [decimals1, decimals2, enum1, enum2, form, isReservedDataEmpty]);

  const amount1Desired = Form.useWatch('amount1Desired', form);
  const amount2Desired = Form.useWatch('amount2Desired', form);
  const details = Form.useWatch('details', form);

  useEffect(() => {
    if (asset1Focused && amount1Desired) {
      handleChangeInput(amount1Desired, true);
    }
  }, [handleChangeInput, amount1Desired, asset1Focused]);

  useEffect(() => {
    if (asset2Focused && amount2Desired) {
      handleChangeInput(amount2Desired, false);
    }
  }, [handleChangeInput, amount2Desired, asset2Focused]);

  useEffect(() => {
    dispatch(walletActions.getAssetsBalance.call([asset1, asset2]));
  }, [dispatch, asset1, asset2]);

  return (
    <Form
      className={styles.getCitizenshipModal}
      onFinish={onSubmit}
      layout="vertical"
      form={form}
    >
      <Title level={3}>
        Add liquidity for pair
        {' '}
        {asset1ToShow}
        {' - '}
        {asset2ToShow}
      </Title>
      <Form.Item
        name="amount1Desired"
        label={`Amount ${asset1ToShow} desired`}
        extra={assetsBalance && assetsBalance.length > 0 && (
          <span>
            Balance
            {' '}
            {assetsBalance[0]
              ? formatAssets(assetsBalance[0], decimals1, { symbol: asset1ToShow, withAll: true }) : 0}
          </span>
        )}
        rules={[
          { required: true },
          {
            validator: (_, v) => {
              if (v) {
                const validated = validate(v, assetsBalance[0], decimals1, asset1);
                if (validated) {
                  return Promise.reject(validated);
                }
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber
          controls={false}
          stringMode
          onFocus={() => setAsset1Focused(true)}
          onBlur={() => setAsset1Focused(false)}
        />
      </Form.Item>
      <Form.Item
        name="amount2Desired"
        label={`Amount ${asset2ToShow} desired`}
        extra={assetsBalance && assetsBalance.length > 0 && (
          <span>
            Balance
            {' '}
            {assetsBalance[1]
              ? formatAssets(assetsBalance[1], decimals2, { symbol: asset2ToShow, withAll: true }) : 0}
          </span>
        )}
        rules={[
          { required: true },
          {
            validator: (_, v) => {
              if (v) {
                const validated = validate(v, assetsBalance[1], decimals2, asset2);
                if (validated) {
                  return Promise.reject(validated);
                }
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber
          controls={false}
          stringMode
          onFocus={() => setAsset2Focused(true)}
          onBlur={() => setAsset2Focused(false)}
        />
      </Form.Item>
      {details && (
        <Form.Item
          label="Max Slippage (in percent %)"
          name="minAmountPercent"
          rules={[
            { required: true },
            { type: 'number' },
          ]}
        >
          <InputNumber controls={false} />
        </Form.Item>
      )}
      <Form.Item
        label="Additional Settings"
        name="details"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Flex gap="15px" wrap>
        <Button medium onClick={closeModal} disabled={loading}>
          Cancel
        </Button>
        <Button primary medium type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Add Liquidity'}
        </Button>
      </Flex>
    </Form>
  );
}

AddLiquidityModal.propTypes = {
  closeModal: PropsTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
  isReservedDataEmpty: PropsTypes.bool.isRequired,
};

function AddLiquidityModalWrapper({
  assets,
  isReservedDataEmpty,
}) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button onClick={() => setShow(true)}>
        Add liquidity
        <img src={PlusIcon} className={cx(styles.backIcon, styles.darken)} alt="button icon" />
      </Button>
      {show && (
        <ModalRoot>
          <AddLiquidityModal
            assets={assets}
            closeModal={() => setShow(false)}
            isReservedDataEmpty={isReservedDataEmpty}
          />
        </ModalRoot>
      )}
    </>
  );
}

AddLiquidityModalWrapper.propTypes = {
  assets: AssetsPropTypes.isRequired,
  isReservedDataEmpty: PropsTypes.bool.isRequired,
};

export default AddLiquidityModalWrapper;
