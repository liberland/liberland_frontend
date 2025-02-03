import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import InputNumber from 'antd/es/input-number';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { BN } from '@polkadot/util';
import styles from './styles.module.scss';
import Button from '../Button/Button';
import { dexActions, walletActions } from '../../redux/actions';
import { dexSelectors, walletSelectors, blockchainSelectors } from '../../redux/selectors';
import {
  convertTransferData,
  convertToEnumDex,
  getDecimalsForAsset,
} from '../../utils/dexFormatter';
import { AssetsPropTypes } from '../Wallet/Exchange/proptypes';
import { getSwapPriceExactTokensForTokens, getSwapPriceTokensForExactTokens } from '../../api/nodeRpcCall';
import { formatAssets, parseAssets, sanitizeValue } from '../../utils/walletHelpers';
import { useStockContext } from '../Wallet/StockContext';
import CurrencyIcon from '../CurrencyIcon';
import OpenModalButton from './components/OpenModalButton';
import modalWrapper from './components/ModalWrapper';

function TradeTokensForm({
  onClose, assets, isBuy,
}) {
  const dispatch = useDispatch();
  const walletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const assetsBalance = useSelector(walletSelectors.selectorAssetsBalance);
  const reserves = useSelector(dexSelectors.selectorReserves);
  const [isAsset1State, setIsAsset1State] = useState(false);
  const [formatedValue, setFormatedValue] = useState({});

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

  const reservesThisAssets = useMemo(() => {
    if (reserves && asset1 && asset2 && reserves?.[asset1]?.[asset2]) {
      const asset1Value = reserves[asset1][asset2].asset1;
      const asset2Value = reserves[asset1][asset2].asset2;
      return { ...reserves[asset1][asset2], asset1: asset1Value, asset2: asset2Value };
    }
    return null;
  }, [asset1, asset2, reserves]);

  const [loading, setLoading] = useState();
  const [amount1Focused, setAmount1Focused] = useState();
  const [amount2Focused, setAmount2Focused] = useState();
  const [form] = Form.useForm();
  const details = Form.useWatch('details', form);
  const { isStock } = useStockContext();

  const onSubmit = async ({
    amount1In, amountIn2, minAmountPercent,
  }) => {
    setLoading(true);
    try {
      const { amount, amountMin } = await convertTransferData(
        asset1,
        decimals1,
        asset2,
        decimals2,
        amount1In,
        amountIn2,
        isBuy,
        minAmountPercent || '0',
        isAsset1State,
      );

      const path = isBuy ? [asset2, asset1] : [asset1, asset2];

      const swapData = {
        path,
        amount,
        amountMin,
        sendTo: walletAddress,
        dexReservePair: { asset1, asset2 },
      };

      if (!isBuy) {
        dispatch(isAsset1State
          ? dexActions.swapExactTokensForTokens.call(swapData)
          : dexActions.swapTokensForExactTokens.call(swapData));
      } else {
        dispatch(isAsset1State
          ? dexActions.swapExactTokensForTokens.call(swapData)
          : dexActions.swapTokensForExactTokens.call(swapData));
      }

      onClose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setLoading(false);
    }
  };

  const handleInputChange = async (term, asset) => {
    try {
      setFormatedValue({});
      const isAsset1 = asset1 === asset;
      if (!term || term === 0
        || (term.split('.')[1]?.length || 0) > (isAsset1 ? decimals2 : decimals1)) {
        return;
      }
      const { enum1, enum2 } = convertToEnumDex(asset1, asset2);
      setIsAsset1State(isAsset1);
      let tradeData = null;
      let amount = null;
      let decimalsOut = null;
      let showReserve = null;
      let reserve = null;

      if (!isBuy) {
        amount = parseAssets(term, isAsset1 ? decimals1 : decimals2);
        const getSwapPrice = isAsset1 ? getSwapPriceExactTokensForTokens : getSwapPriceTokensForExactTokens;
        tradeData = await getSwapPrice(enum1, enum2, amount);
        decimalsOut = isAsset1 ? decimals2 : decimals1;
        showReserve = formatAssets(
          reservesThisAssets[isAsset1 ? 'asset2' : 'asset1'],
          decimalsOut,
          { symbol: isAsset1 ? asset2ToShow : asset1ToShow, withAll: true },
        );
        reserve = reservesThisAssets[isAsset1 ? 'asset2' : 'asset1'];
      } else {
        amount = parseAssets(term, isAsset1 ? decimals2 : decimals1);
        const getSwapPrice = isAsset1 ? getSwapPriceTokensForExactTokens : getSwapPriceExactTokensForTokens;
        tradeData = await getSwapPrice(enum1, enum2, amount);
        decimalsOut = isAsset1 ? decimals1 : decimals2;
        showReserve = formatAssets(
          reservesThisAssets[isBuy ? 'asset1' : 'asset2'],
          decimalsOut,
          { symbol: isAsset1 ? asset1ToShow : asset2ToShow, withAll: true },
        );
        reserve = reservesThisAssets[isBuy ? 'asset1' : 'asset2'];
      }

      const formatedValueData = tradeData ? formatAssets(
        tradeData,
        decimalsOut,
      ) : '';
      const sanitizedValue = sanitizeValue(formatedValueData);
      if (isAsset1) {
        form.setFieldValue('amountIn2', sanitizedValue);
      } else {
        form.setFieldValue('amountIn1', sanitizedValue);
      }

      form.validateFields();

      if (!tradeData) {
        const msg = `No trade data from api for ${asset}`;
        form.setFields([{
          name: !isAsset1 ? 'amountIn1' : 'amountIn2',
          errors: [msg],
        }]);
        setFormatedValue({ [asset]: { value: tradeData, msg } });
      }

      const priceBN = new BN(tradeData);

      if (priceBN.gte(new BN(reserve.toString()))) {
        const msg = `Input value exceeds reserves max ${showReserve}`;
        form.setFields([{
          name: !isAsset1 ? 'amountIn1' : 'amountIn2',
          errors: [msg],
        }]);
        setFormatedValue({ [asset]: { value: tradeData, msg } });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching API data:', err);
    }
  };

  const validate = (v, assetBalance, decimals, asset) => {
    if (!v) {
      return 'Required';
    }
    if (Number.isNaN(Number(v))) {
      return 'Not a valid number';
    }
    const isAsset1 = asset1 !== asset;

    if ((v.split('.')[1]?.length || 0) > decimals) {
      return `${isAsset1 ? asset2ToShow : asset1ToShow} don't have this amount of decimals`;
    }
    const tradeValue = formatedValue[asset];
    if (tradeValue) {
      const { msg, value: valueData } = tradeValue;
      const priceBN = new BN(valueData);
      const reserve = reservesThisAssets[isBuy ? 'asset1' : 'asset2'];

      if (priceBN.gte(new BN(reserve.toString()))) {
        return msg;
      }
    }

    if (isBuy ? asset !== asset1 : asset === asset1) {
      const inputBN = parseAssets(v, decimals);
      const assetBN = new BN(assetBalance.toString());
      if (inputBN.gt(assetBN)) {
        return 'Input greater than balance';
      }
    }
    return undefined;
  };

  const amount1In = Form.useWatch('amount1In', form);
  const amount2In = Form.useWatch('amount2In', form);

  useEffect(() => {
    if (amount1In && amount1Focused) {
      handleInputChange(amount1In, asset1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount1In]);

  useEffect(() => {
    if (amount2In && amount2Focused) {
      handleInputChange(amount2In, asset2);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount2In]);

  useEffect(() => {
    dispatch(dexActions.getDexReserves.call({ asset1, asset2 }));
  }, [dispatch, asset1, asset2]);

  useEffect(() => {
    dispatch(walletActions.getAssetsBalance.call([asset1, asset2]));
  }, [dispatch, asset1, asset2]);

  const submitText = isStock ? 'Trade stock' : 'Exchange tokens';

  const symbolHelper = (symbol, size) => (
    <Flex wrap gap="5px" align="center">
      {symbol}
      <CurrencyIcon size={size} symbol={symbol} />
    </Flex>
  );

  return (
    <Form
      className={styles.getCitizenshipModal}
      onFinish={onSubmit}
      form={form}
      layout="vertical"
    >
      <Title level={3}>
        <Flex wrap gap="10px">
          <span>
            {isBuy ? 'Buy' : 'Sell'}
          </span>
          {symbolHelper(asset1ToShow, 32)}
          <span>
            for
          </span>
          {symbolHelper(asset2ToShow, 32)}
        </Flex>
      </Title>
      <Form.Item
        name="amount1In"
        label={(
          <Flex wrap gap="10px">
            <div>
              Amount In
            </div>
            {isBuy ? symbolHelper(asset2ToShow, 20) : symbolHelper(asset1ToShow, 20)}
          </Flex>
        )}
        extra={(
          <>
            Balance
            {' '}
            {(assetsBalance && assetsBalance.length > 0)
              ? formatAssets(
                isBuy ? assetsBalance[1] : assetsBalance[0],
                isBuy ? decimals2 : decimals1,
                { symbol: isBuy ? asset2ToShow : asset1ToShow, withAll: true },
              ) : 0}
          </>
        )}
        rules={[
          { required: true },
          {
            validator: (_, v) => {
              if (v) {
                const validated = isBuy
                  ? validate(v, assetsBalance[1], decimals2, asset2)
                  : validate(v, assetsBalance[0], decimals1, asset1);
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
          stringMode
          controls={false}
          onFocus={() => setAmount1Focused(true)}
          onBlur={() => setAmount1Focused(false)}
        />
      </Form.Item>
      <Form.Item
        name="amountIn2"
        label={(
          <Flex wrap gap="10px">
            <div>
              Amount Out
            </div>
            {isBuy ? symbolHelper(asset1ToShow, 20) : symbolHelper(asset2ToShow, 20)}
          </Flex>
        )}
        extra={(
          <>
            Balance
            {' '}
            {assetsBalance && assetsBalance.length > 0 ? formatAssets(
              isBuy ? assetsBalance[0] : assetsBalance[1],
              isBuy ? decimals1 : decimals2,
              { symbol: isBuy ? asset1ToShow : asset2ToShow, withAll: true },
            ) : 0}
          </>
        )}
        rules={[
          { required: true },
          {
            validator: (_, v) => {
              if (v) {
                const validated = !isBuy
                  ? validate(v, assetsBalance[1], decimals2, asset2)
                  : validate(v, assetsBalance[0], decimals1, asset1);
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
          stringMode
          controls={false}
          onFocus={() => setAmount2Focused(true)}
          onBlur={() => setAmount2Focused(false)}
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
        <Button medium onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button primary medium type="submit" disabled={loading}>
          {loading ? 'Loading...' : submitText}
        </Button>
      </Flex>
    </Form>
  );
}

TradeTokensForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  assets: AssetsPropTypes.isRequired,
  isBuy: PropTypes.bool,
};

function ButtonModal(props) {
  const { isBuy, asset1ToShow, asset2ToShow } = props;
  const text = `${isBuy ? 'Buy' : 'Sell'} ${asset1ToShow} for ${asset2ToShow}`;
  return (
    <OpenModalButton text={text} primary {...props} />
  );
}

ButtonModal.propTypes = {
  isBuy: PropTypes.bool,
  asset1ToShow: PropTypes.string.isRequired,
  asset2ToShow: PropTypes.string.isRequired,
};

const TradeTokensModal = modalWrapper(TradeTokensForm, ButtonModal);

export default TradeTokensModal;
