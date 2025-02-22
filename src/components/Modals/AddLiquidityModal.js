import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import InputNumber from 'antd/es/input-number';
import Collapse from 'antd/es/collapse';
import { BN } from '@polkadot/util';
import styles from './styles.module.scss';
import Button from '../Button/Button';
import { dexActions, walletActions } from '../../redux/actions';
import { blockchainSelectors, walletSelectors } from '../../redux/selectors';
import {
  convertLiquidityData,
  convertToEnumDex,
  getDecimalsForAsset,
} from '../../utils/dexFormatter';
import { AssetsPropTypes } from '../Wallet/Exchange/proptypes';
import {
  formatAssets,
  parseAssets,
  sanitizeValue,
} from '../../utils/walletHelpers';
import {
  getSwapPriceExactTokensForTokens,
  getSwapPriceTokensForExactTokens,
} from '../../api/nodeRpcCall';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function AddLiquidityForm({ onClose, assets, isReservedDataEmpty }) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const assetsBalance = useSelector(walletSelectors.selectorAssetsBalance);
  const [form] = Form.useForm();
  const [asset1Focused, setAsset1Focused] = useState();
  const [asset2Focused, setAsset2Focused] = useState();

  const {
    asset1, asset2, assetData1, assetData2, asset1ToShow, asset2ToShow,
  } = assets;

  const decimals1 = getDecimalsForAsset(asset1, assetData1?.decimals);
  const decimals2 = getDecimalsForAsset(asset2, assetData2?.decimals);

  const onSubmit = async ({
    amount1Desired,
    amount2Desired,
    minAmountPercent,
  }) => {
    try {
      const {
        amount1, amount2, amount1Min, amount2Min,
      } = convertLiquidityData(
        amount1Desired,
        amount2Desired,
        decimals1,
        decimals2,
        minAmountPercent || '',
      );
      const mintTo = walletAddress;
      dispatch(
        dexActions.addLiquidity.call({
          amount1Desired: amount1,
          amount1Min,
          amount2Desired: amount2,
          amount2Min,
          asset1,
          asset2,
          walletAddress,
          mintTo,
        }),
      );
      onClose();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const validate = (v, assetBalance, decimals, asset) => {
    const isAsset1 = asset === asset1;
    if ((v.split('.')[1]?.length || 0) > decimals) {
      return `${
        isAsset1 ? asset1ToShow : asset2ToShow
      } don't have this amount of decimals`;
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

  const handleChangeInput = React.useCallback(
    async (value, isAsset1) => {
      if (
        !value
        || value === 0
        || (value.split('.')[1]?.length || 0) > (isAsset1 ? decimals1 : decimals2)
      ) {
        return;
      }

      if (isReservedDataEmpty) {
        form.setFieldValue(
          isAsset1 ? 'amount1Desired' : 'amount2Desired',
          value,
        );
        return;
      }

      const amount = parseAssets(value, isAsset1 ? decimals1 : decimals2);
      const getSwapPrice = isAsset1
        ? getSwapPriceExactTokensForTokens
        : getSwapPriceTokensForExactTokens;

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
    },
    [decimals1, decimals2, enum1, enum2, form, isReservedDataEmpty],
  );

  const amount1Desired = Form.useWatch('amount1Desired', form);
  const amount2Desired = Form.useWatch('amount2Desired', form);

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
      initialValues={{
        minAmountPercent: 10,
      }}
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
        extra={
          assetsBalance?.[asset1] && (
            <span>
              Balance
              {' '}
              {assetsBalance?.[asset1]
                ? formatAssets(assetsBalance[asset1], decimals1, {
                  symbol: asset1ToShow,
                  withAll: true,
                })
                : 0}
            </span>
          )
        }
        rules={[
          { required: true },
          {
            validator: (_, v) => {
              if (v) {
                const validated = validate(
                  v,
                  assetsBalance[asset1],
                  decimals1,
                  asset1,
                );
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
        extra={
          assetsBalance?.[asset2] && (
            <span>
              Balance
              {' '}
              {assetsBalance[asset2]
                ? formatAssets(assetsBalance[asset2], decimals2, {
                  symbol: asset2ToShow,
                  withAll: true,
                })
                : 0}
            </span>
          )
        }
        rules={[
          { required: true },
          {
            validator: (_, v) => {
              if (v) {
                const validated = validate(
                  v,
                  assetsBalance[asset2],
                  decimals2,
                  asset2,
                );
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
      <Flex vertical gap="20px">
        <Collapse
          items={[{
            label: 'Additional settings',
            key: 'settings',
            children: (
              <Form.Item
                label="Max Slippage (in percent %)"
                name="minAmountPercent"
                rules={[{ required: true }, { type: 'number', min: 0, max: 100 }]}
              >
                <InputNumber controls={false} />
              </Form.Item>
            ),
          }]}
        />
        <Flex gap="15px" wrap>
          <Button medium onClick={onClose}>
            Cancel
          </Button>
          <Button primary medium type="submit">
            Add Liquidity
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
}

AddLiquidityForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
  isReservedDataEmpty: PropTypes.bool.isRequired,
};

function ButtonModal(props) {
  return (
    <OpenModalButton text="Add liquidity" {...props} />
  );
}

ButtonModal.propTypes = {
  isMint: PropTypes.bool.isRequired,
};

const AddLiquidityModal = modalWrapper(AddLiquidityForm, ButtonModal);

export default AddLiquidityModal;
